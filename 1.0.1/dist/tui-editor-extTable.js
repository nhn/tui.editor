/*!
 * tui-editor
 * @version 1.0.1
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com> (https://nhnent.github.io/tui.editor/)
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"), require("tui-code-snippet"), (function webpackLoadOptionalExternalModule() { try { return require("tui-editor"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("tui-editor/dist/tui-editor-Viewer"); } catch(e) {} }()), require("toMark"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery", "tui-code-snippet", "tui-editor", "tui-editor/dist/tui-editor-Viewer", "toMark"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("jquery"), require("tui-code-snippet"), (function webpackLoadOptionalExternalModule() { try { return require("tui-editor"); } catch(e) {} }()), (function webpackLoadOptionalExternalModule() { try { return require("tui-editor/dist/tui-editor-Viewer"); } catch(e) {} }()), require("toMark")) : factory(root["$"], (root["tui"] && root["tui"]["util"]), (root["tui"] && root["tui"]["Editor"]), (root["tui"] && root["tui"]["Editor"]), root["toMark"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_54__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 49);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
* @fileoverview Editor/Viewer proxy for extensions
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
/* eslint global-require: 0 no-empty: 0 */

var Editor = void 0;
try {
  Editor = __webpack_require__(4);
} catch (e) {}
if (!Editor) {
  try {
    Editor = __webpack_require__(5);
  } catch (e) {}
}

exports.default = Editor;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTableData = createTableData;
exports.createCellIndexData = createCellIndexData;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(2);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
/**
* @fileoverview Implements tableDataHandler
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
function _parseCell(cell, rowIndex, colIndex) {
  var $cell = (0, _jquery2.default)(cell);
  var colspan = $cell.attr('colspan');
  var rowspan = $cell.attr('rowspan');
  var nodeName = cell.nodeName;


  if (nodeName !== 'TH' && nodeName !== 'TD') {
    return null;
  }

  var cellData = {
    nodeName: cell.nodeName,
    colspan: colspan ? parseInt(colspan, 10) : 1,
    rowspan: rowspan ? parseInt(rowspan, 10) : 1,
    content: $cell.html(),
    elementIndex: {
      rowIndex: rowIndex,
      colIndex: colIndex
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
  var colspan = cellData.colspan,
      rowspan = cellData.rowspan,
      nodeName = cellData.nodeName;

  var colMerged = colspan > 1;
  var rowMerged = rowspan > 1;

  if (!colMerged && !rowMerged) {
    return;
  }

  var limitRowIndex = startRowIndex + rowspan;
  var limitCellIndex = startCellIndex + colspan;

  _tuiCodeSnippet2.default.range(startRowIndex, limitRowIndex).forEach(function (rowIndex) {
    base[rowIndex] = base[rowIndex] || [];

    _tuiCodeSnippet2.default.range(startCellIndex, limitCellIndex).forEach(function (cellIndex) {
      var mergedData = {
        nodeName: nodeName
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
 * Create table data from jQuery table Element.
 * @param {jQuery} $table - jQuery table element
 * @returns {Array.<Array.<object>>}
 * @ignore
 */
function createTableData($table) {
  var tableData = [];

  $table.find('tr').each(function (rowIndex, tr) {
    var stackedColCount = 0;

    tableData[rowIndex] = tableData[rowIndex] || [];

    (0, _jquery2.default)(tr).children().each(function (colIndex, cell) {
      var cellData = _parseCell(cell, rowIndex, colIndex);

      if (!cellData) {
        return;
      }
      var dataColIndex = colIndex + stackedColCount;

      while (tableData[rowIndex][dataColIndex]) {
        dataColIndex += 1;
        stackedColCount += 1;
      }

      tableData[rowIndex][dataColIndex] = cellData;
      _addMergedCell(tableData, cellData, rowIndex, dataColIndex);
    });
  });

  if ($table[0].className) {
    tableData.className = $table[0].className;
  }

  return tableData;
}

/**
 * Create cell index data of table data.
 * @param {Array.<Array.<object>>} tableData - table data
 * @returns {Array.<Array.<object>>}
 * @ignore
 */
