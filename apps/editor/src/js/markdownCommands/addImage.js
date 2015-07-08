/**
 * @fileoverview Implments AddImage markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var MarkdownCommand = require('../markdownCommand');

var CodeMirror = window.CodeMirror;

/**
 * AddImage
 * Add Image markdown syntax to markdown Editor
 * @exports AddImage
 * @augments Command
 * @augments MarkdownCommand
 */
var AddImage = MarkdownCommand.factory(/** @lends AddImage */{
    name: 'AddImage',
    /**
     *  커맨드 핸들러
     *  @param {CodeMirror} cm CodeMirror instance
     *  @param {object} data data for image
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(cm, data) {
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

        replaceText = '![' + data.altText + '](' + data.imageUrl + ')';

        doc.replaceRange(replaceText, from, to, '+addImage');

        cm.focus();
    }
});

module.exports = AddImage;
