import { Node, Schema, ResolvedPos } from 'prosemirror-model';

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

export function getTableBodyCellPositions(pos: ResolvedPos, depth: number) {
  const cellPositions: number[] = [];
  const tbody = pos.node(depth);
  const tbodyPos = pos.before(depth);

  tbody.forEach((row: Node, offset: number) => {
    let cellPos = tbodyPos + offset - 1;

    for (let index = 0, len = row.childCount; index < len; index += 1) {
      cellPos += row.child(index).nodeSize;
      cellPositions.push(cellPos);
    }
  });

  return cellPositions;
}
