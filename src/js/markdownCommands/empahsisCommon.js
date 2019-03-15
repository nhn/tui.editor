/**
 * range expend according to expendSize
 * If can not expend, return null
 * @param {range} range - range
 * @param {number} expendSize - text
 * @returns {object} expended range or null
 * @private
 */
const getExpendRange = function(range, expendSize) {
  const {start, end} = range;
  let expendRange;

  if (start.ch >= expendSize) {
    const from = {
      line: start.line,
      ch: start.ch - expendSize
    };
    const to = {
      line: end.line,
      ch: end.ch + expendSize
    };

    expendRange = {
      from,
      to
    };
  }

  return expendRange;
};

/**
 * remove symbol in the front and back of text
 * If there is contentRegx, remove symbol syntax inside text before remove symbol in the font and back text.
 * @param {string} text - text
 * @param {string} symbol - text
 * @param {RegExp} contentRegx - text
 * @returns {string}
 * @private
 */
const removeSyntax = function(text, symbol, contentRegx) {
  const symbolLength = symbol.length;

  let result = text.substr(symbolLength, text.length - (symbolLength * 2));
  result = contentRegx ? result.replace(contentRegx, '$1') : result;

  return result;
};

/**
 * append symbol in the front and back of text
 * If there is contentRegx, remove symbol syntax inside text and append symbol
 * @param {string} text - text
 * @param {string} symbol - text
 * @param {RegExp} contentRegx - text
 * @returns {string}
 * @private
 */
const appendSyntax = function(text, symbol, contentRegx) {
  return `${symbol}${contentRegx ? text.replace(contentRegx, '$1') : text}${symbol}`;
};

/**
 * Return function that check text function using regx
 * @param {RegExp} regx - text
 * @returns {function} - check text function using regx
 * @private
 */
const getSyntaxChecker = (regx) => (text) => regx.test(text);

/**
 * Return function that check text and then replace text using replacer
 * @param {string} text - text
 * @returns {function} - get sytanx chack function and text replace function as parameter
 * and then return replaced text. If replace text is '', check is not correct.
 * @private
 */
const getTextChecker = (text) => {
  return (checker, replacer) => {
    let result;

    if (checker(text)) {
      result = () => replacer(text);
    }

    return result;
  };
};

/**
 * Return function that check expended text and replace text using replacer
 * @param {CodeMirror.doc} doc - doc of codemirror
 * @param {range} range - origin range
 * @returns {function} - get expendSize, sytanx chack function and text replace function as parameter
 * and then return replaced text. If replace text is '', expend or check is not correct.
 * @private
 */
const getExpendTextChecker = (doc, range) => {
  return (expendSize, checker, replacer) => {
    const expendRange = getExpendRange(range, expendSize);
    let result;

    if (expendRange) {
      const {from, to} = expendRange;
      const expendRangeText = doc.getRange(from, to);
      if (checker(expendRangeText)) {
        doc.setSelection(from, to);
        result = () => replacer(expendRangeText);
      }
    }

    return result;
  };
};

/**
 * Return function that check expended text and replace text using replacer
 * @param {CodeMirror.doc} doc - doc of codemirror
 * @returns {function} - get text(would be replace) or replacer(function)
 * and replace current selection and then return replaced text
 * @private
 */
const getReplacer = doc => t => {
  let replaceText;
  if (typeof t === 'string') {
    replaceText = t;
    doc.replaceSelection(replaceText, 'around');
  } else if (typeof t === 'function') {
    replaceText = t();
    doc.replaceSelection(replaceText, 'around');
  }

  return replaceText;
};

const getCursorMover = (doc, cursor) => (size) => {
  doc.setCursor(cursor.line, cursor.ch + size);
};

const changeSyntax = function(mde, symbol, syntaxRegx, contentRegx) {
  const cm = mde.getEditor();
  const doc = cm.getDoc();
  const originalCursor = doc.getCursor();
  const symbolLength = symbol.length;
  const selectionStr = doc.getSelection();

  const isSyntax = getSyntaxChecker(syntaxRegx);
  const checkExpendText = getExpendTextChecker(doc, mde.getRange());
  const replace = getReplacer(doc);

  if (selectionStr) {
    // When text is selected,
    // 1. check text is syntax => remove syntax
    // 2. expend text and check syntax => remove syntax of expended text
    // 3. text does not match syntax so append syntax
    const textChecker = getTextChecker(selectionStr);
    replace(
      textChecker(isSyntax, () => removeSyntax(selectionStr, symbol))
      || checkExpendText(symbolLength, isSyntax, t => removeSyntax(t, symbol, contentRegx))
      || appendSyntax(selectionStr, symbol, contentRegx));
  } else {
    // When text is not selected,
    // 1. expend selection and check syntax => remove syntax of expended selection
    // 2. current cursor does not match syntax so append syntax
    const result = replace(
      checkExpendText(symbolLength, isSyntax, t => removeSyntax(t, symbol))
      || appendSyntax(selectionStr, symbol));

    // move cursor according to symbol length
    const cursorMover = getCursorMover(doc, originalCursor);
    cursorMover(result ? symbolLength : -symbolLength);
  }

  cm.focus();
};

export default {
  getExpendRange,
  removeSyntax,
  appendSyntax,
  getSyntaxChecker,
  getTextChecker,
  getExpendTextChecker,
  getReplacer,
  getCursorMover,
  changeSyntax
};

