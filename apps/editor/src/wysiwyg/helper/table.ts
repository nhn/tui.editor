import { Node, Schema, ResolvedPos, Slice } from 'prosemirror-model';
import { Selection, TextSelection } from 'prosemirror-state';

import { findNodeBy } from '@/wysiwyg/helper/node';

import { CellSelection } from '@t/wysiwyg';
import { getSortedNumPair } from '@/utils/common';

export interface CellInfo {
  offset: number;
  nodeSize: number;
  extended?: boolean;
}

export type Ranges = [
  startRowIdx: number,
  startColIdx: number,
  endRowIdx: number,
  endColIdx: number
];

export interface SelectionInfo {
  startRowIdx: number;
  startColIdx: number;
  endRowIdx: number;
  endColIdx: number;
}

interface SpanMap {
  [key: number]: { count: number; startSpanIdx: number };
}
export interface RowInfo {
  [key: number]: CellInfo;
  length: number;
  rowspanMap: SpanMap;
  colspanMap: SpanMap;
}

export function createTableHeadRow(columnCount: number, schema: Schema, data?: string[]) {
  const { tableRow, tableHeadCell, paragraph } = schema.nodes;
  const cells = [];

  for (let index = 0; index < columnCount; index += 1) {
    const text = data && data[index];
    const para = paragraph.create(null, text ? schema.text(text) : []);

    cells.push(tableHeadCell.create(null, para));
  }

  return [tableRow.create(null, cells)];
}

export function createTableBodyRows(
  rowCount: number,
  columnCount: number,
  schema: Schema,
  data?: string[]
) {
  const { tableRow, tableBodyCell, paragraph } = schema.nodes;
  const tableRows = [];

  for (let rowIdx = 0; rowIdx < rowCount; rowIdx += 1) {
    const cells = [];

    for (let colIdx = 0; colIdx < columnCount; colIdx += 1) {
      const text = data && data[rowIdx * columnCount + colIdx];
      const para = paragraph.create(null, text ? schema.text(text) : []);

      cells.push(tableBodyCell.create(null, para));
    }

    tableRows.push(tableRow.create(null, cells));
  }

  return tableRows;
}

export function createDummyCells(columnCount: number, rowIdx: number, schema: Schema) {
  const { tableHeadCell, tableBodyCell, paragraph } = schema.nodes;
  const cell = rowIdx === 0 ? tableHeadCell : tableBodyCell;
  const cells = [];

  for (let index = 0; index < columnCount; index += 1) {
    cells.push(cell.create(null, paragraph.create()));
  }

  return cells;
}

export function findCellElement(node: HTMLElement, root: Element) {
  while (node && node !== root) {
    if (node.nodeName === 'TD' || node.nodeName === 'TH') {
      return node;
    }

    node = node.parentNode as HTMLElement;
  }

  return null;
}

export function findCell(pos: ResolvedPos) {
  return findNodeBy(
    pos,
    ({ type }: Node) => type.name === 'tableHeadCell' || type.name === 'tableBodyCell'
  );
}

export function getNextRowOffset(selectionInfo: SelectionInfo, cellsInfo: RowInfo[]) {
  const { rowCount } = getRowAndColumnCount(selectionInfo);
  const { startRowIdx } = selectionInfo;
  const allColumnCount = cellsInfo[0].length;
  const selectedOnlyThead = startRowIdx === 0 && rowCount === 1;

  if (!selectedOnlyThead) {
    const rowIdx = startRowIdx + rowCount - 1;
    const colIdx = allColumnCount - 1;
    const { offset, nodeSize } = cellsInfo[rowIdx][colIdx];

    return offset + nodeSize + 1;
  }

  return -1;
}

export function getPrevRowOffset({ startRowIdx }: SelectionInfo, cellsInfo: RowInfo[]) {
  const selectedThead = startRowIdx === 0;

  if (!selectedThead) {
    // eslint-disable-next-line prefer-destructuring
    const { offset } = cellsInfo[startRowIdx][0];

    return offset - 1;
  }

  return -1;
}

export function getNextColumnOffsets(
  rowIdx: number,
  selectionInfo: SelectionInfo,
  cellsInfo: RowInfo[]
) {
  const { columnCount } = getRowAndColumnCount(selectionInfo);
  const { offset, nodeSize } = cellsInfo[rowIdx][selectionInfo.startColIdx + columnCount - 1];
  const mapOffset = offset + nodeSize;

  return { offset, mapOffset };
}

