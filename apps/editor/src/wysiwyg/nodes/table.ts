import { DOMOutputSpecArray, Node as ProsemirrorNode, Fragment, Slice } from 'prosemirror-model';
import { ReplaceStep } from 'prosemirror-transform';

import Node from '@/spec/node';
import { isInTableNode, findNodeBy } from '@/wysiwyg/helper/node';
import {
  createTableRows,
  createCellsToAdd,
  judgeToRemoveCells,
  getCellIndexInfo,
  getAllCellPosInfoList,
  getColumnCount,
  getRowCount,
  getCountByRange,
  getCellIndexesByRange,
  getResolvedSelection,
  getTableByCellPos,
  getPositionsToAddRow,
  getPositionsToRemoveRow
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
    return (payload = { columns: 1, rows: 1, data: [] }) => (state, dispatch) => {
      const { columns, rows, data } = payload;
      const { schema, selection, tr } = state;
      const { from, to, $from } = selection;
      const collapsed = from === to;

      if (collapsed && !isInTableNode($from)) {
        const { tableHead, tableBody } = schema.nodes;
        const tableHeadRows = createTableRows(columns, 1, schema, false, data);
        const tableBodyRows = createTableRows(columns, rows, schema, true, data);
        const table = schema.nodes.table.create(null, [
          tableHead.create(null, tableHeadRows),
          tableBody.create(null, tableBodyRows)
        ]);

        dispatch!(tr.replaceSelectionWith(table));

        return true;
      }

      return false;
    };
  }

  private removeTable(): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, schema, tr } = state;
      const { head } = getResolvedSelection(selection);
      const { table } = schema.nodes;
      const foundTable = findNodeBy(head, ({ type }: ProsemirrorNode) => type === table);

      if (foundTable) {
        const { depth } = foundTable;
        const startCellPos = head.before(depth);
        const endCellPos = head.after(depth);
        const cursorPos = createTextSelection(tr.delete(startCellPos, endCellPos), startCellPos);

        dispatch!(tr.setSelection(cursorPos));

        return true;
      }

      return false;
    };
  }

  private addColumn(): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, tr, doc } = state;
      const { anchor, head } = getResolvedSelection(selection);

      if (anchor && head) {
        const table = getTableByCellPos(head);

        const startCellPos = getCellIndexInfo(anchor);
        const endCellPos = getCellIndexInfo(head);

        const cellIndexes = getCellIndexesByRange(table, endCellPos, endCellPos);
        const cells = getAllCellPosInfoList(head);

        const columnCount = getColumnCount(table);

        cellIndexes.forEach(index => {
          const { offset, nodeSize } = cells[index];

          const from = tr.mapping.map(offset + nodeSize);
          const cell = doc
            .resolve(offset + 1)
            .node()
            .copy();
          const addedCells = createCellsToAdd(startCellPos, endCellPos, columnCount, cell);

          tr.insert(from, addedCells);
        });

        dispatch!(tr);

        return true;
      }

      return false;
    };
  }

  private removeColumn(): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, tr } = state;
      const { anchor, head } = getResolvedSelection(selection);

      if (anchor && head) {
        const table = getTableByCellPos(head);

        const startCellPos = getCellIndexInfo(anchor);
        const endCellPos = getCellIndexInfo(head);
        const columnCount = getColumnCount(table);

        if (!judgeToRemoveCells(startCellPos, endCellPos, columnCount)) {
          return false;
        }

        const cellIndexes = getCellIndexesByRange(table, startCellPos, endCellPos);
        const cells = getAllCellPosInfoList(head);

        const startPos = tr.mapping.maps.length;

        cellIndexes.forEach(index => {
          const { offset, nodeSize } = cells[index];
          const from = tr.mapping.slice(startPos).map(offset);
          const to = from + nodeSize;

          tr.delete(from, to);
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
      const { anchor, head } = getResolvedSelection(selection);

      if (anchor && head) {
        const table = getTableByCellPos(head);

        const [startRowIndex] = getCellIndexInfo(anchor);
        const [endRowIndex] = getCellIndexInfo(head);

        const [from, to] = getPositionsToAddRow(head, startRowIndex, endRowIndex);
        const columnCount = getColumnCount(table);
        const rowCount = getCountByRange(startRowIndex, endRowIndex);
        const rows = createTableRows(columnCount, rowCount, schema, true);

        dispatch!(tr.step(new ReplaceStep(from, to, new Slice(Fragment.from(rows), 0, 0))));

        return true;
      }

      return false;
    };
  }

  private removeRow(): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, tr } = state;
      const { anchor, head } = getResolvedSelection(selection);

      if (anchor && head) {
        const table = getTableByCellPos(head);

        const rowCount = getRowCount(table);
        const [from, to] = getPositionsToRemoveRow(anchor, head, rowCount);

        if (from && to) {
          dispatch!(tr.step(new ReplaceStep(from, to, Slice.empty)));

          return true;
        }
      }

      return false;
    };
  }

  private alignColumn(): EditorCommand {
    return (payload = { align: 'center' }) => (state, dispatch) => {
      const { align } = payload;
      const { selection, tr, doc } = state;
      const { anchor, head } = getResolvedSelection(selection);

      if (anchor && head) {
        const table = getTableByCellPos(head);

        const startCellPos = getCellIndexInfo(anchor);
        const endCellPos = getCellIndexInfo(head);

        const cellIndexes = getCellIndexesByRange(table, startCellPos, endCellPos);
        const cells = getAllCellPosInfoList(head);

        cellIndexes.forEach(index => {
          const { pos } = doc.resolve(cells[index].offset);

          tr.setNodeMarkup(pos, null, { align });
        });

        dispatch!(tr);

        return true;
      }

      return false;
    };
  }

  private moveToCell(direction: number): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, tr } = state;
      const { anchor, head } = getResolvedSelection(selection);

      if (anchor && head) {
        const table = getTableByCellPos(head);

        const cells = getAllCellPosInfoList(head);
        const cellCount = cells.length - 1;

        const [rowIndex, columnIndex] = getCellIndexInfo(head);
        const columnCount = getColumnCount(table);

        let index = rowIndex * columnCount + columnIndex;

        const firstCell = direction === 1 && index === cellCount;
        const lastCell = direction === -1 && index === 0;

        if (!firstCell && !lastCell) {
          index += direction;
        }

        const { offset, nodeSize } = cells[index];
        const from = offset + nodeSize - 1;

        dispatch!(tr.setSelection(createTextSelection(tr, from, from)).scrollIntoView());

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
      alignColumn: this.alignColumn()
    };
  }

  keymaps() {
    return {
      Tab: this.moveToCell(1)(),
      'Shift-Tab': this.moveToCell(-1)()
    };
  }
}
