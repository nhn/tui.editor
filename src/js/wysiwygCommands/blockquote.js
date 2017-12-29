/**
 * @fileoverview Implements block quote WysiwygCommand
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

import CommandManager from '../commandManager';

/**
 * Blockquote
 * Add Blockquote to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Blockquote
 * @ignore
 */
const Blockquote = CommandManager.command('wysiwyg', /** @lends Blockquote */{
  name: 'Blockquote',
  keyMap: ['CTRL+Q', 'META+Q'],
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec(wwe) {
    const sq = wwe.getEditor();

    wwe.focus();

    if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
      wwe.unwrapBlockTag();
      sq.increaseQuoteLevel();
    }
  }
});

export default Blockquote;
