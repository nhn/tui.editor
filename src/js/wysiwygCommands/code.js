
/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Code
 * Add bold to selected wysiwyg editor content
 * @exports Code
 * @augments Command
 * @augments WysiwygCommand
 */
var Code = CommandManager.command('wysiwyg', /** @lends Code */{
    name: 'Code',
    keyMap: ['SHIFT+CTRL+C', 'SHIFT+CTRL+C'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor();

        if (sq.hasFormat('code')) {
            sq.changeFormat(null, {tag: 'code'});
        } else if (!sq.hasFormat('a')) {
            if (sq.hasFormat('b')) {
                sq.removeBold();
            } else if (sq.hasFormat('i')) {
                sq.removeItalic();
            }
            sq.changeFormat({tag: 'code'});
        }

        sq.focus();
    }
});

module.exports = Code;
