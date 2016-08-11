/**
 * @fileoverview Implements wysiwyg editor clipboard manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils');
var WwPasteContentHelper = require('./wwPasteContentHelper');
var SET_SELECTION_DELAY = 50;


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

    this.wwe.getEditor().addEventListener('copy', function(ev) {
        self.wwe.eventManager.emit('copy', {
            source: 'wysiwyg',
            data: ev
        });

        self._executeActionFor('copy');
    });

    this.wwe.getEditor().addEventListener('cut', function(ev) {
        self.wwe.eventManager.emit('cut', {
            source: 'wysiwyg',
            data: ev
        });

        self._executeActionFor('cut');
    });

    this.wwe.getEditor().addEventListener('willPaste', function(pasteData) {
        self._addRangeInfoAndReplaceFragmentIfNeed(pasteData);

        self._pch.preparePaste(pasteData);

        self.wwe.eventManager.emit('pasteBefore', {
            source: 'wysiwyg',
            data: pasteData
        });

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
    var sq = this.wwe.getEditor();
    var range = sq.getSelection().cloneRange();

    if (fragment.childNodes.length !== 0 && !domUtils.isTextNode(node.firstChild)) {
        while (node.lastChild) {
            node = node.lastChild;
        }

        this.wwe.defer(function() {
            sq.focus();

            range.setStartAfter(node);
            range.collapse(true);
            sq.setSelection(range);
        }, SET_SELECTION_DELAY);
    }
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
    this._extendRange(range);

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
 * @private
 */
WwClipboardManager.prototype._extendRange = function(range) {
    //텍스트 노드이면서 모두 선택된게 아니면 레인지를 확장할 필요가 없다.
    if (domUtils.isTextNode(range.commonAncestorContainer)
        && (range.startOffset !== 0 || range.commonAncestorContainer.textContent.length !== range.endOffset)
        && range.commonAncestorContainer.nodeName !== 'TD'
    ) {
        return;
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
    this.wwe.getEditor().setSelection(range);
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

/**
 * Table cut and copy action helper for safari and IE's
 * @param {string} [action] Boolean value for cut action
 * @private
 */
WwClipboardManager.prototype._executeActionFor = function(action) {
    this._saveLastestClipboardRangeInfo();
    if (action === 'cut') {
        this.wwe.postProcessForChange();
    }
};

/**
 * Replace pasteData to lastClipboardRangeInfo's data
 * @param {object} pasteData Clipboard data
 * @private
 */
WwClipboardManager.prototype._addRangeInfoAndReplaceFragmentIfNeed = function(pasteData) {
    var hasRangeInfo = !!this._latestClipboardRangeInfo;
    var savedContents = (hasRangeInfo && this._latestClipboardRangeInfo.contents);
    var isSameContents = savedContents.textContent === pasteData.fragment.textContent;

    if (hasRangeInfo) {
        pasteData.rangeInfo = this._latestClipboardRangeInfo;

        if (isSameContents) {
            pasteData.fragment = $(savedContents).clone()[0];
        }
    }
};
module.exports = WwClipboardManager;
