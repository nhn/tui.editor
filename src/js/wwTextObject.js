/**
 * @fileoverview Implements WwTextObject
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

/**
 * WwTextObject
 * @exports WwTextObject
 * @augments
 * @constructor
 * @class
 * @param {WysiwygEditor} wwe wysiwygEditor
 * @param {Range} range range object
 */
function WwTextObject(wwe, range) {
    this._wwe = wwe;

    this.setRange(range || this._wwe.getRange());
}

WwTextObject.prototype.setRange = function(range) {
    /*//텍스트를 입력받을 수 없는 상태인경우 처리
    if (range.collapsed && range.commonAncestorContainer.nodeType !== Node.TEXT_NODE) {
        //IE10 회피용
        //마지막노드 +1을 가르킨다 === undefined
        if (!range.startContainer.childNodes[range.startOffset]) {
            range.selectNodeContents(range.startContainer.lastChild);
        //일반 회피용
        } else if (range.startContainer.childNodes[range.startOffset].previousSibling) {
            range.selectNodeContents(range.startContainer.childNodes[range.startOffset].previousSibling);
        }

        range.setStart(range.endContainer, range.endOffset);
        range.collapse(true);
        console.log('range change', range.endContainer, range.endOffset);
    }
*/
    this._range = range;
};

WwTextObject.prototype.setEndBeforeRange = function(range) {
    this._range.setEnd(range.startContainer, range.startOffset);
};

WwTextObject.prototype.getTextContent = function() {
//    console.log('range change', this._range.startContainer, this._range.startOffset);
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
