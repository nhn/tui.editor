/**
 * @fileoverview Implements wysiwyg p manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

/**
 * WwPManager
 * @exports WwPManager
 * @augments
 * @constructor
 * @class
 * @param {WysiwygEditor} wwe wysiwygEditor instance
 */
function WwPManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    this._init();
}

WwPManager.prototype._init = function() {
    this._initEvent();
};

WwPManager.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('wysiwygSetValueAfter', function() {
        self._ensurePtagContentWrappedWithDiv();
        self._unwrapPtags();
    });
};

//this because we need new line inside ptag, and additional empty line added
//p태그 안에서의 개행을 위해서는 내부에 div로 감쌀필요가 있다.
//p태그를 없애기위한 사전작업
WwPManager.prototype._ensurePtagContentWrappedWithDiv = function() {
    this.wwe.get$Body().find('p').each(function(index, node) {
        if ($(node).find('div').length <= 0) {
            $(node).wrapInner('<div />');
        }

        if ($(node).next().is('p')) {
            $(node).append('<div><br></div>');
        }
    });
};

//we use divs for paragraph so we dont need any p tags
WwPManager.prototype._unwrapPtags = function() {
    this.wwe.get$Body().find('div').each(function(index, node) {
        if ($(node).parent().is('p')) {
            $(node).unwrap();
        }
    });
};

module.exports = WwPManager;
