/**
 * @fileoverview Implements tableDataHandler
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

const util = tui.util;

/**
 * Parse cell like td or th.
 * @param {HTMLElement} cell - cell element like td or th
 * @param {number} rowIndex - row index
 * @param {number} colIndex - column index
 * @returns {{
 *   nodeName: string,
 *   colspan: number,
 *   rowspan: number,
 *   content: string,
 *   align: ?string
 * }}
 * @private
 */
function _parseCell(cell, rowIndex, colIndex) {
    const $cell = $(cell);
    const colspan = $cell.attr('colspan');
    const rowspan = $cell.attr('rowspan');
    const cellData = {
        nodeName: cell.nodeName,
        colspan: colspan ? parseInt(colspan, 10) : 1,
        rowspan: rowspan ? parseInt(rowspan, 10) : 1,
        content: $cell.html(),
        elementIndex: {
            rowIndex,
            colIndex
        }
    };

    if (cell.nodeName === 'TH' && cell.align) {
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
                mergedData.colMergeWith = startCellIndex;
            }

            if (rowMerged) {
                mergedData.rowMergeWith = startRowIndex;
            }

            base[rowIndex][cellIndex] = mergedData;
        });
    });
}

/**
 * Create table data from jQuery table Element.
 * @param {jQuery} $table - jQuery table element
 * @returns {Array.<Array.<object>>}
 * @private
 */
export function createTableData($table) {
    const tableData = [];

    $table.find('tr').each((rowIndex, tr) => {
        let stackedColCount = 0;

        tableData[rowIndex] = tableData[rowIndex] || [];

        $(tr).children().each((colIndex, cell) => {
            const cellData = _parseCell(cell, rowIndex, colIndex);
            let dataColIndex = colIndex + stackedColCount;

            while (tableData[rowIndex][dataColIndex]) {
                dataColIndex += 1;
                stackedColCount += 1;
            }

            tableData[rowIndex][dataColIndex] = cellData;
            _addMergedCell(tableData, cellData, rowIndex, dataColIndex);
        });
    });

    return tableData;
}

/**
 * Create cell index data of table data.
 * @param {Array.<Array.<object>>} tableData - table data
 * @returns {Array.<Array.<object>>}
 * @priavte
 */
export function createCellIndexData(tableData) {
    const mappingData = [];

    tableData.forEach((row, rowIndex) => {
        const mappingRow = [];

        row.forEach((cell, colIndex) => {
            if (util.isUndefined(cell.colMergeWith) && util.isUndefined(cell.rowMergeWith)) {
                mappingRow.push({
                    rowIndex,
                    colIndex
                });
            }
        });
        mappingData.push(mappingRow);
    });

    return mappingData;
}

/**
 * Get header aligns.
 * @param {Array.<Array.<object>>} tableData - table data
 * @returns {Array.<?string>}
 */
function _getHeaderAligns(tableData) {
    const headRowData = tableData[0];

    return headRowData.map(cellData => {
        let align;

        if (util.isExisty(cellData.colMergeWith)) {
            align = headRowData[cellData.colMergeWith].align;
        } else {
            align = cellData.align;
        }

        return align;
    });
}

/**
 * Create render data.
 * @param {Array.<object>} tableData - table data
 * @param {Array.<object>} cellIndexData - cell index data
 * @returns {Array.<Array.<object>>}
 */
function createRenderData(tableData, cellIndexData) {
    const headerAligns = _getHeaderAligns(tableData);

    return cellIndexData.map(row => row.map(({rowIndex, colIndex}) => (util.extend({
        align: headerAligns[colIndex]
    }, tableData[rowIndex][colIndex]))));
}

const BASIC_CELL_CONTENT = tui.util.browser.msie ? '' : '<br>';

/**
 * Create basic cell data.
 * @param {number} rowIndex - row index
 * @param {number} colIndex - column index
 * @param {string} nodeName - node name
 * @returns {{
 *   nodeName: string,
 *   colspan: number,
 *   rowspan: number,
 *   content: string
 * }}
 */
function createBasicCell(rowIndex, colIndex, nodeName) {
    return {
        nodeName: nodeName || 'TD',
        colspan: 1,
        rowspan: 1,
        content: BASIC_CELL_CONTENT,
        elementIndex: {
            rowIndex,
            colIndex
        }
    };
}

