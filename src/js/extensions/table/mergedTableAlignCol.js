/**
 * @fileoverview Implements mergedTableAlignCol
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import CommandManager from '../../commandManager';
import dataHandler from './tableDataHandler';
import tableRenderer from './tableRenderer';

const util = tui.util;

/**
 * AlignCol
 * Align selected column's text content to given direction
 * @exports AlignCol
 * @augments Command
 * @augments WysiwygCommand
 */
const AlignCol = CommandManager.command('wysiwyg', /** @lends AlignCol */{
    name: 'AlignCol',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - WYsiwygEditor instance
     * @param {string} alignDirection - align direction for table header
     */
    exec(wwe, alignDirection) {
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
        const elementRowIndex = dataHandler.findElementRowIndex($startContainer);
        const elementColIndex = dataHandler.findElementColIndex($startContainer);
        const {colIndex} = cellIndexData[elementRowIndex][elementColIndex];

        _align(tableData[0], colIndex, alignDirection);
        cellIndexData = dataHandler.createCellIndexData(tableData); // column 삭제로 인한 갱신

        const renderData = dataHandler.createRenderData(tableData, cellIndexData);
        const $newTable = tableRenderer.replaceTable($table, renderData);
        const focusCell = _findFocusCell($newTable, elementRowIndex, elementColIndex);

        tableRenderer.focusToCell(sq, range, focusCell);

        // TODO: 개선 필요 - undo를 두번 실행해야 동작하는 문제를 해결하기 위해 임시방편으로 처리
        sq.undo();
        sq.redo();
    }
});

/**
 * Align to table header.
 * @param {Array.<object>} headRowData - head row data
 * @param {number} colIndex - column index of tabld data
 * @param {string} alignDirection - align direction
 * @private
 */
function _align(headRowData, colIndex, alignDirection) {
    const headCellData = headRowData[colIndex];

    if (util.isExisty(headCellData.colMergeWith)) {
        headRowData[headCellData.colMergeWith].align = alignDirection;
    } else {
        headCellData.align = alignDirection;
    }
}

/**
 * Find focus cell element like td or th.
 * @param {jQuery} $newTable - changed table jQuery element
 * @param {number} elementRowIndex - row index of table element
 * @param {number} elementCellIndex - column index of talbe element
 * @returns {HTMLElement}
 */
function _findFocusCell($newTable, elementRowIndex, elementCellIndex) {
    return $newTable.find('tr').eq(elementRowIndex).find('td, th')[elementCellIndex];
}

export default AlignCol;

