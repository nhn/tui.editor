/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager'),
    domUtils = require('../domUtils');

/**
 * AddCol
 * Add col to selected table
 * @exports AddCol
 * @augments Command
 * @augments WysiwygCommand
 */
var AddCol = CommandManager.command('wysiwyg',/** @lends AddCol */{
    name: 'AddCol',
    /**
     * 커맨드 핸들러
     * @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange(),
            $cell;

        if (range.collapsed && sq.hasFormat('TR')) {
            sq._recordUndoState();

            $cell = getCellByRange(range);
            addColToCellAfter($cell);

            sq.focus();
            focusToNextCell(sq, $cell);
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

function addColToCellAfter($cell) {
    var index = $cell.index();
    $('<th><br></th>').insertAfter($cell.parents('table').find('thead tr th:eq(' + index + ')'));
    $('<td><br></td>').insertAfter($cell.parents('table').find('tbody tr td:eq(' + index + ')'));
}

function focusToNextCell(sq, $cell) {
    var range;

    range = sq.getSelection();
    range.selectNodeContents($cell.next()[0]);
    range.collapse(true);

    sq.setSelection(range);
}

module.exports = AddCol;
