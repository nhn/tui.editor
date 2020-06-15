/**
 * @fileoverview Implments wysiwygEditor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';
import forEachArray from 'tui-code-snippet/collection/forEachArray';
import isUndefined from 'tui-code-snippet/type/isUndefined';
import isNumber from 'tui-code-snippet/type/isNumber';
import isArray from 'tui-code-snippet/type/isArray';
import browser from 'tui-code-snippet/browser/browser';
import debounce from 'tui-code-snippet/tricks/debounce';
import css from 'tui-code-snippet/domUtil/css';
import addClass from 'tui-code-snippet/domUtil/addClass';
import on from 'tui-code-snippet/domEvent/on';
import off from 'tui-code-snippet/domEvent/off';

import domUtils from './utils/dom';
import WwClipboardManager from './wwClipboardManager';
import WwListManager from './wwListManager';
import WwTaskManager from './wwTaskManager';
import WwTableManager from './wwTableManager';
import WwTableSelectionManager from './wwTableSelectionManager';
import WwHrManager from './wwHrManager';
import WwPManager from './wwPManager';
import WwHeadingManager from './wwHeadingManager';
import WwCodeBlockManager from './wwCodeBlockManager';
import SquireExt from './squireExt';
import KeyMapper from './keyMapper';
import WwTextObject from './wwTextObject';
import ComponentManager from './componentManager';
import CodeBlockGadget from './ui/codeBlockGadget';

const keyMapper = KeyMapper.getSharedInstance();

const FIND_EMPTY_LINE = /<([a-z]+|h\d)>(<br>|<br \/>)<\/\1>/gi;
const FIND_UNNECESSARY_BR = /(?:<br>|<br \/>)<\/(.+?)>/gi;
const FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD|PRE)\b/;
const FIND_OPENING_SPAN_WITH_SPACE = /<span([^>]*)>[\u0020]/g;
const FIND_CLOSING_SPAN_WITH_SPACE = /[\u0020]<\/span>/g;
const FIND_TABLE_AND_HEADING_RX = /^(TABLE|H[1-6])$/;

const EDITOR_CONTENT_CSS_CLASSNAME = 'tui-editor-contents';
const PLACEHOLDER_CSS_CLASSNAME = 'tui-editor-contents-placeholder';

const canObserveMutations = typeof MutationObserver !== 'undefined';

/**
 * Class WysiwygEditor
 * @param {HTMLElement} el - element to insert editor
 * @param {EventManager} eventManager - EventManager instance
 */
class WysiwygEditor {
  constructor(el, eventManager, options = {}) {
    this.componentManager = new ComponentManager(this);
    this.eventManager = eventManager;
    this.editorContainerEl = el;

    this._height = 0;
    this._silentChange = false;

    this._keyEventHandlers = {};
    this._managers = {};
    this._linkAttribute = options.linkAttribute || {};
    this._sanitizer = options.sanitizer;

    this._initEvent();
    this._initDefaultKeyEventHandler();

    this.debouncedPostProcessForChange = debounce(() => this.postProcessForChange(), 0);
  }

  /**
   * init
   */
  init() {
    const editorBody = document.createElement('div');

    this.editorContainerEl.appendChild(editorBody);

    this.editor = new SquireExt(editorBody, {
      blockTag: 'DIV',
      leafNodeNames: {
        HR: false
      },
      allowedBlocks: this._sanitizer ? [] : ['details', 'summary']
    });
    this.editor.blockCommandShortcuts();

    this._clipboardManager = new WwClipboardManager(this);
    this._initSquireEvent();
    this._clipboardManager.init();

    addClass(this.getBody(), EDITOR_CONTENT_CSS_CLASSNAME);
    css(this.editorContainerEl, 'position', 'relative');
    this._togglePlaceholder();

    this.codeBlockGadget = new CodeBlockGadget({
      eventManager: this.eventManager,
      container: this.editorContainerEl,
      wysiwygEditor: this
    });
  }

  /**
   * Initialize EventManager event handler
   * @private
   */
  _initEvent() {
    this.eventManager.listen('wysiwygKeyEvent', ev =>
      this._runKeyEventHandlers(ev.data, ev.keyMap)
    );
    this.eventManager.listen('wysiwygRangeChangeAfter', () => this.scrollIntoCursor());
    this.eventManager.listen('contentChangedFromWysiwyg', () => {
      this._togglePlaceholder();
    });
  }

