/**
 * @fileoverview Implments wysiwygEditor
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

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
import codeBlockManager from './codeBlockManager';

const keyMapper = KeyMapper.getSharedInstance();

const util = tui.util;

const FIND_EMPTY_LINE = /<(.+)>(<br>|<br \/>|<BR>|<BR \/>)<\/\1>/g,
    FIND_UNNECESSARY_BR = /(?:<br>|<br \/>|<BR>|<BR \/>)<\/(.+?)>/g,
    FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD|PRE)\b/;

const EDITOR_CONTENT_CSS_CLASSNAME = 'tui-editor-contents';

const canObserveMutations = (typeof MutationObserver !== 'undefined');

/**
 * WysiwygEditor
 * @exports WysiwygEditor
 * @param {jQuery} $el element to insert editor
 * @param {EventManager} eventManager EventManager instance
 * @constructor
 * @class WysiwygEditor
 */
class WysiwygEditor {
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

        this.postProcessForChange = util.debounce(() => this._postProcessForChange(), 0);
    }

    /**
     * init
     * @api
     * @memberOf WysiwygEditor
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

        this._clipboardManager = new WwClipboardManager(this);
        this._initSquireEvent();
        this._clipboardManager.init();

        this.get$Body().addClass(EDITOR_CONTENT_CSS_CLASSNAME);
        this.$editorContainerEl.css('position', 'relative');
    }

    /**
     * _preprocessForInlineElement
     * Seperate anchor tags with \u200B and replace blank space between <br> and <img to <br>$1
     * @param {string} html Inner html of content editable
     * @returns {string}
     * @memberOf WysiwygEditor
     * @private
     */
    _preprocessForInlineElement(html) {
        return html.replace(/<br>( *)<img/g, '<br><br>$1<img');
    }
    /**
     * _initEvent
     * Initialize EventManager event handler
     * @memberOf WysiwygEditor
     * @private
     */
    _initEvent() {
        const self = this;

        this.eventManager.listen('wysiwygSetValueBefore', html => self._preprocessForInlineElement(html));

        this.eventManager.listen('wysiwygKeyEvent', ev => self._runKeyEventHandlers(ev.data, ev.keyMap));
    }

    /**
     * addKeyEventHandler
     * Add key event handler
     * @api
     * @memberOf WysiwygEditor
     * @param {string} keyMap keyMap string
     * @param {function} handler handler
     */
    addKeyEventHandler(keyMap, handler) {
        if (!handler) {
            handler = keyMap;
            keyMap = 'DEFAULT';
        }

        if (!this._keyEventHandlers[keyMap]) {
            this._keyEventHandlers[keyMap] = [];
        }

        this._keyEventHandlers[keyMap].push(handler);
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
        const self = this;
        let isNeedFirePostProcessForRangeChange = false;

        this.getEditor().addEventListener(util.browser.msie ? 'beforepaste' : 'paste', clipboardEvent => {
            self.eventManager.emit('paste', {
                source: 'wysiwyg',
                data: clipboardEvent
            });
        });

        this.getEditor().addEventListener('dragover', ev => {
            ev.preventDefault();

            return false;
        });

        this.getEditor().addEventListener('drop', ev => {
            ev.preventDefault();

            self.eventManager.emit('drop', {
                source: 'wysiwyg',
                data: ev
            });

            return false;
        });

        // no-iframe전환후 레인지가 업데이트 되기 전에 이벤트가 발생함
        // 그래서 레인지 업데이트 이후 체인지 관련 이벤트 발생
        this.getEditor().addEventListener('input', util.debounce(() => {
            if (!self._silentChange && self.isEditorValid()) {
                const eventObj = {
                    source: 'wysiwyg'
                };

                self.eventManager.emit('changeFromWysiwyg', eventObj);
                self.eventManager.emit('change', eventObj);
                self.eventManager.emit('contentChangedFromWysiwyg', self);
            } else {
                self._silentChange = false;
            }

            self.getEditor().preserveLastLine();
        }, 0));

        this.getEditor().addEventListener('keydown', keyboardEvent => {
            const range = self.getEditor().getSelection();

            if (!range.collapsed) {
                isNeedFirePostProcessForRangeChange = true;
            }

            self.eventManager.emit('keydown', {
                source: 'wysiwyg',
                data: keyboardEvent
            });

            self._onKeyDown(keyboardEvent);
        });

        if (util.browser.firefox) {
            this.getEditor().addEventListener('keypress', keyboardEvent => {
                const keyCode = keyboardEvent.keyCode;

                if (keyCode === 13 || keyCode === 9) {
                    const range = self.getEditor().getSelection();

                    if (!range.collapsed) {
                        isNeedFirePostProcessForRangeChange = true;
                    }

                    self.eventManager.emit('keydown', {
                        source: 'wysiwyg',
                        data: keyboardEvent
                    });

                    self._onKeyDown(keyboardEvent);
                }
            });

            // 파폭에서 space입력시 텍스트노드가 분리되는 현상때문에 꼭 다시 머지해줘야한다..
            // 이렇게 하지 않으면 textObject에 문제가 생긴다.
            self.getEditor().addEventListener('keyup', () => {
                const range = self.getRange();

                if (domUtils.isTextNode(range.commonAncestorContainer)
                    && domUtils.isTextNode(range.commonAncestorContainer.previousSibling)) {
                    const prevLen = range.commonAncestorContainer.previousSibling.length;
                    const curEl = range.commonAncestorContainer;

                    range.commonAncestorContainer.previousSibling.appendData(
                        range.commonAncestorContainer.data);

                    range.setStart(range.commonAncestorContainer.previousSibling, prevLen + range.startOffset);
                    range.collapse(true);

                    curEl.parentNode.removeChild(curEl);

                    self.getEditor().setSelection(range);
                    range.detach();
                }
            });
        }

        this.getEditor().addEventListener('keyup', keyboardEvent => {
            if (isNeedFirePostProcessForRangeChange) {
                self.postProcessForChange();
                isNeedFirePostProcessForRangeChange = false;
            }

            self.eventManager.emit('keyup', {
                source: 'wysiwyg',
                data: keyboardEvent
            });
        });

        this.getEditor().addEventListener('scroll', ev => {
            self.eventManager.emit('scroll', {
                source: 'wysiwyg',
                data: ev
            });
        });

        this.getEditor().addEventListener('click', ev => {
            self.eventManager.emit('click', {
                source: 'wysiwyg',
                data: ev
            });
        });

        this.getEditor().addEventListener('mousedown', ev => {
            self.eventManager.emit('mousedown', {
                source: 'wysiwyg',
                data: ev
            });
        });

        this.getEditor().addEventListener('mouseover', ev => {
            self.eventManager.emit('mouseover', {
                source: 'wysiwyg',
                data: ev
            });
        });

        this.getEditor().addEventListener('mouseup', ev => {
            self.eventManager.emit('mouseup', {
                source: 'wysiwyg',
                data: ev
            });
        });

        this.getEditor().addEventListener('contextmenu', ev => {
            self.eventManager.emit('contextmenu', {
                source: 'wysiwyg',
                data: ev
            });
        });

        this.getEditor().addEventListener('focus', () => {
            self.eventManager.emit('focus', {
                source: 'wysiwyg'
            });
        });

        this.getEditor().addEventListener('blur', () => {
            self.eventManager.emit('blur', {
                source: 'wysiwyg'
            });
        });

        this.getEditor().addEventListener('pathChange', data => {
            const state = {
                bold: /(>B|>STRONG|^B$|^STRONG$)/.test(data.path),
                italic: /(>I|>EM|^I$|^EM$)/.test(data.path),
                strike: /(>S)/.test(data.path),
                code: /CODE/.test(data.path),
                codeBlock: /PRE/.test(data.path),
                quote: /BLOCKQUOTE/.test(data.path),
                list: /LI(?!.task-list-item)/.test(self._getLastLiString(data.path)),
                task: /LI.task-list-item/.test(self._getLastLiString(data.path)),
                source: 'wysiwyg'
            };

            self.eventManager.emit('stateChange', state);
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
            result = foundedListItem[0];
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
        const self = this;

        this.addKeyEventHandler('ENTER', (ev, range) => {
            if (self._isInOrphanText(range)) {
                // We need this cuz input text right after table make orphan text in webkit
                self.defer(() => {
                    self._wrapDefaultBlockToOrphanTexts();
                    self.breakToNewDefaultBlock(range, 'before');
                });
            }

            self.defer(() => {
                self._scrollToRangeIfNeed();
            });
        });

        this.addKeyEventHandler('TAB', ev => {
            const sq = self.getEditor();
            const range = sq.getSelection();
            const isAbleToInput4Spaces = range.collapsed && self._isCursorNotInRestrictedAreaOfTabAction(sq);
            const isTextSelection = !range.collapsed && domUtils.isTextNode(range.commonAncestorContainer);

            ev.preventDefault();
            if (isAbleToInput4Spaces || isTextSelection) {
                sq.insertPlainText('\u00a0\u00a0\u00a0\u00a0');

                return false;
            }

            return true;
        });
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
     * Scroll editor area to current cursor position if need
     * @private
     */
    _scrollToRangeIfNeed() {
        const range = this.getEditor().getSelection().cloneRange();
        const cursorTop = this.getEditor().getCursorPosition(range).top - this.$editorContainerEl.offset().top;

        if (cursorTop >= this.get$Body().height()) {
            range.endContainer.scrollIntoView();
        }
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

        range = this.getEditor().getSelection().cloneRange();

        const textElem = range.startContainer;
        const cursorOffset = range.startOffset;

        // 이때 range의 정보들이 body기준으로 변경된다(텍스트 노드가 사라져서)
        // after code below, range range is arranged by body
        const block = this.getEditor().createDefaultBlock([range.startContainer]);

        // range for insert block
        const insertTargetNode = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset);
        if (insertTargetNode) {
            range.setStartBefore(insertTargetNode);
        } else {
            // 컨테이너의 차일드가 이노드 한개뿐일경우
            range.selectNodeContents(range.startContainer);
        }

        range.collapse(true);

        range.insertNode(block);

        // revert range to original node
        range.setStart(textElem, cursorOffset);
        range.collapse(true);

        this.getEditor().setSelection(range);
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
     * @api
     * @memberOf WysiwygEditor
     * @param {Range} range Range object
     */
    saveSelection(range) {
        const sq = this.getEditor();

        if (!range) {
            range = sq.getSelection().cloneRange();
        }

        this.getEditor()._saveRangeToBookmark(range);
    }

    /**
     * restoreSavedSelection
     * Restore saved selection
     * @api
     * @memberOf WysiwygEditor
     */
    restoreSavedSelection() {
        const sq = this.getEditor();
        sq.setSelection(sq._getRangeAndRemoveBookmark());
    }

    /**
     * reset
     * Reset wysiwyg editor
     * @api
     * @memberOf WysiwygEditor
     */
    reset() {
        this.setValue('');
    }

    /**
     * changeBlockFormatTo
     * Change current range block format to passed tag
     * @api
     * @memberOf WysiwygEditor
     * @param {string} targetTagName Target element tag name
     */
    changeBlockFormatTo(targetTagName) {
        this.getEditor().changeBlockFormatTo(targetTagName);
        this.eventManager.emit('wysiwygRangeChangeAfter', this);
    }

    /**
     * makeEmptyBlockCurrentSelection
     * Make empty block to current selection
     * @api
     * @memberOf WysiwygEditor
     */
    makeEmptyBlockCurrentSelection() {
        const self = this;

        this.getEditor().modifyBlocks(frag => {
            if (!frag.textContent) {
                frag = self.getEditor().createDefaultBlock();
            }

            return frag;
        });
    }

    /**
     * focus
     * Focus to editor
     * @api
     * @memberOf WysiwygEditor
     */
    focus() {
        this.editor.focus();
    }

    /**
     * blur
     * Remove focus of editor
     * @api
     * @memberOf WysiwygEditor
     */
    blur() {
        this.editor.blur();
    }

    /**
     * remove
     * Remove wysiwyg editor
     * @api
     * @memberOf WysiwygEditor
     */
    remove() {
        this.getEditor().destroy();

        this.editor = null;
        this.$body = null;
    }

    /**
     * setHeight
     * Set editor height
     * @api
     * @memberOf WysiwygEditor
     * @param {number|string} height pixel of height or "auto"
     */
    setHeight(height) {
        this._height = height;

        if (height === 'auto') {
            this.get$Body().css('overflow', 'visible');
            this.get$Body().css('height', 'auto');
        } else {
            this.get$Body().css('overflow', 'auto');
            this.get$Body().css('height', '100%');
            this.$editorContainerEl.height(height);
        }
    }

    /**
     * setValue
     * Set value to wysiwyg editor
     * @api
     * @memberOf WysiwygEditor
     * @param {string} html HTML text
     */
    setValue(html) {
        html = this.eventManager.emitReduce('wysiwygSetValueBefore', html);

        this.editor.setHTML(html);

        codeBlockManager.replaceElements(this.$editorContainerEl, false, true);

        this.eventManager.emit('wysiwygSetValueAfter', this);
        this.eventManager.emit('contentChangedFromWysiwyg', this);

        this.moveCursorToEnd();

        this.getEditor().preserveLastLine();

        this.getEditor().removeLastUndoStack();
        this.getEditor().saveUndoState();
    }

    /**
     * getValue
     * Get value of wysiwyg editor
     * @api
     * @memberOf WysiwygEditor
     * @returns {string} html
     */
    getValue() {
        codeBlockManager.restoreElements(this.$editorContainerEl, false, true);

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
        html = html.replace(/<div>/g, '');
        html = html.replace(/<\/div>/g, '<br />');

        html = this.eventManager.emitReduce('wysiwygProcessHTMLText', html);

        return html;
    }

    /**
     * _prepareGetHTML
     * Prepare before get html
     * @memberOf WysiwygEditor
     * @private
     */
    _prepareGetHTML() {
        const self = this;
        // for ensure to fire change event
        self.get$Body().attr('lastGetValue', Date.now());

        self._joinSplitedTextNodes();

        self.getEditor().modifyDocument(() => {
            self.eventManager.emit('wysiwygGetValueBefore', self);
        });
    }

    /**
     * _postProcessForChange
     * Post process for change
     * @private
     * @memberOf WysiwygEditor
     */
    _postProcessForChange() {
        const self = this;
        self.getEditor().modifyDocument(() => {
            self.eventManager.emit('wysiwygRangeChangeAfter', self);
        });
    }

    /**
     * readySilentChange
     * Ready to silent change
     * @api
     * @memberOf WysiwygEditor
     */
    readySilentChange() {
        if (canObserveMutations && !this.getEditor().isIgnoreChange()) {
            this._silentChange = true;
        }
    }

    /**
     * getEditor
     * Get squire
     * @api
     * @memberOf WysiwygEditor
     * @returns {SquireExt} squire
     */
    getEditor() {
        return this.editor;
    }

    /**
     * replaceSelection
     * Replace text of passed range
     * @api
     * @memberOf WysiwygEditor
     * @param {string} content Content for change current selection
     * @param {Range} range range
     */
    replaceSelection(content, range) {
        this.getEditor().replaceSelection(content, range);
    }

    /**
     * replaceRelativeOffset
     * Replace content by relative offset
     * @api
     * @memberOf WysiwygEditor
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
     * @api
     * @memberOf WysiwygEditor
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
            top: pos.top - editorContainerPos.top,
            left: pos.left - editorContainerPos.left
        });
    }

    /**
     * get$Body
     * Get jQuery wrapped body container of Squire
     * @api
     * @memberOf WysiwygEditor
     * @returns {JQuery} jquery body
     */
    get$Body() {
        return this.getEditor().get$Body();
    }

    /**
     * hasFormatWithRx
     * Check with given regexp whether current path has some format or not
     * @api
     * @memberOf WysiwygEditor
     * @param {RegExp} rx Regexp
     * @returns {boolean} Match result
     */
    hasFormatWithRx(rx) {
        return this.getEditor().getPath().match(rx);
    }

    /**
     * breakToNewDefaultBlock
     * Break line to new default block from passed range
     * @api
     * @memberOf WysiwygEditor
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
        this.editor.setSelection(range);
    }

    /**
     * replaceContentText
     * Replace textContet of node
     * @api
     * @memberOf WysiwygEditor
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
     * @api
     * @memberOf WysiwygEditor
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
     * Set cursor position to end
     * @api
     * @memberOf WysiwygEditor
     */
    moveCursorToEnd() {
        this.getEditor().moveCursorToEnd();
        this.getEditor().scrollTop(this.get$Body().height());
        this._correctRangeAfterMoveCursor('end');
    }

    /**
     * Set cursor position to start
     * @api
     * @memberOf WysiwygEditor
     */
    moveCursorToStart() {
        this.getEditor().moveCursorToStart();
        this.getEditor().scrollTop(0);
    }

    /**
     * Set cursor position to start
     * @api
     * @memberOf WysiwygEditor
     * @param {number} value Scroll amount
     * @returns {boolean}
     */
    scrollTop(value) {
        return this.getEditor().scrollTop(value);
    }

    /**
     * _correctRangeAfterMoveCursor
     * For arrange Range after moveCursorToEnd api invocation. Squire has bug in Firefox, IE.
     * @memberOf WysiwygEditor
     * @param {string} direction Direction of cursor move
     * @private
     */
    _correctRangeAfterMoveCursor(direction) {
        const range = this.getEditor().getSelection().cloneRange();
        let cursorContainer = this.get$Body()[0];

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

        this.getEditor().setSelection(range);
    }

    /**
     * Get current Range object
     * @api
     * @memberOf WysiwygEditor
     * @returns {Range}
     */
    getRange() {
        return this.getEditor().getSelection().cloneRange();
    }

    /**
     * Get text object of current range
     * @api
     * @memberOf WysiwygEditor
     * @param {Range} range Range object
     * @returns {WwTextObject}
     */
    getTextObject(range) {
        return new WwTextObject(this, range);
    }

    defer(callback, delayOffset) {
        const self = this;
        const delay = delayOffset ? delayOffset : 0;

        setTimeout(() => {
            if (self.isEditorValid()) {
                callback(self);
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
     * @api
     * @memberOf WysiwygEditor
     * @param {jQuery} $el Container element for editor
     * @param {EventManager} eventManager EventManager instance
     * @returns {WysiwygEditor} wysiwygEditor
     */
    static factory($el, eventManager) {
        const wwe = new WysiwygEditor($el, eventManager);

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
module.exports = WysiwygEditor;
