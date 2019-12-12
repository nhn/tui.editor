/*!
 * tui-editor
 * @version 1.4.10
 * @author NHN FE Development Lab <dl_javascript@nhn.com> (https://nhn.github.io/tui.editor/)
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"), require("tui-code-snippet"), require("to-mark"), require("tui-chart"), require("markdown-it"), require("highlight.js"), require("tui-color-picker"), require("plantuml-encoder"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery", "tui-code-snippet", "to-mark", "tui-chart", "markdown-it", "highlight.js", "tui-color-picker", "plantuml-encoder"], factory);
	else if(typeof exports === 'object')
		exports["Editor"] = factory(require("jquery"), require("tui-code-snippet"), require("to-mark"), require("tui-chart"), require("markdown-it"), require("highlight.js"), require("tui-color-picker"), require("plantuml-encoder"));
	else
		root["tui"] = root["tui"] || {}, root["tui"]["Editor"] = factory(root["$"], root["tui"]["util"], root["toMark"], root["tui"]["chart"], root["markdownit"], root["hljs"], root["tui"]["colorPicker"], root["plantumlEncoder"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__0__, __WEBPACK_EXTERNAL_MODULE__1__, __WEBPACK_EXTERNAL_MODULE__17__, __WEBPACK_EXTERNAL_MODULE__29__, __WEBPACK_EXTERNAL_MODULE__39__, __WEBPACK_EXTERNAL_MODULE__49__, __WEBPACK_EXTERNAL_MODULE__82__, __WEBPACK_EXTERNAL_MODULE__84__) {
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 27);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
* @fileoverview Editor/Viewer proxy for extensions
* @author NHN FE Development Lab <dl_javascript@nhn.com>
*/
/* eslint global-require: 0 no-empty: 0 */

var Editor = void 0;
try {
  Editor = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module '../editor'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
} catch (e) {}
if (!Editor) {
  try {
    Editor = __webpack_require__(16);
  } catch (e) {}
}

exports.default = Editor;

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

var _tuiCodeSnippet = __webpack_require__(1);

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
* @author NHN FE Development Lab <dl_javascript@nhn.com>
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
    if (startIndex) {
      var nodeName = rowData[0].nodeName;


      _tuiCodeSnippet2.default.range(startIndex, limitIndex).forEach(function (colIndex) {
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
* @author NHN FE Development Lab <dl_javascript@nhn.com>
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
  var thead = renderData[0] ? [renderData[0]] : [];
  var tbody = renderData.slice(1);
  var theadHtml = _createTheadOrTbodyHtml(thead, 'THEAD');
  var tbodyHtml = _createTheadOrTbodyHtml(tbody, 'TBODY');
  var className = renderData.className ? ' class="' + renderData.className + '"' : '';

  return '<table' + className + '>' + (theadHtml + tbodyHtml) + '</table>';
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

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
* @author NHN FE Development Lab <dl_javascript@nhn.com>
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.



/*<replacement>*/

var pna = __webpack_require__(11);
/*</replacement>*/

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(7);
/*</replacement>*/

var Readable = __webpack_require__(20);
var Writable = __webpack_require__(15);

util.inherits(Duplex, Readable);

{
  // avoid scope creep, the keys array can then be collected
  var keys = objectKeys(Writable.prototype);
  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
});

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  pna.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();

  pna.nextTick(cb, err);
};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),
/* 8 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(23).Buffer))

/***/ }),
/* 10 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

if (typeof process === 'undefined' ||
    !process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = { nextTick: nextTick };
} else {
  module.exports = process
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(10)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(23)
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = $getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    ReflectApply(this.listener, this.target, args);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(20);
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = __webpack_require__(15);
exports.Duplex = __webpack_require__(6);
exports.Transform = __webpack_require__(26);
exports.PassThrough = __webpack_require__(60);


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, setImmediate, global) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.



/*<replacement>*/

var pna = __webpack_require__(11);
/*</replacement>*/

module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(7);
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: __webpack_require__(59)
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(22);
/*</replacement>*/

/*<replacement>*/

var Buffer = __webpack_require__(12).Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*</replacement>*/

var destroyImpl = __webpack_require__(24);

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || __webpack_require__(6);

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var writableHwm = options.writableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;else this.highWaterMark = defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || __webpack_require__(6);

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;

    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  pna.nextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    pna.nextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
});

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    pna.nextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    pna.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      stream.emit('error', err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      pna.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) pna.nextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }
  if (state.corkedRequestsFree) {
    state.corkedRequestsFree.next = corkReq;
  } else {
    state.corkedRequestsFree = corkReq;
  }
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function () {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});

Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(10), __webpack_require__(57).setImmediate, __webpack_require__(8)))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements editor preivew
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _mdPreview = __webpack_require__(30);

var _mdPreview2 = _interopRequireDefault(_mdPreview);

var _eventManager = __webpack_require__(33);

var _eventManager2 = _interopRequireDefault(_eventManager);

var _commandManager = __webpack_require__(34);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _extManager = __webpack_require__(37);

var _extManager2 = _interopRequireDefault(_extManager);

var _convertor = __webpack_require__(38);

var _convertor2 = _interopRequireDefault(_convertor);

var _domUtils = __webpack_require__(50);

var _domUtils2 = _interopRequireDefault(_domUtils);

var _codeBlockManager = __webpack_require__(18);

var _codeBlockManager2 = _interopRequireDefault(_codeBlockManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TASK_ATTR_NAME = 'data-te-task';
var TASK_CHECKED_CLASS_NAME = 'checked';

/**
 * Class ToastUIEditorViewer
 * @param {object} options Option object
 *     @param {HTMLElement} options.el - container element
 *     @param {string} options.initialValue Editor's initial value
 *     @param {object} options.events eventlist Event list
 *         @param {function} options.events.load It would be emitted when editor fully load
 *         @param {function} options.events.change It would be emitted when content changed
 *         @param {function} options.events.stateChange It would be emitted when format change by cursor position
 *         @param {function} options.events.focus It would be emitted when editor get focus
 *         @param {function} options.events.blur It would be emitted when editor loose focus
 *     @param {object} options.hooks Hook list
 *     @param {function} options.hooks.previewBeforeHook Submit preview to hook URL before preview be shown
 *     @param {string[]} [options.exts] - extensions
 */

var ToastUIEditorViewer = function () {
  function ToastUIEditorViewer(options) {
    var _this = this;

    _classCallCheck(this, ToastUIEditorViewer);

    this.options = _jquery2.default.extend({
      useDefaultHTMLSanitizer: true,
      codeBlockLanguages: _codeBlockManager.CodeBlockManager.getHighlightJSLanguages(),
      customConvertor: null
    }, options);

    this.eventManager = new _eventManager2.default();
    this.commandManager = new _commandManager2.default(this);
    if (this.options.customConvertor) {
      // eslint-disable-next-line new-cap
      this.convertor = new this.options.customConvertor(this.eventManager);
    } else {
      this.convertor = new _convertor2.default(this.eventManager);
    }

    if (this.options.useDefaultHTMLSanitizer) {
      this.convertor.initHtmlSanitizer();
    }

    if (this.options.hooks) {
      _tuiCodeSnippet2.default.forEach(this.options.hooks, function (fn, key) {
        _this.addHook(key, fn);
      });
    }

    if (this.options.events) {
      _tuiCodeSnippet2.default.forEach(this.options.events, function (fn, key) {
        _this.on(key, fn);
      });
    }

    var _options = this.options,
        el = _options.el,
        initialValue = _options.initialValue;

    var existingHTML = el.innerHTML;
    el.innerHTML = '';

    this.preview = new _mdPreview2.default((0, _jquery2.default)(el), this.eventManager, this.convertor, true);

    this.preview.$el.on('mousedown', _jquery2.default.proxy(this._toggleTask, this));

    _extManager2.default.applyExtension(this, this.options.exts);

    if (initialValue) {
      this.setValue(initialValue);
    } else if (existingHTML) {
      this.preview.setHTML(existingHTML);
    }

    this.eventManager.emit('load', this);
  }

  /**
   * Toggle task by detecting mousedown event.
   * @param {MouseEvent} ev - event
   * @private
   */


  _createClass(ToastUIEditorViewer, [{
    key: '_toggleTask',
    value: function _toggleTask(ev) {
      var style = getComputedStyle(ev.target, ':before');

      if (ev.target.hasAttribute(TASK_ATTR_NAME) && _domUtils2.default.isInsideTaskBox(style, ev.offsetX, ev.offsetY)) {
        (0, _jquery2.default)(ev.target).toggleClass(TASK_CHECKED_CLASS_NAME);
        this.eventManager.emit('change', {
          source: 'viewer',
          data: ev
        });
      }
    }

    /**
     * Set content for preview
     * @param {string} markdown Markdown text
     */

  }, {
    key: 'setMarkdown',
    value: function setMarkdown(markdown) {
      this.markdownValue = markdown = markdown || '';

      this.preview.refresh(this.markdownValue);
      this.eventManager.emit('setMarkdownAfter', this.markdownValue);
    }

    /**
     * Set content for preview
     * @param {string} markdown Markdown text
     * @deprecated
     */

  }, {
    key: 'setValue',
    value: function setValue(markdown) {
      this.setMarkdown(markdown);
    }

    /**
     * Bind eventHandler to event type
     * @param {string} type Event type
     * @param {function} handler Event handler
     */

  }, {
    key: 'on',
    value: function on(type, handler) {
      this.eventManager.listen(type, handler);
    }

    /**
     * Unbind eventHandler from event type
     * @param {string} type Event type
     */

  }, {
    key: 'off',
    value: function off(type) {
      this.eventManager.removeEventHandler(type);
    }

    /**
     * Remove Viewer preview from document
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.eventManager.emit('removeEditor');
      this.preview.$el.off('mousedown', _jquery2.default.proxy(this._toggleTask, this));
      this.preview.remove();
      this.options = null;
      this.eventManager = null;
      this.commandManager = null;
      this.convertor = null;
      this.preview = null;
    }

    /**
     * Add hook to Viewer preview's event
     * @param {string} type Event type
     * @param {function} handler Event handler
     */

  }, {
    key: 'addHook',
    value: function addHook(type, handler) {
      this.eventManager.removeEventHandler(type);
      this.eventManager.listen(type, handler);
    }

    /**
     * Return true
     * @returns {boolean}
     */

  }, {
    key: 'isViewer',
    value: function isViewer() {
      return true;
    }

    /**
     * Return false
     * @returns {boolean}
     */

  }, {
    key: 'isMarkdownMode',
    value: function isMarkdownMode() {
      return false;
    }

    /**
     * Return false
     * @returns {boolean}
     */

  }, {
    key: 'isWysiwygMode',
    value: function isWysiwygMode() {
      return false;
    }

    /**
     * Define extension
     * @param {string} name Extension name
     * @param {ExtManager~extension} ext extension
     */

  }], [{
    key: 'defineExtension',
    value: function defineExtension(name, ext) {
      _extManager2.default.defineExtension(name, ext);
    }
  }]);

  return ToastUIEditorViewer;
}();

/**
 * check whther is viewer
 * @type {boolean}
 */


ToastUIEditorViewer.isViewer = true;

/**
 * domUtil instance
 * @type {DomUtil}
 * @ignore
 */
ToastUIEditorViewer.domUtils = _domUtils2.default;

/**
 * CodeBlockManager instance
 * @type {CodeBlockManager}
 */
ToastUIEditorViewer.codeBlockManager = _codeBlockManager2.default;

/**
 * MarkdownIt hightlight instance
 * @type {MarkdownIt}
 */
ToastUIEditorViewer.markdownitHighlight = _convertor2.default.getMarkdownitHighlightRenderer();

/**
 * MarkdownIt instance
 * @type {MarkdownIt}
 */
ToastUIEditorViewer.markdownit = _convertor2.default.getMarkdownitRenderer();

/**
 * @ignore
 */
ToastUIEditorViewer.i18n = null;

/**
 * @ignore
 */
ToastUIEditorViewer.Button = null;

/**
 * @ignore
 */
ToastUIEditorViewer.WwCodeBlockManager = null;

/**
 * @ignore
 */
ToastUIEditorViewer.WwTableManager = null;

/**
 * @ignore
 */
ToastUIEditorViewer.WwTableSelectionManager = null;

module.exports = ToastUIEditorViewer;

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__17__;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodeBlockManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements CodeBlockManager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _highlight = __webpack_require__(49);

var _highlight2 = _interopRequireDefault(_highlight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class Code Block Manager
 */
var CodeBlockManager = function () {
  function CodeBlockManager() {
    _classCallCheck(this, CodeBlockManager);

    this._replacers = {};
  }

  /**
   * Set replacer for code block
   * @param {string} language - code block language
   * @param {function} replacer - replacer function to code block element
   */


  _createClass(CodeBlockManager, [{
    key: 'setReplacer',
    value: function setReplacer(language, replacer) {
      this._replacers[language] = replacer;
    }

    /**
     * get replacer for code block
     * @param {string} language - code block type
     * @returns {function} - replacer function
     */

  }, {
    key: 'getReplacer',
    value: function getReplacer(language) {
      return this._replacers[language];
    }

    /**
     * Create code block html.
     * @param {string} language - code block language
     * @param {string} codeText - code text
     * @returns {string}
     */

  }, {
    key: 'createCodeBlockHtml',
    value: function createCodeBlockHtml(language, codeText) {
      var replacer = this.getReplacer(language);
      var html = void 0;

      if (replacer) {
        html = replacer(codeText, language);
      } else {
        html = _highlight2.default.getLanguage(language) ? _highlight2.default.highlight(language, codeText).value : escape(codeText, false);
      }

      return html;
    }

    /**
     * get supported languages by highlight-js
     * @returns {Array<string>} - supported languages by highlight-js
     */

  }], [{
    key: 'getHighlightJSLanguages',
    value: function getHighlightJSLanguages() {
      return _highlight2.default.listLanguages();
    }
  }]);

  return CodeBlockManager;
}();

/**
 * escape code from markdown-it
 * @param {string} html HTML string
 * @param {string} encode Boolean value of whether encode or not
 * @returns {string}
 * @ignore
 */


function escape(html, encode) {
  return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

exports.CodeBlockManager = CodeBlockManager;
exports.default = new CodeBlockManager();

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = __webpack_require__(13).EventEmitter;
var inherits = __webpack_require__(7);

inherits(Stream, EE);
Stream.Readable = __webpack_require__(14);
Stream.Writable = __webpack_require__(61);
Stream.Duplex = __webpack_require__(62);
Stream.Transform = __webpack_require__(63);
Stream.PassThrough = __webpack_require__(64);

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



/*<replacement>*/

var pna = __webpack_require__(11);
/*</replacement>*/

module.exports = Readable;

/*<replacement>*/
var isArray = __webpack_require__(21);
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = __webpack_require__(13).EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(22);
/*</replacement>*/

/*<replacement>*/

var Buffer = __webpack_require__(12).Buffer;
var OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*</replacement>*/

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(7);
/*</replacement>*/

/*<replacement>*/
var debugUtil = __webpack_require__(54);
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = __webpack_require__(55);
var destroyImpl = __webpack_require__(24);
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);

  // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.
  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream) {
  Duplex = Duplex || __webpack_require__(6);

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var readableHwm = options.readableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;else this.highWaterMark = defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = __webpack_require__(25).StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || __webpack_require__(6);

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});

Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = __webpack_require__(25).StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) pna.nextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    pna.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) pna.nextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = { hasUnpiped: false };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, unpipeInfo);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this, unpipeInfo);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        pna.nextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    pna.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;

  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  this._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._readableState.highWaterMark;
  }
});

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    pna.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8), __webpack_require__(10)))

/***/ }),
/* 21 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(13).EventEmitter;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(52)
var ieee754 = __webpack_require__(53)
var isArray = __webpack_require__(21)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)))

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*<replacement>*/

var pna = __webpack_require__(11);
/*</replacement>*/

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      pna.nextTick(emitErrorNT, this, err);
    }
    return this;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      pna.nextTick(emitErrorNT, _this, err);
      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      cb(err);
    }
  });

  return this;
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



/*<replacement>*/

var Buffer = __webpack_require__(12).Buffer;
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.



module.exports = Transform;

var Duplex = __webpack_require__(6);

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(7);
/*</replacement>*/

