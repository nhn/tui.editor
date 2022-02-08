import type { Node, ResolvedPos } from 'prosemirror-model';
import { findNodeBy } from '@/wysiwyg/helper/node';
import { assign, getSortedNumPair } from '@/utils/common';

export interface CellInfo {
  offset: number;
  nodeSize: number;
  extended?: boolean;
}
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

interface SpanInfo {
  node: Node;
  pos: number;
  count: number;
  startSpanIdx: number;
}

interface OffsetMap {
  rowInfo: RowInfo[];
  table: Node;
  totalRowCount: number;
  totalColumnCount: number;
  tableStartOffset: number;
  tableEndOffset: number;
  getCellInfo(rowIdx: number, colIdx: number): CellInfo;
  posAt(rowIdx: number, colIdx: number): number;
  getNodeAndPos(rowIdx: number, colIdx: number): { node: Node; pos: number };
  extendedRowspan(rowIdx: number, colIdx: number): boolean;
  extendedColspan(rowIdx: number, colIdx: number): boolean;
  getRowspanCount(rowIdx: number, colIdx: number): number;
  getColspanCount(rowIdx: number, colIdx: number): number;
  decreaseColspanCount(rowIdx: number, colIdx: number): number;
  decreaseRowspanCount(rowIdx: number, colIdx: number): number;
  getColspanStartInfo(rowIdx: number, colIdx: number): SpanInfo | null;
  getRowspanStartInfo(rowIdx: number, colIdx: number): SpanInfo | null;
  getRectOffsets(startCellPos: ResolvedPos, endCellPos?: ResolvedPos): SelectionInfo;
  getSpannedOffsets(selectionInfo: SelectionInfo): SelectionInfo;
}

type CreateOffsetMapMixin = (
  headOrBody: Node,
  startOffset: number,
  startFromBody?: boolean
) => RowInfo[];

const cache = new Map();

/* eslint-disable @typescript-eslint/no-unused-vars */
export class TableOffsetMap {
  private table: Node;

  private tableRows: Node[];

  private tableStartPos: number;

  private rowInfo: RowInfo[];

  constructor(table: Node, tableRows: Node[], tableStartPos: number, rowInfo: RowInfo[]) {
    this.table = table;
    this.tableRows = tableRows;
    this.tableStartPos = tableStartPos;
    this.rowInfo = rowInfo;
  }

  static create(cellPos: ResolvedPos): TableOffsetMap | null {
    const table = findNodeBy(cellPos, ({ type }: Node) => type.name === 'table');

    if (table) {
      const { node, depth, offset } = table;
      const cached = cache.get(node);

      if (cached?.tableStartPos === offset + 1) {
        return cached;
      }

      const rows: Node[] = [];
      const tablePos = cellPos.start(depth);

      const thead = node.child(0);
      const tbody = node.child(1);

      const theadCellInfo = createOffsetMap(thead, tablePos);
      const tbodyCellInfo = createOffsetMap(tbody, tablePos + thead.nodeSize);

      thead.forEach((row) => rows.push(row));
      tbody.forEach((row) => rows.push(row));

      const map = new TableOffsetMap(node, rows, tablePos, theadCellInfo.concat(tbodyCellInfo));

      cache.set(node, map);

      return map;
    }

    return null;
  }

  get totalRowCount() {
    return this.rowInfo.length;
  }

  get totalColumnCount() {
    return this.rowInfo[0].length;
  }

  get tableStartOffset() {
    return this.tableStartPos;
  }

  get tableEndOffset() {
    return this.tableStartPos + this.table.nodeSize - 1;
  }

  getCellInfo(rowIdx: number, colIdx: number) {
    return this.rowInfo[rowIdx][colIdx];
  }

  posAt(rowIdx: number, colIdx: number): number {
    for (let i = 0, rowStart = this.tableStartPos; ; i += 1) {
      const rowEnd = rowStart + this.tableRows[i].nodeSize;

      if (i === rowIdx) {
        let index = colIdx;

        // Skip the cells from previous row(via rowspan)
        while (index < this.totalColumnCount && this.rowInfo[i][index].offset < rowStart) {
          index += 1;
        }
        return index === this.totalColumnCount ? rowEnd : this.rowInfo[i][index].offset;
      }
      rowStart = rowEnd;
    }
  }

