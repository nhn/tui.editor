'use strict';

var italicRegex = /^[\*_][^\*_]*[\*_]$/;
var boldItalicRegex = /^[\*_]{3,}[^\*_]*[\*_]{3,}$/;
var Italic = {
    name: 'Italic',
    type: 'md',
    fn: function bold(cm) {
        if (cm.getOption("disableInput")) {
            return CodeMirror.Pass;
        }

        cm.execCommand('singleSelection');

        function isNeedRemove() {
            return italicRegex.test(selection) || boldItalicRegex.test(selection);
        }

        function append() {
            return '*' + selection + '*';
        }

        function remove() {
            return selection.substr(1, selection.length - 2);
        }

        function expendSelection() {
            doc.setSelection({line: cursor.line, ch: cursor.ch - 1}, {line: cursor.line, ch: cursor.ch + 1});

            var tmpSelection = doc.getSelection();
            if (tmpSelection === '**' || tmpSelection === '__') {
                selection = tmpSelection;
            } else {
                doc.setSelection(cursor);
            }
        }

        function setCursorToCenter() {
            doc.setCursor(cursor.line, cursor.ch + 1);
        }

        var doc = cm.getDoc();
        var cursor = doc.getCursor();
        var selection = doc.getSelection();
        var isEmpty = !selection;

        // if selection is empty, expend selection to detect a syntax
        if (isEmpty && cursor.ch > 0) {
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
    keyMap: ['Ctrl-I', 'Cmd-I']
};

module.exports = Italic;
