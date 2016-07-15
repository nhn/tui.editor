/**
 * @fileoverview Implements wysiwyg editor clipboard manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils');
var WwPasteContentHelper = require('./wwPasteContentHelper');
var util = tui.util;

var isMSBrowser = util.browser.msie || /Edge\//.test(navigator.userAgent);


/**
 * WwClipboardManager
 * @exports WwClipboardManager
 * @constructor
 * @class WwClipboardManager
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
function WwClipboardManager(wwe) {
    this.wwe = wwe;

    this._pch = new WwPasteContentHelper(this.wwe);
}

/**
 * init
 * initialize
 * @api
 * @memberOf WwClipboardManager
 */
WwClipboardManager.prototype.init = function() {
    this._initSquireEvent();
};

/**
 * _initSquireEvent
 * initialize squire events
 * @private
 * @memberOf WwClipboardManager
 */
WwClipboardManager.prototype._initSquireEvent = function() {
    var self = this;

    if (isMSBrowser) {
        this.wwe.getEditor().addEventListener('keydown', function(event) {
            //Ctrl+ C
            if (event.ctrlKey && event.keyCode === 67) {
                self._saveLastestClipboardRangeInfo();
            //Ctrl + X
            } else if (event.ctrlKey && event.keyCode === 88) {
                self._saveLastestClipboardRangeInfo();
                self.wwe.postProcessForChange();
            }
        });
    } else {
        this.wwe.getEditor().addEventListener('copy', function() {
            self._saveLastestClipboardRangeInfo();
        });
        this.wwe.getEditor().addEventListener('cut', function() {
            self._saveLastestClipboardRangeInfo();
            self.wwe.postProcessForChange();
        });
    }

    this.wwe.getEditor().addEventListener('willPaste', function(pasteData) {
        if (self._latestClipboardRangeInfo
            && self._latestClipboardRangeInfo.contents.textContent === pasteData.fragment.textContent) {
            pasteData.fragment = $(self._latestClipboardRangeInfo.contents).clone()[0];
            pasteData.rangeInfo = self._latestClipboardRangeInfo;
        }

        self._pch.preparePaste(pasteData);
        self.wwe.eventManager.emit('pasteBefore', {source: 'wysiwyg', data: pasteData});
        self._refineCursorWithPasteContentsIfNeed(pasteData.fragment);
        self.wwe.postProcessForChange();
    });
};
/**
 * Refine cursor position with paste contents
 * @memberOf WwClipboardManager
 * @param {DocumentFragment} fragment Copied contents
 * @private
 */
WwClipboardManager.prototype._refineCursorWithPasteContentsIfNeed = function(fragment) {
    var node = fragment;
    var range = this.wwe.getEditor().getSelection().cloneRange();

    if (fragment.childNodes.length === 0) {
        return;
    }

    while (node.lastChild) {
        node = node.lastChild;
    }

    this.wwe.defer(function(wwe) {
        range.setStartAfter(node);
        range.collapse(true);
        wwe.getEditor().setSelection(range);
    });
};

/**
 * Check whether copied content from editor or not
 * @memberOf WwClipboardManager
 * @param {DocumentFragment} pasteData Copied contents
 * @returns {boolean}
 * @private
 */
WwClipboardManager.prototype._isCopyFromEditor = function(pasteData) {
    var lastestClipboardContents;

    if (!this._latestClipboardRangeInfo) {
        return false;
    }

    lastestClipboardContents = this._latestClipboardRangeInfo.contents.textContent;

    return lastestClipboardContents.replace(/\s/g, '') === pasteData.fragment.textContent.replace(/\s/g, '');
};
/**
 * Save latest clipboard range information to _latestClipboardRangeInfo
 * @memberOf WwClipboardManager
 * @private
 */
