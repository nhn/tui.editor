/**
 * @fileoverview Implements incease depth wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


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
        var $next, $prev, prevClasses, nodeClasses, nextClasses;
        var range = wwe.getEditor().getSelection();
        var $node = $(range.startContainer).closest('li');

        $prev = $node.prev();

        if ($prev.length && $node.length) {
            $next = $node.find('li').eq(0);

            wwe.getEditor().saveUndoState();

            nodeClasses = $node.attr('class');
            prevClasses = $prev.attr('class');
            nextClasses = $next.attr('class');

            $node.removeAttr('class');
            $prev.removeAttr('class');

            if ($next.length && !$next.children('div').length) {
                $next.removeAttr('class');
            }

            wwe.getEditor().increaseListLevel();

            $node.attr('class', nodeClasses);
            $prev.attr('class', prevClasses);
            $next.attr('class', nextClasses);
        }
    }
});

module.exports = IncreaseTask;
