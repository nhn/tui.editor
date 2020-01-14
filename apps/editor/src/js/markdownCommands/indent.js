/**
 * @fileoverview Implements Indent markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

import CommandManager from '../commandManager';

/**
 * Indent
 * Add Indent markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/inent
 * @ignore
 */
const Indent = CommandManager.command(
  'markdown',
  /** @lends Indent */ {
    name: 'Indent',
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec(mde) {
      const cm = mde.getEditor();

      cm.execCommand('indentOrderedList');
    }
  }
);

export default Indent;
