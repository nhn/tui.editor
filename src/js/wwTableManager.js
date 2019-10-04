/**
 * @fileoverview Implements wysiwyg table manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import domUtils from './domUtils';

const isIE10 = util.browser.msie && util.browser.version === 10;
const TABLE_CLASS_PREFIX = 'te-content-table-';
const isIE10And11 = util.browser.msie
    && (util.browser.version === 10 || util.browser.version === 11);
const BASIC_CELL_CONTENT = util.browser.msie ? '' : '<br>';
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
    this.eventManager.listen('wysiwygProcessHTMLText.table', html => html.replace(/<br \/>(<\/td>|<\/th>)/g, '$1'));

    this.eventManager.listen('cut.table', () => {
      const selectionManager = this.wwe.componentManager.getManager('tableSelection');
      const $selectedCells = selectionManager.getSelectedCells();

      if ($selectedCells.length) {
        $selectedCells.get().forEach(cell => ($(cell).html(BASIC_CELL_CONTENT)));
      }

      selectionManager.removeClassAttrbuteFromAllCellsIfNeed();
    });

    this.eventManager.listen('copyBefore.table', ({$clipboardContainer}) => (
      this.updateTableHtmlOfClipboardIfNeed($clipboardContainer)
    ));
  }

  /**
   * Update table html of clipboard data, if has selected cells.
   * @param {jQuery} $clipboardContainer - jQuery element
   */
  updateTableHtmlOfClipboardIfNeed($clipboardContainer) {
    const selectionManager = this.wwe.componentManager.getManager('tableSelection');
    const $selectedCells = selectionManager.getSelectedCells();

    if ($selectedCells.length) {
      selectionManager.createRangeBySelectedCells();

      const fragment = this.wwe.getEditor().getSelection().cloneContents();

      $(fragment).children().each((index, node) => {
        const $node = $(node);

        if (!this.isTableOrSubTableElement(node.nodeName)) {
          return;
        }

        if (node.nodeName === 'TABLE'
                    && $node.find('thead').length === 0
                    && $node.find('tbody').length === 0
        ) {
          $node.remove();
        } else if (node.previousSibling && node.previousSibling.nodeName === 'TABLE') {
          node.previousSibling.appendChild(node);
        } else {
          this._completeIncompleteTable(node);

          if (node.nodeName !== 'TABLE' && node.nodeName !== 'THEAD') {
            $(node).closest('table').find('thead').remove();
          }
        }
      });

      $clipboardContainer.append(fragment);
      $clipboardContainer.find(`.${TABLE_CELL_SELECTED_CLASS_NAME}`).removeClass(TABLE_CELL_SELECTED_CLASS_NAME);
    }
  }

  /**
   * Paste clibpard data that contains only table.
   * @param {Node} clipboardTable - table element of clipboard
   */
  pasteTableData(clipboardTable) {
    const $clipboardTable = $(clipboardTable);
    this._expandTableIfNeed($clipboardTable);
    this._pasteDataIntoTable($clipboardTable);
  }

  /**
   * Initialize key event handler
   * @private
   */
  _initKeyHandler() {
    this.keyEventHandlers = {
      'DEFAULT': (ev, range, keymap) => {
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
      'ENTER': (ev, range) => {
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
      'BACK_SPACE': (ev, range, keymap) => this._handleBackspaceAndDeleteKeyEvent(ev, range, keymap),
      'DELETE': (ev, range, keymap) => this._handleBackspaceAndDeleteKeyEvent(ev, range, keymap),
      'TAB': () => this._moveCursorTo('next', 'cell'),
      'SHIFT+TAB': ev => this._moveCursorTo('previous', 'cell', ev),
      'UP': ev => this._moveCursorTo('previous', 'row', ev),
      'DOWN': ev => this._moveCursorTo('next', 'row', ev)
    };

    util.forEach(this.keyEventHandlers, (handler, key) => this.wwe.addKeyEventHandler(key, handler));
  }

  /**
   * Check whether node is li and empty
   * @param {node} node node
   * @returns {boolean} whether node is li and empty
   * @private
   */
  _isEmptyListItem(node) {
    const {childNodes, nodeName} = node;

    return nodeName === 'LI' && childNodes.length === 1 && childNodes[0].nodeName === 'BR';
  }

  /**
   * Check whether range is in empty LI that is first level
   * @param {range} range range
   * @returns {boolean} whether range is in empty LI that is first level
   * @private
   */
  _isEmptyFirstLevelLI(range) {
    const {collapsed, startContainer, startOffset} = range;

    return collapsed && startOffset === 0
        && this._isEmptyListItem(startContainer)
        && domUtils.isFirstLevelListItem(startContainer);
  }

  /**
   * Check whether range is in style tag that is like 'B', 'I', 'S', 'SPAN', 'CODE'
   * Those tag is supported in Wysiwyg.
   * @param {Range} range range
   * @returns {Boolean} range is in the style tag
   * @private
   */
  _isInStyledText(range) {
    const {startContainer} = range;
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
    const {startContainer, startOffset} = afterRange;

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

    const {parentNode: tdNode, nodeName} = styleNode;
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
    const {parentNode} = container;

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
    return domUtils.getNodeName(domUtils.getChildNodeByOffset(range.startContainer, range.startOffset)) === 'TABLE';
  }

  /**
   * Check whether passed range is right after table or not
   * @param {Range} range range
   * @returns {boolean} result
   * @private
   */
  _isAfterTable(range) {
    const prevElem = domUtils.getPrevOffsetNodeUntil(range.startContainer, range.startOffset);

    return domUtils.getNodeName(prevElem) === 'TABLE' && range.commonAncestorContainer === this.wwe.get$Body()[0];
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
    const $selectedCells = selectionManager.getSelectedCells();
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
      } else if ((!isBackspace && this._isBeforeTable(range))
                || (isBackspace && this._isAfterTable(range))
      ) {
        ev.preventDefault();
        const startOffset = (isBackspace ? range.startOffset - 1 : range.startOffset);
        this._removeTable(range, domUtils.getChildNodeByOffset(range.startContainer, startOffset));
        isNeedNext = false;
      }
    } else if (this.wwe.isInTable(range)) {
      if ($selectedCells.length > 0) {
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
    const {parentNode: listNode, firstChild} = liNode;
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
    return domUtils.getParentUntilBy(targetNode,
      (node) => node && (domUtils.isListNode(node) || node.nodeName === 'LI'),
      (node) => node && (node.nodeName === 'TD' || node.nodeName === 'TH'));
  }

  /**
   * Find LI node while search parentNode inside TD
   * @param {node} startContainer startContainer
   * @returns {node} liNode or null
   * @private
   */
  _findListItem(startContainer) {
    return domUtils.getParentUntilBy(startContainer,
      (node) => node && domUtils.isListNode(node),
      (node) => node && (node.nodeName === 'TD' || node.nodeName === 'TH'));
  }

  /**
   * Backspace handler in table
   * @param {Range} range range
   * @param {Event} event event
   * @private
   */
  _tableHandlerOnBackspace(range, event) {
    const {startContainer, startOffset} = range;
    const liNode = this._findListItem(startContainer);

    if (liNode && startOffset === 0
      && domUtils.isFirstListItem(liNode)
      && domUtils.isFirstLevelListItem(liNode)
    ) {
      this.wwe.getEditor().saveUndoState(range);
      this._moveListItemToPreviousOfList(liNode, range);
      event.preventDefault();
    } else {
      const prevNode = domUtils.getPrevOffsetNodeUntil(startContainer, startOffset, 'TR');
      const prevNodeName = domUtils.getNodeName(prevNode);

      if (prevNodeName === 'BR' && prevNode.parentNode.childNodes.length !== 1) {
        event.preventDefault();
        $(prevNode).remove();
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

    return domUtils.getNodeName(currentNode) === 'BR' && !!nextSibling
        && domUtils.getNodeName(nextSibling) === 'BR';
  }

  _getCurrentNodeInCell(range) {
    const {startContainer, startOffset} = range;
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
    const {startContainer, startOffset} = range;
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
        let {lastChild} = liNode;

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
    let {nextSibling} = parentNode;

    while (nextSibling) {
      const {nextSibling: next} = nextSibling;

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
      const paths = $(range.startContainer).parentsUntil('tr');
      tdOrTh = paths[paths.length - 1];
    }

    const nodeName = domUtils.getNodeName(tdOrTh.lastChild);

    if (nodeName !== 'BR' && nodeName !== 'DIV'
        && nodeName !== 'UL' && nodeName !== 'OL'
        && !isIE10And11
    ) {
      $(tdOrTh).append($('<br />')[0]);
    }
  }

  /**
   * Unwrap default block tag in table
   * For Squire default action making abnormal behavior, remove default blocks in Table after setValue() called
   * @private
   */
  _unwrapBlockInTable() {
    this.wwe.get$Body().find('td div,th div,tr>br,td>br,th>br').each((index, node) => {
      if (domUtils.getNodeName(node) === 'BR') {
        const parentNodeName = domUtils.getNodeName(node.parentNode);
        const isInTableCell = /TD|TH/.test(parentNodeName);
        const isEmptyTableCell = node.parentNode.textContent.length === 0;
        const isLastBR = node.parentNode.lastChild === node;

        if (parentNodeName === 'TR' || (isInTableCell && !isEmptyTableCell && isLastBR)) {
          $(node).remove();
        }
      } else {
        $(node).children().unwrap();
      }
    });
  }

  /**
   * Insert default block between table element
   * @private
   */
  _insertDefaultBlockBetweenTable() {
    this.wwe.get$Body().find('table').each((index, node) => {
      if (node.nextElementSibling
                && node.nextElementSibling.nodeName === 'TABLE'
      ) {
        $('<div><br /></div>').insertAfter(node);
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
      $(table).remove();
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
    const {startContainer} = this.wwe.getEditor().getSelection();
    const tableData = this._getTableDataFromTable(fragment);
    const isTableCell = (startContainer.tagName === 'TD' || startContainer.tagName === 'TH');
    const brString = isIE10 ? '' : '<br />';
    let anchorElement, td, tr, tdContent;

    if (isTableCell) {
      anchorElement = startContainer;
    } else {
      anchorElement = domUtils.getParentUntilBy(startContainer, node => {
        return node.tagName === 'TD' || node.tagName === 'TH';
      }, node => {
        return $(node).closest('table').length === 0;
      });
      anchorElement = anchorElement ? anchorElement.parentNode : null;
    }

    anchorElement = anchorElement ? anchorElement : $(startContainer).find('th,td').get(0);

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
    const $fragment = $(fragment);
    const tableData = [];
    const trs = $fragment.find('tr');

    trs.each((i, tr) => {
      const trData = [];
      const tds = $(tr).children();

      tds.each((index, cell) => {
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
   * @param {jQuery} $selectedCells Selected cells wrapped by jQuery
   * @private
   */
  _removeTableContents($selectedCells) {
    this.wwe.getEditor().saveUndoState();

    $selectedCells.each((i, cell) => {
      const brHTMLString = isIE10 ? '' : '<br />';
      $(cell).html(brHTMLString);
    });
  }

  /**
   * Wrap dangling table cells with new TR
   * @param {jQuery} $container - clipboard container
   * @returns {HTMLElement|null}
   */
  wrapDanglingTableCellsIntoTrIfNeed($container) {
    const danglingTableCells = $container.children('td,th');
    let tr;

    if (danglingTableCells.length) {
      const $wrapperTr = $('<tr></tr>');

      danglingTableCells.each((i, cell) => {
        $wrapperTr.append(cell);
      });

      tr = $wrapperTr.get(0);
    }

    return tr;
  }

  /**
   * Wrap TRs with new TBODY
   * @param {jQuery} $container - clipboard container
   * @returns {HTMLElement|null}
   */
  wrapTrsIntoTbodyIfNeed($container) {
    const danglingTrs = $container.children('tr');
    const ths = danglingTrs.find('th');
    let tbody;

    if (ths.length) {
      ths.each((i, node) => {
        const $node = $(node);
        const td = $('<td></td>');

        td.html($node.html());
        td.insertBefore(node);

        $node.detach();
      });
    }

    if (danglingTrs.length) {
      const $wrapperTableBody = $('<tbody></tbody>');

      danglingTrs.each((i, tr) => {
        $wrapperTableBody.append(tr);
      });

      tbody = $wrapperTableBody.get(0);
    }

    return tbody;
  }

  /**
   * Wrap THEAD followed by TBODY both into Table
   * @param {jQuery} $container - clipboard container
   * @returns {HTMLElement|null}
   */
  wrapTheadAndTbodyIntoTableIfNeed($container) {
    const danglingThead = $container.children('thead');
    const danglingTbody = $container.children('tbody');
    const $wrapperTable = $('<table></table>');
    let table;

    if (!danglingTbody.length && danglingThead.length) {
      $wrapperTable.append(danglingThead[0]);
      $wrapperTable.append('<tbody><tr></tr></tbody>');
      table = $wrapperTable.get(0);
    } else if (danglingTbody.length && !danglingThead.length) {
      $wrapperTable.append('<thead><tr></tr></thead>');
      $wrapperTable.append(danglingTbody[0]);
      table = $wrapperTable.get(0);
    } else if (danglingTbody.length && danglingThead.length) {
      $wrapperTable.append(danglingThead[0]);
      $wrapperTable.append(danglingTbody[0]);
      table = $wrapperTable.get(0);
    }

    return table;
  }

  /**
   * Whether pasting element is table element
   * @param {string} pastingNodeName Pasting node name
   * @returns {boolean}
   */
  isTableOrSubTableElement(pastingNodeName) {
    return (pastingNodeName === 'TABLE' || pastingNodeName === 'TBODY'
            || pastingNodeName === 'THEAD' || pastingNodeName === 'TR' || pastingNodeName === 'TD');
  }

  /**
   * Stuff table cells into incomplete rows
   * @param {jQuery} $trs jQuery wrapped TRs
   * @param {number} maximumCellLength maximum cell length of table
   * @private
   */
  _stuffTableCellsIntoIncompleteRow($trs, maximumCellLength) {
    $trs.each((rowIndex, row) => {
      const $row = $(row);
      const tableCells = $row.find('th,td');
      const parentNodeName = domUtils.getNodeName($row.parent()[0]);
      const cellTagName = parentNodeName === 'THEAD' ? 'th' : 'td';

      for (let cellLength = tableCells.length; cellLength < maximumCellLength; cellLength += 1) {
        $row.append($(tableCellGenerator(1, cellTagName))[0]);
      }
    });
  }

  /**
   * Prepare to table cell stuffing
   * @param {jQuery} $trs jQuery wrapped TRs
   * @returns {{maximumCellLength: *, needTableCellStuffingAid: boolean}}
   */
  prepareToTableCellStuffing($trs) {
    let maximumCellLength = $trs.eq(0).find('th,td').length;
    let needTableCellStuffingAid = false;

    $trs.each((i, row) => {
      const cellCount = $(row).find('th,td').length;

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
   * @param {jQuery} $table - Table jQuery element
   * @private
   */
  _addTbodyOrTheadIfNeed($table) {
    const isTheadNotExists = !$table.find('thead').length;
    const isTbodyNotExists = !$table.find('tbody').length;
    let absentNode;

    if (isTheadNotExists) {
      absentNode = $('<thead><tr></tr></thead>').get(0);
      $table.prepend(absentNode);
    } else if (isTbodyNotExists) {
      absentNode = $('<tbody><tr></tr></tbody>').get(0);
      $table.append(absentNode);
    }
  }

  /**
   * Append table cells
   * @param {HTMLElement} node Table element
   */
  tableCellAppendAidForTableElement(node) {
    const $table = $(node);

    this._addTbodyOrTheadIfNeed($table);
    this._addTrIntoContainerIfNeed($table);

    const $trs = $table.find('tr');
    const tableAidInformation = this.prepareToTableCellStuffing($trs);
    const {maximumCellLength, needTableCellStuffingAid} = tableAidInformation;

    if (needTableCellStuffingAid) {
      this._stuffTableCellsIntoIncompleteRow($trs, maximumCellLength);
    }
  }

  /**
   * Generate THEAD and append TDs with same amount of given TBODY
   * @param {HTMLElement} node TR element
   * @returns {{thead: HTMLElement, tbody: HTMLElement}}
   * @private
   */
  _generateTheadAndTbodyFromTbody(node) {
    const tr = $('<tr></tr>');
    const thead = $('<thead></thead>');

    tr.append(tableCellGenerator($(node).find('tr').eq(0).find('td').length, 'th'));
    thead.append(tr);

    return {
      thead: thead[0],
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
    const tr = $('<tr></tr>');
    const tbody = $('<tbody></tbody>');

    tr.append(tableCellGenerator($(node).find('th').length, 'td'));
    tbody.append(tr);

    return {
      thead: node,
      tbody: tbody[0]
    };
  }

  /**
   * Generate THEAD and TBODY and append given TR within
   * @param {HTMLElement} node TR element
   * @returns {{thead: HTMLElement, tbody: HTMLElement}}
   * @private
   */
  _generateTheadAndTbodyFromTr(node) {
    const $node = $(node);
    const thead = $('<thead></thead>');
    const tbody = $('<tbody></tbody>');
    let theadRow, tbodyRow;

    if ($node.children()[0].tagName === 'TH') {
      theadRow = node;
      tbodyRow = $(`<tr>${tableCellGenerator($node.find('th').length, 'td')}</tr>`).get(0);
    } else {
      theadRow = $(`<tr>${tableCellGenerator($node.find('td').length, 'th')}</tr>`).get(0);
      tbodyRow = node;
    }

    thead.append(theadRow);
    tbody.append(tbodyRow);

    return {
      thead: thead[0],
      tbody: tbody[0]
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
    const trs = table.querySelectorAll('tr');
    util.forEachArray(trs, tr => {
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
    const $body = this.wwe.getEditor().get$Body();

    $body.children().each((index, node) => {
      const $node = $(node);

      if (!this.isTableOrSubTableElement(node.nodeName)) {
        return;
      }

      if (node.nodeName === 'TABLE' && $node.find('tbody').length === 0) {
        $node.remove();
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
    return (ev.metaKey || ev.ctrlKey || ev.altKey || ev.shiftKey);
  }

  /**
   * Add one row into empty TBODY
   * @param {jQuery} $table Currently processing table
   * @private
   */
  _addTrIntoContainerIfNeed($table) {
    const $trContainers = $table.children();

    $trContainers.each((i, container) => {
      const hasNoRows = $(container).find('tr').length === 0;

      if (hasNoRows) {
        $(container).append($('<tr></tr>')[0]);
      }
    });
  }

  _expandTableIfNeed(fragment) {
    const range = this.wwe.getEditor().getSelection().cloneRange();
    const $table = $(range.startContainer).parents('table');
    const difference = this._getColumnAndRowDifference(fragment, range);

    if (difference.column < 0) {
      this._appendCellForAllRow($table, difference.column);
    }

    if (difference.row < 0) {
      this._appendRow($table, difference.row);
    }
  }

  _getColumnAndRowDifference(fragment, range) {
    const tableData = this._getTableDataFromTable(fragment);
    const rowLength = tableData.length;
    const columnLength = tableData[0].length;
    const $currentCell = $(range.startContainer).closest('th,td');
    const $currentRow = $currentCell.parent();
    const currentColumnIndex = domUtils.getNodeOffsetOfParent($currentCell[0]);
    let currentRowIndex = domUtils.getNodeOffsetOfParent($currentCell[0].parentNode);
    const $table = $currentRow.parents('table');
    const tableColumnLength = $table.find('tr').eq(0).children().length;
    const tableRowLength = $table.find('tr').length;
    const isInTbody = $currentRow.parents('tbody').length;

    if (isInTbody) {
      currentRowIndex += 1;
    }

    return {
      row: tableRowLength - (currentRowIndex + rowLength),
      column: tableColumnLength - (currentColumnIndex + columnLength)
    };
  }

  _appendCellForAllRow($table, columnDifference) {
    const brString = isIE10 ? '' : '<br />';

    $table.find('tr').each((i, row) => {
      let tagName;

      for (let index = columnDifference; index < 0; index += 1) {
        if (i === 0) {
          tagName = 'th';
        } else {
          tagName = 'td';
        }
        $(row).append($(`<${tagName}>${brString}</${tagName}>`)[0]);
      }
    });
  }

  _appendRow($table, rowDifference) {
    const newRow = $table.find('tr').last().clone();
    const brHTMLSting = isIE10 ? '' : '<br />';

    newRow.find('td').html(brHTMLSting);

    for (; rowDifference < 0; rowDifference += 1) {
      $table.find('tbody').append(newRow.clone()[0]);
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
      target = $(currentCell).parents('table').get(0);
      if (isNext) {
        range.setStart(target.nextElementSibling, 0);
      } else if (target.previousElementSibling && target.previousElementSibling.nodeName !== 'TABLE') {
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
      lastListItem = domUtils.getLastNodeBy(cell.lastChild,
        (lastNode) => lastNode.nodeName !== 'LI' || lastNode.nextSibling !== null);
    }

    const lastText = domUtils.getLastNodeBy(lastListItem || cell,
      (node) => !domUtils.isTextNode(node));

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
    const currentCell = $(range.startContainer).closest('td,th').get(0);
    let isNeedNext;

    if (range.collapsed && this.wwe.isInTable(range) && currentCell) {
      if (interval === 'row' && !this._isMovedCursorToRow(range, direction)) {
        return isNeedNext;
      }

      if ((direction === 'previous' || interval === 'row') && !util.isUndefined(ev)) {
        ev.preventDefault();
      }

      this._changeSelectionToTargetCell(currentCell, range, direction, interval);
      sq.setSelection(range);

      isNeedNext = false;
    }

    return isNeedNext;
  }

  _isMovedCursorToRow(range, direction) {
    const {startContainer} = range;

    if (this._isInList(startContainer)) {
      return this._isMovedCursorFromListToRow(startContainer, direction);
    }

    return this._isMovedCursorFromTextToRow(range, direction);
  }

  _isMovedCursorFromListToRow(startContainer, direction) {
    const directionKey = `${direction}Sibling`;
    const listItem = this._findListItem(startContainer);

    const parentOfListItem = domUtils.getParentNodeBy(listItem, (parentNode, currentNode) => {
      const firstOrLastItem = currentNode[directionKey] === null &&
        parentNode[directionKey] === null;

      return !domUtils.isCellNode(parentNode) && firstOrLastItem;
    });

    const firstOrLastList = domUtils.isListNode(parentOfListItem) &&
      parentOfListItem[directionKey] === null;

    return domUtils.isCellNode(parentOfListItem.parentNode) && firstOrLastList;
  }

  _isMovedCursorFromTextToRow(range, direction) {
    const {startContainer, startOffset} = range;
    const text = domUtils.isCellNode(startContainer) ?
      startContainer.childNodes[startOffset] : startContainer;

    const parentOfStyledText = domUtils.getParentNodeBy(text,
      (parentNode) => !domUtils.isCellNode(parentNode) &&
        !domUtils.isTextNode(parentNode));

    const foundSiblingNode = domUtils.getSiblingNodeBy(parentOfStyledText, direction,
      (siblingNode) => siblingNode !== null && siblingNode.nodeName !== 'BR');

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
    const isDeleteOperation = (keymap === 'BACK_SPACE' || keymap === 'DELETE');
    const $selectedCells = this.wwe.componentManager.getManager('tableSelection').getSelectedCells();
    const firstSelectedCell = $selectedCells.first().get(0);
    let processed = false;

    if ((isTextInput || isDeleteOperation) && !this._isModifierKeyPushed(ev) && $selectedCells.length) {
      if (isDeleteOperation) {
        this._recordUndoStateIfNeed(range);
      }
      this._removeTableContents($selectedCells);

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
    util.forEach(this.keyEventHandlers, (handler, key) => this.wwe.removeKeyEventHandler(key, handler));
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

