/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


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

        sq.focus();

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

function getNewRow($tr) {
    var cloned = $tr.clone();
    var htmlString = tui.util.browser.msie ? '' : '<br />';

    cloned.find('td').html(htmlString);

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
