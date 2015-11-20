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
function WwSelectionMarker(sq) {
    this._markerNode = null;
    this._sq = sq;
}

WwSelectionMarker.prototype.addMarker = function(range) {
    this._markerNode = this._makeMarker();

    range.insertNode(this._markerNode);
    range.setStartAfter(this._markerNode);

    return range;
};

WwSelectionMarker.prototype._makeMarker = function() {
    return this._sq.createElement('INPUT', {type:'hidden', class: MARKER_CSS_CLASS});
};

WwSelectionMarker.prototype.restore = function() {
    var newRange = this._sq.getSelection().cloneRange();

    newRange.setStartAfter(this._markerNode);
    newRange.collapse(true);

    this._sq.setSelection(newRange);
};

module.exports = WwSelectionMarker;
