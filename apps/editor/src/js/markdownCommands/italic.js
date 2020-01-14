/**
 * @fileoverview Implements Italic markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';
import { removeSyntax, appendSyntax, expandReplace, replace } from './emphasisCommon';

const boldItalicRangeRegex = /^(\*{3}|_{3}).*\1$/;
const boldRangeRegex = /^(\*{2}|_{2}).*\1$/;
const italicRangeRegex = /^(\*|_).*\1$/;
const italicContentRegex = /([^*_])[*_]([^*_]+)[*_]([^*_])/g;

const isBoldItalic = t => boldItalicRangeRegex.test(t);
const isBold = t => boldRangeRegex.test(t);
const isItalic = t => italicRangeRegex.test(t);

const italicSymbol = '*';
const boldSymbol = '**';
const boldItalicSymbol = '***';
const italicLength = italicSymbol.length;
const boldLength = boldSymbol.length;
const boldItalicLength = boldItalicSymbol.length;

/**
 * remove italic syntax in the middle of given text
 * @param {string} text - text selected
 * @returns {string} - text eliminated all italic in the middle of it's content
 * @ignore
 */
const removeItalicInsideText = function(text) {
  return text ? text.replace(italicContentRegex, '$1$2$3') : '';
};

const replaceText = function(doc, text, range) {
  // Check 3 cases when both text and expand text
  // case 1 : bold & italic (when expand 3 both front and end) => remove italic
  // case 2 : bold (when expand 2 both front and end) => append
  // case 3 : italic (expand 1 both front and end) => remove
  const expandReplaceBind = expandReplace.bind(this, doc, range);

  return (
    expandReplaceBind(boldItalicLength, isBoldItalic, t => removeSyntax(t, italicSymbol)) ||
    expandReplaceBind(boldLength, isBold, t =>
      appendSyntax(removeItalicInsideText(t), italicSymbol)
    ) ||
    expandReplaceBind(italicLength, isItalic, t => removeSyntax(t, italicSymbol)) ||
    replace(doc, text, isBoldItalic, t => removeSyntax(t, italicSymbol)) ||
    replace(doc, text, isBold, t => appendSyntax(removeItalicInsideText(t), italicSymbol)) ||
    replace(doc, text, isItalic, t => removeSyntax(t, italicSymbol))
  );
};

const replaceEmptyText = function(doc, range) {
  // Check 3 cases when expand text
  // case 1 : bold & italic => remove italic
  // case 2 : bold => append
  // case 3 : italic => remove
  // if there is no match, make italic
  return (
    expandReplace(doc, range, boldItalicLength, isBoldItalic, t => removeSyntax(t, italicSymbol)) ||
    expandReplace(doc, range, boldLength, isBold, t => appendSyntax(t, italicSymbol)) ||
    expandReplace(doc, range, italicLength, isItalic, () => '') ||
    doc.replaceSelection(`${italicSymbol}${italicSymbol}`, 'around')
  );
};

/**
 * Italic
 * Add italic markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Italic
 * @ignore
 */
const Italic = CommandManager.command(
  'markdown',
  /** @lends Italic */ {
    name: 'Italic',
    keyMap: ['CTRL+I', 'META+I'],
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec(mde) {
      const cm = mde.getEditor();
      const doc = cm.getDoc();
      const { line, ch } = doc.getCursor();
      const range = mde.getRange();
      const selectionStr = doc.getSelection();

      if (selectionStr) {
        // check selectionStr match bold & italic, bold, italic and then
        // if there is no match, append italic
        if (!replaceText(doc, selectionStr, range)) {
          // Before append italic, remove italic inside text and then append italic
          // Example: One*Two*Three => *OneTwoThree*
          doc.replaceSelection(
            appendSyntax(removeItalicInsideText(selectionStr), italicSymbol),
            'around'
          );
        }
      } else {
        replaceEmptyText(doc, range);

        const afterSelectStr = doc.getSelection();
        let size = ch;

        // If text was not selected, after replace text, move cursor
        if (isBoldItalic(afterSelectStr) || (isItalic(afterSelectStr) && !isBold(afterSelectStr))) {
          // For example **|** => ***|*** (move cusor +symbolLenth)
          size += italicLength;
        } else {
          // For example *|* => | (move cusor -symbolLenth)
          size -= italicLength;
        }

        doc.setCursor(line, size);
      }

      cm.focus();
    }
  }
);

export default Italic;
