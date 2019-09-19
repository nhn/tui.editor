/**
 * @fileoverview Implements markdown textObject
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Class Markdown textObject
 * @param {MarkdownEditor} mde - MarkdownEditor instance
 * @param {object} range - range
 */
class MdTextObject {
  constructor(mde, range) {
    this._mde = mde;

    this.setRange(range || mde.getRange());
  }

  /**
   * Set start
   * @param {object} rangeStart Start of range
   * @private
   */
  _setStart(rangeStart) {
    this._start = rangeStart;
  }

  /**
   * Set end
   * @param {object} rangeEnd End of range
   * @private
   */
  _setEnd(rangeEnd) {
    this._end = rangeEnd;
  }

  /**
   * Set range to given range
   * @param {object} range Range object
   */
  setRange(range) {
    this._setStart(range.start);
    this._setEnd(range.end);
  }

  /**
   * Set start to end
   * @param {object} range Range object
   */
  setEndBeforeRange(range) {
    this._setEnd(range.start);
  }

  /**
   * Expand startOffset by 1
   */
  expandStartOffset() {
    const start = this._start;

    if (start.ch !== 0) {
      start.ch -= 1;
    }
  }

  /**
   * Expand endOffset by 1
   */
  expandEndOffset() {
    const end = this._end;

    if (end.ch < this._mde.getEditor().getDoc().getLine(end.line).length) {
      end.ch += 1;
    }
  }

  /**
   * Get current selection's text content
   * @returns {{start: {line: number, ch: number}, end: {line: number, ch: number}}}
   */
  getTextContent() {
    return this._mde.getEditor().getRange(this._start, this._end);
  }

  /**
   * Replace current selection's content with given text content
   * @param {string} content Replacement content
   */
  replaceContent(content) {
    this._mde.getEditor().replaceRange(content, this._start, this._end, '+input');
  }

  /**
   * Delete current selection's content
   */
  deleteContent() {
    this._mde.getEditor().replaceRange('', this._start, this._end, '+delete');
  }

  /**
   * peek StartBeforeOffset
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

export default MdTextObject;
