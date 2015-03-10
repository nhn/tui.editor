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

    this.tempRange = null;

    rangy.init();
}

Selection.prototype.restore = function() {
    if (this.tempRange) {
        this.select(this.tempRange);
        this.tempRange = null;
    }
};

Selection.prototype.save = function() {
    this.tempRange = this.getCurrentSelection();
    console.log('save', this.tempRange.start, this.tempRange.end);
};

Selection.prototype.adjustCursor = function() {
};

Selection.prototype.createRange = function(start, end) {
    var range = rangy.createRange(),
        nodeInfo;

    start = start < 0 ? 0 : start;
    end = end < 0 ? 0 : end;

    nodeInfo = this.contentTracker.getOffsetNodeInfo([start, end]);

    range.setStart(nodeInfo[0].node, nodeInfo[0].offsetInNode);
    range.setEnd(nodeInfo[1].node, nodeInfo[1].offsetInNode);

    range.start = start;
    range.end = end;

    return range;
};

Selection.prototype.select = function(start, end) {
    var range;

    if (util.isObject(start)) {
        end = start.end;
        start = start.start;
    }

    rangy.getSelection().removeAllRanges();

    range = this.createRange(start, end || start);

    rangy.getSelection().addRange(range);

    return range;
};

Selection.prototype.getCurrentSelection = function() {
    var range = this._getCurrentRange(),
        trackInfo;

    if (range) {
        trackInfo = this.contentTracker.getNodeOffset([range.startContainer, range.endContainer]);
        range.start = trackInfo[0].offset + range.startOffset;
        range.end = trackInfo[1].offset + range.endOffset;

        //IE화 파폭에서의 마지막라인에서의 문제 교정
        if (range.start === range.end && range.startContainer.textContent === '\n' && range.startOffset === 1) {
            range.end -= 1;
            range.start = range.end;
        }
    }

    return range;
};

Selection.prototype._getCurrentRange = function() {
    var sel = rangy.getSelection();
    //todo 에디팅영역 안에서 발생한레인지찾는 루틴필요
    return sel.rangeCount && sel.getRangeAt(0);
};

module.exports = Selection;
