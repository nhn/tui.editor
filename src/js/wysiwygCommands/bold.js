/**
 * @fileoverview Implements bold WysiwygCommand
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CommandManager from '../commandManager';
import domUtils from '../domUtils';

/**
 * Bold
 * Add bold to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Bold
 * @ignore
 */
const Bold = CommandManager.command('wysiwyg', /** @lends Bold */{
  name: 'Bold',
  keyMap: ['CTRL+B', 'META+B'],
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec(wwe) {
    const sq = wwe.getEditor();
    const tableSelectionManager = wwe.componentManager.getManager('tableSelection');

    wwe.focus();

    if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
      tableSelectionManager.styleToSelectedCells(styleBold);
    } else {
      styleBold(sq);
    }

    const range = sq.getSelection();
    if (sq.hasFormat('table') && !domUtils.isTextNode(range.commonAncestorContainer)) {
      range.collapse(true);
      sq.setSelection(range);
    }
  }
});

/**
 * Style bold.
 * @param {object} sq - squire editor instance
 */
function styleBold(sq) {
  if (sq.hasFormat('b') || sq.hasFormat('strong')) {
    sq.changeFormat(null, {tag: 'b'});
  } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
    if (sq.hasFormat('code')) {
      sq.changeFormat(null, {tag: 'code'});
    }
    sq.bold();
  }
}

export default Bold;

