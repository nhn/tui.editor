/**
 * @fileoverview HR markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var CodeMirror = window.CodeMirror;

/**
 * HR
 * Add HR markdown syntax to markdown editor
 * @exports HR
 * @augments Command
 * @augments MarkdownCommand
 */
var HR = CommandManager.command('markdown',/** @lends HR */{
    name: 'HR',
    /**
     *  커맨드 핸들러
     *  @param {CodeMirror} cm CodeMirror instance
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(cm) {
        var replaceText,
            range,
            from,
            doc,
            to;

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        doc = cm.getDoc();

        range = this.getCurrentRange(cm);

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

        cm.focus();
    }
});

module.exports = HR;
