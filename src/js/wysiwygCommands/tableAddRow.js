/**
 * @fileoverview Implements table add row WysiwygCommand
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import CommandManager from '../commandManager';

/**
 * AddRow
 * Add Row to selected table
 * @extends Command
 * @module wysiwygCommands/TableAddRow
 * @ignore
 */
const TableAddRow = CommandManager.command('wysiwyg', /** @lends AddRow */{
  name: 'AddRow',
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec(wwe) {
    const sq = wwe.getEditor();
    const range = sq.getSelection().cloneRange();
    const selectedRowLength = getSelectedRowsLength(wwe);
    let $tr, $newRow;

    wwe.focus();

    if (sq.hasFormat('TD')) {
      sq.saveUndoState(range);
      $tr = $(range.startContainer).closest('tr');
      for (let i = 0; i < selectedRowLength; i += 1) {
        $newRow = getNewRow($tr);
        $newRow.insertAfter($tr);
      }

      focusToFirstTd(sq, $newRow);
    } else if (sq.hasFormat('TH')) {
      sq.saveUndoState(range);
      $tr = $(range.startContainer).parents('thead').next('tbody').children('tr').eq(0);
      for (let i = 0; i < selectedRowLength; i += 1) {
        $newRow = getNewRow($tr);
        $newRow.insertBefore($tr);
      }

      focusToFirstTd(sq, $newRow);
    }
  }
});

/**
 * get number of selected rows
 * @param {WysiwygEditor} wwe - wysiwygEditor instance
 * @returns {number} - number of selected rows
 * @ignore
 */
function getSelectedRowsLength(wwe) {
  const selectionMgr = wwe.componentManager.getManager('tableSelection');
  const $selectedCells = selectionMgr.getSelectedCells();
  let length = 1;

  if ($selectedCells.length > 1) {
    const first = $selectedCells.first().get(0);
    const last = $selectedCells.last().get(0);
    const range = selectionMgr.getSelectionRangeFromTable(first, last);
    length = range.to.row - range.from.row + 1;
  }

  return length;
}

/**
 * Get new row of given row
 * @param {jQuery} $tr - jQuery wrapped table row
 * @returns {jQuery} - new cloned jquery element
 * @ignore
 */
function getNewRow($tr) {
  const cloned = $tr.clone();
  const htmlString = util.browser.msie ? '' : '<br />';

  cloned.find('td').html(htmlString);

  return cloned;
}

/**
 * Focus to first table cell
 * @param {Squire} sq - Squire instance
 * @param {jQuery} $tr - jQuery wrapped table row
 * @ignore
 */
function focusToFirstTd(sq, $tr) {
  const range = sq.getSelection();

  range.selectNodeContents($tr.find('td')[0]);
  range.collapse(true);
  sq.setSelection(range);
}

export default TableAddRow;
