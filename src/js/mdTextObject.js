/**
 * @fileoverview Implements markdown textObject
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

/**
 * Markdown textObject
 * @exports mdTextObject
 * @constructor
 * @class mdTextObject
 * @param {MarkdownEditor} mde MarkdownEditor instance
 * @param {object} range range
 */
function mdTextObject(mde, range) {
    this._mde = mde;

    this.setRange(range || mde.getRange());
}

/**
 * Set start
 * @memberOf mdTextObject
 * @param {object} rangeStart Start of range
 * @private
 */
mdTextObject.prototype._setStart = function(rangeStart) {
    this._start = rangeStart;
};
/**
 * Set end
 * @private
 * @memberOf mdTextObject
 * @param {object} rangeEnd End of range
 * @private
 */
mdTextObject.prototype._setEnd = function(rangeEnd) {
    this._end = rangeEnd;
};
/**
 * Set range to given range
 * @private
 * @memberOf mdTextObject
 * @param {object} range Range object
 */
mdTextObject.prototype.setRange = function(range) {
    this._setStart(range.start);
    this._setEnd(range.end);
};
/**
 * Set start to end
 * @private
 * @memberOf mdTextObject
 * @param {object} range Range object
 */
mdTextObject.prototype.setEndBeforeRange = function(range) {
    this._setEnd(range.start);
};
/**
 * Expand startOffset by 1
 * @private
 * @memberOf mdTextObject
 */
mdTextObject.prototype.expandStartOffset = function() {
    var start = this._start;

    if (start.ch !== 0) {
        start.ch -= 1;
    }
};
/**
 * Expand endOffset by 1
 * @private
 * @memberOf mdTextObject
 */
mdTextObject.prototype.expandEndOffset = function() {
    var end = this._end;

    if (end.ch < this._mde.getEditor().getDoc().getLine(end.line).length) {
        end.ch += 1;
    }
};
/**
 * Get current selection's text content
 * @private
 * @memberOf mdTextObject
 * @returns {{start: {line: number, ch: number}, end: {line: number, ch: number}}}
 */
mdTextObject.prototype.getTextContent = function() {
    return this._mde.getEditor().getRange(this._start, this._end);
};
/**
 * Replace current selection's content with given text content
 * @private
 * @memberOf mdTextObject
 * @param {string} content Replacement content
 */
mdTextObject.prototype.replaceContent = function(content) {
    this._mde.getEditor().replaceRange(content, this._start, this._end, '+input');
};
/**
 * Delete current selection's content
 * @private
 * @memberOf mdTextObject
 */
mdTextObject.prototype.deleteContent = function() {
    this._mde.getEditor().replaceRange('', this._start, this._end, '+delete');
};
/**
 * peek StartBeforeOffset
 * @private
 * @memberOf mdTextObject
 * @param offset
 * @returns {{start: {line: number, ch: number}, end: {line: number, ch: number}}}
 */
mdTextObject.prototype.peekStartBeforeOffset = function(offset) {
    var peekStart;

    peekStart = {
        line: this._start.line,
        ch: Math.max(this._start.ch - offset, 0)
    };

    return this._mde.getEditor().getRange(peekStart, this._start);
};

module.exports = mdTextObject;
