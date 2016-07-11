/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var keyMapper = require('./keyMapper').getSharedInstance();
var MdTextObject = require('./mdTextObject');

var CodeMirror = window.CodeMirror;

/**
 * MarkdownEditor
 * @exports MarkdownEditor
 * @constructor
 * @class MarkdownEditor
 * @param {jQuery} $el element to insert editor
 * @param {EventManager} eventManager EventManager instance
 */
function MarkdownEditor($el, eventManager) {
    this.eventManager = eventManager;
    this.$editorContainerEl = $el;

    this._latestState = {
        bold: false,
        italic: false
    };
}

/**
 * init
 * @api
 * @memberOf WysiwygEditor
 * @param {string} initialValue Editor's initial content
 */
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

/**
 * _initEvent
 * Initialize EventManager event handler
 * @memberOf MarkdownEditor
 * @private
 */
MarkdownEditor.prototype._initEvent = function() {
    var self = this;

    this.cm.getWrapperElement().addEventListener('click', function() {
        self.eventManager.emit('click', {
            source: 'markdown'
        });
    });

    this.cm.on('beforeChange', function(cm, ev) {
        if (ev.origin === 'paste') {
            self.eventManager.emit('pasteBefore', {source: 'markdown', data: ev});
        }
    });

    this.cm.on('change', function(cm, cmEvent) {
        self._emitMarkdownEditorContentChangedEvent();
        self._emitMarkdownEditorChangeEvent(cmEvent);
    });

    this.cm.on('focus', function() {
        self.eventManager.emit('focus', {
            source: 'markdown'
        });
        self.getEditor().refresh();
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
        self.eventManager.emit('keydown', {
            source: 'markdown',
            data: keyboardEvent
        });

        self.eventManager.emit('keyMap', {
            source: 'markdown',
            keyMap: keyMapper.convert(keyboardEvent),
            data: keyboardEvent
        });
    });

    this.cm.on('keyup', function(cm, keyboardEvent) {
        self.eventManager.emit('keyup', {
            source: 'markdown',
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
        var token, state, base, overlay;

        token = self.cm.getTokenAt(self.cm.getCursor());

        base = token.state.base;
        overlay = token.state.overlay;

        state = {
            bold: !!base.strong,
            italic: !!base.em,
            code: !!overlay.code,
            codeBlock: !!overlay.codeBlock,
            source: 'markdown'
        };

        if (self._isStateChanged(self._latestState, state)) {
            self.eventManager.emit('stateChange', state);
            self._latestState = state;
        }
    });
};

/**
 * getCurrentRange
 * returns current selection's range
 * @api
 * @memberOf MarkdownEditor
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

/**
 * Set focus to current Editor
 * @api
 * @memberOf MarkdownEditor
 */
MarkdownEditor.prototype.focus = function() {
    this.cm.focus();
};

/**
 * Remove Editor from document
 * @api
 * @memberOf MarkdownEditor
 */
MarkdownEditor.prototype.remove = function() {
    this.cm.toTextArea();
};

/**
 * Set Editor value
 * @api
 * @memberOf MarkdownEditor
 * @param {string} markdown Markdown syntax text
 */
MarkdownEditor.prototype.setValue = function(markdown) {
    this.getEditor().setValue(markdown);
    this._emitMarkdownEditorContentChangedEvent();
    this.moveCursorToEnd();
    this.getEditor().refresh();
};

/**
 * Get editor value
 * @api
 * @memberOf MarkdownEditor
 * @returns {string}
 */
MarkdownEditor.prototype.getValue = function() {
    return this.cm.getValue('\n');
};

/**
 * Get CodeMirror instance
 * @api
 * @memberOf MarkdownEditor
 * @returns {CodeMirror}
 */
MarkdownEditor.prototype.getEditor = function() {
    return this.cm;
};

/**
 * Reset Editor
 * @api
 * @memberOf MarkdownEditor
 */
MarkdownEditor.prototype.reset = function() {
    this.setValue('');
};

/**
 * Emit contentChangedFromMarkdown event
 * @memberOf MarkdownEditor
 * @private
 */
MarkdownEditor.prototype._emitMarkdownEditorContentChangedEvent = function() {
    this.eventManager.emit('contentChangedFromMarkdown', this);
};

/**
 * Clone CodeMirror event object
 * @memberOf MarkdownEditor
 * @param {event} e Event object
 * @returns {{from: {line: number, ch: number}, to: {line: number, ch: number}}}
 * @private
 */
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

/**
 * Emit changeEvent
 * @memberOf MarkdownEditor
 * @param {event} e Event object
 * @private
 */
MarkdownEditor.prototype._emitMarkdownEditorChangeEvent = function(e) {
    var eventObj;

    if (e.origin !== 'setValue') {
        eventObj = {
            source: 'markdown'
        };

        this.eventManager.emit('changeFromMarkdown', eventObj);
        this.eventManager.emit('change', eventObj);
    }
};

/**
 * Get current caret position
 * @api
 * @memberOf MarkdownEditor
 * @returns {{from: {line: number, ch: number}, to: {line: number, ch: number}}}
 */
MarkdownEditor.prototype.getCaretPosition = function() {
    return this.cm.cursorCoords();
};

/**
 * Add widget
 * @api
 * @memberOf MarkdownEditor
 * @param {object} selection Selection object
 * @param {HTMLElement} node Widget node
 * @param {string} style Adding style "over" or "bottom"
 * @param {number} offset Adding offset
 */
MarkdownEditor.prototype.addWidget = function(selection, node, style, offset) {
    if (offset) {
        selection.ch += offset;
    }

    this.cm.addWidget(selection.end, node, true, style);
};

/**
 * Replace selection with given replacement content
 * @api
 * @memberOf MarkdownEditor
 * @param {string} content Replacement content text
 * @param {object} selection Selection object
 */
MarkdownEditor.prototype.replaceSelection = function(content, selection) {
    if (selection) {
        this.cm.setSelection(selection.from, selection.to);
    }

    this.cm.replaceSelection(content);
    this.focus();
};

/**
 * Replace selection with replacement content and offset
 * @api
 * @memberOf MarkdownEditor
 * @param {string} content Replacement content text
 * @param {number} offset Offset
 * @param {number} overwriteLength Length to overwrite
 */
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

/**
 * Set Editor height
 * @api
 * @memberOf MarkdownEditor
 * @param {number} height Editor height
 */
MarkdownEditor.prototype.setHeight = function(height) {
    this.$editorContainerEl.height(height);

    if (height === 'auto') {
        this.$editorContainerEl.find('.CodeMirror').height('auto');
    }
};

/**
 * Set cursor position to end
 * @api
 * @memberOf MarkdownEditor
 */
MarkdownEditor.prototype.moveCursorToEnd = function() {
    var doc = this.getEditor().getDoc(),
        lastLine = doc.lastLine();

    doc.setCursor(lastLine, doc.getLine(lastLine).length);
};

/**
 * Set cursor position to start
 * @api
 * @memberOf MarkdownEditor
 */
MarkdownEditor.prototype.moveCursorToStart = function() {
    var doc = this.getEditor().getDoc(),
        firstLine = doc.firstLine();

    doc.setCursor(firstLine, 0);
};

/**
 * Scroll Editor content to Top
 * @api
 * @memberOf MarkdownEditor
 * @param {number} value Scroll amount
 * @returns {number}
 */
MarkdownEditor.prototype.scrollTop = function(value) {
    if (value) {
        this.cm.scrollTo(0, value);
    }

    return this.cm.getScrollInfo().top;
};

/**
 * Get start, end position of current selection
 * @api
 * @memberOf MarkdownEditor
 * @returns {{start: {line: *, ch: *}, end: {line: *, ch: *}}}
 */
MarkdownEditor.prototype.getRange = function() {
    var start = this.getEditor().getCursor('from');
    var end = this.getEditor().getCursor('to');

    return {
        start: {
            line: start.line,
            ch: start.ch
        },
        end: {
            line: end.line,
            ch: end.ch
        }
    };
};

/**
 * Get text object of current range
 * @api
 * @memberOf MarkdownEditor
 * @param {{start, end}} range Range object of each editor
 * @returns {object}
 */
MarkdownEditor.prototype.getTextObject = function(range) {
    return new MdTextObject(this, range);
};

/**
 * Return whether state changed or not
 * @memberOf MarkdownEditor
 * @param {object} previousState Previous state
 * @param {object} currentState Current state
 * @returns {boolean}
 * @private
 */
MarkdownEditor.prototype._isStateChanged = function(previousState, currentState) {
    var result = false;

    tui.util.forEach(currentState, function(currentStateTypeValue, stateType) {
        var isNeedToContinue = true;
        var isStateChanged = previousState[stateType] !== currentStateTypeValue;

        if (isStateChanged) {
            result = true;
            isNeedToContinue = false;
        }

        return isNeedToContinue;
    });

    return result;
};

module.exports = MarkdownEditor;
