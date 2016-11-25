/**
 * @fileoverview Implements convertor for tui.grid
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import parser from './parser';

const COLUMN_NAME_PREFIX = 'grid-column-';
const DEFAULT_OPTION = {
    displayRowCount: 5,
    headerHeight: 50,
    rowHeight: 35,
    toolbar: null,
    autoNumbering: false
};

/**
 * Convertor for tui.grid
 * @module convertor
 * @type {object}
 */
const convertor = {
    /**
     * Create columnModelList for grid data.
     * @memberOf module:convertor
     * @param {object} header - parsed header data
     * @param {boolean} isEdit - whether edit mode or not.
     * @returns {Array.<object>}
     * @private
     */
    _createColumnModelList(header, isEdit) {
        const editOption = {
            type: isEdit ? 'text' : 'normal'
        };

        return header.map((headerItem, index) => Object.assign(headerItem || {}, {
            editOption,
            columnName: COLUMN_NAME_PREFIX + index
        }));
    },

    /**
     * Create rowList for grid data.
     * @memberOf module:convertor
     * @param {object} body - parsed body data
     * @returns {Array.<object>}
     * @private
     */
    _createRowList(body) {
        return body.map(line => {
            const rowItem = {};

            line.forEach((cell, index) => {
                rowItem[COLUMN_NAME_PREFIX + index] = cell.data;
            });

            return rowItem;
        });
    },

    /**
     * Convert code text to grid data.
     * @memberOf module:convertor
     * @param {string} codeText - code text
     * @param {boolean} isEdit - whether edit mode or not.
     * @returns {{options: object, columnModelList: Array.<object>, rowList: Array.<object>}}
     */
    convertToGridData(codeText, isEdit) {
        const parsedData = parser.parseCodeText(codeText);
        const columnModelList = this._createColumnModelList(parsedData.data.header, isEdit);
        const rowList = this._createRowList(parsedData.data.body);
        const options = Object.assign(DEFAULT_OPTION, parsedData.options);

        return {
            options,
            columnModelList,
            rowList
        };
    }
};

export default convertor;
