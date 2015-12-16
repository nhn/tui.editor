/**
 * @fileoverview Implements wysiwyg heading manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var FIND_HEADING_RX = /h[\d]/i;

/**
 * WwHeadingManager
 * @exports WwHeadingManager
 * @augments
 * @constructor
 * @class
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
function WwHeadingManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    this._init();
}

WwHeadingManager.prototype._init = function() {
    this._initKeyHandler();
};

WwHeadingManager.prototype._initKeyHandler = function() {
    var self = this;

    this.wwe.addKeyEventHandler(function(event, range) {
        var isHandled;

        //enter
        if (event.keyCode === 13) {
            if (self.wwe.hasFormatWithRx(FIND_HEADING_RX)) {
                //squire의 처리 중간이나 마지막에 개입할 방법이 없어 지연 처리
                setTimeout(function() {
                    self._unwrapHeading();
                }, 0);

                isHandled = true;
            }
        //backspace
        } else if (event.keyCode === 8) {
            if (range.collapsed) {
                if (self.wwe.hasFormatWithRx(FIND_HEADING_RX) && range.startOffset === 0) {
                    self._unwrapHeading();
                    isHandled = true;
                }
            }
        }
        return isHandled;
    });
};

WwHeadingManager.prototype._unwrapHeading = function() {
    this.wwe.unwrapBlockTag(function(node) {
        return FIND_HEADING_RX.test(node);
    });
};

module.exports = WwHeadingManager;
