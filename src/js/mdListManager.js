/**
 * @fileoverview Implements markdown list manager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

const FIND_LIST_RX = /^[ \t]*([-*]|[\d]+\.)( \[[ xX]])? /;
const FIND_TASK_LIST_RX = /^[ \t]*([*-] |[\d]+\. )(\[[ xX]] )/;

const FIND_UL_RX = /^[ \t]*[-*] .*/;
const FIND_OL_TASK_RX = /^[ \t]*[\d]+\. \[[ xX]] .*/;

const LIST_SYNTAX_RX = /([*-] |[\d]+\. )/;
const TASK_SYNTAX_RX = /([-*] |[\d]+\. )(\[[ xX]] )/;
const LIST_OR_TASK_SYNTAX_RX = /([-*]|[\d]+\.)( \[[ xX]])? /;
const UL_TASK_SYNTAX_RX = /([-*])( \[[ xX]]) /;
const OL_SYNTAX_RX = /([\d])+\.( \[[ xX]])? /;

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
    this.cm = mde.getEditor();
    this.doc = this.cm.getDoc();

    /**
     * Name property
     * @memberof MdListManager#
     * @type {string}
     */
    this.name = 'list';
  }

  /**
   * Sort line number of selection descending
   * @param {{from, to}} range start, end CodeMirror range information
   * @returns {{start: {number}, end: {number}}}
   * @private
   */
  _createSortedLineRange(range) {
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
   * For odering the ol list, search preivous lines and
   * calculate ordinal number when find ol list
   * @param {number} lineNumber lineNumber
   * @returns {number}
   * @private
   */
  _calculateOrdinalNumber(lineNumber) {
    let ordinalNumber = 1;

    for (let i = lineNumber - 1; i >= 0; i -= 1) {
      const depth = this._getListDepth(i);

      if (depth === 1 && OL_SYNTAX_RX.exec(this.doc.getLine(i))) {
        ordinalNumber = parseInt(RegExp.$1, 10) + 1;
        break;
      } else if (depth === 0) {
        break;
      }
    }

    return ordinalNumber;
  }

  _isListLine(lineNumber) {
    return FIND_LIST_RX.exec(this.doc.getLine(lineNumber));
  }

  _isCanBeList(lineNumber) {
    const line = this.doc.getLine(lineNumber);

    return !FIND_BLOCK_RX.test(line) && !FIND_TABLE_RX.test(line) && !FIND_HEADING_RX.test(line);
  }

  /**
   * Process command of OL / UL
   * @param {{from, to}} range start, end CodeMirror range information
   * @param {boolean} isOL change OL or UL
   */
  command(range, isOL) {
    const checkBlankLine = [];
    const lineRange = this._createSortedLineRange(range);
    const {
      start: startLineNumber,
      end: endLineNumber
    } = lineRange;

    for (let i = startLineNumber; i <= endLineNumber; i += 1) {
      if (this._isCanBeList(i)) {
        if (this._isListLine(i)) {
          this._changeSameDepthList(i, isOL);
        } else {
          const replaceText = isOL ? `${this._calculateOrdinalNumber(i)}. ` : '* ';
          this.doc.replaceRange(replaceText, {
            line: i,
            ch: 0
          });
          checkBlankLine.push(i);
        }
      } else {
        break;
      }
    }

    this._insertBlankLineForNewList(checkBlankLine);

    this.cm.focus();
  }

  /**
   * Process command of TASK
   * @param {{from, to}} range start, end CodeMirror range information
   */
  commandTask(range) {
    const checkBlankLine = [];
    const lineRange = this._createSortedLineRange(range);
    const {
      start: startLineNumber,
      end: endLineNumber
    } = lineRange;

    for (let i = startLineNumber; i <= endLineNumber; i += 1) {
      if (this._isCanBeList(i)) {
        if (FIND_TASK_LIST_RX.exec(this.doc.getLine(i))) {
          this._replaceLineText(i, TASK_SYNTAX_RX, '$1');
        } else if (this._isListLine(i)) {
          this._replaceLineText(i, LIST_SYNTAX_RX, '$1[ ] ');
        } else {
          this.doc.replaceRange('* [ ] ', {
            line: i,
            ch: 0
          });
          checkBlankLine.push(i);
        }
      } else {
        break;
      }
    }

    this._insertBlankLineForNewList(checkBlankLine);

    this.cm.focus();
  }

  _getListDepth(lineNumber) {
    return this.doc.getLine(lineNumber) ? this.doc.cm.getStateAfter(lineNumber).base.listStack.length : 0;
  }

  _findSameDepthList(listNumber, depth, isIncrease) {
    const lineCount = this.doc.lineCount();
    let result = [];
    let i = listNumber;
    let currentLineDepth;

    while (isIncrease ? i < lineCount - 1 : i > 0) {
      i = isIncrease ? i + 1 : i - 1;
      currentLineDepth = this._getListDepth(i);

      if (currentLineDepth === depth) {
        result.push(i);
      } else if (currentLineDepth < depth) {
        break;
      }
    }

    return result;
  }

  _changeSameDepthList(lineNumber, isOL) {
    const depth = this._getListDepth(lineNumber);

    const replacer = isOL ?
      (lineNum, ordinalNumber) => {
        this._replaceListTypeToOL(lineNum, ordinalNumber);
      } :
      (lineNum) => {
        this._replaceListTypeToUL(lineNum);
      };

    const backwardList = this._findSameDepthList(lineNumber, depth, false).reverse();
    const forwardList = this._findSameDepthList(lineNumber, depth, true);
    const sameDepthList = backwardList.concat([lineNumber]).concat(forwardList);

    sameDepthList.forEach((lineNum, i) => {
      replacer(lineNum, i + 1);
    });
  }

  /**
   * Replace list syntax
   * @param {number} lineNumber Line number
   * @param {RegExp} regexp Regexp for find list syntax
   * @param {string} replacePattern Replacement string
   */
  _replaceLineText(lineNumber, regexp, replacePattern) {
    let line = this.doc.getLine(lineNumber);
    const currentLineStart = {
      line: lineNumber,
      ch: 0
    };
    const currentLineEnd = {
      line: lineNumber,
      ch: line.length
    };

    line = line.replace(regexp, replacePattern);

    this.doc.replaceRange(line, currentLineStart, currentLineEnd);
  }

  _replaceListTypeToUL(lineNumber) {
    const lineText = this.doc.getLine(lineNumber);

    if (UL_TASK_SYNTAX_RX.exec(lineText)) {
      this._replaceLineText(lineNumber, UL_TASK_SYNTAX_RX, '$1 ');
    } else if (OL_SYNTAX_RX.exec(lineText)) {
      this._replaceLineText(lineNumber, OL_SYNTAX_RX, '* ');
    }
  }

  _replaceListTypeToOL(lineNumber, ordinalNumber) {
    const lineText = this.doc.getLine(lineNumber);

    if (FIND_UL_RX.exec(lineText) || FIND_OL_TASK_RX.exec(lineText)) {
      this._replaceLineText(lineNumber, LIST_OR_TASK_SYNTAX_RX, `${ordinalNumber}. `);
    } else if (OL_SYNTAX_RX.exec(lineText)) {
      if (parseInt(RegExp.$1, 10) !== ordinalNumber) {
        this._replaceLineText(lineNumber, OL_SYNTAX_RX, `${ordinalNumber}. `);
      }
    }
  }

  _isBlankLine(lineNumber) {
    return !this.doc.getLine(lineNumber);
  }

  _insertBlankLineForNewList(checkBlankLine) {
    let previouse = -1;
    let start = -1;

    checkBlankLine.forEach((lineNumber, index) => {
      if (previouse === -1) {
        start = lineNumber;
      } else if (lineNumber - previouse === 1 && start === -1) {
        start = previouse;
      } else if (lineNumber - previouse > 1) {
        this._insertBlankLine(start, previouse);
        start = -1;
      }

      if (index === checkBlankLine.length - 1) {
        this._insertBlankLine(start, lineNumber);
      }

      previouse = lineNumber;
    });
  }

  _insertBlankLine(startLineNumber, endLineNumber) {
    let end = endLineNumber;

    if (startLineNumber > 0
      && !this._isBlankLine(startLineNumber - 1)
      && !this._isListLine(startLineNumber - 1)
    ) {
      this.doc.replaceRange('\n', {
        line: startLineNumber,
        ch: 0
      });
      end += 1;
    }

    if (!this._isBlankLine(end + 1)
      && !this._isListLine(end + 1)
    ) {
      this.doc.replaceRange('\n', {
        line: end,
        ch: this.doc.getLine(end).length
      });
    }
  }
}

export default MdListManager;
