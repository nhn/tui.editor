/**
 * @fileoverview Implements wysiwyg table manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';
import forEachOwnProperties from 'tui-code-snippet/collection/forEachOwnProperties';
import isUndefined from 'tui-code-snippet/type/isUndefined';
import browser from 'tui-code-snippet/browser/browser';
import removeClass from 'tui-code-snippet/domUtil/removeClass';

import domUtils from './utils/dom';

const isIE10 = browser.msie && browser.version === 10;
const TABLE_CLASS_PREFIX = 'te-content-table-';
const isIE10And11 = browser.msie && (browser.version === 10 || browser.version === 11);
const BASIC_CELL_CONTENT = browser.msie ? '' : '<br>';
const TABLE_CELL_SELECTED_CLASS_NAME = 'te-cell-selected';

/**
 * Class WwTableManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */
class WwTableManager {
  constructor(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @type {string}
     */
    this.name = 'table';
    this._lastCellNode = null;
    this._init();
  }

  /**
   * Initialize
   * @private
   */
  _init() {
    this._initKeyHandler();
    this._initEvent();
    this.tableID = 0;
  }

  /**
   * Initialize event
   * @private
   */
  _initEvent() {
    this.eventManager.listen('wysiwygRangeChangeAfter.table', () => {
      const range = this.wwe.getEditor().getSelection();
      const isRangeInTable = this.wwe.isInTable(range);

      this._unwrapBlockInTable();
      this._completeTableIfNeed();

      if (!isRangeInTable) {
        const selectionManager = this.wwe.componentManager.getManager('tableSelection');

        selectionManager.removeClassAttrbuteFromAllCellsIfNeed();
      }

      this._insertDefaultBlockBetweenTable();
    });

    this.eventManager.listen('wysiwygSetValueAfter.table', () => {
      this._unwrapBlockInTable();
      this._insertDefaultBlockBetweenTable();
    });

    // remove last br in td or th
    this.eventManager.listen('wysiwygProcessHTMLText.table', html =>
      html.replace(/<br \/>(<\/td>|<\/th>)/g, '$1')
    );

    this.eventManager.listen('cut.table', () => {
      const selectionManager = this.wwe.componentManager.getManager('tableSelection');
      const selectedCells = selectionManager.getSelectedCells();

      if (selectedCells.length) {
        selectedCells.forEach(cell => {
          cell.innerHTML = BASIC_CELL_CONTENT;
        });
      }

      selectionManager.removeClassAttrbuteFromAllCellsIfNeed();
    });

    this.eventManager.listen('copyBefore.table', ({ clipboardContainer }) =>
      this.updateTableHtmlOfClipboardIfNeed(clipboardContainer)
    );
  }

  /**
   * Update table html of clipboard data, if has selected cells.
   * @param {HTMLElement} clipboardContainer - clipboard element
   */
  updateTableHtmlOfClipboardIfNeed(clipboardContainer) {
    const selectionManager = this.wwe.componentManager.getManager('tableSelection');
    const selectedCells = selectionManager.getSelectedCells();

    if (selectedCells.length) {
      selectionManager.createRangeBySelectedCells();

      const fragment = this.wwe
        .getEditor()
        .getSelection()
        .cloneContents();

      toArray(fragment.children).forEach(node => {
        if (!this.isTableOrSubTableElement(node.nodeName)) {
          return;
        }

        if (
          node.nodeName === 'TABLE' &&
          node.querySelector('thead') &&
          node.querySelector('tbody')
        ) {
          domUtils.remove(node);
        } else if (node.previousSibling && node.previousSibling.nodeName === 'TABLE') {
          node.previousSibling.appendChild(node);
        } else {
          this._completeIncompleteTable(node);

          if (node.nodeName !== 'TABLE' && node.nodeName !== 'THEAD') {
            const thead = domUtils.closest(node, 'table').querySelector('thead');

            domUtils.remove(thead);
          }
        }
      });

      clipboardContainer.appendChild(fragment);

      domUtils.findAll(clipboardContainer, `.${TABLE_CELL_SELECTED_CLASS_NAME}`).forEach(cell => {
        removeClass(cell, TABLE_CELL_SELECTED_CLASS_NAME);
      });
    }
  }

  /**
   * Paste clibpard data that contains only table.
   * @param {Node} clipboardTable - table element of clipboard
   */
  pasteTableData(clipboardTable) {
    this._expandTableIfNeed(clipboardTable);
    this._pasteDataIntoTable(clipboardTable);
  }

