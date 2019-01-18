/**
 * @fileoverview Paste helper when past to table
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import util from 'tui-code-snippet';
import domUtils from './domUtils';
import htmlSanitizer from './htmlSanitizer';

/**
 * Class WwTablePasteHelper
 */
class WwTablePasteHelper {
  /**
   * Creates an instance of WwTablePasteHelper.
   * @param {WysiwygEditor} wwe - WysiwygEditor instance
   * @param {WwTableManager} tableManager - WwTableManager or WwMergedTableManager
   * @memberof WwTablePasteHelper
   */
  constructor(wwe) {
    this.wwe = wwe;
  }

  /**
   * Prossse paste clipboardEvent
   * @param {ClipboardEvent} ev - ClipboardEvent
   * @private
   */
  pasteClipboard(ev) {
    const cbData = ev.clipboardData || window.clipboardData;
    const items = cbData && cbData.items;

    if (items) {
      this._pasteClipboardItem(items);
      ev.preventDefault();
    } else {
      this._pasteClipboardUsingPasteArea();
      ev.squirePrevented = true;
    }
  }

  /**
   * ClipboardEvent is not supported in IE.
   * To get clipboard, create temporay dom element and then paste into that dom element.
   * After end of paste, can get clipboard from that temporary dom element.
   * @param {ClipboardEvent} ev - ClipboardEvent
   * @private
   */
  _pasteClipboardUsingPasteArea() {
    const sq = this.wwe.getEditor();
    const range = sq.getSelection();
    const {startContainer, startOffset, endContainer, endOffset} = range;
    const pasteArea = document.createElement('div');

    pasteArea.setAttribute('contenteditable', true);
    pasteArea.setAttribute('style', 'position:fixed; overflow:hidden; top:0; right:100%; width:1px; height:1px;');
    document.body.appendChild(pasteArea);

    range.selectNodeContents(pasteArea);
    sq.setSelection(range);

    setTimeout(() => {
      const clipboard = document.body.removeChild(pasteArea);

      range.setStart(startContainer, startOffset);
      range.setEnd(endContainer, endOffset);

      sq.focus();
      sq.setSelection(range);

      this._pasteClipboardHtml(clipboard.innerHTML);
    });
  }

  /**
   * Paste items of clipboard data
   * @param {DataTransfer.items} items - items of clipboarddata
   * @private
   */
  _pasteClipboardItem(items) {
    let textItem = null;
    let htmlItem = null;

    for (let i = 0; i < items.length; i += 1) {
      if (items[i].type === 'text/html') {
        htmlItem = items[i];
      } else if (items[i].type === 'text/plain') {
        textItem = items[i];
      }
    }

    if (htmlItem) {
      htmlItem.getAsString(html => {
        this._pasteClipboardHtml(html);
      });
    } else if (textItem) {
      textItem.getAsString(text => {
        this._pasteClipboardContainer(document.createTextNode(text));
      });
    }
  }

  /**
   * Paste html of clipboard
   * @param {string} html - html
   * @private
   */
  _pasteClipboardHtml(html) {
    const container = document.createDocumentFragment();

    container.appendChild(htmlSanitizer(html));
    this._pasteClipboardContainer(container);
  }

  /**
   * Paste container of clipboard
   * @param {DocumentFragment} clipboardContainer - clipboard
   * @private
   */
  _pasteClipboardContainer(clipboardContainer) {
    const sq = this.wwe.getEditor();
    const {childNodes} = clipboardContainer;
    const containsOneTableOnly = (childNodes.length === 1 && childNodes[0].nodeName === 'TABLE');

    if (containsOneTableOnly) {
      const tableManager = this.wwe.componentManager.getManager('table');
      tableManager.pasteTableData(clipboardContainer);
    } else {
      const range = sq.getSelection().cloneRange();
      const fragment = this._getPasteDocumentFragment(clipboardContainer);

      sq.saveUndoState(range);

      if (!range.collapsed) {
        this._deleteContentsRange(range);
      }

      if (domUtils.isTextNode(range.startContainer)) {
        this._pasteIntoTextNode(range, fragment);
      } else {
        this._pasteIntoElements(range, fragment);
      }

      sq.setSelection(range);
    }
  }

  /**
   * Prepare clipboard for paste to table
   * @memberof WwTablePasteHelper
   * @param {DocumentFragment} clipboardContainer - clipboard
   * @returns {DocumentFragment} processed result
   * @private
   */
  _getPasteDocumentFragment(clipboardContainer) {
    const {childNodes} = clipboardContainer;
    const fragment = document.createDocumentFragment();

    if (childNodes.length) {
      fragment.appendChild(this._unwrapBlock(clipboardContainer));
    } else if (this._isPossibleInsertToTable(clipboardContainer)) {
      fragment.appendChild(clipboardContainer);
    }

    return fragment;
  }

