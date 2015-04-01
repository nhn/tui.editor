'use strict';

var boldRegex = /^[\*_]{2,}[^\*_]*[\*_]{2,}$/;

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

var Bold = {
    name: 'Bold',
    type: 'md',
    fn: function bold(cm) {
        if (cm.getOption("disableInput")) {
            return CodeMirror.Pass;
        }

        cm.execCommand('singleSelection');

        var doc = cm.getDoc();
        var cursor = doc.getCursor();
        var selection = doc.getSelection();
        var tmpSelection;
        var isEmpty = !selection;

        // if selection is empty, expend selection to detect a syntax
        if (isEmpty && cursor.ch > 1) {
            tmpSelection = expendSelection(doc, cursor);
            selection = tmpSelection || selection;
        }

        var isRemoved = isNeedRemove(selection);
        var result = isRemoved ? remove(selection) : append(selection);

        console.log(selection);
        console.log(result);

        doc.replaceSelection(result, 'around');

        if (isEmpty && !isRemoved) {
            setCursorToCenter(doc, cursor);
        }

        cm.focus();
    },
    keyMap: ['Ctrl-B', 'Cmd-B']
};

module.exports = Bold;
