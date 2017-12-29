/**
* @fileoverview Implements mergedTableRemoveRow
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import $ from 'jquery';
import util from 'tui-code-snippet';

import Editor from '../editorProxy';
import dataHandler from './tableDataHandler';
import tableRangeHandler from './tableRangeHandler';
import tableRenderer from './tableRenderer';

const {CommandManager} = Editor;

let RemoveRow;
if (CommandManager) {
  RemoveRow = CommandManager.command('wysiwyg', /** @lends RemoveRow */{
    name: 'RemoveRow',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - wysiwygEditor instance
     */
    exec(wwe) {
      const sq = wwe.getEditor();
      const range = sq.getSelection().cloneRange();

      wwe.focus();

      if (!sq.hasFormat('TABLE')) {
        return;
      }

      const $startContainer = $(range.startContainer);
      const $table = $startContainer.closest('table');
      const tableData = dataHandler.createTableData($table);
      const beforeRowLength = tableData.length;
      const $selectedCells = wwe.componentManager.getManager('tableSelection').getSelectedCells();
      const tableRange = tableRangeHandler.getTableSelectionRange(tableData, $selectedCells, $startContainer);

      sq.saveUndoState(range);
      _removeRow(tableData, tableRange);

      if (tableData.length < 2) {
        $table.remove();
      } else if (beforeRowLength !== tableData.length) {
        const $newTable = tableRenderer.replaceTable($table, tableData);

        const startRowIndex = tableRange.start.rowIndex;
        const focusRowIndex = startRowIndex < tableData.length ? startRowIndex : startRowIndex - 1;
        const focusCell = _findFocusTd($newTable, focusRowIndex, tableRange.start.colIndex);
        tableRenderer.focusToCell(sq, range, focusCell);
      }
    }
  });
}

/**
 * Update rowspan to row merger.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} startRowIndex - start row index
 * @param {number} endRowIndex - end row index
 * @private
 */
function _updateRowspan(tableData, startRowIndex, endRowIndex) {
  util.range(startRowIndex, endRowIndex + 1).forEach(rowIndex => {
    tableData[rowIndex].forEach((cell, cellIndex) => {
      if (util.isExisty(cell.rowMergeWith)) {
        const merger = tableData[cell.rowMergeWith][cellIndex];

        if (merger.rowspan) {
          merger.rowspan -= 1;
        }
      } else if (cell.rowspan > 1) {
        const lastMergedRowIndex = rowIndex + cell.rowspan - 1;

        cell.rowspan -= (endRowIndex - rowIndex + 1);

        if (lastMergedRowIndex > endRowIndex) {
          tableData[endRowIndex + 1][cellIndex] = util.extend({}, cell);
        }
      }
    });
  });
}

/**
 * Update row merge start index to merged cell.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} startRowIndex - start row index
 * @param {number} endRowIndex - end row index
 * @private
 */
function _updateMergeStartIndex(tableData, startRowIndex, endRowIndex) {
  tableData.slice(endRowIndex + 1).forEach(row => {
    row.forEach(cell => {
      if (util.isExisty(cell.rowMergeWith) && cell.rowMergeWith >= startRowIndex) {
        cell.rowMergeWith = endRowIndex + 1;
      }
    });
  });
}

/**
 * Remove row.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }} tableRange - table selection range
 * @private
 */
export function _removeRow(tableData, tableRange) {
  let startRowIndex = tableRange.start.rowIndex;
  const endRange = tableRange.end;
  let endRowIndex = dataHandler.findRowMergedLastIndex(tableData, endRange.rowIndex, endRange.colIndex);
  if (startRowIndex === 0 && endRowIndex === 0) {
    return;
  }

  startRowIndex = Math.max(startRowIndex, 1);
  endRowIndex = Math.max(endRowIndex, 1);
  const removeCount = endRowIndex - startRowIndex + 1;

  // if only table body or table header left, remove table
  if (tableData.length - removeCount < 2) {
    tableData.splice(0, tableData.length);
  } else {
    _updateRowspan(tableData, startRowIndex, endRowIndex);
    _updateMergeStartIndex(tableData, startRowIndex, endRowIndex);

    tableData.splice(startRowIndex, removeCount);
  }
}

/**
 * Find focus td element.
 * @param {jQuery} $newTable - changed table jQuery element
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @returns {HTMLElement}
 * @private
 */
function _findFocusTd($newTable, rowIndex, colIndex) {
  const tableData = dataHandler.createTableData($newTable);

  if (tableData.length - 1 < rowIndex) {
    rowIndex -= 1;
  }

  const cellElementIndex = dataHandler.findElementIndex(tableData, rowIndex, colIndex);

  return $newTable.find('tr').eq(cellElementIndex.rowIndex).find('th,td')[cellElementIndex.colIndex];
}

export default RemoveRow;