  /**
   * unwrap block node
   * @memberof WwTablePasteHelper
   * @param {Node} node - target node
   * @returns {DocumentFragment} processed result
   * @private
   */
  _unwrapBlock(node) {
    const fragment = document.createDocumentFragment();
    const childNodes = util.toArray(node.childNodes);

    while (childNodes.length) {
      let child = childNodes.shift();

      if (this._isPossibleInsertToTable(child)) {
        fragment.appendChild(child);
      } else {
        fragment.appendChild(this._unwrapBlock(child));
        // If current child is last or fragment already has last br,
        // appending br would create unintended line break.
        if (childNodes.length && fragment.lastChild.nodeName !== 'BR') {
          fragment.appendChild(document.createElement('br'));
        }
      }
    }

    return fragment;
  }

  _isPossibleInsertToTable(node) {
    let result = false;

    if (domUtils.isMDSupportInlineNode(node) || domUtils.isTextNode(node)) {
      result = true;
    }

    // 'code' is able to paste into table,
    // but if 'code' has children, 'code' should be unwrap.
    if (node.nodeName === 'CODE' && node.childNodes.length > 1) {
      result = false;
    }

    return result;
  }

  /**
   * paste fragment to offset of range.startContainer
   * @memberof WwTablePasteHelper
   * @param {Range} range - selection range
   * @param {DocumentFragment} fragment - paste data
   * @private
   */
  _pasteIntoElements(range, fragment) {
    const {startContainer: container, startOffset: offset} = range;
    const node = domUtils.getChildNodeByOffset(container, offset);

    if (!node) {
      // For example when container is br, br don't have child, so node is null
      if (container.nodeName === 'TD') {
        container.appendChild(fragment);
        range.setStart(container, container.childNodes.length);
      } else {
        const {parentNode, nextSibling} = container;

        parentNode.insertBefore(fragment, nextSibling);

        if (nextSibling) {
          range.setStart(nextSibling, 0);
        } else {
          range.setStartAfter(parentNode.lastChild);
        }
      }
    } else {
      container.insertBefore(fragment, node);
      range.setStart(node, 0);
    }

    range.collapse(true);
  }

  /**
   * paste fragment to offset of container that is text node
   * @memberof WwTablePasteHelper
   * @param {Range} range - selection range
   * @param {DocumentFragment} fragment - paste data
   * @private
   */
  _pasteIntoTextNode(range, fragment) {
    const {startContainer: container, startOffset: offset} = range;
    const {parentNode, textContent} = container;
    const length = textContent.length;
    const prevText = textContent.slice(0, offset);
    const postText = textContent.slice(offset, length);

    if (prevText === '') {
      parentNode.insertBefore(fragment, container);
      range.setStart(container, 0);
    } else if (postText === '') {
      const {nextSibling} = container;
      parentNode.insertBefore(fragment, nextSibling);
      range.setStartAfter(nextSibling);
    } else if (fragment.childNodes.length === 1 && domUtils.isTextNode(fragment.childNodes[0])) {
      container.textContent = `${prevText}${fragment.childNodes[0].textContent}${postText}`;
      range.setStart(container, prevText.length + fragment.childNodes[0].textContent.length);
    } else {
      const resultFragment = document.createDocumentFragment();
      resultFragment.appendChild(document.createTextNode(prevText));
      resultFragment.appendChild(fragment);
      resultFragment.appendChild(document.createTextNode(postText));
      parentNode.replaceChild(resultFragment, container);

      const childNodesArray = util.toArray(parentNode.childNodes);
      let index = 0;
      childNodesArray.forEach((child, i) => {
        if (child.textContent === postText) {
          index = i;
        }
      });

      range.setStart(parentNode.childNodes[index], 0);
    }

    range.collapse(true);
  }

  /**
   * delete contents of range that is not collapse
   * @memberof WwTablePasteHelper
   * @param {Range} range - range is not collapse
   * @private
   */
  _deleteContentsRange(range) {
    const {startContainer, startOffset, endContainer, endOffset} = range;

    if (startContainer === endContainer) {
      this._deleteContentsOffset(startContainer, startOffset, endOffset);
      range.setStart(startContainer, startOffset);
      range.collapse(true);
    } else {
      this._deleteContentsNotCollapsedRange(range);
    }
  }

