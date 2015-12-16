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
 * @param {WwHrManager} wwe WwHrManager instance
 */
function WwHrManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    this._init();
}

WwHrManager.prototype._init = function() {
    this._initKeyHandler();
    this._initEvent();
};

WwHrManager.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('wysiwygSetValueAfter', function() {
        self._unwrapDivOnHr();
    });
};

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

WwHrManager.prototype._isInHr = function(selection) {
    return domUtils.getNodeName(selection.startContainer.childNodes[selection.startOffset]) === 'HR';
};

WwHrManager.prototype._isNearHr = function(selection) {
    var prevNode = domUtils.getChildNodeAt(selection.startContainer, selection.startOffset - 1);
    return domUtils.getNodeName(prevNode) === 'HR';
};

WwHrManager.prototype._removeHrIfNeed = function(selection, event) {
    var hrSuspect, cursorTarget;

    if (this._isInHr(selection)) {
        hrSuspect = domUtils.getChildNodeAt(selection.startContainer, selection.startOffset);
    } else if (selection.startOffset === 0) {
        hrSuspect = selection.startContainer.previousSibling || selection.startContainer.parentNode.previousSibling;

        if (domUtils.getNodeName(hrSuspect) !== 'HR') {
            hrSuspect = null;
        }
    } else if (this._isNearHr(selection)) {
        hrSuspect = domUtils.getChildNodeAt(selection.startContainer, selection.startOffset - 1);
    }

    if (hrSuspect) {
        event.preventDefault();

        cursorTarget = hrSuspect.nextSibling;
        $(hrSuspect).remove();

        selection.setStartBefore(cursorTarget);
        selection.collapse(true);
        this.wwe.getEditor().setSelection(selection);

        return true;
    }
};

//we use divs for paragraph so we dont need any p tags
WwHrManager.prototype._unwrapDivOnHr = function() {
    this.wwe.get$Body().find('hr').each(function(index, node) {
        if ($(node).parent().is('div')) {
            $(node).parent().find('br').remove();
            $(node).unwrap();
        }
    });
};

module.exports = WwHrManager;
