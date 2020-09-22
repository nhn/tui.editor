/**
 * @fileoverview Implements mergedTableAddRow. Add Row to selected table
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import isExisty from 'tui-code-snippet/type/isExisty';
import extend from 'tui-code-snippet/object/extend';
import range from 'tui-code-snippet/array/range';
import closest from 'tui-code-snippet/domUtil/closest';

import dataHandler from './tableDataHandler';
import tableRangeHandler from './tableRangeHandler';
import tableRenderer from './tableRenderer';

/**
 * Create row merged cell data.
 * @param {number} rowMergeWith - row merge with index
 * @returns {{
 *   nodeName: string,
 *   rowMergeWith: number
 * }}
 * @private
 */
function _createRowMergedCell(rowMergeWith) {
  return {
    nodeName: 'TD',
    rowMergeWith
  };
}

/**
 * Create new row.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} rowIndex - row index of table data
 * @returns {object}
 * @private
 */
export function _createNewRow(tableData, rowIndex) {
  let prevCell = null;

  return tableData[rowIndex].map((cellData, colIndex) => {
    let newCell;

    if (isExisty(cellData.rowMergeWith)) {
      const { rowMergeWith } = cellData;
      const merger = tableData[rowMergeWith][colIndex];
      const lastMergedRowIndex = rowMergeWith + merger.rowspan - 1;

      if (isExisty(merger.colMergeWith) && prevCell) {
        newCell = extend({}, prevCell);
      } else if (lastMergedRowIndex > rowIndex) {
        merger.rowspan += 1;
        newCell = extend({}, cellData);
      }
    } else if (cellData.rowspan > 1) {
      cellData.rowspan += 1;
      newCell = _createRowMergedCell(rowIndex);
    }

    if (!newCell) {
      newCell = dataHandler.createBasicCell(rowIndex + 1, colIndex);
    }

    prevCell = newCell;

    return newCell;
  });
}

/**
 * Add row.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }} tableRange - table selection range
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @private
 */
export function _addRow(tableData, tableRange) {
  const startRowIndex = tableRange.start.rowIndex;
  const endRange = tableRange.end;
  const endRowIndex = dataHandler.findRowMergedLastIndex(
    tableData,
    endRange.rowIndex,
    endRange.colIndex
  );
  const newRows = range(startRowIndex, endRowIndex + 1).map(() =>
    _createNewRow(tableData, endRowIndex)
  );

  tableData.splice(...[endRowIndex + 1, 0].concat(newRows));
}

/**
 * Find focus td element.
 * @param {HTMLElement} newTable - changed table element
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @returns {HTMLElement}
 * @private
 */
function _findFocusTd(newTable, rowIndex, colIndex) {
  const tableData = dataHandler.createTableData(newTable);
  const newRowIndex = dataHandler.findRowMergedLastIndex(tableData, rowIndex, colIndex) + 1;
  const cellElementIndex = dataHandler.findElementIndex(tableData, newRowIndex, colIndex);
  const foundTr = newTable.querySelectorAll('tr')[cellElementIndex.rowIndex];

  return foundTr.querySelectorAll('td')[cellElementIndex.colIndex];
}

/**
 * Get command instance
 * @param {Editor} editor - editor instance
 * @returns {command} command to add row
 */
export function getWwAddRowCommand(editor) {
  const { CommandManager } = Object.getPrototypeOf(editor).constructor;

  return CommandManager.command(
    'wysiwyg',
    /** @lends AddRow */ {
      name: 'AddRow',
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

        sq.saveUndoState(selectionRange);
        _addRow(tableData, tableRange);

        const newTable = tableRenderer.replaceTable(table, tableData);
        const focusTd = _findFocusTd(newTable, tableRange.end.rowIndex, tableRange.start.colIndex);

        tableRenderer.focusToCell(sq, selectionRange, focusTd);
      }
    }
  );
}
