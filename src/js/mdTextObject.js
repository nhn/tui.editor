/**
 * @fileoverview Implements markdown textObject
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

/**
 * Markdown textObject
 * @exports mdTextObject
 * @augments
 * @constructor
 * @class
 * @param {MarkdownEditor} mde markdownEditor
 * @param {object} range range
 */
function mdTextObject(mde, range) {
    this._mde = mde;

    this.setRange(range || mde.getRange());
}

mdTextObject.prototype._setStart = function(rangeStart) {
    this._start = rangeStart;
};

mdTextObject.prototype._setEnd = function(rangeEnd) {
    this._end = rangeEnd;
};

mdTextObject.prototype.setRange = function(range) {
    this._setStart(range.start);
    this._setEnd(range.end);
};

mdTextObject.prototype.setEndBeforeRange = function(range) {
    this._setEnd(range.start);
};

mdTextObject.prototype.expandStartOffset = function() {
    var start = this._start;

    if (start.ch !== 0) {
        start.ch -= 1;
    }
};

mdTextObject.prototype.expandEndOffset = function() {
    var end = this._end;

    if (end.ch < this._mde.getEditor().getDoc().getLine(end.line).length) {
        end.ch += 1;
    }
};

mdTextObject.prototype.getTextContent = function() {
    return this._mde.getEditor().getRange(this._start, this._end);
};

mdTextObject.prototype.replaceContent = function(content) {
    this._mde.getEditor().replaceRange(content, this._start, this._end, '+input');
};

mdTextObject.prototype.deleteContent = function() {
    this._mde.getEditor().replaceRange('', this._start, this._end, '+delete');
};

module.exports = mdTextObject;
