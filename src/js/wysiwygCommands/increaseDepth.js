/**
 * @fileoverview Implements incease depth wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var FIND_TASK_SPACES_RX = /^[\s\u200B]+/;
/**
 * IncreaseDepth
 * increase depth of list or task to wysiwyg Editor
 * @exports IncreaseDepth
 * @augments Command
 * @augments WysiwygCommand
 */
var IncreaseTask = CommandManager.command('wysiwyg', /** @lends HR */{
    name: 'IncreaseDepth',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var range, $prev, prevClasses, $node, nodeClasses;

        range = wwe.getEditor().getSelection();

        if (range.collapsed
            && wwe.getEditor().hasFormat('li')
            && range.startContainer.textContent.replace(FIND_TASK_SPACES_RX, '') === ''
        ) {
            $node = $(range.startContainer).closest('li');
            $prev = $node.prev();

            if (!$prev.length) {
                return;
            }

            wwe.getEditor().recordUndoState(range);

            nodeClasses = $node.attr('class');
            prevClasses = $prev.attr('class');

            $node.removeAttr('class');
            $prev.removeAttr('class');

            wwe.getEditor().increaseListLevel();

            $node.attr('class', nodeClasses);
            $prev.attr('class', prevClasses);
        }
    }
});

module.exports = IncreaseTask;
