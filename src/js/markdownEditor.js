/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var LazyRunner = require('./lazyRunner');

var CodeMirror = window.CodeMirror;

/**
 * MarkdownEditor
 * @exports MarkdownEditor
 * @extends {}
 * @constructor
 * @class
 * @param {jQuery} $el 에디터가 들어갈 엘리먼트
 * @param {EventManager} eventManager 이벤트 매니저
 * @param {commandManager} commandManager 커맨드 매니저
 */
function MarkdownEditor($el, eventManager) {
    this.eventManager = eventManager;
    this.$editorContainerEl = $el;

    this.lazyRunner = new LazyRunner();

    this.lazyRunner.registerLazyRunFunction(
        'emitMarkdownEditorContentChangedEvent',
        this._emitMarkdownEditorContentChangedEvent,
        300,
        this
    );
}

MarkdownEditor.prototype.init = function(initialValue) {
    var cmTextarea = $('<textarea />');

    if (initialValue) {
        cmTextarea.text(initialValue);
        this._emitMarkdownEditorContentChangedEvent(initialValue);
    }

    this.$editorContainerEl.append(cmTextarea);

    this.cm = CodeMirror.fromTextArea(cmTextarea[0], {
        lineWrapping: true,
        mode: 'gfm',
        theme: 'default',
        dragDrop: false
    });

    this._initEvent();
};

MarkdownEditor.prototype._initEvent = function() {
    var self = this;

    this.cm.on('change', function() {
        self.lazyRunner.run('emitMarkdownEditorContentChangedEvent');
    });

    this.cm.on('change', function(cm, e) {
        var eventObj;

        eventObj = {
            source: 'markdown',
            selection: {from: e.from, to: e.to},
            textContent: cm.getDoc().getLine(e.to.line),
            caretOffset: e.to.ch + 1
        };

        self.eventManager.emit('change.markdownEditor', eventObj);
        self.eventManager.emit('change', eventObj);
    });

    this.eventManager.listen('markdownUpdate', function(markdown) {
        self.setValue(markdown);
    });

    this.eventManager.listen('changeEditorTypeToMarkdown', function() {
        self.cm.refresh();
    });

    window.dd2 = this.cm;

    /*
    this.cm.on('update', function() {
        //console.log('event: update', cm);
        //스크롤시에도 이벤트가 발생함
    });


    this.cm.on('scroll', function() {
        //console.log('event: scroll', arguments);
    });

    this.cm.on('focus', function() {
        //console.log('event: focus', arguments);
    });
    */
};

MarkdownEditor.prototype.focus = function() {
    this.cm.focus();
};

MarkdownEditor.prototype.setValue = function(markdown) {
    this.cm.doc.setValue(markdown);
    this.lazyRunner.run('emitMarkdownEditorContentChangedEvent');
};

MarkdownEditor.prototype.getValue = function() {
    return this.cm.doc.getValue('\n');
};

MarkdownEditor.prototype.getEditor = function() {
    return this.cm;
};

MarkdownEditor.prototype._emitMarkdownEditorContentChangedEvent = function(value) {
    this.eventManager.emit('contentChanged.markdownEditor', value || this.getValue());
};

MarkdownEditor.prototype.getCaretPosition = function() {
    return this.getEditor().cursorCoords();
};

MarkdownEditor.prototype.addWidget = function(selection, node, style) {
    this.getEditor().addWidget(selection.to, node, style);
};

module.exports = MarkdownEditor;
