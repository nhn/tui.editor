/**
* @fileoverview Implements wysiwyg merged table manager
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import $ from 'jquery';
import util from 'tui-code-snippet';

import Editor from '../editorProxy';
import tableDataHandler from './tableDataHandler';
import tableRenderer from './tableRenderer';
import tableRangeHandler from './tableRangeHandler';

const {WwTableManager, i18n} = Editor;
const PASTE_TABLE_BOOKMARK = 'tui-paste-table-bookmark';
const PASTE_TABLE_CELL_BOOKMARK = 'tui-paste-table-cell-bookmark';

/**
 * Class WwMergedTableManager
 * @extends {WwTableManager}
 */
class WwMergedTableManager extends WwTableManager {
  /**
   * Update mergeWidth property like rowMergeWith, colMergeWith of table data for copy.
   * @param {Array.<Array.<object>>} copyTableData - table data for copy
   * @param {{rowIndex: number, colIndex: number}} startRange - start range
   * @private
   */
  _updateCopyDataMergeWith(copyTableData, startRange) {
    copyTableData.forEach(rowData => {
      rowData.forEach(cellData => {
        if (util.isExisty(cellData.rowMergeWith)) {
          cellData.rowMergeWith -= startRange.rowIndex;
        }

        if (util.isExisty(cellData.colMergeWith)) {
          cellData.colMergeWith -= startRange.colIndex;
        }
      });
    });
  }

  /**
   * Create table data for copy.
   * @param {Array.<Array.<object>>} tableData - table data
   * @param {{rowIndex: number, colIndex: number}} startRange - start range
   * @param {{rowIndex: number, colIndex: number}} endRange - end range
   * @returns {Array.<Array.<object>>}
   * @private
   */
  _createCopyTableData(tableData, startRange, endRange) {
    let copyTableData = tableData.slice(startRange.rowIndex, endRange.rowIndex + 1);

    copyTableData = copyTableData.map(rowData => rowData.slice(startRange.colIndex, endRange.colIndex + 1));

    this._updateCopyDataMergeWith(copyTableData, startRange);

    return copyTableData;
  }

  /**
   * Update table html of clipboard data, if has selected cells.
   * @param {jQuery} $clipboardContainer - jQuery element
   * @override
   */
  updateTableHtmlOfClipboardIfNeed($clipboardContainer) {
    const $selectedCells = this.wwe.componentManager.getManager('tableSelection').getSelectedCells();

    if ($selectedCells.length) {
      const tableData = tableDataHandler.createTableData($($selectedCells[0]).closest('TABLE'));
      const {start: startRange, end: endRange} =
                  tableRangeHandler.getTableSelectionRange(tableData, $selectedCells);
      const copyTableData = this._createCopyTableData(tableData, startRange, endRange);
      const cellIndexData = tableDataHandler.createCellIndexData(copyTableData);
      const renderData = tableDataHandler.createRenderData(copyTableData, cellIndexData);

      $clipboardContainer.html(tableRenderer.createTableHtml(renderData));
    }
  }

  /**
   * Prepare to table cell stuffing
   * @param {Array.<Array.<object>>} tableData - table data
   * @returns {{maximumCellLength: *, needTableCellStuffingAid: boolean}}
   * @override
   */
  prepareToTableCellStuffing(tableData) {
    let maximumCellLength = tableData[0].length;
    let needTableCellStuffingAid = false;

    tableData.slice(1).forEach(rowData => {
      const cellCount = rowData.length;

      if (maximumCellLength !== cellCount) {
        needTableCellStuffingAid = true;

        if (maximumCellLength < cellCount) {
          maximumCellLength = cellCount;
        }
      }
    });

    return {
      maximumCellLength,
      needTableCellStuffingAid
    };
  }

  /**
   * Append table cells.
   * @param {HTMLElement} node Table element
   * @override
   */
  tableCellAppendAidForTableElement(node) {
    const $table = $(node);
    const tableData = tableDataHandler.createTableData($table);
    const added = tableDataHandler.addTbodyOrTheadIfNeed(tableData);
    const tableAidInformation = this.prepareToTableCellStuffing(tableData);
    const {needTableCellStuffingAid} = tableAidInformation;

    if (needTableCellStuffingAid) {
      tableDataHandler.stuffCellsIntoIncompleteRow(tableData, tableAidInformation.maximumCellLength);
    }

    if (added || needTableCellStuffingAid) {
      tableRenderer.replaceTable($table, tableData);
    }
  }

