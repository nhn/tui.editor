/**
 * @fileoverview Implements tableDataHandler
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';
import isUndefined from 'tui-code-snippet/type/isUndefined';
import isExisty from 'tui-code-snippet/type/isExisty';
import extend from 'tui-code-snippet/object/extend';
import range from 'tui-code-snippet/array/range';
import { msie } from 'tui-code-snippet/browser/browser';
import closest from 'tui-code-snippet/domUtil/closest';

/**
 * Parse cell like td or th.
 * @param {HTMLElement} cell - cell element like td or th
 * @param {number} rowIndex - row index
 * @param {number} colIndex - column index
 * @returns {{
 *   nodeName: string,
 *   colspan: number,
 *   rowspan: number,
 *   content: string,
 *   align: ?string
 * }}
 * @private
 */
function _parseCell(cell, rowIndex, colIndex) {
  const colspan = cell.getAttribute('colspan');
  const rowspan = cell.getAttribute('rowspan');
  const { nodeName } = cell;

  if (nodeName !== 'TH' && nodeName !== 'TD') {
    return null;
  }

  const cellData = {
    nodeName: cell.nodeName,
    colspan: colspan ? parseInt(colspan, 10) : 1,
    rowspan: rowspan ? parseInt(rowspan, 10) : 1,
    content: cell.innerHTML,
    elementIndex: {
      rowIndex,
      colIndex
    }
  };

  if (cell.nodeName === 'TH' && cell.align) {
    cellData.align = cell.align;
  }

  return cellData;
}

/**
 * Add merged cell.
 * @param {object} base - base table data
 * @param {object} cellData - cell data
 * @param {number} startRowIndex - start row index
 * @param {number} startCellIndex - start cell index
 * @private
 */
function _addMergedCell(base, cellData, startRowIndex, startCellIndex) {
  const { colspan, rowspan, nodeName } = cellData;
  const colMerged = colspan > 1;
  const rowMerged = rowspan > 1;

  if (!colMerged && !rowMerged) {
    return;
  }

  const limitRowIndex = startRowIndex + rowspan;
  const limitCellIndex = startCellIndex + colspan;

  range(startRowIndex, limitRowIndex).forEach(rowIndex => {
    base[rowIndex] = base[rowIndex] || [];

    range(startCellIndex, limitCellIndex).forEach(cellIndex => {
      const mergedData = {
        nodeName
      };

      if (rowIndex === startRowIndex && cellIndex === startCellIndex) {
        return;
      }

      if (colMerged) {
        mergedData.colMergeWith = startCellIndex;
      }

      if (rowMerged) {
        mergedData.rowMergeWith = startRowIndex;
      }

      base[rowIndex][cellIndex] = mergedData;
    });
  });
}

/**
 * Create table data from table Element.
 * @param {HTMLElement} table - table element
 * @returns {Array.<Array.<object>>}
 * @ignore
 */
export function createTableData(table) {
  const tableData = [];
  const trs = toArray(table.querySelectorAll('tr'));

  trs.forEach((tr, rowIndex) => {
    let stackedColCount = 0;

    tableData[rowIndex] = tableData[rowIndex] || [];

    toArray(tr.children).forEach((cell, colIndex) => {
      const cellData = _parseCell(cell, rowIndex, colIndex);

      if (!cellData) {
        return;
      }
      let dataColIndex = colIndex + stackedColCount;

      while (tableData[rowIndex][dataColIndex]) {
        dataColIndex += 1;
        stackedColCount += 1;
      }

      tableData[rowIndex][dataColIndex] = cellData;
      _addMergedCell(tableData, cellData, rowIndex, dataColIndex);
    });
  });

  if (table.className) {
    tableData.className = table.className;
  }

  return tableData;
}

/**
 * Create cell index data of table data.
 * @param {Array.<Array.<object>>} tableData - table data
 * @returns {Array.<Array.<object>>}
 * @ignore
 */
export function createCellIndexData(tableData) {
  const mappingData = [];

  tableData.forEach((row, rowIndex) => {
    const mappingRow = [];

    row.forEach((cell, colIndex) => {
      if (isUndefined(cell.colMergeWith) && isUndefined(cell.rowMergeWith)) {
        mappingRow.push({
          rowIndex,
          colIndex
        });
      }
    });
    mappingData.push(mappingRow);
  });

  return mappingData;
}

/**
 * Get header aligns.
 * @param {Array.<Array.<object>>} tableData - table data
 * @returns {Array.<?string>}
 * @private
 */
function _getHeaderAligns(tableData) {
  const [headRowData] = tableData;

  return headRowData.map(cellData => {
    let align;

    if (isExisty(cellData.colMergeWith)) {
      ({ align } = headRowData[cellData.colMergeWith]);
    } else {
      ({ align } = cellData);
    }

    return align;
  });
}

/**
 * Create render data.
 * @param {Array.<object>} tableData - table data
 * @param {Array.<object>} cellIndexData - cell index data
 * @returns {Array.<Array.<object>>}
 * @ignore
 */
function createRenderData(tableData, cellIndexData) {
  const headerAligns = _getHeaderAligns(tableData);
  const renderData = cellIndexData.map(row =>
    row.map(({ rowIndex, colIndex }) =>
      extend(
        {
          align: headerAligns[colIndex]
        },
        tableData[rowIndex][colIndex]
      )
    )
  );

  if (tableData.className) {
    renderData.className = tableData.className;
  }

  return renderData;
}

const BASIC_CELL_CONTENT = msie ? '' : '<br>';

/**
 * Create basic cell data.
 * @param {number} rowIndex - row index
 * @param {number} colIndex - column index
 * @param {string} nodeName - node name
 * @returns {{
 *   nodeName: string,
 *   colspan: number,
 *   rowspan: number,
 *   content: string
 * }}
 * @ignore
 */
