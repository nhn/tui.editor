/**
 * @fileoverview Implements mergedTableAddRow
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import CommandManager from '../../commandManager';
import tableDataHandler from './tableDataHandler';
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

        if (!sq.hasFormat('TD') && !sq.hasFormat('TH')) {
            return;
        }

        const $startContainer = $(range.startContainer);
        const $table = $startContainer.closest('table');
        const data = tableDataHandler.createDataFrom$Table($table);
        const indexes = tableDataHandler.findIndexes(data.mapping, $startContainer);

        _addRow(data, indexes);

        const renderData = tableDataHandler.createRenderData(data);
        const $newTable = tableRenderer.replaceTable($table, renderData);

        _focus(sq, range, $newTable, data, indexes);
    }
});

/**
 * Create row merged cell data.
 * @param {number} rowMergeStart - row merge start index
 * @returns {{
 *   nodeName: string,
 *   rowMerged: boolean,
 *   rowMergeStart: number
 * }}
 * @private
 */
function _createRowMergedCell(rowMergeStart) {
    return {
        nodeName: 'TD',
        rowMerged: true,
        rowMergeStart
    };
}

/**
 * Create new row.
 * @param {Array.<Array.<object>>} base - base table data
 * @param {number} rowIndex - row index
 * @returns {object}
 * @private
 */
export function _createNewRow(base, rowIndex) {
    let prevCell = null;

    return base[rowIndex].map((cell, cellIndex) => {
        let newCell;

        if (cell.rowMerged) {
            const {rowMergeStart} = cell;
            const merger = base[rowMergeStart][cellIndex];

            if (merger.colMerged && prevCell) {
                newCell = util.extend({}, prevCell);
            } else if ((rowMergeStart + merger.rowspan - 1) > rowIndex) {
                base[rowMergeStart][cellIndex].rowspan += 1;
                newCell = util.extend({}, cell);
            }
        } else if (cell.rowspan > 1) {
            cell.rowspan += 1;
            newCell = _createRowMergedCell(rowIndex);
        }

        if (!newCell) {
            newCell = tableDataHandler.createBasicCell();
        }

        prevCell = newCell;

        return newCell;
    });
}

/**
 * Add row.
 * @param {{base: Array.<Array.<object>>, mapping: Array.<Array.<object>>}} data - table data
 * @param {{rowIndex: number, cellIndex: number}} indexes - indexes of base data
 * @private
 */
export function _addRow(data, indexes) {
    let rowIndex = 0;

    if (indexes.rowIndex > 0) {
        rowIndex = tableDataHandler.findRowMergedLastIndex(data.base, indexes);
    }

    const newRow = _createNewRow(data.base, rowIndex);
    const newRowIndex = rowIndex + 1;

    data.base.splice(newRowIndex, 0, newRow);
    tableDataHandler.updateMappingData(data);
}


/**
 * Focus to cell.
 * @param {squireext} sq - squire instance
 * @param {range} range - range object
 * @param {jquery} $newTable - changed table jquery element
 * @param {{base: Array.<Array.<object>>, mapping: Array.<Array.<object>>}} data - table data for editing table element
 * @param {{rowIndex: number, cellIndex: number}} indexes - indexes of base data
 * @private
 */
function _focus(sq, range, $newTable, data, indexes) {
    const {rowIndex, cellIndex} = tableDataHandler.findMergedLastIndexes(data.base, indexes);

    const focusIndexes = tableDataHandler.getFocusIndexes(data, rowIndex + 1, cellIndex);
    const focusTd = $newTable.find('tr').eq(focusIndexes.rowIndex).find('td')[focusIndexes.cellIndex];

    range.setStart(focusTd, 0);
    range.collapse(true);
    sq.setSelection(range);
}

export default AddRow;

