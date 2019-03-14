/**
 * range expand according to expendSize
 * If can not expand, return null
 * @param {range} range - range
 * @param {number} expendSize - expendSize
 * @returns {object} expanded range or null
 * @ignore
 */
export const getExpandedRange = (range, expendSize) => {
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
 * @param {string} text - text
 * @param {string} symbol - text
 * @returns {string}
 * @ignore
 */
export const removeSyntax = (text, symbol) => {
  const symbolLength = symbol.length;

  return text.substr(symbolLength, text.length - (symbolLength * 2));
};

/**
 * append symbol in the front and back of text
 * @param {string} text - text
 * @param {string} symbol - text
 * @returns {string}
 * @ignore
 */
export const appendSyntax = function(text, symbol) {
  return `${symbol}${text}${symbol}`;
};

const getReplaceText = function(doc, range, symbol, syntaxRegex, contentRegex) {
  const expandedRange = getExpandedRange(range, symbol.length);
  const expandedText = expandedRange ? doc.getRange(expandedRange.from, expandedRange.to) : '';
  const selectionStr = doc.getSelection();
  let replaceText;

  // 1. check text is syntax => remove syntax
  // 2. expand text and check syntax => remove syntax of expanded text
  // 3. text does not match syntax so append syntax
  if (syntaxRegex.test(selectionStr)) {
    replaceText = removeSyntax(selectionStr, symbol);
  } else if (expandedRange) {
    if (syntaxRegex.test(expandedText)) {
      const {from, to} = expandedRange;
      replaceText = removeSyntax(expandedText, symbol);
      doc.setSelection(from, to);
    } else {
      replaceText = selectionStr.replace(contentRegex, '$1');
      replaceText = appendSyntax(replaceText, symbol);
    }
  } else {
    replaceText = selectionStr.replace(contentRegex, '$1');
    replaceText = appendSyntax(replaceText, symbol);
  }

  return replaceText;
};

const getReplaceEmptyText = function(doc, range, symbol) {
  const expandedRange = getExpandedRange(range, symbol.length);
  const expandedText = expandedRange ? doc.getRange(expandedRange.from, expandedRange.to) : '';
  let replaceText;

  // 1. expand range and check expanded text is ${symbol}${symbol} => remove syntax
  // 2. expand text does not match syntax => append syntax and that is {symbol}${symbol}
  if (expandedRange && expandedText === `${symbol}${symbol}`) {
    replaceText = '';
    doc.setSelection(expandedRange.from, expandedRange.to);
  } else {
    replaceText = `${symbol}${symbol}`;
  }

  return replaceText;
};

export const changeSyntax = function(doc, range, symbol, syntaxRegex, contentRegex) {
  const {line, ch} = doc.getCursor();
  const selectionStr = doc.getSelection();
  const symbolLength = symbol.length;
  let replaceText;

  if (selectionStr) {
    replaceText = getReplaceText(doc, range, symbol, syntaxRegex, contentRegex);
  } else {
    replaceText = getReplaceEmptyText(doc, range, symbol);
  }

  doc.replaceSelection(replaceText, 'around');

  if (replaceText === '') {
    doc.setCursor(line, ch - symbolLength);
  } else if (replaceText === `${symbol}${symbol}`) {
    doc.setCursor(line, ch + symbolLength);
  }
};

