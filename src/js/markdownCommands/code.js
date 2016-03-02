/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Code
 * Add code markdown syntax to markdown editor
 * @exports Code
 * @augments Command
 */
var Code = CommandManager.command('markdown', /** @lends Code */{
    name: 'Code',
    keyMap: ['SHIFT+CTRL+C', 'SHIFT+CTRL+C'],
    /**
     * Command Handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec: function(mde) {
        var range, selection,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        selection = doc.getSelection();
        range = cm.getCursor();

        doc.replaceSelection(this.append(selection), 'around');

        if (!selection) {
            doc.setCursor(range.line, range.ch + 1);
        }

        cm.focus();
    },
    /**
     * Code를 적용한다
     * @param {string} text 셀렉션텍스트
     * @returns {string} 가 적용된 텍스트
     */
    append: function(text) {
        return '`' + text + '`';
    }
});

module.exports = Code;
