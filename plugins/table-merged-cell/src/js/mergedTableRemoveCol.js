/**
 * @fileoverview Implements mergedTableRemoveCol. Remove col to selected table
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
 * Update colspan to col merger.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} startColIndex - start col index
 * @param {number} endColIndex - end col index
 * @private
 */
function _updateColspan(tableData, startColIndex, endColIndex) {
  tableData.forEach(rowData => {
    range(startColIndex, endColIndex + 1).forEach(colIndex => {
      const cellData = rowData[colIndex];

      if (isExisty(cellData.colMergeWith)) {
        const merger = rowData[cellData.colMergeWith];

        if (merger.colspan) {
          merger.colspan -= 1;
        }
      } else if (cellData.colspan > 1) {
        const lastMergedCellIndex = colIndex + cellData.colspan - 1;

        cellData.colspan -= endColIndex - colIndex + 1;

        if (lastMergedCellIndex > endColIndex) {
          rowData[endColIndex + 1] = extend({}, cellData);
        }
      }
    });
  });
}

/**
 * Update row merge start index to merged cell.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} startColIndex - start col index
 * @param {number} endColIndex - end col index
 * @private
 */
function _updateMergeStartIndex(tableData, startColIndex, endColIndex) {
  tableData.forEach(rowData => {
    rowData.slice(endColIndex + 1).forEach(cellData => {
      if (isExisty(cellData.colMergeWith) && cellData.colMergeWith >= startColIndex) {
        cellData.colMergeWith = endColIndex + 1;
      }
    });
  });
}

/**
 * Remove columns.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }} tableRange - table selection range
 * @private
 */
export function _removeColumns(tableData, tableRange) {
  const startColIndex = tableRange.start.colIndex;
  const endRange = tableRange.end;
  const endColIndex = dataHandler.findColMergedLastIndex(
    tableData,
    endRange.rowIndex,
    endRange.colIndex
  );
  const removeCount = endColIndex - startColIndex + 1;

  _updateColspan(tableData, startColIndex, endColIndex);
  _updateMergeStartIndex(tableData, startColIndex, endColIndex);

  tableData.forEach(row => {
    row.splice(startColIndex, removeCount);
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

  if (tableData[0].length - 1 < colIndex) {
    colIndex -= 1;
  }

  const cellElementIndex = dataHandler.findElementIndex(tableData, rowIndex, colIndex);
  const foundTr = newTable.querySelectorAll('tr')[cellElementIndex.rowIndex];

  return foundTr.querySelectorAll('td')[cellElementIndex.colIndex];
}

/**
 * Get command instance
 * @param {Editor} editor - editor instance
 * @returns {command} command to remove column
 */
export function getWwRemoveColumnCommand(editor) {
  const { CommandManager } = Object.getPrototypeOf(editor).constructor;

  return CommandManager.command(
    'wysiwyg',
    /** @lends RemoveCol */ {
      name: 'RemoveCol',
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
        const beforeCellLength = tableData[0].length;

        sq.saveUndoState(selectionRange);

        selectionRange.collapse(true);
        sq.setSelection(selectionRange);

        _removeColumns(tableData, tableRange);

        if (tableData[0].length === 0) {
          table.parentNode.removeChild(table);
        } else if (beforeCellLength !== tableData[0].length) {
          const newTable = tableRenderer.replaceTable(table, tableData);

          const startColIndex = tableRange.start.colIndex;
          const focusColIndex =
            startColIndex >= tableData[0].length ? startColIndex - 1 : startColIndex;
          const focusCell = _findFocusCell(newTable, tableRange.start.rowIndex, focusColIndex);

          tableRenderer.focusToCell(sq, selectionRange, focusCell);
        }
      }
    }
  );
}
