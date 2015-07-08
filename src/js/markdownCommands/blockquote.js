/**
 * @fileoverview Implements Blockquote markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var CodeMirror = window.CodeMirror;

/**
 * Blockquote
 * Add blockquote markdown syntax to markdown editor
 * @exports Blockquote
 * @augments Command
 * @augments MarkdownCommand
 */
var Blockquote = CommandManager.command('markdown',/** @lends Blockquote */{
    name: 'Blockquote',
    keyMap: ['Ctrl-Q', 'Ctrl-Q'],
    /**
     *  커맨드 핸들러
     *  @param {CodeMirror} cm CodeMirror instance
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(cm) {
        var textToModify, range, from, to, textLinesToModify,
            lineLength, i, doc;

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        doc = cm.getDoc();


        //range 을 가공함
        range = this.getCurrentRange(cm);

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

        //텍스트 컨텐트를 변경 한다
        textLinesToModify = textToModify.split('\n');
        lineLength = textLinesToModify.length;

        for (i = 0; i < lineLength; i += 1) {
            textLinesToModify[i] = '>' + textLinesToModify[i];
        }

        //해당 에디터의 내용을 변경한다
        doc.replaceRange(textLinesToModify.join('\n'), from, to);

        range.to.ch += 1;

        doc.setCursor(range.to);

        cm.focus();
    }
});

module.exports = Blockquote;
