'use strict';

var MarkdownCommand = require('../markdownCommand');

/**
 * HR
 * @exports HR
 * @extends {MarkdownCommand}
 * @constructor
 * @class
 */
var HR = MarkdownCommand.extend(/** @lends HR.prototype */{
    keyMap: ['Ctrl-Q', 'Ctrl-Q'],
    init: function HR() {
        MarkdownCommand.call(this, 'HR');
    },
    exec: function() {
        var replaceText,
            range,
            from,
            to;

        if (!this.isAvailable()) {
            return this.getPass();
        }

        range = this.getCurrentRange();

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        if (range.collapsed) {
            replaceText = this.doc.getLine(from.line) + '\n***';
            from.ch = 0;
            to.ch = this.doc.getLineHandle(range.to.line).text.length;
        } else {
            replaceText = '***';
        }

        this.doc.replaceRange(replaceText, from, to);

        this.cm.focus();
    }
});

module.exports = new HR();
