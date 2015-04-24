'use strict';

var MarkdownCommand = require('../markdownCommand');

var Blockquote = MarkdownCommand.extend({
    keyMap: ['Ctrl-Q', 'Ctrl-Q'],
    init: function Blockquote() {
        MarkdownCommand.call(this, 'Blockquote');
    },
    exec: function() {
        var textToModify,
            range,
            from,
            to,
            textLinesToModify,
            lineLength,
            i;

        if (!this.isAvailable()) {
            return this.getPass();
        }

        // 선택된 영역을 가공함
        range = this.getCurrentRange();

        from = {
            line: range.from.line,
            ch: 0
        };

        to = {
            line: range.to.line,
            ch: this.doc.getLineHandle(range.to.line).text.length
        };

        //영역의 텍스트를 가저오고
        textToModify = this.doc.getRange(from, to);

        //원하는 대로 가공한다
        textLinesToModify = textToModify.split('\n');
        lineLength = textLinesToModify.length;

        for (i = 0; i < lineLength; i += 1) {
            textLinesToModify[i] = '>' + textLinesToModify[i];
        }

        //해당 에디터의 내용을 변경한다
        this.doc.replaceRange(textLinesToModify.join('\n'), from, to);

        range.to.ch += 1;

        this.doc.setCursor(range.to);

        this.cm.focus();
    }
});

module.exports = new Blockquote();