util.inherits(Transform, Duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) {
    return this.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;

  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);

  cb(er);

  var rs = this._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  };

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  if (typeof this._flush === 'function') {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this2 = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this2.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  if (stream._writableState.length) throw new Error('Calling transform done when ws.length != 0');

  if (stream._transformState.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(28);

__webpack_require__(66);

__webpack_require__(81);

__webpack_require__(83);

/**
 * @fileoverview entry point for viewer with all extensions
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var EditorViewer = __webpack_require__(85);

module.exports = EditorViewer;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDefaultOptions = exports.detectDelimiter = exports.parseDSV2ChartData = exports.parseCode2ChartOption = exports.parseURL2ChartData = exports.parseCode2DataAndOptions = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _tuiChartPolyfill = __webpack_require__(29);

var _tuiChartPolyfill2 = _interopRequireDefault(_tuiChartPolyfill);

var _editorProxy = __webpack_require__(2);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _csv = __webpack_require__(51);

var _csv2 = _interopRequireDefault(_csv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @fileoverview tsv, csv format chart plugin
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * consumes tab separated values and make data/options for tui chart
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

/**
 * @example
 * tsv, csv format chart plugin
 * consumes tab separated values and make data/options for tui-chart
 *
 * ```chart
 * \tcat1\tcat2           => tsv, csv format chart data
 * jan\t21\t23
 * feb\t351\t45
 *                          => space required as a separator
 * type: area               => tui.chart.areaChart()
 * url: http://url.to/csv   => fetch data from the url
 * width: 700               => chart.width
 * height: 300              => chart.height
 * title: Monthly Revenue   => chart.title
 * format: 1000             => chart.format
 * x.title: Amount          => xAxis.title
 * x.min: 0                 => xAxis.min
 * x.max 9000               => xAxis.max
 * x.suffix: $              => xAxis.suffix
 * y.title: Month           => yAxis.title
 * ```
 */


var WwCodeBlockManager = _editorProxy2.default.WwCodeBlockManager,
    codeBlockManager = _editorProxy2.default.codeBlockManager;

var LANG = 'chart';

// csv configuration
_csv2.default.IGNORE_QUOTE_WHITESPACE = false;
_csv2.default.IGNORE_RECORD_LENGTH = true;
_csv2.default.DETECT_TYPES = false;

var REGEX_LINE_ENDING = /[\n\r]/;
var DSV_DELIMITERS = [',', '\t', /\s+/];
var OPTION_DELIMITER = ':';
var SUPPORTED_CHART_TYPES = ['barChart', 'columnChart', 'lineChart', 'areaChart', 'pieChart'];
var CATEGORY_CHART_TYPES = ['lineChart', 'areaChart'];
var DEFAULT_CHART_OPTIONS = {
  minWidth: 0,
  maxWidth: Infinity,
  minHeight: 0,
  maxHeight: Infinity,
  height: 'auto',
  width: 'auto'
};

/**
 * parse data and options for tui.chart
 * data format can be csv, tsv
 * options format is colon separated keys & values
 * @param {string} code - plain text format data & options
 * @param {Function} callback - callback which provides json format data & options
 * @ignore
 */
function parseCode2DataAndOptions(code, callback) {
  code = trimKeepingTabs(code);

  var _code$split = code.split(/\n{2,}/),
      firstCode = _code$split[0],
      secondCode = _code$split[1];

  // try to parse first code block as `options`


  var options = parseCode2ChartOption(firstCode);
  var url = options && options.editorChart && options.editorChart.url;

  // if first code block is `options` and has `url` option, fetch data from url
  var dataAndOptions = void 0;
  if (_tuiCodeSnippet2.default.isString(url)) {
    // url option provided
    // fetch data from url
    var success = function success(dataCode) {
      dataAndOptions = _parseCode2DataAndOptions(dataCode, firstCode);
      callback(dataAndOptions);
    };
    var fail = function fail() {
      return callback(null);
    };

    _jquery2.default.get(url).done(success).fail(fail);
  } else {
    // else first block is `data`
    dataAndOptions = _parseCode2DataAndOptions(firstCode, secondCode);
    callback(dataAndOptions);
  }
}

/**
 * parse codes to chart data & options Object
 * @param {string} dataCode - code block containing chart data
 * @param {string} optionCode - code block containing chart options
 * @returns {Object} - tui.chart data & options
 * @see https://nhn.github.io/tui.chart/latest/tui.chart.html
 * @ignore
 */
function _parseCode2DataAndOptions(dataCode, optionCode) {
  var data = parseDSV2ChartData(dataCode);
  var options = parseCode2ChartOption(optionCode);

  return {
    data: data,
    options: options
  };
}

/**
 * detect delimiter the comma, tab, regex
 * @param {string} code - code to detect delimiter
 * @returns {string|RegExp} - detected delimiter
 * @ignore
 */
function detectDelimiter(code) {
  code = trimKeepingTabs(code);

  // chunk first max 10 lines to detect
  var chunk = code.split(REGEX_LINE_ENDING).slice(0, 10).join('\n');

  // calc delta for each delimiters
  // then pick a delimiter having the minimum value delta
  return DSV_DELIMITERS.map(function (delimiter) {
    return {
      delimiter: delimiter,
      delta: calcDSVDelta(chunk, delimiter)
    };
  }).sort(function (a, b) {
    return a.delta - b.delta;
  })[0].delimiter;
}

/**
 * calculate delta(sum of length difference of rows) values of given DSV
 * @param {string} code - code to be test
 * @param {string|RegExp} delimiter - delimiter to test
 * @returns {number} delta value for code
 * @ignore
 */
function calcDSVDelta(code, delimiter) {
  var rows = void 0,
      delta = void 0;

  try {
    _csv2.default.COLUMN_SEPARATOR = delimiter;
    rows = _csv2.default.parse(code);

    if (rows[0].length < 2) {
      // parsing completely failed
      throw new Error('parser fail');
    }

    // sum of all length difference of all rows
    delta = rows.map(function (row) {
      return row.length;
    }).reduce(function (a, b) {
      return {
        deltaSum: a.deltaSum + Math.abs(a.length - b),
        length: b
      };
    }, {
      deltaSum: 0,
      length: rows[0].length
    }).deltaSum;
  } catch (e) {
    delta = Infinity;
  }

  return delta;
}

/**
 * parse csv, tsv to chart data
 * @param {string} code - data code
 * @param {string|RegExp} delimiter - delimiter
 * @returns {Object} - tui.chart data
 * @see https://nhn.github.io/tui.chart/latest/tui.chart.html
 * @ignore
 */
function parseDSV2ChartData(code, delimiter) {
  // trim all heading/trailing blank lines
  code = trimKeepingTabs(code);

  _csv2.default.COLUMN_SEPARATOR = delimiter || detectDelimiter(code);
  var dsv = _csv2.default.parse(code);

  // trim all values in 2D array
  dsv = dsv.map(function (arr) {
    return arr.map(function (val) {
      return val.trim();
    });
  });

  // test a first row for legends. ['anything', '1', '2', '3'] === false, ['anything', 't1', '2', 't3'] === true
  var hasLegends = dsv[0].filter(function (v, i) {
    return i > 0;
  }).reduce(function (hasNaN, item) {
    return hasNaN || !isNumeric(item);
  }, false);
  var legends = hasLegends ? dsv.shift() : [];

  // test a first column for categories
  var hasCategories = dsv.slice(1).reduce(function (hasNaN, row) {
    return hasNaN || !isNumeric(row[0]);
  }, false);
  var categories = hasCategories ? dsv.map(function (arr) {
    return arr.shift();
  }) : [];
  if (hasCategories) {
    legends.shift();
  }

  // transpose dsv, parse number
  // [['1','2','3']    [[1,4,7]
  //  ['4','5','6'] =>  [2,5,8]
  //  ['7','8','9']]    [3,6,9]]
  dsv = dsv[0].map(function (t, i) {
    return dsv.map(function (x) {
      return parseFloat(x[i]);
    });
  });

  // make series
  var series = dsv.map(function (data, i) {
    return hasLegends ? {
      name: legends[i],
      data: data
    } : {
      data: data
    };
  });

  return {
    categories: categories,
    series: series
  };
}

/**
 * parse code from url
 * @param {string} url - remote csv/tsv file url
 * @param {Function} callback - callback function
 * @ignore
 */
function parseURL2ChartData(url, callback) {
  var success = function success(code) {
    var chartData = parseDSV2ChartData(code);

    callback(chartData);
  };
  var fail = function fail() {
    return callback(null);
  };

  _jquery2.default.get(url).done(success).fail(fail);
}

/**
 * parse option code
 * @param {string} optionCode - option code
 * @returns {Object} - tui.chart option string
 * @see https://nhn.github.io/tui.chart/latest/tui.chart.html
 * @ignore
 */
function parseCode2ChartOption(optionCode) {
  var reservedKeys = ['type', 'url'];
  var options = {};
  if (_tuiCodeSnippet2.default.isUndefined(optionCode)) {
    return options;
  }

  var optionLines = optionCode.split(REGEX_LINE_ENDING);
  optionLines.forEach(function (line) {
    var _line$split = line.split(OPTION_DELIMITER),
        keyString = _line$split[0],
        values = _line$split.slice(1);

    var value = values.join(OPTION_DELIMITER);
    keyString = keyString.trim();
    if (value.length === 0) {
      return;
    }

    try {
      value = JSON.parse(value.trim());
    } catch (e) {
      value = value.trim();
    }

    // parse keys

    var _keyString$split = keyString.split('.'),
        keys = _keyString$split.slice(0);

    var topKey = keys[0];
    if (_tuiCodeSnippet2.default.inArray(topKey, reservedKeys) >= 0) {
      // reserved keys for chart plugin option
      keys.unshift('editorChart');
    } else if (keys.length === 1) {
      // short names for `chart`
      keys.unshift('chart');
    } else if (topKey === 'x' || topKey === 'y') {
      // short-handed keys
      keys[0] = topKey + 'Axis';
    }

    var option = options;
    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      option[key] = option[key] || (keys.length - 1 === i ? value : {});
      option = option[key];
    }
  });

  return options;
}

/**
 * trim whitespace and newlines at head/tail
 * it should not trim \t in tsv
 * @param {string} code - code to trim
 * @returns {string} - trimmed code
 * @ignore
 */
function trimKeepingTabs(code) {
  return code.replace(/(^(\s*[\n\r])+)|([\n\r]+\s*$)/g, '');
}

/**
 * test given string is numeric
 * @param {string} str - string to be tested
 * @returns {boolean} - true for numeric string
 * @ignore
 */
function isNumeric(str) {
  return !isNaN(str) && isFinite(str);
}

/**
 * set default options
 * @param {Object} chartOptions - tui.chart options
 * @param {Object} extensionOptions - extension options
 * @param {HTMLElement} chartContainer - chart container
 * @returns {Object} - options
 * @see https://nhn.github.io/tui.chart/latest/tui.chart.html
 * @ignore
 */
function setDefaultOptions(chartOptions, extensionOptions, chartContainer) {
  // chart options scaffolding
  chartOptions = _tuiCodeSnippet2.default.extend({
    editorChart: {},
    chart: {},
    chartExportMenu: {},
    usageStatistics: extensionOptions.usageStatistics
  }, chartOptions);

  // set default extension options
  extensionOptions = _tuiCodeSnippet2.default.extend(DEFAULT_CHART_OPTIONS, extensionOptions);

  // determine width, height
  var _chartOptions$chart = chartOptions.chart,
      width = _chartOptions$chart.width,
      height = _chartOptions$chart.height;

  var isWidthUndefined = _tuiCodeSnippet2.default.isUndefined(width);
  var isHeightUndefined = _tuiCodeSnippet2.default.isUndefined(height);
  if (isWidthUndefined || isHeightUndefined) {
    // if no width or height specified, set width and height to container width
    var _chartContainer$getBo = chartContainer.getBoundingClientRect(),
        containerWidth = _chartContainer$getBo.width;

    width = isWidthUndefined ? extensionOptions.width : width;
    height = isHeightUndefined ? extensionOptions.height : height;
    width = width === 'auto' ? containerWidth : width;
    height = height === 'auto' ? containerWidth : height;
  }
  width = Math.min(extensionOptions.maxWidth, width);
  height = Math.min(extensionOptions.maxHeight, height);
  chartOptions.chart.width = Math.max(extensionOptions.minWidth, width);
  chartOptions.chart.height = Math.max(extensionOptions.minHeight, height);

  // default chart type
  chartOptions.editorChart.type = chartOptions.editorChart.type ? chartOptions.editorChart.type + 'Chart' : 'columnChart';
  // default visibility of export menu
  chartOptions.chartExportMenu.visible = chartOptions.chartExportMenu.visible || false;

  return chartOptions;
}

/**
 * replace html from chart data
 * @param {string} codeBlockChartDataAndOptions - chart data text
 * @param {Object} extensionOptions - chart extension options
 * @returns {string} - rendered html
 * @ignore
 */
function chartReplacer(codeBlockChartDataAndOptions, extensionOptions) {
  var randomId = 'chart-' + Math.random().toString(36).substr(2, 10);
  var renderedHTML = '<div id="' + randomId + '" class="chart" />';

  setTimeout(function () {
    var chartContainer = document.querySelector('#' + randomId);
    try {
      parseCode2DataAndOptions(codeBlockChartDataAndOptions, function (_ref) {
        var data = _ref.data,
            chartOptions = _ref.options;

        chartOptions = setDefaultOptions(chartOptions, extensionOptions, chartContainer);

        var chartType = chartOptions.editorChart.type;
        if (SUPPORTED_CHART_TYPES.indexOf(chartType) < 0) {
          chartContainer.innerHTML = 'invalid chart type. type: bar, column, line, area, pie';
        } else if (CATEGORY_CHART_TYPES.indexOf(chartType) > -1 && data.categories.length !== data.series[0].data.length) {
          chartContainer.innerHTML = 'invalid chart data';
        } else {
          _tuiChartPolyfill2.default[chartType](chartContainer, data, chartOptions);
        }
      });
    } catch (e) {
      chartContainer.innerHTML = 'invalid chart data';
    }
  }, 0);

  return renderedHTML;
}

/**
 * reduce 2D array to TSV rows
 * @param {Array.<Array.<string>>} arr - 2d array
 * @returns {Array.<string>} - TSV row array
 * @ignore
 */
function _reduceToTSV(arr) {
  // 2D array => quoted TSV row array
  // [['a', 'b b'], [1, 2]] => ['a\t"b b"', '1\t2']
  return arr.reduce(function (acc, row) {
    // ['a', 'b b', 'c c'] => ['a', '"b b"', '"c c"']
    var quoted = row.map(function (text) {
      if (!isNumeric(text) && text.indexOf(' ') >= 0) {
        text = '"' + text + '"';
      }

      return text;
    });
    // ['a', '"b b"', '"c c"'] => 'a\t"b b"\t"c c"'
    acc.push(quoted.join('\t'));

    return acc;
  }, []);
}

/**
 * override WwCodeBlockManager to enclose pasting data strings from wysiwyg in quotes
 * @param {Editor} editor - editor
 * @ignore
 */
function _setWwCodeBlockManagerForChart(editor) {
  var componentManager = editor.wwEditor.componentManager;
  componentManager.removeManager('codeblock');
  componentManager.addManager(function (_WwCodeBlockManager) {
    _inherits(_class, _WwCodeBlockManager);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'convertNodesToText',

      /**
       * Convert table nodes into code block as TSV
       * @param {Array.<Node>} nodes Node array
       * @returns {HTMLElement} Code block element
       * @override
       * @ignore
       */
      value: function convertNodesToText(nodes) {
        if (nodes.length !== 1 || nodes[0].tagName !== 'TABLE') {
          return _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'convertNodesToText', this).call(this, nodes);
        }

        var node = nodes.shift();
        var str = '';

        // convert table to 2-dim array
        var cells = [].slice.call(node.rows).map(function (row) {
          return [].slice.call(row.cells).map(function (cell) {
            return cell.innerText.trim();
          });
        });

        var tsvRows = _reduceToTSV(cells);
        str += tsvRows.reduce(function (acc, row) {
          return acc + (row + '\n');
        }, []);

        return str;
      }
    }]);

    return _class;
  }(WwCodeBlockManager));
}

/**
 * determine the event is from codeblock in markdown/codeblock editor
 * @param {CodeMirror} cm - markdown codemirror editor
 * @param {string} source - event source
 * @param {Object} eventData - event data
 * @returns {boolean} - true for the event from codeblock in markdown/codeblock editor
 * @ignore
 */
function _isFromCodeBlockInCodeMirror(cm, source, eventData) {
  // cursor in codeblock in markdown editor
  var fromCodeBlockInCodeMirror = source === 'markdown' && cm.getTokenAt(eventData.from).state.overlay.codeBlock;
  // or codeblock editor
  fromCodeBlockInCodeMirror = fromCodeBlockInCodeMirror || source === 'codeblock';
  // but not from wysiwyg
  fromCodeBlockInCodeMirror = fromCodeBlockInCodeMirror && source !== 'wysiwyg';

  return fromCodeBlockInCodeMirror;
}

/**
 * enclose pasting data strings from markdown in quotes
 * wysiwyg event should be treated separately.
 * because pasteBefore event from wysiwyg has been already processed table data to string,
 * on the other hand we need a table element
 * @param {CodeMirror} cm - markdown codemirror editor
 * @param {string} source - event source
 * @param {Object} data - event data
 * @ignore
 */
function _onMDPasteBefore(cm, _ref2) {
  var source = _ref2.source,
      eventData = _ref2.data;

  if (!_isFromCodeBlockInCodeMirror(cm, source, eventData)) {
    return;
  }

  var code = eventData.text.join('\n');
  var delta = calcDSVDelta(code, '\t');

  if (delta === 0) {
    _csv2.default.COLUMN_SEPARATOR = '\t';
    var parsed = _reduceToTSV(_csv2.default.parse(code));
    eventData.update(eventData.from, eventData.to, parsed);
  }
}

/**
 * chart plugin
 * @param {Editor} editor - editor
 * @param {Object} options - chart options
  * @param {number} [options.minWidth=0] - minimum width
  * @param {number} [options.maxWidth=0] - maximum width
  * @param {number} [options.minHeight=Infinity] - minimum height
  * @param {number} [options.maxHeight=Infinity] - maximum height
  * @param {number|string} [options.width='auto'] - default height
  * @param {number|string} [options.height='auto'] - default height
 * @ignore
 */
function chartExtension(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var optionLanguages = editor.options.codeBlockLanguages;
  if (optionLanguages && optionLanguages.indexOf(LANG) < 0) {
    optionLanguages.push(LANG);
  }

  options = _tuiCodeSnippet2.default.extend({
    usageStatistics: editor.options.usageStatistics
  }, options);

  codeBlockManager.setReplacer(LANG, function (codeBlockChartDataAndOptions) {
    return chartReplacer(codeBlockChartDataAndOptions, options);
  });

  if (!editor.isViewer()) {
    // treat wysiwyg paste event
    _setWwCodeBlockManagerForChart(editor);

    // treat markdown paste event
    editor.eventManager.listen('pasteBefore', function (ev) {
      return _onMDPasteBefore(editor.mdEditor.cm, ev);
    });
  }
}

_editorProxy2.default.defineExtension('chart', chartExtension);

exports.parseCode2DataAndOptions = parseCode2DataAndOptions;
exports.parseURL2ChartData = parseURL2ChartData;
exports.parseCode2ChartOption = parseCode2ChartOption;
exports.parseDSV2ChartData = parseDSV2ChartData;
exports.detectDelimiter = detectDelimiter;
exports.setDefaultOptions = setDefaultOptions;

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__29__;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _preview = __webpack_require__(31);

