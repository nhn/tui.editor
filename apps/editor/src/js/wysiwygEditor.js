/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Squire = window.Squire,
    util = ne.util;

var FIND_HEADING_RX = /h[\d]/i,
    FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE)\b/;

var inlineNodeNames = /^(?:#text|A(?:BBR|CRONYM)?|B(?:R|D[IO])?|C(?:ITE|ODE)|D(?:ATA|EL|FN)|EM|FONT|HR|I(?:MG|NPUT|NS)?|KBD|Q|R(?:P|T|UBY)|S(?:AMP|MALL|PAN|TR(?:IKE|ONG)|U[BP])?|U|VAR|WBR)$/;

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
}

WysiwygEditor.prototype.init = function(height, callback) {
    var self = this;

    this.$iframe = $('<iframe />');

    this.$iframe.load(function() {
        var doc = self.$iframe[0].contentDocument;

        self._makeSureStandardMode(doc);

        if (self.editor) {
            return;
        }

        self._initStyleSheet(doc);
        self._initEditorContainerStyles(doc);

        self.editor = new Squire(doc, {
            blockTag: 'DIV'
        });

        self.setHeight(height);
        self._initEvent();
        self._initSquireKeyHandler();

        $(doc).on('click', function() {
            self.focus();
        });

        if (callback) {
           callback();
        }
    });

    this.$editorContainerEl.css('position', 'relative');
    this.$editorContainerEl.append(this.$iframe);
};

WysiwygEditor.prototype._initSquireKeyHandler = function() {
    var self = this;

    this.getEditor().addEventListener('keydown', function(event) {
        self._keyEventHandler(event);
    });

    if (util.browser.firefox) {
        this.getEditor().addEventListener('keypress', function(event) {
            //event.preventDefault();
            //이벤트를 발생시키려했던 시도
            //여기서 생성되는 이벤트는 preventDefault를 안하게되서 스콰이어와 디폴트 액션이 동시에 먹게된다.
            //그래서 엔터키의 경우 두번 개행한다.
            //self.getEditor().getDocument().body.dispatchEvent(new KeyboardEvent('keydown', {keyCode: event.keyCode}));

            //prevent duplicated event fire when alphabet key pressed, we need only functional key(e.g. enter)
            if (event.keyCode) {
                self._keyEventHandler(event);
            }
        });
    }
};

