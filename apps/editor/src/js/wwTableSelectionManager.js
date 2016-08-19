/**
 * @fileoverview Implements wysiwyg table selection manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
 */


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

    /**
     * Start table selection timer
     * @type {object}
     * @private
     */
    this._tableSelectionTimer = null;
    /**
     * Remove selection timer for Firefox table selection
     * @type {object}
     * @private
     */
    this._removeSelectionTimer = null;
    /**
     * Boolean value for whether selection started
     * @type {boolean}
     * @private
     */
    this._isSelectionStarted = false;

    this.eventManager.listen('mousedown', function(ev) {
        var MOUSE_RIGHT_BUTTON = 2;
        var isSelectedCell;
        selectionStart = ev.data.target;
        isSelectedCell = $(selectionStart).hasClass(TABLE_CELL_SELECTED_CLASS_NAME);
        selectionEnd = null;

        if (!isSelectedCell
            || (isSelectedCell && ev.data.button !== MOUSE_RIGHT_BUTTON)
        ) {
            self.removeClassAttrbuteFromAllCellsIfNeed();

            self._setTableSelectionTimerIfNeed(selectionStart);
        }
    });

    this.eventManager.listen('mouseover', function(ev) {
        var isTextSelect = self.wwe.getEditor().getSelection().commonAncestorContainer.nodeType === 3;
        var isTableCell;

        selectionEnd = ev.data.target;
        isTableCell = $(selectionEnd).parents('table')[0];

        if (self._isSelectionStarted && !isTextSelect && isTableCell) {
            // For disable firefox's native table cell selection
            if (tui.util.browser.firefox && !self._removeSelectionTimer) {
                self._removeSelectionTimer = setInterval(function() {
                    window.getSelection().removeAllRanges();
                }, 10);
            }
            self._highlightTableCellsBy(selectionStart, selectionEnd);
        }
    });
    this.eventManager.listen('mouseup', function() {
        var isTextSelect = self.wwe.getEditor().getSelection().commonAncestorContainer.nodeType === 3;
        var range;

        self._clearTableSelectionTimerIfNeed();

        if (self._isSelectionStarted && !isTextSelect) {
            self.wwe.getManager('table').resetLastCellNode();

            range = self.wwe.getEditor().getSelection();
            range.collapse(true);
            self.wwe.getEditor().setSelection(range);
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
        this._tableSelectionTimer = setTimeout(function() {
            self._isSelectionStarted = true;
            self._isCellsSelected = true;
            self._isSecondMouseDown = false;
        }, 100);
    }
};

/**
 * Clear setTimeout and setInterval timer execution
 * @private
 */
WwTableSelectionManager.prototype._clearTableSelectionTimerIfNeed = function() {
    clearTimeout(this._tableSelectionTimer);
    // For disable firefox's native table selection
    if (tui.util.browser.firefox && this._removeSelectionTimer) {
        clearTimeout(this._removeSelectionTimer);
        this._removeSelectionTimer = null;
    }
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
 * @param {HTMLElement} selectionStart start element
 * @param {HTMLElement} selectionEnd end element
 * @returns {{from: {row: number, cell: number}, to: {row: number, cell: number}}}
 * @memberOf WwTableSelectionManager
 * @api
 */
WwTableSelectionManager.prototype.getSelectionRangeFromTable = function(selectionStart, selectionEnd) {
    var nodeOffsetOfParent = domUtils.getNodeOffsetOfParent;
    var startRowOffset = nodeOffsetOfParent(selectionStart.parentNode);
    var endRowOffset = nodeOffsetOfParent(selectionEnd.parentNode);
    var startCellOffset = nodeOffsetOfParent(selectionStart);
    var endCellOffset = nodeOffsetOfParent(selectionEnd);
    var startCellContainer = domUtils.getParentUntil(selectionStart, 'TABLE');
    var endCellContainer = domUtils.getParentUntil(selectionEnd, 'TABLE');
    var isReversedTheadAndTbodySelect = (domUtils.getNodeName(startCellContainer) === 'TBODY'
        && domUtils.getNodeName(endCellContainer) === 'THEAD');
    var isTheadAndTbodySelect = startCellContainer !== endCellContainer;
    var isBothInTbody = !!$(selectionStart).parents('tbody').length && !!$(selectionEnd).parents('tbody').length;
    var start = {
        row: startRowOffset,
        cell: startCellOffset
    };
    var end = {
        row: endRowOffset,
        cell: endCellOffset
    };
    var from, to;

    if (isReversedTheadAndTbodySelect) {
        start.row += 1;
    } else if (isTheadAndTbodySelect) {
        end.row += 1;
    } else if (isBothInTbody) {
        start.row += 1;
        end.row += 1;
    }

    if (startRowOffset > endRowOffset
        || (startRowOffset === endRowOffset && startCellOffset > endCellOffset)
    ) {
        from = end;
        to = start;
    } else {
        from = start;
        to = end;
    }

    return {
        from: from,
        to: to
    };
};

/**
 * Highlight selected table cells
 * @param {HTMLElement} selectionStart start element
 * @param {HTMLElement} selectionEnd end element
 * @private
 */
WwTableSelectionManager.prototype._highlightTableCellsBy = function(selectionStart, selectionEnd) {
    var trs = $(selectionStart).parents('table').find('tr');
    var selection = this.getSelectionRangeFromTable(selectionStart, selectionEnd);
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
    this.wwe.get$Body()
        .find('td.' + TABLE_CELL_SELECTED_CLASS_NAME + ',th.' + TABLE_CELL_SELECTED_CLASS_NAME)
        .each(function(i, node) {
            var $node = $(node);

            $node.removeClass(TABLE_CELL_SELECTED_CLASS_NAME);

            if (!$node.attr('class').length) {
                $node.removeAttr('class');
            }
        });
};

WwTableSelectionManager.prototype.getSelectedCells = function() {
    return this.wwe.get$Body().find('.' + TABLE_CELL_SELECTED_CLASS_NAME);
};

module.exports = WwTableSelectionManager;
