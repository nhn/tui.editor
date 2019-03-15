/**
 * @fileoverview Implements Italic markdown command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CommandManager from '../commandManager';
import common from './empahsisCommon';

const boldItalicRangeRegex = /^(\*|_){3}[^\1]+\1{3}$/;
const boldRangeRegex = /^(\*|_){2}.*\1{2}$/;
const italicRangeRegex = /^(\*|_).*\1$/;
const italicContentRegex = /([^*_])[*_]([^*_]+)[*_]([^*_])/g;
const symbol = '*';

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
    const cursor = doc.getCursor();
    const originRange = mde.getRange();
    const selectionStr = doc.getSelection();
    const symbolLength = symbol.length;

    const {
      getReplacer,
      appendSyntax,
      getCursorMover
    } = common;

    const replace = getReplacer(doc);

    if (selectionStr) {
      // check selectionStr match bold & italic, bold, italic and then
      // if there is no match, append italic
      replace(
        this.getTextReplacer(doc, selectionStr, originRange)
        || appendSyntax(this.removeItalic(selectionStr), symbol));
    } else {
      // check expended text match bold & italic, bold, italic and then
      // if there is no match, make italic
      const result = replace(
        this.getEmptyReplacer(doc, originRange)
        || '**');

      // move cursor according to symbol length
      const cursorMover = getCursorMover(doc, cursor);
      cursorMover(result ? symbolLength : -symbolLength);
    }

    cm.focus();
  },

  getTextReplacer(doc, text, originRange) {
    // Check 3 cases when both text and expend text
    // case 1 : bold & italic (when expend 3 both front and end) => remove italic
    // case 2 : bold (when expend 2 both front and end) => append
    // case 3 : italic (expend 1 both front and end) => remove
    const {
      getExpendTextChecker,
      getSyntaxChecker,
      getTextChecker,
      appendSyntax,
      removeSyntax
    } = common;

    const getExpendReplacer = getExpendTextChecker(doc, originRange);
    const getReplacer = getTextChecker(text);
    const isBoldItalic = getSyntaxChecker(boldItalicRangeRegex);
    const isBold = getSyntaxChecker(boldRangeRegex);
    const isItalic = getSyntaxChecker(italicRangeRegex);

    const remover = t => removeSyntax(t, symbol);

    return getExpendReplacer(3, isBoldItalic, remover)
        || getExpendReplacer(2, isBold, () => appendSyntax(this.removeItalic(text), '***'))
        || getExpendReplacer(1, isItalic, remover)
        || getReplacer(isBoldItalic, remover)
        || getReplacer(isBold, t => appendSyntax(t, symbol))
        || getReplacer(isItalic, remover);
  },

  getEmptyReplacer(doc, originRange) {
    // Check 3 cases when expend text
    // case 1 : bold & italic => remove italic
    // case 2 : bold => append
    // case 3 : italic => remove
    const {
      getExpendTextChecker,
      appendSyntax,
      removeSyntax
    } = common;

    const getExpendReplacer = getExpendTextChecker(doc, originRange);

    return getExpendReplacer(3, t => t === '******' || t === '______', t => removeSyntax(t, symbol))
        || getExpendReplacer(2, t => t === '****' || t === '____', t => appendSyntax(t, symbol))
        || getExpendReplacer(1, t => t === '**' || t === '__', () => '');
  },

  /**
   * remove italic syntax in the middle of given text
   * @param {string} text - text selected
   * @returns {string} - text eliminated all italic in the middle of it's content
   * @private
   */
  removeItalic(text) {
    return text ? text.replace(italicContentRegex, '$1$2$3') : '';
  }
});

export default Italic;
