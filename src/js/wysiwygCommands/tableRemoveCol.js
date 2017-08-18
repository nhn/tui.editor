/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */

import CommandManager from '../commandManager';
import domUtils from '../domUtils';

/**
 * RemoveCol
 * remove Row to selected table
 * @extends Command
 * @module wysiwygCommands/TableRemoveCol
 * @ignore
 */
const TableRemoveCol = CommandManager.command('wysiwyg', /** @lends RemoveCol */{
    name: 'RemoveCol',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec(wwe) {
        const sq = wwe.getEditor();
        const range = sq.getSelection().cloneRange();
        const tableMgr = wwe.componentManager.getManager('table');
        const isAbleToRemoveColumn = $(range.startContainer).closest('table').find('thead tr th').length > 1;

        wwe.focus();
        // IE 800a025e error on removing part of selection range. collpase
        range.collapse(true);
        sq.setSelection(range);

        if (sq.hasFormat('TR', null, range) && isAbleToRemoveColumn) {
            sq.saveUndoState(range);
            const $cell = getCellByRange(range);
            const $nextFocus = $cell.next().length ? $cell.next() : $cell.prev();

            removeColByCell($cell);

            focusToCell(sq, $nextFocus, tableMgr);
        }
    }
});

/**
 * Get cell by range object
 * @param {Range} range range
 * @returns {HTMLElement|Node}
 */
function getCellByRange(range) {
    let cell = range.startContainer;

    if (domUtils.getNodeName(cell) === 'TD' || domUtils.getNodeName(cell) === 'TH') {
        cell = $(cell);
    } else {
        cell = $(cell).parentsUntil('tr');
    }

    return cell;
}

/**
 * Remove column by given cell
 * @param {jQuery} $cell jQuery wrapped table cell
 */
function removeColByCell($cell) {
    const index = $cell.index();

    $cell.parents('table').find('tr').each((n, tr) => {
        $(tr).children().eq(index).remove();
    });
}

/**
 * Focus to given cell
 * @param {Squire} sq Squire instance
 * @param {jQuery} $cell jQuery wrapped table cell
 * @param {object} tableMgr Table manager instance
 */
function focusToCell(sq, $cell, tableMgr) {
    const nextFocusCell = $cell.get(0);

    if ($cell.length) {
        const range = sq.getSelection();
        range.selectNodeContents($cell[0]);
        range.collapse(true);
        sq.setSelection(range);

        tableMgr.setLastCellNode(nextFocusCell);
    }
}

module.exports = TableRemoveCol;
