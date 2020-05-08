/**
 * @fileoverview Implements wysiwyg list manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';
import matches from 'tui-code-snippet/domUtil/matches';

import domUtils from './utils/dom';

const FIND_LI_ELEMENT = /<li/i;
const DIV_OR_LI = 'DIV,LI';
const UL_OR_OL = 'OL,UL';
const FIND_CELL_TAG_RX = /(<(?:th|td)[^>]*>)(.*?)(<\/(?:th|td)>)/g;
const FIND_LIST_OR_LIST_ITEM_TAG_RX = /<(ul|ol|li)([^>]*)>/g;

/**
 * Class WwListManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */
class WwListManager {
  constructor(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @type {string}
     */
    this.name = 'list';

    this._init();
  }

  /**
   * Initialize
   * @private
   */
  _init() {
    this._initEvent();
    this._initKeyHandler();
  }

  /**
   * Initialize event
   * @private
   */
  _initEvent() {
    this.eventManager.listen('wysiwygSetValueBefore', html =>
      this._convertToArbitraryNestingList(html)
    );

    this.eventManager.listen('wysiwygRangeChangeAfter', () => {
      this._findAndRemoveEmptyList();
      this._removeBranchListAll();
    });

    this.eventManager.listen('wysiwygSetValueAfter', () => {
      this._removeBranchListAll();
    });

    this.eventManager.listen('wysiwygProcessHTMLText', html => {
      html = this._convertFromArbitraryNestingList(html);

      return html;
    });

    this.eventManager.listen('convertorBeforeHtmlToMarkdownConverted', html =>
      this._insertDataToMarkPassForListInTable(html)
    );
  }

  _initKeyHandler() {
    this.wwe.addKeyEventHandler(['TAB', 'CTRL+]', 'META+]'], ev => {
      let isNeedNext;

      if (this.wwe.getEditor().hasFormat('LI')) {
        ev.preventDefault();
        this.eventManager.emit('command', 'Indent');

        isNeedNext = false;
      }

      return isNeedNext;
    });

    this.wwe.addKeyEventHandler(['SHIFT+TAB', 'CTRL+[', 'META+['], (ev, range) => {
      let isNeedNext;

      if (this.wwe.getEditor().hasFormat('LI')) {
        ev.preventDefault();

        const ul = domUtils.children(domUtils.closest(range.startContainer, 'li'), UL_OR_OL);

        this.eventManager.emit('command', 'Outdent');

        if (ul.length && !ul.previousSibling) {
          this._removeBranchList(ul);
        }

        isNeedNext = false;
      }

      return isNeedNext;
    });

    this.wwe.addKeyEventHandler('ENTER', (ev, range) => {
      if (range.collapsed) {
        if (this.wwe.getEditor().hasFormat('LI')) {
          this.wwe.defer(() => {
            const afterRange = this.wwe.getRange();
            const [li] = domUtils.parents(afterRange.startContainer, 'li');

            this._removeBranchListAll(li);
          });
        }
      }
    });

    this.wwe.addKeyEventHandler('BACK_SPACE', (ev, range) => {
      if (range.collapsed) {
        if (this.wwe.getEditor().hasFormat('LI')) {
          this.wwe.defer(() => {
            this._removeBranchListAll();
          });
        }
      }
    });
  }

  /**
   * Find empty list for whole container and remove it.
   * @private
   */
  _findAndRemoveEmptyList() {
    domUtils.findAll(this.wwe.getBody(), UL_OR_OL).forEach(node => {
      if (!FIND_LI_ELEMENT.test(node.innerHTML)) {
        domUtils.remove(node);
      }
    });
  }

  /**
   * Remove branch lists all from body
   * @param {HTMLElement} root root to remove branch list
   * @private
   */
  _removeBranchListAll(root) {
    root = !root ? this.wwe.getBody() : root;

    domUtils.findAll(root, 'li > ul, li > ol').forEach(node => {
      if (!node || node.previousSibling) {
        return;
      }
      this._removeBranchList(node);
    });
  }

