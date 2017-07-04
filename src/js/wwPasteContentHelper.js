/**
 * @fileoverview Implements WwPasteContentHelper
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import domUtils from './domUtils';
import htmlSanitizer from './htmlSanitizer';

const {util} = tui;

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
     * @param {jQuery} $container - clipboard container
     */
    preparePaste($container) {
        const range = this.wwe.getEditor().getSelection().cloneRange();
        const codeblockManager = this.wwe.componentManager.getManager('codeblock');
        let firstBlockIsTaken = false;
        const $tempContainer = $('<div />');

        let nodeName, node, isPastingList;

        this._pasteFirstAid($container);

        const childNodes = util.toArray($container[0].childNodes);

        // prepare to paste as inline of first node if possible
        // 앞부분의 인라인으로 붙일수 있느부분은 인라인으로 붙을수 있도록 처리
        if (childNodes.length && childNodes[0].tagName === 'DIV') {
            $tempContainer.append(this._unwrapFragmentFirstChildForPasteAsInline(childNodes[0]));
            childNodes.shift();
        }

        while (childNodes.length) {
            [node] = childNodes;
            nodeName = domUtils.getNodeName(node);
            isPastingList = nodeName === 'LI' || nodeName === 'UL' || nodeName === 'OL';

            if (codeblockManager.isInCodeBlock(range)) {
                $tempContainer.append(codeblockManager.prepareToPasteOnCodeblock(childNodes));
            } else if (isPastingList) {
                $tempContainer.append(this._prepareToPasteList(childNodes, range, firstBlockIsTaken));
                // 첫번째 현재위치와 병합될 가능성이있는 컨텐츠가 만들어진경우는 이후 위치에 대한 정보가 필요없다
                firstBlockIsTaken = true;
            } else {
                $tempContainer.append(childNodes.shift());
            }
        }

        $container.html($tempContainer.html());
    }

    /**
     * Wrap orphan node(inline, text) with div element
     * @param {jQuery} $container - clipboard container
     * @memberOf WwPasteContentHelper
     * @returns {DocumentFragment}
     * @private
     */
    _wrapOrphanNodeWithDiv($container) {
        const $tempContainer = $('<div />');
        const array = util.toArray($container[0].childNodes);
        let currentDiv;

        util.forEachArray(array, node => {
            const isTextNode = node.nodeType === 3;
            /* eslint-disable max-len */
            const isInlineNode = /^(SPAN|A|CODE|EM|I|STRONG|B|S|ABBR|ACRONYM|CITE|DFN|KBD|SAMP|VAR|BDO|Q|SUB|SUP)$/ig.test(node.tagName);
            /* eslint-enable max-len */

            if (isTextNode || isInlineNode) {
                if (!currentDiv) {
                    currentDiv = document.createElement('div');
                    $tempContainer.append(currentDiv);
                    // newFrag.appendChild(currentDiv);
                }

                currentDiv.appendChild(node);
            } else {
                if (currentDiv && currentDiv.lastChild.tagName !== 'BR') {
                    currentDiv.appendChild($('<br/>')[0]);
                }

                currentDiv = null;
                $tempContainer.append(node);
                // newFrag.appendChild(node);
            }
        });

        return $tempContainer.html();
    }

    /**
     * Processing paste data after paste
     * @param {jQuery} $container - clipboard container
     * @memberOf WwPasteContentHelper
     * @private
     */
    _pasteFirstAid($container) {
        const blockTags = 'div, section, article, aside, nav, menus, p';

        $container.html(htmlSanitizer($container.html(), true));

        $container.find('*').each((i, node) => {
            this._removeStyles(node);
        });

        this._unwrapIfNonBlockElementHasBr($container);
        this._unwrapNestedBlocks($container, blockTags);
        this._removeUnnecessaryBlocks($container, blockTags);

        $container.html(this._wrapOrphanNodeWithDiv($container));

        this._preElementAid($container);

        this._tableElementAid($container);

        $container.children('br').remove();
    }

    /**
     * PRE tag formatting
     * @memberOf WwPasteContentHelper
     * @private
     * @param {jQuery} $container - clipboard container
     */
    _preElementAid($container) {
        const codeblockManager = this.wwe.componentManager.getManager('codeblock');

        codeblockManager.splitCodeblockToEachLine($container);
    }

    /**
     * Unwrap span children of document fragment with div element
     * @param {jQuery} $container - clipboard container
     * @memberOf WwPasteContentHelper
     * @private
     */
    _unwrapIfNonBlockElementHasBr($container) {
        const nonBlockElements = $container.find('span, a, b, em, i, s');

        nonBlockElements.each((i, node) => {
            const brChildren = $(node).children('br');

            if (brChildren.length && node.nodeName !== 'LI' && node.nodeName !== 'UL') {
                brChildren.eq(0).unwrap();
            }
        });
    }

    /**
     * Unwrap nested block elements
     * @param {jQuery} $container - clipboard container
     * @param {string} blockTags - Tag names of block tag
     * @private
     */
    _unwrapNestedBlocks($container, blockTags) {
        const $leafElements = $container.find(':not(:has(*))').not('b,s,i,em,code,span');

        $leafElements.each((i, node) => {
            let leafElement = node.nodeName === 'BR' ? $(node.parentNode) : $(node);

            while (leafElement.parents(blockTags).length) {
                const $parent = leafElement.parent(blockTags);

                if ($parent.length && $parent[0] !== $container[0]) {
                    leafElement.unwrap();
                } else {
                    leafElement = leafElement.parent();
                }
            }
        });
    }

    /**
     * Remove unnecessary block element in pasting data
     * @param {jQuery} $container - clipboard container
     * @param {string} blockTags - Tag names of block tag
     * @memberOf WwPasteContentHelper
     * @private
     */
    _removeUnnecessaryBlocks($container, blockTags) {
        $container.find(blockTags).each((index, blockElement) => {
            const $blockElement = $(blockElement);
            const {tagName} = blockElement;
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
     * @param {jQuery} $container - clipboard container
     * @memberOf WwPasteContentHelper
     * @private
     */
    _tableElementAid($container) {
        this._completeTableIfNeed($container);
        this._updateTableIDClassName($container);
    }

    /**
     * Complete and append table to fragment
     * @param {jQuery} $container - clipboard container
     * @private
     */
    _completeTableIfNeed($container) {
        const tableManager = this.wwe.componentManager.getManager('table');
        const wrapperTr = tableManager.wrapDanglingTableCellsIntoTrIfNeed($container);

        if (wrapperTr) {
            $container.append(wrapperTr);
        }

        const wrapperTbody = tableManager.wrapTrsIntoTbodyIfNeed($container);

        if (wrapperTbody) {
            $container.append(wrapperTbody);
        }

        const wrapperTable = tableManager.wrapTheadAndTbodyIntoTableIfNeed($container);

        if (wrapperTable) {
            $container.append(wrapperTable);
        }
    }

    /**
     * Update table ID class name in fragment
     * @param {jQuery} $container - clipboard container
     * @private
     */
    _updateTableIDClassName($container) {
        const tableManager = this.wwe.componentManager.getManager('table');

        $container.find('table').each((index, table) => {
            $(table).removeClass((idx, className) =>
                className.replace(/.*\s*(te-content-table-\d+)\s*.*/, '$1'));
        });

        $container.find('table').each((index, table) => {
            $(table).addClass(tableManager.getTableIDClassName());
        });
    }
}

module.exports = WwPasteContentHelper;
