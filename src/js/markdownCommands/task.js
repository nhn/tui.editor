/**
 * @fileoverview Implements Task markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var MarkdownCommand = require('../markdownCommand');

var CodeMirror = window.CodeMirror;

/**
 * Task
 * @exports Task
 * @augments Command
 * @augments MarkdownCommand
 */

var Task = MarkdownCommand.factory(/** @lends Task */{
    name: 'Task',
    /**
     *  커맨드 핸들러
     *  @param {CodeMirror} cm CodeMirror instance
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(cm) {
        var replaceText,
            range,
            doc,
            from,
            to;

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        doc = cm.getDoc();

        range = this.getCurrentRange();

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        replaceText = '* [ ] ';

        doc.replaceRange(replaceText, from, to);

        cm.focus();
    }
});

module.exports = Task;