  /**
   * Remove branch list of passed list(ul, ol)
   * @param {HTMLElement} list list
   * @private
   */
  _removeBranchList(list) {
    let branchRoot = list;

    while (!branchRoot.previousSibling && branchRoot.parentElement.tagName.match(/UL|OL|LI/g)) {
      branchRoot = branchRoot.parentElement;
    }

    const [firstLi] = domUtils.children(branchRoot, 'li');
    const unwrappedLIs = domUtils.unwrap(list);

    domUtils.prepend(branchRoot, unwrappedLIs);
    domUtils.remove(firstLi);
  }

  /**
   * make arbitrary nesting list out of standard list
   * `<ul><li>text<ul><li>text2</li></ul></li></ul>` to
   * `<ul><li>text</li><ul><li>text2</li></ul></ul>`
   * @param {string} html string to convert
   * @returns {string} converted HTML text
   * @private
   */
  _convertToArbitraryNestingList(html) {
    const NESTED_LIST_QUERY = 'li > ul, li > ol';
    const wrapper = domUtils.createElementWith(`<div>${html}</div>`);

    let nestedList = wrapper.querySelector(NESTED_LIST_QUERY);

    while (nestedList !== null) {
      const parentLI = nestedList.parentNode;
      const parentList = parentLI.parentNode;

      parentList.insertBefore(nestedList, parentLI.nextElementSibling);

      nestedList = wrapper.querySelector(NESTED_LIST_QUERY);
    }

    return wrapper.innerHTML;
  }

  /**
   * make standard list out of arbitrary nesting list
   * `<ul><li>text<ul><li>text2</li></ul></li></ul>` from
   * `<ul><li>text</li><ul><li>text2</li></ul></ul>`
   * @param {string} html string to convert
   * @returns {string} converted HTML text
   * @private
   */
  _convertFromArbitraryNestingList(html) {
    const NESTED_LIST_QUERY = 'ol > ol, ol > ul, ul > ol, ul > ul';
    const wrapperDiv = domUtils.createElementWith(`<div>${html}</div>`);

    let nestedList = wrapperDiv.querySelector(NESTED_LIST_QUERY);

    while (nestedList !== null) {
      let prevLI = nestedList.previousElementSibling;

      while (prevLI && prevLI.tagName !== 'LI') {
        prevLI = prevLI.previousElementSibling;
      }

      if (prevLI) {
        prevLI.appendChild(nestedList);
      } else {
        this._unwrap(nestedList);
      }

      nestedList = wrapperDiv.querySelector(NESTED_LIST_QUERY);
    }

    return wrapperDiv.innerHTML;
  }

  /**
   * unwrap nesting list
   * @param {Node} nestedList - nested list to unwrap
   * @private
   */
  _unwrap(nestedList) {
    const fragment = document.createDocumentFragment();

    while (nestedList.firstChild) {
      fragment.appendChild(nestedList.firstChild);
    }
    nestedList.parentNode.replaceChild(fragment, nestedList);
  }

  _insertDataToMarkPassForListInTable(html) {
    const replacedHtml = html.replace(FIND_CELL_TAG_RX, (match, tdStart, tdContent, tdEnd) => {
      const content = tdContent.replace(
        FIND_LIST_OR_LIST_ITEM_TAG_RX,
        '<$1 data-tomark-pass="" $2>'
      );

      return `${tdStart}${content}${tdEnd}`;
    });

    return replacedHtml;
  }

  /**
   * Return lines in selection
   * @param {Node} start Start element
   * @param {Node} end End element
   * @param {HTMLElement} body Editor body element
   * @returns {Array.<HTMLElement>}
   * @private
   */
  getLinesOfSelection(start, end) {
    const lines = [];
    let isLastLine = false;
    let needNext = true;
    let nextLine;

    if (domUtils.isTextNode(start)) {
      [start] = domUtils.parents(start, DIV_OR_LI);
    }

    if (domUtils.isTextNode(end)) {
      [end] = domUtils.parents(end, DIV_OR_LI);
    }

    for (let line = start; needNext; line = nextLine) {
      if (matches(line, DIV_OR_LI)) {
        lines.push(line);

        if (line === end) {
          isLastLine = true;
        } else {
          nextLine = this._getNextLine(line, end);
        }
      } else {
        break;
      }
      needNext = nextLine && !isLastLine;
    }

    return lines;
  }

