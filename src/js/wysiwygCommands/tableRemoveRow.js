/**
 * @fileoverview Implements table remove row WysiwygCommand
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import CommandManager from '../commandManager';

/**
 * RemoveRow
 * remove Row to selected table
 * @extends Command
 * @module wysiwygCommands/TableRemoveRow
 * @ignore
 */
const TableRemoveRow = CommandManager.command('wysiwyg', /** @lends RemoveRow */{
  name: 'RemoveRow',
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec(wwe) {
    const sq = wwe.getEditor();
    const range = sq.getSelection().cloneRange();
    const $table = $(range.startContainer).parents('table');
    const selectionMgr = wwe.componentManager.getManager('tableSelection');
    const tableMgr = wwe.componentManager.getManager('table');
    const $tr = getTrs(range, selectionMgr, $table);
    const tbodyRowLength = $table.find('tbody tr').length;

    wwe.focus();

    if ((sq.hasFormat('TD') || sq.hasFormat('TABLE')) && tbodyRowLength > 1) {
      sq.saveUndoState(range);
      const $nextFocus = $tr.last().next()[0] ? $tr.last().next() : $tr.first().prev();

      if ($nextFocus.length) {
        focusToFirstTd(sq, range, $nextFocus, tableMgr);
      }
      $tr.remove();
    }
    selectionMgr.removeClassAttrbuteFromAllCellsIfNeed();
  }
});

/**
 * Focus to first TD in given TR
 * @param {SquireExt} sq Squire instance
 * @param {Range} range Range object
 * @param {jQuery} $tr jQuery wrapped TR
 * @param {object} tableMgr Table manager
 */
function focusToFirstTd(sq, range, $tr, tableMgr) {
  const nextFocusCell = $tr.find('td').get(0);
  range.setStart(nextFocusCell, 0);
  range.collapse(true);

  tableMgr.setLastCellNode(nextFocusCell);
  sq.setSelection(range);
}

/**
 * Get start, end row index from current range
 * @param {HTMLElement} firstSelectedCell Range object
 * @param {object} rangeInformation Range information object
 * @param {jQuery} $table jquery wrapped TABLE
 * @returns {jQuery}
 */
function getSelectedRows(firstSelectedCell, rangeInformation, $table) {
  const tbodyRowLength = $table.find('tbody tr').length;
  const isStartContainerInThead = $(firstSelectedCell).parents('thead').length;
  let startRowIndex = rangeInformation.from.row;
  let endRowIndex = rangeInformation.to.row;

  if (isStartContainerInThead) {
    startRowIndex += 1;
  }

  const isWholeTbodySelected = (startRowIndex === 1 || isStartContainerInThead) && endRowIndex === tbodyRowLength;

  if (isWholeTbodySelected) {
    endRowIndex -= 1;
  }

  return $table.find('tr').slice(startRowIndex, endRowIndex + 1);
}

/**
 * Get TRs
 * @param {Range} range Range object
 * @param {object} selectionMgr Table selection manager
 * @param {jQuery} $table current table
 * @returns {jQuery}
 */
function getTrs(range, selectionMgr, $table) {
  const $selectedCells = selectionMgr.getSelectedCells();
  let rangeInformation, trs;

  if ($selectedCells.length) {
    rangeInformation = selectionMgr.getSelectionRangeFromTable($selectedCells.first().get(0),
      $selectedCells.last().get(0));
    trs = getSelectedRows($selectedCells.first()[0], rangeInformation, $table);
  } else {
    const cell = $(range.startContainer).closest('td,th').get(0);
    rangeInformation = selectionMgr.getSelectionRangeFromTable(cell, cell);
    trs = getSelectedRows(cell, rangeInformation, $table);
  }

  return trs;
}
export default TableRemoveRow;
