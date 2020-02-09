import { last, isEmpty } from '../common';
import { BlockStart, Matched } from '../blockStarts';
import { createNode, SourcePos, TableNode, TableColumn, TableCellNode } from '../node';

function parseRowContent(content: string): [number, string[]] {
  let startIdx = 0;
  let offset = 0;
  const cells = [];
  for (let i = 0; i < content.length; i += 1) {
    if (content[i] === '|' && content[i - 1] !== '\\') {
      const cell = content.substring(startIdx, i);
      if (!cells.length && isEmpty(cell)) {
        offset = i + 1;
      } else {
        cells.push(cell);
      }
      startIdx = i + 1;
    }
  }
  if (startIdx < content.length) {
    cells.push(content.substring(startIdx, content.length));
  }

  const lastCell = last(cells);
  if (lastCell !== null && isEmpty(lastCell)) {
    cells.pop();
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
    const offset = preSpaces ? preSpaces[0].length : 0;
    const trimmed = content.trim();
    const chPosStart = chPos + offset;
    const tableCell = createNode(cellType, [
      [lineNum, chPosStart],
      [lineNum, chPosStart + trimmed.length - 1]
    ]) as TableCellNode;
    tableCell.stringContent = trimmed.replace(/\\\|/g, '|'); // replace esacped pipe(\|)
    tableCell.columnIdx = cells.length;
    tableCell.lineOffsets = [chPosStart - 1];
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
  if (
    container.type === 'paragraph' &&
    !parser.indented &&
    !parser.blank &&
    stringContent.indexOf('\n') === stringContent.length - 1 // check if existing content is one line
  ) {
    const headerContent = stringContent.slice(0, stringContent.length - 1);
    const delimContent = parser.currentLine.slice(parser.nextNonspace);
    const [headerOffset, headerCells] = parseRowContent(headerContent);
    const [delimOffset, delimCells] = parseRowContent(delimContent);
    const reValidDelimCell = /^[ \t]*:?-+:?[ \t]*$/;

    if (
      !headerCells.length ||
      !delimCells.length ||
      delimCells.some(cell => !reValidDelimCell.test(cell)) ||
      headerCells.length !== delimCells.length
    ) {
      return Matched.None;
    }

    const firstLineNum = container.sourcepos![0][0];
    const firstLineStart = container.sourcepos![0][1];
    const table = createNode('table', [
      [firstLineNum, firstLineStart],
      [parser.lineNumber, parser.offset]
    ]);
    table.columns = delimCells.map(() => ({ align: 'left' }));
    container.insertAfter(table);
    container.unlink();
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
  if (container.type !== 'table' && container.type !== 'tableBody') {
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