  /**
   * Find start cell.
   * @param {jQuery} $selectedCells - jQuery elements like td, th
   * @returns {HTMLElement}
   * @private
   */
  _findStartCell($selectedCells) {
    let startCell;

    if ($selectedCells.length === 1) {
      startCell = $selectedCells.get(0);
    } else {
      startCell = this.wwe.getEditor().getSelection().startContainer;
    }

    return startCell;
  }

  /**
   * Find start cell index.
   * @param {Array.<Array.<object>>} tableData - table data
   * @param {jQuery} $startCell - start jQuery element like td, th
   * @returns {{rowIndex: number, colIndex: number}}
   * @private
   */
  _findStartCellIndex(tableData, $startCell) {
    const cellIndexData = tableDataHandler.createCellIndexData(tableData);

    return tableDataHandler.findCellIndex(cellIndexData, $startCell);
  }

  /**
   * Whether has row merged header in clipboardTableData.
   * @param {Array.<Array.<object>>} clipboardTableData - table data of clipboard
   * @param {Array.<Array.<object>>} tableData - table data
   * @param {{rowIndex: number, colIndex: number}} startCellIndex - start cell index
   * @returns {boolean}
   * @private
   */
  _hasRowMergedHeader(clipboardTableData, tableData, startCellIndex) {
    const isHeader = tableData[startCellIndex.rowIndex][startCellIndex.colIndex].nodeName === 'TH';
    const hasHeaderMerge = any(clipboardTableData[0], cellData => (cellData.rowspan && cellData.rowspan > 1));

    return isHeader && hasHeaderMerge;
  }

  /**
   * Whether exactly fit table selection by clipboardTableData.
   * @param {Array.<Array.<object>>} clipboardTableData - table data of clipboard
   * @param {number} targetRowCount - target row count
   * @param {number} targetColCount - target col count
   * @returns {boolean}
   * @private
   */
  _isExactlyFit(clipboardTableData, targetRowCount, targetColCount) {
    return (targetRowCount % clipboardTableData.length === 0) &&
            (targetColCount % clipboardTableData[0].length === 0);
  }

  /**
   * Update clibpard table data.
   * @param {Array.<Array.<object>>} clipboardTableData - table data of clipboard
   * @param {number} targetRowCount - target row count
   * @param {number} targetColCount - target col count
   * @private
   */
  _updateClipboardTableData(clipboardTableData, targetRowCount, targetColCount) {
    const clipboardRowCount = clipboardTableData.length;
    const clipboardColCount = clipboardTableData[0].length;
    const increaseRowCount = parseInt(targetRowCount / clipboardRowCount, 10);
    const increaseColCount = parseInt(targetColCount / clipboardColCount, 10);

    if (increaseRowCount > 1) {
      const originalData = JSON.parse(JSON.stringify(clipboardTableData));

      util.range(0, increaseRowCount - 1).forEach(() => {
        const newRows = JSON.parse(JSON.stringify(originalData));

        clipboardTableData.push(...newRows);
      });
    }

    if (increaseColCount > 1) {
      const originalData = JSON.parse(JSON.stringify(clipboardTableData));

      util.range(0, increaseColCount - 1).forEach(() => {
        const newData = JSON.parse(JSON.stringify(originalData));
        clipboardTableData.forEach((rowData, rowIndex) => {
          rowData.push(...newData[rowIndex]);
        });
      });
    }
  }

  /**
   * Update table data by cliboard table data.
   * @param {Array.<Array.<object>>} clipboardTableData - table data of clipboard
   * @param {Array.<Array.<object>>} tableData - table data
   * @param {{rowIndex: number, colIndex: number}} startCellIndex - start cell index
   * @private
   */
  _updateTableDataByClipboardData(clipboardTableData, tableData, startCellIndex) {
    const startRowIndex = startCellIndex.rowIndex;
    const startColIndex = startCellIndex.colIndex;

    clipboardTableData.forEach((rowData, rowIndex) => {
      const updateRowIndex = startRowIndex + rowIndex;

      rowData.forEach((cellData, colIndex) => {
        const updateColIndex = startColIndex + colIndex;
        const prevCellData = tableData[updateRowIndex][updateColIndex];

        cellData.nodeName = prevCellData.nodeName;
        tableData[updateRowIndex][updateColIndex] = cellData;
      });
    });
  }