export function getPrevColumnOffsets(
  rowIdx: number,
  { startColIdx }: SelectionInfo,
  cellsInfo: RowInfo[]
) {
  const { offset } = cellsInfo[rowIdx][startColIdx];
  const mapOffset = offset;

  return { offset, mapOffset };
}

export function getResolvedSelection(selection: Selection | CellSelection) {
  if (selection instanceof TextSelection) {
    const { $anchor } = selection;
    const foundCell = findCell($anchor);

    if (foundCell) {
      const anchor = $anchor.node(0).resolve($anchor.before(foundCell.depth));

      return { anchor, head: anchor };
    }
  }

  const { startCell, endCell } = selection as CellSelection;

  return { anchor: startCell, head: endCell };
}

function extendPrevRowspan(prevRowInfo: RowInfo, rowInfo: RowInfo) {
  const { rowspanMap, colspanMap } = rowInfo;
  const { rowspanMap: prevRowspanMap, colspanMap: prevColspanMap } = prevRowInfo;

  Object.keys(prevRowspanMap).forEach((key) => {
    const colIdx = Number(key);
    const prevRowspanInfo = prevRowspanMap[colIdx];

    if (prevRowspanInfo?.count > 1) {
      const prevColspanInfo = prevColspanMap[colIdx];
      const { count, startSpanIdx } = prevRowspanInfo;

      rowspanMap[colIdx] = { count: count - 1, startSpanIdx };
      colspanMap[colIdx] = prevColspanInfo;

      rowInfo[colIdx] = { ...prevRowInfo[colIdx], extended: true };
      rowInfo.length += 1;
    }
  });
}

function extendPrevColspan(
  rowspan: number,
  colspan: number,
  rowIdx: number,
  colIdx: number,
  rowInfo: RowInfo
) {
  const { rowspanMap, colspanMap } = rowInfo;

  for (let i = 1; i < colspan; i += 1) {
    colspanMap[colIdx + i] = { count: colspan - i, startSpanIdx: colIdx };

    if (rowspan > 1) {
      rowspanMap[colIdx + i] = { count: rowspan, startSpanIdx: rowIdx };
    }

    rowInfo[colIdx + i] = { ...rowInfo[colIdx] };
    rowInfo.length += 1;
  }
}

function getCellsInfo(headOrBody: Node, startOffset: number) {
  const cellInfoMatrix: RowInfo[] = [];
  const beInBody = headOrBody.type.name === 'tableBody';

  headOrBody.forEach((row: Node, rowOffset: number, rowIdx: number) => {
    // get row index based on table(not table head or table body)
    const rowIdxInWholeTable = beInBody ? rowIdx + 1 : rowIdx;
    const prevRowInfo = cellInfoMatrix[rowIdx - 1];
    const rowInfo: RowInfo = { rowspanMap: {}, colspanMap: {}, length: 0 };

    if (prevRowInfo) {
      extendPrevRowspan(prevRowInfo, rowInfo);
    }

    row.forEach(({ nodeSize, attrs }: Node, cellOffset: number) => {
      const colspan: number = attrs.colspan ?? 1;
      const rowspan: number = attrs.rowspan ?? 1;
      let colIdx = 0;

      while (rowInfo[colIdx]) {
        colIdx += 1;
      }

      rowInfo[colIdx] = {
        // 2 is the sum of the front and back positions of the closing tag
        offset: startOffset + rowOffset + cellOffset + 2,
        nodeSize,
      };

      rowInfo.length += 1;

      if (rowspan > 1) {
        rowInfo.rowspanMap[colIdx] = { count: rowspan, startSpanIdx: rowIdxInWholeTable };
      }

      if (colspan > 1) {
        rowInfo.colspanMap[colIdx] = { count: colspan, startSpanIdx: colIdx };
        extendPrevColspan(rowspan, colspan, rowIdxInWholeTable, colIdx, rowInfo);
      }
    });
    cellInfoMatrix.push(rowInfo);
  });

  return cellInfoMatrix;
}

export function getTableCellsInfo(cellPos: ResolvedPos) {
  const foundTable = findNodeBy(cellPos, ({ type }: Node) => type.name === 'table');

  if (foundTable) {
    const { node, depth } = foundTable;
    const tablePos = cellPos.start(depth);

    const thead = node.child(0);
    const tbody = node.child(1);

    const theadCellInfo = getCellsInfo(thead, tablePos);
    const tbodyCellInfo = getCellsInfo(tbody, tablePos + thead.nodeSize);

    return theadCellInfo.concat(tbodyCellInfo);
  }

  return [];
}

