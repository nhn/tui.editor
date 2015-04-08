'use strict';

var Command = require('./command');

var CodeMirror = window.CodeMirror,
    util = ne.util;

function MarkdownCommand(name) {
    Command.call(this, name, Command.TYPE.MD);
}

util.inherit(MarkdownCommand, Command);

MarkdownCommand.prototype.setup = function(cm) {
    this.cm = cm;
    this.doc = cm.getDoc();
    this.base = cm.__ned;
};

MarkdownCommand.prototype.getCurrentRange = function() {
    var from = this.cm.getCursor(true),
        to = this.cm.getCursor(false);

    return {
        from: from,
        to: to,
        collapsed: from === to
    };
};

MarkdownCommand.prototype.isAvailable = function() {
    return !this.cm.getOption('disableInput');
};

MarkdownCommand.prototype.getPass = function() {
    return CodeMirror.Pass;
};

module.exports = MarkdownCommand;
