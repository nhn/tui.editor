/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */


import CommandManager from '../commandManager';

/**
 * RemoveTable
 * Remove selected table
 * @exports RemoveTable
 * @augments Command
 * @augments WysiwygCommand
 */
const RemoveTable = CommandManager.command('wysiwyg', /** @lends RemoveTable */{
    name: 'RemoveTable',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec(wwe) {
        const sq = wwe.getEditor();
        const range = sq.getSelection().cloneRange();

        if (sq.hasFormat('TABLE')) {
            sq.saveUndoState(range);
            const $table = $(range.startContainer).closest('table');

            $table.remove();
        }

        sq.focus();
    }
});

module.exports = RemoveTable;
