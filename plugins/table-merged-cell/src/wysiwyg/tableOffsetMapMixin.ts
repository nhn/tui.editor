import type { RowInfo, SelectionInfo, TableOffsetMap } from '@t/index';
import type { Node } from 'prosemirror-model';

export const offsetMapMixin = {
  extendedRowspan(rowIdx: number, colIdx: number) {
    const rowspanInfo = this.rowInfo[rowIdx].rowspanMap[colIdx];

    return !!rowspanInfo && rowspanInfo.startSpanIdx !== rowIdx;
  },
  extendedColspan(rowIdx: number, colIdx: number) {
    const colspanInfo = this.rowInfo[rowIdx].colspanMap[colIdx];

    return !!colspanInfo && colspanInfo.startSpanIdx !== colIdx;
  },
  getRowspanCount(rowIdx: number, colIdx: number) {
    const rowspanInfo = this.rowInfo[rowIdx].rowspanMap[colIdx];

    return rowspanInfo ? rowspanInfo.count : 0;
  },
  getColspanCount(rowIdx: number, colIdx: number) {
    const colspanInfo = this.rowInfo[rowIdx].colspanMap[colIdx];

    return colspanInfo ? colspanInfo.count : 0;
  },
  decreaseColspanCount(rowIdx: number, colIdx: number) {
    const colspanInfo = this.rowInfo[rowIdx].colspanMap[colIdx];
    const startColspanInfo = this.rowInfo[rowIdx].colspanMap[colspanInfo.startSpanIdx];

    startColspanInfo.count -= 1;

    return startColspanInfo.count;
  },
  decreaseRowspanCount(rowIdx: number, colIdx: number) {
    const rowspanInfo = this.rowInfo[rowIdx].rowspanMap[colIdx];
    const startRowspanInfo = this.rowInfo[rowspanInfo.startSpanIdx].rowspanMap[colIdx];

    startRowspanInfo.count -= 1;

    return startRowspanInfo.count;
  },
  getColspanStartInfo(rowIdx: number, colIdx: number) {
    const { colspanMap } = this.rowInfo[rowIdx];
    const colspanInfo = colspanMap[colIdx];

    if (colspanInfo) {
      const { startSpanIdx } = colspanInfo;
      const cellInfo = this.rowInfo[rowIdx][startSpanIdx];

      return {
        node: this.table.nodeAt(cellInfo.offset - this.tableStartOffset)!,
        pos: cellInfo.offset,
        startSpanIdx,
        count: colspanMap[startSpanIdx].count,
      };
    }
    return null;
  },
  getRowspanStartInfo(rowIdx: number, colIdx: number) {
    const { rowspanMap } = this.rowInfo[rowIdx];
    const rowspanInfo = rowspanMap[colIdx];

    if (rowspanInfo) {
      const { startSpanIdx } = rowspanInfo;
      const cellInfo = this.rowInfo[startSpanIdx][colIdx];

      return {
        node: this.table.nodeAt(cellInfo.offset - this.tableStartOffset)!,
        pos: cellInfo.offset,
        startSpanIdx,
        count: this.rowInfo[startSpanIdx].rowspanMap[colIdx].count,
      };
    }
    return null;
  },
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
  },
} as TableOffsetMap;

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

export const createOffsetMapMixin = (
  headOrBody: Node,
  startOffset: number,
  startFromBody = false
) => {
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
};
