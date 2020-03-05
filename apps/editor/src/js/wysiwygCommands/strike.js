/**
 * @fileoverview Implements strike WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

import CommandManager from '../commandManager';
import domUtils from '../utils/dom';

/**
 * Strike
 * Add strike to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Strike
 * @ignore
 */
const Strike = CommandManager.command(
  'wysiwyg',
  /** @lends Strike */ {
    name: 'Strike',
    keyMap: ['CTRL+S', 'META+S'],
    /**
     * command handler
     * @param {WysiwygEditor} wwe WysiwygEditor instance
     */
    exec(wwe) {
      const sq = wwe.getEditor();
      const tableSelectionManager = wwe.componentManager.getManager('tableSelection');

      wwe.focus();

      if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
        tableSelectionManager.styleToSelectedCells(styleStrike);

        const range = sq.getSelection();

        range.collapse(true);
        sq.setSelection(range);
      } else {
        styleStrike(sq);
        domUtils.optimizeRange(sq.getSelection(), 'S');
      }
    }
  }
);

/**
 * Style strike.
 * @param {object} sq - squire editor instance
 */
function styleStrike(sq) {
  if (sq.hasFormat('S')) {
    sq.changeFormat(null, { tag: 'S' });
  } else if (!sq.hasFormat('PRE')) {
    if (sq.hasFormat('code')) {
      sq.changeFormat(null, { tag: 'code' });
    }
    sq.strikethrough();
  }
}

export default Strike;
