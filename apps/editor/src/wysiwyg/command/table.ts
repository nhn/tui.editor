import { ProsemirrorNode, ResolvedPos, Schema } from 'prosemirror-model';
import { Selection, Transaction, NodeSelection } from 'prosemirror-state';

import { addParagraph } from '@/helper/manipulation';

import { TableOffsetMap } from '../helper/tableOffsetMap';

export type CursorDirection = 'left' | 'right' | 'up' | 'down';

export type CellPosition = [rowIdx: number, colIdx: number];

type CellOffsetFn = ([rowIdx, colIdx]: CellPosition, map: TableOffsetMap) => number | null;

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
  map: TableOffsetMap,
  [rowIdx, colIdx]: CellPosition
) {
  const rowspan = map.getRowspanCount(rowIdx, colIdx);
  const inFirstRow = direction === 'up' && rowIdx === 0;
  const inLastRow =
    direction === 'down' && (rowspan ? rowIdx + rowspan - 1 : rowIdx) === map.totalRowCount - 1;

  return inFirstRow || inLastRow;
}

export function addParagraphBeforeTable(tr: Transaction, map: TableOffsetMap, schema: Schema) {
  const tableStartPos = tr.doc.resolve(map.tableStartOffset - 1);

  if (!tableStartPos.nodeBefore) {
    return addParagraph(tr, tableStartPos, schema);
  }
  return tr.setSelection(Selection.near(tableStartPos, -1));
}

export function addParagraphAfterTable(tr: Transaction, map: TableOffsetMap, schema: Schema) {
  const tableEndPos = tr.doc.resolve(map.tableEndOffset);

  if (!tableEndPos.nodeAfter) {
    return addParagraph(tr, tableEndPos, schema);
  }
  return tr.setSelection(Selection.near(tableEndPos, 1));
}

export function getRightCellOffset([rowIdx, colIdx]: CellPosition, map: TableOffsetMap) {
  const { totalRowCount, totalColumnCount } = map;

  const lastCellInRow = colIdx === totalColumnCount - 1;
  const lastCellInTable = rowIdx === totalRowCount - 1 && lastCellInRow;

  if (!lastCellInTable) {
    let nextColIdx = colIdx + 1;
    const colspan = map.getColspanCount(rowIdx, colIdx);

    if (colspan) {
      nextColIdx += colspan - 1;
    }

    if (lastCellInRow || nextColIdx === totalColumnCount) {
      rowIdx += 1;
      nextColIdx = 0;
    }
    const { offset } = map.getCellInfo(rowIdx, nextColIdx);

    return offset + 2;
  }

  return null;
}

export function getLeftCellOffset([rowIdx, colIdx]: CellPosition, map: TableOffsetMap) {
  const { totalColumnCount } = map;

  const firstCellInRow = colIdx === 0;
  const firstCellInTable = rowIdx === 0 && firstCellInRow;

  if (!firstCellInTable) {
    colIdx -= 1;

    if (firstCellInRow) {
      rowIdx -= 1;
      colIdx = totalColumnCount - 1;
    }

    const { offset, nodeSize } = map.getCellInfo(rowIdx, colIdx);

    return offset + nodeSize - 2;
  }

  return null;
}

export function getUpCellOffset([rowIdx, colIdx]: CellPosition, map: TableOffsetMap) {
  if (rowIdx > 0) {
    const { offset, nodeSize } = map.getCellInfo(rowIdx - 1, colIdx);

    return offset + nodeSize - 2;
  }

  return null;
}

export function getDownCellOffset([rowIdx, colIdx]: CellPosition, map: TableOffsetMap) {
  const { totalRowCount } = map;

  if (rowIdx < totalRowCount - 1) {
    let nextRowIdx = rowIdx + 1;
    const rowspan = map.getRowspanCount(rowIdx, colIdx);

    if (rowspan) {
      nextRowIdx += rowspan - 1;
    }
    const { offset } = map.getCellInfo(nextRowIdx, colIdx);

    return offset + 2;
  }

  return null;
}

export function moveToCell(
  direction: CursorDirection,
  tr: Transaction,
  cellIndex: CellPosition,
  map: TableOffsetMap
) {
  const cellOffsetFn = cellOffsetFnMap[direction];
  const offset = cellOffsetFn(cellIndex, map);

  if (offset) {
    const dir = direction === 'right' || direction === 'down' ? 1 : -1;

    return tr.setSelection(Selection.near(tr.doc.resolve(offset), dir));
  }

  return null;
}

export function canSelectTableNode(
  direction: CursorDirection,
  map: TableOffsetMap,
  [rowIdx, colIdx]: CellPosition
) {
  if (direction === 'up' || direction === 'down') {
    return false;
  }
  const { tableStartOffset, tableEndOffset } = map;
  const { offset, nodeSize } = map.getCellInfo(rowIdx, colIdx);

  const pos = direction === 'left' ? tableStartOffset : tableEndOffset;
  const curPos = direction === 'left' ? offset - 2 : offset + nodeSize + 3;

  return pos === curPos;
}

export function selectNode(tr: Transaction, pos: ResolvedPos, depth: number) {
  const tablePos = tr.doc.resolve(pos.before(depth - 3));

  return tr.setSelection(new NodeSelection(tablePos));
}
