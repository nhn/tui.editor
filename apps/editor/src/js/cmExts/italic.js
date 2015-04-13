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
            tmpSelection = this.expendWithBoldSelection(cursor);

            if (tmpSelection) {
                isWithBold = 'with';
            }
        }

        if (isWithBold !== 'with' && cursor.ch > 1) {
            isWithBold = this.expendOnlyBoldSelection(cursor);
        }

        if (!isWithBold && cursor.ch > 0) {
            this.expendSelection(cursor);
            selection = tmpSelection || selection;
        }
    }

    isRemoved = this.isNeedRemove(selection);
    result = isRemoved ? this.remove(selection) : this.append(selection);

    this.doc.replaceSelection(result, 'around');

    if (isEmpty) {
        this.setCursorToCenter(cursor, isRemoved);
    }

    this.cm.focus();
};

Italic.prototype.isNeedRemove = function(selection) {
    return italicRegex.test(selection) || boldItalicRegex.test(selection);
};

Italic.prototype.append = function(selection) {
    return '*' + selection + '*';
};

Italic.prototype.remove = function(selection) {
    return selection.substr(1, selection.length - 2);
};

Italic.prototype.expendWithBoldSelection = function(cursor) {
    var tmpSelection = this.doc.getSelection();

    this.doc.setSelection({line: cursor.line, ch: cursor.ch - 3}, {line: cursor.line, ch: cursor.ch + 3});

    if (tmpSelection === '******' || tmpSelection === '______') {
        return tmpSelection;
    } else {
        this.doc.setSelection(cursor);
    }
};

Italic.prototype.expendOnlyBoldSelection = function(cursor) {
    var tmpSelection = this.doc.getSelection();

    this.doc.setSelection({line: cursor.line, ch: cursor.ch - 2}, {line: cursor.line, ch: cursor.ch + 2});

    if (tmpSelection === '****' || tmpSelection === '____') {
        this.doc.setSelection(cursor);
        return 'only';
    }

    return false;
};

Italic.prototype.expendSelection = function(cursor) {
    var tmpSelection = this.doc.getSelection();

    this.doc.setSelection({line: cursor.line, ch: cursor.ch - 1}, {line: cursor.line, ch: cursor.ch + 1});

    if (tmpSelection === '**' || tmpSelection === '__') {
        return tmpSelection;
    } else {
        this.doc.setSelection(cursor);
    }
};

Italic.prototype.setCursorToCenter = function(cursor, isRemoved) {
    var pos = isRemoved ? -1 : 1;
    this.doc.setCursor(cursor.line, cursor.ch + pos);
};

module.exports = new Italic();
