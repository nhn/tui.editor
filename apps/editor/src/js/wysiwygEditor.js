/**
 * @fileoverview Implments wysiwygEditor
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils'),
    WwClipboardManager = require('./wwClipboardManager'),
    WwSelectionMarker = require('./wwSelectionMarker'),
    WwTaskManager = require('./wwTaskManager'),
    WwTableManager = require('./wwTableManager'),
    WwHrManager = require('./wwHrManager'),
    WwPManager = require('./wwPManager'),
    WwHeadingManager = require('./wwHeadingManager'),
    SquireExt = require('./squireExt');

var util = tui.util;

var FIND_EMPTY_LINE = /<(.+)>(<br>|<br \/>|<BR>|<BR \/>)<\/\1>/g,
    FIND_UNNECESSARY_BR = /(?:<br>|<br \/>|<BR>|<BR \/>)<\/(.+?)>/g,
    FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD)\b/;

var EDITOR_CONTENT_CSS_CLASSNAME = 'tui-editor-contents';

/**
 * WysiwygEditor
 * @exports WysiwygEditor
 * @constructor
 * @class
 * @param {jQuery} $el element to insert editor
 * @param {string[]} contentStyles List of CSS style file path for HTML content
 * @param {EventManager} eventManager EventManager instance
 */
function WysiwygEditor($el, contentStyles, eventManager) {
    this.eventManager = eventManager;
    this.$editorContainerEl = $el;
    this.contentStyles = contentStyles;

    this._height = 0;

    this._silentChange = false;

    this._keyEventHandlers = [];

    this._clipboardManager = new WwClipboardManager(this);
    this._selectionMarker = new WwSelectionMarker();

    this._initEvent();
    this._initDefaultKeyEventHandler();
}

/**
 * init
 * @param {function} callback when editor is ready invoke callback function
 */
WysiwygEditor.prototype.init = function(callback) {
    var self = this;

    this.$iframe = $('<iframe height="100%" />');

    this.$iframe.load(function() {
        self._initSquire();

        //쿽스모드 방지 코드(makeSureStandardMode)로 인해
        //load 이벤트가 발생되는 브라우저들이있다(IE)
        //에디터의 동작을 맞추기해 완료콜백을 프레임지연해서 모든 과정이 완료되도록 동작을 일치 시켜준다.
        setTimeout(function() {
            if (callback) {
                callback();
                callback = null;
            }
        }, 0);
    });

    this.$editorContainerEl.css('position', 'relative');
    this.$editorContainerEl.append(this.$iframe);
};

/**
 * _initSquire
 * Initialize squire
 */
WysiwygEditor.prototype._initSquire = function() {
    var self = this,
        doc = self.$iframe[0].contentDocument;

    self._makeSureStandardMode(doc);
    if (self.editor && self._isIframeReady()) {
        return;
    }

    self._initStyleSheet(doc);
    self._initEditorContainerStyles(doc);

    self.editor = new SquireExt(doc, {
        blockTag: 'DIV'
    });

    self._initSquireEvent();
    self._clipboardManager.init();

    $(doc).on('click', function() {
        self.focus();
    });
};

/**
 * _isIframeReady
 * Check whether iframe ready or not
 * @returns {boolean} result
 */
WysiwygEditor.prototype._isIframeReady = function() {
    var iframeWindow = this.$iframe[0].contentWindow;
    return (iframeWindow !== null && $(iframeWindow.document.body).hasClass(EDITOR_CONTENT_CSS_CLASSNAME));
};

/**
 * _makeSureStandardMode
 * Make document standard mode if not
 * @param {Document} doc document
 */
WysiwygEditor.prototype._makeSureStandardMode = function(doc) {
    //if Not in quirks mode
    if (doc.compatMode !== 'CSS1Compat') {
        //독타입 삽입후 IE는 load 콜백이 다시 호출되는데 같은 프레임에서 재귀호출처럼 실행됨
        doc.open();
        doc.write('<!DOCTYPE html><title></title>');
        doc.close();
        //load콜백이 끝나면 첫번째 진행이 다시 진행됨(initSquire의 나머지부분이 이어서 재귀호출처럼 실행됨)
    }
};

/**
 * _initStyleSheet
 * Initialize style sheet
 * @param {Document} doc document
 */
WysiwygEditor.prototype._initStyleSheet = function(doc) {
    var styleLink;

    util.forEach(this.contentStyles, function(stylePath) {
        styleLink = doc.createElement('link');
        styleLink.rel = 'stylesheet';
        styleLink.href = stylePath;

        doc.querySelector('head').appendChild(styleLink);
    });
};

/**
 * _initEditorContainerStyles
 * Initialize editor container style
 * @param {Document} doc document
 */
