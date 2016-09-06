/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


import KeyMapper from './keyMapper';
import MdTextObject from './mdTextObject';

const CodeMirror = window.CodeMirror;
const keyMapper = KeyMapper.getSharedInstance();

/**
 * MarkdownEditor
 * @exports MarkdownEditor
 * @constructor
 * @class MarkdownEditor
 * @param {jQuery} $el element to insert editor
 * @param {EventManager} eventManager EventManager instance
 */
class MarkdownEditor {
    constructor($el, eventManager) {
        this.eventManager = eventManager;
        this.$editorContainerEl = $el;

        /**
         * latest state info
         * @type {object}
         */
        this._latestState = null;
    }

    /**
     * init
     * @api
     * @memberOf WysiwygEditor
     * @param {string} initialValue Editor's initial content
     */
    init(initialValue) {
        const cmTextarea = $('<textarea />');

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
    }

    /**
     * _initEvent
     * Initialize EventManager event handler
     * @memberOf MarkdownEditor
     * @private
     */
    _initEvent() {
        this.cm.getWrapperElement().addEventListener('click', () => {
            this.eventManager.emit('click', {
                source: 'markdown'
            });
        });

        this.cm.on('beforeChange', (cm, ev) => {
            if (ev.origin === 'paste') {
                this.eventManager.emit('pasteBefore', {source: 'markdown', data: ev});
            }
        });

        this.cm.on('change', (cm, cmEvent) => {
            this._emitMarkdownEditorContentChangedEvent();
            this._emitMarkdownEditorChangeEvent(cmEvent);
        });

        this.cm.on('focus', () => {
            this.eventManager.emit('focus', {
                source: 'markdown'
            });
            this.getEditor().refresh();
        });

        this.cm.on('blur', () => {
            this.eventManager.emit('blur', {
                source: 'markdown'
            });
        });

        this.cm.on('scroll', (cm, eventData) => {
            this.eventManager.emit('scroll', {
                source: 'markdown',
                data: eventData
            });
        });

        this.cm.on('keydown', (cm, keyboardEvent) => {
            this.eventManager.emit('keydown', {
                source: 'markdown',
                data: keyboardEvent
            });

            this.eventManager.emit('keyMap', {
                source: 'markdown',
                keyMap: keyMapper.convert(keyboardEvent),
                data: keyboardEvent
            });
        });

        this.cm.on('keyup', (cm, keyboardEvent) => {
            this.eventManager.emit('keyup', {
                source: 'markdown',
                data: keyboardEvent
            });
        });

        this.cm.on('copy', (cm, ev) => {
            this.eventManager.emit('copy', {
                source: 'markdown',
                data: ev
            });
        });

        this.cm.on('cut', (cm, ev) => {
            this.eventManager.emit('cut', {
                source: 'markdown',
                data: ev
            });
        });

        this.cm.on('paste', (cm, clipboardEvent) => {
            this.eventManager.emit('paste', {
                source: 'markdown',
                data: clipboardEvent
            });
        });

        this.cm.on('drop', (cm, eventData) => {
            eventData.preventDefault();

            this.eventManager.emit('drop', {
                source: 'markdown',
                data: eventData
            });
        });

        this.cm.on('cursorActivity', () => {
            const token = this.cm.getTokenAt(this.cm.getCursor());

            const base = token.state.base;
            const overlay = token.state.overlay;

            const state = {
                bold: !!base.strong,
                italic: !!base.em,
                code: !!overlay.code,
                codeBlock: !!overlay.codeBlock,
                quote: !!base.quote,
                list: !!base.list,
                task: !!base.task,
                source: 'markdown'
            };

            if (!this._latestState || this._isStateChanged(this._latestState, state)) {
                this.eventManager.emit('stateChange', state);
                this._latestState = state;
            }
        });
    }

    /**
     * getCurrentRange
     * returns current selection's range
     * @api
     * @memberOf MarkdownEditor
     * @returns {object} selection range
     */
    getCurrentRange() {
        const from = this.cm.getCursor('from'),
            to = this.cm.getCursor('to');

        return {
            from,
            to,
            collapsed: from === to
        };
    }

    /**
     * Set focus to current Editor
     * @api
     * @memberOf MarkdownEditor
     */
    focus() {
        this.cm.focus();
    }

    /**
     * Set focus to current Editor
     * @api
     * @memberOf MarkdownEditor
     */
    blur() {
        this.cm.getInputField().blur();
    }

    /**
     * Remove Editor from document
     * @api
     * @memberOf MarkdownEditor
     */
    remove() {
        this.cm.toTextArea();
    }

    /**
     * Set Editor value
     * @api
     * @memberOf MarkdownEditor
     * @param {string} markdown Markdown syntax text
     */
    setValue(markdown) {
        this.getEditor().setValue(markdown);
        this._emitMarkdownEditorContentChangedEvent();
        this.moveCursorToEnd();
        this.getEditor().refresh();
    }

