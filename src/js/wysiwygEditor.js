/**
 * @fileoverview Implments wysiwygEditor
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import domUtils from './domUtils';
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

const FIND_EMPTY_LINE = /<([a-z]+|h\d)>(<br>|<br \/>)<\/\1>/gi,
  FIND_UNNECESSARY_BR = /(?:<br>|<br \/>)<\/(.+?)>/gi,
  FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD|PRE)\b/;
const FIND_TABLE_AND_HEADING_RX = /^(TABLE|H[1-6])$/;

const EDITOR_CONTENT_CSS_CLASSNAME = 'tui-editor-contents';
const PLACEHOLDER_CSS_CLASSNAME = 'tui-editor-contents-placeholder';

const canObserveMutations = (typeof MutationObserver !== 'undefined');

/**
 * Class WysiwygEditor
 */
class WysiwygEditor {
  /**
   * Creates an instance of WysiwygEditor.
   * @param {jQuery} $el element to insert editor
   * @param {EventManager} eventManager EventManager instance
   * @memberof WysiwygEditor
   */
  constructor($el, eventManager) {
    this.componentManager = new ComponentManager(this);
    this.eventManager = eventManager;
    this.$editorContainerEl = $el;

    this._height = 0;

    this._silentChange = false;

    this._keyEventHandlers = {};
    this._managers = {};

    this._initEvent();
    this._initDefaultKeyEventHandler();

    this.debouncedPostProcessForChange = util.debounce(() => this.postProcessForChange(), 0);
  }

  /**
   * init
   * @memberof WysiwygEditor
   */
  init() {
    const $editorBody = $('<div />');

    this.$editorContainerEl.append($editorBody);

    this.editor = new SquireExt($editorBody[0], {
      blockTag: 'DIV',
      leafNodeNames: {
        'HR': false
      }
    });
    this.editor.blockCommandShortcuts();

    this._clipboardManager = new WwClipboardManager(this);
    this._initSquireEvent();
    this._clipboardManager.init();

    this.get$Body().addClass(EDITOR_CONTENT_CSS_CLASSNAME);
    this.$editorContainerEl.css('position', 'relative');
    this._togglePlaceholder();

    this.codeBlockGadget = new CodeBlockGadget({
      eventManager: this.eventManager,
      container: this.$editorContainerEl,
      wysiwygEditor: this
    });
  }

  /**
   * _preprocessForInlineElement
   * Seperate anchor tags with \u200B and replace blank space between <br> and <img to <br>$1
   * @param {string} html Inner html of content editable
   * @returns {string}
   * @memberof WysiwygEditor
   * @private
   */
  _preprocessForInlineElement(html) {
    return html.replace(/<br>( *)<img/g, '<br><br>$1<img');
  }

  /**
   * _initEvent
   * Initialize EventManager event handler
   * @memberof WysiwygEditor
   * @private
   */
  _initEvent() {
    this.eventManager.listen('wysiwygSetValueBefore', html => this._preprocessForInlineElement(html));
    this.eventManager.listen('wysiwygKeyEvent', ev => this._runKeyEventHandlers(ev.data, ev.keyMap));
    this.eventManager.listen('wysiwygRangeChangeAfter', () => this.scrollIntoCursor());
    this.eventManager.listen('contentChangedFromWysiwyg', () => {
      this._togglePlaceholder();
    });
  }

  /**
   * addKeyEventHandler
   * Add key event handler
   * @memberof WysiwygEditor
   * @param {string|Array.<string>} keyMap - keyMap string or array of string
   * @param {function} handler handler
   */
  addKeyEventHandler(keyMap, handler) {
    if (!handler) {
      handler = keyMap;
      keyMap = 'DEFAULT';
    }

    if (!util.isArray(keyMap)) {
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
   * REmove key event handler.
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
   * _runKeyEventHandlers
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
      util.forEachArray(handlers, handler => {
        isNeedNext = handler(event, range, keyMap);

        return isNeedNext;
      });
    }

    handlers = this._keyEventHandlers[keyMap];

    if (handlers && isNeedNext !== false) {
      util.forEachArray(handlers, handler => handler(event, range, keyMap));
    }
  }

