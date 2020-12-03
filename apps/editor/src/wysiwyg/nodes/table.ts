import { DOMOutputSpecArray, Node as ProsemirrorNode, Fragment, Slice } from 'prosemirror-model';
import { ReplaceStep } from 'prosemirror-transform';

import Node from '@/spec/node';
import { isInTableNode, findNodeBy } from '@/wysiwyg/helper/node';
import {
  createTableRows,
  createCellsToAdd,
  isToRemoveCells,
  getCellPosition,
  getAllCellPositionInfos,
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

type CursorMoveDirection = 'next' | 'prev';

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

      if (collapsed && !isInTableNode(schema, $from)) {
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
      const { head } = getResolvedSelection(schema, selection);
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
      const { selection, schema, tr } = state;
      const { tableHeadCell, tableBodyCell } = schema.nodes;
      const { anchor, head } = getResolvedSelection(schema, selection);

      if (anchor && head) {
        const table = getTableByCellPos(head);

        const startCellPos = getCellPosition(anchor);
        const endCellPos = getCellPosition(head);

        const cellIndexes = getCellIndexesByRange(table, endCellPos, endCellPos);
        const cells = getAllCellPositionInfos(head);

        const columnCount = getColumnCount(table);

        cellIndexes.forEach(index => {
          const { offset, nodeSize } = cells[index];

          const startPos = tr.mapping.map(offset + nodeSize);
          const cellType = index < columnCount ? tableHeadCell : tableBodyCell;
          const addedCells = createCellsToAdd(startCellPos, endCellPos, columnCount, cellType);

          tr.insert(startPos, addedCells);
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
      const { anchor, head } = getResolvedSelection(schema, selection);

      if (anchor && head) {
        const table = getTableByCellPos(head);

        const startCellPos = getCellPosition(anchor);
        const endCellPos = getCellPosition(head);
        const columnCount = getColumnCount(table);

        if (!isToRemoveCells(startCellPos, endCellPos, columnCount)) {
          return false;
        }

        const cellIndexes = getCellIndexesByRange(table, startCellPos, endCellPos);
        const cells = getAllCellPositionInfos(head);

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
      const { anchor, head } = getResolvedSelection(schema, selection);

      if (anchor && head) {
        const table = getTableByCellPos(head);

        const [startRowIndex] = getCellPosition(anchor);
        const [endRowIndex] = getCellPosition(head);

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
      const { selection, schema, tr } = state;
      const { anchor, head } = getResolvedSelection(schema, selection);

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
      const { selection, schema, tr } = state;
      const { anchor, head } = getResolvedSelection(schema, selection);

      if (anchor && head) {
        const table = getTableByCellPos(head);

        const startCellPos = getCellPosition(anchor);
        const endCellPos = getCellPosition(head);

        const cellIndexes = getCellIndexesByRange(table, startCellPos, endCellPos);
        const cells = getAllCellPositionInfos(head);

        cellIndexes.forEach(index => {
          const { offset } = cells[index];
          const { pos } = head.node(0).resolve(offset);

          tr.setNodeMarkup(pos, null!, { align });
        });

        dispatch!(tr);

        return true;
      }

      return false;
    };
  }

  private moveToCell(direction: CursorMoveDirection): EditorCommand {
    return () => (state, dispatch) => {
      const { schema, selection, tr } = state;
      const { anchor, head } = getResolvedSelection(schema, selection);

      if (anchor && head) {
        const table = getTableByCellPos(head);

        const cells = getAllCellPositionInfos(head);
        const cellCount = cells.length - 1;

        const [rowIndex, columnIndex] = getCellPosition(head);
        const columnCount = getColumnCount(table);

        let index = rowIndex * columnCount + columnIndex;

        if (direction === 'next') {
          index = cellCount === index ? index : index + 1;
        } else {
          index = cellCount === 0 ? index : index - 1;
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
      Tab: this.moveToCell('next')(),
      'Shift-Tab': this.moveToCell('prev')()
    };
  }
}