var _preview2 = _interopRequireDefault(_preview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements markdown preview
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Class Markdown Preview
 * @param {jQuery} $el - base jQuery element
 * @param {EventManager} eventManager - event manager
 * @param {Convertor} convertor - convertor
 * @param {boolean} isViewer - true for view only mode
 * @param {Number} delayTime - lazyRunner delay time
 * @ignore
 */
var MarkdownPreview = function (_Preview) {
  _inherits(MarkdownPreview, _Preview);

  function MarkdownPreview($el, eventManager, convertor, isViewer, delayTime) {
    _classCallCheck(this, MarkdownPreview);

    var _this = _possibleConstructorReturn(this, (MarkdownPreview.__proto__ || Object.getPrototypeOf(MarkdownPreview)).call(this, $el, eventManager, convertor, isViewer, delayTime));

    _this._initEvent();
    return _this;
  }

  /**
   * Initialize event
   * @private
   */


  _createClass(MarkdownPreview, [{
    key: '_initEvent',
    value: function _initEvent() {
      var _this2 = this;

      var latestMarkdownValue = '';

      this.eventManager.listen('contentChangedFromMarkdown', function (markdownEditor) {
        latestMarkdownValue = markdownEditor.getValue();

        if (_this2.isVisible()) {
          _this2.lazyRunner.run('refresh', latestMarkdownValue);
        }
      });

      this.eventManager.listen('previewNeedsRefresh', function (value) {
        _this2.refresh(value || latestMarkdownValue);
      });

      this.$el.on('scroll', function (event) {
        _this2.eventManager.emit('scroll', {
          source: 'preview',
          data: event
        });
      });
    }

    /**
     * render
     * @param {string} html - html string to render
     * @override
     */

  }, {
    key: 'render',
    value: function render(html) {
      _get(MarkdownPreview.prototype.__proto__ || Object.getPrototypeOf(MarkdownPreview.prototype), 'render', this).call(this, html);

      this.eventManager.emit('previewRenderAfter', this);
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.$el.off('scroll');
      this.$el = null;
    }
  }]);

  return MarkdownPreview;
}(_preview2.default);

exports.default = MarkdownPreview;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements preview
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _lazyRunner = __webpack_require__(32);

var _lazyRunner2 = _interopRequireDefault(_lazyRunner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class Preview
 * @param {jQuery} $el Container element for preview
 * @param {EventManager} eventManager Event manager instance
 * @param {Convertor} convertor Convertor instance
 * @param {boolean} isViewer - whether viewer mode or not
 * @param {Number} delayTime - lazyRunner delay time
 * @ignore
 */
var Preview = function () {
  function Preview($el, eventManager, convertor, isViewer) {
    var delayTime = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 800;

    _classCallCheck(this, Preview);

    this.eventManager = eventManager;
    this.convertor = convertor;
    this.$el = $el;
    this.isViewer = !!isViewer;

    this._initContentSection();

    this.lazyRunner = new _lazyRunner2.default();

    this.lazyRunner.registerLazyRunFunction('refresh', this.refresh, delayTime, this);
  }

  /**
   * Initialize content selection
   * @private
   */


  _createClass(Preview, [{
    key: '_initContentSection',
    value: function _initContentSection() {
      this._$previewContent = (0, _jquery2.default)('<div class="tui-editor-contents" />');
      this.$el.append(this._$previewContent);
    }

    /**
     * Refresh rendering
     * @param {string} markdown Markdown text
     */

  }, {
    key: 'refresh',
    value: function refresh(markdown) {
      this.render(this.convertor.toHTMLWithCodeHightlight(markdown));
    }

    /**
     * get html string
     * @returns {string} - html preview string
     */

  }, {
    key: 'getHTML',
    value: function getHTML() {
      return this._$previewContent.html();
    }

    /**
     * set html string
     * @param {string} html - html preview string
     */

  }, {
    key: 'setHTML',
    value: function setHTML(html) {
      this._$previewContent.html(html);
    }

    /**
     * Render HTML on preview
     * @param {string} html HTML string
     */

  }, {
    key: 'render',
    value: function render(html) {
      var _$previewContent = this._$previewContent;

      html = this.eventManager.emit('previewBeforeHook', html) || html;

      _$previewContent.empty();
      _$previewContent.html(html);
    }

    /**
     * Set preview height
     * @param {number} height - Height for preview container
     */

  }, {
    key: 'setHeight',
    value: function setHeight(height) {
      this.$el.get(0).style.height = height + 'px';
    }

    /**
     * set min height
     * @param {number} minHeight - min height
     */

  }, {
    key: 'setMinHeight',
    value: function setMinHeight(minHeight) {
      this.$el.get(0).style.minHeight = minHeight + 'px';
    }

    /**
     * Is Preview visible
     * @returns {boolean} result
     */

  }, {
    key: 'isVisible',
    value: function isVisible() {
      return this.$el.css('display') !== 'none';
    }
  }]);

  return Preview;
}();

exports.default = Preview;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements LazyRunner
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class LazyRunner
 * @ignore
 */
var LazyRunner = function () {
  function LazyRunner() {
    _classCallCheck(this, LazyRunner);

    this.globalTOID = null;
    this.lazyRunFunctions = {};
  }

  _createClass(LazyRunner, [{
    key: 'run',
    value: function run(fn, params, context, delay) {
      var TOID = void 0;

      if (_tuiCodeSnippet2.default.isString(fn)) {
        TOID = this._runRegisteredRun(fn, params, context, delay);
      } else {
        TOID = this._runSingleRun(fn, params, context, delay, this.globalTOID);
        this.globalTOID = TOID;
      }

      return TOID;
    }
  }, {
    key: 'registerLazyRunFunction',
    value: function registerLazyRunFunction(name, fn, delay, context) {
      context = context || this;

      this.lazyRunFunctions[name] = {
        fn: fn,
        delay: delay,
        context: context,
        TOID: null
      };
    }
  }, {
    key: '_runSingleRun',
    value: function _runSingleRun(fn, params, context, delay, TOID) {
      this._clearTOIDIfNeed(TOID);

      TOID = setTimeout(function () {
        fn.call(context, params);
      }, delay);

      return TOID;
    }
  }, {
    key: '_runRegisteredRun',
    value: function _runRegisteredRun(lazyRunName, params, context, delay) {
      var lazyRunFunction = this.lazyRunFunctions[lazyRunName];
      var fn = lazyRunFunction.fn;
      var TOID = lazyRunFunction.TOID;

      delay = delay || lazyRunFunction.delay;
      context = context || lazyRunFunction.context;

      TOID = this._runSingleRun(fn, params, context, delay, TOID);

      lazyRunFunction.TOID = TOID;

      return TOID;
    }
  }, {
    key: '_clearTOIDIfNeed',
    value: function _clearTOIDIfNeed(TOID) {
      if (TOID) {
        clearTimeout(TOID);
      }
    }
  }]);

  return LazyRunner;
}();

exports.default = LazyRunner;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements EventManager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var eventList = ['previewBeforeHook', 'previewRenderAfter', 'previewNeedsRefresh', 'addImageBlobHook', 'setMarkdownAfter', 'contentChangedFromWysiwyg', 'changeFromWysiwyg', 'contentChangedFromMarkdown', 'changeFromMarkdown', 'change', 'changeModeToWysiwyg', 'changeModeToMarkdown', 'changeModeBefore', 'changeMode', 'changePreviewStyle', 'changePreviewTabPreview', 'changePreviewTabWrite', 'openPopupAddLink', 'openPopupAddImage', 'openPopupAddTable', 'openPopupTableUtils', 'openHeadingSelect', 'openPopupCodeBlockLanguages', 'openPopupCodeBlockEditor', 'openDropdownToolbar', 'closePopupCodeBlockLanguages', 'closePopupCodeBlockEditor', 'closeAllPopup', 'command', 'addCommandBefore', 'htmlUpdate', 'markdownUpdate', 'renderedHtmlUpdated', 'removeEditor', 'convertorAfterMarkdownToHtmlConverted', 'convertorBeforeHtmlToMarkdownConverted', 'convertorAfterHtmlToMarkdownConverted', 'stateChange', 'wysiwygSetValueAfter', 'wysiwygSetValueBefore', 'wysiwygGetValueBefore', 'wysiwygProcessHTMLText', 'wysiwygRangeChangeAfter', 'wysiwygKeyEvent', 'scroll', 'click', 'mousedown', 'mouseover', 'mouseout', 'mouseup', 'contextmenu', 'keydown', 'keyup', 'keyMap', 'load', 'focus', 'blur', 'paste', 'pasteBefore', 'willPaste', 'copy', 'copyBefore', 'copyAfter', 'cut', 'cutAfter', 'drop', 'show', 'hide'];

/**
 * Class EventManager
 * @ignore
 */

var EventManager = function () {
  function EventManager() {
    _classCallCheck(this, EventManager);

    this.events = new _tuiCodeSnippet2.default.Map();
    this.TYPE = new _tuiCodeSnippet2.default.Enum(eventList);
  }

  /**
   * Listen event and bind event handler
   * @param {string} typeStr Event type string
   * @param {function} handler Event handler
   */


  _createClass(EventManager, [{
    key: 'listen',
    value: function listen(typeStr, handler) {
      var typeInfo = this._getTypeInfo(typeStr);
      var eventHandlers = this.events.get(typeInfo.type) || [];

      if (!this._hasEventType(typeInfo.type)) {
        throw new Error('There is no event type ' + typeInfo.type);
      }

      if (typeInfo.namespace) {
        handler.namespace = typeInfo.namespace;
      }

      eventHandlers.push(handler);

      this.events.set(typeInfo.type, eventHandlers);
    }

    /**
     * Emit event
     * @param {string} eventName Event name to emit
     * @returns {Array}
     */

  }, {
    key: 'emit',
    value: function emit() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var typeStr = args.shift();
      var typeInfo = this._getTypeInfo(typeStr);
      var eventHandlers = this.events.get(typeInfo.type);
      var results = void 0;

      if (eventHandlers) {
        _tuiCodeSnippet2.default.forEach(eventHandlers, function (handler) {
          var result = handler.apply(undefined, args);

          if (!_tuiCodeSnippet2.default.isUndefined(result)) {
            results = results || [];
            results.push(result);
          }
        });
      }

      return results;
    }

    /**
     * Emit given event and return result
     * @param {string} eventName Event name to emit
     * @param {string} sourceText Source text to change
     * @returns {string}
     */

  }, {
    key: 'emitReduce',
    value: function emitReduce() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var type = args.shift();
      var eventHandlers = this.events.get(type);

      if (eventHandlers) {
        _tuiCodeSnippet2.default.forEach(eventHandlers, function (handler) {
          var result = handler.apply(undefined, args);

          if (!_tuiCodeSnippet2.default.isFalsy(result)) {
            args[0] = result;
          }
        });
      }

      return args[0];
    }

    /**
     * Get event type and namespace
     * @param {string} typeStr Event type name
     * @returns {{type: string, namespace: string}}
     * @private
     */

  }, {
    key: '_getTypeInfo',
    value: function _getTypeInfo(typeStr) {
      var splited = typeStr.split('.');

      return {
        type: splited[0],
        namespace: splited[1]
      };
    }

    /**
     * Check whether event type exists or not
     * @param {string} type Event type name
     * @returns {boolean}
     * @private
     */

  }, {
    key: '_hasEventType',
    value: function _hasEventType(type) {
      return !_tuiCodeSnippet2.default.isUndefined(this.TYPE[this._getTypeInfo(type).type]);
    }

    /**
     * Add event type when given event not exists
     * @param {string} type Event type name
     */

  }, {
    key: 'addEventType',
    value: function addEventType(type) {
      if (this._hasEventType(type)) {
        throw new Error('There is already have event type ' + type);
      }

      this.TYPE.set(type);
    }

    /**
     * Remove event handler from given event type
     * @param {string} typeStr Event type name
     * @param {function} [handler] - registered event handler
     */

  }, {
    key: 'removeEventHandler',
    value: function removeEventHandler(typeStr, handler) {
      var _this = this;

      var _getTypeInfo2 = this._getTypeInfo(typeStr),
          type = _getTypeInfo2.type,
          namespace = _getTypeInfo2.namespace;

      if (type && handler) {
        this._removeEventHandlerWithHandler(type, handler);
      } else if (type && !namespace) {
        // dont use dot notation cuz eslint
        this.events['delete'](type);
      } else if (!type && namespace) {
        this.events.forEach(function (eventHandlers, eventType) {
          _this._removeEventHandlerWithTypeInfo(eventType, namespace);
        });
      } else if (type && namespace) {
        this._removeEventHandlerWithTypeInfo(type, namespace);
      }
    }

    /**
     * Remove event handler with event handler
     * @param {string} type - event type name
     * @param {function} handler - event handler
     * @private
     */

  }, {
    key: '_removeEventHandlerWithHandler',
    value: function _removeEventHandlerWithHandler(type, handler) {
      var eventHandlers = this.events.get(type) || [];
      var handlerIndex = eventHandlers.indexOf(handler);
      if (handlerIndex >= 0) {
        eventHandlers.splice(handlerIndex, 1);
      }
    }

    /**
     * Remove event handler with event type information
     * @param {string} type Event type name
     * @param {string} namespace Event namespace
     * @private
     */

  }, {
    key: '_removeEventHandlerWithTypeInfo',
    value: function _removeEventHandlerWithTypeInfo(type, namespace) {
      var handlersToSurvive = [];
      var eventHandlers = this.events.get(type);

      if (!eventHandlers) {
        return;
      }

      eventHandlers.map(function (handler) {
        if (handler.namespace !== namespace) {
          handlersToSurvive.push(handler);
        }

        return null;
      });

      this.events.set(type, handlersToSurvive);
    }
  }]);

  return EventManager;
}();

exports.default = EventManager;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements CommandManager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _command = __webpack_require__(35);

var _command2 = _interopRequireDefault(_command);

var _util = __webpack_require__(36);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KEYMAP_OS_INDEX = _util.isMac ? 1 : 0;

/**
 * Class CommandManager
 * @param {ToastUIEditor} base nedInstance
 * @param {object} [options={}] - option object
 *     @param {boolean} [options.useCommandShortcut=true] - execute command with keyMap
 * @ignore
 */

var CommandManager = function () {
  function CommandManager(base) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, CommandManager);

    this._command = new _tuiCodeSnippet2.default.Map();
    this._mdCommand = new _tuiCodeSnippet2.default.Map();
    this._wwCommand = new _tuiCodeSnippet2.default.Map();
    this._options = _jquery2.default.extend({
      'useCommandShortcut': true
    }, options);

    this.base = base;

    this.keyMapCommand = {};

    this._initEvent();
  }

  /**
   * You can change command before command addition by addCommandBefore event.
   * @param {object} command - command
   * @returns {object}
   * @private
   */


  _createClass(CommandManager, [{
    key: '_addCommandBefore',
    value: function _addCommandBefore(command) {
      var commandWrapper = { command: command };

      this.base.eventManager.emit('addCommandBefore', commandWrapper);

      return commandWrapper.command || command;
    }

    /**
     * Add command
     * @param {Command} command Command instance
     * @returns {Command} Command
     */

  }, {
    key: 'addCommand',
    value: function addCommand(command) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (args.length) {
        command = CommandManager.command.apply(CommandManager, [command].concat(args));
      }

      command = this._addCommandBefore(command);

      var name = command.getName();

      var commandBase = void 0;

      if (command.isMDType()) {
        commandBase = this._mdCommand;
      } else if (command.isWWType()) {
        commandBase = this._wwCommand;
      } else if (command.isGlobalType()) {
        commandBase = this._command;
      }

      commandBase.set(name, command);

      if (command.keyMap) {
        this.keyMapCommand[command.keyMap[KEYMAP_OS_INDEX]] = name;
      }

      return command;
    }

    /**
     * _initEvent
     * Bind event handler to eventManager
     * @private
     */

  }, {
    key: '_initEvent',
    value: function _initEvent() {
      var _this = this;

      this.base.eventManager.listen('command', function () {
        _this.exec.apply(_this, arguments);
      });

      this.base.eventManager.listen('keyMap', function (ev) {
        if (!_this._options.useCommandShortcut) {
          return;
        }
        var command = _this.keyMapCommand[ev.keyMap];

        if (command) {
          ev.data.preventDefault();
          _this.exec(command);
        }
      });
    }

    /**
     * Execute command
     * @param {String} name Command name
     * @param {*} ...args Command argument
     * @returns {*}
     */

  }, {
    key: 'exec',
    value: function exec(name) {
      var commandToRun = void 0,
          result = void 0;
      var context = this.base;

      commandToRun = this._command.get(name);

      if (!commandToRun) {
        if (this.base.isMarkdownMode()) {
          commandToRun = this._mdCommand.get(name);
          context = this.base.mdEditor;
        } else {
          commandToRun = this._wwCommand.get(name);
          context = this.base.wwEditor;
        }
      }

      if (commandToRun) {
        var _commandToRun;

        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        args.unshift(context);
        result = (_commandToRun = commandToRun).exec.apply(_commandToRun, args);
      }

      return result;
    }
  }]);

  return CommandManager;
}();

/**
 * Create command by given editor type and property object
 * @param {string} type Command type
 * @param {{name: string, keyMap: Array}} props Property
 * @returns {*}
 * @static
 */


CommandManager.command = function (type, props) {
  var command = _command2.default.factory(type, props.name, props.keyMap);

  _tuiCodeSnippet2.default.extend(command, props);

  return command;
};

exports.default = CommandManager;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements Command
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class Command
 * @param {string} name Command name
 * @param {number} type Command type (Command.TYPE)
 * @param {Array.<string>} [keyMap] keyMap
 * @ignore
 */
var Command = function () {
  function Command(name, type, keyMap) {
    _classCallCheck(this, Command);

    this.name = name;
    this.type = type;

    if (keyMap) {
      this.setKeyMap(keyMap);
    }
  }

  /**
   * returns Name of command
   * @returns {string} Command Name
   */


  _createClass(Command, [{
    key: 'getName',
    value: function getName() {
      return this.name;
    }

    /**
     * returns Type of command
     * @returns {number} Command Command type number
     */

  }, {
    key: 'getType',
    value: function getType() {
      return this.type;
    }

    /**
     * returns whether Command Type is Markdown or not
     * @returns {boolean} result
     */

  }, {
    key: 'isMDType',
    value: function isMDType() {
      return this.type === Command.TYPE.MD;
    }

    /**
     * returns whether Command Type is Wysiwyg or not
     * @returns {boolean} result
     */

  }, {
    key: 'isWWType',
    value: function isWWType() {
      return this.type === Command.TYPE.WW;
    }

    /**
     * returns whether Command Type is Global or not
     * @returns {boolean} result
     */

  }, {
    key: 'isGlobalType',
    value: function isGlobalType() {
      return this.type === Command.TYPE.GB;
    }

    /**
     * Set keymap value for each os
     * @param {string} win Windows Key(and etc)
     * @param {string} mac Mac osx key
     */

  }, {
    key: 'setKeyMap',
    value: function setKeyMap(win, mac) {
      this.keyMap = [win, mac];
    }
  }]);

  return Command;
}();

/**
 * Command factory method
 * @param {string} typeStr Editor type name
 * @param {object} props Property
 *     @param {string} props.name Command name
 *     @param {number} props.type Command type number
 * @returns {Command}
 * @static
 */


Command.factory = function (typeStr, props) {
  var type = void 0;

  if (typeStr === 'markdown') {
    type = Command.TYPE.MD;
  } else if (typeStr === 'wysiwyg') {
    type = Command.TYPE.WW;
  } else if (typeStr === 'global') {
    type = Command.TYPE.GB;
  }

  var command = new Command(props.name, type);

  _tuiCodeSnippet2.default.extend(command, props);

  return command;
};

/**
 * Command Type Constant
 * markdown : 0
 * wysiwyg : 1
 * global : 2
 * @type {object}
 * @private
 */
Command.TYPE = {
  MD: 0,
  WW: 1,
  GB: 2
};

exports.default = Command;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isMac = /Mac/.test(navigator.platform);