WysiwygEditor.prototype._initEditorContainerStyles = function(doc) {
    var bodyStyle, body;

    doc.querySelector('html').style.height = '100%';

    body = doc.querySelector('body');
    body.className = EDITOR_CONTENT_CSS_CLASSNAME;

    bodyStyle = body.style;
    bodyStyle.padding = '0 5px';
};

/**
 * _initEvent
 * Initialize EventManager event handler
 */
WysiwygEditor.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('changeModeToWysiwyg', function() {
        self._autoResizeHeightIfNeed();
    });
};

/**
 * addKeyEventHandler
 * Add key event handler
 * @param {function} handler handler
 */
WysiwygEditor.prototype.addKeyEventHandler = function(handler) {
   this._keyEventHandlers.push(handler);
};

/**
 * _runKeyEventHandlers
 * Run key event handler
 * @param {Event} event event object
 */
WysiwygEditor.prototype._runKeyEventHandlers = function(event) {
    var range = this.getEditor().getSelection().cloneRange();
/*
    console.log(event);
    console.log('-------->', event.keyCode, event.keyIdentifier);
    console.log('startContainer', range.startContainer);
    console.log('startOffset', range.startOffset);
    console.log('startContainer.parentNode', range.startContainer.parentNode);
    console.log('startContainer.previousSibling', range.startContainer.previousSibling);
    console.log('startContainer.nextSibling', range.startContainer.nextSibling);
    if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
        console.log('currentPosition', range.startContainer.childNodes[range.startOffset]);
    } else {
        console.log('currentPosition', range.startContainer.nodeValue[range.startOffset]);
    }
    if (range.startOffset > 0) console.log('prev Position', range.startContainer.childNodes[range.startOffset - 1] || range.startContainer.nodeValue[range.startOffset - 1]);
    console.log('path', this.editor.getPath());
*/
    util.forEachArray(this._keyEventHandlers, function(handler) {
        if (handler(event, range)) {
            return false;
        }
    });
};

/**
 * _initSquireEvent
 * Initialize squire event
 */
WysiwygEditor.prototype._initSquireEvent = function() {
    var self = this;

    this.getEditor().addEventListener('paste', function(clipboardEvent) {
        self.eventManager.emit('paste', {
            source: 'wysiwyg',
            data: clipboardEvent
        });
    });

    this.getEditor().getDocument().addEventListener('dragover', function(e) {
        e.preventDefault();
        return false;
    });

    this.getEditor().getDocument().addEventListener('drop', function(eventData) {
        eventData.preventDefault();

        self.eventManager.emit('drop', {
            source: 'wysiwyg',
            data: eventData
        });

        return false;
    });

    this.getEditor().addEventListener('input', function() {
        var sel = self.editor.getSelection(),
            eventObj;

        if (!self._silentChange) {
            eventObj = {
                source: 'wysiwyg',
                selection: sel,
                textContent: sel.endContainer.textContent,
                caretOffset: sel.endOffset
            };

            self.eventManager.emit('changeFromWysiwyg', eventObj);
            self.eventManager.emit('change', eventObj);
            self.eventManager.emit('contentChangedFromWysiwyg', self);
        } else {
            self._silentChange = false;
        }

        self._autoResizeHeightIfNeed();
    });

    this.getEditor().addEventListener('keydown', function(event) {
        self._runKeyEventHandlers(event);
    });

    this.getEditor().addEventListener('click', function(event) {
        self.eventManager.emit('click', {
            source: 'wysiwyg',
            data: event
        });
    });

    this.getEditor().addEventListener('mousedown', function(event) {
        self.eventManager.emit('mousedown', {
            source: 'wysiwyg',
            data: event
        });
    });

    this.getEditor().addEventListener('mouseup', function(event) {
        self.eventManager.emit('mouseup', {
            source: 'wysiwyg',
            data: event
        });
    });

    this.getEditor().addEventListener('contextmenu', function(event) {
        self.eventManager.emit('contextmenu', {
            source: 'wysiwyg',
            data: event
        });
    });

    //firefox has problem about keydown event while composition korean
    //파폭에서는 한글입력할때뿐아니라 한글입력도중에 엔터키와같은 특수키 입력시 keydown이벤트가 발생하지 않는다
    if (util.browser.firefox) {
        this.getEditor().addEventListener('keypress', function(event) {
            if (event.keyCode) {
                self._runKeyEventHandlers(event);
            }
        });
    }

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
        var state =  {
            bold: /(>B$)|(>B>)|(>STRONG$)|(>STRONG>)/.test(data.path),
            italic: /(>I$)|(>I>)|(>EM$)|(>EM>)/.test(data.path)
        };

        self.eventManager.emit('stateChange', state);
    });
 };

/**
 * _initDefaultKeyEventHandler
 * Initialize default event handler
 */
