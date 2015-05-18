/**
 * @fileoverview Implements Blockquote markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var MarkdownCommand = require('../markdownCommand');

/**
 * Blockquote
 * Add blockquote markdown syntax to markdown editor
 * @exports Blockquote
 * @augments Command
 * @augments MarkdownCommand
 */
var Blockquote = MarkdownCommand.factory(/** @lends Blockquote */{
    name: 'Blockquote',
    keyMap: ['Ctrl-Q', 'Ctrl-Q'],
    /**
     *  커맨드 핸들러
     *  @return {CodeMirror} 코드미러 상수
     */
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

        //range 을 가공함
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

        //텍스트 컨텐트를 변경 한다
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

module.exports = Blockquote;
