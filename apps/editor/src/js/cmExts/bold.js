'use strict';

var MarkdownCommand = require('../markdownCommand');

var util = ne.util;

var boldRegex = /^[\*_]{2,}[^\*_]*[\*_]{2,}$/;

function Bold() {
    MarkdownCommand.call(this, 'Bold');

    this.setKeyMap('Ctrl-B', 'Ctrl-B');
}

util.inherit(Bold, MarkdownCommand);

Bold.prototype.exec = function() {
    var cursor,
        selection,
        tmpSelection,
        isRemoved,
        result,
        isEmpty;

    if (!this.isAvailable()) {
        return this.getPass();
    }

    cursor = this.doc.getCursor();
    selection = this.doc.getSelection();
    isEmpty = !selection;

    // if selection is empty, expend selection to detect a syntax
    if (isEmpty && cursor.ch > 1) {
        tmpSelection = expendSelection(this.doc, cursor);
        selection = tmpSelection || selection;
    }

    isRemoved = isNeedRemove(selection);
    result = isRemoved ? remove(selection) : append(selection);

    this.doc.replaceSelection(result, 'around');

    if (isEmpty && !isRemoved) {
        setCursorToCenter(this.doc, cursor);
    }

    this.cm.focus();
};

function isNeedRemove(selection) {
    return boldRegex.test(selection);
}

function append(selection) {
    return '**' + selection + '**';
}

function remove(selection) {
    return selection.substr(2, selection.length - 4);
}

function expendSelection(doc, cursor) {
    var tmpSelection = doc.getSelection();

    doc.setSelection({line: cursor.line, ch: cursor.ch - 2}, {line: cursor.line, ch: cursor.ch + 2});

    if (tmpSelection === '****' || tmpSelection === '____') {
        return tmpSelection;
    } else {
        doc.setSelection(cursor);
    }
}

function setCursorToCenter(doc, cursor) {
    doc.setCursor(cursor.line, cursor.ch + 2);
}

module.exports = new Bold();
