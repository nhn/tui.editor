/**
 * @fileoverview Implements WwPasteContentHelper
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';
import css from 'tui-code-snippet/domUtil/css';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';
import matches from 'tui-code-snippet/domUtil/matches';

import domUtils from './utils/dom';
import defaultSanitizer from './htmlSanitizer';

const DEFAULT_COLOR = 'rgb(34, 34, 34)';

/**
 * Class WwPasteContentHelper
 * @param {WysiwygEditor} wwe - wysiwygEditor instance
 * @ignore
 */
class WwPasteContentHelper {
  constructor(wwe) {
    this.wwe = wwe;
  }

  /**
   * Process paste data before paste
   * @param {HTMLElement} container - clipboard container
   */
  preparePaste(container) {
    const range = this.wwe
      .getEditor()
      .getSelection()
      .cloneRange();
    const wwCodeblockManager = this.wwe.componentManager.getManager('codeblock');
    let firstBlockIsTaken = false;
    const tempContainer = document.createElement('div');

    let nodeName, node, isPastingList;

    this._pasteFirstAid(container);

    const childNodes = toArray(container.childNodes);

    while (childNodes.length) {
      [node] = childNodes;
      nodeName = domUtils.getNodeName(node);
      isPastingList = nodeName === 'LI' || nodeName === 'UL' || nodeName === 'OL';

      if (wwCodeblockManager.isInCodeBlock(range)) {
        domUtils.append(tempContainer, wwCodeblockManager.prepareToPasteOnCodeblock(childNodes));
      } else if (isPastingList) {
        domUtils.append(
          tempContainer,
          this._prepareToPasteList(childNodes, range, firstBlockIsTaken)
        );
        firstBlockIsTaken = true;
      } else {
        domUtils.append(tempContainer, childNodes.shift());
      }
    }

    container.innerHTML = tempContainer.innerHTML;
  }

  /**
   * Wrap orphan node(inline, text) with div element
   * @param {HTMLElement} container - clipboard container
   * @returns {DocumentFragment}
   * @private
   */
  _wrapOrphanNodeWithDiv(container) {
    const tempContainer = document.createElement('div');
    let currentDiv;

    toArray(container.childNodes).forEach(node => {
      const isTextNode = node.nodeType === 3;
      /* eslint-disable max-len */
      const isInlineNode = /^(SPAN|A|CODE|EM|I|STRONG|B|S|U|ABBR|ACRONYM|CITE|DFN|KBD|SAMP|VAR|BDO|Q|SUB|SUP)$/gi.test(
        node.tagName
      );
      const isBR = node.nodeName === 'BR';
      /* eslint-enable max-len */

      if (isTextNode || isInlineNode || isBR) {
        if (!currentDiv) {
          currentDiv = document.createElement('div');
          tempContainer.appendChild(currentDiv);
        }

        currentDiv.appendChild(node);

        if (isBR) {
          currentDiv = null;
        }
      } else {
        if (currentDiv && currentDiv.lastChild.tagName !== 'BR') {
          currentDiv.appendChild(document.createElement('br'));
        }

        currentDiv = null;
        tempContainer.appendChild(node);
      }
    });

    return tempContainer.innerHTML;
  }

  /**
   * Sanitize content of element
   * @param {HTMLElement} container - root element of content to sanitize
   * @private
   */
  _sanitizeHtml(container) {
    const sanitizer = this.wwe.getSanitizer();

    let html = defaultSanitizer(container.innerHTML, true);

    if (sanitizer && sanitizer !== defaultSanitizer) {
      html = sanitizer(html);
    }

    container.innerHTML = html;
  }

  /**
   * Processing paste data after paste
   * @param {HTMLElement} container - clipboard container
   * @private
   */
  _pasteFirstAid(container) {
    this._sanitizeHtml(container);

    domUtils.findAll(container, '*').forEach(node => {
      this._removeStyles(node);
    });

    const blockTags = 'div, section, article, aside, nav, menus, p';

    this._unwrapIfNonBlockElementHasBr(container);
    this._unwrapNestedBlocks(container, blockTags);
    this._removeUnnecessaryBlocks(container, blockTags);

    container.innerHTML = this._wrapOrphanNodeWithDiv(container);

    this._preElementAid(container);

    this._tableElementAid(container);

    toArray(container.children).forEach(childNode => {
      if (domUtils.getNodeName(childNode) === 'BR') {
        domUtils.remove(childNode);
      }
    });
  }