  /**
   * Initialize key event handler
   * @private
   */
  _initKeyHandler() {
    this.keyEventHandlers = {
      DEFAULT: (ev, range, keymap) => {
        const isRangeInTable = this.wwe.isInTable(range);

        if (isRangeInTable && !this._isModifierKey(keymap)) {
          this._recordUndoStateIfNeed(range);
          this._removeContentsAndChangeSelectionIfNeed(range, keymap, ev);
        } else if (!isRangeInTable && this._lastCellNode) {
          this._recordUndoStateAndResetCellNode(range);
        }

        if (isRangeInTable && !this._isModifierKeyPushed(ev)) {
          this.wwe.getEditor().modifyDocument(() => {
            const selectionManager = this.wwe.componentManager.getManager('tableSelection');

            selectionManager.removeClassAttrbuteFromAllCellsIfNeed();
          });
        }
      },
      ENTER: (ev, range) => {
        let isNeedNext;

        if (this._isAfterTable(range)) {
          ev.preventDefault();
          range.setStart(range.startContainer, range.startOffset - 1);
          this.wwe.breakToNewDefaultBlock(range);
          isNeedNext = false;
        } else if (this._isBeforeTable(range)) {
          ev.preventDefault();
          this.wwe.breakToNewDefaultBlock(range, 'before');
          isNeedNext = false;
        } else if (this.wwe.isInTable(range)) {
          if (!this._isInList(range.startContainer) && this._isInStyledText(range)) {
            this.wwe.defer(() => {
              this._removeBRinStyleText();
            });
          } else if (this._isEmptyFirstLevelLI(range)) {
            this.wwe.defer(() => {
              // Squire make div when LI level is decreased in first level so should replace div to br
              const afterRange = this.wwe.getRange().cloneRange();
              const div = afterRange.startContainer;
              const br = document.createElement('br');

              div.parentNode.replaceChild(br, div);

              afterRange.setStartBefore(br);
              afterRange.collapse(true);
              this.wwe.getEditor().setSelection(afterRange);
            });
          }
          this._appendBrIfTdOrThNotHaveAsLastChild(range);
          isNeedNext = false;
        }

        return isNeedNext;
      },
      BACK_SPACE: (ev, range, keymap) => this._handleBackspaceAndDeleteKeyEvent(ev, range, keymap),
      DELETE: (ev, range, keymap) => this._handleBackspaceAndDeleteKeyEvent(ev, range, keymap),
      TAB: () => this._moveCursorTo('next', 'cell'),
      'SHIFT+TAB': ev => this._moveCursorTo('previous', 'cell', ev),
      UP: ev => this._moveCursorTo('previous', 'row', ev),
      DOWN: ev => this._moveCursorTo('next', 'row', ev)
    };

    forEachOwnProperties(this.keyEventHandlers, (handler, key) =>
      this.wwe.addKeyEventHandler(key, handler)
    );
  }

  /**
   * Check whether node is li and empty
   * @param {node} node node
   * @returns {boolean} whether node is li and empty
   * @private
   */
  _isEmptyListItem(node) {
    const { childNodes, nodeName } = node;

    return nodeName === 'LI' && childNodes.length === 1 && childNodes[0].nodeName === 'BR';
  }

  /**
   * Check whether range is in empty LI that is first level
   * @param {range} range range
   * @returns {boolean} whether range is in empty LI that is first level
   * @private
   */
  _isEmptyFirstLevelLI(range) {
    const { collapsed, startContainer, startOffset } = range;

    return (
      collapsed &&
      startOffset === 0 &&
      this._isEmptyListItem(startContainer) &&
      domUtils.isFirstLevelListItem(startContainer)
    );
  }

  /**
   * Check whether range is in style tag that is like 'B', 'I', 'S', 'SPAN', 'CODE'
   * Those tag is supported in Wysiwyg.
   * @param {Range} range range
   * @returns {Boolean} range is in the style tag
   * @private
   */
  _isInStyledText(range) {
    const { startContainer } = range;
    let node;

    if (domUtils.isTextNode(startContainer)) {
      node = startContainer.parentNode;
    } else {
      node = startContainer;
    }

    return range.collapsed && domUtils.isStyledNode(node);
  }

  /**
   * When enter key occur in the styled text, 'br' tag insert in the style tag like 'b', 'i' etc.
   * So in thoes case, 'br' tag would be pulled out in this logic.
   * @private
   */
  _removeBRinStyleText() {
    const afterRange = this.wwe.getRange();
    const { startContainer, startOffset } = afterRange;

    let styleNode;

    if (startContainer.nodeName === 'TD') {
      // This case is <i>TEST<br></i>|<br>
      styleNode = domUtils.getChildNodeByOffset(startContainer, startOffset - 1);
    } else {
      styleNode = domUtils.getParentUntil(startContainer, 'TD');
    }

    const brNode = styleNode.querySelector('br');

    if (!brNode) {
      return;
    }

    const { parentNode: tdNode, nodeName } = styleNode;

    if (nodeName === 'CODE' && !brNode.previousSibling) {
      // cursor is located in the start of text
      // Before Enter : <code>|TEST</code>
      // After Enter  : <code><br>|TEST</code>
      // TO BE        : <br><code>|TEST</code>
      tdNode.insertBefore(brNode, styleNode);
      afterRange.setStart(styleNode, 0);
    } else if (nodeName === 'CODE' && !brNode.nextSibling) {
      // cursor is located in the end of text
      // Before Enter : <code>TEST|</code>
      // After Enter  : <code>TEST<br>|</code>
      // TO BE        : <code>TEST</code><br>|
      tdNode.insertBefore(brNode, styleNode.nextSibling);
      afterRange.setStart(tdNode, domUtils.getNodeOffsetOfParent(brNode) + 1);
    } else {
      // [Case 1] cursor is located in the middle of text
      // Before Enter : <i>TE|ST</i>
      // After Enter  : <i>TE<br>|ST</i>
      // TO BE        : <i>TE</i><br><i>|ST</i>
      // [Case 2] cursor is located in the start of text
      // Before Enter : <i>|TEST</i>
      // After Enter  : <i><br>|TEST</i>
      // TO BE        : <i>|</i><br><i>TEST</i>
      // [Case 3] cursor is located in the end of text
      // Before Enter : <i>TEST|</i>
      // After Enter  : <i>TEST<br>|</i>
      // TO BE        : <i>TEST</i><br><i>|</i>
      const newNode = this._splitByBR(styleNode, brNode);

      afterRange.setStart(newNode, 0);
    }

    afterRange.collapse(true);
    this.wwe.getEditor().setSelection(afterRange);
  }

