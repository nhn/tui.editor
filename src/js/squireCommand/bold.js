'use strict';

var WysiwygCommand = require('../wysiwygCommand');

/**
 * Blockquote
 * Add blockquote markdown syntax to markdown editor
 * @exports Blockquote
 * @extends {MarkdownCommand}
 * @constructor
 * @class
 */
var Bold = WysiwygCommand.extend(/** @lends Bold.prototype */{
    keyMap: ['Ctrl-B', 'Ctrl-B'],
    init: function Bold() {
        WysiwygCommand.call(this, 'Bold');
    },
    /**
     *  커맨드 핸들러
     */
    exec: function() {
        this.editor.bold();
        this.editor.focus();
    }
});

module.exports = new Bold();
