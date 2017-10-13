/*!
 * tui-editor
 * @version 0.14.0
 * @author Sungho Kim <shirenbeat@gmail.com>
 * @license MIT
 */
/******/ (function(modules) { // webpackBootstrap
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 110);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements CommandManager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _command = __webpack_require__(42);

var _command2 = _interopRequireDefault(_command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _tui = tui,
    util = _tui.util;


var isMac = /Mac/.test(navigator.platform);
var KEYMAP_OS_INDEX = isMac ? 1 : 0;

/**
 * Class CommandManager
 */

var CommandManager = function () {
    /**
     * @param {ToastUIEditor} base nedInstance
     * @param {object} [options={}] - option object
     *  @param {boolean} [options.useCommandShortcut=true] - execute command with keyMap
     */
    function CommandManager(base) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, CommandManager);

        this._command = new util.Map();
        this._mdCommand = new util.Map();
        this._wwCommand = new util.Map();
        this._options = $.extend({
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
         * @memberof CommandManager
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
         * @memberof CommandManager
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
         * @memberof CommandManager
         * @param {String} name Command name
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
 * @memberof ComponentManager
 * @param {string} type Command type
 * @param {{name: string, keyMap: object}} props Property
 * @returns {*}
 */


CommandManager.command = function (type, props) {
    var command = _command2.default.factory(type, props.name, props.keyMap);

    util.extend(command, props);

    return command;
};

module.exports = CommandManager;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

var FIND_ZWB = /\u200B/g;

var _tui = tui,
    util = _tui.util;

/**
 * isTextNode
 * Check if node is text node
 * @param {Node} node node to check
 * @returns {boolean} result
 * @ignore
 */

var isTextNode = function isTextNode(node) {
    return node && node.nodeType === Node.TEXT_NODE;
};

/**
 * isElemNode
 * Check if node is element node
 * @param {Node} node node to check
 * @returns {boolean} result
 * @ignore
 */
var isElemNode = function isElemNode(node) {
    return node && node.nodeType === Node.ELEMENT_NODE;
};

/**
 * getNodeName
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
 * getTextLength
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
 * getOffsetLength
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
 * getNodeOffsetOfParent
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
 * getChildNodeByOffset
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
 * getNodeWithDirectionUntil
 * find next node from passed node
 * 노드의 다음 노드를 찾는다 sibling노드가 없으면 부모레벨까지 올라가서 찾는다.
 * 부모노드를 따라 올라가며 방향에 맞는 노드를 찾는다.
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
 * getPrevOffsetNodeUntil
 * get prev node of childnode pointed with index
 * 인덱스에 해당하는 차일드 노드의 이전 노드를 찾는다.
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

var getParentUntilBy = function getParentUntilBy(node, condition) {
    var foundedNode = void 0;

    while (node.parentNode && !condition(node.parentNode)) {
        node = node.parentNode;
    }

    if (condition(node.parentNode)) {
        foundedNode = node;
    }

    return foundedNode;
};

/**
 * getParentUntil
 * get parent node until paseed node name
 * 특정 노드이전의 부모 노드를 찾는다
 * @param {Node} node node
 * @param {string|HTMLNode} untilNode node name or node to limit
 * @returns {Node} founded node
 * @ignore
 */
var getParentUntil = function getParentUntil(node, untilNode) {
    var foundedNode = void 0;

    if (util.isString(untilNode)) {
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
 * getNodeWithDirectionUnderParent
 * get node of direction before passed parent
 * 주어진 노드 이전까지 찾아올라가서 방향에 맞는 노드를 찾는다.
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
 * getTopPrevNodeUnder
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
 * getNextTopBlockNode
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

    // 오프셋에 해당하는 컨텐츠가 없는경우 컨텐츠 맨마지막으로 통일
    // 중간에 return으로 빠져나가지 않고 여기까지 왔다는것은 남은 offset이 있는것임
    do {
        result.push({
            container: walker.currentNode,
            offsetInContainer: text.length,
            offset: offset
        });
        offset = offsetList.shift();
    } while (!util.isUndefined(offset));

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
 * @param {string} direction Boolean value for direction true is find next cell
 * @returns {HTMLElement|null}
 * @ignore
 */
var getTableCellByDirection = function getTableCellByDirection(node, direction) {
    var isForward = true;
    var targetElement = null;

    if (tui.util.isUndefined(direction) || direction !== 'next' && direction !== 'previous') {
        return null;
    } else if (direction === 'previous') {
        isForward = false;
    }

    if (isForward) {
        targetElement = node.nextElementSibling;
    } else {
        targetElement = node.previousElementSibling;
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
    var isForward = true;
    var tableCellElement = null;
    var $node = void 0,
        index = void 0,
        $targetRowElement = void 0,
        $currentContainer = void 0,
        $siblingContainer = void 0,
        isSiblingContainerExists = void 0;

    if (tui.util.isUndefined(direction) || direction !== 'next' && direction !== 'previous') {
        return null;
    } else if (direction === 'previous') {
        isForward = false;
    }

    if (node) {
        $node = $(node);

        if (isForward) {
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

        if (tui.util.isUndefined(needEdgeCell) || !needEdgeCell) {
            index = getNodeOffsetOfParent(node);
        }

        if ($targetRowElement[0]) {
            tableCellElement = $targetRowElement.children('td,th')[index];
        } else if ($currentContainer[0] && isSiblingContainerExists) {
            tableCellElement = $siblingContainer.find('td,th')[index];
        }

        return tableCellElement;
    }

    return null;
};

module.exports = {
    getNodeName: getNodeName,
    isTextNode: isTextNode,
    isElemNode: isElemNode,
    getTextLength: getTextLength,
    getOffsetLength: getOffsetLength,
    getPrevOffsetNodeUntil: getPrevOffsetNodeUntil,
    getNodeOffsetOfParent: getNodeOffsetOfParent,
    getChildNodeByOffset: getChildNodeByOffset,
    getTopPrevNodeUnder: getTopPrevNodeUnder,
    getTopNextNodeUnder: getTopNextNodeUnder,
    getParentUntil: getParentUntil,
    getTopBlockNode: getTopBlockNode,
    getPrevTextNode: getPrevTextNode,
    findOffsetNode: findOffsetNode,
    getPath: getPath,
    getNodeInfo: getNodeInfo,
    getTableCellByDirection: getTableCellByDirection,
    getSiblingRowCellByDirection: getSiblingRowCellByDirection
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createTableData = createTableData;
exports.createCellIndexData = createCellIndexData;
/**
 * @fileoverview Implements tableDataHandler
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

var _tui = tui,
    util = _tui.util;

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
    var $cell = $(cell);
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

    util.range(startRowIndex, limitRowIndex).forEach(function (rowIndex) {
        base[rowIndex] = base[rowIndex] || [];

        util.range(startCellIndex, limitCellIndex).forEach(function (cellIndex) {
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

        $(tr).children().each(function (colIndex, cell) {
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
            if (util.isUndefined(cell.colMergeWith) && util.isUndefined(cell.rowMergeWith)) {
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

        if (util.isExisty(cellData.colMergeWith)) {
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
            return util.extend({
                align: headerAligns[colIndex]
            }, tableData[rowIndex][colIndex]);
        });
    });

    if (tableData.className) {
        renderData.className = tableData.className;
    }

    return renderData;
}

var BASIC_CELL_CONTENT = tui.util.browser.msie ? '' : '<br>';

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

    rowIndex = util.isExisty(cellData.rowMergeWith) ? cellData.rowMergeWith : rowIndex;
    colIndex = util.isExisty(cellData.colMergeWith) ? cellData.colMergeWith : colIndex;

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


        util.range(startIndex, limitIndex).forEach(function (colIndex) {
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
        util.range(0, tableData[1].length).forEach(function (colIndex) {
            header.push(createBasicCell(0, colIndex, 'TH'));
        });
    } else if (tableData[0][0].nodeName !== 'TH') {
        var _ref2;

        var newHeader = util.range(0, cellCount).map(function (colIndex) {
            return createBasicCell(0, colIndex, 'TH');
        });

        (_ref2 = []).concat.apply(_ref2, tableData).forEach(function (cellData) {
            if (cellData.elementIndex) {
                cellData.elementIndex.rowIndex += 1;
            }
        });

        tableData.unshift(newHeader);
    } else if (tableData.length === 1) {
        var newRow = util.range(0, cellCount).map(function (colIndex) {
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview Implements i18n
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

var _tui = tui,
    util = _tui.util;


var sharedInstance = void 0;

var DEFAULT_CODE = 'en_US';

/**
 * Class I18n
 */

var I18n = function () {
    /**
     * Creates an instance of I18n.
     * @memberof I18n
     */
    function I18n() {
        _classCallCheck(this, I18n);

        this._code = DEFAULT_CODE;
        this._langs = new util.Map();
    }

    /**
     * Set locale code
     * @param {string} code locale code
     */


    _createClass(I18n, [{
        key: 'setCode',
        value: function setCode(code) {
            this._code = code;
        }

        /**
         * Set language set
         * @param {string|string[]} codes locale code
         * @param {object} data language set
         */

    }, {
        key: 'setLang',
        value: function setLang(codes, data) {
            var _this = this;

            codes = [].concat(codes);

            codes.forEach(function (code) {
                if (!_this._langs.has(code)) {
                    _this._langs.set(code, data);
                } else {
                    var langData = _this._langs.get(code);
                    _this._langs.set(code, util.extend(langData, data));
                }
            });
        }

        /**
         * Get text of key
         * @param {string} key key of text
         * @param {string} code locale code
         * @returns {string}
         */

    }, {
        key: 'get',
        value: function get(key, code) {
            if (!code) {
                code = this._code;
            }

            var langSet = this._langs.get(code);

            if (!langSet) {
                langSet = this._langs.get(DEFAULT_CODE);
            }

            var text = langSet[key];

            if (!text) {
                throw new Error('There is no text key "' + key + '" in ' + code);
            }

            return text;
        }
    }], [{
        key: 'getSharedInstance',
        value: function getSharedInstance() {
            if (!sharedInstance) {
                sharedInstance = new I18n();
            }

            return sharedInstance;
        }
    }]);

    return I18n;
}();

exports.I18n = I18n;
exports.default = I18n.getSharedInstance();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tableDataHandler = __webpack_require__(2);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _tui = tui,
    util = _tui.util;

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
/**
 * @fileoverview Implements tableRangeHandler
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
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
function _expandRowMergedRange(tableData, tableRange, rangeType) {
    var rowIndex = tableRange[rangeType].rowIndex;

    var rowData = tableData[rowIndex];

    util.range(tableRange.start.colIndex, tableRange.end.colIndex + 1).forEach(function (colIndex) {
        var cellData = rowData[colIndex];
        var rowMergeWith = cellData.rowMergeWith;

        var lastRowMergedIndex = -1;

        if (util.isExisty(rowMergeWith)) {
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

    if (util.isExisty(colMergeWith)) {
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

        util.range(tableRange.start.rowIndex, tableRange.end.rowIndex + 1).forEach(function (rowIndex) {
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
        var endRange = util.extend({}, startRange);

        $selectedCells.each(function (index, cell) {
            var cellIndex = _tableDataHandler2.default.findCellIndex(cellIndexData, $(cell));
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
        tableRange.end = util.extend({}, cellIndex);
    }

    return tableRange;
}

exports.default = {
    findSelectionRange: findSelectionRange,
    getTableSelectionRange: getTableSelectionRange
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tableDataHandler = __webpack_require__(2);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create cell html.
 * @param {object} cell - cell data of table base data
 * @returns {string}
 * @private
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
/**
 * @fileoverview Implements tableRenderer
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
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
    var $newTable = $(createTableHtml(renderData));

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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

var _tui = tui,
    util = _tui.util;

/**
 * Class ExtManager
 */

var ExtManager = function () {
    /**
     * Creates an instance of ExtManager.
     * @memberof ExtManager
     */
    function ExtManager() {
        _classCallCheck(this, ExtManager);

        this.exts = new util.Map();
    }

    /**
     * defineExtension
     * Defined Extension
     * @memberof ExtManager
     * @param {string} name extension name
     * @param {ExtManager~extension} ext extension
     */


    _createClass(ExtManager, [{
        key: "defineExtension",
        value: function defineExtension(name, ext) {
            this.exts.set(name, ext);
        }

        /**
         * Apply extensions
         * @memberof ExtManager
         * @param {object} context Context
         * @param {Array.<string|object>} options - options or names array
         */

    }, {
        key: "applyExtension",
        value: function applyExtension(context, options) {
            var _this = this;

            if (options) {
                options.forEach(function (option) {
                    var hasOption = util.isObject(option);
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

module.exports = new ExtManager();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.



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
var processNextTick = __webpack_require__(14);
/*</replacement>*/

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(8);
/*</replacement>*/

var Readable = __webpack_require__(22);
var Writable = __webpack_require__(15);

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
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

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12).Buffer))

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
/* 11 */,
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(74)
var ieee754 = __webpack_require__(75)
var isArray = __webpack_require__(20)

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ }),
/* 13 */
/***/ (function(module, exports) {

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

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, setImmediate) {// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.



module.exports = Writable;

/*<replacement>*/
var processNextTick = __webpack_require__(14);
/*</replacement>*/

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(8);
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: __webpack_require__(85)
};
/*</replacement>*/

/*<replacement>*/
var Stream = __webpack_require__(24);
/*</replacement>*/

/*<replacement>*/
var Buffer = __webpack_require__(17).Buffer;
/*</replacement>*/

util.inherits(Writable, Stream);

function nop() {}

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

function WritableState(options, stream) {
  Duplex = Duplex || __webpack_require__(7);

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

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
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
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

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || __webpack_require__(7);

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
  processNextTick(cb, er);
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
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = Buffer.isBuffer(chunk);

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

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    chunk = decodeChunk(state, chunk, encoding);
    if (Buffer.isBuffer(chunk)) encoding = 'buffer';
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
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
  if (sync) processNextTick(cb, er);else cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
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
    while (entry) {
      buffer[count] = entry;
      entry = entry.next;
      count += 1;
    }

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
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
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

  state.bufferedRequestCount = 0;
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

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else {
      prefinish(stream, state);
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function (err) {
    var entry = _this.entry;
    _this.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    if (state.corkedRequestsFree) {
      state.corkedRequestsFree.next = _this;
    } else {
      state.corkedRequestsFree = _this;
    }
  };
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10), __webpack_require__(84).setImmediate))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(22);
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = __webpack_require__(15);
exports.Duplex = __webpack_require__(7);
exports.Transform = __webpack_require__(23);
exports.PassThrough = __webpack_require__(78);


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(12)


/***/ }),
/* 18 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 19 */,
/* 20 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 21 */
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

var Buffer = __webpack_require__(12).Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

module.exports = Readable;

/*<replacement>*/
var processNextTick = __webpack_require__(14);
/*</replacement>*/

/*<replacement>*/
var isArray = __webpack_require__(20);
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
var Stream = __webpack_require__(24);
/*</replacement>*/

/*<replacement>*/
var Buffer = __webpack_require__(17).Buffer;
/*</replacement>*/

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(8);
/*</replacement>*/

/*<replacement>*/
var debugUtil = __webpack_require__(86);
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = __webpack_require__(79);
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') {
    return emitter.prependListener(event, fn);
  } else {
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
}

function ReadableState(options, stream) {
  Duplex = Duplex || __webpack_require__(7);

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

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

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = __webpack_require__(21).StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || __webpack_require__(7);

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options && typeof options.read === 'function') this._read = options.read;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;

  if (!state.objectMode && typeof chunk === 'string') {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = Buffer.from(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var _e = new Error('stream.unshift() after end event');
      stream.emit('error', _e);
    } else {
      var skipAdd;
      if (state.decoder && !addToFront && !encoding) {
        chunk = state.decoder.write(chunk);
        skipAdd = !state.objectMode && chunk.length === 0;
      }

      if (!addToFront) state.reading = false;

      // Don't add to the buffer if we've decoded to an empty string chunk and
      // we're not in object mode
      if (!skipAdd) {
        // if we want the data now, just emit it.
        if (state.flowing && state.length === 0 && !state.sync) {
          stream.emit('data', chunk);
          stream.read(0);
        } else {
          // update the buffer info.
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

          if (state.needReadable) emitReadable(stream);
        }
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
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

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = __webpack_require__(21).StringDecoder;
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

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

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
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
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
    processNextTick(maybeReadMore_, stream, state);
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
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
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
    if (dest) dest.emit('unpipe', this);
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
      dests[i].emit('unpipe', this);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

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
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this, state);
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
    processNextTick(resume_, stream, state);
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
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
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
    stream.on(kProxyEvents[n], self.emit.bind(self, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

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
    processNextTick(endReadableNT, state, stream);
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

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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

var Duplex = __webpack_require__(7);

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(8);
/*</replacement>*/

util.inherits(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  var stream = this;

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
  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er, data) {
      done(stream, er, data);
    });else done(stream);
  });
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

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data !== null && data !== undefined) stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(13).EventEmitter;


/***/ }),
/* 25 */
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
var inherits = __webpack_require__(8);

inherits(Stream, EE);
Stream.Readable = __webpack_require__(16);
Stream.Writable = __webpack_require__(82);
Stream.Duplex = __webpack_require__(77);
Stream.Transform = __webpack_require__(81);
Stream.PassThrough = __webpack_require__(80);

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
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.detectDelimiter = exports.parseDSV2ChartData = exports.parseCode2ChartOption = exports.parseURL2ChartData = exports.parseCode2DataAndOptions = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _extManager = __webpack_require__(6);

var _extManager2 = _interopRequireDefault(_extManager);

var _csv = __webpack_require__(43);

var _csv2 = _interopRequireDefault(_csv);

var _wwCodeBlockManager = __webpack_require__(38);

var _wwCodeBlockManager2 = _interopRequireDefault(_wwCodeBlockManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @overview
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * tsv, csv format tui.chart plugin
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * consumes tab separated values and make data/options for tui chart
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ```chart
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * \t범례1\t범례2           => tsv, csv format chart data
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 1월\t21\t23
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 2월\t351\t45
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

_csv2.default.IGNORE_QUOTE_WHITESPACE = false;
_csv2.default.IGNORE_RECORD_LENGTH = true;
_csv2.default.DETECT_TYPES = false;

var _tui = tui,
    util = _tui.util,
    chart = _tui.chart;


var REGEX_LINE_ENDING = /[\n\r]/;
var DSV_DELIMITERS = [',', '\t', /\s+/];
var OPTION_DELIMITER = ':';
var SUPPORTED_CHART_TYPES = ['barChart', 'columnChart', 'lineChart', 'areaChart', 'pieChart'];
var CATEGORY_CHART_TYPES = ['lineChart', 'areaChart'];

/**
 * parse data and options for tui.chart
 * data format can be csv, tsv
 * options format is colon separated keys & values
 * @param {string} code - plain text format data & options
 * @param {Function} callback - callback which provides json format data & options
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
    if (util.isString(url)) {
        // url option provided
        // fetch data from url
        var success = function success(dataCode) {
            dataAndOptions = _parseCode2DataAndOptions(dataCode, firstCode);
            callback(dataAndOptions);
        };
        var fail = function fail() {
            return callback(null);
        };

        $.get(url).done(success).fail(fail);
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
 * @see https://nhnent.github.io/tui.chart/latest/tui.chart.html
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
 * @see https://nhnent.github.io/tui.chart/latest/tui.chart.html
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
 */
function parseURL2ChartData(url, callback) {
    var success = function success(code) {
        var chartData = parseDSV2ChartData(code);

        callback(chartData);
    };
    var fail = function fail() {
        return callback(null);
    };

    $.get(url).done(success).fail(fail);
}

/**
 * parse option code
 * @param {string} optionCode - option code
 * @returns {Object} - tui.chart option string
 * @see https://nhnent.github.io/tui.chart/latest/tui.chart.html
 */
function parseCode2ChartOption(optionCode) {
    var reservedKeys = ['type', 'url'];
    var options = {};
    if (util.isUndefined(optionCode)) {
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
        if (util.inArray(topKey, reservedKeys) >= 0) {
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
 */
function trimKeepingTabs(code) {
    return code.replace(/(^(\s*[\n\r])+)|([\n\r]+\s*$)/g, '');
}

/**
 * test given string is numeric
 * @param {string} str - string to be tested
 * @returns {boolean} - true for numeric string
 */
function isNumeric(str) {
    return !isNaN(str) && isFinite(str);
}

/**
 * set default options
 * @param {Object} options - tui.chart options
 * @param {HTMLElement} chartContainer - chart container
 * @returns {Object} - options
 * @see https://nhnent.github.io/tui.chart/latest/tui.chart.html
 */
function setDefaultOptions(options, chartContainer) {
    options = util.extend({
        editorChart: {},
        chart: {},
        chartExportMenu: {}
    }, options);

    var _options$chart = options.chart,
        width = _options$chart.width,
        height = _options$chart.height;

    var isWidthUndefined = util.isUndefined(width);
    var isHeightUndefined = util.isUndefined(height);
    if (isWidthUndefined || isHeightUndefined) {
        // if no width or height specified, set width and height to container width
        var _chartContainer$getBo = chartContainer.getBoundingClientRect(),
            containerWidth = _chartContainer$getBo.width;

        options.chart.width = isWidthUndefined ? containerWidth : width;
        options.chart.height = isHeightUndefined ? containerWidth : height;
    }

    options.editorChart.type = options.editorChart.type ? options.editorChart.type + 'Chart' : 'columnChart';
    options.chartExportMenu.visible = options.chartExportMenu.visible || false;

    return options;
}

/**
 * replace html from chart data
 * @param {string} codeBlockChartDataAndOptions - chart data text
 * @returns {string} - rendered html
 */
function chartReplacer(codeBlockChartDataAndOptions) {
    var randomId = 'chart-' + Math.random().toString(36).substr(2, 10);
    var renderedHTML = '<div id="' + randomId + '" class="chart" />';

    window.setTimeout(function () {
        var chartContainer = document.querySelector('#' + randomId);
        try {
            parseCode2DataAndOptions(codeBlockChartDataAndOptions, function (_ref) {
                var data = _ref.data,
                    options = _ref.options;

                options = setDefaultOptions(options, chartContainer);

                var chartType = options.editorChart.type;
                if (SUPPORTED_CHART_TYPES.indexOf(chartType) < 0) {
                    chartContainer.innerHTML = 'invalid chart type. type: bar, column, line, area, pie';
                } else if (CATEGORY_CHART_TYPES.indexOf(chartType) > -1 && data.categories.length !== data.series[0].data.length) {
                    chartContainer.innerHTML = 'invalid chart data';
                } else {
                    chart[chartType](chartContainer, data, options);
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
 * @param {[][]} arr - 2d array
 * @returns {[]} - TSV row array
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
            key: 'convertToCodeblock',

            /**
             * Wrap table nodes into code block as TSV
             * @memberof WwCodeBlockManager
             * @param {Array.<Node>} nodes Node array
             * @returns {HTMLElement} Code block element
             */
            value: function convertToCodeblock(nodes) {
                if (nodes.length !== 1 || nodes[0].tagName !== 'TABLE') {
                    return _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'convertToCodeblock', this).call(this, nodes);
                }

                var $codeblock = $('<pre />');
                var node = nodes.shift();

                // convert table to 2-dim array
                var cells = [].slice.call(node.rows).map(function (row) {
                    return [].slice.call(row.cells).map(function (cell) {
                        return cell.innerText.trim();
                    });
                });

                var tsvRows = _reduceToTSV(cells);
                $codeblock.append(tsvRows.reduce(function (acc, row) {
                    return acc + ('<div>' + row + '</div>');
                }, []));

                $codeblock.attr('data-te-codeblock', '');

                return $codeblock[0];
            }
        }]);

        return _class;
    }(_wwCodeBlockManager2.default));
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
function _onPasteBefore(cm, _ref2) {
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
 * @param {Object} [pluginOptions={}] - plugin options
 * @param {Array<string>} pluginOptions.languages - language names to map
 * @ignore
 */
function chartPlugin(editor) {
    var pluginOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var codeBlockManager = editor.convertor.getCodeBlockManager();
    var _pluginOptions$langua = pluginOptions.languages,
        languages = _pluginOptions$langua === undefined ? ['chart'] : _pluginOptions$langua;


    languages.forEach(function (language) {
        return codeBlockManager.setReplacer(language, chartReplacer);
    });

    // treat wysiwyg paste event
    _setWwCodeBlockManagerForChart(editor);

    // treat markdown paste event
    editor.eventManager.listen('pasteBefore', function (ev) {
        return _onPasteBefore(editor.mdEditor.cm, ev);
    });
}

_extManager2.default.defineExtension('chart', chartPlugin);

exports.parseCode2DataAndOptions = parseCode2DataAndOptions;
exports.parseURL2ChartData = parseURL2ChartData;
exports.parseCode2ChartOption = parseCode2ChartOption;
exports.parseDSV2ChartData = parseDSV2ChartData;
exports.detectDelimiter = detectDelimiter;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extManager = __webpack_require__(6);

var _extManager2 = _interopRequireDefault(_extManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_RENDERER_URL = 'http://www.plantuml.com/plantuml/png/';

/**
 * plant uml plugin
 * @param {Editor} editor - editor
 * @param {object} [options={}] - plugin options
 * @param {string} options.rendererURL - plant uml renderer url
 * @param {Array<string>} options.languages - language names to map
 * @ignore
 */
/* globals plantumlEncoder */

function plantUMLPlugin(editor) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var codeBlockManager = editor.convertor.getCodeBlockManager();
    var _options$rendererURL = options.rendererURL,
        rendererURL = _options$rendererURL === undefined ? DEFAULT_RENDERER_URL : _options$rendererURL,
        _options$languages = options.languages,
        languages = _options$languages === undefined ? ['plantuml', 'uml'] : _options$languages;

    /**
     * render html from uml
     * @param {string} umlCode - plant uml code text
     * @returns {string} - rendered html
     */

    function plantUMLReplacer(umlCode) {
        var renderedHTML = void 0;

        try {
            if (!plantumlEncoder) {
                throw new Error('plantuml-encoder dependency required');
            }
            renderedHTML = '<img src="' + rendererURL + plantumlEncoder.encode(umlCode) + '" />';
        } catch (err) {
            renderedHTML = 'Error occurred on encoding uml: ' + err.message;
        }

        return renderedHTML;
    }

    languages.forEach(function (language) {
        return codeBlockManager.setReplacer(language, plantUMLReplacer);
    });
}

_extManager2.default.defineExtension('plantUML', plantUMLPlugin);

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extManager = __webpack_require__(6);

var _extManager2 = _interopRequireDefault(_extManager);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Implements Color syntax Extension
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

var colorSyntaxRx = /\{color:(.+?)}(.*?)\{color}/g;
var colorHtmlRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)/g;
var colorHtmlCompleteRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)<\/span>/g;
var decimalColorRx = /rgb\((\d+)[, ]+(\d+)[, ]+(\d+)\)/g;

var RESET_COLOR = '#181818';

_extManager2.default.defineExtension('colorSyntax', function (editor) {
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

    if (!editor.isViewOnly() && editor.getUI().name === 'default') {
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
                var sq = wwe.getEditor();

                if (!color) {
                    return;
                }

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

                wwe.focus();
            }
        });

        initUI(editor, preset);
    }
});

/**
 * Initialize UI
 * @param {object} editor Editor instance
 * @param {Array.<string>} preset Preset for color palette
 * @ignore
 */
function initUI(editor, preset) {
    var className = 'tui-color';

    editor.eventManager.addEventType('colorButtonClicked');

    editor.getUI().toolbar.addButton({
        className: className,
        event: 'colorButtonClicked',
        tooltip: _i18n2.default.get('Text color')
    }, 4);
    var $button = editor.getUI().toolbar.$el.find('button.' + className);

    var $colorPickerContainer = $('<div />');

    var $buttonBar = $('<button type="button" class="te-apply-button">입력</button>');

    var cpOptions = {
        container: $colorPickerContainer[0]
    };

    if (preset) {
        cpOptions.preset = preset;
    }

    var colorPicker = tui.component.colorpicker.create(cpOptions);

    var selectedColor = colorPicker.getColor();

    $colorPickerContainer.append($buttonBar);

    var popup = editor.getUI().createPopup({
        header: false,
        title: false,
        content: $colorPickerContainer,
        className: 'tui-popup-color',
        $target: editor.getUI().$el,
        css: {
            'width': 'auto',
            'position': 'absolute'
        }
    });

    editor.eventManager.listen('focus', function () {
        popup.hide();
    });

    editor.eventManager.listen('colorButtonClicked', function () {
        editor.eventManager.emit('closeAllPopup');
        if (popup.isShow()) {
            popup.hide();
        } else {
            var position = $button.position();
            popup.$el.css({
                top: position.top + $button.outerHeight(true),
                left: position.left
            });
            popup.show();
            colorPicker.slider.toggle(true);
        }
    });

    editor.eventManager.listen('closeAllPopup', function () {
        popup.hide();
    });

    editor.eventManager.listen('removeEditor', function () {
        colorPicker.off('selectColor');
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

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extManager = __webpack_require__(6);

var _extManager2 = _interopRequireDefault(_extManager);

var _markerList = __webpack_require__(45);

var _markerList2 = _interopRequireDefault(_markerList);

var _markerManager = __webpack_require__(46);

var _markerManager2 = _interopRequireDefault(_markerManager);

var _wysiwygMarkerHelper = __webpack_require__(48);

var _wysiwygMarkerHelper2 = _interopRequireDefault(_wysiwygMarkerHelper);

var _viewOnlyMarkerHelper = __webpack_require__(47);

var _viewOnlyMarkerHelper2 = _interopRequireDefault(_viewOnlyMarkerHelper);

var _markdownMarkerHelper = __webpack_require__(44);

var _markdownMarkerHelper2 = _interopRequireDefault(_markdownMarkerHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Implements mark extension for making text marker
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

var _tui = tui,
    util = _tui.util;


var MARKER_UPDATE_DELAY = 100;
var FIND_CRLF_RX = /(\n)|(\r\n)|(\r)/g;

/**
 * Mark Extension
 * Define marker extension
 */
_extManager2.default.defineExtension('mark', function (editor) {
    var ml = new _markerList2.default();
    var mm = new _markerManager2.default(ml);
    var wmh = void 0,
        mmh = void 0,
        vmh = void 0;

    editor.eventManager.addEventType('markerUpdated');

    if (editor.isViewOnly()) {
        vmh = new _viewOnlyMarkerHelper2.default(editor.preview);
    } else {
        wmh = new _wysiwygMarkerHelper2.default(editor.getSquire());
        mmh = new _markdownMarkerHelper2.default(editor.getCodeMirror());
    }

    /**
     * getHelper
     * Get helper for current situation
     * @returns {object} helper
     */
    function getHelper() {
        var helper = void 0;

        if (editor.isViewOnly()) {
            helper = vmh;
        } else if (editor.isWysiwygMode()) {
            helper = wmh;
        } else {
            helper = mmh;
        }

        return helper;
    }

    /**
     * Update mark when resizing
     */
    function updateMarkWhenResizing() {
        var helper = getHelper();

        ml.getAll().forEach(function (marker) {
            helper.updateMarkerWithExtraInfo(marker);
        });

        editor.eventManager.emit('markerUpdated', ml.getAll());
    }

    // We need to update marker after window have been resized
    $(window).on('resize', updateMarkWhenResizing);

    editor.on('removeEditor', function () {
        $(window).off('resize', updateMarkWhenResizing);
    });

    // Reset marker content after set value
    editor.on('setMarkdownAfter', function () {
        var helper = getHelper();
        mm.resetContent(helper.getTextContent());
    });

    /**
     * setValueWithMarkers
     * Set value with markers
     * @param {string} value markdown content
     * @param {object} markerDataCollection marker data that obtain with exportMarkers method
     * @returns {Array.<object>} markers
     */
    editor.setValueWithMarkers = function (value, markerDataCollection) {
        var helper = void 0;

        ml.resetMarkers();

        markerDataCollection.forEach(function (markerData) {
            ml.addMarker(markerData.start, markerData.end, markerData.id);
        });

        editor.setValue(value);

        mm.resetContent(value.replace(FIND_CRLF_RX, ''));

        if (editor.isViewOnly() || editor.isWysiwygMode()) {
            helper = getHelper();
            mm.updateMarkersByContent(helper.getTextContent());
        } else {
            helper = mmh;
        }

        ml.getAll().forEach(function (marker) {
            helper.updateMarkerWithExtraInfo(marker);
        });

        editor.eventManager.emit('markerUpdated', ml.getAll());

        return ml.getAll();
    };

    /**
     * getMarker
     * Get markers that have given id
     * @param {string} id id of marker
     * @returns {object}
     */
    editor.getMarker = function (id) {
        return ml.getMarker(id);
    };

    /**
     * getMarkersAll
     * Get all markers
     * @returns {Array.<object>}
     */
    editor.getMarkersAll = function () {
        return ml.getAll();
    };

    /**
     * removeMarker
     * Remove marker with given id
     * @param {string} id of marker that should be removed
     * @returns {marker} removed marker
     */
    editor.removeMarker = function (id) {
        return ml.removeMarker(id);
    };

    /**
     * getMarkersData
     * Get marker data to export so you can restore markers next time
     * @returns {object} markers data
     */
    editor.exportMarkers = function () {
        var markersData = void 0;

        if (editor.isMarkdownMode()) {
            markersData = ml.getMarkersData();
        } else if (editor.isViewOnly() || editor.isWysiwygMode()) {
            mm.updateMarkersByContent(editor.getValue().replace(FIND_CRLF_RX, ''));
            markersData = ml.getMarkersData();
            mm.updateMarkersByContent(getHelper().getTextContent());
        }

        return markersData;
    };

    /**
     * selectMarker
     * Make selection with marker that have given id
     * @param {string} id id of marker
     */
    editor.selectMarker = function (id) {
        var helper = getHelper();
        var marker = editor.getMarker(id);

        if (marker) {
            helper.selectOffsetRange(marker.start, marker.end);
        }
    };

    /**
     * addMarker
     * Add Marker with given id
     * if you pass just id then it uses current selection for marker
     * or you can pass start and end offset for marker
     * @param {number|string} start start offset or id
     * @param {number} end end offset
     * @param {string} id id of marker
     * @returns {object} marker that have made
     */
    editor.addMarker = function (start, end, id) {
        var marker = void 0;
        var helper = getHelper();

        if (!id) {
            id = start;
            marker = helper.getMarkerInfoOfCurrentSelection();
        } else {
            marker = {
                start: start,
                end: end
            };

            marker = helper.updateMarkerWithExtraInfo(marker);
        }

        if (marker) {
            marker.id = id;
            marker = ml.addMarker(marker);
            ml.sortBy('end');
            editor.eventManager.emit('markerUpdated', [marker]);
        }

        return marker;
    };

    /**
     * clearSelect
     * Clear selection
     */
    editor.clearSelect = function () {
        getHelper().clearSelect();
    };

    if (!editor.isViewOnly()) {
        editor.on('changeMode', function () {
            editor._updateMarkers();
        });

        editor.on('change', util.debounce(function () {
            editor._updateMarkers();
        }, MARKER_UPDATE_DELAY));

        /**
         * _updateMarkers
         * Update markers with current text content
         */
        editor._updateMarkers = function () {
            var helper = getHelper();

            if (!ml.getAll().length) {
                return;
            }

            mm.updateMarkersByContent(helper.getTextContent());

            ml.getAll().forEach(function (marker) {
                helper.updateMarkerWithExtraInfo(marker);
            });

            editor.eventManager.emit('markerUpdated', ml.getAll());
        };
    }
});

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extManager = __webpack_require__(6);

var _extManager2 = _interopRequireDefault(_extManager);

var _mergedTableCreator = __webpack_require__(54);

var _mergedTableCreator2 = _interopRequireDefault(_mergedTableCreator);

var _tableUnmergePreparer = __webpack_require__(58);

var _tableUnmergePreparer2 = _interopRequireDefault(_tableUnmergePreparer);

var _toMarkRenderer = __webpack_require__(59);

var _toMarkRenderer2 = _interopRequireDefault(_toMarkRenderer);

var _wwMergedTableManager = __webpack_require__(61);

var _wwMergedTableManager2 = _interopRequireDefault(_wwMergedTableManager);

var _wwMergedTableSelectionManager = __webpack_require__(62);

var _wwMergedTableSelectionManager2 = _interopRequireDefault(_wwMergedTableSelectionManager);

var _mergedTableAddRow = __webpack_require__(52);

var _mergedTableAddRow2 = _interopRequireDefault(_mergedTableAddRow);

var _mergedTableAddCol = __webpack_require__(51);

var _mergedTableAddCol2 = _interopRequireDefault(_mergedTableAddCol);

var _mergedTableRemoveRow = __webpack_require__(56);

var _mergedTableRemoveRow2 = _interopRequireDefault(_mergedTableRemoveRow);

var _mergedTableRemoveCol = __webpack_require__(55);

var _mergedTableRemoveCol2 = _interopRequireDefault(_mergedTableRemoveCol);

var _mergedTableAlignCol = __webpack_require__(53);

var _mergedTableAlignCol2 = _interopRequireDefault(_mergedTableAlignCol);

var _mergeCell = __webpack_require__(50);

var _mergeCell2 = _interopRequireDefault(_mergeCell);

var _unmergeCell = __webpack_require__(60);

var _unmergeCell2 = _interopRequireDefault(_unmergeCell);

var _mergedTableUI = __webpack_require__(57);

var _mergedTableUI2 = _interopRequireDefault(_mergedTableUI);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Implements tableExtension.
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

__webpack_require__(49);

_extManager2.default.defineExtension('tableExtension', function (editor) {
    var eventManager = editor.eventManager;


    editor.toMarkOptions = editor.toMarkOptions || {};
    editor.toMarkOptions.renderer = _toMarkRenderer2.default;
    _bindEvents(eventManager);

    if (editor.isViewOnly()) {
        return;
    }

    var wwComponentManager = editor.wwEditor.componentManager;
    var popupTableUtils = editor._ui.popupTableUtils;


    _addCommands(editor);
    _changeWysiwygManagers(wwComponentManager);

    if (editor._ui.popupTableUtils) {
        _mergedTableUI2.default.updateContextMenu(popupTableUtils, eventManager, wwComponentManager.getManager('tableSelection'));
    }
});

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
    var $tempDiv = $('<div>' + html + '</div>');
    var $tables = $tempDiv.find('table');

    if ($tables.length) {
        $tables.get().forEach(function (tableElement) {
            var changedTableElement = onChangeTable(tableElement);

            $(tableElement).replaceWith(changedTableElement);
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

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @fileoverview Implements Task counter
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

var extManager = __webpack_require__(6);

var FIND_TASK_RX = /^\s*\* \[[xX ]\] [^\n]*/mg;
var FIND_CHECKED_TASK_RX = /^\s*\* \[[xX]\] [^\n]*/mg;

extManager.defineExtension('taskCounter', function (editor) {
    editor.getTaskCount = function () {
        var found = void 0,
            count = void 0;

        if (editor.isViewOnly()) {
            count = editor.preview.$el.find('.task-list-item').length;
        } else if (editor.isMarkdownMode()) {
            found = editor.mdEditor.getValue().match(FIND_TASK_RX);
            count = found ? found.length : 0;
        } else {
            count = editor.wwEditor.get$Body().find('.task-list-item').length;
        }

        return count;
    };

    editor.getCheckedTaskCount = function () {
        var found = void 0,
            count = void 0;

        if (editor.isViewOnly()) {
            count = editor.preview.$el.find('.task-list-item.checked').length;
        } else if (editor.isMarkdownMode()) {
            found = editor.mdEditor.getValue().match(FIND_CHECKED_TASK_RX);
            count = found ? found.length : 0;
        } else {
            count = editor.wwEditor.get$Body().find('.task-list-item.checked').length;
        }

        return count;
    };
});

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview Implements CodeBlockManager
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

var _window = window,
    hljs = _window.hljs;

/**
 * Class Code Block Manager
 */

var CodeBlockManager = function () {

    /**
     * Creates an instance of CodeBlockManager.
     * @memberof CodeBlockManager
     */
    function CodeBlockManager() {
        _classCallCheck(this, CodeBlockManager);

        this._supportedLanguages = hljs.listLanguages();
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
            if (this._supportedLanguages.indexOf(language) < 0) {
                this._supportedLanguages.push(language);
            }
        }

        /**
         * get replacer for code block
         * @param {string} language - code block type
         * @returns {function} - replacer function
         * @memberof CodeBlockManager
         */

    }, {
        key: 'getReplacer',
        value: function getReplacer(language) {
            return this._replacers[language];
        }

        /**
         * sets supported languages options
         * default value is what highlight js supports
         * @param {string[]} supportedLanguages - user set supported languages via options
         * @memberof CodeBlockManager
         */

    }, {
        key: 'setSupportedLanguages',
        value: function setSupportedLanguages(supportedLanguages) {
            this._supportedLanguages = supportedLanguages;
        }

        /**
         * gets supported languages
         * default value is what highlight js supports
         * supported languages by replacers will be added
         * @returns {string[]} - list of supportedLanguages
         * @memberof CodeBlockManager
         */

    }, {
        key: 'getSupportedLanguages',
        value: function getSupportedLanguages() {
            return this._supportedLanguages;
        }

        /**
         * get supported languages by highlight-js
         * @returns {Array<string>} - supported languages by highlight-js
         * @memberof CodeBlockManager
         */

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
                html = hljs.getLanguage(language) ? hljs.highlight(language, codeText).value : escape(codeText, false);
            }

            return html;
        }

        /**
         * get supported languages by highlight-js
         * @returns {Array<string>} - supported languages by highlight-js
         * @static
         */

    }], [{
        key: 'getHighlightJSLanguages',
        value: function getHighlightJSLanguages() {
            return hljs.listLanguages();
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

exports.default = CodeBlockManager;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Convertor have responsible to convert markdown and html
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _htmlSanitizer = __webpack_require__(35);

var _htmlSanitizer2 = _interopRequireDefault(_htmlSanitizer);

var _markdownitTaskPlugin = __webpack_require__(72);

var _markdownitTaskPlugin2 = _interopRequireDefault(_markdownitTaskPlugin);

var _markdownitCodeBlockPlugin = __webpack_require__(68);

var _markdownitCodeBlockPlugin2 = _interopRequireDefault(_markdownitCodeBlockPlugin);

var _markdownitCodeRenderer = __webpack_require__(69);

var _markdownitCodeRenderer2 = _interopRequireDefault(_markdownitCodeRenderer);

var _markdownitBlockQuoteRenderer = __webpack_require__(67);

var _markdownitBlockQuoteRenderer2 = _interopRequireDefault(_markdownitBlockQuoteRenderer);

var _markdownitTableRenderer = __webpack_require__(71);

var _markdownitTableRenderer2 = _interopRequireDefault(_markdownitTableRenderer);

var _markdownitHtmlBlockRenderer = __webpack_require__(70);

var _markdownitHtmlBlockRenderer2 = _interopRequireDefault(_markdownitHtmlBlockRenderer);

var _markdownitBackticksRenderer = __webpack_require__(66);

var _markdownitBackticksRenderer2 = _interopRequireDefault(_markdownitBackticksRenderer);

var _codeBlockManager = __webpack_require__(32);

var _codeBlockManager2 = _interopRequireDefault(_codeBlockManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _window = window,
    toMark = _window.toMark,
    MarkdownIt = _window.markdownit;

/**
 * Class Convertor
 */

var Convertor = function () {
    /**
     * Convertor constructor
     * @param {EventManager} em - EventManager instance
     * @param {CodeBlockManager} codeBlockManager - CodeBlockManager instance
     */
    function Convertor(em) {
        _classCallCheck(this, Convertor);

        this.eventManager = em;

        this._initMarkdownIt();
    }

    _createClass(Convertor, [{
        key: '_initMarkdownIt',
        value: function _initMarkdownIt() {
            var codeBlockManager = new _codeBlockManager2.default();
            this._codeBlockManager = codeBlockManager;
            var markdownitHighlight = new MarkdownIt({
                html: true,
                breaks: true,
                quotes: '“”‘’',
                langPrefix: 'lang-',
                highlight: function highlight(codeText, type) {
                    return codeBlockManager.createCodeBlockHtml(type, codeText);
                }
            });
            var markdownit = new MarkdownIt({
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
            this._markdownitHighlight = markdownitHighlight;

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
            this._markdownit = markdownit;
        }

        /**
         * _markdownToHtmlWithCodeHighlight
         * Convert markdown to html with Codehighlight
         * @private
         * @memberof Convertor
         * @param {string} markdown markdown text
         * @returns {string} html text
         */

    }, {
        key: '_markdownToHtmlWithCodeHighlight',
        value: function _markdownToHtmlWithCodeHighlight(markdown) {
            markdown = markdown.replace(/<br>/ig, '<br data-tomark-pass>');
            // eslint-disable-next-line
            var onerrorStripeRegex = /(<img[^>]*)(onerror\s*=\s*[\"']?[^\"']*[\"']?)(.*)/i;
            while (onerrorStripeRegex.exec(markdown)) {
                markdown = markdown.replace(onerrorStripeRegex, '$1$3');
            }

            var renderedHTML = this._markdownitHighlight.render(markdown);
            renderedHTML = this._removeBrToMarkPassAttributeInCode(renderedHTML);

            return renderedHTML;
        }

        /**
         * _markdownToHtml
         * Convert markdown to html
         * @private
         * @memberof Convertor
         * @param {string} markdown markdown text
         * @returns {string} html text
         */

    }, {
        key: '_markdownToHtml',
        value: function _markdownToHtml(markdown) {
            markdown = markdown.replace(/<br>/ig, '<br data-tomark-pass>');
            // eslint-disable-next-line
            var onerrorStripeRegex = /(<img[^>]*)(onerror\s*=\s*[\"']?[^\"']*[\"']?)(.*)/i;
            while (onerrorStripeRegex.exec(markdown)) {
                markdown = markdown.replace(onerrorStripeRegex, '$1$3');
            }

            var renderedHTML = this._markdownit.render(markdown);
            renderedHTML = this._removeBrToMarkPassAttributeInCode(renderedHTML);

            return renderedHTML;
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
            var $wrapperDiv = $('<div />');

            $wrapperDiv.html(renderedHTML);

            $wrapperDiv.find('code, pre').each(function (i, codeOrPre) {
                var $code = $(codeOrPre);
                $code.html($code.html().replace(/&lt;br data-tomark-pass&gt;/, '&lt;br&gt;'));
            });

            renderedHTML = $wrapperDiv.html();

            return renderedHTML;
        }

        /**
         * toHTMLWithCodeHightlight
         * Convert markdown to html with Codehighlight
         * emit convertorAfterMarkdownToHtmlConverted
         * @memberof Convertor
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
         * @memberof Convertor
         * @param {string} markdown markdown text
         * @returns {string} html text
         */

    }, {
        key: 'toHTML',
        value: function toHTML(markdown) {
            var html = this._markdownToHtml(markdown);

            html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);

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
         * toMarkdown
         * Convert html to markdown
         * emit convertorAfterHtmlToMarkdownConverted
         * @memberof Convertor
         * @param {string} html html text
         * @param {object | null} toMarkOptions - toMark library options
         * @returns {string} markdown text
         */

    }, {
        key: 'toMarkdown',
        value: function toMarkdown(html, toMarkOptions) {
            var resultArray = [];

            html = this.eventManager.emitReduce('convertorBeforeHtmlToMarkdownConverted', html);

            var markdown = toMark(this._appendAttributeForBrIfNeed(html), toMarkOptions);

            markdown = this.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', markdown);

            tui.util.forEach(markdown.split('\n'), function (line, index) {
                var FIND_TABLE_RX = /^\|[^|]*\|/ig;
                var FIND_CODE_RX = /`[^`]*<br>[^`]*`/ig;

                if (!FIND_CODE_RX.test(line) && !FIND_TABLE_RX.test(line)) {
                    line = line.replace(/<br>/ig, '<br>\n');
                }
                resultArray[index] = line;
            });

            return resultArray.join('\n');
        }
    }, {
        key: '_appendAttributeForBrIfNeed',
        value: function _appendAttributeForBrIfNeed(html) {
            var FIND_BR_RX = /<br>/ig;
            var FIND_DOUBLE_BR_RX = /<br \/><br \/>/ig;
            var FIND_PASSING_AND_NORMAL_BR_RX = /<br data-tomark-pass \/><br \/>(.)/ig;
            var FIRST_TWO_BRS_BEFORE_RX = /([^>]|<\/b>|<\/i>|<\/s>|<img [^>]*>)/;
            var TWO_BRS_RX = /<br data-tomark-pass \/><br data-tomark-pass \/>/;
            var FIND_FIRST_TWO_BRS_RX = new RegExp(FIRST_TWO_BRS_BEFORE_RX.source + TWO_BRS_RX.source, 'g');

            html = html.replace(FIND_BR_RX, '<br />');

            html = html.replace(FIND_DOUBLE_BR_RX, '<br data-tomark-pass /><br data-tomark-pass />');

            var div = document.createElement('div');
            var $div = $(div);
            $div.html(html);
            $div.find('pre br,code br').each(function (index, node) {
                if (node.hasAttribute('data-tomark-pass')) {
                    node.removeAttribute('data-tomark-pass');
                }
            });

            html = $div.html().replace(/<br data-tomark-pass="">/ig, '<br data-tomark-pass />');
            html = html.replace(FIND_BR_RX, '<br />');

            html = html.replace(FIND_PASSING_AND_NORMAL_BR_RX, '<br data-tomark-pass /><br data-tomark-pass />$1');
            html = html.replace(FIND_FIRST_TWO_BRS_RX, '$1<br /><br />');

            return html;
        }

        /**
         * get markdownit with code highlight
         * @returns {markdownit} - markdownit instance
         * @memberof Convertor
         */

    }, {
        key: 'getMarkdownHighlightRenderer',
        value: function getMarkdownHighlightRenderer() {
            return this._markdownitHighlight;
        }

        /**
         * set markdownit instance
         * @param {markdownit} markdownitHighlight - markdownit instance
         * @memberof Convertor
         */

    }, {
        key: 'setMarkdownHighlightRenderer',
        value: function setMarkdownHighlightRenderer(markdownitHighlight) {
            markdownitHighlight.set({
                html: true,
                breaks: true,
                quotes: '“”‘’',
                langPrefix: 'lang-'
            });
            this._markdownitHighlight = markdownitHighlight;
        }

        /**
         * get CodeBlockManager
         * @returns {CodeBlockManager} - CodeBlockManager instance
         * @memberof Convertor
         */

    }, {
        key: 'getCodeBlockManager',
        value: function getCodeBlockManager() {
            return this._codeBlockManager;
        }
    }]);

    return Convertor;
}();

module.exports = Convertor;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview Implements EventManager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */
var _tui = tui,
    util = _tui.util;


var eventList = ['previewBeforeHook', 'previewRenderAfter', 'previewNeedsRefresh', 'addImageBlobHook', 'setMarkdownAfter', 'contentChangedFromWysiwyg', 'changeFromWysiwyg', 'contentChangedFromMarkdown', 'changeFromMarkdown', 'change', 'changeModeToWysiwyg', 'changeModeToMarkdown', 'changeModeBefore', 'changeMode', 'changePreviewStyle', 'openPopupAddLink', 'openPopupAddImage', 'openPopupAddTable', 'openPopupTableUtils', 'openHeadingSelect', 'openPopupCodeBlockLanguages', 'openPopupCodeBlockEditor', 'closePopupCodeBlockLanguages', 'closePopupCodeBlockEditor', 'closeAllPopup', 'command', 'addCommandBefore', 'htmlUpdate', 'markdownUpdate', 'renderedHtmlUpdated', 'removeEditor', 'convertorAfterMarkdownToHtmlConverted', 'convertorBeforeHtmlToMarkdownConverted', 'convertorAfterHtmlToMarkdownConverted', 'stateChange', 'wysiwygSetValueAfter', 'wysiwygSetValueBefore', 'wysiwygGetValueBefore', 'wysiwygProcessHTMLText', 'wysiwygRangeChangeAfter', 'wysiwygKeyEvent', 'scroll', 'click', 'mousedown', 'mouseover', 'mouseout', 'mouseup', 'contextmenu', 'keydown', 'keyup', 'keyMap', 'load', 'focus', 'blur', 'paste', 'pasteBefore', 'willPaste', 'copy', 'copyBefore', 'copyAfter', 'cut', 'cutAfter', 'drop', 'show', 'hide'];

/**
 * Class EventManager
 */

var EventManager = function () {
    /**
     * Creates an instance of EventManager.
     * @memberof EventManager
     */
    function EventManager() {
        _classCallCheck(this, EventManager);

        this.events = new util.Map();
        this.TYPE = new util.Enum(eventList);
    }

    /**
     * Listen event and bind event handler
     * @memberof EventManager
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
         * @memberof EventManager
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
                util.forEach(eventHandlers, function (handler) {
                    var result = handler.apply(undefined, args);

                    if (!util.isUndefined(result)) {
                        results = results || [];
                        results.push(result);
                    }
                });
            }

            return results;
        }

        /**
         * Emit given event and return result
         * @memberof EventManager
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
                util.forEach(eventHandlers, function (handler) {
                    var result = handler.apply(undefined, args);

                    if (!util.isFalsy(result)) {
                        args[0] = result;
                    }
                });
            }

            return args[0];
        }

        /**
         * Get event type and namespace
         * @memberof EventManager
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
            return !util.isUndefined(this.TYPE[this._getTypeInfo(type).type]);
        }

        /**
         * Add event type when given event not exists
         * @memberof EventManager
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
         * @memberof EventManager
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
         * @memberof EventManager
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
         * @memberof EventManager
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
            });

            this.events.set(type, handlersToSurvive);
        }
    }]);

    return EventManager;
}();

module.exports = EventManager;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * @fileoverview Implements htmlSanitizer
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

var _tui = tui,
    util = _tui.util;


var HTML_ATTR_LIST_RX = new RegExp('^(abbr|align|alt|axis|bgcolor|border|cellpadding|cellspacing|class|clear|' + 'color|cols|compact|coords|dir|face|headers|height|hreflang|hspace|' + 'ismap|lang|language|nohref|nowrap|rel|rev|rows|rules|' + 'scope|scrolling|shape|size|span|start|summary|tabindex|target|title|type|' + 'valign|value|vspace|width|checked|mathvariant|encoding|id|name|' + 'background|cite|href|longdesc|src|usemap|xlink:href|data-+|checked|style)', 'g');

var SVG_ATTR_LIST_RX = new RegExp('^(accent-height|accumulate|additive|alphabetic|arabic-form|ascent|' + 'baseProfile|bbox|begin|by|calcMode|cap-height|class|color|color-rendering|content|' + 'cx|cy|d|dx|dy|descent|display|dur|end|fill|fill-rule|font-family|font-size|font-stretch|' + 'font-style|font-variant|font-weight|from|fx|fy|g1|g2|glyph-name|gradientUnits|hanging|' + 'height|horiz-adv-x|horiz-origin-x|ideographic|k|keyPoints|keySplines|keyTimes|lang|' + 'marker-end|marker-mid|marker-start|markerHeight|markerUnits|markerWidth|mathematical|' + 'max|min|offset|opacity|orient|origin|overline-position|overline-thickness|panose-1|' + 'path|pathLength|points|preserveAspectRatio|r|refX|refY|repeatCount|repeatDur|' + 'requiredExtensions|requiredFeatures|restart|rotate|rx|ry|slope|stemh|stemv|stop-color|' + 'stop-opacity|strikethrough-position|strikethrough-thickness|stroke|stroke-dasharray|' + 'stroke-dashoffset|stroke-linecap|stroke-linejoin|stroke-miterlimit|stroke-opacity|' + 'stroke-width|systemLanguage|target|text-anchor|to|transform|type|u1|u2|underline-position|' + 'underline-thickness|unicode|unicode-range|units-per-em|values|version|viewBox|visibility|' + 'width|widths|x|x-height|x1|x2|xlink:actuate|xlink:arcrole|xlink:role|xlink:show|xlink:title|' + 'xlink:type|xml:base|xml:lang|xml:space|xmlns|xmlns:xlink|y|y1|y2|zoomAndPan)', 'g');

/**
 * htmlSanitizer
 * @param {string|Node} html html or Node
 * @param {boolean} [needHtmlText] pass true if need html text
 * @returns {string|DocumentFragment} result
 * @ignore
 */
function htmlSanitizer(html, needHtmlText) {
    var $html = $('<div />');

    html = html.replace(/<!--[\s\S]*?-->/g, '');

    $html.append(html);

    removeUnnecessaryTags($html);
    leaveOnlyWhitelistAttribute($html);

    return finalizeHtml($html, needHtmlText);
}

/**
 * Remove unnecessary tags
 * @private
 * @param {jQuery} $html jQuery instance
 */
function removeUnnecessaryTags($html) {
    $html.find('script, iframe, textarea, form, button, select, meta, style, link, title').remove();
}

/**
 * Leave only white list attributes
 * @private
 * @param {jQuery} $html jQuery instance
 */
function leaveOnlyWhitelistAttribute($html) {
    $html.find('*').each(function (index, node) {
        var blacklist = util.toArray(node.attributes).filter(function (attr) {
            var isHTMLAttr = attr.name.match(HTML_ATTR_LIST_RX);
            var isSVGAttr = attr.name.match(SVG_ATTR_LIST_RX);

            return !isHTMLAttr && !isSVGAttr;
        });

        util.forEachArray(blacklist, function (attr) {
            node.attributes.removeNamedItem(attr.name);
        });
    });
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
        var childNodes = tui.util.toArray($html[0].childNodes);
        var length = childNodes.length;


        for (var i = 0; i < length; i += 1) {
            frag.appendChild(childNodes[i]);
        }
        returnValue = frag;
    }

    return returnValue;
}

module.exports = htmlSanitizer;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _preview = __webpack_require__(37);

var _preview2 = _interopRequireDefault(_preview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Class Markdown Preview
 * @extends {Preview}
 */
var MarkdownPreview = function (_Preview) {
    _inherits(MarkdownPreview, _Preview);

    /**
     * Creates an instance of MarkdownPreview.
     * @param {jQuery} $el - base jQuery element
     * @param {EventManager} eventManager - event manager
     * @param {Convertor} convertor - convertor
     * @param {boolean} isViewOnly - true for view only mode
     * @memberof MarkdownPreview
     */
    function MarkdownPreview($el, eventManager, convertor, isViewOnly) {
        _classCallCheck(this, MarkdownPreview);

        var _this = _possibleConstructorReturn(this, (MarkdownPreview.__proto__ || Object.getPrototypeOf(MarkdownPreview)).call(this, $el, eventManager, convertor, isViewOnly));

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
                    _this2.lazyRunner.run('refresh', latestMarkdownValue.replace(/<br>\n/g, '<br>'));
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
         * @memberof MarkdownPreview
         * @override
         */

    }, {
        key: 'render',
        value: function render(html) {
            _get(MarkdownPreview.prototype.__proto__ || Object.getPrototypeOf(MarkdownPreview.prototype), 'render', this).call(this, html);

            this.eventManager.emit('previewRenderAfter', this);
        }
    }]);

    return MarkdownPreview;
}(_preview2.default);

exports.default = MarkdownPreview;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _lazyRunner = __webpack_require__(65);

var _lazyRunner2 = _interopRequireDefault(_lazyRunner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class Preview
 **/
var Preview = function () {
  /**
   * Creates an instance of Preview.
   * @param {jQuery} $el Container element for preview
   * @param {EventManager} eventManager Event manager instance
   * @param {Convertor} convertor Convertor instance
   * @param {boolean} isViewOnly - whether viewOnly mode or not
   * @memberof Preview
   */
  function Preview($el, eventManager, convertor, isViewOnly) {
    _classCallCheck(this, Preview);

    this.eventManager = eventManager;
    this.convertor = convertor;
    this.$el = $el;
    this.isViewOnly = !!isViewOnly;

    this._initContentSection();

    this.lazyRunner = new _lazyRunner2.default();

    this.lazyRunner.registerLazyRunFunction('refresh', this.refresh, 800, this);
  }

  /**
   * Initialize content selection
   * @private
   */


  _createClass(Preview, [{
    key: '_initContentSection',
    value: function _initContentSection() {
      this._$previewContent = $('<div class="tui-editor-contents" />');
      this.$el.append(this._$previewContent);
    }

    /**
     * Refresh rendering
     * @memberof Preview
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
     * @memberof Preview
     */

  }, {
    key: 'getHTML',
    value: function getHTML() {
      return this._$previewContent.html();
    }

    /**
     * set html string
     * @param {string} html - html preview string
     * @memberof Preview
     */

  }, {
    key: 'setHTML',
    value: function setHTML(html) {
      this._$previewContent.html(html);
    }

    /**
     * Render HTML on preview
     * @memberof Preview
     * @param {string} html HTML string
     * @protected
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
     * @memberof Preview
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
     * @memberof Preview
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

module.exports = Preview;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg p manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _domUtils = __webpack_require__(1);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _tui = tui,
    util = _tui.util;


var tagEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};

var FIND_ZWS_RX = /\u200B/g;
var CODEBLOCK_ATTR_NAME = 'data-te-codeblock';

/**
 * Class WwCodeBlockManager
 */

var WwCodeBlockManager = function () {
    /**
     * Creates an instance of WwCodeBlockManager.
     * @param {WysiwygEditor} wwe - wysiwygEditor instance
     * @memberof WwCodeBlockManager
     */
    function WwCodeBlockManager(wwe) {
        _classCallCheck(this, WwCodeBlockManager);

        this.wwe = wwe;
        this.eventManager = wwe.eventManager;

        /**
         * Name property
         * @memberof WwCodeBlockManager#
         * @type {string}
         */
        this.name = 'codeblock';

        this._init();
    }
    /**
     * _init
     * Initialize
     * @memberof WwCodeBlockManager
     * @private
     */


    _createClass(WwCodeBlockManager, [{
        key: '_init',
        value: function _init() {
            this._initKeyHandler();
            this._initEvent();
        }

        /**
         * _initKeyHandler
         * Initialize key event handler
         * @memberof WwCodeBlockManager
         * @private
         */

    }, {
        key: '_initKeyHandler',
        value: function _initKeyHandler() {
            this.wwe.addKeyEventHandler('BACK_SPACE', this._removeCodeblockIfNeed.bind(this));
        }

        /**
         * _initEvent
         * Initialize eventmanager event
         * @memberof WwCodeBlockManager
         * @private
         */

    }, {
        key: '_initEvent',
        value: function _initEvent() {
            var self = this;

            this.eventManager.listen('wysiwygSetValueAfter', function () {
                self.splitCodeblockToEachLine();
            });

            this.eventManager.listen('wysiwygProcessHTMLText', function (html) {
                return self._mergeCodeblockEachlinesFromHTMLText(html);
            });
        }

        /**
         * Convert copied nodes to code block if need
         * @memberof WwCodeBlockManager
         * @param {Array.<Node>} nodes Node array
         * @returns {DocumentFragment}
         */

    }, {
        key: 'prepareToPasteOnCodeblock',
        value: function prepareToPasteOnCodeblock(nodes) {
            var range = this.wwe.getEditor().getSelection().cloneRange();
            var frag = this.wwe.getEditor().getDocument().createDocumentFragment();

            if (nodes.length === 1 && this._isCodeBlock(nodes[0])) {
                frag.appendChild(this._copyCodeblockTypeFromRangeCodeblock(nodes.shift(), range));
            } else {
                frag.appendChild(this._copyCodeblockTypeFromRangeCodeblock(this.convertToCodeblock(nodes), range));
            }

            return frag;
        }

        /**
         * Wrap nodes into code block
         * @memberof WwCodeBlockManager
         * @param {Array.<Node>} nodes Node array
         * @returns {HTMLElement} Code block element
         */

    }, {
        key: 'convertToCodeblock',
        value: function convertToCodeblock(nodes) {
            var $codeblock = $('<pre />');
            var self = this;
            var node = nodes.shift();

            while (util.isTruthy(node)) {
                $codeblock.append(self._makeCodeBlockLineHtml(util.isString(node) ? node : node.textContent));
                node = nodes.shift();
            }

            $codeblock.attr(CODEBLOCK_ATTR_NAME, '');

            return $codeblock[0];
        }

        /**
         * Copy content with code block style from code block selection
         * @memberof WwCodeBlockManager
         * @param {HTMLElement} element Copied element
         * @param {Range} range Range object
         * @returns {HTMLElement}
         * @private
         */

    }, {
        key: '_copyCodeblockTypeFromRangeCodeblock',
        value: function _copyCodeblockTypeFromRangeCodeblock(element, range) {
            var blockNode = _domUtils2.default.getParentUntil(range.commonAncestorContainer, this.wwe.get$Body()[0]);

            if (_domUtils2.default.getNodeName(blockNode) === 'PRE') {
                var attrs = $(blockNode).prop('attributes');

                util.forEach(attrs, function (attr) {
                    $(element).attr(attr.name, attr.value);
                });
            }

            return element;
        }

        /**
         * Merge code block lines
         * @memberof WwCodeBlockManager
         * @param {string} html HTML string
         * @returns {string}
         * @private
         */

    }, {
        key: '_mergeCodeblockEachlinesFromHTMLText',
        value: function _mergeCodeblockEachlinesFromHTMLText(html) {
            html = html.replace(/<pre( .*?)?>(.*?)<\/pre>/g, function (match, codeAttr, code) {
                code = code.replace(/<br \/>/g, '\n');
                code = code.replace(/<div ?(.*?)>/g, '');
                code = code.replace(/\n$/, '');

                return '<pre><code' + (codeAttr || '') + '>' + code + '</code></pre>';
            });

            return html;
        }

        /**
         * Split code block to lines
         * @memberof WwCodeBlockManager
         * @param {HTMLElement} node root node to find pre
         * @private
         */

    }, {
        key: 'splitCodeblockToEachLine',
        value: function splitCodeblockToEachLine(node) {
            var self = this;

            if (!node) {
                node = this.wwe.get$Body();
            }

            $(node).find('pre').each(function (index, pre) {
                var $pre = $(pre);
                var lang = $pre.find('code').attr('data-language');
                var textLines = void 0;

                // pre태그 밑에 라인으로 의심되는 요소들이 있다면
                if ($pre.children().length > 1) {
                    textLines = [];

                    $pre.children().each(function (idx, childNode) {
                        if ((childNode.nodeName === 'DIV' || childNode.nodeName === 'P') && !$(childNode).find('br').length) {
                            $(childNode).append('<br>');
                        }
                    });
                }

                $pre.find('br').replaceWith('\n');
                textLines = $pre.text().replace(/\s+$/, '').split(/\n/g);

                if (lang) {
                    $pre.attr('data-language', lang);
                    $pre.addClass('lang-' + lang);
                }

                $pre.empty();

                util.forEach(textLines, function (line) {
                    $pre.append(self._makeCodeBlockLineHtml(line));
                });

                $pre.attr(CODEBLOCK_ATTR_NAME, '');
            });
        }

        /**
         * Make code HTML text
         * @memberof WwCodeBlockManager
         * @param {string} lineContent Content text
         * @returns {string}
         * @private
         */

    }, {
        key: '_makeCodeBlockLineHtml',
        value: function _makeCodeBlockLineHtml(lineContent) {
            if (!lineContent) {
                lineContent = '<br>';
            } else {
                lineContent = sanitizeHtmlCode(lineContent);
            }

            return '<div>' + lineContent + '</div>';
        }

        /**
         * Remove codeblock if need
         * @memberof WwCodeBlockManager
         * @param {Event} ev Event object
         * @param {Range} range Range object
         * @returns {boolean}
         * @private
         */

    }, {
        key: '_removeCodeblockIfNeed',
        value: function _removeCodeblockIfNeed(ev, range) {
            var self = this;

            if (!this.isInCodeBlock(range)) {
                return true;
            }

            var pre = $(range.startContainer).closest('pre');
            var $div = $(pre).find('div').eq(0);
            var codeContent = $div.text().replace(FIND_ZWS_RX, '');

            // 코드블럭이 code한줄 밖에 없을때
            if ((range.startOffset === 0 || codeContent.length === 0) && $(pre).find('div').length <= 1) {
                this.wwe.getEditor().modifyBlocks(function () {
                    var newFrag = self.wwe.getEditor().getDocument().createDocumentFragment();
                    var content = void 0;

                    if (codeContent.length === 0) {
                        content = '<br>';
                    } else {
                        content = $div.html().replace(FIND_ZWS_RX, '');
                    }

                    $(newFrag).append($('<div>' + content + '</div>'));

                    return newFrag;
                });

                return false;
            }

            return true;
        }

        /**
         * Return boolean value of whether current range is in the code block
         * @memberof WwCodeBlockManager
         * @param {Range} range Range object
         * @returns {boolean}
         */

    }, {
        key: 'isInCodeBlock',
        value: function isInCodeBlock(range) {
            var target = void 0;

            if (range.collapsed) {
                target = range.startContainer;
            } else {
                target = range.commonAncestorContainer;
            }

            return this._isCodeBlock(target);
        }

        /**
         * Verify given element is code block
         * @memberof WwCodeBlockManager
         * @param {HTMLElement} element Element
         * @returns {boolean}
         * @private
         */

    }, {
        key: '_isCodeBlock',
        value: function _isCodeBlock(element) {
            return !!$(element).closest('pre').length;
        }
    }]);

    return WwCodeBlockManager;
}();

/**
 * Sanitize HTML code
 * @param {string} code code string
 * @returns {string}
 * @ignore
 */


function sanitizeHtmlCode(code) {
    return code.replace(/[<>&]/g, function (tag) {
        return tagEntities[tag] || tag;
    });
}

module.exports = WwCodeBlockManager;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg table manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _domUtils = __webpack_require__(1);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _tui = tui,
    util = _tui.util;

var isIE10 = util.browser.msie && util.browser.version === 10;
var TABLE_CLASS_PREFIX = 'te-content-table-';
var isIE10And11 = util.browser.msie && (util.browser.version === 10 || util.browser.version === 11);
var BASIC_CELL_CONTENT = util.browser.msie ? '' : '<br>';
var TABLE_CELL_SELECTED_CLASS_NAME = 'te-cell-selected';

/**
 * Class WwTableManager
 */

var WwTableManager = function () {
    /**
     * Creates an instance of WwTableManager.
     * @param {WysiwygEditor} wwe - WysiwygEditor instance
     * @memberof WwTableManager
     */
    function WwTableManager(wwe) {
        _classCallCheck(this, WwTableManager);

        this.wwe = wwe;
        this.eventManager = wwe.eventManager;

        /**
         * Name property
         * @memberof WwTableManager#
         * @type {string}
         */
        this.name = 'table';

        this._lastCellNode = null;
        this._init();
    }

    /**
     * _init
     * Initialize
     * @memberof WwTableManager
     * @private
     */


    _createClass(WwTableManager, [{
        key: '_init',
        value: function _init() {
            this._initKeyHandler();
            this._initEvent();
            this.tableID = 0;
        }

        /**
         * _initEvent
         * Initialize event
         * @memberof WwTableManager
         * @private
         */

    }, {
        key: '_initEvent',
        value: function _initEvent() {
            var _this = this;

            this.eventManager.listen('wysiwygRangeChangeAfter.table', function () {
                var range = _this.wwe.getEditor().getSelection();
                var isRangeInTable = _this.isInTable(range);

                _this._unwrapBlockInTable();
                _this._completeTableIfNeed();

                if (!isRangeInTable) {
                    var selectionManager = _this.wwe.componentManager.getManager('tableSelection');
                    selectionManager.removeClassAttrbuteFromAllCellsIfNeed();
                }

                _this._insertDefaultBlockBetweenTable();
            });

            this.eventManager.listen('wysiwygSetValueAfter.table', function () {
                _this._unwrapBlockInTable();
                _this._insertDefaultBlockBetweenTable();
            });

            // remove last br in td or th
            this.eventManager.listen('wysiwygProcessHTMLText.table', function (html) {
                return html.replace(/<br \/>(<\/td>|<\/th>)/g, '$1');
            });

            this.eventManager.listen('cut.table', function () {
                var selectionManager = _this.wwe.componentManager.getManager('tableSelection');
                var $selectedCells = selectionManager.getSelectedCells();

                if ($selectedCells.length) {
                    $selectedCells.get().forEach(function (cell) {
                        return $(cell).html(BASIC_CELL_CONTENT);
                    });
                }

                selectionManager.removeClassAttrbuteFromAllCellsIfNeed();
            });

            this.eventManager.listen('copyBefore.table', function (_ref) {
                var $clipboardContainer = _ref.$clipboardContainer;
                return _this.updateTableHtmlOfClipboardIfNeed($clipboardContainer);
            });

            // TODO: eventManager 사용시 preventDefault 시의 문제가 있을것으로 추정됨 (테스트 필요) - 확인하여 가능하면 eventManager를 사용하도록 작업 필요
            this.onBindedPaste = this._onPaste.bind(this);
            this.wwe.getEditor().addEventListener('paste', this.onBindedPaste);
        }

        /**
         * Update table html of clipboard data, if has selected cells.
         * @param {jQuery} $clipboardContainer - jQuery element
         */

    }, {
        key: 'updateTableHtmlOfClipboardIfNeed',
        value: function updateTableHtmlOfClipboardIfNeed($clipboardContainer) {
            var _this2 = this;

            var selectionManager = this.wwe.componentManager.getManager('tableSelection');
            var $selectedCells = selectionManager.getSelectedCells();

            if ($selectedCells.length) {
                selectionManager.createRangeBySelectedCells();

                var fragment = this.wwe.getEditor().getSelection().cloneContents();

                $(fragment).children().each(function (index, node) {
                    var $node = $(node);

                    if (!_this2.isTableOrSubTableElement(node.nodeName)) {
                        return;
                    }

                    if (node.nodeName === 'TABLE' && $node.find('thead').length === 0 && $node.find('tbody').length === 0) {
                        $node.remove();
                    } else if (node.previousSibling && node.previousSibling.nodeName === 'TABLE') {
                        node.previousSibling.appendChild(node);
                    } else {
                        _this2._completeIncompleteTable(node);

                        if (node.nodeName !== 'TABLE' && node.nodeName !== 'THEAD') {
                            $(node).closest('table').find('thead').remove();
                        }
                    }
                });

                $clipboardContainer.append(fragment);
                $clipboardContainer.find('.' + TABLE_CELL_SELECTED_CLASS_NAME).removeClass(TABLE_CELL_SELECTED_CLASS_NAME);
            }
        }

        /**
         * Paste clibpard data.
         * @param {jQuery} $clipboardTable - jQuery table element of clipboard
         */

    }, {
        key: 'pasteClipboardData',
        value: function pasteClipboardData($clipboardTable) {
            if (this.wwe.componentManager.getManager('tableSelection').getSelectedCells().length) {
                return;
            }

            this._expandTableIfNeed($clipboardTable);
            this._pasteDataIntoTable($clipboardTable);
        }

        /**
         * On paste.
         * @param {MouseEvent} ev - event
         * @private
         */

    }, {
        key: '_onPaste',
        value: function _onPaste(ev) {
            var range = this.wwe.getEditor().getSelection();
            var isNotPastingIntoTextNode = !_domUtils2.default.isTextNode(range.commonAncestorContainer);

            if (this.isInTable(range) && !range.collapsed && isNotPastingIntoTextNode) {
                ev.preventDefault();
            }
        }

        /**
         * _initKeyHandler
         * Initialize key event handler
         * @memberof WwTableManager
         * @private
         */

    }, {
        key: '_initKeyHandler',
        value: function _initKeyHandler() {
            var _this3 = this;

            this.keyEventHandlers = {
                'DEFAULT': function DEFAULT(ev, range, keymap) {
                    var isRangeInTable = _this3.isInTable(range);

                    if (isRangeInTable && !_this3._isSingleModifierKey(keymap)) {
                        _this3._recordUndoStateIfNeed(range);
                        _this3._removeBRIfNeed(range);
                        _this3._removeContentsAndChangeSelectionIfNeed(range, keymap, ev);
                    } else if (!isRangeInTable && _this3._lastCellNode) {
                        _this3._recordUndoStateAndResetCellNode(range);
                    }

                    if (isRangeInTable && !_this3._isModifierKeyPushed(ev)) {
                        _this3.wwe.getEditor().modifyDocument(function () {
                            var selectionManager = _this3.wwe.componentManager.getManager('tableSelection');
                            selectionManager.removeClassAttrbuteFromAllCellsIfNeed();
                        });
                    }
                },
                'ENTER': function ENTER(ev, range) {
                    var isNeedNext = void 0;

                    if (_this3._isAfterTable(range)) {
                        ev.preventDefault();
                        range.setStart(range.startContainer, range.startOffset - 1);
                        _this3.wwe.breakToNewDefaultBlock(range);
                        isNeedNext = false;
                    } else if (_this3._isBeforeTable(range)) {
                        ev.preventDefault();
                        _this3.wwe.breakToNewDefaultBlock(range, 'before');
                        isNeedNext = false;
                    } else if (_this3.isInTable(range)) {
                        _this3._appendBrIfTdOrThNotHaveAsLastChild(range);
                        isNeedNext = false;
                    }

                    return isNeedNext;
                },
                'BACK_SPACE': function BACK_SPACE(ev, range, keymap) {
                    return _this3._handleBackspaceAndDeleteKeyEvent(ev, range, keymap);
                },
                'DELETE': function DELETE(ev, range, keymap) {
                    return _this3._handleBackspaceAndDeleteKeyEvent(ev, range, keymap);
                },
                'TAB': function TAB() {
                    return _this3._moveCursorTo('next', 'cell');
                },
                'SHIFT+TAB': function SHIFTTAB(ev) {
                    return _this3._moveCursorTo('previous', 'cell', ev);
                },
                'UP': function UP(ev) {
                    return _this3._moveCursorTo('previous', 'row', ev);
                },
                'DOWN': function DOWN(ev) {
                    return _this3._moveCursorTo('next', 'row', ev);
                }
            };

            util.forEach(this.keyEventHandlers, function (handler, key) {
                return _this3.wwe.addKeyEventHandler(key, handler);
            });
        }

        /**
         * isInTable
         * Check whether passed range is in table or not
         * @param {Range} range range
         * @returns {boolean} result
         * @memberof WwTableManager
         */

    }, {
        key: 'isInTable',
        value: function isInTable(range) {
            var target = void 0,
                result = void 0;

            if (range.collapsed) {
                target = range.startContainer;
                result = !!$(target).closest('[contenteditable=true] table').length;
            } else {
                target = range.commonAncestorContainer;
                result = !!$(target).closest('[contenteditable=true] table').length || !!$(range.cloneContents()).find('table').length;
            }

            return result;
        }

        /**
         * _isBeforeTable
         * Check whether passed range is right before table or not
         * @param {Range} range range
         * @returns {boolean} result
         * @memberof WwTableManager
         * @private
         */

    }, {
        key: '_isBeforeTable',
        value: function _isBeforeTable(range) {
            return _domUtils2.default.getNodeName(_domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset)) === 'TABLE';
        }

        /**
         * _isAfterTable
         * Check whether passed range is right after table or not
         * @param {Range} range range
         * @returns {boolean} result
         * @memberof WwTableManager
         * @private
         */

    }, {
        key: '_isAfterTable',
        value: function _isAfterTable(range) {
            var prevElem = _domUtils2.default.getPrevOffsetNodeUntil(range.startContainer, range.startOffset);

            return _domUtils2.default.getNodeName(prevElem) === 'TABLE' && range.commonAncestorContainer === this.wwe.get$Body()[0];
        }

        /**
         * Handle backspace and delete key event
         * @param {object} ev - Event object
         * @param {Range} range - Range Object
         * @param {string} keymap - keymap
         * @returns {boolean} - need next
         * @private
         */

    }, {
        key: '_handleBackspaceAndDeleteKeyEvent',
        value: function _handleBackspaceAndDeleteKeyEvent(ev, range, keymap) {
            var isBackspace = keymap === 'BACK_SPACE';
            var selectionManager = this.wwe.componentManager.getManager('tableSelection');
            var $selectedCells = selectionManager.getSelectedCells();
            var isNeedNext = true;

            if (range.collapsed) {
                if (this.isInTable(range)) {
                    if (isBackspace) {
                        this._tableHandlerOnBackspace(range, ev);
                    } else {
                        this._tableHandlerOnDelete(range, ev);
                    }

                    this._insertBRIfNeed(range);
                    this._removeContentsAndChangeSelectionIfNeed(range, keymap, ev);
                    isNeedNext = false;
                } else if (!isBackspace && this._isBeforeTable(range) || isBackspace && this._isAfterTable(range)) {
                    ev.preventDefault();
                    var startOffset = isBackspace ? range.startOffset - 1 : range.startOffset;
                    this._removeTable(range, _domUtils2.default.getChildNodeByOffset(range.startContainer, startOffset));
                    isNeedNext = false;
                }
            } else if (this.isInTable(range)) {
                if ($selectedCells.length > 0) {
                    var removed = this._removeContentsAndChangeSelectionIfNeed(range, keymap, ev);
                    if (removed) {
                        ev.preventDefault();
                        isNeedNext = false;
                    }
                }
            }

            return isNeedNext;
        }

        /**
         * _tableHandlerOnBackspace
         * Backspace handler in table
         * @param {Range} range range
         * @param {Event} event event
         * @memberof WwTableManager
         * @private
         */

    }, {
        key: '_tableHandlerOnBackspace',
        value: function _tableHandlerOnBackspace(range, event) {
            var prevNode = _domUtils2.default.getPrevOffsetNodeUntil(range.startContainer, range.startOffset, 'TR'),
                prevNodeName = _domUtils2.default.getNodeName(prevNode);

            if (!prevNode || prevNodeName === 'TD' || prevNodeName === 'TH') {
                event.preventDefault();
            } else if (prevNodeName === 'BR' && prevNode.parentNode.childNodes.length !== 1) {
                event.preventDefault();
                $(prevNode).remove();
            }
        }
        /**
         * Return whether delete non text or not
         * @param {Range} range Range object
         * @returns {boolean}
         */

    }, {
        key: 'isNonTextDeleting',
        value: function isNonTextDeleting(range) {
            var currentElement = range.startContainer;
            var nextNode = currentElement.nextSibling;
            var nextNodeName = _domUtils2.default.getNodeName(nextNode);
            var currentNodeName = _domUtils2.default.getNodeName(currentElement);

            var isCellDeleting = currentNodeName === nextNodeName && currentNodeName !== 'TEXT';
            var isEndOfText = (!nextNode || nextNodeName === 'BR' && nextNode.parentNode.lastChild === nextNode) && _domUtils2.default.isTextNode(currentElement) && range.startOffset === currentElement.nodeValue.length;
            var isLastCellOfRow = !isEndOfText && $(currentElement).parents('tr').children().last()[0] === currentElement && (currentNodeName === 'TD' || currentNodeName === 'TH');

            return isCellDeleting || isEndOfText || isLastCellOfRow;
        }
        /**
         * _tableHandlerOnDelete
         * Delete handler in table
         * @param {Range} range range
         * @param {Event} event event
         * @memberof WwTableManager
         * @private
         */

    }, {
        key: '_tableHandlerOnDelete',
        value: function _tableHandlerOnDelete(range, event) {
            var needPreventDefault = this.isNonTextDeleting(range);

            if (needPreventDefault) {
                event.preventDefault();
                range.startContainer.normalize();
            }
        }

        /**
         * _appendBrIfTdOrThNotHaveAsLastChild
         * Append br if td or th doesn't have br as last child
         * @param {Range} range range
         * @memberof WwTableManager
         * @private
         */

    }, {
        key: '_appendBrIfTdOrThNotHaveAsLastChild',
        value: function _appendBrIfTdOrThNotHaveAsLastChild(range) {
            var startContainerNodeName = _domUtils2.default.getNodeName(range.startContainer);
            var tdOrTh = void 0;

            if (startContainerNodeName === 'TD' || startContainerNodeName === 'TH') {
                tdOrTh = range.startContainer;
            } else {
                var paths = $(range.startContainer).parentsUntil('tr');
                tdOrTh = paths[paths.length - 1];
            }

            if (_domUtils2.default.getNodeName(tdOrTh.lastChild) !== 'BR' && _domUtils2.default.getNodeName(tdOrTh.lastChild) !== 'DIV' && !isIE10And11) {
                $(tdOrTh).append($('<br />')[0]);
            }
        }

        /**
         * _unwrapBlockInTable
         * Unwrap default block tag in table
         * For Squire default action making abnormal behavior, remove default blocks in Table after setValue() called
         * @memberof WwTableManager
         * @private
         */

    }, {
        key: '_unwrapBlockInTable',
        value: function _unwrapBlockInTable() {
            this.wwe.get$Body().find('td div,th div,tr>br,td>br,th>br').each(function (index, node) {
                if (_domUtils2.default.getNodeName(node) === 'BR') {
                    var parentNodeName = _domUtils2.default.getNodeName(node.parentNode);
                    var isInTableCell = /TD|TH/.test(parentNodeName);
                    var isEmptyTableCell = node.parentNode.textContent.length === 0;
                    var isLastBR = node.parentNode.lastChild === node;

                    if (parentNodeName === 'TR' || isInTableCell && !isEmptyTableCell && isLastBR) {
                        $(node).remove();
                    }
                } else {
                    $(node).children().unwrap();
                }
            });
        }

        /**
         * Insert default block between table element
         * @private
         */

    }, {
        key: '_insertDefaultBlockBetweenTable',
        value: function _insertDefaultBlockBetweenTable() {
            this.wwe.get$Body().find('table').each(function (index, node) {
                if (node.nextElementSibling && node.nextElementSibling.nodeName === 'TABLE') {
                    $('<div><br /></div>').insertAfter(node);
                }
            });
        }

        /**
         * _removeTable
         * Remove table
         * @param {Range} range range
         * @param {Node} table table
         * @memberof WwTableManager
         * @private
         */

    }, {
        key: '_removeTable',
        value: function _removeTable(range, table) {
            if (table.tagName === 'TABLE') {
                this.wwe.getEditor().saveUndoState(range);
                this.wwe.saveSelection(range);
                $(table).remove();
                this.wwe.restoreSavedSelection();
            }
        }

        /**
         * _recordUndoStateIfNeed
         * record undo state if need
         * @param {Range} range range
         * @memberof WwTableManager
         * @private
         */

    }, {
        key: '_recordUndoStateIfNeed',
        value: function _recordUndoStateIfNeed(range) {
            var currentCellNode = _domUtils2.default.getParentUntil(range.startContainer, 'TR');

            if (range.collapsed && currentCellNode && this._lastCellNode !== currentCellNode) {
                this.wwe.getEditor().saveUndoState(range);
                this._lastCellNode = currentCellNode;
            }
        }

        /**
         * _recordUndoStateAndResetCellNode
         * record undo state and reset last cell node
         * @param {Range} range range
         * @memberof WwTableManager
         * @private
         */

    }, {
        key: '_recordUndoStateAndResetCellNode',
        value: function _recordUndoStateAndResetCellNode(range) {
            this.wwe.getEditor().saveUndoState(range);
            this.resetLastCellNode();
        }

        /**
         * Paste table data into table element
         * @param {DocumentFragment} fragment Fragment of table element within
         * @private
         */

    }, {
        key: '_pasteDataIntoTable',
        value: function _pasteDataIntoTable(fragment) {
            var _wwe$getEditor$getSel = this.wwe.getEditor().getSelection(),
                startContainer = _wwe$getEditor$getSel.startContainer;

            var parentNode = startContainer.parentNode;

            var tableData = this._getTableDataFromTable(fragment);
            var isTextInTableCell = parentNode.tagName === 'TD' || parentNode.tagName === 'TH';
            var isTableCell = startContainer.tagName === 'TD' || startContainer.tagName === 'TH';
            var isTextNode = startContainer.nodeType === 3;
            var brString = isIE10 ? '' : '<br />';
            var anchorElement = void 0,
                td = void 0,
                tr = void 0,
                tdContent = void 0;

            if (isTextNode && isTextInTableCell) {
                anchorElement = parentNode;
            } else if (isTableCell) {
                anchorElement = startContainer;
            } else {
                anchorElement = $(startContainer).find('th,td').get(0);
            }

            td = anchorElement;

            while (tableData.length) {
                tr = tableData.shift();

                while (td && tr.length) {
                    tdContent = tr.shift();

                    if (tdContent.length) {
                        td.textContent = tdContent;
                    } else {
                        td.innerHTML = brString;
                    }

                    td = _domUtils2.default.getTableCellByDirection(td, 'next');
                }

                td = _domUtils2.default.getSiblingRowCellByDirection(anchorElement, 'next', false);
                anchorElement = td;
            }
        }

        /**
         * Get array data from table element
         * @param {DocumentFragment} fragment table element
         * @returns {Array}
         * @private
         */

    }, {
        key: '_getTableDataFromTable',
        value: function _getTableDataFromTable(fragment) {
            var $fragment = $(fragment);
            var tableData = [];
            var trs = $fragment.find('tr');

            trs.each(function (i, tr) {
                var trData = [];
                var tds = $(tr).children();

                tds.each(function (index, cell) {
                    trData.push(cell.textContent);
                });

                if (trData.length) {
                    tableData.push(trData);
                }
            });

            return tableData;
        }

        /**
         * Remove selected table contents
         * @param {jQuery} $selectedCells Selected cells wrapped by jQuery
         * @private
         */

    }, {
        key: '_removeTableContents',
        value: function _removeTableContents($selectedCells) {
            this.wwe.getEditor().saveUndoState();

            $selectedCells.each(function (i, cell) {
                var brHTMLString = isIE10 ? '' : '<br />';
                $(cell).html(brHTMLString);
            });
        }

        /**
         * Wrap dangling table cells with new TR
         * @param {jQuery} $container - clipboard container
         * @returns {HTMLElement|null}
         */

    }, {
        key: 'wrapDanglingTableCellsIntoTrIfNeed',
        value: function wrapDanglingTableCellsIntoTrIfNeed($container) {
            var danglingTableCells = $container.children('td,th');
            var tr = void 0;

            if (danglingTableCells.length) {
                var $wrapperTr = $('<tr></tr>');

                danglingTableCells.each(function (i, cell) {
                    $wrapperTr.append(cell);
                });

                tr = $wrapperTr.get(0);
            }

            return tr;
        }

        /**
         * Wrap TRs with new TBODY
         * @param {jQuery} $container - clipboard container
         * @returns {HTMLElement|null}
         */

    }, {
        key: 'wrapTrsIntoTbodyIfNeed',
        value: function wrapTrsIntoTbodyIfNeed($container) {
            var danglingTrs = $container.children('tr');
            var ths = danglingTrs.find('th');
            var tbody = void 0;

            if (ths.length) {
                ths.each(function (i, node) {
                    var $node = $(node);
                    var td = $('<td></td>');

                    td.html($node.html());
                    td.insertBefore(node);

                    $node.detach();
                });
            }

            if (danglingTrs.length) {
                var $wrapperTableBody = $('<tbody></tbody>');

                danglingTrs.each(function (i, tr) {
                    $wrapperTableBody.append(tr);
                });

                tbody = $wrapperTableBody.get(0);
            }

            return tbody;
        }

        /**
         * Wrap THEAD followed by TBODY both into Table
         * @param {jQuery} $container - clipboard container
         * @returns {HTMLElement|null}
         */

    }, {
        key: 'wrapTheadAndTbodyIntoTableIfNeed',
        value: function wrapTheadAndTbodyIntoTableIfNeed($container) {
            var danglingThead = $container.children('thead');
            var danglingTbody = $container.children('tbody');
            var $wrapperTable = $('<table></table>');
            var table = void 0;

            if (!danglingTbody.length && danglingThead.length) {
                $wrapperTable.append(danglingThead[0]);
                $wrapperTable.append('<tbody><tr></tr></tbody>');
                table = $wrapperTable.get(0);
            } else if (danglingTbody.length && !danglingThead.length) {
                $wrapperTable.append('<thead><tr></tr></thead>');
                $wrapperTable.append(danglingTbody[0]);
                table = $wrapperTable.get(0);
            } else if (danglingTbody.length && danglingThead.length) {
                $wrapperTable.append(danglingThead[0]);
                $wrapperTable.append(danglingTbody[0]);
                table = $wrapperTable.get(0);
            }

            return table;
        }

        /**
         * Whether pasting element is table element
         * @param {string} pastingNodeName Pasting node name
         * @returns {boolean}
         */

    }, {
        key: 'isTableOrSubTableElement',
        value: function isTableOrSubTableElement(pastingNodeName) {
            return pastingNodeName === 'TABLE' || pastingNodeName === 'TBODY' || pastingNodeName === 'THEAD' || pastingNodeName === 'TR' || pastingNodeName === 'TD';
        }

        /**
         * Stuff table cells into incomplete rows
         * @param {jQuery} $trs jQuery wrapped TRs
         * @param {number} maximumCellLength maximum cell length of table
         * @private
         */

    }, {
        key: '_stuffTableCellsIntoIncompleteRow',
        value: function _stuffTableCellsIntoIncompleteRow($trs, maximumCellLength) {
            $trs.each(function (rowIndex, row) {
                var $row = $(row);
                var tableCells = $row.find('th,td');
                var parentNodeName = _domUtils2.default.getNodeName($row.parent()[0]);
                var cellTagName = parentNodeName === 'THEAD' ? 'th' : 'td';

                for (var cellLength = tableCells.length; cellLength < maximumCellLength; cellLength += 1) {
                    $row.append($(tableCellGenerator(1, cellTagName))[0]);
                }
            });
        }

        /**
         * Prepare to table cell stuffing
         * @param {jQuery} $trs jQuery wrapped TRs
         * @returns {{maximumCellLength: *, needTableCellStuffingAid: boolean}}
         */

    }, {
        key: 'prepareToTableCellStuffing',
        value: function prepareToTableCellStuffing($trs) {
            var maximumCellLength = $trs.eq(0).find('th,td').length;
            var needTableCellStuffingAid = false;

            $trs.each(function (i, row) {
                var cellCount = $(row).find('th,td').length;

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
         * Add TBODY or THEAD if need
         * @param {jQuery} $table - Table jQuery element
         * @private
         */

    }, {
        key: '_addTbodyOrTheadIfNeed',
        value: function _addTbodyOrTheadIfNeed($table) {
            var isTheadNotExists = !$table.find('thead').length;
            var isTbodyNotExists = !$table.find('tbody').length;
            var absentNode = void 0;

            if (isTheadNotExists) {
                absentNode = $('<thead><tr></tr></thead>').get(0);
                $table.prepend(absentNode);
            } else if (isTbodyNotExists) {
                absentNode = $('<tbody><tr></tr></tbody>').get(0);
                $table.append(absentNode);
            }
        }

        /**
         * Append table cells
         * @param {HTMLElement} node Table element
         */

    }, {
        key: 'tableCellAppendAidForTableElement',
        value: function tableCellAppendAidForTableElement(node) {
            var $table = $(node);

            this._addTbodyOrTheadIfNeed($table);
            this._addTrIntoContainerIfNeed($table);

            var $trs = $table.find('tr');
            var tableAidInformation = this.prepareToTableCellStuffing($trs);
            var maximumCellLength = tableAidInformation.maximumCellLength,
                needTableCellStuffingAid = tableAidInformation.needTableCellStuffingAid;


            if (needTableCellStuffingAid) {
                this._stuffTableCellsIntoIncompleteRow($trs, maximumCellLength);
            }
        }

        /**
         * Generate THEAD and append TDs with same amount of given TBODY
         * @param {HTMLElement} node TR element
         * @returns {{thead: HTMLElement, tbody: HTMLElement}}
         * @private
         */

    }, {
        key: '_generateTheadAndTbodyFromTbody',
        value: function _generateTheadAndTbodyFromTbody(node) {
            var tr = $('<tr></tr>');
            var thead = $('<thead></thead>');

            tr.append(tableCellGenerator($(node).find('tr').eq(0).find('td').length, 'th'));
            thead.append(tr);

            return {
                thead: thead[0],
                tbody: node
            };
        }

        /**
         * Generate TBODY and append TDs with same amount of given THEAD
         * @param {HTMLElement} node TR element
         * @returns {{thead: HTMLElement, tbody: HTMLElement}}
         * @private
         */

    }, {
        key: '_generateTheadAndTbodyFromThead',
        value: function _generateTheadAndTbodyFromThead(node) {
            var tr = $('<tr></tr>');
            var tbody = $('<tbody></tbody>');

            tr.append(tableCellGenerator($(node).find('th').length, 'td'));
            tbody.append(tr);

            return {
                thead: node,
                tbody: tbody[0]
            };
        }

        /**
         * Generate THEAD and TBODY and append given TR within
         * @param {HTMLElement} node TR element
         * @returns {{thead: HTMLElement, tbody: HTMLElement}}
         * @private
         */

    }, {
        key: '_generateTheadAndTbodyFromTr',
        value: function _generateTheadAndTbodyFromTr(node) {
            var $node = $(node);
            var thead = $('<thead></thead>');
            var tbody = $('<tbody></tbody>');
            var theadRow = void 0,
                tbodyRow = void 0;

            if ($node.children()[0].tagName === 'TH') {
                theadRow = node;
                tbodyRow = $('<tr>' + tableCellGenerator($node.find('th').length, 'td') + '</tr>').get(0);
            } else {
                theadRow = $('<tr>' + tableCellGenerator($node.find('td').length, 'th') + '</tr>').get(0);
                tbodyRow = node;
            }

            thead.append(theadRow);
            tbody.append(tbodyRow);

            return {
                thead: thead[0],
                tbody: tbody[0]
            };
        }

        /**
         * Complete passed table
         * @param {HTMLElement} node - Table inner element
         * @param {?boolean} useHeader - whether use header or not
         * @private
         */

    }, {
        key: '_completeIncompleteTable',
        value: function _completeIncompleteTable(node, useHeader) {
            var nodeName = node.tagName;
            var table = void 0,
                completedTableContents = void 0;

            useHeader = util.isUndefined(useHeader) ? true : useHeader;

            if (nodeName === 'TABLE') {
                table = node;
            } else {
                table = $('<table></table>');
                table.insertAfter(node);

                if (nodeName === 'TBODY') {
                    completedTableContents = this._generateTheadAndTbodyFromTbody(node);
                } else if (nodeName === 'THEAD') {
                    completedTableContents = this._generateTheadAndTbodyFromThead(node);
                } else if (nodeName === 'TR') {
                    completedTableContents = this._generateTheadAndTbodyFromTr(node);
                }

                if (useHeader) {
                    table.append(completedTableContents.thead);
                }

                table.append(completedTableContents.tbody);
            }

            this.tableCellAppendAidForTableElement(table);
        }

        /**
         * Whole editor body searching incomplete table completion
         * @private
         */

    }, {
        key: '_completeTableIfNeed',
        value: function _completeTableIfNeed() {
            var _this4 = this;

            var $body = this.wwe.getEditor().get$Body();

            $body.children().each(function (index, node) {
                var $node = $(node);

                if (!_this4.isTableOrSubTableElement(node.nodeName)) {
                    return;
                } else if (node.nodeName === 'TABLE' && $node.find('thead').length === 0 && $node.find('tbody').length === 0) {
                    $node.remove();
                }

                _this4._completeIncompleteTable(node);
            });
        }

        /**
         * Reset _lastCellNode to null
         * @memberof WwTableManager
         */

    }, {
        key: 'resetLastCellNode',
        value: function resetLastCellNode() {
            this._lastCellNode = null;
        }
        /**
         * Set _lastCellNode to given node
         * @param {HTMLElement} node Table cell
         * @memberof WwTableManager
         */

    }, {
        key: 'setLastCellNode',
        value: function setLastCellNode(node) {
            this._lastCellNode = node;
        }

        /**
         * Return whether only modifier key pressed or not
         * @param {string} keymap Pressed keymap string
         * @returns {boolean}
         * @private
         */

    }, {
        key: '_isSingleModifierKey',
        value: function _isSingleModifierKey(keymap) {
            return keymap === 'META' || keymap === 'SHIFT' || keymap === 'ALT' || keymap === 'CONTROL';
        }

        /**
         * Return whether modifier keys pressed or not
         * @param {object} ev keyboard event object
         * @returns {boolean}
         * @private
         */

    }, {
        key: '_isModifierKeyPushed',
        value: function _isModifierKeyPushed(ev) {
            return ev.metaKey || ev.ctrlKey || ev.altKey || ev.shiftKey;
        }

        /**
         * Add one row into empty TBODY
         * @param {jQuery} $table Currently processing table
         * @private
         */

    }, {
        key: '_addTrIntoContainerIfNeed',
        value: function _addTrIntoContainerIfNeed($table) {
            var $trContainers = $table.children();

            $trContainers.each(function (i, container) {
                var hasNoRows = $(container).find('tr').length === 0;

                if (hasNoRows) {
                    $(container).append($('<tr></tr>')[0]);
                }
            });
        }
    }, {
        key: '_expandTableIfNeed',
        value: function _expandTableIfNeed(fragment) {
            var range = this.wwe.getEditor().getSelection().cloneRange();
            var $table = $(range.startContainer).parents('table');
            var difference = this._getColumnAndRowDifference(fragment, range);

            if (difference.column < 0) {
                this._appendCellForAllRow($table, difference.column);
            }

            if (difference.row < 0) {
                this._appendRow($table, difference.row);
            }
        }
    }, {
        key: '_getColumnAndRowDifference',
        value: function _getColumnAndRowDifference(fragment, range) {
            var tableData = this._getTableDataFromTable(fragment);
            var rowLength = tableData.length;
            var columnLength = tableData[0].length;
            var $currentCell = $(range.startContainer).closest('th,td');
            var $currentRow = $currentCell.parent();
            var currentColumnIndex = _domUtils2.default.getNodeOffsetOfParent($currentCell[0]);
            var currentRowIndex = _domUtils2.default.getNodeOffsetOfParent($currentCell[0].parentNode);
            var $table = $currentRow.parents('table');
            var tableColumnLength = $table.find('tr').eq(0).children().length;
            var tableRowLength = $table.find('tr').length;
            var isInTbody = $currentRow.parents('tbody').length;

            if (isInTbody) {
                currentRowIndex += 1;
            }

            return {
                row: tableRowLength - (currentRowIndex + rowLength),
                column: tableColumnLength - (currentColumnIndex + columnLength)
            };
        }
    }, {
        key: '_appendCellForAllRow',
        value: function _appendCellForAllRow($table, columnDifference) {
            var brString = isIE10 ? '' : '<br />';

            $table.find('tr').each(function (i, row) {
                var tagName = void 0;

                for (var index = columnDifference; index < 0; index += 1) {
                    if (i === 0) {
                        tagName = 'th';
                    } else {
                        tagName = 'td';
                    }
                    $(row).append($('<' + tagName + '>' + brString + '</' + tagName + '>')[0]);
                }
            });
        }
    }, {
        key: '_appendRow',
        value: function _appendRow($table, rowDifference) {
            var newRow = $table.find('tr').last().clone();
            var brHTMLSting = isIE10 ? '' : '<br />';

            newRow.find('td').html(brHTMLSting);

            for (; rowDifference < 0; rowDifference += 1) {
                $table.find('tbody').append(newRow.clone()[0]);
            }
        }

        /**
         * Get sibling textNode by given direction
         * @param {HTMLElement} currentTextNode Current text node
         * @param {boolean} isNext Boolean value whether direction equals 'next'
         * @returns {boolean|null}
         * @private
         */

    }, {
        key: '_getSiblingTextNodeByDirection',
        value: function _getSiblingTextNodeByDirection(currentTextNode, isNext) {
            var isPreviousLineExist = currentTextNode.previousSibling && currentTextNode.previousSibling.nodeName === 'BR' && currentTextNode.previousSibling.previousSibling && currentTextNode.previousSibling.previousSibling.nodeType === 3;
            var isNextLineExist = currentTextNode.nextSibling && currentTextNode.nextSibling.nodeName === 'BR' && currentTextNode.nextSibling.nextSibling && currentTextNode.nextSibling.nextSibling.nodeType === 3;
            var target = void 0;

            if (isNext && isNextLineExist) {
                target = currentTextNode.nextSibling.nextSibling;
            } else if (!isNext && isPreviousLineExist) {
                target = currentTextNode.previousSibling.previousSibling;
            }

            return target;
        }

        /**
         * Change selection to sibling cell
         * @param {HTMLElement} currentCell current TD or TH
         * @param {Range} range Range object
         * @param {string} direction 'next' or 'previous'
         * @param {string} scale 'row' or 'cell'
         * @private
         */

    }, {
        key: '_changeSelectionToTargetCell',
        value: function _changeSelectionToTargetCell(currentCell, range, direction, scale) {
            var startContainer = range.startContainer;

            var isNext = direction === 'next';
            var isRow = scale === 'row';
            var target = void 0,
                textOffset = void 0;

            if (isRow) {
                if (_domUtils2.default.isTextNode(startContainer)) {
                    target = this._getSiblingTextNodeByDirection(startContainer, isNext);
                    if (target) {
                        textOffset = target.length < range.startOffset ? target.length : range.startOffset;

                        range.setStart(target, textOffset);
                        range.collapse(true);

                        return;
                    }
                }

                target = _domUtils2.default.getSiblingRowCellByDirection(currentCell, direction, false);
            } else {
                target = _domUtils2.default.getTableCellByDirection(currentCell, direction);
                if (!target) {
                    target = _domUtils2.default.getSiblingRowCellByDirection(currentCell, direction, true);
                }
            }

            if (target) {
                range.setStart(target, 0);
                range.collapse(true);
            } else {
                target = $(currentCell).parents('table').get(0);
                if (isNext) {
                    range.setStart(target.nextElementSibling, 0);
                } else if (target.previousElementSibling && target.previousElementSibling.nodeName !== 'TABLE') {
                    range.setStart(target.previousElementSibling, 1);
                } else {
                    range.setStartBefore(target);
                }

                range.collapse(true);
            }
        }

        /**
         * Move cursor to given direction by interval formatter
         * @param {string} direction 'next' or 'previous'
         * @param {string} interval 'row' or 'cell'
         * @param {object} [ev] Event object
         * @returns {boolean | null}
         * @private
         */

    }, {
        key: '_moveCursorTo',
        value: function _moveCursorTo(direction, interval, ev) {
            var sq = this.wwe.getEditor();
            var range = sq.getSelection().cloneRange();
            var currentCell = $(range.startContainer).closest('td,th').get(0);
            var isNeedNext = void 0;

            if (range.collapsed) {
                if (this.isInTable(range) && currentCell) {
                    if ((direction === 'previous' || interval === 'row') && !util.isUndefined(ev)) {
                        ev.preventDefault();
                    }

                    this._changeSelectionToTargetCell(currentCell, range, direction, interval);
                    sq.setSelection(range);

                    isNeedNext = false;
                }
            }

            return isNeedNext;
        }

        /**
         * Remove contents and change selection if need
         * @param {Range} range - Range object
         * @param {string} keymap - keymap
         * @param {object} ev - Event object
         * @returns {boolean} - true if contents has been removed
         * @private
         */

    }, {
        key: '_removeContentsAndChangeSelectionIfNeed',
        value: function _removeContentsAndChangeSelectionIfNeed(range, keymap, ev) {
            var isTextInput = keymap.length <= 1;
            var isDeleteOperation = keymap === 'BACK_SPACE' || keymap === 'DELETE';
            var $selectedCells = this.wwe.componentManager.getManager('tableSelection').getSelectedCells();
            var firstSelectedCell = $selectedCells.first().get(0);
            var processed = false;

            if ((isTextInput || isDeleteOperation) && !this._isModifierKeyPushed(ev) && $selectedCells.length) {
                if (isDeleteOperation) {
                    this._recordUndoStateIfNeed(range);
                }
                this._removeTableContents($selectedCells);

                this._lastCellNode = firstSelectedCell;

                range.setStart(firstSelectedCell, 0);
                range.collapse(true);
                this.wwe.getEditor().setSelection(range);
                processed = true;
            }

            return processed;
        }

        /**
         * Return new table ID class name string
         * @returns {string}
         * @memberof WwTableManager
         */

    }, {
        key: 'getTableIDClassName',
        value: function getTableIDClassName() {
            var tableClassName = TABLE_CLASS_PREFIX + this.tableID;
            this.tableID += 1;

            return tableClassName;
        }

        /**
         * Remove br when text inputted
         * @param {Range} range Range object
         * @private
         */

    }, {
        key: '_removeBRIfNeed',
        value: function _removeBRIfNeed(range) {
            var isText = _domUtils2.default.isTextNode(range.startContainer);
            var startContainer = isText ? range.startContainer.parentNode : range.startContainer;
            var nodeName = _domUtils2.default.getNodeName(startContainer);

            if (/td|th/i.test(nodeName) && range.collapsed && startContainer.textContent.length === 1) {
                $(startContainer).find('br').remove();
            }
        }

        /**
         * Insert br when text deleted
         * @param {Range} range Range object
         * @private
         */

    }, {
        key: '_insertBRIfNeed',
        value: function _insertBRIfNeed(range) {
            var isText = _domUtils2.default.isTextNode(range.startContainer);
            var currentCell = isText ? range.startContainer.parentNode : range.startContainer;
            var nodeName = _domUtils2.default.getNodeName(currentCell);
            var $currentCell = $(currentCell);

            if (/td|th/i.test(nodeName) && range.collapsed && !currentCell.textContent.length && !$currentCell.children().length && !isIE10And11) {
                currentCell.normalize();
                $currentCell.append('<br>');
            }
        }

        /**
         * Destroy.
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            var _this5 = this;

            this.eventManager.removeEventHandler('wysiwygRangeChangeAfter.table');
            this.eventManager.removeEventHandler('wysiwygSetValueAfter.table');
            this.eventManager.removeEventHandler('wysiwygProcessHTMLText.table');
            this.eventManager.removeEventHandler('cut.table');
            this.eventManager.removeEventHandler('copyBefore.table');
            this.wwe.getEditor().removeEventListener('paste', this.onBindedPaste);
            util.forEach(this.keyEventHandlers, function (handler, key) {
                return _this5.wwe.removeKeyEventHandler(key, handler);
            });
        }
    }]);

    return WwTableManager;
}();

/**
 * Generate table cell HTML text
 * @param {number} amount Amount of cells
 * @param {string} tagName Tag name of cell 'td' or 'th'
 * @private
 * @returns {string}
 */


function tableCellGenerator(amount, tagName) {
    var brHTMLString = '<br />';
    var cellString = '<' + tagName + '>' + brHTMLString + '</' + tagName + '>';
    var tdString = '';

    for (var i = 0; i < amount; i += 1) {
        tdString = tdString + cellString;
    }

    return tdString;
}

module.exports = WwTableManager;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg table selection manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _domUtils = __webpack_require__(1);

var _domUtils2 = _interopRequireDefault(_domUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TABLE_CELL_SELECTED_CLASS_NAME = 'te-cell-selected';

/**
 * Class WwTableSelectionManager
 */

var WwTableSelectionManager = function () {
    /**
     * Creates an instance of WwTableSelectionManager.
     * @param {WysiwygEditor} wwe - WysiwygEditor instance
     * @memberof WwTableSelectionManager
     */
    function WwTableSelectionManager(wwe) {
        _classCallCheck(this, WwTableSelectionManager);

        this.wwe = wwe;
        this.eventManager = wwe.eventManager;

        /**
         * Name property
         * @memberof WwTableSelectionManager#
         * @type {string}
         */
        this.name = 'tableSelection';

        this._init();
    }

    /**
     * _init
     * Initialize
     * @memberof WwTableSelectionManager
     * @private
     */


    _createClass(WwTableSelectionManager, [{
        key: '_init',
        value: function _init() {
            this._initEvent();

            // For disable firefox's table tool UI and table resize handler
            if (tui.util.browser.firefox) {
                document.execCommand('enableObjectResizing', false, 'false');
                document.execCommand('enableInlineTableEditing', false, 'false');
            }
        }

        /**
         * _initEvent
         * Initialize event
         * @memberof WwTableSelectionManager
         * @private
         */

    }, {
        key: '_initEvent',
        value: function _initEvent() {
            var _this = this;

            var selectionStart = void 0,
                selectionEnd = void 0,
                validSelectionEnd = void 0;

            /**
             * Start table selection timer
             * @type {object}
             * @private
             */
            this._tableSelectionTimer = null;
            /**
             * Remove selection timer for Firefox table selection
             * @type {object}
             * @private
             */
            this._removeSelectionTimer = null;
            /**
             * Boolean value for whether selection started
             * @type {boolean}
             * @private
             */
            this._isSelectionStarted = false;

            var onMouseover = function onMouseover(ev) {
                selectionEnd = $(ev.data.target).closest('[contenteditable=true] td,th').get(0);

                var range = _this.wwe.getEditor().getSelection();
                var isEndsInTable = $(selectionEnd).parents('[contenteditable=true] table').get(0);
                var isSameCell = selectionStart === selectionEnd;
                var isTextSelect = _this._isTextSelect(range, isSameCell) && !$(selectionStart).hasClass(TABLE_CELL_SELECTED_CLASS_NAME);

                if (_this._isSelectionStarted && isEndsInTable && !isTextSelect) {
                    window.getSelection().removeAllRanges();
                    // For disable firefox's native table cell selection
                    if (tui.util.browser.firefox && !_this._removeSelectionTimer) {
                        _this._removeSelectionTimer = setInterval(function () {
                            window.getSelection().removeAllRanges();
                        }, 10);
                    }
                    _this.highlightTableCellsBy(selectionStart, selectionEnd);
                    validSelectionEnd = selectionEnd;
                }
            };

            var finishSelection = function finishSelection() {
                if (_this._isSelectionStarted) {
                    _this._isSelectionStarted = false;
                    _this.eventManager.removeEventHandler('mouseover.tableSelection');
                    _this.eventManager.removeEventHandler('mouseup.tableSelection');
                }
            };

            var onMouseup = function onMouseup(ev) {
                selectionEnd = $(ev.data.target).closest('[contenteditable=true] td,th').get(0);

                var range = _this.wwe.getEditor().getSelection();
                var isSameCell = selectionStart === selectionEnd;
                var isTextSelect = _this._isTextSelect(range, isSameCell) && !$(selectionStart).hasClass(TABLE_CELL_SELECTED_CLASS_NAME);

                _this._clearTableSelectionTimerIfNeed();

                if (_this._isSelectionStarted) {
                    if (isTextSelect) {
                        _this.removeClassAttrbuteFromAllCellsIfNeed();
                    } else {
                        _this.wwe.componentManager.getManager('table').resetLastCellNode();

                        selectionEnd = selectionEnd || validSelectionEnd;

                        range = _this.wwe.getEditor().getSelection();
                        range.setStart(selectionEnd, 0);
                        // IE wont fire copy/cut event if there is no selected range.
                        // trick IE to fire the event
                        if (tui.util.browser.msie) {
                            range.setEnd(selectionEnd, 1);
                        } else {
                            range.setEnd(selectionEnd, 0);
                            range.collapse(false);
                        }
                        _this.wwe.getEditor().setSelection(range);
                    }
                    if (_this.onDragEnd) {
                        _this.onDragEnd();
                    }
                }

                finishSelection();
            };

            var onMousedown = function onMousedown(ev) {
                var MOUSE_RIGHT_BUTTON = 2;
                selectionStart = $(ev.data.target).closest('[contenteditable=true] td,th').get(0);
                var isSelectedCell = $(selectionStart).hasClass(TABLE_CELL_SELECTED_CLASS_NAME);
                selectionEnd = null;

                if (!isSelectedCell || isSelectedCell && ev.data.button !== MOUSE_RIGHT_BUTTON) {
                    _this.removeClassAttrbuteFromAllCellsIfNeed();
                    _this.setTableSelectionTimerIfNeed(selectionStart);
                    _this.eventManager.listen('mouseover.tableSelection', onMouseover);
                    _this.eventManager.listen('mouseup.tableSelection', onMouseup);
                    if (_this.onDragStart && selectionStart) {
                        _this.onDragStart(selectionStart);
                    }
                } else if (ev.data.button === MOUSE_RIGHT_BUTTON) {
                    finishSelection();
                }
            };

            this.eventManager.listen('mousedown.tableSelection', onMousedown);
            this.eventManager.listen('copyBefore.tableSelection', finishSelection);
            this.eventManager.listen('pasteBefore.tableSelection', finishSelection);
        }

        /**
         * Return whether single cell text selection or not
         * @param {Range} range Range object
         * @param {boolean} isSameCell Boolean value for same cell selection
         * @returns {boolean}
         * @private
         */

    }, {
        key: '_isTextSelect',
        value: function _isTextSelect(range, isSameCell) {
            return (/TD|TH|TEXT/i.test(range.commonAncestorContainer.nodeName) && isSameCell
            );
        }

        /**
         * Set setTimeout and setInterval timer execution if table selecting situation
         * @param {HTMLElement} selectionStart Start element
         */

    }, {
        key: 'setTableSelectionTimerIfNeed',
        value: function setTableSelectionTimerIfNeed(selectionStart) {
            var isTableSelecting = $(selectionStart).parents('[contenteditable=true] table').length;

            if (isTableSelecting) {
                this._isSelectionStarted = true;
            }
        }

        /**
         * Clear setTimeout and setInterval timer execution
         * @private
         */

    }, {
        key: '_clearTableSelectionTimerIfNeed',
        value: function _clearTableSelectionTimerIfNeed() {
            clearTimeout(this._tableSelectionTimer);
            // For disable firefox's native table selection
            if (tui.util.browser.firefox && this._removeSelectionTimer) {
                clearTimeout(this._removeSelectionTimer);
                this._removeSelectionTimer = null;
            }
        }

        /**
         * Re arrange selection when table does not include both start and end selection element
         * @param {HTMLElement} selectionStart Start element of selection
         * @param {HTMLElement} selectionEnd End element of selection
         * @returns {{startContainer: HTMLElement, endContainer: HTMLElement}}
         * @private
         */

    }, {
        key: '_reArrangeSelectionIfneed',
        value: function _reArrangeSelectionIfneed(selectionStart, selectionEnd) {
            var isRangeStartInTable = $(selectionStart).parents('[contenteditable=true] table').length;
            var isRangeEndInTable = $(selectionEnd).parents('[contenteditable=true] table').length;
            var isStartRangeOut = isRangeEndInTable && !isRangeStartInTable;
            var isEndRangeOut = !isRangeEndInTable && isRangeStartInTable;

            if (isStartRangeOut) {
                selectionStart = $(selectionEnd).parents('[contenteditable=true] table').find('th').first().get(0);
            } else if (isEndRangeOut) {
                selectionEnd = $(selectionStart).parents('[contenteditable=true] table').find('td').last().get(0);
            }

            return {
                startContainer: selectionStart,
                endContainer: selectionEnd
            };
        }

        /**
         * Apply select direction to editor
         * @param {{startContainer: HTMLElement, endContainer: HTMLElement}} selectionInformation
         *     Selection start and end element
         * @param {Range} range Range object
         * @returns {Range}
         * @private
         */

    }, {
        key: '_applySelectionDirection',
        value: function _applySelectionDirection(selectionInformation, range) {
            var nodeOffsetOfParent = _domUtils2.default.getNodeOffsetOfParent;
            var selectionStart = selectionInformation.startContainer;
            var selectionEnd = selectionInformation.endContainer;
            var rowDirection = nodeOffsetOfParent($(selectionStart).closest('[contenteditable=true] tr')[0]) - nodeOffsetOfParent($(selectionEnd).closest('[contenteditable=true] tr')[0]);
            var cellDirection = nodeOffsetOfParent(selectionStart) - nodeOffsetOfParent(selectionEnd);
            var isSameRow = rowDirection === 0;
            var isRowIncreases = rowDirection < 0;
            var isColumnIncreases = cellDirection > 0;

            if (isSameRow) {
                if (isColumnIncreases) {
                    range.setStart(selectionEnd, 0);
                    range.setEnd(selectionStart, 1);
                } else {
                    range.setStart(selectionStart, 0);
                    range.setEnd(selectionEnd, 1);
                }
            } else if (isRowIncreases) {
                range.setStart(selectionStart, 0);
                range.setEnd(selectionEnd, 1);
            } else {
                range.setStart(selectionEnd, 0);
                range.setEnd(selectionStart, 1);
            }

            return range;
        }

        /**
         * Get selection coordinate by current selection
         * @param {HTMLElement} selectionStart start element
         * @param {HTMLElement} selectionEnd end element
         * @returns {{from: {row: number, cell: number}, to: {row: number, cell: number}}}
         * @memberof WwTableSelectionManager
         */

    }, {
        key: 'getSelectionRangeFromTable',
        value: function getSelectionRangeFromTable(selectionStart, selectionEnd) {
            var nodeOffsetOfParent = _domUtils2.default.getNodeOffsetOfParent;
            var startRowOffset = nodeOffsetOfParent(selectionStart.parentNode);
            var endRowOffset = nodeOffsetOfParent(selectionEnd.parentNode);
            var startCellOffset = nodeOffsetOfParent(selectionStart);
            var endCellOffset = nodeOffsetOfParent(selectionEnd);
            var startCellContainer = _domUtils2.default.getParentUntil(selectionStart, 'TABLE');
            var endCellContainer = _domUtils2.default.getParentUntil(selectionEnd, 'TABLE');
            var isReversedTheadAndTbodySelect = _domUtils2.default.getNodeName(startCellContainer) === 'TBODY' && _domUtils2.default.getNodeName(endCellContainer) === 'THEAD';
            var isTheadAndTbodySelect = startCellContainer !== endCellContainer;
            var isBothInTbody = !!$(selectionStart).parents('tbody').length && !!$(selectionEnd).parents('tbody').length;
            var start = {
                row: startRowOffset,
                cell: startCellOffset
            };
            var end = {
                row: endRowOffset,
                cell: endCellOffset
            };
            var from = void 0,
                to = void 0;

            if (isReversedTheadAndTbodySelect) {
                start.row += 1;
            } else if (isTheadAndTbodySelect) {
                end.row += 1;
            } else if (isBothInTbody) {
                start.row += 1;
                end.row += 1;
            }

            if (startRowOffset > endRowOffset || startRowOffset === endRowOffset && startCellOffset > endCellOffset) {
                from = end;
                to = start;
            } else {
                from = start;
                to = end;
            }

            return {
                from: from,
                to: to
            };
        }

        /**
         * Highlight selected table cells
         * @param {HTMLElement} selectionStart start element
         * @param {HTMLElement} selectionEnd end element
         */

    }, {
        key: 'highlightTableCellsBy',
        value: function highlightTableCellsBy(selectionStart, selectionEnd) {
            var trs = $(selectionStart).parents('[contenteditable=true] table').find('tr');
            var selection = this.getSelectionRangeFromTable(selectionStart, selectionEnd);
            var rowFrom = selection.from.row;
            var cellFrom = selection.from.cell;
            var rowTo = selection.to.row;
            var cellTo = selection.to.cell;

            trs.each(function (rowIndex, row) {
                $(row).find('td,th').each(function (cellIndex, cell) {
                    var $cell = $(cell);
                    var isFromRow = rowIndex === rowFrom;
                    var isToRow = rowIndex === rowTo;

                    if (isFromRow && cellIndex < cellFrom || isToRow && cellIndex > cellTo || rowIndex < rowFrom || rowIndex > rowTo) {
                        $cell.removeClass(TABLE_CELL_SELECTED_CLASS_NAME);
                    } else {
                        $cell.addClass(TABLE_CELL_SELECTED_CLASS_NAME);
                    }
                });
            });
        }

        /**
         * Remove '.te-cell-selected' class from all of table Cell
         * @memberof WwTableSelectionManager
         */

    }, {
        key: 'removeClassAttrbuteFromAllCellsIfNeed',
        value: function removeClassAttrbuteFromAllCellsIfNeed() {
            this.wwe.get$Body().find('td.' + TABLE_CELL_SELECTED_CLASS_NAME + ',th.' + TABLE_CELL_SELECTED_CLASS_NAME).each(function (i, node) {
                var $node = $(node);

                $node.removeClass(TABLE_CELL_SELECTED_CLASS_NAME);

                if (!$node.attr('class').length) {
                    $node.removeAttr('class');
                }
            });
        }

        /**
         * gets selected cells
         * @returns {jQuery} selected cells
         * @memberof WwTableSelectionManager
         */

    }, {
        key: 'getSelectedCells',
        value: function getSelectedCells() {
            return this.wwe.get$Body().find('.' + TABLE_CELL_SELECTED_CLASS_NAME);
        }

        /**
         * Create selection by selected cells and collapse that selection to end
         */

    }, {
        key: 'createRangeBySelectedCells',
        value: function createRangeBySelectedCells() {
            var sq = this.wwe.getEditor();
            var range = sq.getSelection().cloneRange();
            var $selectedCells = this.getSelectedCells();
            var tableManager = this.wwe.componentManager.getManager('table');
            var firstSelectedCell = $selectedCells.first().get(0);
            var lastSelectedCell = $selectedCells.last().get(0);

            if ($selectedCells.length && tableManager.isInTable(range)) {
                range.setStart(firstSelectedCell, 0);
                range.setEnd(lastSelectedCell, lastSelectedCell.childNodes.length);
                sq.setSelection(range);
            }
        }

        /**
         * Style to selected cells.
         * @param {function} onStyle - function for styling
         */

    }, {
        key: 'styleToSelectedCells',
        value: function styleToSelectedCells(onStyle) {
            this.createRangeBySelectedCells();
            onStyle(this.wwe.getEditor());
        }

        /**
         * Destroy.
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            this.eventManager.removeEventHandler('mousedown.tableSelection');
            this.eventManager.removeEventHandler('mouseover.tableSelection');
            this.eventManager.removeEventHandler('mouseup.tableSelection');
            this.eventManager.removeEventHandler('copyBefore.tableSelection');
            this.eventManager.removeEventHandler('pasteBefore.tableSelection');
        }
    }]);

    return WwTableSelectionManager;
}();

module.exports = WwTableSelectionManager;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _mdPreview = __webpack_require__(36);

var _mdPreview2 = _interopRequireDefault(_mdPreview);

var _eventManager = __webpack_require__(34);

var _eventManager2 = _interopRequireDefault(_eventManager);

var _commandManager = __webpack_require__(0);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _extManager = __webpack_require__(6);

var _extManager2 = _interopRequireDefault(_extManager);

var _convertor = __webpack_require__(33);

var _convertor2 = _interopRequireDefault(_convertor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _tui = tui,
    util = _tui.util;


var TASK_ATTR_NAME = 'data-te-task';
var TASK_CHECKED_CLASS_NAME = 'checked';

/**
 * Class ToastUIEditorViewOnly
 */

var ToastUIEditorViewOnly = function () {
    /**
     * ViewOnly
     * @param {object} options Option object
        * @param {string} options.initialValue Editor's initial value
        * @param {object} options.events eventlist Event list
            * @param {function} options.events.load It would be emitted when editor fully load
            * @param {function} options.events.change It would be emitted when content changed
            * @param {function} options.events.stateChange It would be emitted when format change by cursor position
            * @param {function} options.events.focus It would be emitted when editor get focus
            * @param {function} options.events.blur It would be emitted when editor loose focus
        * @param {object} options.hooks Hook list
            * @param {function} options.hooks.previewBeforeHook Submit preview to hook URL before preview be shown
    */
    function ToastUIEditorViewOnly(options) {
        var _this = this;

        _classCallCheck(this, ToastUIEditorViewOnly);

        this.options = options;

        this.eventManager = new _eventManager2.default();
        this.commandManager = new _commandManager2.default(this);
        this.convertor = new _convertor2.default(this.eventManager);
        this.toMarkOptions = null;

        if (this.options.hooks) {
            util.forEach(this.options.hooks, function (fn, key) {
                _this.addHook(key, fn);
            });
        }

        if (this.options.events) {
            util.forEach(this.options.events, function (fn, key) {
                _this.on(key, fn);
            });
        }

        this.preview = new _mdPreview2.default($(this.options.el), this.eventManager, this.convertor, true);

        this.preview.$el.on('mousedown', $.proxy(this._toggleTask, this));

        _extManager2.default.applyExtension(this, this.options.exts);

        this.setValue(this.options.initialValue);

        this.eventManager.emit('load', this);
    }

    /**
     * Toggle task by detecting mousedown event.
     * @param {MouseEvent} ev - event
     * @private
     */


    _createClass(ToastUIEditorViewOnly, [{
        key: '_toggleTask',
        value: function _toggleTask(ev) {
            var isBeneathTaskBox = ev.offsetX < 18 && ev.offsetY > 18;

            if (ev.target.hasAttribute(TASK_ATTR_NAME) && !isBeneathTaskBox) {
                $(ev.target).toggleClass(TASK_CHECKED_CLASS_NAME);
                this.eventManager.emit('change', {
                    source: 'viewOnly',
                    data: ev
                });
            }
        }

        /**
         * get markdownit with code highlight instance from convertor
         * @returns {markdownit} - markdownit instance
         * @memberof ToastUIEditorViewOnly
         */

    }, {
        key: 'getMarkdownHighlightRenderer',
        value: function getMarkdownHighlightRenderer() {
            return this.convertor.getMarkdownHighlightRenderer();
        }

        /**
         * set markdownit instance
         * @param {markdownit} markdownitHighlight - markdownit instance
         * @memberof ToastUIEditorViewOnly
         */

    }, {
        key: 'setMarkdownHighlightRenderer',
        value: function setMarkdownHighlightRenderer(markdownitHighlight) {
            this.convertor.setMarkdownHighlightRenderer(markdownitHighlight);
        }

        /**
         * Set content for preview
         * @memberof ToastUIEditorViewOnly
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
         * @memberof ToastUIEditorViewOnly
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
         * @memberof ToastUIEditorViewOnly
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
         * @memberof ToastUIEditorViewOnly
         * @param {string} type Event type
         */

    }, {
        key: 'off',
        value: function off(type) {
            this.eventManager.removeEventHandler(type);
        }

        /**
         * Remove ViewOnly preview from document
         * @memberof ToastUIEditorViewOnly
         */

    }, {
        key: 'remove',
        value: function remove() {
            this.eventManager.emit('removeEditor');
            this.preview.$el.off('mousedown', $.proxy(this._toggleTask, this));
            this.options = null;
            this.eventManager = null;
            this.commandManager = null;
            this.convertor = null;
            this.preview = null;
        }

        /**
         * Add hook to ViewOnly preview's event
         * @memberof ToastUIEditorViewOnly
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
         * @memberof ToastUIEditorViewOnly
         * @returns {boolean}
         */

    }, {
        key: 'isViewOnly',
        value: function isViewOnly() {
            return true;
        }

        /**
         * Return false
         * @memberof ToastUIEditorViewOnly
         * @returns {boolean}
         */

    }, {
        key: 'isMarkdownMode',
        value: function isMarkdownMode() {
            return false;
        }

        /**
         * Return false
         * @memberof ToastUIEditorViewOnly
         * @returns {boolean}
         */

    }, {
        key: 'isWysiwygMode',
        value: function isWysiwygMode() {
            return false;
        }
    }]);

    return ToastUIEditorViewOnly;
}();

module.exports = ToastUIEditorViewOnly;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview Implements Command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

var _tui = tui,
    util = _tui.util;

/**
 * Class Command
 */

var Command = function () {
    /**
     * @param {string} name Command name
     * @param {number} type Command type (Command.TYPE)
     * @param {Array.<string>} [keyMap] keyMap
     */
    function Command(name, type, keyMap) {
        _classCallCheck(this, Command);

        this.name = name;
        this.type = type;

        if (keyMap) {
            this.setKeyMap(keyMap);
        }
    }
    /**
     * getName
     * returns Name of command
     * @memberof Command
     * @returns {string} Command Name
     */


    _createClass(Command, [{
        key: 'getName',
        value: function getName() {
            return this.name;
        }

        /**
         * getType
         * returns Type of command
         * @memberof Command
         * @returns {number} Command Command type number
         */

    }, {
        key: 'getType',
        value: function getType() {
            return this.type;
        }

        /**
         * isMDType
         * returns whether Command Type is Markdown or not
         * @memberof Command
         * @returns {boolean} result
         */

    }, {
        key: 'isMDType',
        value: function isMDType() {
            return this.type === Command.TYPE.MD;
        }

        /**
         * isWWType
         * returns whether Command Type is Wysiwyg or not
         * @memberof Command
         * @returns {boolean} result
         */

    }, {
        key: 'isWWType',
        value: function isWWType() {
            return this.type === Command.TYPE.WW;
        }

        /**
         * isGlobalType
         * returns whether Command Type is Global or not
         * @memberof Command
         * @returns {boolean} result
         */

    }, {
        key: 'isGlobalType',
        value: function isGlobalType() {
            return this.type === Command.TYPE.GB;
        }

        /**
         * setKeyMap
         * Set keymap value for each os
         * @memberof Command
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
 * @memberof Command
 * @param {string} typeStr Editor type name
 * @param {object} props Property
 *     @param {string} props.name Command name
 *     @param {number} props.type Command type number
 * @returns {Command}
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

    util.extend(command, props);

    return command;
};

/**
 * Command Type Constant
 * markdown : 0
 * wysiwyg : 1
 * global : 2
 * @memberof Command
 * @type {object}
 */
Command.TYPE = {
    MD: 0,
    WW: 1,
    GB: 2
};

module.exports = Command;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint-disable */
/* imported from http://github.com/kyuwoo-choi/csv-js */
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

(function (global) {
    'use strict';
    /**
     * @name CSV
     * @namespace
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
     */
    CSV.stream = function () {
        var stream = __webpack_require__(25);
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
        var os = __webpack_require__(76);
        var stream = __webpack_require__(25);
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
    if (typeof module != 'undefined' && module.exports) {
        module.exports = CSV;
    }

    // CommonJS http://wiki.commonjs.org/wiki/Modules
    // eg.  var CSV = require("CSV").CSV; CSV.parse(...);
    else if (true) {
            exports.CSV = CSV;
        }

        // AMD https://github.com/amdjs/amdjs-api/wiki/AMD
        // eg.  require(['./csv.js'], function (CSV) { CSV.parse(...); } );
        else if (typeof define == 'function' && _typeof(define.amd) == 'object') {
                define([], function () {
                    return CSV;
                });
            }

            // standard js global
            // eg. CSV.parse(...);
            else if (global) {
                    global.CSV = CSV;
                }
})(undefined);

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview Implements markdown marker helper for additional information
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

var _tui = tui,
    util = _tui.util;


var FIND_CRLF_RX = /(\n)|(\r\n)|(\r)/g;

/**
 *
 * Class MarkdownMarkerHelper
 */

var MarkdownMarkerHelper = function () {
    /**
     * Creates an instance of MarkdownMarkerHelper.
     * @param {CodeMirror} cm codemirror instance
     * @memberof MarkdownMarkerHelper
     */
    function MarkdownMarkerHelper(cm) {
        _classCallCheck(this, MarkdownMarkerHelper);

        this.cm = cm;
    }

    /**
     * getTextContent
     * Get CRLF removed text content of CodeMirror
     * @returns {string} text content
     */


    _createClass(MarkdownMarkerHelper, [{
        key: 'getTextContent',
        value: function getTextContent() {
            return this.cm.getValue().replace(FIND_CRLF_RX, '');
        }

        /**
         * updateMarkerWithExtraInfo
         * Update marker with extra info of CodeMirror
         * @param {object} marker marker
         * @returns {object} marker
         */

    }, {
        key: 'updateMarkerWithExtraInfo',
        value: function updateMarkerWithExtraInfo(marker) {
            var foundCursor = this._findOffsetCursor([marker.start, marker.end]);

            var startLine = foundCursor[0].line;
            var startCh = foundCursor[0].ch;
            var endLine = foundCursor[1].line;
            var endCh = foundCursor[1].ch;

            var info = this._getExtraInfoOfRange(startLine, startCh, endLine, endCh);

            marker.text = info.text.replace(FIND_CRLF_RX, ' ');
            marker.top = info.top;
            marker.left = info.left;
            marker.height = info.height;

            return marker;
        }

        /**
         * _getExtraInfoOfRange
         *  Get additional info of range
         * @param {number} startLine start line
         * @param {number} startCh start offset
         * @param {number} endLine end line
         * @param {number} endCh end offset
         * @returns {object} information
         * @private
         */

    }, {
        key: '_getExtraInfoOfRange',
        value: function _getExtraInfoOfRange(startLine, startCh, endLine, endCh) {
            var text = void 0,
                rect = void 0,
                top = void 0,
                left = void 0,
                height = void 0;
            var doc = this.cm.getDoc();

            if (!doc.getValue().length) {
                top = left = height = 0;
                text = '';
            } else {
                text = doc.getRange({
                    line: startLine,
                    ch: startCh
                }, {
                    line: endLine,
                    ch: endCh
                });

                rect = this.cm.charCoords({
                    line: endLine,
                    ch: endCh
                }, 'local');

                var _rect = rect;
                top = _rect.top;
                left = _rect.left;

                height = rect.bottom - rect.top;
            }

            return {
                text: text,
                top: top,
                left: left,
                height: height
            };
        }

        /**
         * getMarkerInfoOfCurrentSelection
         * Get marker info of current selection
         * @returns {object} marker
         */

    }, {
        key: 'getMarkerInfoOfCurrentSelection',
        value: function getMarkerInfoOfCurrentSelection() {
            var doc = this.cm.getDoc();

            var selection = this._getSelection();

            var start = doc.getRange({
                line: 0,
                ch: 0
            }, selection.anchor).replace(FIND_CRLF_RX, '').length;

            var end = start + doc.getSelection().replace(FIND_CRLF_RX, '').length;

            var foundCursor = this._findOffsetCursor([start, end]);

            var info = this._getExtraInfoOfRange(foundCursor[0].line, foundCursor[0].ch, foundCursor[1].line, foundCursor[1].ch);

            return {
                start: start,
                end: end,
                text: info.text.replace(FIND_CRLF_RX, ' '),
                top: info.top,
                left: info.left,
                height: info.height
            };
        }

        /**
         * _getSelection
         * Get selection of CodeMirror, if selection is reversed then correct it
         * @returns {object} selection
         * @private
         */

    }, {
        key: '_getSelection',
        value: function _getSelection() {
            var _cm$getDoc$listSelect = this.cm.getDoc().listSelections(),
                _cm$getDoc$listSelect2 = _cm$getDoc$listSelect[0],
                anchor = _cm$getDoc$listSelect2.anchor,
                head = _cm$getDoc$listSelect2.head;

            var isReversedSelection = anchor.line > head.line || anchor.line === head.line && anchor.ch > head.ch;

            if (isReversedSelection) {
                var temp = head;
                head = anchor;
                anchor = temp;
            }

            return {
                anchor: anchor,
                head: head
            };
        }

        /**
         * _findOffsetCursor
         * Find offset cursor by given offset list
         * @param {Array.<number>} offsetlist offset list
         * @returns {Array.<object>} offset cursors
         * @private
         */

    }, {
        key: '_findOffsetCursor',
        value: function _findOffsetCursor(offsetlist) {
            var doc = this.cm.getDoc();
            var beforeLength = 0;
            var result = [];
            var lineLength = doc.lineCount();
            var offsetIndex = 0;
            var currentLength = 0;
            var lineIndex = void 0;

            for (lineIndex = 0; lineIndex < lineLength; lineIndex += 1) {
                currentLength += doc.getLine(lineIndex).length;

                while (currentLength >= offsetlist[offsetIndex]) {
                    result.push({
                        line: lineIndex,
                        ch: offsetlist[offsetIndex] - beforeLength
                    });

                    offsetIndex += 1;

                    if (util.isUndefined(offsetlist[offsetIndex])) {
                        return result;
                    }
                }

                beforeLength = currentLength;
            }

            while (!util.isUndefined(offsetlist[offsetIndex])) {
                result.push({
                    line: lineIndex,
                    ch: currentLength - beforeLength
                });

                offsetIndex += 1;
            }

            return result;
        }

        /**
         * selectOffsetRange
         * Make selection with given offset range
         * @param {number} start start offset
         * @param {number} end end offset
         */

    }, {
        key: 'selectOffsetRange',
        value: function selectOffsetRange(start, end) {
            var foundCursor = this._findOffsetCursor([start, end]);

            this.cm.setSelection({
                line: foundCursor[0].line,
                ch: foundCursor[0].ch
            }, {
                line: foundCursor[1].line,
                ch: foundCursor[1].ch
            });
        }

        /**
         * clearSelect
         * Clear selection of CodeMirror
         */

    }, {
        key: 'clearSelect',
        value: function clearSelect() {
            var _cm$getDoc$listSelect3 = this.cm.getDoc().listSelections(),
                selection = _cm$getDoc$listSelect3[0];

            if (selection) {
                this.cm.setCursor(selection.to());
            }
        }
    }]);

    return MarkdownMarkerHelper;
}();

module.exports = MarkdownMarkerHelper;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview Implements markdown marker helper for additional information
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

var _tui = tui,
    util = _tui.util;

/**
 * Class Markerlist
 */

var Markerlist = function () {
    /**
     * Creates an instance of Markerlist.
     * @memberof Markerlist
     */
    function Markerlist() {
        _classCallCheck(this, Markerlist);

        this._sortedMarkers = [];
        this._markersWithId = {};
    }

    /**
     * addMarker
     * Add Marker
     * @param {number|object} start start text offset
     * @param {number} end end text offset
     * @param {string} id id of marker
     * @returns {object} marker
     */


    _createClass(Markerlist, [{
        key: "addMarker",
        value: function addMarker(start, end, id) {
            var marker = void 0;

            if (!id) {
                marker = start;
            } else {
                marker = {
                    start: start,
                    end: end,
                    id: id
                };
            }

            if (!this._markersWithId[marker.id]) {
                this._sortedMarkers.push(marker);
                this._markersWithId[marker.id] = marker;
            }

            return marker;
        }

        /**
         * getMarker
         * Get marker with given id
         * @param {string} id id of marker
         * @returns {object} marker
         */

    }, {
        key: "getMarker",
        value: function getMarker(id) {
            return this._markersWithId[id];
        }

        /**
         * removeMarker
         * Remove marker with given id
         * @param {string} id of marker that should be removed
         * @returns {marker} removed marker
         */

    }, {
        key: "removeMarker",
        value: function removeMarker(id) {
            var removedMarker = this._markersWithId[id];
            delete this._markersWithId[id];

            var index = this._sortedMarkers.indexOf(removedMarker);
            this._sortedMarkers.splice(index, 1);

            return removedMarker;
        }

        /**
         * updateMarker
         * Update marker with extra information
         * @param {string} id id of marker
         * @param {object} obj extra information
         * @returns {object} marker
         */

    }, {
        key: "updateMarker",
        value: function updateMarker(id, obj) {
            var marker = this.getMarker(id);

            return util.extend(marker, obj);
        }

        /**
         * forEachByRangeAffected
         * Iterate markers affected by given range
         * @param {number} start start offset
         * @param {end} end end offset
         * @param {function} iteratee iteratee
         */

    }, {
        key: "forEachByRangeAffected",
        value: function forEachByRangeAffected(start, end, iteratee) {
            var rangeMarkers = this._getMarkersByRangeAffected(start, end);

            rangeMarkers.forEach(iteratee);
        }

        /**
         * _getMarkersByRangeAffected
         * Get markers affected by given range
         * @param {number} start start offset
         * @param {end} end end offset
         * @returns {Array.<object>} markers
         * @private
         */

    }, {
        key: "_getMarkersByRangeAffected",
        value: function _getMarkersByRangeAffected(start, end) {
            var rangeMarkers = this._sortedMarkers.filter(function (marker) {
                if (marker.end > end || marker.end > start) {
                    return true;
                }

                return false;
            });

            return rangeMarkers;
        }

        /**
         * getAll
         * Get markers all
         * @returns {Array.<object>} markers
         */

    }, {
        key: "getAll",
        value: function getAll() {
            return this._sortedMarkers;
        }

        /**
         * resetMarkers
         * Reset markerlist
         */

    }, {
        key: "resetMarkers",
        value: function resetMarkers() {
            this._sortedMarkers = [];
            this._markersWithId = {};
        }

        /**
         * sortBy
         * Sort markers with given key of marker
         * @param {string} rangeKey, start or end
         */

    }, {
        key: "sortBy",
        value: function sortBy(rangeKey) {
            this._sortedMarkers.sort(function (a, b) {
                return a[rangeKey] - b[rangeKey];
            });
        }

        /**
         * getMarkersData
         * Get marker data to export
         * @returns {object} markers data
         */

    }, {
        key: "getMarkersData",
        value: function getMarkersData() {
            return this.getAll().map(function (marker) {
                return {
                    start: marker.start,
                    end: marker.end,
                    id: marker.id
                };
            });
        }
    }]);

    return Markerlist;
}();

module.exports = Markerlist;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview Implements markdown marker helper for additional information
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

var DiffMatchPatch = __webpack_require__(73);

var _tui = tui,
    util = _tui.util;


var CHANGE_NOTHING = 0,
    CHANGE_ADD = 1,
    CHANGE_MINUS = -1;

/**
 * Class MarkerManager
 */

var MarkerManager = function () {
    /**
     * Creates an instance of MarkerManager.
     * @param {MarkerList} markerList - MarkerList object
     * @memberof MarkerManager
     */
    function MarkerManager(markerList) {
        _classCallCheck(this, MarkerManager);

        this._dmp = new DiffMatchPatch();
        this.markerList = markerList;
        this.oldTextContent = null;
    }

    /**
     * resetContent
     * Reset content
     * @param {string} content reset base content
     */


    _createClass(MarkerManager, [{
        key: 'resetContent',
        value: function resetContent(content) {
            this.oldTextContent = util.isString(content) ? content : null;
        }

        /**
         * uppdateMarkersByContent
         * Get updated markers by updated content
         * @param {string} newContent updated content
         * @returns {object} updated markers
         */

    }, {
        key: 'updateMarkersByContent',
        value: function updateMarkersByContent(newContent) {
            if (util.isNull(this.oldTextContent)) {
                this.resetContent(newContent);

                return [];
            }

            var markerDiffs = this._makeMarkerDiffs(newContent);

            this.oldTextContent = newContent;

            return this._getUpdateMarkersWithDiffs(markerDiffs);
        }

        /**
         * _makeMarkerDiffs
         * Make diffs of marker by updated content
         * @param {string} newContent updated content
         * @returns {object} marker diffs
         * @private
         */

    }, {
        key: '_makeMarkerDiffs',
        value: function _makeMarkerDiffs(newContent) {
            var markerList = this.markerList,
                self = this,
                markerDiffs = {};


            this._forEachChanges(newContent, function (changedStart, changedEnd, diffLen) {
                markerList.forEachByRangeAffected(changedStart, changedEnd, function (marker) {
                    var markerDiff = markerDiffs[marker.id];

                    var startDiff = self._calculateStartDiff(changedStart, changedEnd, diffLen, marker);
                    var endDiff = self._calculateEndDiff(changedStart, changedEnd, diffLen, marker);

                    if (markerDiff) {
                        markerDiff.start += startDiff;
                        markerDiff.end += endDiff;
                    } else {
                        markerDiffs[marker.id] = {
                            start: startDiff,
                            end: endDiff
                        };
                    }
                });
            });

            return markerDiffs;
        }

        /**
         * _forEachChanges
         * Iterate each change of updated content
         * @param {string} newContent updated content
         * @param {function} iteratee iteratee
         * @private
         */

    }, {
        key: '_forEachChanges',
        value: function _forEachChanges(newContent, iteratee) {
            var changedStart = 0;
            var changedEnd = 0;
            var changes = this._dmp.diff_main(this.oldTextContent, newContent);

            changes.forEach(function (change) {
                var type = change[0],
                    text = change[1];

                var diffLen = 0;

                var changedLen = text.length;

                // 이전 변경점 end를 이번 변경점 start로 만들어 위치를 조정한다.
                changedStart = changedEnd;

                if (type === CHANGE_NOTHING) {
                    changedStart += changedLen;
                    changedEnd += changedLen;

                    return;
                }

                if (type === CHANGE_ADD) {
                    diffLen += changedLen; // 더해진경우는 End값이 변경될 필요가없다 변경전의 위치는 start와 end가 collapse일수밖에 없다.. 일반적인 컨트롤상황에서는
                } else if (type === CHANGE_MINUS) {
                    diffLen -= changedLen;
                    changedEnd += changedLen; // 빠지면 빠지기전까지의 범위가 end가 되어야한다.
                }

                iteratee(changedStart, changedEnd, diffLen);
            });
        }

        /**
         * _calculateStartDiff
         * Calculate start diff
         * @param {number} start change start offset
         * @param {number} end change end offset
         * @param {number} diff diff count of change
         * @param {object} marker marker to calculate diff
         * @returns {number} start diff of marker
         * @private
         */

    }, {
        key: '_calculateStartDiff',
        value: function _calculateStartDiff(start, end, diff, marker) {
            var startDiff = void 0;

            // ~AB~[CDE]F
            if (start <= marker.start && end <= marker.start) {
                startDiff = diff;
                // A~B[C~DE]F
            } else if (start <= marker.start && end > marker.start) {
                startDiff = start - marker.start;
            } else {
                startDiff = 0;
            }

            return startDiff;
        }

        /**
         * _calculateEndDiff
         * Calculate end diff
         * @param {number} start change start offset
         * @param {number} end change end offset
         * @param {number} diff diff count of change
         * @param {object} marker marker to calculate diff
         * @returns {number} end diff of marker
         * @private
         */

    }, {
        key: '_calculateEndDiff',
        value: function _calculateEndDiff(start, end, diff, marker) {
            var endDiff = void 0;

            // ~AB[CDE~]F
            if (end <= marker.end) {
                endDiff = diff;
                // AB[CD~E]~F
            } else if (start <= marker.end && end > marker.start) {
                endDiff = start - marker.end;
            } else {
                endDiff = 0;
            }

            return endDiff;
        }

        /**
         * _getUpdateMarkersWithDiffs
         * Get updated markers with diffs
         * @param {object} markerDiffs marker diff object that contains diff info of specific marker
         * @returns {Array.<object>} updated markers
         * @private
         */

    }, {
        key: '_getUpdateMarkersWithDiffs',
        value: function _getUpdateMarkersWithDiffs(markerDiffs) {
            var updatedMarkers = [],
                markerList = this.markerList;


            util.forEachOwnProperties(markerDiffs, function (markerDiff, id) {
                var marker = markerList.getMarker(id);

                markerList.updateMarker(id, {
                    start: marker.start += markerDiff.start,
                    end: marker.end += markerDiff.end
                });

                updatedMarkers.push(marker);
            });

            return updatedMarkers;
        }
    }]);

    return MarkerManager;
}();

module.exports = MarkerManager;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview Implements viewOnly marker helper for additional information
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

var domUtils = __webpack_require__(1);

var FIND_CRLF_RX = /(\n)|(\r\n)|(\r)/g;

/**
 * Class ViewOnlyMarkerHelper
 */

var ViewOnlyMarkerHelper = function () {
    /**
     * Creates an instance of ViewOnlyMarkerHelper.
     * @param {Preview} preview - preview instance
     * @memberof ViewOnlyMarkerHelper
     */
    function ViewOnlyMarkerHelper(preview) {
        _classCallCheck(this, ViewOnlyMarkerHelper);

        this.preview = preview;
    }

    /**
     * getTextContent
     * Get text content of wysiwyg
     * @returns {string}
     */


    _createClass(ViewOnlyMarkerHelper, [{
        key: 'getTextContent',
        value: function getTextContent() {
            return this.preview.$el[0].textContent.replace(FIND_CRLF_RX, '');
        }

        /**
         * updateMarkerWithExtraInfo
         * Update marker with extra info of preview
         * @param {object} marker marker
         * @returns {object} marker
         */

    }, {
        key: 'updateMarkerWithExtraInfo',
        value: function updateMarkerWithExtraInfo(marker) {
            var foundNode = this._findOffsetNode([marker.start, marker.end]);

            var markerRange = document.createRange();

            markerRange.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
            markerRange.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

            var info = this._getExtraInfoOfRange(markerRange);

            marker.text = info.text;
            marker.top = info.top;
            marker.left = info.left;
            marker.height = info.height;

            return marker;
        }

        /**
         * _getExtraInfoOfRange
         * Get extra info of range
         * @param {Range} range range
         * @returns {object} extra info
         * @private
         */

    }, {
        key: '_getExtraInfoOfRange',
        value: function _getExtraInfoOfRange(range) {
            var top = void 0,
                left = void 0,
                rect = void 0,
                containerOffset = void 0,
                height = void 0,
                node = void 0,
                parentNode = void 0;

            var text = range.cloneContents().textContent.replace(FIND_CRLF_RX, '');

            range.setStart(range.endContainer, range.endOffset);
            range.collapse(true);

            rect = range.getBoundingClientRect();

            if (rect && !rect.top) {
                node = document.createElement('SPAN');
                node.textContent = '\u200B';
                range.endContainer.parentNode.insertBefore(node, range.endContainer);
                rect = node.getBoundingClientRect();
                var _node = node;
                parentNode = _node.parentNode;

                parentNode.removeChild(node);
            }

            if (rect) {
                containerOffset = this.preview.$el.offset();
                top = rect.top + this.preview.$el.scrollTop() - containerOffset.top + $('body').scrollTop();
                left = rect.left - containerOffset.left;
                var _rect = rect;
                height = _rect.height;
            } else {
                height = top = left = 0;
            }

            return {
                text: text,
                top: top,
                left: left,
                height: height
            };
        }

        /**
         * getMarkerInfoOfCurrentSelection
         * Get marker info of current selection
         * @returns {object} marker
         */

    }, {
        key: 'getMarkerInfoOfCurrentSelection',
        value: function getMarkerInfoOfCurrentSelection() {
            var beforeRange = void 0,
                start = void 0,
                end = void 0,
                info = void 0;

            var range = getRange();

            var isRangeInContent = $.contains(this.preview.$el[0], range.commonAncestorContainer);

            if (isRangeInContent && this._extendRangeToTextNodeIfHasNone(range)) {
                beforeRange = range.cloneRange();
                beforeRange.setStart(this.preview.$el[0], 0);
                beforeRange.setEnd(range.startContainer, range.startOffset);

                info = this._getExtraInfoOfRange(range);

                start = beforeRange.cloneContents().textContent.length;
                end = start + info.text.length;

                return {
                    start: start,
                    end: end,
                    text: info.text,
                    top: info.top,
                    left: info.left,
                    height: info.height
                };
            }

            return null;
        }

        /**
         * _extendRangeToTextNodeIfHasNone
         * Extend range to text node if start or end container have none
         * Containers of range should be text node
         * @param {Range} range range
         * @returns {boolean} success or fail
         * @private
         */

    }, {
        key: '_extendRangeToTextNodeIfHasNone',
        value: function _extendRangeToTextNodeIfHasNone(range) {
            var endNode = domUtils.getChildNodeByOffset(range.endContainer, range.endOffset);
            var textNode = void 0;

            if (!domUtils.isTextNode(range.endContainer)) {
                if (domUtils.isTextNode(endNode)) {
                    range.setEnd(endNode, 0);
                } else {
                    textNode = domUtils.getPrevTextNode(endNode);
                    if (textNode) {
                        range.setEnd(textNode, textNode.length);
                    } else {
                        return false;
                    }
                }
            }

            return true;
        }

        /**
         * _findOffsetNode
         * Find offset nodes by given offset list
         * @param {Array.<number>} offsetlist offset list
         * @returns {Array.<object>} offset node informations
         * @private
         */

    }, {
        key: '_findOffsetNode',
        value: function _findOffsetNode(offsetlist) {
            return domUtils.findOffsetNode(this.preview.$el[0], offsetlist, function (text) {
                return text.replace(FIND_CRLF_RX, '');
            });
        }

        /**
         * selectOffsetRange
         * Make selection with given offset range
         * @param {number} start start offset
         * @param {number} end end offset
         */

    }, {
        key: 'selectOffsetRange',
        value: function selectOffsetRange(start, end) {
            var foundNode = this._findOffsetNode([start, end]),
                range = document.createRange(),
                sel = window.getSelection();

            range.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
            range.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

            sel.removeAllRanges();
            sel.addRange(range);
        }

        /**
         * clearSelect
         * Clear selection
         */

    }, {
        key: 'clearSelect',
        value: function clearSelect() {
            window.getSelection().removeAllRanges();
        }
    }]);

    return ViewOnlyMarkerHelper;
}();

/**
 * getRange
 * get current range
 * @returns {Range}
 * @ignore
 */


function getRange() {
    var selection = window.getSelection();
    var range = void 0;

    if (selection && selection.rangeCount) {
        range = selection.getRangeAt(0).cloneRange();
    } else {
        range = document.createRange();
        range.selectNodeContents(this.preview.$el[0]);
        range.collapse(true);
    }

    return range;
}

module.exports = ViewOnlyMarkerHelper;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview Implements wysiwyg marker helper for additional information
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

var domUtils = __webpack_require__(1);

var FIND_ZWB_RX = /\u200B/g;

/**
 * Class WysiwygMarkerHelper
 */

var WysiwygMarkerHelper = function () {
    /**
     * Creates an instance of WysiwygMarkerHelper.
     * @param {SquireExt} sqe - squire instance
     * @memberof WysiwygMarkerHelper
     */
    function WysiwygMarkerHelper(sqe) {
        _classCallCheck(this, WysiwygMarkerHelper);

        this.sqe = sqe;
    }

    /**
     * getTextContent
     * Get text content of wysiwyg
     * @returns {string}
     */


    _createClass(WysiwygMarkerHelper, [{
        key: 'getTextContent',
        value: function getTextContent() {
            return this.sqe.get$Body()[0].textContent.replace(FIND_ZWB_RX, '');
        }

        /**
         * updateMarkerWithExtraInfo
         * Update marker with extra info of CodeMirror
         * @param {object} marker marker
         * @returns {object} marker
         */

    }, {
        key: 'updateMarkerWithExtraInfo',
        value: function updateMarkerWithExtraInfo(marker) {
            var foundNode = this._findOffsetNode([marker.start, marker.end]);

            var markerRange = this.sqe.getSelection().cloneRange();
            markerRange.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
            markerRange.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

            var info = this._getExtraInfoOfRange(markerRange);

            marker.text = info.text;
            marker.top = info.top;
            marker.left = info.left;
            marker.height = info.height;

            return marker;
        }

        /**
         * _getExtraInfoOfRange
         * Get extra info of range
         * @param {Range} range range
         * @returns {object} extra info
         * @private
         */

    }, {
        key: '_getExtraInfoOfRange',
        value: function _getExtraInfoOfRange(range) {
            var top = void 0,
                left = void 0,
                rect = void 0,
                height = void 0,
                node = void 0,
                parentNode = void 0,
                containerOffset = void 0;
            var endContainer = range.endContainer,
                endOffset = range.endOffset;


            var text = range.cloneContents().textContent.replace(FIND_ZWB_RX, '');

            if (domUtils.getChildNodeByOffset(endContainer, endOffset)) {
                range.setStart(endContainer, endOffset);
                range.collapse(true);

                rect = range.getBoundingClientRect();
            }

            if (rect && !rect.top) {
                this.sqe.modifyDocument(function () {
                    node = document.createElement('SPAN');
                    node.textContent = '\u200B';
                    range.endContainer.parentNode.insertBefore(node, range.endContainer);
                    rect = node.getBoundingClientRect();
                    var _node = node;
                    parentNode = _node.parentNode;

                    parentNode.removeChild(node);
                });
            }

            if (rect) {
                containerOffset = this.sqe.get$Body().parent().offset();
                top = this.sqe.scrollTop() + rect.top - containerOffset.top + $('body').scrollTop();
                left = rect.left - containerOffset.left;
                var _rect = rect;
                height = _rect.height;
            } else {
                height = top = left = 0;
            }

            return {
                text: text,
                top: top,
                left: left,
                height: height
            };
        }

        /**
         * getMarkerInfoOfCurrentSelection
         * Get marker info of current selection
         * @returns {object} marker
         */

    }, {
        key: 'getMarkerInfoOfCurrentSelection',
        value: function getMarkerInfoOfCurrentSelection() {
            var beforeRange = void 0,
                start = void 0,
                end = void 0,
                info = void 0;

            var range = this.sqe.getSelection().cloneRange();

            if (this._extendRangeToTextNodeIfHasNone(range)) {
                beforeRange = range.cloneRange();
                beforeRange.setStart(this.sqe.get$Body()[0], 0);
                beforeRange.setEnd(range.startContainer, range.startOffset);

                info = this._getExtraInfoOfRange(range);

                start = beforeRange.cloneContents().textContent.length;
                end = start + info.text.length;

                return {
                    start: start,
                    end: end,
                    text: info.text,
                    top: info.top,
                    left: info.left,
                    height: info.height
                };
            }

            return null;
        }

        /**
         * _extendRangeToTextNodeIfHasNone
         * Extend range to text node if start or end container have none
         * Containers of range should be text node
         * @param {Range} range range
         * @returns {boolean} success or fail
         * @private
         */

    }, {
        key: '_extendRangeToTextNodeIfHasNone',
        value: function _extendRangeToTextNodeIfHasNone(range) {
            var endNode = domUtils.getChildNodeByOffset(range.endContainer, range.endOffset);
            var textNode = void 0;

            if (!domUtils.isTextNode(range.endContainer) || !endNode.nodeValue.replace(FIND_ZWB_RX, '').length) {
                if (domUtils.isTextNode(endNode)) {
                    range.setEnd(endNode, 0);
                } else {
                    textNode = domUtils.getPrevTextNode(endNode);
                    if (textNode) {
                        range.setEnd(textNode, textNode.length);
                    } else {
                        return false;
                    }
                }
            }

            return true;
        }

        /**
         * _findOffsetNode
         * Find offset nodes by given offset list
         * @param {Array.<number>} offsetlist offset list
         * @returns {Array.<object>} offset node informations
         * @private
         */

    }, {
        key: '_findOffsetNode',
        value: function _findOffsetNode(offsetlist) {
            return domUtils.findOffsetNode(this.sqe.get$Body()[0], offsetlist, function (text) {
                return text.replace(FIND_ZWB_RX, '');
            });
        }

        /**
         * selectOffsetRange
         * Make selection with given offset range
         * @param {number} start start offset
         * @param {number} end end offset
         */

    }, {
        key: 'selectOffsetRange',
        value: function selectOffsetRange(start, end) {
            var foundNode = this._findOffsetNode([start, end]),
                range = this.sqe.getSelection().cloneRange();

            range.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
            range.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

            this.sqe.setSelection(range);
        }

        /**
         * clearSelect
         * Clear selection of squire
         */

    }, {
        key: 'clearSelect',
        value: function clearSelect() {
            var range = this.sqe.getSelection().cloneRange();
            range.collapse(true);
            this.sqe.setSelection(range);
        }
    }]);

    return WysiwygMarkerHelper;
}();

module.exports = WysiwygMarkerHelper;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_i18n2.default.setLang(['ko', 'ko_KR'], {
    'Merge cells': '셀 병합',
    'Unmerge cells': '셀 병합해제',
    'Cannot change part of merged cell': '병합 된 셀의 일부를 변경할 수 없습니다.',
    'Cannot paste row merged cells into the table header': '테이블 헤더에는 행 병합된 셀을 붙여넣을 수 없습니다.'
});

_i18n2.default.setLang(['en', 'en_US'], {
    'Merge cells': 'Merge cells',
    'Unmerge cells': 'Unmerge cells',
    'Cannot change part of merged cell': 'Cannot change part of merged cell.',
    'Cannot paste row merged cells into the table header': 'Cannot paste row merged cells into the table header.'
});

_i18n2.default.setLang(['ja', 'ja_JP'], {
    'Merge cells': 'セルの結合',
    'Unmerge cells': 'セルの結合を解除',
    'Cannot change part of merged cell': '結合されたセルの一部を変更することはできません。',
    'Cannot paste row merged cells into the table header': '行にマージされたセルをヘッダーに貼り付けることはできません。'
});

_i18n2.default.setLang(['nl', 'nl_NL'], {
    'Merge cells': 'cellen samenvoegen',
    'Unmerge cells': 'Samenvoegen cellen ongedaan maken',
    'Cannot change part of merged cell': 'Kan geen deel uit van samengevoegde cel te veranderen.',
    'Cannot paste row merged cells into the table header': 'Kan niet plakken rij samengevoegde cellen in de koptekst. '
});

_i18n2.default.setLang(['zh', 'zh_CN'], {
    'Merge cells': '合并单元格',
    'Unmerge cells': '取消合并单元格',
    'Cannot change part of merged cell': '无法更改合并单元格的一部分。',
    'Cannot paste row merged cells into the table header': '无法将行合并单元格粘贴到标题中。'
});

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._mergeCells = _mergeCells;

var _commandManager = __webpack_require__(0);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _tableDataHandler = __webpack_require__(2);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(4);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(5);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Implements MergeCell
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

var _tui = tui,
    util = _tui.util;

var BASIC_CELL_CONTENT = util.browser.msie ? '' : '<br>';

var MergeCell = _commandManager2.default.command('wysiwyg', /** @lends MergeCell */{
    name: 'MergeCells',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - WYsiwygEditor instance
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
        var $startContainer = $(range.startContainer);
        var $table = $startContainer.closest('table');
        var tableData = _tableDataHandler2.default.createTableData($table);
        var tableRange = _tableRangeHandler2.default.getTableSelectionRange(tableData, $selectedCells, $startContainer);

        _mergeCells(tableData, tableRange);

        var $newTable = _tableRenderer2.default.replaceTable($table, tableData);
        var focusCell = _findFocusCell($newTable, tableRange.start.rowIndex, tableRange.start.colIndex);

        _tableRenderer2.default.focusToCell(sq, range, focusCell);
    }
});

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


        util.forEach(cellData, function (value, name) {
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
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._createNewColumns = _createNewColumns;
exports._addColumns = _addColumns;

var _commandManager = __webpack_require__(0);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _tableDataHandler = __webpack_require__(2);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(4);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(5);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Implements mergedTableAddCol
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

var _tui = tui,
    util = _tui.util;

/**
 * AddCol
 * Add Row to selected table
 * @augments Command
 * @augments WysiwygCommand
 * @ignore
 */

var AddCol = _commandManager2.default.command('wysiwyg', /** @lends AddCol */{
    name: 'AddCol',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - WYsiwygEditor instance
     */
    exec: function exec(wwe) {
        var sq = wwe.getEditor();
        var range = sq.getSelection().cloneRange();

        wwe.focus();

        if (!sq.hasFormat('TABLE')) {
            return;
        }

        var $startContainer = $(range.startContainer);
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

    if (util.isExisty(cellData.colMergeWith)) {
        var colMergeWith = cellData.colMergeWith;

        var merger = rowData[colMergeWith];
        var lastMergedCellIndex = colMergeWith + merger.colspan - 1;

        if (util.isExisty(merger.rowMergeWith) && prevCell) {
            newCell = util.extend({}, prevCell);
        } else if (lastMergedCellIndex > colIndex) {
            merger.colspan += 1;
            newCell = util.extend({}, cellData);
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
    var colIndexes = util.range(startColIndex, endColIndex + 1);
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
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._createNewRow = _createNewRow;
exports._addRow = _addRow;

var _commandManager = __webpack_require__(0);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _tableDataHandler = __webpack_require__(2);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(4);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(5);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Implements mergedTableAddRow
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

var _tui = tui,
    util = _tui.util;

/**
 * AddRow
 * Add Row to selected table
 * @augments Command
 * @augments WysiwygCommand
 * @ignore
 */

var AddRow = _commandManager2.default.command('wysiwyg', /** @lends AddRow */{
    name: 'AddRow',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - WYsiwygEditor instance
     */
    exec: function exec(wwe) {
        var sq = wwe.getEditor();
        var range = sq.getSelection().cloneRange();

        wwe.focus();

        if (!sq.hasFormat('TABLE')) {
            return;
        }

        var $startContainer = $(range.startContainer);
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

        if (util.isExisty(cellData.rowMergeWith)) {
            var rowMergeWith = cellData.rowMergeWith;

            var merger = tableData[rowMergeWith][colIndex];
            var lastMergedRowIndex = rowMergeWith + merger.rowspan - 1;

            if (util.isExisty(merger.colMergeWith) && prevCell) {
                newCell = util.extend({}, prevCell);
            } else if (lastMergedRowIndex > rowIndex) {
                merger.rowspan += 1;
                newCell = util.extend({}, cellData);
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
    var newRows = util.range(startRowIndex, endRowIndex + 1).map(function () {
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
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commandManager = __webpack_require__(0);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _tableDataHandler = __webpack_require__(2);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(4);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(5);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Implements mergedTableAlignCol
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

var _tui = tui,
    util = _tui.util;

/**
 * AlignCol
 * Align selected column's text content to given direction
 * @augments Command
 * @augments WysiwygCommand
 * @ignore
 */

var AlignCol = _commandManager2.default.command('wysiwyg', /** @lends AlignCol */{
    name: 'AlignCol',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - WYsiwygEditor instance
     * @param {string} alignDirection - align direction for table header
     */
    exec: function exec(wwe, alignDirection) {
        var sq = wwe.getEditor();
        var range = sq.getSelection().cloneRange();

        wwe.focus();

        if (!sq.hasFormat('TABLE')) {
            return;
        }

        var $startContainer = $(range.startContainer);
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

/**
 * Align to table header.
 * @param {Array.<object>} headRowData - head row data
 * @param {number} startColIndex - start column index for styling align
 * @param {number} endColIndex - end column index for styling align
 * @param {string} alignDirection - align direction
 * @private
 */
function _align(headRowData, startColIndex, endColIndex, alignDirection) {
    util.range(startColIndex, endColIndex + 1).forEach(function (colIndex) {
        var headCellData = headRowData[colIndex];

        if (util.isExisty(headCellData.colMergeWith)) {
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
/* 54 */
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

var _tableRenderer = __webpack_require__(5);

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
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
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
        return $(tr).find('td, th').get().map(_parseTableCell);
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

    tui.util.forEach(arr, function (item, index) {
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
    var table = _createTableObjectFrom$Table($(tableElement));

    var _divideTrs2 = _divideTrs(table),
        thead = _divideTrs2[0],
        tbody = _divideTrs2[1];

    _mergeByColspan(thead);
    _mergeByColspan(tbody);
    _mergeByRowspan(tbody);

    return $(_tableRenderer2.default.createTableHtml(table))[0];
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._removeColumns = _removeColumns;

var _commandManager = __webpack_require__(0);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _tableDataHandler = __webpack_require__(2);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(4);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(5);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Implements mergedTableRemoveCol
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

var _tui = tui,
    util = _tui.util;

/**
 * RemoveCol
 * Remove col to selected table
 * @augments Command
 * @augments WysiwygCommand
 * @ignore
 */

var RemoveCol = _commandManager2.default.command('wysiwyg', /** @lends RemoveCol */{
    name: 'RemoveCol',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - WYsiwygEditor instance
     */
    exec: function exec(wwe) {
        var sq = wwe.getEditor();
        var range = sq.getSelection().cloneRange();

        wwe.focus();

        if (!sq.hasFormat('TABLE')) {
            return;
        }

        var $startContainer = $(range.startContainer);
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

/**
 * Update colspan to col merger.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} startColIndex - start col index
 * @param {number} endColIndex - end col index
 * @private
 */
function _updateColspan(tableData, startColIndex, endColIndex) {
    tableData.forEach(function (rowData) {
        util.range(startColIndex, endColIndex + 1).forEach(function (colIndex) {
            var cellData = rowData[colIndex];

            if (util.isExisty(cellData.colMergeWith)) {
                var merger = rowData[cellData.colMergeWith];

                if (merger.colspan) {
                    merger.colspan -= 1;
                }
            } else if (cellData.colspan > 1) {
                var lastMergedCellIndex = colIndex + cellData.colspan - 1;

                cellData.colspan -= endColIndex - colIndex + 1;

                if (lastMergedCellIndex > endColIndex) {
                    rowData[endColIndex + 1] = util.extend({}, cellData);
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
            if (util.isExisty(cellData.colMergeWith) && cellData.colMergeWith >= startColIndex) {
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
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._removeRow = _removeRow;

var _commandManager = __webpack_require__(0);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _tableDataHandler = __webpack_require__(2);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(4);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(5);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Implements mergedTableRemoveRow
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

var _tui = tui,
    util = _tui.util;

/**
 * RemoveRow
 * Remove row to selected table
 * @augments Command
 * @augments WysiwygCommand
 * @ignore
 */

var RemoveRow = _commandManager2.default.command('wysiwyg', /** @lends RemoveRow */{
    name: 'RemoveRow',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - WYsiwygEditor instance
     */
    exec: function exec(wwe) {
        var sq = wwe.getEditor();
        var range = sq.getSelection().cloneRange();

        wwe.focus();

        if (!sq.hasFormat('TABLE')) {
            return;
        }

        var $startContainer = $(range.startContainer);
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

/**
 * Update rowspan to row merger.
 * @param {Array.<Array.<object>>} tableData - table data
 * @param {number} startRowIndex - start row index
 * @param {number} endRowIndex - end row index
 * @private
 */
function _updateRowspan(tableData, startRowIndex, endRowIndex) {
    util.range(startRowIndex, endRowIndex + 1).forEach(function (rowIndex) {
        tableData[rowIndex].forEach(function (cell, cellIndex) {
            if (util.isExisty(cell.rowMergeWith)) {
                var merger = tableData[cell.rowMergeWith][cellIndex];

                if (merger.rowspan) {
                    merger.rowspan -= 1;
                }
            } else if (cell.rowspan > 1) {
                var lastMergedRowIndex = rowIndex + cell.rowspan - 1;

                cell.rowspan -= endRowIndex - rowIndex + 1;

                if (lastMergedRowIndex > endRowIndex) {
                    tableData[endRowIndex + 1][cellIndex] = util.extend({}, cell);
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
            if (util.isExisty(cell.rowMergeWith) && cell.rowMergeWith >= startRowIndex) {
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
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Change contextmenu content.
 * @param {object} popupTableUtils - PopupTableUtils instance for managing contextmenu of table
 * @private
 */
function _changeContent(popupTableUtils) {
    var POPUP_CONTENT = ['<button type="button" class="te-table-add-row">' + _i18n2.default.get('Add row') + '</button>', '<button type="button" class="te-table-add-col">' + _i18n2.default.get('Add col') + '</button>', '<button type="button" class="te-table-remove-row">' + _i18n2.default.get('Remove row') + '</button>', '<button type="button" class="te-table-remove-col">' + _i18n2.default.get('Remove col') + '</button>', '<hr/>', '<button type="button" class="te-table-merge">' + _i18n2.default.get('Merge cells') + '</button>', '<button type="button" class="te-table-unmerge">' + _i18n2.default.get('Unmerge cells') + '</button>', '<hr/>', '<button type="button" class="te-table-col-align-left">' + _i18n2.default.get('Align left') + '</button>', '<button type="button" class="te-table-col-align-center">' + _i18n2.default.get('Align center') + '</button>', '<button type="button" class="te-table-col-align-right">' + _i18n2.default.get('Align right') + '</button>', '<hr/>', '<button type="button" class="te-table-remove">' + _i18n2.default.get('Remove table') + '</button>'].join('');
    var $popupContent = $(POPUP_CONTENT);

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
    var $mergeBtn = $($popupContent[5]);
    var $unmergeBtn = $($popupContent[6]);
    var $separator = $($popupContent[7]);

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
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._prependMergeSyntaxToContent = _prependMergeSyntaxToContent;
exports.default = prepareTableUnmerge;
/**
 * @fileoverview Implements tableUnmergePreparer.
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

/**
 * Prepend merge syntax to content.
 * @param {HTMLElement} cell - td or th
 * @private
 */
function _prependMergeSyntaxToContent(cell) {
    var $cell = $(cell);
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
function prepareTableUnmerge(tableElement) {
    $(tableElement).find('td, th').get().forEach(_prependMergeSyntaxToContent);

    return tableElement;
}

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._getAdditionalThCount = _getAdditionalThCount;
exports._createTheadMarkdown = _createTheadMarkdown;
/**
 * @fileoverview Implements toMarkRendererCreator.
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

var _window = window,
    toMark = _window.toMark;

var RX_COLS = /@cols=[0-9]+:/g;

/**
 * Create repeat string.
 * @param {string} str - target string
 * @param {number} count - count
 * @returns {string}
 * @private
 */
function _createRepeatString(str, count) {
    return tui.util.range(0, count).map(function () {
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
        return $(th).attr('colspan');
    }).forEach(function (th) {
        additionalThCount += parseInt($(th).attr('colspan'), 10) - 1;
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
    var ths = $(theadElement).find('th').get();
    var align = ths.map(function (th) {
        return ' ' + _makeTableHeadAlignText(th) + ' |';
    }).join('');

    align += _createRepeatString(' --- |', _getAdditionalThCount(ths));

    return theadContentMarkdown ? theadContentMarkdown + '|' + align + '\n' : '';
}

exports.default = toMark.Renderer.factory(toMark.gfmRenderer, {
    'THEAD': _createTheadMarkdown
});

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._hasMergedCell = _hasMergedCell;
exports._unmergeCells = _unmergeCells;

var _commandManager = __webpack_require__(0);

var _commandManager2 = _interopRequireDefault(_commandManager);

var _tableDataHandler = __webpack_require__(2);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(4);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _tableRenderer = __webpack_require__(5);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Implements UnmergeCell
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

var _tui = tui,
    util = _tui.util;


var UnmergeCell = _commandManager2.default.command('wysiwyg', /** @lends UnmergeCell */{
    name: 'UnmergeCells',
    /**
     * Command handler.
     * @param {WysiwygEditor} wwe - WYsiwygEditor instance
     */
    exec: function exec(wwe) {
        var sq = wwe.getEditor();
        var range = sq.getSelection().cloneRange();

        wwe.focus();

        if (!sq.hasFormat('TABLE')) {
            return;
        }

        var $startContainer = $(range.startContainer);
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
    var colRange = util.range(startColIndex, limitColIndex);

    util.range(startRowIndex, limitRowIndex).forEach(function (rowIndex) {
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

    var colRange = util.range(startRange.colIndex, endRange.colIndex + 1);

    util.range(startRange.rowIndex, endRange.rowIndex + 1).forEach(function (rowIndex) {
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
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wwTableManager = __webpack_require__(39);

var _wwTableManager2 = _interopRequireDefault(_wwTableManager);

var _tableDataHandler = __webpack_require__(2);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRenderer = __webpack_require__(5);

var _tableRenderer2 = _interopRequireDefault(_tableRenderer);

var _tableRangeHandler = __webpack_require__(4);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

var _i18n = __webpack_require__(3);

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements wysiwyg merged table manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var _tui = tui,
    util = _tui.util;

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
                    if (util.isExisty(cellData.rowMergeWith)) {
                        cellData.rowMergeWith -= startRange.rowIndex;
                    }

                    if (util.isExisty(cellData.colMergeWith)) {
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
                var tableData = _tableDataHandler2.default.createTableData($($selectedCells[0]).closest('TABLE'));

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
            var $table = $(node);
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

                util.range(0, increaseRowCount - 1).forEach(function () {
                    var newRows = JSON.parse(JSON.stringify(originalData));

                    clipboardTableData.push.apply(clipboardTableData, newRows);
                });
            }

            if (increaseColCount > 1) {
                var _originalData = JSON.parse(JSON.stringify(clipboardTableData));

                util.range(0, increaseColCount - 1).forEach(function () {
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
                return util.isExisty(cellData.rowMergeWith);
            });

            if (isPossible) {
                var firstCells = util.pluck(filterdTableData, startColIndex);

                isPossible = !any(firstCells, function (cellData) {
                    return util.isExisty(cellData.colMergeWith);
                });
            }

            if (isPossible && tableData.length > endRowIndex + 1) {
                var nextRow = tableData[endRowIndex + 1].slice(startColIndex, endColIndex + 1);

                isPossible = !any(nextRow, function (cellData) {
                    return util.isExisty(cellData.rowMergeWith);
                });
            }

            if (isPossible && tableData[0].length > endColIndex + 1) {
                var nextCells = util.pluck(filterdTableData, endColIndex + 1);

                isPossible = !any(nextCells, function (cellData) {
                    return util.isExisty(cellData.colMergeWith);
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

            endRowIndex = util.isExisty(lastCellData.rowMergeWith) ? lastCellData.rowMergeWith : endRowIndex;
            endColIndex = util.isExisty(lastCellData.colMergeWith) ? lastCellData.colMergeWith : endColIndex;

            var lastCellIndex = tableData[endRowIndex][endColIndex].elementIndex;
            var lastTd = $bookmarkedTable.find('tr').eq(lastCellIndex.rowIndex).children()[lastCellIndex.colIndex];

            $bookmarkedTable.removeClass(PASTE_TABLE_BOOKMARK);
            $(lastTd).addClass(PASTE_TABLE_CELL_BOOKMARK);
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
            var alertMessage = _i18n2.default.get('Cannot change part of merged cell');
            var updated = true;
            var endCellIndex = void 0;

            if (this._hasRowMergedHeader(clipboardTableData, tableData, startRange)) {
                alertMessage = _i18n2.default.get('Cannot paste row merged cells into the table header');
                updated = false;
            } else if (this._isExactlyFit(clipboardTableData, targetRowCount, targetColCount)) {
                // data가 clipboard영역에 딱 맞는 경우(배수 포함)

                endCellIndex = endRange;
                this._updateClipboardTableData(clipboardTableData, targetRowCount, targetColCount);
                this._updateTableDataByClipboardData(clipboardTableData, tableData, startRange);
            } else if (isSelectionLargerThanData) {
                // selection이 paste 데이터 보다 큰 경우
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
                // selection이 paste 데이터 보다 작은 경우
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
            var newRows = util.range(startRowIndex, startRowIndex + expandCount).map(function (rowIndex) {
                return util.range(0, cellCount).map(function (colIndex) {
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
            var additionalCellRange = util.range(startCellIndex, startCellIndex + expandCount);

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
                alert(_i18n2.default.get('Cannot paste row merged cells into the table header'));
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
                alert(_i18n2.default.get('Cannot change part of merged cell'));
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
            var $startCell = $(this._findStartCell($selectedCells));
            var $table = $startCell.closest('table');
            var tableData = _tableDataHandler2.default.createTableData($table);
            var startCellIndex = this._findStartCellIndex(tableData, $startCell);

            if ($selectedCells.length > 1) {
                // selection 상태
                this._pasteToSelectedArea($table, clipboardTableData, tableData, $selectedCells);
            } else {
                // cursor 상태
                this._pasteAllClipboardTableData($table, clipboardTableData, tableData, startCellIndex);
            }
        }
    }]);

    return WwMergedTableManager;
}(_wwTableManager2.default);

/**
 * Whether one of them is true or not.
 * @param {Array} arr - target array
 * @param {function} contition - condition function
 * @returns {boolean}
 * @ignore
 */


function any(arr, contition) {
    var result = false;

    util.forEach(arr, function (item) {
        result = contition(item);

        return !result;
    });

    return result;
}

module.exports = WwMergedTableManager;

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wwTableSelectionManager = __webpack_require__(40);

var _wwTableSelectionManager2 = _interopRequireDefault(_wwTableSelectionManager);

var _tableDataHandler = __webpack_require__(2);

var _tableDataHandler2 = _interopRequireDefault(_tableDataHandler);

var _tableRangeHandler = __webpack_require__(4);

var _tableRangeHandler2 = _interopRequireDefault(_tableRangeHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements wysiwyg merged table selection manager
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var TABLE_CELL_SELECTED_CLASS_NAME = 'te-cell-selected';

var _tui = tui,
    util = _tui.util;

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
            var cellIndexRange = util.range(startRange.colIndex, endRange.colIndex + 1);
            var $trs = $table.find('tr');

            util.range(startRange.rowIndex, endRange.rowIndex + 1).forEach(function (rowIndex) {
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
            var $table = $(selectionStart).closest('[contenteditable=true] table');
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
            var $start = $(selectionStart);
            var $end = $(selectionEnd);
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
            var $table = $(range.startContainer).closest('[contenteditable=true] table');

            $table.find('tr').get().forEach(function (tr) {
                var $cells = $(tr).find('.' + TABLE_CELL_SELECTED_CLASS_NAME);
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
}(_wwTableSelectionManager2.default);

exports.default = WwMergedTableSelectionManager;

/***/ }),
/* 63 */,
/* 64 */,
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileoverview Implements LazyRunner
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

var _tui = tui,
    util = _tui.util;

/**
 * Class LazyRunner
 */

var LazyRunner = function () {
    /**
     * Creates an instance of LazyRunner.
     * @memberof LazyRunner
     */
    function LazyRunner() {
        _classCallCheck(this, LazyRunner);

        this.globalTOID = null;
        this.lazyRunFunctions = {};
    }

    _createClass(LazyRunner, [{
        key: "run",
        value: function run(fn, params, context, delay) {
            var TOID = void 0;

            if (util.isString(fn)) {
                TOID = this._runRegisteredRun(fn, params, context, delay);
            } else {
                TOID = this._runSingleRun(fn, params, context, delay, this.globalTOID);
                this.globalTOID = TOID;
            }

            return TOID;
        }
    }, {
        key: "registerLazyRunFunction",
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
        key: "_runSingleRun",
        value: function _runSingleRun(fn, params, context, delay, TOID) {
            this._clearTOIDIfNeed(TOID);

            TOID = setTimeout(function () {
                fn.call(context, params);
            }, delay);

            return TOID;
        }
    }, {
        key: "_runRegisteredRun",
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
        key: "_clearTOIDIfNeed",
        value: function _clearTOIDIfNeed(TOID) {
            if (TOID) {
                clearTimeout(TOID);
            }
        }
    }]);

    return LazyRunner;
}();

module.exports = LazyRunner;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under MIT license: https://github.com/markdown-it/markdown-it/

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
        // https://github.nhnent.com/fe/tui.editor/pull/981
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
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under MIT license: https://github.com/markdown-it/markdown-it/

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
  if (currentLine.match(FIND_LIST_RX /*&& !currentLine.match(/^ {0,6}>/)*/)) {
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
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2016, Revin Guillen.
// Distributed under an MIT license: https://github.com/revin/markdown-it-task-lists/
/* eslint-disable */
/**
 * @fileoverview Implements markdownitCodeBlockPlugin
 * @modifier Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
 * @modifier Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
 */

/**
 * Code block renderer for Markdown-it
 * @param {object} markdownit Markdown-it instance
 * @ignore
 */
var MarkdownitCodeBlockRenderer = function MarkdownitCodeBlockRenderer(markdownit) {
    markdownit.core.ruler.after('block', 'tui-code-block', function (state) {
        var tokens = state.tokens;
        var currentToken, tokenIndex;

        for (tokenIndex = 0; tokenIndex < tokens.length; tokenIndex += 1) {
            currentToken = tokens[tokenIndex];

            if (isCodeFenceToken(currentToken) && currentToken.info) {
                setTokenAttribute(currentToken, 'data-language', escape(currentToken.info.replace(' ', ''), true));
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
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under an ISC license: https://github.com/markdown-it/markdown-it/
/**
 * @fileoverview Implements MarkdownItCodeRenderer
 * @modifier Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
 * @modifier Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
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
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under an ISC license: https://github.com/markdown-it/markdown-it/

/**
 * @fileoverview Implements markdownitHtmlBlockRenderer
 * @modifier Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
 * @modifier Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
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
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under an ISC license: https://github.com/markdown-it/markdown-it/

/**
 * @fileoverview Implements markdownitTableRenderer
 * @modifier Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
 * @modifier Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
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
/*eslint-enable */

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Copyright (c) 2016, Revin Guillen.
// Distributed under an MIT license: https://github.com/revin/markdown-it-task-lists/

/**
 * @fileoverview Implements markdownitTaskPlugin
 * @modifier Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
 * @modifier Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
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
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*eslint-disable */
/**
 * Diff Match and Patch
 *
 * Copyright 2006 Google Inc.
 * http://code.google.com/p/google-diff-match-patch/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Computes the difference between two texts to create a patch.
 * Applies the patch onto another text, allowing for errors.
 * @author fraser@google.com (Neil Fraser)
 */

/**
 * Class containing the diff, match and patch methods.
 * @constructor
 * @ignore
 */
function diff_match_patch() {

  // Defaults.
  // Redefine these in your program to override the defaults.

  // Number of seconds to map a diff before giving up (0 for infinity).
  this.Diff_Timeout = 1.0;
  // Cost of an empty edit operation in terms of edit characters.
  this.Diff_EditCost = 4;
  // At what point is no match declared (0.0 = perfection, 1.0 = very loose).
  this.Match_Threshold = 0.5;
  // How far to search for a match (0 = exact location, 1000+ = broad match).
  // A match this many characters away from the expected location will add
  // 1.0 to the score (0.0 is a perfect match).
  this.Match_Distance = 1000;
  // When deleting a large block of text (over ~64 characters), how close do
  // the contents have to be to match the expected contents. (0.0 = perfection,
  // 1.0 = very loose).  Note that Match_Threshold controls how closely the
  // end points of a delete need to match.
  this.Patch_DeleteThreshold = 0.5;
  // Chunk size for context length.
  this.Patch_Margin = 4;

  // The number of bits in an int.
  this.Match_MaxBits = 32;
}

//  DIFF FUNCTIONS

/**
 * The data structure representing a diff is an array of tuples:
 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
 * @ignore
 */
var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;

/** @typedef {{0: number, 1: string}} */
diff_match_patch.Diff;

/**
 * Find the differences between two texts.  Simplifies the problem by stripping
 * any common prefix or suffix off the texts before diffing.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {boolean=} opt_checklines Optional speedup flag. If present and false,
 *     then don't run a line-level diff first to identify the changed areas.
 *     Defaults to true, which does a faster, slightly less optimal diff.
 * @param {number} opt_deadline Optional time when the diff should be complete
 *     by.  Used internally for recursive calls.  Users should set DiffTimeout
 *     instead.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 */
diff_match_patch.prototype.diff_main = function (text1, text2, opt_checklines, opt_deadline) {
  // Set a deadline by which time the diff must be complete.
  if (typeof opt_deadline == 'undefined') {
    if (this.Diff_Timeout <= 0) {
      opt_deadline = Number.MAX_VALUE;
    } else {
      opt_deadline = new Date().getTime() + this.Diff_Timeout * 1000;
    }
  }
  var deadline = opt_deadline;

  // Check for null inputs.
  if (text1 == null || text2 == null) {
    throw new Error('Null input. (diff_main)');
  }

  // Check for equality (speedup).
  if (text1 == text2) {
    if (text1) {
      return [[DIFF_EQUAL, text1]];
    }
    return [];
  }

  if (typeof opt_checklines == 'undefined') {
    opt_checklines = true;
  }
  var checklines = opt_checklines;

  // Trim off common prefix (speedup).
  var commonlength = this.diff_commonPrefix(text1, text2);
  var commonprefix = text1.substring(0, commonlength);
  text1 = text1.substring(commonlength);
  text2 = text2.substring(commonlength);

  // Trim off common suffix (speedup).
  commonlength = this.diff_commonSuffix(text1, text2);
  var commonsuffix = text1.substring(text1.length - commonlength);
  text1 = text1.substring(0, text1.length - commonlength);
  text2 = text2.substring(0, text2.length - commonlength);

  // Compute the diff on the middle block.
  var diffs = this.diff_compute_(text1, text2, checklines, deadline);

  // Restore the prefix and suffix.
  if (commonprefix) {
    diffs.unshift([DIFF_EQUAL, commonprefix]);
  }
  if (commonsuffix) {
    diffs.push([DIFF_EQUAL, commonsuffix]);
  }
  this.diff_cleanupMerge(diffs);
  return diffs;
};

/**
 * Find the differences between two texts.  Assumes that the texts do not
 * have any common prefix or suffix.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {boolean} checklines Speedup flag.  If false, then don't run a
 *     line-level diff first to identify the changed areas.
 *     If true, then run a faster, slightly less optimal diff.
 * @param {number} deadline Time when the diff should be complete by.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_compute_ = function (text1, text2, checklines, deadline) {
  var diffs;

  if (!text1) {
    // Just add some text (speedup).
    return [[DIFF_INSERT, text2]];
  }

  if (!text2) {
    // Just delete some text (speedup).
    return [[DIFF_DELETE, text1]];
  }

  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  var i = longtext.indexOf(shorttext);
  if (i != -1) {
    // Shorter text is inside the longer text (speedup).
    diffs = [[DIFF_INSERT, longtext.substring(0, i)], [DIFF_EQUAL, shorttext], [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
    // Swap insertions for deletions if diff is reversed.
    if (text1.length > text2.length) {
      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
    }
    return diffs;
  }

  if (shorttext.length == 1) {
    // Single character string.
    // After the previous speedup, the character can't be an equality.
    return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
  }

  // Check to see if the problem can be split in two.
  var hm = this.diff_halfMatch_(text1, text2);
  if (hm) {
    // A half-match was found, sort out the return data.
    var text1_a = hm[0];
    var text1_b = hm[1];
    var text2_a = hm[2];
    var text2_b = hm[3];
    var mid_common = hm[4];
    // Send both pairs off for separate processing.
    var diffs_a = this.diff_main(text1_a, text2_a, checklines, deadline);
    var diffs_b = this.diff_main(text1_b, text2_b, checklines, deadline);
    // Merge the results.
    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
  }

  if (checklines && text1.length > 100 && text2.length > 100) {
    return this.diff_lineMode_(text1, text2, deadline);
  }

  return this.diff_bisect_(text1, text2, deadline);
};

/**
 * Do a quick line-level diff on both strings, then rediff the parts for
 * greater accuracy.
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} deadline Time when the diff should be complete by.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_lineMode_ = function (text1, text2, deadline) {
  // Scan the text on a line-by-line basis first.
  var a = this.diff_linesToChars_(text1, text2);
  text1 = a.chars1;
  text2 = a.chars2;
  var linearray = a.lineArray;

  var diffs = this.diff_main(text1, text2, false, deadline);

  // Convert the diff back to original text.
  this.diff_charsToLines_(diffs, linearray);
  // Eliminate freak matches (e.g. blank lines)
  this.diff_cleanupSemantic(diffs);

  // Rediff any replacement blocks, this time character-by-character.
  // Add a dummy entry at the end.
  diffs.push([DIFF_EQUAL, '']);
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        break;
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete >= 1 && count_insert >= 1) {
          // Delete the offending records and add the merged ones.
          diffs.splice(pointer - count_delete - count_insert, count_delete + count_insert);
          pointer = pointer - count_delete - count_insert;
          var a = this.diff_main(text_delete, text_insert, false, deadline);
          for (var j = a.length - 1; j >= 0; j--) {
            diffs.splice(pointer, 0, a[j]);
          }
          pointer = pointer + a.length;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break;
    }
    pointer++;
  }
  diffs.pop(); // Remove the dummy entry at the end.

  return diffs;
};

/**
 * Find the 'middle snake' of a diff, split the problem in two
 * and return the recursively constructed diff.
 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} deadline Time at which to bail if not yet complete.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_bisect_ = function (text1, text2, deadline) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  var max_d = Math.ceil((text1_length + text2_length) / 2);
  var v_offset = max_d;
  var v_length = 2 * max_d;
  var v1 = new Array(v_length);
  var v2 = new Array(v_length);
  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
  // integers and undefined.
  for (var x = 0; x < v_length; x++) {
    v1[x] = -1;
    v2[x] = -1;
  }
  v1[v_offset + 1] = 0;
  v2[v_offset + 1] = 0;
  var delta = text1_length - text2_length;
  // If the total number of characters is odd, then the front path will collide
  // with the reverse path.
  var front = delta % 2 != 0;
  // Offsets for start and end of k loop.
  // Prevents mapping of space beyond the grid.
  var k1start = 0;
  var k1end = 0;
  var k2start = 0;
  var k2end = 0;
  for (var d = 0; d < max_d; d++) {
    // Bail out if deadline is reached.
    if (new Date().getTime() > deadline) {
      break;
    }

    // Walk the front path one step.
    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
      var k1_offset = v_offset + k1;
      var x1;
      if (k1 == -d || k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1]) {
        x1 = v1[k1_offset + 1];
      } else {
        x1 = v1[k1_offset - 1] + 1;
      }
      var y1 = x1 - k1;
      while (x1 < text1_length && y1 < text2_length && text1.charAt(x1) == text2.charAt(y1)) {
        x1++;
        y1++;
      }
      v1[k1_offset] = x1;
      if (x1 > text1_length) {
        // Ran off the right of the graph.
        k1end += 2;
      } else if (y1 > text2_length) {
        // Ran off the bottom of the graph.
        k1start += 2;
      } else if (front) {
        var k2_offset = v_offset + delta - k1;
        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
          // Mirror x2 onto top-left coordinate system.
          var x2 = text1_length - v2[k2_offset];
          if (x1 >= x2) {
            // Overlap detected.
            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
          }
        }
      }
    }

    // Walk the reverse path one step.
    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
      var k2_offset = v_offset + k2;
      var x2;
      if (k2 == -d || k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1]) {
        x2 = v2[k2_offset + 1];
      } else {
        x2 = v2[k2_offset - 1] + 1;
      }
      var y2 = x2 - k2;
      while (x2 < text1_length && y2 < text2_length && text1.charAt(text1_length - x2 - 1) == text2.charAt(text2_length - y2 - 1)) {
        x2++;
        y2++;
      }
      v2[k2_offset] = x2;
      if (x2 > text1_length) {
        // Ran off the left of the graph.
        k2end += 2;
      } else if (y2 > text2_length) {
        // Ran off the top of the graph.
        k2start += 2;
      } else if (!front) {
        var k1_offset = v_offset + delta - k2;
        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
          var x1 = v1[k1_offset];
          var y1 = v_offset + x1 - k1_offset;
          // Mirror x2 onto top-left coordinate system.
          x2 = text1_length - x2;
          if (x1 >= x2) {
            // Overlap detected.
            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
          }
        }
      }
    }
  }
  // Diff took too long and hit the deadline or
  // number of diffs equals number of characters, no commonality at all.
  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
};

/**
 * Given the location of the 'middle snake', split the diff in two parts
 * and recurse.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} x Index of split point in text1.
 * @param {number} y Index of split point in text2.
 * @param {number} deadline Time at which to bail if not yet complete.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_bisectSplit_ = function (text1, text2, x, y, deadline) {
  var text1a = text1.substring(0, x);
  var text2a = text2.substring(0, y);
  var text1b = text1.substring(x);
  var text2b = text2.substring(y);

  // Compute both diffs serially.
  var diffs = this.diff_main(text1a, text2a, false, deadline);
  var diffsb = this.diff_main(text1b, text2b, false, deadline);

  return diffs.concat(diffsb);
};

/**
 * Split two texts into an array of strings.  Reduce the texts to a string of
 * hashes where each Unicode character represents one line.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {{chars1: string, chars2: string, lineArray: !Array.<string>}}
 *     An object containing the encoded text1, the encoded text2 and
 *     the array of unique strings.
 *     The zeroth element of the array of unique strings is intentionally blank.
 * @private
 */
diff_match_patch.prototype.diff_linesToChars_ = function (text1, text2) {
  var lineArray = []; // e.g. lineArray[4] == 'Hello\n'
  var lineHash = {}; // e.g. lineHash['Hello\n'] == 4

  // '\x00' is a valid character, but various debuggers don't like it.
  // So we'll insert a junk entry to avoid generating a null character.
  lineArray[0] = '';

  /**
   * Split a text into an array of strings.  Reduce the texts to a string of
   * hashes where each Unicode character represents one line.
   * Modifies linearray and linehash through being a closure.
   * @param {string} text String to encode.
   * @return {string} Encoded string.
   * @private
   */
  function diff_linesToCharsMunge_(text) {
    var chars = '';
    // Walk the text, pulling out a substring for each line.
    // text.split('\n') would would temporarily double our memory footprint.
    // Modifying text would create many large strings to garbage collect.
    var lineStart = 0;
    var lineEnd = -1;
    // Keeping our own length variable is faster than looking it up.
    var lineArrayLength = lineArray.length;
    while (lineEnd < text.length - 1) {
      lineEnd = text.indexOf('\n', lineStart);
      if (lineEnd == -1) {
        lineEnd = text.length - 1;
      }
      var line = text.substring(lineStart, lineEnd + 1);
      lineStart = lineEnd + 1;

      if (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) : lineHash[line] !== undefined) {
        chars += String.fromCharCode(lineHash[line]);
      } else {
        chars += String.fromCharCode(lineArrayLength);
        lineHash[line] = lineArrayLength;
        lineArray[lineArrayLength++] = line;
      }
    }
    return chars;
  }

  var chars1 = diff_linesToCharsMunge_(text1);
  var chars2 = diff_linesToCharsMunge_(text2);
  return { chars1: chars1, chars2: chars2, lineArray: lineArray };
};

/**
 * Rehydrate the text in a diff from a string of line hashes to real lines of
 * text.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @param {!Array.<string>} lineArray Array of unique strings.
 * @private
 */
diff_match_patch.prototype.diff_charsToLines_ = function (diffs, lineArray) {
  for (var x = 0; x < diffs.length; x++) {
    var chars = diffs[x][1];
    var text = [];
    for (var y = 0; y < chars.length; y++) {
      text[y] = lineArray[chars.charCodeAt(y)];
    }
    diffs[x][1] = text.join('');
  }
};

/**
 * Determine the common prefix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the start of each
 *     string.
 */
diff_match_patch.prototype.diff_commonPrefix = function (text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerstart = 0;
  while (pointermin < pointermid) {
    if (text1.substring(pointerstart, pointermid) == text2.substring(pointerstart, pointermid)) {
      pointermin = pointermid;
      pointerstart = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};

/**
 * Determine the common suffix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of each string.
 */
diff_match_patch.prototype.diff_commonSuffix = function (text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerend = 0;
  while (pointermin < pointermid) {
    if (text1.substring(text1.length - pointermid, text1.length - pointerend) == text2.substring(text2.length - pointermid, text2.length - pointerend)) {
      pointermin = pointermid;
      pointerend = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};

/**
 * Determine if the suffix of one string is the prefix of another.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of the first
 *     string and the start of the second string.
 * @private
 */
diff_match_patch.prototype.diff_commonOverlap_ = function (text1, text2) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  // Eliminate the null case.
  if (text1_length == 0 || text2_length == 0) {
    return 0;
  }
  // Truncate the longer string.
  if (text1_length > text2_length) {
    text1 = text1.substring(text1_length - text2_length);
  } else if (text1_length < text2_length) {
    text2 = text2.substring(0, text1_length);
  }
  var text_length = Math.min(text1_length, text2_length);
  // Quick check for the worst case.
  if (text1 == text2) {
    return text_length;
  }

  // Start by looking for a single character match
  // and increase length until no match is found.
  // Performance analysis: http://neil.fraser.name/news/2010/11/04/
  var best = 0;
  var length = 1;
  while (true) {
    var pattern = text1.substring(text_length - length);
    var found = text2.indexOf(pattern);
    if (found == -1) {
      return best;
    }
    length += found;
    if (found == 0 || text1.substring(text_length - length) == text2.substring(0, length)) {
      best = length;
      length++;
    }
  }
};

/**
 * Do the two texts share a substring which is at least half the length of the
 * longer text?
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {Array.<string>} Five element Array, containing the prefix of
 *     text1, the suffix of text1, the prefix of text2, the suffix of
 *     text2 and the common middle.  Or null if there was no match.
 * @private
 */
diff_match_patch.prototype.diff_halfMatch_ = function (text1, text2) {
  if (this.Diff_Timeout <= 0) {
    // Don't risk returning a non-optimal diff if we have unlimited time.
    return null;
  }
  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
    return null; // Pointless.
  }
  var dmp = this; // 'this' becomes 'window' in a closure.

  /**
   * Does a substring of shorttext exist within longtext such that the substring
   * is at least half the length of longtext?
   * Closure, but does not reference any external variables.
   * @param {string} longtext Longer string.
   * @param {string} shorttext Shorter string.
   * @param {number} i Start index of quarter length substring within longtext.
   * @return {Array.<string>} Five element Array, containing the prefix of
   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
   *     of shorttext and the common middle.  Or null if there was no match.
   * @private
   */
  function diff_halfMatchI_(longtext, shorttext, i) {
    // Start with a 1/4 length substring at position i as a seed.
    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
    var j = -1;
    var best_common = '';
    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
      var prefixLength = dmp.diff_commonPrefix(longtext.substring(i), shorttext.substring(j));
      var suffixLength = dmp.diff_commonSuffix(longtext.substring(0, i), shorttext.substring(0, j));
      if (best_common.length < suffixLength + prefixLength) {
        best_common = shorttext.substring(j - suffixLength, j) + shorttext.substring(j, j + prefixLength);
        best_longtext_a = longtext.substring(0, i - suffixLength);
        best_longtext_b = longtext.substring(i + prefixLength);
        best_shorttext_a = shorttext.substring(0, j - suffixLength);
        best_shorttext_b = shorttext.substring(j + prefixLength);
      }
    }
    if (best_common.length * 2 >= longtext.length) {
      return [best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b, best_common];
    } else {
      return null;
    }
  }

  // First check if the second quarter is the seed for a half-match.
  var hm1 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 4));
  // Check again based on the third quarter.
  var hm2 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 2));
  var hm;
  if (!hm1 && !hm2) {
    return null;
  } else if (!hm2) {
    hm = hm1;
  } else if (!hm1) {
    hm = hm2;
  } else {
    // Both matched.  Select the longest.
    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
  }

  // A half-match was found, sort out the return data.
  var text1_a, text1_b, text2_a, text2_b;
  if (text1.length > text2.length) {
    text1_a = hm[0];
    text1_b = hm[1];
    text2_a = hm[2];
    text2_b = hm[3];
  } else {
    text2_a = hm[0];
    text2_b = hm[1];
    text1_a = hm[2];
    text1_b = hm[3];
  }
  var mid_common = hm[4];
  return [text1_a, text1_b, text2_a, text2_b, mid_common];
};

/**
 * Reduce the number of edits by eliminating semantically trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupSemantic = function (diffs) {
  var changes = false;
  var equalities = []; // Stack of indices where equalities are found.
  var equalitiesLength = 0; // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastequality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0; // Index of current position.
  // Number of characters that changed prior to the equality.
  var length_insertions1 = 0;
  var length_deletions1 = 0;
  // Number of characters that changed after the equality.
  var length_insertions2 = 0;
  var length_deletions2 = 0;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {
      // Equality found.
      equalities[equalitiesLength++] = pointer;
      length_insertions1 = length_insertions2;
      length_deletions1 = length_deletions2;
      length_insertions2 = 0;
      length_deletions2 = 0;
      lastequality = diffs[pointer][1];
    } else {
      // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_INSERT) {
        length_insertions2 += diffs[pointer][1].length;
      } else {
        length_deletions2 += diffs[pointer][1].length;
      }
      // Eliminate an equality that is smaller or equal to the edits on both
      // sides of it.
      if (lastequality && lastequality.length <= Math.max(length_insertions1, length_deletions1) && lastequality.length <= Math.max(length_insertions2, length_deletions2)) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE, lastequality]);
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        // Throw away the equality we just deleted.
        equalitiesLength--;
        // Throw away the previous equality (it needs to be reevaluated).
        equalitiesLength--;
        pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
        length_insertions1 = 0; // Reset the counters.
        length_deletions1 = 0;
        length_insertions2 = 0;
        length_deletions2 = 0;
        lastequality = null;
        changes = true;
      }
    }
    pointer++;
  }

  // Normalize the diff.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
  this.diff_cleanupSemanticLossless(diffs);

  // Find any overlaps between deletions and insertions.
  // e.g: <del>abcxxx</del><ins>xxxdef</ins>
  //   -> <del>abc</del>xxx<ins>def</ins>
  // e.g: <del>xxxabc</del><ins>defxxx</ins>
  //   -> <ins>def</ins>xxx<del>abc</del>
  // Only extract an overlap if it is as big as the edit ahead or behind it.
  pointer = 1;
  while (pointer < diffs.length) {
    if (diffs[pointer - 1][0] == DIFF_DELETE && diffs[pointer][0] == DIFF_INSERT) {
      var deletion = diffs[pointer - 1][1];
      var insertion = diffs[pointer][1];
      var overlap_length1 = this.diff_commonOverlap_(deletion, insertion);
      var overlap_length2 = this.diff_commonOverlap_(insertion, deletion);
      if (overlap_length1 >= overlap_length2) {
        if (overlap_length1 >= deletion.length / 2 || overlap_length1 >= insertion.length / 2) {
          // Overlap found.  Insert an equality and trim the surrounding edits.
          diffs.splice(pointer, 0, [DIFF_EQUAL, insertion.substring(0, overlap_length1)]);
          diffs[pointer - 1][1] = deletion.substring(0, deletion.length - overlap_length1);
          diffs[pointer + 1][1] = insertion.substring(overlap_length1);
          pointer++;
        }
      } else {
        if (overlap_length2 >= deletion.length / 2 || overlap_length2 >= insertion.length / 2) {
          // Reverse overlap found.
          // Insert an equality and swap and trim the surrounding edits.
          diffs.splice(pointer, 0, [DIFF_EQUAL, deletion.substring(0, overlap_length2)]);
          diffs[pointer - 1][0] = DIFF_INSERT;
          diffs[pointer - 1][1] = insertion.substring(0, insertion.length - overlap_length2);
          diffs[pointer + 1][0] = DIFF_DELETE;
          diffs[pointer + 1][1] = deletion.substring(overlap_length2);
          pointer++;
        }
      }
      pointer++;
    }
    pointer++;
  }
};

/**
 * Look for single edits surrounded on both sides by equalities
 * which can be shifted sideways to align the edit to a word boundary.
 * e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupSemanticLossless = function (diffs) {
  /**
   * Given two strings, compute a score representing whether the internal
   * boundary falls on logical boundaries.
   * Scores range from 6 (best) to 0 (worst).
   * Closure, but does not reference any external variables.
   * @param {string} one First string.
   * @param {string} two Second string.
   * @return {number} The score.
   * @private
   */
  function diff_cleanupSemanticScore_(one, two) {
    if (!one || !two) {
      // Edges are the best.
      return 6;
    }

    // Each port of this function behaves slightly differently due to
    // subtle differences in each language's definition of things like
    // 'whitespace'.  Since this function's purpose is largely cosmetic,
    // the choice has been made to use each language's native features
    // rather than force total conformity.
    var char1 = one.charAt(one.length - 1);
    var char2 = two.charAt(0);
    var nonAlphaNumeric1 = char1.match(diff_match_patch.nonAlphaNumericRegex_);
    var nonAlphaNumeric2 = char2.match(diff_match_patch.nonAlphaNumericRegex_);
    var whitespace1 = nonAlphaNumeric1 && char1.match(diff_match_patch.whitespaceRegex_);
    var whitespace2 = nonAlphaNumeric2 && char2.match(diff_match_patch.whitespaceRegex_);
    var lineBreak1 = whitespace1 && char1.match(diff_match_patch.linebreakRegex_);
    var lineBreak2 = whitespace2 && char2.match(diff_match_patch.linebreakRegex_);
    var blankLine1 = lineBreak1 && one.match(diff_match_patch.blanklineEndRegex_);
    var blankLine2 = lineBreak2 && two.match(diff_match_patch.blanklineStartRegex_);

    if (blankLine1 || blankLine2) {
      // Five points for blank lines.
      return 5;
    } else if (lineBreak1 || lineBreak2) {
      // Four points for line breaks.
      return 4;
    } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
      // Three points for end of sentences.
      return 3;
    } else if (whitespace1 || whitespace2) {
      // Two points for whitespace.
      return 2;
    } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
      // One point for non-alphanumeric.
      return 1;
    }
    return 0;
  }

  var pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      var equality1 = diffs[pointer - 1][1];
      var edit = diffs[pointer][1];
      var equality2 = diffs[pointer + 1][1];

      // First, shift the edit as far left as possible.
      var commonOffset = this.diff_commonSuffix(equality1, edit);
      if (commonOffset) {
        var commonString = edit.substring(edit.length - commonOffset);
        equality1 = equality1.substring(0, equality1.length - commonOffset);
        edit = commonString + edit.substring(0, edit.length - commonOffset);
        equality2 = commonString + equality2;
      }

      // Second, step character by character right, looking for the best fit.
      var bestEquality1 = equality1;
      var bestEdit = edit;
      var bestEquality2 = equality2;
      var bestScore = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
      while (edit.charAt(0) === equality2.charAt(0)) {
        equality1 += edit.charAt(0);
        edit = edit.substring(1) + equality2.charAt(0);
        equality2 = equality2.substring(1);
        var score = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
        // The >= encourages trailing rather than leading whitespace on edits.
        if (score >= bestScore) {
          bestScore = score;
          bestEquality1 = equality1;
          bestEdit = edit;
          bestEquality2 = equality2;
        }
      }

      if (diffs[pointer - 1][1] != bestEquality1) {
        // We have an improvement, save it back to the diff.
        if (bestEquality1) {
          diffs[pointer - 1][1] = bestEquality1;
        } else {
          diffs.splice(pointer - 1, 1);
          pointer--;
        }
        diffs[pointer][1] = bestEdit;
        if (bestEquality2) {
          diffs[pointer + 1][1] = bestEquality2;
        } else {
          diffs.splice(pointer + 1, 1);
          pointer--;
        }
      }
    }
    pointer++;
  }
};

// Define some regex patterns for matching boundaries.
diff_match_patch.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
diff_match_patch.whitespaceRegex_ = /\s/;
diff_match_patch.linebreakRegex_ = /[\r\n]/;
diff_match_patch.blanklineEndRegex_ = /\n\r?\n$/;
diff_match_patch.blanklineStartRegex_ = /^\r?\n\r?\n/;

/**
 * Reduce the number of edits by eliminating operationally trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupEfficiency = function (diffs) {
  var changes = false;
  var equalities = []; // Stack of indices where equalities are found.
  var equalitiesLength = 0; // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastequality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0; // Index of current position.
  // Is there an insertion operation before the last equality.
  var pre_ins = false;
  // Is there a deletion operation before the last equality.
  var pre_del = false;
  // Is there an insertion operation after the last equality.
  var post_ins = false;
  // Is there a deletion operation after the last equality.
  var post_del = false;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {
      // Equality found.
      if (diffs[pointer][1].length < this.Diff_EditCost && (post_ins || post_del)) {
        // Candidate found.
        equalities[equalitiesLength++] = pointer;
        pre_ins = post_ins;
        pre_del = post_del;
        lastequality = diffs[pointer][1];
      } else {
        // Not a candidate, and can never become one.
        equalitiesLength = 0;
        lastequality = null;
      }
      post_ins = post_del = false;
    } else {
      // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_DELETE) {
        post_del = true;
      } else {
        post_ins = true;
      }
      /*
       * Five types to be split:
       * <ins>A</ins><del>B</del>XY<ins>C</ins><del>D</del>
       * <ins>A</ins>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<ins>C</ins>
       * <ins>A</del>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<del>C</del>
       */
      if (lastequality && (pre_ins && pre_del && post_ins && post_del || lastequality.length < this.Diff_EditCost / 2 && pre_ins + pre_del + post_ins + post_del == 3)) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE, lastequality]);
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        equalitiesLength--; // Throw away the equality we just deleted;
        lastequality = null;
        if (pre_ins && pre_del) {
          // No changes made which could affect previous entry, keep going.
          post_ins = post_del = true;
          equalitiesLength = 0;
        } else {
          equalitiesLength--; // Throw away the previous equality.
          pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
          post_ins = post_del = false;
        }
        changes = true;
      }
    }
    pointer++;
  }

  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};

/**
 * Reorder and merge like edit sections.  Merge equalities.
 * Any edit section can move as long as it doesn't cross an equality.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupMerge = function (diffs) {
  diffs.push([DIFF_EQUAL, '']); // Add a dummy entry at the end.
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  var commonlength;
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete + count_insert > 1) {
          if (count_delete !== 0 && count_insert !== 0) {
            // Factor out any common prefixies.
            commonlength = this.diff_commonPrefix(text_insert, text_delete);
            if (commonlength !== 0) {
              if (pointer - count_delete - count_insert > 0 && diffs[pointer - count_delete - count_insert - 1][0] == DIFF_EQUAL) {
                diffs[pointer - count_delete - count_insert - 1][1] += text_insert.substring(0, commonlength);
              } else {
                diffs.splice(0, 0, [DIFF_EQUAL, text_insert.substring(0, commonlength)]);
                pointer++;
              }
              text_insert = text_insert.substring(commonlength);
              text_delete = text_delete.substring(commonlength);
            }
            // Factor out any common suffixies.
            commonlength = this.diff_commonSuffix(text_insert, text_delete);
            if (commonlength !== 0) {
              diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
              text_insert = text_insert.substring(0, text_insert.length - commonlength);
              text_delete = text_delete.substring(0, text_delete.length - commonlength);
            }
          }
          // Delete the offending records and add the merged ones.
          if (count_delete === 0) {
            diffs.splice(pointer - count_insert, count_delete + count_insert, [DIFF_INSERT, text_insert]);
          } else if (count_insert === 0) {
            diffs.splice(pointer - count_delete, count_delete + count_insert, [DIFF_DELETE, text_delete]);
          } else {
            diffs.splice(pointer - count_delete - count_insert, count_delete + count_insert, [DIFF_DELETE, text_delete], [DIFF_INSERT, text_insert]);
          }
          pointer = pointer - count_delete - count_insert + (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
        } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
          // Merge this equality with the previous one.
          diffs[pointer - 1][1] += diffs[pointer][1];
          diffs.splice(pointer, 1);
        } else {
          pointer++;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break;
    }
  }
  if (diffs[diffs.length - 1][1] === '') {
    diffs.pop(); // Remove the dummy entry at the end.
  }

  // Second pass: look for single edits surrounded on both sides by equalities
  // which can be shifted sideways to eliminate an equality.
  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
  var changes = false;
  pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      if (diffs[pointer][1].substring(diffs[pointer][1].length - diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
        // Shift the edit over the previous equality.
        diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);
        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
        diffs.splice(pointer - 1, 1);
        changes = true;
      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) == diffs[pointer + 1][1]) {
        // Shift the edit over the next equality.
        diffs[pointer - 1][1] += diffs[pointer + 1][1];
        diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
        diffs.splice(pointer + 1, 1);
        changes = true;
      }
    }
    pointer++;
  }
  // If shifts were made, the diff needs reordering and another shift sweep.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};

/**
 * loc is a location in text1, compute and return the equivalent location in
 * text2.
 * e.g. 'The cat' vs 'The big cat', 1->1, 5->8
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @param {number} loc Location within text1.
 * @return {number} Location within text2.
 */
diff_match_patch.prototype.diff_xIndex = function (diffs, loc) {
  var chars1 = 0;
  var chars2 = 0;
  var last_chars1 = 0;
  var last_chars2 = 0;
  var x;
  for (x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {
      // Equality or deletion.
      chars1 += diffs[x][1].length;
    }
    if (diffs[x][0] !== DIFF_DELETE) {
      // Equality or insertion.
      chars2 += diffs[x][1].length;
    }
    if (chars1 > loc) {
      // Overshot the location.
      break;
    }
    last_chars1 = chars1;
    last_chars2 = chars2;
  }
  // Was the location was deleted?
  if (diffs.length != x && diffs[x][0] === DIFF_DELETE) {
    return last_chars2;
  }
  // Add the remaining character length.
  return last_chars2 + (loc - last_chars1);
};

/**
 * Convert a diff array into a pretty HTML report.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} HTML representation.
 */
diff_match_patch.prototype.diff_prettyHtml = function (diffs) {
  var html = [];
  var pattern_amp = /&/g;
  var pattern_lt = /</g;
  var pattern_gt = />/g;
  var pattern_para = /\n/g;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0]; // Operation (insert, delete, equal)
    var data = diffs[x][1]; // Text of change.
    var text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;').replace(pattern_gt, '&gt;').replace(pattern_para, '&para;<br>');
    switch (op) {
      case DIFF_INSERT:
        html[x] = '<ins style="background:#e6ffe6;">' + text + '</ins>';
        break;
      case DIFF_DELETE:
        html[x] = '<del style="background:#ffe6e6;">' + text + '</del>';
        break;
      case DIFF_EQUAL:
        html[x] = '<span>' + text + '</span>';
        break;
    }
  }
  return html.join('');
};

/**
 * Compute and return the source text (all equalities and deletions).
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Source text.
 */
diff_match_patch.prototype.diff_text1 = function (diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {
      text[x] = diffs[x][1];
    }
  }
  return text.join('');
};

/**
 * Compute and return the destination text (all equalities and insertions).
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Destination text.
 */
diff_match_patch.prototype.diff_text2 = function (diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_DELETE) {
      text[x] = diffs[x][1];
    }
  }
  return text.join('');
};

/**
 * Compute the Levenshtein distance; the number of inserted, deleted or
 * substituted characters.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {number} Number of changes.
 */
diff_match_patch.prototype.diff_levenshtein = function (diffs) {
  var levenshtein = 0;
  var insertions = 0;
  var deletions = 0;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0];
    var data = diffs[x][1];
    switch (op) {
      case DIFF_INSERT:
        insertions += data.length;
        break;
      case DIFF_DELETE:
        deletions += data.length;
        break;
      case DIFF_EQUAL:
        // A deletion and an insertion is one substitution.
        levenshtein += Math.max(insertions, deletions);
        insertions = 0;
        deletions = 0;
        break;
    }
  }
  levenshtein += Math.max(insertions, deletions);
  return levenshtein;
};

/**
 * Crush the diff into an encoded string which describes the operations
 * required to transform text1 into text2.
 * E.g. =3\t-2\t+ing  -> Keep 3 chars, delete 2 chars, insert 'ing'.
 * Operations are tab-separated.  Inserted text is escaped using %xx notation.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Delta text.
 */
diff_match_patch.prototype.diff_toDelta = function (diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    switch (diffs[x][0]) {
      case DIFF_INSERT:
        text[x] = '+' + encodeURI(diffs[x][1]);
        break;
      case DIFF_DELETE:
        text[x] = '-' + diffs[x][1].length;
        break;
      case DIFF_EQUAL:
        text[x] = '=' + diffs[x][1].length;
        break;
    }
  }
  return text.join('\t').replace(/%20/g, ' ');
};

/**
 * Given the original text1, and an encoded string which describes the
 * operations required to transform text1 into text2, compute the full diff.
 * @param {string} text1 Source string for the diff.
 * @param {string} delta Delta text.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @throws {!Error} If invalid input.
 */
diff_match_patch.prototype.diff_fromDelta = function (text1, delta) {
  var diffs = [];
  var diffsLength = 0; // Keeping our own length var is faster in JS.
  var pointer = 0; // Cursor in text1
  var tokens = delta.split(/\t/g);
  for (var x = 0; x < tokens.length; x++) {
    // Each token begins with a one character parameter which specifies the
    // operation of this token (delete, insert, equality).
    var param = tokens[x].substring(1);
    switch (tokens[x].charAt(0)) {
      case '+':
        try {
          diffs[diffsLength++] = [DIFF_INSERT, decodeURI(param)];
        } catch (ex) {
          // Malformed URI sequence.
          throw new Error('Illegal escape in diff_fromDelta: ' + param);
        }
        break;
      case '-':
      // Fall through.
      case '=':
        var n = parseInt(param, 10);
        if (isNaN(n) || n < 0) {
          throw new Error('Invalid number in diff_fromDelta: ' + param);
        }
        var text = text1.substring(pointer, pointer += n);
        if (tokens[x].charAt(0) == '=') {
          diffs[diffsLength++] = [DIFF_EQUAL, text];
        } else {
          diffs[diffsLength++] = [DIFF_DELETE, text];
        }
        break;
      default:
        // Blank tokens are ok (from a trailing \t).
        // Anything else is an error.
        if (tokens[x]) {
          throw new Error('Invalid diff operation in diff_fromDelta: ' + tokens[x]);
        }
    }
  }
  if (pointer != text1.length) {
    throw new Error('Delta length (' + pointer + ') does not equal source text length (' + text1.length + ').');
  }
  return diffs;
};

//  MATCH FUNCTIONS

/**
 * Locate the best instance of 'pattern' in 'text' near 'loc'.
 * @param {string} text The text to search.
 * @param {string} pattern The pattern to search for.
 * @param {number} loc The location to search around.
 * @return {number} Best match index or -1.
 */
diff_match_patch.prototype.match_main = function (text, pattern, loc) {
  // Check for null inputs.
  if (text == null || pattern == null || loc == null) {
    throw new Error('Null input. (match_main)');
  }

  loc = Math.max(0, Math.min(loc, text.length));
  if (text == pattern) {
    // Shortcut (potentially not guaranteed by the algorithm)
    return 0;
  } else if (!text.length) {
    // Nothing to match.
    return -1;
  } else if (text.substring(loc, loc + pattern.length) == pattern) {
    // Perfect match at the perfect spot!  (Includes case of null pattern)
    return loc;
  } else {
    // Do a fuzzy compare.
    return this.match_bitap_(text, pattern, loc);
  }
};

/**
 * Locate the best instance of 'pattern' in 'text' near 'loc' using the
 * Bitap algorithm.
 * @param {string} text The text to search.
 * @param {string} pattern The pattern to search for.
 * @param {number} loc The location to search around.
 * @return {number} Best match index or -1.
 * @private
 */
diff_match_patch.prototype.match_bitap_ = function (text, pattern, loc) {
  if (pattern.length > this.Match_MaxBits) {
    throw new Error('Pattern too long for this browser.');
  }

  // Initialise the alphabet.
  var s = this.match_alphabet_(pattern);

  var dmp = this; // 'this' becomes 'window' in a closure.

  /**
   * Compute and return the score for a match with e errors and x location.
   * Accesses loc and pattern through being a closure.
   * @param {number} e Number of errors in match.
   * @param {number} x Location of match.
   * @return {number} Overall score for match (0.0 = good, 1.0 = bad).
   * @private
   */
  function match_bitapScore_(e, x) {
    var accuracy = e / pattern.length;
    var proximity = Math.abs(loc - x);
    if (!dmp.Match_Distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy;
    }
    return accuracy + proximity / dmp.Match_Distance;
  }

  // Highest score beyond which we give up.
  var score_threshold = this.Match_Threshold;
  // Is there a nearby exact match? (speedup)
  var best_loc = text.indexOf(pattern, loc);
  if (best_loc != -1) {
    score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
    // What about in the other direction? (speedup)
    best_loc = text.lastIndexOf(pattern, loc + pattern.length);
    if (best_loc != -1) {
      score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
    }
  }

  // Initialise the bit arrays.
  var matchmask = 1 << pattern.length - 1;
  best_loc = -1;

  var bin_min, bin_mid;
  var bin_max = pattern.length + text.length;
  var last_rd;
  for (var d = 0; d < pattern.length; d++) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from 'loc' we can stray at this
    // error level.
    bin_min = 0;
    bin_mid = bin_max;
    while (bin_min < bin_mid) {
      if (match_bitapScore_(d, loc + bin_mid) <= score_threshold) {
        bin_min = bin_mid;
      } else {
        bin_max = bin_mid;
      }
      bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
    }
    // Use the result from this iteration as the maximum for the next.
    bin_max = bin_mid;
    var start = Math.max(1, loc - bin_mid + 1);
    var finish = Math.min(loc + bin_mid, text.length) + pattern.length;

    var rd = Array(finish + 2);
    rd[finish + 1] = (1 << d) - 1;
    for (var j = finish; j >= start; j--) {
      // The alphabet (s) is a sparse hash, so the following line generates
      // warnings.
      var charMatch = s[text.charAt(j - 1)];
      if (d === 0) {
        // First pass: exact match.
        rd[j] = (rd[j + 1] << 1 | 1) & charMatch;
      } else {
        // Subsequent passes: fuzzy match.
        rd[j] = (rd[j + 1] << 1 | 1) & charMatch | ((last_rd[j + 1] | last_rd[j]) << 1 | 1) | last_rd[j + 1];
      }
      if (rd[j] & matchmask) {
        var score = match_bitapScore_(d, j - 1);
        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (score <= score_threshold) {
          // Told you so.
          score_threshold = score;
          best_loc = j - 1;
          if (best_loc > loc) {
            // When passing loc, don't exceed our current distance from loc.
            start = Math.max(1, 2 * loc - best_loc);
          } else {
            // Already passed loc, downhill from here on in.
            break;
          }
        }
      }
    }
    // No hope for a (better) match at greater error levels.
    if (match_bitapScore_(d + 1, loc) > score_threshold) {
      break;
    }
    last_rd = rd;
  }
  return best_loc;
};

/**
 * Initialise the alphabet for the Bitap algorithm.
 * @param {string} pattern The text to encode.
 * @return {!Object} Hash of character locations.
 * @private
 */
diff_match_patch.prototype.match_alphabet_ = function (pattern) {
  var s = {};
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] = 0;
  }
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] |= 1 << pattern.length - i - 1;
  }
  return s;
};

//  PATCH FUNCTIONS

/**
 * Increase the context until it is unique,
 * but don't let the pattern expand beyond Match_MaxBits.
 * @param {!diff_match_patch.patch_obj} patch The patch to grow.
 * @param {string} text Source text.
 * @private
 */
diff_match_patch.prototype.patch_addContext_ = function (patch, text) {
  if (text.length == 0) {
    return;
  }
  var pattern = text.substring(patch.start2, patch.start2 + patch.length1);
  var padding = 0;

  // Look for the first and last matches of pattern in text.  If two different
  // matches are found, increase the pattern length.
  while (text.indexOf(pattern) != text.lastIndexOf(pattern) && pattern.length < this.Match_MaxBits - this.Patch_Margin - this.Patch_Margin) {
    padding += this.Patch_Margin;
    pattern = text.substring(patch.start2 - padding, patch.start2 + patch.length1 + padding);
  }
  // Add one chunk for good luck.
  padding += this.Patch_Margin;

  // Add the prefix.
  var prefix = text.substring(patch.start2 - padding, patch.start2);
  if (prefix) {
    patch.diffs.unshift([DIFF_EQUAL, prefix]);
  }
  // Add the suffix.
  var suffix = text.substring(patch.start2 + patch.length1, patch.start2 + patch.length1 + padding);
  if (suffix) {
    patch.diffs.push([DIFF_EQUAL, suffix]);
  }

  // Roll back the start points.
  patch.start1 -= prefix.length;
  patch.start2 -= prefix.length;
  // Extend the lengths.
  patch.length1 += prefix.length + suffix.length;
  patch.length2 += prefix.length + suffix.length;
};

/**
 * Compute a list of patches to turn text1 into text2.
 * Use diffs if provided, otherwise compute it ourselves.
 * There are four ways to call this function, depending on what data is
 * available to the caller:
 * Method 1:
 * a = text1, b = text2
 * Method 2:
 * a = diffs
 * Method 3 (optimal):
 * a = text1, b = diffs
 * Method 4 (deprecated, use method 3):
 * a = text1, b = text2, c = diffs
 *
 * @param {string|!Array.<!diff_match_patch.Diff>} a text1 (methods 1,3,4) or
 * Array of diff tuples for text1 to text2 (method 2).
 * @param {string|!Array.<!diff_match_patch.Diff>} opt_b text2 (methods 1,4) or
 * Array of diff tuples for text1 to text2 (method 3) or undefined (method 2).
 * @param {string|!Array.<!diff_match_patch.Diff>} opt_c Array of diff tuples
 * for text1 to text2 (method 4) or undefined (methods 1,2,3).
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 */
diff_match_patch.prototype.patch_make = function (a, opt_b, opt_c) {
  var text1, diffs;
  if (typeof a == 'string' && typeof opt_b == 'string' && typeof opt_c == 'undefined') {
    // Method 1: text1, text2
    // Compute diffs from text1 and text2.
    text1 = /** @type {string} */a;
    diffs = this.diff_main(text1, /** @type {string} */opt_b, true);
    if (diffs.length > 2) {
      this.diff_cleanupSemantic(diffs);
      this.diff_cleanupEfficiency(diffs);
    }
  } else if (a && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && typeof opt_b == 'undefined' && typeof opt_c == 'undefined') {
    // Method 2: diffs
    // Compute text1 from diffs.
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */a;
    text1 = this.diff_text1(diffs);
  } else if (typeof a == 'string' && opt_b && (typeof opt_b === 'undefined' ? 'undefined' : _typeof(opt_b)) == 'object' && typeof opt_c == 'undefined') {
    // Method 3: text1, diffs
    text1 = /** @type {string} */a;
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */opt_b;
  } else if (typeof a == 'string' && typeof opt_b == 'string' && opt_c && (typeof opt_c === 'undefined' ? 'undefined' : _typeof(opt_c)) == 'object') {
    // Method 4: text1, text2, diffs
    // text2 is not used.
    text1 = /** @type {string} */a;
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */opt_c;
  } else {
    throw new Error('Unknown call format to patch_make.');
  }

  if (diffs.length === 0) {
    return []; // Get rid of the null case.
  }
  var patches = [];
  var patch = new diff_match_patch.patch_obj();
  var patchDiffLength = 0; // Keeping our own length var is faster in JS.
  var char_count1 = 0; // Number of characters into the text1 string.
  var char_count2 = 0; // Number of characters into the text2 string.
  // Start with text1 (prepatch_text) and apply the diffs until we arrive at
  // text2 (postpatch_text).  We recreate the patches one by one to determine
  // context info.
  var prepatch_text = text1;
  var postpatch_text = text1;
  for (var x = 0; x < diffs.length; x++) {
    var diff_type = diffs[x][0];
    var diff_text = diffs[x][1];

    if (!patchDiffLength && diff_type !== DIFF_EQUAL) {
      // A new patch starts here.
      patch.start1 = char_count1;
      patch.start2 = char_count2;
    }

    switch (diff_type) {
      case DIFF_INSERT:
        patch.diffs[patchDiffLength++] = diffs[x];
        patch.length2 += diff_text.length;
        postpatch_text = postpatch_text.substring(0, char_count2) + diff_text + postpatch_text.substring(char_count2);
        break;
      case DIFF_DELETE:
        patch.length1 += diff_text.length;
        patch.diffs[patchDiffLength++] = diffs[x];
        postpatch_text = postpatch_text.substring(0, char_count2) + postpatch_text.substring(char_count2 + diff_text.length);
        break;
      case DIFF_EQUAL:
        if (diff_text.length <= 2 * this.Patch_Margin && patchDiffLength && diffs.length != x + 1) {
          // Small equality inside a patch.
          patch.diffs[patchDiffLength++] = diffs[x];
          patch.length1 += diff_text.length;
          patch.length2 += diff_text.length;
        } else if (diff_text.length >= 2 * this.Patch_Margin) {
          // Time for a new patch.
          if (patchDiffLength) {
            this.patch_addContext_(patch, prepatch_text);
            patches.push(patch);
            patch = new diff_match_patch.patch_obj();
            patchDiffLength = 0;
            // Unlike Unidiff, our patch lists have a rolling context.
            // http://code.google.com/p/google-diff-match-patch/wiki/Unidiff
            // Update prepatch text & pos to reflect the application of the
            // just completed patch.
            prepatch_text = postpatch_text;
            char_count1 = char_count2;
          }
        }
        break;
    }

    // Update the current character count.
    if (diff_type !== DIFF_INSERT) {
      char_count1 += diff_text.length;
    }
    if (diff_type !== DIFF_DELETE) {
      char_count2 += diff_text.length;
    }
  }
  // Pick up the leftover patch if not empty.
  if (patchDiffLength) {
    this.patch_addContext_(patch, prepatch_text);
    patches.push(patch);
  }

  return patches;
};

/**
 * Given an array of patches, return another array that is identical.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 */
diff_match_patch.prototype.patch_deepCopy = function (patches) {
  // Making deep copies is hard in JavaScript.
  var patchesCopy = [];
  for (var x = 0; x < patches.length; x++) {
    var patch = patches[x];
    var patchCopy = new diff_match_patch.patch_obj();
    patchCopy.diffs = [];
    for (var y = 0; y < patch.diffs.length; y++) {
      patchCopy.diffs[y] = patch.diffs[y].slice();
    }
    patchCopy.start1 = patch.start1;
    patchCopy.start2 = patch.start2;
    patchCopy.length1 = patch.length1;
    patchCopy.length2 = patch.length2;
    patchesCopy[x] = patchCopy;
  }
  return patchesCopy;
};

/**
 * Merge a set of patches onto the text.  Return a patched text, as well
 * as a list of true/false values indicating which patches were applied.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @param {string} text Old text.
 * @return {!Array.<string|!Array.<boolean>>} Two element Array, containing the
 *      new text and an array of boolean values.
 */
diff_match_patch.prototype.patch_apply = function (patches, text) {
  if (patches.length == 0) {
    return [text, []];
  }

  // Deep copy the patches so that no changes are made to originals.
  patches = this.patch_deepCopy(patches);

  var nullPadding = this.patch_addPadding(patches);
  text = nullPadding + text + nullPadding;

  this.patch_splitMax(patches);
  // delta keeps track of the offset between the expected and actual location
  // of the previous patch.  If there are patches expected at positions 10 and
  // 20, but the first patch was found at 12, delta is 2 and the second patch
  // has an effective expected position of 22.
  var delta = 0;
  var results = [];
  for (var x = 0; x < patches.length; x++) {
    var expected_loc = patches[x].start2 + delta;
    var text1 = this.diff_text1(patches[x].diffs);
    var start_loc;
    var end_loc = -1;
    if (text1.length > this.Match_MaxBits) {
      // patch_splitMax will only provide an oversized pattern in the case of
      // a monster delete.
      start_loc = this.match_main(text, text1.substring(0, this.Match_MaxBits), expected_loc);
      if (start_loc != -1) {
        end_loc = this.match_main(text, text1.substring(text1.length - this.Match_MaxBits), expected_loc + text1.length - this.Match_MaxBits);
        if (end_loc == -1 || start_loc >= end_loc) {
          // Can't find valid trailing context.  Drop this patch.
          start_loc = -1;
        }
      }
    } else {
      start_loc = this.match_main(text, text1, expected_loc);
    }
    if (start_loc == -1) {
      // No match found.  :(
      results[x] = false;
      // Subtract the delta for this failed patch from subsequent patches.
      delta -= patches[x].length2 - patches[x].length1;
    } else {
      // Found a match.  :)
      results[x] = true;
      delta = start_loc - expected_loc;
      var text2;
      if (end_loc == -1) {
        text2 = text.substring(start_loc, start_loc + text1.length);
      } else {
        text2 = text.substring(start_loc, end_loc + this.Match_MaxBits);
      }
      if (text1 == text2) {
        // Perfect match, just shove the replacement text in.
        text = text.substring(0, start_loc) + this.diff_text2(patches[x].diffs) + text.substring(start_loc + text1.length);
      } else {
        // Imperfect match.  Run a diff to get a framework of equivalent
        // indices.
        var diffs = this.diff_main(text1, text2, false);
        if (text1.length > this.Match_MaxBits && this.diff_levenshtein(diffs) / text1.length > this.Patch_DeleteThreshold) {
          // The end points match, but the content is unacceptably bad.
          results[x] = false;
        } else {
          this.diff_cleanupSemanticLossless(diffs);
          var index1 = 0;
          var index2;
          for (var y = 0; y < patches[x].diffs.length; y++) {
            var mod = patches[x].diffs[y];
            if (mod[0] !== DIFF_EQUAL) {
              index2 = this.diff_xIndex(diffs, index1);
            }
            if (mod[0] === DIFF_INSERT) {
              // Insertion
              text = text.substring(0, start_loc + index2) + mod[1] + text.substring(start_loc + index2);
            } else if (mod[0] === DIFF_DELETE) {
              // Deletion
              text = text.substring(0, start_loc + index2) + text.substring(start_loc + this.diff_xIndex(diffs, index1 + mod[1].length));
            }
            if (mod[0] !== DIFF_DELETE) {
              index1 += mod[1].length;
            }
          }
        }
      }
    }
  }
  // Strip the padding off.
  text = text.substring(nullPadding.length, text.length - nullPadding.length);
  return [text, results];
};

/**
 * Add some padding on text start and end so that edges can match something.
 * Intended to be called only from within patch_apply.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {string} The padding string added to each side.
 */
diff_match_patch.prototype.patch_addPadding = function (patches) {
  var paddingLength = this.Patch_Margin;
  var nullPadding = '';
  for (var x = 1; x <= paddingLength; x++) {
    nullPadding += String.fromCharCode(x);
  }

  // Bump all the patches forward.
  for (var x = 0; x < patches.length; x++) {
    patches[x].start1 += paddingLength;
    patches[x].start2 += paddingLength;
  }

  // Add some padding on start of first diff.
  var patch = patches[0];
  var diffs = patch.diffs;
  if (diffs.length == 0 || diffs[0][0] != DIFF_EQUAL) {
    // Add nullPadding equality.
    diffs.unshift([DIFF_EQUAL, nullPadding]);
    patch.start1 -= paddingLength; // Should be 0.
    patch.start2 -= paddingLength; // Should be 0.
    patch.length1 += paddingLength;
    patch.length2 += paddingLength;
  } else if (paddingLength > diffs[0][1].length) {
    // Grow first equality.
    var extraLength = paddingLength - diffs[0][1].length;
    diffs[0][1] = nullPadding.substring(diffs[0][1].length) + diffs[0][1];
    patch.start1 -= extraLength;
    patch.start2 -= extraLength;
    patch.length1 += extraLength;
    patch.length2 += extraLength;
  }

  // Add some padding on end of last diff.
  patch = patches[patches.length - 1];
  diffs = patch.diffs;
  if (diffs.length == 0 || diffs[diffs.length - 1][0] != DIFF_EQUAL) {
    // Add nullPadding equality.
    diffs.push([DIFF_EQUAL, nullPadding]);
    patch.length1 += paddingLength;
    patch.length2 += paddingLength;
  } else if (paddingLength > diffs[diffs.length - 1][1].length) {
    // Grow last equality.
    var extraLength = paddingLength - diffs[diffs.length - 1][1].length;
    diffs[diffs.length - 1][1] += nullPadding.substring(0, extraLength);
    patch.length1 += extraLength;
    patch.length2 += extraLength;
  }

  return nullPadding;
};

/**
 * Look through the patches and break up any which are longer than the maximum
 * limit of the match algorithm.
 * Intended to be called only from within patch_apply.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 */
diff_match_patch.prototype.patch_splitMax = function (patches) {
  var patch_size = this.Match_MaxBits;
  for (var x = 0; x < patches.length; x++) {
    if (patches[x].length1 <= patch_size) {
      continue;
    }
    var bigpatch = patches[x];
    // Remove the big old patch.
    patches.splice(x--, 1);
    var start1 = bigpatch.start1;
    var start2 = bigpatch.start2;
    var precontext = '';
    while (bigpatch.diffs.length !== 0) {
      // Create one of several smaller patches.
      var patch = new diff_match_patch.patch_obj();
      var empty = true;
      patch.start1 = start1 - precontext.length;
      patch.start2 = start2 - precontext.length;
      if (precontext !== '') {
        patch.length1 = patch.length2 = precontext.length;
        patch.diffs.push([DIFF_EQUAL, precontext]);
      }
      while (bigpatch.diffs.length !== 0 && patch.length1 < patch_size - this.Patch_Margin) {
        var diff_type = bigpatch.diffs[0][0];
        var diff_text = bigpatch.diffs[0][1];
        if (diff_type === DIFF_INSERT) {
          // Insertions are harmless.
          patch.length2 += diff_text.length;
          start2 += diff_text.length;
          patch.diffs.push(bigpatch.diffs.shift());
          empty = false;
        } else if (diff_type === DIFF_DELETE && patch.diffs.length == 1 && patch.diffs[0][0] == DIFF_EQUAL && diff_text.length > 2 * patch_size) {
          // This is a large deletion.  Let it pass in one chunk.
          patch.length1 += diff_text.length;
          start1 += diff_text.length;
          empty = false;
          patch.diffs.push([diff_type, diff_text]);
          bigpatch.diffs.shift();
        } else {
          // Deletion or equality.  Only take as much as we can stomach.
          diff_text = diff_text.substring(0, patch_size - patch.length1 - this.Patch_Margin);
          patch.length1 += diff_text.length;
          start1 += diff_text.length;
          if (diff_type === DIFF_EQUAL) {
            patch.length2 += diff_text.length;
            start2 += diff_text.length;
          } else {
            empty = false;
          }
          patch.diffs.push([diff_type, diff_text]);
          if (diff_text == bigpatch.diffs[0][1]) {
            bigpatch.diffs.shift();
          } else {
            bigpatch.diffs[0][1] = bigpatch.diffs[0][1].substring(diff_text.length);
          }
        }
      }
      // Compute the head context for the next patch.
      precontext = this.diff_text2(patch.diffs);
      precontext = precontext.substring(precontext.length - this.Patch_Margin);
      // Append the end context for this patch.
      var postcontext = this.diff_text1(bigpatch.diffs).substring(0, this.Patch_Margin);
      if (postcontext !== '') {
        patch.length1 += postcontext.length;
        patch.length2 += postcontext.length;
        if (patch.diffs.length !== 0 && patch.diffs[patch.diffs.length - 1][0] === DIFF_EQUAL) {
          patch.diffs[patch.diffs.length - 1][1] += postcontext;
        } else {
          patch.diffs.push([DIFF_EQUAL, postcontext]);
        }
      }
      if (!empty) {
        patches.splice(++x, 0, patch);
      }
    }
  }
};

/**
 * Take a list of patches and return a textual representation.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {string} Text representation of patches.
 */
diff_match_patch.prototype.patch_toText = function (patches) {
  var text = [];
  for (var x = 0; x < patches.length; x++) {
    text[x] = patches[x];
  }
  return text.join('');
};

/**
 * Parse a textual representation of patches and return a list of Patch objects.
 * @param {string} textline Text representation of patches.
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 * @throws {!Error} If invalid input.
 */
diff_match_patch.prototype.patch_fromText = function (textline) {
  var patches = [];
  if (!textline) {
    return patches;
  }
  var text = textline.split('\n');
  var textPointer = 0;
  var patchHeader = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
  while (textPointer < text.length) {
    var m = text[textPointer].match(patchHeader);
    if (!m) {
      throw new Error('Invalid patch string: ' + text[textPointer]);
    }
    var patch = new diff_match_patch.patch_obj();
    patches.push(patch);
    patch.start1 = parseInt(m[1], 10);
    if (m[2] === '') {
      patch.start1--;
      patch.length1 = 1;
    } else if (m[2] == '0') {
      patch.length1 = 0;
    } else {
      patch.start1--;
      patch.length1 = parseInt(m[2], 10);
    }

    patch.start2 = parseInt(m[3], 10);
    if (m[4] === '') {
      patch.start2--;
      patch.length2 = 1;
    } else if (m[4] == '0') {
      patch.length2 = 0;
    } else {
      patch.start2--;
      patch.length2 = parseInt(m[4], 10);
    }
    textPointer++;

    while (textPointer < text.length) {
      var sign = text[textPointer].charAt(0);
      try {
        var line = decodeURI(text[textPointer].substring(1));
      } catch (ex) {
        // Malformed URI sequence.
        throw new Error('Illegal escape in patch_fromText: ' + line);
      }
      if (sign == '-') {
        // Deletion.
        patch.diffs.push([DIFF_DELETE, line]);
      } else if (sign == '+') {
        // Insertion.
        patch.diffs.push([DIFF_INSERT, line]);
      } else if (sign == ' ') {
        // Minor equality.
        patch.diffs.push([DIFF_EQUAL, line]);
      } else if (sign == '@') {
        // Start of next patch.
        break;
      } else if (sign === '') {
        // Blank line?  Whatever.
      } else {
        // WTF?
        throw new Error('Invalid patch mode "' + sign + '" in: ' + line);
      }
      textPointer++;
    }
  }
  return patches;
};

/**
 * Class representing one patch operation.
 * @constructor
 * @ignore
 */
diff_match_patch.patch_obj = function () {
  /** @type {!Array.<!diff_match_patch.Diff>} */
  this.diffs = [];
  /** @type {?number} */
  this.start1 = null;
  /** @type {?number} */
  this.start2 = null;
  /** @type {number} */
  this.length1 = 0;
  /** @type {number} */
  this.length2 = 0;
};

/**
 * Emmulate GNU diff's format.
 * Header: @@ -382,8 +481,9 @@
 * Indicies are printed as 1-based, not 0-based.
 * @return {string} The GNU diff string.
 */
diff_match_patch.patch_obj.prototype.toString = function () {
  var coords1, coords2;
  if (this.length1 === 0) {
    coords1 = this.start1 + ',0';
  } else if (this.length1 == 1) {
    coords1 = this.start1 + 1;
  } else {
    coords1 = this.start1 + 1 + ',' + this.length1;
  }
  if (this.length2 === 0) {
    coords2 = this.start2 + ',0';
  } else if (this.length2 == 1) {
    coords2 = this.start2 + 1;
  } else {
    coords2 = this.start2 + 1 + ',' + this.length2;
  }
  var text = ['@@ -' + coords1 + ' +' + coords2 + ' @@\n'];
  var op;
  // Escape the body of the patch with %xx notation.
  for (var x = 0; x < this.diffs.length; x++) {
    switch (this.diffs[x][0]) {
      case DIFF_INSERT:
        op = '+';
        break;
      case DIFF_DELETE:
        op = '-';
        break;
      case DIFF_EQUAL:
        op = ' ';
        break;
    }
    text[x + 1] = op + encodeURI(this.diffs[x][1]) + '\n';
  }
  return text.join('').replace(/%20/g, ' ');
};

module.exports = diff_match_patch;

// Export these global variables so that they survive Google's JS compiler.
// In a browser, 'this' will be 'window'.
// Users of node.js should 'require' the uncompressed version since Google's
// JS compiler may break the following exports for non-browser environments.
//this['diff_match_patch'] = diff_match_patch;
//this['DIFF_DELETE'] = DIFF_DELETE;
//this['DIFF_INSERT'] = DIFF_INSERT;
//this['DIFF_EQUAL'] = DIFF_EQUAL;

/***/ }),
/* 74 */
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

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 75 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
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
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

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
  var eLen = nBytes * 8 - mLen - 1
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
      m = (value * c - 1) * Math.pow(2, mLen)
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
/* 76 */
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


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.



module.exports = PassThrough;

var Transform = __webpack_require__(23);

/*<replacement>*/
var util = __webpack_require__(9);
util.inherits = __webpack_require__(8);
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
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*<replacement>*/

var Buffer = __webpack_require__(17).Buffer;
/*</replacement>*/

module.exports = BufferList;

function BufferList() {
  this.head = null;
  this.tail = null;
  this.length = 0;
}

BufferList.prototype.push = function (v) {
  var entry = { data: v, next: null };
  if (this.length > 0) this.tail.next = entry;else this.head = entry;
  this.tail = entry;
  ++this.length;
};

BufferList.prototype.unshift = function (v) {
  var entry = { data: v, next: this.head };
  if (this.length === 0) this.tail = entry;
  this.head = entry;
  ++this.length;
};

BufferList.prototype.shift = function () {
  if (this.length === 0) return;
  var ret = this.head.data;
  if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
  --this.length;
  return ret;
};

BufferList.prototype.clear = function () {
  this.head = this.tail = null;
  this.length = 0;
};

BufferList.prototype.join = function (s) {
  if (this.length === 0) return '';
  var p = this.head;
  var ret = '' + p.data;
  while (p = p.next) {
    ret += s + p.data;
  }return ret;
};

BufferList.prototype.concat = function (n) {
  if (this.length === 0) return Buffer.alloc(0);
  if (this.length === 1) return this.head.data;
  var ret = Buffer.allocUnsafe(n >>> 0);
  var p = this.head;
  var i = 0;
  while (p) {
    p.data.copy(ret, i);
    i += p.data.length;
    p = p.next;
  }
  return ret;
};

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(16).PassThrough


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(16).Transform


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(15);


/***/ }),
/* 83 */
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18), __webpack_require__(10)))

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
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
  this._clearFn.call(window, this._id);
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
__webpack_require__(83);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 85 */
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ }),
/* 86 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _viewOnly = __webpack_require__(41);

var _viewOnly2 = _interopRequireDefault(_viewOnly);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview entry point
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

// default extensions
__webpack_require__(31);
__webpack_require__(28);
__webpack_require__(29);
__webpack_require__(30);
__webpack_require__(27);
__webpack_require__(26);

window.tui = window.tui || {};
window.tui.EditorViewOnly = _viewOnly2.default;

// for jquery
$.fn.tuiEditorViewOnly = function () {
    var options = void 0,
        instance = void 0;

    var el = this.get(0);

    if (el) {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        options = args[0] || {};

        instance = $.data(el, 'tuiEditorViewOnly');

        if (instance) {
            if (typeof options === 'string') {
                var _instance;

                return (_instance = instance)[options].apply(_instance, args.slice(1));
            }
        } else {
            options.el = el;
            instance = new _viewOnly2.default(options);
            $.data(el, 'tuiEditorViewOnly', instance);
        }
    }

    return this;
};

/***/ })
/******/ ]);