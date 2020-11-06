import { DOMOutputSpecArray, Schema } from 'prosemirror-model';

import { isInTableNode } from '@/wysiwyg/helper/node';

import Node from '@/spec/node';

import { EditorCommand } from '@t/spec';

function createTableHead(schema: Schema, columns: number, data: string[]) {
  const { tableHead, tableRow, tableHeadCell } = schema.nodes;
  const tableHeads = [];

  for (let i = 0; i < columns; i += 1) {
    tableHeads.push(tableHeadCell.create(null, data[i] ? schema.text(data[i]) : []));
  }

  return tableHead.create(null, [tableRow.create(null, tableHeads)]);
}

function createTableBody(schema: Schema, columns: number, rows: number, data: string[]) {
  const { tableBody, tableRow, tableBodyCell } = schema.nodes;
  const tableRows = [];
  let cellIndex = columns;

  for (let i = 0; i < rows; i += 1) {
    const cells = [];

    for (let j = 0; j < columns; j += 1) {
      const text = data[cellIndex];

      if (text) {
        cellIndex += 1;
      }

      cells.push(tableBodyCell.create(null, text ? schema.text(text) : []));
    }

    tableRows.push(tableRow.create(null, cells));
  }

  return tableBody.create(null, tableRows);
}

export class Table extends Node {
  get name() {
    return 'table';
  }

  get schema() {
    return {
      content: 'tableHead{1} tableBody+',
      group: 'block',
      parseDOM: [{ tag: 'table' }],
      toDOM(): DOMOutputSpecArray {
        return ['table', 0];
      }
    };
  }

  private addTable(): EditorCommand {
    return (payload = {}) => (state, dispatch) => {
      const { schema, tr, selection } = state;
      const { columns = 1, rows = 1, data = [] } = payload;
      const { from, to, $from } = selection;
      const collapsed = from === to;

      if (collapsed && !isInTableNode(schema, $from)) {
        const thead = createTableHead(schema, columns, data);
        const tbody = createTableBody(schema, columns, rows, data);
        const table = schema.nodes.table.create(null, [thead, tbody]);

        dispatch!(tr.replaceSelectionWith(table).scrollIntoView());

        return true;
      }

      return false;
    };
  }

  private addColumn(): EditorCommand {
    return payload => (state, dispatch) => {
      // let { $from } = state.selection;
      return true;
    };
  }

  commands() {
    return {
      addTable: this.addTable(),
      addColumn: this.addColumn()
    };
  }
}
