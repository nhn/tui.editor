'use strict';

var CodeMirror = window.CodeMirror;

var DeleteEmphasis = {
    name: 'DeleteEmphasis',
    type: 'md',
    fn: function bold(cm) {
        var doc,
            cursor,
            range;

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        cm.execCommand('singleSelection');

        doc = cm.getDoc();
        cursor = doc.getCursor();
        range = doc.getRange({line: cursor.line, ch: cursor.ch - 1}, {line: cursor.line, ch: cursor.ch + 1});

        if (range === '**' || range === '__') {
            cm.execCommand('delCharAfter');
        }

        cm.execCommand('delCharBefore');
    },
    keyMap: ['Backspace', 'Backspace']
};

module.exports = DeleteEmphasis;
