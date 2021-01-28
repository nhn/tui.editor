import { Schema, Slice, Fragment, ResolvedPos } from 'prosemirror-model';
import { Transform } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import { TextSelection } from 'prosemirror-state';

import {
  CellInfo,
  SelectionInfo,
  getResolvedSelection,
  getSelectionInfo,
  getTableCellsInfo,
  createDummyCells,
  createTableBodyRows,
  getTableContentFromSlice,
} from '@/wysiwyg/helper/table';

import {
  createRowsFromPastingTable,
  copyTableHeadRow,
  copyTableBodyRow,
} from '@/wysiwyg/clipboard/paste';

interface TargetTableInfo {
  cellsInfo: CellInfo[][];
  tableRowCount: number;
  tableColumnCount: number;
}

interface PastingRangeInfo {
  addedRowCount: number;
  addedColumnCount: number;
  startRowIndex: number;
  startColumnIndex: number;
  endColumnIndex: number;
  endRowIndex: number;
}

interface ReplacedCellsOffsets {
  startCellOffset: number;
  endCellOffset: number;
  nextCellOffset: number;
}

const DUMMY_CELL_SIZE = 4;
const TR_NODES_SIZE = 2;

function getDummyCellSize(dummyCellCount: number) {
  return dummyCellCount * DUMMY_CELL_SIZE;
}

function createPastingCells(
  tableContent: Fragment,
  selectionInfo: SelectionInfo,
  textSelection: boolean,
  schema: Schema
) {
  const pastingTableRows = createRowsFromPastingTable(tableContent);
  const { startRowIndex, columnCount, rowCount } = selectionInfo;

  const tableRowCount = pastingTableRows.length;
  const pastingRowCount = textSelection ? tableRowCount : Math.min(tableRowCount, rowCount);

  const tableColumnCount = pastingTableRows[0].childCount;
  const pastingColumnCount = textSelection
    ? tableColumnCount
    : Math.min(tableColumnCount, columnCount);

  const startToTableHead = startRowIndex === 0;
  const slicedRows = pastingTableRows.slice(0, pastingRowCount);

  const pastingRows = [];

  if (startToTableHead) {
    const tableHeadRow = slicedRows.shift();

    if (tableHeadRow) {
      const { content } = copyTableHeadRow(tableHeadRow, pastingColumnCount, schema);

      pastingRows.push(content);
    }
  }

  slicedRows.forEach((tableBodyRow) => {
    if (!tableBodyRow.attrs.dummyRowForPasting) {
      const { content } = copyTableBodyRow(tableBodyRow, pastingColumnCount, schema);

      pastingRows.push(content);
    }
  });

  return [...pastingRows];
}

function getTargetTableInfo(anchor: ResolvedPos) {
  const cellsInfo = getTableCellsInfo(anchor);

  return {
    cellsInfo,
    tableRowCount: cellsInfo.length,
    tableColumnCount: cellsInfo[0].length,
  };
}

function getPastingRangeInfo(
  { tableRowCount, tableColumnCount }: TargetTableInfo,
  { startRowIndex, startColumnIndex }: SelectionInfo,
  pastingCells: Fragment[]
) {
  const pastingRowCount = pastingCells.length;
  const pastingColumnCount = pastingCells[0].childCount;

  const endRowIndex = startRowIndex + pastingRowCount - 1;
  const endColumnIndex = startColumnIndex + pastingColumnCount - 1;

  const addedRowCount = Math.max(endRowIndex + 1 - tableRowCount, 0);
  const addedColumnCount = Math.max(endColumnIndex + 1 - tableColumnCount, 0);

  return {
    startRowIndex,
    startColumnIndex,
    endRowIndex,
    endColumnIndex,
    addedRowCount,
    addedColumnCount,
  };
}

function addReplacedOffsets(
  { cellsInfo, tableColumnCount }: TargetTableInfo,
  {
    startRowIndex,
    startColumnIndex,
    endRowIndex,
    endColumnIndex,
    addedRowCount,
    addedColumnCount,
  }: PastingRangeInfo,
  replacedCellsOffsets: ReplacedCellsOffsets[]
) {
  for (let rowIndex = startRowIndex; rowIndex <= endRowIndex - addedRowCount; rowIndex += 1) {
    const start = cellsInfo[rowIndex][startColumnIndex];
    const end = cellsInfo[rowIndex][endColumnIndex - addedColumnCount];
    const rowEnd = cellsInfo[rowIndex][tableColumnCount - 1];

    replacedCellsOffsets.push({
      startCellOffset: start.offset,
      endCellOffset: end.offset + end.nodeSize,
      nextCellOffset: rowEnd.offset + rowEnd.nodeSize + TR_NODES_SIZE,
    });
  }
}

