/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Bold = require('./markdownCommands/bold'),
    Italic = require('./markdownCommands/italic'),
    Blockquote = require('./markdownCommands/blockquote'),
    Heading = require('./markdownCommands/heading'),
    HR = require('./markdownCommands/hr'),
    AddLink = require('./markdownCommands/addLink'),
    AddImage = require('./markdownCommands/addImage'),
    UL = require('./markdownCommands/ul'),
    OL = require('./markdownCommands/ol'),
    LazyRunner = require('./lazyRunner');


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
function MarkdownEditor($el, eventManager, commandManager, delay) {
    this.eventManager = eventManager;
    this.$editorContainerEl = $el;

    commandManager.addCommand(Bold);
    commandManager.addCommand(Italic);
    commandManager.addCommand(Blockquote);
    commandManager.addCommand(Heading);
    commandManager.addCommand(HR);
    commandManager.addCommand(AddLink);
    commandManager.addCommand(AddImage);
    commandManager.addCommand(UL);
    commandManager.addCommand(OL);

    this.lazyRunner = new LazyRunner();

    this.lazyRunner.registerLazyRunFunction(
        'emitMarkdownEditorContentChangedEvent',
        this._emitMarkdownEditorContentChangedEvent,
        delay || 300,
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
};

MarkdownEditor.prototype.getValue = function() {
    return this.cm.doc.getValue('\n');
};

MarkdownEditor.prototype._emitMarkdownEditorContentChangedEvent = function(value) {
    this.eventManager.emit('markdownEditorContentChanged', value || this.getValue());
};

module.exports = MarkdownEditor;
