/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * RemoveTable
 * Remove selected table
 * @exports RemoveTable
 * @augments Command
 * @augments WysiwygCommand
 */
var RemoveTable = CommandManager.command('wysiwyg', /** @lends RemoveTable */{
    name: 'RemoveTable',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor(),
            range = sq.getSelection().cloneRange(),
            $table;

        if (sq.hasFormat('TABLE')) {
            sq.saveUndoState(range);
            $table = $(range.startContainer).closest('table');

            $table.remove();
        }

        sq.focus();
    }
});

module.exports = RemoveTable;
