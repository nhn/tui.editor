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
        var sq = wwe.getEditor();
        var range = sq.getSelection().cloneRange();
        var rangeInformation = wwe.getManager('tableSelection').getSelectionRangeFromTable(range);
        var isDivided = false;
        var columnLength, $table, $cell, startColumnIndex, endColumnIndex;

        if (sq.hasFormat('TR')) {
            sq.saveUndoState(range);

            $cell = getCellByRange(range);
            $table = $cell.parents('table');
            columnLength = $table.find('tr').eq(0).find('td,th').length;

            if (rangeInformation.from.row === rangeInformation.to.row) {
                startColumnIndex = rangeInformation.from.cell;
                endColumnIndex = rangeInformation.to.cell;
            } else if (rangeInformation.from.row < rangeInformation.to.row) {
                if (rangeInformation.from.cell <= rangeInformation.to.cell) {
                    startColumnIndex = 0;
                    endColumnIndex = columnLength - 1;
                } else {
                    startColumnIndex = rangeInformation.from.cell;
                    endColumnIndex = rangeInformation.to.cell;
                    isDivided = true;
                }
            }
            setAlignAttributeToTableCells($table, startColumnIndex, endColumnIndex,
                alignDirection, {
                    isDivided: isDivided,
                    columnLength: columnLength
                });
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

function setAlignAttributeToTableCells($table, start, end, alignDirection, option) {
    var isDivided = option.isDivided;
    var columnLength = option.columnLength;
    $table.find('tr').each(function(n, tr) {
        $(tr).children('td,th').each(function(index, cell) {
            if (isDivided &&
                ((start <= index && index <= columnLength) || (index <= end))
            ) {
                $(cell).attr('align', alignDirection);
            } else if ((start <= index && index <= end)) {
                $(cell).attr('align', alignDirection);
            }
        });
    });
}

module.exports = AlignCol;
