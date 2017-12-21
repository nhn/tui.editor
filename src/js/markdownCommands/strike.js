/**
 * @fileoverview Implements StrikeThrough markdown command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CommandManager from '../commandManager';

const strikeRegex = /^[~~](.*[\s\n]*.*)*[~~]$/;

/**
 * Strike
 * Add strike markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Strike
 * @ignore
 */
const Strike = CommandManager.command('markdown', /** @lends Strike */{
  name: 'Strike',
  keyMap: ['CTRL+S', 'META+S'],
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec(mde) {
    const cm = mde.getEditor();
    const doc = cm.getDoc();
    const cursor = doc.getCursor();
    const selection = doc.getSelection();
    const isNeedToRemove = this.hasStrikeSyntax(selection);

    let result;

    if (isNeedToRemove) {
      result = this.remove(selection);
    } else {
      result = this.append(selection);
    }

    doc.replaceSelection(result, 'around');

    const isEmptySelection = !selection;

    if (isEmptySelection && !isNeedToRemove) {
      this.setCursorToCenter(doc, cursor, isNeedToRemove);
    }

    cm.focus();
  },

  /**
   * hasStrikeSyntax
   * @param {string} text Source text
   * @returns {boolean} Boolean value of strike syntax removal
   */
  hasStrikeSyntax(text) {
    return strikeRegex.test(text);
  },

  /**
   * append strike
   * @param {string} text - text to apply
   * @returns {string} - strike through text
   */
  append(text) {
    return `~~${text}~~`;
  },

  /**
   * remove strike
   * @param {string} text - text to remove
   * @returns {string} - strike removed text
   */
  remove(text) {
    return text.substr(2, text.length - 4);
  },

  /**
   * set cursor to center
   * @param {CodeMirror.doc} doc - codemirror document
   * @param {object} cursor - codemirror cursor
   * @param {boolean} isRemoved - whether it involes deletion
   */
  setCursorToCenter(doc, cursor, isRemoved) {
    const pos = isRemoved ? -2 : 2;
    doc.setCursor(cursor.line, cursor.ch + pos);
  }
});

export default Strike;
