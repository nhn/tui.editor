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
        var range = wwe.getEditor().getSelection();
        var $node = $(range.startContainer).closest('li');

        if ($node.length) {
            wwe.getEditor().saveUndoState();
            wwe.getEditor().decreaseListLevel();
        }
    }
});

module.exports = DecreaseDepth;
