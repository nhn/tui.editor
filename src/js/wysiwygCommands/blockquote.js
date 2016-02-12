/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Blockquote
 * Add Blockquote to selected wysiwyg editor content
 * @exports Blockquote
 * @augments Command
 * @augments WysiwygCommand
 */
var Blockquote = CommandManager.command('wysiwyg', /** @lends Blockquote */{
    name: 'Blockquote',
    keyMap: ['CTRL+Q', 'CTRL+Q'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor();

        if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
            wwe.unwrapBlockTag();
            sq.increaseQuoteLevel();
        }

        sq.focus();
    }
});

module.exports = Blockquote;
