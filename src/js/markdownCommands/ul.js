/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var MarkdownCommand = require('../markdownCommand');

var CodeMirror = window.CodeMirror;

/**
 * UL
 * Add unordered list markdown syntax to markdown editor
 * @exports UL
 * @augments Command
 * @augments MarkdownCommand
 */
var UL = MarkdownCommand.factory(/** @lends UL */{
    name: 'UL',
    /**
     * 커맨드 핸들러
     * @param {CodeMirror} cm CodeMirror instance
     * @return {object} 코드미러 상수
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

        replaceText = '* ';

        doc.replaceRange(replaceText, from, to);

        cm.focus();
    }
});

module.exports = UL;
