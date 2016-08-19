/**
 * @fileoverview Implements markdown marker helper for additional information
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


var util = tui.util;

var FIND_CRLF_RX = /(\n)|(\r\n)|(\r)/g;

/**
 *
 * MarkdownMarkerHelper
 * @exports MarkdownMarkerHelper
 * @constructor
 * @class
 * @param {CodeMirror} cm codemirror instance
 */
function MarkdownMarkerHelper(cm) {
    this.cm = cm;
}

/**
 * getTextContent
 * Get CRLF removed text content of CodeMirror
 * @returns {string} text content
 */
MarkdownMarkerHelper.prototype.getTextContent = function() {
    return this.cm.getValue().replace(FIND_CRLF_RX, '');
};

/**
 * updateMarkerWithExtraInfo
 * Update marker with extra info of CodeMirror
 * @param {object} marker marker
 * @returns {object} marker
 */
MarkdownMarkerHelper.prototype.updateMarkerWithExtraInfo = function(marker) {
    var foundCursor, startCh, startLine, endCh, endLine, info;

    foundCursor = this._findOffsetCursor([marker.start, marker.end]);

    startLine = foundCursor[0].line;
    startCh = foundCursor[0].ch;
    endLine = foundCursor[1].line;
    endCh = foundCursor[1].ch;

    info = this._getExtraInfoOfRange(startLine, startCh, endLine, endCh);

    marker.text = info.text.replace(FIND_CRLF_RX, ' ');
    marker.top = info.top;
    marker.left = info.left;
    marker.height = info.height;

    return marker;
};

/**
 * _getExtraInfoOfRange
 *  Get additional info of range
 * @param {number} startLine start line
 * @param {number} startCh start offset
 * @param {number} endLine end line
 * @param {number} endCh end offset
 * @returns {object} information
 */
MarkdownMarkerHelper.prototype._getExtraInfoOfRange = function(startLine, startCh, endLine, endCh) {
    var text, rect, top, left, height,
        doc = this.cm.getDoc();

    if (!doc.getValue().length) {
        top = left = height = 0;
        text = '';
    } else {
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

        top = rect.top;
        left = rect.left;
        height = rect.bottom - rect.top;
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

    info = this._getExtraInfoOfRange(foundCursor[0].line,
                                     foundCursor[0].ch,
                                     foundCursor[1].line,
                                     foundCursor[1].ch);

    return {
        start: start,
        end: end,
        text: info.text.replace(FIND_CRLF_RX, ' '),
        top: info.top,
        left: info.left,
        height: info.height
    };
};

/**
 * _getSelection
 * Get selection of CodeMirror, if selection is reversed then correct it
 * @returns {object} selection
 */
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

/**
 * _findOffsetCursor
 * Find offset cursor by given offset list
 * @param {Array.<number>} offsetlist offset list
 * @returns {Array.<object>} offset cursors
 */
MarkdownMarkerHelper.prototype._findOffsetCursor = function(offsetlist) {
    var doc = this.cm.getDoc();
    var currentLength = 0;
    var beforeLength = 0;
    var result = [];
    var offsetIndex = 0;
    var lineLength = doc.lineCount();
    var lineIndex;

    for (lineIndex = 0; lineIndex < lineLength; lineIndex += 1) {
        currentLength += doc.getLine(lineIndex).length;

        while (currentLength >= offsetlist[offsetIndex]) {
            result.push({
                line: lineIndex,
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
            line: lineIndex,
            ch: currentLength - beforeLength
        });

        offsetIndex += 1;
    }

    return result;
};

/**
 * selectOffsetRange
 * Make selection with given offset range
 * @param {number} start start offset
 * @param {number} end end offset
 */
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

/**
 * clearSelect
 * Clear selection of CodeMirror
 */
MarkdownMarkerHelper.prototype.clearSelect = function() {
    var selection = this.cm.getDoc().listSelections()[0];

    if (selection) {
        this.cm.setCursor(selection.to());
    }
};

module.exports = MarkdownMarkerHelper;
