import { Node, Schema, ResolvedPos } from 'prosemirror-model';
import { Selection, TextSelection } from 'prosemirror-state';

import { findNodeBy } from '@/wysiwyg/helper/node';

export interface CellInfo {
  nodeStart: number;
  nodeSize: number;
}

export function createTableRows(
  schema: Schema,
  columns: number,
  rows: number,
  isTbody: boolean,
  data?: string[] | null
) {
  const { tableRow, tableHeadCell, tableBodyCell } = schema.nodes;
  const tableRows = [];
  const cellType = isTbody ? tableBodyCell : tableHeadCell;

  let cellDataIndex = isTbody ? columns : 0;

  for (let i = 0; i < rows; i += 1) {
    const cells = [];

    for (let j = 0; j < columns; j += 1) {
      const text = data && data[cellDataIndex];

      if (text) {
        cellDataIndex += 1;
      }

      cells.push(cellType.create(null, text ? schema.text(text) : []));
    }

    tableRows.push(tableRow.create(null, cells));
  }

  return tableRows;
}

export function findCell({ nodes }: Schema, pos: ResolvedPos) {
  const { tableHeadCell, tableBodyCell } = nodes;

  return findNodeBy(pos, ({ type }: Node) => type === tableHeadCell || type === tableBodyCell);
}

export function getResolvedSelection(schema: Schema, selection: Selection) {
  const { $anchor, $head } = selection;
  let anchor = $anchor;
  let head = $head;

  if (selection instanceof TextSelection) {
    const foundCell = findCell(schema, $anchor);

    if (foundCell) {
      anchor = $anchor.node(0).resolve($anchor.before(foundCell.depth));
      head = anchor;
    }
  }

  return { anchor, head };
}

/**
 * @TODO refactoring
 */
function getHeadOrBodyCellPositions(headOrBody: Node, startPos: number) {
  const positions: CellInfo[] = [];

  headOrBody.forEach((row: Node, rowOffset: number) => {
    row.forEach(({ nodeSize }: Node, cellOffset: number) => {
      positions.push({
        nodeStart: startPos + rowOffset + cellOffset + 2,
        nodeSize
      });
    });
  });

  return positions;
}

/**
 * @TODO refactoring
 */
export function getAllCellPositions(cellResolvedPos: ResolvedPos) {
  let index = 2;

  if (cellResolvedPos.parent.type.name === 'tableBody') {
    index = 1;
  }
  const depth = cellResolvedPos.depth - index;
  const table = cellResolvedPos.node(depth);
  const tablePos = cellResolvedPos.start(depth);

  const thead = table.child(0);
  const theadCellPositions = getHeadOrBodyCellPositions(thead, tablePos);
  const tbodyCellPositions = getHeadOrBodyCellPositions(table.child(1), tablePos + thead.nodeSize);

  return theadCellPositions.concat(tbodyCellPositions);
}

export function getCellIndexesByCursorRange(table: Node, start: number[], end: number[]) {
  const tableBody = table.child(1);
  const columnCount = tableBody.child(0).childCount;
  const rowCount = tableBody.childCount + 1;

  const [startRowIndex, startColumnIndex] = start;
  const [endRowIndex, endColumnIndex] = end;

  const columnStart =
    startRowIndex !== endRowIndex ? 0 : Math.min(startColumnIndex, endColumnIndex);
  const columnEnd = Math.max(startColumnIndex, endColumnIndex);

  const indexes = [];

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    for (let columnIndex = columnStart, len = columnEnd; columnIndex <= len; columnIndex += 1) {
      indexes.push(rowIndex * columnCount + columnIndex);
    }
  }

  return indexes;
}

export function findCellIndexByCursor({ nodes }: Schema, pos: ResolvedPos, depth: number) {
  const { tableBody } = nodes;
  const theadOrTbody = pos.node(depth - 2);
  const tableRow = pos.node(depth - 1);
  const columnCount = tableRow.childCount;
  const columnIndex = pos.index(depth - 1);

  let rowIndex = findRowIndex(theadOrTbody, tableRow);

  if (theadOrTbody.type === tableBody) {
    rowIndex += 1;
  }

  return rowIndex * columnCount + columnIndex;
}

function findRowIndex(tbodyOrThead: Node, foundRow: Node) {
  let rowIndex = -1;

  tbodyOrThead.forEach((node: Node, _: number, index: number) => {
    if (node === foundRow) {
      rowIndex = index;
    }
  });

  return rowIndex;
}

/**
 * @TODO refactoring
 */
export function getCellPosition(cellPos: ResolvedPos) {
  const { pos, parentOffset } = cellPos;

  let rowIndex = cellPos
    .node(0)
    .resolve(pos - parentOffset - 1)
    .index();

  if (cellPos.nodeAfter && cellPos.nodeAfter.type.name !== 'tableHeadCell') {
    rowIndex += 1;
  }

  const columnIndex = cellPos.index();

  return [rowIndex, columnIndex];
}

export function isInCellElement(node: HTMLElement, root: Element) {
  while (node && node !== root) {
    if (node.nodeName === 'TD' || node.nodeName === 'TH') {
      return true;
    }

    node = node.parentNode as HTMLElement;
  }

  return false;
}

export function getSelectedCellRanges(startCellPos: ResolvedPos, endCellPos: ResolvedPos) {
  const [startRowIndex, startColumnIndex] = getCellPosition(startCellPos);
  const [endRowIndex, endColumnIndex] = getCellPosition(endCellPos);
  const columnCount = startCellPos.parent.childCount;

  const [startIndex, endIndex] = [
    startRowIndex * columnCount + startColumnIndex,
    endRowIndex * columnCount + endColumnIndex
  ];

  return [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)];
}

export function getColumnCount(table: Node) {
  return table.child(0).child(0).childCount;
}

export function getRowCountByRange(startRowIndex: number, endRowIndex: number) {
  return Math.max(startRowIndex, endRowIndex) - Math.min(startRowIndex, endRowIndex) + 1;
}

export function getTableByCellPos(cellPos: ResolvedPos) {
  return cellPos.node(cellPos.depth - 2);
}

export function getPositionsToAddRow(
  cellPos: ResolvedPos,
  startRowIndex: number,
  endRowIndex: number
) {
  const onlyTheadSelected = startRowIndex === endRowIndex && startRowIndex === 0;
  const endCellInThead = startRowIndex !== endRowIndex && endRowIndex === 0;

  let start = cellPos.after(cellPos.depth);

  if (onlyTheadSelected || endCellInThead) {
    start += 2;
  }

  return [start, start];
}

export function getPositionsToRemoveRow(
  startCellPos: ResolvedPos,
  endCellPos: ResolvedPos,
  startRowIndex: number,
  endRowIndex: number
) {
  const onlyTheadSelected = startRowIndex === endRowIndex && startRowIndex === 0;
  const endCellInThead = startRowIndex !== endRowIndex && endRowIndex === 0;

  if (onlyTheadSelected || endCellInThead) {
    return [];
  }

  let start = startCellPos.before(startCellPos.depth);

  if (startRowIndex === 0) {
    start = startCellPos.after(startCellPos.depth) + 2;
  }

  const end = endCellPos.after(endCellPos.depth);

  return [start, end];
}
