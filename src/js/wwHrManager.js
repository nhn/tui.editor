/**
 * @fileoverview Implements wysiwyg hr manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils');

/**
 * WwHrManager
 * @exports WwHrManager
 * @constructor
 * @class
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
function WwHrManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    this._init();
}

WwHrManager.prototype.name = 'hr';

/**
 * _init
 * Init
 */
WwHrManager.prototype._init = function() {
    this._initKeyHandler();
    this._initEvent();
};

/**
 * _initEvent
 * Initialize eventmanager event
 */
WwHrManager.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('wysiwygSetValueAfter', function() {
        self._unwrapDivOnHr();
    });

    this.eventManager.listen('wysiwygGetValueBefore', function() {
        self._wrapDefaultBlockToOrphanTexts();
    });
};

/**
 * _initKeyHandler
 * Initialize key event handler
 */
WwHrManager.prototype._initKeyHandler = function() {
    var self = this;

    this.wwe.addKeyEventHandler(function(ev, range) {
        return self._onTypedInHr(range);
    });

    this.wwe.addKeyEventHandler('ENTER', function(ev, range) {
        if (range.collapsed) {
            return self._removeHrOnEnter(range, ev);
        }

        return true;
    });

    this.wwe.addKeyEventHandler('BACK_SPACE', function(ev, range) {
        if (range.collapsed) {
            return self._removeHrOnBackspace(range, ev);
        }

        return true;
    });
};

/**
 * _isInHr
 * Check whether passed range is in hr or not
 * @param {Range} range range
 * @returns {boolean} result
 */
WwHrManager.prototype._isInHr = function(range) {
    return domUtils.getNodeName(range.startContainer.childNodes[range.startOffset]) === 'HR';
};

/**
 * _isNearHr
 * Check whether passed range is near hr or not
 * @param {Range} range range
 * @returns {boolean} result
 */
WwHrManager.prototype._isNearHr = function(range) {
    var prevNode = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset - 1);

    return domUtils.getNodeName(prevNode) === 'HR';
};

WwHrManager.prototype._onTypedInHr = function(range) {
    var self = this;

    //HR위에서 테스트 컨텐츠 입력을 시도한경우에 대한 대비
    if (this._isInHr(range) || this._isNearHr(range)) {
        this.wwe.defer(function(wwe) {
            wwe.saveSelection();
            self._wrapDefaultBlockToOrphanTexts();
            wwe.restoreSavedSelection();
        });
    }
};

/**
 * _removeHrOnEnter
 * Remove hr if need on enter
 * @param {Range} range range
 * @param {Event} ev event
 * @returns {boolean} return true if hr was removed
 */
WwHrManager.prototype._removeHrOnEnter = function(range, ev) {
    var hrSuspect, blockPosition;

    if (this._isInHr(range)) {
        hrSuspect = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset);
    } else if (this._isNearHr(range)) {
        hrSuspect = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset - 1);
        blockPosition = 'before';
    }

    return this._changeHrToNewDefaultBlock(hrSuspect, range, ev, blockPosition);
};

/**
 * _removeHrOnBackspace
 * Remove hr if need on backspace
 * @param {Range} range range
 * @param {Event} ev event
 * @returns {boolean} return true if hr was removed
 */
WwHrManager.prototype._removeHrOnBackspace = function(range, ev) {
    var hrSuspect, blockPosition;

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
};

/**
 * _changeHrToNewDefaultBlock
 * Remove hr and add new default block then set range to it
 * @param {Node} hrSuspect Node could be hr
 * @param {Range} range range
 * @param {Event} ev event
 * @param {strong} newBlockPosition new default block add position
 * @returns {boolean} return true if hr was removed
 */
WwHrManager.prototype._changeHrToNewDefaultBlock = function(hrSuspect, range, ev, newBlockPosition) {
    if (hrSuspect && domUtils.getNodeName(hrSuspect) === 'HR') {
        ev.preventDefault();

        if (newBlockPosition !== 'none') {
            this.wwe.breakToNewDefaultBlock(range, newBlockPosition);
        }

        $(hrSuspect).remove();

        return false;
    }

    return true;
};

/**
 * _unwrapDivOnHr
 * Unwrap default block on hr
 */
WwHrManager.prototype._unwrapDivOnHr = function() {
    this.wwe.get$Body().find('hr').each(function(index, node) {
        if ($(node).parent().is('div')) {
            $(node).parent().find('br').remove();
            $(node).unwrap();
        }
    });
};


/**
 * findTextNodeFilter
 * @this Node
 * @returns {boolean} true or not
 */
function findTextNodeFilter() {
    return this.nodeType === Node.TEXT_NODE;
}

/**
 * _wrapDefaultBlockToOrphanTexts
 * Wrap default block to orphan texts
 * mainly, this is used for orhan text that made by controlling hr
 */
WwHrManager.prototype._wrapDefaultBlockToOrphanTexts = function() {
    var textNodes;

    textNodes = this.wwe.get$Body().contents().filter(findTextNodeFilter);

    textNodes.each(function(i, node) {
        $(node).wrap('<div />');
    });
};

module.exports = WwHrManager;
