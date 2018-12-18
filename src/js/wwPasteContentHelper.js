/**
 * @fileoverview Implements WwPasteContentHelper
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import domUtils from './domUtils';
import htmlSanitizer from './htmlSanitizer';

/**
 * Class WwPasteContentHelper
 */
class WwPasteContentHelper {
  /**
   * Creates an instance of WwPasteContentHelper.
   * @param {WysiwygEditor} wwe - wysiwygEditor instance
   * @memberof WwPasteContentHelper
   */
  constructor(wwe) {
    this.wwe = wwe;
  }

  /**
   * Process paste data before paste
   * @memberof WwPasteContentHelper
   * @param {jQuery} $container - clipboard container
   */
  preparePaste($container) {
    const range = this.wwe.getEditor().getSelection().cloneRange();
    const wwCodeblockManager = this.wwe.componentManager.getManager('codeblock');
    let firstBlockIsTaken = false;
    const $tempContainer = $('<div />');

    let nodeName, node, isPastingList;

    this._pasteFirstAid($container);

    const childNodes = util.toArray($container[0].childNodes);

    // prepare to paste as inline of first node if possible
    if (childNodes.length && childNodes[0].tagName === 'DIV') {
      $tempContainer.append(this._unwrapFragmentFirstChildForPasteAsInline(childNodes[0]));
      childNodes.shift();
    }

    while (childNodes.length) {
      [node] = childNodes;
      nodeName = domUtils.getNodeName(node);
      isPastingList = nodeName === 'LI' || nodeName === 'UL' || nodeName === 'OL';

      if (wwCodeblockManager.isInCodeBlock(range)) {
        $tempContainer.append(wwCodeblockManager.prepareToPasteOnCodeblock(childNodes));
      } else if (isPastingList) {
        $tempContainer.append(this._prepareToPasteList(childNodes, range, firstBlockIsTaken));
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
   * @memberof WwPasteContentHelper
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
   * @memberof WwPasteContentHelper
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
   * @memberof WwPasteContentHelper
   * @private
   * @param {jQuery} $container - clipboard container
   */
  _preElementAid($container) {
    const wwCodeblockManager = this.wwe.componentManager.getManager('codeblock');

    wwCodeblockManager.splitCodeblockToEachLine($container);
  }

  /**
   * Unwrap span children of document fragment with div element
   * @param {jQuery} $container - clipboard container
   * @memberof WwPasteContentHelper
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
   * @memberof WwPasteContentHelper
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
   * @memberof WwPasteContentHelper
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
   * @memberof WwPasteContentHelper
   * @private
   */
  _prepareToPasteList(nodes, rangeInfo, firstBlockIsTaken) {
    let nodeName = domUtils.getNodeName(nodes[0]);
    let node = nodes.shift();
    const newFragment = this.wwe.getEditor().getDocument().createDocumentFragment();

    // IE somethimes returns ul without li
    if (nodeName !== 'LI' && nodes.length && nodes[0].tagName === 'LI') {
      nodeName = 'LI';

      node = this._makeNodeAndAppend({
        tagName: nodeName
      }, node);
    }

    // pasting list into list, we should care indentation
    if (nodeName === 'OL' || nodeName === 'UL') {
      // ignore cursor if pasting data has block
      if (!firstBlockIsTaken && this.wwe.getEditor().hasFormat('LI')) {
        $(newFragment).append(this._wrapCurrentFormat(node));
      } else {
        $(newFragment).append(node);
      }
    } else if (nodeName === 'LI') {
      // handle list group
      const listGroup = this.wwe.getEditor().getDocument().createDocumentFragment();
      listGroup.appendChild(node);

      while (nodes.length && nodes[0].tagName === 'LI') {
        listGroup.appendChild(nodes.shift());
      }

      // pasting list into list, we should care indentation
      // ignore cursor if pasting data has block
      if (!firstBlockIsTaken && this.wwe.getEditor().hasFormat('LI')) {
        $(newFragment).append(this._wrapCurrentFormat(listGroup));
      } else if (rangeInfo
                && (rangeInfo.commonAncestorName === 'UL' || rangeInfo.commonAncestorName === 'OL')) {
        $(newFragment).append(this._makeNodeAndAppend({
          tagName: rangeInfo.commonAncestorName
        }, listGroup));
        // list from outside
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
   * @memberof WwPasteContentHelper
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

    // expand to pasting area
    this._eachCurrentPath(path => {
      if (path.tagName !== 'DIV') {
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
   * @memberof WwPasteContentHelper
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
   * @memberof WwPasteContentHelper
   * @private
   */
  _tableElementAid($container) {
    this._removeColgroup($container);
    this._completeTableIfNeed($container);
    this._updateTableIDClassName($container);
  }

  /**
   * Remove colgroup tag
   * @param {jQuery} $container - clipboard container
   * @memberof WwPasteContentHelper
   * @private
   **/
  _removeColgroup($container) {
    $container.find('colgroup').remove();
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

export default WwPasteContentHelper;
