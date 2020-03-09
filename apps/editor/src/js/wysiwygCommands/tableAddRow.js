/**
 * @fileoverview Implements table add row WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import browser from 'tui-code-snippet/browser/browser';
import matches from 'tui-code-snippet/domUtil/matches';

import CommandManager from '../commandManager';
import domUtils from '../utils/dom';

/**
 * AddRow
 * Add Row to selected table
 * @extends Command
 * @module wysiwygCommands/TableAddRow
 * @ignore
 */
const TableAddRow = CommandManager.command(
  'wysiwyg',
  /** @lends AddRow */ {
    name: 'AddRow',
    /**
     * command handler
     * @param {WysiwygEditor} wwe wysiwygEditor instance
     */
    exec(wwe) {
      const sq = wwe.getEditor();
      const range = sq.getSelection().cloneRange();
      const selectedRowLength = getSelectedRowsLength(wwe);
      let tr, newRow;

      wwe.focus();

      if (sq.hasFormat('TD')) {
        sq.saveUndoState(range);
        tr = domUtils.closest(range.startContainer, 'tr');
        for (let i = 0; i < selectedRowLength; i += 1) {
          newRow = getNewRow(tr);
          domUtils.insertAfter(newRow, tr);
        }

        focusToFirstTd(sq, newRow);
      } else if (sq.hasFormat('TH')) {
        sq.saveUndoState(range);
        tr = domUtils.closest(range.startContainer, 'tr');

        const [thead] = domUtils.parents(tr, 'thead');
        const tbody = thead.nextSibling;

        if (matches(tbody, 'tbody')) {
          [tr] = domUtils.children(tbody, 'tr');
        }

        for (let i = 0; i < selectedRowLength; i += 1) {
          newRow = getNewRow(tr);
          domUtils.insertBefore(newRow, tr);
        }

        focusToFirstTd(sq, newRow);
      }
    }
  }
);

/**
 * get number of selected rows
 * @param {WysiwygEditor} wwe - wysiwygEditor instance
 * @returns {number} - number of selected rows
 * @ignore
 */
function getSelectedRowsLength(wwe) {
  const selectionMgr = wwe.componentManager.getManager('tableSelection');
  const selectedCells = selectionMgr.getSelectedCells();
  let length = 1;

  if (selectedCells.length > 1) {
    const [first] = selectedCells;
    const last = selectedCells[selectedCells.length - 1];
    const range = selectionMgr.getSelectionRangeFromTable(first, last);

    length = range.to.row - range.from.row + 1;
  }

  return length;
}

/**
 * Get new row of given row
 * @param {HTMLElement} tr - wrapped table row
 * @returns {HTMLElement} - new cloned element
 * @ignore
 */
function getNewRow(tr) {
  const cloned = tr.cloneNode(true);
  const htmlString = browser.msie ? '' : '<br />';

  domUtils.findAll(cloned, 'td').forEach(td => {
    td.innerHTML = htmlString;
  });

  return cloned;
}

/**
 * Focus to first table cell
 * @param {Squire} sq - Squire instance
 * @param {HTMLElement} tr - wrapped table row
 * @ignore
 */
function focusToFirstTd(sq, tr) {
  const range = sq.getSelection();

  range.selectNodeContents(tr.querySelector('td'));
  range.collapse(true);
  sq.setSelection(range);
}

export default TableAddRow;
