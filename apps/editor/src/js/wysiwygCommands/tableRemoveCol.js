/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager'),
    domUtils = require('../domUtils');

/**
 * RemoveCol
 * remove Row to selected table
 * @exports RemoveCol
 * @augments Command
 * @augments WysiwygCommand
 */
var RemoveCol = CommandManager.command('wysiwyg', /** @lends RemoveCol */{
    name: 'RemoveCol',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange(),
            $cell, $nextFocus;

        if (sq.hasFormat('TR') && $(range.startContainer).closest('table').find('thead tr th').length > 1) {
            sq.saveUndoState(range);
            $cell = getCellByRange(range);
            $nextFocus = $cell.next().length ? $cell.next() : $cell.prev();

            removeColByCell($cell);

            sq.focus();

            focusToCell(sq, $nextFocus);
        } else {
            sq.focus();
        }
    }
});

function getCellByRange(range) {
    var cell = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset);

    if (domUtils.getNodeName(cell) === 'TD' || domUtils.getNodeName(cell) === 'TH') {
        cell = $(cell);
    } else {
        cell = $(cell).parentsUntil('tr');
    }

    return cell;
}

function removeColByCell($cell) {
    var index = $cell.index();

    $cell.parents('table').find('tr').each(function(n, tr) {
        $(tr).children().eq(index).remove();
    });
}

function focusToCell(sq, $cell) {
    var range;

    if ($cell.length) {
        range = sq.getSelection();
        range.selectNodeContents($cell[0]);
        range.collapse(true);
        sq.setSelection(range);
    }
}

module.exports = RemoveCol;
