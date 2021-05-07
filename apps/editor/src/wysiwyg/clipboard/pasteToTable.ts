import { Schema, Slice, Fragment } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import {
  getResolvedSelection,
  createDummyCells,
  createTableBodyRows,
  getTableContentFromSlice,
  getRowAndColumnCount,
} from '@/wysiwyg/helper/table';

import {
  createRowsFromPastingTable,
  copyTableHeadRow,
  copyTableBodyRow,
} from '@/wysiwyg/clipboard/paste';
import CellSelection from '@/wysiwyg/plugins/selection/cellSelection';
import { last } from '@/utils/common';
import { SelectionInfo, TableOffsetMap } from '@/wysiwyg/helper/tableOffsetMap';

interface PastingRangeInfo {
  addedRowCount: number;
  addedColumnCount: number;
  startRowIdx: number;
  startColIdx: number;
  endColIdx: number;
  endRowIdx: number;
}

interface ReplacedCellsOffsets {
  rowIdx: number;
  startColIdx: number;
  endColIdx: number;
  dummyOffsets?: [startCellOffset: number, endCellOffset: number];
}

const DUMMY_CELL_SIZE = 4;
const TR_NODES_SIZE = 2;

function getDummyCellSize(dummyCellCount: number) {
  return dummyCellCount * DUMMY_CELL_SIZE;
}

function createPastingCells(
  tableContent: Fragment,
  curSelectionInfo: SelectionInfo,
  schema: Schema
) {
  const pastingRows: Fragment[] = [];
  const pastingTableRows = createRowsFromPastingTable(tableContent);
  const columnCount = pastingTableRows[0].childCount;
  const rowCount = pastingTableRows.length;

  const startToTableHead = curSelectionInfo.startRowIdx === 0;
  const slicedRows = pastingTableRows.slice(0, rowCount);

  if (startToTableHead) {
    const tableHeadRow = slicedRows.shift();

    if (tableHeadRow) {
      const { content } = copyTableHeadRow(tableHeadRow, columnCount, schema);

      pastingRows.push(content);
    }
  }

  slicedRows.forEach((tableBodyRow) => {
    if (!tableBodyRow.attrs.dummyRowForPasting) {
      const { content } = copyTableBodyRow(tableBodyRow, columnCount, schema);

      pastingRows.push(content);
    }
  });

  return pastingRows;
}

function getPastingRangeInfo(
  map: TableOffsetMap,
  { startRowIdx, startColIdx }: SelectionInfo,
  pastingCells: Fragment[]
): PastingRangeInfo {
  const pastingRowCount = pastingCells.length;
  let pastingColumnCount = 0;

  for (let i = 0; i < pastingRowCount; i += 1) {
    let columnCount = pastingCells[i].childCount;

    pastingCells[i].forEach(({ attrs }) => {
      const { colspan } = attrs;

      if (colspan > 1) {
        columnCount += colspan - 1;
      }
    });
    pastingColumnCount = Math.max(pastingColumnCount, columnCount);
  }

  const endRowIdx = startRowIdx + pastingRowCount - 1;
  const endColIdx = startColIdx + pastingColumnCount - 1;
  const addedRowCount = Math.max(endRowIdx + 1 - map.totalRowCount, 0);
  const addedColumnCount = Math.max(endColIdx + 1 - map.totalColumnCount, 0);

  return {
    startRowIdx,
    startColIdx,
    endRowIdx,
    endColIdx,
    addedRowCount,
    addedColumnCount,
  };
}

function addReplacedOffsets(
  {
    startRowIdx,
    startColIdx,
    endRowIdx,
    endColIdx,
    addedRowCount,
    addedColumnCount,
  }: PastingRangeInfo,
  cellsOffsets: ReplacedCellsOffsets[]
) {
  for (let rowIdx = startRowIdx; rowIdx <= endRowIdx - addedRowCount; rowIdx += 1) {
    cellsOffsets.push({
      rowIdx,
      startColIdx,
      endColIdx: endColIdx - addedColumnCount,
    });
  }
}

function expandColumns(
  tr: Transaction,
  schema: Schema,
  map: TableOffsetMap,
  {
    startRowIdx,
    startColIdx,
    endRowIdx,
    endColIdx,
    addedRowCount,
    addedColumnCount,
  }: PastingRangeInfo,
  cellsOffsets: ReplacedCellsOffsets[]
) {
  const { totalRowCount } = map;
  let index = 0;

  for (let rowIdx = 0; rowIdx < totalRowCount; rowIdx += 1) {
    const { offset, nodeSize } = map.getCellInfo(rowIdx, endColIdx - addedColumnCount);
    const insertOffset = tr.mapping.map(offset + nodeSize);
    const cells = createDummyCells(addedColumnCount, rowIdx, schema);

    tr.insert(insertOffset, cells);

    if (rowIdx >= startRowIdx && rowIdx <= endRowIdx - addedRowCount) {
      const cellInfo = map.getCellInfo(rowIdx, endColIdx - addedColumnCount);
      const startCellOffset = tr.mapping.map(cellInfo.offset);
      const endCellOffset = insertOffset + getDummyCellSize(addedColumnCount);

      cellsOffsets[index] = {
        rowIdx,
        startColIdx,
        endColIdx,
        dummyOffsets: [startCellOffset, endCellOffset],
      };
      index += 1;
    }
  }
}

