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
        selection, start, end, info, foundCursor;

    selection = this._getSelection();

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

MarkdownMarkerHelper.prototype._getSelection = function() {
    var selection, head, anchor, isReversedSelection, temp;

    selection = this.cm.getDoc().listSelections()[0];
    anchor = selection.anchor;
    head = selection.head;

    isReversedSelection = (anchor.line > head.line) || (anchor.line === head.line && anchor.ch > head.ch);

    if (isReversedSelection) {
        temp = head;
        head = anchor;
        anchor = temp;
    }

    return {
        anchor: anchor,
        head: head
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

MarkdownMarkerHelper.prototype.selectOffsetRange = function(start, end) {
    var foundCursor = this._findOffsetCursor([start, end]);

    this.cm.setSelection({
        line: foundCursor[0].line,
        ch: foundCursor[0].ch
    }, {
        line: foundCursor[1].line,
        ch: foundCursor[1].ch
    });
};

MarkdownMarkerHelper.prototype.clearSelect = function() {
    var selection = this.cm.getDoc().listSelections()[0];

    if (selection) {
        this.cm.setCursor(selection.to());
    }
};

module.exports = MarkdownMarkerHelper;
