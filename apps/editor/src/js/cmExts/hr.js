'use strict';

var CodeMirror = window.CodeMirror;

var HR = {
    name: 'HR',
    type: 'md',
    fn: function blockquote(cm) {
        var doc,
            range,
            from,
            to,
            replaceText;

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        doc = cm.getDoc();

        range = getCurrentRange(cm);

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        if (range.collapsed) {
            replaceText = doc.getLine(from.line) + '\n***';
            from.ch = 0;
            to.ch = doc.getLineHandle(range.to.line).text.length;
        } else {
            replaceText = '***';
        }

        doc.replaceRange(replaceText, from, to);
    },
    keyMap: ['Ctrl-L', 'Ctrl-L']
};

function getCurrentRange(cm) {
    var from = cm.getCursor(true),
        to = cm.getCursor(false);

    return {
        from: from,
        to: to,
        collapsed: from === to
    };
}

module.exports = HR;
