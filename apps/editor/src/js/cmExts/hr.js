'use strict';

var MarkdownCommand = require('../markdownCommand');

var util = ne.util;

function HR() {
    MarkdownCommand.call(this, 'HR');

    this.setKeyMap('Ctrl-Q', 'Ctrl-Q');
}

util.inherit(HR, MarkdownCommand);

HR.prototype.exec = function() {
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
};

module.exports = new HR();
