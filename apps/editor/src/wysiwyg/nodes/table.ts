import { DOMOutputSpecArray, Node as ProsemirrorNode, Fragment, Slice } from 'prosemirror-model';
import { ReplaceStep } from 'prosemirror-transform';
import { TextSelection } from 'prosemirror-state';
import { Command } from 'prosemirror-commands';

import NodeSchema from '@/spec/node';
import { isInTableNode, findNodeBy, createDOMInfoParsedRawHTML } from '@/wysiwyg/helper/node';

// @TODO Separate the clipboard and command file, leaving only those commonly used in `helper/table`.
import {
  CellInfo,
  createTableHeadRow,
  createTableBodyRows,
  createDummyCells,
  getResolvedSelection,
  getSelectionInfo,
  getTableCellsInfo,
  getCellIndexInfo,
  getNextRowOffset,
  getPrevRowOffset,
  getNextColumnOffsets,
  getPrevColumnOffsets,
  getRightCellOffset,
  getLeftCellOffset,
  getUpCellOffset,
  getDownCellOffset,
} from '@/wysiwyg/helper/table';
import {
  CursorDirection,
  canBeOutOfTable,
  canMoveBetweenCells,
  canSelectTable,
  selectNode,
  addParagraphBeforeAfterTable,
  moveToCell,
} from '@/wysiwyg/command/table';

import { createTextSelection } from '@/helper/manipulation';

import { EditorCommand } from '@t/spec';
import { ColumnAlign } from '@t/wysiwyg';

interface AddTablePayload {
  rowCount: number;
  columnCount: number;
  data: string[];
}

interface AlignColumnPayload {
  align: ColumnAlign;
}

type CellOffsetFn = ([rowIndex, columnIndex]: number[], cellsInfo: CellInfo[][]) => number | null;

type CellOffsetFnMap = {
  [key in CursorDirection]: CellOffsetFn;
};

const cellOffsetFnMap: CellOffsetFnMap = {
  left: getLeftCellOffset,
  right: getRightCellOffset,
  up: getUpCellOffset,
  down: getDownCellOffset,
};

export class Table extends NodeSchema {
  get name() {
    return 'table';
  }

  get defaultSchema() {
    return {
      content: 'tableHead{1} tableBody{1}',
      group: 'block',
      attrs: {
        rawHTML: { default: null },
      },
      parseDOM: [createDOMInfoParsedRawHTML('table')],
      toDOM(): DOMOutputSpecArray {
        return ['table', 0];
      },
    };
  }

