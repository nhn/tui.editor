/**
 * @fileoverview Implements WwPasteContentHelper
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


import domUtils from './domUtils';
import htmlSanitizer from './htmlSanitizer';

const util = tui.util;

/**
 * WwPasteContentHelper
 * @exports WwPasteContentHelper
 * @class WwPasteContentHelper
 * @constructor
 * @param {WysiwygEditor} wwe wysiwygEditor instance
 */
class WwPasteContentHelper {
    constructor(wwe) {
        this.wwe = wwe;
    }

    /**
     * Process paste data before paste
     * @api
     * @memberOf WwPasteContentHelper
     * @param {object} pasteData Pasting data
     */
    preparePaste(pasteData) {
        const range = this.wwe.getEditor().getSelection().cloneRange();
        const codeblockManager = this.wwe.getManager('codeblock');
        const tableManager = this.wwe.getManager('table');
        let firstBlockIsTaken = false;
        let newFragment = this.wwe.getEditor().getDocument().createDocumentFragment();
        let nodeName, node, isPastingList;

        pasteData.fragment = this._pasteFirstAid(pasteData.fragment);

        const childNodes = util.toArray(pasteData.fragment.childNodes);

        // prepare to paste as inline of first node if possible
        // 앞부분의 인라인으로 붙일수 있느부분은 인라인으로 붙을수 있도록 처리
        if (childNodes.length && childNodes[0].tagName === 'DIV') {
            $(newFragment).append(this._unwrapFragmentFirstChildForPasteAsInline(childNodes[0]));
            childNodes.shift();
        }

        while (childNodes.length) {
            node = childNodes[0];
            nodeName = domUtils.getNodeName(node);
            isPastingList = nodeName === 'LI' || nodeName === 'UL' || nodeName === 'OL';

            if (codeblockManager.isInCodeBlock(range)) {
                newFragment.appendChild(codeblockManager.prepareToPasteOnCodeblock(childNodes));
            } else if (tableManager.isInTable(range)) {
                newFragment = tableManager.prepareToPasteOnTable(pasteData, node);
                childNodes.shift();
            } else if (isPastingList) {
                newFragment.appendChild(this._prepareToPasteList(childNodes, pasteData.rangeInfo, firstBlockIsTaken));
                // 첫번째 현재위치와 병합될 가능성이있는 컨텐츠가 만들어진경우는 이후 위치에 대한 정보가 필요없다
                firstBlockIsTaken = true;
            } else {
                newFragment.appendChild(childNodes.shift());
            }
        }

        pasteData.fragment = newFragment;
    }

    /**
     * Wrap textNodes with div element
     * @param {DocumentFragment} fragment - Fragment of paste data
     * @memberOf WwPasteContentHelper
     * @private
     */
    _wrapTextNodeWithDiv(fragment) {
        const array = util.toArray(fragment.childNodes);

        util.forEachArray(array, node => {
            const isTextNode = node.nodeType === 3;

            if (isTextNode) {
                const divElement = document.createElement('div');

                divElement.textContent = node.nodeValue;
                divElement.appendChild($('<br/>')[0]);

                fragment.replaceChild(divElement, node);
            }
        });
    }

    /**
     * Processing paste data after paste
     * @param {DocumentFragment} fragment Pasting data
     * @memberOf WwPasteContentHelper
     * @returns {DocumentFragment}
     * @private
     */
    _pasteFirstAid(fragment) {
        const blockTags = 'div, section, article, aside, nav, menus, p';

        fragment = htmlSanitizer(fragment);

        $(fragment).find('*').each((i, node) => {
            this._removeStyles(node);
        });

        this._unwrapIfNonBlockElementHasBr(fragment);
        this._unwrapNestedBlocks(fragment, blockTags);

        this._removeUnnecessaryBlocks(fragment, blockTags);
        this._removeStyles(fragment);

        this._wrapTextNodeWithDiv(fragment);

        this._preElementAid(fragment);

        this._tableElementAid(fragment);

        $(fragment).children('br').remove();

        return fragment;
    }

    /**
     * PRE tag formatting
     * @memberOf WwPasteContentHelper
     * @private
     * @param {DocumentFragment} nodes Pasting DocumentFragment
     */
    _preElementAid(nodes) {
        const codeblockManager = this.wwe.getManager('codeblock');

        codeblockManager.splitCodeblockToEachLine(nodes);
    }

