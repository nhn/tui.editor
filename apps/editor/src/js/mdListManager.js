/**
 * @fileoverview Implements markdown list manager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
const FIND_MD_OL_RX = /^[ \t]*[\d]+\. .*/;
const FIND_MD_UL_RX = /^[ \t]*[-*] .*/;
const FIND_MD_TASK_RX = /^[ \t]*[-*]( \[[ xX]])? .*/;
const FIND_TABLE_RX = /^\|([-\s\w\d\t<>?!@#$%^&*()_=+\\/'";: \r[\]]*\|+)+/i;
const FIND_HEADING_RX = /^#+\s/;
const FIND_BLOCK_RX = /^ {0,3}(```|\||>)/;

/**
 * Class MdListManager
 */
class MdListManager {
  /**
   * Creates an instance of MdListManager.
   * @param {MarkdownEditor} mde - MarkdownEditor instance
   * @memberof MdListManager
   */
  constructor(mde) {
    this.mde = mde;
    this.eventManager = mde.eventManager;

    /**
     * Name property
     * @memberof MdListManager#
     * @type {string}
     */
    this.name = 'list';
  }

  /**
   * Return whether passed line is list or paragraph or not
   * @param {string} line line text
   * @returns {boolean}
   */
  isListOrParagraph(line) {
    return !FIND_BLOCK_RX.test(line) && !FIND_TABLE_RX.test(line) && !FIND_HEADING_RX.test(line);
  }

  /**
   * Append blank line at list top or bottom if needed
   * @param {CodeMirror} cm CodeMirror instance
   * @param {number} index index number
   * @param {number} endLineNumber end line index number
   * @param {number} startLineNumber start line index number
   */
  appendBlankLineIfNeed(cm, index, endLineNumber, startLineNumber) {
    const doc = cm.getDoc();
    let cursorPositionFactor = 0;
    const isMultiLineSelection = startLineNumber !== endLineNumber;
    const nextLineOfLastIndex = doc.getLine(this._getEndLineNumberOfList(doc, endLineNumber) + 1);
    const previousLineOfFirstIndex = doc.getLine(this._getStartLineNumberOfList(doc, startLineNumber) - 1);

    const nextLine = doc.getLine(index + 1);
    if ((isMultiLineSelection && this._isNeedAppendBlankLine(nextLineOfLastIndex))
            || (!isMultiLineSelection && this._isNeedAppendBlankLine(nextLine))
    ) {
      doc.replaceRange('\n', {
        line: index,
        ch: doc.getLine(index).length
      });
    }

    const previousLine = doc.getLine(index - 1);
    if ((isMultiLineSelection && this._isNeedAppendBlankLine(previousLineOfFirstIndex))
            || (!isMultiLineSelection && this._isNeedAppendBlankLine(previousLine))
    ) {
      doc.replaceRange('\n', {
        line: startLineNumber,
        ch: 0
      });
      cursorPositionFactor += 1;
    }
    if (!isMultiLineSelection) {
      const currentLineNumber = index + cursorPositionFactor;
      cm.setCursor(currentLineNumber, doc.getLine(currentLineNumber).length);
    }
  }

  /**
   * Return whether need to append blank line or not
   * @param {string} line Line text
   * @returns {boolean}
   * @private
   */
  _isNeedAppendBlankLine(line) {
    return line && line.length !== 0 && !this._isAList(line);
  }

  /**
   * Sort line number of selection descending
   * @param {{from, to}} range start, end CodeMirror range information
   * @returns {{start: {number}, end: {number}}}
   */
  createSortedLineRange(range) {
    const isReversed = range.from.line > range.to.line;
    const rangeStart = {
      line: isReversed ? range.to.line : range.from.line,
      ch: 0
    };
    const rangeEnd = {
      line: isReversed ? range.from.line : range.to.line,
      ch: 0
    };

    return {
      start: rangeStart.line,
      end: rangeEnd.line
    };
  }

  /**
   * Expand line range if need
   * @param {object} doc doc instance
   * @param {{from, to}} range CodeMirror range information
   * @param {function} comparator comparator function
   * @returns {{start: number, end: number}}
   */
  expandLineRangeIfNeed(doc, range, comparator) {
    const lineRange = this.createSortedLineRange(range);
    let {start, end} = lineRange;

    const isRangeStartInUlOrTask = this._isDifferentListType(comparator, doc.getLine(start));
    const isRangeEndInUlOrTask = this._isDifferentListType(comparator, doc.getLine(end));

    if (isRangeStartInUlOrTask) {
      start = this._getStartLineNumberOfList(doc, start);
    }

    if (isRangeEndInUlOrTask) {
      end = this._getEndLineNumberOfList(doc, end);
    }

    return {
      start,
      end
    };
  }

  /**
   * Replace list syntax
   * @param {object} doc CodeMirror doc instance
   * @param {number} lineNumber Line number
   * @param {RegExp} regexp Regexp for find list syntax
   * @param {string} replacePattern Replacement string
   */
  replaceLineText(doc, lineNumber, regexp, replacePattern) {
    let line = doc.getLine(lineNumber);
    const currentLineStart = {
      line: lineNumber,
      ch: 0
    };
    const currentLineEnd = {
      line: lineNumber,
      ch: line.length
    };

    line = line.replace(regexp, replacePattern);

    doc.replaceRange(line, currentLineStart, currentLineEnd);
  }

  /**
   * Return whether is a different list type or not
   * @param {function} comparator comparator function
   * @param {string} line line string
   * @returns {boolean}
   * @private
   */
  _isDifferentListType(comparator, line) {
    return line && line.length !== 0 && comparator.call(this, line);
  }

  /**
   * Return whether is a list or not
   * @param {string} line line string
   * @returns {boolean}
   * @private
   */
  _isAList(line) {
    return line && line.length !== 0 && this._isListLine(line);
  }

  /**
   * Return whether passed line is list or not
   * @param {string} line Line text
   * @returns {Boolean}
   * @private
   */
  _isListLine(line) {
    return !!(line.match(FIND_MD_TASK_RX) || line.match(FIND_MD_UL_RX) || line.match(FIND_MD_OL_RX));
  }

  /**
   * Get start line number of current list
   * @param {object} doc CodeMirror doc instance
   * @param {number} startLineNumber start line number of selection
   * @returns {number|undefined}
   * @private
   */
  _getStartLineNumberOfList(doc, startLineNumber) {
    let lineNumber;

    for (lineNumber = startLineNumber; lineNumber > 0; lineNumber -= 1) {
      const previousLine = doc.getLine(lineNumber - 1);
      if (!previousLine || !this._isListLine(previousLine)) {
        break;
      }
    }

    return lineNumber;
  }

  /**
   * Get end line number of current list
   * @param {object} doc CodeMirror doc instance
   * @param {number} endLineNumber end line number of selection
   * @returns {number|undefined}
   * @private
   */
  _getEndLineNumberOfList(doc, endLineNumber) {
    const lineCount = doc.lineCount();
    let lineNumber;

    for (lineNumber = endLineNumber; lineNumber < lineCount; lineNumber += 1) {
      const nextLine = doc.getLine(lineNumber + 1);
      if (!nextLine || !this._isListLine(nextLine)) {
        break;
      }
    }

    return lineNumber;
  }
}

export default MdListManager;
