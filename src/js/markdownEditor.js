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
        dragDrop: false,
        extraKeys: {'Enter': 'newlineAndIndentContinueMarkdownList'}
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

        if (e.origin !== 'setValue') {
            e.to.ch += 1;

            eventObj = {
                source: 'markdown',
                selection: {from: e.from, to: e.to},
                textContent: cm.getDoc().getLine(e.to.line) || '',
                caretOffset: e.to.ch
            };

            self.eventManager.emit('change.markdownEditor', eventObj);
            self.eventManager.emit('change', eventObj);
        }
    });

    this.eventManager.listen('markdownUpdate', function(markdown) {
        self.setValue(markdown);
    });

    this.eventManager.listen('changeModeToMarkdown', function() {
        self.cm.refresh();
    });
};

/**
 * getCurrentRange
 * returns current selection's range
 * @param {CodeMirror} cm codemirror instance
 * @return {object} selection range
 */
MarkdownEditor.prototype.getCurrentRange = function() {
    var from = this.cm.getCursor('from'),
    to = this.cm.getCursor('to');

    return {
        from: from,
        to: to,
        collapsed: from === to
    };
};

MarkdownEditor.prototype.focus = function() {
    this.cm.focus();
};

MarkdownEditor.prototype.remove = function() {
    this.cm.toTextArea();
};

MarkdownEditor.prototype.setValue = function(markdown) {
    this.cm.setValue(markdown);
    this.lazyRunner.run('emitMarkdownEditorContentChangedEvent');
};

MarkdownEditor.prototype.getValue = function() {
    return this.cm.getValue('\n');
};

MarkdownEditor.prototype.getEditor = function() {
    return this.cm;
};

MarkdownEditor.prototype._emitMarkdownEditorContentChangedEvent = function(value) {
    this.eventManager.emit('contentChanged.markdownEditor', value || this.getValue());
};

MarkdownEditor.prototype.getCaretPosition = function() {
    return this.cm.cursorCoords();
};

MarkdownEditor.prototype.addWidget = function(selection, node, style, offset) {
    selection.to.ch += offset;
    this.cm.addWidget(selection.to, node, true, style);
};

MarkdownEditor.prototype.replaceSelection = function(content, selection) {
    if (selection) {
        this.cm.setSelection(selection.from, selection.to);
    }

    this.cm.replaceSelection(content);
    this.focus();
};

MarkdownEditor.prototype.replaceRelativeOffset = function(content, offset, overwriteLength) {
    var cursor = this.cm.getCursor(),
        selection = {
            from: {
                line: cursor.line,
                ch: cursor.ch + offset
            },
            to: {
                line: cursor.line,
                ch: (cursor.ch + offset) + overwriteLength
            }
        };

    this.replaceSelection(content, selection);
};

module.exports = MarkdownEditor;
