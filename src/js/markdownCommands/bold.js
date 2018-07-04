/**
* @fileoverview Implements Bold markdown command
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import CommandManager from '../commandManager';

const boldRangeRegex = /^[*_]{2,}[^*_]+[*_]{2,}$/;
const boldContentRegex = /[*_]{2,}([^*_]+)[*_]{2,}/g;

/**
 * Bold
 * Add bold markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Bold
 * @ignore
 */
const Bold = CommandManager.command('markdown', /** @lends Bold */{
  name: 'Bold',
  keyMap: ['CTRL+B', 'META+B'],
  /**
   * Command Handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec(mde) {
    const cm = mde.getEditor();
    const doc = cm.getDoc();

    const cursor = doc.getCursor();
    let selection = doc.getSelection();
    const isEmpty = !selection;

    // if selection is empty, expend selection to detect a syntax
    if (isEmpty && cursor.ch > 1) {
      const tmpSelection = this.expendSelection(doc, cursor);
      selection = tmpSelection || selection;
    }

    const isRemoved = this.isNeedRemove(selection);
    let result;
    if (isRemoved) {
      result = this.remove(selection);
      result = this._removeBoldSyntax(result);
    } else {
      result = this._removeBoldSyntax(selection);
      result = this.append(result);
    }

    doc.replaceSelection(result, 'around');

    if (isEmpty && !isRemoved) {
      this.setCursorToCenter(doc, cursor);
    }

    cm.focus();
  },

  /**
   * test it has bold
   * @param {string} text - text selected
   * @returns {boolean} - true if it has bold
   */
  isNeedRemove(text) {
    return boldRangeRegex.test(text);
  },

  /**
   * apply bold
   * @param {string} text - text selected
   * @returns {string} - bold text
   */
  append(text) {
    return `**${text}**`;
  },

  /**
   * remove bold
   * @param {string} text - text selected
   * @returns {string} - un-bold text
   */
  remove(text) {
    return text.substr(2, text.length - 4);
  },

  /**
   * expand selection
   * @param {CodeMirror.doc} doc - codemirror document
   * @param {object} cursor - codemirror cursor
   * @returns {string} - text selected
   */
  expendSelection(doc, cursor) {
    const tmpSelection = doc.getSelection();
    let result;
    const start = {
      line: cursor.line,
      ch: cursor.ch - 2
    };
    const end = {
      line: cursor.line,
      ch: cursor.ch + 2
    };

    doc.setSelection(start, end);

    if (tmpSelection === '****' || tmpSelection === '____') {
      result = tmpSelection;
    } else {
      doc.setSelection(cursor);
    }

    return result;
  },

  /**
   * move cursor to center
   * @param {CodeMirror.doc} doc - codemirror document
   * @param {object} cursor - codemirror cursor
   */
  setCursorToCenter(doc, cursor) {
    doc.setCursor(cursor.line, cursor.ch + 2);
  },

  /**
   * remove bold syntax in the middle of given text
   * @param {string} text - text selected
   * @returns {string} - text eliminated all bold in the middle of it's content
   * @private
   */
  _removeBoldSyntax(text) {
    return text ? text.replace(boldContentRegex, '$1') : '';
  }
});

export default Bold;
