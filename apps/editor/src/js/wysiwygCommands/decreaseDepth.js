/**
 * @fileoverview Implements incease depth wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */


const CommandManager = require('../commandManager');

/**
 * DecreaseDepth
 * decrease depth of list or task to wysiwyg Editor
 * @exports IncreaseDepth
 * @augments Command
 * @augments WysiwygCommand
 */
const DecreaseDepth = CommandManager.command('wysiwyg', /** @lends HR */{
    name: 'DecreaseDepth',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WysiwygEditor instance
     */
    exec(wwe) {
        let $node = getCurrent$Li(wwe);

        if ($node.length) {
            wwe.getEditor().saveUndoState();

            const nodeClasses = $node.attr('class');
            wwe.getEditor().decreaseListLevel();

            $node = getCurrent$Li(wwe);
            $node.attr('class', nodeClasses);
        }
    }
});

/**
 * Get list item element of current selection
 * @param {object} wwe Wysiwyg editor instance
 * @returns {jQuery}
 */
function getCurrent$Li(wwe) {
    const range = wwe.getEditor().getSelection();

    return $(range.startContainer).closest('li');
}

module.exports = DecreaseDepth;
