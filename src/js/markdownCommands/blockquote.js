/**
* @fileoverview Implements Blockquote markdown command
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import CommandManager from '../commandManager';

/**
 * Blockquote
 * Add blockquote markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Blockquote
 * @ignore
 */
const Blockquote = CommandManager.command('markdown', /** @lends Blockquote */{
  name: 'Blockquote',
  keyMap: ['CTRL+Q', 'META+Q'],
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
    const lineLength = textLinesToModify.length;

    for (let i = 0; i < lineLength; i += 1) {
      textLinesToModify[i] = `>${textLinesToModify[i]}`;
    }

    doc.replaceRange(textLinesToModify.join('\n'), from, to);

    range.to.ch += 1;

    doc.setCursor(range.to);

    cm.focus();
  }
});

export default Blockquote;