module.exports = {
  isMac: isMac
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview extension manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class ExtManager
 * @ignore
 */
var ExtManager = function () {
  function ExtManager() {
    _classCallCheck(this, ExtManager);

    this.exts = new _tuiCodeSnippet2.default.Map();
  }

  /**
   * Defined Extension
   * @param {string} name extension name
   * @param {function} ext extension
   */


  _createClass(ExtManager, [{
    key: 'defineExtension',
    value: function defineExtension(name, ext) {
      this.exts.set(name, ext);
    }

    /**
     * Apply extensions
     * @param {object} context Context
     * @param {Array.<string|object>} options - options or names array
     */

  }, {
    key: 'applyExtension',
    value: function applyExtension(context, options) {
      var _this = this;

      if (options) {
        options.forEach(function (option) {
          var hasOption = _tuiCodeSnippet2.default.isObject(option);
          var name = hasOption ? option.name : option;

          if (_this.exts.has(name)) {
            var ext = _this.exts.get(name);
            if (hasOption) {
              ext(context, option);
            } else {
              ext(context);
            }
          }
        });
      }
    }
  }]);

  return ExtManager;
}();

exports.default = new ExtManager();

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Convertor have responsible to convert markdown and html
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _markdownIt = __webpack_require__(39);

var _markdownIt2 = _interopRequireDefault(_markdownIt);

var _toMark = __webpack_require__(17);

var _toMark2 = _interopRequireDefault(_toMark);

var _htmlSanitizer = __webpack_require__(40);

var _htmlSanitizer2 = _interopRequireDefault(_htmlSanitizer);

var _markdownitTaskPlugin = __webpack_require__(41);

var _markdownitTaskPlugin2 = _interopRequireDefault(_markdownitTaskPlugin);

var _markdownitCodeBlockPlugin = __webpack_require__(42);

var _markdownitCodeBlockPlugin2 = _interopRequireDefault(_markdownitCodeBlockPlugin);

var _markdownitCodeRenderer = __webpack_require__(43);

var _markdownitCodeRenderer2 = _interopRequireDefault(_markdownitCodeRenderer);

var _markdownitBlockQuoteRenderer = __webpack_require__(44);

var _markdownitBlockQuoteRenderer2 = _interopRequireDefault(_markdownitBlockQuoteRenderer);

var _markdownitTableRenderer = __webpack_require__(45);

var _markdownitTableRenderer2 = _interopRequireDefault(_markdownitTableRenderer);

var _markdownitHtmlBlockRenderer = __webpack_require__(46);

var _markdownitHtmlBlockRenderer2 = _interopRequireDefault(_markdownitHtmlBlockRenderer);

var _markdownitBackticksRenderer = __webpack_require__(47);

var _markdownitBackticksRenderer2 = _interopRequireDefault(_markdownitBackticksRenderer);

var _markdownitInlinePlugin = __webpack_require__(48);

var _codeBlockManager = __webpack_require__(18);

var _codeBlockManager2 = _interopRequireDefault(_codeBlockManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var markdownitHighlight = new _markdownIt2.default({
  html: true,
  breaks: true,
  quotes: '“”‘’',
  langPrefix: 'lang-',
  highlight: function highlight(codeText, type) {
    return _codeBlockManager2.default.createCodeBlockHtml(type, codeText);
  }
});
var markdownit = new _markdownIt2.default({
  html: true,
  breaks: true,
  quotes: '“”‘’',
  langPrefix: 'lang-'
});

// markdownitHighlight
markdownitHighlight.block.ruler.at('code', _markdownitCodeRenderer2.default);
markdownitHighlight.block.ruler.at('table', _markdownitTableRenderer2.default, {
  alt: ['paragraph', 'reference']
});
markdownitHighlight.block.ruler.at('blockquote', _markdownitBlockQuoteRenderer2.default, {
  alt: ['paragraph', 'reference', 'blockquote', 'list']
});
markdownitHighlight.block.ruler.at('html_block', _markdownitHtmlBlockRenderer2.default, {
  alt: ['paragraph', 'reference', 'blockquote']
});
markdownitHighlight.inline.ruler.at('backticks', _markdownitBackticksRenderer2.default);
markdownitHighlight.use(_markdownitTaskPlugin2.default);
markdownitHighlight.use(_markdownitCodeBlockPlugin2.default);

markdownitHighlight.renderer.rules.softbreak = function (tokens, idx, options) {
  if (!options.breaks) {
    return '\n';
  }

  var prevToken = tokens[idx - 1];

  if (prevToken && prevToken.type === 'html_inline' && prevToken.content === '<br>') {
    return '';
  }

  return options.xhtmlOut ? '<br />\n' : '<br>\n';
};

// markdownit
markdownit.block.ruler.at('code', _markdownitCodeRenderer2.default);
markdownit.block.ruler.at('table', _markdownitTableRenderer2.default, {
  alt: ['paragraph', 'reference']
});
markdownit.block.ruler.at('blockquote', _markdownitBlockQuoteRenderer2.default, {
  alt: ['paragraph', 'reference', 'blockquote', 'list']
});
markdownit.block.ruler.at('html_block', _markdownitHtmlBlockRenderer2.default, {
  alt: ['paragraph', 'reference', 'blockquote']
});
markdownit.inline.ruler.at('backticks', _markdownitBackticksRenderer2.default);
markdownit.use(_markdownitTaskPlugin2.default);
markdownit.use(_markdownitCodeBlockPlugin2.default);

// This regular expression refere markdownIt.
// https://github.com/markdown-it/markdown-it/blob/master/lib/common/html_re.js
var attrName = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
var unquoted = '[^"\'=<>`\\x00-\\x20]+';
var singleQuoted = "'[^']*'";
var doubleQuoted = '"[^"]*"';
var attrValue = '(?:' + unquoted + '|' + singleQuoted + '|' + doubleQuoted + ')';
var attribute = '(?:\\s+' + attrName + '(?:\\s*=\\s*' + attrValue + ')?)*\\s*';
var openingTag = '(\\\\<|<)([A-Za-z][A-Za-z0-9\\-]*' + attribute + ')(\\/?>)';
var HTML_TAG_RX = new RegExp(openingTag, 'g');

/**
 * Class Convertor
 * @param {EventManager} em - EventManager instance
 * @ignore
 */

var Convertor = function () {
  function Convertor(em) {
    _classCallCheck(this, Convertor);

    this.eventManager = em;
  }

  /**
   * _markdownToHtmlWithCodeHighlight
   * Convert markdown to html with Codehighlight
   * @param {string} markdown markdown text
   * @param {object} env environment sandbox for markdownit
   * @returns {string} html text
   * @private
   */


  _createClass(Convertor, [{
    key: '_markdownToHtmlWithCodeHighlight',
    value: function _markdownToHtmlWithCodeHighlight(markdown, env) {
      markdown = this._replaceImgAttrToDataProp(markdown);

      return markdownitHighlight.render(markdown, env);
    }

    /**
     * _markdownToHtml
     * Convert markdown to html
     * @param {string} markdown markdown text
     * @param {object} env environment sandbox for markdownit
     * @returns {string} html text
     * @private
     */

  }, {
    key: '_markdownToHtml',
    value: function _markdownToHtml(markdown, env) {
      markdown = markdown.replace(HTML_TAG_RX, function (match, $1, $2, $3) {
        return match[0] !== '\\' ? '' + $1 + $2 + ' data-tomark-pass ' + $3 : match;
      });

      markdown = this._replaceImgAttrToDataProp(markdown);

      return markdownit.render(markdown, env);
    }

    /**
     * Replace 'onerror' attribute of img tag to data property string
     * @param {string} markdown markdown text
     * @returns {string} replaced markdown text
     * @private
     */

  }, {
    key: '_replaceImgAttrToDataProp',
    value: function _replaceImgAttrToDataProp(markdown) {
      var onerrorStripeRegex = /(<img[^>]*)(onerror\s*=\s*[\\"']?[^\\"']*[\\"']?)(.*)/i;

      while (onerrorStripeRegex.exec(markdown)) {
        markdown = markdown.replace(onerrorStripeRegex, '$1$3');
      }

      return markdown;
    }

    /**
     * Remove BR's data-tomark-pass attribute text when br in code element
     * @param {string} renderedHTML Rendered HTML string from markdown editor
     * @returns {string}
     * @private
     */

  }, {
    key: '_removeBrToMarkPassAttributeInCode',
    value: function _removeBrToMarkPassAttributeInCode(renderedHTML) {
      var $wrapperDiv = (0, _jquery2.default)('<div />');

      $wrapperDiv.html(renderedHTML);

      $wrapperDiv.find('code, pre').each(function (i, codeOrPre) {
        var $code = (0, _jquery2.default)(codeOrPre);
        $code.html($code.html().replace(/\sdata-tomark-pass\s(\/?)&gt;/g, '$1&gt;'));
      });

      renderedHTML = $wrapperDiv.html();

      return renderedHTML;
    }

    /**
     * toHTMLWithCodeHightlight
     * Convert markdown to html with Codehighlight
     * emit convertorAfterMarkdownToHtmlConverted
     * @param {string} markdown markdown text
     * @returns {string} html text
     */

  }, {
    key: 'toHTMLWithCodeHightlight',
    value: function toHTMLWithCodeHightlight(markdown) {
      var html = this._markdownToHtmlWithCodeHighlight(markdown);
      html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);

      return html;
    }

    /**
     * toHTML
     * Convert markdown to html
     * emit convertorAfterMarkdownToHtmlConverted
     * @param {string} markdown markdown text
     * @returns {string} html text
     */

  }, {
    key: 'toHTML',
    value: function toHTML(markdown) {
      var html = this._markdownToHtml(markdown);

      html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);
      html = this._removeBrToMarkPassAttributeInCode(html);

      return html;
    }
  }, {
    key: 'initHtmlSanitizer',
    value: function initHtmlSanitizer() {
      this.eventManager.listen('convertorAfterMarkdownToHtmlConverted', function (html) {
        return (0, _htmlSanitizer2.default)(html, true);
      });
    }

    /**
     * set link attribute to markdownitHighlight, markdownit
     * using linkAttribute of markdownItInlinePlugin
     * @param {object} attr markdown text
     */

  }, {
    key: 'setLinkAttribute',
    value: function setLinkAttribute(attr) {
      var keys = Object.keys(attr);
      var setAttributeToToken = function setAttributeToToken(tokens, idx) {
        keys.forEach(function (key) {
          tokens[idx].attrPush([key, attr[key]]);
        });
      };

      markdownitHighlight.use(_markdownitInlinePlugin.linkAttribute, setAttributeToToken);
      markdownit.use(_markdownitInlinePlugin.linkAttribute, setAttributeToToken);
    }

    /**
     * toMarkdown
     * Convert html to markdown
     * emit convertorAfterHtmlToMarkdownConverted
     * @param {string} html html text
     * @param {object | null} toMarkOptions - toMark library options
     * @returns {string} markdown text
     */

  }, {
    key: 'toMarkdown',
    value: function toMarkdown(html, toMarkOptions) {
      var resultArray = [];

      html = this.eventManager.emitReduce('convertorBeforeHtmlToMarkdownConverted', html);
      html = this._appendAttributeForLinkIfNeed(html);
      html = this._appendAttributeForBrIfNeed(html);

      var markdown = (0, _toMark2.default)(html, toMarkOptions);

      markdown = this.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', markdown);
      markdown = this._removeNewlinesBeforeAfterAndBlockElement(markdown);

      _tuiCodeSnippet2.default.forEach(markdown.split('\n'), function (line, index) {
        var FIND_TABLE_RX = /^(<br>)+\||\|[^|]*\|/ig;
        var FIND_CODE_RX = /`[^`]*<br>[^`]*`/ig;
        var FIND_BRS_BEFORE_TABLE = /^(<br>)+\|/ig;

        if (FIND_TABLE_RX.test(line)) {
          line = line.replace(FIND_BRS_BEFORE_TABLE, function (match) {
            return match.replace(/<br>/ig, '<br>\n');
          });
        } else if (!FIND_CODE_RX.test(line)) {
          line = line.replace(/<br>/ig, '<br>\n');
        }
        resultArray[index] = line;
      });

      return resultArray.join('\n');
    }
  }, {
    key: '_removeNewlinesBeforeAfterAndBlockElement',
    value: function _removeNewlinesBeforeAfterAndBlockElement(markdown) {
      // Newlines('\n\n') are created on to-mark.
      var NEWLINES_BEFORE_BLOCK_RX = /<br>\n\n(#{1,6} .*|```|\||(\*+|-+|\d+\.) .*| *>[^\n]+.*)/g;
      var NEWLINES_AFTER_BLOCK_RX = /(#{1,6} .*|```|\|)\n\n<br>/g;

      markdown = markdown.replace(NEWLINES_BEFORE_BLOCK_RX, '<br>$1');
      markdown = markdown.replace(NEWLINES_AFTER_BLOCK_RX, '$1\n<br>');

      return markdown;
    }
  }, {
    key: '_appendAttributeForLinkIfNeed',
    value: function _appendAttributeForLinkIfNeed(html) {
      var LINK_RX = /!?\[.*\]\(<\s*a[^>]*>(.*?)<\s*\/\s*a>\)/ig;

      return html.replace(LINK_RX, function (match) {
        return match.replace(/<a /ig, '<a data-tomark-pass="" ');
      });
    }
  }, {
    key: '_appendAttributeForBrIfNeed',
    value: function _appendAttributeForBrIfNeed(html) {
      var FIND_BR_RX = /<br>/ig;
      var FIND_DOUBLE_BR_RX = /<br \/><br \/>/ig;
      var FIND_PASSING_AND_NORMAL_BR_RX = /<br data-tomark-pass \/><br \/>(.)/ig;
      var FIRST_TWO_BRS_BEFORE_RX = /([^>]|<\/a>|<\/code>|<\/span>|<\/b>|<\/i>|<\/s>|<img [^>]*>)/;
      var TWO_BRS_RX = /<br data-tomark-pass \/><br data-tomark-pass \/>/;
      var FIND_FIRST_TWO_BRS_RX = new RegExp(FIRST_TWO_BRS_BEFORE_RX.source + TWO_BRS_RX.source, 'g');
      var FIND_ATTRI_WITH_EMTPY_STR_RX = /<br data-tomark-pass="">/ig;

      html = html.replace(FIND_BR_RX, '<br />');

      html = html.replace(FIND_DOUBLE_BR_RX, '<br data-tomark-pass /><br data-tomark-pass />');
      html = html.replace(FIND_ATTRI_WITH_EMTPY_STR_RX, '<br data-tomark-pass />');

      html = html.replace(FIND_PASSING_AND_NORMAL_BR_RX, '<br data-tomark-pass /><br data-tomark-pass />$1');
      html = html.replace(FIND_FIRST_TWO_BRS_RX, '$1<br /><br />');

      // Preserve <br> when there is only one empty line before or after a block element.
      html = html.replace(/(.)<br \/><br \/>(<h[1-6]>|<pre>|<table>|<ul>|<ol>|<blockquote>)/g, '$1<br /><br data-tomark-pass />$2');
      html = html.replace(/(<\/h[1-6]>|<\/pre>|<\/table>|<\/ul>|<\/ol>|<\/blockquote>)<br \/>(.)/g, '$1<br data-tomark-pass />$2');

      return html;
    }

    /**
     * get markdownit with code highlight
     * @returns {markdownit} - markdownit instance
     * @static
     */

  }], [{
    key: 'getMarkdownitHighlightRenderer',
    value: function getMarkdownitHighlightRenderer() {
      return markdownitHighlight;
    }

    /**
     * get markdownit
     * @returns {markdownit} - markdownit instance
     * @static
     */

  }, {
    key: 'getMarkdownitRenderer',
    value: function getMarkdownitRenderer() {
      return markdownit;
    }
  }]);

  return Convertor;
}();

exports.default = Convertor;

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__39__;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Implements htmlSanitizer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var HTML_ATTR_LIST_RX = new RegExp('^(abbr|align|alt|axis|bgcolor|border|cellpadding|cellspacing|class|clear|' + 'color|cols|compact|coords|dir|face|headers|height|hreflang|hspace|' + 'ismap|lang|language|nohref|nowrap|rel|rev|rows|rules|' + 'scope|scrolling|shape|size|span|start|summary|tabindex|target|title|type|' + 'valign|value|vspace|width|checked|mathvariant|encoding|id|name|' + 'background|cite|href|longdesc|src|usemap|xlink:href|data-+|checked|style)', 'g');

var SVG_ATTR_LIST_RX = new RegExp('^(accent-height|accumulate|additive|alphabetic|arabic-form|ascent|' + 'baseProfile|bbox|begin|by|calcMode|cap-height|class|color|color-rendering|content|' + 'cx|cy|d|dx|dy|descent|display|dur|end|fill|fill-rule|font-family|font-size|font-stretch|' + 'font-style|font-variant|font-weight|from|fx|fy|g1|g2|glyph-name|gradientUnits|hanging|' + 'height|horiz-adv-x|horiz-origin-x|ideographic|k|keyPoints|keySplines|keyTimes|lang|' + 'marker-end|marker-mid|marker-start|markerHeight|markerUnits|markerWidth|mathematical|' + 'max|min|offset|opacity|orient|origin|overline-position|overline-thickness|panose-1|' + 'path|pathLength|points|preserveAspectRatio|r|refX|refY|repeatCount|repeatDur|' + 'requiredExtensions|requiredFeatures|restart|rotate|rx|ry|slope|stemh|stemv|stop-color|' + 'stop-opacity|strikethrough-position|strikethrough-thickness|stroke|stroke-dasharray|' + 'stroke-dashoffset|stroke-linecap|stroke-linejoin|stroke-miterlimit|stroke-opacity|' + 'stroke-width|systemLanguage|target|text-anchor|to|transform|type|u1|u2|underline-position|' + 'underline-thickness|unicode|unicode-range|units-per-em|values|version|viewBox|visibility|' + 'width|widths|x|x-height|x1|x2|xlink:actuate|xlink:arcrole|xlink:role|xlink:show|xlink:title|' + 'xlink:type|xml:base|xml:lang|xml:space|xmlns|xmlns:xlink|y|y1|y2|zoomAndPan)', 'g');

var ATTR_VALUE_BLACK_LIST_RX = {
  'href': /^(javascript:).*/g
};

/**
 * htmlSanitizer
 * @param {string|Node} html html or Node
 * @param {boolean} [needHtmlText] pass true if need html text
 * @returns {string|DocumentFragment} result
 * @ignore
 */
function htmlSanitizer(html, needHtmlText) {
  var $html = (0, _jquery2.default)('<div />');

  html = html.replace(/<!--[\s\S]*?-->/g, '');

  $html.append(html);

  removeUnnecessaryTags($html);
  leaveOnlyWhitelistAttribute($html);
  removeInvalidAttributeValues($html);

  return finalizeHtml($html, needHtmlText);
}

/**
 * Remove unnecessary tags
 * @private
 * @param {jQuery} $html jQuery instance
 */
function removeUnnecessaryTags($html) {
  $html.find('script, iframe, textarea, form, button, select, meta, style, link, title, embed, object, details, summary').remove();
}

/**
 * Leave only white list attributes
 * @private
 * @param {jQuery} $html jQuery instance
 */
function leaveOnlyWhitelistAttribute($html) {
  $html.find('*').each(function (index, node) {
    var attrs = node.attributes;
    var blacklist = _tuiCodeSnippet2.default.toArray(attrs).filter(function (attr) {
      var isHTMLAttr = attr.name.match(HTML_ATTR_LIST_RX);
      var isSVGAttr = attr.name.match(SVG_ATTR_LIST_RX);

      return !isHTMLAttr && !isSVGAttr;
    });

    _tuiCodeSnippet2.default.forEachArray(blacklist, function (attr) {
      // Edge svg attribute name returns uppercase bug. error guard.
      // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5579311/
      if (attrs.getNamedItem(attr.name)) {
        attrs.removeNamedItem(attr.name);
      }
    });
  });
}

/**
 * Remove invalid attribute values
 * @private
 * @param {jQuery} $html jQuery instance
 */
function removeInvalidAttributeValues($html) {
  var _loop = function _loop(attr) {
    if (ATTR_VALUE_BLACK_LIST_RX.hasOwnProperty(attr)) {
      $html.find('[' + attr + ']').each(function (index, node) {
        var attrs = node.attributes;
        var valueBlackListRX = ATTR_VALUE_BLACK_LIST_RX[attr];
        var attrItem = attrs.getNamedItem(attr);
        if (valueBlackListRX && attrItem && attrItem.value.toLowerCase().match(valueBlackListRX)) {
          attrs.removeNamedItem(attr);
        }
      });
    }
  };

  for (var attr in ATTR_VALUE_BLACK_LIST_RX) {
    _loop(attr);
  }
}

/**
 * Finalize html result
 * @private
 * @param {jQuery} $html jQuery instance
 * @param {boolean} needHtmlText pass true if need html text
 * @returns {string|DocumentFragment} result
 */
function finalizeHtml($html, needHtmlText) {
  var returnValue = void 0;

  if (needHtmlText) {
    returnValue = $html[0].innerHTML;
  } else {
    var frag = document.createDocumentFragment();
    var childNodes = _tuiCodeSnippet2.default.toArray($html[0].childNodes);
    var length = childNodes.length;


    for (var i = 0; i < length; i += 1) {
      frag.appendChild(childNodes[i]);
    }
    returnValue = frag;
  }

  return returnValue;
}

exports.default = htmlSanitizer;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2016, Revin Guillen.
// Distributed under an MIT license: https://github.com/revin/markdown-it-task-lists/

/**
 * @fileoverview Implements markdownitTaskPlugin
 * @modifier Sungho Kim(sungho-kim@nhn.com) FE Development Lab/NHN
 * @modifier Junghwan Park(junghwan.park@nhn.com) FE Development Lab/NHN
 */
/* eslint-disable */

/**
 * Task list renderer for Markdown-it
 * @param {object} markdownit Markdown-it instance
 * @ignore
 */
var MarkdownitTaskRenderer = function MarkdownitTaskRenderer(markdownit) {
    markdownit.core.ruler.after('inline', 'tui-task-list', function (state) {
        var TASK_LIST_ITEM_CLASS_NAME = 'task-list-item';
        var CHECKED_CLASS_NAME = 'checked';
        var tokens = state.tokens;
        var className;
        var tokenIndex;

        // tokenIndex=0 'ul', tokenIndex=1 'li', tokenIndex=2 'p_open'
        for (tokenIndex = 2; tokenIndex < tokens.length; tokenIndex += 1) {
            if (isTaskListItemToken(tokens, tokenIndex)) {
                if (isChecked(tokens[tokenIndex])) {
                    className = TASK_LIST_ITEM_CLASS_NAME + ' ' + CHECKED_CLASS_NAME;
                } else {
                    className = TASK_LIST_ITEM_CLASS_NAME;
                }

                removeMarkdownTaskFormatText(tokens[tokenIndex]);

                setTokenAttribute(tokens[tokenIndex - 2], 'class', className);
                setTokenAttribute(tokens[tokenIndex - 2], 'data-te-task', '');
            }
        }
    });
};

/**
 * Remove task format text for rendering
 * @param {object} token Token object
 * @ignore
 */
function removeMarkdownTaskFormatText(token) {
    // '[X] ' length is 4
    // FIXED: we don't need first space
    token.content = token.content.slice(4);
    token.children[0].content = token.children[0].content.slice(4);
}

/**
 * Return boolean value whether task checked or not
 * @param {object} token Token object
 * @returns {boolean}
 * @ignore
 */
function isChecked(token) {
    var checked = false;

    if (token.content.indexOf('[x]') === 0 || token.content.indexOf('[X]') === 0) {
        checked = true;
    }

    return checked;
}

/**
 * Set attribute of passed token
 * @param {object} token Token object
 * @param {string} attributeName Attribute name for set
 * @param {string} attributeValue Attribute value for set
 * @ignore
 */
function setTokenAttribute(token, attributeName, attributeValue) {
    var index = token.attrIndex(attributeName);
    var attr = [attributeName, attributeValue];

    if (index < 0) {
        token.attrPush(attr);
    } else {
        token.attrs[index] = attr;
    }
}

/**
 * Return boolean value whether task list item or not
 * @param {array} tokens Token object
 * @param {number} index Number of token index
 * @returns {boolean}
 * @ignore
 */
function isTaskListItemToken(tokens, index) {
    return tokens[index].type === 'inline' && tokens[index - 1].type === 'paragraph_open' && tokens[index - 2].type === 'list_item_open' && (tokens[index].content.indexOf('[ ]') === 0 || tokens[index].content.indexOf('[x]') === 0 || tokens[index].content.indexOf('[X]') === 0);
}
/* eslint-enable */

module.exports = MarkdownitTaskRenderer;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2016, Revin Guillen.
// Distributed under an MIT license: https://github.com/revin/markdown-it-task-lists/
/* eslint-disable */
/**
 * @fileoverview Implements markdownitCodeBlockPlugin
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Code block renderer for Markdown-it
 * @param {object} markdownit Markdown-it instance
 * @ignore
 */
var MarkdownitCodeBlockRenderer = function MarkdownitCodeBlockRenderer(markdownit) {
    markdownit.core.ruler.after('block', 'tui-code-block', function (state) {
        var DEFAULT_NUMBER_OF_BACKTICKS = 3;
        var tokens = state.tokens;
        var currentToken, tokenIndex, numberOfBackticks;

        for (tokenIndex = 0; tokenIndex < tokens.length; tokenIndex += 1) {
            currentToken = tokens[tokenIndex];

            if (isCodeFenceToken(currentToken)) {
                numberOfBackticks = currentToken.markup.length;
                if (numberOfBackticks > DEFAULT_NUMBER_OF_BACKTICKS) {
                    setTokenAttribute(currentToken, 'data-backticks', numberOfBackticks, true);
                }
                if (currentToken.info) {
                    setTokenAttribute(currentToken, 'data-language', escape(currentToken.info.replace(' ', ''), true));
                }
            }
        }
    });
};

/**
 * Set attribute of passed token
 * @param {object} token Token object
 * @param {string} attributeName Attribute name for set
 * @param {string} attributeValue Attribute value for set
 * @ignore
 */
function setTokenAttribute(token, attributeName, attributeValue) {
    var index = token.attrIndex(attributeName);
    var attr = [attributeName, attributeValue];

    if (index < 0) {
        token.attrPush(attr);
    } else {
        token.attrs[index] = attr;
    }
}
/**
 * Return boolean value whether passed token is code fence or not
 * @param {object} token Token object
 * @returns {boolean}
 * @ignore
 */
function isCodeFenceToken(token) {
    return token.block === true && token.tag === 'code' && token.type === 'fence';
}

/**
 * escape code from markdown-it
 * @param {string} html HTML string
 * @param {string} encode Boolean value of whether encode or not
 * @returns {string}
 * @ignore
 */
function escape(html, encode) {
    return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
/* eslint-enable */

module.exports = MarkdownitCodeBlockRenderer;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under an ISC license: https://github.com/markdown-it/markdown-it/
/**
 * @fileoverview Implements MarkdownItCodeRenderer
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */

/* eslint-disable */
module.exports = function code(state, startLine, endLine /*, silent*/) {
    // Added by Junghwan Park
    var FIND_LIST_RX = / {0,3}(?:-|\*|\d\.) /;
    var lines = state.src.split('\n');
    var currentLine = lines[startLine];
    // Added by Junghwan Park

    var nextLine,
        last,
        token,
        emptyLines = 0;

    // Add condition by Junghwan Park
    if (currentLine.match(FIND_LIST_RX) || state.sCount[startLine] - state.blkIndent < 4) {
        // Add condition by Junghwan Park
        return false;
    }

    last = nextLine = startLine + 1;

    while (nextLine < endLine) {
        if (state.isEmpty(nextLine)) {
            emptyLines++;

            // workaround for lists: 2 blank lines should terminate indented
            // code block, but not fenced code block
            if (emptyLines >= 2 && state.parentType === 'list') {
                break;
            }

            nextLine++;
            continue;
        }

        emptyLines = 0;

        if (state.sCount[nextLine] - state.blkIndent >= 4) {
            nextLine++;
            last = nextLine;
            continue;
        }
        break;
    }

    state.line = last;

    token = state.push('code_block', 'code', 0);
    token.content = state.getLines(startLine, last, 4 + state.blkIndent, true);
    token.map = [startLine, state.line];

    return true;
};
/* eslint-enable */

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under MIT license: https://github.com/markdown-it/markdown-it/
/**
 * @fileoverview Implements markdownitCodeBlockQuoteRenderer
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */

/* eslint-disable */

// Block quotes



// prevent quote, pre in list #811
// ref: #989
// #811 START
// var isSpace = require('../common/utils').isSpace;

function isSpace(code) {
  switch (code) {
    case 0x09:
    case 0x20:
      return true;
  }
  return false;
}
// #811 END

module.exports = function blockquote(state, startLine, endLine, silent) {
  var adjustTab,
      ch,
      i,
      initial,
      l,
      lastLineEmpty,
      lines,
      nextLine,
      offset,
      oldBMarks,
      oldBSCount,
      oldIndent,
      oldParentType,
      oldSCount,
      oldTShift,
      spaceAfterMarker,
      terminate,
      terminatorRules,
      token,
      wasOutdented,
      oldLineMax = state.lineMax,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  // #811 START
  var FIND_LIST_RX = /(?:-|\*|\d+\.) {1,4}(?:> {0,3})[^>]*$/;
  var sourceLines = state.src.split('\n');
  var currentLine = sourceLines[startLine];
  // #811 END

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) {
    return false;
  }

  // check the block quote marker
  if (state.src.charCodeAt(pos++) !== 0x3E /* > */) {
      return false;
    }
  // #811 START
  // check block quote in list
  if (currentLine.match(FIND_LIST_RX) /*&& !currentLine.match(/^ {0,6}>/)*/) {
      return false;
    }
  // #811 END

  // we know that it's going to be a valid blockquote,
  // so no point trying to find the end of it in silent mode
  if (silent) {
    return true;
  }

  // skip spaces after ">" and re-calculate offset
  initial = offset = state.sCount[startLine] + pos - (state.bMarks[startLine] + state.tShift[startLine]);

  // skip one optional space after '>'
  if (state.src.charCodeAt(pos) === 0x20 /* space */) {
      // ' >   test '
      //     ^ -- position start of line here:
      pos++;
      initial++;
      offset++;
      adjustTab = false;
      spaceAfterMarker = true;
    } else if (state.src.charCodeAt(pos) === 0x09 /* tab */) {
      spaceAfterMarker = true;

      if ((state.bsCount[startLine] + offset) % 4 === 3) {
        // '  >\t  test '
        //       ^ -- position start of line here (tab has width===1)
        pos++;
        initial++;
        offset++;
        adjustTab = false;
      } else {
        // ' >\t  test '
        //    ^ -- position start of line here + shift bsCount slightly
        //         to make extra space appear
        adjustTab = true;
      }
    } else {
    spaceAfterMarker = false;
  }

  oldBMarks = [state.bMarks[startLine]];
  state.bMarks[startLine] = pos;

  while (pos < max) {
    ch = state.src.charCodeAt(pos);

    if (isSpace(ch)) {
      if (ch === 0x09) {
        offset += 4 - (offset + state.bsCount[startLine] + (adjustTab ? 1 : 0)) % 4;
      } else {
        offset++;
      }
    } else {
      break;
    }

    pos++;
  }

  oldBSCount = [state.bsCount[startLine]];
  state.bsCount[startLine] = state.sCount[startLine] + 1 + (spaceAfterMarker ? 1 : 0);

  lastLineEmpty = pos >= max;

  oldSCount = [state.sCount[startLine]];
  state.sCount[startLine] = offset - initial;

  oldTShift = [state.tShift[startLine]];
  state.tShift[startLine] = pos - state.bMarks[startLine];

  terminatorRules = state.md.block.ruler.getRules('blockquote');

  oldParentType = state.parentType;
  state.parentType = 'blockquote';
  wasOutdented = false;

  // Search the end of the block
  //
  // Block ends with either:
  //  1. an empty line outside:
  //     ```
  //     > test
  //
  //     ```
  //  2. an empty line inside:
  //     ```
  //     >
  //     test
  //     ```
  //  3. another tag:
  //     ```
  //     > test
  //      - - -
  //     ```
  for (nextLine = startLine + 1; nextLine < endLine; nextLine++) {
    // check if it's outdented, i.e. it's inside list item and indented
    // less than said list item:
    //
    // ```
    // 1. anything
    //    > current blockquote
    // 2. checking this line
    // ```
    if (state.sCount[nextLine] < state.blkIndent) wasOutdented = true;

    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos >= max) {
      // Case 1: line is not inside the blockquote, and this line is empty.
      break;
    }

    if (state.src.charCodeAt(pos++) === 0x3E /* > */ && !wasOutdented) {
      // This line is inside the blockquote.

      // skip spaces after ">" and re-calculate offset
      initial = offset = state.sCount[nextLine] + pos - (state.bMarks[nextLine] + state.tShift[nextLine]);

      // skip one optional space after '>'
      if (state.src.charCodeAt(pos) === 0x20 /* space */) {
          // ' >   test '
          //     ^ -- position start of line here:
          pos++;
          initial++;
          offset++;
          adjustTab = false;
          spaceAfterMarker = true;
        } else if (state.src.charCodeAt(pos) === 0x09 /* tab */) {
          spaceAfterMarker = true;

          if ((state.bsCount[nextLine] + offset) % 4 === 3) {
            // '  >\t  test '
            //       ^ -- position start of line here (tab has width===1)
            pos++;
            initial++;
            offset++;
            adjustTab = false;
          } else {
            // ' >\t  test '
            //    ^ -- position start of line here + shift bsCount slightly
            //         to make extra space appear
            adjustTab = true;
          }
        } else {
        spaceAfterMarker = false;
      }

      oldBMarks.push(state.bMarks[nextLine]);
      state.bMarks[nextLine] = pos;

      while (pos < max) {
        ch = state.src.charCodeAt(pos);

        if (isSpace(ch)) {
          if (ch === 0x09) {
            offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
          } else {
            offset++;
          }
        } else {
          break;
        }

        pos++;
      }

      lastLineEmpty = pos >= max;

      oldBSCount.push(state.bsCount[nextLine]);
      state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);

      oldSCount.push(state.sCount[nextLine]);
      state.sCount[nextLine] = offset - initial;

      oldTShift.push(state.tShift[nextLine]);
      state.tShift[nextLine] = pos - state.bMarks[nextLine];
      continue;
    }

    // Case 2: line is not inside the blockquote, and the last line was empty.
    if (lastLineEmpty) {
      break;
    }

    // Case 3: another tag found.
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }

    if (terminate) {
      // Quirk to enforce "hard termination mode" for paragraphs;
      // normally if you call `tokenize(state, startLine, nextLine)`,
      // paragraphs will look below nextLine for paragraph continuation,
      // but if blockquote is terminated by another tag, they shouldn't
      state.lineMax = nextLine;

      if (state.blkIndent !== 0) {
        // state.blkIndent was non-zero, we now set it to zero,
        // so we need to re-calculate all offsets to appear as
        // if indent wasn't changed
        oldBMarks.push(state.bMarks[nextLine]);
        oldBSCount.push(state.bsCount[nextLine]);
        oldTShift.push(state.tShift[nextLine]);
        oldSCount.push(state.sCount[nextLine]);
        state.sCount[nextLine] -= state.blkIndent;
      }

      break;
    }

    oldBMarks.push(state.bMarks[nextLine]);
    oldBSCount.push(state.bsCount[nextLine]);
    oldTShift.push(state.tShift[nextLine]);
    oldSCount.push(state.sCount[nextLine]);

    // A negative indentation means that this is a paragraph continuation
    //
    state.sCount[nextLine] = -1;
  }

  oldIndent = state.blkIndent;
  state.blkIndent = 0;

  token = state.push('blockquote_open', 'blockquote', 1);
  token.markup = '>';
  token.map = lines = [startLine, 0];

  state.md.block.tokenize(state, startLine, nextLine);

  token = state.push('blockquote_close', 'blockquote', -1);
  token.markup = '>';

  state.lineMax = oldLineMax;
  state.parentType = oldParentType;
  lines[1] = state.line;

  // Restore original tShift; this might not be necessary since the parser
  // has already been here, but just to make sure we can do that.
  for (i = 0; i < oldTShift.length; i++) {
    state.bMarks[i + startLine] = oldBMarks[i];
    state.tShift[i + startLine] = oldTShift[i];
    state.sCount[i + startLine] = oldSCount[i];
    state.bsCount[i + startLine] = oldBSCount[i];
  }
  state.blkIndent = oldIndent;

  return true;
};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under an ISC license: https://github.com/markdown-it/markdown-it/