function expandColumns(
  tr: Transform,
  schema: Schema,
  { tableRowCount, cellsInfo }: TargetTableInfo,
  {
    startRowIndex,
    startColumnIndex,
    endRowIndex,
    endColumnIndex,
    addedRowCount,
    addedColumnCount,
  }: PastingRangeInfo,
  replacedCellsOffsets: ReplacedCellsOffsets[]
) {
  let index = 0;

  for (let rowIndex = 0; rowIndex < tableRowCount; rowIndex += 1) {
    const { offset, nodeSize } = cellsInfo[rowIndex][endColumnIndex - addedColumnCount];
    const insertOffset = tr.mapping.map(offset + nodeSize);
    const cells = createDummyCells(addedColumnCount, rowIndex, schema);

    tr.insert(insertOffset, cells);

    if (rowIndex >= startRowIndex && rowIndex <= endRowIndex - addedRowCount) {
      const startCellOffset = tr.mapping.map(cellsInfo[rowIndex][startColumnIndex].offset);
      const endCellOffset = insertOffset + getDummyCellSize(addedColumnCount);
      const nextCellOffset = endCellOffset + TR_NODES_SIZE;

      replacedCellsOffsets[index] = { startCellOffset, endCellOffset, nextCellOffset };
      index += 1;
    }
  }
}

function expandRows(
  tr: Transform,
  schema: Schema,
  { tableColumnCount }: TargetTableInfo,
  { addedRowCount, addedColumnCount, startColumnIndex, endColumnIndex }: PastingRangeInfo,
  replacedCellsOffsets: ReplacedCellsOffsets[]
) {
  const endCell = replacedCellsOffsets[replacedCellsOffsets.length - 1];
  const rows = createTableBodyRows(addedRowCount, tableColumnCount + addedColumnCount, schema);

  let startOffset = endCell.nextCellOffset - 1;

  tr.insert(tr.mapping.slice(tr.mapping.maps.length).map(startOffset), rows);

  for (let rowIndex = 0; rowIndex < addedRowCount; rowIndex += 1) {
    const startCellOffset = startOffset + getDummyCellSize(startColumnIndex);
    const endCellOffset = startOffset + getDummyCellSize(endColumnIndex + 1);
    const nextCellOffset =
      startOffset + getDummyCellSize(tableColumnCount + addedColumnCount) + TR_NODES_SIZE;

    replacedCellsOffsets.push({ startCellOffset, endCellOffset, nextCellOffset });

    startOffset = nextCellOffset;
  }
}

function replaceCells(
  tr: Transform,
  pastingRows: Fragment[],
  replacedCellsOffsets: ReplacedCellsOffsets[]
) {
  const mapFrom = tr.mapping.maps.length;

  replacedCellsOffsets.forEach((offsets, index) => {
    const mapping = tr.mapping.slice(mapFrom);
    const startCellOffset = mapping.map(offsets.startCellOffset);
    const endCellOffset = mapping.map(offsets.endCellOffset);
    const cells = new Slice(pastingRows[index], 0, 0);

    tr.replace(startCellOffset, endCellOffset, cells);
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

    const selectionInfo = getSelectionInfo(anchor, head);
    const textSelection = selection instanceof TextSelection;

    const targetTableInfo = getTargetTableInfo(anchor);
    const pastingCells = createPastingCells(tableContent, selectionInfo, textSelection, schema);
    const pastingInfo = getPastingRangeInfo(targetTableInfo, selectionInfo, pastingCells);

    const replacedCellsOffsets: ReplacedCellsOffsets[] = [];

    addReplacedOffsets(targetTableInfo, pastingInfo, replacedCellsOffsets);

    if (pastingInfo.addedColumnCount) {
      expandColumns(tr, schema, targetTableInfo, pastingInfo, replacedCellsOffsets);
    }

    if (pastingInfo.addedRowCount) {
      expandRows(tr, schema, targetTableInfo, pastingInfo, replacedCellsOffsets);
    }

    replaceCells(tr, pastingCells, replacedCellsOffsets);

    view.dispatch!(tr);

    return true;
  }

  return false;
}
