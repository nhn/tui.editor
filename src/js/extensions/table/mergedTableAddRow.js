/**
 * @fileoverview Implements mergedTableAddRow
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import CommandManager from '../../commandManager';
import dataHandler from './tableDataHandler';
import tableRenderer from './tableRenderer';


const util = tui.util;

/**
 * AddRow
 * Add Row to selected table
 * @exports AddRow
 * @augments Command
 * @augments WysiwygCommand
 */
const AddRow = CommandManager.command('wysiwyg', /** @lends AddRow */{
    name: 'AddRow',
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
        let cellIndexData = dataHandler.createCellIndexData(tableData);
        const {rowIndex, colIndex} = dataHandler.findCellIndex(cellIndexData, $startContainer);

        _addRow(tableData, rowIndex, colIndex);
        cellIndexData = dataHandler.createCellIndexData(tableData); // row 추가로 인한 갱신

        const renderData = dataHandler.createRenderData(tableData, cellIndexData);
        const $newTable = tableRenderer.replaceTable($table, renderData);
        const focusTd = _findFocusTd(tableData, cellIndexData, $newTable, rowIndex, colIndex);

        tableRenderer.focusToCell(sq, range, focusTd);

        // TODO: 개선 필요 - undo를 두번 실행해야 동작하는 문제를 해결하기 위해 임시방편으로 처리
        sq.undo();
        sq.redo();
    }
});

/**
 * Create row merged cell data.
 * @param {number} rowMergeWith - row merge with index
 * @returns {{
 *   nodeName: string,
 *   rowMergeWith: number
 * }}
 * @private
 */
function _createRowMergedCell(rowMergeWith) {
    return {
        nodeName: 'TD',
        rowMergeWith
    };
}

/**
 * Create new row.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} rowIndex - row index of table data
 * @returns {object}
 * @private
 */
export function _createNewRow(tableData, rowIndex) {
    let prevCell = null;

    return tableData[rowIndex].map((cellData, cellIndex) => {
        let newCell;

        if (util.isExisty(cellData.rowMergeWith)) {
            const {rowMergeWith} = cellData;
            const merger = tableData[rowMergeWith][cellIndex];
            const lastMergedRowIndex = rowMergeWith + merger.rowspan - 1;

            if (util.isExisty(merger.colMergeWith) && prevCell) {
                newCell = util.extend({}, prevCell);
            } else if (lastMergedRowIndex > rowIndex) {
                merger.rowspan += 1;
                newCell = util.extend({}, cellData);
            }
        } else if (cellData.rowspan > 1) {
            cellData.rowspan += 1;
            newCell = _createRowMergedCell(rowIndex);
        }

        if (!newCell) {
            newCell = dataHandler.createBasicCell();
        }

        prevCell = newCell;

        return newCell;
    });
}

/**
 * Add row.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @private
 */
export function _addRow(tableData, rowIndex, colIndex) {
    let lastMergedRowIndex = 0;

    if (rowIndex > 0) {
        const cellData = tableData[rowIndex][colIndex];
        lastMergedRowIndex = dataHandler.findRowMergedLastIndex(cellData, rowIndex);
    }

    const newRow = _createNewRow(tableData, lastMergedRowIndex);
    const newRowIndex = lastMergedRowIndex + 1;

    tableData.splice(newRowIndex, 0, newRow);
}

/**
 * Find focus td element.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {Array.<Array.<object>>} cellIndexData - cell index data
 * @param {jQuery} $newTable - changed table jQuery element
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @returns {HTMLElement}
 */
function _findFocusTd(tableData, cellIndexData, $newTable, rowIndex, colIndex) {
    const cellData = tableData[rowIndex][colIndex];
    const newRowIndex = dataHandler.findRowMergedLastIndex(cellData, rowIndex) + 1;
    const newColIndex = dataHandler.findColMergedLastIndex(cellData, colIndex);
    const cellElementIndex = dataHandler.findFocusCellElementIndex(cellData, cellIndexData, newRowIndex, newColIndex);

    return $newTable.find('tr').eq(cellElementIndex.rowIndex).find('td')[cellElementIndex.colIndex];
}

export default AddRow;

