/**
 * @fileoverview Implements wysiwyg merged table selection manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';
import range from 'tui-code-snippet/array/range';
import closest from 'tui-code-snippet/domUtil/closest';
import addClass from 'tui-code-snippet/domUtil/addClass';

import tableDataHandler from './tableDataHandler';
import tableRangeHandler from './tableRangeHandler';

const TABLE_CELL_SELECTED_CLASS_NAME = 'te-cell-selected';

/**
 * Get class WwMergedTableSelectionManager
 * @param {Editor} editor - editor instance
 * @returns {WwMergedTableSelectionManager} class of table manager
 */
export function getWwMergedTableSelectionManager(editor) {
  const { WwTableSelectionManager } = Object.getPrototypeOf(editor).constructor;

  /**
   * Class WwMergedTableSelectionManager
   * @param {WysiwygEditor} wwe - WysiwygEditor instance
   * @ignore
   */
  return class WwMergedTableSelectionManager extends WwTableSelectionManager {
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
     * @param {HTMLElement} table - table element
     * @param {Array.<Array.<object>>} tableData - table data
     * @param {{
     *   start: {rowIndex: number, colIndex: number},
     *   end: {rowIndex: number, colIndex: number}
     * }} tableRange - table selected range
     * @private
     */
    _addClassToSelectedCells(table, tableData, tableRange) {
      const startRange = tableRange.start;
      const endRange = tableRange.end;
      const cellIndexRange = range(startRange.colIndex, endRange.colIndex + 1);
      const trs = table.querySelectorAll('tr');

      range(startRange.rowIndex, endRange.rowIndex + 1).forEach(rowIndex => {
        const rowData = tableData[rowIndex];
        const cells = trs[rowIndex].querySelectorAll('td, th');

        return cellIndexRange.forEach(colIndex => {
          const cellData = rowData[colIndex];

          if (cellData.elementIndex) {
            addClass(
              cells[rowData[colIndex].elementIndex.colIndex],
              TABLE_CELL_SELECTED_CLASS_NAME
            );
          }
        });
      });
    }

    /**
     * cache table data on drag start
     * @param {HTMLElement} selectionStart - start element
     */
    onDragStart(selectionStart) {
      const table = closest(selectionStart, '[contenteditable=true] table');

      this._tableData = tableDataHandler.createTableData(table);
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
      const start = selectionStart;
      const end = selectionEnd;

      const table = closest(start, '[contenteditable=true] table');
      const tableRange = tableRangeHandler.findSelectionRange(this._tableData, start, end);

      this.removeClassAttrbuteFromAllCellsIfNeed();
      this._addClassToSelectedCells(table, this._tableData, tableRange);
    }

    /**
     * Style to selected cells.
     * @param {function} onStyle - function for styling
     * @param {Object} [options] - options to be passed into onStyle
     */
    styleToSelectedCells(onStyle, options) {
      const sq = this.wwe.getEditor();
      const selectionRange = sq.getSelection().cloneRange();
      const table = closest(selectionRange.startContainer, '[contenteditable=true] table');
      const trs = toArray(table.querySelectorAll('tr'));

      trs.forEach(tr => {
        const cells = tr.querySelectorAll(`.${TABLE_CELL_SELECTED_CLASS_NAME}`);

        if (!cells.length) {
          return;
        }

        const [firstSelectedCell] = cells;
        const lastSelectedCell = cells[cells.length - 1];

        selectionRange.setStart(firstSelectedCell, 0);
        selectionRange.setEnd(lastSelectedCell, lastSelectedCell.childNodes.length);
        sq.setSelection(selectionRange);
        onStyle(sq, options);
      });
    }

    /**
     * Whether has selected both TH and TD.
     * @param {HTMLElement} selectedCells - selected cells element
     * @returns {boolean}
     */
    hasSelectedBothThAndTd(selectedCells) {
      selectedCells = selectedCells || this.getSelectedCells();

      const [firstCell] = selectedCells;
      const lastCell = selectedCells[selectedCells.length - 1];

      return firstCell.nodeName !== lastCell.nodeName;
    }
  };
}
