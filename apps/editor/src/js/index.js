
'use strict';

var MarkdownEditor = require('./markdownEditor');
var Preview = require('./preview');
var Layout = require('./layout');
var EventManager = require('./eventManager');
//커맨드매니저는 필요하다 Hook의 기능도 commandManager가 해야할듯
var CommandManager = require('./commandManager');
var ExtManager = require('./extManager');


function NEditor(options) {
    this.options = options;

    this.eventManager = new EventManager();
    this.commandManager = new CommandManager();

    this.layout = new Layout(this, options);
    this.layout.init();

    this.editor = new MarkdownEditor(this);
    this.preview = new Preview(this);

    this.exts = NEditor.extManager.activate(this);
}


NEditor.prototype.remove = function() {
    console.log('remove');
};

NEditor.prototype.hide = function() {
    console.log('hide');
};

NEditor.prototype.getMarkdown = function() {
    console.log('getMarkdown');
};

NEditor.prototype.addExtension = function(ext) {
    NEditor.extManager.add(ext);
};

NEditor.extManager = new ExtManager();

window.ne = window.ne || {};
window.ne.NEditor = NEditor;