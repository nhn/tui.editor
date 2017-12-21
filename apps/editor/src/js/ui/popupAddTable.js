/**
 * @fileoverview Implements PopupAddTable
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import util from 'tui-code-snippet';

import LayerPopup from './layerpopup';

const CLASS_TABLE_SELECTION = 'te-table-selection';
const CLASS_TABLE_HEADER = 'te-table-header';
const CLASS_TABLE_BODY = 'te-table-body';
const CLASS_SELECTION_AREA = 'te-selection-area';
const CLASS_DESCRIPTION = 'te-description';

const POPUP_CONTENT = `
    <div class="${CLASS_TABLE_SELECTION}">
        <div class="${CLASS_TABLE_HEADER}"></div>
        <div class="${CLASS_TABLE_BODY}"></div>
        <div class="${CLASS_SELECTION_AREA}"></div>
    </div>
    <p class="${CLASS_DESCRIPTION}"></p>
`;

const CELL_WIDTH = 25;
const CELL_HEIGHT = 17;
const MIN_ROW_INDEX = 7;
const MAX_ROW_INDEX = 14;
const MIN_COL_INDEX = 5;
const MAX_COL_INDEX = 9;
const MIN_ROW_SELECTION_INDEX = 1;
const MIN_COL_SELECTION_INDEX = 1;
const HEADER_ROW_COUNT = 1;
const LAST_BORDER = 1;

/**
 * Class PopupAddTable
 * It implements Popup to add a table
 * @extends {LayerPopup}
 */
class PopupAddTable extends LayerPopup {
  /**
   * Creates an instance of PopupAddTable.
   * @param {LayerPopupOption} options - layer popup option
   * @memberof PopupAddTable
   */
  constructor(options) {
    options = util.extend({
      header: false,
      className: 'te-popup-add-table',
      content: POPUP_CONTENT
    }, options);
    super(options);
  }

  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @memberof PopupAddTable
   * @protected
   * @override
   */
  _initInstance(options) {
    super._initInstance(options);

    this._selectedBound = {};
    this._tableBound = {};
    this._eventManager = options.eventManager;
    this.$button = options.$button;
  }

  /**
   * initialize DOM, render popup
   * @memberof PopupAddTable
   * @protected
   * @override
   */
  _initDOM() {
    super._initDOM();

    this._cacheElements();
    this._setTableSizeByBound(MIN_COL_INDEX, MIN_ROW_INDEX);
  }

  /**
   * bind DOM events
   * @memberof PopupAddTable
   * @protected
   * @override
   */
  _initDOMEvent(options) {
    super._initDOMEvent(options);

    this.on(`mousemove .${CLASS_TABLE_SELECTION}`, ev => {
      const x = ev.pageX - this._selectionOffset.left;
      const y = ev.pageY - this._selectionOffset.top;
      const bound = this._getSelectionBoundByOffset(x, y);

      this._resizeTableBySelectionIfNeed(bound.col, bound.row);

      this._setSelectionAreaByBound(bound.col, bound.row);
      this._setDisplayText(bound.col, bound.row);
      this._setSelectedBound(bound.col, bound.row);
    });

    this.on(`click .${CLASS_TABLE_SELECTION}`, () => {
      const tableSize = this._getSelectedTableSize();
      this._eventManager.emit('command', 'Table', tableSize.col, tableSize.row);
    });
  }

  /**
   * bind editor events
   * @memberof PopupAddTable
   * @protected
   * @abstract
   */
  _initEditorEvent() {
    super._initEditorEvent();

    this._eventManager.listen('focus', () => this.hide());
    this._eventManager.listen('closeAllPopup', () => this.hide());

    this._eventManager.listen('openPopupAddTable', () => {
      this._eventManager.emit('closeAllPopup');
      const $button = this.$button;
      const position = $button.position();
      this.$el.css({
        top: position.top + $button.outerHeight(true),
        left: position.left
      });
      this.show();
      this._selectionOffset = this.$el.find(`.${CLASS_TABLE_SELECTION}`).offset();
    });
  }

  /**
   * _cacheElements
   * Cache elements for use
   * @private
   */
  _cacheElements() {
    this.$header = this.$el.find(`.${CLASS_TABLE_HEADER}`);
    this.$body = this.$el.find(`.${CLASS_TABLE_BODY}`);
    this.$selection = this.$el.find(`.${CLASS_SELECTION_AREA}`);
    this.$desc = this.$el.find(`.${CLASS_DESCRIPTION}`);
  }

  /**
   * _resizeTableBySelectionIfNeed
   * Resize table if need
   * @param {number} col column index
   * @param {number} row row index
   * @private
   */
  _resizeTableBySelectionIfNeed(col, row) {
    const resizedBound = this._getResizedTableBound(col, row);

    if (resizedBound) {
      this._setTableSizeByBound(resizedBound.col, resizedBound.row);
    }
  }

