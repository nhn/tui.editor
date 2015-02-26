/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

/**
 * ContentTracker
 * @exports ContentTracker
 * @constructor
 * @class
 */
function ContentTracker() {
}

ContentTracker.prototype._getOffsetInfo = function(start, end) {
    var result = [];
    var offsetList = [start, end];

    if (!offsetList.length) {
        return result;
    }
    var offset = offsetList.shift();
    var walker = document.createTreeWalker(this.$editorEl[0], NodeFilter.SHOW_TEXT, null, false);
    var text = '';
    var walkerOffset = 0;

    while (walker.nextNode()) {
        text = walker.currentNode.nodeValue || '';
        var newWalkerOffset = walkerOffset + text.length;
        while (newWalkerOffset > offset) {
            result.push({
                container: walker.currentNode,
                offsetInContainer: offset - walkerOffset,
                offset: offset
            });
            if (!offsetList.length) {
                return result;
            }
            offset = offsetList.shift();
        }
        walkerOffset = newWalkerOffset;
    }

    do {
        result.push({
            container: walker.currentNode,
            offsetInContainer: text.length,
            offset: offset
        });
        offset = offsetList.shift();
    }
    while (offset);

    return result;
};

module.exports = ContentTracker;
