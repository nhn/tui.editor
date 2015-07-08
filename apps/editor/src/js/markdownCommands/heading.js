/**
 * @fileoverview Implements Heading markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var MarkdownCommand = require('../markdownCommand');

var CodeMirror = window.CodeMirror;

/**
 * Heading
 * Add heading markdown syntax to markdown editor
 * @exports Heading
 * @augments Command
 * @augments MarkdownCommand
 */
var Heading = MarkdownCommand.factory(/** @lends Heading */{
    name: 'Heading',
    keyMap: ['Ctrl-H', 'Ctrl-H'],
    /**
     *  커맨드 핸들러
     *  @param {CodeMirror} cm CodeMirror instance
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(cm) {
        var textToModify,
        range,
        from,
        to,
        textLinesToModify,
        lineLength,
        doc,
        i;

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        doc = cm.getDoc();

        // 선택된 영역을 가공함
        range = this.getCurrentRange();

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
            textLinesToModify[i] = '#' + textLinesToModify[i];
        }

        //해당 에디터의 내용을 변경한다
        doc.replaceRange(textLinesToModify.join('\n'), from, to);

        range.to.ch += 1;
        doc.setCursor(range.to);

        cm.focus();
    }
});

module.exports = Heading;
