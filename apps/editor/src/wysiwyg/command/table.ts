import { ProsemirrorNode, ResolvedPos, Schema } from 'prosemirror-model';
import { Selection, Transaction, NodeSelection } from 'prosemirror-state';

import { addParagraph } from '@/helper/manipulation';

import { getLastCell, RowInfo } from '@/wysiwyg/helper/table';

export type CursorDirection = 'left' | 'right' | 'up' | 'down';

export type CellPosition = [rowIdx: number, colIdx: number];

type CellOffsetFn = ([rowIdx, colIdx]: CellPosition, cellsInfo: RowInfo[]) => number | null;

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

function isInLastListItem(pos: ResolvedPos) {
  let { depth } = pos;
  let parentNode;

  while (depth) {
    parentNode = pos.node(depth);

    if (parentNode.type.name === 'tableBodyCell') {
      break;
    }

    if (parentNode.type.name === 'listItem') {
      const grandParent = pos.node(depth - 1);
      const lastListItem = grandParent.lastChild === parentNode;
      const hasChildren = parentNode.lastChild?.type.name !== 'paragraph';

      if (!lastListItem) {
        return false;
      }

      return !hasChildren;
    }

    depth -= 1;
  }

  return false;
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
  curDepth: number,
  from: ResolvedPos,
  doc: ProsemirrorNode,
  inList: boolean
) {
  if (direction === 'right' || direction === 'down') {
    if (inList && !isInLastListItem(from)) {
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
  const moveAfterCell = canMoveToAfterCell(direction, curDepth, from, doc, inList);

  return moveBeforeCell && moveAfterCell;
}

export function canBeOutOfTable(
  direction: CursorDirection,
  cellsInfo: RowInfo[],
  [rowIdx, colIdx]: CellPosition
) {
  const rowspan = cellsInfo[rowIdx].rowspanMap[colIdx];
  const inFirstRow = direction === 'up' && rowIdx === 0;
  const inLastRow =
    (direction === 'down' || direction === 'right') &&
    (rowspan ? rowIdx + rowspan.count - 1 : rowIdx) === cellsInfo.length - 1;

  return inFirstRow || inLastRow;
}

export function addParagraphBeforeTable(tr: Transaction, cellsInfo: RowInfo[], schema: Schema) {
  // 3 is position value of <table><thead><tr>
  const tableStartPos = tr.doc.resolve(cellsInfo[0][0].offset - 3);

  if (!tableStartPos.nodeBefore) {
    return addParagraph(tr, tableStartPos, schema);
  }

  return tr.setSelection(Selection.near(tableStartPos, -1));
}

export function addParagraphAfterTable(tr: Transaction, cellsInfo: RowInfo[], schema: Schema) {
  const lastCell = getLastCell(cellsInfo);
  // 3 is position value of </tr></tbody></table>
  const tableEndPos = tr.doc.resolve(lastCell.offset + lastCell.nodeSize + 3);

  if (!tableEndPos.nodeAfter) {
    return addParagraph(tr, tableEndPos, schema);
  }

  return tr.setSelection(Selection.near(tableEndPos, 1));
}

export function getRightCellOffset([rowIdx, colIdx]: CellPosition, cellsInfo: RowInfo[]) {
  const allRowCount = cellsInfo.length;
  const allColumnCount = cellsInfo[0].length;

  const lastCellInRow = colIdx === allColumnCount - 1;
  const lastCellInTable = rowIdx === allRowCount - 1 && lastCellInRow;

  if (!lastCellInTable) {
    let nextColIdx = colIdx + 1;
    const colspan = cellsInfo[rowIdx].colspanMap[colIdx];

    if (colspan) {
      nextColIdx += colspan.count - 1;
    }

    if (lastCellInRow || nextColIdx === allColumnCount) {
      rowIdx += 1;
      nextColIdx = 0;
    }
    const { offset } = cellsInfo[rowIdx][nextColIdx];

    return offset + 2;
  }

  return null;
}

export function getLeftCellOffset([rowIdx, colIdx]: CellPosition, cellsInfo: RowInfo[]) {
  const allColumnCount = cellsInfo[0].length;

  const firstCellInRow = colIdx === 0;
  const firstCellInTable = rowIdx === 0 && firstCellInRow;

  if (!firstCellInTable) {
    colIdx -= 1;

    if (firstCellInRow) {
      rowIdx -= 1;
      colIdx = allColumnCount - 1;
    }

    const { offset, nodeSize } = cellsInfo[rowIdx][colIdx];

    return offset + nodeSize - 2;
  }

  return null;
}

export function getUpCellOffset([rowIdx, colIdx]: CellPosition, cellsInfo: RowInfo[]) {
  if (rowIdx > 0) {
    const { offset, nodeSize } = cellsInfo[rowIdx - 1][colIdx];

    return offset + nodeSize - 2;
  }

  return null;
}

export function getDownCellOffset([rowIdx, colIdx]: CellPosition, cellsInfo: RowInfo[]) {
  const allRowCount = cellsInfo.length;

  if (rowIdx < allRowCount - 1) {
    let nextRowIdx = rowIdx + 1;
    const rowspan = cellsInfo[rowIdx].rowspanMap[colIdx];

    if (rowspan) {
      nextRowIdx += rowspan.count - 1;
    }
    const { offset } = cellsInfo[nextRowIdx][colIdx];

    return offset + 2;
  }

  return null;
}

export function moveToCell(
  direction: CursorDirection,
  tr: Transaction,
  cellIndex: CellPosition,
  cellsInfo: RowInfo[]
) {
  const cellOffsetFn = cellOffsetFnMap[direction];
  const offset = cellOffsetFn(cellIndex, cellsInfo);

  if (offset) {
    const dir = direction === 'right' || direction === 'down' ? 1 : -1;

    return tr.setSelection(Selection.near(tr.doc.resolve(offset), dir));
  }

  return null;
}

export function canSelectTableNode(
  direction: CursorDirection,
  cellsInfo: RowInfo[],
  [rowIdx, colIdx]: CellPosition,
  from: ResolvedPos,
  paraDepth: number
) {
  const curOffset = from.pos;

  const endRowIdx = direction === 'left' ? 0 : cellsInfo.length - 1;
  const endColIdx = direction === 'left' ? 0 : cellsInfo[0].length - 1;
  const endCursorPos = direction === 'left' ? from.start(paraDepth) : from.end(paraDepth);

  const endCell = rowIdx === endRowIdx && colIdx === endColIdx;
  const endCursor = curOffset === endCursorPos;

  return endCell && endCursor;
}

export function selectNode(tr: Transaction, pos: ResolvedPos, depth: number) {
  const tablePos = tr.doc.resolve(pos.before(depth - 3));

  return tr.setSelection(new NodeSelection(tablePos));
}
