/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */

import CommandManager from '../commandManager';
import domUtils from '../domUtils';

/**
 * AddCol
 * Add col to selected table
 * @exports AddCol
 * @augments Command
 * @augments WysiwygCommand
 * @ignore
 */
const AddCol = CommandManager.command('wysiwyg', /** @lends AddCol */{
    name: 'AddCol',
    /**
     * 커맨드 핸들러
     * @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec(wwe) {
        const sq = wwe.getEditor();
        const range = sq.getSelection().cloneRange();
        let $cell;

        wwe.focus();

        if (sq.hasFormat('TR')) {
            sq.saveUndoState(range);

            $cell = getCellByRange(range);
            addColToCellAfter($cell);

            focusToNextCell(sq, $cell);
        }
    }
});

/**
 * Get cell by range object
 * @param {Range} range range
 * @returns {HTMLElement}
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
 * Add column to after the current cell
 * @param {jQuery} $cell jQuery wrapped table cell
 */
function addColToCellAfter($cell) {
    const index = $cell.index();
    let cellToAdd;

    $cell.parents('table').find('tr').each((n, tr) => {
        if (domUtils.getNodeName(tr.parentNode) === 'TBODY') {
            cellToAdd = $('<td></td>');
        } else {
            cellToAdd = $('<th></th>');
        }
        if (!tui.util.browser.msie) {
            cellToAdd.append($('<br />')[0]);
        }

        $(cellToAdd).insertAfter($(tr).children().eq(index));
    });
}

/**
 * Focus to next cell
 * @param {Squire} sq Squire instance
 * @param {jQuery} $cell jQuery wrapped table cell
 */
function focusToNextCell(sq, $cell) {
    const range = sq.getSelection();

    range.selectNodeContents($cell.next()[0]);
    range.collapse(true);

    sq.setSelection(range);
}

module.exports = AddCol;
