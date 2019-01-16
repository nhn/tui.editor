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
   * paste items of clipboard data
   * @param {DataTransfer.items} items - items of clipboarddata
   * @private
   */
  pasteClipboardItem(items) {
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
        this.pasteClipboardHtml(html);
      });
    } else if (textItem) {
      textItem.getAsString(text => {
        this.pasteClipboardContainer(document.createTextNode(text));
      });
    }
  }

  /**
   * Paste clibpard html
   * @param {string} html - html
   * @private
   */
  pasteClipboardHtml(html) {
    const container = document.createDocumentFragment();

    container.appendChild(htmlSanitizer(html));
    this.pasteClipboardContainer(container);
  }

  /**
   * Paste clibpard container.
   * @param {DocumentFragment} clipboardContainer - clipboard
   * @private
   */
  pasteClipboardContainer(clipboardContainer) {
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
      this._pasteData(range, fragment);
    }
  }

  /**
   * processing clipboard data for paste to table
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
   * paste fragment to offset of container
   * @memberof WwTablePasteHelper
   * @param {Range} range - selection range
   * @param {DocumentFragment} fragment - paste data
   * @private
   */
  _pasteData(range, fragment) {
    const container = range.startContainer;
    const offset = range.startOffset;

    if (domUtils.isTextNode(container)) {
      const newRange = this._pasteIntoTextNode(container, offset, fragment);
      this.wwe.getEditor().setSelection(newRange);
    } else {
      let node = domUtils.getChildNodeByOffset(container, offset);
      if (!node) {
        // For example when container is br, br don't have child, so node is null
        if (container.nodeName === 'TD') {
          container.appendChild(fragment);
        } else {
          container.parentNode.insertBefore(fragment, container);
        }
        node = container;
      } else {
        container.insertBefore(fragment, node);
      }
      range.setStart(node, 0);
      range.collapse(true);
      this.wwe.getEditor().setSelection(range);
    }
  }

  /**
   * paste fragment to offset of container that is text node
   * @memberof WwTablePasteHelper
   * @param {Node} container - container is text node
   * @param {Number} offset - offset
   * @param {DocumentFragment} fragment - paste data
   * @returns {Range} result - range
   * @private
   */
  _pasteIntoTextNode(container, offset, fragment) {
    const length = container.textContent.length;
    const prevText = container.textContent.slice(0, offset);
    const postText = container.textContent.slice(offset, length);
    const range = container.ownerDocument.createRange();

    if (prevText === '') {
      container.parentNode.insertBefore(fragment, container);

      range.setStart(container, 0);
      range.collapse(true);
    } else if (postText === '') {
      container.parentNode.insertBefore(fragment, container.nextSibling);

      range.setStartAfter(container.nextSibling);
      range.collapse(true);
    } else if (fragment.childNodes.length === 1 && domUtils.isTextNode(fragment.childNodes[0])) {
      container.textContent = `${prevText}${fragment.childNodes[0].textContent}${postText}`;

      range.setStart(container, prevText.length + fragment.childNodes[0].textContent.length);
      range.collapse(true);
    } else {
      const parentNode = container.parentNode;
      const resultFragment = document.createDocumentFragment();
      resultFragment.appendChild(document.createTextNode(prevText));
      resultFragment.appendChild(fragment);
      resultFragment.appendChild(document.createTextNode(postText));

      const childNodesArray = util.toArray(parentNode.childNodes);
      let index = 0;
      childNodesArray.forEach((child, i) => {
        if (container === child) {
          index = i;
        }
      });
      parentNode.replaceChild(resultFragment, container);

      range.setStart(parentNode.childNodes[index], 0);
      range.collapse(true);
    }

    return range;
  }

  /**
   * delete contents of range that is not collapse
   * @memberof WwTablePasteHelper
   * @param {Range} range - range is not collapse
   * @private
   */
  _deleteContentsRange(range) {
    const {startContainer, startOffset, endContainer, endOffset} = range;
    const common = range.commonAncestorContainer;

    if (startContainer === endContainer) {
      this._deleteContentsOffset(startContainer, startOffset, endOffset);
      range.setStart(startContainer, startOffset);
      range.collapse(true);
    } else {
      // Find parent block node of startContainer and endContainer
      // If startContainer and endContainer is same common,
      // find node at offset of startContainer and endContainer.
      let startBlock = domUtils.getParentUntil(startContainer, common)
                      || domUtils.getChildNodeByOffset(startContainer, startOffset);
      let endBlock = domUtils.getParentUntil(endContainer, common)
                      || domUtils.getChildNodeByOffset(endContainer, endOffset);

      if (startContainer.nodeName !== 'TD') {
        // Remove child nodes from node of startOffset in startContainer.
        this._deleteContentsOffset(startContainer, startOffset, domUtils.getOffsetLength(startContainer));

        // Remove nodes from startContainer in startBlock
        this._removeNodesByDirection(startBlock, startContainer, false);
      }

      if (endContainer.nodeName !== 'TD') {
        // Remove child nodes until node of endOffset in endContainer.
        this._deleteContentsOffset(endContainer, 0, endOffset);

        // Remove nodes until endContainer in endBlock
        this._removeNodesByDirection(endBlock, endContainer, true);
      }

      // Remove nodes between startBlock and endBlock
      this._removeChild(common, startBlock.nextSibling, endBlock);

      range.setStart(endBlock, 0);
      range.collapse(true);
    }
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
