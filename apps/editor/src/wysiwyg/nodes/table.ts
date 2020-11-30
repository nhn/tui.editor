import { DOMOutputSpecArray, Node as ProsemirrorNode, Fragment, Slice } from 'prosemirror-model';
import { ReplaceStep } from 'prosemirror-transform';
import { TextSelection } from 'prosemirror-state';

import Node from '@/spec/node';
import { isInTableNode, findNodeBy } from '@/wysiwyg/helper/node';
import {
  createTableRows,
  findCell,
  findCellIndexByCursor,
  getCellPosition,
  getAllCellPositions,
  getColumnCount,
  getCellIndexesByCursorRange,
  getResolvedSelection,
  getTableByCellPos,
  getPositionsToAddRow,
  getPositionsToRemoveRow,
  getRowCountByRange
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
      const { schema, selection } = state;
      const { from, to, $from } = selection;
      const collapsed = from === to;

      if (collapsed && !isInTableNode(schema, $from)) {
        const { tableHead, tableBody } = schema.nodes;
        const tableHeadRows = createTableRows(schema, columns, 1, false, data);
        const tableBodyRows = createTableRows(schema, columns, rows, true, data);
        const table = schema.nodes.table.create(null, [
          tableHead.create(null, tableHeadRows),
          tableBody.create(null, tableBodyRows)
        ]);

        let { tr } = state;

        tr = tr.replaceSelectionWith(table).scrollIntoView();

        const cursorPos = TextSelection.near(tr.doc.resolve(from + 1));

        dispatch!(tr.setSelection(cursorPos));

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
        const start = head.before(depth);
        const end = head.after(depth);
        const cursorPos = createTextSelection(tr.delete(start, end), start);

        dispatch!(tr.setSelection(cursorPos).scrollIntoView());

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
        const { depth } = head;
        const table = head.node(depth - 2);

        const [startRowIndex, startColumnIndex] = getCellPosition(anchor);
        const [endRowIndex, endColumnIndex] = getCellPosition(head);

        const cellIndexes = getCellIndexesByCursorRange(
          table,
          [startRowIndex, startColumnIndex],
          [endRowIndex, endColumnIndex]
        );
        const columnCount = getColumnCount(table);

        const cells = getAllCellPositions(head);

        const addedCellCount =
          startRowIndex !== endRowIndex
            ? anchor.index() + 1
            : endColumnIndex - startColumnIndex + 1;

        cellIndexes.forEach(index => {
          const cellType = index < columnCount ? tableHeadCell : tableBodyCell;
          const { nodeStart, nodeSize } = cells[index];
          const start = tr.mapping.map(nodeStart + nodeSize);
          const addedCells = [];

          for (let i = 0, len = addedCellCount; i < len; i += 1) {
            addedCells.push(cellType.createAndFill());
          }

          tr.insert(start, addedCells);
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
        const { depth } = head;
        const table = head.node(depth - 2);

        const [startRowIndex, startColumnIndex] = getCellPosition(anchor);
        const [endRowIndex, endColumnIndex] = getCellPosition(head);

        const cellIndexes = getCellIndexesByCursorRange(
          table,
          [startRowIndex, startColumnIndex],
          [endRowIndex, endColumnIndex]
        );
        const cells = getAllCellPositions(head);

        const removedCellCount =
          startRowIndex !== endRowIndex ? 0 : endColumnIndex - startColumnIndex + 1;

        if (!removedCellCount) {
          return false;
        }

        const trStart = tr.mapping.maps.length;

        cellIndexes.forEach(index => {
          const { nodeStart, nodeSize } = cells[index];
          const start = tr.mapping.slice(trStart).map(nodeStart);

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
      const { anchor, head } = getResolvedSelection(schema, selection);

      if (anchor && head) {
        const table = getTableByCellPos(head);

        const [startRowIndex] = getCellPosition(anchor);
        const [endRowIndex] = getCellPosition(head);

        const [start, end] = getPositionsToAddRow(head, startRowIndex, endRowIndex);
        const columnCount = getColumnCount(table);
        const rowCount = getRowCountByRange(startRowIndex, endRowIndex);
        const rows = createTableRows(schema, columnCount, rowCount, true);

        dispatch!(tr.step(new ReplaceStep(start, end, new Slice(Fragment.from(rows), 0, 0))));

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
        const [startRowIndex] = getCellPosition(anchor);
        const [endRowIndex] = getCellPosition(head);

        const [start, end] = getPositionsToRemoveRow(anchor, head, startRowIndex, endRowIndex);

        if (start && end) {
          dispatch!(tr.step(new ReplaceStep(start, end, Slice.empty)));

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
        const { depth } = head;
        const table = head.node(depth - 2);

        const start = getCellPosition(anchor);
        const end = getCellPosition(head);

        const cellIndexes = getCellIndexesByCursorRange(table, start, end);
        const cells = getAllCellPositions(head);

        cellIndexes.forEach(index => {
          const { nodeStart } = cells[index];
          const { pos } = head.node(0).resolve(nodeStart);

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
      const { schema, tr } = state;
      const { $from } = state.selection;
      const foundCell = findCell(schema, $from);

      if (foundCell) {
        const { depth } = foundCell;
        const cellIndex = findCellIndexByCursor(schema, $from, depth);
        const cells = getAllCellPositions($from);

        let from;

        if (direction === 'next') {
          const nextIndex = cells.length - 1 === cellIndex ? cellIndex : cellIndex + 1;
          const { nodeStart, nodeSize } = cells[nextIndex];

          from = nodeStart + nodeSize - 1;
        } else {
          const prevIndex = cells.length - 1 === 0 ? cellIndex : cellIndex - 1;
          const { nodeStart } = cells[prevIndex];

          from = nodeStart + 1;
        }

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
      moveToNextCell: this.moveToCell('next'),
      moveToPrevCell: this.moveToCell('prev')
    };
  }
}
