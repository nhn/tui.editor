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
var DecreaseDepth = CommandManager.command('wysiwyg', /** @lends HR */{
    name: 'DecreaseDepth',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WysiwygEditor instance
     */
    exec: function(wwe) {
        var $node, nodeClasses, $startContainer;
        var range = wwe.getEditor().getSelection();
        var isInTaskList = wwe.getManager('task')._isInTaskList(range);
        var isOffsetEuqals2InDIVForIE10 = (range.startContainer.tagName === 'DIV' && range.startOffset === 2);

        $node = $(range.startContainer).closest('li');
        if ((isInTaskList && range.startOffset <= 1)
            || isOffsetEuqals2InDIVForIE10
            || range.startOffset === 0
        ) {
            wwe.getEditor().recordUndoState(range);

            nodeClasses = $node.attr('class');
            $node.removeAttr('class');

            wwe.getEditor().decreaseListLevel();

            $startContainer = $(range.startContainer);
            $node = $startContainer.hasClass('tui-editor-contents') ?
                $startContainer.children('div') : $startContainer.next('div');

            if ($node.parents('ol,ul').length === 0
                && nodeClasses.length !== 0
            ) {
                $node.find('input').remove();
            } else {
                $node.attr('class', nodeClasses);
            }
        }
    }
});

module.exports = DecreaseDepth;
