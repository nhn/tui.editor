/**
 * @fileoverview Implements OL markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * OL
 * Add ordered list markdown syntax to markdown editor
 * @exports OL
 * @augments Command
 */
var OL = CommandManager.command('markdown',/** @lends OL */{
    name: 'OL',
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

        if (!doc.getLine(from.line).match(/^[ \t]*[\d]+\. .*/)) {
            doc.replaceRange('1. ', from);
        }

        cm.focus();
    }
});

module.exports = OL;
