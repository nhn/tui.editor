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
 * @class
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
 * @param {function} onInitComplete when editor is ready invoke callback function
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
 */
WysiwygEditor.prototype._preprocessForInlineElement = function(html) {
    return html.replace(/<br>( *)<img/g, '<br><br>$1<img');
};
/**
 * _initEvent
 * Initialize EventManager event handler
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

    this.getEditor().getDocument().addEventListener('dragover', function(ev) {
        ev.preventDefault();

        return false;
    });

    this.getEditor().getDocument().addEventListener('drop', function(ev) {
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

        if (!self._silentChange) {
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
        var state = {
            bold: /(>B$)|(>B>)|(>STRONG$)|(>STRONG>)/.test(data.path),
            italic: /(>I$)|(>I>)|(>EM$)|(>EM>)/.test(data.path),
            source: 'wysiwyg'
        };

        self.eventManager.emit('stateChange', state);
    });
};

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
 */
WysiwygEditor.prototype._initDefaultKeyEventHandler = function() {
    var self = this;

    this.addKeyEventHandler('ENTER', function() {
        setTimeout(function() {
            self._scrollToRangeIfNeed();
        }, 0);
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
 */
WysiwygEditor.prototype._isInOrphanText = function(range) {
    return range.startContainer.nodeType === Node.TEXT_NODE
           && range.startContainer.parentNode === this.get$Body()[0];
};

/**
 * _wrapDefaultBlockTo
 * Wrap default block to passed range
 * @param {Range} range range
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
 * @param {Range} range range
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
 */
WysiwygEditor.prototype.restoreSavedSelection = function() {
    var sq = this.getEditor();
    sq.setSelection(sq._getRangeAndRemoveBookmark());
};

/**
 * _wrapDefaultBlockToListInner
 * Wrap default block to list inner contents
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
 */
WysiwygEditor.prototype.reset = function() {
    this.setValue('');
};

/**
 * changeBlockFormatTo
 * Change current range block format to passed tag
 * @param {string} targetTagName tag name
 */
WysiwygEditor.prototype.changeBlockFormatTo = function(targetTagName) {
    this.getEditor().changeBlockFormatTo(targetTagName);
    this.eventManager.emit('wysiwygRangeChangeAfter', this);
};

/**
 * makeEmptyBlockCurrentSelection
 * Make current selection to empy block
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
 */
WysiwygEditor.prototype.focus = function() {
    this.editor.focus();
};

/**
 * remove
 * Remove wysiwyg editor
 */
WysiwygEditor.prototype.remove = function() {
    this.editor.removeEventListener('focus');
    this.editor.removeEventListener('blur');
    this.editor.removeEventListener('keydown');
    this.editor.removeEventListener('keyup');
    this.editor.removeEventListener('keypress');
    this.editor.removeEventListener('paste');
    this.editor = null;
    this.$body = null;
};

/**
 * setHeight
 * Set editor height
 * @param {number|string} height pixel or "auto"
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
 * @param {string} html html text
 */
WysiwygEditor.prototype.setValue = function(html) {
    html = this.eventManager.emitReduce('wysiwygSetValueBefore', html);

    this.editor.setHTML(html);

    this.eventManager.emit('wysiwygSetValueAfter', this);
    this.eventManager.emit('contentChangedFromWysiwyg', this);

    this.moveCursorToEnd();

    this.getEditor().preserveLastLine();

    this.getEditor().removeLastUndoStack();
    this.getEditor().recordUndoState();
};

/**
 * getValue
 * Get value of wysiwyg editor
 * @returns {string} html text
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
 */
WysiwygEditor.prototype._prepareGetHTML = function() {
    this.readySilentChange();

    //for ensure to fire change event
    this.get$Body().attr('lastGetValue', Date.now());

    this._joinSplitedTextNodes();

    this.eventManager.emit('wysiwygGetValueBefore', this);
};

/**
 * _postProcessForChange
 * Post process for change
 */
WysiwygEditor.prototype._postProcessForChange = function() {
    var self = this;
    self.readySilentChange();
    self.eventManager.emit('wysiwygRangeChangeAfter', self);
};

/**
 * readySilentChange
 * Ready to silent change
 */
WysiwygEditor.prototype.readySilentChange = function() {
    if (canObserveMutations && !this.getEditor().isIgnoreChange()) {
        this._silentChange = true;
    }
};

/**
 * getEditor
 * Get squire
 * @returns {SquireExt} squire
 */
WysiwygEditor.prototype.getEditor = function() {
    return this.editor;
};

/**
 * replaceSelection
 * Replace text of passed range
 * @param {string} content content to change
 * @param {Range} range range
 */
WysiwygEditor.prototype.replaceSelection = function(content, range) {
    this.getEditor().replaceSelection(content, range);
};

/**
 * replaceRelativeOffset
 * Replace content by relative offset
 * @param {string} content content to change
 * @param {number} offset offset by current range
 * @param {number} overwriteLength count to overwrite
 */
WysiwygEditor.prototype.replaceRelativeOffset = function(content, offset, overwriteLength) {
    this.getEditor().replaceRelativeOffset(content, offset, overwriteLength);
};

/**
 * addWidget
 * Add widget to selection
 * @param {Range} range range
 * @param {Node} node widget node
 * @param {string} style adding style "over" or "bottom"
 * @param {number} [offset] offset to adjust
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
 * get jquery wraped body content of squire
 * @returns {JQuery} jquery body
 */
WysiwygEditor.prototype.get$Body = function() {
    return this.getEditor().get$Body();
};

/**
 * hasFormatWithRx
 * check has format with current path with passed regexp
 * @param {RegExp} rx regexp
 * @returns {boolean} result
 */
WysiwygEditor.prototype.hasFormatWithRx = function(rx) {
    return this.getEditor().getPath().match(rx);
};

/**
 * breakToNewDefaultBlock
 * Break to new default block from passed range
 * @param {Range} range range
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
 * @param {Node} container node
 * @param {string} from target text to change
 * @param {string} to text that replacement
 */
WysiwygEditor.prototype.replaceContentText = function(container, from, to) {
    var before;

    before = $(container).html();
    $(container).html(before.replace(from, to));
};

/**
 * unwrapBlockTag
 * Unwrap Block tag of current range
 * @param {function} condition interate with tagName
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
 * @param {Range} range range to save selection
 * @returns {Range} range
 */
WysiwygEditor.prototype.insertSelectionMarker = function(range) {
    return this._selectionMarker.insertMarker(range, this.getEditor());
};

/**
 * restoreSelectionMarker
 * Restore marker to selection
 * @returns {Range} range
 */
WysiwygEditor.prototype.restoreSelectionMarker = function() {
    return this._selectionMarker.restore(this.getEditor());
};

/**
 * addManager
 * Add manger
 * @param {string} name manager name
 * @param {function} Manager constructor
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
 * Get manager by name
 * @param {string} name manager name
 * @returns {object} manager
 */
WysiwygEditor.prototype.getManager = function(name) {
    return this._managers[name];
};

WysiwygEditor.prototype.moveCursorToEnd = function() {
    this.getEditor().moveCursorToEnd();
    this.getEditor().scrollTop(this.get$Body().height());
    this._correctRangeAfterMoveCursor('end');
};

WysiwygEditor.prototype.moveCursorToStart = function() {
    this.getEditor().moveCursorToStart();
    this.getEditor().scrollTop(0);
};

WysiwygEditor.prototype.scrollTop = function(value) {
    return this.getEditor().scrollTop(value);
};

/**
 * _correctRangeAfterMoveCursor
 * we need arrange range after moveCursorToEnd api invoke cuz squire has bug in firefox, IE
 * @param {string} direction direction of cursormove
 */
WysiwygEditor.prototype._correctRangeAfterMoveCursor = function(direction) {
    var range = this.getEditor().getSelection().cloneRange();
    var cursorContainer, offset;

    if (direction === 'start') {
        cursorContainer = this.get$Body()[0].firstChild;
        offset = 0;
    } else {
        cursorContainer = this.get$Body()[0].lastChild;
        offset = domUtils.getOffsetLength(cursorContainer);

        // IE have problem with cursor after br
        if (domUtils.getNodeName(cursorContainer.lastChild) === 'BR') {
            offset -= 1;
        }
    }

    range.setStart(cursorContainer, offset);

    range.collapse(true);

    this.getEditor().setSelection(range);
};

WysiwygEditor.prototype.getRange = function() {
    return this.getEditor().getSelection().cloneRange();
};

WysiwygEditor.prototype.getTextObject = function(range) {
    return new WwTextObject(this, range);
};

/**
 * WysiwygEditor factory
 * @param {jQuery} $el element to insert editor
 * @param {EventManager} eventManager EventManager instance
 * @returns {WysiwygEditor} wysiwygEditor
 */
WysiwygEditor.factory = function($el, eventManager) {
    var wwe = new WysiwygEditor($el, eventManager);

    wwe.init();

    wwe.addManager(WwListManager);
    wwe.addManager(WwTaskManager);
    wwe.addManager(WwTableManager);
    wwe.addManager(WwHrManager);
    wwe.addManager(WwPManager);
    wwe.addManager(WwHeadingManager);
    wwe.addManager(WwCodeBlockManager);

    return wwe;
};

module.exports = WysiwygEditor;
