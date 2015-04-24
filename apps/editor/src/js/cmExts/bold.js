'use strict';

var MarkdownCommand = require('../markdownCommand');

var boldRegex = /^[\*_]{2,}[^\*_]*[\*_]{2,}$/;

var Bold = MarkdownCommand.extend({
    keyMap: ['Ctrl-B', 'Ctrl-B'],
    init: function Bold() {
        MarkdownCommand.call(this, 'Bold');
    },
    exec: function() {
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
            tmpSelection = this.expendSelection(this.doc, cursor);
            selection = tmpSelection || selection;
        }

        isRemoved = this.isNeedRemove(selection);
        result = isRemoved ? this.remove(selection) : this.append(selection);

        this.doc.replaceSelection(result, 'around');

        if (isEmpty && !isRemoved) {
            this.setCursorToCenter(this.doc, cursor);
        }

        this.cm.focus();
    },
    isNeedRemove: function(selection) {
        return boldRegex.test(selection);
    },
    append: function(selection) {
        return '**' + selection + '**';
    },
    remove: function(selection) {
        return selection.substr(2, selection.length - 4);
    },
    expendSelection: function(doc, cursor) {
        var tmpSelection = doc.getSelection();

        doc.setSelection({line: cursor.line, ch: cursor.ch - 2}, {line: cursor.line, ch: cursor.ch + 2});

        if (tmpSelection === '****' || tmpSelection === '____') {
            return tmpSelection;
        } else {
            doc.setSelection(cursor);
        }
    },
    setCursorToCenter: function(doc, cursor) {
        doc.setCursor(cursor.line, cursor.ch + 2);
    }
});

module.exports = new Bold();
