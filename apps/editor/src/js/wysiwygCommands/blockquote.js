/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var WysiwygCommand = require('../wysiwygCommand');

/**
 * Blockquote
 * Add Blockquote to selected wysiwyg editor content
 * @exports Blockquote
 * @augments Command
 * @augments WysiwygCommand
 */
var Blockquote = WysiwygCommand.factory(/** @lends Blockquote */{
    name: 'Blockquote',
    /**
     *  커맨드 핸들러
     *  @param {Squire} editor Squire instance
     */
    exec: function(editor) {
        editor.increaseQuoteLevel();
        editor.focus();
    }
});

module.exports = Blockquote;
