/**
 * @fileoverview Implements UL markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';

/**
 * UL
 * Add unordered list markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/UL
 * @ignore
 */
const UL = CommandManager.command(
  'markdown',
  /** @lends UL */ {
    name: 'UL',
    keyMap: ['CTRL+U', 'META+U'],
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec(mde) {
      const range = mde.getCurrentRange();
      const listManager = mde.componentManager.getManager('list');

      listManager.changeSyntax(range, 'ul');
    }
  }
);

export default UL;
