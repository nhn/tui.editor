/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

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
    keyMap: ['CTRL+U', 'CTRL+U'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor(),
            range = sq.getSelection();

        if (!range.collapsed) {
            return;
        }

        if (sq.hasFormat('LI')) {
            sq.recordUndoState(range);
            wwe.saveSelection(range);
            wwe.getManager('task').unformatTask(range.startContainer);
            sq.replaceParent(range.startContainer, 'ol', 'ul');
            wwe.restoreSavedSelection();
        } else if (!sq.hasFormat('TABLE')) {
            wwe.unwrapBlockTag();
            sq.makeUnorderedList();
        }

        sq.focus();
    }
});

module.exports = UL;
