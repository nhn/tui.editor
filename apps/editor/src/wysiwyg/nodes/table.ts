import { DOMOutputSpecArray, Node as ProsemirrorNode, Fragment, Slice } from 'prosemirror-model';
import { ReplaceStep } from 'prosemirror-transform';

import Node from '@/spec/node';
import { isInTableNode, findNodeBy } from '@/wysiwyg/helper/node';
import {
  createTableHead,
  createTableBody,
  createTableRows,
  findCell,
  getRowDepthToRemove,
  getCellDepthToRemove,
  getCellIndexesByCursorIndex,
  getCellPositions,
  findCellIndexByCursor
} from '@/wysiwyg/helper/table';

// @TODO move to common file and change path on markdown
import { createTextSelection } from '@/markdown/helper/manipulation';

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
      const { columns = 1, rows = 1, data = [] } = payload ?? {};
      const { schema, tr, selection } = state;
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

  private removeTable(): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, schema, tr } = state;
      const { $anchor } = selection;
      const { table } = schema.nodes;
      const foundTable = findNodeBy($anchor, ({ type }: ProsemirrorNode) => type === table);

      if (foundTable) {
        const { depth } = foundTable;
        const start = $anchor.before(depth);
        const end = $anchor.after(depth);

        dispatch!(tr.delete(start, end).scrollIntoView());

        return true;
      }

      return false;
    };
  }

  private addColumn(): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, schema, tr } = state;
      const { $from } = selection;
      const { tableHeadCell, tableBodyCell } = schema.nodes;
      const foundCell = findCell(schema, $from);

      if (foundCell) {
        const { depth } = foundCell;
        const table = $from.node(depth - 3);
        const cellIndexes = getCellIndexesByCursorIndex(table, $from.index(depth - 1));
        const cells = getCellPositions(table, $from.before(depth - 3));
        const columnCount = table.child(0).child(0).childCount;

        cellIndexes.forEach(index => {
          const cellType = index < columnCount ? tableHeadCell : tableBodyCell;
          const { nodeStart, nodeSize } = cells[index];
          const start = tr.mapping.map(nodeStart + nodeSize);

          tr.insert(start, cellType.createAndFill());
        });

        dispatch!(tr);

        return true;
      }

      return false;
    };
  }

  private removeColumn(): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, schema, tr } = state;
      const { $from } = selection;
      const depth = getCellDepthToRemove(schema, $from);

      if (depth) {
        const table = $from.node(depth - 3);
        const cellIndexes = getCellIndexesByCursorIndex(table, $from.index(depth - 1));
        const cells = getCellPositions(table, $from.before(depth - 3));
        const trStart = tr.mapping.maps.length;

        cellIndexes.forEach(index => {
          const { nodeStart, nodeSize } = cells[index];
          const start = tr.mapping.slice(trStart).map(nodeStart + 1);

          tr.delete(start, start + nodeSize);
        });

        dispatch!(tr);

        return true;
      }

      return false;
    };
  }

  private addRow(): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, schema, tr } = state;
      const { $from } = selection;
      const { tableRow, tableBody } = schema.nodes;
      const foundRow = findNodeBy(
        $from,
        ({ type }: ProsemirrorNode, depth: number) =>
          type === tableRow && $from.node(depth - 1).type === tableBody
      );

      if (foundRow) {
        const { node, depth } = foundRow;
        const [row] = createTableRows(schema, node.childCount, 1, true);
        const start = $from.after(depth);
        const end = start;

        dispatch!(tr.step(new ReplaceStep(start, end, new Slice(Fragment.from(row), 0, 0))));

        return true;
      }

      return false;
    };
  }

  private removeRow(): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, schema, tr } = state;
      const { $from } = selection;
      const depth = getRowDepthToRemove(schema, $from);

      if (depth) {
        const start = $from.before(depth);
        const end = $from.after(depth);

        dispatch!(tr.step(new ReplaceStep(start, end, Slice.empty)));

        return true;
      }

      return false;
    };
  }

  private alignColumn(): EditorCommand {
    return payload => (state, dispatch) => {
      const { align = 'center' } = payload ?? {};
      const { schema, tr } = state;
      const { $from } = state.selection;
      const foundCell = findCell(schema, $from);

      if (foundCell) {
        const { depth } = foundCell;
        const table = $from.node(depth - 3);
        const cellIndexes = getCellIndexesByCursorIndex(table, $from.index(depth - 1));
        const cells = getCellPositions(table, $from.start(depth - 3));

        cellIndexes.forEach(index => {
          const { nodeStart } = cells[index];
          const { pos } = $from.node(0).resolve(nodeStart);

          tr.setNodeMarkup(pos, null!, { align });
        });

        dispatch!(tr);

        return true;
      }

      return false;
    };
  }

  private moveToNextCell(): EditorCommand {
    return () => (state, dispatch) => {
      const { schema, tr } = state;
      const { $from } = state.selection;
      const foundCell = findCell(schema, $from);

      if (foundCell) {
        const { depth } = foundCell;
        const table = $from.node(depth - 3);
        const cellIndex = findCellIndexByCursor(schema, $from, depth);
        const cells = getCellPositions(table, $from.start(depth - 3));

        const nextIndex = cells.length - 1 === cellIndex ? cellIndex : cellIndex + 1;
        const { nodeStart, nodeSize } = cells[nextIndex];
        const from = nodeStart + nodeSize - 1;
        const selection = createTextSelection(tr, from, from);

        dispatch!(tr.setSelection(selection).scrollIntoView());

        return true;
      }

      return false;
    };
  }

  private moveToPrevCell(): EditorCommand {
    return () => (state, dispatch) => {
      const { schema, tr } = state;
      const { $from } = state.selection;
      const foundCell = findCell(schema, $from);

      if (foundCell) {
        const { depth } = foundCell;
        const table = $from.node(depth - 3);
        const cellIndex = findCellIndexByCursor(schema, $from, depth);
        const cells = getCellPositions(table, $from.start(depth - 3));

        const prevIndex = cells.length - 1 === 0 ? cellIndex : cellIndex - 1;
        const { nodeStart } = cells[prevIndex];
        const from = nodeStart + 1;
        const selection = createTextSelection(tr, from, from);

        dispatch!(tr.setSelection(selection).scrollIntoView());

        return true;
      }

      return false;
    };
  }

  commands() {
    return {
      addTable: this.addTable(),
      removeTable: this.removeTable(),
      addColumn: this.addColumn(),
      removeColumn: this.removeColumn(),
      addRow: this.addRow(),
      removeRow: this.removeRow(),
      alignColumn: this.alignColumn(),
      moveToNextCell: this.moveToNextCell(),
      moveToPrevCell: this.moveToPrevCell()
    };
  }
}