  /**
   * _getResizedTableBound
   * Get resized table bound if Need
   * @param {number} col column index
   * @param {number} row row index
   * @returns {object} bound
   * @private
   */
  _getResizedTableBound(col, row) {
    let resizedCol, resizedRow, resizedBound;

    if (col >= MIN_COL_INDEX && col < MAX_COL_INDEX) {
      resizedCol = col + 1;
    } else if (col < MIN_COL_INDEX) {
      resizedCol = MIN_COL_INDEX;
    }

    if (row >= MIN_ROW_INDEX && row < MAX_ROW_INDEX) {
      resizedRow = row + 1;
    } else if (row < MIN_ROW_INDEX) {
      resizedRow = MIN_ROW_INDEX;
    }

    if (this._isNeedResizeTable(resizedCol, resizedRow)) {
      resizedBound = {
        row: resizedRow || this._tableBound.row,
        col: resizedCol || this._tableBound.col
      };
    }

    return resizedBound;
  }

  /**
   * _isNeedResizeTable
   * check if need resize table
   * @param {number} col column index
   * @param {number} row row index
   * @returns {boolean} result
   * @private
   */
  _isNeedResizeTable(col, row) {
    return (col && col !== this._tableBound.col)
            || (row && row !== this._tableBound.row);
  }

  /**
   * _getBoundByOffset
   * Get bound by offset
   * @param {number} x offset
   * @param {number} y offset
   * @returns {object} bound
   * @private
   */
  _getBoundByOffset(x, y) {
    const row = parseInt(y / CELL_HEIGHT, 10);
    const col = parseInt(x / CELL_WIDTH, 10);

    return {
      row,
      col
    };
  }

  /**
   * _getOffsetByBound
   * Get offset by bound
   * @param {number} col column index
   * @param {number} row row index
   * @returns {object} offset
   * @private
   */
  _getOffsetByBound(col, row) {
    const x = (col * CELL_WIDTH) + CELL_WIDTH,
      y = (row * CELL_HEIGHT) + CELL_HEIGHT;

    return {
      x,
      y
    };
  }

  /**
   * _setTableSizeByBound
   * Set table size with bound
   * @param {number} col column index
   * @param {number} row row index
   * @private
   */
  _setTableSizeByBound(col, row) {
    const boundOffset = this._getOffsetByBound(col, row - HEADER_ROW_COUNT);
    this._setTableSize(boundOffset.x, boundOffset.y);
    this._tableBound.row = row;
    this._tableBound.col = col;
  }

  /**
   * _getSelectionBoundByOffset
   * Get selection bound that process with range by offset
   * @param {number} x offset
   * @param {number} y offset
   * @returns {object} bound
   * @private
   */
  _getSelectionBoundByOffset(x, y) {
    const bound = this._getBoundByOffset(x, y);

    if (bound.row < MIN_ROW_SELECTION_INDEX) {
      bound.row = MIN_ROW_SELECTION_INDEX;
    } else if (bound.row > this._tableBound.row) {
      bound.row = this._tableBound.row;
    }

    if (bound.col < MIN_COL_SELECTION_INDEX) {
      bound.col = MIN_COL_SELECTION_INDEX;
    } else if (bound.col > this._tableBound.col) {
      bound.col = this._tableBound.col;
    }

    return bound;
  }

  /**
   * _setSelectionAreaByBound
   * Set selection area with bound
   * @param {number} col column index
   * @param {number} row row index
   * @private
   */
  _setSelectionAreaByBound(col, row) {
    const boundOffset = this._getOffsetByBound(col, row);
    this._setSelectionArea(boundOffset.x, boundOffset.y);
  }

  /**
   * _setSelectedBound
   * Set selected bound
   * @param {number} col column index
   * @param {number} row row index
   * @private
   */
  _setSelectedBound(col, row) {
    this._selectedBound.col = col;
    this._selectedBound.row = row;
  }

  /**
   * _getSelectedTableSize
   * Get selected table size
   * @returns {object} bound
   * @private
   */
  _getSelectedTableSize() {
    return {
      row: this._selectedBound.row + 1,
      col: this._selectedBound.col + 1
    };
  }

  /**
   * _setDisplayText
   * Set selected table size text for display
   * @param {number} col column index
   * @param {number} row row index
   * @private
   */
  _setDisplayText(col, row) {
    this.$desc.html(`${(col + 1)} x ${(row + 1)}`);
  }

  /**
   * _setTableSize
   * Set table element size
   * @param {number} x offset
   * @param {number} y offset
   * @private
   */
  _setTableSize(x, y) {
    x += LAST_BORDER;
    y += LAST_BORDER;

    this.$header.css({
      height: CELL_HEIGHT,
      width: x
    });

    this.$body.css({
      height: y,
      width: x
    });

    this.$el.css({
      width: x + 30
    });
  }

  /**
   * _setSelectionArea
   * Set selection element size
   * @param {number} x offset
   * @param {number} y offset
   * @private
   */
  _setSelectionArea(x, y) {
    x += LAST_BORDER;
    y += LAST_BORDER;

    this.$selection.css({
      height: y,
      width: x
    });
  }
}

PopupAddTable.CELL_WIDTH = CELL_WIDTH;
PopupAddTable.CELL_HEIGHT = CELL_HEIGHT;
PopupAddTable.MIN_ROW_SELECTION_INDEX = MIN_ROW_SELECTION_INDEX;
PopupAddTable.MIN_COL_SELECTION_INDEX = MIN_COL_SELECTION_INDEX;

export default PopupAddTable;
