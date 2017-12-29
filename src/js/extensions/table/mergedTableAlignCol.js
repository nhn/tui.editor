/**
* @fileoverview Implements mergedTableAlignCol. Align selected column's text content to given direction
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import $ from 'jquery';
import util from 'tui-code-snippet';

import Editor from '../editorProxy';
import dataHandler from './tableDataHandler';
import tableRangeHandler from './tableRangeHandler';
import tableRenderer from './tableRenderer';

const {CommandManager} = Editor;

let AlignCol;
if (CommandManager) {
  AlignCol = CommandManager.command('wysiwyg', /** @lends AlignCol */{
    name: 'AlignCol',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - wysiwygEditor instance
     * @param {string} alignDirection - align direction for table header
     */
    exec(wwe, alignDirection) {
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

      _align(tableData[0], tableRange.start.colIndex, tableRange.end.colIndex, alignDirection);

      const $newTable = tableRenderer.replaceTable($table, tableData);
      const focusCell = _findFocusCell($newTable, $startContainer);

      tableRenderer.focusToCell(sq, range, focusCell);
    }
  });
}

/**
 * Align to table header.
 * @param {Array.<object>} headRowData - head row data
 * @param {number} startColIndex - start column index for styling align
 * @param {number} endColIndex - end column index for styling align
 * @param {string} alignDirection - align direction
 * @private
 */
function _align(headRowData, startColIndex, endColIndex, alignDirection) {
  util.range(startColIndex, endColIndex + 1).forEach(colIndex => {
    const headCellData = headRowData[colIndex];

    if (util.isExisty(headCellData.colMergeWith)) {
      headRowData[headCellData.colMergeWith].align = alignDirection;
    } else {
      headCellData.align = alignDirection;
    }
  });
}

/**
 * Find focus cell element like td or th.
 * @param {jQuery} $newTable - changed table jQuery element
 * @param {jQuery} $startContainer - start container jQuery element of text range
 * @returns {HTMLElement}
 * @private
 */
function _findFocusCell($newTable, $startContainer) {
  const elementRowIndex = dataHandler.findElementRowIndex($startContainer);
  const elementColIndex = dataHandler.findElementColIndex($startContainer);

  return $newTable.find('tr').eq(elementRowIndex).find('td, th')[elementColIndex];
}

export default AlignCol;

