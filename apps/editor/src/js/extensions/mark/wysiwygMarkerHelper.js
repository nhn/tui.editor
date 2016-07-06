/**
 * @fileoverview Implements wysiwyg marker helper for additional information
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('../../domUtils');

var FIND_ZWB_RX = /\u200B/g;

/**
 * WysiwygMarkerHelper
 * @exports WysiwygMarkerHelper
 * @augments
 * @constructor
 * @class
 * @param {SquireExt} sqe squire instance
 */
function WysiwygMarkerHelper(sqe) {
    this.sqe = sqe;
}

/**
 * getTextContent
 * Get text content of wysiwyg
 * @returns {string}
 */
WysiwygMarkerHelper.prototype.getTextContent = function() {
    return this.sqe.get$Body()[0].textContent.replace(FIND_ZWB_RX, '');
};

/**
 * updateMarkerWithExtraInfo
 * Update marker with extra info of CodeMirror
 * @param {object} marker marker
 * @returns {object} marker
 */
WysiwygMarkerHelper.prototype.updateMarkerWithExtraInfo = function(marker) {
    var foundNode, markerRange, info;

    foundNode = this._findOffsetNode([marker.start, marker.end]);

    markerRange = this.sqe.getSelection().cloneRange();
    markerRange.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
    markerRange.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

    info = this._getExtraInfoOfRange(markerRange);

    marker.text = info.text;
    marker.top = info.top;
    marker.left = info.left;
    marker.height = info.height;

    return marker;
};

/**
 * _getExtraInfoOfRange
 * Get extra info of range
 * @param {Range} range range
 * @returns {object} extra info
 */
WysiwygMarkerHelper.prototype._getExtraInfoOfRange = function(range) {
    var text, top, left, rect, height, node, parentNode, containerOffset;
    var endContainer = range.endContainer;
    var endOffset = range.endOffset;

    text = range.cloneContents().textContent.replace(FIND_ZWB_RX, '');

    if (domUtils.getChildNodeByOffset(endContainer, endOffset)) {
        range.setStart(endContainer, endOffset);
        range.collapse(true);

        rect = range.getBoundingClientRect();
    }

    if (rect && !rect.top) {
        this.sqe.modifyDocument(function() {
            node = document.createElement('SPAN');
            node.textContent = '\u200B';
            range.endContainer.parentNode.insertBefore(node, range.endContainer);
            rect = node.getBoundingClientRect();
            parentNode = node.parentNode;
            parentNode.removeChild(node);
        });
    }

    if (rect) {
        containerOffset = this.sqe.get$Body().parent().offset();
        top = this.sqe.scrollTop() + rect.top - containerOffset.top + $('body').scrollTop();
        left = rect.left - containerOffset.left;
        height = rect.height;
    } else {
        height = top = left = 0;
    }

    return {
        text: text,
        top: top,
        left: left,
        height: height
    };
};

/**
 * getMarkerInfoOfCurrentSelection
 * Get marker info of current selection
 * @returns {object} marker
 */
WysiwygMarkerHelper.prototype.getMarkerInfoOfCurrentSelection = function() {
    var range, beforeRange, start, end, info;

    range = this.sqe.getSelection().cloneRange();

    if (this._extendRangeToTextNodeIfHasNone(range)) {
        beforeRange = range.cloneRange();
        beforeRange.setStart(this.sqe.get$Body()[0], 0);
        beforeRange.setEnd(range.startContainer, range.startOffset);

        info = this._getExtraInfoOfRange(range);

        start = beforeRange.cloneContents().textContent.length;
        end = start + info.text.length;

        return {
            start: start,
            end: end,
            text: info.text,
            top: info.top,
            left: info.left,
            height: info.height
        };
    }

    return null;
};

/**
 * _extendRangeToTextNodeIfHasNone
 * Extend range to text node if start or end container have none
 * Containers of range should be text node
 * @param {Range} range range
 * @returns {boolean} success or fail
 */
WysiwygMarkerHelper.prototype._extendRangeToTextNodeIfHasNone = function(range) {
    var endNode = domUtils.getChildNodeByOffset(range.endContainer, range.endOffset),
        textNode;

    if (!domUtils.isTextNode(range.endContainer) || !endNode.nodeValue.replace(FIND_ZWB_RX, '').length) {
        if (domUtils.isTextNode(endNode)) {
            range.setEnd(endNode, 0);
        } else {
            textNode = domUtils.getPrevTextNode(endNode);
            if (textNode) {
                range.setEnd(textNode, textNode.length);
            } else {
                return false;
            }
        }
    }

    return true;
};

/**
 * _findOffsetNode
 * Find offset nodes by given offset list
 * @param {[number]} offsetlist offset list
 * @returns {[object]} offset node informations
 */
WysiwygMarkerHelper.prototype._findOffsetNode = function(offsetlist) {
    return domUtils.findOffsetNode(this.sqe.get$Body()[0], offsetlist, function(text) {
        return text.replace(FIND_ZWB_RX, '');
    });
};

/**
 * selectOffsetRange
 * Make selection with given offset range
 * @param {number} start start offset
 * @param {number} end end offset
 */
WysiwygMarkerHelper.prototype.selectOffsetRange = function(start, end) {
    var foundNode = this._findOffsetNode([start, end]),
        range = this.sqe.getSelection().cloneRange();

    range.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
    range.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

    this.sqe.setSelection(range);
};

/**
 * clearSelect
 * Clear selection of squire
 */
WysiwygMarkerHelper.prototype.clearSelect = function() {
    var range = this.sqe.getSelection().cloneRange();
    range.collapse(true);
    this.sqe.setSelection(range);
};

module.exports = WysiwygMarkerHelper;
