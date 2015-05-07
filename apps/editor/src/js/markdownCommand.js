'use strict';

var Command = require('./command');

var CodeMirror = window.CodeMirror;

/**
 * MarkdownCommand
 * It implements Markdown Command
 * @exports MarkdownCommand
 * @extends {Command}
 * @constructor
 * @class
 */
var MarkdownCommand = Command.extend(/** @lends Command.prototype */{
    /**
     * init
     * initialize Command
     * @param {string} name Command Name
     */
    init: function MarkdownCommand(name) {
        Command.call(this, name, Command.TYPE.MD);
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
    },
    /**
     * getCurrentRange
     * returns current selection's range
     * @return {object} selection range
     */
    getCurrentRange: function() {
        var from = this.cm.getCursor(true),
            to = this.cm.getCursor(false);

        return {
            from: from,
            to: to,
            collapsed: from === to
        };
    },
    /**
     * isAvailable
     * returns whether current codemirror is available for edit
     * @return {boolean} result
     */
    isAvailable: function() {
        return !this.cm.getOption('disableInput');
    },
    /**
     * getPass
     * return CodeMirror.Pass
     * @return {*} CodeMirror.Pass
     */
    getPass: function() {
        return CodeMirror.Pass;
    }
});

module.exports = MarkdownCommand;
