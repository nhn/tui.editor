/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


var CommandManager = require('../commandManager');
var domUtil = require('../domUtils');
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
        var selectionMgr = wwe.getManager('tableSelection');
        var tableMgr = wwe.getManager('table');
        var $tr = getTrs(range, selectionMgr, $table);
        var tbodyRowLength = $table.find('tbody tr').length;
        var $nextFocus;

        sq.focus();

        if ((sq.hasFormat('TD') || sq.hasFormat('TABLE')) && tbodyRowLength > 1) {
            sq.saveUndoState(range);
            $nextFocus = $tr.last().next()[0] ? $tr.last().next() : $tr.first().prev();

            if ($nextFocus.length) {
                focusToFirstTd(sq, range, $nextFocus, tableMgr);
            }
            $tr.remove();
        }
        selectionMgr.removeClassAttrbuteFromAllCellsIfNeed();
    }
});

/**
 * Focus to first TD in given TR
 * @param {SquireExt} sq Squire instance
 * @param {Range} range Range object
 * @param {jQuery} $tr jQuery wrapped TR
 * @param {object} tableMgr Table manager
 */
function focusToFirstTd(sq, range, $tr, tableMgr) {
    var nextFocusCell = $tr.find('td')[0];
    range.setStart(nextFocusCell, 0);
    range.collapse(true);

    tableMgr.setLastCellNode(nextFocusCell);
    sq.setSelection(range);
}

/**
 * Get start, end row index from current range
 * @param {HTMLElement} firstSelectedCell Range object
 * @param {object} rangeInformation Range information object
 * @param {jQuery} $table jquery wrapped TABLE
 * @returns {jQuery}
 */
function getSelectedRows(firstSelectedCell, rangeInformation, $table) {
    var startRowIndex = rangeInformation.from.row;
    var endRowIndex = rangeInformation.to.row;
    var tbodyRowLength = $table.find('tbody tr').length;
    var isStartContainerInThead = $(firstSelectedCell).parents('thead').length;
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
/**
 * Get TRs
 * @param {Range} range Range object
 * @param {object} selectionMgr Table selection manager
 * @param {jQuery} $table current table
 * @returns {jQuery}
 */
function getTrs(range, selectionMgr, $table) {
    var selectedCells = selectionMgr.getSelectedCells();
    var rangeInformation, trs, startCell, endCell;

    if (selectedCells.length) {
        rangeInformation = selectionMgr.getSelectionRangeFromTable(selectedCells.first()[0],
            selectedCells.last()[0]);
        trs = getSelectedRows(selectedCells.first()[0], rangeInformation, $table);
    } else {
        startCell = domUtil.isTextNode(range.startContainer) ?
            $(range.startContainer).parent('td,th')[0] : range.startContainer;
        endCell = domUtil.isTextNode(range.endContainer) ?
            $(range.endContainer).parent('td,th')[0] : range.endContainer;
        rangeInformation = selectionMgr.getSelectionRangeFromTable(startCell, endCell);
        trs = getSelectedRows(startCell, rangeInformation, $table);
    }

    return trs;
}
module.exports = RemoveRow;
