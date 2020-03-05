/**
 * @fileoverview Implements table align column WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';

import CommandManager from '../commandManager';
import domUtils from '../utils/dom';

/**
 * AlignCol
 * Align selected column's text content to given direction
 * @extends Command
 * @module wysiwygCommands/TableAlignCol
 * @ignore
 */
const TableAlignCol = CommandManager.command(
  'wysiwyg',
  /** @lends AlignCol */ {
    name: 'AlignCol',
    /**
     * command handler
     * @param {WysiwygEditor} wwe wysiwygEditor instance
     * @param {string} alignDirection Align direction
     */
    exec(wwe, alignDirection) {
      const sq = wwe.getEditor();
      const range = sq.getSelection().cloneRange();
      const selectionMgr = wwe.componentManager.getManager('tableSelection');
      const rangeInformation = getRangeInformation(range, selectionMgr);

      wwe.focus();

      if (sq.hasFormat('TR')) {
        sq.saveUndoState(range);

        const [table] = domUtils.parents(range.startContainer, 'table');
        const selectionInformation = getSelectionInformation(table, rangeInformation);

        setAlignAttributeToTableCells(table, alignDirection, selectionInformation);
      }
      selectionMgr.removeClassAttrbuteFromAllCellsIfNeed();
    }
  }
);

/**
 * Set Column align
 * @param {HTMLElement} table wrapped TABLE
 * @param {string} alignDirection 'left' or 'center' or 'right'
 * @param {{
 *     startColumnIndex: number,
 *     endColumnIndex: number,
 *     isDivided: boolean
 *     }} selectionInformation start, end column index and boolean value for whether range divided or not
 */
function setAlignAttributeToTableCells(table, alignDirection, selectionInformation) {
  const isDivided = selectionInformation.isDivided || false;
  const start = selectionInformation.startColumnIndex;
  const end = selectionInformation.endColumnIndex;
  const trs = domUtils.findAll(table, 'tr');
  const columnLength = trs.length ? trs[0].querySelectorAll('td,th').length : 0;

  trs.forEach(tr => {
    const cells = toArray(domUtils.children(tr, 'td,th'));

    cells.forEach((cell, index) => {
      if (isDivided && ((start <= index && index <= columnLength) || index <= end)) {
        cell.setAttribute('align', alignDirection);
      } else if (start <= index && index <= end) {
        cell.setAttribute('align', alignDirection);
      }
    });
  });
}

/**
 * Return start, end column index and boolean value for whether range divided or not
 * @param {HTMLElement} table wrapped TABLE
 * @param {{startColumnIndex: number, endColumnIndex: number}} rangeInformation Range information
 * @returns {{startColumnIndex: number, endColumnIndex: number, isDivided: boolean}}
 */
function getSelectionInformation(table, rangeInformation) {
  const trs = table.querySelectorAll('tr');
  const columnLength = trs.length ? trs[0].querySelectorAll('td,th').length : 0;
  const { from, to } = rangeInformation;
  let startColumnIndex, endColumnIndex, isDivided;

  if (from.row === to.row) {
    startColumnIndex = from.cell;
    endColumnIndex = to.cell;
  } else if (from.row < to.row) {
    if (from.cell <= to.cell) {
      startColumnIndex = 0;
      endColumnIndex = columnLength - 1;
    } else {
      startColumnIndex = from.cell;
      endColumnIndex = to.cell;
      isDivided = true;
    }
  }

  return {
    startColumnIndex,
    endColumnIndex,
    isDivided
  };
}

/**
 * Get range information
 * @param {Range} range Range object
 * @param {object} selectionMgr Table selection manager
 * @returns {object}
 */
function getRangeInformation(range, selectionMgr) {
  const selectedCells = selectionMgr.getSelectedCells();
  let rangeInformation, startCell;

  if (selectedCells.length) {
    rangeInformation = selectionMgr.getSelectionRangeFromTable(
      selectedCells[0],
      selectedCells[selectedCells.length - 1]
    );
  } else {
    const { startContainer } = range;

    startCell = domUtils.isTextNode(startContainer)
      ? domUtils.parent(startContainer, 'td,th')
      : startContainer;
    rangeInformation = selectionMgr.getSelectionRangeFromTable(startCell, startCell);
  }

  return rangeInformation;
}

export default TableAlignCol;