WysiwygEditor.prototype._keyEventHandler = function(event) {
    var self = this,
        range, doc, sq;

    //enter
    if (event.keyCode === 13) {
        if (this._isTaskList()) {
            this._removeTaskInputIfNeed();

            setTimeout(function() {
                if (self._isTaskList()) {
                    self.eventManager.emit('command', 'Task');
                }
            }, 0);
        } else if (this.hasFormatWithRx(FIND_HEADING_RX)) {
            //squire의 처리 중간이나 마지막에 개입할 방법이 없어 지연 처리
            setTimeout(function() {
                self._unwrapHeading();
            }, 0);
        } else if (this.getEditor().hasFormat('P')) {
            //squire의 처리 중간이나 마지막에 개입할 방법이 없어 지연 처리
            setTimeout(function() {
                self._splitPIfNeed();
            }, 0);
        }
    //backspace
    } else if (event.keyCode === 8) {
        range = this.getEditor().getSelection();

        if (range.collapsed) {
            if (this._isTaskList()) {
                this._removeTaskInputIfNeed();
            } else if (this.hasFormatWithRx(FIND_HEADING_RX) && range.startOffset === 0) {
                this._unwrapHeading();

            //todo for remove hr, not perfect fix need
            } else if (range.startContainer.previousSibling &&
                       range.startContainer.previousSibling.nodeType === Node.ELEMENT_NODE &&
                       range.startContainer.previousSibling.tagName === 'HR') {
                $(range.startContainer.previousSibling).remove();
            }
        }
    } else if (event.which === 9) {
        if (this._isTaskList()) {
            event.preventDefault();
            this._taskTabHandler();
        }
    }
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


WysiwygEditor.prototype.changeBlockFormat = function(srcCondition, targetTagName) {
    var self = this;

    this.getEditor().modifyBlocks(function(frag) {
        var current = frag.childNodes[0],
            newFrag, newBlock, nextBlock, tagName;

        //find last depth
        while (current.firstChild) {
            current = current.firstChild;
        }

        //find tag
        while (current !== frag) {
            tagName = current.tagName;

            if (util.isFunction(srcCondition) ? srcCondition(tagName) : (tagName === srcCondition)) {
                nextBlock = current.childNodes[0];

                //there is no next blocktag
                if (nextBlock.nodeType !== Node.ELEMENT_NODE || current.childNodes.length > 1) {
                    nextBlock = self.getEditor().createDefaultBlock();

                    util.forEachArray(util.toArray(current.childNodes), function(node) {
                        nextBlock.appendChild(node);
                    });

                    //remove unneccesary br
                    if ($(nextBlock).find('br').length > 1  &&
                        nextBlock.childNodes[nextBlock.childNodes.length - 1].nodeType === Node.ELEMENT_NODE &&
                        nextBlock.childNodes[nextBlock.childNodes.length - 1].tagName === 'BR'
                       ) {
                        nextBlock.removeChild(nextBlock.childNodes[nextBlock.childNodes.length - 1]);
                    }
                }

                if (targetTagName) {
                    newBlock = self.getEditor().createElement(targetTagName, [nextBlock]);
                } else {
                    newBlock = nextBlock;
                }

                newFrag = self.getEditor().getDocument().createDocumentFragment();
                newFrag.appendChild(newBlock);

                frag = newFrag;

                break;
            }

            current = current.parentNode;
        }

        //if source condition node is not founded, we wrap current div node with node named targetTagName
        if ((!newFrag || !srcCondition) && frag.childNodes[0].nodeType === Node.ELEMENT_NODE && frag.childNodes[0].tagName === 'DIV' && targetTagName) {
            frag = self.getEditor().createElement(targetTagName, [frag.childNodes[0]]);
        }

        return frag;
    });
};

WysiwygEditor.prototype.changeBlockFormatTo = function(targetTagName) {
    this.changeBlockFormat(function(tagName) {
        return FIND_BLOCK_TAGNAME_RX.test(tagName);
    }, targetTagName);
    this._removeTaskInputInWrongPlace();
};

WysiwygEditor.prototype.makeEmptyBlockCurrentSelection = function() {
    var self = this;

    this.getEditor().modifyBlocks(function(frag) {
        if (!frag.textContent) {
            frag = self.getEditor().createDefaultBlock();
        }
        return frag
    });
};

WysiwygEditor.prototype._makeSureStandardMode = function(doc) {
    //Not in quirks mode
    if (doc.compatMode !== 'CSS1Compat') {
        doc.open();
        doc.write('<!DOCTYPE html><title></title>');
        doc.close();
    }
};

WysiwygEditor.prototype._initStyleSheet = function(doc) {
    var styleLink, body;

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
    body.className = 'neonEditor-content';

    bodyStyle = body.style;
    bodyStyle.height = '100%';
    bodyStyle.padding = '0 5px';
};

WysiwygEditor.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('htmlUpdate', function(html) {
        self.setValue(html);
    });

    this.editor.addEventListener('input', function() {
        self.eventManager.emit('contentChanged.wysiwygEditor', self.getValue());
    });

    this.editor.addEventListener('input', function() {
        var sel = self.editor.getSelection(),
            eventObj;

        eventObj = {
            source: 'wysiwyg',
            selection: sel,
            textContent: sel.endContainer.textContent,
            caretOffset: sel.endOffset
        };

        self.eventManager.emit('change.wysiwygEditor', eventObj);
        self.eventManager.emit('change', eventObj);
    });
};

//from http://jsfiddle.net/9ThVr/24/
WysiwygEditor.prototype.getCaretPosition = function() {
    var range, sel, rect, range2, rect2,
        offsetx = 0,
        offsety = 0;

    var $node = this.editor.getDocument().body,
        nodeLeft = $node.offsetLeft,
        nodeTop = $node.offsetTop;

    var pos = {left: 0, top: 0};

    sel = this.editor.getSelection();
    range = sel.cloneRange();

    range.setStart(range.startContainer, range.startOffset - 1);
    rect = range.getBoundingClientRect();

    if (range.endOffset === 0 || range.toString() === '') {
        // first char of line
        if (range.startContainer === $node) {
            // empty div
            if (range.endOffset === 0) {
                pos.top = '0';
                pos.left = '0';
            } else {
                // firefox need this
                range2 = range.cloneRange();
                range2.setStart(range2.startContainer, 0);
                rect2 = range2.getBoundingClientRect();
                pos.left = rect2.left + offsetx - nodeLeft;
                pos.top = rect2.top + rect2.height + offsety - nodeTop;
            }
        } else {
            pos.top = range.startContainer.offsetTop;
            pos.left = range.startContainer.offsetLeft;
        }
    } else {
        pos.left = rect.left + rect.width + offsetx - nodeLeft;
        pos.top = rect.top + offsety - nodeTop;
    }
    return pos;
};

WysiwygEditor.prototype.focus = function() {
    this.editor.focus();
};

WysiwygEditor.prototype.remove = function() {
    this.editor = null;
};

WysiwygEditor.prototype.setHeight = function(height) {
    this.$iframe.height(height);
};

