/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var FIND_TASK_SPACES_RX = /^[\s\u200B]+/;

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
            wwe.saveSelection(range);
            unformatTask(range);
            wwe.restoreSavedSelection();
        } else if (!sq.hasFormat('TABLE')) {
            wwe.unwrapBlockTag();
        }

        sq.makeUnorderedList();

        sq.focus();
    }
});

function unformatTask(range) {
    var $li, firstTextNode, $wrapper;

    $li = $(range.startContainer).closest('li');

    $wrapper = $li.find('div');

    if (!$wrapper.length) {
        $wrapper = $li;
    }

    $wrapper.find('input:checkbox').remove();

    $li.removeClass('task-list-item');

    if (!$li.attr('class')) {
        $li.removeAttr('class');
    }

    firstTextNode = $wrapper.contents().filter(function() {
        return this.nodeType === 3;
    })[0];

    if (firstTextNode && firstTextNode.nodeValue.match(FIND_TASK_SPACES_RX)) {
        firstTextNode.nodeValue = firstTextNode.nodeValue.replace(FIND_TASK_SPACES_RX, '');
    }
}

module.exports = UL;
