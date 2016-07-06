/**
 * @fileoverview Implements WwTextObject
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils');
var isIE11 = tui.util.browser.msie && tui.util.browser.version === 11;
var isWindowChrome = (navigator.appVersion.indexOf('Win') !== -1) && tui.util.browser.chrome;
var isNeedOffsetFix = isIE11 || isWindowChrome;

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

    //msie11 and window chrome can't make start offset of range api correctly when compositing korean.
    //so we need fix this when compositing korean.(and maybe other languages that needs composition.)
    if (isNeedOffsetFix) {
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

    if (this.isComposition) {
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

WwTextObject.prototype.peekStartBeforeOffset = function(offset) {
    var range = this._range.cloneRange();

    range.setStart(range.startContainer, Math.max(range.startOffset - offset, 0));
    range.setEnd(this._range.startContainer, this._range.startOffset);

    return range.cloneContents().textContent;
};

module.exports = WwTextObject;
