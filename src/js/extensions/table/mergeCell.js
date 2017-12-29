/**
* @fileoverview Implements MergeCell
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import $ from 'jquery';
import util from 'tui-code-snippet';

import Editor from '../editorProxy';
import dataHandler from './tableDataHandler';
import tableRangeHandler from './tableRangeHandler';
import tableRenderer from './tableRenderer';

const {CommandManager} = Editor;
const BASIC_CELL_CONTENT = util.browser.msie ? '' : '<br>';

let MergeCell;
if (CommandManager) {
  MergeCell = CommandManager.command('wysiwyg', /** @lends MergeCell */{
    name: 'MergeCells',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - wysiwygEditor instance
     */
    exec(wwe) {
      const sq = wwe.getEditor();

      wwe.focus();

      if (!sq.hasFormat('TABLE')) {
        return;
      }

      const selectionManager = wwe.componentManager.getManager('tableSelection');
      const $selectedCells = selectionManager.getSelectedCells();

      if ($selectedCells.length < 2 || selectionManager.hasSelectedBothThAndTd($selectedCells)) {
        return;
      }

      const range = sq.getSelection().cloneRange();
      const $startContainer = $(range.startContainer);
      const $table = $startContainer.closest('table');
      const tableData = dataHandler.createTableData($table);
      const tableRange = tableRangeHandler.getTableSelectionRange(tableData, $selectedCells, $startContainer);

      _mergeCells(tableData, tableRange);

      const $newTable = tableRenderer.replaceTable($table, tableData);
      const focusCell = _findFocusCell($newTable, tableRange.start.rowIndex, tableRange.start.colIndex);

      tableRenderer.focusToCell(sq, range, focusCell);
    }
  });
}

/**
 * Pick merger content from selected cells.
 * @param {Array.<Array.<object>>} targetRows - target rows
 * @param {number} startColIndex - start column index
 * @param {number} endColIndex - end column index
 * @returns {string}
 * @private
 */
function _pickContent(targetRows, startColIndex, endColIndex) {
  const limitColIndex = endColIndex + 1;
  const cells = [].concat(...targetRows.map(rowData => rowData.slice(startColIndex, limitColIndex)));
  const foundCellData = cells.filter(({content}) => content && content !== BASIC_CELL_CONTENT);

  return foundCellData.length ? foundCellData[0].content : BASIC_CELL_CONTENT;
}

/**
 * Initialize cell data of target rows.
 * @param {Array.<Array.<object>>} targetRows - target rows
 * @param {number} startColIndex - start column index
 * @param {number} endColIndex - end column index
 * @private
 */
function _initCellData(targetRows, startColIndex, endColIndex) {
  const limitColIndex = endColIndex + 1;
  const targetCells = targetRows.map(rowData => rowData.slice(startColIndex, limitColIndex));

  [].concat(...targetCells).slice(1).forEach(cellData => {
    const {nodeName} = cellData;

    util.forEach(cellData, (value, name) => (delete cellData[name]));
    cellData.nodeName = nodeName;
  });
}

/**
 * Update rowMergeWith property of target rows for row merge.
 * @param {Array.<Array.<object>>} targetRows - target rows
 * @param {number} startColIndex - start column index
 * @param {number} endColIndex - end column index
 * @param {number} rowMergeWith - index of row merger
 * @private
 */
function _updateRowMergeWith(targetRows, startColIndex, endColIndex, rowMergeWith) {
  const limitColIndex = endColIndex + 1;

  targetRows.forEach(rowData => {
    rowData.slice(startColIndex, limitColIndex).forEach(cellData => {
      cellData.rowMergeWith = rowMergeWith;
    });
  });
}

/**
 * Update colMergeWith property of target rows for column merge.
 * @param {Array.<Array.<object>>} targetRows - target rows
 * @param {number} startColIndex - start column index
 * @param {number} endColIndex - end column index
 * @param {number} colMergeWith - index of column merger
 * @private
 */
function _updateColMergeWith(targetRows, startColIndex, endColIndex, colMergeWith) {
  const limitColIndex = endColIndex + 1;

  targetRows.forEach(rowData => {
    rowData.slice(startColIndex, limitColIndex).forEach(cellData => {
      cellData.colMergeWith = colMergeWith;
    });
  });
}

/**
 * Merge selected cells.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{rowIndex: number, colIndex: number}} startRange - start table selection range
 * @param {{rowIndex: number, colIndex: number}} endRange - end table selection range
 * @private
 */
export function _mergeCells(tableData, {start: startRange, end: endRange}) {
  const startRowIndex = startRange.rowIndex;
  const startColIndex = startRange.colIndex;
  const endRowIndex = endRange.rowIndex;
  const endColIndex = endRange.colIndex;
  const merger = tableData[startRowIndex][startColIndex];
  const targetRows = tableData.slice(startRowIndex, endRowIndex + 1);
  const rowspan = endRowIndex - startRowIndex + 1;
  const colspan = endColIndex - startColIndex + 1;

  merger.rowspan = rowspan;
  merger.colspan = colspan;
  merger.content = _pickContent(targetRows, startColIndex, endColIndex);
  _initCellData(targetRows, startColIndex, endColIndex);

  if (rowspan > 1) {
    _updateRowMergeWith(targetRows.slice(1), startColIndex, endColIndex, startRowIndex);
  }

  if (colspan > 1) {
    _updateColMergeWith(targetRows, startColIndex + 1, endColIndex, startColIndex);
  }
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
  const cellElementIndex = dataHandler.findElementIndex(tableData, rowIndex, colIndex);

  return $newTable.find('tr').eq(cellElementIndex.rowIndex).find('td, th')[cellElementIndex.colIndex];
}

export default MergeCell;
