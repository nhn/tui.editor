/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


var CommandManager = require('../commandManager');

/**
 * UL
 * Add UL to selected wysiwyg editor content
 * @exports UL
 * @augments Command
 * @augments WysiwygCommand
 */
var UL = CommandManager.command('wysiwyg', /** @lends UL */{
    name: 'UL',
    keyMap: ['CTRL+U', 'META+U'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor(),
            range = sq.getSelection();

        sq.focus();

        if (!range.collapsed) {
            return;
        }

        if (sq.hasFormat('LI')) {
            wwe.saveSelection(range);
            sq.saveUndoState(range);
            wwe.getManager('task').unformatTask(range.startContainer);
            sq.replaceParent(range.startContainer, 'ol', 'ul');
            wwe.restoreSavedSelection();
        } else if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
            wwe.unwrapBlockTag();
            sq.makeUnorderedList();
        }
    }
});

module.exports = UL;
