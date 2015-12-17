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
var RemoveRow = CommandManager.command('wysiwyg',/** @lends RemoveRow */{
    name: 'RemoveRow',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange(),
            $tr, $nextFocus;

        if (range.collapsed && sq.hasFormat('TD')) {
            sq._recordUndoState(range);
            $tr = $(range.startContainer).closest('tr');

            $nextFocus = $tr.next().length ? $tr.next() : $tr.prev();

            $tr.remove();

            sq.focus();

            if ($nextFocus) {
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
