/**
 * @fileoverview Implements mergedTableRemoveCol
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import CommandManager from '../../commandManager';
import tableDataHandler from './tableDataHandler';
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

        if (!sq.hasFormat('TD') && !sq.hasFormat('TH')) {
            return;
        }

        const $startContainer = $(range.startContainer);
        const $table = $startContainer.closest('table');
        const data = tableDataHandler.createDataFrom$Table($table);
        const beforeCellLength = data.base[0].length;
        const mpIndexes = tableDataHandler.findMappingIndexes($startContainer);

        _removeCol(data, mpIndexes);

        if (beforeCellLength === data.base[0].length) {
            return;
        }

        const renderData = tableDataHandler.createRenderData(data);
        const $newTable = tableRenderer.replaceTable($table, renderData);

        $newTable.data('data', data);

        _focus(sq, range, $newTable, mpIndexes.cellIndex);
    }
});

/**
 * Get current row index for row addition.
 * @param {Array.<Array.<object>>} base - base table data
 * @param {number} rowIndex - row index of base table data
 * @param {number} cellIndex - cell index of base table data
 * @returns {number}
 * @private
 */
export function _getCurRowIndex(base, {rowIndex, cellIndex}) {
    const targetCell = base[rowIndex][cellIndex];
    let foundRowIndex = rowIndex;

    if (targetCell.rowspan > 1) {
        foundRowIndex += targetCell.rowspan - 1;
    }

    return foundRowIndex;
}

/**
 * Update colspan to col merger.
 * @param {Array.<Array.<object>>} base - base table data
 * @param {number} startCellIndex - start cell index
 * @param {number} endCellIndex - end cell index
 * @private
 */
function _updateColspan(base, startCellIndex, endCellIndex) {
    base.forEach(row => {
        util.range(startCellIndex, endCellIndex + 1).forEach(cellIndex => {
            const cell = row[cellIndex];

            if (cell.colMerged) {
                const merger = row[cell.colMergeStart];

                if (merger.colspan) {
                    merger.colspan -= 1;
                }
            } else if (cell.colspan > 1) {
                const lastMergedCellIndex = cellIndex + cell.colspan - 1;

                cell.colspan -= (endCellIndex - cellIndex + 1);

                if (lastMergedCellIndex > endCellIndex) {
                    row[endCellIndex + 1] = util.extend({}, cell);
                }
            }
        });
    });
}

/**
 * Update row merge start index to merged cell.
 * @param {Array.<Array.<object>>} base - base table data
 * @param {number} startCellIndex - start cell index
 * @param {number} endCellIndex - end cell index
 * @private
 */
function _updateMergeStartIndex(base, startCellIndex, endCellIndex) {
    base.forEach(row => {
        row.slice(endCellIndex + 1).forEach(cell => {
            if (cell.colMerged && cell.colMergeStart >= startCellIndex) {
                cell.colMergeStart = endCellIndex + 1;
            }
        });
    });
}

/**
 * Remove row.
 * @param {{base: Array.<Array.<object>>, mapping: Array.<Array.<object>>}} data - table data
 * @param {number} mpRowIndex - row index of mapping data
 * @param {number} mpCellIndex - cell index of mapping data
 * @private
 */
export function _removeCol(data, {rowIndex: mpRowIndex, cellIndex: mpCellIndex}) {
    const base = data.base;
    const indexes = data.mapping[mpRowIndex][mpCellIndex];
    const startCellIndex = indexes.cellIndex;
    const endCellIndex = tableDataHandler.getCurCellIndex(data.base, indexes);
    const removeCount = endCellIndex - startCellIndex + 1;

    if (removeCount === base[0].length) {
        return;
    }

    _updateColspan(base, startCellIndex, endCellIndex);
    _updateMergeStartIndex(base, startCellIndex, endCellIndex);

    base.forEach(row => {
        row.splice(startCellIndex, removeCount);
    });
    tableDataHandler.updateMappingData(data);
}

/**
 * Focus to cell.
 * @param {squireext} sq - squire instance
 * @param {range} range - range object
 * @param {jquery} $newTable - changed table jquery element
 * @param {number} cellIndex - cell index of mapping table data
 * @private
 */
function _focus(sq, range, $newTable, cellIndex) {
    const $cells = $newTable.find('tr').eq(0).find('th');
    const focusTh = $cells[cellIndex] || $cells[cellIndex - 1];

    range.setStart(focusTh, 0);
    range.collapse(true);
    sq.setSelection(range);
}

export default RemoveCol;

