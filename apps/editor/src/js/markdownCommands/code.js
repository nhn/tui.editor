/**
 * @fileoverview Implements Code markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';

const codeRangeRegex = /^`([^`]+)`$/;
const codeContentRegex = /`([^`]+)`/g;

/**
 * Code
 * Add code markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Code
 * @ignore
 */
const Code = CommandManager.command(
  'markdown',
  /** @lends Code */ {
    name: 'Code',
    keyMap: ['SHIFT+CTRL+C', 'SHIFT+META+C'],
    /**
     * Command Handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec(mde) {
      const cm = mde.getEditor();
      const doc = cm.getDoc();
      const selection = doc.getSelection();
      const cursor = cm.getCursor();
      const hasSyntax = this.hasStrikeSyntax(selection);

      let result;

      if (hasSyntax) {
        result = this.remove(selection);
        result = this._removeCodeSyntax(result);
      } else {
        result = this._removeCodeSyntax(selection);
        result = this.append(result);
      }

      doc.replaceSelection(result, 'around');

      if (!selection && !hasSyntax) {
        this.setCursorToCenter(doc, cursor, hasSyntax);
      }

      cm.focus();
    },

    /**
     * set cursor to center
     * @param {CodeMirror.doc} doc - codemirror document
     * @param {object} cursor - codemirror cursor
     * @param {boolean} isRemoved - whether it involes deletion
     */
    setCursorToCenter(doc, cursor, isRemoved) {
      const pos = isRemoved ? -1 : 1;

      doc.setCursor(cursor.line, cursor.ch + pos);
    },

    /**
     * has code syntax
     * @param {string} text Source text
     * @returns {boolean} true if the given text has a code syntax
     */
    hasStrikeSyntax(text) {
      return codeRangeRegex.test(text);
    },

    /**
     * apply Code
     * @param {string} text - selected text
     * @returns {string} - text after code syntax applied
     */
    append(text) {
      return `\`${text}\``;
    },

    /**
     * remove Code
     * @param {string} text - selected text
     * @returns {string} - text after code syntax removed
     */
    remove(text) {
      return text.substr(1, text.length - 2);
    },

    /**
     * remove bold syntax in the middle of given text
     * @param {string} text - text selected
     * @returns {string} - text eliminated all code in the middle of it's content
     * @private
     */
    _removeCodeSyntax(text) {
      return text ? text.replace(codeContentRegex, '$1') : '';
    }
  }
);

export default Code;
