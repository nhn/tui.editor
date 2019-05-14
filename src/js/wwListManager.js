/**
 * @fileoverview Implements wysiwyg list manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import domUtils from './domUtils';

const FIND_LI_ELEMENT = /<li/i;
const DIV_OR_LI = 'DIV,LI';
const UL_OR_OL = 'OL,UL';
const FIND_TD_ELEMNT = /(<td[^>]*>)(.*?)(<\/td>)/g;
const FIND_UL_OR_OL_ELEMNT = /<(ul|ol)([^>]*)>(.*?)(<\/\1>)/g;

/**
 * Class WwListManager
 */
class WwListManager {
  /**
   * Creates an instance of WwListManager.
   * @param {WysiwygEditor} wwe - WysiwygEditor instance
   * @memberof WwListManager
   */
  constructor(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @memberof WwListManager#
     * @type {string}
     */
    this.name = 'list';

    this._init();
  }

  /**
   * _init
   * Initialize
   * @memberof WwListManager
   * @private
   */
  _init() {
    this._initEvent();
    this._initKeyHandler();
  }

  /**
   * _initEvent
   * Initialize event
   * @memberof WwListManager
   * @private
   */
  _initEvent() {
    this.eventManager.listen('wysiwygSetValueBefore', html => this._convertToArbitraryNestingList(html));

    this.eventManager.listen('wysiwygRangeChangeAfter', () => {
      this._findAndRemoveEmptyList();
      this._removeBranchListAll();
    });

    this.eventManager.listen('wysiwygSetValueAfter', () => {
      this._removeBranchListAll();
    });

    this.eventManager.listen('wysiwygProcessHTMLText', html => {
      html = this._insertBlankToBetweenSameList(html);
      html = this._convertFromArbitraryNestingList(html);

      return html;
    });

    this.eventManager.listen('convertorBeforeHtmlToMarkdownConverted',
      html => this._insertDataToMarkPassForListInTable(html));

    this.eventManager.listen('convertorAfterHtmlToMarkdownConverted',
      markdown => markdown.replace(/:BLANK_LINE:\n/g, ''));
  }