  /**
   * Whether possible to paste or not.
   * @param {Array.<Array.<object>>} tableData - table data
   * @param {{rowIndex: number, colIndex: number}} startCellIndex - start cell index
   * @param {{rowIndex: number, colIndex: number}} endCellIndex - end cell index
   * @returns {boolean}
   * @private
   */
  _isPossibleToPaste(tableData, startCellIndex, endCellIndex) {
    const startRowIndex = startCellIndex.rowIndex;
    const startColIndex = startCellIndex.colIndex;
    const endRowIndex = endCellIndex.rowIndex;
    const endColIndex = endCellIndex.colIndex;
    const filterdTableData = tableData.slice(startRowIndex, endRowIndex + 1);
    const firstRow = filterdTableData[0].slice(startColIndex, endColIndex + 1);
    let isPossible = !any(firstRow, cellData => util.isExisty(cellData.rowMergeWith));

    if (isPossible) {
      const firstCells = util.pluck(filterdTableData, startColIndex);

      isPossible = !any(firstCells, cellData => util.isExisty(cellData.colMergeWith));
    }

    if (isPossible && tableData.length > endRowIndex + 1) {
      const nextRow = tableData[endRowIndex + 1].slice(startColIndex, endColIndex + 1);

      isPossible = !any(nextRow, cellData => util.isExisty(cellData.rowMergeWith));
    }

    if (isPossible && tableData[0].length > endColIndex + 1) {
      const nextCells = util.pluck(filterdTableData, endColIndex + 1);

      isPossible = !any(nextCells, cellData => util.isExisty(cellData.colMergeWith));
    }

    return isPossible;
  }

  /**
   * Splice clipboardTableData by target row count and col count.
   * @param {Array.<Array.<object>>} clipboardTableData - table data of clipboard
   * @param {number} targetRowCount - target row count
   * @param {number} targetColCount - target col count
   * @private
   */
  _spliceClipboardData(clipboardTableData, targetRowCount, targetColCount) {
    clipboardTableData.splice(targetRowCount);
    clipboardTableData.forEach(rowData => {
      rowData.splice(targetColCount);
    });
  }

  /**
   * bookmark last td.
   * @param {number} endRowIndex - end row index
   * @param {number} endColIndex - end col index
   * @private
   */
  _bookmarkLastTd({rowIndex: endRowIndex, colIndex: endColIndex}) {
    const sq = this.wwe.getEditor();
    const $bookmarkedTable = sq.get$Body().find(`.${PASTE_TABLE_BOOKMARK}`);
    const tableData = tableDataHandler.createTableData($bookmarkedTable);
    const lastCellData = tableData[endRowIndex][endColIndex];

    endRowIndex = util.isExisty(lastCellData.rowMergeWith) ? lastCellData.rowMergeWith : endRowIndex;
    endColIndex = util.isExisty(lastCellData.colMergeWith) ? lastCellData.colMergeWith : endColIndex;

    const lastCellIndex = tableData[endRowIndex][endColIndex].elementIndex;
    const lastTd = $bookmarkedTable.find('tr').eq(lastCellIndex.rowIndex).children()[lastCellIndex.colIndex];

    $bookmarkedTable.removeClass(PASTE_TABLE_BOOKMARK);
    $(lastTd).addClass(PASTE_TABLE_CELL_BOOKMARK);
  }

