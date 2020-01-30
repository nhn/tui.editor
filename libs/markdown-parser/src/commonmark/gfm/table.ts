import { BlockStart, Matched } from '../blockStarts';
import { createNode, SourcePos } from '../node';

const reTableRowDelim = /^\|?(?:[ \t]*-+[ \t]*\|)+[ \t]*-+[ \t]*\|?$/;
const reTableRow = /^\|?((?:[^|\n]*\|)+[^|\n]*)\|?[ \t]*$/;

export const blockStart: BlockStart = (parser, container) => {
  let delimMatch, headerMatch, stringContent;
  if (
    (stringContent = container.stringContent) !== null &&
    stringContent.indexOf('\n') === stringContent.length - 1 &&
    container.type === 'paragraph' &&
    !parser.indented &&
    (delimMatch = parser.currentLine.slice(parser.nextNonspace).match(reTableRowDelim)) &&
    (headerMatch = stringContent.substring(0, stringContent.length - 1).match(reTableRow))
  ) {
    const delimCells = delimMatch[0].split('|');
    const headerCells = headerMatch[0].split('|');
    const delimCellCount = delimCells.filter(str => str.trim()).length;
    const headerCellCount = headerCells.filter(str => str.trim()).length;

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

    let column = firstLineStart;
    for (const content of headerCells) {
      if (/\S+/.test(content)) {
        const tableCell = createNode('tableCell', [
          [firstLineNum, column],
          [firstLineNum, column + content.length - 1]
        ]);
        tableCell.stringContent = content;
        tableHeadRow.appendChild(tableCell);
      }
      column += content.length + 1;
    }

    column = parser.nextNonspace + 1;
    for (const content of delimCells) {
      if (/\S+/.test(content)) {
        const tableCell = createNode('tableCell', [
          [parser.lineNumber, column],
          [parser.lineNumber, column + content.length - 1]
        ]);
        tableCell.stringContent = content;
        tableDelimRow.appendChild(tableCell);
      }
      column += content.length + 1;
    }

    parser.tip = table;

    return Matched.Leaf;
  }

  return Matched.None;
};
