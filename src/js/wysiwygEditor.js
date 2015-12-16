/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils'),
    WwClipboardManager = require('./wwClipboardManager'),
    WwSelectionMarker = require('./wwSelectionMarker'),
    WwTaskManager = require('./wwTaskManager'),
    WwTableManager = require('./wwTableManager'),
    WwHrManager = require('./wwHrManager'),
    SquireExt = require('./squireExt');

var util = tui.util;

var FIND_HEADING_RX = /h[\d]/i,
    FIND_EMPTY_LINE = /<(.+)>(<br>|<br \/>|<BR>|<BR \/>)<\/\1>/g,
    FIND_UNNECESSARY_BR = /(?:<br>|<br \/>|<BR>|<BR \/>)<\/(.+?)>/g,
    FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD)\b/;

var EDITOR_CONTENT_CSS_CLASSNAME = 'tui-editor-contents';

/**
 * WysiwygEditor
 * @exports WysiwygEditor
 * @constructor
 * @class
 * @param {jQuery} $el 에디터가 들어갈 엘리먼트
 * @param {string[]} contentStyles List of CSS style file path for HTML content
 * @param {EventManager} eventManager 이벤트 매니저
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
}

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

WysiwygEditor.prototype._isIframeReady = function() {
    var iframeWindow = this.$iframe[0].contentWindow;
    return (iframeWindow !== null && $(iframeWindow.document.body).hasClass(EDITOR_CONTENT_CSS_CLASSNAME));
};

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

WysiwygEditor.prototype._initStyleSheet = function(doc) {
    var styleLink;

    util.forEach(this.contentStyles, function(stylePath) {
        styleLink = doc.createElement('link');
        styleLink.rel = 'stylesheet';
        styleLink.href = stylePath;

        doc.querySelector('head').appendChild(styleLink);
    });
};

WysiwygEditor.prototype._initEditorContainerStyles = function(doc) {
    var bodyStyle, body;

    doc.querySelector('html').style.height = '100%';

    body = doc.querySelector('body');
    body.className = EDITOR_CONTENT_CSS_CLASSNAME;

    bodyStyle = body.style;
    bodyStyle.padding = '0 5px';
};

WysiwygEditor.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('changeModeToWysiwyg', function() {
        self._autoResizeHeightIfNeed();
    });
};

WysiwygEditor.prototype.addKeyEventHandler = function(handler) {
   this._keyEventHandlers.push(handler);
};

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

    // @todo 지워야함
    this.addKeyEventHandler(function(event) {
        self._keyEventHandler(event);
    });

    this.getEditor().addEventListener('keydown', function(event) {
        self._runKeyEventHandlers(event);
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

WysiwygEditor.prototype._keyEventHandler = function(event) {
    var self = this,
        range = this.getEditor().getSelection().cloneRange();
    //enter
    if (event.keyCode === 13) {
        if (this.hasFormatWithRx(FIND_HEADING_RX)) {
            //squire의 처리 중간이나 마지막에 개입할 방법이 없어 지연 처리
            setTimeout(function() {
                self._unwrapHeading();
            }, 0);
        } else if (this._isInOrphanText(range)) {
            this._wrapDefaultBlockTo(range);
        }
    //backspace
    } else if (event.keyCode === 8) {
        if (range.collapsed) {
            if (this.hasFormatWithRx(FIND_HEADING_RX) && range.startOffset === 0) {
                this._unwrapHeading();
            }
        }
    }
};

WysiwygEditor.prototype._autoResizeHeightIfNeed = function() {
    if (this._height === 'auto') {
        this._heightToFitContents();
    }
};

WysiwygEditor.prototype._heightToFitContents = function() {
    this.$editorContainerEl.height(this.get$Body().height());
};

WysiwygEditor.prototype._isInOrphanText = function(selection) {
    return selection.startContainer.nodeType === Node.TEXT_NODE && selection.startContainer.parentNode.tagName  === 'BODY';
};

WysiwygEditor.prototype._wrapDefaultBlockTo = function(selection) {
    var block, textElem, cursorOffset, insertTargetNode;

    this.saveSelection(selection);
    this._joinSplitedTextNodes();
    this.restoreSavedSelection();

    selection = this.getEditor().getSelection().cloneRange();

    textElem = selection.startContainer;
    cursorOffset = selection.startOffset;

    //이때 selection의 정보들이 body기준으로 변경된다(텍스트 노드가 사라져서)
    //after code below, selection selection is arselectiond by body
    block = this.getEditor().createDefaultBlock([selection.startContainer]);

    //selection for insert block
    insertTargetNode = domUtils.getChildNodeAt(selection.startContainer, selection.startOffset);
    if (insertTargetNode) {
        selection.setStartBefore(insertTargetNode);
    } else {
        //컨테이너의 차일드가 이노드 한개뿐일경우
        selection.selectNodeContents(selection.startContainer);
    }

    selection.collapse(true);

    selection.insertNode(block);

    //revert selection to original node
    selection.setStart(textElem, cursorOffset);
    selection.collapse(true);

    this.getEditor().setSelection(selection);
};

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

WysiwygEditor.prototype.saveSelection = function(selection) {
    var sq = this.getEditor();

    if (!selection) {
        selection = sq.getSelection().cloneRange();
    }

    this.getEditor()._saveRangeToBookmark(selection);
};

WysiwygEditor.prototype.restoreSavedSelection = function() {
    var sq = this.getEditor();
    sq.setSelection(sq._getRangeAndRemoveBookmark());
};

WysiwygEditor.prototype.reset = function() {
    if (!this._isIframeReady()) {
        this.remove();
        this._initSquire();
    }

    this.setValue('');
};

WysiwygEditor.prototype.changeBlockFormatTo = function(targetTagName) {
    this.getEditor().changeBlockFormatTo(targetTagName);
    this.eventManager.emit('wysiwygRangeChangeAfter', this);
};

WysiwygEditor.prototype.makeEmptyBlockCurrentSelection = function() {
    var self = this;

    this.getEditor().modifyBlocks(function(frag) {
        if (!frag.textContent) {
            frag = self.getEditor().createDefaultBlock();
        }
        return frag;
    });
};

WysiwygEditor.prototype.focus = function() {
    this.editor.focus();
};

WysiwygEditor.prototype.remove = function() {
    this.editor.removeEventListener('focus');
    this.editor.removeEventListener('blur');
    this.editor.removeEventListener('keydown');
    this.editor.removeEventListener('keypress');
    this.editor.removeEventListener('paste');
    this.editor = null;
    this.$body = null;
};

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

WysiwygEditor.prototype.setValue = function(html) {
    this.editor.setHTML(html);
    this._ensurePtagContentWrappedWithDiv();
    this._unwrapPtags();

    this._autoResizeHeightIfNeed();

    this.eventManager.emit('wysiwygSetValueAfter', this);
    this.eventManager.emit('contentChangedFromWysiwyg', this);
};


//this because we need new line inside ptag, and additional empty line added
//p태그 안에서의 개행을 위해서는 내부에 div로 감쌀필요가 있다.
WysiwygEditor.prototype._ensurePtagContentWrappedWithDiv = function() {
    this.get$Body().find('p').each(function(index, node) {
        if ($(node).find('div').length <= 0) {
            $(node).wrapInner('<div />');
        }

        if ($(node).next().is('p')) {
            $(node).append('<div><br></div>');
        }
    });
};

//we use divs for paragraph so we dont need any p tags
WysiwygEditor.prototype._unwrapPtags = function() {
    this.get$Body().find('div').each(function(index, node) {
        if ($(node).parent().is('p')) {
            $(node).unwrap();
        }
    });
};


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

WysiwygEditor.prototype._prepareGetHTML = function() {
    this._silentChange = true;

    //for ensure to fire change event
    this.get$Body().attr('lastGetValue', Date.now());

    this._joinSplitedTextNodes();
    this._wrapDefaultBlockToOrphanTexts();

    this.eventManager.emit('wysiwygGetValueBefore', this);
};

WysiwygEditor.prototype.postProcessForChange = function() {
    var self = this;

    setTimeout(function() {
        self._silentChange = true;
        self.eventManager.emit('wysiwygRangeChangeAfter', this);
        self = null;
    }, 0);
};

WysiwygEditor.prototype.getEditor = function() {
    return this.editor;
};

WysiwygEditor.prototype.replaceSelection = function(content, selection) {
    return this.getEditor().replaceSelection(content, selection);
};

WysiwygEditor.prototype.replaceRelativeOffset = function(content, offset, overwriteLength) {
    return this.getEditor().replaceRelativeOffset(content, offset, overwriteLength);
};

WysiwygEditor.prototype.addWidget = function(selection, node, style, offset) {
    var pos = this.getEditor().getSelectionPosition(selection, style, offset);

    if (node.parentNode !== this.$editorContainerEl[0]) {
        this.$editorContainerEl.append(node);
    }

    $(node).css({
        position: 'absolute',
        top: pos.top,
        left: pos.left
    });
};

WysiwygEditor.prototype.get$Body = function() {
    return this.getEditor().get$Body();
};

WysiwygEditor.prototype.hasFormatWithRx = function(rx) {
    return this.getEditor().getPath().match(rx);
};

WysiwygEditor.prototype.breakToNewDefaultBlock = function(selection, where) {
    var div, pathToBody, appendBefore, currentNode;

    currentNode = domUtils.getChildNodeAt(selection.startContainer, selection.startOffset) || selection.startContainer;

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

    selection.setStart(div, 0);
    selection.collapse(true);
    this.editor.setSelection(selection);
};

WysiwygEditor.prototype.replaceContentText = function(container, from, to) {
    var before;

    before = $(container).html();
    $(container).html(before.replace(from, to));
};

WysiwygEditor.prototype._unwrapHeading = function() {
    this.unwrapBlockTag(function(node) {
        return FIND_HEADING_RX.test(node);
    });
};

WysiwygEditor.prototype.unwrapBlockTag = function(condition) {
    if (!condition) {
        condition = function(tagName) {
            return FIND_BLOCK_TAGNAME_RX.test(tagName);
        };
    }

    this.getEditor().changeBlockFormat(condition);
    this.eventManager.emit('wysiwygRangeChangeAfter', this);
};

WysiwygEditor.prototype.insertSelectionMarker = function(range) {
    return this._selectionMarker.insertMarker(range, this.getEditor());
};

WysiwygEditor.prototype.restoreSelectionMarker = function() {
    return this._selectionMarker.restore(this.getEditor());
};

WysiwygEditor.factory = function($el, contentStyles, eventManager) {
    var wwe = new WysiwygEditor($el, contentStyles, eventManager);

    wwe._taskMgr = new WwTaskManager(wwe);
    wwe._tableMgr = new WwTableManager(wwe);
    wwe._hrMgr = new WwHrManager(wwe);

    return wwe;
};

module.exports = WysiwygEditor;
