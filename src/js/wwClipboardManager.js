/**
 * @fileoverview Implements wysiwyg editor clipboard manager
 * @author Sungho Kim(sungho-kim@nhnent.com),
 *         Jiung Kang(jiung.kang@nhnent.com)
 *         FE Development Team/NHN Ent.
 */

import domUtils from './domUtils';
import WwPasteContentHelper from './wwPasteContentHelper';
import i18n from './i18n';

const PASTE_TABLE_BOOKMARK = 'tui-paste-table-bookmark';
const PASTE_TABLE_CELL_BOOKMARK = 'tui-paste-table-cell-bookmark';

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
        this._selectedSellCount = 0;
        this._$clipboardArea = null;
    }

    /**
     * init
     * initialize
     * @api
     * @memberOf WwClipboardManager
     */
    init() {
        this.wwe.getEditor().addEventListener('willPaste', this._onWillPaste.bind(this));
        this.wwe.eventManager.listen('copy', this._onCopyCut.bind(this));
        this.wwe.eventManager.listen('copyAfter', this._onCopyAfter.bind(this));
        this.wwe.eventManager.listen('cut', this._onCopyCut.bind(this));
        this.wwe.eventManager.listen('cutAfter', this._onCutAfter.bind(this));
    }

    _onCopyCut(event) {
        const tableManager = this.wwe.componentManager.getManager('tableSelection');
        const selectedCellCount = tableManager.getSelectedCells().length;
        if (!selectedCellCount) {
            // preserve selection range in a cell, let squire do the job
            return;
        }
        if (!tableManager.mergedTableSelectionManager) {
            // set selection range to all contents in selected cells, then squire
            tableManager.createRangeBySelectedCells();
            tableManager.removeClassAttrbuteFromAllCellsIfNeed();

            return;
        }
        const editor = this.wwe.getEditor();
        const clipboardEvent = event.data;
        const range = editor.getSelection().cloneRange();
        const $clipboardContainer = $('<div />');

        this._extendRange(range);
        $clipboardContainer.append(range.cloneContents());
        this._updateCopyDataForListTypeIfNeed(range, $clipboardContainer);
        this.wwe.eventManager.emit('copyBefore', {
            source: 'wysiwyg',
            $clipboardContainer
        });

        this._setClipboardData(clipboardEvent, $clipboardContainer.html(), $clipboardContainer.text());
    }

    _clearClipboardArea() {
        if (this._$clipboardArea) {
            this._$clipboardArea.remove();
            this._$clipboardArea = null;
        }
    }

    _onCopyAfter() {
        this.wwe.getEditor().get$Body().focus();
        this._clearClipboardArea();
    }

    _onCutAfter() {
        const range = this.wwe.getEditor().getSelection();
        range.deleteContents();
        this.wwe.getEditor().focus();
        this._clearClipboardArea();
    }

    _onWillPaste(pasteData) {
        const $clipboardContainer = $('<div>').append(pasteData.fragment.cloneNode(true));

        this._setTableBookmark($clipboardContainer);

        if (this._pasteToTable($clipboardContainer)) {
            pasteData.preventDefault();
        } else {
            this._preparePaste($clipboardContainer);
            this._setTableBookmark($clipboardContainer);

            pasteData.fragment = document.createDocumentFragment();
            $($clipboardContainer[0].childNodes).each((index, element) => {
                pasteData.fragment.appendChild(element);
            });
        }

        // once right after the squire insertHTML DOM.
        const handler = () => {
            this.wwe.getEditor().removeEventListener('input', handler);
            this.wwe.eventManager.emit('wysiwygRangeChangeAfter', this);
            this._focusTableBookmark();
        };
        this.wwe.getEditor().addEventListener('input', handler);
    }

    _setClipboardData(clipboardEvent, htmlContent, textContent) {
        if (tui.util.browser.msie) {
            clipboardEvent.squirePrevented = true;
            this._$clipboardArea = this._createClipboardArea();
            this._$clipboardArea.html(htmlContent);
            this._$clipboardArea.focus();
            window.getSelection().selectAllChildren(this._$clipboardArea[0]);
        } else {
            clipboardEvent.preventDefault();
            clipboardEvent.stopPropagation();
            clipboardEvent.clipboardData.setData('text/html', htmlContent);
            clipboardEvent.clipboardData.setData('text/plain', textContent);
        }
    }

    _createClipboardArea() {
        return $('<DIV>').attr({
            contenteditable: 'true',
            style: 'position:fixed; overflow:hidden; top:0; right:100%; width:1px; height:1px;'
        }).appendTo(document.body);
    }

    /**
     * Update copy data, when commonAncestorContainer nodeName is list type like UL or OL.
     * @param {object} range - text range
     * @param {jQuery} $clipboardContainer - clibpard container jQuery element
     */
    _updateCopyDataForListTypeIfNeed(range, $clipboardContainer) {
        const commonAncestorNodeName = range.commonAncestorContainer.nodeName;
        if (commonAncestorNodeName !== 'UL' && commonAncestorNodeName !== 'OL') {
            return;
        }

        const $newParent = $(`<${commonAncestorNodeName} />`);
        $newParent.append($clipboardContainer.html());
        $clipboardContainer.html('');
        $clipboardContainer.append($newParent);
    }

    /**
     * Remove empty font elements.
     * @param {jQuery} $clipboardContainer - cliboard jQuery container
     */
    _removeEmptyFontElement($clipboardContainer) {
        // windows word에서 복사 붙여넣기 시 불필요 font 태그가 생성되는 경우가 있음
        $clipboardContainer.children('font').each((index, element) => {
            const $element = $(element);

            if (!$element.text().trim()) {
                $element.remove();
            }
        });
    }

    /**
     * Paste to table.
     * @param {jQuery} $clipboardContainer - clibpard container
     * @returns {boolean} whether processed or not
     * @private
     */
    _pasteToTable($clipboardContainer) {
        const tableManager = this.wwe.componentManager.getManager('table');
        const tableSelectionManager = this.wwe.componentManager.getManager('tableSelection');
        const range = this.wwe.getEditor().getSelection();
        const pastingToTable = tableManager.isInTable(range);
        const {childNodes} = $clipboardContainer.get(0);
        const containsOneTableOnly = (childNodes.length === 1 && childNodes[0].nodeName === 'TABLE');
        let processed = false;

        if (pastingToTable) {
            if (containsOneTableOnly) {
                tableManager.pasteClipboardData($clipboardContainer.first());
                $clipboardContainer.html(''); // drains clipboard data as we've pasted everything here.
                processed = true;
            } else if (tableSelectionManager.getSelectedCells().length) {
                alert(i18n.get('Cannot paste values ​​other than a table in the cell selection state'));
                $clipboardContainer.html(''); // drains clipboard data
                processed = true;
            }
        }

        return processed;
    }

    /**
     * Prepare paste.
     * @param {jQuery} $clipboardContainer - temporary jQuery container for clipboard contents
     * @private
     */
    _preparePaste($clipboardContainer) {
        this._removeEmptyFontElement($clipboardContainer);

        this._pch.preparePaste($clipboardContainer);

        this.wwe.eventManager.emit('pasteBefore', {
            source: 'wysiwyg',
            $clipboardContainer
        });
    }

    /**
     * set table bookmark which will gain focus after document modification ends.
     * @param {jQuery} $clipboardContainer - clipboard container
     * @memberOf WwClipboardManager
     */
    _setTableBookmark($clipboardContainer) {
        const $lastNode = $($clipboardContainer[0].childNodes).last();
        const isLastNodeTable = $lastNode[0] && $lastNode[0].nodeName === 'TABLE';

        if (isLastNodeTable) {
            $lastNode.addClass(PASTE_TABLE_BOOKMARK);
        }
    }

    /**
     * Focus to table after document modification.
     * @param {object} sq - squire editor instance
     * @private
     */
    _focusTableBookmark() {
        const sq = this.wwe.getEditor();
        const range = sq.getSelection().cloneRange();
        const $bookmarkedTable = sq.get$Body().find(`.${PASTE_TABLE_BOOKMARK}`);
        const $bookmarkedCell = sq.get$Body().find(`.${PASTE_TABLE_CELL_BOOKMARK}`);

        if ($bookmarkedTable.length) {
            $bookmarkedTable.removeClass(PASTE_TABLE_BOOKMARK);
            range.setEndAfter($bookmarkedTable[0]);
            range.collapse(false);
            sq.setSelection(range);
        }
        if ($bookmarkedCell.length) {
            $bookmarkedCell.removeClass(PASTE_TABLE_CELL_BOOKMARK);
            range.selectNodeContents($bookmarkedCell[0]);
            range.collapse(false);
            sq.setSelection(range);
        }
    }

    /**
     * _extendRange
     * extend range if need
     * @memberOf WwClipboardManager
     * @param {Range} range to extend
     * @private
     */
    _extendRange(range) {
        // 텍스트 노드이면서 모두 선택된게 아니면 레인지를 확장할 필요가 없다.
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

        // commonAncestor의 모든 컨텐츠가 선택된경우 commonAncestor로 셀렉션 변경
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

        // 레인지 확장
        while (newBound.parentNode !== range.commonAncestorContainer
        && newBound.parentNode !== this.wwe.get$Body()[0]
        && !newBound.previousSibling
            ) {
            newBound = newBound.parentNode;
        }

        // range단위를 한단계 확장 deleteContents는 start, end에 걸린 컨테이너 자체는 안지운다.
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

        // 레인지 확장
        while (newBound.parentNode !== range.commonAncestorContainer
        && newBound.parentNode !== this.wwe.get$Body()[0]
        && (!boundNext || (domUtils.getNodeName(boundNext) === 'BR' && newBound.parentNode.lastChild === boundNext))
            ) {
            newBound = newBound.parentNode;
            boundNext = newBound.nextSibling;
        }

        // range단위를 부모래밸로 한단계 확장 deleteContents는 start, end에 걸린 컨테이너 자체는 안지운다.
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
}

module.exports = WwClipboardManager;
