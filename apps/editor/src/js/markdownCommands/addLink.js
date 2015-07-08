/**
 * @fileoverview Implements Addlink markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var MarkdownCommand = require('../markdownCommand');

var CodeMirror = window.CodeMirror;

/**
 * AddLink
 * Add link markdown syntax to markdown editor
 * @exports AddLink
 * @augments Command
 * @augments MarkdownCommand
 */
var AddLink = MarkdownCommand.factory(/** @lends AddLink */{
    name: 'AddLink',
    /**
     *  커맨드 핸들러
     *  @param {CodeMirror} cm CodeMirror instance
     *  @param {object} data data for link
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(cm, data) {
        var replaceText,
        range,
        from,
        to;

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
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

        replaceText = '[' + data.linkText + '](' + data.url + ')';

        this.doc.replaceRange(replaceText, from, to);

        cm.focus();
    }
});

module.exports = AddLink;
