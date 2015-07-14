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
var Task = CommandManager.command('wysiwyg',/** @lends Task */{
    name: 'Task',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor(),
            path = sq.getPath().split('>');

        if (path[path.length - 1] === 'LI') {
            sq.insertHTML('<input type="checkbox" /> ');
        } else {
            sq.insertHTML('<ul><li><input type="checkbox" /> </li></ul>');
        }

        sq.focus();
    }
});

module.exports = Task;