  /**
   * Update clipboard data for paste to smaller selection area than clipboard data.
   * @param {Array.<Array.<object>>} clipboardTableData - table data of clipboard
   * @param {Array.<Array.<object>>} tableData - table data
   * @param {number} targetRowCount - target row count
   * @param {number} targetColCount - target col count
   * @param {{rowIndex: number, colIndex: number}} startRange - start table range
   * @returns {boolean}
   * @private
   */
  _updateClipboardDataForPasteToSamllerSelectedArea(clipboardTableData, tableData, targetRowCount,
    targetColCount, startRange) {
    let updated = true;
    const startCellIndex = {
      rowIndex: 0,
      colIndex: 0
    };

    const endCellIndex = {
      rowIndex: targetRowCount - 1,
      colIndex: targetColCount - 1
    };

    if (this._isPossibleToPaste(clipboardTableData, startCellIndex, endCellIndex)) {
      this._spliceClipboardData(clipboardTableData, targetRowCount, targetColCount);
      this._updateTableDataByClipboardData(clipboardTableData, tableData, startRange);
    } else {
      updated = false;
    }

    return updated;
  }

  /**
   * Paste to selected area.
   * @param {jQuery} $table - target jQuery table element
   * @param {Array.<Array.<object>>} clipboardTableData - table data of clipboard
   * @param {Array.<Array.<object>>} tableData - table data
   * @param {jQuery} $selectedCells - selected jQuery elements like td, th
   * @private
   */
  _pasteToSelectedArea($table, clipboardTableData, tableData, $selectedCells) {
    const {start: startRange, end: endRange} = tableRangeHandler.getTableSelectionRange(tableData, $selectedCells);
    const targetRowCount = endRange.rowIndex - startRange.rowIndex + 1;
    const targetColCount = endRange.colIndex - startRange.colIndex + 1;
    const clipboardRowCount = clipboardTableData.length;
    const clipboardColCount = clipboardTableData[0].length;
    const isSelectionLargerThanData = (targetRowCount >= clipboardRowCount) &&
              (targetColCount >= clipboardColCount);
    let alertMessage = i18n.get('Cannot change part of merged cell');
    let updated = true;
    let endCellIndex;

    if (this._hasRowMergedHeader(clipboardTableData, tableData, startRange)) {
      alertMessage = i18n.get('Cannot paste row merged cells into the table header');
      updated = false;
    } else if (this._isExactlyFit(clipboardTableData, targetRowCount, targetColCount)) {
      endCellIndex = endRange;
      this._updateClipboardTableData(clipboardTableData, targetRowCount, targetColCount);
      this._updateTableDataByClipboardData(clipboardTableData, tableData, startRange);
    } else if (isSelectionLargerThanData) {
      endCellIndex = {
        rowIndex: startRange.rowIndex + clipboardRowCount - 1,
        colIndex: startRange.colIndex + clipboardColCount - 1
      };

      if (this._isPossibleToPaste(tableData, startRange, endCellIndex)) {
        this._updateTableDataByClipboardData(clipboardTableData, tableData, startRange);
      } else {
        updated = false;
      }
    } else { // selected area is smaller then paste data
      endCellIndex = {
        rowIndex: startRange.rowIndex + targetRowCount - 1,
        colIndex: startRange.colIndex + targetColCount - 1
      };

      updated = this._updateClipboardDataForPasteToSamllerSelectedArea(clipboardTableData,
        tableData, targetRowCount, targetColCount, startRange);
    }

    if (updated) {
      tableData.className += ` ${PASTE_TABLE_BOOKMARK}`;
      tableRenderer.replaceTable($table, tableData);
      this._bookmarkLastTd(endCellIndex);
    } else {
      alert(alertMessage);
      this.wwe.focus();
    }
  }

  /**
   * Find end cell index.
   * @param {Array.<Array.<object>>} clipboardTableData - table data of clipboard
   * @param {number} startRowIndex - start row index
   * @param {number} startColIndex - start col index
   * @returns {{rowIndex: number, colIndex: number}}
   * @private
   */
  _findEndCellIndex(clipboardTableData, {rowIndex: startRowIndex, colIndex: startColIndex}) {
    return {
      rowIndex: startRowIndex + clipboardTableData.length - 1,
      colIndex: startColIndex + clipboardTableData[0].length - 1
    };
  }

  /**
   * Expand row.
   * @param {Array.<Array.<object>>} tableData - table data
   * @param {number} expandCount - expand count
   * @private
   */
  _expandRow(tableData, expandCount) {
    const startRowIndex = tableData.length;
    const cellCount = tableData[0].length;
    const newRows = util.range(startRowIndex, startRowIndex + expandCount).map(rowIndex => (
      util.range(0, cellCount).map(colIndex => tableDataHandler.createBasicCell(rowIndex, colIndex))
    ));

    tableData.push(...newRows);
  }

