'use strict';

var Command = require('./command');

var CodeMirror = window.CodeMirror;

var MarkdownCommand = Command.extend({
    init: function MarkdownCommand(name) {
        Command.call(this, name, Command.TYPE.MD);
    },
    setup: function(cm) {
        this.cm = cm;
        this.doc = cm.getDoc();
        this.base = cm.__ned;
    },
    getCurrentRange: function() {
        var from = this.cm.getCursor(true),
            to = this.cm.getCursor(false);

        return {
            from: from,
            to: to,
            collapsed: from === to
        };
    },
    isAvailable: function() {
        return !this.cm.getOption('disableInput');
    },
    getPass: function() {
        return CodeMirror.Pass;
    }
});

module.exports = MarkdownCommand;
