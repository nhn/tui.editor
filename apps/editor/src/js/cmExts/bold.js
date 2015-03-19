'use strict';

var boldRegex = /^\*\*(.*)\*\*$/m;
var Bold = {
    name: 'Bold',
    type: 'md',
    fn: function bold(cm) {
        if (cm.getOption("disableInput")) {
            return CodeMirror.Pass;
        }

        var doc = cm.getDoc();
        var selection = doc.getSelections();
        var i, length = selection.length;
        var result = new Array(length);

        var matches;
        for (i = 0; i < length; i++) {
            matches = boldRegex.exec(selection[i]);
            result[i] = matches ? matches[1] : '**' + selection[i] + '**';
        }

        doc.replaceSelections(result, 'around');
    },
    keyMap: ['Ctrl-B', 'Cmd-B']
};

module.exports = Bold;
