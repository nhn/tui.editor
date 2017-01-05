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
        const mpIndexes = tableDataHandler.findMappingIndexes($startContainer);

        _addCol(data, mpIndexes);

        const renderData = tableDataHandler.createRenderData(data);
        const $newTable = tableRenderer.replaceTable($table, renderData);

        $newTable.data('data', data);

        _focus(sq, range, $newTable, mpIndexes.cellIndex);
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
 * @param {number} mpRowIndex - mapping row index
 * @param {number} mpCellIndex - mapping cell index
 * @private
 */
export function _addCol(data, {rowIndex: mpRowIndex, cellIndex: mpCellIndex}) {
    const indexes = data.mapping[mpRowIndex][mpCellIndex];
    const cellIndex = tableDataHandler.getCurCellIndex(data.base, indexes);
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
 * @param {number} cellIndex - cell index of mapping table data
 * @private
 */
function _focus(sq, range, $newTable, cellIndex) {
    const focusTh = $newTable.find('tr').eq(0).find('th')[cellIndex + 1];

    range.setStart(focusTh, 0);
    range.collapse(true);
    sq.setSelection(range);
}

export default AddCol;

