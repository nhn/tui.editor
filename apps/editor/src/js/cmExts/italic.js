'use strict';

var italicRegex = /^[\*_][^\*_]*[\*_]$/;
var boldItalicRegex = /^[\*_]{3,}[^\*_]*[\*_]{3,}$/;
var Bold = {
    name: 'Italic',
    type: 'md',
    fn: function bold(cm) {
        if (cm.getOption("disableInput")) {
            return CodeMirror.Pass;
        }

        function isNeedRemove(text) {
            return italicRegex.test(text) || boldItalicRegex.test(text);
        }

        function append(text) {
            return '*' + text + '*';
        }

        function remove(text) {
            return text.substr(1, text.length - 2);
        }

        var doc = cm.getDoc();
        var selection = doc.getSelection();
        var result = isNeedRemove(selection) ? remove(selection) : append(selection);

        console.log(selection);
        console.log(result);

        doc.replaceSelection(result, 'around');
    },
    keyMap: ['Ctrl-I', 'Cmd-I']
};

module.exports = Bold;
