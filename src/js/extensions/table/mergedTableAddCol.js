/**
* @fileoverview Implements mergedTableAddCol. Add Row to selected table.
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import $ from 'jquery';
import util from 'tui-code-snippet';

import Editor from '../editorProxy';
import dataHandler from './tableDataHandler';
import tableRangeHandler from './tableRangeHandler';
import tableRenderer from './tableRenderer';

const {CommandManager} = Editor;

let AddCol;
if (CommandManager) {
  AddCol = CommandManager.command('wysiwyg', /** @lends AddCol */{
    name: 'AddCol',
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
      const $selectedCells = wwe.componentManager.getManager('tableSelection').getSelectedCells();
      const tableRange = tableRangeHandler.getTableSelectionRange(tableData, $selectedCells, $startContainer);

      sq.saveUndoState(range);
      _addColumns(tableData, tableRange);

      const $newTable = tableRenderer.replaceTable($table, tableData);
      const focusCell = _findFocusCell($newTable, tableRange.start.rowIndex, tableRange.end.colIndex);

      tableRenderer.focusToCell(sq, range, focusCell);
    }
  });
}

/**
 * Create column merged cell.
 * @param {number} colMergeWith - column merge start index
 * @param {string} nodeName - node name
 * @returns {{
 *   nodeName: string,
 *   colMerged: boolean,
 *   colMergeWith: number
 * }}
 * @private
 */
function _createColMergedCell(colMergeWith, nodeName) {
  return {
    nodeName,
    colMergeWith
  };
}

/**
 * Create new cell data.
 * @param {Array.<object>} rowData - row data of table data
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of table data
 * @param {object | null} prevCell - previous cell data
 * @returns {object}
 * @private
 */
function _createNewCell(rowData, rowIndex, colIndex, prevCell) {
  const cellData = rowData[colIndex];
  let newCell;

  if (util.isExisty(cellData.colMergeWith)) {
    const {colMergeWith} = cellData;
    const merger = rowData[colMergeWith];
    const lastMergedCellIndex = colMergeWith + merger.colspan - 1;

    if (util.isExisty(merger.rowMergeWith) && prevCell) {
      newCell = util.extend({}, prevCell);
    } else if (lastMergedCellIndex > colIndex) {
      merger.colspan += 1;
      newCell = util.extend({}, cellData);
    }
  } else if (cellData.colspan > 1) {
    cellData.colspan += 1;
    newCell = _createColMergedCell(colIndex, cellData.nodeName);
  }

  if (!newCell) {
    newCell = dataHandler.createBasicCell(rowIndex, colIndex + 1, cellData.nodeName);
  }

  return newCell;
}

/**
 * Create new columns.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} startColIndex - start column index
 * @param {number} endColIndex - end column index
 * @returns {Array.<Array.<object>>}
 * @private
 */
export function _createNewColumns(tableData, startColIndex, endColIndex) {
  const colIndexes = util.range(startColIndex, endColIndex + 1);
  const newColumns = [];
  let prevCells = null;

  tableData.forEach((rowData, rowIndex) => {
    const newCells = colIndexes.map((colIndex, index) => {
      const prevCell = prevCells ? prevCells[index - 1] : null;

      return _createNewCell(rowData, rowIndex, endColIndex, prevCell);
    });

    prevCells = newCells;
    newColumns.push(newCells);
  });

  return newColumns;
}

/**
 * Add columns.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }} tableRange - table selection range
 * @private
 */
export function _addColumns(tableData, tableRange) {
  const endRange = tableRange.end;
  const endColIndex = dataHandler.findColMergedLastIndex(tableData, endRange.rowIndex, endRange.colIndex);
  const newColumns = _createNewColumns(tableData, tableRange.start.colIndex, endColIndex);
  const newColIndex = endColIndex + 1;

  tableData.forEach((rowData, rowIndex) => {
    rowData.splice(...[newColIndex, 0].concat(newColumns[rowIndex]));
  });
}

/**
 * Find focus cell element like td or th.
 * @param {jQuery} $newTable - changed table jQuery element
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @returns {HTMLElement}
 * @private
 */
function _findFocusCell($newTable, rowIndex, colIndex) {
  const tableData = dataHandler.createTableData($newTable);
  const newColIndex = dataHandler.findColMergedLastIndex(tableData, rowIndex, colIndex) + 1;
  const cellElementIndex = dataHandler.findElementIndex(tableData, rowIndex, newColIndex);

  return $newTable.find('tr').eq(cellElementIndex.rowIndex).find('td, th')[cellElementIndex.colIndex];
}

export default AddCol;

