/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var ContentTracker = require('./contentTracker');

var util = ne.util;

/**
 * Selection
 * @exports Selection
 * @extends {}
 * @constructor
 * @class
 * @param {object} options 옵션
 * @param {jQuery} options.$editorEl 에디팅 영역 엘리먼트
 */
function Selection(options) {
    this.$editorEl = options.$editorEl;
    this.contentTracker = new ContentTracker(this.$editorEl);
}

Selection.prototype.update = function() {};

Selection.prototype.save = function() {
};

Selection.prototype.adjustCursor = function() {
};

Selection.prototype.createRange = function(start, end) {
    var range = rangy.createRange(),
        nodeInfo = this.contentTracker.getOffsetNodeInfo([start, end]);

    range.setStart(nodeInfo[0].node, nodeInfo[0].offsetInNode);
    range.setEnd(nodeInfo[1].node, nodeInfo[1].offsetInNode);

    return range;
};

Selection.prototype.select = function(start, end) {
    var range;

    if (util.isObject(start)) {
        end = start.end;
        start = start.start;
    }

    range = this.createRange(start, end || start);

    rangy.getSelection().addRange(range);

    return range;
};

Selection.prototype.getCurrentSelection = function() {
    var range = this._getCurrentRange(),
        trackInfo;

    if (range) {
        trackInfo = this.contentTracker.getNodeOffset([range.startContainer, range.endContainer]);

        return {
            start: trackInfo[0].offset + range.startOffset,
            end: trackInfo[1].offset + range.endOffset,
            range: range
        };
    }
};

Selection.prototype._getCurrentRange = function() {
    return rangy.getSelection().getRangeAt(0);
};
module.exports = Selection;
