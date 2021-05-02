import { DOMOutputSpecArray, Node as ProsemirrorNode } from 'prosemirror-model';
import { TextSelection, Transaction } from 'prosemirror-state';
import { Command } from 'prosemirror-commands';

import NodeSchema from '@/spec/node';
import { isInTableNode, findNodeBy, createDOMInfoParsedRawHTML } from '@/wysiwyg/helper/node';

import {
  createTableHeadRow,
  createTableBodyRows,
  createDummyCells,
  getResolvedSelection,
  getRowAndColumnCount,
  setAttrs,
} from '@/wysiwyg/helper/table';
import {
  CursorDirection,
  canBeOutOfTable,
  canMoveBetweenCells,
  canSelectTableNode,
  selectNode,
  addParagraphBeforeTable,
  addParagraphAfterTable,
  moveToCell,
} from '@/wysiwyg/command/table';

import { createTextSelection } from '@/helper/manipulation';

import { EditorCommand } from '@t/spec';
import { ColumnAlign } from '@t/wysiwyg';
import { SelectionInfo, TableOffsetMap } from '@/wysiwyg/helper/tableOffsetMap';

interface AddTablePayload {
  rowCount: number;
  columnCount: number;
  data: string[];
}

interface AlignColumnPayload {
  align: ColumnAlign;
}

// eslint-disable-next-line no-shadow
const enum Direction {
  LEFT = 1,
  RIGHT = 2,
  UP = 3,
  DOWN = 4,
}

type ColDirection = Direction.LEFT | Direction.RIGHT;
type RowDirection = Direction.UP | Direction.DOWN;

function getTargetColInfo(
  direction: ColDirection,
  map: TableOffsetMap,
  selectionInfo: SelectionInfo
) {
  let targetColIdx: number;
  let judgeToExtendColspan: (rowIdx: number) => boolean;
  let insertColIdx: number;

  if (direction === Direction.LEFT) {
    targetColIdx = selectionInfo.startColIdx;
    judgeToExtendColspan = (rowIdx: number) => map.extendedColspan(rowIdx, targetColIdx);
    insertColIdx = targetColIdx;
  } else {
    targetColIdx = selectionInfo.endColIdx;
    judgeToExtendColspan = (rowIdx: number) => map.getColspanCount(rowIdx, targetColIdx) > 1;
    insertColIdx = targetColIdx + 1;
  }

  return { targetColIdx, judgeToExtendColspan, insertColIdx };
}

function getTargetRowInfo(
  direction: RowDirection,
  map: TableOffsetMap,
  selectionInfo: SelectionInfo
) {
  let targetRowIdx: number;
  let judgeToExtendRowspan: (rowIdx: number) => boolean;
  let insertColIdx: number;
  let nodeSize: number;

  if (direction === Direction.UP) {
    targetRowIdx = selectionInfo.startRowIdx;
    judgeToExtendRowspan = (colIdx: number) => map.extendedRowspan(targetRowIdx, colIdx);
    insertColIdx = 0;
    nodeSize = -1;
  } else {
    targetRowIdx = selectionInfo.endRowIdx;
    judgeToExtendRowspan = (colIdx: number) => map.getRowspanCount(targetRowIdx, colIdx) > 1;
    insertColIdx = map.totalColumnCount - 1;
    nodeSize = !map.extendedRowspan(targetRowIdx, insertColIdx)
      ? map.getCellInfo(targetRowIdx, insertColIdx).nodeSize + 1
      : 2;
  }
  return { targetRowIdx, judgeToExtendRowspan, insertColIdx, nodeSize };
}