  getNodeAndPos(rowIdx: number, colIdx: number) {
    const cellInfo = this.rowInfo[rowIdx][colIdx];

    return {
      node: this.table.nodeAt(cellInfo.offset - this.tableStartOffset)!,
      pos: cellInfo.offset,
    };
  }

  extendedRowspan(rowIdx: number, colIdx: number) {
    return false;
  }

  extendedColspan(rowIdx: number, colIdx: number) {
    return false;
  }

  getRowspanCount(rowIdx: number, colIdx: number) {
    return 0;
  }

  getColspanCount(rowIdx: number, colIdx: number) {
    return 0;
  }

  decreaseColspanCount(rowIdx: number, colIdx: number) {
    return 0;
  }

  decreaseRowspanCount(rowIdx: number, colIdx: number) {
    return 0;
  }

  getColspanStartInfo(rowIdx: number, colIdx: number): SpanInfo | null {
    return null;
  }

  getRowspanStartInfo(rowIdx: number, colIdx: number): SpanInfo | null {
    return null;
  }

  getCellStartOffset(rowIdx: number, colIdx: number) {
    const { offset } = this.rowInfo[rowIdx][colIdx];

    return this.extendedRowspan(rowIdx, colIdx) ? this.posAt(rowIdx, colIdx) : offset;
  }

  getCellEndOffset(rowIdx: number, colIdx: number) {
    const { offset, nodeSize } = this.rowInfo[rowIdx][colIdx];

    return this.extendedRowspan(rowIdx, colIdx) ? this.posAt(rowIdx, colIdx) : offset + nodeSize;
  }

  getCellIndex(cellPos: ResolvedPos): [rowIdx: number, colIdx: number] {
    for (let rowIdx = 0; rowIdx < this.totalRowCount; rowIdx += 1) {
      const rowInfo = this.rowInfo[rowIdx];

      for (let colIdx = 0; colIdx < this.totalColumnCount; colIdx += 1) {
        if (rowInfo[colIdx].offset + 1 > cellPos.pos) {
          return [rowIdx, colIdx];
        }
      }
    }
    return [0, 0];
  }

  getRectOffsets(startCellPos: ResolvedPos, endCellPos = startCellPos) {
    if (startCellPos.pos > endCellPos.pos) {
      [startCellPos, endCellPos] = [endCellPos, startCellPos];
    }
    let [startRowIdx, startColIdx] = this.getCellIndex(startCellPos);
    let [endRowIdx, endColIdx] = this.getCellIndex(endCellPos);

    [startRowIdx, endRowIdx] = getSortedNumPair(startRowIdx, endRowIdx);
    [startColIdx, endColIdx] = getSortedNumPair(startColIdx, endColIdx);

    return this.getSpannedOffsets({ startRowIdx, startColIdx, endRowIdx, endColIdx });
  }

  getSpannedOffsets(selectionInfo: SelectionInfo): SelectionInfo {
    return selectionInfo;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

let createOffsetMap = (headOrBody: Node, startOffset: number) => {
  const cellInfoMatrix: RowInfo[] = [];

  headOrBody.forEach((row: Node, rowOffset: number) => {
    // get row index based on table(not table head or table body)
    const rowInfo: RowInfo = { rowspanMap: {}, colspanMap: {}, length: 0 };

    row.forEach(({ nodeSize }: Node, cellOffset: number) => {
      let colIdx = 0;

      while (rowInfo[colIdx]) {
        colIdx += 1;
      }

      rowInfo[colIdx] = {
        // 2 is the sum of the front and back positions of the tag
        offset: startOffset + rowOffset + cellOffset + 2,
        nodeSize,
      };
      rowInfo.length += 1;
    });
    cellInfoMatrix.push(rowInfo);
  });

  return cellInfoMatrix;
};

export function mixinTableOffsetMapPrototype(
  offsetMapMixin: OffsetMap,
  createOffsetMapMixin: CreateOffsetMapMixin
) {
  assign(TableOffsetMap.prototype, offsetMapMixin);
  createOffsetMap = createOffsetMapMixin;

  return TableOffsetMap;
}
