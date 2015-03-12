
'use strict';

var MarkdownEditor = require('./markdownEditor'),
    Preview = require('./preview'),
    Layout = require('./layout'),
    EventManager = require('./eventManager'),
    Converter = require('./converter');

function NEditor(options) {
    var defaultOptions = {
        'previewStyle': 'column',
        'height': 300
    };

    this.options = $.extend({}, defaultOptions, options);

    this.eventManager = new EventManager();
    this.converter = new Converter(this.eventManager);

    this.layout = new Layout(this, options);
    this.layout.init();

    this.mdEditor = new MarkdownEditor(this.eventManager, this.layout.getEditorContainerEl());
    this.preview = new Preview(this.eventManager, this.layout.getPreviewEl());

    this.focus();
}

NEditor.prototype.execCommand = function(command) {
    //현재 에디터 상태를 토대로 codeMirror혹은 Wysiwyg커맨드를 실행해주는 루틴
    this.getCodeMirror().execCommand(command);
};

NEditor.prototype.getCodeMirror = function() {
    return this.mdEditor.cm;
};

NEditor.prototype.focus = function() {
   this.mdEditor.focus();
};

NEditor.prototype.setValue = function(markdown) {
    this.mdEditor.setValue(markdown);
};

NEditor.prototype.getValue = function() {
    return this.mdEditor.getValue();
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

window.ne = window.ne || {};
window.ne.NEditor = NEditor;