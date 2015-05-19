/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var WysiwygCommand = require('../wysiwygCommand');

/**
 * Italic
 * Add Italic to selected wysiwyg editor content
 * @exports Italic
 * @augments Command
 * @augments WysiwygCommand
 */
var Italic = WysiwygCommand.factory(/** @lends Italic */{
    name: 'Italic',
    keyMap: ['Ctrl-I', 'Ctrl-I'],
    /**
     *  커맨드 핸들러
     */
    exec: function() {
        this.editor.italic();
        this.editor.focus();
    }
});

module.exports = Italic;
