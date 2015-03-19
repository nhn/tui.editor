'use strict';

var boldRegex = /^\*\*([\s\S]*)\*\*$/;
var Bold = {
    name: 'Bold',
    type: 'md',
    fn: function bold(cm) {
        if (cm.getOption("disableInput")) {
            return CodeMirror.Pass;
        }

        var doc = cm.getDoc();
        var selections = doc.getSelections();
        var i, length = selections.length;
        var results = new Array(length);

        var matches;
        for (i = 0; i < length; i++) {
            matches = boldRegex.exec(selections[i]);
            results[i] = matches ? matches[1] : '**' + selections[i] + '**';
        }

        console.log(selections);
        console.log(results);

        doc.replaceSelections(results, 'around');
    },
    keyMap: ['Ctrl-B', 'Cmd-B']
};

module.exports = Bold;
