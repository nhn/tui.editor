/**
 * @fileoverview Implements mergedTableAlignCol. Align selected column's text content to given direction
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import isExisty from 'tui-code-snippet/type/isExisty';
import range from 'tui-code-snippet/array/range';
import closest from 'tui-code-snippet/domUtil/closest';

import dataHandler from './tableDataHandler';
import tableRangeHandler from './tableRangeHandler';
import tableRenderer from './tableRenderer';

/**
 * Align to table header.
 * @param {Array.<object>} headRowData - head row data
 * @param {number} startColIndex - start column index for styling align
 * @param {number} endColIndex - end column index for styling align
 * @param {string} alignDirection - align direction
 * @private
 */
function _align(headRowData, startColIndex, endColIndex, alignDirection) {
  range(startColIndex, endColIndex + 1).forEach(colIndex => {
    const headCellData = headRowData[colIndex];

    if (isExisty(headCellData.colMergeWith)) {
      headRowData[headCellData.colMergeWith].align = alignDirection;
    } else {
      headCellData.align = alignDirection;
    }
  });
}

/**
 * Find focus cell element like td or th.
 * @param {HTMLElement} newTable - changed table  element
 * @param {HTMLElement} startContainer - start container element of text range
 * @returns {HTMLElement}
 * @private
 */
function _findFocusCell(newTable, startContainer) {
  const elementRowIndex = dataHandler.findElementRowIndex(startContainer);
  const elementColIndex = dataHandler.findElementColIndex(startContainer);
  const foundTr = newTable.querySelectorAll('tr')[elementRowIndex];

  return foundTr.querySelectorAll('td, th')[elementColIndex];
}

/**
 * Get command instance
 * @param {Editor} editor - editor instance
 * @returns {command} command to align column
 */
export function getWwAlignColumnCommand(editor) {
  const { CommandManager } = Object.getPrototypeOf(editor).constructor;

  return CommandManager.command(
    'wysiwyg',
    /** @lends AlignCol */ {
      name: 'AlignCol',
      /**
       * Command handler.
       * @param {WysiwygEditor} wwe - wysiwygEditor instance
       * @param {string} alignDirection - align direction for table header
       */
      exec(wwe, alignDirection) {
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

        _align(tableData[0], tableRange.start.colIndex, tableRange.end.colIndex, alignDirection);

        const newTable = tableRenderer.replaceTable(table, tableData);
        const focusCell = _findFocusCell(newTable, startContainer);

        tableRenderer.focusToCell(sq, selectionRange, focusCell);
      }
    }
  );
}