  /**
   * When container node have br node, split container base on br node and pull out BR.
   * After Enter  : <i>TE<br>ST</i>
   * TO BE        : <i>TE</i><br><i>ST</i>
   * @param {Node} container container
   * @param {Node} brNode container
   * @returns {Node} node for positioning of cursor
   * @private
   */
  _splitByBR(container, brNode) {
    const cloneStyleNode = container.cloneNode(true);
    const newBR = document.createElement('br');
    const { parentNode } = container;

    // Origin style node should be removed the back nodes of br node.
    domUtils.removeNodesByDirection(container, brNode, false);
    brNode.parentNode.removeChild(brNode);

    // Cloned style node should be removed the front nodes of br node
    const clonedBR = cloneStyleNode.querySelector('br');

    domUtils.removeNodesByDirection(cloneStyleNode, clonedBR, true);
    clonedBR.parentNode.removeChild(clonedBR);

    parentNode.insertBefore(cloneStyleNode, container.nextSibling);
    parentNode.insertBefore(newBR, cloneStyleNode);

    const leafNode = domUtils.getLeafNode(cloneStyleNode);

    if (!domUtils.getTextLength(leafNode)) {
      leafNode.textContent = '\u200B';
    }

    return leafNode;
  }

  /**
   * Check whether passed range is right before table or not
   * @param {Range} range range
   * @returns {boolean} result
   * @private
   */
  _isBeforeTable(range) {
    return (
      domUtils.getNodeName(
        domUtils.getChildNodeByOffset(range.startContainer, range.startOffset)
      ) === 'TABLE'
    );
  }

  /**
   * Check whether passed range is right after table or not
   * @param {Range} range range
   * @returns {boolean} result
   * @private
   */
  _isAfterTable(range) {
    const prevElem = domUtils.getPrevOffsetNodeUntil(range.startContainer, range.startOffset);

    return (
      domUtils.getNodeName(prevElem) === 'TABLE' &&
      range.commonAncestorContainer === this.wwe.getBody()
    );
  }

  /**
   * Handle backspace and delete key event
   * @param {object} ev - Event object
   * @param {Range} range - Range Object
   * @param {string} keymap - keymap
   * @returns {boolean} - need next
   * @private
   */
  _handleBackspaceAndDeleteKeyEvent(ev, range, keymap) {
    const isBackspace = keymap === 'BACK_SPACE';
    const selectionManager = this.wwe.componentManager.getManager('tableSelection');
    const selectedCells = selectionManager.getSelectedCells();
    let isNeedNext = true;

    if (range.collapsed) {
      if (this.wwe.isInTable(range)) {
        if (isBackspace) {
          this._tableHandlerOnBackspace(range, ev);
        } else {
          this._tableHandlerOnDelete(range, ev);
        }

        this._removeContentsAndChangeSelectionIfNeed(range, keymap, ev);
        isNeedNext = false;
      } else if (
        (!isBackspace && this._isBeforeTable(range)) ||
        (isBackspace && this._isAfterTable(range))
      ) {
        ev.preventDefault();
        const startOffset = isBackspace ? range.startOffset - 1 : range.startOffset;

        this._removeTable(range, domUtils.getChildNodeByOffset(range.startContainer, startOffset));
        isNeedNext = false;
      }
    } else if (this.wwe.isInTable(range)) {
      if (selectedCells.length > 0) {
        const removed = this._removeContentsAndChangeSelectionIfNeed(range, keymap, ev);

        if (removed) {
          ev.preventDefault();
          isNeedNext = false;
        }
      }
    }

    return isNeedNext;
  }

  /**
   * Move Li node to previous node that is previous node of list node.
   * @param {node} liNode li node
   * @param {range} range range
   * @private
   */
  _moveListItemToPreviousOfList(liNode, range) {
    const { parentNode: listNode, firstChild } = liNode;
    const fragment = document.createDocumentFragment();

    domUtils.mergeNode(liNode, fragment);
    listNode.parentNode.insertBefore(fragment, listNode);

    range.setStart(firstChild, 0);
    range.collapse(true);
    this.wwe.getEditor().setSelection(range);

    if (!listNode.hasChildNodes()) {
      listNode.parentNode.removeChild(listNode);
    }
  }

  _isInList(targetNode) {
    return domUtils.getParentUntilBy(
      targetNode,
      node => node && (domUtils.isListNode(node) || node.nodeName === 'LI'),
      node => node && (node.nodeName === 'TD' || node.nodeName === 'TH')
    );
  }

  /**
   * Find LI node while search parentNode inside TD
   * @param {node} startContainer startContainer
   * @returns {node} liNode or null
   * @private
   */
  _findListItem(startContainer) {
    return domUtils.getParentUntilBy(
      startContainer,
      node => node && domUtils.isListNode(node),
      node => node && (node.nodeName === 'TD' || node.nodeName === 'TH')
    );
  }

  /**
   * Backspace handler in table
   * @param {Range} range range
   * @param {Event} event event
   * @private
   */
  _tableHandlerOnBackspace(range, event) {
    const { startContainer, startOffset } = range;
    const liNode = this._findListItem(startContainer);

    if (
      liNode &&
      startOffset === 0 &&
      domUtils.isFirstListItem(liNode) &&
      domUtils.isFirstLevelListItem(liNode)
    ) {
      this.wwe.getEditor().saveUndoState(range);
      this._moveListItemToPreviousOfList(liNode, range);
      event.preventDefault();
    } else {
      const prevNode = domUtils.getPrevOffsetNodeUntil(startContainer, startOffset, 'TR');
      const prevNodeName = domUtils.getNodeName(prevNode);

      if (prevNodeName === 'BR' && prevNode.parentNode.childNodes.length !== 1) {
        event.preventDefault();
        domUtils.remove(prevNode);
      }
    }
  }

