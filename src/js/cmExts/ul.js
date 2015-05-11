/**
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */
'use strict';

var MarkdownCommand = require('../markdownCommand');

/**
 * UL
 * Add unordered list markdown syntax to markdown editor
 * @exports UL
 * @extends {MarkdownCommand}
 * @constructor
 * @class
 */
var UL = MarkdownCommand.extend(/** @lends UL.prototype */{
    init: function UL() {
        MarkdownCommand.call(this, 'UL');
    },
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

        replaceText = '* ';

        this.doc.replaceRange(replaceText, from, to);

        this.cm.focus();
    }
});

module.exports = new UL();
