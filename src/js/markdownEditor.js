/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var keyMapper = require('./keyMapper').getSharedInstance();

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

    this._latestState = {
        bold: false,
        italic: false
    };
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
        dragDrop: true,
        allowDropFileTypes: ['image'],
        extraKeys: {
            'Enter': 'newlineAndIndentContinue',
            'Tab': 'subListIndentTab',
            'Shift-Tab': 'indentLess'
        },
        indentUnit: 4
    });

    this._initEvent();
};

MarkdownEditor.prototype._initEvent = function() {
    var self = this;

    this.cm.on('change', function(cm, cmEvent) {
        self._emitMarkdownEditorContentChangedEvent();
        self._emitMarkdownEditorChangeEvent(cmEvent);
    });

    this.cm.on('focus', function() {
        self.eventManager.emit('focus', {
            source: 'markdown'
        });
    });

    this.cm.on('blur', function() {
        self.eventManager.emit('blur', {
            source: 'markdown'
        });
    });

    this.cm.on('scroll', function(cm, eventData) {
        self.eventManager.emit('scroll', {
            source: 'markdown',
            data: eventData
        });
    });

    this.cm.on('keydown', function(cm, keyboardEvent) {
        self.eventManager.emit('keyMap', {
            source: 'markdown',
            keyMap: keyMapper.convert(keyboardEvent),
            data: keyboardEvent
        });
    });

    this.cm.on('paste', function(cm, clipboardEvent) {
        self.eventManager.emit('paste', {
            source: 'markdown',
            data: clipboardEvent
        });
    });

    this.cm.on('drop', function(cm, eventData) {
        eventData.preventDefault();

        self.eventManager.emit('drop', {
            source: 'markdown',
            data: eventData
        });
    });

    this.cm.on('cursorActivity', function() {
        var token, state;

        token = self.cm.getTokenAt(self.cm.getCursor());

        state = {
            bold: !!token.state.base.strong,
            italic: !!token.state.base.em,
            source: 'markdown'
        };

        if (self._latestState.bold !== state.bold || self._latestState.italic !== state.italic) {
            self.eventManager.emit('stateChange', state);
            self._latestState = state;
        }
    });
};

/**
 * getCurrentRange
 * returns current selection's range
 * @param {CodeMirror} cm codemirror instance
 * @returns {object} selection range
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
    this.getEditor().setValue(markdown);
    this._emitMarkdownEditorContentChangedEvent();
    this.moveCursorToEnd();
    this.getEditor().refresh();
};

MarkdownEditor.prototype.getValue = function() {
    return this.cm.getValue('\n');
};

MarkdownEditor.prototype.getEditor = function() {
    return this.cm;
};

MarkdownEditor.prototype.reset = function() {
    this.setValue('');
};

MarkdownEditor.prototype._emitMarkdownEditorContentChangedEvent = function() {
    this.eventManager.emit('contentChangedFromMarkdown', this);
};

MarkdownEditor.prototype._cloneCMEventObject = function(e) {
    return {
        from: {
            line: e.from.line,
            ch: e.from.ch
        },
        to: {
            line: e.to.line,
            ch: e.to.ch
        }
    };
};

MarkdownEditor.prototype._emitMarkdownEditorChangeEvent = function(e) {
    var eventObj, cursor;

    if (e.origin !== 'setValue') {
        cursor = this.getEditor().getCursor();

        eventObj = {
            source: 'markdown',
            selection: cursor,
            textContent: this.cm.getDoc().getLine(cursor.line) || '',
            caretOffset: cursor.ch
        };

        this.eventManager.emit('changeFromMarkdown', eventObj);
        this.eventManager.emit('change', eventObj);
    }
};

MarkdownEditor.prototype.getCaretPosition = function() {
    return this.cm.cursorCoords();
};

MarkdownEditor.prototype.addWidget = function(selection, node, style, offset) {
    if (offset) {
        selection.ch += offset;
    }

    this.cm.addWidget(selection, node, true, style);
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

MarkdownEditor.prototype.setHeight = function(height) {
    this.$editorContainerEl.height(height);

    if (height === 'auto') {
        this.$editorContainerEl.find('.CodeMirror').height('auto');
    }
};

MarkdownEditor.prototype.moveCursorToEnd = function() {
    var doc = this.getEditor().getDoc(),
        lastLine = doc.lastLine();

    doc.setCursor(lastLine, doc.getLine(lastLine).length);
};

MarkdownEditor.prototype.moveCursorToStart = function() {
    var doc = this.getEditor().getDoc(),
        firstLine = doc.firstLine();

    doc.setCursor(firstLine, 0);
};

MarkdownEditor.prototype.scrollTop = function(value) {
    if (value) {
        this.cm.scrollTo(0, value);
    }

    return this.cm.getScrollInfo().top;
};

module.exports = MarkdownEditor;
