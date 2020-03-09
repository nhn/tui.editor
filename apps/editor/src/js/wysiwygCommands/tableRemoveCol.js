/**
 * @fileoverview Implements table remove column WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';
import inArray from 'tui-code-snippet/array/inArray';

import CommandManager from '../commandManager';
import domUtils from '../utils/dom';

/**
 * RemoveCol
 * remove Row to selected table
 * @extends Command
 * @module wysiwygCommands/TableRemoveCol
 * @ignore
 */
const TableRemoveCol = CommandManager.command(
  'wysiwyg',
  /** @lends RemoveCol */ {
    name: 'RemoveCol',
    /**
     * command handler
     * @param {WysiwygEditor} wwe wysiwygEditor instance
     */
    exec(wwe) {
      const sq = wwe.getEditor();
      const range = sq.getSelection().cloneRange();
      const [table] = domUtils.parents(range.startContainer, 'table');
      const tableMgr = wwe.componentManager.getManager('table');
      const selectionMgr = wwe.componentManager.getManager('tableSelection');
      const hasMultipleCols =
        domUtils.closest(range.startContainer, 'table').querySelectorAll('thead tr th').length > 1;

      wwe.focus();
      // IE 800a025e error on removing part of selection range. collapse
      range.collapse(true);
      sq.setSelection(range);

      if (sq.hasFormat('TR', null, range) && hasMultipleCols) {
        const trs = table.querySelectorAll('tbody tr');
        const tbodyColLength = trs.length ? trs[0].querySelectorAll('td').length : 0;
        const selectedCells = selectionMgr.getSelectedCells();

        if (selectedCells.length < tbodyColLength) {
          sq.saveUndoState(range);
          let nextFocus;

          if (selectedCells.length > 1) {
            const tailCell = selectedCells[selectedCells.length - 1];
            const [headCell] = selectedCells;

            nextFocus = tailCell.nextSibling ? tailCell.nextSibling : headCell.previousSibling;

            removeMultipleColsByCells(selectedCells);
          } else {
            const cell = getCellByRange(range);

            nextFocus = cell.nextSibling ? cell.nextSibling : cell.previousSibling;

            removeColByCell(cell);
          }

          focusToCell(sq, nextFocus, tableMgr);
        }
      }
    }
  }
);

/**
 * Get cell by range object
 * @param {Range} range range
 * @returns {HTMLElement|Node}
 */
function getCellByRange(range) {
  let cell = range.startContainer;

  if (domUtils.getNodeName(cell) !== 'TD' && !domUtils.getNodeName(cell) === 'TH') {
    cell = domUtils.parentsUntil(cell, 'tr');
  }

  return cell;
}

/**
 * Remove columns by given cells
 * @param {HTMLElement} cells - table cells
 */
function removeMultipleColsByCells(cells) {
  const numberOfCells = cells.length;

  for (let i = 0; i < numberOfCells; i += 1) {
    const cellToDelete = cells[i];

    if (cellToDelete) {
      removeColByCell(cells[i]);
    }
  }
}

/**
 * Remove column by given cell
 * @param {HTMLElement} cell - wrapped table cell
 */
function removeColByCell(cell) {
  const [table] = domUtils.parents(cell, 'table');

  if (table) {
    const index = inArray(cell, toArray(cell.parentNode.childNodes));

    domUtils.findAll(table, 'tr').forEach(tr => {
      const td = tr.children[index];

      domUtils.remove(td);
    });
  }
}

/**
 * Focus to given cell
 * @param {Squire} sq - Squire instance
 * @param {HTMLElement} cell - wrapped table cell
 * @param {object} tableMgr - Table manager instance
 */
function focusToCell(sq, cell, tableMgr) {
  const nextFocusCell = cell;

  if (cell && domUtils.isContain(document.body, cell)) {
    const range = sq.getSelection();

    range.selectNodeContents(cell);
    range.collapse(true);
    sq.setSelection(range);

    tableMgr.setLastCellNode(nextFocusCell);
  }
}

export default TableRemoveCol;
