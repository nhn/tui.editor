/**
 * @fileoverview Implements Task WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Task
 * Add Task to selected wysiwyg editor content
 * @exports Task
 * @augments Command
 * @augments WysiwygCommand
 */
var Task = CommandManager.command('wysiwyg',/** @lends Task */{
    name: 'Task',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var selection, $selected, $li, savedSelection,
            sq = wwe.getEditor();

        if (!sq.hasFormat('li')) {
            wwe.unwrapBlockTag();
            sq.makeUnorderedList();
        }

        selection = sq.getSelection().cloneRange();
        $selected = $(selection.startContainer);
        $li = $selected.closest('li');

        if ($li.find('input').length === 0) {
            selection = sq.getSelection().cloneRange();

            wwe.saveSelection(selection);

            selection.setStart(selection.startContainer, 0);
            selection.collapse(true);
            sq.setSelection(selection);

            sq.insertElement(sq.createElement('INPUT', {
                type: 'checkbox'
            }));

            wwe.restoreSavedSelection();
        }

        sq.focus();
    }
});

module.exports = Task;
