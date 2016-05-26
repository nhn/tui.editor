/**
 * @fileoverview Implements WwPasteContentHelper
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils');

var util = tui.util;

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
    var childNodes = util.toArray(pasteData.fragment.childNodes);
    var newFragment = this.wwe.getEditor().getDocument().createDocumentFragment();
    var firstBlockIsTaken = false;
    var nodeName, node;

    this._pasteFirstAid(childNodes);

    //prepare to paste as inline of first node if possible
    //앞부분의 인라인으로 붙일수 있느부분은 인라인으로 붙을수 있도록 처리
    if (childNodes.length && childNodes[0].tagName === 'DIV') {
        $(newFragment).append(this._unwrapFragmentFirstChildForPasteAsInline(childNodes[0]));
        childNodes.shift();
    }

    while (childNodes.length) {
        node = childNodes[0];
        nodeName = domUtils.getNodeName(node);

        if (this.wwe.getManager('codeblock').isInCodeBlock(range)) {
            newFragment.appendChild(this.wwe.getManager('codeblock').prepareToPasteOnCodeblock(childNodes));
        } else if (nodeName === 'LI' || nodeName === 'UL' || nodeName === 'OL') {
            newFragment.appendChild(this._prepareToPasteList(childNodes, pasteData.rangeInfo, firstBlockIsTaken));
            //첫번째 현재위치와 병합될 가능성이있는 컨텐츠가 만들어진경우는 이후 위치에 대한 정보가 필요없다
            firstBlockIsTaken = true;
        } else {
            $(newFragment).append(childNodes.shift());
        }
    }

    pasteData.fragment = newFragment;
};

WwPasteContentHelper.prototype._pasteFirstAid = function(nodes) {
    var self = this;

    $(nodes).find('iframe, script, br, select, form, button, .Apple-converted-space').remove();

    this._removeUnnecessaryBlocks(nodes);

    this._removeStyles(nodes);

    $(nodes).find('*').each(function() {
        self._removeStyles(this);
    });
};

WwPasteContentHelper.prototype._removeUnnecessaryBlocks = function(nodes) {
    var blocks;
    var blockTags = 'div, section, article, aside, nav, menus';

    blocks = $(nodes).find(blockTags);

    while (blocks.length) {
        $(blocks).replaceWith(function() {
            return $(this).html();
        });

        blocks = $(nodes).find(blockTags);
    }
};

WwPasteContentHelper.prototype._removeStyles = function(node) {
    var $node = $(node);
    var colorValue;

    if (domUtils.getNodeName($node[0]) !== 'SPAN') {
        $node.removeAttr('style');
    } else {
        colorValue = $node.css('color');
        $node.removeAttr('style');

        if (colorValue) {
            $node.css('color', colorValue);
        } else {
            $node.children().unwrap();
        }
    }
};

WwPasteContentHelper.prototype._prepareToPasteList = function(nodes, rangeInfo, firstBlockIsTaken) {
    var listGroup;
    var nodeName = domUtils.getNodeName(nodes[0]);
    var node = nodes.shift();
    var newFragment = this.wwe.getEditor().getDocument().createDocumentFragment();

    //IE에서는 LI-UL 구조에서 UL이 전체가 선택되었는데 LI를 포함하지 않고 UL만 넘어올때가 있다.
    if (nodeName !== 'LI' && nodes.length && nodes[0].tagName === 'LI') {
        nodeName = 'LI';

        node = this._makeNodeAndAppend({
            tagName: nodeName
        }, node);
    }

    //UL과 OL이고 리스트에 paste하는경우 뎊스처리
    if (nodeName === 'OL' || nodeName === 'UL') {
        //페이스트 데이터의 첫번째 블럭요소가 이미 만들어졌다면 커서의 위치에 대한 대응은 하지 않는다.
        if (!firstBlockIsTaken && this.wwe.getEditor().hasFormat('LI')) {
            $(newFragment).append(this._wrapCurrentFormat(node));
        } else {
            $(newFragment).append(node);
        }
    } else if (nodeName === 'LI') {
        //리스트 그룹처리
        listGroup = this.wwe.getEditor().getDocument().createDocumentFragment();
        listGroup.appendChild(node);

        while (nodes.length && nodes[0].tagName === 'LI') {
            listGroup.appendChild(nodes.shift());
        }

        //리스트에 붙는경우 뎊스 연결
        //페이스트 데이터의 첫번째 블럭요소가 이미 만들어졌다면 커서의 위치에 대한 대응은 하지 않는다.
        if (!firstBlockIsTaken && this.wwe.getEditor().hasFormat('LI')) {
            $(newFragment).append(this._wrapCurrentFormat(listGroup));
        //카피할당시의 정보가 있다면 해당 리스트로 만듬
        } else if (rangeInfo
                   && (rangeInfo.commonAncestorName === 'UL' || rangeInfo.commonAncestorName === 'OL')) {
            $(newFragment).append(this._makeNodeAndAppend({
                tagName: rangeInfo.commonAncestorName
            }, listGroup));
        //외부에서온 리스트
        } else {
            $(newFragment).append(this._makeNodeAndAppend({
                tagName: 'UL'
            }, listGroup));
        }
    }

    return newFragment;
};

WwPasteContentHelper.prototype._unwrapFragmentFirstChildForPasteAsInline = function(node) {
    $(node).find('br').remove();

    return node.childNodes;
};

WwPasteContentHelper.prototype._wrapCurrentFormat = function(nodes) {
    var self = this;
    var currentTagName;

    // 붙여질 뎊스에 맞게 확장
    this._eachCurrentPath(function(path) {
        if (path.tagName !== 'DIV') {
            // 프레그먼트 노드인경우와 한번이상 감싸진 노드임
            if (domUtils.isElemNode(nodes)) {
                currentTagName = nodes.tagName;
            } else {
                currentTagName = nodes.firstChild.tagName;
            }

            if (path.tagName !== currentTagName) {
                nodes = self._makeNodeAndAppend(path, nodes);
            }
        }
    });

    return nodes;
};

WwPasteContentHelper.prototype._eachCurrentPath = function(iteratee) {
    var paths = domUtils.getPath(this.wwe.getEditor().getSelection().startContainer, this.wwe.get$Body()[0]);
    var i;

    for (i = paths.length - 1; i > -1; i -= 1) {
        iteratee(paths[i]);
    }
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
