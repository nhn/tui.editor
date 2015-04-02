'use strict';

var CodeMirror = window.CodeMirror;

var boldRegex = /^[\*_]{2,}[^\*_]*[\*_]{2,}$/;

var Bold = {
    name: 'Bold',
    type: 'md',
    fn: function bold(cm) {
        var doc,
            cursor,
            selection,
            tmpSelection,
            isEmpty,
            isRemoved,
            result;

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        cm.execCommand('singleSelection');

        doc = cm.getDoc();
        cursor = doc.getCursor();
        selection = doc.getSelection();
        isEmpty = !selection;

        // if selection is empty, expend selection to detect a syntax
        if (isEmpty && cursor.ch > 1) {
            tmpSelection = expendSelection(doc, cursor);
            selection = tmpSelection || selection;
        }

        isRemoved = isNeedRemove(selection);
        result = isRemoved ? remove(selection) : append(selection);

        doc.replaceSelection(result, 'around');

        if (isEmpty && !isRemoved) {
            setCursorToCenter(doc, cursor);
        }

        cm.focus();
    },
    keyMap: ['Ctrl-B', 'Cmd-B']
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

module.exports = Bold;
