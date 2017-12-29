/**
 * @fileoverview Implements table align column WysiwygCommand
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import CommandManager from '../commandManager';
import domUtil from '../domUtils';

/**
 * AlignCol
 * Align selected column's text content to given direction
 * @extends Command
 * @module wysiwygCommands/TableAlignCol
 * @ignore
 */
const TableAlignCol = CommandManager.command('wysiwyg', /** @lends AlignCol */{
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

      const $table = $(range.startContainer).parents('table');

      const selectionInformation = getSelectionInformation($table, rangeInformation);

      setAlignAttributeToTableCells($table, alignDirection, selectionInformation);
    }
    selectionMgr.removeClassAttrbuteFromAllCellsIfNeed();
  }
});

/**
 * Set Column align
 * @param {jQuery} $table jQuery wrapped TABLE
 * @param {string} alignDirection 'left' or 'center' or 'right'
 * @param {{
 *     startColumnIndex: number,
 *     endColumnIndex: number,
 *     isDivided: boolean
 *     }} selectionInformation start, end column index and boolean value for whether range divided or not
 */
function setAlignAttributeToTableCells($table, alignDirection, selectionInformation) {
  const isDivided = selectionInformation.isDivided || false;
  const start = selectionInformation.startColumnIndex;
  const end = selectionInformation.endColumnIndex;
  const columnLength = $table.find('tr').eq(0).find('td,th').length;

  $table.find('tr').each((n, tr) => {
    $(tr).children('td,th').each((index, cell) => {
      if (isDivided &&
                ((start <= index && index <= columnLength) || (index <= end))
      ) {
        $(cell).attr('align', alignDirection);
      } else if ((start <= index && index <= end)) {
        $(cell).attr('align', alignDirection);
      }
    });
  });
}

/**
 * Return start, end column index and boolean value for whether range divided or not
 * @param {jQuery} $table jQuery wrapped TABLE
 * @param {{startColumnIndex: number, endColumnIndex: number}} rangeInformation Range information
 * @returns {{startColumnIndex: number, endColumnIndex: number, isDivided: boolean}}
 */
function getSelectionInformation($table, rangeInformation) {
  const columnLength = $table.find('tr').eq(0).find('td,th').length;
  const {
    from,
    to
  } = rangeInformation;
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
  const $selectedCells = selectionMgr.getSelectedCells();
  let rangeInformation, startCell;

  if ($selectedCells.length) {
    rangeInformation = selectionMgr.getSelectionRangeFromTable($selectedCells.first().get(0),
      $selectedCells.last().get(0));
  } else {
    const {startContainer} = range;
    startCell = domUtil.isTextNode(startContainer) ? $(startContainer).parent('td,th')[0] : startContainer;
    rangeInformation = selectionMgr.getSelectionRangeFromTable(startCell, startCell);
  }

  return rangeInformation;
}

export default TableAlignCol;
