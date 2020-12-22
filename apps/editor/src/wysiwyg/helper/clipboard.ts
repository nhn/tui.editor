import { Schema, Node, Slice, Fragment, NodeType } from 'prosemirror-model';

import { isFromMso, convertMsoParagraphsToList } from '@/wysiwyg/helper/pasteMsoList';
import { getTableContentFromSlice } from '@/wysiwyg/helper/table';

import { fitSlice } from '@/wysiwyg/helper/node';

const START_FRAGMENT_COMMENT = '<!--StartFragment-->';
const END_FRAGMENT_COMMENT = '<!--EndFragment-->';

function getContentBetweenFragmentComments(html: string) {
  const startFragmentIndex = html.indexOf(START_FRAGMENT_COMMENT);
  const endFragmentIndex = html.lastIndexOf(END_FRAGMENT_COMMENT);

  if (startFragmentIndex > -1 && endFragmentIndex > -1) {
    html = html.slice(startFragmentIndex + START_FRAGMENT_COMMENT.length, endFragmentIndex);
  }

  return html;
}

function convertMsoTableToCompletedTable(html: string) {
  // wrap with <tr> if html contains dangling <td> tags
  // dangling <td> tag is that tag does not have <tr> as parent node
  if (/<\/td>((?!<\/tr>)[\s\S])*$/i.test(html)) {
    html = `<tr>${html}</tr>`;
  }
  // wrap with <table> if html contains dangling <tr> tags
  // dangling <tr> tag is that tag does not have <table> as parent node
  if (/<\/tr>((?!<\/table>)[\s\S])*$/i.test(html)) {
    html = `<table>${html}</table>`;
  }

  return html;
}

export function changePastedHTML(html: string) {
  html = getContentBetweenFragmentComments(html);
  html = convertMsoTableToCompletedTable(html);

  if (isFromMso(html)) {
    html = convertMsoParagraphsToList(html);
  }

  return html;
}

function getMaxColumnCount(rows: Node[]) {
  let maxColumnCount = rows[0].childCount;

  rows.forEach(row => {
    maxColumnCount = Math.max(maxColumnCount, row.childCount);
  });

  return maxColumnCount;
}

function copyCells(originRow: Node, maxColumnCount: number, cell: NodeType) {
  const originCellCount = originRow.childCount;
  const cells = [];

  for (let columnIndex = 0; columnIndex < maxColumnCount; columnIndex += 1) {
    const copiedCell =
      columnIndex < originCellCount
        ? fitSlice(cell, new Slice(originRow.child(columnIndex).content, 0, 0))
        : cell.createAndFill()!;

    cells.push(copiedCell);
  }

  return cells;
}

export function copyTableHeadRow(originRow: Node, maxColumnCount: number, schema: Schema) {
  const { tableRow, tableHeadCell } = schema.nodes;
  const cells = copyCells(originRow, maxColumnCount, tableHeadCell);

  return tableRow.create(null, cells);
}

export function copyTableBodyRow(originRow: Node, maxColumnCount: number, schema: Schema) {
  const { tableRow, tableBodyCell } = schema.nodes;
  const cells = copyCells(originRow, maxColumnCount, tableBodyCell);

  return tableRow.create(null, cells);
}

export function createRowsFromPastingTable(tableContent: Fragment) {
  const tableBodyRow = tableContent.lastChild!.content;
  const tableBodyRows: Node[] = [];

  tableBodyRow.forEach(row => tableBodyRows.push(row));

  const tableHeadRows: Node[] = [];

  if (tableContent.firstChild!.type !== tableContent.lastChild!.type) {
    const tableHeadRow = tableContent.firstChild!.content;

    tableHeadRow.forEach(row => tableHeadRows.push(row));
  }

  return [...tableHeadRows, ...tableBodyRows];
}

function createTableHead(tableHeadRow: Node, maxColumnCount: number, schema: Schema) {
  const { tableHead } = schema.nodes;
  const copiedRow = copyTableHeadRow(tableHeadRow, maxColumnCount, schema);

  return tableHead.create(null, copiedRow);
}

function createTableBody(tableBodyRows: Node[], maxColumnCount: number, schema: Schema) {
  const { tableBody } = schema.nodes;
  const copiedRows = tableBodyRows.map(tableBodyRow =>
    copyTableBodyRow(tableBodyRow, maxColumnCount, schema)
  );

  return tableBody.create(null, copiedRows);
}

function createTableFromPastingTable(rows: Node[], schema: Schema) {
  const columnCount = getMaxColumnCount(rows);
  const [tableHeadRow] = rows;
  const tableBodyRows = rows.slice(1);

  const table = schema.nodes.table.create(null, [
    createTableHead(tableHeadRow, columnCount, schema),
    createTableBody(tableBodyRows, columnCount, schema)
  ]);

  return table;
}

export function changePastedSlice(slice: Slice, schema: Schema) {
  const nodes: Node[] = [];

  slice.content.forEach(node => {
    if (node.type.name === 'table') {
      const tableContent = getTableContentFromSlice(new Slice(Fragment.from(node), 0, 0));

      if (tableContent) {
        const rows = createRowsFromPastingTable(tableContent);
        const table = createTableFromPastingTable(rows, schema);

        nodes.push(table);
      }
    } else {
      nodes.push(node);
    }
  });

  return new Slice(Fragment.from(nodes), 0, 0);
}
