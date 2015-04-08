'use strict';

var MarkdownCommand = require('../markdownCommand');

var util = ne.util;

var boldItalicRegex = /^[\*_]{3,}[^\*_]*[\*_]{3,}$/;
var italicRegex = /^[\*_][^\*_]*[\*_]$/;

function Italic() {
    MarkdownCommand.call(this, 'Italic');

    this.setKeyMap('Ctrl-I', 'Ctrl-I');
}

util.inherit(Italic, MarkdownCommand);

Italic.prototype.exec = function() {
    var cursor,
        selection,
        tmpSelection,
        isRemoved,
        result,
        isEmpty,
        isWithBold;

    if (!this.isAvailable()) {
        return this.getPass();
    }

    cursor = this.doc.getCursor();
    selection = this.doc.getSelection();
    isEmpty = !selection;
    isWithBold = false;

    // if selection is empty, expend selection to detect a syntax
    if (isEmpty) {
        if (cursor.ch > 2) {
            tmpSelection = expendWithBoldSelection(this.doc, cursor);

            if (tmpSelection) {
                isWithBold = 'with';
            }
        }

        if (isWithBold !== 'with' && cursor.ch > 1) {
            isWithBold = expendOnlyBoldSelection(this.doc, cursor);
        }

        if (!isWithBold && cursor.ch > 0) {
            expendSelection(this.doc, cursor);
            selection = tmpSelection || selection;
        }
    }

    isRemoved = isNeedRemove(selection);
    result = isRemoved ? remove(selection) : append(selection);

    this.doc.replaceSelection(result, 'around');

    if (isEmpty) {
        setCursorToCenter(this.doc, cursor, isRemoved);
    }

    this.cm.focus();
};

function isNeedRemove(selection) {
    return italicRegex.test(selection) || boldItalicRegex.test(selection);
}

function append(selection) {
    return '*' + selection + '*';
}

function remove(selection) {
    return selection.substr(1, selection.length - 2);
}

function expendWithBoldSelection(doc, cursor) {
    var tmpSelection = doc.getSelection();

    doc.setSelection({line: cursor.line, ch: cursor.ch - 3}, {line: cursor.line, ch: cursor.ch + 3});

    if (tmpSelection === '******' || tmpSelection === '______') {
        return tmpSelection;
    } else {
        doc.setSelection(cursor);
    }
}

function expendOnlyBoldSelection(doc, cursor) {
    var tmpSelection = doc.getSelection();

    doc.setSelection({line: cursor.line, ch: cursor.ch - 2}, {line: cursor.line, ch: cursor.ch + 2});

    if (tmpSelection === '****' || tmpSelection === '____') {
        doc.setSelection(cursor);
        return 'only';
    }

    return false;
}

function expendSelection(doc, cursor) {
    var tmpSelection = doc.getSelection();

    doc.setSelection({line: cursor.line, ch: cursor.ch - 1}, {line: cursor.line, ch: cursor.ch + 1});

    if (tmpSelection === '**' || tmpSelection === '__') {
        return tmpSelection;
    } else {
        doc.setSelection(cursor);
    }
}

function setCursorToCenter(doc, cursor, isRemoved) {
    var pos = isRemoved ? -1 : 1;
    doc.setCursor(cursor.line, cursor.ch + pos);
}

module.exports = new Italic();
