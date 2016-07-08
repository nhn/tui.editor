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
 * @class WwPasteContentHelper
 * @constructor
 * @param {WysiwygEditor} wwe wysiwygEditor instance
 */
function WwPasteContentHelper(wwe) {
    this.wwe = wwe;
}

/**
 * Process paste data before paste
 * @api
 * @memberOf WwPasteContentHelper
 * @param {object} pasteData Pasting data
 */
WwPasteContentHelper.prototype.preparePaste = function(pasteData) {
    var range = this.wwe.getEditor().getSelection().cloneRange();
    var newFragment = this.wwe.getEditor().getDocument().createDocumentFragment();
    var firstBlockIsTaken = false;
    var nodeName, node, childNodes;

    this._pasteFirstAid(pasteData.fragment);

    childNodes = util.toArray(pasteData.fragment.childNodes);

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

/**
 * Wrap textNodes with div element
 * @param {DocumentFragment} fragment - Fragment of paste data
 * @memberOf WwPasteContentHelper
 * @private
 */
WwPasteContentHelper.prototype._wrapTextNodeWithDiv = function(fragment) {
    var array = util.toArray(fragment.childNodes);

    util.forEachArray(array, function(node) {
        var divElement;
        var isTextNode = node.nodeType === 3;

        if (isTextNode) {
            divElement = document.createElement('div');

            divElement.innerHTML = node.nodeValue + '<br>';

            fragment.replaceChild(divElement, node);
        }
    });
};

/**
 * Processing paste data after paste
 * @param {DocumentFragment} fragment Pasting data
 * @memberOf WwPasteContentHelper
 * @private
 */
WwPasteContentHelper.prototype._pasteFirstAid = function(fragment) {
    var self = this;

    $(fragment).find('iframe, script, select, form, button, .Apple-converted-space').remove();

    this._removeUnnecessaryBlocks(fragment);
    this._removeStyles(fragment);

    this._wrapTextNodeWithDiv(fragment);

    this._preElementAid(fragment);

    //br은 preElemnetAid에서 필요해서 처리후 불필요한 br은 삭제한다.
    $(fragment).find('br').remove();

    $(fragment).find('*').each(function() {
        self._removeStyles(this);
    });
};

/**
 * PRE tag formatting
 * @memberOf WwPasteContentHelper
 * @private
 * @param {DocumentFragment} nodes Pasting DocumentFragment
 */
WwPasteContentHelper.prototype._preElementAid = function(nodes) {
    var textLines;

    $(nodes).find('PRE').each(function(index, pre) {
        //코드태그가 있으면 코드단위로 라인 구분
        if ($(pre).has('code').length) {
            textLines = [];

            $(pre).find('code').each(function() {
                textLines.push($(this).text().replace(/\n/g, ''));
            });
            //코드태그가 없으면 개행단위로 라인 구분
        } else {
            $(pre).find('br').replaceWith('\n');
            textLines = $(pre).text().split(/\n/g);
        }

        $(pre).empty();

        textLines.forEach(function(line) {
            var lineDom = $('<div><code /><br/></div>');

            lineDom.find('code').text(line);
            $(pre).append(lineDom);
        });
    });
};

/**
 * Remove unnecessary block element in pasting data
 * @param {DocumentFragment} nodes Pasting DocumentFragment
 * @memberOf WwPasteContentHelper
 * @private
 */
WwPasteContentHelper.prototype._removeUnnecessaryBlocks = function(nodes) {
    var blockTags = 'div, section, article, aside, nav, menus';
    var blocks = $(nodes).find(blockTags);

    blocks.each(function(index, blockElement) {
        var $blockElement = $(blockElement);
        var isDivInListItem = $blockElement.parent('li').length !== 0 && blockElement.tagName === 'DIV';

        if (isDivInListItem) {
            return;
        }

        $blockElement.replaceWith(function() {
            return $(this).html();
        });
    });
};

/**
 * Remove inline style
 * @param {Node} node Node for remove style attribute
 * @memberOf WwPasteContentHelper
 * @private
 */
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

/**
 * Processing before paste list
 * @param {Array.<HTMLElement>} nodes Pasting data
 * @param {object} rangeInfo Range information
 * @param {boolean} firstBlockIsTaken Whether first block element taken or not
 * @returns {DocumentFragment}
 * @memberOf WwPasteContentHelper
 * @private
 */
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

/**
 * Unwrap fragment first child for pasting node inline
 * @memberOf WwPasteContentHelper
 * @private
 * @param {Node} node Pasting DocumentFragment
 * @returns {NodeList}
 */
WwPasteContentHelper.prototype._unwrapFragmentFirstChildForPasteAsInline = function(node) {
    $(node).find('br').remove();

    return node.childNodes;
};

/**
 * Wrap nodes with current format
 * @param {DocumentFragment} nodes P
 * @returns {HTMLElement}
 * @private
 */
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

/** _makeNodeAndAppend
 * make node and append their own children
 * @param {HTMLElement} pathInfo HTMLElement to make
 * @param {HTMLElement} content Nodes to append
 * @returns {HTMLElement} node
 * @memberOf WwPasteContentHelper
 * @private
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
