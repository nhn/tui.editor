/**
 * @fileoverview Implements wysiwyg table selection manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils');
var TABLE_CELL_SELECTED_CLASS_NAME = 'te-cell-selected';

/**
 * WwTableSelectionManager
 * @exports WwTableSelectionManager
 * @constructor
 * @class WwTableSelectionManager
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
function WwTableSelectionManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    this._init();
}

/**
 * Name property
 * @api
 * @memberOf WwTableSelectionManager
 * @type {string}
 */
WwTableSelectionManager.prototype.name = 'tableSelection';

/**
 * _init
 * Initialize
 * @memberOf WwTableSelectionManager
 * @private
 */
WwTableSelectionManager.prototype._init = function() {
    this._initEvent();

    // For disable firefox's table tool UI and table resize handler
    if (tui.util.browser.firefox) {
        document.execCommand('enableObjectResizing', false, 'false');
        document.execCommand('enableInlineTableEditing', false, 'false');
    }
};

/**
 * _initEvent
 * Initialize event
 * @memberOf WwTableSelectionManager
 * @private
 */
WwTableSelectionManager.prototype._initEvent = function() {
    var self = this;
    var selectionStart, selectionEnd;

    this._selectionTimer = null;
    this._removeSelectionTimer = null;
    this._isSelectionStarted = false;
    this._isCellsSelected = false;

    this.eventManager.listen('mousedown', function(ev) {
        selectionStart = ev.data.target;
        self.removeClassAttrbuteFromAllCellsIfNeed();

        self._setTableSelectionTimerIfNeed(selectionStart);
    });

    this.eventManager.listen('mouseup', function(ev) {
        var isTextSelect = self.wwe.getEditor().getSelection().commonAncestorContainer.nodeType === 3;
        selectionEnd = ev.data.target;

        self._clearTableSelectionTimerIfNeed();

        if (self._isSelectionStarted && !isTextSelect) {
            self._highlightSelectionIfNeed(selectionStart, selectionEnd);
            self.wwe.getManager('table').resetLastCellNode();
        }

        self._isSelectionStarted = false;
    });
};

/**
 * Set setTimeout and setInterval timer execution if table selecting situation
 * @param {HTMLElement} selectionStart Start element
 * @private
 */
WwTableSelectionManager.prototype._setTableSelectionTimerIfNeed = function(selectionStart) {
    var self = this;
    var isTableSelecting = $(selectionStart).parents('table').length;

    if (isTableSelecting) {
        // For disable firefox's native table cell selection
        if (tui.util.browser.firefox) {
            this._removeSelectionTimer = setInterval(function() {
                window.getSelection().removeAllRanges();
            }, 250);
        }
        this._selectionTimer = setTimeout(function() {
            self._isSelectionStarted = true;
            self._isCellsSelected = true;
        }, 300);
    }
};

/**
 * Clear setTimeout and setInterval timer execution
 * @private
 */
WwTableSelectionManager.prototype._clearTableSelectionTimerIfNeed = function() {
    clearTimeout(this._selectionTimer);
    // For disable firefox's native table selection
    if (tui.util.browser.firefox) {
        clearTimeout(this._removeSelectionTimer);
    }
};

/**
 * HighLighting current selection by start, end element of selection
 * @param {HTMLElement} selectionStart Start element
 * @param {HTMLElement} selectionEnd End element
 * @private
 */
WwTableSelectionManager.prototype._highlightSelectionIfNeed = function(selectionStart, selectionEnd) {
    var range = this.wwe.getEditor().getSelection();

    this._prepareSelection(range, selectionStart, selectionEnd);
    this._highlightTableCellsBy(range);
};

/**
 * Re arrange selection when table does not include both start and end selection element
 * @param {HTMLElement} selectionStart Start element of selection
 * @param {HTMLElement} selectionEnd End element of selection
 * @returns {{startContainer: HTMLElement, endContainer: HTMLElement}}
 * @private
 */
WwTableSelectionManager.prototype._reArrangeSelectionIfneed = function(selectionStart, selectionEnd) {
    var isRangeStartInTable = $(selectionStart).parents('table').length;
    var isRangeEndInTable = $(selectionEnd).parents('table').length;
    var isStartRangeOut = isRangeEndInTable && !isRangeStartInTable;
    var isEndRangeOut = !isRangeEndInTable && isRangeStartInTable;

    if (isStartRangeOut) {
        selectionStart = $(selectionEnd).parents('table').find('th').first()[0];
    } else if (isEndRangeOut) {
        selectionEnd = $(selectionStart).parents('table').find('td').last()[0];
    }

    return {
        startContainer: selectionStart,
        endContainer: selectionEnd
    };
};

/**
 * Apply select direction to editor
 * @param {{startContainer: HTMLElement, endContainer: HTMLElement}} selectionInformation
 *     Selection start and end element
 * @param {Range} range Range object
 * @returns {Range}
 * @private
 */
