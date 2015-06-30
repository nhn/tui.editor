/**
 * @fileoverview Implements Task WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var WysiwygCommand = require('../wysiwygCommand');

/**
 * Task
 * Add Task to selected wysiwyg editor content
 * @exports Task
 * @augments Command
 * @augments WysiwygCommand
 */
var Task = WysiwygCommand.factory(/** @lends Task */{
    name: 'Task',
    /**
     * Command Handler
     */
    exec: function() {
        var path = this.editor.getPath().split('>');

        if(path[path.length - 1] === 'LI') {
            this.editor.insertHTML('<input type="checkbox" /> ');
        } else {
            this.editor.insertHTML('<ul><li><input type="checkbox" /> </li></ul>');
        }

        this.editor.focus();
    }
});

module.exports = Task;