    /**
     * Unwrap span children of document fragment with div element
     * @param {DocumentFragment} fragment - Fragment of paste data
     * @memberOf WwPasteContentHelper
     * @private
     */
    _unwrapIfNonBlockElementHasBr(fragment) {
        const nonBlockElements = $(fragment).find('span, a, b, em, i, s');

        nonBlockElements.each((i, node) => {
            const brChildren = $(node).children('br');

            if (brChildren.length && node.nodeName !== 'LI' && node.nodeName !== 'UL') {
                brChildren.eq(0).unwrap();
            }
        });
    }

    /**
     * Unwrap nested block elements
     * @param {DocumentFragment} fragment - Fragment of paste data
     * @param {string} blockTags - Tag names of block tag
     * @private
     */
    _unwrapNestedBlocks(fragment, blockTags) {
        const leafElements = $(fragment).find(':not(:has(*))').not('b,s,i,em,code');

        leafElements.each((i, node) => {
            let leafElement = node.nodeName === 'BR' ? $(node.parentNode) : $(this);
            let parent;

            while (leafElement.parents(blockTags).length) {
                parent = leafElement.parent(blockTags);

                if (parent.length) {
                    leafElement.unwrap();
                } else {
                    leafElement = leafElement.parent();
                }
            }
        });
    }

    /**
     * Remove unnecessary block element in pasting data
     * @param {DocumentFragment} fragment Pasting DocumentFragment
     * @param {string} blockTags - Tag names of block tag
     * @memberOf WwPasteContentHelper
     * @private
     */
    _removeUnnecessaryBlocks(fragment, blockTags) {
        $(fragment).find(blockTags).each((index, blockElement) => {
            const $blockElement = $(blockElement);
            const tagName = blockElement.tagName;
            const isDivElement = tagName === 'DIV';
            const isInListItem = $blockElement.parent('li').length !== 0;
            const isInBlockquote = $blockElement.parent('blockquote').length !== 0;
            const hasBlockChildElement = $blockElement.children(blockTags).length;

            if (isDivElement
                && (isInListItem || isInBlockquote || !hasBlockChildElement)
            ) {
                return;
            }

            $blockElement.replaceWith($blockElement.html());
        });
    }

    /**
     * Remove inline style
     * @param {Node} node Node for remove style attribute
     * @memberOf WwPasteContentHelper
     * @private
     */
    _removeStyles(node) {
        const $node = $(node);
        let colorValue;

        if (domUtils.getNodeName($node[0]) !== 'SPAN') {
            $node.removeAttr('style');
        } else {
            // Most browser return computed color value even if without style attribute
            if ($node.attr('style')) {
                colorValue = $node.css('color');
            }

            $node.removeAttr('style');

            if (colorValue) {
                $node.css('color', colorValue);
            } else {
                $node.contents().unwrap();
            }
        }
    }

    /**
     * Processing before paste list
     * @param {Array.<HTMLElement>} nodes Pasting data
     * @param {object} rangeInfo Range information
     * @param {boolean} firstBlockIsTaken Whether first block element taken or not
     * @returns {DocumentFragment}
     * @memberOf WwPasteContentHelper
     * @private
     */
    _prepareToPasteList(nodes, rangeInfo, firstBlockIsTaken) {
        let nodeName = domUtils.getNodeName(nodes[0]);
        let node = nodes.shift();
        const newFragment = this.wwe.getEditor().getDocument().createDocumentFragment();

        // IE에서는 LI-UL 구조에서 UL이 전체가 선택되었는데 LI를 포함하지 않고 UL만 넘어올때가 있다.
        if (nodeName !== 'LI' && nodes.length && nodes[0].tagName === 'LI') {
            nodeName = 'LI';

            node = this._makeNodeAndAppend({
                tagName: nodeName
            }, node);
        }

        // UL과 OL이고 리스트에 paste하는경우 뎊스처리
        if (nodeName === 'OL' || nodeName === 'UL') {
            // 페이스트 데이터의 첫번째 블럭요소가 이미 만들어졌다면 커서의 위치에 대한 대응은 하지 않는다.
            if (!firstBlockIsTaken && this.wwe.getEditor().hasFormat('LI')) {
                $(newFragment).append(this._wrapCurrentFormat(node));
            } else {
                $(newFragment).append(node);
            }
        } else if (nodeName === 'LI') {
            // 리스트 그룹처리
            const listGroup = this.wwe.getEditor().getDocument().createDocumentFragment();
            listGroup.appendChild(node);

            while (nodes.length && nodes[0].tagName === 'LI') {
                listGroup.appendChild(nodes.shift());
            }

            // 리스트에 붙는경우 뎊스 연결
            // 페이스트 데이터의 첫번째 블럭요소가 이미 만들어졌다면 커서의 위치에 대한 대응은 하지 않는다.
            if (!firstBlockIsTaken && this.wwe.getEditor().hasFormat('LI')) {
                $(newFragment).append(this._wrapCurrentFormat(listGroup));
                // 카피할당시의 정보가 있다면 해당 리스트로 만듬
            } else if (rangeInfo
                && (rangeInfo.commonAncestorName === 'UL' || rangeInfo.commonAncestorName === 'OL')) {
                $(newFragment).append(this._makeNodeAndAppend({
                    tagName: rangeInfo.commonAncestorName
                }, listGroup));
                // 외부에서온 리스트
            } else {
                $(newFragment).append(this._makeNodeAndAppend({
                    tagName: 'UL'
                }, listGroup));
            }
        }

        return newFragment;
    }