function getRowRanges(map: TableOffsetMap, rowIdx: number, totalColumnCount: number) {
  let from = Number.MAX_VALUE;
  let to = 0;

  for (let colIdx = 0; colIdx < totalColumnCount; colIdx += 1) {
    if (!map.extendedRowspan(rowIdx, colIdx)) {
      const { offset, nodeSize } = map.getCellInfo(rowIdx, colIdx);

      from = Math.min(from, offset);
      to = Math.max(to, offset + nodeSize);
    }
  }
  return { from, to };
}

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
      const { selection, tr } = state;
      const map = TableOffsetMap.create(selection.$anchor);

      if (map) {
        const { tableStartOffset, tableEndOffset } = map;
        const cursorPos = createTextSelection(
          tr.delete(tableStartOffset, tableEndOffset),
          tableStartOffset
        );

        dispatch!(tr.setSelection(cursorPos));
        return true;
      }
      return false;
    };
  }

  private addColumn(direction: ColDirection): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, tr, schema } = state;
      const { anchor, head } = getResolvedSelection(selection);

      if (anchor && head) {
        const map = TableOffsetMap.create(anchor)!;
        const selectionInfo = map.getRectOffsets(anchor, head);

        const { targetColIdx, judgeToExtendColspan, insertColIdx } = getTargetColInfo(
          direction,
          map,
          selectionInfo
        );

        const { columnCount } = getRowAndColumnCount(selectionInfo);
        const { totalRowCount } = map;

        for (let rowIdx = 0; rowIdx < totalRowCount; rowIdx += 1) {
          if (judgeToExtendColspan(rowIdx)) {
            const { node, pos } = map.getColspanStartInfo(rowIdx, targetColIdx)!;
            const attrs = setAttrs(node, { colspan: node.attrs.colspan + columnCount });

            tr.setNodeMarkup(tr.mapping.map(pos), null, attrs);
          } else {
            const cells = createDummyCells(columnCount, rowIdx, schema);

            tr.insert(tr.mapping.map(map.posAt(rowIdx, insertColIdx)), cells);
          }
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
        const map = TableOffsetMap.create(anchor)!;
        const selectionInfo = map.getRectOffsets(anchor, head);

        const { totalColumnCount, totalRowCount } = map;
        const { columnCount } = getRowAndColumnCount(selectionInfo);
        const selectedAllColumn = columnCount === totalColumnCount;

        if (selectedAllColumn) {
          return false;
        }

        const { startColIdx, endColIdx } = selectionInfo;
        const mapStart = tr.mapping.maps.length;

        for (let rowIdx = 0; rowIdx < totalRowCount; rowIdx += 1) {
          for (let colIdx = endColIdx; colIdx >= startColIdx; colIdx -= 1) {
            const { offset, nodeSize } = map.getCellInfo(rowIdx, colIdx);
            const colspanInfo = map.getColspanStartInfo(rowIdx, colIdx)!;

            if (colspanInfo?.count > 1) {
              const { node, pos } = map.getColspanStartInfo(rowIdx, colIdx)!;
              const colspan = map.decreaseColspanCount(rowIdx, colIdx);
              const attrs = setAttrs(node, { colspan });

              tr.setNodeMarkup(tr.mapping.slice(mapStart).map(pos), null, attrs);
            } else if (!map.extendedRowspan(rowIdx, colIdx)) {
              const from = tr.mapping.slice(mapStart).map(offset);
              const to = from + nodeSize;

              tr.delete(from, to);
            }
          }
        }
        dispatch!(tr);
        return true;
      }
      return false;
    };
  }

  private addRow(direction: Direction.UP | Direction.DOWN): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, schema, tr } = state;
      const { anchor, head } = getResolvedSelection(selection);

      if (anchor && head) {
        const map = TableOffsetMap.create(anchor)!;
        const { totalColumnCount } = map;
        const selectionInfo = map.getRectOffsets(anchor, head);
        const { rowCount } = getRowAndColumnCount(selectionInfo);
        const { targetRowIdx, judgeToExtendRowspan, insertColIdx, nodeSize } = getTargetRowInfo(
          direction,
          map,
          selectionInfo
        );
        const selectedOnlyThead = targetRowIdx === 0 && rowCount === 1;

        if (!selectedOnlyThead) {
          const rows: ProsemirrorNode[] = [];
          const from = tr.mapping.map(map.posAt(targetRowIdx, insertColIdx)) + nodeSize;
          let cells: ProsemirrorNode[] = [];

          for (let colIdx = 0; colIdx < totalColumnCount; colIdx += 1) {
            if (judgeToExtendRowspan(colIdx)) {
              const { node, pos } = map.getRowspanStartInfo(targetRowIdx, colIdx)!;
              const attrs = setAttrs(node, { rowspan: node.attrs.rowspan + rowCount });

              tr.setNodeMarkup(tr.mapping.map(pos), null, attrs);
            } else {
              cells = cells.concat(createDummyCells(1, targetRowIdx, schema));
            }
          }

          for (let i = 0; i < rowCount; i += 1) {
            rows.push(schema.nodes.tableRow.create(null, cells));
          }
          dispatch!(tr.insert(from, rows));
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
        let map = TableOffsetMap.create(anchor)!;
        const { totalRowCount, totalColumnCount } = map;
        const selectionInfo = map.getRectOffsets(anchor, head);
        const { rowCount } = getRowAndColumnCount(selectionInfo);
        const { startRowIdx, endRowIdx } = selectionInfo;

        const selectedThead = startRowIdx === 0;
        const selectedAllTbodyRow = rowCount === totalRowCount - 1;

        if (selectedAllTbodyRow || selectedThead) {
          return false;
        }

        for (let rowIdx = endRowIdx; rowIdx >= startRowIdx; rowIdx -= 1) {
          const mapStart = tr.mapping.maps.length;
          const { from, to } = getRowRanges(map, rowIdx, totalColumnCount);

          tr.delete(from - 1, to + 1);

          for (let colIdx = 0; colIdx < totalColumnCount; colIdx += 1) {
            const rowspanInfo = map.getRowspanStartInfo(rowIdx, colIdx)!;

            if (rowspanInfo?.count > 1 && !map.extendedColspan(rowIdx, colIdx)) {
              if (map.extendedRowspan(rowIdx, colIdx)) {
                const { node, pos } = map.getRowspanStartInfo(rowIdx, colIdx)!;
                const rowspan = map.decreaseRowspanCount(rowIdx, colIdx);
                const attrs = setAttrs(node, { rowspan });

                tr.setNodeMarkup(tr.mapping.slice(mapStart).map(pos), null, attrs);
              } else if (!map.extendedRowspan(rowIdx, colIdx)) {
                const { node, count } = map.getRowspanStartInfo(rowIdx, colIdx)!;
                const attrs = setAttrs(node, { rowspan: count - 1 });
                const copiedCell = node.type.create(attrs, node.content);

                tr.insert(
                  tr.mapping.slice(mapStart).map(map.posAt(rowIdx + 1, colIdx)),
                  copiedCell
                );
              }
            }
          }
          map = TableOffsetMap.create(tr.doc.resolve(map.tableStartOffset))!;
        }
        dispatch!(tr);
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
        const map = TableOffsetMap.create(anchor)!;
        const { totalRowCount } = map;
        const selectionInfo = map.getRectOffsets(anchor, head);
        const { startColIdx, endColIdx } = selectionInfo;

        for (let rowIdx = 0; rowIdx < totalRowCount; rowIdx += 1) {
          for (let colIdx = startColIdx; colIdx <= endColIdx; colIdx += 1) {
            if (!map.extendedRowspan(rowIdx, colIdx) && !map.extendedColspan(rowIdx, colIdx)) {
              const { node, pos } = map.getNodeAndPos(rowIdx, colIdx);
              const attrs = setAttrs(node, { align });

              tr.setNodeMarkup(pos, null, attrs);
            }
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
      const { selection, tr, schema } = state;
      const { anchor, head } = getResolvedSelection(selection);

      if (anchor && head) {
        const map = TableOffsetMap.create(anchor)!;
        const cellIndex = map.getCellIndex(anchor);
        let newTr: Transaction | null;

        if (canBeOutOfTable(direction, map, cellIndex)) {
          // When there is no content before or after the table,
          // an empty line('paragraph') is created by pressing the arrow keys.
          newTr = addParagraphAfterTable(tr, map, schema);
        } else {
          newTr = moveToCell(direction, tr, cellIndex, map);
        }

        if (newTr) {
          dispatch!(newTr);
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
        const { depth: cellDepth } = cell;

        if (para && canMoveBetweenCells(direction, [cellDepth, para.depth], $from, doc)) {
          const { anchor } = getResolvedSelection(selection);
          const map = TableOffsetMap.create(anchor)!;
          const cellIndex = map.getCellIndex(anchor);

          let newTr;

          if (canSelectTableNode(direction, map, cellIndex)) {
            // When the cursor position is at the end of the cell,
            // the table is selected when the left / right arrow keys are pressed.
            newTr = selectNode(tr, $from, cellDepth);
          } else if (canBeOutOfTable(direction, map, cellIndex)) {
            // When there is no content before or after the table,
            // an empty line('paragraph') is created by pressing the arrow keys.
            if (direction === 'up') {
              newTr = addParagraphBeforeTable(tr, map, schema);
            } else if (direction === 'down') {
              newTr = addParagraphAfterTable(tr, map, schema);
            }
          } else {
            newTr = moveToCell(direction, tr, cellIndex, map);
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
        const map = TableOffsetMap.create(anchor)!;
        const { startRowIdx, startColIdx, endRowIdx, endColIdx } = map.getRectOffsets(anchor, head);

        for (let rowIdx = startRowIdx; rowIdx <= endRowIdx; rowIdx += 1) {
          for (let colIdx = startColIdx; colIdx <= endColIdx; colIdx += 1) {
            if (!map.extendedRowspan(rowIdx, colIdx) && !map.extendedColspan(rowIdx, colIdx)) {
              const { node, pos } = map.getNodeAndPos(rowIdx, colIdx);
              const cells = createDummyCells(1, rowIdx, schema, node.attrs);

              tr.replaceWith(tr.mapping.map(pos), tr.mapping.map(pos + node.nodeSize), cells);
            }
          }
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
      addColumnToLeft: this.addColumn(Direction.LEFT),
      addColumnToRight: this.addColumn(Direction.RIGHT),
      removeColumn: this.removeColumn(),
      addRowToUp: this.addRow(Direction.UP),
      addRowToDown: this.addRow(Direction.DOWN),
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
