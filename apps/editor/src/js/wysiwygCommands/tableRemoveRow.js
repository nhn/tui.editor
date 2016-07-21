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
        var rangeInformation = wwe.getManager('tableSelection').getSelectionRangeFromTable(range);
        var $table = $(range.startContainer).parents('table');
        var trsInTbody = $table.find('tbody tr');
        var isStartContainerInThead = $(range.startContainer).parents('thead').length;
        var startRowIndex, endRowIndex, $nextFocus, $tr, isWholeTbodySelected;

        if (isStartContainerInThead) {
            startRowIndex = rangeInformation.from.row + 1;
        } else {
            startRowIndex = rangeInformation.from.row;
        }
        endRowIndex = rangeInformation.to.row;

        isWholeTbodySelected = !(startRowIndex === 1 && endRowIndex === trsInTbody.length)
            || (isStartContainerInThead && endRowIndex === trsInTbody);
        if (!isWholeTbodySelected) {
            endRowIndex -= 1;
        }

        $tr = $table.find('tr').slice(startRowIndex, endRowIndex + 1);

        if ((sq.hasFormat('TD') || sq.hasFormat('TABLE'))
            && trsInTbody.length > 1
        ) {
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

function focusToFirstTd(sq, $tr) {
    var range;

    range = sq.getSelection();
    range.selectNodeContents($tr.find('td')[0]);
    range.collapse(true);
    sq.setSelection(range);
}

module.exports = RemoveRow;
