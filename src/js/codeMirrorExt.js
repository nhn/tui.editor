/**
 * @fileoverview Implements CodeBlockExt
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import CodeMirror from 'codemirror';

import './codemirror/fixOrderedListNumber';
import './codemirror/overlay';
import './codemirror/markdown';
import './codemirror/gfm';
import './codemirror/continuelist';
import './codemirror/arrowKeyFunction';

/**
 * Class CodeMirrorExt
 */
class CodeMirrorExt {
  /**
   * Creates an instance of CodeMirrorExt.
   * @param {HTMLElement} el - container jquery element
   * @param {Object} [options={}] - codeMirror options
   * @memberof CodeMirrorExt
   */
  constructor(el, options = {}) {
    this.editorContainerEl = el;

    /**
     * @memberof CodeMirrorExt
     * @protected
     * @member
     */
    this.cm = null;

    this._init(options);
  }

  /**
   * init
   * @param {Object} options - codeMirror option
   * @memberof CodeMirrorExt
   * @private
   */
  _init(options) {
    const cmTextarea = document.createElement('textarea');
    this.editorContainerEl.appendChild(cmTextarea);

    options = $.extend(true, {
      lineWrapping: true,
      theme: 'default',
      extraKeys: {
        'Shift-Tab': 'indentLess',
        'Alt-Up': 'replaceLineTextToUpper',
        'Alt-Down': 'replaceLineTextToLower'
      },
      indentUnit: 4
    }, options);

    this.cm = CodeMirror.fromTextArea(cmTextarea, options);
  }

  /**
   * getCurrentRange
   * @memberof CodeMirrorExt
   * @returns {Object} - selection range
   */
  getCurrentRange() {
    const from = this.cm.getCursor('from');
    const to = this.cm.getCursor('to');

    return {
      from,
      to,
      collapsed: from.line === to.line && from.ch === to.ch
    };
  }

  /**
   * Set focus to current Editor
   * @memberof CodeMirrorExt
   */
  focus() {
    this.cm.focus();
  }

  /**
   * blur focus to current Editor
   * @memberof CodeMirrorExt
   */
  blur() {
    this.cm.getInputField().blur();
  }

  /**
   * Remove Editor from document
   * @memberof CodeMirrorExt
   */
  remove() {
    this.cm.toTextArea();
  }

  /**
   * Set Editor value
   * @memberof CodeMirrorExt
   * @param {string} markdown - Markdown syntax text
   * @param {boolean} [cursorToEnd=true] - move cursor to contents end
   */
  setValue(markdown, cursorToEnd = true) {
    this.cm.setValue(markdown);
    if (cursorToEnd) {
      this.moveCursorToEnd();
    }
    this.cm.refresh();
  }

  /**
   * Get editor value
   * @memberof CodeMirrorExt
   * @returns {string} - codeMirror text value
   */
  getValue() {
    return this.cm.getValue('\n');
  }

  /**
   * Get CodeMirror instance
   * @memberof CodeMirrorExt
   * @returns {CodeMirror}
   */
  getEditor() {
    return this.cm;
  }

  /**
   * Reset Editor
   * @memberof CodeMirrorExt
   */
  reset() {
    this.setValue('');
  }

  /**
   * Get current caret position
   * @memberof CodeMirrorExt
   * @returns {{from: {line: number, ch: number}, to: {line: number, ch: number}}}
   */
  getCaretPosition() {
    return this.cm.cursorCoords();
  }

  /**
   * Add widget
   * @memberof CodeMirrorExt
   * @param {object} selection - Selection object
   * @param {HTMLElement} node - Widget node
   * @param {string} style - Adding style "over" or "bottom"
   * @param {number} offset - Adding offset
   */
  addWidget(selection, node, style, offset) {
    if (offset) {
      selection.ch += offset;
    }

    this.cm.addWidget(selection.end, node, true, style);
  }

  /**
   * Replace selection with given replacement content
   * @memberof CodeMirrorExt
   * @param {string} content - Replacement content text
   * @param {object} selection - Selection object
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
   * @memberof CodeMirrorExt
   * @param {string} content - Replacement content text
   * @param {number} offset - Offset
   * @param {number} overwriteLength - Length to overwrite
   */
  replaceRelativeOffset(content, offset, overwriteLength) {
    const cursor = this.cm.getCursor();
    const selection = {
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
   * @memberof CodeMirrorExt
   * @param {number} height - Editor height
   */
  setHeight(height) {
    const contentWrapper = this.getWrapperElement();

    contentWrapper.style.height = `${height}px`;
  }

  /**
   * set min height
   * @param {number} minHeight - min height
   * @memberof CodeMirrorExt
   */
  setMinHeight(minHeight) {
    const contentWrapper = this.getWrapperElement();

    contentWrapper.style.minHeight = `${minHeight}px`;
  }

  /**
   * get code mirror wrapper element
   * @returns {HTMLElement} - code mirror wrapper element
   * @memberof CodeMirrorExt
   */
  getWrapperElement() {
    return this.cm.getWrapperElement();
  }

  /**
   * get code mirror cursor
   * @param {string} [start='head'] - which end of the selection. 'from'|'to'|'head'|'anchor'
   * @returns {Cursor} - code mirror cursor
   * @memberof CodeMirrorExt
   */
  getCursor(start) {
    return this.cm.getCursor(start);
  }

  /**
   * Set cursor position to end
   * @memberof CodeMirrorExt
   */
  moveCursorToEnd() {
    const doc = this.getEditor().getDoc();
    const lastLine = doc.lastLine();

    doc.setCursor(lastLine, doc.getLine(lastLine).length);
  }

  /**
   * Set cursor position to start
   * @memberof CodeMirrorExt
   */
  moveCursorToStart() {
    const doc = this.getEditor().getDoc();
    const firstLine = doc.firstLine();

    doc.setCursor(firstLine, 0);
  }

  /**
   * Scroll Editor content to Top
   * @memberof CodeMirrorExt
   * @param {number} value - Scroll amount
   * @returns {number} - changed scroll top
   */
  scrollTop(value) {
    if (value) {
      this.cm.scrollTo(0, value);
    }

    return this.cm.getScrollInfo().top;
  }

  /**
   * Get start, end position of current selection
   * @memberof CodeMirrorExt
   * @returns {{start: {line: *, ch: *}, end: {line: *, ch: *}}}
   */
  getRange() {
    const start = this.cm.getCursor('from');
    const end = this.cm.getCursor('to');

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
   * add codemirror event handler
   * @param {string} type - event type
   * @param {function} func - handler function
   * @memberof CodeMirrorExt
   */
  on(type, func) {
    this.cm.on(type, func);
  }

  /**
   * remove codemirror event handler
   * @param {string} type - event type
   * @param {function} func - handler function
   * @memberof CodeMirrorExt
   */
  off(type, func) {
    this.cm.off(type, func);
  }
}

export default CodeMirrorExt;
