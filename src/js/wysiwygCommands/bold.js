/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
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
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
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

module.exports = Bold;

