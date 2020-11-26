import { Node, Schema, ResolvedPos } from 'prosemirror-model';

import { findNodeBy } from '@/wysiwyg/helper/node';

export interface CellPos {
  nodeStart: number;
  nodeSize: number;
}

export function createTableHead(schema: Schema, columns: number, data: string[]) {
  const { tableHead } = schema.nodes;
  const tableRows = createTableRows(schema, columns, 1, false, data);

  return tableHead.create(null, tableRows);
}

export function createTableBody(schema: Schema, columns: number, rows: number, data: string[]) {
  const { tableBody } = schema.nodes;
  const tableRows = createTableRows(schema, columns, rows, true, data);

  return tableBody.create(null, tableRows);
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

export function getRowDepthToRemove({ nodes }: Schema, pos: ResolvedPos) {
  const { tableBody, tableRow } = nodes;
  const foundRow = findNodeBy(pos, ({ type }: Node) => type === tableRow);

  if (foundRow) {
    const { depth } = foundRow;
    const parent = pos.node(depth - 1);

    if (parent.type === tableBody && parent.childCount > 1) {
      return depth;
    }
  }

  return null;
}

export function getCellDepthToRemove(schema: Schema, pos: ResolvedPos) {
  const foundCell = findCell(schema, pos);

  if (foundCell) {
    const { depth } = foundCell;
    const columnCount = pos.node(depth - 1).childCount;

    if (columnCount > 1) {
      return depth;
    }
  }

  return null;
}

export function findCell({ nodes }: Schema, pos: ResolvedPos) {
  const { tableHeadCell, tableBodyCell } = nodes;

  return findNodeBy(pos, ({ type }: Node) => type === tableHeadCell || type === tableBodyCell);
}

function getHeadOrBodyCellPositions(headOrBody: Node, startPos: number) {
  const positions: CellPos[] = [];

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

export function getAllCellPositions(cellResolvedPos: ResolvedPos) {
  const depth = cellResolvedPos.depth - 2;
  const table = cellResolvedPos.node(depth);
  const tablePos = cellResolvedPos.start(depth);

  return getCellPositions(table, tablePos);
}

export function getCellPositions(table: Node, tablePos: number) {
  const thead = table.child(0);
  const theadCellPositions = getHeadOrBodyCellPositions(thead, tablePos);
  const tbodyCellPositions = getHeadOrBodyCellPositions(table.child(1), tablePos + thead.nodeSize);

  return theadCellPositions.concat(tbodyCellPositions);
}

export function getCellIndexesByCursorIndex(table: Node, cursorIndex: number) {
  const tableBody = table.child(1);
  const columnCount = tableBody.child(0).childCount;
  const rowCount = tableBody.childCount + 1;
  const indexes = [];

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    indexes.push(rowIndex * columnCount + cursorIndex);
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

export function findRowIndex(tbodyOrThead: Node, foundRow: Node) {
  let rowIndex = -1;

  tbodyOrThead.forEach((node: Node, _: number, index: number) => {
    if (node === foundRow) {
      rowIndex = index;
    }
  });

  return rowIndex;
}

export function getRowIndex(cellPos: ResolvedPos, node: Node, { nodes }: Schema) {
  const { tableHeadCell } = nodes;
  const { pos, parentOffset } = cellPos;

  let rowIndex = node.resolve(pos - parentOffset - 1).index();

  if (cellPos.nodeAfter!.type !== tableHeadCell) {
    rowIndex += 1;
  }

  return rowIndex;
}
