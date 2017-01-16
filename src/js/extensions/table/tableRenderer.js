/**
 * @fileoverview Implements tableRenderer
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

import tableDataHandler from './tableDataHandler';

/**
 * Create cell html.
 * @param {object} cell - cell data of table base data
 * @returns {string}
 */
function _createCellHtml(cell) {
    let attrs = cell.colspan > 1 ? ` colspan="${cell.colspan}"` : '';
    attrs += cell.rowspan > 1 ? ` rowspan="${cell.rowspan}"` : '';
    attrs += cell.align ? ` align="${cell.align}"` : '';

    return `<${cell.nodeName}${attrs}>${cell.content}</${cell.nodeName}>`;
}

/**
 * Create html for thead or tbody.
 * @param {Array.<Array.<object>>} trs - tr list
 * @param {string} wrapperNodeName - wrapper node name like THEAD, TBODY
 * @returns {string}
 * @private
 */
function _createTheadOrTbodyHtml(trs, wrapperNodeName) {
    let html = '';

    if (trs.length) {
        html = trs.map(tr => {
            const tdHtml = tr.map(_createCellHtml).join('');

            return `<tr>${tdHtml}</tr>`;
        }).join('');
        html = `<${wrapperNodeName}>${html}</${wrapperNodeName}>`;
    }

    return html;
}

/**
 * Create table html.
 * @param {Array.<Array.<object>>} table - table data
 * @returns {string}
 * @private
 */
function createTableHtml(table) {
    const thead = [table[0]];
    const tbody = table.slice(1);
    const theadHtml = _createTheadOrTbodyHtml(thead, 'THEAD');
    const tbodyHtml = _createTheadOrTbodyHtml(tbody, 'TBODY');

    return `<table>${theadHtml + tbodyHtml}</table>`;
}

/**
 * Replace table.
 * @param {jQuery} $table - table jQuery element
 * @param {Array.<Array.<object>>} tableData - table data
 * @returns {jQuery}
 */
function replaceTable($table, tableData) {
    const cellIndexData = tableDataHandler.createCellIndexData(tableData);
    const renderData = tableDataHandler.createRenderData(tableData, cellIndexData);
    const $newTable = $(createTableHtml(renderData));

    $table.replaceWith($newTable);

    return $newTable;
}

/**
 * Focus to cell.
 * @param {squireext} sq - squire instance
 * @param {range} range - range object
 * @param {HTMLElement} targetCell - cell element for focus
 * @private
 */
function focusToCell(sq, range, targetCell) {
    range.selectNodeContents(targetCell);
    range.collapse(true);
    sq.setSelection(range);
}

export default {
    createTableHtml,
    replaceTable,
    focusToCell
};