/**
 * @fileoverview Implements markdownitTableRenderer
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */

/*eslint-disable */
function getLine(state, line) {
    var pos = state.bMarks[line] + state.blkIndent,
        max = state.eMarks[line];

    return state.src.substr(pos, max - pos);
}

function escapedSplit(str) {
    var result = [],
        pos = 0,
        max = str.length,
        ch,
        escapes = 0,
        lastPos = 0,
        backTicked = false,
        lastBackTick = 0;

    ch = str.charCodeAt(pos);

    while (pos < max) {
        if (ch === 0x60 /* ` */ && escapes % 2 === 0) {
            backTicked = !backTicked;
            lastBackTick = pos;
        } else if (ch === 0x7c /* | */ && escapes % 2 === 0 && !backTicked) {
            result.push(str.substring(lastPos, pos));
            lastPos = pos + 1;
        } else if (ch === 0x5c /* \ */) {
                escapes += 1;
            } else {
            escapes = 0;
        }

        pos += 1;

        // If there was an un-closed backtick, go back to just after
        // the last backtick, but as if it was a normal character
        if (pos === max && backTicked) {
            backTicked = false;
            pos = lastBackTick + 1;
        }

        ch = str.charCodeAt(pos);
    }

    result.push(str.substring(lastPos));

    return result;
}

module.exports = function table(state, startLine, endLine, silent) {
    var ch, lineText, pos, i, nextLine, columns, columnCount, token, aligns, alignCount, t, tableLines, tbodyLines;

    // should have at least three lines
    if (startLine + 2 > endLine) {
        return false;
    }

    nextLine = startLine + 1;

    if (state.sCount[nextLine] < state.blkIndent) {
        return false;
    }

    // first character of the second line should be '|' or '-'

    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    if (pos >= state.eMarks[nextLine]) {
        return false;
    }

    ch = state.src.charCodeAt(pos);
    if (ch !== 0x7C /* | */ && ch !== 0x2D /* - */ && ch !== 0x3A /* : */) {
            return false;
        }

    lineText = getLine(state, startLine + 1);
    if (!/^[-:| ]+$/.test(lineText)) {
        return false;
    }

    columns = lineText.split('|');
    aligns = [];
    for (i = 0; i < columns.length; i += 1) {
        t = columns[i].trim();
        if (!t) {
            // allow empty columns before and after table, but not in between columns;
            // e.g. allow ` |---| `, disallow ` ---||--- `
            if (i === 0 || i === columns.length - 1) {
                continue;
            } else {
                return false;
            }
        }

        if (!/^:?-+:?$/.test(t)) {
            return false;
        }
        if (t.charCodeAt(t.length - 1) === 0x3A /* : */) {
                aligns.push(t.charCodeAt(0) === 0x3A /* : */ ? 'center' : 'right');
            } else if (t.charCodeAt(0) === 0x3A /* : */) {
                aligns.push('left');
            } else {
            aligns.push('');
        }
    }
    alignCount = aligns.length;

    lineText = getLine(state, startLine).trim();
    if (lineText.indexOf('|') === -1) {
        return false;
    }
    columns = escapedSplit(lineText.replace(/^\||\|$/g, ''));

    // header row will define an amount of columns in the entire table,
    // and align row shouldn't be smaller than that (the rest of the rows can)
    columnCount = columns.length;
    if (columnCount > alignCount) {
        return false;
    } else if (columnCount < alignCount) {
        for (i = 0; i < alignCount - columnCount; i += 1) {
            columns.push('');
        }
        columnCount = columns.length;
    }

    if (silent) {
        return true;
    }

    token = state.push('table_open', 'table', 1);
    token.map = tableLines = [startLine, 0];

    token = state.push('thead_open', 'thead', 1);
    token.map = [startLine, startLine + 1];

    token = state.push('tr_open', 'tr', 1);
    token.map = [startLine, startLine + 1];

    for (i = 0; i < columnCount; i += 1) {
        token = state.push('th_open', 'th', 1);
        token.map = [startLine, startLine + 1];
        if (aligns[i]) {
            // FIXED: change property style to align
            token.attrs = [['align', aligns[i]]];
        }

        token = state.push('inline', '', 0);
        token.content = columns[i].trim();
        token.map = [startLine, startLine + 1];
        token.children = [];

        token = state.push('th_close', 'th', -1);
    }

    token = state.push('tr_close', 'tr', -1);
    token = state.push('thead_close', 'thead', -1);

    token = state.push('tbody_open', 'tbody', 1);
    token.map = tbodyLines = [startLine + 2, 0];

    for (nextLine = startLine + 2; nextLine < endLine; nextLine += 1) {
        if (state.sCount[nextLine] < state.blkIndent) {
            break;
        }

        lineText = getLine(state, nextLine);
        if (lineText.indexOf('|') === -1) {
            break;
        }

        // keep spaces at beginning of line to indicate an empty first cell, but
        // strip trailing whitespace
        columns = escapedSplit(lineText.replace(/^\||\|\s*$/g, ''));

        token = state.push('tr_open', 'tr', 1);
        for (i = 0; i < columnCount; i += 1) {
            token = state.push('td_open', 'td', 1);
            if (aligns[i]) {
                // FIXED: change property style to align
                token.attrs = [['align', aligns[i]]];
            }

            token = state.push('inline', '', 0);
            token.content = columns[i] ? columns[i].trim() : '';
            token.children = [];

            token = state.push('td_close', 'td', -1);
        }
        token = state.push('tr_close', 'tr', -1);
    }
    token = state.push('tbody_close', 'tbody', -1);
    token = state.push('table_close', 'table', -1);

    tableLines[1] = tbodyLines[1] = nextLine;
    state.line = nextLine;
    return true;
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under an ISC license: https://github.com/markdown-it/markdown-it/

/**
 * @fileoverview Implements markdownitHtmlBlockRenderer
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */
/* eslint-disable */
// HTML block



// An array of opening and corresponding closing sequences for html tags,
// last argument defines whether it can terminate a paragraph or not
//

// void tag names --- Added by Junghwan Park

var voidTagNames = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
var HTML_SEQUENCES = [[/^<(script|pre|style)(?=(\s|>|$))/i, /<\/(script|pre|style)>/i, true], [/^<!--/, /-->/, true], [/^<\?/, /\?>/, true], [/^<![A-Z]/, />/, true], [/^<!\[CDATA\[/, /\]\]>/, true], [new RegExp('^<(' + voidTagNames.join('|') + ')', 'i'), /^\/?>$/, true], [new RegExp('^</?(address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|pre|section|source|title|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?=(\\s|/?>|$))', 'i'), /^$/, true], [/^(?:<[A-Za-z][A-Za-z0-9\-]*(?:\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\s*=\s*(?:[^"'=<>`\x00-\x20]+|'[^']*'|"[^"]*"))?)*\s*\/?>|<\/[A-Za-z][A-Za-z0-9\-]*\s*>)\s*$/, /^$/, false]];

module.exports = function html_block(state, startLine, endLine, silent) {
    var i,
        nextLine,
        token,
        lineText,
        pos = state.bMarks[startLine] + state.tShift[startLine],
        max = state.eMarks[startLine];

    if (!state.md.options.html) {
        return false;
    }

    if (state.src.charCodeAt(pos) !== 0x3C /* < */) {
            return false;
        }

    lineText = state.src.slice(pos, max);

    for (i = 0; i < HTML_SEQUENCES.length; i++) {
        if (HTML_SEQUENCES[i][0].test(lineText)) {
            // add condition for return when meet void element --- Added by Junghwan Park
            if (i === 5) {
                return false;
            } else {
                break;
            }
        }
    }

    if (i === HTML_SEQUENCES.length) {
        return false;
    }

    if (silent) {
        // true if this sequence can be a terminator, false otherwise
        return HTML_SEQUENCES[i][2];
    }

    nextLine = startLine + 1;

    // If we are here - we detected HTML block.
    // Let's roll down till block end.
    if (!HTML_SEQUENCES[i][1].test(lineText)) {
        for (; nextLine < endLine; nextLine++) {
            if (state.sCount[nextLine] < state.blkIndent) {
                break;
            }

            pos = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];
            lineText = state.src.slice(pos, max);

            if (HTML_SEQUENCES[i][1].test(lineText)) {
                if (lineText.length !== 0) {
                    nextLine++;
                }
                break;
            }
        }
    }

    state.line = nextLine;

    token = state.push('html_block', '', 0);
    token.map = [startLine, nextLine];
    token.content = state.getLines(startLine, nextLine, state.blkIndent, true);

    return true;
};
/* eslint-enable */

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under MIT license: https://github.com/markdown-it/markdown-it/
/**
 * @fileoverview Implements markdownitBackticksRenderer
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */
/* eslint-disable */

// Parse backticks
module.exports = function backtick(state, silent) {
  var start,
      max,
      marker,
      matchStart,
      matchEnd,
      token,
      pos = state.pos,
      ch = state.src.charCodeAt(pos);

  if (ch !== 0x60 /* ` */) {
      return false;
    }

  start = pos;
  pos++;
  max = state.posMax;

  while (pos < max && state.src.charCodeAt(pos) === 0x60 /* ` */) {
    pos++;
  }

  marker = state.src.slice(start, pos);

  matchStart = matchEnd = pos;

  while ((matchStart = state.src.indexOf('`', matchEnd)) !== -1) {
    matchEnd = matchStart + 1;

    while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x60 /* ` */) {
      matchEnd++;
    }

    if (matchEnd - matchStart === marker.length) {
      if (!silent) {
        token = state.push('code_inline', 'code', 0);
        token.markup = marker;
        token.content = state.src.slice(pos, matchStart).replace(/[ \n]+/g, ' ').trim();
        // TUI.EDITOR MODIFICATION START
        // store number of backtick in data-backtick
        // https://github.nhn.com/fe/tui.editor/pull/981
        token.attrSet('data-backticks', token.markup.length);
        // TUI.EDITOR MODIFICATION END
      }
      state.pos = matchEnd;
      return true;
    }
  }

  if (!silent) {
    state.pending += marker;
  }
  state.pos += marker.length;
  return true;
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// Copyright (c) 2014, Vitaly Puzrin.
// Distributed under an MIT license: https://github.com/markdown-it/markdown-it-for-inline
/* eslint-disable */

/**
 * @fileoverview Implements markdownItLinkPlugin
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */

function for_inline_plugin(md, ruleName, tokenType, iteartor) {

  function scan(state) {
    var i, blkIdx, inlineTokens;

    for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
      if (state.tokens[blkIdx].type !== 'inline') {
        continue;
      }

      inlineTokens = state.tokens[blkIdx].children;

      for (i = inlineTokens.length - 1; i >= 0; i--) {
        if (inlineTokens[i].type !== tokenType) {
          continue;
        }

        iteartor(inlineTokens, i);
      }
    }
  }

  md.core.ruler.push(ruleName, scan);
};

var linkAttribute = exports.linkAttribute = function linkAttribute(markdownit, iteartor) {
  for_inline_plugin(markdownit, 'url_attribute', 'link_open', iteartor);
};

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__49__;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview DOM Utils
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var FIND_ZWB = /\u200B/g;

/**
 * Check if node is text node
 * @param {Node} node node to check
 * @returns {boolean} result
 * @ignore
 */
var isTextNode = function isTextNode(node) {
  return node && node.nodeType === Node.TEXT_NODE;
};

/**
 * Check if node is element node
 * @param {Node} node node to check
 * @returns {boolean} result
 * @ignore
 */
var isElemNode = function isElemNode(node) {
  return node && node.nodeType === Node.ELEMENT_NODE;
};

/**
 * Check that the node is block node
 * @param {Node} node node
 * @returns {boolean}
 * @ignore
 */
var isBlockNode = function isBlockNode(node) {
  return (/^(ADDRESS|ARTICLE|ASIDE|BLOCKQUOTE|DETAILS|DIALOG|DD|DIV|DL|DT|FIELDSET|FIGCAPTION|FIGURE|FOOTER|FORM|H[\d]|HEADER|HGROUP|HR|LI|MAIN|NAV|OL|P|PRE|SECTION|UL)$/ig.test(this.getNodeName(node))
  );
};