export function getCellIndexInfo(cellPos: ResolvedPos): [rowIdx: number, colIdx: number] {
  const { pos, parentOffset } = cellPos;

  let rowIdx = cellPos
    .node(0)
    .resolve(pos - parentOffset - 1)
    .index();

  if (cellPos.nodeAfter && cellPos.nodeAfter.type.name !== 'tableHeadCell') {
    rowIdx += 1;
  }

  const colIdx = cellPos.index();

  return [rowIdx, colIdx];
}

function getCellIndex(cellPos: ResolvedPos, cellsInfo: RowInfo[]) {
  for (let rowIdx = 0; rowIdx < cellsInfo.length; rowIdx += 1) {
    const rowInfo = cellsInfo[rowIdx];

    for (let colIdx = 0; colIdx < rowInfo.length; colIdx += 1) {
      if (rowInfo[colIdx].offset + 1 > cellPos.pos) {
        return [rowIdx, colIdx];
      }
    }
  }
  return [0, 0];
}

export function getExtendedRanges(ranges: Ranges, cellsInfo: RowInfo[]): SelectionInfo {
  let [startRowIdx, startColIdx, endRowIdx, endColIdx] = ranges;

  for (let rowIdx = endRowIdx; rowIdx >= startRowIdx; rowIdx -= 1) {
    const { rowspanMap, colspanMap } = cellsInfo[rowIdx];

    for (let colIdx = endColIdx; colIdx >= startColIdx; colIdx -= 1) {
      const rowspanInfo = rowspanMap[colIdx];
      const colspanInfo = colspanMap[colIdx];

      if (rowspanInfo) {
        startRowIdx = Math.min(startRowIdx, rowspanInfo.startSpanIdx);
      }
      if (colspanInfo) {
        startColIdx = Math.min(startColIdx, colspanInfo.startSpanIdx);
      }
    }
  }

  for (let rowIdx = startRowIdx; rowIdx <= endRowIdx; rowIdx += 1) {
    const { rowspanMap, colspanMap } = cellsInfo[rowIdx];

    for (let colIdx = startColIdx; colIdx <= endColIdx; colIdx += 1) {
      const rowspanInfo = rowspanMap[colIdx];
      const colspanInfo = colspanMap[colIdx];

      if (rowspanInfo) {
        endRowIdx = Math.max(endRowIdx, rowIdx + rowspanInfo.count - 1);
      }
      if (colspanInfo) {
        endColIdx = Math.max(endColIdx, colIdx + colspanInfo.count - 1);
      }
    }
  }

  return { startRowIdx, startColIdx, endRowIdx, endColIdx };
}

export function getSelectionInfo(
  cellsInfo: RowInfo[],
  startCellPos: ResolvedPos,
  endCellPos = startCellPos
) {
  if (startCellPos.pos > endCellPos.pos) {
    const orgStartCellPos = startCellPos;

    startCellPos = endCellPos;
    endCellPos = orgStartCellPos;
  }
  let [startRowIdx, startColIdx] = getCellIndex(startCellPos, cellsInfo);
  let [endRowIdx, endColIdx] = getCellIndex(endCellPos, cellsInfo);

  [startRowIdx, endRowIdx] = getSortedNumPair(startRowIdx, endRowIdx);
  [startColIdx, endColIdx] = getSortedNumPair(startColIdx, endColIdx);

  const ranges: Ranges = [startRowIdx, startColIdx, endRowIdx, endColIdx];

  return getExtendedRanges(ranges, cellsInfo);
}

export function getTableContentFromSlice(slice: Slice) {
  if (slice.size) {
    let { content, openStart, openEnd } = slice;

    if (content.childCount !== 1) {
      return null;
    }

    while (
      content.childCount === 1 &&
      ((openStart > 0 && openEnd > 0) || content.firstChild?.type.name === 'table')
    ) {
      openStart -= 1;
      openEnd -= 1;
      content = content.firstChild!.content;
    }

    if (
      content.firstChild!.type.name === 'tableHead' ||
      content.firstChild!.type.name === 'tableBody'
    ) {
      return content;
    }
  }

  return null;
}

export function getRowAndColumnCount(selectionInfo: SelectionInfo) {
  return {
    rowCount: selectionInfo.endRowIdx - selectionInfo.startRowIdx + 1,
    columnCount: selectionInfo.endColIdx - selectionInfo.startColIdx + 1,
  };
}
