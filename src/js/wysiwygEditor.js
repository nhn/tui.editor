/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils'),
    WwClipboardManager = require('./wwClipboardManager'),
    WwSelectionMarker = require('./wwSelectionMarker'),
    SquireExt = require('./squireExt');

var util = tui.util;

var FIND_HEADING_RX = /h[\d]/i,
    FIND_EMPTY_LINE = /<(.+)>(<br>|<br \/>|<BR>|<BR \/>)<\/\1>/g,
    FIND_UNNECESSARY_BR = /(?:<br>|<br \/>|<BR>|<BR \/>)<\/(.+?)>/g,
    FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD)\b/,
    FIND_TASK_SPACES_RX = /^\s+/g;

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

    this._clipboardManager = new WwClipboardManager(this);
    this._selectionMarker = new WwSelectionMarker();
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
    bodyStyle.height = '100%';
    bodyStyle.padding = '0 5px';
};

WysiwygEditor.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('show', function() {
        self.prepareToDetach();
    });
};

WysiwygEditor.prototype._initSquireEvent = function() {
    var self = this;

    this.getEditor().addEventListener('input', function() {
        self.eventManager.emit('contentChangedFromWysiwyg', self);
    });

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

        eventObj = {
            source: 'wysiwyg',
            selection: sel,
            textContent: sel.endContainer.textContent,
            caretOffset: sel.endOffset
        };

        self.eventManager.emit('changeFromWysiwyg', eventObj);
        self.eventManager.emit('change', eventObj);
    });

    this.getEditor().addEventListener('keydown', function(event) {
        self._keyEventHandler(event);
    });

    //firefox has problem about keydown event while composition korean
    //파폭에서는 한글입력할때뿐아니라 한글입력도중에 엔터키와같은 특수키 입력시 keydown이벤트가 발생하지 않는다
    if (util.browser.firefox) {
        this.getEditor().addEventListener('keypress', function(event) {
            if (event.keyCode) {
                self._keyEventHandler(event);
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
/*
    console.log(event);
    console.log('-------->', event.keyCode, event.keyIdentifier);
    console.log('startContainer', range.startContainer);
    console.log('startOffset', range.startOffset);
    console.log('startContainer.parentNode', range.startContainer.parentNode);
    console.log('startContainer.previousSibling', range.startContainer.previousSibling);
    console.log('startContainer.nextSibling', range.startContainer.nextSibling);
    if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
        console.dir('currentPosition', range.startContainer.childNodes[range.startOffset]);
    } else {
        console.dir('currentPosition', range.startContainer.nodeValue[range.startOffset]);
    }
    if (range.startOffset > 0) console.log('prev Position', range.startContainer.childNodes[range.startOffset - 1] || range.startContainer.nodeValue[range.startOffset - 1]);
    console.log('path', this.editor.getPath());
*/
    //enter
    if (event.keyCode === 13) {
        if (this._isInTaskList(range)) {
            //we need remove empty task then Squire control list
            //빈 태스크의 경우 input과 태스크상태를 지우고 리스트만 남기고 스콰이어가 리스트를 컨트롤한다
            this._unformatTaskIfNeedOnEnter(range);

            setTimeout(function() {
                if (self._isInTaskList()) {
                    self.eventManager.emit('command', 'Task');
                }
            }, 0);
        } else if (this.hasFormatWithRx(FIND_HEADING_RX)) {
            //squire의 처리 중간이나 마지막에 개입할 방법이 없어 지연 처리
            setTimeout(function() {
                self._unwrapHeading();
            }, 0);
        } else if (this._isInHr(range) || this._isNearHr(range)) {
            this._removeHrIfNeed(range, event);
        } else if (this._isInOrphanText(range)) {
            this._wrapDefaultBlockTo(range);
        }
    //backspace
    } else if (event.keyCode === 8) {
        if (range.collapsed) {
            if (this._isInTaskList(range)) {
                this._unformatTaskIfNeedOnBackspace(range);
            } else if (this.hasFormatWithRx(FIND_HEADING_RX) && range.startOffset === 0) {
                this._unwrapHeading();
            } else {
                this._removeHrIfNeed(range, event);
            }
        }
    //tab
    } else if (event.keyCode === 9) {
        if (this._isInTaskList(range)) {
            event.preventDefault();
            self.eventManager.emit('command', 'IncreaseTask');
        }
    }
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

//특수키가 아닌 텍스트가 입력되는 키입력인지 체크
WysiwygEditor.prototype._isValueKeyCode = function(keyCode) {
    var isNumberOrAlphabet = (keyCode >= 48 && keyCode <= 90),
        isNumberPad = (keyCode >= 96 && keyCode <= 111),
        isMarks =  (keyCode >= 186 && keyCode <= 222),
        isKorean = keyCode === 229;

    return (isNumberOrAlphabet || isNumberPad || isMarks || isKorean);
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
    this._removeTaskInputInWrongPlace();
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
    this.$editorContainerEl.height(height);
};

WysiwygEditor.prototype.setValue = function(html) {
    this.editor.setHTML(html);
    this._ensurePtagContentWrappedWithDiv();
    this._unwrapPtags();
    this._ensureSpaceNextToTaskInput();
    this._unwrapDivOnHr();
    this._removeTaskListClass();

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

//we use divs for paragraph so we dont need any p tags
WysiwygEditor.prototype._unwrapDivOnHr = function() {
    this.get$Body().find('hr').each(function(index, node) {
        if ($(node).parent().is('div')) {
            $(node).parent().find('br').remove();
            $(node).unwrap();
        }
    });
};

WysiwygEditor.prototype._ensureSpaceNextToTaskInput = function() {
    var findTextNodeFilter, firstTextNode, $wrapper;

    findTextNodeFilter = function() {
        return this.nodeType === 3;
    };


    this.get$Body().find('.task-list-item').each(function(i, node) {
        $wrapper = $(node).find('div');

        if (!$wrapper.length) {
            $wrapper = $(node);
        }

        firstTextNode = $wrapper.contents().filter(findTextNodeFilter)[0];

        if (firstTextNode && !(FIND_TASK_SPACES_RX.test(firstTextNode.nodeValue))) {
            firstTextNode.nodeValue = ' ' + firstTextNode.nodeValue;
        }
    });
};

WysiwygEditor.prototype._removeTaskListClass = function() {
    //because task-list class is block merge normal list and task list
    this.get$Body().find('.task-list').each(function(index, node) {
        $(node).removeClass('task-list');
    });
};

WysiwygEditor.prototype.getValue = function() {
    var html;

    this._prepareGetHTML();

    html = this.editor.getHTML();

    //we need remove task input space for safari
    html = html.replace(/<input type="checkbox">(\s|&nbsp;)/g, '<input type="checkbox">');

    //empty line replace to br
    html = html.replace(FIND_EMPTY_LINE, function(match, tag) {
        //we maintain empty list
        return tag === 'li' ? match : '<br />';
    });

    //remove unnecessary brs
    html = html.replace(FIND_UNNECESSARY_BR, '</$1>');

    //remove contenteditable block, in this case div
    html = html.replace(/<div>/g, '');
    html = html.replace(/<\/div>/g, '<br />');


    return html;
};

WysiwygEditor.prototype._prepareGetHTML = function() {
    this.editor._ignoreChange = true;

    //for ensure to fire change event
    this.get$Body().attr('lastGetValue', Date.now());

    this._addCheckedAttrToCheckedInput();
    this._joinSplitedTextNodes();
    this._wrapDefaultBlockToOrphanTexts();
};

WysiwygEditor.prototype._addCheckedAttrToCheckedInput = function() {
    var doc = this.getEditor().getDocument();

    //save input checked state to tag
    $(doc.body).find('input').each(function(index, input) {
        if (input.checked) {
            $(input).attr('checked', 'checked');
        } else {
            $(input).removeAttr('checked');
        }
    });
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

WysiwygEditor.prototype._unformatTaskIfNeedOnBackspace = function(selection) {
    var startContainer, startOffset,
        prevEl, needRemove;

    startContainer = selection.startContainer;
    startOffset = selection.startOffset;

    //스타트 컨테이너가 엘리먼트인경우 엘리먼트 offset을 기준으로 다음 지워질것이 input인지 판단한다
    //유저가 임의로 Task빈칸에 수정을 가했을경우
    if (domUtils.isElemNode(startContainer)) {
        //태스크리스트의 제일 첫 오프셋인경우(인풋박스 바로 위)
        if (startOffset === 0) {
            prevEl = domUtils.getChildNodeAt(startContainer, startOffset);
        //inputbox 바로 오른편에서 지워지는경우
        } else {
            prevEl = domUtils.getChildNodeAt(startContainer, startOffset - 1);
        }

        needRemove = (domUtils.getNodeName(prevEl) === 'INPUT');
    //텍스트 노드인경우
    } else if (domUtils.isTextNode(startContainer)) {
        //previousSibling이 있다면 그건 div바로 아래의 텍스트 노드임 아닌경우가생기면 버그
        //있고 그게 input이라면 offset체크
        if (startContainer.previousSibling) {
            prevEl = startContainer.previousSibling;
        //previsousSibling이 없는 경우, 인라인태그로 감싸져있는경우다
        } else {
            prevEl = startContainer.parentNode.previousSibling;
        }

        //inputbox 이후의 텍스트노드에서 빈칸한개가 지워지는경우 같이 지운다
        //(input과 빈칸한개는 같이 지워지는게 옳다고판단)
        if (prevEl.tagName === 'INPUT' && startOffset === 1 && FIND_TASK_SPACES_RX.test(startContainer.nodeValue)) {
            startContainer.nodeValue = startContainer.nodeValue.replace(FIND_TASK_SPACES_RX, '');
            needRemove = true;
        }
    }

    if (needRemove) {
        this.saveSelection(selection);

        $(prevEl).closest('li').removeClass('task-list-item');
        $(prevEl).remove();

        this.restoreSavedSelection();
    }
};

WysiwygEditor.prototype._unformatTaskIfNeedOnEnter = function(selection) {
    var $selected, $li, $inputs,
        isEmptyTask;

    $selected = $(selection.startContainer);
    $li = $selected.closest('li');
    $inputs = $li.find('input:checkbox');
    isEmptyTask = ($li.text().replace(FIND_TASK_SPACES_RX, '') === '');

    if ($li.length && $inputs.length && isEmptyTask) {
        this.saveSelection(selection);

        $inputs.remove();
        $li.removeClass('task-list-item');
        $li.text('');

        this.restoreSavedSelection();
    }
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

WysiwygEditor.prototype._isInHr = function(selection) {
    return domUtils.getNodeName(selection.startContainer.childNodes[selection.startOffset]) === 'HR';
};

WysiwygEditor.prototype._isNearHr = function(selection) {
    var prevNode = domUtils.getChildNodeAt(selection.startContainer, selection.startOffset - 1);
    return domUtils.getNodeName(prevNode) === 'HR';
};

WysiwygEditor.prototype._removeHrIfNeed = function(selection, event) {
    var hrSuspect, cursorTarget;

    if (this._isInHr(selection)) {
        hrSuspect = domUtils.getChildNodeAt(selection.startContainer, selection.startOffset);
    } else if (selection.startOffset === 0) {
        hrSuspect = selection.startContainer.previousSibling || selection.startContainer.parentNode.previousSibling;

        if (domUtils.getNodeName(hrSuspect) !== 'HR') {
            hrSuspect = null;
        }
    } else if (this._isNearHr(selection)) {
        hrSuspect = domUtils.getChildNodeAt(selection.startContainer, selection.startOffset - 1);
    }

    if (hrSuspect) {
        event.preventDefault();

        cursorTarget = hrSuspect.nextSibling;
        $(hrSuspect).remove();

        selection.setStartBefore(cursorTarget);
        selection.collapse(true);
        this.getEditor().setSelection(selection);
    }
};

WysiwygEditor.prototype._removeTaskInputInWrongPlace = function() {
    var self = this;

    this.get$Body()
        .find('input:checkbox')
        .each(function(index, node) {
            var isInsideTask, isCorrectPlace, parent;

            isInsideTask = ($(node).parents('li').length > 1 || $(node).parents('li').hasClass('task-list-item'));
            isCorrectPlace = !node.previousSibling;

            if (!isInsideTask || !isCorrectPlace) {
                parent = $(node).parent();
                $(node).remove();
                self.replaceContentText(parent, FIND_TASK_SPACES_RX, '');
            }
        });
};

WysiwygEditor.prototype._unformatIncompleteTask = function() {
    this.get$Body().find('.task-list-item').each(function(index, task) {
        if ((!domUtils.isElemNode(task.firstChild) || task.firstChild.tagName !== 'INPUT')
            && (!domUtils.isElemNode(task.firstChild.firstChild) || task.firstChild.firstChild.tagName !== 'INPUT')
        ) {
            $(task).removeClass('task-list-item');
        }
    });
};

WysiwygEditor.prototype.replaceContentText = function(container, from, to) {
    var before;

    this._addCheckedAttrToCheckedInput();
    before = $(container).html();
    $(container).html(before.replace(from, to));
};

WysiwygEditor.prototype._isInTaskList = function(range) {
    var li;

    if (!range) {
        range = this.getEditor().getSelection().cloneRange();
    }

    if (range.startContainer.nodeType === Node.ELEMENT_NODE
        && range.startContainer.tagName === 'LI') {
            li = range.startContainer;
    } else {
        li = $(range.startContainer).parents('li')[0];
    }

    return $(li).hasClass('task-list-item');
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
    this._removeTaskInputInWrongPlace();
};

WysiwygEditor.prototype.insertSelectionMarker = function(range) {
    return this._selectionMarker.insertMarker(range, this.getEditor());
};

WysiwygEditor.prototype.restoreSelectionMarker = function() {
    return this._selectionMarker.restore(this.getEditor());
};

WysiwygEditor.prototype.postProcessForChange = function() {
    var self = this;

    setTimeout(function() {
        self.getEditor()._ignoreChange = true;
        self._unformatIncompleteTask();
        self._ensureSpaceNextToTaskInput();
        self = null;
    }, 0);
};
module.exports = WysiwygEditor;
