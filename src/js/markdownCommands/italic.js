/**
 * @fileoverview Implements Italic markdown command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CommandManager from '../commandManager';
import {
  getExpandedRange,
  removeSyntax,
  appendSyntax
} from './empahsisCommon';

const boldItalicRangeRegex = /^(\*|_){3}[^\1]+\1{3}$/;
const boldRangeRegex = /^(\*|_){2}.*\1{2}$/;
const italicRangeRegex = /^(\*|_).*\1$/;
const italicContentRegex = /([^*_])[*_]([^*_]+)[*_]([^*_])/g;
const symbol = '*';
const symbolLength = symbol.length;

const isBoldItalic = t => boldItalicRangeRegex.test(t);
const isBold = t => boldRangeRegex.test(t);
const isItalic = t => italicRangeRegex.test(t);

/**
 * remove italic syntax in the middle of given text
 * @param {string} text - text selected
 * @returns {string} - text eliminated all italic in the middle of it's content
 * @ignore
 */
const removeItalicInsideText = function(text) {
  return text ? text.replace(italicContentRegex, '$1$2$3') : '';
};

/**
 * check expanded text and replace text using replacer
 * @param {CodeMirror.doc} doc - doc of codemirror
 * @param {range} range - origin range
 * @param {number} expandSize - expandSize
 * @param {function} checker - sytax check function
 * @param {function} replacer - text replace function
 * @returns {boolean} - if replace text, return true.
 * @ignore
 */
const getExpandReplacer = function(doc, range, expandSize, checker, replacer) {
  const expendRange = getExpandedRange(range, expandSize);
  let result = false;

  if (expendRange) {
    const {from, to} = expendRange;
    const expendRangeText = doc.getRange(from, to);
    if (checker(expendRangeText)) {
      doc.setSelection(from, to);
      doc.replaceSelection(replacer(expendRangeText), 'around');
      result = true;
    }
  }

  return result;
};

/**
 * check text and replace text using replacer
 * @param {CodeMirror.doc} doc - doc of codemirror
 * @param {string} text - text
 * @param {function} checker - sytax check function
 * @param {function} replacer - text replace function
 * @returns {boolean} - if replace text, return true.
 * @ignore
 */
const getReplacer = function(doc, text, checker, replacer) {
  let result = false;

  if (checker(text)) {
    doc.replaceSelection(replacer(text), 'around');
    result = true;
  }

  return result;
};

const getTextReplacer = function(doc, text, range) {
  // Check 3 cases when both text and expand text
  // case 1 : bold & italic (when expand 3 both front and end) => remove italic
  // case 2 : bold (when expand 2 both front and end) => append
  // case 3 : italic (expand 1 both front and end) => remove
  // const expandTextChecker = this.getExpandTextChecker(doc, originRange);
  // const textChecker = this.getTextChecker(text);
  return getExpandReplacer(doc, range, 3, isBoldItalic, t => removeSyntax(t, symbol))
        || getExpandReplacer(doc, range, 2, isBold, t => appendSyntax(removeItalicInsideText(t), symbol))
        || getExpandReplacer(doc, range, 1, isItalic, t => removeSyntax(t, symbol))
        || getReplacer(doc, text, isBoldItalic, t => removeSyntax(t, symbol))
        || getReplacer(doc, text, isBold, t => appendSyntax(removeItalicInsideText(t), symbol))
        || getReplacer(doc, text, isItalic, t => removeSyntax(t, symbol));
};

const getEmptyReplacer = function(doc, range) {
  // Check 3 cases when expand text
  // case 1 : bold & italic => remove italic
  // case 2 : bold => append
  // case 3 : italic => remove
  return getExpandReplacer(doc, range, 3, t => t === '******' || t === '______', t => removeSyntax(t, symbol))
        || getExpandReplacer(doc, range, 2, t => t === '****' || t === '____', t => appendSyntax(t, symbol))
        || getExpandReplacer(doc, range, 1, t => t === '**' || t === '__', () => '');
};

/**
 * Italic
 * Add italic markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Italic
 * @ignore
 */
const Italic = CommandManager.command('markdown', /** @lends Italic */{
  name: 'Italic',
  keyMap: ['CTRL+I', 'META+I'],
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec(mde) {
    const cm = mde.getEditor();
    const doc = cm.getDoc();
    const {line, ch} = doc.getCursor();
    const range = mde.getRange();
    const selectionStr = doc.getSelection();

    if (selectionStr) {
      // check selectionStr match bold & italic, bold, italic and then
      // if there is no match, append italic
      if (!getTextReplacer(doc, selectionStr, range)) {
        // Before append italic, remove italic inside text and then append italic
        // Example: One*Two*Three => *OneTwoThree*
        const replaceText = appendSyntax(removeItalicInsideText(selectionStr), symbol);
        doc.replaceSelection(replaceText, 'around');
      }
    } else {
      // check expanded text match bold & italic, bold, italic and then
      // if there is no match, make italic
      if (!getEmptyReplacer(doc, range)) {
        doc.replaceSelection('**', 'around');
      }

      const afterSelectStr = doc.getSelection();
      doc.setCursor(line, afterSelectStr ? ch - symbolLength : ch + symbolLength);
    }

    cm.focus();
  }
});

export default Italic;
