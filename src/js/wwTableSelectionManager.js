/**
 * @fileoverview Implements wysiwyg table selection manager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import domUtils from './domUtils';
const TABLE_CELL_SELECTED_CLASS_NAME = 'te-cell-selected';

/**
 * Class WwTableSelectionManager
 */
class WwTableSelectionManager {
  /**
     * Creates an instance of WwTableSelectionManager.
     * @param {WysiwygEditor} wwe - WysiwygEditor instance
     * @memberof WwTableSelectionManager
     */
  constructor(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
         * Name property
         * @memberof WwTableSelectionManager#
         * @type {string}
         */
    this.name = 'tableSelection';

    this._init();
  }

  /**
     * _init
     * Initialize
     * @memberof WwTableSelectionManager
     * @private
     */
  _init() {
    this._initEvent();

    // For disable firefox's table tool UI and table resize handler
    if (util.browser.firefox) {
      document.execCommand('enableObjectResizing', false, 'false');
      document.execCommand('enableInlineTableEditing', false, 'false');
    }
  }

  /**
     * _initEvent
     * Initialize event
     * @memberof WwTableSelectionManager
     * @private
     */
  _initEvent() {
    let selectionStart, selectionEnd, validSelectionEnd;

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

    const onMouseover = ev => {
      selectionEnd = $(ev.data.target).closest('[contenteditable=true] td,th').get(0);

      const range = this.wwe.getEditor().getSelection();
      const isEndsInTable = $(selectionEnd).parents('[contenteditable=true] table').get(0);
      const isSameCell = selectionStart === selectionEnd;
      const isTextSelect = this._isTextSelect(range, isSameCell) &&
                  !$(selectionStart).hasClass(TABLE_CELL_SELECTED_CLASS_NAME);

      if (this._isSelectionStarted && isEndsInTable && !isTextSelect) {
        window.getSelection().removeAllRanges();
        // For disable firefox's native table cell selection
        if (util.browser.firefox && !this._removeSelectionTimer) {
          this._removeSelectionTimer = setInterval(() => {
            window.getSelection().removeAllRanges();
          }, 10);
        }
        this.highlightTableCellsBy(selectionStart, selectionEnd);
        validSelectionEnd = selectionEnd;
      }
    };

    const finishSelection = () => {
      if (this._isSelectionStarted) {
        this._isSelectionStarted = false;
        this.eventManager.removeEventHandler('mouseover.tableSelection');
        this.eventManager.removeEventHandler('mouseup.tableSelection');
      }
    };

    const onMouseup = ev => {
      selectionEnd = $(ev.data.target).closest('[contenteditable=true] td,th').get(0);

      let range = this.wwe.getEditor().getSelection();
      const isSameCell = selectionStart === selectionEnd;
      const isTextSelect = this._isTextSelect(range, isSameCell) &&
                  !$(selectionStart).hasClass(TABLE_CELL_SELECTED_CLASS_NAME);

      this._clearTableSelectionTimerIfNeed();

      if (this._isSelectionStarted) {
        if (isTextSelect) {
          this.removeClassAttrbuteFromAllCellsIfNeed();
        } else {
          this.wwe.componentManager.getManager('table').resetLastCellNode();

          selectionEnd = selectionEnd || validSelectionEnd;

          range = this.wwe.getEditor().getSelection();
          range.setStart(selectionEnd, 0);
          // IE wont fire copy/cut event if there is no selected range.
          // trick IE to fire the event
          if (util.browser.msie) {
            range.setEnd(selectionEnd, 1);
          } else {
            range.setEnd(selectionEnd, 0);
            range.collapse(false);
          }
          this.wwe.getEditor().setSelection(range);
        }
        if (this.onDragEnd) {
          this.onDragEnd();
        }
      }

      finishSelection();
    };

    const onMousedown = ev => {
      const MOUSE_RIGHT_BUTTON = 2;
      selectionStart = $(ev.data.target).closest('[contenteditable=true] td,th').get(0);
      const isSelectedCell = $(selectionStart).hasClass(TABLE_CELL_SELECTED_CLASS_NAME);
      selectionEnd = null;

      if (!isSelectedCell || (isSelectedCell && ev.data.button !== MOUSE_RIGHT_BUTTON)) {
        this.removeClassAttrbuteFromAllCellsIfNeed();
        this.setTableSelectionTimerIfNeed(selectionStart);
        this.eventManager.listen('mouseover.tableSelection', onMouseover);
        this.eventManager.listen('mouseup.tableSelection', onMouseup);
        if (this.onDragStart && selectionStart) {
          this.onDragStart(selectionStart);
        }
      } else if (ev.data.button === MOUSE_RIGHT_BUTTON) {
        finishSelection();
      }
    };

    this.eventManager.listen('mousedown.tableSelection', onMousedown);
    this.eventManager.listen('copyBefore.tableSelection', finishSelection);
    this.eventManager.listen('pasteBefore.tableSelection', finishSelection);
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
     */
  setTableSelectionTimerIfNeed(selectionStart) {
    const isTableSelecting = $(selectionStart).parents('[contenteditable=true] table').length;

    if (isTableSelecting) {
      this._isSelectionStarted = true;
    }
  }

  /**
     * Clear setTimeout and setInterval timer execution
     * @private
     */
  _clearTableSelectionTimerIfNeed() {
    clearTimeout(this._tableSelectionTimer);
    // For disable firefox's native table selection
    if (util.browser.firefox && this._removeSelectionTimer) {
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
    const isRangeStartInTable = $(selectionStart).parents('[contenteditable=true] table').length;
    const isRangeEndInTable = $(selectionEnd).parents('[contenteditable=true] table').length;
    const isStartRangeOut = isRangeEndInTable && !isRangeStartInTable;
    const isEndRangeOut = !isRangeEndInTable && isRangeStartInTable;

    if (isStartRangeOut) {
      selectionStart = $(selectionEnd).parents('[contenteditable=true] table').find('th').first().get(0);
    } else if (isEndRangeOut) {
      selectionEnd = $(selectionStart).parents('[contenteditable=true] table').find('td').last().get(0);
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
    const rowDirection = nodeOffsetOfParent($(selectionStart).closest('[contenteditable=true] tr')[0])
            - nodeOffsetOfParent($(selectionEnd).closest('[contenteditable=true] tr')[0]);
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
     * Get selection coordinate by current selection
     * @param {HTMLElement} selectionStart start element
     * @param {HTMLElement} selectionEnd end element
     * @returns {{from: {row: number, cell: number}, to: {row: number, cell: number}}}
     * @memberof WwTableSelectionManager
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
     */
  highlightTableCellsBy(selectionStart, selectionEnd) {
    const trs = $(selectionStart).parents('[contenteditable=true] table').find('tr');
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
     * @memberof WwTableSelectionManager
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

  /**
     * gets selected cells
     * @returns {jQuery} selected cells
     * @memberof WwTableSelectionManager
     */
  getSelectedCells() {
    return this.wwe.get$Body().find(`.${TABLE_CELL_SELECTED_CLASS_NAME}`);
  }

  /**
     * Create selection by selected cells and collapse that selection to end
     */
  createRangeBySelectedCells() {
    const sq = this.wwe.getEditor();
    const range = sq.getSelection().cloneRange();
    const $selectedCells = this.getSelectedCells();
    const tableManager = this.wwe.componentManager.getManager('table');
    const firstSelectedCell = $selectedCells.first().get(0);
    const lastSelectedCell = $selectedCells.last().get(0);

    if ($selectedCells.length && tableManager.isInTable(range)) {
      range.setStart(firstSelectedCell, 0);
      range.setEnd(lastSelectedCell, lastSelectedCell.childNodes.length);
      sq.setSelection(range);
    }
  }

  /**
     * Style to selected cells.
     * @param {function} onStyle - function for styling
     */
  styleToSelectedCells(onStyle) {
    this.createRangeBySelectedCells();
    onStyle(this.wwe.getEditor());
  }

  /**
     * Destroy.
     */
  destroy() {
    this.eventManager.removeEventHandler('mousedown.tableSelection');
    this.eventManager.removeEventHandler('mouseover.tableSelection');
    this.eventManager.removeEventHandler('mouseup.tableSelection');
    this.eventManager.removeEventHandler('copyBefore.tableSelection');
    this.eventManager.removeEventHandler('pasteBefore.tableSelection');
  }
}

export default WwTableSelectionManager;