  /**
   * PRE tag formatting
   * @param {HTMLElement} container - clipboard container
   * @private
   */
  _preElementAid(container) {
    const wwCodeblockManager = this.wwe.componentManager.getManager('codeblock');

    wwCodeblockManager.modifyCodeBlockForWysiwyg(container);
  }

  /**
   * Unwrap span children of document fragment with div element
   * @param {HTMLElement} container - clipboard container
   * @private
   */
  _unwrapIfNonBlockElementHasBr(container) {
    const nonBlockElements = domUtils.findAll(container, 'span, a, b, em, i, s');

    nonBlockElements.forEach(node => {
      const brChildren = domUtils.children(node, 'br');

      if (brChildren.length && node.nodeName !== 'LI' && node.nodeName !== 'UL') {
        domUtils.unwrap(node);
      }
    });
  }

  /**
   * Unwrap nested block elements
   * @param {HTMLElement} container - clipboard container
   * @param {string} blockTags - Tag names of block tag
   * @private
   */
  _unwrapNestedBlocks(container, blockTags) {
    const leafElements = domUtils
      .findAll(container, '*')
      .filter(node => !matches(node, 'b,s,i,em,code,span,hr') && !node.firstChild);

    leafElements.forEach(node => {
      let leafElement = node.nodeName === 'BR' ? node.parentNode : node;

      while (domUtils.parents(leafElement, blockTags).length) {
        const parent = domUtils.parent(leafElement, blockTags);

        if (parent && parent !== container) {
          domUtils.unwrap(parent);
        } else {
          leafElement = leafElement.parentElement;
        }
      }
    });
  }

  /**
   * Remove unnecessary block element in pasting data
   * @param {HTMLElement} container - clipboard container
   * @param {string} blockTags - Tag names of block tag
   * @private
   */
  _removeUnnecessaryBlocks(container, blockTags) {
    domUtils.findAll(container, blockTags).forEach(blockElement => {
      const { tagName } = blockElement;
      const isDivElement = tagName === 'DIV';
      const isInListItem = !!domUtils.parent(blockElement, 'li');
      const isInBlockquote = !!domUtils.parent(blockElement, 'blockquote');
      const hasBlockChildElement = !!domUtils.children(blockElement, blockTags).length;

      if (isDivElement && (isInListItem || isInBlockquote || !hasBlockChildElement)) {
        return;
      }

      if (blockElement.lastChild && blockElement.lastChild.nodeName !== 'BR') {
        blockElement.appendChild(document.createElement('br'));
      }

      domUtils.replaceWith(blockElement, blockElement.innerHTML);
    });
  }

  /**
   * Remove inline style
   * @param {Node} node Node for remove style attribute
   * @private
   */
  _removeStyles(node) {
    let colorValue;

    if (domUtils.getNodeName(node) !== 'SPAN') {
      node.removeAttribute('style');
    } else {
      // Most browser return computed color value even if without style attribute
      if (node.getAttribute('style')) {
        colorValue = node.style.color;
      }

      node.removeAttribute('style');

      if (colorValue && colorValue !== DEFAULT_COLOR) {
        css(node, { color: colorValue });
      } else {
        domUtils.unwrap(node);
      }
    }
  }

