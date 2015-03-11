
'use strict';

var MarkdownEditor = require('./markdownEditor');
var Preview = require('./preview');
var Layout = require('./layout');
var EventManager = require('./eventManager');
var CommandManager = require('./commandManager');
var ExtManager = require('./extManager');
var Converter = require('./converter');


function NEditor(options) {
    this.options = options;

    this.eventManager = new EventManager();
    this.commandManager = new CommandManager();
    this.converter = new Converter(this.eventManager);

    this.layout = new Layout(this, options);
    this.layout.init();

    this.editor = new MarkdownEditor(this.eventManager, this.layout.getEditorContainerEl());
    this.preview = new Preview(this.eventManager, this.layout.getPreviewEl());

    this.exts = NEditor.extManager.activate(this);

    this.focus();
}

NEditor.prototype.focus = function() {
   this.editor.focus();
};

NEditor.prototype.setValue = function(markdown) {
    this.editor.setValue(markdown);
};

NEditor.prototype.getValue = function() {
    return this.editor.getValue();
};

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