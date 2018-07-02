/**
 * @fileoverview Implements italic WysiwygCommand
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

import CommandManager from '../commandManager';

/**
 * Italic
 * Add Italic to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Italic
 * @ignore
 */
const Italic = CommandManager.command('wysiwyg', /** @lends Italic */{
  name: 'Italic',
  keyMap: ['CTRL+I', 'META+I'],
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec(wwe) {
    const sq = wwe.getEditor();
    const tableSelectionManager = wwe.componentManager.getManager('tableSelection');

    wwe.focus();

    if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
      tableSelectionManager.styleToSelectedCells(styleItalic);

      const range = sq.getSelection();
      range.collapse(true);
      sq.setSelection(range);
    } else {
      styleItalic(sq);
    }
  }
});

/**
 * Style italic.
 * @param {object} sq - squire editor instance
 */
function styleItalic(sq) {
  if (sq.hasFormat('i') || sq.hasFormat('em')) {
    sq.changeFormat(null, {tag: 'i'});
  } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
    if (sq.hasFormat('code')) {
      sq.changeFormat(null, {tag: 'code'});
    }
    sq.italic();
  }
}

export default Italic;
