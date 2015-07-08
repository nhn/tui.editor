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
     * Command Handler
     * @param {Squire} editor Squire instance
     */
    exec: function(editor) {
        var path = editor.getPath().split('>');

        if(path[path.length - 1] === 'LI') {
            editor.insertHTML('<input type="checkbox" /> ');
        } else {
            editor.insertHTML('<ul><li><input type="checkbox" /> </li></ul>');
        }

        editor.focus();
    }
});

module.exports = Task;
