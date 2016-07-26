/**
 * @fileoverview Implments wysiwygEditor
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils'),
    WwClipboardManager = require('./wwClipboardManager'),
    WwSelectionMarker = require('./wwSelectionMarker'),
    WwListManager = require('./wwListManager'),
    WwTaskManager = require('./wwTaskManager'),
    WwTableManager = require('./wwTableManager'),
    WwTableSelectionManager = require('./wwTableSelectionManager'),
    WwHrManager = require('./wwHrManager'),
    WwPManager = require('./wwPManager'),
    WwHeadingManager = require('./wwHeadingManager'),
    WwCodeBlockManager = require('./wwCodeBlockManager'),
    SquireExt = require('./squireExt');

var keyMapper = require('./keyMapper').getSharedInstance();

var WwTextObject = require('./wwTextObject');

var util = tui.util;

var FIND_EMPTY_LINE = /<(.+)>(<br>|<br \/>|<BR>|<BR \/>)<\/\1>/g,
    FIND_UNNECESSARY_BR = /(?:<br>|<br \/>|<BR>|<BR \/>)<\/(.+?)>/g,
    FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD|PRE)\b/;

var EDITOR_CONTENT_CSS_CLASSNAME = 'tui-editor-contents';

var canObserveMutations = (typeof MutationObserver !== 'undefined');

/**
 * WysiwygEditor
 * @exports WysiwygEditor
 * @constructor
 * @class WysiwygEditor
 * @param {jQuery} $el element to insert editor
 * @param {EventManager} eventManager EventManager instance
 */
function WysiwygEditor($el, eventManager) {
    this.eventManager = eventManager;
    this.$editorContainerEl = $el;

    this._height = 0;

    this._silentChange = false;

    this._keyEventHandlers = {};
    this._managers = {};

    this._clipboardManager = new WwClipboardManager(this);
    this._selectionMarker = new WwSelectionMarker();

    this._initEvent();
    this._initDefaultKeyEventHandler();

    this.postProcessForChange = util.debounce(function() {
        this._postProcessForChange();
    }.bind(this), 0);
}

/**
 * init
 * @api
 * @memberOf WysiwygEditor
 */
WysiwygEditor.prototype.init = function() {
    var $editorBody = $('<div />');

    this.$editorContainerEl.append($editorBody);

    this.editor = new SquireExt($editorBody[0], {
        blockTag: 'DIV'
    });

    this._initSquireEvent();
    this._clipboardManager.init();

    this.get$Body().addClass(EDITOR_CONTENT_CSS_CLASSNAME);
    this.$editorContainerEl.css('position', 'relative');
};

/**
 * _preprocessForInlineElement
 * Seperate anchor tags with \u200B and replace blank space between <br> and <img to <br>$1
 * @param {string} html Inner html of content editable
 * @returns {string}
 * @memberOf WysiwygEditor
 * @private
 */
WysiwygEditor.prototype._preprocessForInlineElement = function(html) {
    return html.replace(/<br>( *)<img/g, '<br><br>$1<img');
};
/**
 * _initEvent
 * Initialize EventManager event handler
 * @memberOf WysiwygEditor
 * @private
 */
WysiwygEditor.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('wysiwygSetValueBefore', function(html) {
        return self._preprocessForInlineElement(html);
    });

    this.eventManager.listen('wysiwygSetValueAfter', function() {
        self._wrapDefaultBlockToListInner();
    });

    this.eventManager.listen('wysiwygKeyEvent', function(ev) {
        self._runKeyEventHandlers(ev.data, ev.keyMap);
    });
};

/**
 * addKeyEventHandler
 * Add key event handler
 * @api
 * @memberOf WysiwygEditor
 * @param {string} keyMap keyMap string
 * @param {function} handler handler
 */
