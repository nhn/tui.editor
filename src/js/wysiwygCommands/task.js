/**
 * @fileoverview Implements Task WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */

import CommandManager from '../commandManager';

/**
 * Task
 * Add Task to selected wysiwyg editor content
 * @exports Task
 * @augments Command
 * @augments WysiwygCommand
 * @ignore
 */
const Task = CommandManager.command('wysiwyg', /** @lends Task */{
    name: 'Task',
    keyMap: ['CTRL+T', 'META+T'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYSIWYGEditor instance
     */
    exec(wwe) {
        const sq = wwe.getEditor();
        let range = sq.getSelection();
        const taskManager = wwe.componentManager.getManager('task');
        const start = range.startContainer;
        const startOffset = range.startOffset;
        const end = range.endContainer;
        const endOffset = range.endOffset;

        sq.focus();

        sq.saveUndoState(range);

        const lines = taskManager.getLinesOfSelection(start, end);

        for (let i = 0; i < lines.length; i += 1) {
            this._changeFormatToTaskIfNeed(wwe, lines[i]);
        }

        range = sq.getSelection();
        range.setStart(start, startOffset);
        range.setEnd(end, endOffset);
        sq.setSelection(range);
        sq.saveUndoState(range);
    },
    /**
     * Change format to unordered list and return current li element if need
     * @param {WysiwygEditor} wwe Wysiwyg editor instance
     * @param {HTMLElement} target Element target for change
     * @private
     */
    _changeFormatToTaskIfNeed(wwe, target) {
        const sq = wwe.getEditor();
        const range = sq.getSelection();
        const taskManager = wwe.componentManager.getManager('task');

        if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
            range.setStart(target, 0);
            range.collapse(true);
            sq.setSelection(range);

            if (!sq.hasFormat('li')) {
                wwe.unwrapBlockTag();
                sq.makeUnorderedList();
            }

            if ($(target).parents('li').first().hasClass('task-list-item')) {
                taskManager.unformatTask(target);
            } else {
                taskManager.formatTask(target);
            }
        }
    }
});

module.exports = Task;
