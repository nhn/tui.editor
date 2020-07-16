/**
 * @fileoverview Paste helper when past to table
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';

import domUtils from './utils/dom';
import defaultSanitizer from './htmlSanitizer';

/**
 * Class WwTablePasteHelper
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */
class WwTablePasteHelper {
  constructor(wwe) {
    this.wwe = wwe;
  }

  /**
   * Prossse paste clipboardEvent
   * @param {ClipboardEvent} ev - ClipboardEvent
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
   * To get clipboard, create temporay element and then paste into that element.
   * After end of paste, can get clipboard from that temporary element.
   * @param {ClipboardEvent} ev - ClipboardEvent
   * @private
   */
  _pasteClipboardUsingPasteArea() {
    const sq = this.wwe.getEditor();
    const range = sq.getSelection();
    const { startContainer, startOffset, endContainer, endOffset } = range;
    const pasteArea = document.createElement('div');
    const { body } = document;

    pasteArea.setAttribute('contenteditable', true);
    pasteArea.setAttribute(
      'style',
      'position:fixed; overflow:hidden; top:0; right:100%; width:1px; height:1px;'
    );
    body.appendChild(pasteArea);

    range.selectNodeContents(pasteArea);
    sq.setSelection(range);

    setTimeout(() => {
      const clipboard = body.removeChild(pasteArea);

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

    toArray(items).forEach(item => {
      if (item.type === 'text/html') {
        htmlItem = item;
      } else if (item.type === 'text/plain') {
        textItem = item;
      }
    });

    if (htmlItem) {
      htmlItem.getAsString(html => {
        this._pasteClipboardHtml(html);
      });
    } else if (textItem) {
      textItem.getAsString(text => {
        const fragment = domUtils.getFragmentReplacedByNewlineToBr(text);

        this._pasteClipboardContainer(fragment);
      });
    }
  }

  /**
   * Get sanitized html as dom fragment
   * @param {string} html - html string to sanitize
   * @returns {DocumentFragment} sanitized html
   * @private
   */
  _getSanitizedHtml(html) {
    const sanitizer = this.wwe.getSanitizer();

    html = defaultSanitizer(html, true);

    if (sanitizer && sanitizer !== defaultSanitizer) {
      html = sanitizer(html);
    }

    const container = document.createElement('div');

    container.innerHTML = html;

    return domUtils.finalizeHtml(container);
  }

  /**
   * Paste html of clipboard
   * @param {string} html - html
   * @private
   */
  _pasteClipboardHtml(html) {
    const container = document.createDocumentFragment();
    const startFramgmentStr = '<!--StartFragment-->';
    const endFragmentStr = '<!--EndFragment-->';
    const startFragmentIndex = html.indexOf(startFramgmentStr);
    const endFragmentIndex = html.lastIndexOf(endFragmentStr);

    if (startFragmentIndex > -1 && endFragmentIndex > -1) {
      html = html.slice(startFragmentIndex + startFramgmentStr.length, endFragmentIndex);
    }

    // Wrap with <tr> if html contains dangling <td> tags
    // Dangling <td> tag is that tag does not have <tr> as parent node.
    if (/<\/td>((?!<\/tr>)[\s\S])*$/i.test(html)) {
      html = `<TR>${html}</TR>`;
    }
    // Wrap with <table> if html contains dangling <tr> tags
    // Dangling <tr> tag is that tag does not have <table> as parent node.
    if (/<\/tr>((?!<\/table>)[\s\S])*$/i.test(html)) {
      html = `<TABLE>${html}</TABLE>`;
    }

    container.appendChild(this._getSanitizedHtml(html));
    this._pasteClipboardContainer(container);
  }

  /**
   * Paste container of clipboard
   * @param {DocumentFragment} clipboardContainer - clipboard
   * @private
   */
  _pasteClipboardContainer(clipboardContainer) {
    const sq = this.wwe.getEditor();
    const { childNodes } = clipboardContainer;
    const containsOneTableOnly = childNodes.length === 1 && childNodes[0].nodeName === 'TABLE';

    if (containsOneTableOnly) {
      const tableManager = this.wwe.componentManager.getManager('table');

      tableManager.pasteTableData(clipboardContainer);
    } else {
      const range = sq.getSelection().cloneRange();
      const fragment = this._preparePasteDocumentFragment(clipboardContainer);

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
   * @param {DocumentFragment} clipboardContainer - clipboard
   * @returns {DocumentFragment} processed result
   * @private
   */
  _preparePasteDocumentFragment(clipboardContainer) {
    const { childNodes } = clipboardContainer;
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
   * @param {Node} node - target node
   * @returns {DocumentFragment} processed result
   * @private
   */
  _unwrapBlock(node) {
    const fragment = document.createDocumentFragment();
    const childNodes = toArray(node.childNodes);

    while (childNodes.length) {
      const child = childNodes.shift();

      if (this._isPossibleInsertToTable(child)) {
        fragment.appendChild(child);
      } else {
        fragment.appendChild(this._unwrapBlock(child));

        // If current child is last or fragment already has last br,
        // appending br would create unintended line break.
        const { lastChild } = fragment;

        if (childNodes.length && lastChild && lastChild.nodeName !== 'BR') {
          fragment.appendChild(document.createElement('br'));
        }
      }
    }

    return fragment;
  }

  _isPossibleInsertToTable(node) {
    const { nodeName } = node;
    const isChildlessCode = nodeName === 'CODE' && node.childNodes.length > 1;
    const isList = nodeName === 'UL' || nodeName === 'OL';

    return (
      !isChildlessCode &&
      (isList || domUtils.isMDSupportInlineNode(node) || domUtils.isTextNode(node))
    );
  }

  /**
   * paste fragment to offset of range.startContainer
   * @param {Range} range - selection range
   * @param {DocumentFragment} fragment - paste data
   * @private
   */
  _pasteIntoElements(range, fragment) {
    const { startContainer: container, startOffset: offset } = range;
    const node = domUtils.getChildNodeByOffset(container, offset);

    if (!node) {
      // For example when container is br, br don't have child, so node is null
      if (container.nodeName === 'TD') {
        container.appendChild(fragment);
        range.setStart(container, container.childNodes.length);
      } else {
        const { parentNode, nextSibling } = container;

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
   * paste fragment to offset of text node
   * @param {Range} range - selection range
   * @param {DocumentFragment} fragment - paste data
   * @private
   */
  _pasteIntoTextNode(range, fragment) {
    const { startContainer: container, startOffset: offset } = range;
    const { parentNode, textContent } = container;
    const prevText = textContent.slice(0, offset);
    const postText = textContent.slice(offset, textContent.length);
    const { childNodes: fragmentChildNodes } = fragment;
    const [firstChild] = fragmentChildNodes;
    const isFragmenthasOneTextNode =
      fragmentChildNodes.length === 1 && domUtils.isTextNode(firstChild);

    if (!prevText) {
      parentNode.insertBefore(fragment, container);
      range.setStart(container, 0);
    } else if (!postText) {
      const { nextSibling } = container;

      parentNode.insertBefore(fragment, nextSibling);
      range.setStartAfter(nextSibling);
    } else if (isFragmenthasOneTextNode) {
      const { textContent: firstChildText } = firstChild;

      container.textContent = `${prevText}${firstChildText}${postText}`;
      range.setStart(container, prevText.length + firstChildText.length);
    } else {
      const resultFragment = document.createDocumentFragment();

      resultFragment.appendChild(document.createTextNode(prevText));
      resultFragment.appendChild(fragment);
      resultFragment.appendChild(document.createTextNode(postText));
      parentNode.replaceChild(resultFragment, container);

      const childNodesArray = toArray(parentNode.childNodes);
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
   * @param {Range} range - range is not collapse
   * @private
   */
  _deleteContentsRange(range) {
    const { startContainer, startOffset, endContainer, endOffset } = range;

    if (startContainer === endContainer) {
      this._deleteContentsByOffset(startContainer, startOffset, endOffset);
      range.setStart(startContainer, startOffset);
      range.collapse(true);
    } else {
      this._deleteNotCollapsedRangeContents(range);
    }
  }

  _deleteNotCollapsedRangeContents(range) {
    const { startContainer, startOffset, endContainer, endOffset } = range;
    const common = range.commonAncestorContainer;
    const startBlock = this._getBlock(startContainer, common, startOffset);
    let endBlock = this._getBlock(endContainer, common, endOffset - 1);

    if (startBlock === endBlock) {
      this._removeInSameBlock(startBlock, startContainer, endContainer, startOffset, endOffset);

      // When endContainer is not same endBlock, endBlock is removed.
      // For example, aaa| <- this is cursor.
      // When cursor is last, endContainer would be 'TD' and endBlock is text node
      // In this case, remove all 'aaa' so endBlock should be null.
      endBlock = endContainer !== endBlock ? null : endBlock;
    } else {
      let { nextSibling: nextOfstartBlock } = startBlock;

      if (startContainer.nodeName === 'TD') {
        nextOfstartBlock = this._removeOneLine(startBlock);
      } else {
        // Remove child nodes from node of startOffset in startContainer.
        this._deleteContentsByOffset(
          startContainer,
          startOffset,
          domUtils.getOffsetLength(startContainer)
        );

        // Remove nodes from startContainer in startBlock
        domUtils.removeNodesByDirection(startBlock, startContainer, false);
      }

      if (endContainer.nodeName === 'TD') {
        endBlock = this._removeOneLine(endBlock);
      } else {
        // Remove child nodes until node of endOffset in endContainer.
        this._deleteContentsByOffset(endContainer, 0, endOffset);

        // Remove nodes until endContainer in endBlock
        domUtils.removeNodesByDirection(endBlock, endContainer, true);
      }

      // Remove nodes between startBlock and endBlock
      domUtils.removeChildFromStartToEndNode(common, nextOfstartBlock, endBlock);
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

    this._deleteContentsByOffset(block, start, end);
  }

  _removeOneLine(node) {
    const { nextSibling, parentNode } = node;
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
   * delete contents from start offset to end offset
   * @param {Node} container - container
   * @param {Number} startOffset - start offset
   * @param {Number} endOffset - end offset
   * @private
   */
  _deleteContentsByOffset(container, startOffset, endOffset) {
    if (domUtils.isTextNode(container)) {
      const { textContent } = container;
      const prevText = textContent.slice(0, startOffset);
      const postText = textContent.slice(endOffset, textContent.length);

      container.textContent = `${prevText}${postText}`;
    } else {
      const startNode = domUtils.getChildNodeByOffset(container, startOffset);
      const endNode = domUtils.getChildNodeByOffset(container, endOffset);

      if (startNode) {
        domUtils.removeChildFromStartToEndNode(container, startNode, endNode || null);
      }
    }
  }
}

export default WwTablePasteHelper;
