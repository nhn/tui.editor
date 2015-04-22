'use strict';

var MarkdownCommand = require('../markdownCommand');

var util = ne.util;

function AddLink() {
    MarkdownCommand.call(this, 'AddLink');
}

util.inherit(AddLink, MarkdownCommand);

AddLink.prototype.exec = function(cm, data) {
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

    replaceText = '[' + data.linkText + '](' + data.url + ')';
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

module.exports = new AddLink();