WysiwygEditor.prototype.addKeyEventHandler = function(keyMap, handler) {
    if (!handler) {
        handler = keyMap;
        keyMap = 'DEFAULT';
    }

    if (!this._keyEventHandlers[keyMap]) {
        this._keyEventHandlers[keyMap] = [];
    }

    this._keyEventHandlers[keyMap].push(handler);
};

/**
 * _runKeyEventHandlers
 * Run key event handler
 * @param {Event} event event object
 * @param {string} keyMap keyMapString
 * @private
 */
WysiwygEditor.prototype._runKeyEventHandlers = function(event, keyMap) {
    var range = this.getRange(),
        handlers, isNeedNext;

    handlers = this._keyEventHandlers.DEFAULT;

    if (handlers) {
        util.forEachArray(handlers, function(handler) {
            isNeedNext = handler(event, range, keyMap);

            return isNeedNext;
        });
    }

    handlers = this._keyEventHandlers[keyMap];

    if (handlers && isNeedNext !== false) {
        util.forEachArray(handlers, function(handler) {
            return handler(event, range, keyMap);
        });
    }
};

/**
 * _initSquireEvent
 * Initialize squire event
 * @private
 */
WysiwygEditor.prototype._initSquireEvent = function() {
    var self = this;
    var isNeedFirePostProcessForRangeChange = false;

    this.getEditor().addEventListener('paste', function(clipboardEvent) {
        self.eventManager.emit('paste', {
            source: 'wysiwyg',
            data: clipboardEvent
        });
    });

    this.getEditor().addEventListener('dragover', function(ev) {
        ev.preventDefault();

        return false;
    });

    this.getEditor().addEventListener('drop', function(ev) {
        ev.preventDefault();

        self.eventManager.emit('drop', {
            source: 'wysiwyg',
            data: ev
        });

        return false;
    });

    //no-iframe전환후 레인지가 업데이트 되기 전에 이벤트가 발생함
    //그래서 레인지 업데이트 이후 체인지 관련 이벤트 발생
    this.getEditor().addEventListener('input', util.debounce(function() {
        var eventObj;

        if (!self._silentChange && self.isEditorValid()) {
            eventObj = {
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

    this.getEditor().addEventListener('keydown', function(keyboardEvent) {
        var range = self.getEditor().getSelection();

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
        this.getEditor().addEventListener('keypress', function(keyboardEvent) {
            var keyCode = keyboardEvent.keyCode;
            var range;

            if (keyCode === 13 || keyCode === 9) {
                range = self.getEditor().getSelection();

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

        //파폭에서 space입력시 텍스트노드가 분리되는 현상때문에 꼭 다시 머지해줘야한다..
        //이렇게 하지 않으면 textObject에 문제가 생긴다.
        self.getEditor().addEventListener('keyup', function() {
            var range, prevLen, curEl;

            range = self.getRange();

            if (domUtils.isTextNode(range.commonAncestorContainer)
                && domUtils.isTextNode(range.commonAncestorContainer.previousSibling)) {
                prevLen = range.commonAncestorContainer.previousSibling.length;
                curEl = range.commonAncestorContainer;

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

    this.getEditor().addEventListener('keyup', function(keyboardEvent) {
        if (isNeedFirePostProcessForRangeChange) {
            self.postProcessForChange();
            isNeedFirePostProcessForRangeChange = false;
        }

        self.eventManager.emit('keyup', {
            source: 'wysiwyg',
            data: keyboardEvent
        });
    });

    this.getEditor().addEventListener('scroll', function(ev) {
        self.eventManager.emit('scroll', {
            source: 'wysiwyg',
            data: ev
        });
    });

    this.getEditor().addEventListener('click', function(ev) {
        self.eventManager.emit('click', {
            source: 'wysiwyg',
            data: ev
        });
    });

    this.getEditor().addEventListener('mousedown', function(ev) {
        self.eventManager.emit('mousedown', {
            source: 'wysiwyg',
            data: ev
        });
    });

    this.getEditor().addEventListener('mouseup', function(ev) {
        self.eventManager.emit('mouseup', {
            source: 'wysiwyg',
            data: ev
        });
    });

    this.getEditor().addEventListener('contextmenu', function(ev) {
        self.eventManager.emit('contextmenu', {
            source: 'wysiwyg',
            data: ev
        });
    });

    this.getEditor().addEventListener('focus', function() {
        self.eventManager.emit('focus', {
            source: 'wysiwyg'
        });
    });

    this.getEditor().addEventListener('blur', function() {
        self.eventManager.emit('blur', {
            source: 'wysiwyg'
        });
    });

    this.getEditor().addEventListener('pathChange', function(data) {
        var isInPreTag = /PRE/.test(data.path);
        var isInCodeTag = />CODE$/.test(data.path);
        var state = {
            bold: /(>B)|(>STRONG)/.test(data.path),
            italic: /(>I)|(>EM)/.test(data.path),
            code: !isInPreTag && isInCodeTag,
            codeBlock: isInPreTag && isInCodeTag,
            source: 'wysiwyg'
        };

        self.eventManager.emit('stateChange', state);
    });
};

/**
 * Handler of keydown event
 * @param {object} keyboardEvent Event object
 * @private
 */
WysiwygEditor.prototype._onKeyDown = function(keyboardEvent) {
    var keyMap = keyMapper.convert(keyboardEvent);

    //to avoid duplicate event firing in firefox
    if (keyboardEvent.keyCode) {
        this.eventManager.emit('keyMap', {
            source: 'wysiwyg',
            keyMap: keyMap,
            data: keyboardEvent
        });

        this.eventManager.emit('wysiwygKeyEvent', {
            keyMap: keyMap,
            data: keyboardEvent
        });
    }
};

/**
 * _initDefaultKeyEventHandler
 * Initialize default event handler
 * @private
 */
WysiwygEditor.prototype._initDefaultKeyEventHandler = function() {
    var self = this;

    this.addKeyEventHandler('ENTER', function(ev, range) {
        if (self._isInOrphanText(range)) {
            //We need this cuz input text right after table make orphan text in webkit
            self.defer(function() {
                self._wrapDefaultBlockToOrphanTexts();
                self.breakToNewDefaultBlock(range, 'before');
            });
        }

        self.defer(function() {
            self._scrollToRangeIfNeed();
        });
    });

    this.addKeyEventHandler('TAB', function(ev) {
        var editor = self.getEditor();
        var isAbleToInsert4Space = !self.getManager('list').isInList();

        if (isAbleToInsert4Space) {
            ev.preventDefault();
            editor.insertPlainText('\u00a0\u00a0\u00a0\u00a0');

            return false;
        }

        return true;
    });
};

WysiwygEditor.prototype._wrapDefaultBlockToOrphanTexts = function() {
    var textNodes;

    textNodes = this.get$Body().contents().filter(findTextNodeFilter);

    textNodes.each(function(i, node) {
        if (node.nextSibling && node.nextSibling.tagName === 'BR') {
            $(node.nextSibling).remove();
        }

        $(node).wrap('<div />');
    });
};

/**
 * Scroll editor area to current cursor position if need
 * @private
 */
WysiwygEditor.prototype._scrollToRangeIfNeed = function() {
    var range = this.getEditor().getSelection().cloneRange();
    var cursorTop = this.getEditor().getCursorPosition(range).top - this.$editorContainerEl.offset().top;

    if (cursorTop >= this.get$Body().height()) {
        range.endContainer.scrollIntoView();
    }
};

/**
 * _isInOrphanText
 * check if range is orphan text
 * @param {Range} range range
 * @returns {boolean} result
 * @private
 */
WysiwygEditor.prototype._isInOrphanText = function(range) {
    return range.startContainer.nodeType === Node.TEXT_NODE
           && range.startContainer.parentNode === this.get$Body()[0];
};

/**
 * _wrapDefaultBlockTo
 * Wrap default block to passed range
 * @param {Range} range range
 * @private
 */
WysiwygEditor.prototype._wrapDefaultBlockTo = function(range) {
    var block, textElem, cursorOffset, insertTargetNode;

    this.saveSelection(range);
    this._joinSplitedTextNodes();
    this.restoreSavedSelection();

    range = this.getEditor().getSelection().cloneRange();

    textElem = range.startContainer;
    cursorOffset = range.startOffset;

    //이때 range의 정보들이 body기준으로 변경된다(텍스트 노드가 사라져서)
    //after code below, range range is arranged by body
    block = this.getEditor().createDefaultBlock([range.startContainer]);

    //range for insert block
    insertTargetNode = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset);
    if (insertTargetNode) {
        range.setStartBefore(insertTargetNode);
    } else {
        //컨테이너의 차일드가 이노드 한개뿐일경우
        range.selectNodeContents(range.startContainer);
    }

    range.collapse(true);

    range.insertNode(block);

    //revert range to original node
    range.setStart(textElem, cursorOffset);
    range.collapse(true);

    this.getEditor().setSelection(range);
};

/**
 * findTextNodeFilter
 * @this Node
 * @returns {boolean} true or not
 */
function findTextNodeFilter() {
    return this.nodeType === Node.TEXT_NODE;
}

/**
 * _joinSplitedTextNodes
 * Join spliated text nodes
 * @private
 */
WysiwygEditor.prototype._joinSplitedTextNodes = function() {
    var textNodes, prevNode,
        lastGroup,
        nodesToRemove = [];

    textNodes = this.get$Body().contents().filter(findTextNodeFilter);

    textNodes.each(function(i, node) {
        if (prevNode === node.previousSibling) {
            lastGroup.nodeValue += node.nodeValue;
            nodesToRemove.push(node);
        } else {
            lastGroup = node;
        }

        prevNode = node;
    });

    $(nodesToRemove).remove();
};


/**
 * saveSelection
 * Save current selection before modification
 * @api
 * @memberOf WysiwygEditor
 * @param {Range} range Range object
 */
WysiwygEditor.prototype.saveSelection = function(range) {
    var sq = this.getEditor();

    if (!range) {
        range = sq.getSelection().cloneRange();
    }

    this.getEditor()._saveRangeToBookmark(range);
};

/**
 * restoreSavedSelection
 * Restore saved selection
 * @api
 * @memberOf WysiwygEditor
 */
WysiwygEditor.prototype.restoreSavedSelection = function() {
    var sq = this.getEditor();
    sq.setSelection(sq._getRangeAndRemoveBookmark());
};

/**
 * _wrapDefaultBlockToListInner
 * Wrap default block to list inner contents
 * @private
 */
WysiwygEditor.prototype._wrapDefaultBlockToListInner = function() {
    this.get$Body().find('li').each(function(index, node) {
        if ($(node).find('div').length <= 0) {
            $(node).wrapInner('<div />');
        }
    });
};

/**
 * reset
 * Reset wysiwyg editor
 * @api
 * @memberOf WysiwygEditor
 */
WysiwygEditor.prototype.reset = function() {
    this.setValue('');
};

/**
 * changeBlockFormatTo
 * Change current range block format to passed tag
 * @api
 * @memberOf WysiwygEditor
 * @param {string} targetTagName Target element tag name
 */
WysiwygEditor.prototype.changeBlockFormatTo = function(targetTagName) {
    this.getEditor().changeBlockFormatTo(targetTagName);
    this.eventManager.emit('wysiwygRangeChangeAfter', this);
};

/**
 * makeEmptyBlockCurrentSelection
 * Make empty block to current selection
 * @api
 * @memberOf WysiwygEditor
 */
WysiwygEditor.prototype.makeEmptyBlockCurrentSelection = function() {
    var self = this;

    this.getEditor().modifyBlocks(function(frag) {
        if (!frag.textContent) {
            frag = self.getEditor().createDefaultBlock();
        }

        return frag;
    });
};

/**
 * focus
 * Focus to editor
 * @api
 * @memberOf WysiwygEditor
 */
WysiwygEditor.prototype.focus = function() {
    this.editor.focus();
};

/**
 * remove
 * Remove wysiwyg editor
 * @api
 * @memberOf WysiwygEditor
 */
WysiwygEditor.prototype.remove = function() {
    this.getEditor().destroy();

    this.editor = null;
    this.$body = null;
};

/**
 * setHeight
 * Set editor height
 * @api
 * @memberOf WysiwygEditor
 * @param {number|string} height pixel of height or "auto"
 */
WysiwygEditor.prototype.setHeight = function(height) {
    this._height = height;

    if (height === 'auto') {
        this.get$Body().css('overflow', 'visible');
        this.get$Body().css('height', 'auto');
    } else {
        this.get$Body().css('overflow', 'auto');
        this.get$Body().css('height', '100%');
        this.$editorContainerEl.height(height);
    }
};

/**
 * setValue
 * Set value to wysiwyg editor
 * @api
 * @memberOf WysiwygEditor
 * @param {string} html HTML text
 */
WysiwygEditor.prototype.setValue = function(html) {
    html = this.eventManager.emitReduce('wysiwygSetValueBefore', html);

    this.editor.setHTML(html);

    this.eventManager.emit('wysiwygSetValueAfter', this);
    this.eventManager.emit('contentChangedFromWysiwyg', this);

    this.moveCursorToEnd();

    this.getEditor().preserveLastLine();

    this.getEditor().removeLastUndoStack();
    this.getEditor().saveUndoState();
};

/**
 * getValue
 * Get value of wysiwyg editor
 * @api
 * @memberOf WysiwygEditor
 * @returns {string} html
 */
WysiwygEditor.prototype.getValue = function() {
    var html;

    this._prepareGetHTML();

    html = this.editor.getHTML();

    //empty line replace to br
    html = html.replace(FIND_EMPTY_LINE, function(match, tag) {
        var result;

        //we maintain empty list
        if (tag === 'li') {
            result = match;
        //we maintain empty table
        } else if (tag === 'td' || tag === 'th') {
            result = '<' + tag + '></' + tag + '>';
        } else {
            result = '<br />';
        }

        return result;
    });

    //remove unnecessary brs
    html = html.replace(FIND_UNNECESSARY_BR, '</$1>');

    //remove contenteditable block, in this case div
    html = html.replace(/<div>/g, '');
    html = html.replace(/<\/div>/g, '<br />');

    html = this.eventManager.emitReduce('wysiwygProcessHTMLText', html);

    return html;
};

/**
 * _prepareGetHTML
 * Prepare before get html
 * @memberOf WysiwygEditor
 * @private
 */
WysiwygEditor.prototype._prepareGetHTML = function() {
    var self = this;
    //for ensure to fire change event
    self.get$Body().attr('lastGetValue', Date.now());

    self._joinSplitedTextNodes();

    self.getEditor().modifyDocument(function() {
        self.eventManager.emit('wysiwygGetValueBefore', self);
    });
};

/**
 * _postProcessForChange
 * Post process for change
 * @private
 * @memberOf WysiwygEditor
 */
WysiwygEditor.prototype._postProcessForChange = function() {
    var self = this;
    self.getEditor().modifyDocument(function() {
        self.eventManager.emit('wysiwygRangeChangeAfter', self);
    });
};

/**
 * readySilentChange
 * Ready to silent change
 * @api
 * @memberOf WysiwygEditor
 */
WysiwygEditor.prototype.readySilentChange = function() {
    if (canObserveMutations && !this.getEditor().isIgnoreChange()) {
        this._silentChange = true;
    }
};

/**
 * getEditor
 * Get squire
 * @api
 * @memberOf WysiwygEditor
 * @returns {SquireExt} squire
 */
WysiwygEditor.prototype.getEditor = function() {
    return this.editor;
};

/**
 * replaceSelection
 * Replace text of passed range
 * @api
 * @memberOf WysiwygEditor
 * @param {string} content Content for change current selection
 * @param {Range} range range
 */
WysiwygEditor.prototype.replaceSelection = function(content, range) {
    this.getEditor().replaceSelection(content, range);
};

/**
 * replaceRelativeOffset
 * Replace content by relative offset
 * @api
 * @memberOf WysiwygEditor
 * @param {string} content Content for change current selection
 * @param {number} offset Offset of current range
 * @param {number} overwriteLength Length to overwrite content
 */
WysiwygEditor.prototype.replaceRelativeOffset = function(content, offset, overwriteLength) {
    this.getEditor().replaceRelativeOffset(content, offset, overwriteLength);
};

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
WysiwygEditor.prototype.addWidget = function(range, node, style, offset) {
    var pos = this.getEditor().getSelectionPosition(range, style, offset);
    var editorContainerPos = this.$editorContainerEl.offset();

    this.$editorContainerEl.append(node);

    $(node).css({
        position: 'absolute',
        top: pos.top - editorContainerPos.top,
        left: pos.left - editorContainerPos.left
    });
};

/**
 * get$Body
 * Get jQuery wrapped body container of Squire
 * @api
 * @memberOf WysiwygEditor
 * @returns {JQuery} jquery body
 */
WysiwygEditor.prototype.get$Body = function() {
    return this.getEditor().get$Body();
};

/**
 * hasFormatWithRx
 * Check with given regexp whether current path has some format or not
 * @api
 * @memberOf WysiwygEditor
 * @param {RegExp} rx Regexp
 * @returns {boolean} Match result
 */
WysiwygEditor.prototype.hasFormatWithRx = function(rx) {
    return this.getEditor().getPath().match(rx);
};

/**
 * breakToNewDefaultBlock
 * Break line to new default block from passed range
 * @api
 * @memberOf WysiwygEditor
 * @param {Range} range Range object
 * @param {string} [where] "before" or not
 */
WysiwygEditor.prototype.breakToNewDefaultBlock = function(range, where) {
    var div, appendBefore, currentNode;

    currentNode = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset)
        || domUtils.getChildNodeByOffset(range.startContainer, range.startOffset - 1);

    appendBefore = domUtils.getParentUntil(currentNode, this.get$Body()[0]);

    div = this.editor.createDefaultBlock();

    if (where === 'before') {
        $(appendBefore).before(div);
    } else {
        $(appendBefore).after(div);
    }

    range.setStart(div, 0);
    range.collapse(true);
    this.editor.setSelection(range);
};


/**
 * replaceContentText
 * Replace textContet of node
 * @api
 * @memberOf WysiwygEditor
 * @param {Node} container Container node
 * @param {string} from Target text to change
 * @param {string} to Replacement text
 */
WysiwygEditor.prototype.replaceContentText = function(container, from, to) {
    var before;

    before = $(container).html();
    $(container).html(before.replace(from, to));
};

/**
 * unwrapBlockTag
 * Unwrap Block tag of current range
 * @api
 * @memberOf WysiwygEditor
 * @param {function} [condition] iterate with tagName
 */
WysiwygEditor.prototype.unwrapBlockTag = function(condition) {
    if (!condition) {
        condition = function(tagName) {
            return FIND_BLOCK_TAGNAME_RX.test(tagName);
        };
    }

    this.getEditor().changeBlockFormat(condition);
    this.eventManager.emit('wysiwygRangeChangeAfter', this);
};

/**
 * insertSelectionMarker
 * Insert selection marker
 * @api
 * @memberOf WysiwygEditor
 * @param {Range} range Range to save selection
 * @returns {Range} range
 */
WysiwygEditor.prototype.insertSelectionMarker = function(range) {
    return this._selectionMarker.insertMarker(range, this.getEditor());
};

/**
 * restoreSelectionMarker
 * Restore marker to selection
 * @api
 * @memberOf WysiwygEditor
 * @returns {Range} range
 */
WysiwygEditor.prototype.restoreSelectionMarker = function() {
    return this._selectionMarker.restore(this.getEditor());
};

/**
 * addManager
 * Add manager
 * @api
 * @memberOf WysiwygEditor
 * @param {string} name Manager name
 * @param {function} Manager Constructor
 */
WysiwygEditor.prototype.addManager = function(name, Manager) {
    var instance;

    if (!Manager) {
        Manager = name;
        name = null;
    }

    instance = new Manager(this);
    this._managers[name || instance.name] = instance;
};

/**
 * getManager
 * Get manager by manager name
 * @api
 * @memberOf WysiwygEditor
 * @param {string} name Manager name
 * @returns {object} manager
 */
WysiwygEditor.prototype.getManager = function(name) {
    return this._managers[name];
};

/**
 * Set cursor position to end
 * @api
 * @memberOf WysiwygEditor
 */
WysiwygEditor.prototype.moveCursorToEnd = function() {
    this.getEditor().moveCursorToEnd();
    this.getEditor().scrollTop(this.get$Body().height());
    this._correctRangeAfterMoveCursor('end');
};

/**
 * Set cursor position to start
 * @api
 * @memberOf WysiwygEditor
 */
WysiwygEditor.prototype.moveCursorToStart = function() {
    this.getEditor().moveCursorToStart();
    this.getEditor().scrollTop(0);
};

/**
 * Set cursor position to start
 * @api
 * @memberOf WysiwygEditor
 * @param {number} value Scroll amount
 * @returns {boolean}
 */
WysiwygEditor.prototype.scrollTop = function(value) {
    return this.getEditor().scrollTop(value);
};

/**
 * _correctRangeAfterMoveCursor
 * For arrange Range after moveCursorToEnd api invocation. Squire has bug in Firefox, IE.
 * @memberOf WysiwygEditor
 * @param {string} direction Direction of cursor move
 * @private
 */
WysiwygEditor.prototype._correctRangeAfterMoveCursor = function(direction) {
    var range = this.getEditor().getSelection().cloneRange();
    var cursorContainer = this.get$Body()[0];

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
};

/**
 * Get current Range object
 * @api
 * @memberOf WysiwygEditor
 * @returns {Range}
 */
WysiwygEditor.prototype.getRange = function() {
    return this.getEditor().getSelection().cloneRange();
};

/**
 * Get text object of current range
 * @api
 * @memberOf WysiwygEditor
 * @param {Range} range Range object
 * @returns {WwTextObject}
 */
WysiwygEditor.prototype.getTextObject = function(range) {
    return new WwTextObject(this, range);
};

WysiwygEditor.prototype.defer = function(callback) {
    var self = this;

    setTimeout(function() {
        if (self.isEditorValid()) {
            callback(self);
        }
    }, 0);
};

WysiwygEditor.prototype.isEditorValid = function() {
    return this.getEditor() && $.contains(this.$editorContainerEl[0].ownerDocument, this.$editorContainerEl[0]);
};

/**
 * WysiwygEditor factory method
 * @api
 * @memberOf WysiwygEditor
 * @param {jQuery} $el Container element for editor
 * @param {EventManager} eventManager EventManager instance
 * @returns {WysiwygEditor} wysiwygEditor
 */
WysiwygEditor.factory = function($el, eventManager) {
    var wwe = new WysiwygEditor($el, eventManager);

    wwe.init();

    wwe.addManager(WwListManager);
    wwe.addManager(WwTaskManager);
    wwe.addManager(WwTableSelectionManager);
    wwe.addManager(WwTableManager);
    wwe.addManager(WwHrManager);
    wwe.addManager(WwPManager);
    wwe.addManager(WwHeadingManager);
    wwe.addManager(WwCodeBlockManager);

    return wwe;
};

module.exports = WysiwygEditor;