function createBasicCell(rowIndex, colIndex, nodeName) {
  return {
    nodeName: nodeName || 'TD',
    colspan: 1,
    rowspan: 1,
    content: BASIC_CELL_CONTENT,
    elementIndex: {
      rowIndex,
      colIndex
    }
  };
}

function getPreviousSiblingsCount(element) {
  const previousSiblings = [];
  let current = element.previousSibling;

  while (current) {
    if (current.nodeType === 1) {
      previousSiblings.push(current);
    }
    current = current.previousSibling;
  }

  return previousSiblings.length;
}

/**
 * Find element row index.
 * @param {HTMLElement} cell - cell element like td or th
 * @returns {number}
 * @ignore
 */
function findElementRowIndex(cell) {
  cell = cell.nodeType !== 1 ? cell.parentNode : cell;

  const tr = closest(cell, 'tr');
  let rowIndex = getPreviousSiblingsCount(tr);

  if (tr.parentNode.nodeName === 'TBODY') {
    rowIndex += 1;
  }

  return rowIndex;
}

/**
 * Find element col index.
 * @param {HTMLElement} cell - cell element like td or th
 * @returns {number}
 * @ignore
 */
function findElementColIndex(cell) {
  cell = cell.nodeType !== 1 ? cell.parentNode : cell;

  const td = closest(cell, 'td, th');
  const columnsCount = getPreviousSiblingsCount(td);

  return columnsCount;
}

/**
 * Find indexes of base table data from mappin data.
 * @param {Array.<Array.<object>>} cellIndexData - cell index data
 * @param {HTMLElement} cell - cell element like td or th
 * @returns {{rowIndex: number, cellIndex: number}}
 * @ignore
 */
function findCellIndex(cellIndexData, cell) {
  const elementRowIndex = findElementRowIndex(cell);
  const elementColIndex = findElementColIndex(cell);

  return cellIndexData[elementRowIndex][elementColIndex];
}

/**
 * Find last index of col merged cells.
 * @param {Array.<Array.<object>>} tableData - tableData data
 * @param {number} rowIndex - row index of base data
 * @param {number} colIndex - column index of tabld data
 * @returns {number}
 * @ignore
 */
function findRowMergedLastIndex(tableData, rowIndex, colIndex) {
  const cellData = tableData[rowIndex][colIndex];
  let foundRowIndex = rowIndex;

  if (cellData.rowspan > 1) {
    foundRowIndex += cellData.rowspan - 1;
  }

  return foundRowIndex;
}

/**
 * Find last index of col merged cells.
 * @param {Array.<Array.<object>>} tableData - tableData data
 * @param {number} rowIndex - row index of base data
 * @param {number} colIndex - column index of tabld data
 * @returns {number}
 * @ignore
 */
function findColMergedLastIndex(tableData, rowIndex, colIndex) {
  const cellData = tableData[rowIndex][colIndex];
  let foundColIndex = colIndex;

  if (cellData.colspan > 1) {
    foundColIndex += cellData.colspan - 1;
  }

  return foundColIndex;
}

/**
 * Find cell element index.
 * @param {Array.<Array.<object>>} tableData - tableData data
 * @param {number} rowIndex - row index of base data
 * @param {number} colIndex - col index of base data
 * @returns {{rowIndex: number, colIndex: number}}
 * @ignore
 */
function findElementIndex(tableData, rowIndex, colIndex) {
  const cellData = tableData[rowIndex][colIndex];

  rowIndex = isExisty(cellData.rowMergeWith) ? cellData.rowMergeWith : rowIndex;
  colIndex = isExisty(cellData.colMergeWith) ? cellData.colMergeWith : colIndex;

  return tableData[rowIndex][colIndex].elementIndex;
}

/**
 * Stuff cells into incomplete row.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} limitIndex - limit index
 * @ignore
 */
function stuffCellsIntoIncompleteRow(tableData, limitIndex) {
  tableData.forEach((rowData, rowIndex) => {
    const startIndex = rowData.length;

    if (startIndex) {
      const [{ nodeName }] = rowData;

      range(startIndex, limitIndex).forEach(colIndex => {
        rowData.push(createBasicCell(rowIndex, colIndex, nodeName));
      });
    }
  });
}

/**
 * Add tbody or thead of table data if need.
 * @param {Array.<Array.<object>>} tableData - table data
 * @returns {boolean}
 * @ignore
 */
function addTbodyOrTheadIfNeed(tableData) {
  const [header] = tableData;
  const cellCount = header.length;
  let added = true;

  if (!cellCount && tableData[1]) {
    range(0, tableData[1].length).forEach(colIndex => {
      header.push(createBasicCell(0, colIndex, 'TH'));
    });
  } else if (tableData[0][0].nodeName !== 'TH') {
    const newHeader = range(0, cellCount).map(colIndex => createBasicCell(0, colIndex, 'TH'));

    [].concat(...tableData).forEach(cellData => {
      if (cellData.elementIndex) {
        cellData.elementIndex.rowIndex += 1;
      }
    });

    tableData.unshift(newHeader);
  } else if (tableData.length === 1) {
    const newRow = range(0, cellCount).map(colIndex => createBasicCell(1, colIndex, 'TD'));

    tableData.push(newRow);
  } else {
    added = false;
  }

  return added;
}

export default {
  createTableData,
  createCellIndexData,
  createRenderData,
  findElementRowIndex,
  findElementColIndex,
  findCellIndex,
  createBasicCell,
  findRowMergedLastIndex,
  findColMergedLastIndex,
  findElementIndex,
  stuffCellsIntoIncompleteRow,
  addTbodyOrTheadIfNeed
};
