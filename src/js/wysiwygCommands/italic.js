/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */

import CommandManager from '../commandManager';
import domUtils from '../domUtils';

/**
 * Italic
 * Add Italic to selected wysiwyg editor content
 * @exports Italic
 * @augments Command
 * @augments WysiwygCommand
 * @ignore
 */
const Italic = CommandManager.command('wysiwyg', /** @lends Italic */{
    name: 'Italic',
    keyMap: ['CTRL+I', 'META+I'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec(wwe) {
        const sq = wwe.getEditor();
        const range = sq.getSelection();
        const tableSelectionManager = wwe.componentManager.getManager('tableSelection');

        wwe.focus();

        if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
            tableSelectionManager.styleToSelectedCells(styleItalic);
        } else {
            styleItalic(sq);
        }

        if (sq.hasFormat('table') && !domUtils.isTextNode(range.commonAncestorContainer)) {
            range.collapse(true);
            sq.setSelection(range);
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

module.exports = Italic;

