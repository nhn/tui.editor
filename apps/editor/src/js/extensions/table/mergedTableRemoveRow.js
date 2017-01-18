/**
 * @fileoverview Implements mergedTableRemoveRow
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import CommandManager from '../../commandManager';
import dataHandler from './tableDataHandler';
import tableRangeHandler from './tableRangeHandler';
import tableRenderer from './tableRenderer';

const util = tui.util;

/**
 * RemoveRow
 * Remove row to selected table
 * @exports RemoveRow
 * @augments Command
 * @augments WysiwygCommand
 */
const RemoveRow = CommandManager.command('wysiwyg', /** @lends RemoveRow */{
    name: 'RemoveRow',
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
        const beforeRowLength = tableData.length;
        const $selectedCells = wwe.componentManager.getManager('tableSelection').getSelectedCells();
        const tableRange = tableRangeHandler.getTableSelectionRange(tableData, $selectedCells, $startContainer);

        _removeRow(tableData, tableRange);

        if (beforeRowLength === tableData.length) {
            return;
        }

        const $newTable = tableRenderer.replaceTable($table, tableData);
        const focusTd = _findFocusTd($newTable, tableRange.end.rowIndex, tableRange.start.colIndex);

        tableRenderer.focusToCell(sq, range, focusTd);

        // TODO: 개선 필요 - undo를 두번 실행해야 동작하는 문제를 해결하기 위해 임시방편으로 처리
        sq.undo();
        sq.redo();
    }
});

/**
 * Update rowspan to row merger.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} startRowIndex - start row index
 * @param {number} endRowIndex - end row index
 * @private
 */
function _updateRowspan(tableData, startRowIndex, endRowIndex) {
    util.range(startRowIndex, endRowIndex + 1).forEach(rowIndex => {
        tableData[rowIndex].forEach((cell, cellIndex) => {
            if (util.isExisty(cell.rowMergeWith)) {
                const merger = tableData[cell.rowMergeWith][cellIndex];

                if (merger.rowspan) {
                    merger.rowspan -= 1;
                }
            } else if (cell.rowspan > 1) {
                const lastMergedRowIndex = rowIndex + cell.rowspan - 1;

                cell.rowspan -= (endRowIndex - rowIndex + 1);

                if (lastMergedRowIndex > endRowIndex) {
                    tableData[endRowIndex + 1][cellIndex] = util.extend({}, cell);
                }
            }
        });
    });
}

/**
 * Update row merge start index to merged cell.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} startRowIndex - start row index
 * @param {number} endRowIndex - end row index
 * @private
 */
function _updateMergeStartIndex(tableData, startRowIndex, endRowIndex) {
    tableData.slice(endRowIndex + 1).forEach(row => {
        row.forEach(cell => {
            if (util.isExisty(cell.rowMergeWith) && cell.rowMergeWith >= startRowIndex) {
                cell.rowMergeWith = endRowIndex + 1;
            }
        });
    });
}

/**
 * Remove row.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }} tableRange - table selection range
 * @private
 */
export function _removeRow(tableData, tableRange) {
    const startRowIndex = tableRange.start.rowIndex;
    const endRange = tableRange.end;
    const endRowIndex = dataHandler.findRowMergedLastIndex(tableData, endRange.rowIndex, endRange.colIndex);
    const removeCount = endRowIndex - startRowIndex + 1;

    if (removeCount === tableData.length - 1) {
        return;
    }

    _updateRowspan(tableData, startRowIndex, endRowIndex);
    _updateMergeStartIndex(tableData, startRowIndex, endRowIndex);

    tableData.splice(startRowIndex, removeCount);
}

/**
 * Find focus td element.
 * @param {jQuery} $newTable - changed table jQuery element
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @returns {HTMLElement}
 */
function _findFocusTd($newTable, rowIndex, colIndex) {
    const tableData = dataHandler.createTableData($newTable);

    if (tableData.length - 1 < rowIndex) {
        rowIndex -= 1;
    }

    const cellElementIndex = dataHandler.findElementIndex(tableData, rowIndex, colIndex);

    return $newTable.find('tr').eq(cellElementIndex.rowIndex).find('td')[cellElementIndex.colIndex];
}

export default RemoveRow;

