/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var MarkdownCommand = require('../markdownCommand');

/**
 * HR
 * Add HR markdown syntax to markdown editor
 * @exports HR
 * @augments Command
 * @augments MarkdownCommand
 */
var HR = MarkdownCommand.factory(/** @lends HR */{
    name: 'HR',
    keyMap: ['Ctrl-Q', 'Ctrl-Q'],
    /**
     *  커맨드 핸들러
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function() {
        var replaceText,
            range,
            from,
            to;

        if (!this.isAvailable()) {
            return this.getPass();
        }

        range = this.getCurrentRange();

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        if (range.collapsed) {
            replaceText = this.doc.getLine(from.line) + '\n***';
            from.ch = 0;
            to.ch = this.doc.getLineHandle(range.to.line).text.length;
        } else {
            replaceText = '***';
        }

        this.doc.replaceRange(replaceText, from, to);

        this.cm.focus();
    }
});

module.exports = HR;