  /**
   * Expand column.
   * @param {Array.<Array.<object>>} tableData - table data
   * @param {number} expandCount - expand count
   * @private
   */
  _expandCoumn(tableData, expandCount) {
    const startCellIndex = tableData[0].length;
    const additionalCellRange = util.range(startCellIndex, startCellIndex + expandCount);

    tableData.forEach((rowData, rowIndex) => {
      const [{nodeName}] = rowData;
      const newCells = additionalCellRange.map(colIndex => (
        tableDataHandler.createBasicCell(rowIndex, colIndex, nodeName)
      ));

      rowData.push(...newCells);
    });
  }

  /**
   * Expand table data, if need.
   * @param {Array.<Array.<object>>} tableData - table data
   * @param {{rowIndex: number, colIndex: number}} startCellIndex - start cell index
   * @param {{rowIndex: number, colIndex: number}} endCellIndex - end cell index
   * @private
   */
  _expandTableDataIfNeed(tableData, startCellIndex, endCellIndex) {
    const expandRowCount = endCellIndex.rowIndex - tableData.length + 1;
    const expandCellCount = endCellIndex.colIndex - tableData[0].length + 1;

    if (expandRowCount > 0) {
      this._expandRow(tableData, expandRowCount);
    }

    if (expandCellCount > 0) {
      this._expandCoumn(tableData, expandCellCount);
    }
  }

  /**
   * Paste all clipboard table data.
   * @param {jQuery} $table - jQuery table element
   * @param {Array.<Array.<object>>} clipboardTableData - table data of clipboard
   * @param {Array.<Array.<object>>} tableData - table data
   * @param {{rowIndex: number, colIndex: number}} startCellIndex - start cell index
   * @private
   */
  _pasteAllClipboardTableData($table, clipboardTableData, tableData, startCellIndex) {
    const endCellIndex = this._findEndCellIndex(clipboardTableData, startCellIndex);

    if (this._hasRowMergedHeader(clipboardTableData, tableData, startCellIndex)) {
      alert(i18n.get('Cannot paste row merged cells into the table header'));
      this.wwe.focus();

      return;
    }

    this._expandTableDataIfNeed(tableData, startCellIndex, endCellIndex);

    if (this._isPossibleToPaste(tableData, startCellIndex, endCellIndex)) {
      this._updateTableDataByClipboardData(clipboardTableData, tableData, startCellIndex);
      tableData.className += ` ${PASTE_TABLE_BOOKMARK}`;
      tableRenderer.replaceTable($table, tableData);
      this._bookmarkLastTd(endCellIndex);
    } else {
      alert(i18n.get('Cannot change part of merged cell'));
      this.wwe.focus();
    }
  }

  /**
   * Paste clibpard data.
   * @param {jQuery} $clipboardTable - jQuery table element of clipboard
   */
  pasteClipboardData($clipboardTable) {
    const clipboardTableData = tableDataHandler.createTableData($clipboardTable);
    const tableSelectionManager = this.wwe.componentManager.getManager('tableSelection');
    const $selectedCells = tableSelectionManager.getSelectedCells();
    const $startCell = $(this._findStartCell($selectedCells));
    const $table = $startCell.closest('table');
    const tableData = tableDataHandler.createTableData($table);
    const startCellIndex = this._findStartCellIndex(tableData, $startCell);

    if ($selectedCells.length > 1) { // selection
      this._pasteToSelectedArea($table, clipboardTableData, tableData, $selectedCells);
    } else { // cursor
      this._pasteAllClipboardTableData($table, clipboardTableData, tableData, startCellIndex);
    }
  }
}

/**
 * Whether one of them is true or not.
 * @param {Array} arr - target array
 * @param {function} contition - condition function
 * @returns {boolean}
 * @ignore
 */
function any(arr, contition) {
  let result = false;

  util.forEach(arr, item => {
    result = contition(item);

    return !result;
  });

  return result;
}

export default WwMergedTableManager;

