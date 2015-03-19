'use strict';

var DeleteEmphasis = {
    name: 'DeleteEmphasis',
    type: 'md',
    fn: function bold(cm) {
        if (cm.getOption("disableInput")) {
            return CodeMirror.Pass;
        }

        cm.execCommand('singleSelection');

        var doc = cm.getDoc();
        var cursor = doc.getCursor();
        var range = doc.getRange({line: cursor.line, ch: cursor.ch - 1}, {line: cursor.line, ch: cursor.ch + 1});

        if (range === '**' || range === '__') {
            cm.execCommand('delCharAfter');
        }

        cm.execCommand('delCharBefore');
    },
    keyMap: ['Backspace', 'Backspace']
};

module.exports = DeleteEmphasis;
