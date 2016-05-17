/**
 * @fileoverview Implements WwPasteContentHelper
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils');

/**
 * WwPasteContentHelper
 * @exports WwPasteContentHelper
 * @augments
 * @constructor
 * @class
 * @param {WysiwygEditor} wwe wysiwygEditor instance
 */
function WwPasteContentHelper(wwe) {
    this.wwe = wwe;
}

WwPasteContentHelper.prototype.preparePaste = function(pasteData) {
    var range = this.wwe.getEditor().getSelection().cloneRange();

    if (pasteData.fragment.childNodes.length > 1 || !domUtils.isTextNode(pasteData.fragment.firstChild)) {
        if (this.wwe.getManager('codeblock').isInCodeBlock(range)) {
            pasteData.fragment = this.wwe.getManager('codeblock').prepareToPasteOnCodeblockIfNeed(pasteData.fragment);
        } else if (this._isOrphanListItem(pasteData.fragment)) {
            pasteData.fragment = this._prepareOrphanList(pasteData.fragment, pasteData.rangeInfo);
        } else if (this._isStartWithDefaultBlock(pasteData.fragment)) {
            pasteData.fragment = this._makeFirstChildToTextNodeIfNeed(pasteData.fragment);
        }
    }
};

WwPasteContentHelper.prototype._isOrphanListItem = function(fragment) {
    return domUtils.getNodeName(fragment.lastChild) === 'LI';
};

WwPasteContentHelper.prototype._prepareOrphanList = function(fragment, rangeInfo) {
    var li;
    var listTypeToApply = 'UL';
    var range = this.wwe.getEditor().getSelection().cloneRange();

    // ie에서는 부분 선택된 첫번째 아이템이 LI가 벗겨진채로 올수 있다.
    if (domUtils.getNodeName(fragment.firstChild) !== 'LI') {
        $(fragment.firstChild).wrap('<li />');
    }

    if (this.wwe.getEditor().hasFormat('LI')) {
        li = $(range.endContainer).closest('li');
        listTypeToApply = li[0].parentNode.tagName;
    } else if (rangeInfo) {
        listTypeToApply = rangeInfo.commonAncestorName;
    }

    return this._makeNodeAndAppend(listTypeToApply, fragment)[0];
};

/**
 * _makeFirstChildToTextNodeIfNeed
 * Make firstchild of fragment into textnode
 * @param {DocumentFragment} frag fragment
 * @returns {DocumentFragment} result fragment
 */
WwPasteContentHelper.prototype._makeFirstChildToTextNodeIfNeed = function(frag) {
    var newFirstChild;

    newFirstChild = this.wwe.getEditor().getDocument().createTextNode(frag.firstChild.textContent);
    $(frag).find('*').first().remove();
    $(frag).prepend(newFirstChild);

    return frag;
};

/**
 * _isStartWithPartialTextNode
 * check if start is partial textnode
 * @param {DocumentFragment} frag fragment to paste
 * @returns {boolean} result
 */
WwPasteContentHelper.prototype._isStartWithDefaultBlock = function(frag) {
    return domUtils.isElemNode(frag.firstChild) && domUtils.getNodeName(frag.firstChild) === 'DIV';
};

/* _makeNodeAndAppend
 * make node and append childs
 * @param {string} tagName tagName to make
 * @param {Node} content nodes to append
 * @returns {Node} node
 */
WwPasteContentHelper.prototype._makeNodeAndAppend = function(tagName, content) {
    var node = $('<' + tagName + '/>');
    node.append(content);

    return node;
};

module.exports = WwPasteContentHelper;
