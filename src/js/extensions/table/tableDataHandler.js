/**
 * @fileoverview Implements tableDataHandler
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

const util = tui.util;

/**
 * Parse cell like td or th.
 * @param {HTMLElement} cell - cell element like td or th
 * @returns {{
 *   nodeName: string,
 *   colspan: number,
 *   rowspan: number,
 *   content: string,
 *   align: ?string
 * }}
 * @private
 */
function _parseCell(cell) {
    const $cell = $(cell);
    const colspan = $cell.attr('colspan');
    const rowspan = $cell.attr('rowspan');
    const cellData = {
        nodeName: cell.nodeName,
        colspan: colspan ? parseInt(colspan, 10) : 1,
        rowspan: rowspan ? parseInt(rowspan, 10) : 1,
        content: $cell.html()
    };

    if (cell.align) {
        cellData.align = cell.align;
    }

    return cellData;
}

/**
 * Add merged cell.
 * @param {object} base - base table data
 * @param {object} cellData - cell data
 * @param {number} startRowIndex - start row index
 * @param {number} startCellIndex - start cell index
 * @private
 */
function _addMergedCell(base, cellData, startRowIndex, startCellIndex) {
    const colspan = cellData.colspan;
    const rowspan = cellData.rowspan;
    const colMerged = colspan > 1;
    const rowMerged = rowspan > 1;
    const nodeName = cellData.nodeName;

    if (!colMerged && !rowMerged) {
        return;
    }

    const limitRowIndex = startRowIndex + rowspan;
    const limitCellIndex = startCellIndex + colspan;

    util.range(startRowIndex, limitRowIndex).forEach(rowIndex => {
        base[rowIndex] = base[rowIndex] || [];

        util.range(startCellIndex, limitCellIndex).forEach(cellIndex => {
            const mergedData = {
                nodeName
            };

            if (rowIndex === startRowIndex && cellIndex === startCellIndex) {
                return;
            }

            if (colMerged) {
                mergedData.colMerged = true;
                mergedData.colMergeStart = startCellIndex;
            }

            if (rowMerged) {
                mergedData.rowMerged = true;
                mergedData.rowMergeStart = startRowIndex;
            }

            base[rowIndex][cellIndex] = mergedData;
        });
    });
}

/**
 * Create base table data from jQuery table Element.
 * @param {jQuery} $table - jQuery table element
 * @returns {Array.<Array.<object>>}
 * @private
 */
export function _createBaseDataFrom$Table($table) {
    const baseTable = [];

    $table.find('tr').each((trIndex, tr) => {
        let stackedColCount = 0;

        baseTable[trIndex] = baseTable[trIndex] || [];

        $(tr).children().each((tdIndex, cell) => {
            const cellData = _parseCell(cell);
            let cellIndex = tdIndex + stackedColCount;

            while (baseTable[trIndex][cellIndex]) {
                cellIndex += 1;
                stackedColCount += 1;
            }

            baseTable[trIndex][cellIndex] = cellData;
            _addMergedCell(baseTable, cellData, trIndex, cellIndex);
        });
    });

    return baseTable;
}

/**
 * Create mapping data.
 * @param {Array.<Array.<object>>} base - base table data
 * @returns {Array.<Array.<object>>}
 * @priavte
 */
export function _createMappingData(base) {
    const mappingTable = [];

    base.forEach((row, rowIndex) => {
        const mappingRow = [];

        row.forEach((cell, cellIndex) => {
            if (!cell.colMerged && !cell.rowMerged) {
                mappingRow.push({
                    rowIndex,
                    cellIndex
                });
            }
        });
        mappingTable.push(mappingRow);
    });

    return mappingTable;
}

/**
 * Create table data from jQuery table element.
 * @param {jQuery} $table - jQuery table element
 * @returns {{base: object, mapping: object}}
 */
function createDataFrom$Table($table) {
    const base = _createBaseDataFrom$Table($table);

    return {
        base,
        mapping: _createMappingData(base)
    };
}

/**
 * Create render data.
 * @param {Array.<object>} base - base table data
 * @param {Array.<object>} mapping - mapping data
 * @returns {Array.<Array.<object>>}
 */
function createRenderData({base, mapping}) {
    return mapping.map(row => row.map(({rowIndex, cellIndex}) => base[rowIndex][cellIndex]));
}

/**
 * Create basice cell data.
 * @param {string} nodeName - node name
 * @returns {{
 *   nodeName: string,
 *   colspan: number,
 *   rowspan: number,
 *   content: string
 * }}
 */
function createBasicCell(nodeName) {
    return {
        nodeName: nodeName || 'TD',
        colspan: 1,
        rowspan: 1,
        content: '<br>'
    };
}

/**
 * Find mapping indexes.
 * @param {jQuery} $cell - jQuery element
 * @returns {{rowIndex: number, cellIndex: number}}
 */
function findMappingIndexes($cell) {
    const $tr = $cell.closest('tr');
    let rowIndex = $tr.prevAll().length;
    const cellIndex = $cell.closest('td, th').prevAll().length;

    if ($tr.parent()[0].nodeName === 'TBODY') {
        rowIndex += 1;
    }

    return {
        rowIndex,
        cellIndex
    };
}

/**
 * Update mapping data.
 * @param {{base: Array.<Array.<object>>, mpaaing: Array.<Array.<object>>}} data - table data
 */
function updateMappingData(data) {
    data.mapping = _createMappingData(data.base);
}

/**
 * Get current row index for row addition.
 * @param {Array.<Array.<object>>} base - base table data
 * @param {{rowIndex: number, cellIndex: number}} indexes - cell index info of base table data
 * @returns {number}
 */
function getCurRowIndex(base, indexes) {
    const targetCell = base[indexes.rowIndex][indexes.cellIndex];
    let foundRowIndex = indexes.rowIndex;

    if (targetCell.rowspan > 1) {
        foundRowIndex += targetCell.rowspan - 1;
    }

    return foundRowIndex;
}

/**
 * Get current cell index for col addition.
 * @param {Array.<Array.<object>>} base - base table data
 * @param {{rowIndex: number, cellIndex: number}} indexes - cell index info of base table data
 * @returns {number}
 */
function getCurCellIndex(base, indexes) {
    const targetCell = base[indexes.rowIndex][indexes.cellIndex];
    let foundCellIndex = indexes.cellIndex;

    if (targetCell.colspan > 1) {
        foundCellIndex += targetCell.colspan - 1;
    }

    return foundCellIndex;
}

export default {
    createDataFrom$Table,
    createRenderData,
    findMappingIndexes,
    createBasicCell,
    updateMappingData,
    getCurRowIndex,
    getCurCellIndex
};