function expandRows(
  tr: Transaction,
  schema: Schema,
  map: TableOffsetMap,
  { addedRowCount, addedColumnCount, startColIdx, endColIdx }: PastingRangeInfo,
  cellsOffsets: ReplacedCellsOffsets[]
) {
  const mapStart = tr.mapping.maps.length;
  const tableEndPos = map.tableEndOffset - 2;
  const rows = createTableBodyRows(addedRowCount, map.totalColumnCount + addedColumnCount, schema);
  let startOffset = tableEndPos;

  tr.insert(tr.mapping.slice(mapStart).map(startOffset), rows);

  for (let rowIndex = 0; rowIndex < addedRowCount; rowIndex += 1) {
    const startCellOffset = startOffset + getDummyCellSize(startColIdx) + 1;
    const endCellOffset = startOffset + getDummyCellSize(endColIdx + 1) + 1;
    const nextCellOffset =
      startOffset + getDummyCellSize(map.totalColumnCount + addedColumnCount) + TR_NODES_SIZE;

    cellsOffsets.push({
      rowIdx: rowIndex + map.totalRowCount,
      startColIdx,
      endColIdx,
      dummyOffsets: [startCellOffset, endCellOffset],
    });
    startOffset = nextCellOffset;
  }
}

function replaceCells(
  tr: Transaction,
  pastingRows: Fragment[],
  cellsOffsets: ReplacedCellsOffsets[],
  map: TableOffsetMap
) {
  const mapStart = tr.mapping.maps.length;

  cellsOffsets.forEach((offsets, index) => {
    const { rowIdx, startColIdx, endColIdx, dummyOffsets } = offsets;
    const mapping = tr.mapping.slice(mapStart);
    const cells = new Slice(pastingRows[index], 0, 0);
    const from = dummyOffsets ? dummyOffsets[0] : map.getCellStartOffset(rowIdx, startColIdx);
    const to = dummyOffsets ? dummyOffsets[1] : map.getCellEndOffset(rowIdx, endColIdx);

    tr.replace(mapping.map(from), mapping.map(to), cells);
  });
}

export function pasteToTable(view: EditorView, slice: Slice) {
  const { selection, schema, tr } = view.state;
  const { anchor, head } = getResolvedSelection(selection);

  if (anchor && head) {
    const tableContent = getTableContentFromSlice(slice);

    if (!tableContent) {
      return false;
    }

    const map = TableOffsetMap.create(anchor)!;
    const curSelectionInfo = map.getRectOffsets(anchor, head);

    const pastingCells = createPastingCells(tableContent, curSelectionInfo, schema);
    const pastingInfo = getPastingRangeInfo(map, curSelectionInfo, pastingCells);

    const cellsOffsets: ReplacedCellsOffsets[] = [];

    // @TODO: unmerge the span and paste the cell
    if (canMerge(map, pastingInfo)) {
      addReplacedOffsets(pastingInfo, cellsOffsets);

      if (pastingInfo.addedColumnCount) {
        expandColumns(tr, schema, map, pastingInfo, cellsOffsets);
      }
      if (pastingInfo.addedRowCount) {
        expandRows(tr, schema, map, pastingInfo, cellsOffsets);
      }
      replaceCells(tr, pastingCells, cellsOffsets, map);

      view.dispatch!(tr);

      setSelection(view, cellsOffsets, map.getCellInfo(0, 0).offset);
    }
    return true;
  }
  return false;
}

function setSelection(view: EditorView, cellsOffsets: ReplacedCellsOffsets[], pos: number) {
  const { tr, doc } = view.state;
  // get changed cell offsets
  const map = TableOffsetMap.create(doc.resolve(pos))!;

  // eslint-disable-next-line prefer-destructuring
  const { rowIdx: startRowIdx, startColIdx } = cellsOffsets[0];
  const { rowIdx: endRowIdx, endColIdx } = last(cellsOffsets);

  const { offset: startOffset } = map.getCellInfo(startRowIdx, startColIdx);
  const { offset: endOffset } = map.getCellInfo(endRowIdx, endColIdx);

  view.dispatch!(
    tr.setSelection(new CellSelection(doc.resolve(startOffset), doc.resolve(endOffset)))
  );
}

function canMerge(map: TableOffsetMap, pastingInfo: PastingRangeInfo) {
  const ranges = map.getSpannedOffsets(pastingInfo);

  const { rowCount, columnCount } = getRowAndColumnCount(ranges);
  const { rowCount: pastingRowCount, columnCount: pastingColumnCount } = getRowAndColumnCount(
    pastingInfo
  );

  return rowCount === pastingRowCount && columnCount === pastingColumnCount;
}
