/**
 * @fileoverview Implements WysiwygCommand
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */


import CommandManager from '../commandManager';
import domUtils from '../domUtils';

/**
 * Strike
 * Add strike to selected wysiwyg editor content
 * @exports Strike
 * @augments Command
 * @augments WysiwygCommand
 * @ignore
 */
const Strike = CommandManager.command('wysiwyg', /** @lends Strike */{
    name: 'Strike',
    keyMap: ['CTRL+S', 'META+S'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WysiwygEditor instance
     */
    exec(wwe) {
        const sq = wwe.getEditor();
        const range = sq.getSelection();
        const tableSelectionManager = wwe.componentManager.getManager('tableSelection');

        sq.focus();

        if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
            tableSelectionManager.styleToSelectedCells(styleStrike);
        } else {
            styleStrike(sq);
        }

        if (sq.hasFormat('table') && !domUtils.isTextNode(range.commonAncestorContainer)) {
            range.collapse(true);
            sq.setSelection(range);
        }
    }
});

/**
 * Style strike.
 * @param {object} sq - squire editor instance
 */
function styleStrike(sq) {
    if (sq.hasFormat('S')) {
        sq.changeFormat(null, {tag: 'S'});
    } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
        if (sq.hasFormat('code')) {
            sq.changeFormat(null, {tag: 'code'});
        }
        sq.strikethrough();
    }
}

module.exports = Strike;

