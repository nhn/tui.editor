'use strict';

var boldRegex = /^[\*_]{2,}[^\*_]*[\*_]{2,}$/;
var Bold = {
    name: 'Bold',
    type: 'md',
    fn: function bold(cm) {
        if (cm.getOption("disableInput")) {
            return CodeMirror.Pass;
        }

        cm.execCommand('singleSelection');

        function isNeedRemove() {
            return boldRegex.test(selection);
        }

        function append() {
            return '**' + selection + '**';
        }

        function remove() {
            return selection.substr(2, selection.length - 4);
        }

        function expendSelection() {
            doc.setSelection({line: cursor.line, ch: cursor.ch - 2}, {line: cursor.line, ch: cursor.ch + 2});

            var tmpSelection = doc.getSelection();
            if (tmpSelection === '****' || tmpSelection === '____') {
                selection = tmpSelection;
            } else {
                doc.setSelection(cursor);
            }
        }

        function setCursorToCenter() {
            doc.setCursor(cursor.line, cursor.ch + 2);
        }

        var doc = cm.getDoc();
        var cursor = doc.getCursor();
        var selection = doc.getSelection();
        var isEmpty = !selection;

        // if selection is empty, expend selection to detect a syntax
        if (isEmpty && cursor.ch > 1) {
            expendSelection();
        }

        var isRemoved = isNeedRemove();
        var result = isRemoved ? remove() : append();

        console.log(selection);
        console.log(result);

        doc.replaceSelection(result, 'around');

        if (isEmpty && !isRemoved) {
            setCursorToCenter();
        }
    },
    keyMap: ['Ctrl-B', 'Cmd-B']
};

module.exports = Bold;