  /**
   * Return whether delete br in the br
   * @param {Range} range Range object
   * @returns {boolean}
   * @private
   */
  _isDeletingBR(range) {
    const currentNode = this._getCurrentNodeInCell(range);
    const nextSibling = currentNode && currentNode.nextSibling;

    return (
      domUtils.getNodeName(currentNode) === 'BR' &&
      !!nextSibling &&
      domUtils.getNodeName(nextSibling) === 'BR'
    );
  }

  _getCurrentNodeInCell(range) {
    const { startContainer, startOffset } = range;
    let currentNode;

    if (domUtils.getNodeName(startContainer) === 'TD') {
      currentNode = domUtils.getChildNodeByOffset(startContainer, startOffset);
    } else if (domUtils.getParentUntil(startContainer, 'TD')) {
      currentNode = startContainer;
    }

    return currentNode;
  }

  /**
   * Check whether range is located in end of the list
   * @param {Node} liNode liNode
   * @param {Range} range range
   * @returns {Boolean} whether range is located in end of the list
   * @private
   */
  _isEndOfList(liNode, range) {
    const { startContainer, startOffset } = range;
    let result = false;

    if (!liNode.nextSibling) {
      if (liNode === startContainer) {
        let liNodeOffset = domUtils.getOffsetLength(liNode);

        if (liNode.lastChild.nodeName === 'BR') {
          liNodeOffset -= 1;
        }

        result = liNodeOffset === startOffset;
      } else {
        const parentNode = domUtils.getParentUntil(startContainer, 'li') || startContainer;
        const startContainerOffset = domUtils.getOffsetLength(startContainer);
        let { lastChild } = liNode;

        if (lastChild.nodeName === 'BR') {
          lastChild = lastChild.previousSibling;
        }

        result = lastChild === parentNode && startContainerOffset === startOffset;
      }
    }

    return result;
  }

  /**
   * Get next line nodes from target node
   * @param {Node} node target node
   * @returns {DocumentFragment} next line nodes
   * @private
   */
  _getNextLineNode(node) {
    const fragment = document.createDocumentFragment();
    const parentNode = domUtils.getParentUntil(node, 'TD');
    let { nextSibling } = parentNode;

    while (nextSibling) {
      const { nextSibling: next } = nextSibling;

      fragment.appendChild(nextSibling);

      if (nextSibling.nodeName === 'BR') {
        break;
      }

      nextSibling = next;
    }

    return fragment;
  }

  /**
   * Delete handler in table
   * @param {Range} range range
   * @param {Event} event event
   * @private
   */
  _tableHandlerOnDelete(range, event) {
    const liNode = this._findListItem(range.startContainer);

    if (liNode && this._isEndOfList(liNode, range)) {
      this.wwe.getEditor().saveUndoState(range);

      if (liNode.lastChild.nodeName === 'BR') {
        liNode.removeChild(liNode.lastChild);
      }

      domUtils.mergeNode(this._getNextLineNode(liNode), liNode);
      event.preventDefault();
    } else if (this._isDeletingBR(range)) {
      const currentNode = this._getCurrentNodeInCell(range);

      currentNode.parentNode.removeChild(currentNode.nextSibling);
      event.preventDefault();
    }
  }

  /**
   * Append br if td or th doesn't have br as last child
   * @param {Range} range range
   * @private
   */
  _appendBrIfTdOrThNotHaveAsLastChild(range) {
    const startContainerNodeName = domUtils.getNodeName(range.startContainer);
    let tdOrTh;

    if (startContainerNodeName === 'TD' || startContainerNodeName === 'TH') {
      tdOrTh = range.startContainer;
    } else {
      const paths = domUtils.parentsUntil(range.startContainer, 'tr');

      tdOrTh = paths[paths.length - 1];
    }

    const nodeName = domUtils.getNodeName(tdOrTh.lastChild);

    if (
      nodeName !== 'BR' &&
      nodeName !== 'DIV' &&
      nodeName !== 'UL' &&
      nodeName !== 'OL' &&
      !isIE10And11
    ) {
      domUtils.append(tdOrTh, '<br />');
    }
  }

  /**
   * Unwrap default block tag in table
   * For Squire default action making abnormal behavior, remove default blocks in Table after setValue() called
   * @private
   */
  _unwrapBlockInTable() {
    const blocks = domUtils.findAll(this.wwe.getBody(), 'td div,th div,tr>br,td>br,th>br');

    blocks.forEach(node => {
      if (domUtils.getNodeName(node) === 'BR') {
        const parentNodeName = domUtils.getNodeName(node.parentNode);
        const isInTableCell = /TD|TH/.test(parentNodeName);
        const isEmptyTableCell = node.parentNode.textContent.length === 0;
        const isLastBR = node.parentNode.lastChild === node;

        if (parentNodeName === 'TR' || (isInTableCell && !isEmptyTableCell && isLastBR)) {
          domUtils.remove(node);
        }
      } else {
        domUtils.unwrap(node);
      }
    });
  }

  /**
   * Insert default block between table element
   * @private
   */
  _insertDefaultBlockBetweenTable() {
    const tables = domUtils.findAll(this.wwe.getBody(), 'table');

    tables.forEach(node => {
      if (node.nextElementSibling && node.nextElementSibling.nodeName === 'TABLE') {
        const insertedElement = document.createElement('div');

        insertedElement.appendChild(document.createElement('br'));
        domUtils.insertAfter(insertedElement, node);
      }
    });
  }

  /**
   * Remove table
   * @param {Range} range range
   * @param {Node} table table
   * @private
   */
  _removeTable(range, table) {
    if (table.tagName === 'TABLE') {
      this.wwe.getEditor().saveUndoState(range);
      this.wwe.saveSelection(range);
      domUtils.remove(table);
      this.wwe.restoreSavedSelection();
    }
  }

