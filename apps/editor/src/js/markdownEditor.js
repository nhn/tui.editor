/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var Bold = require('./cmExts/bold'),
    Italic = require('./cmExts/italic'),
    Blockquote = require('./cmExts/blockquote'),
    Heading = require('./cmExts/heading'),
    HR = require('./cmExts/hr');


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
function MarkdownEditor($el, eventManager, commandManager) {
    this.eventManager = eventManager;
    this.$editorContainerEl = $el;

    commandManager.addCommand(Bold);
    commandManager.addCommand(Italic);
    commandManager.addCommand(Blockquote);
    commandManager.addCommand(Heading);
    commandManager.addCommand(HR);
}

MarkdownEditor.prototype.init = function(initialValue) {
    var cmTextarea = $('<textarea />');

    if (initialValue) {
        cmTextarea.text(initialValue);
        this.eventManager.emit('markdownUpdated', initialValue);
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

    this.cm.on('update', function(cm) {
        console.log('event: update', cm);
        self.eventManager.emit('markdownUpdated', self.getValue());
    });

    this.cm.on('change', function() {
        console.log('event: change', arguments);
    });

    this.cm.on('scroll', function() {
        console.log('event: scroll', arguments);
    });

    this.cm.on('focus', function() {
        console.log('event: focus', arguments);
    });
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

module.exports = MarkdownEditor;
