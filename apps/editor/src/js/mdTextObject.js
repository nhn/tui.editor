/**
 * @fileoverview Implements markdown textObject
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


/**
 * Markdown textObject
 * @exports mdTextObject
 * @constructor
 * @class mdTextObject
 * @param {MarkdownEditor} mde MarkdownEditor instance
 * @param {object} range range
 * @ignore
 */
class mdTextObject {
    constructor(mde, range) {
        this._mde = mde;

        this.setRange(range || mde.getRange());
    }

    /**
     * Set start
     * @memberOf mdTextObject
     * @param {object} rangeStart Start of range
     * @private
     */
    _setStart(rangeStart) {
        this._start = rangeStart;
    }

    /**
     * Set end
     * @private
     * @memberOf mdTextObject
     * @param {object} rangeEnd End of range
     * @private
     */
    _setEnd(rangeEnd) {
        this._end = rangeEnd;
    }

    /**
     * Set range to given range
     * @private
     * @memberOf mdTextObject
     * @param {object} range Range object
     */
    setRange(range) {
        this._setStart(range.start);
        this._setEnd(range.end);
    }

    /**
     * Set start to end
     * @private
     * @memberOf mdTextObject
     * @param {object} range Range object
     */
    setEndBeforeRange(range) {
        this._setEnd(range.start);
    }

    /**
     * Expand startOffset by 1
     * @private
     * @memberOf mdTextObject
     */
    expandStartOffset() {
        const start = this._start;

        if (start.ch !== 0) {
            start.ch -= 1;
        }
    }

    /**
     * Expand endOffset by 1
     * @private
     * @memberOf mdTextObject
     */
    expandEndOffset() {
        const end = this._end;

        if (end.ch < this._mde.getEditor().getDoc().getLine(end.line).length) {
            end.ch += 1;
        }
    }

    /**
     * Get current selection's text content
     * @private
     * @memberOf mdTextObject
     * @returns {{start: {line: number, ch: number}, end: {line: number, ch: number}}}
     */
    getTextContent() {
        return this._mde.getEditor().getRange(this._start, this._end);
    }

    /**
     * Replace current selection's content with given text content
     * @private
     * @memberOf mdTextObject
     * @param {string} content Replacement content
     */
    replaceContent(content) {
        this._mde.getEditor().replaceRange(content, this._start, this._end, '+input');
    }

    /**
     * Delete current selection's content
     * @private
     * @memberOf mdTextObject
     */
    deleteContent() {
        this._mde.getEditor().replaceRange('', this._start, this._end, '+delete');
    }

    /**
     * peek StartBeforeOffset
     * @private
     * @memberOf mdTextObject
     * @param {number} offset Offset
     * @returns {{start: {line: number, ch: number}, end: {line: number, ch: number}}}
     */
    peekStartBeforeOffset(offset) {
        const peekStart = {
            line: this._start.line,
            ch: Math.max(this._start.ch - offset, 0)
        };

        return this._mde.getEditor().getRange(peekStart, this._start);
    }
}

module.exports = mdTextObject;
