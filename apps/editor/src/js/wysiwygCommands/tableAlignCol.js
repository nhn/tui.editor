/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

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
        var selectionInformation, $table;

        if (sq.hasFormat('TR')) {
            sq.saveUndoState(range);

            $table = $(range.startContainer).parents('table');

            selectionInformation = getSelectionInformation($table, rangeInformation);

            setAlignAttributeToTableCells($table, alignDirection, selectionInformation);
        }
        sq.focus();
    }
});

/**
 * Set Column align
 * @param {jQuery} $table jQuery wrapped TABLE
 * @param {string} alignDirection 'left' or 'center' or 'right'
 * @param {{
 *     startColumnIndex: number,
 *     endColumnIndex: number,
 *     isDivided: boolean
 *     }} selectionInformation start, end column index and boolean value for whether range divided or not
 */
function setAlignAttributeToTableCells($table, alignDirection, selectionInformation) {
    var isDivided = selectionInformation.isDivided || false;
    var start = selectionInformation.startColumnIndex;
    var end = selectionInformation.endColumnIndex;
    var columnLength = $table.find('tr').eq(0).find('td,th').length;

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

/**
 * Return start, end column index and boolean value for whether range divided or not
 * @param {jQuery} $table jQuery wrapped TABLE
 * @param {{startColumnIndex: number, endColumnIndex: number}} rangeInformation Range information
 * @returns {{startColumnIndex: number, endColumnIndex: number, isDivided: boolean}}
 */
function getSelectionInformation($table, rangeInformation) {
    var columnLength = $table.find('tr').eq(0).find('td,th').length;
    var startColumnIndex, endColumnIndex, isDivided;
    var from = rangeInformation.from;
    var to = rangeInformation.to;

    if (from.row === to.row) {
        startColumnIndex = from.cell;
        endColumnIndex = to.cell;
    } else if (from.row < to.row) {
        if (from.cell <= to.cell) {
            startColumnIndex = 0;
            endColumnIndex = columnLength - 1;
        } else {
            startColumnIndex = from.cell;
            endColumnIndex = to.cell;
            isDivided = true;
        }
    }

    return {
        startColumnIndex: startColumnIndex,
        endColumnIndex: endColumnIndex,
        isDivided: isDivided
    };
}

module.exports = AlignCol;