  /**
   * Add key event handler
   * @param {string|Array.<string>} keyMap - keyMap string or array of string
   * @param {function} handler handler
   */
  addKeyEventHandler(keyMap, handler) {
    if (!handler) {
      handler = keyMap;
      keyMap = 'DEFAULT';
    }

    if (!isArray(keyMap)) {
      keyMap = [keyMap];
    }

    keyMap.forEach(key => {
      if (!this._keyEventHandlers[key]) {
        this._keyEventHandlers[key] = [];
      }
      this._keyEventHandlers[key].push(handler);
    });
  }

  /**
   * Remove key event handler.
   * @param {string} keyMap keyMap string
   * @param {function} handler handler
   */
  removeKeyEventHandler(keyMap, handler) {
    if (!handler) {
      handler = keyMap;
      keyMap = 'DEFAULT';
    }

    const handlers = this._keyEventHandlers[keyMap];

    if (handlers) {
      this._keyEventHandlers[keyMap] = handlers.filter(_handler => _handler !== handler);
    }
  }

  /**
   * Run key event handler
   * @param {Event} event event object
   * @param {string} keyMap keyMapString
   * @private
   */
  _runKeyEventHandlers(event, keyMap) {
    const range = this.getRange();
    let handlers, isNeedNext;

    handlers = this._keyEventHandlers.DEFAULT;

    if (handlers) {
      forEachArray(handlers, handler => {
        isNeedNext = handler(event, range, keyMap);

        return isNeedNext;
      });
    }

    handlers = this._keyEventHandlers[keyMap];

    if (handlers && isNeedNext !== false) {
      forEachArray(handlers, handler => handler(event, range, keyMap));
    }
  }

