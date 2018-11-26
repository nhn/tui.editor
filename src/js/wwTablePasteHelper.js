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
   * @memberof WwTablePasteHelper
   */
  constructor(wwe) {
    this.wwe = wwe;
  }

  /**
   * Process items of clipboard data for pasting
   * @param {DataTransfer.items} items - items of clipboarddata
   * @memberof WwTableManager
   */
  processClipboard(items) {
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
        const htmlData = document.createDocumentFragment();
        htmlData.appendChild(htmlSanitizer(html));
        this._pasteClipboardData(htmlData);
      });
    } else if (textItem) {
      const textData = document.createDocumentFragment();
      textItem.getAsString(text => {
        textData.textContent = text;
        this._pasteClipboardData(textData);
      });
    }
  }

  /**
   * Paste clibpard data.
   * @param {DocumentFragment} clipboardContainer - clipboard
   * @private
   */
  _pasteClipboardData(clipboardContainer) {
    const {childNodes} = clipboardContainer;
    const containsOneTableOnly = (childNodes.length === 1 && childNodes[0].nodeName === 'TABLE');

    if (containsOneTableOnly) {
      const tableManager = this.wwe.componentManager.getManager('table');
      tableManager.pasteTableData(clipboardContainer);
    } else {
      const range = this.wwe.getEditor().getSelection().cloneRange();
      const fragment = this._preparePasteData(childNodes);
      if (!range.collapsed) {
        this._deleteContentsRange(range);
      }
      this._pasteData(range, fragment);
    }
  }

  /**
   * processing clipboard data for paste to table
   * @memberof WwTableManager
   * @param {NodeList} nodeList - clipboard node list
   * @returns {DocumentFragment} processed result
   * @private
   */
  _preparePasteData(nodeList) {
    const fragment = document.createDocumentFragment();
    const childNodesArray = util.toArray(nodeList);

    childNodesArray.forEach(child => {
      fragment.appendChild(this._getPasteData(child));
    });

    return fragment;
  }

  /**
   * processing node for paste to table
   * @memberof WwTableManagerx
   * @param {Node} node - target node
   * @returns {DocumentFragment} processed result
   * @private
   */
  _getPasteData(node) {
    const fragment = document.createDocumentFragment();
    // inline and text node could be inserted to table
    if (domUtils.isMDSupportInlineNode(node) || domUtils.isTextNode(node)) {
      fragment.appendChild(node);
    } else {
      // block node should be unwraped
      fragment.appendChild(this._unwrapBlock(node));
      fragment.appendChild(document.createElement('br'));
    }

    return fragment;
  }

  /**
   * unwrap block node
   * @memberof WwTableManager
   * @param {Node} node - target node
   * @returns {DocumentFragment} processed result
   * @private
   */
  _unwrapBlock(node) {
    const fragment = document.createDocumentFragment();
    const childNodes = util.toArray(node.childNodes);
    while (childNodes.length) {
      let child = childNodes.shift();
      if (domUtils.isBlockNode(child)) {
        fragment.appendChild(this._getPasteData(child));
      } else {
        fragment.appendChild(child);
        if (!domUtils.isMDSupportInlineNode(child) && !domUtils.isTextNode(child)) {
          fragment.appendChild(document.createElement('br'));
        }
      }
    }

    return fragment;
  }

  /**
   * paste fragment to offset of container
   * @memberof WwTableManager
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
      const node = domUtils.getChildNodeByOffset(container, offset);
      container.insertBefore(fragment, node);
      range.setStart(node, 0);
      range.collapse(true);
      this.wwe.getEditor().setSelection(range);
    }
  }

  /**
   * paste fragment to offset of container that is text node
   * @memberof WwTableManager
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
      const prevNode = document.createDocumentFragment();
      const postNode = document.createDocumentFragment();
      prevNode.textContent = prevText;
      postNode.textContent = postText;
      resultFragment.appendChild(prevNode);
      resultFragment.appendChild(fragment);
      resultFragment.appendChild(postNode);
      let index = 0;
      parentNode.childNodes.forEach((child, i) => {
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
   * @memberof WwTableManager
   * @param {Range} range - range is not collapse
   * @private
   */
  _deleteContentsRange(range) {
    const {startContainer} = range;
    const {startOffset} = range;
    const {endContainer} = range;
    const {endOffset} = range;
    const common = range.commonAncestorContainer;

    if (startContainer === endContainer) {
      this._deleteContentsOffset(startContainer, startOffset, endOffset);
      range.setStart(startContainer, startOffset);
      range.collapse(true);
    } else {
      const startBlock = domUtils.getParentUntil(startContainer, common);
      const endBlock = domUtils.getParentUntil(endContainer, common);
      if (startBlock) {
        this._removeAfterOffset(startBlock, startContainer, startOffset);
      } else {
        // This case is that the startContainer is TD
        const startNode = domUtils.getChildNodeByOffset(startContainer, startOffset);
        this._removeChild(startContainer, startNode, endBlock);
      }
      if (endBlock) {
        this._removeUntilOffset(endBlock, endContainer, endOffset);
      } else {
        // This case is that the endContainer is TD
        const endNode = domUtils.getChildNodeByOffset(endContainer, endOffset);
        this._removeChild(endContainer, startBlock.nextSibling, endNode.nextSibling);
      }
      if (startBlock && endBlock) {
        this._removeChild(common, startBlock.nextSibling, endBlock);
      }
      range.setStart(endBlock, 0);
      range.collapse(true);
    }
  }

  /**
   * delete contents from start offset to end offset
   * @memberof WwTableManager
   * @param {Node} container - container
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
    } else if (container.nodeName === 'TD') {
      const startNode = domUtils.getChildNodeByOffset(container, startOffset);
      const endNode = domUtils.getChildNodeByOffset(container, endOffset);
      this._removeChild(container, startNode, endNode);
    } else {
      this._removeChild(container.parentNode, container.nextSibling, container);
    }
  }

  /**
   * remove node 'from'~'to-1' inside parent
   * @memberof WwTableManager
   * @param {Node} parent - range is not collapse
   * @param {Node} from - range is not collapse
   * @param {Node} to - range is not collapse
   * @private
   */
  _removeChild(parent, from, to) {
    let child = from;
    while (child !== to) {
      const next = child.nextSibling;
      parent.removeChild(child);
      child = next;
    }
  }

  /**
   * remove nodes until target inside continer
   * and remove node or text unt offset inside target
   * @memberof WwTableManager
   * @param {Node} container - should be parent of target
   * @param {Node} target - target
   * @param {Number} offset - offset inside target
   * @private
   */
  _removeUntilOffset(container, target, offset) {
    if (domUtils.isTextNode(target)) {
      const {textContent} = target;
      target.textContent = textContent.slice(offset);
    } else {
      const {childNodes} = target;
      this._removeChild(target, childNodes[0], childNodes[offset]);
    }

    if (target !== container) {
      let block = target.parentNode;
      while (block !== container) {
        this._removeChild(block.parentNode, block.parentNode.childNodes[0], block);
        block = block.parentNode;
      }
    }
  }

  /**
   * remove nodes after target inside continer
   * and remove node or text after offset inside target
   * @memberof WwTableManager
   * @param {Node} container - should be parent of target
   * @param {Node} target - target
   * @param {Number} offset - offset inside target
   * @private
   */
  _removeAfterOffset(container, target, offset) {
    if (domUtils.isTextNode(target)) {
      const {textContent} = target;
      target.textContent = textContent.slice(0, offset);
    } else {
      const {childNodes} = target;
      this._removeChild(target, childNodes[offset], null);
    }

    if (target !== container) {
      let block = target.parentNode;
      while (block !== container) {
        if (block.nextSibling) {
          this._removeChild(block.parentNode, block.nextSibling, null);
        }
        block = block.parentNode;
      }
    }
  }
}

export default WwTablePasteHelper;
