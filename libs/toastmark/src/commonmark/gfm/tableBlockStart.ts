import { isEmpty } from '../common';
import { BlockStart, Matched } from '../blockStarts';
import { createNode, SourcePos, TableNode, TableColumn, TableCellNode } from '../node';
import { last } from '../../helper';

function parseRowContent(content: string): [number, string[]] {
  let startIdx = 0;
  let offset = 0;
  const cells = [];
  for (let i = 0; i < content.length; i += 1) {
    if (content[i] === '|' && content[i - 1] !== '\\') {
      const cell = content.substring(startIdx, i);
      if (startIdx === 0 && isEmpty(cell)) {
        offset = i + 1;
      } else {
        cells.push(cell);
      }
      startIdx = i + 1;
    }
  }

  if (startIdx < content.length) {
    const cell = content.substring(startIdx, content.length);
    if (!isEmpty(cell)) {
      cells.push(cell);
    }
  }

  return [offset, cells];
}

function generateTableCells(
  cellType: 'tableCell' | 'tableDelimCell',
  contents: string[],
  lineNum: number,
  chPos: number
) {
  const cells = [];
  for (const content of contents) {
    const preSpaces = content.match(/^[ \t]+/);
    let paddingLeft = preSpaces ? preSpaces[0].length : 0;
    let paddingRight, trimmed;

    if (paddingLeft === content.length) {
      paddingLeft = 0;
      paddingRight = 0;
      trimmed = '';
    } else {
      const postSpaces = content.match(/[ \t]+$/);
      paddingRight = postSpaces ? postSpaces[0].length : 0;
      trimmed = content.slice(paddingLeft, content.length - paddingRight);
    }

    const chPosStart = chPos + paddingLeft;
    const tableCell = createNode(cellType, [
      [lineNum, chPos],
      [lineNum, chPos + content.length - 1]
    ]) as TableCellNode;

    tableCell.stringContent = trimmed.replace(/\\\|/g, '|'); // replace esacped pipe(\|)
    tableCell.startIdx = cells.length;
    tableCell.endIdx = cells.length;
    tableCell.lineOffsets = [chPosStart - 1];
    tableCell.paddingLeft = paddingLeft;
    tableCell.paddingRight = paddingRight;
    cells.push(tableCell);

    chPos += content.length + 1;
  }

  return cells;
}

function getColumnFromDelimCell(cellNode: TableCellNode) {
  let align = 'left';
  const content = cellNode.stringContent!;
  const firstCh = content[0];
  const lastCh = content[content.length - 1];

  if (lastCh === ':') {
    align = firstCh === ':' ? 'center' : 'right';
  }

  return { align } as TableColumn;
}

export const tableHead: BlockStart = (parser, container) => {
  const stringContent = container.stringContent!;
  if (container.type === 'paragraph' && !parser.indented && !parser.blank) {
    const lastNewLineIdx = stringContent.length - 1;
    const lastLineStartIdx = stringContent.lastIndexOf('\n', lastNewLineIdx - 1) + 1;
    const headerContent = stringContent.slice(lastLineStartIdx, lastNewLineIdx);
    const delimContent = parser.currentLine.slice(parser.nextNonspace);
    const [headerOffset, headerCells] = parseRowContent(headerContent);
    const [delimOffset, delimCells] = parseRowContent(delimContent);
    const reValidDelimCell = /^[ \t]*:?-+:?[ \t]*$/;

    if (
      // not checking if the number of header cells and delimiter cells are the same
      // to consider the case of merged-column (via plugin)
      !headerCells.length ||
      !delimCells.length ||
      delimCells.some(cell => !reValidDelimCell.test(cell)) ||
      // to prevent to regard setTextHeading as tabel delim cell with 'disallowDeepHeading' option
      (delimCells.length === 1 && delimContent.indexOf('|') !== 0)
    ) {
      return Matched.None;
    }

    const lineOffsets = container.lineOffsets!;
    const firstLineNum = parser.lineNumber - 1;
    const firstLineStart = last(lineOffsets) + 1;
    const table = createNode('table', [
      [firstLineNum, firstLineStart],
      [parser.lineNumber, parser.offset]
    ]);
    table.columns = delimCells.map(() => ({ align: 'left' }));

    container.insertAfter(table);
    if (lineOffsets.length === 1) {
      container.unlink();
    } else {
      container.stringContent = stringContent.slice(0, lastLineStartIdx);
      const paraLastLineStartIdx = stringContent.lastIndexOf('\n', lastLineStartIdx - 2) + 1;
      const paraLastLineLen = lastLineStartIdx - paraLastLineStartIdx - 1;
      parser.lastLineLength = lineOffsets[lineOffsets.length - 2] + paraLastLineLen;
      parser.finalize(container, firstLineNum - 1);
    }
    parser.advanceOffset(parser.currentLine.length - parser.offset, false);

    const tableHead = createNode('tableHead', [
      [firstLineNum, firstLineStart],
      [parser.lineNumber, parser.offset]
    ] as SourcePos);
    table.appendChild(tableHead);

    const tableHeadRow = createNode('tableRow', [
      [firstLineNum, firstLineStart],
      [firstLineNum, firstLineStart + headerContent.length - 1]
    ]);
    const tableDelimRow = createNode('tableDelimRow', [
      [parser.lineNumber, parser.nextNonspace + 1],
      [parser.lineNumber, parser.offset]
    ]);
    tableHead.appendChild(tableHeadRow);
    tableHead.appendChild(tableDelimRow);

    generateTableCells(
      'tableCell',
      headerCells,
      firstLineNum,
      firstLineStart + headerOffset
    ).forEach(cellNode => {
      tableHeadRow.appendChild(cellNode);
    });

    const delimCellNodes = generateTableCells(
      'tableDelimCell',
      delimCells,
      parser.lineNumber,
      parser.nextNonspace + 1 + delimOffset
    );

    delimCellNodes.forEach(cellNode => {
      tableDelimRow.appendChild(cellNode);
    });

    table.columns = delimCellNodes.map(getColumnFromDelimCell);
    parser.tip = table;

    return Matched.Leaf;
  }

  return Matched.None;
};

export const tableBody: BlockStart = (parser, container) => {
  if (
    (container.type !== 'table' && container.type !== 'tableBody') ||
    (!parser.blank && parser.currentLine.indexOf('|') === -1)
  ) {
    return Matched.None;
  }

  parser.advanceOffset(parser.currentLine.length - parser.offset, false);

  if (parser.blank) {
    let table = container;
    if (container.type === 'tableBody') {
      table = container.parent as TableNode;
      parser.finalize(container, parser.lineNumber);
    }
    parser.finalize(table, parser.lineNumber);
    return Matched.None;
  }

  let tableBody = container;
  if (container.type === 'table') {
    tableBody = parser.addChild('tableBody', parser.nextNonspace);
    tableBody.stringContent = null;
  }
  const tableRow = createNode('tableRow', [
    [parser.lineNumber, parser.nextNonspace + 1],
    [parser.lineNumber, parser.currentLine.length]
  ]);
  tableBody.appendChild(tableRow);

  const table = tableBody.parent as TableNode;
  const content = parser.currentLine.slice(parser.nextNonspace);
  const [offset, cellContents] = parseRowContent(content);

  generateTableCells(
    'tableCell',
    cellContents,
    parser.lineNumber,
    parser.nextNonspace + 1 + offset
  ).forEach((cellNode, idx) => {
    if (idx >= table.columns.length) {
      cellNode.ignored = true;
    }
    tableRow.appendChild(cellNode);
  });

  return Matched.Leaf;
};