WysiwygEditor.prototype.setValue = function(html) {
    this.editor.setHTML(html);
    this._ensurePtagContentWrappedWithDiv();
    this._ensureSpaceNextToTaskInput();
    this._removeTaskListClass();
    this.eventManager.emit('contentChanged.wysiwygEditor', this.getValue());
};

//this because we need new line inside ptag
//p태그 안에서의 개행을 위해서는 내부에 div로 감쌀필요가 있다.
WysiwygEditor.prototype._ensurePtagContentWrappedWithDiv = function() {
    this.get$Body().find('p').each(function(index, node) {
        if ($(node).find('div').length <= 0) {
            $(node).wrapInner('<div />');
        }
    });
};

WysiwygEditor.prototype._ensureSpaceNextToTaskInput = function() {
    var findTextNodeFilter, firstTextNode;

    findTextNodeFilter = function() {
        return this.nodeType === 3;
    };

    this.get$Body().find('.task-list-item').each(function(i, node) {
        firstTextNode = $(node).contents().filter(findTextNodeFilter)[0];

        if (firstTextNode && !(/^\s\u200B/g.test(firstTextNode.nodeValue))) {
            firstTextNode.nodeValue = ' \u200B' + firstTextNode.nodeValue;
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

    //empty line replace to br
    html = html.replace(/<(.+)>(<br>|<br \/>|<BR>|<BR \/>)<\/\1>/g, function(match, tag) {
        //we maintain empty list
        return tag === 'li' ? match : '<br />';
    });

    //remove unnecessary brs
    html = html.replace(/(?:<br>|<br \/>|<BR>|<BR \/>)<\/(.+?)>/g, '</$1>');

    //remove contenteditable block, in this case div
    html = html.replace(/<div>/g, '');
    html = html.replace(/<\/div>/g, '<br />');

    return html ;
};

WysiwygEditor.prototype._prepareGetHTML = function() {
    this.editor._ignoreChange = true;
    this._addCheckedAttrToCheckedInput();
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
    if (selection) {
        this.editor.setSelection(selection);
    }

    this.editor._ignoreChange = true;
    this.editor.insertPlainText(content);
};

WysiwygEditor.prototype.replaceRelativeOffset = function(content, offset, overwriteLength) {
    var selection;

    selection = this.editor.getSelection().cloneRange();

    this._replaceRelativeOffsetOfSelection(content, offset, overwriteLength, selection);
};

WysiwygEditor.prototype._replaceRelativeOffsetOfSelection = function(content, offset, overwriteLength, selection) {
    var endSelectionInfo;

    selection.setStart(selection.endContainer, selection.endOffset + offset);
    endSelectionInfo = this.getSelectionInfoByOffset(selection.endContainer, selection.endOffset + (offset + overwriteLength));
    selection.setEnd(endSelectionInfo.element, endSelectionInfo.offset);

    this.replaceSelection(content, selection);
};

function getTextLengthOfElement(element) {
    var textLength;

    if (element.nodeType === 1) {
       textLength = element.textContent.length;
    } else if (element.nodeType === 3) {
       textLength = element.nodeValue.length;
    }

    return textLength;
}

WysiwygEditor.prototype.getSelectionInfoByOffset = function(anchorElement, offset) {
    var traceElement, traceElementLength, traceOffset, stepLength, latestAvailableElement;

    traceElement = anchorElement;
    traceOffset = offset;
    stepLength = 0;

    while (traceElement) {
        traceElementLength = getTextLengthOfElement(traceElement);
        stepLength += traceElementLength;

        if (offset <= stepLength) {
            break;
        }

        traceOffset -= traceElementLength;

        if (getTextLengthOfElement(traceElement) > 0) {
            latestAvailableElement = traceElement;
        }

        traceElement = traceElement.nextSibling;
    }

    if (!traceElement) {
        traceElement = latestAvailableElement;
        traceOffset = getTextLengthOfElement(traceElement);
    }

    return {
        element: traceElement,
        offset: traceOffset
    };
};

WysiwygEditor.prototype.getSelectionOffset = function(selection, style, offset) {
    var pos, range, endSelectionInfo,
        marker = this.editor.createElement('INPUT');

    range = selection.cloneRange();

    range.setStart(range.startContainer, range.startOffset);
    endSelectionInfo = this.getSelectionInfoByOffset(selection.endContainer, selection.endOffset + (offset || 0));
    range.setEnd(endSelectionInfo.element, endSelectionInfo.offset);

    //to prevent squire input event fire
    this.editor._ignoreChange = true;
    this.editor.insertElement(marker, range);
    pos = $(marker).offset();

    if (style !== 'over') {
        pos.top += $(marker).outerHeight();
    }

    marker.parentNode.removeChild(marker);

    this.editor.setSelection(selection);

    pos.top -= this.get$Body().scrollTop();

    return pos;
};

WysiwygEditor.prototype.addWidget = function(selection, node, style, offset) {
    var pos = this.getSelectionOffset(selection, style, offset);

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
    this.$body = this.$body || $(this.getEditor().getDocument().body);
    return this.$body;
};

WysiwygEditor.prototype.hasFormatWithRx = function(rx) {
    return this.getEditor().getPath().match(rx);
}

WysiwygEditor.prototype._removeTaskInputIfNeed = function() {
    var selection, $selected, $li;

    selection = this.getEditor().getSelection().cloneRange();
    $selected = $(selection.startContainer);
    $li = $selected.closest('li');

    if ($li.length
        && $li.find('input').length
        && ($li.text().replace(/\s\u200B/g, '') === '')
    ) {
        this.saveSelection(selection);

        $li.find('input:checkbox').remove();
        $li.removeClass('task-list-item');
        $li.text('');

        this.restoreSavedSelection();
    }
};

WysiwygEditor.prototype._removeTaskInputInWrongPlace = function() {
    var isNotInsideTask, parent,
        self = this;

    this.get$Body().find('input:checkbox').each(function(index, node) {
        isNotInsideTask = ($(node).parents('li').length === 0 || !$(node).parents('li').hasClass('task-list-item'));

        if (isNotInsideTask) {
            parent = $(node).parent();
            $(node).remove();
            self.replaceContentText(parent, /\s\u200B/g, '');
        }
    });
};

WysiwygEditor.prototype.replaceContentText = function(container, from, to) {
    var before;

    this._addCheckedAttrToCheckedInput();
    before = $(container).html()
    $(container).html(before.replace(from, to));
};

WysiwygEditor.prototype._isTaskList = function() {
    return this.getEditor().hasFormat('LI', {class: 'task-list-item'});
};

function isContainer(node) {
    var type = node.nodeType;
    return (type === Node.ELEMENT_NODE || type === Node.DOCUMENT_FRAGMENT_NODE) &&
        !isInline(node) && !isBlock(node);
}

function isInline(node) {
    return inlineNodeNames.test(node.nodeName);
}

function isBlock(node) {
    var type = node.nodeType;
    return (type === Node.ELEMENT_NODE || type === Node.DOCUMENT_FRAGMENT_NODE) &&
        !isInline(node) && every(node.childNodes, isInline);
}

function every(nodeList, fn) {
    var l = nodeList.length - 1;

    while (l >= 0) {
        if (!fn(nodeList[l])) {
            return false;
        }

        l -= 1;
    }

    return true;
}

function replaceWith(node, node2) {
    var parent = node.parentNode;
    if (parent) {
        parent.replaceChild(node2, node);
    }
}

function increaseTaskLevel(frag) {
    var items = frag.querySelectorAll('LI'),
        i, l, item,
        type, newParent,
        listItemAttrs = {class: 'task-list-item'},
        listAttrs;

    for (i = 0, l = items.length; i < l; i += 1) {
        item = items[i];
        if (!isContainer(item.firstChild)) {
            // type => 'UL' or 'OL'
            type = item.parentNode.nodeName;
            newParent = item.previousSibling;

            if (!newParent || !(newParent = newParent.lastChild) ||
                newParent.nodeName !== type) {
                replaceWith(
                    item,
                    this.createElement('LI', listItemAttrs, [
                        newParent = this.createElement(type)
                    ])
                );
            }
            newParent.appendChild(item);
        }
    }

    return frag;
};

WysiwygEditor.prototype._taskTabHandler = function() {
    var parent, node, range;

    range = this.getEditor().getSelection();
    node = range.startContainer;

    if (range.collapsed && range.startContainer.textContent.replace(/[\u200B\s]/g, '') === '') {
        while (parent = node.parentNode) {
            // If we find a UL or OL (so are in a list, node must be an LI)
            if (parent.nodeName === 'UL' || parent.nodeName === 'OL') {
                // AND the LI is not the first in the list
                if (node.previousSibling) {
                    // Then increase the list level
                    this.getEditor().modifyBlocks(increaseTaskLevel);
                }

                break;
            }
            node = parent;
        }
    }
};

WysiwygEditor.prototype._splitPIfNeed = function() {
    var range = this.getEditor().getSelection(),
        prev = range.startContainer.previousSibling;

    if (prev && prev.parentNode && prev.parentNode.tagName === 'P' &&
        prev.nodeType === Node.ELEMENT_NODE &&
        prev.tagName === 'DIV' &&
        !prev.textContent) {
        $(prev).remove();
        this.unwrapBlockTag('P');
    }
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

    this.changeBlockFormat(condition);
    this._removeTaskInputInWrongPlace();
};

module.exports = WysiwygEditor;
