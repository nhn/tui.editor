/**
 * @fileoverview Implements Outdent markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

import CommandManager from '../commandManager';

/**
 * Outdent
 * Add Outdent markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/outdent
 * @ignore
 */
const Outdent = CommandManager.command(
  'markdown',
  /** @lends Outdent */ {
    name: 'Outdent',
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec(mde) {
      const cm = mde.getEditor();

      cm.execCommand('indentLessOrderedList');
    }
  }
);

export default Outdent;
