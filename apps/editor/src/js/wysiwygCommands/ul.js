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
var UL = CommandManager.command('wysiwyg',/** @lends UL */{
    name: 'UL',
    keyMap: ['Ctrl-U', 'Ctrl-U'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor();

        sq.makeUnorderedList();
        sq.focus();
    }
});

module.exports = UL;
