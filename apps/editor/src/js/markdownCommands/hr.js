/**
 * @fileoverview HR markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * HR
 * Add HR markdown syntax to markdown editor
 * @exports HR
 * @augments Command
 */
var HR = CommandManager.command('markdown', /** @lends HR */{
    name: 'HR',
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec: function(mde) {
        var range, from, to,
            cm = mde.getEditor(),
            replaceText = '',
            doc = cm.getDoc();

        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        if (range.collapsed) {
            replaceText = doc.getLine(from.line);
            from.ch = 0;
            to.ch = doc.getLineHandle(range.to.line).text.length;
        }

        if (doc.getLine(from.line).length) {
            replaceText += '\n\n* * *\n\n';
        } else {
            replaceText += '\n* * *\n';
        }

        doc.replaceRange(replaceText, from, to);

        cm.focus();
    }
});

module.exports = HR;
