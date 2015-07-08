/**
 * @fileoverview Implements OL markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var CodeMirror = window.CodeMirror;

/**
 * OL
 * Add ordered list markdown syntax to markdown editor
 * @exports OL
 * @augments Command
 * @augments MarkdownCommand
 */
var OL = CommandManager.command('markdown',/** @lends OL */{
    name: 'OL',

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

        range = this.getCurrentRange(cm);

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        replaceText = '1. ';

        doc.replaceRange(replaceText, from, to);

        cm.focus();
    }
});

module.exports = OL;
