/**
 * @fileoverview Implements wysiwyg merged table manager
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import WwTableManager from '../../wwTableManager';
import tableDataHandler from './tableDataHandler';
import tableRenderer from './tableRenderer';

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
     * @private
     */
    _prepareToTableCellStuffing(tableData) {
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
     * Append table cells
     * @param {HTMLElement} node Table element
     * @override
     */
    tableCellAppendAidForTableElement(node) {
        const $table = $(node);

        this._addTbodyOrTheadIfNeed($table);
        this._addTrIntoContainerIfNeed($table);

        const tableData = tableDataHandler.createTableData($table);
        const tableAidInformation = this._prepareToTableCellStuffing(tableData);
        const needTableCellStuffingAid = tableAidInformation.needTableCellStuffingAid;

        if (needTableCellStuffingAid) {
            this._replaceToCompletionTable($table, tableData);
        }
    }
}

module.exports = WwMergedTableManager;

