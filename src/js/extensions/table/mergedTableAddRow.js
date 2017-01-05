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
        const mpIndexes = tableDataHandler.findMappingIndexes($startContainer);

        _addRow(data, mpIndexes);

        const renderData = tableDataHandler.createRenderData(data);
        const $newTable = tableRenderer.replaceTable($table, renderData);

        $newTable.data('data', data);

        _focus(sq, range, $newTable, mpIndexes.rowIndex);
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
 * @param {number} mpRowIndex - row index of mapping data
 * @param {number} mpCellIndex - cell index of mapping data
 * @private
 */
export function _addRow(data, {rowIndex: mpRowIndex, cellIndex: mpCellIndex}) {
    let rowIndex = 0;

    if (mpRowIndex > 0) {
        const indexes = data.mapping[mpRowIndex][mpCellIndex];

        rowIndex = tableDataHandler.getCurRowIndex(data.base, indexes);
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
 * @param {number} rowIndex - row index of mapping table data
 * @param {number} cellIndex - cell index of mapping table data
 * @private
 */
function _focus(sq, range, $newTable, rowIndex) {
    const focusTd = $newTable.find('tr').eq(rowIndex + 1).find('td')[0];

    range.setStart(focusTd, 0);
    range.collapse(true);
    sq.setSelection(range);
}

export default AddRow;

