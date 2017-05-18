/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */

import CommandManager from '../commandManager';

/**
 * AddRow
 * Add Row to selected table
 * @exports AddRow
 * @augments Command
 * @augments WysiwygCommand
 * @ignore
 */
const AddRow = CommandManager.command('wysiwyg', /** @lends AddRow */{
    name: 'AddRow',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec(wwe) {
        const sq = wwe.getEditor();
        const range = sq.getSelection().cloneRange();
        let $tr, $newRow;

        wwe.focus();

        if (sq.hasFormat('TD')) {
            sq.saveUndoState(range);
            $tr = $(range.startContainer).closest('tr');
            $newRow = getNewRow($tr);
            $newRow.insertAfter($tr);

            focusToFirstTd(sq, $newRow);
        } else if (sq.hasFormat('TH')) {
            sq.saveUndoState(range);
            $tr = $(range.startContainer).parents('thead').next('tbody').children('tr').eq(0);
            $newRow = getNewRow($tr);
            $newRow.insertBefore($tr);

            focusToFirstTd(sq, $newRow);
        }
    }
});

/**
 * Get new row of given row
 * @param {jQuery} $tr jQuery wrapped table row
 * @returns {HTMLElement}
 */
function getNewRow($tr) {
    const cloned = $tr.clone();
    const htmlString = tui.util.browser.msie ? '' : '<br />';

    cloned.find('td').html(htmlString);

    return cloned;
}
/**
 * Focus to first table cell
 * @param {Squire} sq Squire instance
 * @param {jQuery} $tr jQuery wrapped table row
 */
function focusToFirstTd(sq, $tr) {
    const range = sq.getSelection();

    range.selectNodeContents($tr.find('td')[0]);
    range.collapse(true);
    sq.setSelection(range);
}

module.exports = AddRow;
