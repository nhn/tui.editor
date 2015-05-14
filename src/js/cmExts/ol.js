/**
 * @fileoverview Implements OL markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var MarkdownCommand = require('../markdownCommand');

/**
 * OL
 * Add ordered list markdown syntax to markdown editor
 * @exports OL
 * @augments Command
 * @augments MarkdownCommand
 */
var OL = MarkdownCommand.factory(/** @lends OL */{
    name: 'OL',

    /**
     * 커맨드 핸들러
     * @return {number} 코드미러 상수
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

        replaceText = '1. ';

        this.doc.replaceRange(replaceText, from, to);

        this.cm.focus();
    }
});

module.exports = OL;
