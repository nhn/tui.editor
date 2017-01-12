/**
 * @fileoverview Implements tableRangeHandler
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import tableDataHandler from './tableDataHandler';

const util = tui.util;

/**
 * Find unmerged table range.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {jQuery} $start - start jQuery element
 * @param {jQuery} $end - end jQuery element
 * @returns {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }}
 */
function _findUnmergedRange(tableData, $start, $end) {
    const cellIndexData = tableDataHandler.createCellIndexData(tableData);
    const startCellIndex = tableDataHandler.findCellIndex(cellIndexData, $start);
    const endCellIndex = tableDataHandler.findCellIndex(cellIndexData, $end);
    let startRowIndex, endRowIndex, startColIndex, endColIndex;

    if (startCellIndex.rowIndex > endCellIndex.rowIndex) {
        startRowIndex = endCellIndex.rowIndex;
        endRowIndex = startCellIndex.rowIndex;
    } else {
        startRowIndex = startCellIndex.rowIndex;
        endRowIndex = endCellIndex.rowIndex;
    }

    if (startCellIndex.colIndex > endCellIndex.colIndex) {
        startColIndex = endCellIndex.colIndex;
        endColIndex = startCellIndex.colIndex;
    } else {
        startColIndex = startCellIndex.colIndex;
        endColIndex = endCellIndex.colIndex;
    }

    return {
        start: {
            rowIndex: startRowIndex,
            colIndex: startColIndex
        },
        end: {
            rowIndex: endRowIndex,
            colIndex: endColIndex
        }
    };
}

/**
 * Expand table range by row merge properties like rowspan, rowMergeWith.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }} tableRange - table range
 * @param {string} rangeType - range type like start, end
 */
function _expandRowMergedRange(tableData, tableRange, rangeType) {
    const rowIndex = tableRange[rangeType].rowIndex;
    const rowData = tableData[rowIndex];

    util.range(tableRange.start.colIndex, tableRange.end.colIndex + 1).forEach(colIndex => {
        const cellData = rowData[colIndex];
        const rowMergeWith = cellData.rowMergeWith;
        let lastRowMergedIndex = -1;

        if (util.isExisty(rowMergeWith)) {
            if (rowMergeWith < tableRange.start.rowIndex) {
                tableRange.start.rowIndex = rowMergeWith;
            }

            lastRowMergedIndex = rowMergeWith + tableData[rowMergeWith][colIndex].rowspan - 1;
        } else if (cellData.rowspan > 1) {
            lastRowMergedIndex = rowIndex + cellData.rowspan - 1;
        }

        if (lastRowMergedIndex > tableRange.end.rowIndex) {
            tableRange.end.rowIndex = lastRowMergedIndex;
        }
    });
}

/**
 * Expand table range by column merge properties like colspan, colMergeWith.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }} tableRange - table range
 * @param {number} rowIndex - row index
 * @param {number} colIndex - col index
 */
function _expandColMergedRange(tableData, tableRange, rowIndex, colIndex) {
    const rowData = tableData[rowIndex];
    const cellData = rowData[colIndex];
    const colMergeWith = cellData.colMergeWith;
    let lastColMergedIndex = -1;

    if (util.isExisty(colMergeWith)) {
        if (colMergeWith < tableRange.start.colIndex) {
            tableRange.start.colIndex = colMergeWith;
        }

        lastColMergedIndex = colMergeWith + rowData[colMergeWith].colspan - 1;
    } else if (cellData.colspan > 1) {
        lastColMergedIndex = colIndex + cellData.colspan - 1;
    }

    if (lastColMergedIndex > tableRange.end.colIndex) {
        tableRange.end.colIndex = lastColMergedIndex;
    }
}

/**
 * Expand table range by merge properties like colspan, rowspan.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }} tableRange - table range
 * @returns {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }}
 */
function _expandMergedRange(tableData, tableRange) {
    let rangeStr = '';

    while (rangeStr !== JSON.stringify(tableRange)) {
        rangeStr = JSON.stringify(tableRange);

        _expandRowMergedRange(tableData, tableRange, 'start');
        _expandRowMergedRange(tableData, tableRange, 'end');

        util.range(tableRange.start.rowIndex, tableRange.end.rowIndex + 1).forEach(rowIndex => {
            _expandColMergedRange(tableData, tableRange, rowIndex, tableRange.start.colIndex);
            _expandColMergedRange(tableData, tableRange, rowIndex, tableRange.end.colIndex);
        });
    }

    return tableRange;
}

/**
 * Find table range for selection.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {jQuery} $start - start jQuery element
 * @param {jQuery} $end - end jQuery element
 * @returns {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }}
 */
function findSelectionRange(tableData, $start, $end) {
    const unmergedRange = _findUnmergedRange(tableData, $start, $end);

    return _expandMergedRange(tableData, unmergedRange);
}

export default {
    findSelectionRange
};