  /**
   * record undo state if need
   * @param {Range} range range
   * @private
   */
  _recordUndoStateIfNeed(range) {
    const currentCellNode = domUtils.getParentUntil(range.startContainer, 'TR');

    if (range.collapsed && currentCellNode && this._lastCellNode !== currentCellNode) {
      this.wwe.getEditor().saveUndoState(range);
      this._lastCellNode = currentCellNode;
    }
  }

  /**
   * record undo state and reset last cell node
   * @param {Range} range range
   * @private
   */
  _recordUndoStateAndResetCellNode(range) {
    this.wwe.getEditor().saveUndoState(range);
    this.resetLastCellNode();
  }

  /**
   * Paste table data into table element
   * @param {DocumentFragment} fragment Fragment of table element within
   * @private
   */
  _pasteDataIntoTable(fragment) {
    const { startContainer } = this.wwe.getEditor().getSelection();
    const tableData = this._getTableDataFromTable(fragment);
    const isTableCell = startContainer.nodeName === 'TD' || startContainer.nodeName === 'TH';
    const brString = isIE10 ? '' : '<br />';
    let anchorElement, td, tr, tdContent;

    if (isTableCell) {
      anchorElement = startContainer;
    } else {
      anchorElement = domUtils.getParentUntilBy(
        startContainer,
        node => node && (node.nodeName === 'TD' || node.nodeName === 'TH'),
        node => !!domUtils.closest(node, 'table')
      );
      anchorElement = anchorElement ? anchorElement.parentNode : null;
    }

    anchorElement = anchorElement ? anchorElement : startContainer.querySelector('th,td');

    td = anchorElement;
    while (tableData.length) {
      tr = tableData.shift();

      while (td && tr.length) {
        tdContent = tr.shift();

        if (tdContent.length) {
          td.textContent = tdContent;
        } else {
          td.innerHTML = brString;
        }

        td = domUtils.getTableCellByDirection(td, 'next');
      }

      td = domUtils.getSiblingRowCellByDirection(anchorElement, 'next', false);
      anchorElement = td;
    }
  }

  /**
   * Get array data from table element
   * @param {DocumentFragment} fragment table element
   * @returns {Array}
   * @private
   */
  _getTableDataFromTable(fragment) {
    const tableData = [];

    domUtils.findAll(fragment, 'tr').forEach(tr => {
      const trData = [];

      toArray(tr.children).forEach(cell => {
        trData.push(cell.textContent);
      });

      if (trData.length) {
        tableData.push(trData);
      }
    });

    return tableData;
  }

  /**
   * Remove selected table contents
   * @param {HTMLElement} selectedCells Selected cells
   * @private
   */
  _removeTableContents(selectedCells) {
    this.wwe.getEditor().saveUndoState();

    toArray(selectedCells).forEach(cell => {
      const brHTMLString = isIE10 ? '' : '<br />';

      cell.innerHTML = brHTMLString;
    });
  }

  /**
   * Wrap dangling table cells with new TR
   * @param {HTMLElement} container - clipboard container
   * @returns {HTMLElement|null}
   */
  wrapDanglingTableCellsIntoTrIfNeed(container) {
    const danglingTableCells = domUtils.children(container, 'td,th');
    let tr;

    if (danglingTableCells.length) {
      const wrapperTr = document.createElement('tr');

      toArray(danglingTableCells).forEach(cell => {
        domUtils.append(wrapperTr, cell);
      });

      tr = wrapperTr;
    }

    return tr;
  }

  /**
   * Wrap TRs with new TBODY
   * @param {HTMLElement} container - clipboard container
   * @returns {HTMLElement|null}
   */
  wrapTrsIntoTbodyIfNeed(container) {
    const danglingTrs = domUtils.children(container, 'tr');
    let ths = [];

    toArray(danglingTrs).forEach(tr => {
      ths = ths.concat(tr.querySelectorAll('th'));
    });

    let tbody;

    if (ths.length) {
      toArray(ths).forEach(node => {
        const td = document.createElement('td');

        td.innerHTML = node.innerHTML;
        domUtils.insertBefore(node, td);

        domUtils.remove(node);
      });
    }

    if (danglingTrs.length) {
      const wrapperTableBody = document.createElement('tbody');

      toArray(danglingTrs).forEach(tr => {
        domUtils.append(wrapperTableBody, tr);
      });

      tbody = wrapperTableBody;
    }

    return tbody;
  }

  /**
   * Wrap THEAD followed by TBODY both into Table
   * @param {HTMLElement} container - clipboard container
   * @returns {HTMLElement|null}
   */
  wrapTheadAndTbodyIntoTableIfNeed(container) {
    const danglingThead = domUtils.children(container, 'thead');
    const danglingTbody = domUtils.children(container, 'tbody');
    const wrapperTable = document.createElement('table');
    let table;

    if (!danglingTbody.length && danglingThead.length) {
      domUtils.append(wrapperTable, danglingThead[0]);
      domUtils.append(wrapperTable, this._createTheadOrTboday('tbody'));
      table = wrapperTable;
    } else if (danglingTbody.length && !danglingThead.length) {
      domUtils.append(wrapperTable, this._createTheadOrTboday('thead'));
      domUtils.append(wrapperTable, danglingTbody[0]);
      table = wrapperTable;
    } else if (danglingTbody.length && danglingThead.length) {
      domUtils.append(wrapperTable, danglingThead[0]);
      domUtils.append(wrapperTable, danglingTbody[0]);
      table = wrapperTable;
    }

    return table;
  }

  /**
   * Whether pasting element is table element
   * @param {string} pastingNodeName Pasting node name
   * @returns {boolean}
   */
  isTableOrSubTableElement(pastingNodeName) {
    return (
      pastingNodeName === 'TABLE' ||
      pastingNodeName === 'TBODY' ||
      pastingNodeName === 'THEAD' ||
      pastingNodeName === 'TR' ||
      pastingNodeName === 'TD'
    );
  }

