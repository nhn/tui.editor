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
        this._initKeyHandler();
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
            //squire의 처리 중간이나 마지막에 개입할 방법이 없어 지연 처리
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
        let prevTopNode;

        if (range.collapsed) {
            prevTopNode = domUtils.getTopPrevNodeUnder(range.startContainer, this.wwe.get$Body()[0]);

            if (range.startOffset === 0
                && prevTopNode
                && !prevTopNode.textContent.length
            ) {
                event.preventDefault();
                this.wwe.getEditor().saveUndoState(range);
                $(prevTopNode).remove();
                isHandled = true;
            }
        }

        return isHandled;
    }
}

module.exports = WwHeadingManager;
