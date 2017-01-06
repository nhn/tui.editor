/**
 * @fileoverview Implements mergedTableAddCol
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import CommandManager from '../../commandManager';
import dataHandler from './tableDataHandler';
import tableRenderer from './tableRenderer';

const util = tui.util;

/**
 * AddCol
 * Add Row to selected table
 * @exports AddCol
 * @augments Command
 * @augments WysiwygCommand
 */
const AddCol = CommandManager.command('wysiwyg', /** @lends AddCol */{
    name: 'AddCol',
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

        _addColumns(tableData, rowIndex, colIndex);
        cellIndexData = dataHandler.createCellIndexData(tableData); // column 추가로 인한 갱신

        const renderData = dataHandler.createRenderData(tableData, cellIndexData);
        const $newTable = tableRenderer.replaceTable($table, renderData);
        const focusCell = _findFocusCell(tableData, cellIndexData, $newTable, rowIndex, colIndex);

        tableRenderer.focusToCell(sq, range, focusCell);

        // TODO: 개선 필요 - undo를 두번 실행해야 동작하는 문제를 해결하기 위해 임시방편으로 처리
        sq.undo();
        sq.redo();
    }
});

/**
 * Create column merged cell.
 * @param {number} colMergeWith - column merge start index
 * @param {string} nodeName - node name
 * @returns {{
 *   nodeName: string,
 *   colMerged: boolean,
 *   colMergeWith: number
 * }}
 * @private
 */
function _createColMergedCell(colMergeWith, nodeName) {
    return {
        nodeName,
        colMergeWith
    };
}

/**
 * Create new columns.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} colIndex - col index
 * @returns {Array.<object>}
 * @private
 */
export function _createNewColumns(tableData, colIndex) {
    const newColumns = [];
    let prevCell = null;

    tableData.forEach(rowData => {
        const cellData = rowData[colIndex];
        let newCell;

        if (util.isExisty(cellData.colMergeWith)) {
            const {colMergeWith} = cellData;
            const merger = rowData[colMergeWith];
            const lastMergedCellIndex = colMergeWith + merger.colspan - 1;

            if (util.isExisty(merger.rowMergeWith) && prevCell) {
                newCell = util.extend({}, prevCell);
            } else if (lastMergedCellIndex > colIndex) {
                merger.colspan += 1;
                newCell = util.extend({}, cellData);
            }
        } else if (cellData.colspan > 1) {
            cellData.colspan += 1;
            newCell = _createColMergedCell(colIndex, cellData.nodeName);
        }

        if (!newCell) {
            newCell = dataHandler.createBasicCell(cellData.nodeName);
        }

        prevCell = newCell;

        newColumns.push(newCell);
    });

    return newColumns;
}

/**
 * Add columns.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @private
 */
export function _addColumns(tableData, rowIndex, colIndex) {
    const cellData = tableData[rowIndex][colIndex];
    const lastMergedColIndex = dataHandler.findColMergedLastIndex(cellData, colIndex);
    const newColumns = _createNewColumns(tableData, lastMergedColIndex);
    const newColIndex = colIndex + 1;

    tableData.forEach((rowData, _rowIndex) => {
        rowData.splice(newColIndex, 0, newColumns[_rowIndex]);
    });
}

/**
 * Find focus cell element like td or th.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {Array.<Array.<object>>} cellIndexData - cell index data
 * @param {jQuery} $newTable - changed table jQuery element
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @returns {HTMLElement}
 */
function _findFocusCell(tableData, cellIndexData, $newTable, rowIndex, colIndex) {
    const cellData = tableData[rowIndex][colIndex];
    const newRowIndex = dataHandler.findRowMergedLastIndex(cellData, rowIndex);
    const newColIndex = dataHandler.findColMergedLastIndex(cellData, colIndex) + 1;
    const cellElementIndex = dataHandler.findFocusCellElementIndex(cellData, cellIndexData, newRowIndex, newColIndex);

    return $newTable.find('tr').eq(cellElementIndex.rowIndex).find('td, th')[cellElementIndex.colIndex];
}

export default AddCol;