    /**
     * Get editor value
     * @api
     * @memberOf MarkdownEditor
     * @returns {string}
     */
    getValue() {
        return this.cm.getValue('\n');
    }

    /**
     * Get CodeMirror instance
     * @api
     * @memberOf MarkdownEditor
     * @returns {CodeMirror}
     */
    getEditor() {
        return this.cm;
    }

    /**
     * Reset Editor
     * @api
     * @memberOf MarkdownEditor
     */
    reset() {
        this.setValue('');
    }

    /**
     * Emit contentChangedFromMarkdown event
     * @memberOf MarkdownEditor
     * @private
     */
    _emitMarkdownEditorContentChangedEvent() {
        this.eventManager.emit('contentChangedFromMarkdown', this);
    }

    /**
     * Clone CodeMirror event object
     * @memberOf MarkdownEditor
     * @param {event} e Event object
     * @returns {{from: {line: number, ch: number}, to: {line: number, ch: number}}}
     * @private
     */
    _cloneCMEventObject(e) {
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
    }

    /**
     * Emit changeEvent
     * @memberOf MarkdownEditor
     * @param {event} e Event object
     * @private
     */
    _emitMarkdownEditorChangeEvent(e) {
        if (e.origin !== 'setValue') {
            const eventObj = {
                source: 'markdown'
            };

            this.eventManager.emit('changeFromMarkdown', eventObj);
            this.eventManager.emit('change', eventObj);
        }
    }

    /**
     * Get current caret position
     * @api
     * @memberOf MarkdownEditor
     * @returns {{from: {line: number, ch: number}, to: {line: number, ch: number}}}
     */
    getCaretPosition() {
        return this.cm.cursorCoords();
    }

    /**
     * Add widget
     * @api
     * @memberOf MarkdownEditor
     * @param {object} selection Selection object
     * @param {HTMLElement} node Widget node
     * @param {string} style Adding style "over" or "bottom"
     * @param {number} offset Adding offset
     */
    addWidget(selection, node, style, offset) {
        if (offset) {
            selection.ch += offset;
        }

        this.cm.addWidget(selection.end, node, true, style);
    }

    /**
     * Replace selection with given replacement content
     * @api
     * @memberOf MarkdownEditor
     * @param {string} content Replacement content text
     * @param {object} selection Selection object
     */
    replaceSelection(content, selection) {
        if (selection) {
            this.cm.setSelection(selection.from, selection.to);
        }

        this.cm.replaceSelection(content);
        this.focus();
    }

    /**
     * Replace selection with replacement content and offset
     * @api
     * @memberOf MarkdownEditor
     * @param {string} content Replacement content text
     * @param {number} offset Offset
     * @param {number} overwriteLength Length to overwrite
     */
    replaceRelativeOffset(content, offset, overwriteLength) {
        const cursor = this.cm.getCursor(),
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
    }

    /**
     * Set Editor height
     * @api
     * @memberOf MarkdownEditor
     * @param {number} height Editor height
     */
    setHeight(height) {
        this.$editorContainerEl.height(height);

        if (height === 'auto') {
            this.$editorContainerEl.find('.CodeMirror').height('auto');
        }
    }

    /**
     * Set cursor position to end
     * @api
     * @memberOf MarkdownEditor
     */
    moveCursorToEnd() {
        const doc = this.getEditor().getDoc(),
            lastLine = doc.lastLine();

        doc.setCursor(lastLine, doc.getLine(lastLine).length);
    }

    /**
     * Set cursor position to start
     * @api
     * @memberOf MarkdownEditor
     */
    moveCursorToStart() {
        const doc = this.getEditor().getDoc(),
            firstLine = doc.firstLine();

        doc.setCursor(firstLine, 0);
    }

    /**
     * Scroll Editor content to Top
     * @api
     * @memberOf MarkdownEditor
     * @param {number} value Scroll amount
     * @returns {number}
     */
    scrollTop(value) {
        if (value) {
            this.cm.scrollTo(0, value);
        }

        return this.cm.getScrollInfo().top;
    }

    /**
     * Get start, end position of current selection
     * @api
     * @memberOf MarkdownEditor
     * @returns {{start: {line: *, ch: *}, end: {line: *, ch: *}}}
     */
    getRange() {
        const start = this.getEditor().getCursor('from');
        const end = this.getEditor().getCursor('to');

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
    }

    /**
     * Get text object of current range
     * @api
     * @memberOf MarkdownEditor
     * @param {{start, end}} range Range object of each editor
     * @returns {object}
     */
    getTextObject(range) {
        return new MdTextObject(this, range);
    }

    /**
     * Return whether state changed or not
     * @memberOf MarkdownEditor
     * @param {object} previousState Previous state
     * @param {object} currentState Current state
     * @returns {boolean}
     * @private
     */
    _isStateChanged(previousState, currentState) {
        let result = false;

        tui.util.forEach(currentState, (currentStateTypeValue, stateType) => {
            result = previousState[stateType] !== currentStateTypeValue;

            return !result;
        });

        return result;
    }
}

module.exports = MarkdownEditor;