  /**
   * _initSquireEvent
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
      util.debounce(() => {
        if (!this.isEditorValid()) {
          return;
        }

        this.eventManager.emit('copyAfter', {
          source: 'wysiwyg',
          data: clipboardEvent
        });
      })();
    });

    squire.addEventListener(util.browser.msie ? 'beforecut' : 'cut', clipboardEvent => {
      this.eventManager.emit('cut', {
        source: 'wysiwyg',
        data: clipboardEvent
      });
      util.debounce(() => {
        if (!this.isEditorValid()) {
          return;
        }

        this.eventManager.emit('cutAfter', {
          source: 'wysiwyg',
          data: clipboardEvent
        });
      })();
    });

    squire.addEventListener(util.browser.msie ? 'beforepaste' : 'paste', clipboardEvent => {
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
    squire.addEventListener('input', util.debounce(() => {
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
    }, 0));

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

    if (util.browser.firefox) {
      squire.addEventListener('keypress', keyboardEvent => {
        const {keyCode} = keyboardEvent;

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

        if (domUtils.isTextNode(range.commonAncestorContainer)
                    && domUtils.isTextNode(range.commonAncestorContainer.previousSibling)) {
          const prevLen = range.commonAncestorContainer.previousSibling.length;
          const curEl = range.commonAncestorContainer;

          range.commonAncestorContainer.previousSibling.appendData(
            range.commonAncestorContainer.data);

          range.setStart(range.commonAncestorContainer.previousSibling, prevLen + range.startOffset);
          range.collapse(true);

          curEl.parentNode.removeChild(curEl);

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

    this.$editorContainerEl.on('scroll', ev => {
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
        bold: /(>B|>STRONG|^B$|^STRONG$)/.test(data.path),
        italic: /(>I|>EM|^I$|^EM$)/.test(data.path),
        strike: /(^S>|>S$|>S>|^S$)/.test(data.path),
        code: /CODE/.test(data.path),
        codeBlock: /PRE/.test(data.path),
        quote: /BLOCKQUOTE/.test(data.path),
        list: /LI(?!.task-list-item)/.test(this._getLastLiString(data.path)),
        task: /LI.task-list-item/.test(this._getLastLiString(data.path)),
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
   * Return last matched list item path string matched index to end
   * @param {string} path Full path string of current selection
   * @returns {string}
   * @private
   */
  _getLastLiString(path) {
    const foundedListItem = /LI[^UO]*$/.exec(path);
    let result;

    if (foundedListItem) {
      [result] = foundedListItem;
    } else {
      result = '';
    }

    return result;
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
   * _initDefaultKeyEventHandler
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
      const isAbleToInput4Spaces = range.collapsed && this._isCursorNotInRestrictedAreaOfTabAction(sq);
      const isTextSelection = !range.collapsed && domUtils.isTextNode(range.commonAncestorContainer);

      ev.preventDefault();
      if (isAbleToInput4Spaces || isTextSelection) {
        sq.insertPlainText('\u00a0\u00a0\u00a0\u00a0');

        return false;
      }

      return true;
    });

    this.addKeyEventHandler('BACK_SPACE', (ev, range, keymap) => this._handleRemoveKeyEvent(ev, range, keymap));
    this.addKeyEventHandler('DELETE', (ev, range, keymap) => this._handleRemoveKeyEvent(ev, range, keymap));
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
    const {startContainer, startOffset, commonAncestorContainer, collapsed} = range;
    const root = this.getEditor().getRoot();

    if (!collapsed && commonAncestorContainer === root) {
      if (startContainer === root) {
        return FIND_TABLE_AND_HEADING_RX.test(domUtils.getChildNodeByOffset(startContainer, startOffset).nodeName);
      } else if (startOffset === 0) {
        return FIND_TABLE_AND_HEADING_RX.test(domUtils.getParentUntil(startContainer, root).nodeName);
      }
    }

    return false;
  }

  _wrapDefaultBlockToOrphanTexts() {
    const textNodes = this.get$Body().contents().filter(this.findTextNodeFilter);

    textNodes.each((i, node) => {
      if (node.nextSibling && node.nextSibling.tagName === 'BR') {
        $(node.nextSibling).remove();
      }

      $(node).wrap('<div />');
    });
  }

  /**
   * _isInOrphanText
   * check if range is orphan text
   * @param {Range} range range
   * @returns {boolean} result
   * @private
   */
  _isInOrphanText(range) {
    return range.startContainer.nodeType === Node.TEXT_NODE
            && range.startContainer.parentNode === this.get$Body()[0];
  }

  /**
   * _wrapDefaultBlockTo
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
   * findTextNodeFilter
   * @this Node
   * @returns {boolean} true or not
   */
  findTextNodeFilter() {
    return this.nodeType === Node.TEXT_NODE;
  }

  /**
   * _joinSplitedTextNodes
   * Join spliated text nodes
   * @private
   */
  _joinSplitedTextNodes() {
    let prevNode, lastGroup;
    const nodesToRemove = [];
    const textNodes = this.get$Body().contents().filter(this.findTextNodeFilter);

    textNodes.each((i, node) => {
      if (prevNode === node.previousSibling) {
        lastGroup.nodeValue += node.nodeValue;
        nodesToRemove.push(node);
      } else {
        lastGroup = node;
      }

      prevNode = node;
    });

    $(nodesToRemove).remove();
  }

  /**
   * saveSelection
   * Save current selection before modification
   * @memberof WysiwygEditor
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
   * @memberof WysiwygEditor
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
   * restoreSavedSelection
   * Restore saved selection
   * @memberof WysiwygEditor
   */
  restoreSavedSelection() {
    this.setRange(this.getEditor()._getRangeAndRemoveBookmark());
  }

  /**
   * reset
   * Reset wysiwyg editor
   * @memberof WysiwygEditor
   */
  reset() {
    this.setValue('');
  }

  /**
   * changeBlockFormatTo
   * Change current range block format to passed tag
   * @memberof WysiwygEditor
   * @param {string} targetTagName Target element tag name
   */
  changeBlockFormatTo(targetTagName) {
    this.getEditor().changeBlockFormatTo(targetTagName);
    this.eventManager.emit('wysiwygRangeChangeAfter', this);
  }

  /**
   * makeEmptyBlockCurrentSelection
   * Make empty block to current selection
   * @memberof WysiwygEditor
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
   * focus
   * Focus to editor
   * @memberof WysiwygEditor
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
   * blur
   * Remove focus of editor
   * @memberof WysiwygEditor
   */
  blur() {
    this.editor.blur();
  }

  /**
   * remove
   * Remove wysiwyg editor
   * @memberof WysiwygEditor
   */
  remove() {
    this.$editorContainerEl.off('scroll');
    this.getEditor().destroy();
    this.editor = null;
    this.$body = null;
    this.eventManager = null;
  }

  /**
   * setHeight
   * Set editor height
   * @memberof WysiwygEditor
   * @param {number|string} height pixel of height or "auto"
   */
  setHeight(height) {
    this._height = height;

    this.$editorContainerEl.css('overflow', 'auto');
    this.$editorContainerEl.css('height', '100%');
    this.$editorContainerEl.parent().height(height);

    const paddingHeight = parseInt(this.$editorContainerEl.css('padding-top'), 10) - parseInt(this.$editorContainerEl.css('padding-bottom'), 10);
    const marginHeight = parseInt(this.get$Body().css('margin-top'), 10) - parseInt(this.get$Body().css('margin-bottom'), 10);
    this.get$Body().css('min-height', `${height - marginHeight - paddingHeight}px`);
  }

  /**
   * set min height
   * @param {number} minHeight - min height in px
   * @memberof WysiwygEditor
   */
  setMinHeight(minHeight) {
    const editorBody = this.get$Body().get(0);
    editorBody.style.minHeight = `${minHeight}px`;
  }

  /**
   * Set the placeholder to wysiwyg editor
   * @param {string} placeholder - placeholder to set
   */
  setPlaceholder(placeholder) {
    if (placeholder) {
      this.getEditor().getRoot().setAttribute('data-placeholder', placeholder);
    }
  }

  /**
   * setValue
   * Set value to wysiwyg editor
   * @memberof WysiwygEditor
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
   * insert given text to cursor position or selected area
   * @param {string} text - text string to insert
   * @memberof WysiwygEditor
   */
  insertText(text) {
    this.editor.insertPlainText(text);
  }

  /**
   * getValue
   * Get value of wysiwyg editor
   * @memberof WysiwygEditor
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

    // remove unnecessary brs
    html = html.replace(FIND_UNNECESSARY_BR, '</$1>');

    // remove contenteditable block, in this case div
    html = html.replace(/<div[^>]*>/g, '');
    html = html.replace(/<\/div>/g, '<br />');

    html = this.eventManager.emitReduce('wysiwygProcessHTMLText', html);

    return html;
  }

  /**
   * _prepareGetHTML
   * Prepare before get html
   * @memberof WysiwygEditor
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
   * @memberof WysiwygEditor
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
   * readySilentChange
   * Ready to silent change
   * @memberof WysiwygEditor
   */
  readySilentChange() {
    if (canObserveMutations && !this.getEditor().isIgnoreChange()) {
      this._silentChange = true;
    }
  }

  /**
   * getEditor
   * Get squire
   * @memberof WysiwygEditor
   * @returns {SquireExt} squire
   */
  getEditor() {
    return this.editor;
  }

  /**
   * replaceSelection
   * Replace text of passed range
   * @memberof WysiwygEditor
   * @param {string} content Content for change current selection
   * @param {Range} range range
   */
  replaceSelection(content, range) {
    this.getEditor().replaceSelection(content, range);
  }

  /**
   * replaceRelativeOffset
   * Replace content by relative offset
   * @memberof WysiwygEditor
   * @param {string} content Content for change current selection
   * @param {number} offset Offset of current range
   * @param {number} overwriteLength Length to overwrite content
   */
  replaceRelativeOffset(content, offset, overwriteLength) {
    this.getEditor().replaceRelativeOffset(content, offset, overwriteLength);
  }

  /**
   * addWidget
   * Add widget to selection
   * @memberof WysiwygEditor
   * @param {Range} range Range object
   * @param {Node} node Widget node
   * @param {string} style Adding style "over" or "bottom"
   * @param {number} [offset] Offset to adjust position
   */
  addWidget(range, node, style, offset) {
    const pos = this.getEditor().getSelectionPosition(range, style, offset);
    const editorContainerPos = this.$editorContainerEl.offset();

    this.$editorContainerEl.append(node);

    $(node).css({
      position: 'absolute',
      top: pos.top - editorContainerPos.top + this.scrollTop(),
      left: pos.left - editorContainerPos.left
    });
  }

  /**
   * get$Body
   * Get jQuery wrapped body container of Squire
   * @memberof WysiwygEditor
   * @returns {JQuery} jquery body
   */
  get$Body() {
    return this.getEditor().get$Body();
  }

  /**
   * hasFormatWithRx
   * Check with given regexp whether current path has some format or not
   * @memberof WysiwygEditor
   * @param {RegExp} rx Regexp
   * @returns {boolean} Match result
   */
  hasFormatWithRx(rx) {
    return this.getEditor().getPath().match(rx);
  }

  /**
   * breakToNewDefaultBlock
   * Break line to new default block from passed range
   * @memberof WysiwygEditor
   * @param {Range} range Range object
   * @param {string} [where] "before" or not
   */
  breakToNewDefaultBlock(range, where) {
    const div = this.editor.createDefaultBlock();
    const currentNode = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset)
            || domUtils.getChildNodeByOffset(range.startContainer, range.startOffset - 1);
    const appendBefore = domUtils.getParentUntil(currentNode, this.get$Body()[0]);

    if (where === 'before') {
      $(appendBefore).before(div);
    } else {
      $(appendBefore).after(div);
    }

    range.setStart(div, 0);
    range.collapse(true);
    this.setRange(range);
  }

  /**
   * replaceContentText
   * Replace textContet of node
   * @memberof WysiwygEditor
   * @param {Node} container Container node
   * @param {string} from Target text to change
   * @param {string} to Replacement text
   */
  replaceContentText(container, from, to) {
    const before = $(container).html();
    $(container).html(before.replace(from, to));
  }

  /**
   * unwrapBlockTag
   * Unwrap Block tag of current range
   * @memberof WysiwygEditor
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
   * @memberof SquireExt
   */
  scrollIntoCursor() {
    const scrollTop = this.scrollTop();
    const {
      top: cursorTop,
      height: cursorHeight
    } = this.getEditor().getCursorPosition();
    const {
      top: editorTop,
      height: editorHeight
    } = this.$editorContainerEl.get(0).getBoundingClientRect();

    const cursorAboveEditor = cursorTop - editorTop;
    const cursorBelowEditor = (cursorTop + cursorHeight) - (editorTop + editorHeight);

    if (cursorAboveEditor < 0) {
      this.scrollTop(scrollTop + cursorAboveEditor);
    } else if (cursorBelowEditor > 0) {
      this.scrollTop(Math.ceil(scrollTop + cursorBelowEditor));
    }
  }

  /**
   * Set cursor position to end
   * @memberof WysiwygEditor
   */
  moveCursorToEnd() {
    this.getEditor().moveCursorToEnd();
    this.scrollIntoCursor();
    this._correctRangeAfterMoveCursor('end');
  }

  /**
   * Set cursor position to start
   * @memberof WysiwygEditor
   */
  moveCursorToStart() {
    this.getEditor().moveCursorToStart();
    this.scrollTop(0);
  }

  /**
   * Set cursor position to start
   * @memberof WysiwygEditor
   * @param {number} value Scroll amount
   * @returns {boolean}
   */
  scrollTop(value) {
    if (util.isUndefined(value)) {
      return this.$editorContainerEl.scrollTop();
    }

    return this.$editorContainerEl.scrollTop(value);
  }

  /**
   * _correctRangeAfterMoveCursor
   * For arrange Range after moveCursorToEnd api invocation. Squire has bug in Firefox, IE.
   * @memberof WysiwygEditor
   * @param {string} direction Direction of cursor move
   * @private
   */
  _correctRangeAfterMoveCursor(direction) {
    const range = this.getRange();
    let cursorContainer = this.get$Body().get(0);

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
   * @memberof WysiwygEditor
   * @returns {Range}
   */
  getRange() {
    return this.getEditor().getSelection().cloneRange();
  }

  /**
   * get IME range
   * cjk composition causes wrong caret position.
   * it returns fixed IME composition range
   * @memberof WysiwygEditor
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
   * @memberof WysiwygEditor
   */
  fixIMERange() {
    const range = this.getIMERange();

    // range exists and it's an WYSIWYG editor content
    if (range && $(range.commonAncestorContainer).closest(this.$editorContainerEl).length) {
      this.setRange(range);
    }
  }

  /**
   * set range
   * @param {Range} range - range to set
   * @memberof WysiwygEditor
   */
  setRange(range) {
    this.getEditor().setSelection(range);
  }

  /**
   * Get text object of current range
   * @memberof WysiwygEditor
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
    return this.getEditor() && $.contains(this.$editorContainerEl[0].ownerDocument, this.$editorContainerEl[0]);
  }

  _isCursorNotInRestrictedAreaOfTabAction(editor) {
    return !editor.hasFormat('li')
            && !editor.hasFormat('blockquote') && !editor.hasFormat('table');
  }

  /**
   * WysiwygEditor factory method
   * @memberof WysiwygEditor
   * @param {jQuery} $el Container element for editor
   * @param {EventManager} eventManager EventManager instance
   * @param {object} [options={}] - option object
   *  @param {boolean} [options.useCommandShortcut=true] - whether to use squire command shortcuts
   * @returns {WysiwygEditor} wysiwygEditor
   */
  static factory($el, eventManager, options) {
    const wwe = new WysiwygEditor($el, eventManager, options);

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
