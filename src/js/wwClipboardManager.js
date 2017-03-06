/**
 * @fileoverview Implements wysiwyg editor clipboard manager
 * @author Sungho Kim(sungho-kim@nhnent.com),
 *         Jiung Kang(jiung.kang@nhnent.com)
 *         FE Development Team/NHN Ent.
 */

import domUtils from './domUtils';
import WwPasteContentHelper from './wwPasteContentHelper';
import WwClipboardHandler from './wwClipboardHandler';
import WwPseudoClipboardHandler from './wwPseudoClipboardHandler';
import htmlSanitizer from './htmlSanitizer';
import i18n from './i18n';

const PASTE_TABLE_BOOKMARK = 'tui-paste-table-bookmark';

/**
 * WwClipboardManager
 * @exports WwClipboardManager
 * @constructor
 * @class WwClipboardManager
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
class WwClipboardManager {
    constructor(wwe) {
        const browser = tui.util.browser;
        let ClipboardHandler = WwPseudoClipboardHandler;
        if (browser.chrome || browser.safari || browser.firefox) {
            ClipboardHandler = WwClipboardHandler;
        }

        this.wwe = wwe;
        this._pch = new WwPasteContentHelper(this.wwe);
        this._cbHdr = new ClipboardHandler(this.wwe, {
            onCopyBefore: this.onCopyBefore.bind(this),
            onCutBefore: this.onCopyBefore.bind(this),
            onCut: this.onCut.bind(this),
            onPaste: this.onPaste.bind(this)
        });
    }

    /**
     * init
     * initialize
     * @api
     * @memberOf WwClipboardManager
     */
    init() {
        // squire의 willPaste가 동작하지 않도록 처리
        this.wwe.getEditor().addEventListener('willPaste', pasteData => {
            pasteData.preventDefault();
        });
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
     * This handler execute before copy.
     * @param {Event} ev - clipboard event
     */
    onCopyBefore(ev) {
        const editor = this.wwe.getEditor();

        editor.focus();

        const range = editor.getSelection().cloneRange();
        const $clipboardContainer = $('<div />');

        this._extendRange(range);

        $clipboardContainer.append(range.cloneContents());

        this._updateCopyDataForListTypeIfNeed(range, $clipboardContainer);

        this.wwe.eventManager.emit('copyBefore', {
            source: 'wysiwyg',
            $clipboardContainer
        });

        this._cbHdr.setClipboardData(ev, $clipboardContainer.html(), $clipboardContainer.text());
    }

    /**
     * This handler execute cut.
     * @param {Event} ev - clipboard event
     */
    onCut(ev) {
        this.wwe.eventManager.emit('cut', {
            source: 'wysiwyg',
            data: ev
        });
        this.wwe.debouncedPostProcessForChange();
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
     * Prepare paste.
     * @param {jQuery} $clipboardContainer - temporary jQuery container for clipboard contents
     * @private
     */
    _preparePaste($clipboardContainer) {
        this._removeEmptyFontElement($clipboardContainer);

        $clipboardContainer.html($clipboardContainer.html().trim());

        this._pch.preparePaste($clipboardContainer);

        this.wwe.eventManager.emit('pasteBefore', {
            source: 'wysiwyg',
            $clipboardContainer
        });
    }

    /**
     * Focus to after table.
     * @param {object} sq - squire editor instance
     * @private
     */
    _focusToAfterTable() {
        const sq = this.wwe.getEditor();
        const range = sq.getSelection().cloneRange();
        const $bookmarkedTable = sq.get$Body().find(`.${PASTE_TABLE_BOOKMARK}`);

        if ($bookmarkedTable.length) {
            $bookmarkedTable.removeClass(PASTE_TABLE_BOOKMARK);
            range.setEndAfter($bookmarkedTable[0]);
            range.collapse(false);
            sq.setSelection(range);
        }
    }

    /**
     * Whether paste only table or not.
     * @param {jQuery} $clipboardContainer - clibpard container
     * @returns {boolean}
     * @private
     */
    _isPasteOnlyTable($clipboardContainer) {
        const childNodes = $clipboardContainer[0].childNodes;

        return childNodes.length === 1 && childNodes[0].nodeName === 'TABLE';
    }

    /**
     * Paste to table.
     * @param {jQuery} $clipboardContainer - clibpard container
     * @private
     */
    _pasteToTable($clipboardContainer) {
        const tableManager = this.wwe.componentManager.getManager('table');
        tableManager.pasteClipboardData($clipboardContainer.first());
    }

    /**
     * check whether pasting operation is to table
     * @returns {boolean} true if paste to table
     * @memberOf WwClipboardManager
     */
    _isPastingToTable() {
        const tableManager = this.wwe.componentManager.getManager('table');
        const range = this.wwe.getEditor().getSelection();

        return tableManager.isInTable(range);
    }

    /**
     * Remove html comments.
     * @param {string} html - html
     * @returns {string}
     * @private
     */
    _removeHtmlComments(html) {
        return html.replace(/<!--[\s\S]*?-->/g, '');
    }

    /**
     * Paste a plain text to table
     * Pasting plain text via {Squire}.insertPlainText() wraps each text by DIV.
     * In every table, line break should be BR tag instead of DIV.
     * Hence We need to make TextNodes and BR Elements to prevent breaking the target table.
     * @param {string} text text to add to table
     * @memberOf WwClipboardManager
     * @private
     */
    _pastePlainTextToTable(text) {
        const textLines = text.split('\n');
        for (let i = 0; i < textLines.length; i += 1) {
            let nodeToInsert = document.createTextNode(tui.util.encodeHTMLEntity(textLines[i]));
            this.wwe.getEditor().insertElement(nodeToInsert);
            if (i < textLines.length - 1) {
                nodeToInsert = document.createElement('br');
                this.wwe.getEditor().insertElement(nodeToInsert);
            }
        }
    }

    /**
     * This handler execute paste.
     * @param {Event} ev - clipboard event
     */
    onPaste(ev) {
        const $clipboardContainer = $('<div />');
        const clipboardData = ev.clipboardData;
        const isPlainText = !(tui.util.inArray('text/html', clipboardData.types) >= 0);
        const clipboardText = isPlainText ? clipboardData.getData('text/plain') : clipboardData.getData('text/html');
        const pastingToTable = this._isPastingToTable();
        let needToPostProcess = false;

        let html = this._removeHtmlComments(clipboardText).trim();
        html = htmlSanitizer(html, true).trim();

        if (!html) {
            return;
        }

        $clipboardContainer.html(html);

        this._preparePaste($clipboardContainer);

        const $lastNode = $($clipboardContainer[0].childNodes).last();
        const isLastNodeTable = $lastNode[0] && $lastNode[0].nodeName === 'TABLE';

        if (isLastNodeTable) {
            $lastNode.addClass(PASTE_TABLE_BOOKMARK);
        }

        if (pastingToTable) { // pasting `TO` `TABLE`
            if (isPlainText) { // pasting `PLAIN TEXT` `TO` `TABLE`
                this._pastePlainTextToTable(clipboardText);
                needToPostProcess = true;
            } else { // pasting `HTML` `TO` `TABLE`
                const tableSelectionManager = this.wwe.componentManager.getManager('tableSelection');
                if (this._isPasteOnlyTable($clipboardContainer)) { // pasting `HTML TABLE` `TO` `TABLE`
                    this._pasteToTable($clipboardContainer);
                } else if (tableSelectionManager.getSelectedCells().length) { // TODO move this alert out of here
                    alert(i18n.get('Cannot paste values ​​other than a table in the cell selection state'));
                } else {
                    this.wwe.getEditor().insertHTML($clipboardContainer.html());
                    needToPostProcess = true;
                }
            }
        } else { // pasting TO ELSE WHERE
            if (isPlainText) { // pasting `PLAIN TEXT`
                this.wwe.getEditor().insertPlainText(clipboardText);
            } else { // pasting `HTML`
                this.wwe.getEditor().insertHTML($clipboardContainer.html());
            }
            needToPostProcess = true;
        }

        if (needToPostProcess) {
            this.wwe.postProcessForChange();

            if (isLastNodeTable) {
                this._focusToAfterTable();
            }
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
