/**
 * @fileoverview Implements mergedTableRemoveRow
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import CommandManager from '../../commandManager';
import tableDataHandler from './tableDataHandler';
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

        if (!sq.hasFormat('TD')) {
            return;
        }

        const $startContainer = $(range.startContainer);
        const $table = $startContainer.closest('table');
        const data = tableDataHandler.createDataFrom$Table($table);
        const beforeRowLength = data.base.length;
        const indexes = tableDataHandler.findIndexes(data.mapping, $startContainer);

        _removeRow(data, indexes);

        if (beforeRowLength === data.base.length) {
            return;
        }

        const renderData = tableDataHandler.createRenderData(data);
        const $newTable = tableRenderer.replaceTable($table, renderData);

        $newTable.data('data', data);

        _focus(sq, range, $newTable, data, indexes);
    }
});

/**
 * Update rowspan to row merger.
 * @param {Array.<Array.<object>>} base - base table data
 * @param {number} startRowIndex - start row index
 * @param {number} endRowIndex - end row index
 * @private
 */
function _updateRowspan(base, startRowIndex, endRowIndex) {
    util.range(startRowIndex, endRowIndex + 1).forEach(rowIndex => {
        base[rowIndex].forEach((cell, cellIndex) => {
            if (cell.rowMerged) {
                const merger = base[cell.rowMergeStart][cellIndex];

                if (merger.rowspan) {
                    merger.rowspan -= 1;
                }
            } else if (cell.rowspan > 1) {
                const lastMergedRowIndex = rowIndex + cell.rowspan - 1;

                cell.rowspan -= (endRowIndex - rowIndex + 1);

                if (lastMergedRowIndex > endRowIndex) {
                    base[endRowIndex + 1][cellIndex] = util.extend({}, cell);
                }
            }
        });
    });
}

/**
 * Update row merge start index to merged cell.
 * @param {Array.<Array.<object>>} base - base table data
 * @param {number} startRowIndex - start row index
 * @param {number} endRowIndex - end row index
 * @private
 */
function _updateMergeStartIndex(base, startRowIndex, endRowIndex) {
    base.slice(endRowIndex + 1).forEach(row => {
        row.forEach(cell => {
            if (cell.rowMerged && cell.rowMergeStart >= startRowIndex) {
                cell.rowMergeStart = endRowIndex + 1;
            }
        });
    });
}

/**
 * Remove row.
 * @param {{base: Array.<Array.<object>>, mapping: Array.<Array.<object>>}} data - table data
 * @param {{rowIndex: number, cellIndex: number}} indexes - indexes of base data
 * @private
 */
export function _removeRow(data, indexes) {
    const base = data.base;
    const startRowIndex = indexes.rowIndex;
    const endRowIndex = tableDataHandler.findRowMergedLastIndex(data.base, indexes);
    const removeCount = endRowIndex - startRowIndex + 1;

    if (removeCount === base.length - 1) {
        return;
    }

    _updateRowspan(base, startRowIndex, endRowIndex);
    _updateMergeStartIndex(base, startRowIndex, endRowIndex);

    base.splice(startRowIndex, removeCount);
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
    if (data.base.length - 1 < rowIndex) {
        rowIndex -= 1;
    }

    const focusIndexes = tableDataHandler.getFocusIndexes(data, rowIndex, cellIndex);
    const focusTd = $newTable.find('tr').eq(focusIndexes.rowIndex).find('td')[focusIndexes.cellIndex];

    range.setStart(focusTd, 0);
    range.collapse(true);
    sq.setSelection(range);
}

export default RemoveRow;

