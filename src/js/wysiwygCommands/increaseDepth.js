/**
 * @fileoverview Implements incease depth wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */

import CommandManager from '../commandManager';

/**
 * IncreaseDepth
 * increase depth of list or task to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/IncreaseDepth
 * @ignore
 */
const IncreaseDepth = CommandManager.command('wysiwyg', /** @lends HR */{
    name: 'IncreaseDepth',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec(wwe) {
        const range = wwe.getEditor().getSelection();
        const $node = $(range.startContainer).closest('li');
        let prevClasses, nodeClasses, nextClasses;

        const $prev = $node.prev();

        if ($prev.length && $node.length) {
            const $next = $node.find('li').eq(0);

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

module.exports = IncreaseDepth;
