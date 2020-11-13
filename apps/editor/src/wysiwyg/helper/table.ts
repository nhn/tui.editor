import { Node, Schema, ResolvedPos } from 'prosemirror-model';

import { findNodeBy } from '@/wysiwyg/helper/node';

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

export function findTableCellNode({ nodes }: Schema, pos: ResolvedPos) {
  const { tableHeadCell, tableBodyCell } = nodes;

  return findNodeBy(pos, ({ type }: Node) => type === tableHeadCell || type === tableBodyCell);
}

function getHeadOrBodyCellPositions(headOrBody: Node, startPos: number) {
  const positions: {
    nodeStart: number;
    nodeSize: number;
  }[] = [];

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

  for (let i = 0; i < rowCount; i += 1) {
    indexes.push(i * columnCount + cursorIndex);
  }

  return indexes;
}
