/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * UL
 * Add unordered list markdown syntax to markdown editor
 * @exports UL
 * @augments Command
 */
var UL = CommandManager.command('markdown',/** @lends UL */{
    name: 'UL',
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec: function(mde) {
        var range, from,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: 0
        };

        if (!doc.getLine(from.line).match(/^[ \t]*\* .*/)) {
            doc.replaceRange('* ', from);
        }

        cm.focus();
    }
});

module.exports = UL;
