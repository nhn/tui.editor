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

    if (pasteData.rangeInfo && this._isNotAloneTextNode(pasteData.fragment)) {
        if (this.wwe.getManager('codeblock').isInCodeBlock(range)) {
            pasteData.fragment = this.wwe.getManager('codeblock').prepareToPasteOnCodeblockIfNeed(pasteData.fragment);
        } else if (this._isOrphanListItem(pasteData)) {
            pasteData.fragment = this._prepareOrphanList(pasteData.fragment, pasteData.rangeInfo);
        } else if (this._isStartWithDefaultBlock(pasteData.fragment)) {
            pasteData.fragment = this._makeFirstChildToTextNodeIfNeed(pasteData.fragment);
        }
    } else if (!this._isNotAloneTextNode(pasteData.fragment)) {
        console.log('외부 데이터 처리');
    }
};

WwPasteContentHelper.prototype._isOrphanListItem = function(pasteData) {
    var fragment = pasteData.fragment;
    var commonAncestorName = pasteData.rangeInfo.commonAncestorName;

    return domUtils.getNodeName(fragment.lastChild) === 'LI'
        || commonAncestorName === 'LI'
        || commonAncestorName === 'UL'
        || commonAncestorName === 'OL';
};

WwPasteContentHelper.prototype._eachCurrentPath = function(iteratee) {
    var paths = domUtils.getPath(this.wwe.getEditor().getSelection().startContainer, this.wwe.$editorContainerEl[0]);
    var i;

    for (i = paths.length - 1; i > -1; i -= 1) {
        iteratee(paths[i]);
    }
};

WwPasteContentHelper.prototype._prepareOrphanList = function(fragment, rangeInfo) {
    var self = this;
    var newFragment, currentTagName;

    // ie에서는 부분 선택된 첫번째 아이템이 LI가 벗겨진채로 올수 있다.
    if (domUtils.getNodeName(fragment.firstChild) !== 'LI') {
        $(fragment.firstChild).wrap('<li />');
    }

    if (this.wwe.getEditor().hasFormat('LI')) {
        newFragment = this.wwe.getEditor().getDocument().createDocumentFragment();

        this._unwrapFragmentFirstChildForPasteAsInlineIfNotLi(fragment, newFragment);

        // 붙여질 뎊스에 맞게 확장
        this._eachCurrentPath(function(path) {
            if (path.tagName !== 'DIV') {
                // 프레그먼트 노드인경우와 한번이상 감싸진 노드임
                if (domUtils.isElemNode(fragment)) {
                    currentTagName = fragment.tagName;
                } else {
                    currentTagName = fragment.firstChild.tagName;
                }

                if (fragment.childNodes.length > 1 || path.tagName !== currentTagName) {
                    fragment = self._makeNodeAndAppend(path, fragment);
                }
            }
        });

        $(newFragment).append(fragment);
        fragment = newFragment;
    } else {
        fragment = self._makeNodeAndAppend(rangeInfo.commonAncestorName, fragment);
    }

    return fragment;
};

WwPasteContentHelper.prototype._unwrapFragmentFirstChildForPasteAsInlineIfNotLi = function(fragment, newFragment) {
    var contentHolder;

    // 첫번째 li는 paste시 개행 하지 않고 해당 위치에 인라인형식으로 붙을수 있다면 붙인다.
    if (!$(fragment.firstChild).find('li').length) {
        $(fragment.firstChild).find('br').remove();

        if ($(fragment.firstChild).find('div').length) {
            contentHolder = $(fragment.firstChild).find('div')[0];
        } else {
            contentHolder = fragment.firstChild;
        }

        $(newFragment).append(contentHolder.childNodes);
        fragment.removeChild(fragment.firstChild);
    }
};

WwPasteContentHelper.prototype._isNotAloneTextNode = function(fragment) {
    return fragment.childNodes.length > 1 || !domUtils.isTextNode(fragment.firstChild);
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
 * @param {string} pathInfo tagName to make
 * @param {Node} content nodes to append
 * @returns {Node} node
 */
WwPasteContentHelper.prototype._makeNodeAndAppend = function(pathInfo, content) {
    var node = $('<' + pathInfo.tagName + '/>');

    node.append(content);

    if (pathInfo.id) {
        node.attr('id', pathInfo.id);
    }

    if (pathInfo.className) {
        node.addClass(pathInfo.className);
    }

    return node[0];
};

module.exports = WwPasteContentHelper;
