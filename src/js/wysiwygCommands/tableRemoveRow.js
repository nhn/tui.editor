/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * RemoveRow
 * remove Row to selected table
 * @exports RemoveRow
 * @augments Command
 * @augments WysiwygCommand
 */
var RemoveRow = CommandManager.command('wysiwyg', /** @lends RemoveRow */{
    name: 'RemoveRow',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor();
        var range = sq.getSelection().cloneRange();
        var $table = $(range.startContainer).parents('table');
        var rangeInformation = wwe.getManager('tableSelection').getSelectionRangeFromTable(range);
        var $tr = getSelectedRows(range, rangeInformation, $table);
        var tbodyRowLength = $table.find('tbody tr').length;
        var $nextFocus;

        if ((sq.hasFormat('TD') || sq.hasFormat('TABLE')) && tbodyRowLength > 1) {
            sq.saveUndoState(range);
            $nextFocus = $tr.last().next().length ? $tr.last().next() : $tr.first().prev();

            $tr.remove();

            sq.focus();

            if ($nextFocus.length) {
                focusToFirstTd(sq, $nextFocus);
            }
        } else {
            sq.focus();
        }
    }
});

/**
 * Focus to first TD in given TR
 * @param {Squire} sq Squire instance
 * @param {jQuery} $tr jQuery wrapped TR
 */
function focusToFirstTd(sq, $tr) {
    var range;

    range = sq.getSelection();
    range.selectNodeContents($tr.find('td')[0]);
    range.collapse(true);
    sq.setSelection(range);
}

/**
 * Get start, end row index from current range
 * @param {Range} range Range object
 * @param {object} rangeInformation Range information object
 * @param {jQuery} $table jquery wrapped TABLE
 * @returns {jQuery}
 */
function getSelectedRows(range, rangeInformation, $table) {
    var startRowIndex = rangeInformation.from.row;
    var endRowIndex = rangeInformation.to.row;
    var tbodyRowLength = $table.find('tbody tr').length;
    var isStartContainerInThead = $(range.startContainer).parents('thead').length;
    var isWholeTbodySelected;

    if (isStartContainerInThead) {
        startRowIndex += 1;
    }

    isWholeTbodySelected = (startRowIndex === 1 || isStartContainerInThead) && endRowIndex === tbodyRowLength;

    if (isWholeTbodySelected) {
        endRowIndex -= 1;
    }

    return $table.find('tr').slice(startRowIndex, endRowIndex + 1);
}

module.exports = RemoveRow;
