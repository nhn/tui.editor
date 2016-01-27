/**
 * @fileoverview Implements wysiwyg heading manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils');

var FIND_HEADING_RX = /h[\d]/i;

/**
 * WwHeadingManager
 * @exports WwHeadingManager
 * @constructor
 * @class
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
function WwHeadingManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    this._init();
}

WwHeadingManager.prototype.name = 'heading';

/**
 * _init
 */
WwHeadingManager.prototype._init = function() {
    this._initKeyHandler();
};

/**
 * _initKeyHandler
 * Initialize key event handler
 */
WwHeadingManager.prototype._initKeyHandler = function() {
    var self = this;

    this.wwe.addKeyEventHandler('ENTER', function(ev, range) {
        if (self.wwe.hasFormatWithRx(FIND_HEADING_RX)) {
            self._onEnter(ev, range);
            return false;
        }
    });

    this.wwe.addKeyEventHandler('BACK_SPACE', function(ev, range) {
        if (self.wwe.hasFormatWithRx(FIND_HEADING_RX)) {
            self._removePrevTopNodeIfNeed(ev, range);
            return false;
        }
    });
};

/**
 * _unwrapHeading
 * Unwrap heading
 */
WwHeadingManager.prototype._unwrapHeading = function() {
    this.wwe.unwrapBlockTag(function(node) {
        return FIND_HEADING_RX.test(node);
    });
};

/**
 * _onEnter
 * Enter key handler
 * @param {Event} event event object
 * @param {Range} range range
 */
WwHeadingManager.prototype._onEnter = function(event, range) {
    var self = this;

    if (range.startOffset > 0) {
        //squire의 처리 중간이나 마지막에 개입할 방법이 없어 지연 처리
        setTimeout(function() {
            self._unwrapHeading();
            self.wwe.getEditor().removeLastUndoStack();
        }, 0);
    } else {
        event.preventDefault();
        this._insertEmptyBlockToPrevious(range);
    }
};

/**
 * _insertEmptyBlockToPrevious
 * Insert empty block to previous of passed range
 * @param {Range} range range
 */
WwHeadingManager.prototype._insertEmptyBlockToPrevious = function(range) {
    this.wwe.getEditor().recordUndoState(range);
    $('<div><br></div>').insertBefore(domUtils.getParentUntil(range.startContainer, 'BODY'));
};

/**
 * _removePrevTopNodeIfNeed
 * Remove previous top node if need
 * @param {Event} event event object
 * @param {Range} range range
 * @returns {Boolean}  wether needed or not
 */
WwHeadingManager.prototype._removePrevTopNodeIfNeed = function(event, range) {
    var isHandled, prevTopNode;

    if (range.collapsed) {
        prevTopNode = domUtils.getPrevTopBlockNode(range.startContainer);

        if (range.startOffset === 0
            && prevTopNode
            && !prevTopNode.textContent.length
           ) {
            event.preventDefault();
            this.wwe.getEditor().recordUndoState(range);
            $(prevTopNode).remove();
            isHandled = true;
        }
    }

    return isHandled;
};

module.exports = WwHeadingManager;