WwTableSelectionManager.prototype._applySelectionDirection = function(selectionInformation, range) {
    var nodeOffsetOfParent = domUtils.getNodeOffsetOfParent;
    var selectionStart = selectionInformation.startContainer;
    var selectionEnd = selectionInformation.endContainer;
    var rowDirection = nodeOffsetOfParent($(selectionStart).closest('tr')[0])
        - nodeOffsetOfParent($(selectionEnd).closest('tr')[0]);
    var cellDirection = nodeOffsetOfParent(selectionStart) - nodeOffsetOfParent(selectionEnd);
    var isSameRow = (rowDirection === 0);
    var isRowIncreases = (rowDirection < 0);
    var isColumnIncreases = (cellDirection > 0);

    if (isSameRow) {
        if (isColumnIncreases) {
            range.setStart(selectionEnd, 0);
            range.setEnd(selectionStart, 1);
        } else {
            range.setStart(selectionStart, 0);
            range.setEnd(selectionEnd, 1);
        }
    } else if (isRowIncreases) {
        range.setStart(selectionStart, 0);
        range.setEnd(selectionEnd, 1);
    } else {
        range.setStart(selectionEnd, 0);
        range.setEnd(selectionStart, 1);
    }

    return range;
};

/**
 * Prepare selection for highlight selected cells
 * @param {Range} range Range object
 * @param {HTMLElement} selectionStart Start element of selection
 * @param {HTMLElement} selectionEnd End element of selection
 * @private
 */
WwTableSelectionManager.prototype._prepareSelection = function(range, selectionStart, selectionEnd) {
    var selectionInformation = this._reArrangeSelectionIfneed(selectionStart, selectionEnd);
    var newRange = this._applySelectionDirection(selectionInformation, range);

    this.wwe.getEditor().setSelection(newRange);
};

/**
 * Get table cell element
 * @param {Node | HTMLElement} node textNode or table cell element
 * @returns {HTMLElement}
 * @private
 */
WwTableSelectionManager.prototype._getTableCell = function(node) {
    return node.nodeType === 3 ? $(node).parent('td,th')[0] : node;
};

/**
 * Get selection coordinate by current selection
 * @param {Range} range Range object
 * @returns {{from: {row: number, cell: number}, to: {row: number, cell: number}}}
 * @memberOf WwTableSelectionManager
 */
WwTableSelectionManager.prototype.getSelectionRangeFromTable = function(range) {
    var nodeOffsetOfParent = domUtils.getNodeOffsetOfParent;
    var commonAncestor = range.commonAncestorContainer;
    var commonAncestorName = commonAncestor.nodeName;
    var startRowOffset = nodeOffsetOfParent(this._getTableCell(range.startContainer).parentNode);
    var endRowOffset = nodeOffsetOfParent(this._getTableCell(range.endContainer).parentNode);
    var startCellOffset = nodeOffsetOfParent(this._getTableCell(range.startContainer));
    var endCellOffset = nodeOffsetOfParent(this._getTableCell(range.endContainer));
    var isTheadAndTbodySelected = commonAncestorName === 'TABLE';
    var isInTbody = !!$(commonAncestor).parents('tbody').length;
    var isBothCellsInTbody = commonAncestorName === 'TBODY' || isInTbody;

    if (isTheadAndTbodySelected) {
        endRowOffset += 1;
    } else if (isBothCellsInTbody) {
        startRowOffset += 1;
        endRowOffset += 1;
    }

    return {
        from: {
            row: startRowOffset,
            cell: startCellOffset
        },
        to: {
            row: endRowOffset,
            cell: endCellOffset
        }
    };
};

/**
 * Highlight selected table cells
 * @param {Range} range Range object
 * @private
 */
WwTableSelectionManager.prototype._highlightTableCellsBy = function(range) {
    var trs = $(range.startContainer).parents('table').find('tr');
    var selection = this.getSelectionRangeFromTable(range);
    var rowFrom = selection.from.row;
    var cellFrom = selection.from.cell;
    var rowTo = selection.to.row;
    var cellTo = selection.to.cell;

    trs.each(function(rowIndex, row) {
        $(row).find('td,th').each(function(cellIndex, cell) {
            var $cell = $(cell);
            var isFromRow = (rowIndex === rowFrom);
            var isToRow = (rowIndex === rowTo);

            if ((isFromRow && cellIndex < cellFrom)
                || (isToRow && cellIndex > cellTo)
                || rowIndex < rowFrom
                || rowIndex > rowTo
            ) {
                $cell.removeClass(TABLE_CELL_SELECTED_CLASS_NAME);
            } else {
                $cell.addClass(TABLE_CELL_SELECTED_CLASS_NAME);
            }
        });
    });
};

/**
 * Remove '.te-cell-selected' class from all of table Cell
 * @memberOf WwTableSelectionManager
 * @api
 */
WwTableSelectionManager.prototype.removeClassAttrbuteFromAllCellsIfNeed = function() {
    if (this._isCellsSelected) {
        $('table')
            .find('td.' + TABLE_CELL_SELECTED_CLASS_NAME + ',th.' + TABLE_CELL_SELECTED_CLASS_NAME)
            .each(function(i, node) {
                var $node = $(node);

                $node.removeClass(TABLE_CELL_SELECTED_CLASS_NAME);

                if (!$node.attr('class').length) {
                    $node.removeAttr('class');
                }
            });
    }
};

module.exports = WwTableSelectionManager;
