/**
 * @fileoverview Implements incease depth wysiwyg command
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * DecreaseDepth
 * decrease depth of list or task to wysiwyg Editor
 * @exports IncreaseDepth
 * @augments Command
 * @augments WysiwygCommand
 */
var DecreaseTask = CommandManager.command('wysiwyg', /** @lends HR */{
    name: 'DecreaseDepth',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var range, $prev, prevClasses, $node, nodeClasses;

        range = wwe.getEditor().getSelection();

        if (range.collapsed
            && wwe.getEditor().hasFormat('li')
        ) {
            $node = $(range.startContainer).closest('li');
            $prev = $node.prev();
            // IE10 에서 task의 startOffset에 ZWB를 가산하는 문제때문에,
            // list 일때 depth 커서위치 1에서의 depth 이동을 제한하기 위해 사용
            if (!$node.attr('class') && range.startOffset === 1) {
                return;
            }
            wwe.getEditor().recordUndoState(range);

            nodeClasses = $node.attr('class');
            prevClasses = $prev.attr('class');

            $node.removeAttr('class');
            $prev.removeAttr('class');

            wwe.getEditor().decreaseListLevel();

            $node.attr('class', prevClasses);
            $prev.attr('class', nodeClasses);
        }
    }
});

module.exports = DecreaseTask;
