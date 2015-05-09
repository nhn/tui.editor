'use strict';

var Command = require('./command');

/**
 * WysiwygCommand
 * It implements Wysiwyg Command
 * @exports WysiwygCommand
 * @extends {Command}
 * @constructor
 * @class
 */
var WysiwygCommand = Command.extend(/** @lends WysiwygCommand.prototype */{
    /**
     * init
     * initialize Command
     * @param {string} name Command Name
     */
    init: function MarkdownCommand(name) {
        Command.call(this, name, Command.TYPE.WW);
    },
    /**
     * setup
     * Set current base and codemirror context
     * @param {CodeMirror} cm codemirror
     */
    setup: function(cm) {
        this.cm = cm;
        this.doc = cm.getDoc();
        this.base = cm.__ned;
    }
});

module.exports = WysiwygCommand;
