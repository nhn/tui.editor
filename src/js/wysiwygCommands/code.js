/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */


import CommandManager from '../commandManager';
import domUtils from '../domUtils';

/**
 * Code
 * Add bold to selected wysiwyg editor content
 * @exports Code
 * @augments Command
 * @augments WysiwygCommand
 */
const Code = CommandManager.command('wysiwyg', /** @lends Code */{
    name: 'Code',
    keyMap: ['SHIFT+CTRL+C', 'SHIFT+META+C'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec(wwe) {
        const sq = wwe.getEditor();
        let range = sq.getSelection();
        const tableSelectionManager = wwe.componentManager.getManager('tableSelection');

        sq.focus();

        if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
            tableSelectionManager.createRangeBySelectedCells();
        }

        if (!sq.hasFormat('PRE') && sq.hasFormat('code')) {
            sq.changeFormat(null, {tag: 'code'});
            removeUnnecessaryCodeInNextToRange(wwe.getEditor().getSelection().cloneRange());
        } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
            if (sq.hasFormat('b')) {
                sq.removeBold();
            } else if (sq.hasFormat('i')) {
                sq.removeItalic();
            }

            sq.changeFormat({tag: 'code'});

            range = sq.getSelection().cloneRange();
            range.setStart(range.endContainer, range.endOffset);
            range.collapse(true);

            sq.setSelection(range);
        }

        if (sq.hasFormat('table') && !domUtils.isTextNode(range.commonAncestorContainer)) {
            range.collapse(true);
            sq.setSelection(range);
        }
    }
});

/**
 * removeUnnecessaryCodeInNextToRange
 * Remove unnecessary code tag next to range, code tag made by squire
 * @param {Range} range range object
 */
function removeUnnecessaryCodeInNextToRange(range) {
    if (domUtils.getNodeName(range.startContainer.nextSibling) === 'CODE'
        && domUtils.getTextLength(range.startContainer.nextSibling) === 0
    ) {
        $(range.startContainer.nextSibling).remove();
    }
}

module.exports = Code;
