/**
 * @fileoverview Implements viewOnly marker helper for additional information
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('../../domUtils');

var FIND_CRLF_RX = /(\n)|(\r\n)|(\r)/g;

/**
 * ViewOnlyMarkerHelper
 * @exports ViewOnlyMarkerHelper
 * @augments
 * @constructor
 * @class
 * @param {Preview} preview preview instance
 */
function ViewOnlyMarkerHelper(preview) {
    this.preview = preview;
}

/**
 * getTextContent
 * Get text content of wysiwyg
 * @returns {string}
 */
ViewOnlyMarkerHelper.prototype.getTextContent = function() {
    return this.preview.$el[0].textContent.replace(FIND_CRLF_RX, '');
};

/**
 * updateMarkerWithExtraInfo
 * Update marker with extra info of preview
 * @param {object} marker marker
 * @returns {object} marker
 */
ViewOnlyMarkerHelper.prototype.updateMarkerWithExtraInfo = function(marker) {
    var foundNode, markerRange, info;

    foundNode = this._findOffsetNode([marker.start, marker.end]);

    markerRange = document.createRange();

    markerRange.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
    markerRange.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

    info = this._getExtraInfoOfRange(markerRange);

    marker.text = info.text;
    marker.top = info.top;
    marker.left = info.left;

    return marker;
};

/**
 * _getExtraInfoOfRange
 * Get extra info of range
 * @param {Range} range range
 * @returns {object} extra info
 */
ViewOnlyMarkerHelper.prototype._getExtraInfoOfRange = function(range) {
    var text, top, left, rect, containerOffset;

    text = range.cloneContents().textContent.replace(FIND_CRLF_RX, '');

    range.setStart(range.endContainer, range.endOffset);
    range.collapse(true);

    rect = range.getClientRects()[0];

    containerOffset = this.preview.$el.offset();

    if (rect) {
        top = rect.top + this.preview.$el.scrollTop() - containerOffset.top;
        left = rect.left - containerOffset.left;
    } else {
        top = left = 0;
    }

    return {
        text: text,
        top: top,
        left: left
    };
};

/**
 * _findOffsetNode
 * Find offset nodes by given offset list
 * @param {[number]} offsetlist offset list
 * @returns {[object]} offset node informations
 */
ViewOnlyMarkerHelper.prototype._findOffsetNode = function(offsetlist) {
    return domUtils.findOffsetNode(this.preview.$el[0], offsetlist, function(text) {
        return text.replace(FIND_CRLF_RX, '');
    });
};

/**
 * selectOffsetRange
 * Make selection with given offset range
 * @param {number} start start offset
 * @param {number} end end offset
 */
ViewOnlyMarkerHelper.prototype.selectOffsetRange = function(start, end) {
    var foundNode = this._findOffsetNode([start, end]),
        range = document.createRange(),
        sel = window.getSelection();

    range.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
    range.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

    sel.removeAllRanges();
    sel.addRange(range);
};

/**
 * clearSelect
 * Clear selection
 */
ViewOnlyMarkerHelper.prototype.clearSelect = function() {
    window.getSelection().removeAllRanges();
};

module.exports = ViewOnlyMarkerHelper;
