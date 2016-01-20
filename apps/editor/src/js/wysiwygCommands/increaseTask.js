/**
 * @fileoverview Implements inceaseTask wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var FIND_TASK_SPACES_RX = /^[\s\u200B]+/;
/**
 * IncreaseTask
 * increase task depth to wysiwyg Editor
 * @exports IncreaseTask
 * @augments Command
 * @augments WysiwygCommand
 */
var IncreaseTask = CommandManager.command('wysiwyg', /** @lends HR */{
    name: 'IncreaseTask',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var range, $prev, prevClasses, $task, taskClasses;

        range = wwe.getEditor().getSelection();

        if (!wwe.getEditor().getSelection().collapsed || wwe.getEditor().hasFormat('TABLE')) {
            wwe.getEditor().focus();
            return;
        }

        if (range.collapsed && range.startContainer.textContent.replace(FIND_TASK_SPACES_RX, '') === '') {
            $task = $(range.startContainer).closest('li');
            $prev = $task.prev();

            if (!$prev) {
                return;
            }

            taskClasses = $task.attr('class');
            prevClasses = $prev.attr('class');

            $task.removeAttr('class');
            $prev.removeAttr('class');

            wwe.getEditor().increaseListLevel();

            $task.attr('class', taskClasses);
            $prev.attr('class', prevClasses);
        }
    }
});

module.exports = IncreaseTask;