    /**
     * Unwrap fragment first child for pasting node inline
     * @memberOf WwPasteContentHelper
     * @private
     * @param {Node} node Pasting DocumentFragment
     * @returns {NodeList}
     */
    _unwrapFragmentFirstChildForPasteAsInline(node) {
        $(node).find('br').remove();

        return node.childNodes;
    }

    /**
     * Wrap nodes with current format
     * @param {DocumentFragment} nodes P
     * @returns {HTMLElement}
     * @private
     */
    _wrapCurrentFormat(nodes) {
        let currentTagName;

        // 붙여질 뎊스에 맞게 확장
        this._eachCurrentPath(path => {
            if (path.tagName !== 'DIV') {
                // 프레그먼트 노드인경우와 한번이상 감싸진 노드임
                if (domUtils.isElemNode(nodes)) {
                    currentTagName = nodes.tagName;
                } else {
                    currentTagName = nodes.firstChild.tagName;
                }

                if (path.tagName !== currentTagName) {
                    nodes = this._makeNodeAndAppend(path, nodes);
                }
            }
        });

        return nodes;
    }

    _eachCurrentPath(iteratee) {
        const paths = domUtils.getPath(this.wwe.getEditor().getSelection().startContainer, this.wwe.get$Body()[0]);

        for (let i = paths.length - 1; i > -1; i -= 1) {
            iteratee(paths[i]);
        }
    }

    /** _makeNodeAndAppend
     * make node and append their own children
     * @param {HTMLElement} pathInfo HTMLElement to make
     * @param {HTMLElement} content Nodes to append
     * @returns {HTMLElement} node
     * @memberOf WwPasteContentHelper
     * @private
     */
    _makeNodeAndAppend(pathInfo, content) {
        const node = $(`<${pathInfo.tagName}/>`);

        node.append(content);

        if (pathInfo.id) {
            node.attr('id', pathInfo.id);
        }

        if (pathInfo.className) {
            node.addClass(pathInfo.className);
        }

        return node[0];
    }

    /**
     * Pasting table element pre-process
     * @param {DocumentFragment} fragment pasteData's fragment
     * @memberOf WwPasteContentHelper
     * @private
     */
    _tableElementAid(fragment) {
        const tableManager = this.wwe.getManager('table');
        const wrapperTr = tableManager.wrapDanglingTableCellsIntoTrIfNeed(fragment);

        if (wrapperTr) {
            $(fragment).append(wrapperTr);
        }
        const wrapperTbody = tableManager.wrapTrsIntoTbodyIfNeed(fragment);
        if (wrapperTbody) {
            $(fragment).append(wrapperTbody);
        }
        const wrapperTable = tableManager.wrapTheadAndTbodyIntoTableIfNeed(fragment);
        if (wrapperTable) {
            $(wrapperTable).addClass(tableManager.getTableIDClassName());
            $(fragment).append(wrapperTable);
        }
    }
}

module.exports = WwPasteContentHelper;