  /**
   * Initialize squire event
   * @private
   */
  _initSquireEvent() {
    const squire = this.getEditor();
    let isNeedFirePostProcessForRangeChange = false;

    squire.addEventListener('copy', clipboardEvent => {
      this.eventManager.emit('copy', {
        source: 'wysiwyg',
        data: clipboardEvent
      });
      debounce(() => {
        if (!this.isEditorValid()) {
          return;
        }

        this.eventManager.emit('copyAfter', {
          source: 'wysiwyg',
          data: clipboardEvent
        });
      })();
    });

    squire.addEventListener(browser.msie ? 'beforecut' : 'cut', clipboardEvent => {
      this.eventManager.emit('cut', {
        source: 'wysiwyg',
        data: clipboardEvent
      });
      debounce(() => {
        if (!this.isEditorValid()) {
          return;
        }

        this.eventManager.emit('cutAfter', {
          source: 'wysiwyg',
          data: clipboardEvent
        });
      })();
    });

    squire.addEventListener(browser.msie ? 'beforepaste' : 'paste', clipboardEvent => {
      this.eventManager.emit('paste', {
        source: 'wysiwyg',
        data: clipboardEvent
      });
    });

    squire.addEventListener('dragover', ev => {
      ev.preventDefault();

      return false;
    });

    squire.addEventListener('drop', ev => {
      ev.preventDefault();

      this.eventManager.emit('drop', {
        source: 'wysiwyg',
        data: ev
      });

      return false;
    });

    // change event will fired after range has been updated
    squire.addEventListener(
      'input',
      debounce(() => {
        if (!this.isEditorValid()) {
          return;
        }

        if (!this._silentChange) {
          const eventObj = {
            source: 'wysiwyg'
          };

          this.eventManager.emit('changeFromWysiwyg', eventObj);
          this.eventManager.emit('change', eventObj);
          this.eventManager.emit('contentChangedFromWysiwyg', this);
        } else {
          this._silentChange = false;
        }

        this.getEditor().preserveLastLine();
      }, 0)
    );

    squire.addEventListener('keydown', keyboardEvent => {
      const range = this.getEditor().getSelection();

      if (!range.collapsed) {
        isNeedFirePostProcessForRangeChange = true;
      }

      this.eventManager.emit('keydown', {
        source: 'wysiwyg',
        data: keyboardEvent
      });

      this._onKeyDown(keyboardEvent);
    });

    if (browser.firefox) {
      squire.addEventListener('keypress', keyboardEvent => {
        const { keyCode } = keyboardEvent;

        if (keyCode === 13 || keyCode === 9) {
          const range = this.getEditor().getSelection();

          if (!range.collapsed) {
            isNeedFirePostProcessForRangeChange = true;
          }

          this.eventManager.emit('keydown', {
            source: 'wysiwyg',
            data: keyboardEvent
          });

          this._onKeyDown(keyboardEvent);
        }
      });

      // firefox produces shattered text nodes
      squire.addEventListener('keyup', () => {
        const range = this.getRange();

        if (
          domUtils.isTextNode(range.commonAncestorContainer) &&
          domUtils.isTextNode(range.commonAncestorContainer.previousSibling)
        ) {
          const prevLen = range.commonAncestorContainer.previousSibling.length;
          const curEl = range.commonAncestorContainer;

          range.commonAncestorContainer.previousSibling.appendData(
            range.commonAncestorContainer.data
          );

          range.setStart(
            range.commonAncestorContainer.previousSibling,
            prevLen + range.startOffset
          );
          range.collapse(true);

          domUtils.remove(curEl);

          this.setRange(range);
          range.detach();
        }
      });
    }

    squire.addEventListener('keyup', keyboardEvent => {
      if (isNeedFirePostProcessForRangeChange) {
        this.debouncedPostProcessForChange();
        isNeedFirePostProcessForRangeChange = false;
      }

      this.eventManager.emit('keyup', {
        source: 'wysiwyg',
        data: keyboardEvent
      });
    });

    on(this.editorContainerEl, 'scroll', ev => {
      this.eventManager.emit('scroll', {
        source: 'wysiwyg',
        data: ev
      });
    });

    squire.addEventListener('click', ev => {
      this.eventManager.emit('click', {
        source: 'wysiwyg',
        data: ev
      });
    });

    squire.addEventListener('mousedown', ev => {
      this.eventManager.emit('mousedown', {
        source: 'wysiwyg',
        data: ev
      });
    });

    squire.addEventListener('mouseover', ev => {
      this.eventManager.emit('mouseover', {
        source: 'wysiwyg',
        data: ev
      });
    });

    squire.addEventListener('mouseout', ev => {
      this.eventManager.emit('mouseout', {
        source: 'wysiwyg',
        data: ev
      });
    });

    squire.addEventListener('mouseup', ev => {
      this.eventManager.emit('mouseup', {
        source: 'wysiwyg',
        data: ev
      });
    });

    squire.addEventListener('contextmenu', ev => {
      this.eventManager.emit('contextmenu', {
        source: 'wysiwyg',
        data: ev
      });
    });

    squire.addEventListener('focus', () => {
      this.eventManager.emit('focus', {
        source: 'wysiwyg'
      });
    });

    squire.addEventListener('blur', () => {
      this.fixIMERange();
      this.eventManager.emit('blur', {
        source: 'wysiwyg'
      });
    });

    // Toolbar status active/inactive
    squire.addEventListener('pathChange', data => {
      const state = {
        strong: /(^B>|>B$|>B>|^B$|STRONG)/.test(data.path),
        emph: /(>I|>EM|^I$|^EM$)/.test(data.path),
        strike: /(^S>|>S$|>S>|^S$|DEL)/.test(data.path),
        code: /CODE/.test(data.path),
        codeBlock: /PRE/.test(data.path),
        blockQuote: /BLOCKQUOTE/.test(data.path),
        table: /TABLE/.test(data.path),
        heading: /H[1-6]/.test(data.path),
        list: /UL>LI(?!.task-list-item)/.test(data.path),
        orderedList: /OL>LI(?!.task-list-item)/.test(data.path),
        taskList: /[UL|OL]>LI.task-list-item/.test(data.path),
        source: 'wysiwyg'
      };

      this.eventManager.emit('stateChange', state);
    });

    squire.addEventListener('willPaste', ev => {
      // ev has 'fragment' when event occurs from 'insertHTML' of squire
      // ev has 'text' when event occurs from 'insertPlainText' of squire
      if (ev.fragment) {
        this.eventManager.emit('willPaste', {
          source: 'wysiwyg',
          data: ev
        });
      }
    });
  }

