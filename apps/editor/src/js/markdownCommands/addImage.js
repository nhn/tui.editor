/**
 * @fileoverview Implments AddImage markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * AddImage
 * Add Image markdown syntax to markdown Editor
 * @exports AddImage
 * @augments Command
 */
var AddImage = CommandManager.command('markdown', /** @lends AddImage */ {
    name: 'AddImage',
    /**
     * Command Handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     * @param {object} data data for image
     */
    exec: function(mde, data) {
        var replaceText, range, from, to,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        range = mde.getCurrentRange();

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
