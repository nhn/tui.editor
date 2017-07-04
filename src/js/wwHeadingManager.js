/**
 * @fileoverview Implements wysiwyg heading manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import domUtils from './domUtils';
const FIND_HEADING_RX = /h[\d]/i;

/**
 * WwHeadingManager
 * @exports WwHeadingManager
 * @constructor
 * @class WwHeadingManager
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
class WwHeadingManager {
    constructor(wwe) {
        this.wwe = wwe;
        this.eventManager = wwe.eventManager;

        /**
         * Name property
         * @api
         * @memberOf WwHeadingManager
         * @type {string}
         */
        this.name = 'heading';

        this._init();
    }

    /**
     * _init
     * Initialize
     * @memberOf WwHeadingManager
     * @private
     */
    _init() {
        this._initEvent();
        this._initKeyHandler();
    }

    _initEvent() {
        this.eventManager.listen('wysiwygSetValueAfter', () => {
            this._wrapDefaultBlockToHeadingInner();
        });
    }

    /**
     * _initKeyHandler
     * Initialize key event handler
     * @memberOf WwHeadingManager
     * @private
     */
    _initKeyHandler() {
        this.wwe.addKeyEventHandler('ENTER', (ev, range) => {
            if (this.wwe.hasFormatWithRx(FIND_HEADING_RX)) {
                this._onEnter(ev, range);

                return false;
            }

            return true;
        });

        this.wwe.addKeyEventHandler('BACK_SPACE', (ev, range) => {
            if (this.wwe.hasFormatWithRx(FIND_HEADING_RX)) {
                this._removePrevTopNodeIfNeed(ev, range);

                return false;
            }

            return true;
        });
    }

    /**
     * _wrapDefaultBlockToHeadingInner
     * Wrap default block to heading inner contents
     * @private
     */
    _wrapDefaultBlockToHeadingInner() {
        this.wwe.get$Body().find('h1, h2, h3, h4, h5, h6').each((index, node) => {
            if ($(node).children('div, p').length <= 0) {
                $(node).wrapInner('<div />');
            }
        });
    }

    /**
     * _unwrapHeading
     * Unwrap heading
     * @memberOf WwHeadingManager
     * @private
     */
    _unwrapHeading() {
        this.wwe.unwrapBlockTag(node => FIND_HEADING_RX.test(node));
    }

    /**
     * _onEnter
     * Enter key handler
     * @memberOf WwHeadingManager
     * @param {Event} event event object
     * @param {Range} range range
     * @private
     */
    _onEnter(event, range) {
        if (range.startOffset > 0) {
            // squire의 처리 중간이나 마지막에 개입할 방법이 없어 지연 처리
            this.wwe.defer(wwe => {
                this._unwrapHeading();
                wwe.getEditor().removeLastUndoStack();
            });
        } else {
            event.preventDefault();
            this._insertEmptyBlockToPrevious(range);
        }
    }

    /**
     * _insertEmptyBlockToPrevious
     * Insert empty block to previous of passed range
     * @api
     * @memberOf WwHeadingManager
     * @param {Range} range range
     * @private
     */
    _insertEmptyBlockToPrevious(range) {
        this.wwe.getEditor().saveUndoState(range);
        $('<div><br></div>').insertBefore(domUtils.getParentUntil(range.startContainer, this.wwe.get$Body()[0]));
    }

    /**
     * _removePrevTopNodeIfNeed
     * Remove previous top node if need
     * @memberOf WwHeadingManager
     * @param {Event} event event object
     * @param {Range} range range
     * @returns {Boolean} whether needed or not
     * @private
     */
    _removePrevTopNodeIfNeed(event, range) {
        let isHandled = false;

        if (range.collapsed && range.startOffset === 0) {
            const {startContainer} = range;
            const prevTopNode = domUtils.getTopPrevNodeUnder(startContainer, this.wwe.get$Body()[0]);
            const isPrevTopNodeEmpty = prevTopNode && prevTopNode.textContent.length === 0;
            const sq = this.wwe.getEditor();

            if (startContainer.textContent.length === 0) {
                isHandled = this._removeHedingAndChangeSelection(event, range, prevTopNode);
            } else if (isPrevTopNodeEmpty) {
                event.preventDefault();
                sq.saveUndoState(range);

                $(prevTopNode).remove();
                isHandled = true;
            }
        }

        return isHandled;
    }

    /**
     * Remove heading and change selection
     * @param {object} event Event object
     * @param {Range} range Range object
     * @param {HTMLElement} prevTopNode Previous top node
     * @returns {boolean}
     * @private
     */
    _removeHedingAndChangeSelection(event, range, prevTopNode) {
        const {startContainer} = range;
        const sq = this.wwe.getEditor();
        const $Body = this.wwe.get$Body();
        const isHeading = FIND_HEADING_RX.test(domUtils.getNodeName(startContainer));
        const headingElement = isHeading ? startContainer : $(startContainer).parents('h1,h2,h3,h4,h5,h6')[0];
        let targetNode = prevTopNode;
        let offset = 1;

        if (!event.defaultPrevented) {
            event.preventDefault();
            sq.saveUndoState(range);
        }

        $(headingElement).remove();

        if (!prevTopNode) {
            targetNode = $Body.children('div').first().get(0);
            offset = 0;
        }

        range.setStart(targetNode, offset);
        range.collapse(true);
        sq.setSelection(range);

        return true;
    }
}

module.exports = WwHeadingManager;
