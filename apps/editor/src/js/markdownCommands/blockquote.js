/**
 * @fileoverview Implements Blockquote markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';

const BlockquoteRegex = /^> ?/;

/**
 * Blockquote
 * Add blockquote markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Blockquote
 * @ignore
 */
const Blockquote = CommandManager.command(
  'markdown',
  /** @lends Blockquote */ {
    name: 'Blockquote',
    keyMap: ['ALT+Q', 'ALT+Q'],
    /**
     * command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec(mde) {
      const cm = mde.getEditor();
      const doc = cm.getDoc();

      const range = mde.getCurrentRange();

      const from = {
        line: range.from.line,
        ch: 0
      };

      const to = {
        line: range.to.line,
        ch: doc.getLineHandle(range.to.line).text.length
      };

      const textToModify = doc.getRange(from, to);
      const textLinesToModify = textToModify.split('\n');
      const isNeedToRemove = this._haveBlockquote(textLinesToModify);
      let resultText;

      if (isNeedToRemove) {
        resultText = this._removeBlockquote(textLinesToModify);
      } else {
        resultText = this._addBlockquote(textLinesToModify);
      }

      doc.replaceRange(resultText.join('\n'), from, to);

      if (isNeedToRemove) {
        const { length } = textLinesToModify;

        if (this._isBlockquoteWithSpace(textLinesToModify[length - 1])) {
          range.to.ch -= 2;
        } else {
          range.to.ch -= 1;
        }
      } else {
        range.to.ch += 2;
      }

      doc.setCursor(range.to);

      cm.focus();
    },

    /**
     * check all text in textArr starts with '>'
     * @param {Array} textArr - text array
     * @returns {boolean} - true if all text in textArr starts with '>'
     * @private
     */
    _haveBlockquote(textArr) {
      for (let i = 0; i < textArr.length; i += 1) {
        if (!BlockquoteRegex.test(textArr[i])) {
          return false;
        }
      }

      return true;
    },

    /**
     * add '> ' to all text in textArr
     * @param {Array} textArr - text array
     * @returns {Array} - new text array added '> '
     * @private
     */
    _addBlockquote(textArr) {
      return textArr.map(text => `> ${text}`);
    },

    /**
     * remove '> ' or '>' to all text in textArr
     * @param {Array} textArr - text array
     * @returns {Array} - new text array removed '> ' or  '>'
     * @private
     */
    _removeBlockquote(textArr) {
      return textArr.map(text => text.replace(BlockquoteRegex, ''));
    },

    /**
     * check text start '> '
     * @param {string} text - text
     * @returns {boolean} - if text start '> ', true
     * @private
     */
    _isBlockquoteWithSpace(text) {
      return /^> /.test(text);
    }
  }
);

export default Blockquote;
