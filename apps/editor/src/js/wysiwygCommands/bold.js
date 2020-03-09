/**
 * @fileoverview Implements bold WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';
import domUtils from '../utils/dom';

/**
 * Bold
 * Add bold to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Bold
 * @ignore
 */
const Bold = CommandManager.command(
  'wysiwyg',
  /** @lends Bold */ {
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

        const range = sq.getSelection();

        range.collapse(true);
        sq.setSelection(range);
      } else {
        styleBold(sq);
        domUtils.optimizeRange(sq.getSelection(), 'B');
      }
    }
  }
);

/**
 * Style bold.
 * @param {object} sq - squire editor instance
 */
function styleBold(sq) {
  if (sq.hasFormat('b') || sq.hasFormat('strong')) {
    sq.changeFormat(null, { tag: 'b' });
  } else if (!sq.hasFormat('PRE')) {
    if (sq.hasFormat('code')) {
      sq.changeFormat(null, { tag: 'code' });
    }
    sq.bold();
  }
}

export default Bold;