  _togglePlaceholder() {
    const squire = this.getEditor();

    squire.modifyDocument(() => {
      const root = squire.getRoot();

      if (root.textContent || root.childNodes.length > 1) {
        root.classList.remove(PLACEHOLDER_CSS_CLASSNAME);
      } else {
        root.classList.add(PLACEHOLDER_CSS_CLASSNAME);
      }
    });
  }

  /**
   * Handler of keydown event
   * @param {object} keyboardEvent Event object
   * @private
   */
  _onKeyDown(keyboardEvent) {
    const keyMap = keyMapper.convert(keyboardEvent);

    // to avoid duplicate event firing in firefox
    if (keyboardEvent.keyCode) {
      this.eventManager.emit('keyMap', {
        source: 'wysiwyg',
        keyMap,
        data: keyboardEvent
      });

      if (!keyboardEvent.defaultPrevented) {
        this.eventManager.emit('wysiwygKeyEvent', {
          keyMap,
          data: keyboardEvent
        });
      }
    }
  }

  /**
   * Initialize default event handler
   * @private
   */
  _initDefaultKeyEventHandler() {
    this.addKeyEventHandler('ENTER', (ev, range) => {
      if (this._isInOrphanText(range)) {
        // We need this cuz input text right after table make orphan text in webkit
        this.defer(() => {
          this._wrapDefaultBlockToOrphanTexts();
          this.breakToNewDefaultBlock(range, 'before');
        });
      }

      this.defer(() => this.scrollIntoCursor());
    });

    this.addKeyEventHandler('TAB', ev => {
      const sq = this.getEditor();
      const range = sq.getSelection();
      const isAbleToInput4Spaces =
        range.collapsed && this._isCursorNotInRestrictedAreaOfTabAction(sq);
      const isTextSelection =
        !range.collapsed && domUtils.isTextNode(range.commonAncestorContainer);

      ev.preventDefault();
      if (isAbleToInput4Spaces || isTextSelection) {
        sq.insertPlainText('\u00a0\u00a0\u00a0\u00a0');

        return false;
      }

      return true;
    });

    this.addKeyEventHandler('BACK_SPACE', (ev, range, keymap) =>
      this._handleRemoveKeyEvent(ev, range, keymap)
    );
    this.addKeyEventHandler('DELETE', (ev, range, keymap) =>
      this._handleRemoveKeyEvent(ev, range, keymap)
    );
  }

  _handleRemoveKeyEvent(ev, range, keyMap) {
    const sq = this.getEditor();

    if (this._isStartHeadingOrTableAndContainsThem(range)) {
      const keyStr = keyMap === 'BACK_SPACE' ? 'backspace' : 'delete';

      sq.removeAllFormatting();
      sq._keyHandlers[keyStr](sq, ev, sq.getSelection());
      sq.removeLastUndoStack();

      return false;
    }

    return true;
  }

  _isStartHeadingOrTableAndContainsThem(range) {
    const { startContainer, startOffset, commonAncestorContainer, collapsed } = range;
    const root = this.getEditor().getRoot();
    let result = false;

    if (!collapsed && commonAncestorContainer === root) {
      if (startContainer === root) {
        result = FIND_TABLE_AND_HEADING_RX.test(
          domUtils.getChildNodeByOffset(startContainer, startOffset).nodeName
        );
      } else if (startOffset === 0) {
        result = FIND_TABLE_AND_HEADING_RX.test(
          domUtils.getParentUntil(startContainer, root).nodeName
        );
      }
    }

    return result;
  }

  _wrapDefaultBlockToOrphanTexts() {
    const textNodes = toArray(this.getBody().childNodes).filter(node => domUtils.isTextNode(node));

    domUtils.getAllTextNode(this.getBody());

    textNodes.forEach(node => {
      if (node.nextSibling && node.nextSibling.tagName === 'BR') {
        domUtils.remove(node.nextSibling);
      }

      domUtils.wrap(node, document.createElement('div'));
    });
  }

