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

WysiwygMarkerHelper.prototype.updateMarkerWithExtraInfo = function(marker) {
    var foundNode, markerRange, info;

    foundNode = this._findOffsetNode([marker.start, marker.end]);

    markerRange = this.sqe.getSelection().cloneRange();
    markerRange.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
    markerRange.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

    info = this._getAddtionalInfoOfRange(markerRange);

    marker.text = info.text;
    marker.top = info.top;
    marker.left = info.left;

    return marker;
};

WysiwygMarkerHelper.prototype._getAddtionalInfoOfRange = function(range) {
    var text, top, left, rect;

    text = range.cloneContents().textContent.replace(FIND_ZWB_RX, '');

    range.setStart(range.endContainer, range.endOffset);
    range.collapse(true);

    rect = range.getClientRects()[0];

    if (rect) {
        top = this.sqe.scrollTop() + rect.top;
        left = rect.left;
    } else {
        top = left = 0;
    }

    return {
        text: text,
        top: top,
        left: left
    };
};

WysiwygMarkerHelper.prototype.getMarkerInfoOfCurrentSelection = function() {
    var range, beforeRange, start, end, info;

    range = this.sqe.getSelection().cloneRange();

    if (this._extendRangeToTextNodeIfHasNone(range)) {
        beforeRange = range.cloneRange();
        beforeRange.setStart(this.sqe.get$Body()[0], 0);
        beforeRange.setEnd(range.startContainer, range.startOffset);

        info = this._getAddtionalInfoOfRange(range);

        start = beforeRange.cloneContents().textContent.length;
        end = start + info.text.length;

        return {
            start: start,
            end: end,
            text: info.text,
            top: info.top,
            left: info.left
        };
    }

    return null;
};

WysiwygMarkerHelper.prototype._extendRangeToTextNodeIfHasNone = function(range) {
    var endNode = domUtils.getChildNodeByOffset(range.endContainer, range.endOffset),
        textNode;

    //getClientRects API로 rect값을 가져올때는 range 컨테이너가 텍스트 노드여야한다.
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

WysiwygMarkerHelper.prototype._findOffsetNode = function(offsetList) {
    return domUtils.findOffsetNode(this.sqe.get$Body()[0], offsetList, function(text) {
        return text.replace(FIND_ZWB_RX, '');
    });
};

module.exports = WysiwygMarkerHelper;