  _createTheadOrTboday(type) {
    const theadOrTbody = document.createElement(type);
    const tr = document.createElement('tr');

    theadOrTbody.appendChild(tr);

    return theadOrTbody;
  }

  /**
   * Stuff table cells into incomplete rows
   * @param {HTMLElement} trs HTMLElement wrapped TRs
   * @param {number} maximumCellLength maximum cell length of table
   * @private
   */
  _stuffTableCellsIntoIncompleteRow(trs, maximumCellLength) {
    toArray(trs).forEach(row => {
      const tableCells = row.querySelectorAll('th,td');
      const parentNodeName = domUtils.getNodeName(row.parentNode);
      const cellTagName = parentNodeName === 'THEAD' ? 'th' : 'td';

      for (let cellLength = tableCells.length; cellLength < maximumCellLength; cellLength += 1) {
        domUtils.append(row, tableCellGenerator(1, cellTagName));
      }
    });
  }

  /**
   * Prepare to table cell stuffing
   * @param {HTMLElement} trs wrapped TRs
   * @returns {{maximumCellLength: *, needTableCellStuffingAid: boolean}}
   */
  prepareToTableCellStuffing(trs) {
    let maximumCellLength = trs[0].querySelectorAll('th,td').length;
    let needTableCellStuffingAid = false;

    toArray(trs).forEach(row => {
      const cellCount = row.querySelectorAll('th,td').length;

      if (maximumCellLength !== cellCount) {
        needTableCellStuffingAid = true;

        if (maximumCellLength < cellCount) {
          maximumCellLength = cellCount;
        }
      }
    });

    return {
      maximumCellLength,
      needTableCellStuffingAid
    };
  }

  /**
   * Add TBODY or THEAD if need
   * @param {HTMLElement} table - Table HTMLElement element
   * @private
   */
  _addTbodyOrTheadIfNeed(table) {
    const isTheadNotExists = !table.querySelector('thead');
    const isTbodyNotExists = !table.querySelector('tbody');

    if (isTheadNotExists) {
      domUtils.prepend(table, '<thead><tr></tr></thead>');
    } else if (isTbodyNotExists) {
      domUtils.append(table, '<tbody><tr></tr></tbody>');
    }
  }

  /**
   * Append table cells
   * @param {HTMLElement} table Table element
   */
  tableCellAppendAidForTableElement(table) {
    this._addTbodyOrTheadIfNeed(table);
    this._addTrIntoContainerIfNeed(table);

    const trs = table.querySelectorAll('tr');
    const tableAidInformation = this.prepareToTableCellStuffing(trs);
    const { maximumCellLength, needTableCellStuffingAid } = tableAidInformation;

    if (needTableCellStuffingAid) {
      this._stuffTableCellsIntoIncompleteRow(trs, maximumCellLength);
    }
  }

  /**
   * Generate THEAD and append TDs with same amount of given TBODY
   * @param {HTMLElement} node TR element
   * @returns {{thead: HTMLElement, tbody: HTMLElement}}
   * @private
   */
  _generateTheadAndTbodyFromTbody(node) {
    const tr = document.createElement('tr');
    const thead = document.createElement('thead');

    domUtils.append(tr, tableCellGenerator(node.querySelector('tr > td').length, 'th'));
    domUtils.append(thead, tr);

    return {
      thead,
      tbody: node
    };
  }

  /**
   * Generate TBODY and append TDs with same amount of given THEAD
   * @param {HTMLElement} node TR element
   * @returns {{thead: HTMLElement, tbody: HTMLElement}}
   * @private
   */
  _generateTheadAndTbodyFromThead(node) {
    const tr = document.createElement('tr');
    const tbody = document.createElement('tbody');

    domUtils.append(tr, tableCellGenerator(node.querySelectorAll('th').length, 'td'));
    domUtils.append(tbody, tr);

    return {
      thead: node,
      tbody
    };
  }

  /**
   * Generate THEAD and TBODY and append given TR within
   * @param {HTMLElement} node TR element
   * @returns {{thead: HTMLElement, tbody: HTMLElement}}
   * @private
   */
  _generateTheadAndTbodyFromTr(node) {
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    let theadRow, tbodyRow;

    if (node.children[0].tagName === 'TH') {
      theadRow = node;
      tbodyRow = domUtils.createElementWith(
        `<tr>${tableCellGenerator(node.querySelectorAll('th').length, 'td')}</tr>`
      );
    } else {
      theadRow = domUtils.createElementWith(
        `<tr>${tableCellGenerator(node.querySelectorAll('td').length, 'th')}</tr>`
      );
      tbodyRow = node;
    }

    domUtils.append(thead, theadRow);
    domUtils.append(tbody, tbodyRow);

    return {
      thead,
      tbody
    };
  }

  /**
   * Complete passed table
   * @param {HTMLElement} node - Table inner element
   * @private
   */
  _completeIncompleteTable(node) {
    const nodeName = node.tagName;
    let table, completedTableContents;

    if (nodeName === 'TABLE') {
      table = node;
    } else {
      table = document.createElement('table');
      node.parentNode.insertBefore(table, node.nextSibling);

      if (nodeName === 'TBODY') {
        completedTableContents = this._generateTheadAndTbodyFromTbody(node);
      } else if (nodeName === 'THEAD') {
        completedTableContents = this._generateTheadAndTbodyFromThead(node);
      } else if (nodeName === 'TR') {
        completedTableContents = this._generateTheadAndTbodyFromTr(node);
      }

      table.appendChild(completedTableContents.thead);
      table.appendChild(completedTableContents.tbody);
    }

    this._removeEmptyRows(table);
    this.tableCellAppendAidForTableElement(table);
  }

