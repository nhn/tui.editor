/**
 * @fileoverview Implements mergedTableAlignCol
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import CommandManager from '../../commandManager';
import tableDataHandler from './tableDataHandler';
import tableRenderer from './tableRenderer';

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

        if (!sq.hasFormat('TD') && !sq.hasFormat('TH')) {
            return;
        }

        const $startContainer = $(range.startContainer);
        const $table = $startContainer.closest('table');
        const data = tableDataHandler.createDataFrom$Table($table);
        const mpIndexes = tableDataHandler.findMappingIndexes($startContainer);

        _align(data, mpIndexes, alignDirection);

        const renderData = tableDataHandler.createRenderData(data);
        const $newTable = tableRenderer.replaceTable($table, renderData);

        $newTable.data('data', data);

        _focus(sq, range, $newTable, mpIndexes);
    }
});

/**
 * Align to table header.
 * @param {{base: Array.<Array.<object>>, mapping: Array.<Array.<object>>}} data - table data
 * @param {object} indexes - mapping index info
 * @param {number} indexes.mpRowIndex - row index of mapping data
 * @param {number} indexes.mpCellIndex - cell index of mapping data
 * @param {string} alignDirection - align direction
 * @private
 */
function _align(data, {rowIndex: mpRowIndex, cellIndex: mpCellIndex}, alignDirection) {
    const indexes = data.mapping[mpRowIndex][mpCellIndex];
    const header = data.base[0];
    const headCell = header[indexes.cellIndex];

    if (headCell.colMerged) {
        header[headCell.colMergeStart].align = alignDirection;
    } else {
        headCell.align = alignDirection;
    }
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
function _focus(sq, range, $newTable, {rowIndex, cellIndex}) {
    const focusCell = $newTable.find('tr').eq(rowIndex).find('td, th')[cellIndex];

    range.setStart(focusCell, 0);
    range.collapse(true);
    sq.setSelection(range);
}

export default AlignCol;

