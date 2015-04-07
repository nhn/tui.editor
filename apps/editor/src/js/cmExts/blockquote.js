'use strict';

var CodeMirror = window.CodeMirror;

var Blockquote = {
    name: 'Blockquote',
    type: 'md',
    fn: function blockquote(cm) {
        var doc,
            textToModify,
            range,
            from,
            to,
            textLinesToModify,
            lineLength,
            i;

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        doc = cm.getDoc();

        // 선택된 영역을 가공함
        range = getCurrentRange(cm);

        from = {
            line: range.from.line,
            ch: 0
        };

        to = {
            line: range.to.line,
            ch: doc.getLineHandle(range.to.line).text.length
        };

        //영역의 텍스트를 가저오고
        textToModify = doc.getRange(from, to);

        //원하는 대로 가공한다
        textLinesToModify = textToModify.split('\n');
        lineLength = textLinesToModify.length;

        for (i = 0; i < lineLength; i += 1) {
            textLinesToModify[i] = '>' + textLinesToModify[i];
        }

        //해당 에디터의 내용을 변경한다
        doc.replaceRange(textLinesToModify.join('\n'), from, to);
    },
    keyMap: ['Ctrl-Q', 'Ctrl-Q']
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

module.exports = Blockquote;