  /**
   * get next line
   * @param {Node} currentLine - current line node
   * @param {Node} end - last node in selection
   * @returns {Node} - next line node
   * @private
   */
  _getNextLine(currentLine, end) {
    let nextLine = currentLine.nextElementSibling;

    if (!nextLine) {
      // current line was the last line in ul/ol
      // while we have lines those has not been processed yet.
      nextLine = currentLine.parentNode.nextElementSibling;
    } else if (matches(nextLine, UL_OR_OL)) {
      // we don't sure firstChild is LI. arbtrary list can have another ol/ul
      nextLine = nextLine.querySelector('li');
    }

    if (matches(nextLine, DIV_OR_LI) || nextLine === end) {
      return nextLine;
    }

    return this._getNextLine(nextLine);
  }

  /**
   * merge to previous list
   * consider remove this function when https://github.com/neilj/Squire/issues/294 resolved
   * @param {HTMLLIElement} currentLine - current li element
   */
  mergeList(currentLine) {
    let currentList = currentLine.parentNode;
    const prevList = currentList.previousElementSibling;
    const nextList = currentList.nextElementSibling;

    if (currentList.firstElementChild === currentLine) {
      if (prevList && matches(prevList, UL_OR_OL)) {
        this._mergeList(currentList, prevList);
        currentList = prevList;
      }
    }

    if (currentList.lastElementChild === currentLine) {
      if (nextList && matches(nextList, UL_OR_OL)) {
        this._mergeList(nextList, currentList);
      }
    }
  }

  /**
   * merge list to targetList
   * @param {HTMLOListElement|HTMLUListElement} list - list to merge
   * @param {HTMLOListElement|HTMLUListElement} targetList - target list
   * @private
   */
  _mergeList(list, targetList) {
    let listItem = list.firstElementChild;

    if (targetList && matches(targetList, UL_OR_OL)) {
      while (listItem) {
        const temp = listItem.nextElementSibling;

        targetList.appendChild(listItem);
        listItem = temp;
      }

      list.parentNode.removeChild(list);
    }
  }

  /**
   * Check whether is available to make List in table.
   * @returns {boolean} - li element
   */
  isAvailableMakeListInTable() {
    const selectionManager = this.wwe.componentManager.getManager('tableSelection');
    const selectedCells = selectionManager.getSelectedCells();
    const sq = this.wwe.getEditor();

    return selectedCells && sq.hasFormat('table') && !sq.hasFormat('OL') && !sq.hasFormat('UL');
  }

  /**
   * Find parent node before TD
   * @param {Node} node - startContainer or endContainer of range
   * @param {Number} offset - offset
   * @returns {Node} - parent node before TD
   * @private
   */
  _getParentNodeBeforeTD(node, offset) {
    let parentNode = domUtils.getParentUntil(node, 'TD');

    if (!parentNode) {
      const { childNodes } = node;
      const length = childNodes ? childNodes.length : 0;
      const newOffset = offset > 0 && offset === length ? offset - 1 : offset;

      parentNode = domUtils.getChildNodeByOffset(node, newOffset);
    }

    return parentNode;
  }

