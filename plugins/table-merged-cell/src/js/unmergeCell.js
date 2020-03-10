/**
 * @fileoverview Implements UnmergeCell
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import range from 'tui-code-snippet/array/range';
import closest from 'tui-code-snippet/domUtil/closest';

import dataHandler from './tableDataHandler';
import tableRangeHandler from './tableRangeHandler';
import tableRenderer from './tableRenderer';

/**
 * Whether has merged cell.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{rowIndex: number, colIndex: number}} startRange - start table selection range
 * @param {{rowIndex: number, colIndex: number}} endRange - end table selection range
 * @returns {boolean}
 * @private
 */
export function _hasMergedCell(tableData, { start: startRange, end: endRange }) {
  const startColIndex = startRange.colIndex;
  const limitColIndex = endRange.colIndex + 1;
  const targetRows = tableData.slice(startRange.rowIndex, endRange.rowIndex + 1);
  const targetCells = targetRows.map(rowData => rowData.slice(startColIndex, limitColIndex));

  return !![]
    .concat(...targetCells)
    .filter(cellData => cellData.colspan > 1 || cellData.rowspan > 1).length;
}

/**
 * Update merged cell data to basic cell data.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} startRowIndex - start row index
 * @param {number} startColIndex - start col index
 * @param {number} rowspan - rowspan property of merger cell
 * @param {number} colspan - colspan property of merger cell
 * @private
 */
function _updateMergedCells(tableData, startRowIndex, startColIndex, rowspan, colspan) {
  const limitRowIndex = startRowIndex + rowspan;
  const limitColIndex = startColIndex + colspan;
  const colRange = range(startColIndex, limitColIndex);

  range(startRowIndex, limitRowIndex).forEach(rowIndex => {
    const rowData = tableData[rowIndex];
    const startIndex = rowIndex === startRowIndex ? 1 : 0;

    colRange.slice(startIndex).forEach(colIndex => {
      rowData[colIndex] = dataHandler.createBasicCell(
        rowIndex,
        colIndex,
        rowData[colIndex].nodeName
      );
    });
  });
}

/**
 * Unmerge selected cells.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{rowIndex: number, colIndex: number}} startRange - start table selection range
 * @param {{rowIndex: number, colIndex: number}} endRange - end table selection range
 * @private
 */
export function _unmergeCells(tableData, { start: startRange, end: endRange }) {
  const colRange = range(startRange.colIndex, endRange.colIndex + 1);

  range(startRange.rowIndex, endRange.rowIndex + 1).forEach(rowIndex => {
    colRange.forEach(colIndex => {
      const cellData = tableData[rowIndex][colIndex];
      const { colspan, rowspan } = cellData;

      if (colspan > 1 || rowspan > 1) {
        cellData.colspan = 1;
        cellData.rowspan = 1;
        _updateMergedCells(tableData, rowIndex, colIndex, rowspan, colspan);
      }
    });
  });
}

/**
 * Find focus cell element like td or th.
 * @param {HTMLElement} newTable - changed table element
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @returns {HTMLElement}
 * @private
 */
function _findFocusCell(newTable, rowIndex, colIndex) {
  const tableData = dataHandler.createTableData(newTable);
  const cellElementIndex = dataHandler.findElementIndex(tableData, rowIndex, colIndex);
  const foundTr = newTable.querySelectorAll('tr')[cellElementIndex.rowIndex];

  return foundTr.querySelectorAll('td, th')[cellElementIndex.colIndex];
}

/**
 * Get command instance
 * @param {Editor} editor - editor instance
 * @returns {command} command to unmerge cell
 */
export function getUnmergeCellCommand(editor) {
  const { CommandManager } = Object.getPrototypeOf(editor).constructor;

  return CommandManager.command(
    'wysiwyg',
    /** @lends UnmergeCell */ {
      name: 'UnmergeCells',
      /**
       * Command handler.
       * @param {WysiwygEditor} wwe - wysiwygEditor instance
       */
      exec(wwe) {
        const sq = wwe.getEditor();
        const selectionRange = sq.getSelection().cloneRange();

        wwe.focus();

        if (!sq.hasFormat('TABLE')) {
          return;
        }

        const { startContainer } = selectionRange;
        const startElement =
          startContainer.nodeType !== 1 ? startContainer.parentNode : startContainer;
        const table = closest(startElement, 'table');
        const tableData = dataHandler.createTableData(table);
        const selectedCells = wwe.componentManager.getManager('tableSelection').getSelectedCells();
        const tableRange = tableRangeHandler.getTableSelectionRange(
          tableData,
          selectedCells,
          startContainer
        );

        if (!_hasMergedCell(tableData, tableRange)) {
          return;
        }

        _unmergeCells(tableData, tableRange);

        const newTable = tableRenderer.replaceTable(table, tableData);
        const focusCell = _findFocusCell(
          newTable,
          tableRange.start.rowIndex,
          tableRange.start.colIndex
        );

        tableRenderer.focusToCell(sq, selectionRange, focusCell);
      }
    }
  );
}