  _deleteContentsNotCollapsedRange(range) {
    const {startContainer, startOffset, endContainer, endOffset} = range;
    const common = range.commonAncestorContainer;
    const startBlock = this._getBlock(startContainer, common, startOffset);
    let endBlock = this._getBlock(endContainer, common, endOffset - 1);

    if (startBlock === endBlock) {
      endBlock = this._removeInSameBlock(startBlock, startContainer, endContainer, startOffset, endOffset);
    } else {
      let {nextSibling: nextOfstartBlock} = startBlock;

      if (startContainer.nodeName === 'TD') {
        nextOfstartBlock = this._removeOneLine(startBlock);
      } else {
        // Remove child nodes from node of startOffset in startContainer.
        this._deleteContentsOffset(startContainer, startOffset, domUtils.getOffsetLength(startContainer));

        // Remove nodes from startContainer in startBlock
        this._removeNodesByDirection(startBlock, startContainer, false);
      }

      if (endContainer.nodeName === 'TD') {
        endBlock = this._removeOneLine(endBlock);
      } else {
        // Remove child nodes until node of endOffset in endContainer.
        this._deleteContentsOffset(endContainer, 0, endOffset);

        // Remove nodes until endContainer in endBlock
        this._removeNodesByDirection(endBlock, endContainer, true);
      }

      // Remove nodes between startBlock and endBlock
      this._removeChild(common, nextOfstartBlock, endBlock);
    }

    if (endBlock) {
      range.setStart(endBlock, 0);
    } else {
      range.setStartAfter(startBlock);
    }

    range.collapse(true);
  }

  _removeInSameBlock(block, startContainer, endContainer, startOffset, endOffset) {
    const start = startContainer === block ? startOffset : 0;
    const end = endContainer === block ? endOffset : domUtils.getOffsetLength(block);

    this._deleteContentsOffset(block, start, end);

    return endOffset !== end ? null : block;
  }

  _removeOneLine(node) {
    const {nextSibling, parentNode} = node;
    let next = nextSibling;

    parentNode.removeChild(node);

    if (nextSibling && nextSibling.nodeName === 'BR') {
      next = nextSibling.nextSibling;
      parentNode.removeChild(nextSibling);
    }

    return next;
  }

  /**
   * Find parent block node of startContainer and endContainer
   * If startContainer or endContainer is same commonAncestor,
   * find node at offset of startContainer and endContainer.
   * @memberof WwTablePasteHelper
   * @param {Node} node - startContainer or endContainer
   * @param {Node} parent - commonAncestor
   * @param {Number} offset - startOffset or endOffset-1
   * @returns {Node} block node
   * @private
   */
  _getBlock(node, parent, offset) {
    return domUtils.getParentUntil(node, parent) || domUtils.getChildNodeByOffset(node, offset);
  }

  /**
   * delete contents from start offset to end offset inside 'td'
   * @memberof WwTablePasteHelper
   * @param {Node} container - container is td or child of td
   * @param {Number} startOffset - start offset
   * @param {Number} endOffset - end offset
   * @private
   */
  _deleteContentsOffset(container, startOffset, endOffset) {
    if (domUtils.isTextNode(container)) {
      const {textContent} = container;
      const prevText = textContent.slice(0, startOffset);
      const postText = textContent.slice(endOffset, textContent.length);

      container.textContent = `${prevText}${postText}`;
    } else {
      const startNode = domUtils.getChildNodeByOffset(container, startOffset);
      const endNode = domUtils.getChildNodeByOffset(container, endOffset);

      if (startNode) {
        this._removeChild(container, startNode, endNode || null);
      }
    }
  }

  /**
   * remove node from 'start' node to 'end-1' node inside parent
   * if 'end' node is null, remove all child nodes after 'start' node.
   * @memberof WwTablePasteHelper
   * @param {Node} parent - parent node
   * @param {Node} start - start node to remove
   * @param {Node} end - end node to remove
   * @private
   */
  _removeChild(parent, start, end) {
    let child = start;

    if (!child || parent !== child.parentNode) {
      return;
    }

    while (child !== end) {
      const next = child.nextSibling;
      parent.removeChild(child);
      child = next;
    }
  }

  /**
   * remove nodes along the direction from the node to reach targetParent node
   * @memberof WwTablePasteHelper
   * @param {Node} targetParent - stop removing when reach target parent node
   * @param {Node} node - start node
   * @param {boolean} isForward - direction
   * @private
   */
  _removeNodesByDirection(targetParent, node, isForward) {
    let parent = node;

    while (parent !== targetParent) {
      const nextParent = parent.parentNode;
      const {nextSibling, previousSibling} = parent;

      if (!isForward && nextSibling) {
        this._removeChild(nextParent, nextSibling, null);
      } else if (isForward && previousSibling) {
        this._removeChild(nextParent, nextParent.childNodes[0], parent);
      }

      parent = nextParent;
    }
  }
}

export default WwTablePasteHelper;
