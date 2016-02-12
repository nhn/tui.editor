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
    keyMap: ['CTRL+T', 'CTRL+T'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var range,
            sq = wwe.getEditor();

        range = sq.getSelection().cloneRange();

        if (range.collapsed && !sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
            if (!sq.hasFormat('li')) {
                wwe.unwrapBlockTag();
                sq.makeUnorderedList();
                range = sq.getSelection().cloneRange();
            }

            range = wwe.insertSelectionMarker(range);
            wwe.getManager('task').formatTask(range.startContainer);
            wwe.restoreSelectionMarker();
        }

        sq.focus();
    }
});

module.exports = Task;