WysiwygEditor.prototype._initDefaultKeyEventHandler = function() {
    var self = this;

    this.addKeyEventHandler(function(event, range) {
        var isHandled;

        //enter
        if (event.keyCode === 13) {
            if (self._isInOrphanText(range)) {
                self._wrapDefaultBlockTo(range);
                isHandled = true;
            }
        //backspace
        } else if (event.keyCode === 8) {
            if (!range.collapsed) {
                self.postProcessForChange();
            }
        }

        return isHandled;
    });
};

/**
 * _autoResizeHeightIfNeed
 * Auto resize height if need
 */
WysiwygEditor.prototype._autoResizeHeightIfNeed = function() {
    if (this._height === 'auto') {
        this._heightToFitContents();
    }
};

/**
 * _heightToFitContents
 * Resize height to fit contents
 */
WysiwygEditor.prototype._heightToFitContents = function() {
    this.$editorContainerEl.height(this.get$Body().height());
};

/**
 * _isInOrphanText
 * check if range is orphan text
 * @param {Range} range range
 * @returns {boolean} result
 */
WysiwygEditor.prototype._isInOrphanText = function(range) {
    return range.startContainer.nodeType === Node.TEXT_NODE && range.startContainer.parentNode.tagName  === 'BODY';
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
    insertTargetNode = domUtils.getChildNodeAt(range.startContainer, range.startOffset);
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
 * _joinSplitedTextNodes
 * Join spliated text nodes
 */
WysiwygEditor.prototype._joinSplitedTextNodes = function() {
    var findTextNodeFilter, textNodes, prevNode,
        lastGroup,
        nodesToRemove = [];

    findTextNodeFilter = function() {
        return this.nodeType === 3;
    };

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
 * _wrapDefaultBlockToOrphanTexts
 * Wrap default block to orphan texts
 * mainly, this is used for orhan text that made by controlling hr
 */
WysiwygEditor.prototype._wrapDefaultBlockToOrphanTexts = function() {
    var findTextNodeFilter, textNodes,

    findTextNodeFilter = function() {
        return this.nodeType === 3;
    };

    textNodes = this.get$Body().contents().filter(findTextNodeFilter);

    textNodes.each(function(i, node) {
        $(node).wrap('<div />');
    });
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
 * reset
 * Reset wysiwyg editor
 */
WysiwygEditor.prototype.reset = function() {
    if (!this._isIframeReady()) {
        this.remove();
        this._initSquire();
    }

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
        this.get$Body().css('overflow', 'hidden');
        this.get$Body().css('height', 'auto');
        this._heightToFitContents();
    } else {
        this.get$Body().css('overflow', 'visible');
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
    this.editor.setHTML(html);
    this._autoResizeHeightIfNeed();

    this.eventManager.emit('wysiwygSetValueAfter', this);
    this.eventManager.emit('contentChangedFromWysiwyg', this);
};

/**
 * getValue
 * Get value of wysiwyg editor
 * @return {string} html text
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
            result = '<' + tag + '>'+'</' + tag + '>';
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
    this._silentChange = true;

    //for ensure to fire change event
    this.get$Body().attr('lastGetValue', Date.now());

    this._joinSplitedTextNodes();
    this._wrapDefaultBlockToOrphanTexts();

    this.eventManager.emit('wysiwygGetValueBefore', this);
};

/**
 * postProcessForChange
 * Post process for change
 */
WysiwygEditor.prototype.postProcessForChange = function() {
    var self = this;

    setTimeout(function() {
        self._silentChange = true;
        self.eventManager.emit('wysiwygRangeChangeAfter', this);
        self = null;
    }, 0);
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

    if (node.parentNode !== this.$editorContainerEl[0]) {
        this.$editorContainerEl.append(node);
    }

    $(node).css({
        position: 'absolute',
        top: pos.top,
        left: pos.left
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
    var div, pathToBody, appendBefore, currentNode;

    currentNode = domUtils.getChildNodeAt(range.startContainer, range.startOffset) || range.startContainer;

    pathToBody = $(currentNode).parentsUntil('body');

    if (pathToBody.length) {
        appendBefore = pathToBody[pathToBody.length - 1];
    } else {
        appendBefore = currentNode;
    }

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
 * WysiwygEditor factory
 * @param {jQuery} $el element to insert editor
 * @param {string[]} contentStyles List of CSS style file path for HTML content
 * @param {EventManager} eventManager EventManager instance
 * @returns {WysiwygEditor} wysiwygEditor
 */
WysiwygEditor.factory = function($el, contentStyles, eventManager) {
    var wwe = new WysiwygEditor($el, contentStyles, eventManager);

    wwe._taskMgr = new WwTaskManager(wwe);
    wwe._tableMgr = new WwTableManager(wwe);
    wwe._hrMgr = new WwHrManager(wwe);
    wwe._pMgr = new WwPManager(wwe);
    wwe._headingMgr = new WwHeadingManager(wwe);

    return wwe;
};

module.exports = WysiwygEditor;
