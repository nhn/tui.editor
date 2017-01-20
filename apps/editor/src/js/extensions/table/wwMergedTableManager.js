/**
 * @fileoverview Implements wysiwyg merged table manager
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import WwTableManager from '../../wwTableManager';
import tableDataHandler from './tableDataHandler';
import tableRenderer from './tableRenderer';

const util = tui.util;
/**
 * WwMergedTableManager
 * @exports WwMergedTableManager
 * @constructor
 * @class WwMergedTableManager
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
class WwMergedTableManager extends WwTableManager {
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
     * Replace incompletion table to completion table.
     * @param {jQuery} $table - current jQuery table element
     * @param {Array.<Array.<object>>} tableData - table data
     * @private
     */
    _replaceToCompletionTable($table, tableData) {
        tableDataHandler.stuffCellsIntoIncompleteRow(tableData);
        tableRenderer.replaceTable($table, tableData);
    }

    /**
     * Add tbody or thead of table data if need.
     * @param {Array.<Array.<object>>} tableData - table data
     * @returns {boolean}
     */
    _addTbodyOrTheadOfTableDataIfNeed(tableData) {
        const header = tableData[0];
        const cellCount = header.length;
        let added = true;

        if (!cellCount && tableData[1]) {
            util.range(0, tableData[1].length).forEach(colIndex => {
                header.push(tableDataHandler.createBasicCell(0, colIndex, 'TH'));
            });
        } else if (tableData[0][0].nodeName !== 'TH') {
            const newHeader = util.range(0, cellCount).map(colIndex => (
                tableDataHandler.createBasicCell(0, colIndex, 'TH')
            ));

            tableData.unshift(newHeader);
        } else if (tableData.length === 1) {
            const newRow = util.range(0, cellCount).map(colIndex => (
                tableDataHandler.createBasicCell(1, colIndex, 'TD')
            ));

            tableData.push(newRow);
        } else {
            added = false;
        }

        return added;
    }

    /**
     * Append table cells.
     * @param {HTMLElement} node Table element
     * @override
     */
    tableCellAppendAidForTableElement(node) {
        const $table = $(node);
        const tableData = tableDataHandler.createTableData($table);
        const added = this._addTbodyOrTheadOfTableDataIfNeed(tableData);
        const tableAidInformation = this.prepareToTableCellStuffing(tableData);
        const needTableCellStuffingAid = tableAidInformation.needTableCellStuffingAid;

        if (added || needTableCellStuffingAid) {
            this._replaceToCompletionTable($table, tableData);
        }
    }
}

module.exports = WwMergedTableManager;

