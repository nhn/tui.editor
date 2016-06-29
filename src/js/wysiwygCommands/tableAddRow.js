/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * AddRow
 * Add Row to selected table
 * @exports AddRow
 * @augments Command
 * @augments WysiwygCommand
 */
var AddRow = CommandManager.command('wysiwyg', /** @lends AddRow */{
    name: 'AddRow',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange(),
            $tr, $newRow;

        if (sq.hasFormat('TD')) {
            sq.saveUndoState(range);
            $tr = $(range.startContainer).closest('tr');
            $newRow = getNewRow($tr);
            $newRow.insertAfter($tr);

            sq.focus();

            focusToFirstTd(sq, $newRow);
        } else {
            sq.focus();
        }
    }
});

function getNewRow($tr) {
    var cloned = $tr.clone();

    cloned.find('td').html('<br>');

    return cloned;
}

function focusToFirstTd(sq, $tr) {
    var range;

    range = sq.getSelection();
    range.selectNodeContents($tr.find('td')[0]);
    range.collapse(true);
    sq.setSelection(range);
}

module.exports = AddRow;
