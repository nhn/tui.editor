/**
 * @fileoverview Implements MergeCell
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import CommandManager from '../../commandManager';
import dataHandler from './tableDataHandler';
import tableRangeHandler from './tableRangeHandler';
import tableRenderer from './tableRenderer';

const util = tui.util;

const MergeCell = CommandManager.command('wysiwyg', /** @lends MergeCell */{
    name: 'MergeCell',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - WYsiwygEditor instance
     */
    exec(wwe) {
        const sq = wwe.getEditor();
        const range = sq.getSelection().cloneRange();

        sq.focus();

        if (!sq.hasFormat('TABLE')) {
            return;
        }

        const $startContainer = $(range.startContainer);
        const $table = $startContainer.closest('table');
        const tableData = dataHandler.createTableData($table);
        const $selectedCells = wwe.componentManager.getManager('tableSelection').getSelectedCells();

        if ($selectedCells.length < 2 || $selectedCells.first()[0].nodeName !== $selectedCells.last()[0].nodeName) {
            return;
        }

        const tableRange = tableRangeHandler.getTableSelectionRange(tableData, $selectedCells, $startContainer);

        _mergeCells(tableData, tableRange);

        const $newTable = tableRenderer.replaceTable($table, tableData);
        const focusCell = _findFocusCell($newTable, tableRange.start.rowIndex, tableRange.start.colIndex);

        tableRenderer.focusToCell(sq, range, focusCell);
    }
});

/**
 * Initialize cell data of target rows.
 * @param {Array.<Array.<object>>} targetRows - target rows
 * @param {number} startColIndex - start column index
 * @param {number} endColIndex - end column index
 * @private
 */
function _initCellData(targetRows, startColIndex, endColIndex) {
    const limitColIndex = endColIndex + 1;
    const targetCells = targetRows.map(rowData => rowData.slice(startColIndex, limitColIndex));

    [].concat(...targetCells).slice(1).forEach(cellData => {
        const nodeName = cellData.nodeName;

        util.forEach(cellData, (value, name) => (delete cellData[name]));
        cellData.nodeName = nodeName;
    });
}

/**
 * Update rowMergeWith property of target rows for row merge.
 * @param {Array.<Array.<object>>} targetRows - target rows
 * @param {number} startColIndex - start column index
 * @param {number} endColIndex - end column index
 * @param {number} rowMergeWith - index of row merger
 * @private
 */
function _updateRowMergeWith(targetRows, startColIndex, endColIndex, rowMergeWith) {
    const limitColIndex = endColIndex + 1;

    targetRows.forEach(rowData => {
        rowData.slice(startColIndex, limitColIndex).forEach(cellData => {
            cellData.rowMergeWith = rowMergeWith;
        });
    });
}

/**
 * Update colMergeWith property of target rows for column merge.
 * @param {Array.<Array.<object>>} targetRows - target rows
 * @param {number} startColIndex - start column index
 * @param {number} endColIndex - end column index
 * @param {number} colMergeWith - index of column merger
 * @private
 */
function _updateColMergeWith(targetRows, startColIndex, endColIndex, colMergeWith) {
    const limitColIndex = endColIndex + 1;

    targetRows.forEach(rowData => {
        rowData.slice(startColIndex, limitColIndex).forEach(cellData => {
            cellData.colMergeWith = colMergeWith;
        });
    });
}

/**
 * Merge selected cells.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{rowIndex: number, colIndex: number}} startRange - start table selection range
 * @param {{rowIndex: number, colIndex: number}} endRange - end table selection range
 * @private
 */
export function _mergeCells(tableData, {start: startRange, end: endRange}) {
    const startRowIndex = startRange.rowIndex;
    const startColIndex = startRange.colIndex;
    const endRowIndex = endRange.rowIndex;
    const endColIndex = endRange.colIndex;
    const merger = tableData[startRowIndex][startColIndex];
    const targetRows = tableData.slice(startRowIndex, endRowIndex + 1);
    const rowspan = endRowIndex - startRowIndex + 1;
    const colspan = endColIndex - startColIndex + 1;

    merger.rowspan = rowspan;
    merger.colspan = colspan;
    _initCellData(targetRows, startColIndex, endColIndex);

    if (rowspan > 1) {
        _updateRowMergeWith(targetRows.slice(1), startColIndex, endColIndex, startRowIndex);
    }

    if (colspan > 1) {
        _updateColMergeWith(targetRows, startColIndex + 1, endColIndex, startColIndex);
    }
}

/**
 * Find focus cell element like td or th.
 * @param {jQuery} $newTable - changed table jQuery element
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @returns {HTMLElement}
 * @private
 */
function _findFocusCell($newTable, rowIndex, colIndex) {
    const tableData = dataHandler.createTableData($newTable);
    const cellElementIndex = dataHandler.findElementIndex(tableData, rowIndex, colIndex);

    return $newTable.find('tr').eq(cellElementIndex.rowIndex).find('td, th')[cellElementIndex.colIndex];
}

export default MergeCell;
