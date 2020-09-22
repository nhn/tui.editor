/**
 * @fileoverview Implements tableRenderer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import encodeHTMLEntity from 'tui-code-snippet/string/encodeHTMLEntity';

import tableDataHandler from './tableDataHandler';

/**
 * Create cell html.
 * @param {object} cell - cell data of table base data
 * @returns {string}
 * @private
 */
function _createCellHtml(cell) {
  const { colspan, rowspan, align, nodeName, content } = cell;
  let orgContent = '';
  let attrs = '';

  if (colspan > 1) {
    attrs = ` colspan="${colspan}"`;
    orgContent = `@cols=${colspan}:`;
  }
  if (rowspan > 1) {
    attrs += ` rowspan="${rowspan}"`;
    orgContent += `@rows=${rowspan}:`;
  }
  attrs += align ? ` align="${align}"` : '';

  if (orgContent) {
    orgContent += content;
    attrs += ` data-org-content="${encodeHTMLEntity(orgContent)}"`;
  }

  return `<${nodeName}${attrs}>${content}</${nodeName}>`;
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
    html = trs
      .map(tr => {
        const tdHtml = tr.map(_createCellHtml).join('');

        return `<tr>${tdHtml}</tr>`;
      })
      .join('');
    html = `<${wrapperNodeName}>${html}</${wrapperNodeName}>`;
  }

  return html;
}

/**
 * Create table html.
 * @param {Array.<Array.<object>>} renderData - table data for render
 * @returns {string}
 * @private
 */
function createTableHtml(renderData) {
  const thead = renderData[0] ? [renderData[0]] : [];
  const tbody = renderData.slice(1);
  const theadHtml = _createTheadOrTbodyHtml(thead, 'THEAD');
  const tbodyHtml = _createTheadOrTbodyHtml(tbody, 'TBODY');
  const className = renderData.className ? ` class="${renderData.className}"` : '';

  return `<table${className}>${theadHtml + tbodyHtml}</table>`;
}

/**
 * Replace table.
 * @param {HTMLElement} table - table element
 * @param {Array.<Array.<object>>} tableData - table data
 * @returns {HTMLElement}
 * @ignore
 */
function replaceTable(table, tableData) {
  const cellIndexData = tableDataHandler.createCellIndexData(tableData);
  const renderData = tableDataHandler.createRenderData(tableData, cellIndexData);
  const tempDiv = document.createElement('div');

  tempDiv.innerHTML = createTableHtml(renderData);
  table.innerHTML = tempDiv.innerHTML;

  return table;
}

/**
 * Focus to cell.
 * @param {squireext} sq - squire instance
 * @param {range} range - range object
 * @param {HTMLElement} targetCell - cell element for focus
 * @ignore
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
