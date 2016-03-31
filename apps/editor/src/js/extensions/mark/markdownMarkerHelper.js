'use strict';

var util = tui.util;

var FIND_CRLF_RX = /(\n)|(\r\n)|(\r)/g;

/**
 *
 * MarkdownMarkerHelper
 * @exports MarkdownMarkerHelper
 * @augments
 * @constructor
 * @class
 * @param {CodeMirror} cm codemirror instance
 */
function MarkdownMarkerHelper(cm) {
    this.cm = cm;
}

MarkdownMarkerHelper.prototype.getTextContent = function() {
    return this.cm.getValue().replace(FIND_CRLF_RX, '');
};

MarkdownMarkerHelper.prototype.updateMarkerWithExtraInfo = function(marker) {
    var foundCursor, startCh, startLine, endCh, endLine, info;

    foundCursor = this._findOffsetCursor([marker.start, marker.end]);

    startLine = foundCursor[0].line;
    startCh = foundCursor[0].ch;
    endLine = foundCursor[1].line;
    endCh = foundCursor[1].ch;

    info = this._getAddtionalInfoOfRange(startLine, startCh, endLine, endCh);

    marker.text = info.text.replace(FIND_CRLF_RX, ' ');
    marker.top = info.top;
    marker.left = info.left;

    return marker;
};

MarkdownMarkerHelper.prototype._getAddtionalInfoOfRange = function(startLine, startCh, endLine, endCh) {
    var text, rect,
        doc = this.cm.getDoc();

    text = doc.getRange({
        line: startLine,
        ch: startCh
    }, {
        line: endLine,
        ch: endCh
    });

    rect = this.cm.charCoords({
        line: endLine,
        ch: endCh
    }, 'local');

    return {
        text: text,
        top: rect.top,
        left: rect.left
    };
};

MarkdownMarkerHelper.prototype.getMarkerInfoOfCurrentSelection = function() {
    var doc = this.cm.getDoc(),
        selection, start, end, info, foundCursor, temp;

    selection = doc.listSelections()[0];

    if (selection.anchor.line > selection.head.line
        || (selection.anchor.line === selection.head.line && selection.anchor.ch > selection.head.ch)) {
        temp = selection.head;
        selection.head = selection.anchor;
        selection.anchor = temp;
    }


    start = doc.getRange({
        line: 0,
        ch: 0
    }, selection.anchor).replace(FIND_CRLF_RX, '').length;

    end = start + doc.getSelection().replace(FIND_CRLF_RX, '').length;

    foundCursor = this._findOffsetCursor([start, end]);

    info = this._getAddtionalInfoOfRange(foundCursor[0].line,
                                         foundCursor[0].ch,
                                         foundCursor[1].line,
                                         foundCursor[1].ch);

    return {
        start: start,
        end: end,
        text: info.text.replace(FIND_CRLF_RX, ' '),
        top: info.top,
        left: info.left
    };
};

MarkdownMarkerHelper.prototype._findOffsetCursor = function(offsetlist) {
    var doc = this.cm.getDoc(),
        currentLength = 0,
        beforeLength = 0,
        result = [],
        offsetIndex = 0,
        line;

    for (line = 0; line < doc.lineCount(); line += 1) {
        currentLength += doc.getLine(line).length;

        while (currentLength >= offsetlist[offsetIndex]) {
            result.push({
                line: line,
                ch: offsetlist[offsetIndex] - beforeLength
            });

            offsetIndex += 1;

            if (util.isUndefined(offsetlist[offsetIndex])) {
                return result;
            }
        }

        beforeLength = currentLength;
    }

    while (!util.isUndefined(offsetlist[offsetIndex])) {
        result.push({
            line: line,
            ch: currentLength - beforeLength
        });

        offsetIndex += 1;
    }

    return result;
};

module.exports = MarkdownMarkerHelper;
