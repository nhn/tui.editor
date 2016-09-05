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
 */
const Task = CommandManager.command('wysiwyg', /** @lends Task */{
    name: 'Task',
    keyMap: ['CTRL+T', 'META+T'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec(wwe) {
        const sq = wwe.getEditor();

        sq.focus();

        let range = sq.getSelection().cloneRange();

        if (range.collapsed && !sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
            if (!sq.hasFormat('li')) {
                wwe.unwrapBlockTag();
                sq.makeUnorderedList();
                range = sq.getSelection().cloneRange();
            }

            sq.saveUndoState(range);
            wwe.getManager('task').formatTask(range.startContainer);
        }
    }
});

module.exports = Task;