  /**
   * check if range is orphan text
   * @param {Range} range range
   * @returns {boolean} result
   * @private
   */
  _isInOrphanText(range) {
    return (
      range.startContainer.nodeType === Node.TEXT_NODE &&
      range.startContainer.parentNode === this.getBody()
    );
  }

  /**
   * Wrap default block to passed range
   * @param {Range} range range
   * @private
   */
  _wrapDefaultBlockTo(range) {
    this.saveSelection(range);
    this._joinSplitedTextNodes();
    this.restoreSavedSelection();

    range = this.getRange();

    const textElem = range.startContainer;
    const cursorOffset = range.startOffset;

    // after code below, range range is arranged by body
    const block = this.getEditor().createDefaultBlock([range.startContainer]);

    // range for insert block
    const insertTargetNode = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset);

    if (insertTargetNode) {
      range.setStartBefore(insertTargetNode);
    } else {
      // only child in container
      range.selectNodeContents(range.startContainer);
    }

    range.collapse(true);

    range.insertNode(block);

    // revert range to original node
    range.setStart(textElem, cursorOffset);
    range.collapse(true);

    this.setRange(range);
  }

  /**
   * Join spliated text nodes
   * @private
   */
  _joinSplitedTextNodes() {
    let prevNode, lastGroup;
    const nodesToRemove = [];
    const textNodes = toArray(this.getBody().childNodes).filter(node => domUtils.isTextNode(node));

    textNodes.forEach(node => {
      if (prevNode === node.previousSibling) {
        lastGroup.nodeValue += node.nodeValue;
        nodesToRemove.push(node);
      } else {
        lastGroup = node;
      }

      prevNode = node;
    });

    domUtils.remove(nodesToRemove);
  }

  /**
   * Save current selection before modification
   * @param {Range} range Range object
   */
  saveSelection(range) {
    if (!range) {
      range = this.getRange();
    }

    this.getEditor()._saveRangeToBookmark(range);
  }

  /**
   * set selection by start/end container/offset
   * @param {HTMLNode} startContainer - start container
   * @param {Number} startOffset - start offset
   * @param {HTMLNode} endContainer - end container
   * @param {Number} endOffset - end offset
   * @returns {Range} - range instance
   */
  setSelectionByContainerAndOffset(startContainer, startOffset, endContainer, endOffset) {
    const sq = this.getEditor();
    const range = sq.getSelection();

    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
    sq.setSelection(range);

    return range;
  }

  /**
   * Restore saved selection
   */
  restoreSavedSelection() {
    this.setRange(this.getEditor()._getRangeAndRemoveBookmark());
  }

  /**
   * Reset wysiwyg editor
   */
  reset() {
    this.setValue('');
  }

  /**
   * Change current range block format to passed tag
   * @param {string} targetTagName Target element tag name
   */
  changeBlockFormatTo(targetTagName) {
    this.getEditor().changeBlockFormatTo(targetTagName);
    this.eventManager.emit('wysiwygRangeChangeAfter', this);
  }

  /**
   * Make empty block to current selection
   */
  makeEmptyBlockCurrentSelection() {
    this.getEditor().modifyBlocks(frag => {
      if (!frag.textContent) {
        frag = this.getEditor().createDefaultBlock();
      }

      return frag;
    });
  }

  /**
   * Focus to editor
   */
  focus() {
    const scrollTop = this.scrollTop();

    this.editor.focus();

    // In webkit, if contenteditable element focus method have been invoked when another input element has focus,
    // contenteditable scroll to top automatically so we need scroll it back
    if (scrollTop !== this.scrollTop()) {
      this.scrollTop(scrollTop);
    }
  }

  /**
   * Remove focus of editor
   */
  blur() {
    this.editor.blur();
  }

  /**
   * Remove wysiwyg editor
   */
  remove() {
    off(this.editorContainerEl, 'scroll');
    this.getEditor().destroy();
    this.editor = null;
    this.body = null;
    this.eventManager = null;
  }

  /**
   * Set editor height
   * @param {number|string} height pixel of height or "auto"
   */
  setHeight(height) {
    this._height = height;

    css(this.editorContainerEl, {
      overflow: 'auto',
      height: '100%'
    });
    css(this.editorContainerEl.parentNode, { height: isNumber(height) ? `${height}px` : height });

    const containerStyles = this.editorContainerEl.style;
    const bodyStyles = this.getBody().style;

    const paddingHeight =
      parseInt(containerStyles.paddingTop, 10) - parseInt(containerStyles.paddingBottom, 10);
    const marginHeight = parseInt(bodyStyles.marginTop, 10) - parseInt(bodyStyles.marginBottom, 10);

    css(this.getBody(), { minHeight: `${height - marginHeight - paddingHeight}px` });
  }

  /**
   * Set min height
   * @param {number} minHeight - min height in px
   */
  setMinHeight(minHeight) {
    const editorBody = this.getBody();

    css(editorBody, 'minHeight', `${minHeight}px`);
  }

  /**
   * Set the placeholder to wysiwyg editor
   * @param {string} placeholder - placeholder to set
   */
  setPlaceholder(placeholder) {
    if (placeholder) {
      this.getEditor()
        .getRoot()
        .setAttribute('data-placeholder', placeholder);
    }
  }

  /**
   * Get attribute of link for wysiwyg
   * @returns {object} attribute - attribute of anchor tag
   */
  getLinkAttribute() {
    return this._linkAttribute;
  }

  /**
   * Set value to wysiwyg editor
   * @param {string} html - HTML text
   * @param {boolean} [cursorToEnd=true] - move cursor to contents end
   */
  setValue(html, cursorToEnd = true) {
    html = this.eventManager.emitReduce('wysiwygSetValueBefore', html);

    this.editor.setHTML(html);

    this.eventManager.emit('wysiwygSetValueAfter', this);
    this.eventManager.emit('contentChangedFromWysiwyg', this);

    if (cursorToEnd) {
      this.moveCursorToEnd();
    }

    this.getEditor().preserveLastLine();

    this.getEditor().removeLastUndoStack();
    this.getEditor().saveUndoState();
  }

  /**
   * Insert given text to cursor position or selected area
   * @param {string} text - text string to insert
   */
  insertText(text) {
    this.editor.insertPlainText(text);
  }

  /**
   * Get value of wysiwyg editor
   * @returns {string} html
   */
  getValue() {
    this._prepareGetHTML();

    let html = this.editor.getHTML();

    // empty line replace to br
    html = html.replace(FIND_EMPTY_LINE, (match, tag) => {
      let result;

      // we maintain empty list
      if (tag === 'li') {
        result = match;
        // we maintain empty table
      } else if (tag === 'td' || tag === 'th') {
        result = `<${tag}></${tag}>`;
      } else {
        result = '<br />';
      }

      return result;
    });

    // replace a space of the first and end in sapn tag to &nbsp;.
    html = html.replace(FIND_OPENING_SPAN_WITH_SPACE, '<span$1>&nbsp;');
    html = html.replace(FIND_CLOSING_SPAN_WITH_SPACE, '&nbsp;</span>');

    // remove unnecessary brs
    html = html.replace(FIND_UNNECESSARY_BR, '</$1>');

    // remove contenteditable block, in this case div
    html = html.replace(/<div[^>]*>/g, '');
    html = html.replace(/<\/div>/g, '<br />');

    html = this.eventManager.emitReduce('wysiwygProcessHTMLText', html);

    return html;
  }

  /**
   * Prepare before get html
   * @private
   */
  _prepareGetHTML() {
    this.getEditor().modifyDocument(() => {
      this._joinSplitedTextNodes();
      this.eventManager.emit('wysiwygGetValueBefore', this);
    });
  }

  /**
   * postProcessForChange
   */
  postProcessForChange() {
    if (!this.isEditorValid()) {
      return;
    }

    this.getEditor().modifyDocument(() => {
      this.eventManager.emit('wysiwygRangeChangeAfter', this);
    });
  }

  /**
   * Ready to silent change
   */
  readySilentChange() {
    if (canObserveMutations && !this.getEditor().isIgnoreChange()) {
      this._silentChange = true;
    }
  }

  /**
   * Get squire
   * @returns {SquireExt} squire
   */
  getEditor() {
    return this.editor;
  }

  /**
   * Replace text of passed range
   * @param {string} content Content for change current selection
   * @param {Range} range range
   */
  replaceSelection(content, range) {
    this.getEditor().replaceSelection(content, range);
  }

  /**
   * Replace content by relative offset
   * @param {string} content Content for change current selection
   * @param {number} offset Offset of current range
   * @param {number} overwriteLength Length to overwrite content
   */
  replaceRelativeOffset(content, offset, overwriteLength) {
    this.getEditor().replaceRelativeOffset(content, offset, overwriteLength);
  }

  /**
   * Add widget to selection
   * @param {Range} range Range object
   * @param {Node} node Widget node
   * @param {string} style Adding style "over" or "bottom"
   * @param {number} [offset] Offset to adjust position
   */
  addWidget(range, node, style, offset) {
    const pos = this.getEditor().getSelectionPosition(range, style, offset);
    const editorContainerPos = domUtils.getOffset(this.editorContainerEl);

    this.editorContainerEl.appendChild(node);

    css(node, {
      position: 'absolute',
      top: `${pos.top - editorContainerPos.top + this.scrollTop()}px`,
      left: `${pos.left - editorContainerPos.left}px`
    });
  }

  /**
   * Get body container of Squire
   * @returns {HTMLElement} body element
   */
  getBody() {
    return this.getEditor().getBody();
  }

  /**
   * Check with given regexp whether current path has some format or not
   * @param {RegExp} rx Regexp
   * @returns {boolean} Match result
   */
  hasFormatWithRx(rx) {
    return this.getEditor()
      .getPath()
      .match(rx);
  }

  /**
   * Break line to new default block from passed range
   * @param {Range} range Range object
   * @param {string} [where] "before" or not
   */
  breakToNewDefaultBlock(range, where) {
    const div = this.editor.createDefaultBlock();
    const currentNode =
      domUtils.getChildNodeByOffset(range.startContainer, range.startOffset) ||
      domUtils.getChildNodeByOffset(range.startContainer, range.startOffset - 1);
    const appendBefore = domUtils.getParentUntil(currentNode, this.getBody());

    if (where === 'before') {
      domUtils.insertBefore(div, appendBefore);
    } else {
      domUtils.insertAfter(div, appendBefore);
    }

    range.setStart(div, 0);
    range.collapse(true);
    this.setRange(range);
  }

  /**
   * Replace textContet of node
   * @param {Node} container Container node
   * @param {string} from Target text to change
   * @param {string} to Replacement text
   */
  replaceContentText(container, from, to) {
    const beforeText = container.innerHTML;

    container.innerHTML = beforeText.replace(from, to);
  }

  /**
   * Unwrap Block tag of current range
   * @param {function} [condition] iterate with tagName
   */
  unwrapBlockTag(condition) {
    if (!condition) {
      condition = tagName => FIND_BLOCK_TAGNAME_RX.test(tagName);
    }

    this.getEditor().changeBlockFormat(condition);
    this.eventManager.emit('wysiwygRangeChangeAfter', this);
  }

  /**
   * move scroll to cursor
   * scrollIntoView browser function may cause scrolling on document.
   * this function aims to replace scrollIntoView function to prevent that.
   * it will move the scroll of squire only.
   */
  scrollIntoCursor() {
    const scrollTop = this.scrollTop();
    const { top: cursorTop, height: cursorHeight } = this.getEditor().getCursorPosition();
    const { top: editorTop, height: editorHeight } = this.editorContainerEl.getBoundingClientRect();

    const cursorAboveEditor = cursorTop - editorTop;
    const cursorBelowEditor = cursorTop + cursorHeight - (editorTop + editorHeight);

    if (cursorAboveEditor < 0) {
      this.scrollTop(scrollTop + cursorAboveEditor);
    } else if (cursorBelowEditor > 0) {
      this.scrollTop(Math.ceil(scrollTop + cursorBelowEditor));
    }
  }

  /**
   * Set cursor position to end
   */
  moveCursorToEnd() {
    this.getEditor().moveCursorToEnd();
    this.scrollIntoCursor();
    this._correctRangeAfterMoveCursor('end');
  }

  /**
   * Set cursor position to start
   */
  moveCursorToStart() {
    this.getEditor().moveCursorToStart();
    this.scrollTop(0);
  }

  /**
   * Set cursor position to start
   * @param {number} value Scroll amount
   * @returns {number} value of scrollTop
   */
  scrollTop(value) {
    if (!isUndefined(value)) {
      this.editorContainerEl.scrollTop = value;
    }

    return this.editorContainerEl.scrollTop;
  }

  /**
   * For arrange Range after moveCursorToEnd api invocation. Squire has bug in Firefox, IE.
   * @param {string} direction Direction of cursor move
   * @private
   */
  _correctRangeAfterMoveCursor(direction) {
    const range = this.getRange();
    let cursorContainer = this.getBody();

    if (direction === 'start') {
      while (cursorContainer.firstChild) {
        cursorContainer = cursorContainer.firstChild;
      }
    } else {
      while (cursorContainer.lastChild) {
        cursorContainer = cursorContainer.lastChild;
      }
    }

    // IE have problem with cursor after br
    if (cursorContainer.tagName === 'BR') {
      range.setStartBefore(cursorContainer);
    } else {
      range.setStartAfter(cursorContainer);
    }

    range.collapse(true);

    this.setRange(range);
  }

  /**
   * Get current Range object
   * @returns {Range}
   */
  getRange() {
    return this.getEditor()
      .getSelection()
      .cloneRange();
  }

  /**
   * get IME range
   * cjk composition causes wrong caret position.
   * it returns fixed IME composition range
   * @returns {Range}
   */
  getIMERange() {
    let range;
    const selection = getSelection();

    if (selection && selection.rangeCount) {
      range = selection.getRangeAt(0).cloneRange();
    }

    return range;
  }

  /**
   * get IME range
   * cjk composition causes wrong caret position.
   * it sets fixed IME composition range
   */
  fixIMERange() {
    const range = this.getIMERange();

    // range exists and it's an WYSIWYG editor content
    if (range) {
      const contentElement = domUtils.getParentUntil(
        range.commonAncestorContainer,
        this.editorContainerEl
      );

      const foundEditorElement = !!(contentElement && contentElement.parentNode);

      if (foundEditorElement) {
        this.setRange(range);
      }
    }
  }

  /**
   * set range
   * @param {Range} range - range to set
   */
  setRange(range) {
    this.getEditor().setSelection(range);
  }

  /**
   * Check whether passed range is in table or not
   * @param {Range} range range
   * @returns {boolean} result
   */
  isInTable(range) {
    const target = range.collapsed ? range.startContainer : range.commonAncestorContainer;

    return !!domUtils.closest(target, '[contenteditable=true] table');
  }

  /**
   * Get text object of current range
   * @param {Range} range Range object
   * @returns {WwTextObject}
   */
  getTextObject(range) {
    return new WwTextObject(this, range);
  }

  defer(callback, delayOffset) {
    const delay = delayOffset ? delayOffset : 0;

    setTimeout(() => {
      if (this.isEditorValid()) {
        callback(this);
      }
    }, delay);
  }

  isEditorValid() {
    return this.getEditor() && domUtils.isContain(document.body, this.editorContainerEl);
  }

  _isCursorNotInRestrictedAreaOfTabAction(editor) {
    return !editor.hasFormat('li') && !editor.hasFormat('blockquote') && !editor.hasFormat('table');
  }

  getSanitizer() {
    return this._sanitizer;
  }

  /**
   * WysiwygEditor factory method
   * @param {HTMLElement} el Container element for editor
   * @param {EventManager} eventManager EventManager instance
   * @param {object} [options={}] - option object
   * @returns {WysiwygEditor} wysiwygEditor
   * @ignore
   */
  static factory(el, eventManager, options) {
    const wwe = new WysiwygEditor(el, eventManager, options);

    wwe.init();

    wwe.componentManager.addManager(WwListManager);
    wwe.componentManager.addManager(WwTaskManager);
    wwe.componentManager.addManager(WwTableSelectionManager);
    wwe.componentManager.addManager(WwTableManager);
    wwe.componentManager.addManager(WwHrManager);
    wwe.componentManager.addManager(WwPManager);
    wwe.componentManager.addManager(WwHeadingManager);
    wwe.componentManager.addManager(WwCodeBlockManager);

    return wwe;
  }
}
export default WysiwygEditor;
