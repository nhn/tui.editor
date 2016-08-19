/**
 * @fileoverview Implements wysiwyg heading manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


var domUtils = require('./domUtils');

var FIND_HEADING_RX = /h[\d]/i;

/**
 * WwHeadingManager
 * @exports WwHeadingManager
 * @constructor
 * @class WwHeadingManager
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
function WwHeadingManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    this._init();
}

/**
 * Name property
 * @api
 * @memberOf WwHeadingManager
 * @type {string}
 */
WwHeadingManager.prototype.name = 'heading';

/**
 * _init
 * Initialize
 * @memberOf WwHeadingManager
 * @private
 */
WwHeadingManager.prototype._init = function() {
    this._initKeyHandler();
};

/**
 * _initKeyHandler
 * Initialize key event handler
 * @memberOf WwHeadingManager
 * @private
 */
WwHeadingManager.prototype._initKeyHandler = function() {
    var self = this;

    this.wwe.addKeyEventHandler('ENTER', function(ev, range) {
        if (self.wwe.hasFormatWithRx(FIND_HEADING_RX)) {
            self._onEnter(ev, range);

            return false;
        }

        return true;
    });

    this.wwe.addKeyEventHandler('BACK_SPACE', function(ev, range) {
        if (self.wwe.hasFormatWithRx(FIND_HEADING_RX)) {
            self._removePrevTopNodeIfNeed(ev, range);

            return false;
        }

        return true;
    });
};

/**
 * _unwrapHeading
 * Unwrap heading
 * @memberOf WwHeadingManager
 * @private
 */
WwHeadingManager.prototype._unwrapHeading = function() {
    this.wwe.unwrapBlockTag(function(node) {
        return FIND_HEADING_RX.test(node);
    });
};

/**
 * _onEnter
 * Enter key handler
 * @memberOf WwHeadingManager
 * @param {Event} event event object
 * @param {Range} range range
 * @private
 */
WwHeadingManager.prototype._onEnter = function(event, range) {
    var self = this;

    if (range.startOffset > 0) {
        //squire의 처리 중간이나 마지막에 개입할 방법이 없어 지연 처리
        this.wwe.defer(function(wwe) {
            self._unwrapHeading();
            wwe.getEditor().removeLastUndoStack();
        });
    } else {
        event.preventDefault();
        this._insertEmptyBlockToPrevious(range);
    }
};

/**
 * _insertEmptyBlockToPrevious
 * Insert empty block to previous of passed range
 * @api
 * @memberOf WwHeadingManager
 * @param {Range} range range
 * @private
 */
WwHeadingManager.prototype._insertEmptyBlockToPrevious = function(range) {
    this.wwe.getEditor().saveUndoState(range);
    $('<div><br></div>').insertBefore(domUtils.getParentUntil(range.startContainer, this.wwe.get$Body()[0]));
};

/**
 * _removePrevTopNodeIfNeed
 * Remove previous top node if need
 * @memberOf WwHeadingManager
 * @param {Event} event event object
 * @param {Range} range range
 * @returns {Boolean} whether needed or not
 * @private
 */
WwHeadingManager.prototype._removePrevTopNodeIfNeed = function(event, range) {
    var isHandled, prevTopNode;

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
};

module.exports = WwHeadingManager;
