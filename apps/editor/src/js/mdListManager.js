/**
 * @fileoverview Implements markdown list manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
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
 * @param {MarkdownEditor} mde - MarkdownEditor instance
 * @ignore
 */
class MdListManager {
  constructor(mde) {
    this.cm = mde.getEditor();
    this.doc = this.cm.getDoc();
    this.toastMark = mde.getToastMark();

    /**
     * Name property
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
    return !!FIND_LIST_RX.exec(this.doc.getLine(lineNumber));
  }

  /**
   * If text already have sytax for heading, table and code block,
   * can not change to list.
   * @param {number} lineNumber lineNumber
   * @returns {boolean}
   * @private
   */
  _isCanBeList(lineNumber) {
    const line = this.doc.getLine(lineNumber);

    return !FIND_BLOCK_RX.test(line) && !FIND_TABLE_RX.test(line) && !FIND_HEADING_RX.test(line);
  }

  /**
   * Return a function for change according to type
   * @param {string} type ol, ul, task
   * @returns {Function}
   * @private
   */
  _getChangeFn(type) {
    let fn;

    switch (type) {
      case 'ol':
      case 'ul':
        fn = lineNumber => this._changeToList(lineNumber, type);
        break;
      case 'task':
        fn = lineNumber => this._changeToTask(lineNumber);
        break;
      default:
        break;
    }

    return fn;
  }

  /**
   * Change syntax by traversing each line selected.
   * @param {{from, to}} range start, end CodeMirror range information
   * @param {string} type ol, ul, task
   */
  changeSyntax(range, type) {
    const newListLine = [];
    const lineRange = this._createSortedLineRange(range);
    const { start: startLineNumber, end: endLineNumber } = lineRange;

    const changeFn = this._getChangeFn(type);

    for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber += 1) {
      if (!this._isCanBeList(lineNumber)) {
        break;
      }

      // If text of lineNumber is not list, cache for inserting blank line
      if (!this._isListLine(lineNumber)) {
        newListLine.push(lineNumber);
      }

      changeFn(lineNumber);
    }

    // Should insert blank line before and after new list
    this._insertBlankLineForNewList(newListLine);

    this.cm.focus();
  }

  _replaceLineText(text, lineNumber) {
    this.doc.replaceRange(text, {
      line: lineNumber,
      ch: 0
    });
  }

  /**
   * change to list according to the type.
   * @param {number} lineNumber line number
   * @param {string} type ol, ul
   * @private
   */
  _changeToList(lineNumber, type) {
    if (this._isListLine(lineNumber)) {
      // If type is ol, need ordinal number.
      this._changeSameDepthList(
        lineNumber,
        type === 'ol'
          ? (lineNum, ordinalNumber) => {
              this._replaceListTypeToOL(lineNum, ordinalNumber);
            }
          : lineNum => {
              this._replaceListTypeToUL(lineNum);
            }
      );
    } else {
      this._replaceLineText(
        type === 'ol' ? `${this._calculateOrdinalNumber(lineNumber)}. ` : '* ',
        lineNumber
      );
    }
  }

  /**
   * change to task list according
   * @param {number} lineNumber line number
   * @private
   */
  _changeToTask(lineNumber) {
    if (FIND_TASK_LIST_RX.exec(this.doc.getLine(lineNumber))) {
      this._replaceLineTextByRegexp(lineNumber, TASK_SYNTAX_RX, '$1');
    } else if (this._isListLine(lineNumber)) {
      this._replaceLineTextByRegexp(lineNumber, LIST_SYNTAX_RX, '$1[ ] ');
    } else {
      this._replaceLineText('* [ ] ', lineNumber);
    }
  }

  _getListDepth(lineNumber) {
    let depth = 0;
    const text = this.doc.getLine(lineNumber);

    if (text) {
      let mdNode = this.toastMark.findFirstNodeAtLine(lineNumber + 1);

      while (mdNode && mdNode.type !== 'document') {
        if (mdNode.type === 'list') {
          depth += 1;
        }
        mdNode = mdNode.parent;
      }
    }
    return depth;
  }

  _findSameDepthList(listNumber, depth, isIncrease) {
    const lineCount = this.doc.lineCount();
    const result = [];
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

  /**
   * Find Sampe depth list before and after the line number,
   * and then same depth lines change using replacer function
   * @param {number} lineNumber line number
   * @param {Function} replacer The function should be called with line numbers and ordinal number as arguments.
   * @private
   */
  _changeSameDepthList(lineNumber, replacer) {
    const depth = this._getListDepth(lineNumber);

    const backwardList = this._findSameDepthList(lineNumber, depth, false).reverse();
    const forwardList = this._findSameDepthList(lineNumber, depth, true);
    const sameDepthList = backwardList.concat([lineNumber]).concat(forwardList);

    sameDepthList.forEach((lineNum, i) => {
      replacer(lineNum, i + 1);
    });
  }

  /**
   * Replace text using regular expression
   * @param {number} lineNumber Line number
   * @param {RegExp} regexp Regexp for find list syntax
   * @param {string} replacePattern Replacement string
   * @private
   */
  _replaceLineTextByRegexp(lineNumber, regexp, replacePattern) {
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
      this._replaceLineTextByRegexp(lineNumber, UL_TASK_SYNTAX_RX, '$1 ');
    } else if (OL_SYNTAX_RX.exec(lineText)) {
      this._replaceLineTextByRegexp(lineNumber, OL_SYNTAX_RX, '* ');
    }
  }

  _replaceListTypeToOL(lineNumber, ordinalNumber) {
    const lineText = this.doc.getLine(lineNumber);

    if (FIND_UL_RX.exec(lineText) || FIND_OL_TASK_RX.exec(lineText)) {
      this._replaceLineTextByRegexp(lineNumber, LIST_OR_TASK_SYNTAX_RX, `${ordinalNumber}. `);
    } else if (OL_SYNTAX_RX.exec(lineText)) {
      if (parseInt(RegExp.$1, 10) !== ordinalNumber) {
        this._replaceLineTextByRegexp(lineNumber, OL_SYNTAX_RX, `${ordinalNumber}. `);
      }
    }
  }

  /**
   * The new list must have a blank line before and after.
   * @param {Array} newListLines lines that changed to list
   * @private
   */
  _insertBlankLineForNewList(newListLines) {
    const { length } = newListLines;

    if (length) {
      const [startLineNumber] = newListLines;
      const endLineNumber = newListLines[length - 1];

      if (this._isNotBlankNotListLine(endLineNumber + 1)) {
        this.doc.replaceRange('\n', {
          line: endLineNumber,
          ch: this.doc.getLine(endLineNumber).length
        });
      }

      if (startLineNumber > 0 && this._isNotBlankNotListLine(startLineNumber - 1)) {
        this.doc.replaceRange('\n', {
          line: startLineNumber,
          ch: 0
        });
      }
    }
  }

  _isNotBlankNotListLine(lineNumber) {
    return !!this.doc.getLine(lineNumber) && !this._isListLine(lineNumber);
  }
}

export default MdListManager;
