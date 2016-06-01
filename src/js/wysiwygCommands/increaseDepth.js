/**
 * @fileoverview Implements incease depth wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

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
        var $prev, prevClasses, $node, nodeClasses;
        var range = wwe.getEditor().getSelection();
        var isInTaskList = wwe.getManager('task').isInTaskList(range);
            // IE10 에서 task의 startOffset에 ZWB를 가산하는 문제때문에,
            // list 일때 depth 커서위치 1에서의 depth 이동을 제한하기 위해 사용
        var isOffsetEuqals2InDIVForIE10 = (range.startContainer.tagName === 'DIV' && range.startOffset === 2);

        if ((isInTaskList && range.startOffset <= 1)
            || isOffsetEuqals2InDIVForIE10
            || range.startOffset === 0
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
