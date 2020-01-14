/**
 * @fileoverview Implements OL markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

import CommandManager from '../commandManager';

/**
 * OL
 * Add ordered list markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/OL
 * @ignore
 */
const OL = CommandManager.command(
  'markdown',
  /** @lends OL */ {
    name: 'OL',
    keyMap: ['CTRL+O', 'META+O'],
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec(mde) {
      const range = mde.getCurrentRange();
      const listManager = mde.componentManager.getManager('list');

      listManager.changeSyntax(range, 'ol');
    }
  }
);

export default OL;
