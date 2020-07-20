/**
 * @fileoverview Implements table add column WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';
import inArray from 'tui-code-snippet/array/inArray';
import browser from 'tui-code-snippet/browser/browser';

import CommandManager from '../commandManager';
import domUtils from '../utils/dom';

/**
 * AddCol
 * Add col to selected table
 * @extends Command
 * @module wysiwygCommands/TableAddCol
 * @ignore
 */
const TableAddCol = CommandManager.command(
  'wysiwyg',
  /** @lends AddCol */ {
    name: 'AddCol',
    /**
     * command handler
     * @param {WysiwygEditor} wwe wysiwygEditor instance
     */
    exec(wwe) {
      const sq = wwe.getEditor();
      const range = sq.getSelection().cloneRange();
      const numberOfCols = getNumberOfCols(wwe);
      let cell;

      wwe.focus();

      if (sq.hasFormat('TR')) {
        sq.saveUndoState(range);

        cell = getCellByRange(range);
        addColToCellAfter(cell, numberOfCols);

        focusToNextCell(sq, cell);
      }
    }
  }
);

/**
 * get number of selected cols
 * @param {WysiwygEditor} wwe - wysiwyg editor instance
 * @returns {number} - number of selected cols
 * @ignore
 */
function getNumberOfCols(wwe) {
  const selectionMgr = wwe.componentManager.getManager('tableSelection');
  const selectedCells = selectionMgr.getSelectedCells();
  let length = 1;

  if (selectedCells.length > 0) {
    const maxLength = selectedCells[0].parentNode.querySelectorAll('td, th').length;

    length = Math.min(maxLength, selectedCells.length);
  }

  return length;
}

/**
 * Get cell by range object
 * @param {Range} range - range
 * @returns {HTMLElement} - html element
 * @ignore
 */
function getCellByRange(range) {
  let cell = range.startContainer;

  if (domUtils.getNodeName(cell) !== 'TD' && domUtils.getNodeName(cell) !== 'TH') {
    cell = domUtils.closest(cell, 'td, th');
  }

  return cell;
}

/**
 * Add column to after the current cell
 * @param {HTMLElement} cell - wrapped table cell
 * @param {number} [numberOfCols=1] - number of cols
 * @ignore
 */
function addColToCellAfter(cell, numberOfCols = 1) {
  const [table] = domUtils.parents(cell, 'table');

  if (table) {
    const index = inArray(cell, toArray(cell.parentNode.childNodes));
    let cellToAdd;

    domUtils.findAll(table, 'tr').forEach(tr => {
      const isTBody = domUtils.getNodeName(tr.parentNode) === 'TBODY';
      const isMSIE = browser.msie;
      const currentCell = tr.children[index];

      for (let i = 0; i < numberOfCols; i += 1) {
        if (isTBody) {
          cellToAdd = document.createElement('td');
        } else {
          cellToAdd = document.createElement('th');
        }
        if (!isMSIE) {
          cellToAdd.appendChild(document.createElement('br'));
        }
        domUtils.insertAfter(cellToAdd, currentCell);
      }
    });
  }
}

/**
 * Focus to next cell
 * @param {Squire} sq - Squire instance
 * @param {HTMLElement} cell - wrapped table cell
 * @ignore
 */
function focusToNextCell(sq, cell) {
  const range = sq.getSelection();

  range.selectNodeContents(cell.nextSibling);
  range.collapse(true);

  sq.setSelection(range);
}

export default TableAddCol;