  /**
   * Find LI node inside TD
   * If target node is not li and parents of taget node is not li, return null.
   * @param {Node} targetNode - startContainer or endContainer of range
   * @param {Number} offset - offset
   * @returns {Node} - LI node or null
   * @private
   */
  _findLINodeInsideTD(targetNode, offset) {
    let liNode = null;

    const liParent = domUtils.getParentUntilBy(
      targetNode,
      node => node && domUtils.isListNode(node),
      node => node && node.nodeName === 'TD'
    );

    if (liParent) {
      liNode = liParent;
    } else if (targetNode.nodeName === 'LI') {
      liNode = targetNode;
    } else if (domUtils.isListNode(targetNode)) {
      const { length: childLength } = targetNode.childNodes;

      liNode = targetNode.childNodes[offset >= childLength ? childLength - 1 : offset];
    }

    return liNode;
  }

  /**
   * Get first node on the line where range start.
   * @param {Node} targetNode - startContainer
   * @param {Number} offset - startOffset
   * @returns {Node} - first node where range start
   * @private
   */
  _getFirstNodeInLineOfTable(targetNode, offset) {
    let startNode = this._findLINodeInsideTD(targetNode, offset);

    if (!startNode) {
      startNode = this._getParentNodeBeforeTD(targetNode, offset);

      let { previousSibling } = startNode;

      while (
        previousSibling &&
        previousSibling.nodeName !== 'BR' &&
        !domUtils.isListNode(previousSibling)
      ) {
        startNode = previousSibling;
        previousSibling = startNode.previousSibling;
      }
    }

    return startNode;
  }

  /**
   * Get last node on the line where range end.
   * @param {Node} targetNode - endContainer
   * @param {Number} offset - endOffset
   * @returns {Node} - last node where range end
   * @private
   */
  _getLastNodeInLineOfTable(targetNode, offset) {
    let endNode = this._findLINodeInsideTD(targetNode, offset);

    if (!endNode) {
      endNode = this._getParentNodeBeforeTD(targetNode, offset);

      while (endNode.nextSibling) {
        if (endNode.nodeName === 'BR' || domUtils.isListNode(endNode)) {
          break;
        }

        endNode = endNode.nextSibling;
      }
    }

    return endNode;
  }

  /**
   * Check whether node is last node in the line of table
   * If the node is li or br, the node is last node in the line of table.
   * @param {node} node - node
   * @returns {boolean} - whether node is last node in line of table
   * @private
   */
  _isLastNodeInLineOfTable(node) {
    const { nodeName } = node;

    return nodeName === 'LI' || nodeName === 'BR';
  }

  /**
   * Get next node in the line of table
   * If current node is li node and nextSibling is not existing, next node is parent's nextSibling.
   * If nextSibiling of node is a list node (UL or OL), next node is first child of the list node.
   * @param {node} node - node
   * @returns {node} - next node
   * @private
   */
  _getNextNodeInLineOfTable(node) {
    let { nextSibling } = node;

    if (node.nodeName === 'LI' && !nextSibling) {
      let { parentNode } = node;

      while (parentNode.nodeName !== 'TD') {
        if (parentNode.nextSibling) {
          nextSibling = parentNode.nextSibling;
          break;
        }

        parentNode = parentNode.parentNode;
      }
    } else if (domUtils.isListNode(nextSibling)) {
      nextSibling = nextSibling.firstChild;
    }

    return nextSibling;
  }

  /**
   * get nodes in each lines of table
   * @param {range} range - range
   * @returns {array} - each nodes in line
   * @private
   */
  _getLinesOfSelectionInTable(range) {
    const { startContainer, endContainer, startOffset, endOffset } = range;
    let firstNode = this._getFirstNodeInLineOfTable(startContainer, startOffset);
    const lastNode = this._getLastNodeInLineOfTable(endContainer, endOffset);

    const lines = [];
    let oneLine = [];

    while (firstNode) {
      oneLine.push(firstNode);

      if (this._isLastNodeInLineOfTable(firstNode)) {
        lines.push(oneLine);
        oneLine = [];
      }

      if (firstNode === lastNode) {
        if (oneLine.length) {
          lines.push(oneLine);
        }
        break;
      }

      firstNode = this._getNextNodeInLineOfTable(firstNode);
    }

    return lines;
  }

