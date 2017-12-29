/**
 * @fileoverview Implements table remove column WysiwygCommand
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import CommandManager from '../commandManager';
import domUtils from '../domUtils';

/**
 * RemoveCol
 * remove Row to selected table
 * @extends Command
 * @module wysiwygCommands/TableRemoveCol
 * @ignore
 */
const TableRemoveCol = CommandManager.command('wysiwyg', /** @lends RemoveCol */{
  name: 'RemoveCol',
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec(wwe) {
    const sq = wwe.getEditor();
    const range = sq.getSelection().cloneRange();
    const tableMgr = wwe.componentManager.getManager('table');
    const selectionMgr = wwe.componentManager.getManager('tableSelection');
    const isAbleToRemoveColumn = $(range.startContainer).closest('table').find('thead tr th').length > 1;

    wwe.focus();
    // IE 800a025e error on removing part of selection range. collpase
    range.collapse(true);
    sq.setSelection(range);

    if (sq.hasFormat('TR', null, range) && isAbleToRemoveColumn) {
      sq.saveUndoState(range);
      let $nextFocus, $cell;

      const $selectedCellsByManager = selectionMgr.getSelectedCells();
      if ($selectedCellsByManager.length > 1) {
        const $tailCell = $selectedCellsByManager.last();
        const $headCell = $selectedCellsByManager.first();
        $nextFocus = $tailCell.next().length > 0 ? $tailCell.next() : $headCell.prev();

        removeMultipleColsByCells($selectedCellsByManager);
      } else {
        $cell = getCellByRange(range);
        $nextFocus = $cell.next().length ? $cell.next() : $cell.prev();

        removeColByCell($cell);
      }

      focusToCell(sq, $nextFocus, tableMgr);
    }
  }
});

/**
 * Get cell by range object
 * @param {Range} range range
 * @returns {HTMLElement|Node}
 */
function getCellByRange(range) {
  let cell = range.startContainer;

  if (domUtils.getNodeName(cell) === 'TD' || domUtils.getNodeName(cell) === 'TH') {
    cell = $(cell);
  } else {
    cell = $(cell).parentsUntil('tr');
  }

  return cell;
}

/**
 * Remove columns by given cells
 * @param {jQuery} $cells - jQuery table cells
 */
function removeMultipleColsByCells($cells) {
  const numberOfCells = $cells.length;
  for (let i = 0; i < numberOfCells; i += 1) {
    const $cellToDelete = $cells.eq(i);
    if ($cellToDelete.length > 0) {
      removeColByCell($cells.eq(i));
    }
  }
}

/**
 * Remove column by given cell
 * @param {jQuery} $cell - jQuery wrapped table cell
 */
function removeColByCell($cell) {
  const index = $cell.index();

  $cell.parents('table').find('tr').each((n, tr) => {
    $(tr).children().eq(index).remove();
  });
}

/**
 * Focus to given cell
 * @param {Squire} sq - Squire instance
 * @param {jQuery} $cell - jQuery wrapped table cell
 * @param {object} tableMgr - Table manager instance
 */
function focusToCell(sq, $cell, tableMgr) {
  const nextFocusCell = $cell.get(0);

  if ($cell.length && $.contains(document, $cell)) {
    const range = sq.getSelection();
    range.selectNodeContents($cell[0]);
    range.collapse(true);
    sq.setSelection(range);

    tableMgr.setLastCellNode(nextFocusCell);
  }
}

export default TableRemoveCol;
