/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * CodeBlock
 * Add CodeBlock to wysiwygEditor
 * @exports CodeBlock
 * @augments Command
 * @augments WysiwygCommand
 */
var CodeBlock = CommandManager.command('wysiwyg', /** @lends CodeBlock */{
    name: 'CodeBlock',
    keyMap: ['SHIFT+CTRL+P', 'SHIFT+CTRL+P'],
    /**
     * Command handler
     * @param {WysiwygEditor} wwe WYsiwygEditor instance
     * @param {string} type of language
     */
    exec: function(wwe, type) {
        var sq = wwe.getEditor();

        if (!sq.hasFormat('PRE')) {
            if (type) {
                type = ' class = "lang-' + type + '" data-language="' + type + '"';
            } else {
                type = '';
            }

            sq.insertHTML('<pre' + type + '><div><code>&#8203</code><br></div></pre>');
        }

        sq.focus();
    }
});

module.exports = CodeBlock;
