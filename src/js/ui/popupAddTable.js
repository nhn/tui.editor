/**
 * @fileoverview Implements PopupAddTable
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var LayerPopup = require('./layerpopup');

var util = tui.util;

var POPUP_CONTENT = [
    '<div class="te-table-selection">',
        '<div class="te-table-header"></div>',
        '<div class="te-table-body"></div>',
        '<div class="te-selection-area"></div>',
    '</div>',
    '<p class="te-description"></p>'
].join('');

var CELL_WIDTH = 25,
    CELL_HEIGHT = 17,
    MIN_ROW_INDEX = 7,
    MAX_ROW_INDEX = 14,
    MIN_COL_INDEX = 5,
    MAX_COL_INDEX = 9,
    MIN_ROW_SELECTION_INDEX = 1,
    MIN_COL_SELECTION_INDEX = 1,
    HEADER_ROW_COUNT = 1,
    LAST_BORDER = 1;

/**
 * PopupAddTable
 * It implements Popup to add a table
 * @exports PopupAddTable
 * @augments LayerPopup
 * @constructor
 * @class
 * @param {object} options options
 */
function PopupAddTable(options) {
    options = util.extend({
        title: false,
        className: 'te-popup-add-table',
        content: POPUP_CONTENT
    }, options);

    LayerPopup.call(this, options);

    this._selectedBound = {};
    this._tableBound = {};
    this.eventManager = options.eventManager;
    this.$button = options.$button;

    this.render();
    this._cacheElements();
    this._bindContentEvent();
    this._linkWithEventManager();

    this._setTableSizeByBound(MIN_COL_INDEX, MIN_ROW_INDEX);
}

PopupAddTable.prototype = util.extend(
    {},
    LayerPopup.prototype
);

/**
 * _cacheElements
 * Cache elements for use
 */
PopupAddTable.prototype._cacheElements = function() {
    this.$header = this.$el.find('.te-table-header');
    this.$body = this.$el.find('.te-table-body');
    this.$selection = this.$el.find('.te-selection-area');
    this.$desc = this.$el.find('.te-description');
};

/**
 * _bindContentEvent
 * Bind element events
 */
PopupAddTable.prototype._bindContentEvent = function() {
    var self = this;

    this.on('mousemove .te-table-selection', function(ev) {
        var x = ev.pageX - self._selectionOffset.left,
            y = ev.pageY - self._selectionOffset.top,
            bound;

        bound = self._getSelectionBoundByOffset(x, y);

        self._resizeTableBySelectionIfNeed(bound.col, bound.row);

        self._setSelectionAreaByBound(bound.col, bound.row);
        self._setDisplayText(bound.col, bound.row);
        self._setSelectedBound(bound.col, bound.row);
    });

    this.on('click .te-table-selection', function() {
        var tableSize = self._getSelectedTableSize();
        self.eventManager.emit('command', 'Table', tableSize.col, tableSize.row);
    });
};

/**
 * _linkWithEventManager
 * Bind event manager event
 */
PopupAddTable.prototype._linkWithEventManager = function() {
    var self = this;

    this.eventManager.listen('focus', function() {
        self.hide();
    });

    this.eventManager.listen('openPopupAddTable', function() {
        self.eventManager.emit('closeAllPopup');
        self.$el.css({
            'top': self.$button.position().top + self.$button.height() + 5,
            'left': self.$button.position().left
        });
        self.show();
        self._selectionOffset = self.$el.find('.te-table-selection').offset();
    });

    this.eventManager.listen('closeAllPopup', function() {
        self.hide();
    });
};

/**
 * _resizeTableBySelectionIfNeed
 * Resize table if need
 * @param {number} col column index
 * @param {number} row row index
 */
PopupAddTable.prototype._resizeTableBySelectionIfNeed = function(col, row)  {
    var resizedBound = this._getResizedTableBound(col, row);

    if (resizedBound) {
        this._setTableSizeByBound(resizedBound.col, resizedBound.row);
    }
};

/**
 * _getResizedTableBound
 * Get resized table bound if Need
 * @param {number} col column index
 * @param {number} row row index
 * @returns {object} bound
 */
