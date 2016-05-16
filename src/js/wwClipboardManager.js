/**
 * @fileoverview Implements wysiwyg editor clipboard manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils');

var util = tui.util;

var isMSBrowser = util.browser.msie || /Edge\//.test(navigator.userAgent);


/**
 * WwClipboardManager
 * @exports WwClipboardManager
 * @constructor
 * @class
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
function WwClipboardManager(wwe) {
    this.wwe = wwe;
}

/**
 * init
 * initialize
 */
WwClipboardManager.prototype.init = function() {
    this._initSquireEvent();
};

/**
 * _initSquireEvent
 * initialize squire events
 */
WwClipboardManager.prototype._initSquireEvent = function() {
    var self = this;

    if (isMSBrowser) {
        this.wwe.getEditor().addEventListener('keydown', function(event) {
            //Ctrl + C
            if (event.ctrlKey && event.keyCode === 67) {
                self._extendCurrentSelection();
            //Ctrl + X
            } else if (event.ctrlKey && event.keyCode === 88) {
                self._extendCurrentSelection();
                self.wwe.postProcessForChange();
            }
        });
    } else {
        this.wwe.getEditor().addEventListener('copy', function() {
            self._extendCurrentSelection();
        });

        this.wwe.getEditor().addEventListener('cut', function() {
            self._extendCurrentSelection();
            self.wwe.postProcessForChange();
        });
    }

    this.wwe.getEditor().addEventListener('willPaste', function(pasteData) {
        [].forEach.call(pasteData.fragment.childNodes, function(node) {
            console.log(node);
        });
        pasteData.fragment = self.wwe.getManager('codeblock').prepareToPasteOnCodeblockIfNeed(pasteData.fragment);
    });

    this.wwe.getEditor().addEventListener('paste', function() {
        self.wwe.postProcessForChange();
    });
};

WwClipboardManager.prototype._extendCurrentSelection = function() {
    var range = this._extendRange(this.wwe.getEditor().getSelection().cloneRange());
    this.wwe.getEditor().setSelection(range);
};

/**
 * _extendRange
 * extend range if need
 * @param {Range} range to extend
 * @returns {Range} range
 */
WwClipboardManager.prototype._extendRange = function(range) {
    var newBound, boundNext;

    //같지 않은경우를 체크해야한다 같은경우 레인지 확장할때 commonAncestorContainer를 넘어가버림
    //이경우에 스타트와 엔드가 같은 텍스트노드인경우는 텍스트노드만 지우는게 맞다.
    if (range.startContainer !== range.endContainer) {
        if (range.startOffset === 0) {
            newBound = range.startContainer;

            //레인지 확장
            while (newBound.parentNode !== range.commonAncestorContainer
                    && !newBound.previousSibling
                  ) {
                newBound = newBound.parentNode;
            }

            //range단위를 한단계 확장 deleteContents는 start, end에 걸린 컨테이너 자체는 안지운다.
            range.setStart(newBound.parentNode, domUtils.getNodeOffsetOfParent(newBound));
        }

        if (range.endOffset === range.endContainer.length) {
            newBound = range.endContainer;
            boundNext = newBound.nextSibling;

            //레인지 확장
            while (newBound.parentNode !== range.commonAncestorContainer
                    && (!boundNext || (boundNext.tagName === 'BR' && newBound.parentNode.lastChild === boundNext))
                  ) {
                newBound = newBound.parentNode;
            }

            //range단위를 부모래밸로 한단계 확장 deleteContents는 start, end에 걸린 컨테이너 자체는 안지운다.
            range.setEnd(newBound.parentNode, domUtils.getNodeOffsetOfParent(newBound) + 1);
        }
    }

    // commonAncestor를 선택
    if (this._isWholeCommonAncestorContainerSelected(range)) {
        newBound = range.commonAncestorContainer;
        range.setStart(newBound.parentNode, domUtils.getNodeOffsetOfParent(newBound));
        range.setEnd(newBound.parentNode, domUtils.getNodeOffsetOfParent(newBound) + 1);
    }

    return range;
};

/**
 * _isWholeCommonAncestorContainerSelected
 * check if selection has whole commonAncestorContainter
 * 선택된 영역이 commonAncestorContainer의 모든 컨텐츠인치 체크
 * @param {Range} range range of selection
 * @returns {boolean} result
 */
WwClipboardManager.prototype._isWholeCommonAncestorContainerSelected = function(range) {
    return range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        && range.commonAncestorContainer !== this.wwe.$editorContainerEl[0]
        && range.startOffset === 0
        && range.endOffset === range.commonAncestorContainer.childNodes.length
        && range.commonAncestorContainer === range.startContainer
        && range.commonAncestorContainer === range.endContainer;
};

module.exports = WwClipboardManager;
