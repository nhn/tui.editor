/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


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
    keyMap: ['CTRL+Q', 'META+Q'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor();

        sq.focus();

        if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
            wwe.unwrapBlockTag();
            sq.increaseQuoteLevel();
        }
    }
});

module.exports = Blockquote;
