/**
 * @fileoverview Implements selection marker for wysiwyg
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var MARKER_CSS_CLASS = 'tui-editor-selection-marker';

/**
 * WwSelectionMarker
 * @exports WwSelectionMarker
 * @augments
 * @constructor
 * @class
 */
function WwSelectionMarker() {
    this._markerNode = null;
}

/**
 * insertMarker
 * @param {Range} range range
 * @param {SquireExt} sq SquireExt instance
 * @returns {Range} range range
 */
WwSelectionMarker.prototype.insertMarker = function(range, sq) {
    this._markerNode = this._makeMarker(sq);

    range.insertNode(this._markerNode);
    range.setStartAfter(this._markerNode);

    return range;
};

/**
 * _makeMarker
 * Make marker element
 * @param {SquireExt} sq SquireExt instance
 * @returns {Node} marker
 */
WwSelectionMarker.prototype._makeMarker = function(sq) {
    return sq.createElement('INPUT', {type:'hidden', class: MARKER_CSS_CLASS});
};

/**
 * restore
 * Restore marker to selection
 * @param {SquireExt} sq SquireExt instance
 * @returns {Range} range
 */
WwSelectionMarker.prototype.restore = function(sq) {
    var newRange = sq.getSelection().cloneRange();

    newRange.setStartAfter(this._markerNode);
    newRange.collapse(true);

    sq.setSelection(newRange);

    $(this._markerNode).remove();

    return newRange;
};

module.exports = WwSelectionMarker;