  private addTable(): EditorCommand<AddTablePayload> {
    return (payload = { rowCount: 2, columnCount: 1, data: [] }) => (state, dispatch) => {
      const { rowCount, columnCount, data } = payload;
      const { schema, selection, tr } = state;
      const { from, to, $from } = selection;
      const collapsed = from === to;

      if (collapsed && !isInTableNode($from)) {
        const { tableHead, tableBody } = schema.nodes;

        const theadData = data?.slice(0, columnCount);
        const tbodyData = data?.slice(columnCount, data.length);
        const tableHeadRow = createTableHeadRow(columnCount, schema, theadData);
        const tableBodyRows = createTableBodyRows(rowCount - 1, columnCount, schema, tbodyData);
        const table = schema.nodes.table.create(null, [
          tableHead.create(null, tableHeadRow),
          tableBody.create(null, tableBodyRows),
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

  private addColumn(direction = 1): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, tr, schema } = state;
      const { anchor, head } = getResolvedSelection(selection);

      if (anchor && head) {
        const selectionInfo = getSelectionInfo(anchor, head);
        const cellsInfo = getTableCellsInfo(anchor);
        const { columnCount } = selectionInfo;
        const allRowCount = cellsInfo.length;

        for (let rowIndex = 0; rowIndex < allRowCount; rowIndex += 1) {
          const { mapOffset } =
            direction === 1
              ? getNextColumnOffsets(rowIndex, selectionInfo, cellsInfo)
              : getPrevColumnOffsets(rowIndex, selectionInfo, cellsInfo);

          const from = tr.mapping.map(mapOffset);
          const cells = createDummyCells(columnCount, rowIndex, schema);

          tr.insert(from, cells);
        }

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
        const selectionInfo = getSelectionInfo(anchor, head);
        const cellsInfo = getTableCellsInfo(anchor);
        const { startColumnIndex, columnCount } = selectionInfo;
        const allColumnCount = cellsInfo[0].length;

        const selectedAllColumn = columnCount === allColumnCount;

        if (selectedAllColumn) {
          return false;
        }

        const allRowCount = cellsInfo.length;
        const mapOffset = tr.mapping.maps.length;

        for (let i = 0; i < allRowCount; i += 1) {
          for (let j = 0; j < columnCount; j += 1) {
            const { offset, nodeSize } = cellsInfo[i][j + startColumnIndex];

            const from = tr.mapping.slice(mapOffset).map(offset);
            const to = from + nodeSize;

            tr.delete(from, to);
          }
        }

        dispatch!(tr);

        return true;
      }

      return false;
    };
  }

  private addRow(direction = 1): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, schema, tr } = state;
      const { anchor, head } = getResolvedSelection(selection);

      if (anchor && head) {
        const selectionInfo = getSelectionInfo(anchor, head);
        const cellsInfo = getTableCellsInfo(anchor);
        const { rowCount } = selectionInfo;
        const allColumnCount = cellsInfo[0].length;
        const from =
          direction === 1
            ? getNextRowOffset(selectionInfo, cellsInfo)
            : getPrevRowOffset(selectionInfo, cellsInfo);

        if (from > -1) {
          const rows = createTableBodyRows(rowCount, allColumnCount, schema);

          dispatch!(tr.step(new ReplaceStep(from, from, new Slice(Fragment.from(rows), 0, 0))));

          return true;
        }
      }

      return false;
    };
  }

  private removeRow(): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, tr } = state;
      const { anchor, head } = getResolvedSelection(selection);

      if (anchor && head) {
        const selectionInfo = getSelectionInfo(anchor, head);
        const cellsInfo = getTableCellsInfo(anchor);
        const { startRowIndex, rowCount } = selectionInfo;
        const allRowCount = cellsInfo.length;

        const selectedThead = startRowIndex === 0;
        const selectedAllTbodyRow = rowCount === allRowCount - 1;

        if (selectedThead || selectedAllTbodyRow) {
          return false;
        }

        const from = cellsInfo[startRowIndex][0].offset - 1;

        const rowIdx = startRowIndex + rowCount - 1;
        const colIdx = cellsInfo[0].length - 1;
        const { offset, nodeSize } = cellsInfo[rowIdx][colIdx];
        const to = offset + nodeSize + 1;

        dispatch!(tr.step(new ReplaceStep(from, to, Slice.empty)));

        return true;
      }

      return false;
    };
  }

  private alignColumn(): EditorCommand<AlignColumnPayload> {
    return (payload = { align: 'center' }) => (state, dispatch) => {
      const { align } = payload;
      const { selection, tr } = state;
      const { anchor, head } = getResolvedSelection(selection);

      if (anchor && head) {
        const selectionInfo = getSelectionInfo(anchor, head);
        const cellsInfo = getTableCellsInfo(anchor);
        const { startColumnIndex, columnCount } = selectionInfo;
        const allRowCount = cellsInfo.length;

        for (let i = 0; i < allRowCount; i += 1) {
          for (let j = 0; j < columnCount; j += 1) {
            const { offset } = cellsInfo[i][j + startColumnIndex];

            tr.setNodeMarkup(offset, null, { align });
          }
        }

        dispatch!(tr);

        return true;
      }

      return false;
    };
  }

  private moveToCell(direction: CursorDirection): Command {
    return (state, dispatch) => {
      const { selection, tr } = state;
      const { anchor, head } = getResolvedSelection(selection);

      if (anchor && head) {
        const cellsInfo = getTableCellsInfo(anchor);
        const cellIndex = getCellIndexInfo(anchor);

        const cellOffsetFn = cellOffsetFnMap[direction];
        const offset = cellOffsetFn(cellIndex, cellsInfo);

        if (offset) {
          dispatch!(tr.setSelection(createTextSelection(tr, offset)));

          return true;
        }
      }

      return false;
    };
  }

  private moveInCell(direction: CursorDirection): Command {
    return (state, dispatch) => {
      const { selection, tr, doc, schema } = state;
      const { $from } = selection;
      const { view } = this.context;

      if (!view.endOfTextblock(direction)) {
        return false;
      }

      const cell = findNodeBy(
        $from,
        ({ type }) => type.name === 'tableHeadCell' || type.name === 'tableBodyCell'
      );

      if (cell) {
        const para = findNodeBy($from, ({ type }) => type.name === 'paragraph');

        if (para) {
          const { depth: cellDepth } = cell;
          const { depth: paraDepth } = para;

          if (!canMoveBetweenCells(direction, [cellDepth, paraDepth], $from, doc)) {
            return false;
          }

          const { anchor } = getResolvedSelection(selection);
          const cellIndex = getCellIndexInfo(anchor);
          const cellsInfo = getTableCellsInfo(anchor);

          let newTr;

          if (canSelectTable(direction, cellsInfo, cellIndex, $from, paraDepth)) {
            // When the cursor position is at the end of the cell,
            // the table is selected when the left / right arrow keys are pressed.
            newTr = selectNode(tr, $from, cellDepth);
          } else if (canBeOutOfTable(direction, cellsInfo, cellIndex[0])) {
            // When there is no content before or after the table,
            // an empty line('paragraph') is created by pressing the arrow keys.
            newTr = addParagraphBeforeAfterTable(direction, tr, cellsInfo, schema);
          } else {
            newTr = moveToCell(direction, tr, cellIndex, cellsInfo);
          }

          if (newTr) {
            dispatch!(newTr);

            return true;
          }
        }
      }

      return false;
    };
  }

  private deleteCells(): Command {
    return (state, dispatch) => {
      const { schema, selection, tr } = state;
      const { anchor, head } = getResolvedSelection(selection);
      const textSelection = selection instanceof TextSelection;

      if (anchor && head && !textSelection) {
        const selectionInfo = getSelectionInfo(anchor, head);
        const cellsInfo = getTableCellsInfo(anchor);
        const { startColumnIndex, columnCount } = selectionInfo;

        const tableRowCount = cellsInfo.length;

        for (let rowIndex = 0; rowIndex < tableRowCount; rowIndex += 1) {
          const startCellOffset = cellsInfo[rowIndex][startColumnIndex];
          const endCellOffset = cellsInfo[rowIndex][startColumnIndex + columnCount - 1];
          const cells = createDummyCells(columnCount, rowIndex, schema);

          tr.replace(
            tr.mapping.map(startCellOffset.offset),
            tr.mapping.map(endCellOffset.offset + endCellOffset.nodeSize),
            new Slice(Fragment.from(cells), 0, 0)
          );
        }

        dispatch!(tr);

        return true;
      }

      return false;
    };
  }

  commands() {
    return {
      addTable: this.addTable(),
      removeTable: this.removeTable(),
      addColumnToRight: this.addColumn(1),
      addColumnToLeft: this.addColumn(-1),
      removeColumn: this.removeColumn(),
      addRowToDown: this.addRow(1),
      addRowToUp: this.addRow(-1),
      removeRow: this.removeRow(),
      alignColumn: this.alignColumn(),
    };
  }

  keymaps() {
    const deleteCellsCommand = this.deleteCells();

    return {
      Tab: this.moveToCell('right'),
      'Shift-Tab': this.moveToCell('left'),

      ArrowUp: this.moveInCell('up'),
      ArrowDown: this.moveInCell('down'),

      ArrowLeft: this.moveInCell('left'),
      ArrowRight: this.moveInCell('right'),

      Backspace: deleteCellsCommand,
      'Mod-Backspace': deleteCellsCommand,
      Delete: deleteCellsCommand,
      'Mod-Delete': deleteCellsCommand,
    };
  }
}
