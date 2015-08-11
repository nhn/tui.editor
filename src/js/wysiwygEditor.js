/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Squire = window.Squire,
    util = ne.util;

var FIND_HEADING_RX = /h[\d]/i;

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
        //prevent last keyevent when composing
        this.getEditor().addEventListener('compositionend', function(event) {
            self._keyEventHandler(event);
        });
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

WysiwygEditor.prototype._removeTaskInputIfNeed = function() {
    var selection, $selected, $li;

    selection = this.getEditor().getSelection().cloneRange();
    $selected = $(selection.startContainer);
    $li = $selected.closest('li');

    if ($li.length
        && $li.find('input').length
        && ($li.text() === '' || (selection.startOffset === 0 && selection.startContainer.previousSibling.tagName === 'INPUT'))
    ) {
        this.saveSelection(selection);

        $li.find('input').remove();

        this.restoreSavedSelection();
    }
};

WysiwygEditor.prototype._keyEventHandler = function(event) {
    var self = this;

    //enter
    if (event.which === 13) {
        if (this.getEditor().hasFormat('li')) {
            this._removeTaskInputIfNeed();
        } else if (this.hasFormatWithRx(FIND_HEADING_RX)) {
            //squire의 처리 중간이나 마지막에 개입할 방법이 없어 지연 처리
            setTimeout(function() {
                self._unwrapHeading();
            }, 0);
        }
    //backspace
    } else if (event.which === 8) {
        if (this.getEditor().hasFormat('li')) {
            this._removeTaskInputIfNeed();
        //squire상단의 블럭태그 사라지지 않는 문제 픽스
        } else if (!this.getEditor().getDocument().body.textContent) {
            this.makeEmptyBlockCurrentSelection();
        }
    }
};

WysiwygEditor.prototype._unwrapHeading = function() {
    this.unwrapBlockTag(function(node) {
        return FIND_HEADING_RX.test(node);
    });
};

WysiwygEditor.prototype.unwrapBlockTag = function(condition) {
    var self = this;

    this.getEditor().modifyBlocks(function(frag) {
        var current = frag.childNodes[0],
            newFrag = self.getEditor().getDocument().createDocumentFragment(),
            tagName;

        //find last depth
        while (current.firstChild) {
            current = current.firstChild;
        }

        //find tag
        while (current !== frag) {
            tagName = current.tagName && current.tagName.toUpperCase();

            if (util.isFunction(condition) ? condition(tagName) : (tagName === condition)) {
                util.forEachArray(current.childNodes, function(node) {
                    newFrag.appendChild(node);
                });

                frag = newFrag;

                break;
            }

            current = current.parentNode;
        }

        return frag;
    });
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
    var styleLink;

    util.forEach(this.contentStyles, function(stylePath) {
        styleLink = doc.createElement('link');
        styleLink.rel = 'stylesheet';
        styleLink.href = stylePath;

        doc.querySelector('head').appendChild(styleLink);
    });

    doc.querySelector('html').style.height = '100%';
    doc.querySelector('body').className = 'neonEditor-content';
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
    this.eventManager.emit('contentChanged.wysiwygEditor', this.getValue());
};

WysiwygEditor.prototype.getValue = function() {
    var html;

    this._prepareGetHTML();

    html = this.editor.getHTML();

    //empty line replace to br
    html = html.replace(/<(.+)>(<br>|<br \/>|<BR>|<BR \/>)<\/\1>/g, '<br />');

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

    pos.top -= $(this.editor.getDocument().body).scrollTop();

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
    return $(this.getEditor().getDocument().body);
};

WysiwygEditor.prototype.hasFormatWithRx = function(rx) {
    return this.getEditor().getPath().match(rx);
}

module.exports = WysiwygEditor;

