'use strict';

var MarkdownCommand = require('../markdownCommand');

/**
 * OL
 * Add ordered list markdown syntax to markdown editor
 * @exports OL
 * @extends {MarkdownCommand}
 * @constructor
 * @class
 */
var OL = MarkdownCommand.extend(/** @lends AddImage.prototype */{
    init: function OL() {
        MarkdownCommand.call(this, 'OL');
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

        replaceText = '1. ';

        this.doc.replaceRange(replaceText, from, to);

        this.cm.focus();
    }
});

module.exports = new OL();
