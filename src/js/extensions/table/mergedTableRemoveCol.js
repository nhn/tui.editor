/**
 * @fileoverview Implements mergedTableRemoveCol
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import CommandManager from '../../commandManager';
import dataHandler from './tableDataHandler';
import tableRenderer from './tableRenderer';

const util = tui.util;

/**
 * RemoveCol
 * Remove col to selected table
 * @exports RemoveCol
 * @augments Command
 * @augments WysiwygCommand
 */
const RemoveCol = CommandManager.command('wysiwyg', /** @lends RemoveCol */{
    name: 'RemoveCol',
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
        const beforeCellLength = tableData[0].length;
        let cellIndexData = dataHandler.createCellIndexData(tableData);
        const {rowIndex, colIndex} = dataHandler.findCellIndex(cellIndexData, $startContainer);

        _removeColumns(tableData, rowIndex, colIndex);

        if (beforeCellLength === tableData[0].length) {
            return;
        }

        cellIndexData = dataHandler.createCellIndexData(tableData); // column 삭제로 인한 갱신

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
 * Update colspan to col merger.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} startColIndex - start col index
 * @param {number} endColIndex - end col index
 * @private
 */
function _updateColspan(tableData, startColIndex, endColIndex) {
    tableData.forEach(rowData => {
        util.range(startColIndex, endColIndex + 1).forEach(colIndex => {
            const cellData = rowData [colIndex];

            if (util.isExisty(cellData.colMergeWith)) {
                const merger = rowData [cellData.colMergeWith];

                if (merger.colspan) {
                    merger.colspan -= 1;
                }
            } else if (cellData.colspan > 1) {
                const lastMergedCellIndex = colIndex + cellData.colspan - 1;

                cellData.colspan -= (endColIndex - colIndex + 1);

                if (lastMergedCellIndex > endColIndex) {
                    rowData [endColIndex + 1] = util.extend({}, cellData);
                }
            }
        });
    });
}

/**
 * Update row merge start index to merged cell.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} startColIndex - start col index
 * @param {number} endColIndex - end col index
 * @private
 */
function _updateMergeStartIndex(tableData, startColIndex, endColIndex) {
    tableData.forEach(rowData => {
        rowData.slice(endColIndex + 1).forEach(cellData => {
            if (util.isExisty(cellData.colMergeWith) && cellData.colMergeWith >= startColIndex) {
                cellData.colMergeWith = endColIndex + 1;
            }
        });
    });
}

/**
 * Remove columns.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @private
 */
export function _removeColumns(tableData, rowIndex, colIndex) {
    const startColIndex = colIndex;
    const cellData = tableData[rowIndex][colIndex];
    const endColIndex = dataHandler.findColMergedLastIndex(cellData, colIndex);
    const removeCount = endColIndex - startColIndex + 1;

    if (removeCount === tableData[0].length) {
        return;
    }

    _updateColspan(tableData, startColIndex, endColIndex);
    _updateMergeStartIndex(tableData, startColIndex, endColIndex);

    tableData.forEach(row => {
        row.splice(startColIndex, removeCount);
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

    if (tableData[0].length - 1 < colIndex) {
        colIndex -= 1;
    }

    const cellElementIndex = dataHandler.findFocusCellElementIndex(cellData, cellIndexData, rowIndex, colIndex);

    return $newTable.find('tr').eq(cellElementIndex.rowIndex).find('td, th')[cellElementIndex.colIndex];
}

export default RemoveCol;

