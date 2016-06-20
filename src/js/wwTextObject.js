/**
 * @fileoverview Implements WwTextObject
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils');
var isIE11 = tui.util.browser.msie && tui.util.browser.version === 11;

/**
 * WwTextObject
 * @exports WwTextObject
 * @constructor
 * @class
 * @param {WysiwygEditor} wwe wysiwygEditor
 * @param {Range} range range object
 */
function WwTextObject(wwe, range) {
    this._wwe = wwe;

    if (isIE11) {
        this.isComposition = false;
        this._initCompositionEvent();
    }

    this.setRange(range || this._wwe.getRange());
}

WwTextObject.prototype._initCompositionEvent = function() {
    var self = this;

    this._wwe.getEditor().addEventListener('compositionstart', function() {
        self.isComposition = true;
    });

    this._wwe.getEditor().addEventListener('compositionend', function() {
        self.isComposition = false;
    });
};

WwTextObject.prototype.setRange = function(range) {
    if (this._range) {
        this._range.detach();
    }

    this._range = range;
};

WwTextObject.prototype.expandStartOffset = function() {
    var range = this._range;

    if (domUtils.isTextNode(range.startContainer) && range.startOffset > 0) {
        range.setStart(range.startContainer, range.startOffset - 1);
    }
};

WwTextObject.prototype.expandEndOffset = function() {
    var range = this._range;

    if (domUtils.isTextNode(range.endContainer) && range.endOffset < range.endContainer.nodeValue.length) {
        range.setEnd(range.endContainer, range.endOffset + 1);
    }
};

WwTextObject.prototype.setEndBeforeRange = function(range) {
    var offset = range.startOffset;

    //ie11에서는 컴포지션중인 단어는 offset에 포함하지 않는다.
    //그래서 포함시킴
    if (isIE11 && this.isComposition) {
        offset += 1;
    }

    this._range.setEnd(range.startContainer, offset);
};

WwTextObject.prototype.getTextContent = function() {
    return this._range.cloneContents().textContent;
};

WwTextObject.prototype.replaceContent = function(content) {
    this._wwe.getEditor().setSelection(this._range);
    this._wwe.getEditor().insertHTML(content);
    this._range = this._wwe.getRange();
};

WwTextObject.prototype.deleteContent = function() {
    this._wwe.getEditor().setSelection(this._range);
    this._wwe.getEditor().insertHTML('');
    this._range = this._wwe.getRange();
};

module.exports = WwTextObject;