  /**
   * Processing before paste list
   * @param {Array.<HTMLElement>} nodes Pasting data
   * @param {object} rangeInfo Range information
   * @param {boolean} firstBlockIsTaken Whether first block element taken or not
   * @returns {DocumentFragment}
   * @private
   */
  _prepareToPasteList(nodes, rangeInfo, firstBlockIsTaken) {
    let nodeName = domUtils.getNodeName(nodes[0]);
    let node = nodes.shift();
    const newFragment = this.wwe
      .getEditor()
      .getDocument()
      .createDocumentFragment();

    // IE somethimes returns ul without li
    if (nodeName !== 'LI' && nodes.length && nodes[0].tagName === 'LI') {
      nodeName = 'LI';

      node = this._makeNodeAndAppend(
        {
          tagName: nodeName
        },
        node
      );
    }

    // pasting list into list, we should care indentation
    if (nodeName === 'OL' || nodeName === 'UL') {
      // ignore cursor if pasting data has block
      if (!firstBlockIsTaken && this.wwe.getEditor().hasFormat('LI')) {
        domUtils.append(newFragment, this._wrapCurrentFormat(node));
      } else {
        newFragment.appendChild(node);
      }
    } else if (nodeName === 'LI') {
      // handle list group
      const listGroup = this.wwe
        .getEditor()
        .getDocument()
        .createDocumentFragment();

      listGroup.appendChild(node);

      while (nodes.length && nodes[0].tagName === 'LI') {
        listGroup.appendChild(nodes.shift());
      }

      // pasting list into list, we should care indentation
      // ignore cursor if pasting data has block
      if (!firstBlockIsTaken && this.wwe.getEditor().hasFormat('LI')) {
        domUtils.append(newFragment, this._wrapCurrentFormat(listGroup));
      } else if (
        rangeInfo &&
        (rangeInfo.commonAncestorName === 'UL' || rangeInfo.commonAncestorName === 'OL')
      ) {
        domUtils.append(
          newFragment,
          this._makeNodeAndAppend(
            {
              tagName: rangeInfo.commonAncestorName
            },
            listGroup
          )
        );
        // list from outside
      } else {
        domUtils.append(
          newFragment,
          this._makeNodeAndAppend(
            {
              tagName: 'UL'
            },
            listGroup
          )
        );
      }
    }

    return newFragment;
  }

  /**
   * Unwrap fragment first child for pasting node inline
   * @param {Node} node Pasting DocumentFragment
   * @returns {NodeList}
   * @private
   */
  _unwrapFragmentFirstChildForPasteAsInline(node) {
    domUtils.findAll(node, 'br').forEach(br => domUtils.remove(br));

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
    const paths = domUtils.getPath(
      this.wwe.getEditor().getSelection().startContainer,
      this.wwe.getBody()
    );

    for (let i = paths.length - 1; i > -1; i -= 1) {
      iteratee(paths[i]);
    }
  }

  /** _makeNodeAndAppend
   * make node and append their own children
   * @param {HTMLElement} pathInfo HTMLElement to make
   * @param {HTMLElement} content Nodes to append
   * @returns {HTMLElement} node
   * @private
   */
  _makeNodeAndAppend(pathInfo, content) {
    const node = document.createElement(`${pathInfo.tagName}`);

    node.appendChild(content);

    if (pathInfo.id) {
      node.setAttribute('id', pathInfo.id);
    }

    if (pathInfo.className) {
      addClass(node, pathInfo.className);
    }

    return node;
  }

  /**
   * Pasting table element pre-process
   * @param {HTMLElement} container - clipboard container
   * @private
   */
  _tableElementAid(container) {
    this._removeColgroup(container);
    this._completeTableIfNeed(container);
    this._updateTableIDClassName(container);
  }

  /**
   * Remove colgroup tag
   * @param {HTMLElement} container - clipboard container
   * @private
   **/
  _removeColgroup(container) {
    const colgroup = container.querySelector('colgroup');

    if (colgroup) {
      domUtils.remove(colgroup);
    }
  }

  /**
   * Complete and append table to fragment
   * @param {HTMLElement} container - clipboard container
   * @private
   */
  _completeTableIfNeed(container) {
    const tableManager = this.wwe.componentManager.getManager('table');
    const wrapperTr = tableManager.wrapDanglingTableCellsIntoTrIfNeed(container);

    if (wrapperTr) {
      domUtils.append(container, wrapperTr);
    }

    const wrapperTbody = tableManager.wrapTrsIntoTbodyIfNeed(container);

    if (wrapperTbody) {
      domUtils.append(container, wrapperTbody);
    }

    const wrapperTable = tableManager.wrapTheadAndTbodyIntoTableIfNeed(container);

    if (wrapperTable) {
      domUtils.append(container, wrapperTable);
    }
  }

  /**
   * Update table ID class name in fragment
   * @param {HTMLElement} container - clipboard container
   * @private
   */
  _updateTableIDClassName(container) {
    const tableManager = this.wwe.componentManager.getManager('table');

    const tables = domUtils.findAll(container, 'table');

    tables.forEach(table => {
      const foundClassName = table.className.match(/.*\s*(te-content-table-\d+)\s*.*/);

      if (foundClassName) {
        removeClass(table, foundClassName[0]);
      }
    });

    tables.forEach(table => {
      addClass(table, tableManager.getTableIDClassName());
    });
  }
}

export default WwPasteContentHelper;
