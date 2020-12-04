import { Node, Schema, ResolvedPos } from 'prosemirror-model';
import { Selection, TextSelection } from 'prosemirror-state';

import { findNodeBy } from '@/wysiwyg/helper/node';

export interface CellInfo {
  offset: number;
  nodeSize: number;
}

export function createTableRows(
  columnCount: number,
  rowCount: number,
  schema: Schema,
  isTableBody: boolean,
  data?: string[] | null
) {
  const { tableRow, tableHeadCell, tableBodyCell } = schema.nodes;
  const tableRows = [];
  const cell = isTableBody ? tableBodyCell : tableHeadCell;

  let index = isTableBody ? columnCount : 0;

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const cells = [];

    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      const text = data && data[index];

      if (text) {
        index += 1;
      }

      cells.push(cell.create(null, text ? schema.text(text) : []));
    }

    tableRows.push(tableRow.create(null, cells));
  }

  return tableRows;
}

export function createCellsToAdd(
  [startRowIndex, startColumnIndex]: number[],
  [endRowIndex, endColumnIndex]: number[],
  columnCount: number,
  cell: Node
) {
  const cellCount =
    startRowIndex !== endRowIndex ? columnCount : getCountByRange(startColumnIndex, endColumnIndex);

  const cells = [];
  const { type } = cell;

  for (let i = 0, len = cellCount; i < len; i += 1) {
    cells.push(type.create());
  }

  return cells;
}

export function findCell(pos: ResolvedPos) {
  return findNodeBy(
    pos,
    ({ type }: Node) => type.name === 'tableHeadCell' || type.name === 'tableBodyCell'
  );
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

export function judgeToRemoveCells(
  [startRowIndex, startColumnIndex]: number[],
  [endRowIndex, endColumnIndex]: number[],
  columnCount: number
) {
  const selectedColumnCount = getCountByRange(startColumnIndex, endColumnIndex);
  const selectedRows = startRowIndex !== endRowIndex;
  const selectedAllColumns = startRowIndex === endRowIndex && selectedColumnCount === columnCount;

  return !selectedRows && !selectedAllColumns;
}

export function getResolvedSelection(selection: Selection) {
  const { $anchor, $head } = selection;
  let anchor = $anchor;
  let head = $head;

  if (selection instanceof TextSelection) {
    const foundCell = findCell($anchor);

    if (foundCell) {
      anchor = $anchor.node(0).resolve($anchor.before(foundCell.depth));
      head = anchor;
    }
  }

  return { anchor, head };
}

function getCellPosInfoList(headOrBody: Node, startOffset: number) {
  const cellInfos: CellInfo[] = [];

  headOrBody.forEach((row: Node, rowOffset: number) => {
    row.forEach(({ nodeSize }: Node, cellOffset: number) => {
      cellInfos.push({
        // 2 is the sum of the front and back positions of the closing tag
        offset: startOffset + rowOffset + cellOffset + 2,
        nodeSize
      });
    });
  });

  return cellInfos;
}

export function getAllCellPosInfoList(cellPos: ResolvedPos) {
  const foundTable = findNodeBy(cellPos, ({ type }: Node) => type.name === 'table');

  if (foundTable) {
    const { node, depth } = foundTable;
    const tablePos = cellPos.start(depth);

    const thead = node.child(0);
    const tbody = node.child(1);

    const theadCellsPos = getCellPosInfoList(thead, tablePos);
    const tbodyCellsPos = getCellPosInfoList(tbody, tablePos + thead.nodeSize);

    return theadCellsPos.concat(tbodyCellsPos);
  }

  return [];
}

export function getTableByCellPos(cellPos: ResolvedPos) {
  return cellPos.node(cellPos.depth - 2);
}

export function getRowCount(table: Node) {
  return table.child(1).childCount;
}

export function getColumnCount(table: Node) {
  return table.child(0).child(0).childCount;
}

export function getCountByRange(startIndex: number, endIndex: number) {
  return Math.abs(startIndex - endIndex) + 1;
}

export function getCellIndexesByRange(
  table: Node,
  [startRowIndex, startColumnIndex]: number[],
  [endRowIndex, endColumnIndex]: number[]
) {
  const columnCount = getColumnCount(table);
  const rowCount = getRowCount(table) + 1;

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

export function getCellIndexInfo(cellPos: ResolvedPos) {
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

export function getSelectedCellRange(startCellPos: ResolvedPos, endCellPos: ResolvedPos) {
  const [startRowIndex, startColumnIndex] = getCellIndexInfo(startCellPos);
  const [endRowIndex, endColumnIndex] = getCellIndexInfo(endCellPos);
  const columnCount = startCellPos.parent.childCount;

  const [startIndex, endIndex] = [
    startRowIndex * columnCount + startColumnIndex,
    endRowIndex * columnCount + endColumnIndex
  ];

  return [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)];
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
  rowCount: number
) {
  const [startRowIndex] = getCellIndexInfo(startCellPos);
  const [endRowIndex] = getCellIndexInfo(endCellPos);

  const onlyTheadSelected = startRowIndex === endRowIndex && startRowIndex === 0;
  const endCellInThead = startRowIndex !== endRowIndex && endRowIndex === 0;

  if (onlyTheadSelected || endCellInThead) {
    return [];
  }

  let start = startCellPos.before(startCellPos.depth);
  let selectedRowCount = getCountByRange(startRowIndex, endRowIndex);

  if (startRowIndex === 0) {
    start = startCellPos.after(startCellPos.depth) + 2;
    selectedRowCount -= 1;
  }

  const end =
    selectedRowCount === rowCount
      ? endCellPos.before(endCellPos.depth)
      : endCellPos.after(endCellPos.depth);

  return [start, end];
}