/**
 * Get node name of node
 * @param {Node} node node
 * @returns {string} node name
 * @ignore
 */
var getNodeName = function getNodeName(node) {
  if (isElemNode(node)) {
    return node.tagName;
  }

  return 'TEXT';
};

/**
 * Get node offset length of node(for Range API)
 * @param {Node} node node
 * @returns {number} length
 * @ignore
 */
var getTextLength = function getTextLength(node) {
  var len = void 0;

  if (isElemNode(node)) {
    len = node.textContent.replace(FIND_ZWB, '').length;
  } else if (isTextNode(node)) {
    len = node.nodeValue.replace(FIND_ZWB, '').length;
  }

  return len;
};

/**
 * Get node offset length of node(for Range API)
 * @param {Node} node node
 * @returns {number} length
 * @ignore
 */
var getOffsetLength = function getOffsetLength(node) {
  var len = void 0;

  if (isElemNode(node)) {
    len = node.childNodes.length;
  } else if (isTextNode(node)) {
    len = node.nodeValue.replace(FIND_ZWB, '').length;
  }

  return len;
};

/**
 * get node offset between parent's childnodes
 * @param {Node} node node
 * @returns {number} offset(index)
 * @ignore
 */
var getNodeOffsetOfParent = function getNodeOffsetOfParent(node) {
  var childNodesOfParent = node.parentNode.childNodes;
  var i = void 0,
      t = void 0,
      found = void 0;

  for (i = 0, t = childNodesOfParent.length; i < t; i += 1) {
    if (childNodesOfParent[i] === node) {
      found = i;
      break;
    }
  }

  return found;
};

/**
 * get child node by offset
 * @param {Node} node node
 * @param {number} index offset index
 * @returns {Node} foudned node
 * @ignore
 */
var getChildNodeByOffset = function getChildNodeByOffset(node, index) {
  var currentNode = void 0;

  if (isTextNode(node)) {
    currentNode = node;
  } else if (node.childNodes.length && index >= 0) {
    currentNode = node.childNodes[index];
  }

  return currentNode;
};

/**
 * find next node from passed node
 * @param {strong} direction previous or next
 * @param {Node} node node
 * @param {string} untilNodeName parent node name to limit
 * @returns {Node} founded node
 * @ignore
 */
var getNodeWithDirectionUntil = function getNodeWithDirectionUntil(direction, node, untilNodeName) {
  var directionKey = direction + 'Sibling';
  var nodeName = void 0,
      foundedNode = void 0;

  while (node && !node[directionKey]) {
    nodeName = getNodeName(node.parentNode);

    if (nodeName === untilNodeName || nodeName === 'BODY') {
      break;
    }

    node = node.parentNode;
  }

  if (node[directionKey]) {
    foundedNode = node[directionKey];
  }

  return foundedNode;
};

/**
 * get prev node of childnode pointed with index
 * @param {Node} node node
 * @param {number} index offset index
 * @param {string} untilNodeName parent node name to limit
 * @returns {Node} founded node
 * @ignore
 */
var getPrevOffsetNodeUntil = function getPrevOffsetNodeUntil(node, index, untilNodeName) {
  var prevNode = void 0;

  if (index > 0) {
    prevNode = getChildNodeByOffset(node, index - 1);
  } else {
    prevNode = getNodeWithDirectionUntil('previous', node, untilNodeName);
  }

  return prevNode;
};

var getParentUntilBy = function getParentUntilBy(node, matchCondition, stopCondition) {
  var foundedNode = void 0;

  while (node.parentNode && !matchCondition(node.parentNode)) {
    node = node.parentNode;

    if (stopCondition && stopCondition(node.parentNode)) {
      break;
    }
  }

  if (matchCondition(node.parentNode)) {
    foundedNode = node;
  }

  return foundedNode;
};

/**
 * get parent node until paseed node name
 * @param {Node} node node
 * @param {string|HTMLNode} untilNode node name or node to limit
 * @returns {Node} founded node
 * @ignore
 */
var getParentUntil = function getParentUntil(node, untilNode) {
  var foundedNode = void 0;

  if (_tuiCodeSnippet2.default.isString(untilNode)) {
    foundedNode = getParentUntilBy(node, function (targetNode) {
      return untilNode === getNodeName(targetNode);
    });
  } else {
    foundedNode = getParentUntilBy(node, function (targetNode) {
      return untilNode === targetNode;
    });
  }

  return foundedNode;
};

/**
 * get node on the given direction under given parent
 * @param {strong} direction previous or next
 * @param {Node} node node
 * @param {string|Node} underNode parent node name to limit
 * @returns {Node} founded node
 * @ignore
 */
var getNodeWithDirectionUnderParent = function getNodeWithDirectionUnderParent(direction, node, underNode) {
  var directionKey = direction + 'Sibling';
  var foundedNode = void 0;

  node = getParentUntil(node, underNode);

  if (node && node[directionKey]) {
    foundedNode = node[directionKey];
  }

  return foundedNode;
};

/**
 * get top previous top level node under given node
 * @param {Node} node node
 * @param {Node} underNode underNode
 * @returns {Node} founded node
 * @ignore
 */
var getTopPrevNodeUnder = function getTopPrevNodeUnder(node, underNode) {
  return getNodeWithDirectionUnderParent('previous', node, underNode);
};

/**
 * get next top level block node
 * @param {Node} node node
 * @param {Node} underNode underNode
 * @returns {Node} founded node
 * @ignore
 */
var getTopNextNodeUnder = function getTopNextNodeUnder(node, underNode) {
  return getNodeWithDirectionUnderParent('next', node, underNode);
};

/**
 * Get parent element the body element
 * @param {Node} node Node for start searching
 * @returns {Node}
 * @ignore
 */
var getTopBlockNode = function getTopBlockNode(node) {
  return getParentUntil(node, 'BODY');
};

/**
 * Get previous text node
 * @param {Node} node Node for start searching
 * @returns {Node}
 * @ignore
 */
var getPrevTextNode = function getPrevTextNode(node) {
  node = node.previousSibling || node.parentNode;

  while (!isTextNode(node) && getNodeName(node) !== 'BODY') {
    if (node.previousSibling) {
      node = node.previousSibling;

      while (node.lastChild) {
        node = node.lastChild;
      }
    } else {
      node = node.parentNode;
    }
  }

  if (getNodeName(node) === 'BODY') {
    node = null;
  }

  return node;
};

/**
 * test whether root contains the given node
 * @param {HTMLNode} root - root node
 * @param {HTMLNode} node - node to test
 * @returns {Boolean} true if root contains node
 * @ignore
 */
var containsNode = function containsNode(root, node) {
  var walker = document.createTreeWalker(root, 4, null, false);
  var found = root === node;

  while (!found && walker.nextNode()) {
    found = walker.currentNode === node;
  }

  return found;
};

/**
 * find node by offset
 * @param {HTMLElement} root Root element
 * @param {Array.<number>} offsetList offset list
 * @param {function} textNodeFilter Text node filter
 * @returns {Array}
 * @ignore
 */
var findOffsetNode = function findOffsetNode(root, offsetList, textNodeFilter) {
  var result = [];
  var text = '';
  var walkerOffset = 0;
  var newWalkerOffset = void 0;

  if (!offsetList.length) {
    return result;
  }

  var offset = offsetList.shift();
  var walker = document.createTreeWalker(root, 4, null, false);

  while (walker.nextNode()) {
    text = walker.currentNode.nodeValue || '';

    if (textNodeFilter) {
      text = textNodeFilter(text);
    }

    newWalkerOffset = walkerOffset + text.length;

    while (newWalkerOffset >= offset) {
      result.push({
        container: walker.currentNode,
        offsetInContainer: offset - walkerOffset,
        offset: offset
      });

      if (!offsetList.length) {
        return result;
      }
      offset = offsetList.shift();
    }
    walkerOffset = newWalkerOffset;
  }

  // there should be offset left
  do {
    result.push({
      container: walker.currentNode,
      offsetInContainer: text.length,
      offset: offset
    });
    offset = offsetList.shift();
  } while (!_tuiCodeSnippet2.default.isUndefined(offset));

  return result;
};

var getNodeInfo = function getNodeInfo(node) {
  var path = {};

  path.tagName = node.nodeName;

  if (node.id) {
    path.id = node.id;
  }

  var className = node.className.trim();

  if (className) {
    path.className = className;
  }

  return path;
};

var getPath = function getPath(node, root) {
  var paths = [];

  while (node && node !== root) {
    if (isElemNode(node)) {
      paths.unshift(getNodeInfo(node));
    }

    node = node.parentNode;
  }

  return paths;
};

/**
 * Find next, previous TD or TH element by given TE element
 * @param {HTMLElement} node TD element
 * @param {string} direction 'next' or 'previous'
 * @returns {HTMLElement|null}
 * @ignore
 */
var getTableCellByDirection = function getTableCellByDirection(node, direction) {
  var targetElement = null;

  if (!_tuiCodeSnippet2.default.isUndefined(direction) && (direction === 'next' || direction === 'previous')) {
    if (direction === 'next') {
      targetElement = node.nextElementSibling;
    } else {
      targetElement = node.previousElementSibling;
    }
  }

  return targetElement;
};

/**
 * Find sibling TR's TD element by given TD and direction
 * @param {HTMLElement} node TD element
 * @param {string} direction Boolean value for find first TD in next line
 * @param {boolean} [needEdgeCell=false] Boolean value for find first TD in next line
 * @returns {HTMLElement|null}
 * @ignore
 */
var getSiblingRowCellByDirection = function getSiblingRowCellByDirection(node, direction, needEdgeCell) {
  var tableCellElement = null;
  var $node = void 0,
      index = void 0,
      $targetRowElement = void 0,
      $currentContainer = void 0,
      $siblingContainer = void 0,
      isSiblingContainerExists = void 0;

  if (!_tuiCodeSnippet2.default.isUndefined(direction) && (direction === 'next' || direction === 'previous')) {
    if (node) {
      $node = (0, _jquery2.default)(node);

      if (direction === 'next') {
        $targetRowElement = $node.parent().next();
        $currentContainer = $node.parents('thead');
        $siblingContainer = $currentContainer[0] && $currentContainer.next();
        isSiblingContainerExists = $siblingContainer && getNodeName($siblingContainer[0]) === 'TBODY';

        index = 0;
      } else {
        $targetRowElement = $node.parent().prev();
        $currentContainer = $node.parents('tbody');
        $siblingContainer = $currentContainer[0] && $currentContainer.prev();
        isSiblingContainerExists = $siblingContainer && getNodeName($siblingContainer[0]) === 'THEAD';

        index = node.parentNode.childNodes.length - 1;
      }

      if (_tuiCodeSnippet2.default.isUndefined(needEdgeCell) || !needEdgeCell) {
        index = getNodeOffsetOfParent(node);
      }

      if ($targetRowElement[0]) {
        tableCellElement = $targetRowElement.children('td,th')[index];
      } else if ($currentContainer[0] && isSiblingContainerExists) {
        tableCellElement = $siblingContainer.find('td,th')[index];
      }
    }
  }

  return tableCellElement;
};

/**
 * Check that the inline node is supported by markdown
 * @param {Node} node TD element
 * @returns {boolean}
 * @ignore
 */
var isMDSupportInlineNode = function isMDSupportInlineNode(node) {
  return (/^(A|B|BR|CODE|DEL|EM|I|IMG|S|SPAN|STRONG)$/ig.test(node.nodeName)
  );
};

/**
 * Check that node is styled node.
 * Styled node is a node that has text and decorates text.
 * @param {Node} node TD element
 * @returns {boolean}
 * @ignore
 */
var isStyledNode = function isStyledNode(node) {
  return (/^(A|ABBR|ACRONYM|B|BDI|BDO|BIG|CITE|CODE|DEL|DFN|EM|I|INS|KBD|MARK|Q|S|SAMP|SMALL|SPAN|STRONG|SUB|SUP|U|VAR)$/ig.test(node.nodeName)
  );
};

/**
 * remove node from 'start' node to 'end-1' node inside parent
 * if 'end' node is null, remove all child nodes after 'start' node.
 * @param {Node} parent - parent node
 * @param {Node} start - start node to remove
 * @param {Node} end - end node to remove
 * @ignore
 */
var removeChildFromStartToEndNode = function removeChildFromStartToEndNode(parent, start, end) {
  var child = start;

  if (!child || parent !== child.parentNode) {
    return;
  }

  while (child !== end) {
    var next = child.nextSibling;
    parent.removeChild(child);
    child = next;
  }
};

/**
 * remove nodes along the direction from the node to reach targetParent node
 * @param {Node} targetParent - stop removing when reach target parent node
 * @param {Node} node - start node
 * @param {boolean} isForward - direction
 * @ignore
 */
var removeNodesByDirection = function removeNodesByDirection(targetParent, node, isForward) {
  var parent = node;

  while (parent !== targetParent) {
    var nextParent = parent.parentNode;
    var _parent = parent,
        nextSibling = _parent.nextSibling,
        previousSibling = _parent.previousSibling;


    if (!isForward && nextSibling) {
      removeChildFromStartToEndNode(nextParent, nextSibling, null);
    } else if (isForward && previousSibling) {
      removeChildFromStartToEndNode(nextParent, nextParent.childNodes[0], parent);
    }

    parent = nextParent;
  }
};

var getLeafNode = function getLeafNode(node) {
  var result = node;
  while (result.childNodes && result.childNodes.length) {
    var _result = result,
        nextLeaf = _result.firstChild;

    // When inline tag have empty text node with other childnodes, ignore empty text node.

    if (isTextNode(nextLeaf) && !getTextLength(nextLeaf)) {
      result = nextLeaf.nextSibling || nextLeaf;
    } else {
      result = nextLeaf;
    }
  }

  return result;
};
/**
 * check if a coordinates is inside a task box
 * @param {object} style - computed style of task box
 * @param {number} offsetX - event x offset
 * @param {number} offsetY - event y offset
 * @returns {boolean}
 * @ignore
 */
var isInsideTaskBox = function isInsideTaskBox(style, offsetX, offsetY) {
  var rect = {
    left: parseInt(style.left, 10),
    top: parseInt(style.top, 10),
    width: parseInt(style.width, 10),
    height: parseInt(style.height, 10)
  };

  return offsetX >= rect.left && offsetX <= rect.left + rect.width && offsetY >= rect.top && offsetY <= rect.top + rect.height;
};

/**
 * Check whether node is OL or UL
 * @param {node} node - node
 * @returns {boolean} - whether node is OL or UL
 * @ignore
 */
var isListNode = function isListNode(node) {
  if (!node) {
    return false;
  }

  return node.nodeName === 'UL' || node.nodeName === 'OL';
};

/**
 * Check whether node is first list item
 * @param {node} node - node
 * @returns {boolean} whether node is first list item
 * @ignore
 */
var isFirstListItem = function isFirstListItem(node) {
  var nodeName = node.nodeName,
      parentNode = node.parentNode;


  return nodeName === 'LI' && node === parentNode.firstChild;
};

/**
 * Check whether node is first level list item
 * @param {node} node - node
 * @returns {boolean} whether node is first level list item
 * @ignore
 */
var isFirstLevelListItem = function isFirstLevelListItem(node) {
  var nodeName = node.nodeName,
      listNode = node.parentNode;
  var listParentNode = listNode.parentNode;


  return nodeName === 'LI' && !isListNode(listParentNode);
};

/**
 * Merge node to target node and detach node
 * @param {node} node - node
 * @param {node} targetNode - target node
 * @ignore
 */
var mergeNode = function mergeNode(node, targetNode) {
  if (node.hasChildNodes()) {
    _tuiCodeSnippet2.default.forEachArray(node.childNodes, function () {
      targetNode.appendChild(node.firstChild);
    });

    targetNode.normalize();
  }

  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
};

/**
 * Create hr that is not contenteditable
 * @returns {node} hr is wraped div
 * @ignore
 */
var createHorizontalRule = function createHorizontalRule() {
  var div = document.createElement('div');
  var hr = document.createElement('hr');

  div.setAttribute('contenteditable', false);
  hr.setAttribute('contenteditable', false);

  div.appendChild(hr);

  return div;
};

/**
 * Create Empty Line
 * @returns {node} <div><br></div>
 * @private
 */
var createEmptyLine = function createEmptyLine() {
  var div = document.createElement('div');
  div.appendChild(document.createElement('br'));

  return div;
};

/**
 * Find same tagName child node and change wrapping order.
 * For example, if below node need to optimize 'B' tag.
 * <i><s><b>test</b></s></i>
 * should be changed tag's order.
 * <b><i><s>test</s></i></b>
 * @param {node} node
 * @param {string} tagName
 * @returns {node}
 * @private
 */
var changeTagOrder = function changeTagOrder(node, tagName) {
  if (node.nodeName !== 'SPAN') {
    var parentNode = node.parentNode;

    var tempNode = node;

    while (tempNode.childNodes && tempNode.childNodes.length === 1 && !isTextNode(tempNode.firstChild)) {
      tempNode = tempNode.firstChild;

      if (tempNode.nodeName === 'SPAN') {
        break;
      }

      if (tempNode.nodeName === tagName) {
        var wrapper = document.createElement(tagName);

        mergeNode(tempNode, tempNode.parentNode);
        parentNode.replaceChild(wrapper, node);
        wrapper.appendChild(node);

        return wrapper;
      }
    }
  }

  return node;
};

/**
 * Find same tagName nodes and merge from startNode to endNode.
 * @param {node} startNode
 * @param {node} endNode
 * @param {string} tagName
 * @returns {node}
 * @private
 */
var mergeSameNodes = function mergeSameNodes(startNode, endNode, tagName) {
  var startBlockNode = changeTagOrder(startNode, tagName);

  if (startBlockNode.nodeName === tagName) {
    var endBlockNode = changeTagOrder(endNode, tagName);
    var mergeTargetNode = startBlockNode;
    var nextNode = startBlockNode.nextSibling;

    while (nextNode) {
      var tempNext = nextNode.nextSibling;

      nextNode = changeTagOrder(nextNode, tagName);

      if (nextNode.nodeName === tagName) {
        // eslint-disable-next-line max-depth
        if (mergeTargetNode) {
          mergeNode(nextNode, mergeTargetNode);
        } else {
          mergeTargetNode = nextNode;
        }
      } else {
        mergeTargetNode = null;
      }

      if (nextNode === endBlockNode) {
        break;
      }

      nextNode = tempNext;
    }
  }
};

/**
 * Find same tagName nodes in range and merge nodes.
 * For example range is like this
 * <s><b>AAA</b></s><b>BBB</b>
 * nodes is changed below
 * <b><s>AAA</s>BBB</b>
 * @param {range} range
 * @param {string} tagName
 * @private
 */
var optimizeRange = function optimizeRange(range, tagName) {
  var collapsed = range.collapsed,
      commonAncestorContainer = range.commonAncestorContainer,
      startContainer = range.startContainer,
      endContainer = range.endContainer;


  if (!collapsed) {
    var optimizedNode = null;

    if (startContainer !== endContainer) {
      mergeSameNodes(getParentUntil(startContainer, commonAncestorContainer), getParentUntil(endContainer, commonAncestorContainer), tagName);

      optimizedNode = commonAncestorContainer;
    } else if (isTextNode(startContainer)) {
      optimizedNode = startContainer.parentNode;
    }

    if (optimizedNode && optimizedNode.nodeName === tagName) {
      var _optimizedNode = optimizedNode,
          previousSibling = _optimizedNode.previousSibling;

      var tempNode = void 0;

      if (previousSibling) {
        tempNode = changeTagOrder(previousSibling);

        if (tempNode.nodeName === tagName) {
          mergeNode(optimizedNode, tempNode);
        }
      }

      var _optimizedNode2 = optimizedNode,
          nextSibling = _optimizedNode2.nextSibling;


      if (nextSibling) {
        tempNode = changeTagOrder(nextSibling);

        if (tempNode.nodeName === tagName) {
          mergeNode(tempNode, optimizedNode);
        }
      }
    }
  }
};

/**
 * Gets all text node from root element.
 * @param {HTMLElement} root Root element
 * @returns {Array} list of text nodes
 * @ignore
 */
var getAllTextNode = function getAllTextNode(root) {
  var walker = document.createTreeWalker(root, 4, null, false);
  var result = [];

  while (walker.nextNode()) {
    var node = walker.currentNode;

    if (isTextNode(node)) {
      result.push(node);
    }
  }

  return result;
};

/**
 * Check whether the node is 'TD' or 'TH'
 * @param {HTMLElement} node - the target node
 * @returns {boolean} - whether the node is 'TD' or 'TH'
 * @ignore
 */
var isCellNode = function isCellNode(node) {
  if (!node) {
    return false;
  }

  return node.nodeName === 'TD' || node.nodeName === 'TH';
};

/**
 * Get the last node on the target node by the condition
 * @param {HTMLElement} node - the target node
 * @returns {function} - the condition to find the node
 * @ignore
 */