WwClipboardManager.prototype._saveLastestClipboardRangeInfo = function() {
    var commonAncestorName;
    var range = this.wwe.getEditor().getSelection().cloneRange();
    range = this._extendRange(range);

    if (range.commonAncestorContainer === this.wwe.get$Body()[0]) {
        commonAncestorName = 'BODY';
    } else {
        commonAncestorName = range.commonAncestorContainer.tagName;
    }

    this._latestClipboardRangeInfo = {
        contents: range.cloneContents(),
        commonAncestorName: commonAncestorName
    };
};

/**
 * _extendRange
 * extend range if need
 * @memberOf WwClipboardManager
 * @param {Range} range to extend
 * @returns {Range} range
 * @private
 */
WwClipboardManager.prototype._extendRange = function(range) {
    //텍스트 노드이면서 모두 선택된게 아니면 레인지를 확장할 필요가 없다.
    if (domUtils.isTextNode(range.commonAncestorContainer)
        && (range.startOffset !== 0 || range.commonAncestorContainer.textContent.length !== range.endOffset)
    ) {
        return range;
    }

    if (range.startOffset === 0) {
        range = this._extendStartRange(range);
    }

    if (range.endOffset === domUtils.getOffsetLength(range.endContainer)) {
        range = this._extendEndRange(range);
    }

    //commonAncestor의 모든 컨텐츠가 선택된경우 commonAncestor로 셀렉션 변경
    if (this._isWholeCommonAncestorContainerSelected(range)) {
        range.selectNode(range.commonAncestorContainer);
    }

    return range;
};

/**
 * Extends current range's startContainer
 * @memberOf WwClipboardManager
 * @param {Range} range Range object
 * @returns {Range}
 * @private
 */
WwClipboardManager.prototype._extendStartRange = function(range) {
    var newBound = range.startContainer;

    //레인지 확장
    while (newBound.parentNode !== range.commonAncestorContainer
            && newBound.parentNode !== this.wwe.get$Body()[0]
            && !newBound.previousSibling
          ) {
        newBound = newBound.parentNode;
    }

    //range단위를 한단계 확장 deleteContents는 start, end에 걸린 컨테이너 자체는 안지운다.
    range.setStart(newBound.parentNode, domUtils.getNodeOffsetOfParent(newBound));

    return range;
};

/**
 * Extends current range's endContainer
 * @memberOf WwClipboardManager
 * @param {Range} range Range object
 * @returns {Range}
 * @private
 */
WwClipboardManager.prototype._extendEndRange = function(range) {
    var newBound = range.endContainer;
    var boundNext = newBound.nextSibling;

    //레인지 확장
    while (newBound.parentNode !== range.commonAncestorContainer
            && newBound.parentNode !== this.wwe.get$Body()[0]
            && (!boundNext || (domUtils.getNodeName(boundNext) === 'BR' && newBound.parentNode.lastChild === boundNext))
          ) {
        newBound = newBound.parentNode;
        boundNext = newBound.nextSibling;
    }

    //range단위를 부모래밸로 한단계 확장 deleteContents는 start, end에 걸린 컨테이너 자체는 안지운다.
    range.setEnd(newBound.parentNode, domUtils.getNodeOffsetOfParent(newBound) + 1);

    return range;
};

/**
 * _isWholeCommonAncestorContainerSelected
 * Check whether whole commonAncestorContainter textContent selected or not
 * 선택된 영역이 commonAncestorContainer의 모든 컨텐츠인치 체크
 * @memberOf WwClipboardManager
 * @param {Range} range Range object
 * @returns {boolean} result
 * @private
 */
WwClipboardManager.prototype._isWholeCommonAncestorContainerSelected = function(range) {
    return range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        && range.commonAncestorContainer !== this.wwe.get$Body()[0]
        && range.startOffset === 0
        && range.endOffset === range.commonAncestorContainer.childNodes.length
        && range.commonAncestorContainer === range.startContainer
        && range.commonAncestorContainer === range.endContainer;
};

module.exports = WwClipboardManager;
