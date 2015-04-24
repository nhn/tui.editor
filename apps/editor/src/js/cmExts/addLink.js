'use strict';

var MarkdownCommand = require('../markdownCommand');

var AddLink = MarkdownCommand.extend({
    init: function AddLink() {
        MarkdownCommand.call(this, 'AddLink');
    },
    exec: function(cm, data) {
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

        this.doc.replaceRange(replaceText, from, to);

        this.cm.focus();
    }
});

module.exports = new AddLink();
