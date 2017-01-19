/**
 * @fileoverview Implements wysiwyg merged table selection manager
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import WwTableSelectionManager from '../../wwTableSelectionManager';
import tableDataHandler from './tableDataHandler';
import tableRangeHandler from './tableRangeHandler';
const TABLE_CELL_SELECTED_CLASS_NAME = 'te-cell-selected';

const util = tui.util;

/**
 * WwMergedTableSelectionManager
 * @exports WwMergedTableSelectionManager
 * @constructor
 * @class WwMergedTableTableSelectionManager
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
class WwMergedTableSelectionManager extends WwTableSelectionManager {
    /**
     * Set setTimeout and setInterval timer execution if table selecting situation
     * @param {HTMLElement} selectionStart Start element
     * @override
     */
    setTableSelectionTimerIfNeed(selectionStart) {
        const isTableSelecting = $(selectionStart).parents('table').length;

        if (isTableSelecting) {
            this._isSelectionStarted = true;
        }
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
     * Highlight selected table cells
     * @param {HTMLElement} selectionStart start element
     * @param {HTMLElement} selectionEnd end element
     * @override
     */
    highlightTableCellsBy(selectionStart, selectionEnd) {
        const $start = $(selectionStart);
        const $end = $(selectionEnd);
        const $table = $start.closest('table');
        const tableData = tableDataHandler.createTableData($table);
        const tableRange = tableRangeHandler.findSelectionRange(tableData, $start, $end);

        this.removeClassAttrbuteFromAllCellsIfNeed();
        this._addClassToSelectedCells($table, tableData, tableRange);
    }

    /**
     * Style to selected cells.
     * @param {function} onStyle - function for styling
     */
    styleToSelectedCells(onStyle) {
        const sq = this.wwe.getEditor();
        const range = sq.getSelection().cloneRange();
        const $table = $(range.startContainer).closest('table');

        $table.find('tr').get().forEach(tr => {
            const cells = $(tr).find(`.${TABLE_CELL_SELECTED_CLASS_NAME}`);

            if (!cells.length) {
                return;
            }

            range.setStart(cells.first()[0], 0);
            range.setEnd(cells.last()[0], 1);
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

