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
     * Append table cells.
     * @param {HTMLElement} node Table element
     * @override
     */
    tableCellAppendAidForTableElement(node) {
        const $table = $(node);
        const tableData = tableDataHandler.createTableData($table);
        const added = tableDataHandler.addTbodyOrTheadIfNeed(tableData);
        const tableAidInformation = this.prepareToTableCellStuffing(tableData);
        const needTableCellStuffingAid = tableAidInformation.needTableCellStuffingAid;

        if (needTableCellStuffingAid) {
            tableDataHandler.stuffCellsIntoIncompleteRow(tableData, tableAidInformation.maximumCellLength);
        }

        if (added || needTableCellStuffingAid) {
            tableRenderer.replaceTable($table, tableData);
        }
    }
}

module.exports = WwMergedTableManager;