var getLastNodeBy = function getLastNodeBy(node, condition) {
  var lastNode = node && node.lastChild;

  while (lastNode && condition(lastNode)) {
    lastNode = lastNode.lastChild;
  }

  return lastNode;
};

/**
 * Get the parent node on the target node by the condition
 * @param {HTMLElement} node - the target node
 * @returns {function} - the condition to find the node
 * @ignore
 */
var getParentNodeBy = function getParentNodeBy(node, condition) {
  while (node && condition(node.parentNode, node)) {
    node = node.parentNode;
  }

  return node;
};

/**
 * Get the sibling node on the target node by the condition
 * @param {HTMLElement} node - the target node
 * @param {string} direction - the direction to find node ('previous', 'next')
 * @returns {function} - the condition to find the node
 * @ignore
 */
var getSiblingNodeBy = function getSiblingNodeBy(node, direction, condition) {
  var directionKey = direction + 'Sibling';

  while (node && condition(node[directionKey], node)) {
    node = node[directionKey];
  }

  return node;
};

exports.default = {
  getNodeName: getNodeName,
  isTextNode: isTextNode,
  isElemNode: isElemNode,
  isBlockNode: isBlockNode,
  getTextLength: getTextLength,
  getOffsetLength: getOffsetLength,
  getPrevOffsetNodeUntil: getPrevOffsetNodeUntil,
  getNodeOffsetOfParent: getNodeOffsetOfParent,
  getChildNodeByOffset: getChildNodeByOffset,
  getNodeWithDirectionUntil: getNodeWithDirectionUntil,
  containsNode: containsNode,
  getTopPrevNodeUnder: getTopPrevNodeUnder,
  getTopNextNodeUnder: getTopNextNodeUnder,
  getParentUntilBy: getParentUntilBy,
  getParentUntil: getParentUntil,
  getTopBlockNode: getTopBlockNode,
  getPrevTextNode: getPrevTextNode,
  findOffsetNode: findOffsetNode,
  getPath: getPath,
  getNodeInfo: getNodeInfo,
  getTableCellByDirection: getTableCellByDirection,
  getSiblingRowCellByDirection: getSiblingRowCellByDirection,
  isMDSupportInlineNode: isMDSupportInlineNode,
  isStyledNode: isStyledNode,
  removeChildFromStartToEndNode: removeChildFromStartToEndNode,
  removeNodesByDirection: removeNodesByDirection,
  getLeafNode: getLeafNode,
  isInsideTaskBox: isInsideTaskBox,
  isListNode: isListNode,
  isFirstListItem: isFirstListItem,
  isFirstLevelListItem: isFirstLevelListItem,
  mergeNode: mergeNode,
  createHorizontalRule: createHorizontalRule,
  createEmptyLine: createEmptyLine,
  changeTagOrder: changeTagOrder,
  mergeSameNodes: mergeSameNodes,
  optimizeRange: optimizeRange,
  getAllTextNode: getAllTextNode,
  isCellNode: isCellNode,
  getLastNodeBy: getLastNodeBy,
  getParentNodeBy: getParentNodeBy,
  getSiblingNodeBy: getSiblingNodeBy
};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint-disable */
/*
 CSV-JS - A Comma-Separated Values parser for JS

 Built to rfc4180 standard, with options for adjusting strictness:
    - optional carriage returns for non-microsoft sources
    - automatically type-cast numeric an boolean values
    - relaxed mode which: ignores blank lines, ignores gargabe following quoted tokens, does not enforce a consistent record length

 Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 Author Greg Kindel (twitter @gkindel), 2014
 */
/**
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */

(function (global) {
    'use strict';
    /**
     * @name CSV
     * @namespace
     * @ignore
     */
    // implemented as a singleton because JS is single threaded

    var CSV = {};
    CSV.RELAXED = false;
    CSV.IGNORE_RECORD_LENGTH = false;
    CSV.IGNORE_QUOTES = false;
    CSV.LINE_FEED_OK = true;
    CSV.CARRIAGE_RETURN_OK = true;
    CSV.DETECT_TYPES = true;
    CSV.IGNORE_QUOTE_WHITESPACE = true;
    CSV.DEBUG = false;

    CSV.COLUMN_SEPARATOR = ",";

    CSV.ERROR_EOF = "UNEXPECTED_END_OF_FILE";
    CSV.ERROR_CHAR = "UNEXPECTED_CHARACTER";
    CSV.ERROR_EOL = "UNEXPECTED_END_OF_RECORD";
    CSV.WARN_SPACE = "UNEXPECTED_WHITESPACE"; // not per spec, but helps debugging

    var QUOTE = "\"",
        CR = "\r",
        LF = "\n",
        SPACE = " ",
        TAB = "\t";

    // states
    var PRE_TOKEN = 0,
        MID_TOKEN = 1,
        POST_TOKEN = 2,
        POST_RECORD = 4;
    /**
     * @name CSV.parse
     * @function
     * @description rfc4180 standard csv parse
     * with options for strictness and data type conversion
     * By default, will automatically type-cast numeric an boolean values.
     * @param {String} str A CSV string
     * @return {Array} An array records, each of which is an array of scalar values.
     * @example
     * // simple
     * var rows = CSV.parse("one,two,three\nfour,five,six")
     * // rows equals [["one","two","three"],["four","five","six"]]
     * @example
     * // Though not a jQuery plugin, it is recommended to use with the $.ajax pipe() method:
     * $.get("csv.txt")
     *    .pipe( CSV.parse )
     *    .done( function(rows) {
     *        for( var i =0; i < rows.length; i++){
     *            console.log(rows[i])
     *        }
     *  });
     * @see http://www.ietf.org/rfc/rfc4180.txt
     */
    CSV.parse = function (str) {
        var result = CSV.result = [];
        CSV.COLUMN_SEPARATOR = CSV.COLUMN_SEPARATOR instanceof RegExp ? new RegExp('^' + CSV.COLUMN_SEPARATOR.source) : CSV.COLUMN_SEPARATOR;

        CSV.offset = 0;
        CSV.str = str;
        CSV.record_begin();

        CSV.debug("parse()", str);

        var c;
        while (1) {
            // pull char
            c = str[CSV.offset++];
            CSV.debug("c", c);

            // detect eof
            if (c == null) {
                if (CSV.escaped) {
                    CSV.error(CSV.ERROR_EOF);
                }

                if (CSV.record) {
                    CSV.token_end();
                    CSV.record_end();
                }

                CSV.debug("...bail", c, CSV.state, CSV.record);
                CSV.reset();
                break;
            }

            if (CSV.record == null) {
                // if relaxed mode, ignore blank lines
                if (CSV.RELAXED && (c == LF || c == CR && str[CSV.offset + 1] == LF)) {
                    continue;
                }
                CSV.record_begin();
            }

            // pre-token: look for start of escape sequence
            if (CSV.state == PRE_TOKEN) {

                if ((c === SPACE || c === TAB) && CSV.next_nonspace() == QUOTE) {
                    if (CSV.RELAXED || CSV.IGNORE_QUOTE_WHITESPACE) {
                        continue;
                    } else {
                        // not technically an error, but ambiguous and hard to debug otherwise
                        CSV.warn(CSV.WARN_SPACE);
                    }
                }

                if (c == QUOTE && !CSV.IGNORE_QUOTES) {
                    CSV.debug("...escaped start", c);
                    CSV.escaped = true;
                    CSV.state = MID_TOKEN;
                    continue;
                }
                CSV.state = MID_TOKEN;
            }

            // mid-token and escaped, look for sequences and end quote
            if (CSV.state == MID_TOKEN && CSV.escaped) {
                if (c == QUOTE) {
                    if (str[CSV.offset] == QUOTE) {
                        CSV.debug("...escaped quote", c);
                        CSV.token += QUOTE;
                        CSV.offset++;
                    } else {
                        CSV.debug("...escaped end", c);
                        CSV.escaped = false;
                        CSV.state = POST_TOKEN;
                    }
                } else {
                    CSV.token += c;
                    CSV.debug("...escaped add", c, CSV.token);
                }
                continue;
            }

            // fall-through: mid-token or post-token, not escaped
            if (c == CR) {
                if (str[CSV.offset] == LF) CSV.offset++;else if (!CSV.CARRIAGE_RETURN_OK) CSV.error(CSV.ERROR_CHAR);
                CSV.token_end();
                CSV.record_end();
            } else if (c == LF) {
                if (!(CSV.LINE_FEED_OK || CSV.RELAXED)) CSV.error(CSV.ERROR_CHAR);
                CSV.token_end();
                CSV.record_end();
            } else if (CSV.test_regex_separator(str) || CSV.COLUMN_SEPARATOR == c) {
                CSV.token_end();
            } else if (CSV.state == MID_TOKEN) {
                CSV.token += c;
                CSV.debug("...add", c, CSV.token);
            } else if (c === SPACE || c === TAB) {
                if (!CSV.IGNORE_QUOTE_WHITESPACE) CSV.error(CSV.WARN_SPACE);
            } else if (!CSV.RELAXED) {
                CSV.error(CSV.ERROR_CHAR);
            }
        }
        return result;
    };

    /**
     * @name CSV.stream
     * @function
     * @description stream a CSV file
     * @example
     * node -e "c=require('CSV-JS');require('fs').createReadStream('csv.txt').pipe(c.stream()).pipe(c.stream.json()).pipe(process.stdout)"
     * @ignore
     */
    CSV.stream = function () {
        var stream = __webpack_require__(19);
        var s = new stream.Transform({ objectMode: true });
        s.EOL = '\n';
        s.prior = "";
        s.emitter = function (s) {
            return function (e) {
                s.push(CSV.parse(e + s.EOL));
            };
        }(s);

        s._transform = function (chunk, encoding, done) {
            var lines = this.prior == "" ? chunk.toString().split(this.EOL) : (this.prior + chunk.toString()).split(this.EOL);
            this.prior = lines.pop();
            lines.forEach(this.emitter);
            done();
        };

        s._flush = function (done) {
            if (this.prior != "") {
                this.emitter(this.prior);
                this.prior = "";
            }
            done();
        };
        return s;
    };

    CSV.test_regex_separator = function (str) {
        if (!(CSV.COLUMN_SEPARATOR instanceof RegExp)) {
            return false;
        }

        var match;
        str = str.slice(CSV.offset - 1);
        match = CSV.COLUMN_SEPARATOR.exec(str);
        if (match) {
            CSV.offset += match[0].length - 1;
        }

        return match !== null;
    };

    CSV.stream.json = function () {
        var os = __webpack_require__(65);
        var stream = __webpack_require__(19);
        var s = new streamTransform({ objectMode: true });
        s._transform = function (chunk, encoding, done) {
            s.push(JSON.stringify(chunk.toString()) + os.EOL);
            done();
        };
        return s;
    };

    CSV.reset = function () {
        CSV.state = null;
        CSV.token = null;
        CSV.escaped = null;
        CSV.record = null;
        CSV.offset = null;
        CSV.result = null;
        CSV.str = null;
    };

    CSV.next_nonspace = function () {
        var i = CSV.offset;
        var c;
        while (i < CSV.str.length) {
            c = CSV.str[i++];
            if (!(c == SPACE || c === TAB)) {
                return c;
            }
        }
        return null;
    };

    CSV.record_begin = function () {
        CSV.escaped = false;
        CSV.record = [];
        CSV.token_begin();
        CSV.debug("record_begin");
    };

    CSV.record_end = function () {
        CSV.state = POST_RECORD;
        if (!(CSV.IGNORE_RECORD_LENGTH || CSV.RELAXED) && CSV.result.length > 0 && CSV.record.length != CSV.result[0].length) {
            CSV.error(CSV.ERROR_EOL);
        }
        CSV.result.push(CSV.record);
        CSV.debug("record end", CSV.record);
        CSV.record = null;
    };

    CSV.resolve_type = function (token) {
        if (token.match(/^[-+]?[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?$/)) {
            token = parseFloat(token);
        } else if (token.match(/^(true|false)$/i)) {
            token = Boolean(token.match(/true/i));
        } else if (token === "undefined") {
            token = undefined;
        } else if (token === "null") {
            token = null;
        }
        return token;
    };

    CSV.token_begin = function () {
        CSV.state = PRE_TOKEN;
        // considered using array, but http://www.sitepen.com/blog/2008/05/09/string-performance-an-analysis/
        CSV.token = "";
    };

    CSV.token_end = function () {
        if (CSV.DETECT_TYPES) {
            CSV.token = CSV.resolve_type(CSV.token);
        }
        CSV.record.push(CSV.token);
        CSV.debug("token end", CSV.token);
        CSV.token_begin();
    };

    CSV.debug = function () {
        if (CSV.DEBUG) console.log(arguments);
    };

    CSV.dump = function (msg) {
        return [msg, "at char", CSV.offset, ":", CSV.str.substr(CSV.offset - 50, 50).replace(/\r/mg, "\\r").replace(/\n/mg, "\\n").replace(/\t/mg, "\\t")].join(" ");
    };

    CSV.error = function (err) {
        var msg = CSV.dump(err);
        CSV.reset();
        throw msg;
    };

    CSV.warn = function (err) {
        if (!CSV.DEBUG) {
            return;
        }

        var msg = CSV.dump(err);
        try {
            console.warn(msg);
            return;
        } catch (e) {}

        try {
            console.log(msg);
        } catch (e) {}
    };

    // Node, PhantomJS, etc
    // eg.  var CSV = require("CSV"); CSV.parse(...);
    if ( true && module.exports) {
        module.exports = CSV;
    }

    // CommonJS http://wiki.commonjs.org/wiki/Modules
    // eg.  var CSV = require("CSV").CSV; CSV.parse(...);
    else if (true) {
            exports.CSV = CSV;
        }

        // AMD https://github.com/amdjs/amdjs-api/wiki/AMD
        // eg.  require(['./csv.js'], function (CSV) { CSV.parse(...); } );
        else {}
})(undefined);

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),
/* 53 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 54 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = __webpack_require__(12).Buffer;
var util = __webpack_require__(56);

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = { data: v, next: null };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = { data: v, next: this.head };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;
    while (p = p.next) {
      ret += s + p.data;
    }return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;
    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  };

  return BufferList;
}();

if (util && util.inspect && util.inspect.custom) {
  module.exports.prototype[util.inspect.custom] = function () {
    var obj = util.inspect({ length: this.length });
    return this.constructor.name + ' ' + obj;
  };
}

/***/ }),
/* 56 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(58);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)))

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8), __webpack_require__(10)))

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)))

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.



module.exports = PassThrough;

var Transform = __webpack_require__(26);

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(7);
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(15);


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(14).Transform


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(14).PassThrough


/***/ }),
/* 65 */
/***/ (function(module, exports) {

exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _editorProxy = __webpack_require__(2);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

__webpack_require__(67);

var _mergedTableCreator = __webpack_require__(68);

var _mergedTableCreator2 = _interopRequireDefault(_mergedTableCreator);

var _tableUnmergePreparer = __webpack_require__(69);

var _tableUnmergePreparer2 = _interopRequireDefault(_tableUnmergePreparer);

var _toMarkRenderer = __webpack_require__(70);

var _wwMergedTableManager = __webpack_require__(71);

var _wwMergedTableManager2 = _interopRequireDefault(_wwMergedTableManager);

var _wwMergedTableSelectionManager = __webpack_require__(72);

var _wwMergedTableSelectionManager2 = _interopRequireDefault(_wwMergedTableSelectionManager);

var _mergedTableAddRow = __webpack_require__(73);

var _mergedTableAddRow2 = _interopRequireDefault(_mergedTableAddRow);

var _mergedTableAddCol = __webpack_require__(74);

var _mergedTableAddCol2 = _interopRequireDefault(_mergedTableAddCol);

var _mergedTableRemoveRow = __webpack_require__(75);

var _mergedTableRemoveRow2 = _interopRequireDefault(_mergedTableRemoveRow);

var _mergedTableRemoveCol = __webpack_require__(76);

var _mergedTableRemoveCol2 = _interopRequireDefault(_mergedTableRemoveCol);

var _mergedTableAlignCol = __webpack_require__(77);

var _mergedTableAlignCol2 = _interopRequireDefault(_mergedTableAlignCol);

var _mergeCell = __webpack_require__(78);

var _mergeCell2 = _interopRequireDefault(_mergeCell);

var _unmergeCell = __webpack_require__(79);

var _unmergeCell2 = _interopRequireDefault(_unmergeCell);

var _mergedTableUI = __webpack_require__(80);

var _mergedTableUI2 = _interopRequireDefault(_mergedTableUI);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * table extension
 * @param {Editor} editor - editor instance
 * @ignore
 */
/**
* @fileoverview Implements table extension
* @author NHN FE Development Lab <dl_javascript@nhn.com>
*/
function tableExtension(editor) {
  var eventManager = editor.eventManager;


  _bindEvents(eventManager);

  if (editor.isViewer()) {
    return;
  }

  var wwComponentManager = editor.wwEditor.componentManager;
  var popupTableUtils = editor.getUI().getPopupTableUtils();

  _addCommands(editor);
  _changeWysiwygManagers(wwComponentManager);

  editor.toMarkOptions = getExtendedToMarkOptions(editor.toMarkOptions);

  if (popupTableUtils) {
    _mergedTableUI2.default.updateContextMenu(popupTableUtils, eventManager, wwComponentManager.getManager('tableSelection'));
  }
}

function getExtendedToMarkOptions(toMarkOptions) {
  var extendedOptions = toMarkOptions || {};
  var baseRenderer = extendedOptions.renderer;

  extendedOptions.renderer = (0, _toMarkRenderer.createToMarkRenderer)(baseRenderer);

  return extendedOptions;
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

      if (tableElement.hasAttribute('data-tomark-pass')) {
        changedTableElement.setAttribute('data-tomark-pass', '');
      }

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
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _editorProxy = __webpack_require__(2);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var i18n = _editorProxy2.default.i18n; /**
                                       * @fileoverview i18n for table extension
                                       * @author NHN FE Development Lab <dl_javascript@nhn.com>
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

  i18n.setLanguage(['es', 'es_ES'], {
    'Merge cells': 'Combinar celdas',
    'Unmerge cells': 'Separar celdas',
    'Cannot change part of merged cell': 'No se puede cambiar parte de una celda combinada.',
    'Cannot paste row merged cells into the table header': 'No se pueden pegar celdas combinadas en el encabezado de tabla.'
  });

  i18n.setLanguage(['ja', 'ja_JP'], {
    'Merge cells': 'セルの結合',
    'Unmerge cells': 'セルの結合を解除',
    'Cannot change part of merged cell': '結合されたセルの一部を変更することはできません。',
    'Cannot paste row merged cells into the table header': '行にマージされたセルをヘッダーに貼り付けることはできません。'
  });

  i18n.setLanguage(['nl', 'nl_NL'], {
    'Merge cells': 'Cellen samenvoegen',
    'Unmerge cells': 'Samengevoegde cellen ongedaan maken',
    'Cannot change part of merged cell': 'Kan geen deel uit van een samengevoegde cel veranderen.',
    'Cannot paste row merged cells into the table header': 'Kan geen rij met samengevoegde cellen in de koptekst plakken.'
  });

  i18n.setLanguage(['zh', 'zh_CN'], {
    'Merge cells': '合并单元格',
    'Unmerge cells': '取消合并单元格',
    'Cannot change part of merged cell': '无法更改合并单元格的一部分。',
    'Cannot paste row merged cells into the table header': '无法将行合并单元格粘贴到标题中。'
  });

  i18n.setLanguage(['de', 'de_DE'], {
    'Merge cells': 'Zellen zusammenführen',
    'Unmerge cells': 'Zusammenführen rückgängig machen',
    'Cannot change part of merged cell': 'Der Teil der verbundenen Zelle kann nicht geändert werden.',
    'Cannot paste row merged cells into the table header': 'Die Zeile der verbundenen Zellen kann nicht in die Kopfzeile eingefügt werden.'
  });

  i18n.setLanguage(['ru', 'ru_RU'], {
    'Merge cells': 'Объединить ячейки',
    'Unmerge cells': 'Разъединить ячейки',
    'Cannot change part of merged cell': 'Вы не можете изменять часть комбинированной ячейки.',
    'Cannot paste row merged cells into the table header': 'Вы не можете вставлять объединенные ячейки в заголовок таблицы.'
  });

  i18n.setLanguage(['fr', 'fr_FR'], {
    'Merge cells': 'Fusionner les cellules',
    'Unmerge cells': 'Séparer les cellules',
    'Cannot change part of merged cell': 'Impossible de modifier une partie de la cellule fusionnée.',
    'Cannot paste row merged cells into the table header': 'Impossible de coller les cellules fusionnées dans l\'en-tête du tableau.'
  });

  i18n.setLanguage(['uk', 'uk_UA'], {
    'Merge cells': 'Об\'єднати комірки',
    'Unmerge cells': 'Роз\'єднати комірки',
    'Cannot change part of merged cell': 'Ви не можете змінювати частину комбінованої комірки.',
    'Cannot paste row merged cells into the table header': 'Ви не можете вставляти об\'єднані комірки в заголовок таблиці.'
  });

  i18n.setLanguage(['tr', 'tr_TR'], {
    'Merge cells': 'Hücreleri birleştir',
    'Unmerge cells': 'Hücreleri ayır',
    'Cannot change part of merged cell': 'Birleştirilmiş hücrelerin bir kısmı değiştirelemez.',
    'Cannot paste row merged cells into the table header': 'Satırda birleştirilmiş hücreler sütun başlığına yapıştırılamaz'
  });

  i18n.setLanguage(['fi', 'fi_FI'], {
    'Merge cells': 'Yhdistä solut',
    'Unmerge cells': 'Jaa solut',
    'Cannot change part of merged cell': 'Yhdistettyjen solujen osaa ei voi muuttaa',
    'Cannot paste row merged cells into the table header': 'Soluja ei voi yhdistää taulukon otsikkoriviin'
  });

  i18n.setLanguage(['cs', 'cs_CZ'], {
    'Merge cells': 'Spojit buňky',
    'Unmerge cells': 'Rozpojit buňky',
    'Cannot change part of merged cell': 'Nelze měnit část spojené buňky',
    'Cannot paste row merged cells into the table header': 'Nelze vkládat spojené buňky do záhlaví tabulky'
  });

  i18n.setLanguage(['ar', 'ar_AR'], {
    'Merge cells': 'دمج الوحدات',
    'Unmerge cells': 'إلغاء دمج الوحدات',
    'Cannot change part of merged cell': 'لا يمكن تغيير جزء من الخلية المدموجة',
    'Cannot paste row merged cells into the table header': 'لا يمكن لصق الخلايا المدموجة من صف واحد في رأس الجدول'
  });

  i18n.setLanguage(['pl', 'pl_PL'], {
    'Merge cells': 'Scal komórki',
    'Unmerge cells': 'Rozłącz komórki',
    'Cannot change part of merged cell': 'Nie można zmienić części scalonej komórki.',
    'Cannot paste row merged cells into the table header': 'Nie można wkleić komórek o scalonym rzędzie w nagłówek tabeli.'
  });

  i18n.setLanguage(['zh', 'zh_TW'], {
    'Merge cells': '合併儲存格',
    'Unmerge cells': '取消合併儲存格',
    'Cannot change part of merged cell': '無法變更儲存格的一部分。',
    'Cannot paste row merged cells into the table header': '無法將合併的儲存格貼上至表格標題中。'
  });

  i18n.setLanguage(['gl', 'gl_ES'], {
    'Merge cells': 'Combinar celas',
    'Unmerge cells': 'Separar celas',
    'Cannot change part of merged cell': 'Non se pode cambiar parte dunha cela combinada',
    'Cannot paste row merged cells into the table header': 'Non se poden pegar celas no encabezado da táboa'
  });

  i18n.setLanguage(['sv', 'sv_SE'], {
    'Merge cells': 'Sammanfoga celler',
    'Unmerge cells': 'Dela celler',
    'Cannot change part of merged cell': 'Ej möjligt att ändra en del av en sammanfogad cell',
    'Cannot paste row merged cells into the table header': 'Ej möjligt att klistra in rad-sammanfogade celler i tabellens huvud'
  });

  i18n.setLanguage(['it', 'it_IT'], {
    'Merge cells': 'Unisci celle',
    'Unmerge cells': 'Separa celle',
    'Cannot change part of merged cell': 'Non è possibile modificare parte di una cella unita',
    'Cannot paste row merged cells into the table header': 'Non è possibile incollare celle unite per riga nell\'intestazione della tabella'
  });
}

/***/ }),
/* 68 */
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

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _tableRenderer = __webpack_require__(4);

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
* @author NHN FE Development Lab <dl_javascript@nhn.com>
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
/* 69 */
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
* @author NHN FE Development Lab <dl_javascript@nhn.com>
*/
function prepareTableUnmerge(tableElement) {
  (0, _jquery2.default)(tableElement).find('td, th').get().forEach(_prependMergeSyntaxToContent);

  return tableElement;
}

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._getAdditionalThCount = _getAdditionalThCount;
exports._createTheadMarkdown = _createTheadMarkdown;
exports.createToMarkRenderer = createToMarkRenderer;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _toMark = __webpack_require__(17);

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
* @author NHN FE Development Lab <dl_javascript@nhn.com>
*/
function _createRepeatString(str, count) {
  return _tuiCodeSnippet2.default.range(0, count).map(function () {
    return str;
  }).join('');
}

/**
 * Make table head align text.
 * Copy from https://github.com/nhn/to-mark/blob/develop/src/renderer.gfm.js
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

function createToMarkRenderer(baseRenderer) {
  return _toMark2.default.Renderer.factory(baseRenderer || _toMark2.default.gfmRenderer, {
    'THEAD': _createTheadMarkdown
  });
}

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _editorProxy = __webpack_require__(2);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRenderer = __webpack_require__(4);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

var _tableRangeHandler = __webpack_require__(5);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @fileoverview Implements wysiwyg merged table manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */


var WwTableManager = _editorProxy2.default.WwTableManager,
    i18n = _editorProxy2.default.i18n;

var PASTE_TABLE_BOOKMARK = 'tui-paste-table-bookmark';
var PASTE_TABLE_CELL_BOOKMARK = 'tui-paste-table-cell-bookmark';

/**
 * Class WwMergedTableManager
 * @ignore
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
     * @param {Node} clipboardTable - table element of clipboard
     */

  }, {
    key: 'pasteTableData',
    value: function pasteTableData(clipboardTable) {
      var $clipboardTable = (0, _jquery2.default)(clipboardTable);
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
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _editorProxy = __webpack_require__(2);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(5);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @fileoverview Implements wysiwyg merged table selection manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */


var WwTableSelectionManager = _editorProxy2.default.WwTableSelectionManager;


var TABLE_CELL_SELECTED_CLASS_NAME = 'te-cell-selected';

/**
 * Class WwMergedTableSelectionManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */

var WwMergedTableSelectionManager = function (_WwTableSelectionMana) {
  _inherits(WwMergedTableSelectionManager, _WwTableSelectionMana);

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
     * @param {Object} [options] - options to be passed into onStyle
     */

  }, {
    key: 'styleToSelectedCells',
    value: function styleToSelectedCells(onStyle, options) {
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
        onStyle(sq, options);
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
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._createNewRow = _createNewRow;
exports._addRow = _addRow;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _editorProxy = __webpack_require__(2);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(5);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(4);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements mergedTableAddRow. Add Row to selected table
* @author NHN FE Development Lab <dl_javascript@nhn.com>
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
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._createNewColumns = _createNewColumns;
exports._addColumns = _addColumns;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _editorProxy = __webpack_require__(2);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(5);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(4);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements mergedTableAddCol. Add Row to selected table.
* @author NHN FE Development Lab <dl_javascript@nhn.com>
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
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._removeRow = _removeRow;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _editorProxy = __webpack_require__(2);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(5);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(4);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements mergedTableRemoveRow
* @author NHN FE Development Lab <dl_javascript@nhn.com>
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
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._removeColumns = _removeColumns;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _editorProxy = __webpack_require__(2);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(5);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(4);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements mergedTableRemoveCol. Remove col to selected table
* @author NHN FE Development Lab <dl_javascript@nhn.com>
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
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _editorProxy = __webpack_require__(2);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(5);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(4);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements mergedTableAlignCol. Align selected column's text content to given direction
* @author NHN FE Development Lab <dl_javascript@nhn.com>
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
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._mergeCells = _mergeCells;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _editorProxy = __webpack_require__(2);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(5);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(4);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements MergeCell
* @author NHN FE Development Lab <dl_javascript@nhn.com>
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
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._hasMergedCell = _hasMergedCell;
exports._unmergeCells = _unmergeCells;

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiCodeSnippet = __webpack_require__(1);

var _tuiCodeSnippet2 = _interopRequireDefault(_tuiCodeSnippet);

var _editorProxy = __webpack_require__(2);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

var _tableDataHandler = __webpack_require__(3);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(5);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(4);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements UnmergeCell
* @author NHN FE Development Lab <dl_javascript@nhn.com>
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
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _editorProxy = __webpack_require__(2);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements table extension ui
* @author NHN FE Development Lab <dl_javascript@nhn.com>
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

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _tuiColorPicker = __webpack_require__(82);

var _tuiColorPicker2 = _interopRequireDefault(_tuiColorPicker);

var _editorProxy = __webpack_require__(2);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var colorSyntaxRx = /\{color:(.+?)}(.*?)\{color}/g; /**
                                                    * @fileoverview Implements Color syntax Extension
                                                    * @author NHN FE Development Lab <dl_javascript@nhn.com>
                                                    */

var colorHtmlRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)/g;
var colorHtmlCompleteRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)<\/span>/g;
var decimalColorRx = /rgb\((\d+)[, ]+(\d+)[, ]+(\d+)\)/g;

var RESET_COLOR = '#181818';

var lastScrollTop = 0;

/**
 * color syntax extension
 * @param {editor} editor - editor
 * @ignore
 */
function colorSyntaxExtension(editor) {
  var _editor$options$color = editor.options.colorSyntax,
      colorSyntax = _editor$options$color === undefined ? {} : _editor$options$color;
  var preset = colorSyntax.preset,
      _colorSyntax$useCusto = colorSyntax.useCustomSyntax,
      useCustomSyntax = _colorSyntax$useCusto === undefined ? false : _colorSyntax$useCusto;


  editor.eventManager.listen('convertorAfterMarkdownToHtmlConverted', function (html) {
    var replacement = void 0;

    if (!useCustomSyntax) {
      replacement = html;
    } else {
      replacement = html.replace(colorSyntaxRx, function (matched, p1, p2) {
        return makeHTMLColorSyntaxAndTextRange(p2, p1).result;
      });
    }

    return replacement;
  });

  editor.eventManager.listen('convertorAfterHtmlToMarkdownConverted', function (markdown) {
    var findRx = useCustomSyntax ? colorHtmlCompleteRx : colorHtmlRx;

    return markdown.replace(findRx, function (founded, color, text) {
      var replacement = void 0;

      if (color.match(decimalColorRx)) {
        color = changeDecColorsToHex(color);
      }

      if (!useCustomSyntax) {
        replacement = founded.replace(/ ?class="colour" ?/g, ' ').replace(decimalColorRx, color);
      } else {
        replacement = makeCustomColorSyntaxAndTextRange(text, color).result;
      }

      return replacement;
    });
  });

  if (!editor.isViewer() && editor.getUI().name === 'default') {
    editor.addCommand('markdown', {
      name: 'color',
      exec: function exec(mde, color) {
        var cm = mde.getEditor();
        var rangeFrom = cm.getCursor('from');
        var rangeTo = cm.getCursor('to');
        var replacedText = void 0;
        var replacedFrom = void 0;

        if (!color) {
          return;
        }

        if (!useCustomSyntax) {
          var _makeHTMLColorSyntaxA = makeHTMLColorSyntaxAndTextRange(cm.getSelection(), color);

          replacedText = _makeHTMLColorSyntaxA.result;
          replacedFrom = _makeHTMLColorSyntaxA.from;

          cm.replaceSelection(replacedText);
        } else {
          var _makeCustomColorSynta = makeCustomColorSyntaxAndTextRange(cm.getSelection(), color);

          replacedText = _makeCustomColorSynta.result;
          replacedFrom = _makeCustomColorSynta.from;

          cm.replaceSelection(replacedText);
        }

        cm.setSelection({
          line: rangeFrom.line,
          ch: rangeFrom.ch + replacedFrom
        }, {
          line: rangeTo.line,
          ch: rangeFrom.line === rangeTo.line ? rangeTo.ch + replacedFrom : rangeTo.ch
        });

        mde.focus();
      }
    });

    editor.addCommand('wysiwyg', {
      name: 'color',
      exec: function exec(wwe, color) {
        if (!color) {
          return;
        }

        var sq = wwe.getEditor();
        var tableSelectionManager = wwe.componentManager.getManager('tableSelection');

        // Cache scrollTop before change text color.
        // Because scrollTop is set 0 when focus() is called.
        // focus() is called when change text color.
        lastScrollTop = getScrollTopForReFocus(sq);

        if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
          tableSelectionManager.styleToSelectedCells(styleColor, color);

          var range = sq.getSelection();
          range.collapse(true);
          sq.setSelection(range);
        } else {
          styleColor(sq, color);
        }
      }
    });

    initUI(editor, preset);
  }
}

/**
 * style color
 * @param {SquireExt} sq - squire ext instance
 * @param {string} color - color sting value
 * @ignore
 */
function styleColor(sq, color) {
  if (!sq.hasFormat('PRE')) {
    if (color === RESET_COLOR) {
      sq.changeFormat(null, {
        class: 'colour',
        tag: 'span'
      });
    } else {
      sq.setTextColour(color);
    }
  }
}

/**
 * Get scrollTop of squire
 * @param {SquireExt} sq - squire ext instance
 * @ignore
 */
function getScrollTopForReFocus(sq) {
  return sq.getRoot().parentNode.scrollTop;
}

/**
 * Initialize UI
 * @param {object} editor - Editor instance
 * @param {Array.<string>} preset - Preset for color palette
 * @ignore
 */
function initUI(editor, preset) {
  var name = 'colorSyntax';
  var className = 'tui-color';
  var i18n = editor.i18n;
  var toolbar = editor.getUI().getToolbar();
  var usageStatistics = editor.options.usageStatistics;


  editor.eventManager.addEventType('colorButtonClicked');

  toolbar.insertItem(3, {
    type: 'button',
    options: {
      name: name,
      className: className,
      event: 'colorButtonClicked',
      tooltip: i18n.get('Text color')
    }
  });
  var colorSyntaxButtonIndex = toolbar.indexOfItem(name);

  var _toolbar$getItem = toolbar.getItem(colorSyntaxButtonIndex),
      $button = _toolbar$getItem.$el;

  var $colorPickerContainer = (0, _jquery2.default)('<div />');

  var $buttonBar = (0, _jquery2.default)('<button type="button" class="te-apply-button">' + i18n.get('OK') + '</button>');

  var cpOptions = {
    container: $colorPickerContainer[0],
    usageStatistics: usageStatistics
  };

  if (preset) {
    cpOptions.preset = preset;
  }

  var colorPicker = _tuiColorPicker2.default.create(cpOptions);

  var selectedColor = colorPicker.getColor();

  $colorPickerContainer.append($buttonBar);

  var popup = editor.getUI().createPopup({
    header: false,
    title: false,
    content: $colorPickerContainer,
    className: 'tui-popup-color',
    $target: editor.getUI().getToolbar().$el,
    css: {
      'width': 'auto',
      'position': 'absolute'
    }
  });

  editor.eventManager.listen('focus', function () {
    popup.hide();

    if (editor.isWysiwygMode() && lastScrollTop) {
      editor.getSquire().getRoot().parentNode.scrollTop = lastScrollTop;
      lastScrollTop = 0;
    }
  });

  editor.eventManager.listen('colorButtonClicked', function () {
    if (popup.isShow()) {
      popup.hide();

      return;
    }

    var _$button$get = $button.get(0),
        offsetTop = _$button$get.offsetTop,
        offsetLeft = _$button$get.offsetLeft;

    popup.$el.css({
      top: offsetTop + $button.outerHeight(),
      left: offsetLeft
    });
    colorPicker.slider.toggle(true);

    editor.eventManager.emit('closeAllPopup');
    popup.show();
  });

  editor.eventManager.listen('closeAllPopup', function () {
    popup.hide();
  });

  editor.eventManager.listen('removeEditor', function () {
    colorPicker.off('selectColor');
    popup.$el.find('.te-apply-button').off('click');
    popup.remove();
  });

  colorPicker.on('selectColor', function (e) {
    selectedColor = e.color;

    if (e.origin === 'palette') {
      editor.exec('color', selectedColor);
      popup.hide();
    }
  });

  popup.$el.find('.te-apply-button').on('click', function () {
    editor.exec('color', selectedColor);
  });
}

/**
 * make custom color syntax
 * @param {string} text - Text content
 * @param {string} color - Color value
 * @returns {object} - wrapped text and range(from, to)
 * @ignore
 */
function makeCustomColorSyntaxAndTextRange(text, color) {
  return wrapTextAndGetRange('{color:' + color + '}', text, '{color}');
}

/**
 * Make HTML color syntax by given text content and color value
 * @param {string} text Text - content
 * @param {string} color Color - value
 * @returns {object} - wrapped text and range(from, to)
 * @ignore
 */
function makeHTMLColorSyntaxAndTextRange(text, color) {
  return wrapTextAndGetRange('<span style="color:' + color + '">', text, '</span>');
}

/**
 * wrap text with pre & post and return with text range
 * @param {string} pre - text pre
 * @param {string} text - text
 * @param {string} post - text post
 * @returns {object} - wrapped text and range(from, to)
 * @ignore
 */
function wrapTextAndGetRange(pre, text, post) {
  return {
    result: '' + pre + text + post,
    from: pre.length,
    to: pre.length + text.length
  };
}

/**
 * Change decimal color values to hexadecimal color value
 * @param {string} color Color value string
 * @returns {string}
 * @ignore
 */
function changeDecColorsToHex(color) {
  return color.replace(decimalColorRx, function (colorValue, r, g, b) {
    var hr = changeDecColorToHex(r);
    var hg = changeDecColorToHex(g);
    var hb = changeDecColorToHex(b);

    return '#' + hr + hg + hb;
  });
}

/**
 * change individual dec color value to hex color
 * @param {string} color - individual color value
 * @returns {string} - zero padded color string
 * @ignore
 */
function changeDecColorToHex(color) {
  var hexColor = parseInt(color, 10);
  hexColor = hexColor.toString(16);
  hexColor = doubleZeroPad(hexColor);

  return hexColor;
}

/**
 * leading 2 zeros number string
 * @param {string} numberStr - number string
 * @returns {string}
 * @ignore
 */
function doubleZeroPad(numberStr) {
  var padded = '00' + numberStr;

  return padded.substr(padded.length - 2);
}

_editorProxy2.default.defineExtension('colorSyntax', colorSyntaxExtension);

exports.default = colorSyntaxExtension;

/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__82__;

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _plantumlEncoder = __webpack_require__(84);

var _plantumlEncoder2 = _interopRequireDefault(_plantumlEncoder);

var _editorProxy = __webpack_require__(2);

var _editorProxy2 = _interopRequireDefault(_editorProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @fileoverview Implements UML extension
* @author NHN FE Development Lab <dl_javascript@nhn.com>
*/
var codeBlockManager = _editorProxy2.default.codeBlockManager;

var DEFAULT_RENDERER_URL = 'http://www.plantuml.com/plantuml/png/';
var UML_LANGUAGES = ['uml', 'plantuml'];

/**
 * plant uml plugin
 * @param {Editor} editor - editor
 * @param {object} [options={}] - plugin options
 * @param {string} options.rendererURL - plant uml renderer url
 * @ignore
 */
function umlExtension(editor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$rendererURL = options.rendererURL,
      rendererURL = _options$rendererURL === undefined ? DEFAULT_RENDERER_URL : _options$rendererURL;

  /**
   * render html from uml
   * @param {string} umlCode - plant uml code text
   * @returns {string} - rendered html
   */

  function plantUMLReplacer(umlCode) {
    var renderedHTML = void 0;

    try {
      if (!_plantumlEncoder2.default) {
        throw new Error('plantuml-encoder dependency required');
      }
      renderedHTML = '<img src="' + rendererURL + _plantumlEncoder2.default.encode(umlCode) + '" />';
    } catch (err) {
      renderedHTML = 'Error occurred on encoding uml: ' + err.message;
    }

    return renderedHTML;
  }

  var codeBlockLanguages = editor.options.codeBlockLanguages;

  UML_LANGUAGES.forEach(function (umlLanguage) {
    if (codeBlockLanguages.indexOf(umlLanguage) < 0) {
      codeBlockLanguages.push(umlLanguage);
    }
    codeBlockManager.setReplacer(umlLanguage, plantUMLReplacer);
  });
}

_editorProxy2.default.defineExtension('uml', umlExtension);

exports.default = umlExtension;

/***/ }),
/* 84 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__84__;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Viewer = __webpack_require__(16);

// for jquery
/**
 * @fileoverview entry point for viewer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
_jquery2.default.fn.tuiEditor = function () {
  var options = void 0,
      instance = void 0;

  var el = this.get(0);

  if (el) {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    options = args[0] || {};

    instance = _jquery2.default.data(el, 'tuiEditor');

    if (instance) {
      if (typeof options === 'string') {
        var _instance;

        return (_instance = instance)[options].apply(_instance, args.slice(1));
      }
    } else {
      options.el = el;
      instance = new Viewer(options);
      _jquery2.default.data(el, 'tuiEditor', instance);
    }
  }

  return this;
};

module.exports = Viewer;

/***/ })
/******/ ]);
});