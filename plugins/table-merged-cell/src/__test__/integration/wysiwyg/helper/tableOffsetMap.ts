import type { Node, ResolvedPos } from 'prosemirror-model';
import { findNodeBy } from '@/wysiwyg/util';

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

function getSortedNumPair(valueA: number, valueB: number) {
  return valueA > valueB ? [valueB, valueA] : [valueA, valueB];
}

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
      const { node, depth } = table;

      const rows: Node[] = [];
      const tablePos = cellPos.start(depth);

      const thead = node.child(0);
      const tbody = node.child(1);

      const theadCellInfo = createOffsetMap(thead, tablePos);
      const tbodyCellInfo = createOffsetMap(tbody, tablePos + thead.nodeSize);

      thead.forEach((row) => rows.push(row));
      tbody.forEach((row) => rows.push(row));

      const map = new TableOffsetMap(node, rows, tablePos, theadCellInfo.concat(tbodyCellInfo));

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

    return { node: this.table.nodeAt(cellInfo.offset - 1)!, pos: cellInfo.offset };
  }

  extendedRowspan(rowIdx: number, colIdx: number) {
    const rowspanInfo = this.rowInfo[rowIdx].rowspanMap[colIdx];

    return !!rowspanInfo && rowspanInfo.startSpanIdx !== rowIdx;
  }

  extendedColspan(rowIdx: number, colIdx: number) {
    const colspanInfo = this.rowInfo[rowIdx].colspanMap[colIdx];

    return !!colspanInfo && colspanInfo.startSpanIdx !== colIdx;
  }

  getRowspanCount(rowIdx: number, colIdx: number) {
    const rowspanInfo = this.rowInfo[rowIdx].rowspanMap[colIdx];

    return rowspanInfo ? rowspanInfo.count : 0;
  }

  getColspanCount(rowIdx: number, colIdx: number) {
    const colspanInfo = this.rowInfo[rowIdx].colspanMap[colIdx];

    return colspanInfo ? colspanInfo.count : 0;
  }

  decreaseColspanCount(rowIdx: number, colIdx: number) {
    const colspanInfo = this.rowInfo[rowIdx].colspanMap[colIdx];
    const startColspanInfo = this.rowInfo[rowIdx].colspanMap[colspanInfo.startSpanIdx];

    startColspanInfo.count -= 1;

    return startColspanInfo.count;
  }

  decreaseRowspanCount(rowIdx: number, colIdx: number) {
    const rowspanInfo = this.rowInfo[rowIdx].rowspanMap[colIdx];
    const startRowspanInfo = this.rowInfo[rowspanInfo.startSpanIdx].rowspanMap[colIdx];

    startRowspanInfo.count -= 1;

    return startRowspanInfo.count;
  }

  getColspanStartInfo(rowIdx: number, colIdx: number) {
    const { colspanMap } = this.rowInfo[rowIdx];
    const colspanInfo = colspanMap[colIdx];

    if (colspanInfo) {
      const { startSpanIdx } = colspanInfo;
      const cellInfo = this.rowInfo[rowIdx][startSpanIdx];

      return {
        node: this.table.nodeAt(cellInfo.offset - 1)!,
        pos: cellInfo.offset,
        startSpanIdx,
        count: colspanMap[startSpanIdx].count,
      };
    }
    return null;
  }

  getRowspanStartInfo(rowIdx: number, colIdx: number) {
    const { rowspanMap } = this.rowInfo[rowIdx];
    const rowspanInfo = rowspanMap[colIdx];

    if (rowspanInfo) {
      const { startSpanIdx } = rowspanInfo;
      const cellInfo = this.rowInfo[startSpanIdx][colIdx];

      return {
        node: this.table.nodeAt(cellInfo.offset - 1)!,
        pos: cellInfo.offset,
        startSpanIdx,
        count: this.rowInfo[startSpanIdx].rowspanMap[colIdx].count,
      };
    }
    return null;
  }

  getSpannedOffsets(selectionInfo: SelectionInfo): SelectionInfo {
    let { startRowIdx, startColIdx, endRowIdx, endColIdx } = selectionInfo;

    for (let rowIdx = endRowIdx; rowIdx >= startRowIdx; rowIdx -= 1) {
      if (this.rowInfo[rowIdx]) {
        const { rowspanMap, colspanMap } = this.rowInfo[rowIdx];

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
    }

    for (let rowIdx = startRowIdx; rowIdx <= endRowIdx; rowIdx += 1) {
      if (this.rowInfo[rowIdx]) {
        const { rowspanMap, colspanMap } = this.rowInfo[rowIdx];

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
    }

    return { startRowIdx, startColIdx, endRowIdx, endColIdx };
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

function createOffsetMap(headOrBody: Node, startOffset: number, startFromBody = false) {
  const cellInfoMatrix: RowInfo[] = [];
  const beInBody = headOrBody.type.name === 'tableBody';

  headOrBody.forEach((row: Node, rowOffset: number, rowIdx: number) => {
    // get row index based on table(not table head or table body)
    const rowIdxInWholeTable = beInBody && !startFromBody ? rowIdx + 1 : rowIdx;
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
        // 2 is the sum of the front and back positions of the tag
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
