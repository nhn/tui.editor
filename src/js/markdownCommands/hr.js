/**
 * @fileoverview Implements HR markdown command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

import CommandManager from '../commandManager';

/**
 * HR
 * Add HR markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/HR
 * @ignore
 */
const HR = CommandManager.command('markdown', /** @lends HR */{
  name: 'HR',
  keyMap: ['CTRL+L', 'META+L'],
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec(mde) {
    const cm = mde.getEditor();
    const doc = cm.getDoc();
    let replaceText = '';

    const range = mde.getCurrentRange();

    const from = {
      line: range.from.line,
      ch: range.from.ch
    };

    const to = {
      line: range.to.line,
      ch: range.to.ch
    };

    if (range.collapsed) {
      replaceText = doc.getLine(from.line);
      from.ch = 0;
      to.ch = doc.getLineHandle(range.to.line).text.length;
    }

    if (doc.getLine(from.line).length) {
      replaceText += '\n\n* * *\n\n';
    } else {
      replaceText += '\n* * *\n';
    }

    doc.replaceRange(replaceText, from, to);

    cm.focus();
  }
});

export default HR;
