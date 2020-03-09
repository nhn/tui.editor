/**
 * @fileoverview Implements table remove row WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';
import domUtils from '../utils/dom';

/**
 * RemoveRow
 * remove Row to selected table
 * @extends Command
 * @module wysiwygCommands/TableRemoveRow
 * @ignore
 */
const TableRemoveRow = CommandManager.command(
  'wysiwyg',
  /** @lends RemoveRow */ {
    name: 'RemoveRow',
    /**
     * command handler
     * @param {WysiwygEditor} wwe wysiwygEditor instance
     */
    exec(wwe) {
      const sq = wwe.getEditor();
      const range = sq.getSelection().cloneRange();
      const [table] = domUtils.parents(range.startContainer, 'table');
      const selectionMgr = wwe.componentManager.getManager('tableSelection');
      const tableMgr = wwe.componentManager.getManager('table');
      const trs = getTrs(range, selectionMgr, table);
      const tbodyRowLength = table.querySelectorAll('tbody tr').length;

      wwe.focus();

      if ((sq.hasFormat('TD') || sq.hasFormat('TABLE')) && tbodyRowLength > 1) {
        sq.saveUndoState(range);

        const [firstTr] = trs;
        const lastTr = trs[trs.length - 1];
        const nextFocus =
          lastTr && lastTr.nextSibling ? lastTr.nextSibling : firstTr && firstTr.previousSibling;

        if (nextFocus) {
          focusToFirstTd(sq, range, nextFocus, tableMgr);
        }

        trs.forEach(tr => domUtils.remove(tr));
      }
      selectionMgr.removeClassAttrbuteFromAllCellsIfNeed();
    }
  }
);

/**
 * Focus to first TD in given TR
 * @param {SquireExt} sq Squire instance
 * @param {Range} range Range object
 * @param {HTMLElement} tr HTMLElement wrapped TR
 * @param {object} tableMgr Table manager
 */
function focusToFirstTd(sq, range, tr, tableMgr) {
  const nextFocusCell = tr.querySelector('td');

  range.setStart(nextFocusCell, 0);
  range.collapse(true);

  tableMgr.setLastCellNode(nextFocusCell);
  sq.setSelection(range);
}

/**
 * Get start, end row index from current range
 * @param {HTMLElement} firstSelectedCell Range object
 * @param {object} rangeInformation Range information object
 * @param {HTMLElement} table HTMLElement wrapped TABLE
 * @returns {HTMLElement}
 */
function getSelectedRows(firstSelectedCell, rangeInformation, table) {
  const tbodyRowLength = table.querySelectorAll('tbody tr').length;
  const isStartContainerInThead = domUtils.parents(firstSelectedCell, 'thead').length;
  let startRowIndex = rangeInformation.from.row;
  let endRowIndex = rangeInformation.to.row;

  if (isStartContainerInThead) {
    startRowIndex += 1;
  }

  const isWholeTbodySelected =
    (startRowIndex === 1 || isStartContainerInThead) && endRowIndex === tbodyRowLength;

  if (isWholeTbodySelected) {
    endRowIndex -= 1;
  }

  return domUtils.findAll(table, 'tr').slice(startRowIndex, endRowIndex + 1);
}

/**
 * Get TRs
 * @param {Range} range Range object
 * @param {object} selectionMgr Table selection manager
 * @param {HTMLElement} table current table
 * @returns {Array.<HTMLElement>}
 */
function getTrs(range, selectionMgr, table) {
  const selectedCells = selectionMgr.getSelectedCells();
  let rangeInformation, trs;

  if (selectedCells.length) {
    rangeInformation = selectionMgr.getSelectionRangeFromTable(
      selectedCells[0],
      selectedCells[selectedCells.length - 1]
    );
    trs = getSelectedRows(selectedCells[0], rangeInformation, table);
  } else {
    const cell = domUtils.closest(range.startContainer, 'td,th');

    rangeInformation = selectionMgr.getSelectionRangeFromTable(cell, cell);
    trs = getSelectedRows(cell, rangeInformation, table);
  }

  return trs;
}
export default TableRemoveRow;
