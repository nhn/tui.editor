'use strict';

var MarkdownCommand = require('../markdownCommand');

var util = ne.util;

function UL() {
    MarkdownCommand.call(this, 'UL');
}

util.inherit(UL, MarkdownCommand);

UL.prototype.exec = function() {
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

    replaceText = '* ';
/*
    if (range.collapsed) {
        replaceText = replaceText + '\n';
        from.ch = 0;
        to.ch = 0;
    }
*/
    this.doc.replaceRange(replaceText, from, to);

    this.cm.focus();
};

module.exports = new UL();
