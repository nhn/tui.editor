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
        var selection, $selected, $li, hasInput,
            sq = wwe.getEditor();

        if (!sq.getSelection().collapsed || wwe.hasFormatWithRx(/TABLE/)) {
            sq.focus();
            return;
        }

        if (!sq.hasFormat('li')) {
            wwe.unwrapBlockTag();
            sq.makeUnorderedList();
        }

        selection = sq.getSelection().cloneRange();
        $selected = $(selection.startContainer);
        $li = $selected.closest('li');

        hasInput = $li.children('input').length || $li.children('div').eq(0).children('input').length;

        if (!hasInput) {
            selection = wwe.insertSelectionMarker(selection);

            selection.setStart(selection.startContainer, 0);
            selection.collapse(true);

            sq.insertElement(sq.createElement('INPUT', {
                type: 'checkbox'
            }), selection);

            selection.setStart(selection.startContainer, 1);

            //we need some space for safari
            sq.insertElement(sq.getDocument().createTextNode(' '), selection);

            $li.addClass('task-list-item');

            wwe.restoreSelectionMarker();
        }

        sq.focus();
    }
});

module.exports = Task;
