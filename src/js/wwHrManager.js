/**
 * @fileoverview Implements wysiwyg hr manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils');

/**
 * WwHrManager
 * @exports WwHrManager
 * @augments
 * @constructor
 * @class
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
function WwHrManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    this._init();
}

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
};

/**
 * _initKeyHandler
 * Initialize key event handler
 */
WwHrManager.prototype._initKeyHandler = function() {
    var self = this;

    this.wwe.addKeyEventHandler(function(event, range) {
        var isHandled;

        //enter
        if (event.keyCode === 13) {
            if (self._isInHr(range) || self._isNearHr(range)) {
                isHandled = self._removeHrIfNeed(range, event);
            }
        //backspace
        } else if (event.keyCode === 8) {
            isHandled = self._removeHrIfNeed(range, event);
        }

        return isHandled;
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
    var prevNode = domUtils.getChildNodeAt(range.startContainer, range.startOffset - 1);
    return domUtils.getNodeName(prevNode) === 'HR';
};

/**
 * _removeHrIfNeed
 * Remove hr if need
 * @param {Range} range range
 * @param {Event} event event
 * @returns {boolean} return true if hr was removed
 */
WwHrManager.prototype._removeHrIfNeed = function(range, event) {
    var hrSuspect, cursorTarget;

    if (this._isInHr(range)) {
        hrSuspect = domUtils.getChildNodeAt(range.startContainer, range.startOffset);
    } else if (range.startOffset === 0) {
        hrSuspect = range.startContainer.previousSibling || range.startContainer.parentNode.previousSibling;

        if (domUtils.getNodeName(hrSuspect) !== 'HR') {
            hrSuspect = null;
        }
    } else if (this._isNearHr(range)) {
        hrSuspect = domUtils.getChildNodeAt(range.startContainer, range.startOffset - 1);
    }

    if (hrSuspect) {
        event.preventDefault();

        cursorTarget = hrSuspect.nextSibling;
        $(hrSuspect).remove();

        range.setStartBefore(cursorTarget);
        range.collapse(true);
        this.wwe.getEditor().setSelection(range);

        return true;
    }
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

module.exports = WwHrManager;
