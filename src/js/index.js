
'use strict';

var MarkdownEditor = require('./markdownEditor'),
    Preview = require('./preview'),
    Layout = require('./layout'),
    EventManager = require('./eventManager'),
    CommandManager = require('./commandManager'),
    ExtManager = require('./extManager'),
    Converter = require('./converter'),
    Bold = require('./ext/bold');

function NEditor(options) {
    var defaultOptions = {
        'previewStyle': 'column',
        'height': 300
    };

    this.options = $.extend({}, defaultOptions, options);

    this.eventManager = new EventManager();
    this.commandManager = new CommandManager(this);
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

NEditor.extManager = new ExtManager();

NEditor.addExtension = function(ext) {
    NEditor.extManager.add(ext);
};

NEditor.addExtension(Bold);

window.ne = window.ne || {};
window.ne.NEditor = NEditor;