'use strict';

var MarkdownCommand = require('../markdownCommand');

var util = ne.util;

function DeleteEmphasis() {
    MarkdownCommand.call(this, 'DeleteEmphasis');

    this.setKeyMap('Backspace', 'Backspace');
}

util.inherit(DeleteEmphasis, MarkdownCommand);

DeleteEmphasis.prototype.exec = function() {
    var cursor,
        range;

    if (!this.isAvailable()) {
        return this.getPass();
    }

    cursor = this.doc.getCursor();
    range = this.doc.getRange({line: cursor.line, ch: cursor.ch - 1}, {line: cursor.line, ch: cursor.ch + 1});

    if (range === '**' || range === '__') {
        this.cm.execCommand('delCharAfter');
    }

    this.cm.execCommand('delCharBefore');
};

module.exports = new DeleteEmphasis();
