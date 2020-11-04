import { DOMOutputSpecArray, Fragment } from 'prosemirror-model';
import { setBlockType } from 'prosemirror-commands';

import Node from '@/spec/node';

import { EditorCommand } from '@t/spec';

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
    return payload => (state, dispatch) => {
      const { col, row } = payload!;
      const {
        table,
        tableHead,
        tableHeadCell,
        tableBody,
        tableRow,
        tableBodyCell
      } = state.schema.nodes;

      // thead
      const ths = [];

      for (let i = 0; i < col; i += 1) {
        ths.push(tableHeadCell.create());
      }
      const thead = tableHead.create(null, [tableRow.create(null, ths)]);

      // tbody
      const rows = [];

      for (let i = 0; i < row; i += 1) {
        const cells = [];

        for (let j = 0; j < col; j += 1) {
          cells.push(tableBodyCell.create());
        }
        rows.push(tableRow.create(null, cells));
      }

      const tbody = tableBody.create(null, rows);

      // table
      const node = table.create(null, [thead, tbody]);

      const tr = state.tr.replaceSelectionWith(node);

      dispatch!(tr.scrollIntoView());

      return true;
    };
  }

  private addColumn(): EditorCommand {
    return payload => (state, dispatch) => {
      let { $from } = state.selection;
    };
  }

  commands() {
    return {
      addTable: this.addTable(),
      addColumn: this.addColumn()
    };
  }
}
