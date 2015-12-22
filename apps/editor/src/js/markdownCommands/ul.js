/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var FIND_MD_OL_RX = /^[ \t]*[\d]+\. .*/,
    FIND_MD_UL_RX = /^[ \t]*\* .*/;

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
        var range, from, line, to,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: 0
        };


        line = doc.getLine(from.line);

        if (line.match(FIND_MD_OL_RX)) {
            line = line.replace(/[\d]+\. /, '* ');

            to  = {
                line: from.line,
                ch: line.length + 1
            };

            doc.replaceRange(line, from, to);
        } else if (!line.match(FIND_MD_UL_RX)) {
            doc.replaceRange('* ', from);
        }

        cm.focus();
    }
});

module.exports = UL;
