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

WwSelectionMarker.prototype.insertMarker = function(range, sq) {
    this._markerNode = this._makeMarker(sq);

    range.insertNode(this._markerNode);
    range.setStartAfter(this._markerNode);

    return range;
};

WwSelectionMarker.prototype._makeMarker = function(sq) {
    return sq.createElement('INPUT', {type:'hidden', class: MARKER_CSS_CLASS});
};

WwSelectionMarker.prototype.restore = function(sq) {
    var newRange = sq.getSelection().cloneRange();

    newRange.setStartAfter(this._markerNode);
    newRange.collapse(true);

    sq.setSelection(newRange);

    $(this._markerNode).remove();

    return newRange;
};

module.exports = WwSelectionMarker;
