/**
 * @fileoverview Implements wysiwyg hr manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


import domUtils from './domUtils';

/**
 * WwHrManager
 * @exports WwHrManager
 * @constructor
 * @class WwHrManager
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
class WwHrManager {
    constructor(wwe) {
        this.wwe = wwe;
        this.eventManager = wwe.eventManager;

        /**
         * Name property
         * @api
         * @memberOf WwHrManager
         * @type {string}
         */
        this.name = 'hr';

        this._init();
    }

    /**
     * _init
     * Initialize
     * @memberOf WwHrManager
     * @private
     */
    _init() {
        this._initKeyHandler();
        this._initEvent();
    }

    /**
     * _initEvent
     * Initialize eventmanager event
     * @memberOf WwHrManager
     * @private
     */
    _initEvent() {
        this.eventManager.listen('wysiwygSetValueAfter', () => {
            this._unwrapDivOnHr();
        });

        this.eventManager.listen('wysiwygGetValueBefore', () => {
            this._wrapDefaultBlockToOrphanTexts();
        });
    }

    /**
     * _initKeyHandler
     * Initialize key event handler
     * @memberOf WwHrManager
     * @private
     */
    _initKeyHandler() {
        this.wwe.addKeyEventHandler((ev, range) => this._onTypedInHr(range));

        this.wwe.addKeyEventHandler('ENTER', (ev, range) => {
            if (range.collapsed) {
                return this._removeHrOnEnter(range, ev);
            }

            return true;
        });

        this.wwe.addKeyEventHandler('BACK_SPACE', (ev, range) => {
            if (range.collapsed) {
                return this._removeHrOnBackspace(range, ev);
            }

            return true;
        });
    }

    /**
     * _isInHr
     * Check whether passed range is in hr or not
     * @param {Range} range range
     * @returns {boolean} result
     * @memberOf WwHrManager
     * @private
     */
    _isInHr(range) {
        return domUtils.getNodeName(range.startContainer.childNodes[range.startOffset]) === 'HR';
    }

    /**
     * _isNearHr
     * Check whether passed range is near hr or not
     * @param {Range} range range
     * @returns {boolean} result
     * @memberOf WwHrManager
     * @private
     */
    _isNearHr(range) {
        const prevNode = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset - 1);

        return domUtils.getNodeName(prevNode) === 'HR';
    }

    /**
     * Handler for delete HR when user typing within
     * @param {Range} range Range object
     * @memberOf WwHrManager
     * @private
     */
    _onTypedInHr(range) {
        // HR위에서 테스트 컨텐츠 입력을 시도한경우에 대한 대비
        if (this._isInHr(range) || this._isNearHr(range)) {
            this.wwe.defer(wwe => {
                wwe.saveSelection();
                this._wrapDefaultBlockToOrphanTexts();
                wwe.restoreSavedSelection();
            });
        }
    }

    /**
     * _removeHrOnEnter
     * Remove hr if need on enter
     * @param {Range} range range
     * @param {Event} ev event
     * @returns {boolean} return true if hr was removed
     * @memberOf WwHrManager
     * @private
     */
    _removeHrOnEnter(range, ev) {
        let hrSuspect, blockPosition;

        if (this._isInHr(range)) {
            hrSuspect = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset);
        } else if (this._isNearHr(range)) {
            hrSuspect = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset - 1);
            blockPosition = 'before';
        }

        return this._changeHrToNewDefaultBlock(hrSuspect, range, ev, blockPosition);
    }

    /**
     * _removeHrOnBackspace
     * Remove hr if need on backspace
     * @param {Range} range range
     * @param {Event} ev event
     * @returns {boolean} return true if hr was removed
     * @memberOf WwHrManager
     * @private
     */
    _removeHrOnBackspace(range, ev) {
        let hrSuspect, blockPosition;

        if (this._isInHr(range)) {
            hrSuspect = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset);
        } else if (range.startOffset === 0) {
            hrSuspect = domUtils.getTopPrevNodeUnder(range.startContainer, this.wwe.get$Body()[0]);
            blockPosition = 'none';
        } else if (this._isNearHr(range)) {
            hrSuspect = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset - 1);
            blockPosition = 'before';
        }

        return this._changeHrToNewDefaultBlock(hrSuspect, range, ev, blockPosition);
    }

    /**
     * _changeHrToNewDefaultBlock
     * Remove hr and add new default block then set range to it
     * @param {Node} hrSuspect Node could be hr
     * @param {Range} range range
     * @param {Event} ev event
     * @param {strong} newBlockPosition new default block add position
     * @returns {boolean} return true if hr was removed
     * @memberOf WwHrManager
     * @private
     */
    _changeHrToNewDefaultBlock(hrSuspect, range, ev, newBlockPosition) {
        if (hrSuspect && domUtils.getNodeName(hrSuspect) === 'HR') {
            ev.preventDefault();

            if (newBlockPosition !== 'none') {
                this.wwe.breakToNewDefaultBlock(range, newBlockPosition);
            }

            $(hrSuspect).remove();

            return false;
        }

        return true;
    }

    /**
     * _unwrapDivOnHr
     * Unwrap default block on hr
     * @memberOf WwHrManager
     * @private
     */
    _unwrapDivOnHr() {
        const editorContentBody = this.wwe.get$Body()[0];
        this.wwe.get$Body().find('hr').each((index, node) => {
            const parentDiv = $(node).parent('div');
            if (parentDiv[0] !== editorContentBody) {
                parentDiv.find('br').remove();
                $(node).unwrap();
            }
        });
    }

    /**
     * _wrapDefaultBlockToOrphanTexts
     * Wrap default block to orphan texts
     * mainly, this is used for orphan text that made by controlling hr
     * @memberOf WwHrManager
     * @private
     */
    _wrapDefaultBlockToOrphanTexts() {
        const textNodes = this.wwe.get$Body().contents().filter(findTextNodeFilter);

        textNodes.each((i, node) => {
            $(node).wrap('<div />');
        });
    }
}


/**
 * findTextNodeFilter
 * @function
 * @this Node
 * @returns {boolean}
 * @ignore
 */
function findTextNodeFilter() {
    return this.nodeType === Node.TEXT_NODE;
}

module.exports = WwHrManager;