  _removeEmptyRows(table) {
    domUtils.findAll(table, 'tr').forEach(tr => {
      if (!tr.cells.length) {
        tr.parentNode.removeChild(tr);
      }
    });
  }

  /**
   * Whole editor body searching incomplete table completion
   * @private
   */
  _completeTableIfNeed() {
    const body = this.wwe.getEditor().getBody();

    toArray(body.children).forEach(node => {
      if (!this.isTableOrSubTableElement(node.nodeName)) {
        return;
      }

      if (node.nodeName === 'TABLE' && !node.querySelector('tbody')) {
        domUtils.remove(node);
      } else {
        this._completeIncompleteTable(node);
      }
    });
  }

  /**
   * Reset _lastCellNode to null
   */
  resetLastCellNode() {
    this._lastCellNode = null;
  }

  /**
   * Set _lastCellNode to given node
   * @param {HTMLElement} node Table cell
   */
  setLastCellNode(node) {
    this._lastCellNode = node;
  }

  /**
   * Return whether only modifier key pressed or not
   * @param {string} keymap Pressed keymap string
   * @returns {boolean}
   * @private
   */
  _isModifierKey(keymap) {
    return /((META|SHIFT|ALT|CONTROL)\+?)/g.test(keymap);
  }

  /**
   * Return whether modifier keys pressed or not
   * @param {object} ev keyboard event object
   * @returns {boolean}
   * @private
   */
  _isModifierKeyPushed(ev) {
    return ev.metaKey || ev.ctrlKey || ev.altKey || ev.shiftKey;
  }

  /**
   * Add one row into empty TBODY
   * @param {HTMLElement} table Currently processing table
   * @private
   */
  _addTrIntoContainerIfNeed(table) {
    toArray(table.children).forEach(container => {
      const hasNoRows = container.querySelectorAll('tr').length === 0;

      if (hasNoRows) {
        domUtils.append(container, '<tr></tr>');
      }
    });
  }

  _expandTableIfNeed(fragment) {
    const range = this.wwe
      .getEditor()
      .getSelection()
      .cloneRange();
    const [table] = domUtils.parents(range.startContainer, 'table');
    const difference = this._getColumnAndRowDifference(fragment, range);

    if (difference.column < 0) {
      this._appendCellForAllRow(table, difference.column);
    }

    if (difference.row < 0) {
      this._appendRow(table, difference.row);
    }
  }

  _getColumnAndRowDifference(fragment, range) {
    const tableData = this._getTableDataFromTable(fragment);
    const rowLength = tableData.length;
    const columnLength = tableData[0].length;
    const currentCell = domUtils.closest(range.startContainer, 'th,td');
    const currentRow = currentCell.parentNode;
    const currentColumnIndex = domUtils.getNodeOffsetOfParent(currentCell);
    let currentRowIndex = domUtils.getNodeOffsetOfParent(currentCell.parentNode);
    const [table] = domUtils.parents(currentRow, 'table');
    const tableColumnLength = table.querySelector('tr').children.length;
    const tableRowLength = table.querySelectorAll('tr').length;
    const isInTbody = !!domUtils.parents(currentRow, 'tbody').length;

    if (isInTbody) {
      currentRowIndex += 1;
    }

    return {
      row: tableRowLength - (currentRowIndex + rowLength),
      column: tableColumnLength - (currentColumnIndex + columnLength)
    };
  }

  _appendCellForAllRow(table, columnDifference) {
    const brString = isIE10 ? '' : '<br />';

    domUtils.findAll(table, 'tr').forEach((row, i) => {
      let tagName;

      for (let index = columnDifference; index < 0; index += 1) {
        if (i === 0) {
          tagName = 'th';
        } else {
          tagName = 'td';
        }
        domUtils.append(row, `<${tagName}>${brString}</${tagName}>`);
      }
    });
  }

  _appendRow(table, rowDifference) {
    const trs = table.querySelectorAll('tr');
    const newRow = trs[trs.length - 1].cloneNode(true);
    const brHTMLSting = isIE10 ? '' : '<br />';

    domUtils.findAll(newRow, 'td').forEach(td => {
      td.innerHTML = brHTMLSting;
    });

    for (; rowDifference < 0; rowDifference += 1) {
      domUtils.append(table.querySelector('tbody'), newRow.cloneNode(true));
    }
  }

  /**
   * Change selection to sibling cell
   * @param {HTMLElement} currentCell current TD or TH
   * @param {Range} range Range object
   * @param {string} direction 'next' or 'previous'
   * @param {string} scale 'row' or 'cell'
   * @private
   */
  _changeSelectionToTargetCell(currentCell, range, direction, scale) {
    const isNext = direction === 'next';
    const isRow = scale === 'row';
    let target;

    if (isRow) {
      target = domUtils.getSiblingRowCellByDirection(currentCell, direction, false);
    } else {
      target = domUtils.getTableCellByDirection(currentCell, direction);
      if (!target) {
        target = domUtils.getSiblingRowCellByDirection(currentCell, direction, true);
      }
    }

    if (target) {
      if (isRow && !isNext) {
        this._moveToCursorEndOfCell(target, range);
      } else {
        range.setStart(target, 0);
      }
      range.collapse(true);
    } else {
      [target] = domUtils.parents(currentCell, 'table');

      if (isNext) {
        range.setStart(target.nextElementSibling, 0);
      } else if (
        target.previousElementSibling &&
        target.previousElementSibling.nodeName !== 'TABLE'
      ) {
        range.setStart(target.previousElementSibling, 1);
      } else {
        range.setStartBefore(target);
      }

      range.collapse(true);
    }
  }

