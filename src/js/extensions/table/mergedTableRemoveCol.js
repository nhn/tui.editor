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
        const indexes = tableDataHandler.findIndexes(data.mapping, $startContainer);

        _removeCol(data, indexes);

        if (beforeCellLength === data.base[0].length) {
            return;
        }

        const renderData = tableDataHandler.createRenderData(data);
        const $newTable = tableRenderer.replaceTable($table, renderData);

        $newTable.data('data', data);

        _focus(sq, range, $newTable, data, indexes);
    }
});

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
 * @param {{base: Array.<Array.<object>>, mapping: Array.<Array.<object>>}} data - table data for editing table element
 * @param {{rowIndex: number, cellIndex: number}} indexes - indexes of base data
 * @private
 */
export function _removeCol(data, indexes) {
    const base = data.base;
    const startCellIndex = indexes.cellIndex;
    const endCellIndex = tableDataHandler.findColMergedLastIndex(data.base, indexes);
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
 * @param {{base: Array.<Array.<object>>, mapping: Array.<Array.<object>>}} data - table data for editing table element
 * @param {number} rowIndex - row index of base table data
 * @param {number} cellIndex - cell index of base table data
 * @private
 */
function _focus(sq, range, $newTable, data, {rowIndex, cellIndex}) {
    if (data.base[0].length - 1 < cellIndex) {
        cellIndex -= 1;
    }

    const focusIndexes = tableDataHandler.getFocusIndexes(data, rowIndex, cellIndex);
    const focusCell = $newTable.find('tr').eq(focusIndexes.rowIndex).find('td, th')[focusIndexes.cellIndex];

    range.setStart(focusCell, 0);
    range.collapse(true);
    sq.setSelection(range);
}

export default RemoveCol;

