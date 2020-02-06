import { BlockStart, Matched } from '../blockStarts';
import { createNode, SourcePos, BlockNode } from '../node';

const reTableHeadRowDelim = /^\|?(?:[ \t]*-+[ \t]*\|)+[ \t]*-+[ \t]*\|?$/;
const reTableHeadRow = /^\|?((?:[^|\n]*\|)+[^|\n]*)\|?[ \t]*$/;

function generateTableCells(
  tableRow: BlockNode,
  contents: string[],
  lineNum: number,
  column: number
) {
  const cellType = tableRow.type === 'tableDelimRow' ? 'tableDelimCell' : 'tableCell';
  for (let i = 0; i < contents.length; i += 1) {
    const content = contents[i];

    const [, prev, text] = content.match(/^([ \t]*)([^ \t]+)[ \t]*$/) || [];
    if ((i > 0 && i < contents.length - 1) || !!text) {
      const columnStart = column + prev.length;
      const tableCell = createNode(cellType, [
        [lineNum, columnStart],
        [lineNum, columnStart + text.length - 1]
      ]);
      tableCell.stringContent = text;
      tableCell.lineOffsets = [columnStart - 1];
      tableRow.appendChild(tableCell);
    }
    column += content.length + 1;
  }

  return column;
}

export const tableHead: BlockStart = (parser, container) => {
  let delimMatch, headerMatch, stringContent;
  if (
    container.type === 'paragraph' &&
    !parser.indented &&
    (stringContent = container.stringContent) !== null &&
    stringContent.indexOf('\n') === stringContent.length - 1 &&
    (delimMatch = parser.currentLine.slice(parser.nextNonspace).match(reTableHeadRowDelim)) &&
    (headerMatch = stringContent.substring(0, stringContent.length - 1).match(reTableHeadRow))
  ) {
    const headerCells = headerMatch[0].split('|');
    const delimCells = delimMatch[0].split('|');
    const headerCellCount = headerCells.filter(str => /\S+/.test(str)).length;
    const delimCellCount = delimCells.filter(str => /\S+/.test(str)).length;

    if (delimCellCount !== headerCellCount) {
      return Matched.None;
    }

    parser.advanceOffset(parser.currentLine.length - parser.offset, false);
    const firstLineNum = container.sourcepos![0][0];
    const firstLineStart = container.sourcepos![0][1];

    const table = createNode('table', [
      [firstLineNum, firstLineStart],
      [parser.lineNumber, parser.offset]
    ]);
    container.insertAfter(table);
    container.unlink();

    const tableHead = createNode('tableHead', [
      [firstLineNum, firstLineStart],
      [parser.lineNumber, parser.offset]
    ] as SourcePos);
    table.appendChild(tableHead);

    const tableHeadRow = createNode('tableRow', [
      [firstLineNum, firstLineStart],
      [firstLineNum, firstLineStart + headerMatch[0].length - 1]
    ]);
    const tableDelimRow = createNode('tableDelimRow', [
      [parser.lineNumber, parser.nextNonspace + 1],
      [parser.lineNumber, parser.offset]
    ]);
    tableHead.appendChild(tableHeadRow);
    tableHead.appendChild(tableDelimRow);

    generateTableCells(tableHeadRow, headerCells, firstLineNum, firstLineStart);
    generateTableCells(tableDelimRow, delimCells, parser.lineNumber, parser.nextNonspace + 1);

    parser.tip = table;

    return Matched.Leaf;
  }

  return Matched.None;
};

export const tableBody: BlockStart = (parser, container) => {
  if (container.type === 'table' || container.type === 'tableBody') {
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

    const content = parser.currentLine.slice(parser.nextNonspace);
    const cellContents = content.split('|');
    generateTableCells(tableRow, cellContents, parser.lineNumber, parser.nextNonspace + 1);
    parser.advanceOffset(parser.currentLine.length - parser.offset, false);

    return Matched.Leaf;
  }
  return Matched.None;
};
