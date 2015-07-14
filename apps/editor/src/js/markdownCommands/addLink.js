/**
 * @fileoverview Implements Addlink markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var CodeMirror = window.CodeMirror;

/**
 * AddLink
 * Add link markdown syntax to markdown editor
 * @exports AddLink
 * @augments Command
 * @augments MarkdownCommand
 */
var AddLink = CommandManager.command('markdown',/** @lends AddLink */{
    name: 'AddLink',
    /**
     *  커맨드 핸들러
     *  @param {MarkdownEditor} mde MarkdownEditor instance
     *  @param {object} data data for image
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(mde, data) {
        var replaceText, range, from, to,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        replaceText = '[' + data.linkText + '](' + data.url + ')';

        doc.replaceRange(replaceText, from, to);

        cm.focus();
    }
});

module.exports = AddLink;
