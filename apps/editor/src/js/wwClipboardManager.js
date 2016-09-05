/**
 * @fileoverview Implements wysiwyg editor clipboard manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import domUtils from './domUtils';
import WwPasteContentHelper from './wwPasteContentHelper';

const SET_SELECTION_DELAY = 50;

/**
 * WwClipboardManager
 * @exports WwClipboardManager
 * @constructor
 * @class WwClipboardManager
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
class WwClipboardManager {
    constructor(wwe) {
        this.wwe = wwe;

        this._pch = new WwPasteContentHelper(this.wwe);
    }

    /**
     * init
     * initialize
     * @api
     * @memberOf WwClipboardManager
     */
    init() {
        this._initSquireEvent();
    }

    /**
     * _initSquireEvent
     * initialize squire events
     * @private
     * @memberOf WwClipboardManager
     */
    _initSquireEvent() {
        this.wwe.getEditor().addEventListener('copy', ev => {
            this.wwe.eventManager.emit('copy', {
                source: 'wysiwyg',
                data: ev
            });

            this._executeActionFor('copy');
        });

        this.wwe.getEditor().addEventListener('cut', ev => {
            this.wwe.eventManager.emit('cut', {
                source: 'wysiwyg',
                data: ev
            });

            this._executeActionFor('cut');
        });

        this.wwe.getEditor().addEventListener('willPaste', pasteData => {
            this._addRangeInfoAndReplaceFragmentIfNeed(pasteData);

            this._pch.preparePaste(pasteData);

            this.wwe.eventManager.emit('pasteBefore', {
                source: 'wysiwyg',
                data: pasteData
            });

            this._refineCursorWithPasteContentsIfNeed(pasteData.fragment);
            this.wwe.postProcessForChange();
        });
    }
    /**
     * Refine cursor position with paste contents
     * @memberOf WwClipboardManager
     * @param {DocumentFragment} fragment Copied contents
     * @private
     */
    _refineCursorWithPasteContentsIfNeed(fragment) {
        let node = fragment;
        const sq = this.wwe.getEditor();
        const range = sq.getSelection().cloneRange();

        if (fragment.childNodes.length !== 0 && !domUtils.isTextNode(node.firstChild)) {
            while (node.lastChild) {
                node = node.lastChild;
            }

            this.wwe.defer(() => {
                sq.focus();

                range.setStartAfter(node);
                range.collapse(true);
                sq.setSelection(range);
            }, SET_SELECTION_DELAY);
        }
    }

    /**
     * Check whether copied content from editor or not
     * @memberOf WwClipboardManager
     * @param {DocumentFragment} pasteData Copied contents
     * @returns {boolean}
     * @private
     */
    _isCopyFromEditor(pasteData) {
        if (!this._latestClipboardRangeInfo) {
            return false;
        }

        const lastestClipboardContents = this._latestClipboardRangeInfo.contents.textContent;

        return lastestClipboardContents.replace(/\s/g, '') === pasteData.fragment.textContent.replace(/\s/g, '');
    }
    /**
     * Save latest clipboard range information to _latestClipboardRangeInfo
     * @memberOf WwClipboardManager
     * @private
     */
    _saveLastestClipboardRangeInfo() {
        let commonAncestorName;
        const range = this.wwe.getEditor().getSelection().cloneRange();
        this._extendRange(range);

        if (range.commonAncestorContainer === this.wwe.get$Body()[0]) {
            commonAncestorName = 'BODY';
        } else {
            commonAncestorName = range.commonAncestorContainer.tagName;
        }

        this._latestClipboardRangeInfo = {
            contents: range.cloneContents(),
            commonAncestorName
        };
    }

    /**
     * _extendRange
     * extend range if need
     * @memberOf WwClipboardManager
     * @param {Range} range to extend
     * @private
     */
    _extendRange(range) {
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
    }

    /**
     * Extends current range's startContainer
     * @memberOf WwClipboardManager
     * @param {Range} range Range object
     * @returns {Range}
     * @private
     */
    _extendStartRange(range) {
        let newBound = range.startContainer;

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
    }

    /**
     * Extends current range's endContainer
     * @memberOf WwClipboardManager
     * @param {Range} range Range object
     * @returns {Range}
     * @private
     */
    _extendEndRange(range) {
        let newBound = range.endContainer;
        let boundNext = newBound.nextSibling;

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
    }

    /**
     * _isWholeCommonAncestorContainerSelected
     * Check whether whole commonAncestorContainter textContent selected or not
     * 선택된 영역이 commonAncestorContainer의 모든 컨텐츠인치 체크
     * @memberOf WwClipboardManager
     * @param {Range} range Range object
     * @returns {boolean} result
     * @private
     */
    _isWholeCommonAncestorContainerSelected(range) {
        return range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
            && range.commonAncestorContainer !== this.wwe.get$Body()[0]
            && range.startOffset === 0
            && range.endOffset === range.commonAncestorContainer.childNodes.length
            && range.commonAncestorContainer === range.startContainer
            && range.commonAncestorContainer === range.endContainer;
    }

    /**
     * Table cut and copy action helper for safari and IE's
     * @param {string} [action] Boolean value for cut action
     * @private
     */
    _executeActionFor(action) {
        this._saveLastestClipboardRangeInfo();
        if (action === 'cut') {
            this.wwe.postProcessForChange();
        }
    }

    /**
     * Replace pasteData to lastClipboardRangeInfo's data
     * @param {object} pasteData Clipboard data
     * @private
     */
    _addRangeInfoAndReplaceFragmentIfNeed(pasteData) {
        const hasRangeInfo = !!this._latestClipboardRangeInfo;
        const savedContents = (hasRangeInfo && this._latestClipboardRangeInfo.contents);
        const isSameContents = savedContents.textContent === pasteData.fragment.textContent;

        if (hasRangeInfo) {
            pasteData.rangeInfo = this._latestClipboardRangeInfo;

            if (isSameContents) {
                pasteData.fragment = $(savedContents).clone()[0];
            }
        }
    }
}
module.exports = WwClipboardManager;