  _moveToCursorEndOfCell(cell, range) {
    let lastListItem;

    if (domUtils.isListNode(cell.lastChild)) {
      lastListItem = domUtils.getLastNodeBy(
        cell.lastChild,
        lastNode => lastNode.nodeName !== 'LI' || lastNode.nextSibling !== null
      );
    }

    const lastText = domUtils.getLastNodeBy(
      lastListItem || cell,
      node => !domUtils.isTextNode(node)
    );

    const lastNode = lastText || lastListItem || cell;
    const offset = lastText ? lastText.length : lastNode.childNodes.length - 1;

    range.setStart(lastNode, offset);
  }

  /**
   * Move cursor to given direction by interval formatter
   * @param {string} direction 'next' or 'previous'
   * @param {string} interval 'row' or 'cell'
   * @param {object} [ev] Event object
   * @returns {boolean | null}
   * @private
   */
  _moveCursorTo(direction, interval, ev) {
    const sq = this.wwe.getEditor();
    const range = sq.getSelection().cloneRange();
    const currentCell = domUtils.closest(range.startContainer, 'td,th');
    let isNeedNext;

    if (range.collapsed && this.wwe.isInTable(range) && currentCell) {
      if (interval === 'row' && !this._isMovedCursorToRow(range, direction)) {
        return isNeedNext;
      }

      if ((direction === 'previous' || interval === 'row') && !isUndefined(ev)) {
        ev.preventDefault();
      }

      this._changeSelectionToTargetCell(currentCell, range, direction, interval);
      sq.setSelection(range);

      isNeedNext = false;
    }

    return isNeedNext;
  }

  _isMovedCursorToRow(range, direction) {
    const { startContainer } = range;

    if (this._isInList(startContainer)) {
      return this._isMovedCursorFromListToRow(startContainer, direction);
    }

    return this._isMovedCursorFromTextToRow(range, direction);
  }

  _isMovedCursorFromListToRow(startContainer, direction) {
    const directionKey = `${direction}Sibling`;
    const listItem = this._findListItem(startContainer);

    const parentOfListItem = domUtils.getParentNodeBy(listItem, (parentNode, currentNode) => {
      const firstOrLastItem =
        currentNode[directionKey] === null && parentNode[directionKey] === null;

      return !domUtils.isCellNode(parentNode) && firstOrLastItem;
    });

    const firstOrLastList =
      domUtils.isListNode(parentOfListItem) && parentOfListItem[directionKey] === null;

    return domUtils.isCellNode(parentOfListItem.parentNode) && firstOrLastList;
  }

  _isMovedCursorFromTextToRow(range, direction) {
    const { startContainer, startOffset } = range;
    const text = domUtils.isCellNode(startContainer)
      ? startContainer.childNodes[startOffset]
      : startContainer;

    const parentOfStyledText = domUtils.getParentNodeBy(
      text,
      parentNode => !domUtils.isCellNode(parentNode) && !domUtils.isTextNode(parentNode)
    );

    const foundSiblingNode = domUtils.getSiblingNodeBy(
      parentOfStyledText,
      direction,
      siblingNode => siblingNode !== null && siblingNode.nodeName !== 'BR'
    );

    return foundSiblingNode && foundSiblingNode[`${direction}Sibling`] === null;
  }

  /**
   * Remove contents and change selection if need
   * @param {Range} range - Range object
   * @param {string} keymap - keymap
   * @param {object} ev - Event object
   * @returns {boolean} - true if contents has been removed
   * @private
   */
  _removeContentsAndChangeSelectionIfNeed(range, keymap, ev) {
    const isTextInput = keymap.length <= 1;
    const isDeleteOperation = keymap === 'BACK_SPACE' || keymap === 'DELETE';
    const selectedCells = this.wwe.componentManager.getManager('tableSelection').getSelectedCells();
    const [firstSelectedCell] = selectedCells;
    let processed = false;

    if (
      (isTextInput || isDeleteOperation) &&
      !this._isModifierKeyPushed(ev) &&
      selectedCells.length
    ) {
      if (isDeleteOperation) {
        this._recordUndoStateIfNeed(range);
      }
      this._removeTableContents(selectedCells);

      this._lastCellNode = firstSelectedCell;

      range.setStart(firstSelectedCell, 0);
      range.collapse(true);
      this.wwe.getEditor().setSelection(range);
      processed = true;
    }

    return processed;
  }

  /**
   * Return new table ID class name string
   * @returns {string}
   */
  getTableIDClassName() {
    const tableClassName = TABLE_CLASS_PREFIX + this.tableID;

    this.tableID += 1;

    return tableClassName;
  }

  /**
   * Destroy.
   */
  destroy() {
    this.eventManager.removeEventHandler('wysiwygRangeChangeAfter.table');
    this.eventManager.removeEventHandler('wysiwygSetValueAfter.table');
    this.eventManager.removeEventHandler('wysiwygProcessHTMLText.table');
    this.eventManager.removeEventHandler('cut.table');
    this.eventManager.removeEventHandler('copyBefore.table');

    forEachOwnProperties(this.keyEventHandlers, (handler, key) =>
      this.wwe.removeKeyEventHandler(key, handler)
    );
  }
}

/**
 * Generate table cell HTML text
 * @param {number} amount Amount of cells
 * @param {string} tagName Tag name of cell 'td' or 'th'
 * @private
 * @returns {string}
 */
function tableCellGenerator(amount, tagName) {
  const brHTMLString = '<br />';
  const cellString = `<${tagName}>${brHTMLString}</${tagName}>`;
  let tdString = '';

  for (let i = 0; i < amount; i += 1) {
    tdString = tdString + cellString;
  }

  return tdString;
}

export default WwTableManager;
