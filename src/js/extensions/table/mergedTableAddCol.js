/**
 * @fileoverview Implements mergedTableAddCol
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import CommandManager from '../../commandManager';
import tableDataHandler from './tableDataHandler';
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

        if (!sq.hasFormat('TD') && !sq.hasFormat('TH')) {
            return;
        }

        const $startContainer = $(range.startContainer);
        const $table = $startContainer.closest('table');
        const data = tableDataHandler.createDataFrom$Table($table);
        const indexes = tableDataHandler.findIndexes(data.mapping, $startContainer);

        _addCol(data, indexes);

        const renderData = tableDataHandler.createRenderData(data);
        const $newTable = tableRenderer.replaceTable($table, renderData);

        $newTable.data('data', data);

        _focus(sq, range, $newTable, data, indexes);
    }
});

/**
 * Create cole merged cell.
 * @param {number} colMergeStart - col merge start index
 * @param {string} nodeName - node name
 * @returns {{
 *   nodeName: string,
 *   colMerged: boolean,
 *   colMergeStart: number
 * }}
 * @private
 */
function _createColMergedCell(colMergeStart, nodeName) {
    return {
        nodeName,
        colMerged: true,
        colMergeStart
    };
}

/**
 * Create new col.
 * @param {Array.<Array.<object>>} base - base table data
 * @param {number} cellIndex - cell index
 * @returns {Array.<object>}
 * @private
 */
export function _createNewCol(base, cellIndex) {
    const newColumns = [];
    let prevCell = null;

    base.forEach((row, rowIndex) => {
        const cell = row[cellIndex];
        let newCell;

        if (cell.colMerged) {
            const {colMergeStart} = cell;
            const merger = base[rowIndex][colMergeStart];

            if (merger.rowMerged && prevCell) {
                newCell = util.extend({}, prevCell);
            } else if ((colMergeStart + merger.colspan - 1) > cellIndex) {
                base[rowIndex][colMergeStart].colspan += 1;
                newCell = util.extend({}, cell);
            }
        } else if (cell.colspan > 1) {
            cell.colspan += 1;
            newCell = _createColMergedCell(cellIndex, cell.nodeName);
        }

        if (!newCell) {
            newCell = tableDataHandler.createBasicCell(cell.nodeName);
        }

        prevCell = newCell;

        newColumns.push(newCell);
    });

    return newColumns;
}

/**
 * Add col.
 * @param {{base: Array.<Array.<object>>, mapping: Array.<Array.<object>>}} data - table data
 * @param {{rowIndex: number, cellIndex: number}} indexes - indexes of base data
 * @private
 */
export function _addCol(data, indexes) {
    const cellIndex = tableDataHandler.findColMergedLastIndex(data.base, indexes);
    const newColumns = _createNewCol(data.base, cellIndex);

    data.base.forEach((row, rowIndex) => {
        row.splice(cellIndex + 1, 0, newColumns[rowIndex]);
    });

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

    const focusIndexes = tableDataHandler.getFocusIndexes(data, rowIndex, cellIndex + 1);
    const focusTh = $newTable.find('tr').eq(focusIndexes.rowIndex).find('td, th')[focusIndexes.cellIndex];

    range.setStart(focusTh, 0);
    range.collapse(true);
    sq.setSelection(range);
}

export default AddCol;