PopupAddTable.prototype._getResizedTableBound  = function(col, row)  {
    var resizedCol, resizedRow, resizedBound;

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
};

/**
 * _isNeedResizeTable
 * check if need resize table
 * @param {number} col column index
 * @param {number} row row index
 * @returns {boolean} result
 */
PopupAddTable.prototype._isNeedResizeTable = function(col, row) {
    return (col && col !== this._tableBound.col)
        || (row && row !== this._tableBound.row);
};

/**
 * _getBoundByOffset
 * Get bound by offset
 * @param {number} x offset
 * @param {number} y offset
 * @returns {object} bound
 */
PopupAddTable.prototype._getBoundByOffset = function(x, y) {
    var rowBound = parseInt(y / CELL_HEIGHT, 10),
        colBound = parseInt(x / CELL_WIDTH, 10);

    return {
        row: rowBound,
        col: colBound
    };
};

/**
 * _getOffsetByBound
 * Get offset by bound
 * @param {number} col column index
 * @param {number} row row index
 * @returns {object} offset
 */
PopupAddTable.prototype._getOffsetByBound = function(col, row) {
    var x = (col * CELL_WIDTH) + CELL_WIDTH,
        y = (row * CELL_HEIGHT) + CELL_HEIGHT;

    return {
        x: x,
        y: y
    };
};

/**
 * _setTableSizeByBound
 * Set table size with bound
 * @param {number} col column index
 * @param {number} row row index
 */
PopupAddTable.prototype._setTableSizeByBound = function(col, row) {
    var boundOffset = this._getOffsetByBound(col, row - HEADER_ROW_COUNT);
    this._setTableSize(boundOffset.x, boundOffset.y);
    this._tableBound.row = row;
    this._tableBound.col = col;
};

/**
 * _getSelectionBoundByOffset
 * Get selection bound that process with range by offset
 * @param {number} x offset
 * @param {number} y offset
 * @returns {object} bound
 */
PopupAddTable.prototype._getSelectionBoundByOffset = function(x, y) {
    var bound = this._getBoundByOffset(x, y);

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
};

/**
 * _setSelectionAreaByBound
 * Set selection area with bound
 * @param {number} col column index
 * @param {number} row row index
 */
PopupAddTable.prototype._setSelectionAreaByBound = function(col, row) {
    var boundOffset,

    boundOffset = this._getOffsetByBound(col, row);
    this._setSelectionArea(boundOffset.x, boundOffset.y);
};


/**
 * _setSelectedBound
 * Set selected bound
 * @param {number} col column index
 * @param {number} row row index
 */
PopupAddTable.prototype._setSelectedBound = function(col, row) {
   this._selectedBound.col = col;
   this._selectedBound.row = row;
};

/**
 * _getSelectedTableSize
 * Get selected table size
 * @returns {object} bound
 */
PopupAddTable.prototype._getSelectedTableSize = function() {
    return {
        row: this._selectedBound.row + 1,
        col: this._selectedBound.col + 1
    };
};

/**
 * _setDisplayText
 * Set selected table size text for display
 * @param {number} col column index
 * @param {number} row row index
 */
PopupAddTable.prototype._setDisplayText = function(col, row) {
    this.$desc.html((col + 1) + ' x ' + (row + 1));
};

/**
 * _setTableSize
 * Set table element size
 * @param {number} x offset
 * @param {number} y offset
 */
PopupAddTable.prototype._setTableSize = function(x, y) {
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
};

/**
 * _setSelectionArea
 * Set selection element size
 * @param {number} x offset
 * @param {number} y offset
 */
PopupAddTable.prototype._setSelectionArea = function(x, y) {
    x += LAST_BORDER;
    y += LAST_BORDER;

    this.$selection.css({
        height: y,
        width: x
    });
};

PopupAddTable.CELL_WIDTH = CELL_WIDTH;
PopupAddTable.CELL_HEIGHT = CELL_HEIGHT;
PopupAddTable.MIN_ROW_SELECTION_INDEX = MIN_ROW_SELECTION_INDEX;
PopupAddTable.MIN_COL_SELECTION_INDEX = MIN_COL_SELECTION_INDEX;

module.exports = PopupAddTable;
