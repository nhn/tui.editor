/**
* @fileoverview Implements Blockquote markdown command
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import CommandManager from '../commandManager';

const BlockquoteStr = '>';

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
    let textLinesToModify = textToModify.split('\n');
    const isNeedToRemove = this.haveBlockquote(textLinesToModify);

    if (isNeedToRemove) {
      textLinesToModify = this.removeBlockquote(textLinesToModify);
    } else {
      textLinesToModify = this.addBlockquote(textLinesToModify);
    }

    doc.replaceRange(textLinesToModify.join('\n'), from, to);

    range.to.ch += 1;

    doc.setCursor(range.to);

    cm.focus();
  },

  haveBlockquote(textArr) {
    for (let i = 0; i < textArr.length; i += 1) {
      if (!textArr[i].startsWith(BlockquoteStr)) {
        return false;
      }
    }

    return true;
  },

  addBlockquote(textArr) {
    return textArr.map(text => `>${text}`);
  },

  removeBlockquote(textArr) {
    return textArr.map(text => text.slice(1, text.length));
  }
});

export default Blockquote;
