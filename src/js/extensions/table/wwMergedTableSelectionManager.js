/**
* @fileoverview Implements wysiwyg merged table selection manager
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import $ from 'jquery';
import util from 'tui-code-snippet';

import Editor from '../editorProxy';
import tableDataHandler from './tableDataHandler';
import tableRangeHandler from './tableRangeHandler';

const {WwTableSelectionManager} = Editor;

const TABLE_CELL_SELECTED_CLASS_NAME = 'te-cell-selected';

/**
 * Class WwMergedTableSelectionManager
 */
class WwMergedTableSelectionManager extends WwTableSelectionManager {
  /**
   * Creates an instance of WwMergedTableSelectionManager.
   * @param {WysiwygEditor} wwe - WysiwygEditor instance
   * @memberof WwMergedTableSelectionManager
   */
  constructor(wwe) {
    super(wwe);

    /**
     * table cache data
     * @type {Array.<Array.<Object>>}
     * @private
     */
    this._tableData = null;

    this.mergedTableSelectionManager = true;
  }

  /**
   * Add css class for selected cells.
   * @param {jQuery} $table - table jQuery element
   * @param {Array.<Array.<object>>} tableData - table data
   * @param {{
   *   start: {rowIndex: number, colIndex: number},
   *   end: {rowIndex: number, colIndex: number}
   * }} tableRange - table selected range
   * @private
   */
  _addClassToSelectedCells($table, tableData, tableRange) {
    const startRange = tableRange.start;
    const endRange = tableRange.end;
    const cellIndexRange = util.range(startRange.colIndex, endRange.colIndex + 1);
    const $trs = $table.find('tr');

    util.range(startRange.rowIndex, endRange.rowIndex + 1).forEach(rowIndex => {
      const rowData = tableData[rowIndex];
      const $cells = $trs.eq(rowIndex).find('td, th');

      return cellIndexRange.forEach(colIndex => {
        const cellData = rowData[colIndex];

        if (cellData.elementIndex) {
          $cells.eq(rowData[colIndex].elementIndex.colIndex).addClass(TABLE_CELL_SELECTED_CLASS_NAME);
        }
      });
    });
  }

  /**
   * cache table data on drag start
   * @param {HTMLElement} selectionStart - start element
   */
  onDragStart(selectionStart) {
    const $table = $(selectionStart).closest('[contenteditable=true] table');
    this._tableData = tableDataHandler.createTableData($table);
  }

  /**
   * clear table data in cache on drag end
   */
  onDragEnd() {
    this._tableData = null;
  }

  /**
   * Highlight selected table cells
   * @param {HTMLElement} selectionStart start element
   * @param {HTMLElement} selectionEnd end element
   * @override
   */
  highlightTableCellsBy(selectionStart, selectionEnd) {
    const $start = $(selectionStart);
    const $end = $(selectionEnd);
    const $table = $start.closest('[contenteditable=true] table');
    const tableRange = tableRangeHandler.findSelectionRange(this._tableData, $start, $end);

    this.removeClassAttrbuteFromAllCellsIfNeed();
    this._addClassToSelectedCells($table, this._tableData, tableRange);
  }

  /**
   * Style to selected cells.
   * @param {function} onStyle - function for styling
   */
  styleToSelectedCells(onStyle) {
    const sq = this.wwe.getEditor();
    const range = sq.getSelection().cloneRange();
    const $table = $(range.startContainer).closest('[contenteditable=true] table');

    $table.find('tr').get().forEach(tr => {
      const $cells = $(tr).find(`.${TABLE_CELL_SELECTED_CLASS_NAME}`);
      const firstSelectedCell = $cells.first().get(0);
      const lastSelectedCell = $cells.last().get(0);

      if (!$cells.length) {
        return;
      }

      range.setStart(firstSelectedCell, 0);
      range.setEnd(lastSelectedCell, lastSelectedCell.childNodes.length);
      sq.setSelection(range);
      onStyle(sq);
    });
  }

  /**
   * Whether has selected both TH and TD.
   * @param {jQuery} $selectedCells - selected cells jQuery element
   * @returns {boolean}
   */
  hasSelectedBothThAndTd($selectedCells) {
    $selectedCells = $selectedCells || this.getSelectedCells();

    return $selectedCells.first()[0].nodeName !== $selectedCells.last()[0].nodeName;
  }
}

export default WwMergedTableSelectionManager;