/**
 * Find element row index.
 * @param {jQuery} $cell - cell jQuery element like td or th
 * @returns {number}
 */
function findElementRowIndex($cell) {
    const $tr = $cell.closest('tr');
    let rowIndex = $tr.prevAll().length;

    if ($tr.parent()[0].nodeName === 'TBODY') {
        rowIndex += 1;
    }

    return rowIndex;
}

/**
 * Find element col index.
 * @param {jQuery} $cell - cell jQuery element like td or th
 * @returns {number}
 */
function findElementColIndex($cell) {
    return $cell.closest('td, th').prevAll().length;
}


/**
 * Find indexes of base table data from mappin data.
 * @param {Array.<Array.<object>>} cellIndexData - cell index data
 * @param {jQuery} $cell - cell jQuery element like td or th
 * @returns {{rowIndex: number, cellIndex: number}}
 */
function findCellIndex(cellIndexData, $cell) {
    const elementRowIndex = findElementRowIndex($cell);
    const elementColIndex = findElementColIndex($cell);

    return cellIndexData[elementRowIndex][elementColIndex];
}

/**
 * Find last index of col merged cells.
 * @param {Array.<Array.<object>>} tableData - tableData data
 * @param {number} rowIndex - row index of base data
 * @param {number} colIndex - column index of tabld data
 * @returns {number}
 */
function findRowMergedLastIndex(tableData, rowIndex, colIndex) {
    const cellData = tableData[rowIndex][colIndex];
    let foundRowIndex = rowIndex;

    if (cellData.rowspan > 1) {
        foundRowIndex += cellData.rowspan - 1;
    }

    return foundRowIndex;
}

/**
 * Find last index of col merged cells.
 * @param {Array.<Array.<object>>} tableData - tableData data
 * @param {number} rowIndex - row index of base data
 * @param {number} colIndex - column index of tabld data
 * @returns {number}
 */
function findColMergedLastIndex(tableData, rowIndex, colIndex) {
    const cellData = tableData[rowIndex][colIndex];
    let foundColIndex = colIndex;

    if (cellData.colspan > 1) {
        foundColIndex += cellData.colspan - 1;
    }

    return foundColIndex;
}

/**
 * Find cell element index.
 * @param {Array.<Array.<object>>} tableData - tableData data
 * @param {number} rowIndex - row index of base data
 * @param {number} colIndex - col index of base data
 * @returns {{rowIndex: number, colIndex: number}}
 */
function findElementIndex(tableData, rowIndex, colIndex) {
    const cellData = tableData[rowIndex][colIndex];

    rowIndex = util.isExisty(cellData.rowMergeWith) ? cellData.rowMergeWith : rowIndex;
    colIndex = util.isExisty(cellData.colMergeWith) ? cellData.colMergeWith : colIndex;

    return tableData[rowIndex][colIndex].elementIndex;
}

/**
 * Find max cell count.
 * @param {Array.<Array.<object>>} tableData - table data
 * @returns {number}
 * @private
 */
function _findMaxCellCount(tableData) {
    const cellCounts = tableData.map(rowData => rowData.length);

    return Math.max.apply(null, cellCounts);
}

/**
 * Stuff cells into incomplete row.
 * @param {Array.<Array.<object>>} tableData - table data
 */
function stuffCellsIntoIncompleteRow(tableData) {
    const maxCellCount = _findMaxCellCount(tableData);

    tableData.forEach((rowData, rowIndex) => {
        const cellCount = rowData.length;
        const diffCount = maxCellCount - cellCount;
        const nodeName = rowData[0].nodeName;

        util.range(cellCount, cellCount + diffCount + 1).forEach(colIndex => {
            rowData.push(createBasicCell(nodeName, rowIndex, colIndex));
        });
    });
}

export default {
    createTableData,
    createCellIndexData,
    createRenderData,
    findElementRowIndex,
    findElementColIndex,
    findCellIndex,
    createBasicCell,
    findRowMergedLastIndex,
    findColMergedLastIndex,
    findElementIndex,
    stuffCellsIntoIncompleteRow
};