  /**
   * create OL or UL element
   * @param {string} listType - OL, UL or TASK
   * @returns {Node} - OL or UL element
   * @private
   */
  _createListElement(listType) {
    return document.createElement(listType === 'TASK' ? 'UL' : listType);
  }

  /**
   * create li element
   * @param {array} oneLineNodes - node array
   * @param {string} listType - OL, UL or TASK
   * @returns {Node} - li element
   * @private
   */
  _createListItemElement(oneLineNodes, listType) {
    const liNode = document.createElement('li');

    oneLineNodes.forEach(node => {
      liNode.appendChild(node);
    });

    if (listType === 'TASK') {
      const taskManager = this.wwe.componentManager.getManager('task');

      taskManager.formatTask(liNode);
    }

    return liNode;
  }

  _mergeListWithPreviousSibiling(node) {
    const { previousSibling } = node;
    let result = node;

    if (previousSibling && node.nodeName === previousSibling.nodeName) {
      this._mergeList(node, previousSibling);
      result = previousSibling;
    }

    return result;
  }

  _mergeListWithNextSibiling(node) {
    const { nextSibling } = node;

    if (nextSibling && node.nodeName === nextSibling.nodeName) {
      this._mergeList(nextSibling, node);
    }

    return node;
  }

  /**
   * make listNode (OL or UL)
   * @param {range} range - range
   * @param {staring} listType - UL, OL, TASK
   * @returns {array} childNodes of list node (OL/UL)
   */
  createListInTable(range, listType) {
    const lines = this._getLinesOfSelectionInTable(range);

    const lastLine = lines[lines.length - 1];
    const lastNode = lastLine[lastLine.length - 1];
    const nextNode = lastNode.nextSibling;
    const { parentNode } = lastNode;

    let listNode = this._createListElement(listType);
    const { nodeName: listNodeName } = listNode;

    const newLIs = [];

    lines.forEach(oneLineNodes => {
      const [oneLineFirstNode] = oneLineNodes;
      let liElement;

      // oneLineFirstNode was already a list item in the table
      if (oneLineFirstNode.nodeName === 'LI') {
        const existingListNode = oneLineFirstNode.parentNode;

        liElement = oneLineFirstNode;

        // If the existing list that is already in table is not same the list to be created,
        // change the existing list to the list to be created
        if (existingListNode.nodeName !== listNodeName) {
          const { childNodes } = existingListNode;

          toArray(childNodes).forEach(() => {
            listNode.appendChild(existingListNode.firstChild);
          });

          existingListNode.parentNode.replaceChild(listNode, existingListNode);
        }

        listNode = liElement.parentNode;
      } else {
        liElement = this._createListItemElement(oneLineNodes, listType);
        listNode.appendChild(liElement);
      }

      newLIs.push(liElement);
    });

    if (!listNode.parentNode) {
      parentNode.insertBefore(listNode, nextNode);
    }

    listNode = this._mergeListWithPreviousSibiling(listNode);
    this._mergeListWithNextSibiling(listNode);

    return newLIs;
  }

  /**
   * adjust range for list node (OL/UL)
   * according to origin startContainer and endContainer
   * @param {node} startContainer - startContainer
   * @param {node} endContainer - endContainer
   * @param {number} startOffset - startOffset
   * @param {number} endOffset - endOffset
   * @param {array} listNode - node array
   */
  adjustRange(startContainer, endContainer, startOffset, endOffset, listNode) {
    const newStartContainer = domUtils.containsNode(listNode[0], startContainer)
      ? startContainer
      : listNode[0];
    const newEndContainer = domUtils.containsNode(listNode[listNode.length - 1], endContainer)
      ? endContainer
      : listNode[listNode.length - 1];

    const newStartOffset = startContainer.nodeName === 'TD' ? 0 : startOffset;
    const newEndOffset = endContainer.nodeName === 'TD' ? 0 : endOffset;

    this.wwe.setSelectionByContainerAndOffset(
      newStartContainer,
      newStartOffset,
      newEndContainer,
      newEndOffset
    );
  }
}

export default WwListManager;
