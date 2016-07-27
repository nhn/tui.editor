/**
 * @fileoverview Implements Task WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Task
 * Add Task to selected wysiwyg editor content
 * @exports Task
 * @augments Command
 * @augments WysiwygCommand
 */
var Task = CommandManager.command('wysiwyg', /** @lends Task */{
    name: 'Task',
    keyMap: ['CTRL+T', 'META+T'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var range,
            sq = wwe.getEditor();

        sq.focus();

        range = sq.getSelection().cloneRange();

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