function createCellIndexData(tableData) {
  var mappingData = [];

  tableData.forEach(function (row, rowIndex) {
    var mappingRow = [];

    row.forEach(function (cell, colIndex) {
      if (_tuiCodeSnippet2.default.isUndefined(cell.colMergeWith) && _tuiCodeSnippet2.default.isUndefined(cell.rowMergeWith)) {
        mappingRow.push({
          rowIndex: rowIndex,
          colIndex: colIndex
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
  var headRowData = tableData[0];


  return headRowData.map(function (cellData) {
    var align = void 0;

    if (_tuiCodeSnippet2.default.isExisty(cellData.colMergeWith)) {
      align = headRowData[cellData.colMergeWith].align;
    } else {
      align = cellData.align;
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
  var headerAligns = _getHeaderAligns(tableData);
  var renderData = cellIndexData.map(function (row) {
    return row.map(function (_ref) {
      var rowIndex = _ref.rowIndex,
          colIndex = _ref.colIndex;
      return _tuiCodeSnippet2.default.extend({
        align: headerAligns[colIndex]
      }, tableData[rowIndex][colIndex]);
    });
  });

  if (tableData.className) {
    renderData.className = tableData.className;
  }

  return renderData;
}

var BASIC_CELL_CONTENT = _tuiCodeSnippet2.default.browser.msie ? '' : '<br>';

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
      rowIndex: rowIndex,
      colIndex: colIndex
    }
  };
}

/**
 * Find element row index.
 * @param {jQuery} $cell - cell jQuery element like td or th
 * @returns {number}
 * @ignore
 */
function findElementRowIndex($cell) {
  var $tr = $cell.closest('tr');
  var rowIndex = $tr.prevAll().length;

  if ($tr.parent()[0].nodeName === 'TBODY') {
    rowIndex += 1;
  }

  return rowIndex;
}

/**
 * Find element col index.
 * @param {jQuery} $cell - cell jQuery element like td or th
 * @returns {number}
 * @ignore
 */
function findElementColIndex($cell) {
  return $cell.closest('td, th').prevAll().length;
}

/**
 * Find indexes of base table data from mappin data.
 * @param {Array.<Array.<object>>} cellIndexData - cell index data
 * @param {jQuery} $cell - cell jQuery element like td or th
 * @returns {{rowIndex: number, cellIndex: number}}
 * @ignore
 */
function findCellIndex(cellIndexData, $cell) {
  var elementRowIndex = findElementRowIndex($cell);
  var elementColIndex = findElementColIndex($cell);

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
  var cellData = tableData[rowIndex][colIndex];
  var foundRowIndex = rowIndex;

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
  var cellData = tableData[rowIndex][colIndex];
  var foundColIndex = colIndex;

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
  var cellData = tableData[rowIndex][colIndex];

  rowIndex = _tuiCodeSnippet2.default.isExisty(cellData.rowMergeWith) ? cellData.rowMergeWith : rowIndex;
  colIndex = _tuiCodeSnippet2.default.isExisty(cellData.colMergeWith) ? cellData.colMergeWith : colIndex;

  return tableData[rowIndex][colIndex].elementIndex;
}

/**
 * Stuff cells into incomplete row.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} limitIndex - limit index
 * @ignore
 */
function stuffCellsIntoIncompleteRow(tableData, limitIndex) {
  tableData.forEach(function (rowData, rowIndex) {
    var startIndex = rowData.length;
    var nodeName = rowData[0].nodeName;


    _tuiCodeSnippet2.default.range(startIndex, limitIndex).forEach(function (colIndex) {
      rowData.push(createBasicCell(rowIndex, colIndex, nodeName));
    });
  });
}

/**
 * Add tbody or thead of table data if need.
 * @param {Array.<Array.<object>>} tableData - table data
 * @returns {boolean}
 * @ignore
 */
function addTbodyOrTheadIfNeed(tableData) {
  var header = tableData[0];

  var cellCount = header.length;
  var added = true;

  if (!cellCount && tableData[1]) {
    _tuiCodeSnippet2.default.range(0, tableData[1].length).forEach(function (colIndex) {
      header.push(createBasicCell(0, colIndex, 'TH'));
    });
  } else if (tableData[0][0].nodeName !== 'TH') {
    var _ref2;

    var newHeader = _tuiCodeSnippet2.default.range(0, cellCount).map(function (colIndex) {
      return createBasicCell(0, colIndex, 'TH');
    });

    (_ref2 = []).concat.apply(_ref2, tableData).forEach(function (cellData) {
      if (cellData.elementIndex) {
        cellData.elementIndex.rowIndex += 1;
      }
    });

    tableData.unshift(newHeader);
  } else if (tableData.length === 1) {
    var newRow = _tuiCodeSnippet2.default.range(0, cellCount).map(function (colIndex) {
      return createBasicCell(1, colIndex, 'TD');
    });

    tableData.push(newRow);
  } else {
    added = false;
  }

  return added;
}

exports.default = {
  createTableData: createTableData,
  createCellIndexData: createCellIndexData,
  createRenderData: createRenderData,
  findElementRowIndex: findElementRowIndex,
  findElementColIndex: findElementColIndex,
  findCellIndex: findCellIndex,
  createBasicCell: createBasicCell,
  findRowMergedLastIndex: findRowMergedLastIndex,
  findColMergedLastIndex: findColMergedLastIndex,
  findElementIndex: findElementIndex,
  stuffCellsIntoIncompleteRow: stuffCellsIntoIncompleteRow,
  addTbodyOrTheadIfNeed: addTbodyOrTheadIfNeed
};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

if(typeof __WEBPACK_EXTERNAL_MODULE_4__ === 'undefined') {var e = new Error("Cannot find module \"undefined\""); e.code = 'MODULE_NOT_FOUND'; throw e;}
module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

if(typeof __WEBPACK_EXTERNAL_MODULE_5__ === 'undefined') {var e = new Error("Cannot find module \"undefined\""); e.code = 'MODULE_NOT_FOUND'; throw e;}
module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create cell html.
 * @param {object} cell - cell data of table base data
 * @returns {string}
 * @private
 */
/**
* @fileoverview Implements tableRenderer
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
function _createCellHtml(cell) {
  var attrs = cell.colspan > 1 ? ' colspan="' + cell.colspan + '"' : '';
  attrs += cell.rowspan > 1 ? ' rowspan="' + cell.rowspan + '"' : '';
  attrs += cell.align ? ' align="' + cell.align + '"' : '';

  return '<' + cell.nodeName + attrs + '>' + cell.content + '</' + cell.nodeName + '>';
}

/**
 * Create html for thead or tbody.
 * @param {Array.<Array.<object>>} trs - tr list
 * @param {string} wrapperNodeName - wrapper node name like THEAD, TBODY
 * @returns {string}
 * @private
 */
function _createTheadOrTbodyHtml(trs, wrapperNodeName) {
  var html = '';

  if (trs.length) {
    html = trs.map(function (tr) {
      var tdHtml = tr.map(_createCellHtml).join('');

      return '<tr>' + tdHtml + '</tr>';
    }).join('');
    html = '<' + wrapperNodeName + '>' + html + '</' + wrapperNodeName + '>';
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
  var thead = [renderData[0]];
  var tbody = renderData.slice(1);
  var theadHtml = _createTheadOrTbodyHtml(thead, 'THEAD');
  var tbodyHtml = _createTheadOrTbodyHtml(tbody, 'TBODY');
  var className = renderData.className ? ' class="' + renderData.className + '"' : '';

  return '<table' + className + '>' + (theadHtml + tbodyHtml) + '</renderData>';
}

/**
 * Replace table.
 * @param {jQuery} $table - table jQuery element
 * @param {Array.<Array.<object>>} tableData - table data
 * @returns {jQuery}
 * @ignore
 */
function replaceTable($table, tableData) {
  var cellIndexData = _tableDataHandler2.default.createCellIndexData(tableData);
  var renderData = _tableDataHandler2.default.createRenderData(tableData, cellIndexData);
  var $newTable = (0, _jquery2.default)(createTableHtml(renderData));

  $table.replaceWith($newTable);

  return $newTable;
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

exports.default = {
  createTableHtml: createTableHtml,
  replaceTable: replaceTable,
  focusToCell: focusToCell
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(2);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Find unmerged table range.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {jQuery} $start - start talbe cell jQuery element
 * @param {jQuery} $end - end table cell jQuery element
 * @returns {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }}
 * @private
 */
function _findUnmergedRange(tableData, $start, $end) {
  var cellIndexData = _tableDataHandler2.default.createCellIndexData(tableData);
  var startCellIndex = _tableDataHandler2.default.findCellIndex(cellIndexData, $start);
  var endCellIndex = _tableDataHandler2.default.findCellIndex(cellIndexData, $end);
  var startRowIndex = void 0,
      endRowIndex = void 0,
      startColIndex = void 0,
      endColIndex = void 0;

  if (startCellIndex.rowIndex > endCellIndex.rowIndex) {
    startRowIndex = endCellIndex.rowIndex;
    endRowIndex = startCellIndex.rowIndex;
  } else {
    startRowIndex = startCellIndex.rowIndex;
    endRowIndex = endCellIndex.rowIndex;
  }

  if (startCellIndex.colIndex > endCellIndex.colIndex) {
    startColIndex = endCellIndex.colIndex;
    endColIndex = startCellIndex.colIndex;
  } else {
    startColIndex = startCellIndex.colIndex;
    endColIndex = endCellIndex.colIndex;
  }

  return {
    start: {
      rowIndex: startRowIndex,
      colIndex: startColIndex
    },
    end: {
      rowIndex: endRowIndex,
      colIndex: endColIndex
    }
  };
}

/**
 * Expand table range by row merge properties like rowspan, rowMergeWith.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }} tableRange - table range
 * @param {string} rangeType - range type like start, end
 * @private
 */
/**
* @fileoverview Implements tableRangeHandler
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
function _expandRowMergedRange(tableData, tableRange, rangeType) {
  var rowIndex = tableRange[rangeType].rowIndex;

  var rowData = tableData[rowIndex];

  _tuiCodeSnippet2.default.range(tableRange.start.colIndex, tableRange.end.colIndex + 1).forEach(function (colIndex) {
    var cellData = rowData[colIndex];
    var rowMergeWith = cellData.rowMergeWith;

    var lastRowMergedIndex = -1;

    if (_tuiCodeSnippet2.default.isExisty(rowMergeWith)) {
      if (rowMergeWith < tableRange.start.rowIndex) {
        tableRange.start.rowIndex = rowMergeWith;
      }

      lastRowMergedIndex = rowMergeWith + tableData[rowMergeWith][colIndex].rowspan - 1;
    } else if (cellData.rowspan > 1) {
      lastRowMergedIndex = rowIndex + cellData.rowspan - 1;
    }

    if (lastRowMergedIndex > tableRange.end.rowIndex) {
      tableRange.end.rowIndex = lastRowMergedIndex;
    }
  });
}

/**
 * Expand table range by column merge properties like colspan, colMergeWith.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }} tableRange - table range
 * @param {number} rowIndex - row index
 * @param {number} colIndex - column index
 * @private
 */
function _expandColMergedRange(tableData, tableRange, rowIndex, colIndex) {
  var rowData = tableData[rowIndex];
  var cellData = rowData[colIndex];
  var colMergeWith = cellData.colMergeWith;

  var lastColMergedIndex = -1;

  if (_tuiCodeSnippet2.default.isExisty(colMergeWith)) {
    if (colMergeWith < tableRange.start.colIndex) {
      tableRange.start.colIndex = colMergeWith;
    }

    lastColMergedIndex = colMergeWith + rowData[colMergeWith].colspan - 1;
  } else if (cellData.colspan > 1) {
    lastColMergedIndex = colIndex + cellData.colspan - 1;
  }

  if (lastColMergedIndex > tableRange.end.colIndex) {
    tableRange.end.colIndex = lastColMergedIndex;
  }
}

/**
 * Expand table range by merge properties like colspan, rowspan.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }} tableRange - table range
 * @returns {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }}
 * @private
 */
function _expandMergedRange(tableData, tableRange) {
  var rangeStr = '';

  while (rangeStr !== JSON.stringify(tableRange)) {
    rangeStr = JSON.stringify(tableRange);

    _expandRowMergedRange(tableData, tableRange, 'start');
    _expandRowMergedRange(tableData, tableRange, 'end');

    _tuiCodeSnippet2.default.range(tableRange.start.rowIndex, tableRange.end.rowIndex + 1).forEach(function (rowIndex) {
      _expandColMergedRange(tableData, tableRange, rowIndex, tableRange.start.colIndex);
      _expandColMergedRange(tableData, tableRange, rowIndex, tableRange.end.colIndex);
    });
  }

  return tableRange;
}

/**
 * Find table range for selection.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {jQuery} $start - start jQuery element
 * @param {jQuery} $end - end jQuery element
 * @returns {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }}
 * @ignore
 */
function findSelectionRange(tableData, $start, $end) {
  var unmergedRange = _findUnmergedRange(tableData, $start, $end);

  return _expandMergedRange(tableData, unmergedRange);
}

/**
 * Get table selection range.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {jQuery} $selectedCells - selected cells jQuery elements
 * @param {jQuery} $startContainer - start container jQuery element of text range
 * @returns {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 *}}
 * @ignore
 */
function getTableSelectionRange(tableData, $selectedCells, $startContainer) {
  var cellIndexData = _tableDataHandler2.default.createCellIndexData(tableData);
  var tableRange = {};

  if ($selectedCells.length) {
    var startRange = _tableDataHandler2.default.findCellIndex(cellIndexData, $selectedCells.first());
    var endRange = _tuiCodeSnippet2.default.extend({}, startRange);

    $selectedCells.each(function (index, cell) {
      var cellIndex = _tableDataHandler2.default.findCellIndex(cellIndexData, (0, _jquery2.default)(cell));
      var cellData = tableData[cellIndex.rowIndex][cellIndex.colIndex];
      var lastRowMergedIndex = cellIndex.rowIndex + cellData.rowspan - 1;
      var lastColMergedIndex = cellIndex.colIndex + cellData.colspan - 1;

      endRange.rowIndex = Math.max(endRange.rowIndex, lastRowMergedIndex);
      endRange.colIndex = Math.max(endRange.colIndex, lastColMergedIndex);
    });

    tableRange.start = startRange;
    tableRange.end = endRange;
  } else {
    var cellIndex = _tableDataHandler2.default.findCellIndex(cellIndexData, $startContainer);

    tableRange.start = cellIndex;
    tableRange.end = _tuiCodeSnippet2.default.extend({}, cellIndex);
  }

  return tableRange;
}

exports.default = {
  findSelectionRange: findSelectionRange,
  getTableSelectionRange: getTableSelectionRange
};

/***/ }),
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _editorProxy = __webpack_require__(1);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

__webpack_require__(50);

var _mergedTableCreator = __webpack_require__(51);

var _mergedTableCreator2 = _interopRequireDefault(_mergedTableCreator);

var _tableUnmergePreparer = __webpack_require__(52);

var _tableUnmergePreparer2 = _interopRequireDefault(_tableUnmergePreparer);

var _toMarkRenderer = __webpack_require__(53);

var _toMarkRenderer2 = _interopRequireDefault(_toMarkRenderer);

var _wwMergedTableManager = __webpack_require__(55);

var _wwMergedTableManager2 = _interopRequireDefault(_wwMergedTableManager);

var _wwMergedTableSelectionManager = __webpack_require__(56);

var _wwMergedTableSelectionManager2 = _interopRequireDefault(_wwMergedTableSelectionManager);

var _mergedTableAddRow = __webpack_require__(57);

var _mergedTableAddRow2 = _interopRequireDefault(_mergedTableAddRow);

var _mergedTableAddCol = __webpack_require__(58);

var _mergedTableAddCol2 = _interopRequireDefault(_mergedTableAddCol);

var _mergedTableRemoveRow = __webpack_require__(59);

var _mergedTableRemoveRow2 = _interopRequireDefault(_mergedTableRemoveRow);

var _mergedTableRemoveCol = __webpack_require__(60);

var _mergedTableRemoveCol2 = _interopRequireDefault(_mergedTableRemoveCol);

var _mergedTableAlignCol = __webpack_require__(61);

var _mergedTableAlignCol2 = _interopRequireDefault(_mergedTableAlignCol);

var _mergeCell = __webpack_require__(62);

var _mergeCell2 = _interopRequireDefault(_mergeCell);

var _unmergeCell = __webpack_require__(63);

var _unmergeCell2 = _interopRequireDefault(_unmergeCell);

var _mergedTableUI = __webpack_require__(64);

var _mergedTableUI2 = _interopRequireDefault(_mergedTableUI);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * table extension
 * @param {Editor} editor - editor instance
 * @ignore
 */
/**
* @fileoverview Implements table extension
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
function tableExtension(editor) {
  var eventManager = editor.eventManager;


  editor.toMarkOptions = editor.toMarkOptions || {};
  editor.toMarkOptions.renderer = _toMarkRenderer2.default;
  _bindEvents(eventManager);

  if (editor.isViewer()) {
    return;
  }

  var wwComponentManager = editor.wwEditor.componentManager;
  var popupTableUtils = editor._ui.popupTableUtils;


  _addCommands(editor);
  _changeWysiwygManagers(wwComponentManager);

  if (editor._ui.popupTableUtils) {
    _mergedTableUI2.default.updateContextMenu(popupTableUtils, eventManager, wwComponentManager.getManager('tableSelection'));
  }
}

/**
 * Add commands.
 * @param {object} editor - editor instance
 * @private
 */
function _addCommands(editor) {
  editor.addCommand(_mergeCell2.default);
  editor.addCommand(_unmergeCell2.default);
}

/**
 * Change wysiwyg component managers.
 * @param {object} wwComponentManager - componentMananger instance
 * @private
 */
function _changeWysiwygManagers(wwComponentManager) {
  wwComponentManager.removeManager('table');
  wwComponentManager.removeManager('tableSelection');

  wwComponentManager.addManager(_wwMergedTableManager2.default);
  wwComponentManager.addManager(_wwMergedTableSelectionManager2.default);
}

/**
 * Change html by onChangeTable function.
 * @param {string} html - original html
 * @param {function} onChangeTable - function for changing html
 * @returns {string}
 * @private
 */
function _changeHtml(html, onChangeTable) {
  var $tempDiv = (0, _jquery2.default)('<div>' + html + '</div>');
  var $tables = $tempDiv.find('table');

  if ($tables.length) {
    $tables.get().forEach(function (tableElement) {
      var changedTableElement = onChangeTable(tableElement);

      (0, _jquery2.default)(tableElement).replaceWith(changedTableElement);
    });

    html = $tempDiv.html();
  }

  return html;
}

/**
 * Snatch wysiwyg command.
 * @param {{command: object}} commandWrapper - wysiwyg command wrapper
 * @private
 */
function _snatchWysiwygCommand(commandWrapper) {
  var command = commandWrapper.command;


  if (!command.isWWType()) {
    return;
  }

  switch (command.getName()) {
    case 'AddRow':
      commandWrapper.command = _mergedTableAddRow2.default;
      break;
    case 'AddCol':
      commandWrapper.command = _mergedTableAddCol2.default;
      break;
    case 'RemoveRow':
      commandWrapper.command = _mergedTableRemoveRow2.default;
      break;
    case 'RemoveCol':
      commandWrapper.command = _mergedTableRemoveCol2.default;
      break;
    case 'AlignCol':
      commandWrapper.command = _mergedTableAlignCol2.default;
      break;
    default:
  }
}

/**
 * Bind events.
 * @param {object} eventManager - eventManager instance
 * @private
 */
function _bindEvents(eventManager) {
  eventManager.listen('convertorAfterMarkdownToHtmlConverted', function (html) {
    return _changeHtml(html, _mergedTableCreator2.default);
  });
  eventManager.listen('convertorBeforeHtmlToMarkdownConverted', function (html) {
    return _changeHtml(html, _tableUnmergePreparer2.default);
  });
  eventManager.listen('addCommandBefore', _snatchWysiwygCommand);
}

_editorProxy2.default.defineExtension('table', tableExtension);

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _editorProxy = __webpack_require__(1);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var i18n = _editorProxy2.default.i18n; /**
                                       * @fileoverview i18n for table extension
                                       * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                       */

if (i18n) {
  i18n.setLanguage(['ko', 'ko_KR'], {
    'Merge cells': '셀 병합',
    'Unmerge cells': '셀 병합해제',
    'Cannot change part of merged cell': '병합 된 셀의 일부를 변경할 수 없습니다.',
    'Cannot paste row merged cells into the table header': '테이블 헤더에는 행 병합된 셀을 붙여넣을 수 없습니다.'
  });

  i18n.setLanguage(['en', 'en_US'], {
    'Merge cells': 'Merge cells',
    'Unmerge cells': 'Unmerge cells',
    'Cannot change part of merged cell': 'Cannot change part of merged cell.',
    'Cannot paste row merged cells into the table header': 'Cannot paste row merged cells into the table header.'
  });

  i18n.setLanguage(['ja', 'ja_JP'], {
    'Merge cells': 'セルの結合',
    'Unmerge cells': 'セルの結合を解除',
    'Cannot change part of merged cell': '結合されたセルの一部を変更することはできません。',
    'Cannot paste row merged cells into the table header': '行にマージされたセルをヘッダーに貼り付けることはできません。'
  });

  i18n.setLanguage(['nl', 'nl_NL'], {
    'Merge cells': 'cellen samenvoegen',
    'Unmerge cells': 'Samenvoegen cellen ongedaan maken',
    'Cannot change part of merged cell': 'Kan geen deel uit van samengevoegde cel te veranderen.',
    'Cannot paste row merged cells into the table header': 'Kan niet plakken rij samengevoegde cellen in de koptekst. '
  });

  i18n.setLanguage(['zh', 'zh_CN'], {
    'Merge cells': '合并单元格',
    'Unmerge cells': '取消合并单元格',
    'Cannot change part of merged cell': '无法更改合并单元格的一部分。',
    'Cannot paste row merged cells into the table header': '无法将行合并单元格粘贴到标题中。'
  });
}

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._extractPropertiesForMerge = _extractPropertiesForMerge;
exports._parseTableCell = _parseTableCell;
exports._createTableObjectFrom$Table = _createTableObjectFrom$Table;
exports._divideTrs = _divideTrs;
exports._mergeByColspan = _mergeByColspan;
exports._getRemovalTdCountsByRowspan = _getRemovalTdCountsByRowspan;
exports._mergeByRowspan = _mergeByRowspan;
exports.default = createMergedTable;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(2);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _tableRenderer = __webpack_require__(6);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Extract properties for merge.
 * @param {string} value - value
 * @param {string} type - merge type like colspan, rowspan
 * @param {string} oppossitType - oppossit merge type
 *                                if merge type is colspan, opossit merge type is rowspan
 * @returns {Array.<number|string>} - returns merge count and value
 * @private
 */
function _extractPropertiesForMerge(value, type, oppossitType) {
  var regex = new RegExp('^((?:' + oppossitType + '=[0-9]+:)?)' + type + '=([0-9]+):(.*)');
  var regexResult = regex.exec(value);
  var mergeCount = 1;

  if (regexResult) {
    mergeCount = parseInt(regexResult[2], 10);
    value = regexResult[1] + regexResult[3];
  }

  return [mergeCount, value];
}

/**
 * Parse table cell element like td, th.
 * @param {HTMLElement} cell - table cell element like td, th
 * @returns {{
 *   nodeName: string,
 *   colspan: number,
 *   rowspan: number,
 *   content: string,
 *   align: string
 * }}
 * @private
 */
/**
* @fileoverview Implements mergedTableCreator.
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
function _parseTableCell(cell) {
  var nodeName = cell.nodeName;

  var align = cell.align || '';
  var content = cell.innerHTML.trim();
  var colspan = null;
  var rowspan = null;

  var _extractPropertiesFor = _extractPropertiesForMerge(content, '@cols', '@rows');

  colspan = _extractPropertiesFor[0];
  content = _extractPropertiesFor[1];

  var _extractPropertiesFor2 = _extractPropertiesForMerge(content, '@rows', '@cols');

  rowspan = _extractPropertiesFor2[0];
  content = _extractPropertiesFor2[1];


  return {
    nodeName: nodeName,
    colspan: colspan,
    rowspan: rowspan,
    content: content,
    align: align
  };
}

/**
 * Create table object from jQuery table.
 * @param {jQuery} $table - jQuery table
 * @returns {Array.<Array.<object>>}
 * @private
 */
function _createTableObjectFrom$Table($table) {
  return $table.find('tr').get().map(function (tr) {
    return (0, _jquery2.default)(tr).find('td, th').get().map(_parseTableCell);
  });
}

/**
 * Find index by onFind function.
 * @param {Array} arr - target array
 * @param {function} onFind - find function
 * @returns {number}
 * @private
 */
function _findIndex(arr, onFind) {
  var foundIndex = -1;

  _tuiCodeSnippet2.default.forEach(arr, function (item, index) {
    var nextFind = true;
    if (onFind(item, index)) {
      foundIndex = index;
      nextFind = false;
    }

    return nextFind;
  });

  return foundIndex;
}

/**
 * Separate the trs according to the type of parent, such as thead and tbody.
 * @param {Array.<Array.<object>>} trs - tr list
 * @returns {Array.<Array.<Array.<object>>>} - returns thead and tbody
 * @private
 */
function _divideTrs(trs) {
  var tbodyStartIndex = _findIndex(trs, function (tr) {
    return tr[0].nodeName === 'TD';
  });

  return [trs.slice(0, tbodyStartIndex), trs.slice(tbodyStartIndex)];
}

/**
 * Merge by colspan.
 * @param {Array.<Array.<object>>} trs - tr list
 * @private
 */
function _mergeByColspan(trs) {
  trs.forEach(function (tr) {
    var tdCount = tr.length;
    var removalCount = 0;

    tr.forEach(function (td) {
      removalCount += td.colspan - 1;
    });

    tr.splice(tdCount - removalCount);
  });
}

/**
 * Get removal td counts by rowspan.
 * @param {Array.<Array.<object>>} trs - tr list
 * @returns {number}
 * @private
 */
function _getRemovalTdCountsByRowspan(trs) {
  var trIndexes = trs.map(function (tr, index) {
    return index;
  });
  var removalCounts = trIndexes.map(function () {
    return 0;
  });

  trs.forEach(function (tr, trIndex) {
    var rowspanTds = tr.filter(function (td) {
      return td.rowspan > 1;
    });
    var startTrIndexForRemoval = trIndex + 1;

    rowspanTds.forEach(function (td) {
      var removeCount = td.colspan;
      var endTrIndexForRemoval = startTrIndexForRemoval + (td.rowspan - 1);

      trIndexes.slice(startTrIndexForRemoval, endTrIndexForRemoval).forEach(function (removeIndex) {
        removalCounts[removeIndex] += removeCount;
      });
    });
  });

  return removalCounts;
}

/**
 * Merge by rowspan.
 * @param {Array.<Array.<object>>} trs - tr list
 * @private
 */
function _mergeByRowspan(trs) {
  var removalCounts = _getRemovalTdCountsByRowspan(trs);

  trs.forEach(function (tr, trIndex) {
    tr.splice(tr.length - removalCounts[trIndex]);
  });
}

/**
 * Create merged table by @cols, @rows value in td innerHTML.
 * @param {HTMLElement} tableElement - unmerged table
 * @returns {HTMLElement}
 */
function createMergedTable(tableElement) {
  var table = _createTableObjectFrom$Table((0, _jquery2.default)(tableElement));

  var _divideTrs2 = _divideTrs(table),
      thead = _divideTrs2[0],
      tbody = _divideTrs2[1];

  _mergeByColspan(thead);
  _mergeByColspan(tbody);
  _mergeByRowspan(tbody);

  return (0, _jquery2.default)(_tableRenderer2.default.createTableHtml(table))[0];
}

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._prependMergeSyntaxToContent = _prependMergeSyntaxToContent;
exports.default = prepareTableUnmerge;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Prepend merge syntax to content.
 * @param {HTMLElement} cell - td or th
 * @private
 */
function _prependMergeSyntaxToContent(cell) {
  var $cell = (0, _jquery2.default)(cell);
  var colspan = $cell.attr('colspan') || '';
  var rowspan = $cell.attr('rowspan') || '';
  var content = $cell.html();

  if (colspan) {
    content = '@cols=' + colspan + ':' + content;
  }

  if (rowspan) {
    content = '@rows=' + rowspan + ':' + content;
  }

  if (content) {
    $cell.html(content);
  }
}

/**
 * Prepare table unmerge.
 * @param {HTMLElement} tableElement - table element
 * @returns {HTMLElement}
 */
/**
* @fileoverview Implements tableUnmergePreparer.
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
function prepareTableUnmerge(tableElement) {
  (0, _jquery2.default)(tableElement).find('td, th').get().forEach(_prependMergeSyntaxToContent);

  return tableElement;
}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._getAdditionalThCount = _getAdditionalThCount;
exports._createTheadMarkdown = _createTheadMarkdown;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(2);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _toMark = __webpack_require__(54);

var _toMark2 = _interopRequireDefault(_toMark);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RX_COLS = /@cols=[0-9]+:/g;

/**
 * Create repeat string.
 * @param {string} str - target string
 * @param {number} count - count
 * @returns {string}
 * @private
 */
/**
* @fileoverview Implements toMarkRendererCreator.
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
function _createRepeatString(str, count) {
  return _tuiCodeSnippet2.default.range(0, count).map(function () {
    return str;
  }).join('');
}

/**
 * Make table head align text.
 * Copy from https://github.com/nhnent/toMark/blob/develop/src/renderer.gfm.js
 * @param {HTMLElement} thElement - Table head cell element
 * @returns {string}
 * @private
 */
function _makeTableHeadAlignText(thElement) {
  var align = thElement.align;

  var textContent = (thElement.textContent || thElement.innerText).replace(RX_COLS, '');
  var textLength = textContent.length;
  var leftAlignValue = '';
  var rightAlignValue = '';

  if (align) {
    if (align === 'left') {
      leftAlignValue = ':';
      textLength -= 1;
    } else if (align === 'right') {
      rightAlignValue = ':';
      textLength -= 1;
    } else if (align === 'center') {
      rightAlignValue = ':';
      leftAlignValue = ':';
      textLength -= 2;
    }
  }

  textLength = Math.max(textLength, 3);

  return leftAlignValue + _createRepeatString('-', textLength) + rightAlignValue;
}

/**
 * Get additional th element count.
 * @param {Array.<HTMLElement>} ths - th element list
 * @private
 * @returns {Number}
 */
function _getAdditionalThCount(ths) {
  var additionalThCount = 0;

  ths.filter(function (th) {
    return (0, _jquery2.default)(th).attr('colspan');
  }).forEach(function (th) {
    additionalThCount += parseInt((0, _jquery2.default)(th).attr('colspan'), 10) - 1;
  });

  return additionalThCount;
}

/**
 * Create thead markdown.
 * @param {HTMLElement} theadElement - theadElement element
 * @param {string} theadContentMarkdown - thead markdown content
 * @returns {string}
 * @private
 */
function _createTheadMarkdown(theadElement, theadContentMarkdown) {
  var ths = (0, _jquery2.default)(theadElement).find('th').get();
  var align = ths.map(function (th) {
    return ' ' + _makeTableHeadAlignText(th) + ' |';
  }).join('');

  align += _createRepeatString(' --- |', _getAdditionalThCount(ths));

  return theadContentMarkdown ? theadContentMarkdown + '|' + align + '\n' : '';
}

exports.default = _toMark2.default.Renderer.factory(_toMark2.default.gfmRenderer, {
  'THEAD': _createTheadMarkdown
});

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_54__;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(2);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _editorProxy = __webpack_require__(1);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRenderer = __webpack_require__(6);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

var _tableRangeHandler = __webpack_require__(7);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @fileoverview Implements wysiwyg merged table manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */


var WwTableManager = _editorProxy2.default.WwTableManager,
    i18n = _editorProxy2.default.i18n;

var PASTE_TABLE_BOOKMARK = 'tui-paste-table-bookmark';
var PASTE_TABLE_CELL_BOOKMARK = 'tui-paste-table-cell-bookmark';

/**
 * Class WwMergedTableManager
 * @extends {WwTableManager}
 */

var WwMergedTableManager = function (_WwTableManager) {
  _inherits(WwMergedTableManager, _WwTableManager);

  function WwMergedTableManager() {
    _classCallCheck(this, WwMergedTableManager);

    return _possibleConstructorReturn(this, (WwMergedTableManager.__proto__ || Object.getPrototypeOf(WwMergedTableManager)).apply(this, arguments));
  }

  _createClass(WwMergedTableManager, [{
    key: '_updateCopyDataMergeWith',

    /**
     * Update mergeWidth property like rowMergeWith, colMergeWith of table data for copy.
     * @param {Array.<Array.<object>>} copyTableData - table data for copy
     * @param {{rowIndex: number, colIndex: number}} startRange - start range
     * @private
     */
    value: function _updateCopyDataMergeWith(copyTableData, startRange) {
      copyTableData.forEach(function (rowData) {
        rowData.forEach(function (cellData) {
          if (_tuiCodeSnippet2.default.isExisty(cellData.rowMergeWith)) {
            cellData.rowMergeWith -= startRange.rowIndex;
          }

          if (_tuiCodeSnippet2.default.isExisty(cellData.colMergeWith)) {
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

  }, {
    key: '_createCopyTableData',
    value: function _createCopyTableData(tableData, startRange, endRange) {
      var copyTableData = tableData.slice(startRange.rowIndex, endRange.rowIndex + 1);

      copyTableData = copyTableData.map(function (rowData) {
        return rowData.slice(startRange.colIndex, endRange.colIndex + 1);
      });

      this._updateCopyDataMergeWith(copyTableData, startRange);

      return copyTableData;
    }

    /**
     * Update table html of clipboard data, if has selected cells.
     * @param {jQuery} $clipboardContainer - jQuery element
     * @override
     */

  }, {
    key: 'updateTableHtmlOfClipboardIfNeed',
    value: function updateTableHtmlOfClipboardIfNeed($clipboardContainer) {
      var $selectedCells = this.wwe.componentManager.getManager('tableSelection').getSelectedCells();

      if ($selectedCells.length) {
        var tableData = _tableDataHandler2.default.createTableData((0, _jquery2.default)($selectedCells[0]).closest('TABLE'));

        var _tableRangeHandler$ge = _tableRangeHandler2.default.getTableSelectionRange(tableData, $selectedCells),
            startRange = _tableRangeHandler$ge.start,
            endRange = _tableRangeHandler$ge.end;

        var copyTableData = this._createCopyTableData(tableData, startRange, endRange);
        var cellIndexData = _tableDataHandler2.default.createCellIndexData(copyTableData);
        var renderData = _tableDataHandler2.default.createRenderData(copyTableData, cellIndexData);

        $clipboardContainer.html(_tableRenderer2.default.createTableHtml(renderData));
      }
    }

    /**
     * Prepare to table cell stuffing
     * @param {Array.<Array.<object>>} tableData - table data
     * @returns {{maximumCellLength: *, needTableCellStuffingAid: boolean}}
     * @override
     */

  }, {
    key: 'prepareToTableCellStuffing',
    value: function prepareToTableCellStuffing(tableData) {
      var maximumCellLength = tableData[0].length;
      var needTableCellStuffingAid = false;

      tableData.slice(1).forEach(function (rowData) {
        var cellCount = rowData.length;

        if (maximumCellLength !== cellCount) {
          needTableCellStuffingAid = true;

          if (maximumCellLength < cellCount) {
            maximumCellLength = cellCount;
          }
        }
      });

      return {
        maximumCellLength: maximumCellLength,
        needTableCellStuffingAid: needTableCellStuffingAid
      };
    }

    /**
     * Append table cells.
     * @param {HTMLElement} node Table element
     * @override
     */

  }, {
    key: 'tableCellAppendAidForTableElement',
    value: function tableCellAppendAidForTableElement(node) {
      var $table = (0, _jquery2.default)(node);
      var tableData = _tableDataHandler2.default.createTableData($table);
      var added = _tableDataHandler2.default.addTbodyOrTheadIfNeed(tableData);
      var tableAidInformation = this.prepareToTableCellStuffing(tableData);
      var needTableCellStuffingAid = tableAidInformation.needTableCellStuffingAid;


      if (needTableCellStuffingAid) {
        _tableDataHandler2.default.stuffCellsIntoIncompleteRow(tableData, tableAidInformation.maximumCellLength);
      }

      if (added || needTableCellStuffingAid) {
        _tableRenderer2.default.replaceTable($table, tableData);
      }
    }

    /**
     * Find start cell.
     * @param {jQuery} $selectedCells - jQuery elements like td, th
     * @returns {HTMLElement}
     * @private
     */

  }, {
    key: '_findStartCell',
    value: function _findStartCell($selectedCells) {
      var startCell = void 0;

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

  }, {
    key: '_findStartCellIndex',
    value: function _findStartCellIndex(tableData, $startCell) {
      var cellIndexData = _tableDataHandler2.default.createCellIndexData(tableData);

      return _tableDataHandler2.default.findCellIndex(cellIndexData, $startCell);
    }

    /**
     * Whether has row merged header in clipboardTableData.
     * @param {Array.<Array.<object>>} clipboardTableData - table data of clipboard
     * @param {Array.<Array.<object>>} tableData - table data
     * @param {{rowIndex: number, colIndex: number}} startCellIndex - start cell index
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_hasRowMergedHeader',
    value: function _hasRowMergedHeader(clipboardTableData, tableData, startCellIndex) {
      var isHeader = tableData[startCellIndex.rowIndex][startCellIndex.colIndex].nodeName === 'TH';
      var hasHeaderMerge = any(clipboardTableData[0], function (cellData) {
        return cellData.rowspan && cellData.rowspan > 1;
      });

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

  }, {
    key: '_isExactlyFit',
    value: function _isExactlyFit(clipboardTableData, targetRowCount, targetColCount) {
      return targetRowCount % clipboardTableData.length === 0 && targetColCount % clipboardTableData[0].length === 0;
    }

    /**
     * Update clibpard table data.
     * @param {Array.<Array.<object>>} clipboardTableData - table data of clipboard
     * @param {number} targetRowCount - target row count
     * @param {number} targetColCount - target col count
     * @private
     */

  }, {
    key: '_updateClipboardTableData',
    value: function _updateClipboardTableData(clipboardTableData, targetRowCount, targetColCount) {
      var clipboardRowCount = clipboardTableData.length;
      var clipboardColCount = clipboardTableData[0].length;
      var increaseRowCount = parseInt(targetRowCount / clipboardRowCount, 10);
      var increaseColCount = parseInt(targetColCount / clipboardColCount, 10);

      if (increaseRowCount > 1) {
        var originalData = JSON.parse(JSON.stringify(clipboardTableData));

        _tuiCodeSnippet2.default.range(0, increaseRowCount - 1).forEach(function () {
          var newRows = JSON.parse(JSON.stringify(originalData));

          clipboardTableData.push.apply(clipboardTableData, newRows);
        });
      }

      if (increaseColCount > 1) {
        var _originalData = JSON.parse(JSON.stringify(clipboardTableData));

        _tuiCodeSnippet2.default.range(0, increaseColCount - 1).forEach(function () {
          var newData = JSON.parse(JSON.stringify(_originalData));
          clipboardTableData.forEach(function (rowData, rowIndex) {
            rowData.push.apply(rowData, newData[rowIndex]);
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

  }, {
    key: '_updateTableDataByClipboardData',
    value: function _updateTableDataByClipboardData(clipboardTableData, tableData, startCellIndex) {
      var startRowIndex = startCellIndex.rowIndex;
      var startColIndex = startCellIndex.colIndex;

      clipboardTableData.forEach(function (rowData, rowIndex) {
        var updateRowIndex = startRowIndex + rowIndex;

        rowData.forEach(function (cellData, colIndex) {
          var updateColIndex = startColIndex + colIndex;
          var prevCellData = tableData[updateRowIndex][updateColIndex];

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

  }, {
    key: '_isPossibleToPaste',
    value: function _isPossibleToPaste(tableData, startCellIndex, endCellIndex) {
      var startRowIndex = startCellIndex.rowIndex;
      var startColIndex = startCellIndex.colIndex;
      var endRowIndex = endCellIndex.rowIndex;
      var endColIndex = endCellIndex.colIndex;
      var filterdTableData = tableData.slice(startRowIndex, endRowIndex + 1);
      var firstRow = filterdTableData[0].slice(startColIndex, endColIndex + 1);
      var isPossible = !any(firstRow, function (cellData) {
        return _tuiCodeSnippet2.default.isExisty(cellData.rowMergeWith);
      });

      if (isPossible) {
        var firstCells = _tuiCodeSnippet2.default.pluck(filterdTableData, startColIndex);

        isPossible = !any(firstCells, function (cellData) {
          return _tuiCodeSnippet2.default.isExisty(cellData.colMergeWith);
        });
      }

      if (isPossible && tableData.length > endRowIndex + 1) {
        var nextRow = tableData[endRowIndex + 1].slice(startColIndex, endColIndex + 1);

        isPossible = !any(nextRow, function (cellData) {
          return _tuiCodeSnippet2.default.isExisty(cellData.rowMergeWith);
        });
      }

      if (isPossible && tableData[0].length > endColIndex + 1) {
        var nextCells = _tuiCodeSnippet2.default.pluck(filterdTableData, endColIndex + 1);

        isPossible = !any(nextCells, function (cellData) {
          return _tuiCodeSnippet2.default.isExisty(cellData.colMergeWith);
        });
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

  }, {
    key: '_spliceClipboardData',
    value: function _spliceClipboardData(clipboardTableData, targetRowCount, targetColCount) {
      clipboardTableData.splice(targetRowCount);
      clipboardTableData.forEach(function (rowData) {
        rowData.splice(targetColCount);
      });
    }

    /**
     * bookmark last td.
     * @param {number} endRowIndex - end row index
     * @param {number} endColIndex - end col index
     * @private
     */

  }, {
    key: '_bookmarkLastTd',
    value: function _bookmarkLastTd(_ref) {
      var endRowIndex = _ref.rowIndex,
          endColIndex = _ref.colIndex;

      var sq = this.wwe.getEditor();
      var $bookmarkedTable = sq.get$Body().find('.' + PASTE_TABLE_BOOKMARK);
      var tableData = _tableDataHandler2.default.createTableData($bookmarkedTable);
      var lastCellData = tableData[endRowIndex][endColIndex];

      endRowIndex = _tuiCodeSnippet2.default.isExisty(lastCellData.rowMergeWith) ? lastCellData.rowMergeWith : endRowIndex;
      endColIndex = _tuiCodeSnippet2.default.isExisty(lastCellData.colMergeWith) ? lastCellData.colMergeWith : endColIndex;

      var lastCellIndex = tableData[endRowIndex][endColIndex].elementIndex;
      var lastTd = $bookmarkedTable.find('tr').eq(lastCellIndex.rowIndex).children()[lastCellIndex.colIndex];

      $bookmarkedTable.removeClass(PASTE_TABLE_BOOKMARK);
      (0, _jquery2.default)(lastTd).addClass(PASTE_TABLE_CELL_BOOKMARK);
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

  }, {
    key: '_updateClipboardDataForPasteToSamllerSelectedArea',
    value: function _updateClipboardDataForPasteToSamllerSelectedArea(clipboardTableData, tableData, targetRowCount, targetColCount, startRange) {
      var updated = true;
      var startCellIndex = {
        rowIndex: 0,
        colIndex: 0
      };

      var endCellIndex = {
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

  }, {
    key: '_pasteToSelectedArea',
    value: function _pasteToSelectedArea($table, clipboardTableData, tableData, $selectedCells) {
      var _tableRangeHandler$ge2 = _tableRangeHandler2.default.getTableSelectionRange(tableData, $selectedCells),
          startRange = _tableRangeHandler$ge2.start,
          endRange = _tableRangeHandler$ge2.end;

      var targetRowCount = endRange.rowIndex - startRange.rowIndex + 1;
      var targetColCount = endRange.colIndex - startRange.colIndex + 1;
      var clipboardRowCount = clipboardTableData.length;
      var clipboardColCount = clipboardTableData[0].length;
      var isSelectionLargerThanData = targetRowCount >= clipboardRowCount && targetColCount >= clipboardColCount;
      var alertMessage = i18n.get('Cannot change part of merged cell');
      var updated = true;
      var endCellIndex = void 0;

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
      } else {
        // selected area is smaller then paste data
        endCellIndex = {
          rowIndex: startRange.rowIndex + targetRowCount - 1,
          colIndex: startRange.colIndex + targetColCount - 1
        };

        updated = this._updateClipboardDataForPasteToSamllerSelectedArea(clipboardTableData, tableData, targetRowCount, targetColCount, startRange);
      }

      if (updated) {
        tableData.className += ' ' + PASTE_TABLE_BOOKMARK;
        _tableRenderer2.default.replaceTable($table, tableData);
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

  }, {
    key: '_findEndCellIndex',
    value: function _findEndCellIndex(clipboardTableData, _ref2) {
      var startRowIndex = _ref2.rowIndex,
          startColIndex = _ref2.colIndex;

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

  }, {
    key: '_expandRow',
    value: function _expandRow(tableData, expandCount) {
      var startRowIndex = tableData.length;
      var cellCount = tableData[0].length;
      var newRows = _tuiCodeSnippet2.default.range(startRowIndex, startRowIndex + expandCount).map(function (rowIndex) {
        return _tuiCodeSnippet2.default.range(0, cellCount).map(function (colIndex) {
          return _tableDataHandler2.default.createBasicCell(rowIndex, colIndex);
        });
      });

      tableData.push.apply(tableData, newRows);
    }

    /**
     * Expand column.
     * @param {Array.<Array.<object>>} tableData - table data
     * @param {number} expandCount - expand count
     * @private
     */

  }, {
    key: '_expandCoumn',
    value: function _expandCoumn(tableData, expandCount) {
      var startCellIndex = tableData[0].length;
      var additionalCellRange = _tuiCodeSnippet2.default.range(startCellIndex, startCellIndex + expandCount);

      tableData.forEach(function (rowData, rowIndex) {
        var nodeName = rowData[0].nodeName;

        var newCells = additionalCellRange.map(function (colIndex) {
          return _tableDataHandler2.default.createBasicCell(rowIndex, colIndex, nodeName);
        });

        rowData.push.apply(rowData, newCells);
      });
    }

    /**
     * Expand table data, if need.
     * @param {Array.<Array.<object>>} tableData - table data
     * @param {{rowIndex: number, colIndex: number}} startCellIndex - start cell index
     * @param {{rowIndex: number, colIndex: number}} endCellIndex - end cell index
     * @private
     */

  }, {
    key: '_expandTableDataIfNeed',
    value: function _expandTableDataIfNeed(tableData, startCellIndex, endCellIndex) {
      var expandRowCount = endCellIndex.rowIndex - tableData.length + 1;
      var expandCellCount = endCellIndex.colIndex - tableData[0].length + 1;

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

  }, {
    key: '_pasteAllClipboardTableData',
    value: function _pasteAllClipboardTableData($table, clipboardTableData, tableData, startCellIndex) {
      var endCellIndex = this._findEndCellIndex(clipboardTableData, startCellIndex);

      if (this._hasRowMergedHeader(clipboardTableData, tableData, startCellIndex)) {
        alert(i18n.get('Cannot paste row merged cells into the table header'));
        this.wwe.focus();

        return;
      }

      this._expandTableDataIfNeed(tableData, startCellIndex, endCellIndex);

      if (this._isPossibleToPaste(tableData, startCellIndex, endCellIndex)) {
        this._updateTableDataByClipboardData(clipboardTableData, tableData, startCellIndex);
        tableData.className += ' ' + PASTE_TABLE_BOOKMARK;
        _tableRenderer2.default.replaceTable($table, tableData);
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

  }, {
    key: 'pasteClipboardData',
    value: function pasteClipboardData($clipboardTable) {
      var clipboardTableData = _tableDataHandler2.default.createTableData($clipboardTable);
      var tableSelectionManager = this.wwe.componentManager.getManager('tableSelection');
      var $selectedCells = tableSelectionManager.getSelectedCells();
      var $startCell = (0, _jquery2.default)(this._findStartCell($selectedCells));
      var $table = $startCell.closest('table');
      var tableData = _tableDataHandler2.default.createTableData($table);
      var startCellIndex = this._findStartCellIndex(tableData, $startCell);

      if ($selectedCells.length > 1) {
        // selection
        this._pasteToSelectedArea($table, clipboardTableData, tableData, $selectedCells);
      } else {
        // cursor
        this._pasteAllClipboardTableData($table, clipboardTableData, tableData, startCellIndex);
      }
    }
  }]);

  return WwMergedTableManager;
}(WwTableManager);

/**
 * Whether one of them is true or not.
 * @param {Array} arr - target array
 * @param {function} contition - condition function
 * @returns {boolean}
 * @ignore
 */


function any(arr, contition) {
  var result = false;

  _tuiCodeSnippet2.default.forEach(arr, function (item) {
    result = contition(item);

    return !result;
  });

  return result;
}

exports.default = WwMergedTableManager;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(2);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _editorProxy = __webpack_require__(1);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(7);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @fileoverview Implements wysiwyg merged table selection manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */


var WwTableSelectionManager = _editorProxy2.default.WwTableSelectionManager;


var TABLE_CELL_SELECTED_CLASS_NAME = 'te-cell-selected';

/**
 * Class WwMergedTableSelectionManager
 */

var WwMergedTableSelectionManager = function (_WwTableSelectionMana) {
  _inherits(WwMergedTableSelectionManager, _WwTableSelectionMana);

  /**
   * Creates an instance of WwMergedTableSelectionManager.
   * @param {WysiwygEditor} wwe - WysiwygEditor instance
   * @memberof WwMergedTableSelectionManager
   */
  function WwMergedTableSelectionManager(wwe) {
    _classCallCheck(this, WwMergedTableSelectionManager);

    /**
     * table cache data
     * @type {Array.<Array.<Object>>}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (WwMergedTableSelectionManager.__proto__ || Object.getPrototypeOf(WwMergedTableSelectionManager)).call(this, wwe));

    _this._tableData = null;

    _this.mergedTableSelectionManager = true;
    return _this;
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


  _createClass(WwMergedTableSelectionManager, [{
    key: '_addClassToSelectedCells',
    value: function _addClassToSelectedCells($table, tableData, tableRange) {
      var startRange = tableRange.start;
      var endRange = tableRange.end;
      var cellIndexRange = _tuiCodeSnippet2.default.range(startRange.colIndex, endRange.colIndex + 1);
      var $trs = $table.find('tr');

      _tuiCodeSnippet2.default.range(startRange.rowIndex, endRange.rowIndex + 1).forEach(function (rowIndex) {
        var rowData = tableData[rowIndex];
        var $cells = $trs.eq(rowIndex).find('td, th');

        return cellIndexRange.forEach(function (colIndex) {
          var cellData = rowData[colIndex];

          if (cellData.elementIndex) {
            $cells.eq(rowData[colIndex].elementIndex.colIndex).addClass(TABLE_CELL_SELECTED_CLASS_NAME);
          }
        });
      });
    }

    /**
     * cache table data on drag start
     * @param {HTMLElement} selectionStart - start element
     */

  }, {
    key: 'onDragStart',
    value: function onDragStart(selectionStart) {
      var $table = (0, _jquery2.default)(selectionStart).closest('[contenteditable=true] table');
      this._tableData = _tableDataHandler2.default.createTableData($table);
    }

    /**
     * clear table data in cache on drag end
     */

  }, {
    key: 'onDragEnd',
    value: function onDragEnd() {
      this._tableData = null;
    }

    /**
     * Highlight selected table cells
     * @param {HTMLElement} selectionStart start element
     * @param {HTMLElement} selectionEnd end element
     * @override
     */

  }, {
    key: 'highlightTableCellsBy',
    value: function highlightTableCellsBy(selectionStart, selectionEnd) {
      var $start = (0, _jquery2.default)(selectionStart);
      var $end = (0, _jquery2.default)(selectionEnd);
      var $table = $start.closest('[contenteditable=true] table');
      var tableRange = _tableRangeHandler2.default.findSelectionRange(this._tableData, $start, $end);

      this.removeClassAttrbuteFromAllCellsIfNeed();
      this._addClassToSelectedCells($table, this._tableData, tableRange);
    }

    /**
     * Style to selected cells.
     * @param {function} onStyle - function for styling
     */

  }, {
    key: 'styleToSelectedCells',
    value: function styleToSelectedCells(onStyle) {
      var sq = this.wwe.getEditor();
      var range = sq.getSelection().cloneRange();
      var $table = (0, _jquery2.default)(range.startContainer).closest('[contenteditable=true] table');

      $table.find('tr').get().forEach(function (tr) {
        var $cells = (0, _jquery2.default)(tr).find('.' + TABLE_CELL_SELECTED_CLASS_NAME);
        var firstSelectedCell = $cells.first().get(0);
        var lastSelectedCell = $cells.last().get(0);

        if (!$cells.length) {
          return;
        }

        range.setStart(firstSelectedCell, 0);
        range.setEnd(lastSelectedCell, lastSelectedCell.childNodes.length);
        sq.setSelection(range);
        onStyle(sq);
      });
    }

    /**
     * Whether has selected both TH and TD.
     * @param {jQuery} $selectedCells - selected cells jQuery element
     * @returns {boolean}
     */

  }, {
    key: 'hasSelectedBothThAndTd',
    value: function hasSelectedBothThAndTd($selectedCells) {
      $selectedCells = $selectedCells || this.getSelectedCells();

      return $selectedCells.first()[0].nodeName !== $selectedCells.last()[0].nodeName;
    }
  }]);

  return WwMergedTableSelectionManager;
}(WwTableSelectionManager);

exports.default = WwMergedTableSelectionManager;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._createNewRow = _createNewRow;
exports._addRow = _addRow;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(2);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _editorProxy = __webpack_require__(1);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(7);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(6);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements mergedTableAddRow. Add Row to selected table
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
var CommandManager = _editorProxy2.default.CommandManager;


var AddRow = void 0;
if (CommandManager) {
  AddRow = CommandManager.command('wysiwyg', /** @lends AddRow */{
    name: 'AddRow',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - wysiwygEditor instance
     */
    exec: function exec(wwe) {
      var sq = wwe.getEditor();
      var range = sq.getSelection().cloneRange();

      wwe.focus();

      if (!sq.hasFormat('TABLE')) {
        return;
      }

      var $startContainer = (0, _jquery2.default)(range.startContainer);
      var $table = $startContainer.closest('table');
      var tableData = _tableDataHandler2.default.createTableData($table);
      var $selectedCells = wwe.componentManager.getManager('tableSelection').getSelectedCells();
      var tableRange = _tableRangeHandler2.default.getTableSelectionRange(tableData, $selectedCells, $startContainer);

      sq.saveUndoState(range);
      _addRow(tableData, tableRange);

      var $newTable = _tableRenderer2.default.replaceTable($table, tableData);
      var focusTd = _findFocusTd($newTable, tableRange.end.rowIndex, tableRange.start.colIndex);

      _tableRenderer2.default.focusToCell(sq, range, focusTd);
    }
  });
}

/**
 * Create row merged cell data.
 * @param {number} rowMergeWith - row merge with index
 * @returns {{
 *   nodeName: string,
 *   rowMergeWith: number
 * }}
 * @private
 */
function _createRowMergedCell(rowMergeWith) {
  return {
    nodeName: 'TD',
    rowMergeWith: rowMergeWith
  };
}

/**
 * Create new row.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} rowIndex - row index of table data
 * @returns {object}
 * @private
 */
function _createNewRow(tableData, rowIndex) {
  var prevCell = null;

  return tableData[rowIndex].map(function (cellData, colIndex) {
    var newCell = void 0;

    if (_tuiCodeSnippet2.default.isExisty(cellData.rowMergeWith)) {
      var rowMergeWith = cellData.rowMergeWith;

      var merger = tableData[rowMergeWith][colIndex];
      var lastMergedRowIndex = rowMergeWith + merger.rowspan - 1;

      if (_tuiCodeSnippet2.default.isExisty(merger.colMergeWith) && prevCell) {
        newCell = _tuiCodeSnippet2.default.extend({}, prevCell);
      } else if (lastMergedRowIndex > rowIndex) {
        merger.rowspan += 1;
        newCell = _tuiCodeSnippet2.default.extend({}, cellData);
      }
    } else if (cellData.rowspan > 1) {
      cellData.rowspan += 1;
      newCell = _createRowMergedCell(rowIndex);
    }

    if (!newCell) {
      newCell = _tableDataHandler2.default.createBasicCell(rowIndex + 1, colIndex);
    }

    prevCell = newCell;

    return newCell;
  });
}

/**
 * Add row.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }} tableRange - table selection range
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @private
 */
function _addRow(tableData, tableRange) {
  var startRowIndex = tableRange.start.rowIndex;
  var endRange = tableRange.end;
  var endRowIndex = _tableDataHandler2.default.findRowMergedLastIndex(tableData, endRange.rowIndex, endRange.colIndex);
  var newRows = _tuiCodeSnippet2.default.range(startRowIndex, endRowIndex + 1).map(function () {
    return _createNewRow(tableData, endRowIndex);
  });

  tableData.splice.apply(tableData, [endRowIndex + 1, 0].concat(newRows));
}

/**
 * Find focus td element.
 * @param {jQuery} $newTable - changed table jQuery element
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @returns {HTMLElement}
 * @private
 */
function _findFocusTd($newTable, rowIndex, colIndex) {
  var tableData = _tableDataHandler2.default.createTableData($newTable);
  var newRowIndex = _tableDataHandler2.default.findRowMergedLastIndex(tableData, rowIndex, colIndex) + 1;
  var cellElementIndex = _tableDataHandler2.default.findElementIndex(tableData, newRowIndex, colIndex);

  return $newTable.find('tr').eq(cellElementIndex.rowIndex).find('td')[cellElementIndex.colIndex];
}

exports.default = AddRow;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._createNewColumns = _createNewColumns;
exports._addColumns = _addColumns;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(2);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _editorProxy = __webpack_require__(1);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(7);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(6);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements mergedTableAddCol. Add Row to selected table.
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
var CommandManager = _editorProxy2.default.CommandManager;


var AddCol = void 0;
if (CommandManager) {
  AddCol = CommandManager.command('wysiwyg', /** @lends AddCol */{
    name: 'AddCol',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - wysiwygEditor instance
     */
    exec: function exec(wwe) {
      var sq = wwe.getEditor();
      var range = sq.getSelection().cloneRange();

      wwe.focus();

      if (!sq.hasFormat('TABLE')) {
        return;
      }

      var $startContainer = (0, _jquery2.default)(range.startContainer);
      var $table = $startContainer.closest('table');
      var tableData = _tableDataHandler2.default.createTableData($table);
      var $selectedCells = wwe.componentManager.getManager('tableSelection').getSelectedCells();
      var tableRange = _tableRangeHandler2.default.getTableSelectionRange(tableData, $selectedCells, $startContainer);

      sq.saveUndoState(range);
      _addColumns(tableData, tableRange);

      var $newTable = _tableRenderer2.default.replaceTable($table, tableData);
      var focusCell = _findFocusCell($newTable, tableRange.start.rowIndex, tableRange.end.colIndex);

      _tableRenderer2.default.focusToCell(sq, range, focusCell);
    }
  });
}

/**
 * Create column merged cell.
 * @param {number} colMergeWith - column merge start index
 * @param {string} nodeName - node name
 * @returns {{
 *   nodeName: string,
 *   colMerged: boolean,
 *   colMergeWith: number
 * }}
 * @private
 */
function _createColMergedCell(colMergeWith, nodeName) {
  return {
    nodeName: nodeName,
    colMergeWith: colMergeWith
  };
}

/**
 * Create new cell data.
 * @param {Array.<object>} rowData - row data of table data
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of table data
 * @param {object | null} prevCell - previous cell data
 * @returns {object}
 * @private
 */
function _createNewCell(rowData, rowIndex, colIndex, prevCell) {
  var cellData = rowData[colIndex];
  var newCell = void 0;

  if (_tuiCodeSnippet2.default.isExisty(cellData.colMergeWith)) {
    var colMergeWith = cellData.colMergeWith;

    var merger = rowData[colMergeWith];
    var lastMergedCellIndex = colMergeWith + merger.colspan - 1;

    if (_tuiCodeSnippet2.default.isExisty(merger.rowMergeWith) && prevCell) {
      newCell = _tuiCodeSnippet2.default.extend({}, prevCell);
    } else if (lastMergedCellIndex > colIndex) {
      merger.colspan += 1;
      newCell = _tuiCodeSnippet2.default.extend({}, cellData);
    }
  } else if (cellData.colspan > 1) {
    cellData.colspan += 1;
    newCell = _createColMergedCell(colIndex, cellData.nodeName);
  }

  if (!newCell) {
    newCell = _tableDataHandler2.default.createBasicCell(rowIndex, colIndex + 1, cellData.nodeName);
  }

  return newCell;
}

/**
 * Create new columns.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} startColIndex - start column index
 * @param {number} endColIndex - end column index
 * @returns {Array.<Array.<object>>}
 * @private
 */
function _createNewColumns(tableData, startColIndex, endColIndex) {
  var colIndexes = _tuiCodeSnippet2.default.range(startColIndex, endColIndex + 1);
  var newColumns = [];
  var prevCells = null;

  tableData.forEach(function (rowData, rowIndex) {
    var newCells = colIndexes.map(function (colIndex, index) {
      var prevCell = prevCells ? prevCells[index - 1] : null;

      return _createNewCell(rowData, rowIndex, endColIndex, prevCell);
    });

    prevCells = newCells;
    newColumns.push(newCells);
  });

  return newColumns;
}

/**
 * Add columns.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }} tableRange - table selection range
 * @private
 */
function _addColumns(tableData, tableRange) {
  var endRange = tableRange.end;
  var endColIndex = _tableDataHandler2.default.findColMergedLastIndex(tableData, endRange.rowIndex, endRange.colIndex);
  var newColumns = _createNewColumns(tableData, tableRange.start.colIndex, endColIndex);
  var newColIndex = endColIndex + 1;

  tableData.forEach(function (rowData, rowIndex) {
    rowData.splice.apply(rowData, [newColIndex, 0].concat(newColumns[rowIndex]));
  });
}

/**
 * Find focus cell element like td or th.
 * @param {jQuery} $newTable - changed table jQuery element
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @returns {HTMLElement}
 * @private
 */
function _findFocusCell($newTable, rowIndex, colIndex) {
  var tableData = _tableDataHandler2.default.createTableData($newTable);
  var newColIndex = _tableDataHandler2.default.findColMergedLastIndex(tableData, rowIndex, colIndex) + 1;
  var cellElementIndex = _tableDataHandler2.default.findElementIndex(tableData, rowIndex, newColIndex);

  return $newTable.find('tr').eq(cellElementIndex.rowIndex).find('td, th')[cellElementIndex.colIndex];
}

exports.default = AddCol;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._removeRow = _removeRow;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(2);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _editorProxy = __webpack_require__(1);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(7);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(6);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements mergedTableRemoveRow
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
var CommandManager = _editorProxy2.default.CommandManager;


var RemoveRow = void 0;
if (CommandManager) {
  RemoveRow = CommandManager.command('wysiwyg', /** @lends RemoveRow */{
    name: 'RemoveRow',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - wysiwygEditor instance
     */
    exec: function exec(wwe) {
      var sq = wwe.getEditor();
      var range = sq.getSelection().cloneRange();

      wwe.focus();

      if (!sq.hasFormat('TABLE')) {
        return;
      }

      var $startContainer = (0, _jquery2.default)(range.startContainer);
      var $table = $startContainer.closest('table');
      var tableData = _tableDataHandler2.default.createTableData($table);
      var beforeRowLength = tableData.length;
      var $selectedCells = wwe.componentManager.getManager('tableSelection').getSelectedCells();
      var tableRange = _tableRangeHandler2.default.getTableSelectionRange(tableData, $selectedCells, $startContainer);

      sq.saveUndoState(range);
      _removeRow(tableData, tableRange);

      if (tableData.length < 2) {
        $table.remove();
      } else if (beforeRowLength !== tableData.length) {
        var $newTable = _tableRenderer2.default.replaceTable($table, tableData);

        var startRowIndex = tableRange.start.rowIndex;
        var focusRowIndex = startRowIndex < tableData.length ? startRowIndex : startRowIndex - 1;
        var focusCell = _findFocusTd($newTable, focusRowIndex, tableRange.start.colIndex);
        _tableRenderer2.default.focusToCell(sq, range, focusCell);
      }
    }
  });
}

/**
 * Update rowspan to row merger.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} startRowIndex - start row index
 * @param {number} endRowIndex - end row index
 * @private
 */
function _updateRowspan(tableData, startRowIndex, endRowIndex) {
  _tuiCodeSnippet2.default.range(startRowIndex, endRowIndex + 1).forEach(function (rowIndex) {
    tableData[rowIndex].forEach(function (cell, cellIndex) {
      if (_tuiCodeSnippet2.default.isExisty(cell.rowMergeWith)) {
        var merger = tableData[cell.rowMergeWith][cellIndex];

        if (merger.rowspan) {
          merger.rowspan -= 1;
        }
      } else if (cell.rowspan > 1) {
        var lastMergedRowIndex = rowIndex + cell.rowspan - 1;

        cell.rowspan -= endRowIndex - rowIndex + 1;

        if (lastMergedRowIndex > endRowIndex) {
          tableData[endRowIndex + 1][cellIndex] = _tuiCodeSnippet2.default.extend({}, cell);
        }
      }
    });
  });
}

/**
 * Update row merge start index to merged cell.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} startRowIndex - start row index
 * @param {number} endRowIndex - end row index
 * @private
 */
function _updateMergeStartIndex(tableData, startRowIndex, endRowIndex) {
  tableData.slice(endRowIndex + 1).forEach(function (row) {
    row.forEach(function (cell) {
      if (_tuiCodeSnippet2.default.isExisty(cell.rowMergeWith) && cell.rowMergeWith >= startRowIndex) {
        cell.rowMergeWith = endRowIndex + 1;
      }
    });
  });
}

/**
 * Remove row.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }} tableRange - table selection range
 * @private
 */
function _removeRow(tableData, tableRange) {
  var startRowIndex = tableRange.start.rowIndex;
  var endRange = tableRange.end;
  var endRowIndex = _tableDataHandler2.default.findRowMergedLastIndex(tableData, endRange.rowIndex, endRange.colIndex);
  if (startRowIndex === 0 && endRowIndex === 0) {
    return;
  }

  startRowIndex = Math.max(startRowIndex, 1);
  endRowIndex = Math.max(endRowIndex, 1);
  var removeCount = endRowIndex - startRowIndex + 1;

  // if only table body or table header left, remove table
  if (tableData.length - removeCount < 2) {
    tableData.splice(0, tableData.length);
  } else {
    _updateRowspan(tableData, startRowIndex, endRowIndex);
    _updateMergeStartIndex(tableData, startRowIndex, endRowIndex);

    tableData.splice(startRowIndex, removeCount);
  }
}

/**
 * Find focus td element.
 * @param {jQuery} $newTable - changed table jQuery element
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @returns {HTMLElement}
 * @private
 */
function _findFocusTd($newTable, rowIndex, colIndex) {
  var tableData = _tableDataHandler2.default.createTableData($newTable);

  if (tableData.length - 1 < rowIndex) {
    rowIndex -= 1;
  }

  var cellElementIndex = _tableDataHandler2.default.findElementIndex(tableData, rowIndex, colIndex);

  return $newTable.find('tr').eq(cellElementIndex.rowIndex).find('th,td')[cellElementIndex.colIndex];
}

exports.default = RemoveRow;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._removeColumns = _removeColumns;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(2);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _editorProxy = __webpack_require__(1);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(7);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(6);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements mergedTableRemoveCol. Remove col to selected table
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
var CommandManager = _editorProxy2.default.CommandManager;


var RemoveCol = void 0;
if (CommandManager) {
  RemoveCol = CommandManager.command('wysiwyg', /** @lends RemoveCol */{
    name: 'RemoveCol',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - wysiwygEditor instance
     */
    exec: function exec(wwe) {
      var sq = wwe.getEditor();
      var range = sq.getSelection().cloneRange();

      wwe.focus();

      if (!sq.hasFormat('TABLE')) {
        return;
      }

      var $startContainer = (0, _jquery2.default)(range.startContainer);
      var $table = $startContainer.closest('table');
      var tableData = _tableDataHandler2.default.createTableData($table);
      var $selectedCells = wwe.componentManager.getManager('tableSelection').getSelectedCells();
      var tableRange = _tableRangeHandler2.default.getTableSelectionRange(tableData, $selectedCells, $startContainer);
      var beforeCellLength = tableData[0].length;

      sq.saveUndoState(range);
      _removeColumns(tableData, tableRange);

      if (tableData[0].length === 0) {
        $table.remove();
      } else if (beforeCellLength !== tableData[0].length) {
        var $newTable = _tableRenderer2.default.replaceTable($table, tableData);

        var startColIndex = tableRange.start.colIndex;
        var focusColIndex = startColIndex >= tableData[0].length ? startColIndex - 1 : startColIndex;
        var focusCell = _findFocusCell($newTable, tableRange.start.rowIndex, focusColIndex);
        _tableRenderer2.default.focusToCell(sq, range, focusCell);
      }
    }
  });
}

/**
 * Update colspan to col merger.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} startColIndex - start col index
 * @param {number} endColIndex - end col index
 * @private
 */
function _updateColspan(tableData, startColIndex, endColIndex) {
  tableData.forEach(function (rowData) {
    _tuiCodeSnippet2.default.range(startColIndex, endColIndex + 1).forEach(function (colIndex) {
      var cellData = rowData[colIndex];

      if (_tuiCodeSnippet2.default.isExisty(cellData.colMergeWith)) {
        var merger = rowData[cellData.colMergeWith];

        if (merger.colspan) {
          merger.colspan -= 1;
        }
      } else if (cellData.colspan > 1) {
        var lastMergedCellIndex = colIndex + cellData.colspan - 1;

        cellData.colspan -= endColIndex - colIndex + 1;

        if (lastMergedCellIndex > endColIndex) {
          rowData[endColIndex + 1] = _tuiCodeSnippet2.default.extend({}, cellData);
        }
      }
    });
  });
}

/**
 * Update row merge start index to merged cell.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} startColIndex - start col index
 * @param {number} endColIndex - end col index
 * @private
 */
function _updateMergeStartIndex(tableData, startColIndex, endColIndex) {
  tableData.forEach(function (rowData) {
    rowData.slice(endColIndex + 1).forEach(function (cellData) {
      if (_tuiCodeSnippet2.default.isExisty(cellData.colMergeWith) && cellData.colMergeWith >= startColIndex) {
        cellData.colMergeWith = endColIndex + 1;
      }
    });
  });
}

/**
 * Remove columns.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{
 *   start: {rowIndex: number, colIndex: number},
 *   end: {rowIndex: number, colIndex: number}
 * }} tableRange - table selection range
 * @private
 */
function _removeColumns(tableData, tableRange) {
  var startColIndex = tableRange.start.colIndex;
  var endRange = tableRange.end;
  var endColIndex = _tableDataHandler2.default.findColMergedLastIndex(tableData, endRange.rowIndex, endRange.colIndex);
  var removeCount = endColIndex - startColIndex + 1;

  _updateColspan(tableData, startColIndex, endColIndex);
  _updateMergeStartIndex(tableData, startColIndex, endColIndex);

  tableData.forEach(function (row) {
    row.splice(startColIndex, removeCount);
  });
}

/**
 * Find focus cell element like td or th.
 * @param {jQuery} $newTable - changed table jQuery element
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @returns {HTMLElement}
 * @private
 */
function _findFocusCell($newTable, rowIndex, colIndex) {
  var tableData = _tableDataHandler2.default.createTableData($newTable);

  if (tableData[0].length - 1 < colIndex) {
    colIndex -= 1;
  }

  var cellElementIndex = _tableDataHandler2.default.findElementIndex(tableData, rowIndex, colIndex);

  return $newTable.find('tr').eq(cellElementIndex.rowIndex).find('td, th')[cellElementIndex.colIndex];
}

exports.default = RemoveCol;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(2);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _editorProxy = __webpack_require__(1);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(7);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(6);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements mergedTableAlignCol. Align selected column's text content to given direction
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
var CommandManager = _editorProxy2.default.CommandManager;


var AlignCol = void 0;
if (CommandManager) {
  AlignCol = CommandManager.command('wysiwyg', /** @lends AlignCol */{
    name: 'AlignCol',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - wysiwygEditor instance
     * @param {string} alignDirection - align direction for table header
     */
    exec: function exec(wwe, alignDirection) {
      var sq = wwe.getEditor();
      var range = sq.getSelection().cloneRange();

      wwe.focus();

      if (!sq.hasFormat('TABLE')) {
        return;
      }

      var $startContainer = (0, _jquery2.default)(range.startContainer);
      var $table = $startContainer.closest('table');
      var tableData = _tableDataHandler2.default.createTableData($table);
      var $selectedCells = wwe.componentManager.getManager('tableSelection').getSelectedCells();
      var tableRange = _tableRangeHandler2.default.getTableSelectionRange(tableData, $selectedCells, $startContainer);

      _align(tableData[0], tableRange.start.colIndex, tableRange.end.colIndex, alignDirection);

      var $newTable = _tableRenderer2.default.replaceTable($table, tableData);
      var focusCell = _findFocusCell($newTable, $startContainer);

      _tableRenderer2.default.focusToCell(sq, range, focusCell);
    }
  });
}

/**
 * Align to table header.
 * @param {Array.<object>} headRowData - head row data
 * @param {number} startColIndex - start column index for styling align
 * @param {number} endColIndex - end column index for styling align
 * @param {string} alignDirection - align direction
 * @private
 */
function _align(headRowData, startColIndex, endColIndex, alignDirection) {
  _tuiCodeSnippet2.default.range(startColIndex, endColIndex + 1).forEach(function (colIndex) {
    var headCellData = headRowData[colIndex];

    if (_tuiCodeSnippet2.default.isExisty(headCellData.colMergeWith)) {
      headRowData[headCellData.colMergeWith].align = alignDirection;
    } else {
      headCellData.align = alignDirection;
    }
  });
}

/**
 * Find focus cell element like td or th.
 * @param {jQuery} $newTable - changed table jQuery element
 * @param {jQuery} $startContainer - start container jQuery element of text range
 * @returns {HTMLElement}
 * @private
 */
function _findFocusCell($newTable, $startContainer) {
  var elementRowIndex = _tableDataHandler2.default.findElementRowIndex($startContainer);
  var elementColIndex = _tableDataHandler2.default.findElementColIndex($startContainer);

  return $newTable.find('tr').eq(elementRowIndex).find('td, th')[elementColIndex];
}

exports.default = AlignCol;

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._mergeCells = _mergeCells;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(2);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _editorProxy = __webpack_require__(1);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(7);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(6);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements MergeCell
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
var CommandManager = _editorProxy2.default.CommandManager;

var BASIC_CELL_CONTENT = _tuiCodeSnippet2.default.browser.msie ? '' : '<br>';

var MergeCell = void 0;
if (CommandManager) {
  MergeCell = CommandManager.command('wysiwyg', /** @lends MergeCell */{
    name: 'MergeCells',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - wysiwygEditor instance
     */
    exec: function exec(wwe) {
      var sq = wwe.getEditor();

      wwe.focus();

      if (!sq.hasFormat('TABLE')) {
        return;
      }

      var selectionManager = wwe.componentManager.getManager('tableSelection');
      var $selectedCells = selectionManager.getSelectedCells();

      if ($selectedCells.length < 2 || selectionManager.hasSelectedBothThAndTd($selectedCells)) {
        return;
      }

      var range = sq.getSelection().cloneRange();
      var $startContainer = (0, _jquery2.default)(range.startContainer);
      var $table = $startContainer.closest('table');
      var tableData = _tableDataHandler2.default.createTableData($table);
      var tableRange = _tableRangeHandler2.default.getTableSelectionRange(tableData, $selectedCells, $startContainer);

      _mergeCells(tableData, tableRange);

      var $newTable = _tableRenderer2.default.replaceTable($table, tableData);
      var focusCell = _findFocusCell($newTable, tableRange.start.rowIndex, tableRange.start.colIndex);

      _tableRenderer2.default.focusToCell(sq, range, focusCell);
    }
  });
}

/**
 * Pick merger content from selected cells.
 * @param {Array.<Array.<object>>} targetRows - target rows
 * @param {number} startColIndex - start column index
 * @param {number} endColIndex - end column index
 * @returns {string}
 * @private
 */
function _pickContent(targetRows, startColIndex, endColIndex) {
  var _ref;

  var limitColIndex = endColIndex + 1;
  var cells = (_ref = []).concat.apply(_ref, targetRows.map(function (rowData) {
    return rowData.slice(startColIndex, limitColIndex);
  }));
  var foundCellData = cells.filter(function (_ref2) {
    var content = _ref2.content;
    return content && content !== BASIC_CELL_CONTENT;
  });

  return foundCellData.length ? foundCellData[0].content : BASIC_CELL_CONTENT;
}

/**
 * Initialize cell data of target rows.
 * @param {Array.<Array.<object>>} targetRows - target rows
 * @param {number} startColIndex - start column index
 * @param {number} endColIndex - end column index
 * @private
 */
function _initCellData(targetRows, startColIndex, endColIndex) {
  var _ref3;

  var limitColIndex = endColIndex + 1;
  var targetCells = targetRows.map(function (rowData) {
    return rowData.slice(startColIndex, limitColIndex);
  });

  (_ref3 = []).concat.apply(_ref3, targetCells).slice(1).forEach(function (cellData) {
    var nodeName = cellData.nodeName;


    _tuiCodeSnippet2.default.forEach(cellData, function (value, name) {
      return delete cellData[name];
    });
    cellData.nodeName = nodeName;
  });
}

/**
 * Update rowMergeWith property of target rows for row merge.
 * @param {Array.<Array.<object>>} targetRows - target rows
 * @param {number} startColIndex - start column index
 * @param {number} endColIndex - end column index
 * @param {number} rowMergeWith - index of row merger
 * @private
 */
function _updateRowMergeWith(targetRows, startColIndex, endColIndex, rowMergeWith) {
  var limitColIndex = endColIndex + 1;

  targetRows.forEach(function (rowData) {
    rowData.slice(startColIndex, limitColIndex).forEach(function (cellData) {
      cellData.rowMergeWith = rowMergeWith;
    });
  });
}

/**
 * Update colMergeWith property of target rows for column merge.
 * @param {Array.<Array.<object>>} targetRows - target rows
 * @param {number} startColIndex - start column index
 * @param {number} endColIndex - end column index
 * @param {number} colMergeWith - index of column merger
 * @private
 */
function _updateColMergeWith(targetRows, startColIndex, endColIndex, colMergeWith) {
  var limitColIndex = endColIndex + 1;

  targetRows.forEach(function (rowData) {
    rowData.slice(startColIndex, limitColIndex).forEach(function (cellData) {
      cellData.colMergeWith = colMergeWith;
    });
  });
}

/**
 * Merge selected cells.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{rowIndex: number, colIndex: number}} startRange - start table selection range
 * @param {{rowIndex: number, colIndex: number}} endRange - end table selection range
 * @private
 */
function _mergeCells(tableData, _ref4) {
  var startRange = _ref4.start,
      endRange = _ref4.end;

  var startRowIndex = startRange.rowIndex;
  var startColIndex = startRange.colIndex;
  var endRowIndex = endRange.rowIndex;
  var endColIndex = endRange.colIndex;
  var merger = tableData[startRowIndex][startColIndex];
  var targetRows = tableData.slice(startRowIndex, endRowIndex + 1);
  var rowspan = endRowIndex - startRowIndex + 1;
  var colspan = endColIndex - startColIndex + 1;

  merger.rowspan = rowspan;
  merger.colspan = colspan;
  merger.content = _pickContent(targetRows, startColIndex, endColIndex);
  _initCellData(targetRows, startColIndex, endColIndex);

  if (rowspan > 1) {
    _updateRowMergeWith(targetRows.slice(1), startColIndex, endColIndex, startRowIndex);
  }

  if (colspan > 1) {
    _updateColMergeWith(targetRows, startColIndex + 1, endColIndex, startColIndex);
  }
}

/**
 * Find focus cell element like td or th.
 * @param {jQuery} $newTable - changed table jQuery element
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @returns {HTMLElement}
 * @private
 */
function _findFocusCell($newTable, rowIndex, colIndex) {
  var tableData = _tableDataHandler2.default.createTableData($newTable);
  var cellElementIndex = _tableDataHandler2.default.findElementIndex(tableData, rowIndex, colIndex);

  return $newTable.find('tr').eq(cellElementIndex.rowIndex).find('td, th')[cellElementIndex.colIndex];
}

exports.default = MergeCell;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._hasMergedCell = _hasMergedCell;
exports._unmergeCells = _unmergeCells;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(2);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _editorProxy = __webpack_require__(1);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(7);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(6);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements UnmergeCell
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
var CommandManager = _editorProxy2.default.CommandManager;


var UnmergeCell = void 0;
if (CommandManager) {
  UnmergeCell = CommandManager.command('wysiwyg', /** @lends UnmergeCell */{
    name: 'UnmergeCells',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - wysiwygEditor instance
     */
    exec: function exec(wwe) {
      var sq = wwe.getEditor();
      var range = sq.getSelection().cloneRange();

      wwe.focus();

      if (!sq.hasFormat('TABLE')) {
        return;
      }

      var $startContainer = (0, _jquery2.default)(range.startContainer);
      var $table = $startContainer.closest('table');
      var tableData = _tableDataHandler2.default.createTableData($table);
      var $selectedCells = wwe.componentManager.getManager('tableSelection').getSelectedCells();
      var tableRange = _tableRangeHandler2.default.getTableSelectionRange(tableData, $selectedCells, $startContainer);

      if (!_hasMergedCell(tableData, tableRange)) {
        return;
      }

      _unmergeCells(tableData, tableRange);

      var $newTable = _tableRenderer2.default.replaceTable($table, tableData);
      var focusCell = _findFocusCell($newTable, tableRange.start.rowIndex, tableRange.start.colIndex);

      _tableRenderer2.default.focusToCell(sq, range, focusCell);
    }
  });
}

/**
 * Whether has merged cell.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{rowIndex: number, colIndex: number}} startRange - start table selection range
 * @param {{rowIndex: number, colIndex: number}} endRange - end table selection range
 * @returns {boolean}
 * @private
 */
function _hasMergedCell(tableData, _ref) {
  var _ref2;

  var startRange = _ref.start,
      endRange = _ref.end;

  var startColIndex = startRange.colIndex;
  var limitColIndex = endRange.colIndex + 1;
  var targetRows = tableData.slice(startRange.rowIndex, endRange.rowIndex + 1);
  var targetCells = targetRows.map(function (rowData) {
    return rowData.slice(startColIndex, limitColIndex);
  });

  return !!(_ref2 = []).concat.apply(_ref2, targetCells).filter(function (cellData) {
    return cellData.colspan > 1 || cellData.rowspan > 1;
  }).length;
}

/**
 * Update merged cell data to basic cell data.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} startRowIndex - start row index
 * @param {number} startColIndex - start col index
 * @param {number} rowspan - rowspan property of merger cell
 * @param {number} colspan - colspan property of merger cell
 * @private
 */
function _updateMergedCells(tableData, startRowIndex, startColIndex, rowspan, colspan) {
  var limitRowIndex = startRowIndex + rowspan;
  var limitColIndex = startColIndex + colspan;
  var colRange = _tuiCodeSnippet2.default.range(startColIndex, limitColIndex);

  _tuiCodeSnippet2.default.range(startRowIndex, limitRowIndex).forEach(function (rowIndex) {
    var rowData = tableData[rowIndex];
    var startIndex = rowIndex === startRowIndex ? 1 : 0;

    colRange.slice(startIndex).forEach(function (colIndex) {
      rowData[colIndex] = _tableDataHandler2.default.createBasicCell(rowIndex, colIndex, rowData[colIndex].nodeName);
    });
  });
}

/**
 * Unmerge selected cells.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {{rowIndex: number, colIndex: number}} startRange - start table selection range
 * @param {{rowIndex: number, colIndex: number}} endRange - end table selection range
 * @private
 */
function _unmergeCells(tableData, _ref3) {
  var startRange = _ref3.start,
      endRange = _ref3.end;

  var colRange = _tuiCodeSnippet2.default.range(startRange.colIndex, endRange.colIndex + 1);

  _tuiCodeSnippet2.default.range(startRange.rowIndex, endRange.rowIndex + 1).forEach(function (rowIndex) {
    colRange.forEach(function (colIndex) {
      var cellData = tableData[rowIndex][colIndex];
      var colspan = cellData.colspan,
          rowspan = cellData.rowspan;


      if (colspan > 1 || rowspan > 1) {
        cellData.colspan = 1;
        cellData.rowspan = 1;
        _updateMergedCells(tableData, rowIndex, colIndex, rowspan, colspan);
      }
    });
  });
}

/**
 * Find focus cell element like td or th.
 * @param {jQuery} $newTable - changed table jQuery element
 * @param {number} rowIndex - row index of table data
 * @param {number} colIndex - column index of tabld data
 * @returns {HTMLElement}
 * @private
 */
function _findFocusCell($newTable, rowIndex, colIndex) {
  var tableData = _tableDataHandler2.default.createTableData($newTable);
  var cellElementIndex = _tableDataHandler2.default.findElementIndex(tableData, rowIndex, colIndex);

  return $newTable.find('tr').eq(cellElementIndex.rowIndex).find('td, th')[cellElementIndex.colIndex];
}

exports.default = UnmergeCell;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _editorProxy = __webpack_require__(1);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements table extension ui
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
var i18n = _editorProxy2.default.i18n;

/**
 * Change contextmenu content.
 * @param {object} popupTableUtils - PopupTableUtils instance for managing contextmenu of table
 * @private
 */

function _changeContent(popupTableUtils) {
  var POPUP_CONTENT = ['<button type="button" class="te-table-add-row">' + i18n.get('Add row') + '</button>', '<button type="button" class="te-table-add-col">' + i18n.get('Add col') + '</button>', '<button type="button" class="te-table-remove-row">' + i18n.get('Remove row') + '</button>', '<button type="button" class="te-table-remove-col">' + i18n.get('Remove col') + '</button>', '<hr/>', '<button type="button" class="te-table-merge">' + i18n.get('Merge cells') + '</button>', '<button type="button" class="te-table-unmerge">' + i18n.get('Unmerge cells') + '</button>', '<hr/>', '<button type="button" class="te-table-col-align-left">' + i18n.get('Align left') + '</button>', '<button type="button" class="te-table-col-align-center">' + i18n.get('Align center') + '</button>', '<button type="button" class="te-table-col-align-right">' + i18n.get('Align right') + '</button>', '<hr/>', '<button type="button" class="te-table-remove">' + i18n.get('Remove table') + '</button>'].join('');
  var $popupContent = (0, _jquery2.default)(POPUP_CONTENT);

  popupTableUtils.setContent($popupContent);
}

/**
 * Bind events for merge feature of contextmenu.
 * @param {object} popupTableUtils - PopupTableUtils instance for managing contextmenu of table
 * @param {object} eventManager - event manager instance of editor
 * @param {object} selectionManager - table selection manager instance
 * @private
 */
function _bindEvents(popupTableUtils, eventManager, selectionManager) {
  var $popupContent = popupTableUtils.$content;
  var $mergeBtn = (0, _jquery2.default)($popupContent[5]);
  var $unmergeBtn = (0, _jquery2.default)($popupContent[6]);
  var $separator = (0, _jquery2.default)($popupContent[7]);

  popupTableUtils.on('click .te-table-merge', function () {
    eventManager.emit('command', 'MergeCells');
  });

  popupTableUtils.on('click .te-table-unmerge', function () {
    eventManager.emit('command', 'UnmergeCells');
  });

  eventManager.listen('openPopupTableUtils', function () {
    var $selectedCells = selectionManager.getSelectedCells();
    var selectedCellCount = $selectedCells.length;

    if (selectedCellCount) {
      if (selectedCellCount < 2 || selectionManager.hasSelectedBothThAndTd($selectedCells)) {
        $mergeBtn.hide();
      } else {
        $mergeBtn.show();
      }

      if ($selectedCells.is('[rowspan], [colspan]')) {
        $unmergeBtn.show();
      } else {
        $unmergeBtn.hide();
      }
      $separator.show();
    } else {
      $mergeBtn.hide();
      $unmergeBtn.hide();
      $separator.hide();
    }
  });
}

/**
 * Update contextmenu UI.
 * @param {object} popupTableUtils - PopupTableUtils instance for managing contextmenu of table
 * @param {object} eventManager - event manager instance of editor
 * @param {object} selectionManager - table selection manager instance
 * @ignore
 */
function updateContextMenu(popupTableUtils, eventManager, selectionManager) {
  _changeContent(popupTableUtils);
  _bindEvents(popupTableUtils, eventManager, selectionManager);
}

exports.default = {
  updateContextMenu: updateContextMenu
};

/***/ })
/******/ ]);
});