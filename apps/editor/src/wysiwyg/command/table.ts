import { ResolvedPos, Schema } from 'prosemirror-model';
import { Selection, Transaction } from 'prosemirror-state';

import { createParagraph, createTextSelection } from '@/helper/manipulation';
import { CellInfo } from '@/wysiwyg/helper/table';

export type CursorDirection = 'left' | 'right';

export type CellDirection = CursorDirection | 'up' | 'down';

export function canBeOutOfTableStart(direction: CellDirection, [rowIndex, columnIndex]: number[]) {
  const cursorInFirstRow = direction === 'up' && rowIndex === 0;
  const cursorInFirstCell = direction === 'left' && rowIndex === 0 && columnIndex === 0;

  return cursorInFirstRow || cursorInFirstCell;
}

export function canBeOutOfTableEnd(
  direction: CellDirection,
  cellsInfo: CellInfo[][],
  [rowIndex, columnIndex]: number[]
) {
  const rowCount = cellsInfo.length;
  const columnCount = cellsInfo[0].length;

  const cursorInLastRow = direction === 'down' && rowIndex === cellsInfo.length - 1;
  const cursorInLastCell =
    direction === 'right' && rowIndex === rowCount - 1 && columnIndex === columnCount - 1;

  return cursorInLastRow || cursorInLastCell;
}

function addParagraph(tr: Transaction, { pos }: ResolvedPos, schema: Schema) {
  tr.replaceWith(pos, pos, createParagraph(schema));

  return tr.setSelection(createTextSelection(tr, pos + 1));
}

export function addParagraphBeforeTable(tr: Transaction, cellsInfo: CellInfo[][], schema: Schema) {
  // 3 is position value of <table><thead><tr>
  const tableStartPos = tr.doc.resolve(cellsInfo[0][0].offset - 3);

  if (!tableStartPos.nodeBefore) {
    return addParagraph(tr, tableStartPos, schema);
  }

  return tr.setSelection(Selection.near(tableStartPos, -1));
}

export function addParagraphAfterTable(tr: Transaction, cellsInfo: CellInfo[][], schema: Schema) {
  const rowCount = cellsInfo.length;
  const columnCount = cellsInfo[0].length;
  const lastCell = cellsInfo[rowCount - 1][columnCount - 1];

  // 3 is position value of </tr></tbody></table>
  const tableEndPos = tr.doc.resolve(lastCell.offset + lastCell.nodeSize + 3);

  if (!tableEndPos.nodeAfter) {
    return addParagraph(tr, tableEndPos, schema);
  }

  return tr.setSelection(Selection.near(tableEndPos, 1));
}
