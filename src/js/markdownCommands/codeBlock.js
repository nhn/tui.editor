/**
 * @fileoverview Implements CodeBlock markdown command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CommandManager from '../commandManager';

/**
 * CodeBlock
 * Add CodeBlock markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/CodeBlock
 * @ignore
 */
const CodeBlock = CommandManager.command('markdown', /** @lends CodeBlock */{
  name: 'CodeBlock',
  keyMap: ['SHIFT+CTRL+P', 'SHIFT+META+P'],
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec(mde) {
    const cm = mde.getEditor();
    const doc = cm.getDoc();
    const range = mde.getCurrentRange();
    const replaceText = [
      '```',
      doc.getSelection(),
      '```'
    ];
    let cursorOffset = 1;
    // insert a line break to the front if the selection starts in the middle of a text
    if (range.from.ch !== 0) {
      replaceText.unshift('');
      cursorOffset += 1;
    }
    // insert a line break to the end if the selection has trailing text
    if (range.to.ch !== doc.getLine(range.to.line).length) {
      replaceText.push('');
    }
    doc.replaceSelection(replaceText.join('\n'));

    cm.setCursor(range.from.line + cursorOffset, 0);

    cm.focus();
  }
});

export default CodeBlock;
