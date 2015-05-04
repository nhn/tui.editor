'use strict';

var MarkdownCommand = require('../markdownCommand');

/**
 * AddImage
 * @exports AddImage
 * @extends {MarkdownCommand}
 * @constructor
 * @class
 */
var AddImage = MarkdownCommand.extend(/** @lends AddImage.prototype */{
    init: function AddImage() {
        MarkdownCommand.call(this, 'AddImage');
    },
    exec: function(cm, data) {
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

        replaceText = '![' + data.imageUrl + '](' + data.altText + ')';

        this.doc.replaceRange(replaceText, from, to);

        this.cm.focus();
    }
});

module.exports = new AddImage();
