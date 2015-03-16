'use strict';

var Bold = {
    name: 'Bold',
    type: 'md',
    fn: function bold(cm) {
        if (cm.getOption("disableInput")) {
            return CodeMirror.Pass;
        }

        var doc = cm.getDoc();
        var selection = doc.getSelection();

        var result = '**' + selection + '**';

        doc.replaceSelection(result);
    },
    keyMap: ['Ctrl-B', 'Cmd-B']
};

module.exports = Bold;
