import { ProsemirrorNode, ResolvedPos, Schema } from 'prosemirror-model';
import { Selection, Transaction, NodeSelection } from 'prosemirror-state';

import { createParagraph, createTextSelection } from '@/helper/manipulation';

import {
  CellInfo,
  getRightCellOffset,
  getLeftCellOffset,
  getUpCellOffset,
  getDownCellOffset,
} from '@/wysiwyg/helper/table';

export type CursorDirection = 'left' | 'right' | 'up' | 'down';

type CellOffsetFn = ([rowIndex, columnIndex]: number[], cellsInfo: CellInfo[][]) => number | null;

type CellOffsetFnMap = {
  [key in CursorDirection]: CellOffsetFn;
};

const cellOffsetFnMap: CellOffsetFnMap = {
  left: getLeftCellOffset,
  right: getRightCellOffset,
  up: getUpCellOffset,
  down: getDownCellOffset,
};

function isInFirstListItem(
  pos: ResolvedPos,
  doc: ProsemirrorNode,
  [paraDepth, listDepth]: number[]
) {
  const listItemNode = doc.resolve(pos.before(paraDepth - 1));

  return listDepth === paraDepth && !listItemNode.nodeBefore;
}

function isInLastListItem(pos: ResolvedPos, doc: ProsemirrorNode, limitedDepth: number) {
  let { depth } = pos;
  let lastState = false;
  let parentNode;

  while (depth && depth >= limitedDepth) {
    parentNode = pos.node(depth);

    if (parentNode.type.name === 'listItem') {
      const { nodeAfter } = doc.resolve(pos.after(depth));
      const hasChildren = parentNode.lastChild?.type.name !== 'paragraph';
      const notLeafChild = !lastState && (nodeAfter || hasChildren);
      const notLeafParent = lastState && nodeAfter;

      if (notLeafChild || notLeafParent) {
        return false;
      }

      lastState = true;
    }

    depth -= 1;
  }

  return lastState;
}

function canMoveToBeforeCell(
  direction: CursorDirection,
  [paraDepth, listDepth, curDepth]: number[],
  from: ResolvedPos,
  doc: ProsemirrorNode,
  inList: boolean
) {
  if (direction === 'left' || direction === 'up') {
    if (inList && !isInFirstListItem(from, doc, [paraDepth, listDepth])) {
      return false;
    }

    const endOffset = from.before(curDepth);
    const { nodeBefore } = doc.resolve(endOffset);

    if (nodeBefore) {
      return false;
    }
  }

  return true;
}

function canMoveToAfterCell(
  direction: CursorDirection,
  [cellDepth, curDepth]: number[],
  from: ResolvedPos,
  doc: ProsemirrorNode,
  inList: boolean
) {
  if (direction === 'right' || direction === 'down') {
    if (inList && !isInLastListItem(from, doc, cellDepth)) {
      return false;
    }

    const endOffset = from.after(curDepth);
    const { nodeAfter } = doc.resolve(endOffset);

    if (nodeAfter) {
      return false;
    }
  }

  return true;
}

export function canMoveBetweenCells(
  direction: CursorDirection,
  [cellDepth, paraDepth]: number[],
  from: ResolvedPos,
  doc: ProsemirrorNode
) {
  const listDepth = cellDepth + 3; // 3 is position of <ul><li><p>
  const inList = paraDepth >= listDepth;
  const curDepth = inList ? cellDepth + 1 : paraDepth;

  const moveBeforeCell = canMoveToBeforeCell(
    direction,
    [paraDepth, listDepth, curDepth],
    from,
    doc,
    inList
  );
  const moveAfterCell = canMoveToAfterCell(direction, [cellDepth, curDepth], from, doc, inList);

  return moveBeforeCell && moveAfterCell;
}

export function canBeOutOfTable(
  direction: CursorDirection,
  cellsInfo: CellInfo[][],
  rowIndex: number
) {
  const inFirstRow = direction === 'up' && rowIndex === 0;
  const inLastRow = direction === 'down' && rowIndex === cellsInfo.length - 1;

  return inFirstRow || inLastRow;
}

function addParagraph(tr: Transaction, { pos }: ResolvedPos, schema: Schema) {
  tr.replaceWith(pos, pos, createParagraph(schema));

  return tr.setSelection(createTextSelection(tr, pos + 1));
}

function addParagraphBeforeTable(tr: Transaction, cellsInfo: CellInfo[][], schema: Schema) {
  // 3 is position value of <table><thead><tr>
  const tableStartPos = tr.doc.resolve(cellsInfo[0][0].offset - 3);

  if (!tableStartPos.nodeBefore) {
    return addParagraph(tr, tableStartPos, schema);
  }

  return tr.setSelection(Selection.near(tableStartPos, -1));
}

function addParagraphAfterTable(tr: Transaction, cellsInfo: CellInfo[][], schema: Schema) {
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

export function addParagraphBeforeAfterTable(
  direction: CursorDirection,
  tr: Transaction,
  cellsInfo: CellInfo[][],
  schema: Schema
) {
  let newTr;

  if (direction === 'up') {
    newTr = addParagraphBeforeTable(tr, cellsInfo, schema);
  } else if (direction === 'down') {
    newTr = addParagraphAfterTable(tr, cellsInfo, schema);
  }

  return newTr;
}

export function moveToCell(
  direction: CursorDirection,
  tr: Transaction,
  cellIndex: number[],
  cellsInfo: CellInfo[][]
) {
  const cellOffsetFn = cellOffsetFnMap[direction];
  const offset = cellOffsetFn(cellIndex, cellsInfo);

  if (offset) {
    const dir = direction === 'right' || direction === 'down' ? 1 : -1;

    return tr.setSelection(Selection.near(tr.doc.resolve(offset), dir));
  }

  return null;
}

export function canSelectTable(
  direction: CursorDirection,
  cellsInfo: CellInfo[][],
  [rowIndex, columnIndex]: number[],
  from: ResolvedPos,
  paraDepth: number
) {
  const rowCount = cellsInfo.length;
  const columnCount = cellsInfo[0].length;
  const curOffset = from.pos;

  let endCell = false;
  let endCursor = false;

  if (direction === 'left') {
    endCell = rowIndex === 0 && columnIndex === 0;
    endCursor = from.start(paraDepth) === curOffset;
  } else if (direction === 'right') {
    endCell = rowIndex === rowCount - 1 && columnIndex === columnCount - 1;
    endCursor = from.end(paraDepth) === curOffset;
  }

  return endCell && endCursor;
}

export function selectNode(tr: Transaction, pos: ResolvedPos, depth: number) {
  const tablePos = tr.doc.resolve(pos.before(depth - 3));

  return tr.setSelection(new NodeSelection(tablePos));
}
