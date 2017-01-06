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

    $table.find('tr').each((trIndex, tr) => {
        let stackedColCount = 0;

        tableData[trIndex] = tableData[trIndex] || [];

        $(tr).children().each((tdIndex, cell) => {
            const cellData = _parseCell(cell);
            let cellIndex = tdIndex + stackedColCount;

            while (tableData[trIndex][cellIndex]) {
                cellIndex += 1;
                stackedColCount += 1;
            }

            tableData[trIndex][cellIndex] = cellData;
            _addMergedCell(tableData, cellData, trIndex, cellIndex);
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
 * Create render data.
 * @param {Array.<object>} tableData - table data
 * @param {Array.<object>} cellIndexData - cell index data
 * @returns {Array.<Array.<object>>}
 */
function createRenderData(tableData, cellIndexData) {
    return cellIndexData.map(row => row.map(({rowIndex, colIndex}) => tableData[rowIndex][colIndex]));
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
        content: ''
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
 * @param {{rowspan: number}} cellData - cell data of table data
 * @param {number} rowIndex - row index of table data
 * @returns {number}
 */
function findRowMergedLastIndex(cellData, rowIndex) {
    let foundRowIndex = rowIndex;

    if (cellData.rowspan > 1) {
        foundRowIndex += cellData.rowspan - 1;
    }

    return foundRowIndex;
}

/**
 * Find last index of col merged cells.
 * @param {{colspan: number}} cellData - cell data of table data
 * @param {number} colIndex - column index of tabld data
 * @returns {number}
 */
function findColMergedLastIndex(cellData, colIndex) {
    let foundColIndex = colIndex;

    if (cellData.colspan > 1) {
        foundColIndex += cellData.colspan - 1;
    }

    return foundColIndex;
}

/**
 * Find focus cell element index.
 * @param {{rowMergWith: ?number, colMergeWith: ?number}} cellData - cell data of table data
 * @param {Array.<Array.<object>>} cellIndexData - cell index data
 * @param {number} rowIndex - row index of base data
 * @param {number} colIndex - col index of base data
 * @returns {{rowIndex: number, colIndex: number}}
 */
function findFocusCellElementIndex(cellData, cellIndexData, rowIndex, colIndex) {
    const focusCellIndex = {};

    rowIndex = util.isExisty(cellData.rowMereWith) ? cellData.rowMereWith : rowIndex;
    colIndex = util.isExisty(cellData.colMereWith) ? cellData.colMereWith : colIndex;

    cellIndexData.forEach((row, elementRowIndex) => {
        row.forEach((cell, elementColIndex) => {
            if (cell.rowIndex === rowIndex && cell.colIndex === colIndex) {
                focusCellIndex.rowIndex = elementRowIndex;
                focusCellIndex.colIndex = elementColIndex;
            }
        });
    });

    return focusCellIndex;
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
    findFocusCellElementIndex
};
