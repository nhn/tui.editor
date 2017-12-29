/**
* @fileoverview Implements Code markdown command
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import CommandManager from '../commandManager';

/**
 * Code
 * Add code markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Code
 * @ignore
 */
const Code = CommandManager.command('markdown', /** @lends Code */{
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
    const range = cm.getCursor();

    doc.replaceSelection(this.append(selection), 'around');

    if (!selection) {
      doc.setCursor(range.line, range.ch + 1);
    }

    cm.focus();
  },
  /**
   * apply Code
   * @param {string} text - selected text
   * @returns {string} - text after code syntax applied
   */
  append(text) {
    return `\`${text}\``;
  }
});

export default Code;
