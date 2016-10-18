/**
 * @fileoverview Implements wysiwyg table selection manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
 */


import domUtils from './domUtils';
const TABLE_CELL_SELECTED_CLASS_NAME = 'te-cell-selected';

/**
 * WwTableSelectionManager
 * @exports WwTableSelectionManager
 * @constructor
 * @class WwTableSelectionManager
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
class WwTableSelectionManager {
    constructor(wwe) {
        this.wwe = wwe;
        this.eventManager = wwe.eventManager;

        /**
         * Name property
         * @api
         * @memberOf WwTableSelectionManager
         * @type {string}
         */
        this.name = 'tableSelection';

        this._init();
    }

    /**
     * _init
     * Initialize
     * @memberOf WwTableSelectionManager
     * @private
     */
    _init() {
        this._initEvent();

        // For disable firefox's table tool UI and table resize handler
        if (tui.util.browser.firefox) {
            document.execCommand('enableObjectResizing', false, 'false');
            document.execCommand('enableInlineTableEditing', false, 'false');
        }
    }

    /**
     * _initEvent
     * Initialize event
     * @memberOf WwTableSelectionManager
     * @private
     */
    _initEvent() {
        let selectionStart, selectionEnd;

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

        this.eventManager.listen('mousedown', ev => {
            const MOUSE_RIGHT_BUTTON = 2;
            selectionStart = $(ev.data.target).closest('td,th')[0];
            const isSelectedCell = $(selectionStart).hasClass(TABLE_CELL_SELECTED_CLASS_NAME);
            selectionEnd = null;

            if (!isSelectedCell
                || (isSelectedCell && ev.data.button !== MOUSE_RIGHT_BUTTON)
            ) {
                this.removeClassAttrbuteFromAllCellsIfNeed();

                this._setTableSelectionTimerIfNeed(selectionStart);
            }
        });

        this.eventManager.listen('mouseover', ev => {
            selectionEnd = $(ev.data.target).closest('td,th')[0];

            const range = this.wwe.getEditor().getSelection();
            const isEndsInTable = $(selectionEnd).parents('table')[0];
            const isSameCell = selectionStart === selectionEnd;
            const isTextSelect = this._isTextSelect(range, isSameCell);

            if (this._isSelectionStarted
                && isEndsInTable
                && ((!isTextSelect || isSameCell) && !isTextSelect)
            ) {
                // For disable firefox's native table cell selection
                if (tui.util.browser.firefox && !this._removeSelectionTimer) {
                    this._removeSelectionTimer = setInterval(() => {
                        window.getSelection().removeAllRanges();
                    }, 10);
                }
                this._highlightTableCellsBy(selectionStart, selectionEnd);
            }
        });
        this.eventManager.listen('mouseup', ev => {
            selectionEnd = $(ev.data.target).closest('td,th')[0];

            let range = this.wwe.getEditor().getSelection();
            const isSameCell = selectionStart === selectionEnd;
            const isTextSelect = this._isTextSelect(range, isSameCell);

            this._clearTableSelectionTimerIfNeed();

            if (this._isSelectionStarted) {
                if (isTextSelect) {
                    this.removeClassAttrbuteFromAllCellsIfNeed();
                } else {
                    this.wwe.getManager('table').resetLastCellNode();

                    range = this.wwe.getEditor().getSelection();
                    range.collapse(true);
                    this.wwe.getEditor().setSelection(range);
                }
            }

            this._isSelectionStarted = false;
        });
    }

    /**
     * Return whether single cell text selection or not
     * @param {Range} range Range object
     * @param {boolean} isSameCell Boolean value for same cell selection
     * @returns {boolean}
     * @private
     */
    _isTextSelect(range, isSameCell) {
        return /TD|TH|TEXT/i.test(range.commonAncestorContainer.nodeName) && isSameCell;
    }

    /**
     * Set setTimeout and setInterval timer execution if table selecting situation
     * @param {HTMLElement} selectionStart Start element
     * @private
     */
    _setTableSelectionTimerIfNeed(selectionStart) {
        const isTableSelecting = $(selectionStart).parents('table').length;

        if (isTableSelecting) {
            this._tableSelectionTimer = setTimeout(() => {
                this._isSelectionStarted = true;
            }, 100);
        }
    }

    /**
     * Clear setTimeout and setInterval timer execution
     * @private
     */
    _clearTableSelectionTimerIfNeed() {
        clearTimeout(this._tableSelectionTimer);
        // For disable firefox's native table selection
        if (tui.util.browser.firefox && this._removeSelectionTimer) {
            clearTimeout(this._removeSelectionTimer);
            this._removeSelectionTimer = null;
        }
    }

    /**
     * Re arrange selection when table does not include both start and end selection element
     * @param {HTMLElement} selectionStart Start element of selection
     * @param {HTMLElement} selectionEnd End element of selection
     * @returns {{startContainer: HTMLElement, endContainer: HTMLElement}}
     * @private
     */
    _reArrangeSelectionIfneed(selectionStart, selectionEnd) {
        const isRangeStartInTable = $(selectionStart).parents('table').length;
        const isRangeEndInTable = $(selectionEnd).parents('table').length;
        const isStartRangeOut = isRangeEndInTable && !isRangeStartInTable;
        const isEndRangeOut = !isRangeEndInTable && isRangeStartInTable;

        if (isStartRangeOut) {
            selectionStart = $(selectionEnd).parents('table').find('th').first()[0];
        } else if (isEndRangeOut) {
            selectionEnd = $(selectionStart).parents('table').find('td').last()[0];
        }

        return {
            startContainer: selectionStart,
            endContainer: selectionEnd
        };
    }

    /**
     * Apply select direction to editor
     * @param {{startContainer: HTMLElement, endContainer: HTMLElement}} selectionInformation
     *     Selection start and end element
     * @param {Range} range Range object
     * @returns {Range}
     * @private
     */
    _applySelectionDirection(selectionInformation, range) {
        const nodeOffsetOfParent = domUtils.getNodeOffsetOfParent;
        const selectionStart = selectionInformation.startContainer;
        const selectionEnd = selectionInformation.endContainer;
        const rowDirection = nodeOffsetOfParent($(selectionStart).closest('tr')[0])
            - nodeOffsetOfParent($(selectionEnd).closest('tr')[0]);
        const cellDirection = nodeOffsetOfParent(selectionStart) - nodeOffsetOfParent(selectionEnd);
        const isSameRow = (rowDirection === 0);
        const isRowIncreases = (rowDirection < 0);
        const isColumnIncreases = (cellDirection > 0);

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
    }

    /**
     * Get table cell element
     * @param {Node | HTMLElement} node textNode or table cell element
     * @returns {HTMLElement}
     * @private
     */
    _getTableCell(node) {
        return node.nodeType === 3 ? $(node).parent('td,th')[0] : node;
    }

    /**
     * Get selection coordinate by current selection
     * @param {HTMLElement} selectionStart start element
     * @param {HTMLElement} selectionEnd end element
     * @returns {{from: {row: number, cell: number}, to: {row: number, cell: number}}}
     * @memberOf WwTableSelectionManager
     * @api
     */
    getSelectionRangeFromTable(selectionStart, selectionEnd) {
        const nodeOffsetOfParent = domUtils.getNodeOffsetOfParent;
        const startRowOffset = nodeOffsetOfParent(selectionStart.parentNode);
        const endRowOffset = nodeOffsetOfParent(selectionEnd.parentNode);
        const startCellOffset = nodeOffsetOfParent(selectionStart);
        const endCellOffset = nodeOffsetOfParent(selectionEnd);
        const startCellContainer = domUtils.getParentUntil(selectionStart, 'TABLE');
        const endCellContainer = domUtils.getParentUntil(selectionEnd, 'TABLE');
        const isReversedTheadAndTbodySelect = (domUtils.getNodeName(startCellContainer) === 'TBODY'
        && domUtils.getNodeName(endCellContainer) === 'THEAD');
        const isTheadAndTbodySelect = startCellContainer !== endCellContainer;
        const isBothInTbody = !!$(selectionStart).parents('tbody').length && !!$(selectionEnd).parents('tbody').length;
        const start = {
            row: startRowOffset,
            cell: startCellOffset
        };
        const end = {
            row: endRowOffset,
            cell: endCellOffset
        };
        let from, to;

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
            from,
            to
        };
    }

    /**
     * Highlight selected table cells
     * @param {HTMLElement} selectionStart start element
     * @param {HTMLElement} selectionEnd end element
     * @private
     */
    _highlightTableCellsBy(selectionStart, selectionEnd) {
        const trs = $(selectionStart).parents('table').find('tr');
        const selection = this.getSelectionRangeFromTable(selectionStart, selectionEnd);
        const rowFrom = selection.from.row;
        const cellFrom = selection.from.cell;
        const rowTo = selection.to.row;
        const cellTo = selection.to.cell;

        trs.each((rowIndex, row) => {
            $(row).find('td,th').each((cellIndex, cell) => {
                const $cell = $(cell);
                const isFromRow = (rowIndex === rowFrom);
                const isToRow = (rowIndex === rowTo);

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
    }

    /**
     * Remove '.te-cell-selected' class from all of table Cell
     * @memberOf WwTableSelectionManager
     * @api
     */
    removeClassAttrbuteFromAllCellsIfNeed() {
        this.wwe.get$Body().find(`td.${TABLE_CELL_SELECTED_CLASS_NAME},th.${TABLE_CELL_SELECTED_CLASS_NAME}`)
            .each((i, node) => {
                const $node = $(node);

                $node.removeClass(TABLE_CELL_SELECTED_CLASS_NAME);

                if (!$node.attr('class').length) {
                    $node.removeAttr('class');
                }
            });
    }

    getSelectedCells() {
        return this.wwe.get$Body().find(`.${TABLE_CELL_SELECTED_CLASS_NAME}`);
    }

    /**
     * Create selection by selected cells and collapse that selection to end
     * @private
     */
    createRangeBySelectedCells() {
        const sq = this.wwe.getEditor();
        const range = sq.getSelection().cloneRange();
        const selectedCells = this.getSelectedCells();
        const tableManager = this.wwe.getManager('table');

        if (selectedCells.length && tableManager.isInTable(range)) {
            range.setStart(selectedCells.first()[0], 0);
            range.setEnd(selectedCells.last()[0], 1);
            sq.setSelection(range);
        }
    }
}
module.exports = WwTableSelectionManager;
