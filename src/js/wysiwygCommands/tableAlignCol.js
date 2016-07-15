/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager'),
    domUtils = require('../domUtils');

/**
 * AlignCol
 * Align selected column's text content to given direction
 * @exports AlignCol
 * @augments Command
 * @augments WysiwygCommand
 */
var AlignCol = CommandManager.command('wysiwyg', /** @lends AlignCol */{
    name: 'AlignCol',
    /**
     * 커맨드 핸들러
     * @param {WysiwygEditor} wwe WYsiwygEditor instance
     * @param {string} alignDirection Align direction
     */
    exec: function(wwe, alignDirection) {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange(),
            $cell;

        if (sq.hasFormat('TR')) {
            sq.saveUndoState(range);

            $cell = getCellByRange(range);
            setAlignAttributeToTableCells($cell, alignDirection);
        }
        sq.focus();
    }
});

function getCellByRange(range) {
    var cell = range.startContainer;

    if (domUtils.getNodeName(cell) === 'TH' || domUtils.getNodeName(cell) === 'TD') {
        cell = $(cell);
    } else {
        cell = $(cell).parentsUntil('tr');
    }

    return cell;
}

function setAlignAttributeToTableCells($cell, alignDirection) {
    var index = $cell.index();

    $cell.parents('table').find('tr').each(function(n, tr) {
        var cell = $(tr).children().eq(index);

        cell.attr('align', alignDirection);
    });
}

module.exports = AlignCol;