  _initKeyHandler() {
    this.wwe.addKeyEventHandler(['TAB', 'CTRL+]', 'META+]'], (ev) => {
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
        const $ul = $(range.startContainer).closest('li').children(UL_OR_OL);

        this.eventManager.emit('command', 'Outdent');

        if ($ul.length && !$ul.prev().length) {
          this._removeBranchList($ul);
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
            const $li = $(afterRange.startContainer).parents('li').eq(0);
            this._removeBranchListAll($li);
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
   * @memberof WwListManager
   * @private
   */
  _findAndRemoveEmptyList() {
    this.wwe.get$Body().find(UL_OR_OL).each((index, node) => {
      if (!(FIND_LI_ELEMENT.test(node.innerHTML))) {
        $(node).remove();
      }
    });
  }

  /**
   * Remove branch lists all from body
   * @memberof WwListManager
   * @private
   * @param {jQuery|HTMLElement} $root root to remove branch list
   */
  _removeBranchListAll($root) {
    $root = !$root ? this.wwe.get$Body() : $($root);

    $root.find('li ul, li ol').each((idx, node) => {
      if (!node || node.previousSibling) {
        return;
      }
      this._removeBranchList(node);
    });
  }

  /**
   * Remove branch list of passed list(ul, ol)
   * @memberof WwListManager
   * @param {HTMLElement} list list
   * @private
   */
  _removeBranchList(list) {
    const $list = $(list);
    let $branchRoot = $list;

    while (!$branchRoot[0].previousSibling
               && $branchRoot[0].parentElement.tagName.match(/UL|OL|LI/g)) {
      $branchRoot = $branchRoot.parent();
    }

    const $firstLi = $branchRoot.children('li').eq(0);

    $branchRoot.prepend($list.children().unwrap());

    $firstLi.remove();
  }

  _insertBlankToBetweenSameList(html) {
    return html.replace(/<\/(ul|ol)>(<br \/>|<br>){0,}<\1>/g, '</$1>:BLANK_LINE:<$1>');
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
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;

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
    const wrapperDiv = document.createElement('div');
    wrapperDiv.innerHTML = html;

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
    const replacedHtml = html.replace(FIND_TD_ELEMNT, (match, tdStart, tdContent, tdEnd) => {
      const content = tdContent.replace(FIND_UL_OR_OL_ELEMNT, '<$1 data-tomark-pass="" $2>$3$4');

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
      start = $(start).parents(DIV_OR_LI).first().get(0);
    }

    if (domUtils.isTextNode(end)) {
      end = $(end).parents(DIV_OR_LI).first().get(0);
    }

    for (let line = start; needNext; line = nextLine) {
      if ($(line).is(DIV_OR_LI)) {
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
    } else if ($(nextLine).is(UL_OR_OL)) {
      // we don't sure firstChild is LI. arbtrary list can have another ol/ul
      nextLine = nextLine.querySelector('li');
    }

    if ($(nextLine).is(DIV_OR_LI) || nextLine === end) {
      return nextLine;
    }

    return this._getNextLine(nextLine);
  }

  /**
   * merge to previous list
   * consider remove this function when https://github.com/neilj/Squire/issues/294 resolved
   * @param {HTMLLIElement} currentLine - current li element
   * @ignore
   */
  mergeList(currentLine) {
    let currentList = currentLine.parentNode;
    const prevList = currentList.previousElementSibling;
    const nextList = currentList.nextElementSibling;

    if (currentList.firstElementChild === currentLine) {
      if (prevList && $(prevList).is(UL_OR_OL)) {
        this._mergeList(currentList, prevList);
        currentList = prevList;
      }
    }

    if (currentList.lastElementChild === currentLine) {
      if (nextList && $(nextList).is(UL_OR_OL)) {
        this._mergeList(nextList, currentList);
      }
    }
  }

  /**
   * merge list to targetList
   * @param {HTMLOListElement|HTMLUListElement} list - list to merge
   * @param {HTMLOListElement|HTMLUListElement} targetList - target list
   * @ignore
   */
  _mergeList(list, targetList) {
    let listItem = list.firstElementChild;

    if (targetList && $(targetList).is(UL_OR_OL)) {
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
    const $selectedCells = selectionManager.getSelectedCells();
    const sq = this.wwe.getEditor();

    return $selectedCells.length === 0 && sq.hasFormat('table') && !sq.hasFormat('OL') && !sq.hasFormat('UL');
  }

  /**
   * Find parent node before TD
   * @param {Node} node - startContainer or endContainer of range
   * @param {Number} offset - offset
   * @returns {Node} - parent node before TD
   * @ignore
   */
  _getParentNodeBeforeTD(node, offset) {
    let parentNode = domUtils.getParentUntil(node, 'TD');

    if (!parentNode) {
      const {childNodes} = node;
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
   * @ignore
   */
  _findLINodeInsideTD(targetNode, offset) {
    let liNode = null;

    const liParent = domUtils.getParentUntilBy(targetNode, (node) => {
      return node && domUtils.isListNode(node);
    }, (node) => {
      return node && node.nodeName === 'TD';
    });

    if (liParent) {
      liNode = liParent;
    } else if (targetNode.nodeName === 'LI') {
      liNode = targetNode;
    } else if (domUtils.isListNode(targetNode)) {
      const {length: childLength} = targetNode.childNodes;
      liNode = targetNode.childNodes[offset >= childLength ? childLength - 1 : offset];
    }

    return liNode;
  }

  /**
   * Get first node on the line where range start.
   * @param {Node} targetNode - startContainer
   * @param {Number} offset - startOffset
   * @returns {Node} - first node where range start
   * @ignore
   */
  _getFirstNodeInLineOfTable(targetNode, offset) {
    let startNode = this._findLINodeInsideTD(targetNode, offset);

    if (!startNode) {
      startNode = this._getParentNodeBeforeTD(targetNode, offset);

      let {previousSibling} = startNode;
      while (previousSibling && previousSibling.nodeName !== 'BR' && !domUtils.isListNode(previousSibling)) {
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
   * @ignore
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
   * @ignore
   */
  _isLastNodeInLineOfTable(node) {
    const {nodeName} = node;

    return nodeName === 'LI' || nodeName === 'BR';
  }

  /**
   * Get next node in the line of table
   * If current node is li node and nextSibling is not existing, next node is parent's nextSibling.
   * If nextSibiling of node is a list node (UL or OL), next node is first child of the list node.
   * @param {node} node - node
   * @returns {node} - next node
   * @ignore
   */
  _getNextNodeInLineOfTable(node) {
    let {nextSibling} = node;

    if (node.nodeName === 'LI' && !nextSibling) {
      let {parentNode} = node;

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
   * @ignore
   */
  _getLinesOfSelectionInTable(range) {
    const {
      startContainer,
      endContainer,
      startOffset,
      endOffset
    } = range;
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
   * @ignore
   */
  _createListElement(listType) {
    return document.createElement(listType === 'TASK' ? 'UL' : listType);
  }

  /**
   * create li element
   * @param {array} oneLineNodes - node array
   * @param {string} listType - OL, UL or TASK
   * @returns {Node} - li element
   * @ignore
   */
  _createListItemElement(oneLineNodes, listType) {
    const liNode = document.createElement('li');

    oneLineNodes.forEach((node) => {
      liNode.appendChild(node);
    });

    if (listType === 'TASK') {
      const taskManager = this.wwe.componentManager.getManager('task');

      taskManager.formatTask(liNode);
    }

    return liNode;
  }

  _mergeListWithPreviousSibiling(node) {
    const {previousSibling} = node;
    let result = node;

    if (previousSibling && node.nodeName === previousSibling.nodeName) {
      this._mergeList(node, previousSibling);
      result = previousSibling;
    }

    return result;
  }

  _mergeListWithNextSibiling(node) {
    const {nextSibling} = node;

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
    const parentNode = lastNode.parentNode;

    let listNode = this._createListElement(listType);
    const {nodeName: listNodeName} = listNode;

    const newLIs = [];
    lines.forEach((oneLineNodes) => {
      const oneLineFirstNode = oneLineNodes[0];
      let liElement;

      // oneLineFirstNode was already a list item in the table
      if (oneLineFirstNode.nodeName === 'LI') {
        const existingListNode = oneLineFirstNode.parentNode;
        liElement = oneLineFirstNode;

        // If the existing list that is already in table is not same the list to be created,
        // change the existing list to the list to be created
        if (existingListNode.nodeName !== listNodeName) {
          const {childNodes} = existingListNode;

          util.forEachArray(childNodes, () => {
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
      ? startContainer : listNode[0];
    const newEndContainer = domUtils.containsNode(listNode[listNode.length - 1], endContainer)
      ? endContainer : listNode[listNode.length - 1];

    const newStartOffset = startContainer.nodeName === 'TD' ? 0 : startOffset;
    const newEndOffset = endContainer.nodeName === 'TD' ? 0 : endOffset;

    this.wwe.setSelectionByContainerAndOffset(newStartContainer, newStartOffset, newEndContainer, newEndOffset);
  }
}

export default WwListManager;
