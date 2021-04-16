/*!
 * @toast-ui/editor
 * @version 2.5.2 | Fri Apr 16 2021
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("codemirror"));
	else if(typeof define === 'function' && define.amd)
		define(["codemirror"], factory);
	else if(typeof exports === 'object')
		exports["Editor"] = factory(require("codemirror"));
	else
		root["toastui"] = root["toastui"] || {}, root["toastui"]["Editor"] = factory(root["CodeMirror"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__15__) {
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 65);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tui_code_snippet_type_isUndefined__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var tui_code_snippet_type_isUndefined__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_type_isUndefined__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tui_code_snippet_type_isString__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9);
/* harmony import */ var tui_code_snippet_type_isString__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_type_isString__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var tui_code_snippet_domUtil_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
/* harmony import */ var tui_code_snippet_domUtil_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_domUtil_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var tui_code_snippet_domUtil_addClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5);
/* harmony import */ var tui_code_snippet_domUtil_addClass__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_domUtil_addClass__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var tui_code_snippet_domUtil_removeClass__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6);
/* harmony import */ var tui_code_snippet_domUtil_removeClass__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_domUtil_removeClass__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var tui_code_snippet_domUtil_hasClass__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(16);
/* harmony import */ var tui_code_snippet_domUtil_hasClass__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_domUtil_hasClass__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var tui_code_snippet_domUtil_matches__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(13);
/* harmony import */ var tui_code_snippet_domUtil_matches__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_domUtil_matches__WEBPACK_IMPORTED_MODULE_7__);
/**
 * @fileoverview DOM Utils
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */








var FIND_ZWB = /\u200B/g;
var _window = window,
    getComputedStyle = _window.getComputedStyle;
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
  return /^(ADDRESS|ARTICLE|ASIDE|BLOCKQUOTE|DETAILS|DIALOG|DD|DIV|DL|DT|FIELDSET|FIGCAPTION|FIGURE|FOOTER|FORM|H[\d]|HEADER|HGROUP|HR|LI|MAIN|NAV|OL|P|PRE|SECTION|UL)$/gi.test(this.getNodeName(node));
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
  var len;

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
  var len;

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
  var i, t, found;

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
  var currentNode;

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
  var directionKey = direction + "Sibling";
  var nodeName, foundedNode;

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
  var prevNode;

  if (index > 0) {
    prevNode = getChildNodeByOffset(node, index - 1);
  } else {
    prevNode = getNodeWithDirectionUntil('previous', node, untilNodeName);
  }

  return prevNode;
};

var getParentUntilBy = function getParentUntilBy(node, matchCondition, stopCondition) {
  while (node.parentNode && !matchCondition(node.parentNode)) {
    node = node.parentNode;

    if (stopCondition && stopCondition(node)) {
      break;
    }
  }

  if (matchCondition(node.parentNode)) {
    return node;
  }

  return null;
};
/**
 * get parent node until paseed node name
 * @param {Node} node node
 * @param {string|HTMLNode} untilNode node name or node to limit
 * @returns {Node} founded node
 * @ignore
 */


var getParentUntil = function getParentUntil(node, untilNode) {
  var foundedNode;

  if (tui_code_snippet_type_isString__WEBPACK_IMPORTED_MODULE_2___default()(untilNode)) {
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
  var directionKey = direction + "Sibling";
  var foundedNode;
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
 * @param {HTMLNode|string} root - root node
 * @param {HTMLNode} found - node to test
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
  var newWalkerOffset;

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
  } // there should be offset left


  do {
    result.push({
      container: walker.currentNode,
      offsetInContainer: text.length,
      offset: offset
    });
    offset = offsetList.shift();
  } while (!tui_code_snippet_type_isUndefined__WEBPACK_IMPORTED_MODULE_1___default()(offset));

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

  if (!tui_code_snippet_type_isUndefined__WEBPACK_IMPORTED_MODULE_1___default()(direction) && (direction === 'next' || direction === 'previous')) {
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
  var index, targetRowElement, currentContainer, siblingContainer, isSiblingContainerExists;

  if (!tui_code_snippet_type_isUndefined__WEBPACK_IMPORTED_MODULE_1___default()(direction) && (direction === 'next' || direction === 'previous')) {
    if (node) {
      if (direction === 'next') {
        targetRowElement = node.parentNode && node.parentNode.nextSibling;
        currentContainer = parents(node, 'thead');
        siblingContainer = currentContainer[0] && currentContainer[0].nextSibling;
        isSiblingContainerExists = siblingContainer && getNodeName(siblingContainer) === 'TBODY';
        index = 0;
      } else {
        targetRowElement = node.parentNode && node.parentNode.previousSibling;
        currentContainer = parents(node, 'tbody');
        siblingContainer = currentContainer[0] && currentContainer[0].previousSibling;
        isSiblingContainerExists = siblingContainer && getNodeName(siblingContainer) === 'THEAD';
        index = node.parentNode.childNodes.length - 1;
      }

      if (tui_code_snippet_type_isUndefined__WEBPACK_IMPORTED_MODULE_1___default()(needEdgeCell) || !needEdgeCell) {
        index = getNodeOffsetOfParent(node);
      }

      if (targetRowElement) {
        tableCellElement = children(targetRowElement, 'td,th')[index];
      } else if (currentContainer[0] && isSiblingContainerExists) {
        tableCellElement = findAll(siblingContainer, 'td,th')[index];
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
  return /^(A|B|BR|CODE|DEL|EM|I|IMG|S|SPAN|STRONG)$/gi.test(node.nodeName);
};
/**
 * Check that node is styled node.
 * Styled node is a node that has text and decorates text.
 * @param {Node} node TD element
 * @returns {boolean}
 * @ignore
 */


var isStyledNode = function isStyledNode(node) {
  return /^(A|ABBR|ACRONYM|B|BDI|BDO|BIG|CITE|CODE|DEL|DFN|EM|I|INS|KBD|MARK|Q|S|SAMP|SMALL|SPAN|STRONG|SUB|SUP|U|VAR)$/gi.test(node.nodeName);
};
/**
 * remove node from 'start' node to 'end-1' node inside parent
 * if 'end' node is null, remove all child nodes after 'start' node.
 * @param {Node} parentNode - parent node
 * @param {Node} start - start node to remove
 * @param {Node} end - end node to remove
 * @ignore
 */


var removeChildFromStartToEndNode = function removeChildFromStartToEndNode(parentNode, start, end) {
  var child = start;

  if (!child || parentNode !== child.parentNode) {
    return;
  }

  while (child !== end) {
    var nextNode = child.nextSibling;
    parentNode.removeChild(child);
    child = nextNode;
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
  var parentNode = node;

  while (parentNode !== targetParent) {
    var nextParent = parentNode.parentNode;
    var _parentNode = parentNode,
        nextSibling = _parentNode.nextSibling,
        previousSibling = _parentNode.previousSibling;

    if (!isForward && nextSibling) {
      removeChildFromStartToEndNode(nextParent, nextSibling, null);
    } else if (isForward && previousSibling) {
      removeChildFromStartToEndNode(nextParent, nextParent.childNodes[0], parentNode);
    }

    parentNode = nextParent;
  }
};

var getLeafNode = function getLeafNode(node) {
  var result = node;

  while (result.childNodes && result.childNodes.length) {
    var _result = result,
        nextLeaf = _result.firstChild; // When inline tag have empty text node with other childnodes, ignore empty text node.

    if (isTextNode(nextLeaf) && !getTextLength(nextLeaf)) {
      result = nextLeaf.nextSibling || nextLeaf;
    } else {
      result = nextLeaf;
    }
  }

  return result;
};
/**
 * check if a coordinates is inside a button box
 * @param {object} style - computed style of task box
 * @param {number} offsetX - event x offset
 * @param {number} offsetY - event y offset
 * @returns {boolean}
 * @ignore
 */


var isInsideButtonBox = function isInsideButtonBox(style, offsetX, offsetY) {
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
    tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0___default()(node.childNodes).forEach(function () {
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
      var startNode = getParentUntil(startContainer, commonAncestorContainer);
      var endNode = getParentUntil(endContainer, commonAncestorContainer);

      if (startNode && endNode) {
        mergeSameNodes(startNode, endNode, tagName);
      }

      optimizedNode = commonAncestorContainer;
    } else if (isTextNode(startContainer)) {
      optimizedNode = startContainer.parentNode;
    }

    if (optimizedNode && optimizedNode.nodeName === tagName) {
      var _optimizedNode = optimizedNode,
          previousSibling = _optimizedNode.previousSibling;
      var tempNode;

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
  var directionKey = direction + "Sibling";

  while (node && condition(node[directionKey], node)) {
    node = node[directionKey];
  }

  return node;
};
/**
 * Create element with contents
 * @param {string|Node} contents - contents to appended
 * @param {HTMLElement} [target] - container element to append contents
 * @returns {Node} created node
 * @ignore
 */


function createElementWith(contents, target) {
  var container = document.createElement('div');

  if (tui_code_snippet_type_isString__WEBPACK_IMPORTED_MODULE_2___default()(contents)) {
    container.innerHTML = contents;
  } else {
    container.appendChild(contents);
  }

  var firstChild = container.firstChild;

  if (target) {
    target.appendChild(firstChild);
  }

  return firstChild;
}
/**
 * Find nodes matching by selector
 * @param {HTMLElement} element - target element
 * @param {string} selector - selector to find nodes
 * @returns {Array.<Node>} found nodes
 * @ignore
 */


function findAll(element, selector) {
  var nodeList = tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0___default()(element.querySelectorAll(selector));

  if (nodeList.length) {
    return nodeList;
  }

  return [];
}
/**
 * Checks whether specific node is included in target node
 * @param {HTMLElement} element - target to find
 * @param {Node} containedNode - node to find
 * @returns {boolean} whether node is contained or not
 * @ignore
 */


function isContain(element, contained) {
  return element !== contained && element.contains(contained);
}
/**
 * Gets closest node matching by selector
 * @param {Node} node - target node
 * @param {string|Node} found - selector or element to find node
 * @param {Node} [root] - root node
 * @returns {?Node} - found node
 * @ignore
 */


function closest(node, found, root) {
  var condition;
  root = root || document;

  if (tui_code_snippet_type_isString__WEBPACK_IMPORTED_MODULE_2___default()(found)) {
    condition = function condition(target) {
      return tui_code_snippet_domUtil_matches__WEBPACK_IMPORTED_MODULE_7___default()(target, found);
    };
  } else {
    condition = function condition(target) {
      return target === found;
    };
  }

  while (node && node !== root) {
    if (isElemNode(node) && condition(node)) {
      return node;
    }

    node = node.parentNode;
  }

  return null;
}
/**
 * Gets parent node matching by selector from target node
 * @param {Node} node - target node
 * @param {string} [selector] - selector to find
 * @returns {Node} found node
 * @ignore
 */


function parent(node, selector) {
  var parentNode = node.parentNode;

  if (selector) {
    return parentNode && tui_code_snippet_domUtil_matches__WEBPACK_IMPORTED_MODULE_7___default()(parentNode, selector) ? parentNode : null;
  }

  return parentNode;
}
/**
 * Gets ancestor nodes matching by selector from target node
 * @param {Node} node - target node
 * @param {string|Node} found - selector or node to find
 * @returns {Array.<Node>} found nodes
 * @ignore
 */


function parents(node, found) {
  var result = [];

  while (node && node !== document) {
    node = closest(node.parentNode, found);

    if (node) {
      result.push(node);
    }
  }

  return result;
}
/**
 * Gets ancestor nodes until matching by selector from target node
 * @param {Node} node - target node
 * @param {string} selector - selector to find
 * @param {Array.<Node>} found nodes
 * @ignore
 */


function parentsUntil(node, selector) {
  var result = [];

  while (node.parentNode && !tui_code_snippet_domUtil_matches__WEBPACK_IMPORTED_MODULE_7___default()(node.parentNode, selector)) {
    node = node.parentNode;

    if (node) {
      result.push(node);
    }
  }

  return result;
}
/**
 * Gets child nodes matching by selector from target node
 * @param {Node} node - target node
 * @param {string} selector - selector to find
 * @returns {Array.<Node>} found nodes
 * @ignore
 */


function children(node, selector) {
  var foundChildren;

  if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    foundChildren = node.childNodes;
  } else {
    foundChildren = node.children;
  }

  return tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0___default()(foundChildren).filter(function (child) {
    return tui_code_snippet_domUtil_matches__WEBPACK_IMPORTED_MODULE_7___default()(child, selector);
  });
}
/**
 * Appends node(s) on target node
 * @param {Node} node - target node
 * @param {string|Node} appended - html string or node to append
 * @ignore
 */


function append(node, appended) {
  if (tui_code_snippet_type_isString__WEBPACK_IMPORTED_MODULE_2___default()(appended)) {
    node.insertAdjacentHTML('beforeEnd', appended);
  } else {
    appended = appended.length ? tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0___default()(appended) : [appended];

    for (var i = 0, len = appended.length; i < len; i += 1) {
      node.appendChild(appended[i]);
    }
  }
}
/**
 * Prepends node(s) on target node
 * @param {Node} node - target node
 * @param {string|Node} appended - html string or node to append
 * @ignore
 */


function prepend(node, appended) {
  if (tui_code_snippet_type_isString__WEBPACK_IMPORTED_MODULE_2___default()(appended)) {
    node.insertAdjacentHTML('afterBegin', appended);
  } else {
    appended = appended.length ? tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0___default()(appended) : [appended];

    for (var i = appended.length - 1, len = 0; i >= len; i -= 1) {
      node.insertBefore(appended[i], node.firstChild);
    }
  }
}
/**
 * Inserts new node in front of target node
 * @param {Node} insertedNode - node to insert
 * @param {Node} node - target node
 * @ignore
 */


function insertBefore(insertedNode, node) {
  var parentNode = node.parentNode;

  if (parentNode) {
    parentNode.insertBefore(insertedNode, node);
  }
}
/**
 * Inserts new node after target node
 * @param {Node} insertedNode - node to insert
 * @param {Node} node - target node
 * @ignore
 */


function insertAfter(insertedNode, node) {
  var parentNode = node.parentNode;

  if (parentNode) {
    parentNode.insertBefore(insertedNode, node.nextSibling);
  }
}
/**
 * Replaces target node(s) with html
 * @param {Node} nodeList - target node(s) to replace
 * @param {string} html - replaced html
 * @ignore
 */


function replaceWith(nodeList, html) {
  nodeList = nodeList.length ? tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0___default()(nodeList) : [nodeList];
  nodeList.forEach(function (node) {
    node.insertAdjacentHTML('afterEnd', html);
    node.parentNode.removeChild(node);
  });
}
/**
 * Adds parent element to target node(s)
 * @param {Node|Array.<Node>} nodeList - target node(s)
 * @param {string} nodeName - node name to change parent element
 * @ignore
 */


function wrap(nodeList, nodeName) {
  nodeList = nodeList.length ? tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0___default()(nodeList) : [nodeList];
  nodeList.forEach(function (node) {
    var wrapper = document.createElement(nodeName);
    node.parentNode.insertBefore(wrapper, node);
    wrapper.appendChild(node);
  });
}
/**
 * Adds child element to target node(s)
 * @param {Node|Array.<Node>} nodeList - target node(s)
 * @param {string} nodeName - node name to change child element
 * @ignore
 */


function wrapInner(nodeList, nodeName) {
  nodeList = nodeList.length ? tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0___default()(nodeList) : [nodeList];
  nodeList.forEach(function (node) {
    var wrapper = document.createElement(nodeName);
    node.appendChild(wrapper);

    while (node.firstChild !== wrapper) {
      wrapper.appendChild(node.firstChild);
    }
  });
}
/**
 * Removes target element and insert children at the same position
 * @param {Node} node - parent node
 * @returns {Array.<Node>} unwrapped nodes
 * @ignore
 */


function unwrap(node) {
  var result = [];

  while (node.firstChild) {
    result.push(node.firstChild);
    node.parentNode.insertBefore(node.firstChild, node);
  }

  remove(node);
  return result;
}
/**
 * Removes target node from parent node
 * @param {Node} node - target node
 * @ignore
 */


function remove(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
/**
 * Removes all children of target node
 * @param {Node} node - target node
 * @ignore
 */


function empty(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}
/**
 * Sets offset value of target element
 * @param {HTMLElement} element - target element
 * @returns {Object.<string, number>} offset values
 * @ignore
 */


function setOffset(element, offset) {
  var _element$parentNode$g = element.parentNode.getBoundingClientRect(),
      top = _element$parentNode$g.top,
      left = _element$parentNode$g.left;

  tui_code_snippet_domUtil_css__WEBPACK_IMPORTED_MODULE_3___default()(element, {
    top: offset.top - top - document.body.scrollTop + "px"
  });
  tui_code_snippet_domUtil_css__WEBPACK_IMPORTED_MODULE_3___default()(element, {
    left: offset.left - left - document.body.scrollLeft + "px"
  });
}
/**
 * Gets offset value of target element
 * @param {HTMLElement} element - target element
 * @param {string} [selector] - selector to stop finding node
 * @returns {Object.<string, number>} offset values
 * @ignore
 */


function getOffset(element, selector) {
  if (selector === void 0) {
    selector = 'document';
  }

  var top = 0;
  var left = 0;

  do {
    top += element.offsetTop || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while (element && !tui_code_snippet_domUtil_matches__WEBPACK_IMPORTED_MODULE_7___default()(element, selector));

  return {
    top: top,
    left: left
  };
}
/**
 * Gets outer width value of target element
 * @param {HTMLElement} element - target element
 * @param {boolean} includedMargin - whether to include margir or not
 * @returns {number} outer width value
 * @ignore
 */


function getOuterWidth(element, includedMargin) {
  var widthValue = element.offsetWidth;

  if (includedMargin) {
    var _getComputedStyle = getComputedStyle(element),
        marginLeft = _getComputedStyle.marginLeft,
        marginRight = _getComputedStyle.marginRight;

    widthValue += parseInt(marginLeft, 10) + parseInt(marginRight, 10);
  }

  return widthValue;
}
/**
 * Gets outer height value of target element
 * @param {HTMLElement} element - target element
 * @param {boolean} includedMargin - whether to include margir or not
 * @returns {number} outer height value
 * @ignore
 */


function getOuterHeight(element, includedMargin) {
  var heightValue = element.offsetHeight;

  if (includedMargin) {
    var _getComputedStyle2 = getComputedStyle(element),
        marginTop = _getComputedStyle2.marginTop,
        marginBottom = _getComputedStyle2.marginBottom;

    heightValue += parseInt(marginTop, 10) + parseInt(marginBottom, 10);
  }

  return heightValue;
}
/**
 * Toggles class name of target element
 * @param {HTMLElement} element - target element
 * @param {string} className - class name to toggle
 * @param {boolean} [state] - whether to toggle or not by condition
 * @ignore
 */


var toggleClass = function toggleClass(element, className, state) {
  if (tui_code_snippet_type_isUndefined__WEBPACK_IMPORTED_MODULE_1___default()(state)) {
    state = !tui_code_snippet_domUtil_hasClass__WEBPACK_IMPORTED_MODULE_6___default()(element, className);
  }

  var toggleFn = state ? tui_code_snippet_domUtil_addClass__WEBPACK_IMPORTED_MODULE_4___default.a : tui_code_snippet_domUtil_removeClass__WEBPACK_IMPORTED_MODULE_5___default.a;
  toggleFn(element, className);
};
/**
 * Finalize html result
 * @param {HTMLElement} html root element
 * @param {boolean} needHtmlText pass true if need html text
 * @returns {string|DocumentFragment} result
 * @ignore
 */


function finalizeHtml(html, needHtmlText) {
  var result;

  if (needHtmlText) {
    result = html.innerHTML;
  } else {
    var frag = document.createDocumentFragment();
    var childNodes = tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0___default()(html.childNodes);
    var length = childNodes.length;

    for (var i = 0; i < length; i += 1) {
      frag.appendChild(childNodes[i]);
    }

    result = frag;
  }

  return result;
}
/**
 * Get fragment replaced by newline to br tag
 * @param {string} text original text
 * @returns {DocumentFragment} fragment
 * @ignore
 */


function getFragmentReplacedByNewlineToBr(text) {
  var fragment = document.createDocumentFragment();
  var texts = text.split('\n');
  texts.forEach(function (plainText, index) {
    var textNode = document.createTextNode(plainText);
    fragment.appendChild(textNode);

    if (index < texts.length - 1) {
      fragment.appendChild(document.createElement('br'));
    }
  });
  return fragment;
}

/* harmony default export */ __webpack_exports__["a"] = ({
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
  isInsideButtonBox: isInsideButtonBox,
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
  getSiblingNodeBy: getSiblingNodeBy,
  createElementWith: createElementWith,
  findAll: findAll,
  isContain: isContain,
  closest: closest,
  parent: parent,
  parents: parents,
  parentsUntil: parentsUntil,
  children: children,
  append: append,
  prepend: prepend,
  insertBefore: insertBefore,
  insertAfter: insertAfter,
  replaceWith: replaceWith,
  wrap: wrap,
  wrapInner: wrapInner,
  unwrap: unwrap,
  remove: remove,
  empty: empty,
  setOffset: setOffset,
  getOffset: getOffset,
  getOuterWidth: getOuterWidth,
  getOuterHeight: getOuterHeight,
  toggleClass: toggleClass,
  finalizeHtml: finalizeHtml,
  getFragmentReplacedByNewlineToBr: getFragmentReplacedByNewlineToBr
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/object/extend.js
var extend = __webpack_require__(7);
var extend_default = /*#__PURE__*/__webpack_require__.n(extend);

// CONCATENATED MODULE: ./src/js/command.js
/**
 * @fileoverview Implements Command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Class Command
 * @param {string} name Command name
 * @param {number} type Command type (Command.TYPE)
 * @param {Array.<string>} [keyMap] keyMap
 * @ignore
 */

var Command = /*#__PURE__*/function () {
  function Command(name, type, keyMap) {
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


  var _proto = Command.prototype;

  _proto.getName = function getName() {
    return this.name;
  }
  /**
   * returns Type of command
   * @returns {number} Command Command type number
   */
  ;

  _proto.getType = function getType() {
    return this.type;
  }
  /**
   * returns whether Command Type is Markdown or not
   * @returns {boolean} result
   */
  ;

  _proto.isMDType = function isMDType() {
    return this.type === Command.TYPE.MD;
  }
  /**
   * returns whether Command Type is Wysiwyg or not
   * @returns {boolean} result
   */
  ;

  _proto.isWWType = function isWWType() {
    return this.type === Command.TYPE.WW;
  }
  /**
   * returns whether Command Type is Global or not
   * @returns {boolean} result
   */
  ;

  _proto.isGlobalType = function isGlobalType() {
    return this.type === Command.TYPE.GB;
  }
  /**
   * Set keymap value for each os
   * @param {string} win Windows Key(and etc)
   * @param {string} mac Mac osx key
   */
  ;

  _proto.setKeyMap = function setKeyMap(win, mac) {
    this.keyMap = [win, mac];
  };

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
  var type;

  if (typeStr === 'markdown') {
    type = Command.TYPE.MD;
  } else if (typeStr === 'wysiwyg') {
    type = Command.TYPE.WW;
  } else if (typeStr === 'global') {
    type = Command.TYPE.GB;
  }

  var command = new Command(props.name, type);
  extend_default()(command, props);
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
/* harmony default export */ var js_command = (Command);
// EXTERNAL MODULE: ./src/js/utils/common.js
var common = __webpack_require__(12);

// EXTERNAL MODULE: ./src/js/utils/map.js
var map = __webpack_require__(24);

// CONCATENATED MODULE: ./src/js/commandManager.js
/**
 * @fileoverview Implements CommandManager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */




var KEYMAP_OS_INDEX = common["b" /* isMac */] ? 1 : 0;
/**
 * Class CommandManager
 * @param {ToastUIEditor} base nedInstance
 * @param {object} [options={}] - option object
 *     @param {boolean} [options.useCommandShortcut=true] - execute command with keyMap
 * @ignore
 */

var commandManager_CommandManager = /*#__PURE__*/function () {
  function CommandManager(base, options) {
    if (options === void 0) {
      options = {};
    }

    this._command = new map["a" /* default */]();
    this._mdCommand = new map["a" /* default */]();
    this._wwCommand = new map["a" /* default */]();
    this._options = extend_default()({
      useCommandShortcut: true
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


  var _proto = CommandManager.prototype;

  _proto._addCommandBefore = function _addCommandBefore(command) {
    var commandWrapper = {
      command: command
    };
    this.base.eventManager.emit('addCommandBefore', commandWrapper);
    return commandWrapper.command || command;
  }
  /**
   * Add command
   * @param {Command} command Command instance
   * @returns {Command} Command
   */
  ;

  _proto.addCommand = function addCommand(command) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (args.length) {
      command = CommandManager.command.apply(CommandManager, [command].concat(args));
    }

    command = this._addCommandBefore(command);
    var name = command.getName();
    var commandBase;

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
  ;

  _proto._initEvent = function _initEvent() {
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
  ;

  _proto.exec = function exec(name) {
    var commandToRun, result;
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

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      args.unshift(context);
      result = (_commandToRun = commandToRun).exec.apply(_commandToRun, args);
    }

    return result;
  };

  return CommandManager;
}();
/**
 * Create command by given editor type and property object
 * @param {string} type Command type
 * @param {{name: string, keyMap: Array}} props Property
 * @returns {*}
 * @static
 */


commandManager_CommandManager.command = function (type, props) {
  var command = js_command.factory(type, props.name, props.keyMap);
  extend_default()(command, props);
  return command;
};

/* harmony default export */ var commandManager = __webpack_exports__["a"] = (commandManager_CommandManager);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export hasImageOrCodeBlockNode */
/* unused harmony export hasSameLineParent */
/* unused harmony export hasSpecificTypeAncestor */
/* unused harmony export isEmptyLineNode */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getMdStartLine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getMdEndLine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getMdStartCh; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getMdEndCh; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return isMultiLineNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return isHtmlNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return isStyledTextNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return isListItemNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return isTableCellNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return isInlineNode; });
/* unused harmony export getLastLeafNode */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return findClosestNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return traverseParentNodes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return addChPos; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return setChPos; });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);

function hasImageOrCodeBlockNode(mdNode) {
  while (mdNode) {
    if (Object(_common__WEBPACK_IMPORTED_MODULE_0__[/* includes */ "a"])(['image', 'codeBlock'], mdNode.type)) {
      return true;
    }

    mdNode = mdNode.firstChild;
  }

  return false;
}
function hasSameLineParent(mdNode) {
  return mdNode.parent && mdNode.parent.type !== 'document' && mdNode.parent.sourcepos[0][0] === mdNode.sourcepos[0][0];
}
function hasSpecificTypeAncestor(mdNode) {
  for (var _len = arguments.length, types = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    types[_key - 1] = arguments[_key];
  }

  while (mdNode.parent && mdNode.parent.type !== 'document') {
    if (Object(_common__WEBPACK_IMPORTED_MODULE_0__[/* includes */ "a"])(types, mdNode.parent.type)) {
      return true;
    }

    mdNode = mdNode.parent;
  }

  return false;
}
function isEmptyLineNode(text, mdNode) {
  return !text.trim() && !hasImageOrCodeBlockNode(mdNode);
}
function getMdStartLine(mdNode) {
  return mdNode.sourcepos[0][0];
}
function getMdEndLine(mdNode) {
  return mdNode.sourcepos[1][0];
}
function getMdStartCh(mdNode) {
  return mdNode.sourcepos[0][1];
}
function getMdEndCh(mdNode) {
  return mdNode.sourcepos[1][1];
}
function isMultiLineNode(mdNode) {
  var type = mdNode.type;
  return type === 'codeBlock' || type === 'paragraph';
}
function isHtmlNode(mdNode) {
  var type = mdNode.type;
  return type === 'htmlBlock' || type === 'htmlInline';
}
function isStyledTextNode(mdNode) {
  var type = mdNode.type;
  return type === 'strike' || type === 'strong' || type === 'emph';
}
function isListItemNode(mdNode) {
  return mdNode.type === 'item';
}
function isTableCellNode(mdNode) {
  var type = mdNode.type;
  return type === 'tableCell' || type === 'tableDelimCell';
}
function isInlineNode(mdNode) {
  switch (mdNode.type) {
    case 'code':
    case 'text':
    case 'emph':
    case 'strong':
    case 'strike':
    case 'link':
    case 'image':
    case 'htmlInline':
    case 'linebreak':
    case 'softbreak':
      return true;

    default:
      return false;
  }
}
function getLastLeafNode(mdNode) {
  while (mdNode.lastChild) {
    mdNode = mdNode.lastChild;
  }

  return mdNode;
}
function findClosestNode(mdNode, condition, includeSelf) {
  if (includeSelf === void 0) {
    includeSelf = true;
  }

  mdNode = includeSelf ? mdNode : mdNode.parent;

  while (mdNode && mdNode.type !== 'document') {
    if (condition(mdNode)) {
      return mdNode;
    }

    mdNode = mdNode.parent;
  }

  return null;
}
function traverseParentNodes(mdNode, iteratee, includeSelf) {
  if (includeSelf === void 0) {
    includeSelf = true;
  }

  mdNode = includeSelf ? mdNode : mdNode.parent;

  while (mdNode && mdNode.type !== 'document') {
    iteratee(mdNode);
    mdNode = mdNode.parent;
  }
}
function addChPos(originPos, addedCh) {
  return {
    line: originPos.line,
    ch: originPos.ch + addedCh
  };
}
function setChPos(originPos, newCh) {
  return {
    line: originPos.line,
    ch: newCh
  };
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Transform the Array-like object to Array.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var forEachArray = __webpack_require__(21);

/**
 * Transform the Array-like object to Array.
 * In low IE (below 8), Array.prototype.slice.call is not perfect. So, try-catch statement is used.
 * @param {*} arrayLike Array-like object
 * @returns {Array} Array
 * @memberof module:collection
 * @example
 * var toArray = require('tui-code-snippet/collection/toArray'); // node, commonjs
 *
 * var arrayLike = {
 *     0: 'one',
 *     1: 'two',
 *     2: 'three',
 *     3: 'four',
 *     length: 4
 * };
 * var result = toArray(arrayLike);
 *
 * alert(result instanceof Array); // true
 * alert(result); // one,two,three,four
 */
function toArray(arrayLike) {
  var arr;
  try {
    arr = Array.prototype.slice.call(arrayLike);
  } catch (e) {
    arr = [];
    forEachArray(arrayLike, function(value) {
      arr.push(value);
    });
  }

  return arr;
}

module.exports = toArray;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Setting element style
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isString = __webpack_require__(9);
var forEach = __webpack_require__(26);

/**
 * Setting element style
 * @param {(HTMLElement|SVGElement)} element - element to setting style
 * @param {(string|object)} key - style prop name or {prop: value} pair object
 * @param {string} [value] - style value
 * @memberof module:domUtil
 */
function css(element, key, value) {
  var style = element.style;

  if (isString(key)) {
    style[key] = value;

    return;
  }

  forEach(key, function(v, k) {
    style[k] = v;
  });
}

module.exports = css;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Add css class to element
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var forEach = __webpack_require__(26);
var inArray = __webpack_require__(14);
var getClass = __webpack_require__(33);
var setClassName = __webpack_require__(39);

/**
 * domUtil module
 * @module domUtil
 */

/**
 * Add css class to element
 * @param {(HTMLElement|SVGElement)} element - target element
 * @param {...string} cssClass - css classes to add
 * @memberof module:domUtil
 */
function addClass(element) {
  var cssClass = Array.prototype.slice.call(arguments, 1);
  var classList = element.classList;
  var newClass = [];
  var origin;

  if (classList) {
    forEach(cssClass, function(name) {
      element.classList.add(name);
    });

    return;
  }

  origin = getClass(element);

  if (origin) {
    cssClass = [].concat(origin.split(/\s+/), cssClass);
  }

  forEach(cssClass, function(cls) {
    if (inArray(cls, newClass) < 0) {
      newClass.push(cls);
    }
  });

  setClassName(element, newClass);
}

module.exports = addClass;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Remove css class from element
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var forEachArray = __webpack_require__(21);
var inArray = __webpack_require__(14);
var getClass = __webpack_require__(33);
var setClassName = __webpack_require__(39);

/**
 * Remove css class from element
 * @param {(HTMLElement|SVGElement)} element - target element
 * @param {...string} cssClass - css classes to remove
 * @memberof module:domUtil
 */
function removeClass(element) {
  var cssClass = Array.prototype.slice.call(arguments, 1);
  var classList = element.classList;
  var origin, newClass;

  if (classList) {
    forEachArray(cssClass, function(name) {
      classList.remove(name);
    });

    return;
  }

  origin = getClass(element).split(/\s+/);
  newClass = [];
  forEachArray(origin, function(name) {
    if (inArray(name, cssClass) < 0) {
      newClass.push(name);
    }
  });

  setClassName(element, newClass);
}

module.exports = removeClass;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Extend the target object from other objects.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * @module object
 */

/**
 * Extend the target object from other objects.
 * @param {object} target - Object that will be extended
 * @param {...object} objects - Objects as sources
 * @returns {object} Extended object
 * @memberof module:object
 */
function extend(target, objects) { // eslint-disable-line no-unused-vars
  var hasOwnProp = Object.prototype.hasOwnProperty;
  var source, prop, i, len;

  for (i = 1, len = arguments.length; i < len; i += 1) {
    source = arguments[i];
    for (prop in source) {
      if (hasOwnProp.call(source, prop)) {
        target[prop] = source[prop];
      }
    }
  }

  return target;
}

module.exports = extend;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is undefined or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is undefined or not.
 * If the given variable is undefined, returns true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is undefined?
 * @memberof module:type
 */
function isUndefined(obj) {
  return obj === undefined; // eslint-disable-line no-undefined
}

module.exports = isUndefined;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is a string or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is a string or not.
 * If the given variable is a string, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is string?
 * @memberof module:type
 */
function isString(obj) {
  return typeof obj === 'string' || obj instanceof String;
}

module.exports = isString;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Execute the provided callback once for each property of object which actually exist.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Execute the provided callback once for each property of object which actually exist.
 * If the callback function returns false, the loop will be stopped.
 * Callback function(iteratee) is invoked with three arguments:
 *  1) The value of the property
 *  2) The name of the property
 *  3) The object being traversed
 * @param {Object} obj The object that will be traversed
 * @param {function} iteratee  Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof module:collection
 * @example
 * var forEachOwnProperties = require('tui-code-snippet/collection/forEachOwnProperties'); // node, commonjs
 *
 * var sum = 0;
 *
 * forEachOwnProperties({a:1,b:2,c:3}, function(value){
 *     sum += value;
 * });
 * alert(sum); // 6
 */
function forEachOwnProperties(obj, iteratee, context) {
  var key;

  context = context || null;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (iteratee.call(context, obj[key], key, obj) === false) {
        break;
      }
    }
  }
}

module.exports = forEachOwnProperties;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview This module detects the kind of well-known browser and version.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Browser module
 * @module browser
 */

/**
 * This object has an information that indicate the kind of browser. It can detect IE8 ~ IE11, Chrome, Firefox, Safari, and Edge.
 * @memberof module:browser
 * @example
 * var browser = require('tui-code-snippet/browser/browser'); // node, commonjs
 *
 * browser.chrome === true; // chrome
 * browser.firefox === true; // firefox
 * browser.safari === true; // safari
 * browser.msie === true; // IE
 * browser.edge === true; // edge
 * browser.others === true; // other browser
 * browser.version; // browser version
 */
var browser = {
  chrome: false,
  firefox: false,
  safari: false,
  msie: false,
  edge: false,
  others: false,
  version: 0
};

if (typeof window !== 'undefined' && window.navigator) {
  detectBrowser();
}

/**
 * Detect the browser.
 * @private
 */
function detectBrowser() {
  var nav = window.navigator;
  var appName = nav.appName.replace(/\s/g, '_');
  var userAgent = nav.userAgent;

  var rIE = /MSIE\s([0-9]+[.0-9]*)/;
  var rIE11 = /Trident.*rv:11\./;
  var rEdge = /Edge\/(\d+)\./;
  var versionRegex = {
    firefox: /Firefox\/(\d+)\./,
    chrome: /Chrome\/(\d+)\./,
    safari: /Version\/([\d.]+).*Safari\/(\d+)/
  };

  var key, tmp;

  var detector = {
    Microsoft_Internet_Explorer: function() { // eslint-disable-line camelcase
      var detectedVersion = userAgent.match(rIE);

      if (detectedVersion) { // ie8 ~ ie10
        browser.msie = true;
        browser.version = parseFloat(detectedVersion[1]);
      } else { // no version information
        browser.others = true;
      }
    },
    Netscape: function() { // eslint-disable-line complexity
      var detected = false;

      if (rIE11.exec(userAgent)) {
        browser.msie = true;
        browser.version = 11;
        detected = true;
      } else if (rEdge.exec(userAgent)) {
        browser.edge = true;
        browser.version = userAgent.match(rEdge)[1];
        detected = true;
      } else {
        for (key in versionRegex) {
          if (versionRegex.hasOwnProperty(key)) {
            tmp = userAgent.match(versionRegex[key]);
            if (tmp && tmp.length > 1) { // eslint-disable-line max-depth
              browser[key] = detected = true;
              browser.version = parseFloat(tmp[1] || 0);
              break;
            }
          }
        }
      }
      if (!detected) {
        browser.others = true;
      }
    }
  };

  var fn = detector[appName];

  if (fn) {
    detector[appName]();
  }
}

module.exports = browser;


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return isMac; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return sendHostName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return includes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return sanitizeLinkAttribute; });
/* harmony import */ var tui_code_snippet_type_isUndefined__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var tui_code_snippet_type_isUndefined__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_type_isUndefined__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tui_code_snippet_request_sendHostname__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(43);
/* harmony import */ var tui_code_snippet_request_sendHostname__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_request_sendHostname__WEBPACK_IMPORTED_MODULE_1__);


var isMac = /Mac/.test(navigator.platform);
function sendHostName() {
  tui_code_snippet_request_sendHostname__WEBPACK_IMPORTED_MODULE_1___default()('editor', 'UA-129966929-1');
}
function includes(arr, targetItem) {
  return arr.indexOf(targetItem) !== -1;
}
var availableLinkAttributes = ['rel', 'target', 'contenteditable', 'hreflang', 'type'];
/**
 * sanitize attribute for link
 * @param {object} attribute - attribute for link
 * @returns {object} sanitized attribute
 */

function sanitizeLinkAttribute(attribute) {
  if (!attribute) {
    return null;
  }

  var linkAttribute = {};
  availableLinkAttributes.forEach(function (key) {
    if (!tui_code_snippet_type_isUndefined__WEBPACK_IMPORTED_MODULE_0___default()(attribute[key])) {
      linkAttribute[key] = attribute[key];
    }
  });
  return linkAttribute;
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check element match selector
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var inArray = __webpack_require__(14);
var toArray = __webpack_require__(3);

var elProto = Element.prototype;
var matchSelector = elProto.matches ||
    elProto.webkitMatchesSelector ||
    elProto.mozMatchesSelector ||
    elProto.msMatchesSelector ||
    function(selector) {
      var doc = this.document || this.ownerDocument;

      return inArray(this, toArray(doc.querySelectorAll(selector))) > -1;
    };

/**
 * Check element match selector
 * @param {HTMLElement} element - element to check
 * @param {string} selector - selector to check
 * @returns {boolean} is selector matched to element?
 * @memberof module:domUtil
 */
function matches(element, selector) {
  return matchSelector.call(element, selector);
}

module.exports = matches;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-disable complexity */
/**
 * @fileoverview Returns the first index at which a given element can be found in the array.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isArray = __webpack_require__(17);

/**
 * @module array
 */

/**
 * Returns the first index at which a given element can be found in the array
 * from start index(default 0), or -1 if it is not present.
 * It compares searchElement to elements of the Array using strict equality
 * (the same method used by the ===, or triple-equals, operator).
 * @param {*} searchElement Element to locate in the array
 * @param {Array} array Array that will be traversed.
 * @param {number} startIndex Start index in array for searching (default 0)
 * @returns {number} the First index at which a given element, or -1 if it is not present
 * @memberof module:array
 * @example
 * var inArray = require('tui-code-snippet/array/inArray'); // node, commonjs
 *
 * var arr = ['one', 'two', 'three', 'four'];
 * var idx1 = inArray('one', arr, 3); // -1
 * var idx2 = inArray('one', arr); // 0
 */
function inArray(searchElement, array, startIndex) {
  var i;
  var length;
  startIndex = startIndex || 0;

  if (!isArray(array)) {
    return -1;
  }

  if (Array.prototype.indexOf) {
    return Array.prototype.indexOf.call(array, searchElement, startIndex);
  }

  length = array.length;
  for (i = startIndex; startIndex >= 0 && i < length; i += 1) {
    if (array[i] === searchElement) {
      return i;
    }
  }

  return -1;
}

module.exports = inArray;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__15__;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check element has specific css class
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var inArray = __webpack_require__(14);
var getClass = __webpack_require__(33);

/**
 * Check element has specific css class
 * @param {(HTMLElement|SVGElement)} element - target element
 * @param {string} cssClass - css class
 * @returns {boolean}
 * @memberof module:domUtil
 */
function hasClass(element, cssClass) {
  var origin;

  if (element.classList) {
    return element.classList.contains(cssClass);
  }

  origin = getClass(element).split(/\s+/);

  return inArray(cssClass, origin) > -1;
}

module.exports = hasClass;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is an instance of Array or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is an instance of Array or not.
 * If the given variable is an instance of Array, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is array instance?
 * @memberof module:type
 */
function isArray(obj) {
  return obj instanceof Array;
}

module.exports = isArray;


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return isNodeToBeCalculated; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getAdditionalTopPos; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getParentNodeObj; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getCmRangeHeight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getNextEmptyLineHeight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return getTotalOffsetTop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return findAdjacentElementToScrollTop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getFallbackScrollTop; });
/* harmony import */ var _utils_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _utils_markdown__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);


var nestableTypes = ['list', 'blockQuote'];
var nestableTagNames = ['UL', 'OL', 'BLOCKQUOTE'];
var tableElementTagNames = ['TR', 'TH', 'TBODY', 'TD'];
function isNodeToBeCalculated(mdNode) {
  return !Object(_utils_common__WEBPACK_IMPORTED_MODULE_0__[/* includes */ "a"])(nestableTypes, mdNode.type);
}
function getAdditionalTopPos(scrollTop, offsetTop, currentNodeHeight, targetNodeHeight) {
  var diff = (scrollTop - offsetTop) / currentNodeHeight;
  return diff < 1 ? diff * targetNodeHeight : targetNodeHeight;
}
function getParentNodeObj(mdNode) {
  var node = document.querySelector("[data-nodeid=\"" + mdNode.id + "\"]");

  while (!node || Object(_utils_common__WEBPACK_IMPORTED_MODULE_0__[/* includes */ "a"])(tableElementTagNames, mdNode.type) || Object(_utils_markdown__WEBPACK_IMPORTED_MODULE_1__[/* isStyledTextNode */ "k"])(mdNode)) {
    mdNode = mdNode.parent;
    node = document.querySelector("[data-nodeid=\"" + mdNode.id + "\"]");
  }

  return getNonNestableNodeObj(getParentListItemObj(mdNode));
}

function getParentListItemObj(orgMdNode) {
  var mdNode = orgMdNode;

  while (orgMdNode && orgMdNode !== 'document') {
    if (orgMdNode.type === 'item') {
      mdNode = orgMdNode;
      break;
    }

    orgMdNode = orgMdNode.parent;
  }

  return {
    mdNode: mdNode,
    node: document.querySelector("[data-nodeid=\"" + mdNode.id + "\"]")
  };
}

function getNonNestableNodeObj(_ref) {
  var mdNode = _ref.mdNode,
      node = _ref.node;

  while (Object(_utils_common__WEBPACK_IMPORTED_MODULE_0__[/* includes */ "a"])(nestableTypes, mdNode.type) && mdNode.firstChild) {
    mdNode = mdNode.firstChild;
    node = node.firstElementChild;
  }

  return {
    mdNode: mdNode,
    node: node
  };
}

function getCmRangeHeight(mdNode, cm) {
  var start = Object(_utils_markdown__WEBPACK_IMPORTED_MODULE_1__[/* getMdStartLine */ "f"])(mdNode);
  var end = Object(_utils_markdown__WEBPACK_IMPORTED_MODULE_1__[/* getMdEndLine */ "d"])(mdNode);
  var cmNodeHeight = cm.lineInfo(start - 1).handle.height;
  var height = cm.heightAtLine(end, 'local') - cm.heightAtLine(start - 1, 'local');
  return height <= 0 ? cmNodeHeight : height + getNextEmptyLineHeight(cm, Object(_utils_markdown__WEBPACK_IMPORTED_MODULE_1__[/* getMdEndLine */ "d"])(mdNode));
}
function getNextEmptyLineHeight(cm, start, end) {
  if (end === void 0) {
    end = Number.MAX_VALUE;
  }

  var lineInfo = cm.lineInfo(start);

  if (!lineInfo) {
    return 0;
  }

  var detailLineInfo = lineInfo.handle;
  var height = 0;

  while (start <= end && !detailLineInfo.text.trim()) {
    height += detailLineInfo.height;
    start += 1;
    detailLineInfo = cm.lineInfo(start).handle;
  }

  return height;
}
function getTotalOffsetTop(el, root) {
  var offsetTop = 0;

  while (el && el !== root) {
    if (!Object(_utils_common__WEBPACK_IMPORTED_MODULE_0__[/* includes */ "a"])(nestableTagNames, el.tagName)) {
      offsetTop += el.offsetTop;
    }

    if (el.offsetParent === root.offsetParent) {
      break;
    }

    el = el.parentElement;
  }

  return offsetTop;
}
function findAdjacentElementToScrollTop(scrollTop, root) {
  var el = root;
  var prev = null;

  while (el) {
    var _el = el,
        firstElementChild = _el.firstElementChild;

    if (!firstElementChild) {
      break;
    }

    var lastSibling = findLastSiblingElementToScrollTop(firstElementChild, scrollTop, getTotalOffsetTop(el, root));
    prev = el;
    el = lastSibling;
  }

  var adjacentEl = el || prev;
  return adjacentEl === root ? null : adjacentEl;
}

function findLastSiblingElementToScrollTop(el, scrollTop, offsetTop) {
  if (el && scrollTop > offsetTop + el.offsetTop) {
    return findLastSiblingElementToScrollTop(el.nextElementSibling, scrollTop, offsetTop) || el;
  }

  return null;
}

function getFallbackScrollTop(scrollInfo) {
  var latestScrollTop = scrollInfo.latestScrollTop,
      scrollTop = scrollInfo.scrollTop,
      targetScrollTop = scrollInfo.targetScrollTop,
      sourceScrollTop = scrollInfo.sourceScrollTop;

  if (latestScrollTop === null) {
    return targetScrollTop;
  }

  return latestScrollTop < scrollTop ? Math.max(targetScrollTop, sourceScrollTop) : Math.min(targetScrollTop, sourceScrollTop);
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Bind DOM events
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isString = __webpack_require__(9);
var forEach = __webpack_require__(26);

var safeEvent = __webpack_require__(40);

/**
 * Bind DOM events.
 * @param {HTMLElement} element - element to bind events
 * @param {(string|object)} types - Space splitted events names or eventName:handler object
 * @param {(function|object)} handler - handler function or context for handler method
 * @param {object} [context] context - context for handler method.
 * @memberof module:domEvent
 * @example
 * var div = document.querySelector('div');
 * 
 * // Bind one event to an element.
 * on(div, 'click', toggle);
 * 
 * // Bind multiple events with a same handler to multiple elements at once.
 * // Use event names splitted by a space.
 * on(div, 'mouseenter mouseleave', changeColor);
 * 
 * // Bind multiple events with different handlers to an element at once.
 * // Use an object which of key is an event name and value is a handler function.
 * on(div, {
 *   keydown: highlight,
 *   keyup: dehighlight
 * });
 * 
 * // Set a context for handler method.
 * var name = 'global';
 * var repository = {name: 'CodeSnippet'};
 * on(div, 'drag', function() {
 *  console.log(this.name);
 * }, repository);
 * // Result when you drag a div: "CodeSnippet"
 */
function on(element, types, handler, context) {
  if (isString(types)) {
    forEach(types.split(/\s+/g), function(type) {
      bindEvent(element, type, handler, context);
    });

    return;
  }

  forEach(types, function(func, type) {
    bindEvent(element, type, func, handler);
  });
}

/**
 * Bind DOM events
 * @param {HTMLElement} element - element to bind events
 * @param {string} type - events name
 * @param {function} handler - handler function or context for handler method
 * @param {object} [context] context - context for handler method.
 * @private
 */
function bindEvent(element, type, handler, context) {
  /**
     * Event handler
     * @param {Event} e - event object
     */
  function eventHandler(e) {
    handler.call(context || element, e || window.event);
  }

  if ('addEventListener' in element) {
    element.addEventListener(type, eventHandler);
  } else if ('attachEvent' in element) {
    element.attachEvent('on' + type, eventHandler);
  }
  memorizeHandler(element, type, handler, eventHandler);
}

/**
 * Memorize DOM event handler for unbinding.
 * @param {HTMLElement} element - element to bind events
 * @param {string} type - events name
 * @param {function} handler - handler function that user passed at on() use
 * @param {function} wrappedHandler - handler function that wrapped by domevent for implementing some features
 * @private
 */
function memorizeHandler(element, type, handler, wrappedHandler) {
  var events = safeEvent(element, type);
  var existInEvents = false;

  forEach(events, function(obj) {
    if (obj.handler === handler) {
      existInEvents = true;

      return false;
    }

    return true;
  });

  if (!existInEvents) {
    events.push({
      handler: handler,
      wrappedHandler: wrappedHandler
    });
  }
}

module.exports = on;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Unbind DOM events
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isString = __webpack_require__(9);
var forEach = __webpack_require__(26);

var safeEvent = __webpack_require__(40);

/**
 * Unbind DOM events
 * If a handler function is not passed, remove all events of that type.
 * @param {HTMLElement} element - element to unbind events
 * @param {(string|object)} types - Space splitted events names or eventName:handler object
 * @param {function} [handler] - handler function
 * @memberof module:domEvent
 * @example
 * // Following the example of domEvent#on
 * 
 * // Unbind one event from an element.
 * off(div, 'click', toggle);
 * 
 * // Unbind multiple events with a same handler from multiple elements at once.
 * // Use event names splitted by a space.
 * off(element, 'mouseenter mouseleave', changeColor);
 * 
 * // Unbind multiple events with different handlers from an element at once.
 * // Use an object which of key is an event name and value is a handler function.
 * off(div, {
 *   keydown: highlight,
 *   keyup: dehighlight
 * });
 * 
 * // Unbind events without handlers.
 * off(div, 'drag');
 */
function off(element, types, handler) {
  if (isString(types)) {
    forEach(types.split(/\s+/g), function(type) {
      unbindEvent(element, type, handler);
    });

    return;
  }

  forEach(types, function(func, type) {
    unbindEvent(element, type, func);
  });
}

/**
 * Unbind DOM events
 * If a handler function is not passed, remove all events of that type.
 * @param {HTMLElement} element - element to unbind events
 * @param {string} type - events name
 * @param {function} [handler] - handler function
 * @private
 */
function unbindEvent(element, type, handler) {
  var events = safeEvent(element, type);
  var index;

  if (!handler) {
    forEach(events, function(item) {
      removeHandler(element, type, item.wrappedHandler);
    });
    events.splice(0, events.length);
  } else {
    forEach(events, function(item, idx) {
      if (handler === item.handler) {
        removeHandler(element, type, item.wrappedHandler);
        index = idx;

        return false;
      }

      return true;
    });
    events.splice(index, 1);
  }
}

/**
 * Remove an event handler
 * @param {HTMLElement} element - An element to remove an event
 * @param {string} type - event type
 * @param {function} handler - event handler
 * @private
 */
function removeHandler(element, type, handler) {
  if ('removeEventListener' in element) {
    element.removeEventListener(type, handler);
  } else if ('detachEvent' in element) {
    element.detachEvent('on' + type, handler);
  }
}

module.exports = off;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Execute the provided callback once for each element present in the array(or Array-like object) in ascending order.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Execute the provided callback once for each element present
 * in the array(or Array-like object) in ascending order.
 * If the callback function returns false, the loop will be stopped.
 * Callback function(iteratee) is invoked with three arguments:
 *  1) The value of the element
 *  2) The index of the element
 *  3) The array(or Array-like object) being traversed
 * @param {Array|Arguments|NodeList} arr The array(or Array-like object) that will be traversed
 * @param {function} iteratee Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof module:collection
 * @example
 * var forEachArray = require('tui-code-snippet/collection/forEachArray'); // node, commonjs
 *
 * var sum = 0;
 *
 * forEachArray([1,2,3], function(value){
 *     sum += value;
 * });
 * alert(sum); // 6
 */
function forEachArray(arr, iteratee, context) {
  var index = 0;
  var len = arr.length;

  context = context || null;

  for (; index < len; index += 1) {
    if (iteratee.call(context, arr[index], index, arr) === false) {
      break;
    }
  }
}

module.exports = forEachArray;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

!function(e,t){for(var r in t)e[r]=t[r]}(exports,function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/dist",r(r.s=11)}([function(e,t,r){"use strict";r.r(t),r.d(t,"__extends",(function(){return i})),r.d(t,"__assign",(function(){return o})),r.d(t,"__rest",(function(){return a})),r.d(t,"__decorate",(function(){return s})),r.d(t,"__param",(function(){return l})),r.d(t,"__metadata",(function(){return u})),r.d(t,"__awaiter",(function(){return c})),r.d(t,"__generator",(function(){return p})),r.d(t,"__createBinding",(function(){return f})),r.d(t,"__exportStar",(function(){return d})),r.d(t,"__values",(function(){return h})),r.d(t,"__read",(function(){return g})),r.d(t,"__spread",(function(){return m})),r.d(t,"__spreadArrays",(function(){return v})),r.d(t,"__await",(function(){return b})),r.d(t,"__asyncGenerator",(function(){return y})),r.d(t,"__asyncDelegator",(function(){return C})),r.d(t,"__asyncValues",(function(){return x})),r.d(t,"__makeTemplateObject",(function(){return k})),r.d(t,"__importStar",(function(){return N})),r.d(t,"__importDefault",(function(){return w})),r.d(t,"__classPrivateFieldGet",(function(){return D})),r.d(t,"__classPrivateFieldSet",(function(){return L}));
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])})(e,t)};function i(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}var o=function(){return(o=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var i in t=arguments[r])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)};function a(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(n=Object.getOwnPropertySymbols(e);i<n.length;i++)t.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(e,n[i])&&(r[n[i]]=e[n[i]])}return r}function s(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}function l(e,t){return function(r,n){t(r,n,e)}}function u(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}function c(e,t,r,n){return new(r||(r=Promise))((function(i,o){function a(e){try{l(n.next(e))}catch(e){o(e)}}function s(e){try{l(n.throw(e))}catch(e){o(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(a,s)}l((n=n.apply(e,t||[])).next())}))}function p(e,t){var r,n,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;a;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,n=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}}function f(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]}function d(e,t){for(var r in e)"default"===r||t.hasOwnProperty(r)||(t[r]=e[r])}function h(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function g(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a}function m(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(g(arguments[t]));return e}function v(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;var n=Array(e),i=0;for(t=0;t<r;t++)for(var o=arguments[t],a=0,s=o.length;a<s;a++,i++)n[i]=o[a];return n}function b(e){return this instanceof b?(this.v=e,this):new b(e)}function y(e,t,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,i=r.apply(e,t||[]),o=[];return n={},a("next"),a("throw"),a("return"),n[Symbol.asyncIterator]=function(){return this},n;function a(e){i[e]&&(n[e]=function(t){return new Promise((function(r,n){o.push([e,t,r,n])>1||s(e,t)}))})}function s(e,t){try{(r=i[e](t)).value instanceof b?Promise.resolve(r.value.v).then(l,u):c(o[0][2],r)}catch(e){c(o[0][3],e)}var r}function l(e){s("next",e)}function u(e){s("throw",e)}function c(e,t){e(t),o.shift(),o.length&&s(o[0][0],o[0][1])}}function C(e){var t,r;return t={},n("next"),n("throw",(function(e){throw e})),n("return"),t[Symbol.iterator]=function(){return this},t;function n(n,i){t[n]=e[n]?function(t){return(r=!r)?{value:b(e[n](t)),done:"return"===n}:i?i(t):t}:i}}function x(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t,r=e[Symbol.asyncIterator];return r?r.call(e):(e=h(e),t={},n("next"),n("throw"),n("return"),t[Symbol.asyncIterator]=function(){return this},t);function n(r){t[r]=e[r]&&function(t){return new Promise((function(n,i){(function(e,t,r,n){Promise.resolve(n).then((function(t){e({value:t,done:r})}),t)})(n,i,(t=e[r](t)).done,t.value)}))}}}function k(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e}function N(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}function w(e){return e&&e.__esModule?e:{default:e}}function D(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)}function L(e,t,r){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,r),r}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.text=t.isRefDef=t.isTable=t.isList=t.isHeading=t.isHtmlBlock=t.isCodeBlock=t.createNode=t.RefDefNode=t.TableCellNode=t.TableNode=t.CodeNode=t.HtmlBlockNode=t.CodeBlockNode=t.LinkNode=t.HeadingNode=t.ListNode=t.BlockNode=t.Node=t.removeAllNode=t.removeNodeById=t.getNodeById=t.isContainer=void 0;var n=r(0),i=n.__importDefault(r(18));function o(e){switch(e.type){case"document":case"blockQuote":case"list":case"item":case"paragraph":case"heading":case"emph":case"strong":case"strike":case"link":case"image":case"table":case"tableHead":case"tableBody":case"tableRow":case"tableCell":case"tableDelimRow":return!0;default:return!1}}t.isContainer=o;var a=1,s={};t.getNodeById=function(e){return s[e]},t.removeNodeById=function(e){delete s[e]},t.removeAllNode=function(){s={}};var l=function(){function e(e,t){this.parent=null,this.prev=null,this.next=null,this.firstChild=null,this.lastChild=null,this.literal=null,this.id="document"===e?-1:a++,this.type=e,this.sourcepos=t,s[this.id]=this}return e.prototype.isContainer=function(){return o(this)},e.prototype.unlink=function(){this.prev?this.prev.next=this.next:this.parent&&(this.parent.firstChild=this.next),this.next?this.next.prev=this.prev:this.parent&&(this.parent.lastChild=this.prev),this.parent=null,this.next=null,this.prev=null},e.prototype.replaceWith=function(e){this.insertBefore(e),this.unlink()},e.prototype.insertAfter=function(e){e.unlink(),e.next=this.next,e.next&&(e.next.prev=e),e.prev=this,this.next=e,this.parent&&(e.parent=this.parent,e.next||(e.parent.lastChild=e))},e.prototype.insertBefore=function(e){e.unlink(),e.prev=this.prev,e.prev&&(e.prev.next=e),e.next=this,this.prev=e,e.parent=this.parent,e.prev||(e.parent.firstChild=e)},e.prototype.appendChild=function(e){e.unlink(),e.parent=this,this.lastChild?(this.lastChild.next=e,e.prev=this.lastChild,this.lastChild=e):(this.firstChild=e,this.lastChild=e)},e.prototype.prependChild=function(e){e.unlink(),e.parent=this,this.firstChild?(this.firstChild.prev=e,e.next=this.firstChild,this.firstChild=e):(this.firstChild=e,this.lastChild=e)},e.prototype.walker=function(){return new i.default(this)},e}();t.Node=l;var u=function(e){function t(t,r){var n=e.call(this,t,r)||this;return n.open=!0,n.lineOffsets=null,n.stringContent=null,n.lastLineBlank=!1,n.lastLineChecked=!1,n.customType=null,n.type=t,n}return n.__extends(t,e),t}(l);t.BlockNode=u;var c=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.listData=null,t}return n.__extends(t,e),t}(u);t.ListNode=c;var p=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.level=0,t.headingType="atx",t}return n.__extends(t,e),t}(u);t.HeadingNode=p;var f=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.destination=null,t.title=null,t.extendedAutolink=!1,t}return n.__extends(t,e),t}(l);t.LinkNode=f;var d=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.isFenced=!1,t.fenceChar=null,t.fenceLength=0,t.fenceOffset=-1,t.info=null,t.infoPadding=0,t}return n.__extends(t,e),t}(u);t.CodeBlockNode=d;var h=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.htmlBlockType=-1,t}return n.__extends(t,e),t}(u);t.HtmlBlockNode=h;var g=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.tickCount=0,t}return n.__extends(t,e),t}(l);t.CodeNode=g;var m=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.columns=[],t}return n.__extends(t,e),t}(u);t.TableNode=m;var v=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.startIdx=0,t.endIdx=0,t.paddingLeft=0,t.paddingRight=0,t.ignored=!1,t}return n.__extends(t,e),t}(u);t.TableCellNode=v;var b=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.title="",t.dest="",t.label="",t}return n.__extends(t,e),t}(u);function y(e,t){switch(e){case"heading":return new p(e,t);case"list":case"item":return new c(e,t);case"link":case"image":return new f(e,t);case"codeBlock":return new d(e,t);case"htmlBlock":return new h(e,t);case"table":return new m(e,t);case"tableCell":return new v(e,t);case"document":case"paragraph":case"blockQuote":case"thematicBreak":case"tableRow":case"tableBody":case"tableHead":return new u(e,t);case"code":return new g(e,t);case"refDef":return new b(e,t);default:return new l(e,t)}}t.RefDefNode=b,t.createNode=y,t.isCodeBlock=function(e){return"codeBlock"===e.type},t.isHtmlBlock=function(e){return"htmlBlock"===e.type},t.isHeading=function(e){return"heading"===e.type},t.isList=function(e){return"list"===e.type},t.isTable=function(e){return"table"===e.type},t.isRefDef=function(e){return"refDef"===e.type},t.text=function(e,t){var r=y("text",t);return r.literal=e,r}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.isEmpty=t.last=t.repeat=t.escapeXml=t.normalizeURI=t.unescapeString=t.ESCAPABLE=t.ENTITY=void 0;var n=r(0).__importDefault(r(12)),i=r(8);t.ENTITY="&(?:#x[a-f0-9]{1,6}|#[0-9]{1,7}|[a-z][a-z0-9]{1,31});";var o=/[\\&]/;t.ESCAPABLE="[!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]";var a=new RegExp("\\\\"+t.ESCAPABLE+"|"+t.ENTITY,"gi"),s=new RegExp('[&<>"]',"g"),l=function(e){return 92===e.charCodeAt(0)?e.charAt(1):i.decodeHTML(e)};function u(e){switch(e){case"&":return"&amp;";case"<":return"&lt;";case">":return"&gt;";case'"':return"&quot;";default:return e}}t.unescapeString=function(e){return o.test(e)?e.replace(a,l):e},t.normalizeURI=function(e){try{return n.default(e)}catch(t){return e}},t.escapeXml=function(e){return s.test(e)?e.replace(s,u):e},t.repeat=function(e,t){for(var r=[],n=0;n<t;n++)r.push(e);return r.join("")},t.last=function(e){return e.length?e[e.length-1]:null},t.isEmpty=function(e){return!e||!/[^ \t]+/.test(e)}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.clearObj=t.isEmptyObj=t.omit=t.iterateObject=t.normalizeReference=t.last=void 0;var n=r(0);t.last=function(e){return e[e.length-1]},t.normalizeReference=function(e){return e.slice(1,e.length-1).trim().replace(/[ \t\r\n]+/," ").toLowerCase().toUpperCase()},t.iterateObject=function(e,t){Object.keys(e).forEach((function(r){t(r,e[r])}))},t.omit=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];var i=n.__assign({},e);return t.forEach((function(e){delete i[e]})),i},t.isEmptyObj=function(e){return!Object.keys(e).length},t.clearObj=function(e){Object.keys(e).forEach((function(t){delete e[t]}))}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.isSpaceOrTab=t.isBlank=t.peek=t.endsWithBlankLine=t.reClosingCodeFence=t.reNonSpace=t.C_OPEN_BRACKET=t.C_SPACE=t.C_LESSTHAN=t.C_GREATERTHAN=t.C_NEWLINE=t.C_TAB=t.CODE_INDENT=void 0,t.CODE_INDENT=4,t.C_TAB=9,t.C_NEWLINE=10,t.C_GREATERTHAN=62,t.C_LESSTHAN=60,t.C_SPACE=32,t.C_OPEN_BRACKET=91,t.reNonSpace=/[^ \t\f\v\r\n]/,t.reClosingCodeFence=/^(?:`{3,}|~{3,})(?= *$)/,t.endsWithBlankLine=function(e){for(var t=e;t;){if(t.lastLineBlank)return!0;var r=t.type;if(t.lastLineChecked||"list"!==r&&"item"!==r){t.lastLineChecked=!0;break}t.lastLineChecked=!0,t=t.lastChild}return!1},t.peek=function(e,t){return t<e.length?e.charCodeAt(t):-1},t.isBlank=function(e){return!t.reNonSpace.test(e)},t.isSpaceOrTab=function(e){return e===t.C_SPACE||e===t.C_TAB}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ToastMark=t.createRefDefState=t.reLineEnding=void 0;var n=r(0),i=r(7),o=r(1),a=r(27),s=r(10),l=r(3),u=r(4),c=r(6);function p(e){return{id:e.id,title:e.title,sourcepos:e.sourcepos,unlinked:!1,destination:e.dest}}t.reLineEnding=/\r\n|\n|\r/,t.createRefDefState=p;var f=function(){function e(e,r){this.refMap={},this.refLinkCandidateMap={},this.refDefCandidateMap={},this.referenceDefinition=!!(null==r?void 0:r.referenceDefinition),this.frontMatter=!!(null==r?void 0:r.frontMatter),this.parser=new i.Parser(r),this.parser.setRefMaps(this.refMap,this.refLinkCandidateMap,this.refDefCandidateMap),this.eventHandlerMap={change:[]},e=e||"",this.lineTexts=e.split(t.reLineEnding),this.root=this.parser.parse(e)}return e.prototype.updateLineTexts=function(e,r,i){var o,a=e[0],s=e[1],l=r[0],u=r[1],c=i.split(t.reLineEnding),p=c.length,f=this.lineTexts[a-1],d=this.lineTexts[l-1];c[0]=f.slice(0,s-1)+c[0],c[p-1]=c[p-1]+d.slice(u-1);var h=l-a+1;return(o=this.lineTexts).splice.apply(o,n.__spreadArrays([a-1,h],c)),p-h},e.prototype.updateRootNodeState=function(){if(1===this.lineTexts.length&&""===this.lineTexts[0])return this.root.lastLineBlank=!0,void(this.root.sourcepos=[[1,1],[1,0]]);this.root.lastChild&&(this.root.lastLineBlank=this.root.lastChild.lastLineBlank);for(var e=this.lineTexts,t=e.length-1;""===e[t];)t-=1;e.length-2>t&&(t+=1),this.root.sourcepos[1]=[t+1,e[t].length]},e.prototype.replaceRangeNodes=function(e,t,r){e?(a.insertNodesBefore(e,r),a.removeNextUntil(e,t),[e.id,t.id].forEach((function(e){return o.removeNodeById(e)})),e.unlink()):t?(a.insertNodesBefore(t,r),o.removeNodeById(t.id),t.unlink()):a.prependChildNodes(this.root,r)},e.prototype.getNodeRange=function(e,t){var r=a.findChildNodeAtLine(this.root,e[0]),n=a.findChildNodeAtLine(this.root,t[0]);return n&&n.next&&t[0]+1===n.next.sourcepos[0][0]&&(n=n.next),a.getRangeForCustomType(r,n)},e.prototype.trigger=function(e,t){this.eventHandlerMap[e].forEach((function(e){e(t)}))},e.prototype.extendEndLine=function(e){for(;""===this.lineTexts[e];)e+=1;return e},e.prototype.parseRange=function(e,t,r,n){var i;e&&e.prev&&(o.isList(e.prev)&&function(e){var t=e.match(/^[ \t]+/);if(t&&(t[0].length>=2||/\t/.test(t[0])))return!0;var r=t?e.slice(t.length):e;return s.reBulletListMarker.test(r)||s.reOrderedListMarker.test(r)}(this.lineTexts[r-1])||o.isTable(e.prev)&&(i=this.lineTexts[r-1],!u.isBlank(i)&&-1!==i.indexOf("|")))&&(r=(e=e.prev).sourcepos[0][0]);for(var l=this.lineTexts.slice(r-1,n),c=this.parser.partialParseStart(r,l),p=t?t.next:this.root.firstChild,f=c.lastChild,d=f&&o.isCodeBlock(f),h=f&&o.isList(f);d&&p||h&&p&&("list"===p.type||p.sourcepos[0][1]>=2);){var g=this.extendEndLine(p.sourcepos[1][0]);this.parser.partialParseExtends(this.lineTexts.slice(n,g)),e||(e=t),t=p,n=g,p=p.next}return this.parser.partialParseFinish(),{newNodes:a.getChildNodes(c),extStartNode:e,extEndNode:t}},e.prototype.getRemovedNodeRange=function(e,t){return!e||e&&o.isRefDef(e)||t&&o.isRefDef(t)?null:{id:[e.id,t.id],line:[e.sourcepos[0][0]-1,t.sourcepos[1][0]-1]}},e.prototype.markDeletedRefMap=function(e,t){var r=this;if(!l.isEmptyObj(this.refMap)){var n=function(e){if(o.isRefDef(e)){var t=r.refMap[e.label];t&&e.id===t.id&&(t.unlinked=!0)}};e&&a.invokeNextUntil(n,e.parent,t),t&&a.invokeNextUntil(n,t)}},e.prototype.replaceWithNewRefDefState=function(e){var t=this;if(!l.isEmptyObj(this.refMap)){var r=function(e){if(o.isRefDef(e)){var r=e.label,n=t.refMap[r];n&&!n.unlinked||(t.refMap[r]=p(e))}};e.forEach((function(e){a.invokeNextUntil(r,e)}))}},e.prototype.replaceWithRefDefCandidate=function(){var e=this;l.isEmptyObj(this.refDefCandidateMap)||l.iterateObject(this.refDefCandidateMap,(function(t,r){var n=r.label,i=r.sourcepos,o=e.refMap[n];(!o||o.unlinked||o.sourcepos[0][0]>i[0][0])&&(e.refMap[n]=p(r))}))},e.prototype.getRangeWithRefDef=function(e,t,r,n,i){if(this.referenceDefinition&&!l.isEmptyObj(this.refMap)){var s=a.findChildNodeAtLine(this.root,e-1),u=a.findChildNodeAtLine(this.root,t+1);s&&o.isRefDef(s)&&s!==r&&s!==n&&(e=(r=s).sourcepos[0][0]),u&&o.isRefDef(u)&&u!==r&&u!==n&&(n=u,t=this.extendEndLine(n.sourcepos[1][0]+i))}return[r,n,e,t]},e.prototype.parseWithFrontMatter=function(e,t,r){void 0===r&&(r=0);var i=n.__spreadArrays(this.lineTexts),o=c.getFrontMatterPos(this.lineTexts),a=o[0],s=o[1];a>-1&&s>-1&&(this.lineTexts[a]=c.frontMatterOpen,this.lineTexts[s]=c.frontMatterClose,a>=t[0]-1&&(t[0]=s+1),a<=e[0]-1&&s>=t[0]-1&&(e[0]=a+1,t[0]=s+1));var l=this.parse(e,t,r);return this.lineTexts=i,l},e.prototype.parse=function(e,t,r){void 0===r&&(r=0);var n=this.getNodeRange(e,t),i=n[0],o=n[1],a=i?Math.min(i.sourcepos[0][0],e[0]):e[0],s=this.extendEndLine((o?Math.max(o.sourcepos[1][0],t[0]):t[0])+r),l=this.parseRange.apply(this,this.getRangeWithRefDef(a,s,i,o,r)),u=l.newNodes,c=l.extStartNode,p=l.extEndNode,f=this.getRemovedNodeRange(c,p),d=p?p.next:this.root.firstChild;return this.referenceDefinition?(this.markDeletedRefMap(c,p),this.replaceRangeNodes(c,p,u),this.replaceWithNewRefDefState(u)):this.replaceRangeNodes(c,p,u),{nodes:u,removedNodeRange:f,nextNode:d}},e.prototype.parseRefLink=function(){var e=this,t=[];return l.isEmptyObj(this.refMap)||l.iterateObject(this.refMap,(function(r,n){n.unlinked&&delete e.refMap[r],l.iterateObject(e.refLinkCandidateMap,(function(n,i){var o=i.node;i.refLabel===r&&t.push(e.parse(o.sourcepos[0],o.sourcepos[1]))}))})),t},e.prototype.removeUnlinkedCandidate=function(){l.isEmptyObj(this.refDefCandidateMap)||[this.refLinkCandidateMap,this.refDefCandidateMap].forEach((function(e){l.iterateObject(e,(function(t){a.isUnlinked(t)&&delete e[t]}))}))},e.prototype.editMarkdown=function(e,t,r){var n=this.updateLineTexts(e,t,r),i=this.frontMatter?this.parseWithFrontMatter(e,t,n):this.parse(e,t,n),o=l.omit(i,"nextNode");a.updateNextLineNumbers(i.nextNode,n),this.updateRootNodeState();var s=[o];return this.referenceDefinition&&(this.removeUnlinkedCandidate(),this.replaceWithRefDefCandidate(),s=s.concat(this.parseRefLink())),this.trigger("change",s),s},e.prototype.getLineTexts=function(){return this.lineTexts},e.prototype.getRootNode=function(){return this.root},e.prototype.findNodeAtPosition=function(e){var t=a.findNodeAtPosition(this.root,e);return t&&t!==this.root?t:null},e.prototype.findFirstNodeAtLine=function(e){return a.findFirstNodeAtLine(this.root,e)},e.prototype.on=function(e,t){this.eventHandlerMap[e].push(t)},e.prototype.off=function(e,t){var r=this.eventHandlerMap[e],n=r.indexOf(t);r.splice(n,1)},e.prototype.findNodeById=function(e){return a.findNodeById(e)},e.prototype.removeAllNode=function(){o.removeAllNode()},e}();t.ToastMark=f},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getFrontMatterPos=t.replaceFrontMatter=t.frontMatterClose=t.frontMatterOpen=void 0,t.frontMatterOpen="{:f",t.frontMatterClose="f:}";var n=/^---$/,i=/^---$([\s\S]*)^---$/m;t.replaceFrontMatter=function(e){var r=e.trim();return/^---/.test(r)&&function(e){return i.test(e)}(r)?e.replace(i,t.frontMatterOpen+"$1"+t.frontMatterClose):e},t.getFrontMatterPos=function(e){for(var t=-1,r=-1,i=0;i<e.length;i+=1){var o=e[i].trim();if(t<0&&o&&!n.test(o)||r>0)break;n.test(o)&&(t<0?t=i:r=i)}return[t,r]}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Parser=void 0;var n=r(0),i=r(2),o=r(1),a=r(19),s=r(22),l=r(4),u=r(10),c=r(3),p=r(6),f=r(26),d=[/./,/<\/(?:script|pre|style)>/i,/-->/,/\?>/,/>/,/\]\]>/],h=/^[#`~*+_=<>0-9-]/,g=/\r\n|\n|\r/;function m(){return o.createNode("document",[[1,1],[0,0]])}var v={smart:!1,tagFilter:!1,extendedAutolinks:!1,disallowedHtmlBlockTags:[],referenceDefinition:!1,disallowDeepHeading:!1,customParser:null,frontMatter:!1},b=function(){function e(e){this.options=n.__assign(n.__assign({},v),e),this.doc=m(),this.tip=this.doc,this.oldtip=this.doc,this.lineNumber=0,this.offset=0,this.column=0,this.nextNonspace=0,this.nextNonspaceColumn=0,this.indent=0,this.currentLine="",this.indented=!1,this.blank=!1,this.partiallyConsumedTab=!1,this.allClosed=!0,this.lastMatchedContainer=this.doc,this.refMap={},this.refLinkCandidateMap={},this.refDefCandidateMap={},this.lastLineLength=0,this.options.frontMatter&&(this.options.customParser=n.__assign(n.__assign({},f.frontMatterParser),this.options.customParser)),this.inlineParser=new a.InlineParser(this.options)}return e.prototype.advanceOffset=function(e,t){void 0===t&&(t=!1);for(var r,n,i,o=this.currentLine;e>0&&(i=o[this.offset]);)"\t"===i?(r=4-this.column%4,t?(this.partiallyConsumedTab=r>e,n=r>e?e:r,this.column+=n,this.offset+=this.partiallyConsumedTab?0:1,e-=n):(this.partiallyConsumedTab=!1,this.column+=r,this.offset+=1,e-=1)):(this.partiallyConsumedTab=!1,this.offset+=1,this.column+=1,e-=1)},e.prototype.advanceNextNonspace=function(){this.offset=this.nextNonspace,this.column=this.nextNonspaceColumn,this.partiallyConsumedTab=!1},e.prototype.findNextNonspace=function(){for(var e,t=this.currentLine,r=this.offset,n=this.column;""!==(e=t.charAt(r));)if(" "===e)r++,n++;else{if("\t"!==e)break;r++,n+=4-n%4}this.blank="\n"===e||"\r"===e||""===e,this.nextNonspace=r,this.nextNonspaceColumn=n,this.indent=this.nextNonspaceColumn-this.column,this.indented=this.indent>=l.CODE_INDENT},e.prototype.addLine=function(){if(this.partiallyConsumedTab){this.offset+=1;var e=4-this.column%4;this.tip.stringContent+=i.repeat(" ",e)}this.tip.lineOffsets?this.tip.lineOffsets.push(this.offset):this.tip.lineOffsets=[this.offset],this.tip.stringContent+=this.currentLine.slice(this.offset)+"\n"},e.prototype.addChild=function(e,t){for(;!s.blockHandlers[this.tip.type].canContain(e);)this.finalize(this.tip,this.lineNumber-1);var r=t+1,n=o.createNode(e,[[this.lineNumber,r],[0,0]]);return n.stringContent="",this.tip.appendChild(n),this.tip=n,n},e.prototype.closeUnmatchedBlocks=function(){if(!this.allClosed){for(;this.oldtip!==this.lastMatchedContainer;){var e=this.oldtip.parent;this.finalize(this.oldtip,this.lineNumber-1),this.oldtip=e}this.allClosed=!0}},e.prototype.finalize=function(e,t){var r=e.parent;e.open=!1,e.sourcepos[1]=[t,this.lastLineLength],s.blockHandlers[e.type].finalize(this,e),this.tip=r},e.prototype.processInlines=function(e){var t,r=this.options.customParser,n=e.walker();for(this.inlineParser.refMap=this.refMap,this.inlineParser.refLinkCandidateMap=this.refLinkCandidateMap,this.inlineParser.refDefCandidateMap=this.refDefCandidateMap,this.inlineParser.options=this.options;t=n.next();){var i=t.node,o=t.entering,a=i.type;r&&r[a]&&r[a](i,{entering:o,options:this.options}),o||"paragraph"!==a&&"heading"!==a&&("tableCell"!==a||i.ignored)||this.inlineParser.parse(i)}},e.prototype.incorporateLine=function(e){var t=this.doc;this.oldtip=this.tip,this.offset=0,this.column=0,this.blank=!1,this.partiallyConsumedTab=!1,this.lineNumber+=1,-1!==e.indexOf("\0")&&(e=e.replace(/\0/g,"�")),this.currentLine=e;for(var r,n=!0;(r=t.lastChild)&&r.open;){switch(t=r,this.findNextNonspace(),s.blockHandlers[t.type].continue(this,t)){case 0:break;case 1:n=!1;break;case 2:return void(this.lastLineLength=e.length);default:throw new Error("continue returned illegal value, must be 0, 1, or 2")}if(!n){t=t.parent;break}}this.allClosed=t===this.oldtip,this.lastMatchedContainer=t;for(var i="paragraph"!==t.type&&s.blockHandlers[t.type].acceptsLines,a=u.blockStarts.length;!i;){if(this.findNextNonspace(),"table"!==t.type&&"tableBody"!==t.type&&"paragraph"!==t.type&&!this.indented&&!h.test(e.slice(this.nextNonspace))){this.advanceNextNonspace();break}for(var l=0;l<a;){var c=u.blockStarts[l](this,t);if(1===c){t=this.tip;break}if(2===c){t=this.tip,i=!0;break}l++}if(l===a){this.advanceNextNonspace();break}}if(this.allClosed||this.blank||"paragraph"!==this.tip.type){this.closeUnmatchedBlocks(),this.blank&&t.lastChild&&(t.lastChild.lastLineBlank=!0);for(var p=t.type,f=this.blank&&!("blockQuote"===p||o.isCodeBlock(t)&&t.isFenced||"item"===p&&!t.firstChild&&t.sourcepos[0][0]===this.lineNumber),g=t;g;)g.lastLineBlank=f,g=g.parent;s.blockHandlers[p].acceptsLines?(this.addLine(),o.isHtmlBlock(t)&&t.htmlBlockType>=1&&t.htmlBlockType<=5&&d[t.htmlBlockType].test(this.currentLine.slice(this.offset))&&(this.lastLineLength=e.length,this.finalize(t,this.lineNumber))):this.offset<e.length&&!this.blank&&(t=this.addChild("paragraph",this.offset),this.advanceNextNonspace(),this.addLine())}else this.addLine();this.lastLineLength=e.length},e.prototype.parse=function(e){this.options.frontMatter&&(e=p.replaceFrontMatter(e)),this.doc=m(),this.tip=this.doc,this.lineNumber=0,this.lastLineLength=0,this.offset=0,this.column=0,this.lastMatchedContainer=this.doc,this.currentLine="";var t=e.split(g),r=t.length;this.options.referenceDefinition&&this.clearRefMaps(),e.charCodeAt(e.length-1)===a.C_NEWLINE&&(r-=1);for(var n=0;n<r;n++)this.incorporateLine(t[n]);for(;this.tip;)this.finalize(this.tip,r);return this.processInlines(this.doc),this.doc},e.prototype.partialParseStart=function(e,t){this.doc=m(),this.tip=this.doc,this.lineNumber=e-1,this.lastLineLength=0,this.offset=0,this.column=0,this.lastMatchedContainer=this.doc,this.currentLine="";for(var r=t.length,n=0;n<r;n++)this.incorporateLine(t[n]);return this.doc},e.prototype.partialParseExtends=function(e){for(var t=0;t<e.length;t++)this.incorporateLine(e[t])},e.prototype.partialParseFinish=function(){for(;this.tip;)this.finalize(this.tip,this.lineNumber);this.processInlines(this.doc)},e.prototype.setRefMaps=function(e,t,r){this.refMap=e,this.refLinkCandidateMap=t,this.refDefCandidateMap=r},e.prototype.clearRefMaps=function(){[this.refMap,this.refLinkCandidateMap,this.refDefCandidateMap].forEach((function(e){c.clearObj(e)}))},e}();t.Parser=b},function(e,t,r){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.decodeHTML=t.decodeHTMLStrict=t.decodeXML=void 0;var i=n(r(13)),o=n(r(14)),a=n(r(15)),s=n(r(16));function l(e){var t=Object.keys(e).join("|"),r=c(e),n=new RegExp("&(?:"+(t+="|#[xX][\\da-fA-F]+|#\\d+")+");","g");return function(e){return String(e).replace(n,r)}}t.decodeXML=l(a.default),t.decodeHTMLStrict=l(i.default);var u=function(e,t){return e<t?1:-1};function c(e){return function(t){if("#"===t.charAt(1)){var r=t.charAt(2);return"X"===r||"x"===r?s.default(parseInt(t.substr(3),16)):s.default(parseInt(t.substr(2),10))}return e[t.slice(1,-1)]}}t.decodeHTML=function(){for(var e=Object.keys(o.default).sort(u),t=Object.keys(i.default).sort(u),r=0,n=0;r<t.length;r++)e[n]===t[r]?(t[r]+=";?",n++):t[r]+=";";var a=new RegExp("&(?:"+t.join("|")+"|#[xX][\\da-fA-F]+;?|#\\d+;?)","g"),s=c(i.default);function l(e){return";"!==e.substr(-1)&&(e+=";"),s(e)}return function(e){return String(e).replace(a,l)}}()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.reHtmlTag=t.CLOSETAG=t.OPENTAG=void 0;t.OPENTAG="<[A-Za-z][A-Za-z0-9-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*/?>",t.CLOSETAG="</[A-Za-z][A-Za-z0-9-]*\\s*[>]";var n="(?:"+t.OPENTAG+"|"+t.CLOSETAG+"|\x3c!----\x3e|\x3c!--(?:-?[^>-])(?:-?[^-])*--\x3e|[<][?].*?[?][>]|<![A-Z]+\\s+[^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)";t.reHtmlTag=new RegExp("^"+n,"i")},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.blockStarts=t.reOrderedListMarker=t.reBulletListMarker=void 0;var n=r(1),i=r(9),o=r(4),a=r(25),s=/^`{3,}(?!.*`)|^~{3,}/,l=[/./,/^<(?:script|pre|style)(?:\s|>|$)/i,/^<!--/,/^<[?]/,/^<![A-Z]/,/^<!\[CDATA\[/,/^<[/]?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[123456]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\s|[/]?[>]|$)/i,new RegExp("^(?:"+i.OPENTAG+"|"+i.CLOSETAG+")\\s*$","i")],u=/^(?:=+|-+)[ \t]*$/,c=/^#{1,6}(?:[ \t]+|$)/,p=/^(?:(?:\*[ \t]*){3,}|(?:_[ \t]*){3,}|(?:-[ \t]*){3,})[ \t]*$/;function f(e,t){return e.options.disallowDeepHeading&&("blockQuote"===t.type||"item"===t.type)}t.reBulletListMarker=/^[*+-]/,t.reOrderedListMarker=/^(\d{1,9})([.)])/;t.blockStarts=[function(e){return e.indented||o.peek(e.currentLine,e.nextNonspace)!==o.C_GREATERTHAN?0:(e.advanceNextNonspace(),e.advanceOffset(1,!1),o.isSpaceOrTab(o.peek(e.currentLine,e.offset))&&e.advanceOffset(1,!0),e.closeUnmatchedBlocks(),e.addChild("blockQuote",e.nextNonspace),1)},function(e,t){var r;if(!e.indented&&!f(e,t)&&(r=e.currentLine.slice(e.nextNonspace).match(c))){e.advanceNextNonspace(),e.advanceOffset(r[0].length,!1),e.closeUnmatchedBlocks();var n=e.addChild("heading",e.nextNonspace);return n.level=r[0].trim().length,n.headingType="atx",n.stringContent=e.currentLine.slice(e.offset).replace(/^[ \t]*#+[ \t]*$/,"").replace(/[ \t]+#+[ \t]*$/,""),e.advanceOffset(e.currentLine.length-e.offset),2}return 0},function(e){var t;if(!e.indented&&(t=e.currentLine.slice(e.nextNonspace).match(s))){var r=t[0].length;e.closeUnmatchedBlocks();var n=e.addChild("codeBlock",e.nextNonspace);return n.isFenced=!0,n.fenceLength=r,n.fenceChar=t[0][0],n.fenceOffset=e.indent,e.advanceNextNonspace(),e.advanceOffset(r,!1),2}return 0},function(e,t){if(!e.indented&&o.peek(e.currentLine,e.nextNonspace)===o.C_LESSTHAN){var r=e.currentLine.slice(e.nextNonspace),n=e.options.disallowedHtmlBlockTags,i=void 0;for(i=1;i<=7;i++){var a=r.match(l[i]);if(a){if(7===i){if("paragraph"===t.type)return 0;if(n.length>0)if(new RegExp("</?(?:"+n.join("|")+")","i").test(a[0]))return 0}return e.closeUnmatchedBlocks(),e.addChild("htmlBlock",e.offset).htmlBlockType=i,2}}}return 0},function(e,t){var r;if(null!==t.stringContent&&!e.indented&&"paragraph"===t.type&&!f(e,t.parent)&&(r=e.currentLine.slice(e.nextNonspace).match(u))){e.closeUnmatchedBlocks();for(var i=void 0;o.peek(t.stringContent,0)===o.C_OPEN_BRACKET&&(i=e.inlineParser.parseReference(t,e.refMap));)t.stringContent=t.stringContent.slice(i);if(t.stringContent.length>0){var a=n.createNode("heading",t.sourcepos);return a.level="="===r[0][0]?1:2,a.headingType="setext",a.stringContent=t.stringContent,t.insertAfter(a),t.unlink(),e.tip=a,e.advanceOffset(e.currentLine.length-e.offset,!1),2}return 0}return 0},function(e){return!e.indented&&p.test(e.currentLine.slice(e.nextNonspace))?(e.closeUnmatchedBlocks(),e.addChild("thematicBreak",e.nextNonspace),e.advanceOffset(e.currentLine.length-e.offset,!1),2):0},function(e,r){var n,i,a,s=r;return e.indented&&"list"!==r.type||!(n=function(e,r){var n,i,a=e.currentLine.slice(e.nextNonspace),s={type:"bullet",tight:!0,bulletChar:"",start:0,delimiter:"",padding:0,markerOffset:e.indent,task:!1,checked:!1};if(e.indent>=4)return null;if(n=a.match(t.reBulletListMarker))s.type="bullet",s.bulletChar=n[0][0];else{if(!(n=a.match(t.reOrderedListMarker))||"paragraph"===r.type&&"1"!==n[1])return null;s.type="ordered",s.start=parseInt(n[1],10),s.delimiter=n[2]}if(-1!==(i=o.peek(e.currentLine,e.nextNonspace+n[0].length))&&i!==o.C_TAB&&i!==o.C_SPACE)return null;if("paragraph"===r.type&&!e.currentLine.slice(e.nextNonspace+n[0].length).match(o.reNonSpace))return null;e.advanceNextNonspace(),e.advanceOffset(n[0].length,!0);var l=e.column,u=e.offset;do{e.advanceOffset(1,!0),i=o.peek(e.currentLine,e.offset)}while(e.column-l<5&&o.isSpaceOrTab(i));var c=-1===o.peek(e.currentLine,e.offset),p=e.column-l;return p>=5||p<1||c?(s.padding=n[0].length+1,e.column=l,e.offset=u,o.isSpaceOrTab(o.peek(e.currentLine,e.offset))&&e.advanceOffset(1,!0)):s.padding=n[0].length+p,s}(e,s))?0:(e.closeUnmatchedBlocks(),"list"===e.tip.type&&(i=s.listData,a=n,i.type===a.type&&i.delimiter===a.delimiter&&i.bulletChar===a.bulletChar)||((s=e.addChild("list",e.nextNonspace)).listData=n),(s=e.addChild("item",e.nextNonspace)).listData=n,1)},function(e){return e.indented&&"paragraph"!==e.tip.type&&!e.blank?(e.advanceOffset(o.CODE_INDENT,!0),e.closeUnmatchedBlocks(),e.addChild("codeBlock",e.offset),2):0},a.tableHead,a.tableBody]},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(5);Object.defineProperty(t,"ToastMark",{enumerable:!0,get:function(){return n.ToastMark}});var i=r(28);Object.defineProperty(t,"createRenderHTML",{enumerable:!0,get:function(){return i.createRenderHTML}});var o=r(7);Object.defineProperty(t,"Parser",{enumerable:!0,get:function(){return o.Parser}})},function(e,t,r){"use strict";var n={};function i(e,t,r){var o,a,s,l,u,c="";for("string"!=typeof t&&(r=t,t=i.defaultChars),void 0===r&&(r=!0),u=function(e){var t,r,i=n[e];if(i)return i;for(i=n[e]=[],t=0;t<128;t++)r=String.fromCharCode(t),/^[0-9a-z]$/i.test(r)?i.push(r):i.push("%"+("0"+t.toString(16).toUpperCase()).slice(-2));for(t=0;t<e.length;t++)i[e.charCodeAt(t)]=e[t];return i}(t),o=0,a=e.length;o<a;o++)if(s=e.charCodeAt(o),r&&37===s&&o+2<a&&/^[0-9a-f]{2}$/i.test(e.slice(o+1,o+3)))c+=e.slice(o,o+3),o+=2;else if(s<128)c+=u[s];else if(s>=55296&&s<=57343){if(s>=55296&&s<=56319&&o+1<a&&(l=e.charCodeAt(o+1))>=56320&&l<=57343){c+=encodeURIComponent(e[o]+e[o+1]),o++;continue}c+="%EF%BF%BD"}else c+=encodeURIComponent(e[o]);return c}i.defaultChars=";/?:@&=+$,-_.!~*'()#",i.componentChars="-_.!~*'()",e.exports=i},function(e){e.exports=JSON.parse('{"Aacute":"Á","aacute":"á","Abreve":"Ă","abreve":"ă","ac":"∾","acd":"∿","acE":"∾̳","Acirc":"Â","acirc":"â","acute":"´","Acy":"А","acy":"а","AElig":"Æ","aelig":"æ","af":"⁡","Afr":"𝔄","afr":"𝔞","Agrave":"À","agrave":"à","alefsym":"ℵ","aleph":"ℵ","Alpha":"Α","alpha":"α","Amacr":"Ā","amacr":"ā","amalg":"⨿","amp":"&","AMP":"&","andand":"⩕","And":"⩓","and":"∧","andd":"⩜","andslope":"⩘","andv":"⩚","ang":"∠","ange":"⦤","angle":"∠","angmsdaa":"⦨","angmsdab":"⦩","angmsdac":"⦪","angmsdad":"⦫","angmsdae":"⦬","angmsdaf":"⦭","angmsdag":"⦮","angmsdah":"⦯","angmsd":"∡","angrt":"∟","angrtvb":"⊾","angrtvbd":"⦝","angsph":"∢","angst":"Å","angzarr":"⍼","Aogon":"Ą","aogon":"ą","Aopf":"𝔸","aopf":"𝕒","apacir":"⩯","ap":"≈","apE":"⩰","ape":"≊","apid":"≋","apos":"\'","ApplyFunction":"⁡","approx":"≈","approxeq":"≊","Aring":"Å","aring":"å","Ascr":"𝒜","ascr":"𝒶","Assign":"≔","ast":"*","asymp":"≈","asympeq":"≍","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","awconint":"∳","awint":"⨑","backcong":"≌","backepsilon":"϶","backprime":"‵","backsim":"∽","backsimeq":"⋍","Backslash":"∖","Barv":"⫧","barvee":"⊽","barwed":"⌅","Barwed":"⌆","barwedge":"⌅","bbrk":"⎵","bbrktbrk":"⎶","bcong":"≌","Bcy":"Б","bcy":"б","bdquo":"„","becaus":"∵","because":"∵","Because":"∵","bemptyv":"⦰","bepsi":"϶","bernou":"ℬ","Bernoullis":"ℬ","Beta":"Β","beta":"β","beth":"ℶ","between":"≬","Bfr":"𝔅","bfr":"𝔟","bigcap":"⋂","bigcirc":"◯","bigcup":"⋃","bigodot":"⨀","bigoplus":"⨁","bigotimes":"⨂","bigsqcup":"⨆","bigstar":"★","bigtriangledown":"▽","bigtriangleup":"△","biguplus":"⨄","bigvee":"⋁","bigwedge":"⋀","bkarow":"⤍","blacklozenge":"⧫","blacksquare":"▪","blacktriangle":"▴","blacktriangledown":"▾","blacktriangleleft":"◂","blacktriangleright":"▸","blank":"␣","blk12":"▒","blk14":"░","blk34":"▓","block":"█","bne":"=⃥","bnequiv":"≡⃥","bNot":"⫭","bnot":"⌐","Bopf":"𝔹","bopf":"𝕓","bot":"⊥","bottom":"⊥","bowtie":"⋈","boxbox":"⧉","boxdl":"┐","boxdL":"╕","boxDl":"╖","boxDL":"╗","boxdr":"┌","boxdR":"╒","boxDr":"╓","boxDR":"╔","boxh":"─","boxH":"═","boxhd":"┬","boxHd":"╤","boxhD":"╥","boxHD":"╦","boxhu":"┴","boxHu":"╧","boxhU":"╨","boxHU":"╩","boxminus":"⊟","boxplus":"⊞","boxtimes":"⊠","boxul":"┘","boxuL":"╛","boxUl":"╜","boxUL":"╝","boxur":"└","boxuR":"╘","boxUr":"╙","boxUR":"╚","boxv":"│","boxV":"║","boxvh":"┼","boxvH":"╪","boxVh":"╫","boxVH":"╬","boxvl":"┤","boxvL":"╡","boxVl":"╢","boxVL":"╣","boxvr":"├","boxvR":"╞","boxVr":"╟","boxVR":"╠","bprime":"‵","breve":"˘","Breve":"˘","brvbar":"¦","bscr":"𝒷","Bscr":"ℬ","bsemi":"⁏","bsim":"∽","bsime":"⋍","bsolb":"⧅","bsol":"\\\\","bsolhsub":"⟈","bull":"•","bullet":"•","bump":"≎","bumpE":"⪮","bumpe":"≏","Bumpeq":"≎","bumpeq":"≏","Cacute":"Ć","cacute":"ć","capand":"⩄","capbrcup":"⩉","capcap":"⩋","cap":"∩","Cap":"⋒","capcup":"⩇","capdot":"⩀","CapitalDifferentialD":"ⅅ","caps":"∩︀","caret":"⁁","caron":"ˇ","Cayleys":"ℭ","ccaps":"⩍","Ccaron":"Č","ccaron":"č","Ccedil":"Ç","ccedil":"ç","Ccirc":"Ĉ","ccirc":"ĉ","Cconint":"∰","ccups":"⩌","ccupssm":"⩐","Cdot":"Ċ","cdot":"ċ","cedil":"¸","Cedilla":"¸","cemptyv":"⦲","cent":"¢","centerdot":"·","CenterDot":"·","cfr":"𝔠","Cfr":"ℭ","CHcy":"Ч","chcy":"ч","check":"✓","checkmark":"✓","Chi":"Χ","chi":"χ","circ":"ˆ","circeq":"≗","circlearrowleft":"↺","circlearrowright":"↻","circledast":"⊛","circledcirc":"⊚","circleddash":"⊝","CircleDot":"⊙","circledR":"®","circledS":"Ⓢ","CircleMinus":"⊖","CirclePlus":"⊕","CircleTimes":"⊗","cir":"○","cirE":"⧃","cire":"≗","cirfnint":"⨐","cirmid":"⫯","cirscir":"⧂","ClockwiseContourIntegral":"∲","CloseCurlyDoubleQuote":"”","CloseCurlyQuote":"’","clubs":"♣","clubsuit":"♣","colon":":","Colon":"∷","Colone":"⩴","colone":"≔","coloneq":"≔","comma":",","commat":"@","comp":"∁","compfn":"∘","complement":"∁","complexes":"ℂ","cong":"≅","congdot":"⩭","Congruent":"≡","conint":"∮","Conint":"∯","ContourIntegral":"∮","copf":"𝕔","Copf":"ℂ","coprod":"∐","Coproduct":"∐","copy":"©","COPY":"©","copysr":"℗","CounterClockwiseContourIntegral":"∳","crarr":"↵","cross":"✗","Cross":"⨯","Cscr":"𝒞","cscr":"𝒸","csub":"⫏","csube":"⫑","csup":"⫐","csupe":"⫒","ctdot":"⋯","cudarrl":"⤸","cudarrr":"⤵","cuepr":"⋞","cuesc":"⋟","cularr":"↶","cularrp":"⤽","cupbrcap":"⩈","cupcap":"⩆","CupCap":"≍","cup":"∪","Cup":"⋓","cupcup":"⩊","cupdot":"⊍","cupor":"⩅","cups":"∪︀","curarr":"↷","curarrm":"⤼","curlyeqprec":"⋞","curlyeqsucc":"⋟","curlyvee":"⋎","curlywedge":"⋏","curren":"¤","curvearrowleft":"↶","curvearrowright":"↷","cuvee":"⋎","cuwed":"⋏","cwconint":"∲","cwint":"∱","cylcty":"⌭","dagger":"†","Dagger":"‡","daleth":"ℸ","darr":"↓","Darr":"↡","dArr":"⇓","dash":"‐","Dashv":"⫤","dashv":"⊣","dbkarow":"⤏","dblac":"˝","Dcaron":"Ď","dcaron":"ď","Dcy":"Д","dcy":"д","ddagger":"‡","ddarr":"⇊","DD":"ⅅ","dd":"ⅆ","DDotrahd":"⤑","ddotseq":"⩷","deg":"°","Del":"∇","Delta":"Δ","delta":"δ","demptyv":"⦱","dfisht":"⥿","Dfr":"𝔇","dfr":"𝔡","dHar":"⥥","dharl":"⇃","dharr":"⇂","DiacriticalAcute":"´","DiacriticalDot":"˙","DiacriticalDoubleAcute":"˝","DiacriticalGrave":"`","DiacriticalTilde":"˜","diam":"⋄","diamond":"⋄","Diamond":"⋄","diamondsuit":"♦","diams":"♦","die":"¨","DifferentialD":"ⅆ","digamma":"ϝ","disin":"⋲","div":"÷","divide":"÷","divideontimes":"⋇","divonx":"⋇","DJcy":"Ђ","djcy":"ђ","dlcorn":"⌞","dlcrop":"⌍","dollar":"$","Dopf":"𝔻","dopf":"𝕕","Dot":"¨","dot":"˙","DotDot":"⃜","doteq":"≐","doteqdot":"≑","DotEqual":"≐","dotminus":"∸","dotplus":"∔","dotsquare":"⊡","doublebarwedge":"⌆","DoubleContourIntegral":"∯","DoubleDot":"¨","DoubleDownArrow":"⇓","DoubleLeftArrow":"⇐","DoubleLeftRightArrow":"⇔","DoubleLeftTee":"⫤","DoubleLongLeftArrow":"⟸","DoubleLongLeftRightArrow":"⟺","DoubleLongRightArrow":"⟹","DoubleRightArrow":"⇒","DoubleRightTee":"⊨","DoubleUpArrow":"⇑","DoubleUpDownArrow":"⇕","DoubleVerticalBar":"∥","DownArrowBar":"⤓","downarrow":"↓","DownArrow":"↓","Downarrow":"⇓","DownArrowUpArrow":"⇵","DownBreve":"̑","downdownarrows":"⇊","downharpoonleft":"⇃","downharpoonright":"⇂","DownLeftRightVector":"⥐","DownLeftTeeVector":"⥞","DownLeftVectorBar":"⥖","DownLeftVector":"↽","DownRightTeeVector":"⥟","DownRightVectorBar":"⥗","DownRightVector":"⇁","DownTeeArrow":"↧","DownTee":"⊤","drbkarow":"⤐","drcorn":"⌟","drcrop":"⌌","Dscr":"𝒟","dscr":"𝒹","DScy":"Ѕ","dscy":"ѕ","dsol":"⧶","Dstrok":"Đ","dstrok":"đ","dtdot":"⋱","dtri":"▿","dtrif":"▾","duarr":"⇵","duhar":"⥯","dwangle":"⦦","DZcy":"Џ","dzcy":"џ","dzigrarr":"⟿","Eacute":"É","eacute":"é","easter":"⩮","Ecaron":"Ě","ecaron":"ě","Ecirc":"Ê","ecirc":"ê","ecir":"≖","ecolon":"≕","Ecy":"Э","ecy":"э","eDDot":"⩷","Edot":"Ė","edot":"ė","eDot":"≑","ee":"ⅇ","efDot":"≒","Efr":"𝔈","efr":"𝔢","eg":"⪚","Egrave":"È","egrave":"è","egs":"⪖","egsdot":"⪘","el":"⪙","Element":"∈","elinters":"⏧","ell":"ℓ","els":"⪕","elsdot":"⪗","Emacr":"Ē","emacr":"ē","empty":"∅","emptyset":"∅","EmptySmallSquare":"◻","emptyv":"∅","EmptyVerySmallSquare":"▫","emsp13":" ","emsp14":" ","emsp":" ","ENG":"Ŋ","eng":"ŋ","ensp":" ","Eogon":"Ę","eogon":"ę","Eopf":"𝔼","eopf":"𝕖","epar":"⋕","eparsl":"⧣","eplus":"⩱","epsi":"ε","Epsilon":"Ε","epsilon":"ε","epsiv":"ϵ","eqcirc":"≖","eqcolon":"≕","eqsim":"≂","eqslantgtr":"⪖","eqslantless":"⪕","Equal":"⩵","equals":"=","EqualTilde":"≂","equest":"≟","Equilibrium":"⇌","equiv":"≡","equivDD":"⩸","eqvparsl":"⧥","erarr":"⥱","erDot":"≓","escr":"ℯ","Escr":"ℰ","esdot":"≐","Esim":"⩳","esim":"≂","Eta":"Η","eta":"η","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","euro":"€","excl":"!","exist":"∃","Exists":"∃","expectation":"ℰ","exponentiale":"ⅇ","ExponentialE":"ⅇ","fallingdotseq":"≒","Fcy":"Ф","fcy":"ф","female":"♀","ffilig":"ﬃ","fflig":"ﬀ","ffllig":"ﬄ","Ffr":"𝔉","ffr":"𝔣","filig":"ﬁ","FilledSmallSquare":"◼","FilledVerySmallSquare":"▪","fjlig":"fj","flat":"♭","fllig":"ﬂ","fltns":"▱","fnof":"ƒ","Fopf":"𝔽","fopf":"𝕗","forall":"∀","ForAll":"∀","fork":"⋔","forkv":"⫙","Fouriertrf":"ℱ","fpartint":"⨍","frac12":"½","frac13":"⅓","frac14":"¼","frac15":"⅕","frac16":"⅙","frac18":"⅛","frac23":"⅔","frac25":"⅖","frac34":"¾","frac35":"⅗","frac38":"⅜","frac45":"⅘","frac56":"⅚","frac58":"⅝","frac78":"⅞","frasl":"⁄","frown":"⌢","fscr":"𝒻","Fscr":"ℱ","gacute":"ǵ","Gamma":"Γ","gamma":"γ","Gammad":"Ϝ","gammad":"ϝ","gap":"⪆","Gbreve":"Ğ","gbreve":"ğ","Gcedil":"Ģ","Gcirc":"Ĝ","gcirc":"ĝ","Gcy":"Г","gcy":"г","Gdot":"Ġ","gdot":"ġ","ge":"≥","gE":"≧","gEl":"⪌","gel":"⋛","geq":"≥","geqq":"≧","geqslant":"⩾","gescc":"⪩","ges":"⩾","gesdot":"⪀","gesdoto":"⪂","gesdotol":"⪄","gesl":"⋛︀","gesles":"⪔","Gfr":"𝔊","gfr":"𝔤","gg":"≫","Gg":"⋙","ggg":"⋙","gimel":"ℷ","GJcy":"Ѓ","gjcy":"ѓ","gla":"⪥","gl":"≷","glE":"⪒","glj":"⪤","gnap":"⪊","gnapprox":"⪊","gne":"⪈","gnE":"≩","gneq":"⪈","gneqq":"≩","gnsim":"⋧","Gopf":"𝔾","gopf":"𝕘","grave":"`","GreaterEqual":"≥","GreaterEqualLess":"⋛","GreaterFullEqual":"≧","GreaterGreater":"⪢","GreaterLess":"≷","GreaterSlantEqual":"⩾","GreaterTilde":"≳","Gscr":"𝒢","gscr":"ℊ","gsim":"≳","gsime":"⪎","gsiml":"⪐","gtcc":"⪧","gtcir":"⩺","gt":">","GT":">","Gt":"≫","gtdot":"⋗","gtlPar":"⦕","gtquest":"⩼","gtrapprox":"⪆","gtrarr":"⥸","gtrdot":"⋗","gtreqless":"⋛","gtreqqless":"⪌","gtrless":"≷","gtrsim":"≳","gvertneqq":"≩︀","gvnE":"≩︀","Hacek":"ˇ","hairsp":" ","half":"½","hamilt":"ℋ","HARDcy":"Ъ","hardcy":"ъ","harrcir":"⥈","harr":"↔","hArr":"⇔","harrw":"↭","Hat":"^","hbar":"ℏ","Hcirc":"Ĥ","hcirc":"ĥ","hearts":"♥","heartsuit":"♥","hellip":"…","hercon":"⊹","hfr":"𝔥","Hfr":"ℌ","HilbertSpace":"ℋ","hksearow":"⤥","hkswarow":"⤦","hoarr":"⇿","homtht":"∻","hookleftarrow":"↩","hookrightarrow":"↪","hopf":"𝕙","Hopf":"ℍ","horbar":"―","HorizontalLine":"─","hscr":"𝒽","Hscr":"ℋ","hslash":"ℏ","Hstrok":"Ħ","hstrok":"ħ","HumpDownHump":"≎","HumpEqual":"≏","hybull":"⁃","hyphen":"‐","Iacute":"Í","iacute":"í","ic":"⁣","Icirc":"Î","icirc":"î","Icy":"И","icy":"и","Idot":"İ","IEcy":"Е","iecy":"е","iexcl":"¡","iff":"⇔","ifr":"𝔦","Ifr":"ℑ","Igrave":"Ì","igrave":"ì","ii":"ⅈ","iiiint":"⨌","iiint":"∭","iinfin":"⧜","iiota":"℩","IJlig":"Ĳ","ijlig":"ĳ","Imacr":"Ī","imacr":"ī","image":"ℑ","ImaginaryI":"ⅈ","imagline":"ℐ","imagpart":"ℑ","imath":"ı","Im":"ℑ","imof":"⊷","imped":"Ƶ","Implies":"⇒","incare":"℅","in":"∈","infin":"∞","infintie":"⧝","inodot":"ı","intcal":"⊺","int":"∫","Int":"∬","integers":"ℤ","Integral":"∫","intercal":"⊺","Intersection":"⋂","intlarhk":"⨗","intprod":"⨼","InvisibleComma":"⁣","InvisibleTimes":"⁢","IOcy":"Ё","iocy":"ё","Iogon":"Į","iogon":"į","Iopf":"𝕀","iopf":"𝕚","Iota":"Ι","iota":"ι","iprod":"⨼","iquest":"¿","iscr":"𝒾","Iscr":"ℐ","isin":"∈","isindot":"⋵","isinE":"⋹","isins":"⋴","isinsv":"⋳","isinv":"∈","it":"⁢","Itilde":"Ĩ","itilde":"ĩ","Iukcy":"І","iukcy":"і","Iuml":"Ï","iuml":"ï","Jcirc":"Ĵ","jcirc":"ĵ","Jcy":"Й","jcy":"й","Jfr":"𝔍","jfr":"𝔧","jmath":"ȷ","Jopf":"𝕁","jopf":"𝕛","Jscr":"𝒥","jscr":"𝒿","Jsercy":"Ј","jsercy":"ј","Jukcy":"Є","jukcy":"є","Kappa":"Κ","kappa":"κ","kappav":"ϰ","Kcedil":"Ķ","kcedil":"ķ","Kcy":"К","kcy":"к","Kfr":"𝔎","kfr":"𝔨","kgreen":"ĸ","KHcy":"Х","khcy":"х","KJcy":"Ќ","kjcy":"ќ","Kopf":"𝕂","kopf":"𝕜","Kscr":"𝒦","kscr":"𝓀","lAarr":"⇚","Lacute":"Ĺ","lacute":"ĺ","laemptyv":"⦴","lagran":"ℒ","Lambda":"Λ","lambda":"λ","lang":"⟨","Lang":"⟪","langd":"⦑","langle":"⟨","lap":"⪅","Laplacetrf":"ℒ","laquo":"«","larrb":"⇤","larrbfs":"⤟","larr":"←","Larr":"↞","lArr":"⇐","larrfs":"⤝","larrhk":"↩","larrlp":"↫","larrpl":"⤹","larrsim":"⥳","larrtl":"↢","latail":"⤙","lAtail":"⤛","lat":"⪫","late":"⪭","lates":"⪭︀","lbarr":"⤌","lBarr":"⤎","lbbrk":"❲","lbrace":"{","lbrack":"[","lbrke":"⦋","lbrksld":"⦏","lbrkslu":"⦍","Lcaron":"Ľ","lcaron":"ľ","Lcedil":"Ļ","lcedil":"ļ","lceil":"⌈","lcub":"{","Lcy":"Л","lcy":"л","ldca":"⤶","ldquo":"“","ldquor":"„","ldrdhar":"⥧","ldrushar":"⥋","ldsh":"↲","le":"≤","lE":"≦","LeftAngleBracket":"⟨","LeftArrowBar":"⇤","leftarrow":"←","LeftArrow":"←","Leftarrow":"⇐","LeftArrowRightArrow":"⇆","leftarrowtail":"↢","LeftCeiling":"⌈","LeftDoubleBracket":"⟦","LeftDownTeeVector":"⥡","LeftDownVectorBar":"⥙","LeftDownVector":"⇃","LeftFloor":"⌊","leftharpoondown":"↽","leftharpoonup":"↼","leftleftarrows":"⇇","leftrightarrow":"↔","LeftRightArrow":"↔","Leftrightarrow":"⇔","leftrightarrows":"⇆","leftrightharpoons":"⇋","leftrightsquigarrow":"↭","LeftRightVector":"⥎","LeftTeeArrow":"↤","LeftTee":"⊣","LeftTeeVector":"⥚","leftthreetimes":"⋋","LeftTriangleBar":"⧏","LeftTriangle":"⊲","LeftTriangleEqual":"⊴","LeftUpDownVector":"⥑","LeftUpTeeVector":"⥠","LeftUpVectorBar":"⥘","LeftUpVector":"↿","LeftVectorBar":"⥒","LeftVector":"↼","lEg":"⪋","leg":"⋚","leq":"≤","leqq":"≦","leqslant":"⩽","lescc":"⪨","les":"⩽","lesdot":"⩿","lesdoto":"⪁","lesdotor":"⪃","lesg":"⋚︀","lesges":"⪓","lessapprox":"⪅","lessdot":"⋖","lesseqgtr":"⋚","lesseqqgtr":"⪋","LessEqualGreater":"⋚","LessFullEqual":"≦","LessGreater":"≶","lessgtr":"≶","LessLess":"⪡","lesssim":"≲","LessSlantEqual":"⩽","LessTilde":"≲","lfisht":"⥼","lfloor":"⌊","Lfr":"𝔏","lfr":"𝔩","lg":"≶","lgE":"⪑","lHar":"⥢","lhard":"↽","lharu":"↼","lharul":"⥪","lhblk":"▄","LJcy":"Љ","ljcy":"љ","llarr":"⇇","ll":"≪","Ll":"⋘","llcorner":"⌞","Lleftarrow":"⇚","llhard":"⥫","lltri":"◺","Lmidot":"Ŀ","lmidot":"ŀ","lmoustache":"⎰","lmoust":"⎰","lnap":"⪉","lnapprox":"⪉","lne":"⪇","lnE":"≨","lneq":"⪇","lneqq":"≨","lnsim":"⋦","loang":"⟬","loarr":"⇽","lobrk":"⟦","longleftarrow":"⟵","LongLeftArrow":"⟵","Longleftarrow":"⟸","longleftrightarrow":"⟷","LongLeftRightArrow":"⟷","Longleftrightarrow":"⟺","longmapsto":"⟼","longrightarrow":"⟶","LongRightArrow":"⟶","Longrightarrow":"⟹","looparrowleft":"↫","looparrowright":"↬","lopar":"⦅","Lopf":"𝕃","lopf":"𝕝","loplus":"⨭","lotimes":"⨴","lowast":"∗","lowbar":"_","LowerLeftArrow":"↙","LowerRightArrow":"↘","loz":"◊","lozenge":"◊","lozf":"⧫","lpar":"(","lparlt":"⦓","lrarr":"⇆","lrcorner":"⌟","lrhar":"⇋","lrhard":"⥭","lrm":"‎","lrtri":"⊿","lsaquo":"‹","lscr":"𝓁","Lscr":"ℒ","lsh":"↰","Lsh":"↰","lsim":"≲","lsime":"⪍","lsimg":"⪏","lsqb":"[","lsquo":"‘","lsquor":"‚","Lstrok":"Ł","lstrok":"ł","ltcc":"⪦","ltcir":"⩹","lt":"<","LT":"<","Lt":"≪","ltdot":"⋖","lthree":"⋋","ltimes":"⋉","ltlarr":"⥶","ltquest":"⩻","ltri":"◃","ltrie":"⊴","ltrif":"◂","ltrPar":"⦖","lurdshar":"⥊","luruhar":"⥦","lvertneqq":"≨︀","lvnE":"≨︀","macr":"¯","male":"♂","malt":"✠","maltese":"✠","Map":"⤅","map":"↦","mapsto":"↦","mapstodown":"↧","mapstoleft":"↤","mapstoup":"↥","marker":"▮","mcomma":"⨩","Mcy":"М","mcy":"м","mdash":"—","mDDot":"∺","measuredangle":"∡","MediumSpace":" ","Mellintrf":"ℳ","Mfr":"𝔐","mfr":"𝔪","mho":"℧","micro":"µ","midast":"*","midcir":"⫰","mid":"∣","middot":"·","minusb":"⊟","minus":"−","minusd":"∸","minusdu":"⨪","MinusPlus":"∓","mlcp":"⫛","mldr":"…","mnplus":"∓","models":"⊧","Mopf":"𝕄","mopf":"𝕞","mp":"∓","mscr":"𝓂","Mscr":"ℳ","mstpos":"∾","Mu":"Μ","mu":"μ","multimap":"⊸","mumap":"⊸","nabla":"∇","Nacute":"Ń","nacute":"ń","nang":"∠⃒","nap":"≉","napE":"⩰̸","napid":"≋̸","napos":"ŉ","napprox":"≉","natural":"♮","naturals":"ℕ","natur":"♮","nbsp":" ","nbump":"≎̸","nbumpe":"≏̸","ncap":"⩃","Ncaron":"Ň","ncaron":"ň","Ncedil":"Ņ","ncedil":"ņ","ncong":"≇","ncongdot":"⩭̸","ncup":"⩂","Ncy":"Н","ncy":"н","ndash":"–","nearhk":"⤤","nearr":"↗","neArr":"⇗","nearrow":"↗","ne":"≠","nedot":"≐̸","NegativeMediumSpace":"​","NegativeThickSpace":"​","NegativeThinSpace":"​","NegativeVeryThinSpace":"​","nequiv":"≢","nesear":"⤨","nesim":"≂̸","NestedGreaterGreater":"≫","NestedLessLess":"≪","NewLine":"\\n","nexist":"∄","nexists":"∄","Nfr":"𝔑","nfr":"𝔫","ngE":"≧̸","nge":"≱","ngeq":"≱","ngeqq":"≧̸","ngeqslant":"⩾̸","nges":"⩾̸","nGg":"⋙̸","ngsim":"≵","nGt":"≫⃒","ngt":"≯","ngtr":"≯","nGtv":"≫̸","nharr":"↮","nhArr":"⇎","nhpar":"⫲","ni":"∋","nis":"⋼","nisd":"⋺","niv":"∋","NJcy":"Њ","njcy":"њ","nlarr":"↚","nlArr":"⇍","nldr":"‥","nlE":"≦̸","nle":"≰","nleftarrow":"↚","nLeftarrow":"⇍","nleftrightarrow":"↮","nLeftrightarrow":"⇎","nleq":"≰","nleqq":"≦̸","nleqslant":"⩽̸","nles":"⩽̸","nless":"≮","nLl":"⋘̸","nlsim":"≴","nLt":"≪⃒","nlt":"≮","nltri":"⋪","nltrie":"⋬","nLtv":"≪̸","nmid":"∤","NoBreak":"⁠","NonBreakingSpace":" ","nopf":"𝕟","Nopf":"ℕ","Not":"⫬","not":"¬","NotCongruent":"≢","NotCupCap":"≭","NotDoubleVerticalBar":"∦","NotElement":"∉","NotEqual":"≠","NotEqualTilde":"≂̸","NotExists":"∄","NotGreater":"≯","NotGreaterEqual":"≱","NotGreaterFullEqual":"≧̸","NotGreaterGreater":"≫̸","NotGreaterLess":"≹","NotGreaterSlantEqual":"⩾̸","NotGreaterTilde":"≵","NotHumpDownHump":"≎̸","NotHumpEqual":"≏̸","notin":"∉","notindot":"⋵̸","notinE":"⋹̸","notinva":"∉","notinvb":"⋷","notinvc":"⋶","NotLeftTriangleBar":"⧏̸","NotLeftTriangle":"⋪","NotLeftTriangleEqual":"⋬","NotLess":"≮","NotLessEqual":"≰","NotLessGreater":"≸","NotLessLess":"≪̸","NotLessSlantEqual":"⩽̸","NotLessTilde":"≴","NotNestedGreaterGreater":"⪢̸","NotNestedLessLess":"⪡̸","notni":"∌","notniva":"∌","notnivb":"⋾","notnivc":"⋽","NotPrecedes":"⊀","NotPrecedesEqual":"⪯̸","NotPrecedesSlantEqual":"⋠","NotReverseElement":"∌","NotRightTriangleBar":"⧐̸","NotRightTriangle":"⋫","NotRightTriangleEqual":"⋭","NotSquareSubset":"⊏̸","NotSquareSubsetEqual":"⋢","NotSquareSuperset":"⊐̸","NotSquareSupersetEqual":"⋣","NotSubset":"⊂⃒","NotSubsetEqual":"⊈","NotSucceeds":"⊁","NotSucceedsEqual":"⪰̸","NotSucceedsSlantEqual":"⋡","NotSucceedsTilde":"≿̸","NotSuperset":"⊃⃒","NotSupersetEqual":"⊉","NotTilde":"≁","NotTildeEqual":"≄","NotTildeFullEqual":"≇","NotTildeTilde":"≉","NotVerticalBar":"∤","nparallel":"∦","npar":"∦","nparsl":"⫽⃥","npart":"∂̸","npolint":"⨔","npr":"⊀","nprcue":"⋠","nprec":"⊀","npreceq":"⪯̸","npre":"⪯̸","nrarrc":"⤳̸","nrarr":"↛","nrArr":"⇏","nrarrw":"↝̸","nrightarrow":"↛","nRightarrow":"⇏","nrtri":"⋫","nrtrie":"⋭","nsc":"⊁","nsccue":"⋡","nsce":"⪰̸","Nscr":"𝒩","nscr":"𝓃","nshortmid":"∤","nshortparallel":"∦","nsim":"≁","nsime":"≄","nsimeq":"≄","nsmid":"∤","nspar":"∦","nsqsube":"⋢","nsqsupe":"⋣","nsub":"⊄","nsubE":"⫅̸","nsube":"⊈","nsubset":"⊂⃒","nsubseteq":"⊈","nsubseteqq":"⫅̸","nsucc":"⊁","nsucceq":"⪰̸","nsup":"⊅","nsupE":"⫆̸","nsupe":"⊉","nsupset":"⊃⃒","nsupseteq":"⊉","nsupseteqq":"⫆̸","ntgl":"≹","Ntilde":"Ñ","ntilde":"ñ","ntlg":"≸","ntriangleleft":"⋪","ntrianglelefteq":"⋬","ntriangleright":"⋫","ntrianglerighteq":"⋭","Nu":"Ν","nu":"ν","num":"#","numero":"№","numsp":" ","nvap":"≍⃒","nvdash":"⊬","nvDash":"⊭","nVdash":"⊮","nVDash":"⊯","nvge":"≥⃒","nvgt":">⃒","nvHarr":"⤄","nvinfin":"⧞","nvlArr":"⤂","nvle":"≤⃒","nvlt":"<⃒","nvltrie":"⊴⃒","nvrArr":"⤃","nvrtrie":"⊵⃒","nvsim":"∼⃒","nwarhk":"⤣","nwarr":"↖","nwArr":"⇖","nwarrow":"↖","nwnear":"⤧","Oacute":"Ó","oacute":"ó","oast":"⊛","Ocirc":"Ô","ocirc":"ô","ocir":"⊚","Ocy":"О","ocy":"о","odash":"⊝","Odblac":"Ő","odblac":"ő","odiv":"⨸","odot":"⊙","odsold":"⦼","OElig":"Œ","oelig":"œ","ofcir":"⦿","Ofr":"𝔒","ofr":"𝔬","ogon":"˛","Ograve":"Ò","ograve":"ò","ogt":"⧁","ohbar":"⦵","ohm":"Ω","oint":"∮","olarr":"↺","olcir":"⦾","olcross":"⦻","oline":"‾","olt":"⧀","Omacr":"Ō","omacr":"ō","Omega":"Ω","omega":"ω","Omicron":"Ο","omicron":"ο","omid":"⦶","ominus":"⊖","Oopf":"𝕆","oopf":"𝕠","opar":"⦷","OpenCurlyDoubleQuote":"“","OpenCurlyQuote":"‘","operp":"⦹","oplus":"⊕","orarr":"↻","Or":"⩔","or":"∨","ord":"⩝","order":"ℴ","orderof":"ℴ","ordf":"ª","ordm":"º","origof":"⊶","oror":"⩖","orslope":"⩗","orv":"⩛","oS":"Ⓢ","Oscr":"𝒪","oscr":"ℴ","Oslash":"Ø","oslash":"ø","osol":"⊘","Otilde":"Õ","otilde":"õ","otimesas":"⨶","Otimes":"⨷","otimes":"⊗","Ouml":"Ö","ouml":"ö","ovbar":"⌽","OverBar":"‾","OverBrace":"⏞","OverBracket":"⎴","OverParenthesis":"⏜","para":"¶","parallel":"∥","par":"∥","parsim":"⫳","parsl":"⫽","part":"∂","PartialD":"∂","Pcy":"П","pcy":"п","percnt":"%","period":".","permil":"‰","perp":"⊥","pertenk":"‱","Pfr":"𝔓","pfr":"𝔭","Phi":"Φ","phi":"φ","phiv":"ϕ","phmmat":"ℳ","phone":"☎","Pi":"Π","pi":"π","pitchfork":"⋔","piv":"ϖ","planck":"ℏ","planckh":"ℎ","plankv":"ℏ","plusacir":"⨣","plusb":"⊞","pluscir":"⨢","plus":"+","plusdo":"∔","plusdu":"⨥","pluse":"⩲","PlusMinus":"±","plusmn":"±","plussim":"⨦","plustwo":"⨧","pm":"±","Poincareplane":"ℌ","pointint":"⨕","popf":"𝕡","Popf":"ℙ","pound":"£","prap":"⪷","Pr":"⪻","pr":"≺","prcue":"≼","precapprox":"⪷","prec":"≺","preccurlyeq":"≼","Precedes":"≺","PrecedesEqual":"⪯","PrecedesSlantEqual":"≼","PrecedesTilde":"≾","preceq":"⪯","precnapprox":"⪹","precneqq":"⪵","precnsim":"⋨","pre":"⪯","prE":"⪳","precsim":"≾","prime":"′","Prime":"″","primes":"ℙ","prnap":"⪹","prnE":"⪵","prnsim":"⋨","prod":"∏","Product":"∏","profalar":"⌮","profline":"⌒","profsurf":"⌓","prop":"∝","Proportional":"∝","Proportion":"∷","propto":"∝","prsim":"≾","prurel":"⊰","Pscr":"𝒫","pscr":"𝓅","Psi":"Ψ","psi":"ψ","puncsp":" ","Qfr":"𝔔","qfr":"𝔮","qint":"⨌","qopf":"𝕢","Qopf":"ℚ","qprime":"⁗","Qscr":"𝒬","qscr":"𝓆","quaternions":"ℍ","quatint":"⨖","quest":"?","questeq":"≟","quot":"\\"","QUOT":"\\"","rAarr":"⇛","race":"∽̱","Racute":"Ŕ","racute":"ŕ","radic":"√","raemptyv":"⦳","rang":"⟩","Rang":"⟫","rangd":"⦒","range":"⦥","rangle":"⟩","raquo":"»","rarrap":"⥵","rarrb":"⇥","rarrbfs":"⤠","rarrc":"⤳","rarr":"→","Rarr":"↠","rArr":"⇒","rarrfs":"⤞","rarrhk":"↪","rarrlp":"↬","rarrpl":"⥅","rarrsim":"⥴","Rarrtl":"⤖","rarrtl":"↣","rarrw":"↝","ratail":"⤚","rAtail":"⤜","ratio":"∶","rationals":"ℚ","rbarr":"⤍","rBarr":"⤏","RBarr":"⤐","rbbrk":"❳","rbrace":"}","rbrack":"]","rbrke":"⦌","rbrksld":"⦎","rbrkslu":"⦐","Rcaron":"Ř","rcaron":"ř","Rcedil":"Ŗ","rcedil":"ŗ","rceil":"⌉","rcub":"}","Rcy":"Р","rcy":"р","rdca":"⤷","rdldhar":"⥩","rdquo":"”","rdquor":"”","rdsh":"↳","real":"ℜ","realine":"ℛ","realpart":"ℜ","reals":"ℝ","Re":"ℜ","rect":"▭","reg":"®","REG":"®","ReverseElement":"∋","ReverseEquilibrium":"⇋","ReverseUpEquilibrium":"⥯","rfisht":"⥽","rfloor":"⌋","rfr":"𝔯","Rfr":"ℜ","rHar":"⥤","rhard":"⇁","rharu":"⇀","rharul":"⥬","Rho":"Ρ","rho":"ρ","rhov":"ϱ","RightAngleBracket":"⟩","RightArrowBar":"⇥","rightarrow":"→","RightArrow":"→","Rightarrow":"⇒","RightArrowLeftArrow":"⇄","rightarrowtail":"↣","RightCeiling":"⌉","RightDoubleBracket":"⟧","RightDownTeeVector":"⥝","RightDownVectorBar":"⥕","RightDownVector":"⇂","RightFloor":"⌋","rightharpoondown":"⇁","rightharpoonup":"⇀","rightleftarrows":"⇄","rightleftharpoons":"⇌","rightrightarrows":"⇉","rightsquigarrow":"↝","RightTeeArrow":"↦","RightTee":"⊢","RightTeeVector":"⥛","rightthreetimes":"⋌","RightTriangleBar":"⧐","RightTriangle":"⊳","RightTriangleEqual":"⊵","RightUpDownVector":"⥏","RightUpTeeVector":"⥜","RightUpVectorBar":"⥔","RightUpVector":"↾","RightVectorBar":"⥓","RightVector":"⇀","ring":"˚","risingdotseq":"≓","rlarr":"⇄","rlhar":"⇌","rlm":"‏","rmoustache":"⎱","rmoust":"⎱","rnmid":"⫮","roang":"⟭","roarr":"⇾","robrk":"⟧","ropar":"⦆","ropf":"𝕣","Ropf":"ℝ","roplus":"⨮","rotimes":"⨵","RoundImplies":"⥰","rpar":")","rpargt":"⦔","rppolint":"⨒","rrarr":"⇉","Rrightarrow":"⇛","rsaquo":"›","rscr":"𝓇","Rscr":"ℛ","rsh":"↱","Rsh":"↱","rsqb":"]","rsquo":"’","rsquor":"’","rthree":"⋌","rtimes":"⋊","rtri":"▹","rtrie":"⊵","rtrif":"▸","rtriltri":"⧎","RuleDelayed":"⧴","ruluhar":"⥨","rx":"℞","Sacute":"Ś","sacute":"ś","sbquo":"‚","scap":"⪸","Scaron":"Š","scaron":"š","Sc":"⪼","sc":"≻","sccue":"≽","sce":"⪰","scE":"⪴","Scedil":"Ş","scedil":"ş","Scirc":"Ŝ","scirc":"ŝ","scnap":"⪺","scnE":"⪶","scnsim":"⋩","scpolint":"⨓","scsim":"≿","Scy":"С","scy":"с","sdotb":"⊡","sdot":"⋅","sdote":"⩦","searhk":"⤥","searr":"↘","seArr":"⇘","searrow":"↘","sect":"§","semi":";","seswar":"⤩","setminus":"∖","setmn":"∖","sext":"✶","Sfr":"𝔖","sfr":"𝔰","sfrown":"⌢","sharp":"♯","SHCHcy":"Щ","shchcy":"щ","SHcy":"Ш","shcy":"ш","ShortDownArrow":"↓","ShortLeftArrow":"←","shortmid":"∣","shortparallel":"∥","ShortRightArrow":"→","ShortUpArrow":"↑","shy":"­","Sigma":"Σ","sigma":"σ","sigmaf":"ς","sigmav":"ς","sim":"∼","simdot":"⩪","sime":"≃","simeq":"≃","simg":"⪞","simgE":"⪠","siml":"⪝","simlE":"⪟","simne":"≆","simplus":"⨤","simrarr":"⥲","slarr":"←","SmallCircle":"∘","smallsetminus":"∖","smashp":"⨳","smeparsl":"⧤","smid":"∣","smile":"⌣","smt":"⪪","smte":"⪬","smtes":"⪬︀","SOFTcy":"Ь","softcy":"ь","solbar":"⌿","solb":"⧄","sol":"/","Sopf":"𝕊","sopf":"𝕤","spades":"♠","spadesuit":"♠","spar":"∥","sqcap":"⊓","sqcaps":"⊓︀","sqcup":"⊔","sqcups":"⊔︀","Sqrt":"√","sqsub":"⊏","sqsube":"⊑","sqsubset":"⊏","sqsubseteq":"⊑","sqsup":"⊐","sqsupe":"⊒","sqsupset":"⊐","sqsupseteq":"⊒","square":"□","Square":"□","SquareIntersection":"⊓","SquareSubset":"⊏","SquareSubsetEqual":"⊑","SquareSuperset":"⊐","SquareSupersetEqual":"⊒","SquareUnion":"⊔","squarf":"▪","squ":"□","squf":"▪","srarr":"→","Sscr":"𝒮","sscr":"𝓈","ssetmn":"∖","ssmile":"⌣","sstarf":"⋆","Star":"⋆","star":"☆","starf":"★","straightepsilon":"ϵ","straightphi":"ϕ","strns":"¯","sub":"⊂","Sub":"⋐","subdot":"⪽","subE":"⫅","sube":"⊆","subedot":"⫃","submult":"⫁","subnE":"⫋","subne":"⊊","subplus":"⪿","subrarr":"⥹","subset":"⊂","Subset":"⋐","subseteq":"⊆","subseteqq":"⫅","SubsetEqual":"⊆","subsetneq":"⊊","subsetneqq":"⫋","subsim":"⫇","subsub":"⫕","subsup":"⫓","succapprox":"⪸","succ":"≻","succcurlyeq":"≽","Succeeds":"≻","SucceedsEqual":"⪰","SucceedsSlantEqual":"≽","SucceedsTilde":"≿","succeq":"⪰","succnapprox":"⪺","succneqq":"⪶","succnsim":"⋩","succsim":"≿","SuchThat":"∋","sum":"∑","Sum":"∑","sung":"♪","sup1":"¹","sup2":"²","sup3":"³","sup":"⊃","Sup":"⋑","supdot":"⪾","supdsub":"⫘","supE":"⫆","supe":"⊇","supedot":"⫄","Superset":"⊃","SupersetEqual":"⊇","suphsol":"⟉","suphsub":"⫗","suplarr":"⥻","supmult":"⫂","supnE":"⫌","supne":"⊋","supplus":"⫀","supset":"⊃","Supset":"⋑","supseteq":"⊇","supseteqq":"⫆","supsetneq":"⊋","supsetneqq":"⫌","supsim":"⫈","supsub":"⫔","supsup":"⫖","swarhk":"⤦","swarr":"↙","swArr":"⇙","swarrow":"↙","swnwar":"⤪","szlig":"ß","Tab":"\\t","target":"⌖","Tau":"Τ","tau":"τ","tbrk":"⎴","Tcaron":"Ť","tcaron":"ť","Tcedil":"Ţ","tcedil":"ţ","Tcy":"Т","tcy":"т","tdot":"⃛","telrec":"⌕","Tfr":"𝔗","tfr":"𝔱","there4":"∴","therefore":"∴","Therefore":"∴","Theta":"Θ","theta":"θ","thetasym":"ϑ","thetav":"ϑ","thickapprox":"≈","thicksim":"∼","ThickSpace":"  ","ThinSpace":" ","thinsp":" ","thkap":"≈","thksim":"∼","THORN":"Þ","thorn":"þ","tilde":"˜","Tilde":"∼","TildeEqual":"≃","TildeFullEqual":"≅","TildeTilde":"≈","timesbar":"⨱","timesb":"⊠","times":"×","timesd":"⨰","tint":"∭","toea":"⤨","topbot":"⌶","topcir":"⫱","top":"⊤","Topf":"𝕋","topf":"𝕥","topfork":"⫚","tosa":"⤩","tprime":"‴","trade":"™","TRADE":"™","triangle":"▵","triangledown":"▿","triangleleft":"◃","trianglelefteq":"⊴","triangleq":"≜","triangleright":"▹","trianglerighteq":"⊵","tridot":"◬","trie":"≜","triminus":"⨺","TripleDot":"⃛","triplus":"⨹","trisb":"⧍","tritime":"⨻","trpezium":"⏢","Tscr":"𝒯","tscr":"𝓉","TScy":"Ц","tscy":"ц","TSHcy":"Ћ","tshcy":"ћ","Tstrok":"Ŧ","tstrok":"ŧ","twixt":"≬","twoheadleftarrow":"↞","twoheadrightarrow":"↠","Uacute":"Ú","uacute":"ú","uarr":"↑","Uarr":"↟","uArr":"⇑","Uarrocir":"⥉","Ubrcy":"Ў","ubrcy":"ў","Ubreve":"Ŭ","ubreve":"ŭ","Ucirc":"Û","ucirc":"û","Ucy":"У","ucy":"у","udarr":"⇅","Udblac":"Ű","udblac":"ű","udhar":"⥮","ufisht":"⥾","Ufr":"𝔘","ufr":"𝔲","Ugrave":"Ù","ugrave":"ù","uHar":"⥣","uharl":"↿","uharr":"↾","uhblk":"▀","ulcorn":"⌜","ulcorner":"⌜","ulcrop":"⌏","ultri":"◸","Umacr":"Ū","umacr":"ū","uml":"¨","UnderBar":"_","UnderBrace":"⏟","UnderBracket":"⎵","UnderParenthesis":"⏝","Union":"⋃","UnionPlus":"⊎","Uogon":"Ų","uogon":"ų","Uopf":"𝕌","uopf":"𝕦","UpArrowBar":"⤒","uparrow":"↑","UpArrow":"↑","Uparrow":"⇑","UpArrowDownArrow":"⇅","updownarrow":"↕","UpDownArrow":"↕","Updownarrow":"⇕","UpEquilibrium":"⥮","upharpoonleft":"↿","upharpoonright":"↾","uplus":"⊎","UpperLeftArrow":"↖","UpperRightArrow":"↗","upsi":"υ","Upsi":"ϒ","upsih":"ϒ","Upsilon":"Υ","upsilon":"υ","UpTeeArrow":"↥","UpTee":"⊥","upuparrows":"⇈","urcorn":"⌝","urcorner":"⌝","urcrop":"⌎","Uring":"Ů","uring":"ů","urtri":"◹","Uscr":"𝒰","uscr":"𝓊","utdot":"⋰","Utilde":"Ũ","utilde":"ũ","utri":"▵","utrif":"▴","uuarr":"⇈","Uuml":"Ü","uuml":"ü","uwangle":"⦧","vangrt":"⦜","varepsilon":"ϵ","varkappa":"ϰ","varnothing":"∅","varphi":"ϕ","varpi":"ϖ","varpropto":"∝","varr":"↕","vArr":"⇕","varrho":"ϱ","varsigma":"ς","varsubsetneq":"⊊︀","varsubsetneqq":"⫋︀","varsupsetneq":"⊋︀","varsupsetneqq":"⫌︀","vartheta":"ϑ","vartriangleleft":"⊲","vartriangleright":"⊳","vBar":"⫨","Vbar":"⫫","vBarv":"⫩","Vcy":"В","vcy":"в","vdash":"⊢","vDash":"⊨","Vdash":"⊩","VDash":"⊫","Vdashl":"⫦","veebar":"⊻","vee":"∨","Vee":"⋁","veeeq":"≚","vellip":"⋮","verbar":"|","Verbar":"‖","vert":"|","Vert":"‖","VerticalBar":"∣","VerticalLine":"|","VerticalSeparator":"❘","VerticalTilde":"≀","VeryThinSpace":" ","Vfr":"𝔙","vfr":"𝔳","vltri":"⊲","vnsub":"⊂⃒","vnsup":"⊃⃒","Vopf":"𝕍","vopf":"𝕧","vprop":"∝","vrtri":"⊳","Vscr":"𝒱","vscr":"𝓋","vsubnE":"⫋︀","vsubne":"⊊︀","vsupnE":"⫌︀","vsupne":"⊋︀","Vvdash":"⊪","vzigzag":"⦚","Wcirc":"Ŵ","wcirc":"ŵ","wedbar":"⩟","wedge":"∧","Wedge":"⋀","wedgeq":"≙","weierp":"℘","Wfr":"𝔚","wfr":"𝔴","Wopf":"𝕎","wopf":"𝕨","wp":"℘","wr":"≀","wreath":"≀","Wscr":"𝒲","wscr":"𝓌","xcap":"⋂","xcirc":"◯","xcup":"⋃","xdtri":"▽","Xfr":"𝔛","xfr":"𝔵","xharr":"⟷","xhArr":"⟺","Xi":"Ξ","xi":"ξ","xlarr":"⟵","xlArr":"⟸","xmap":"⟼","xnis":"⋻","xodot":"⨀","Xopf":"𝕏","xopf":"𝕩","xoplus":"⨁","xotime":"⨂","xrarr":"⟶","xrArr":"⟹","Xscr":"𝒳","xscr":"𝓍","xsqcup":"⨆","xuplus":"⨄","xutri":"△","xvee":"⋁","xwedge":"⋀","Yacute":"Ý","yacute":"ý","YAcy":"Я","yacy":"я","Ycirc":"Ŷ","ycirc":"ŷ","Ycy":"Ы","ycy":"ы","yen":"¥","Yfr":"𝔜","yfr":"𝔶","YIcy":"Ї","yicy":"ї","Yopf":"𝕐","yopf":"𝕪","Yscr":"𝒴","yscr":"𝓎","YUcy":"Ю","yucy":"ю","yuml":"ÿ","Yuml":"Ÿ","Zacute":"Ź","zacute":"ź","Zcaron":"Ž","zcaron":"ž","Zcy":"З","zcy":"з","Zdot":"Ż","zdot":"ż","zeetrf":"ℨ","ZeroWidthSpace":"​","Zeta":"Ζ","zeta":"ζ","zfr":"𝔷","Zfr":"ℨ","ZHcy":"Ж","zhcy":"ж","zigrarr":"⇝","zopf":"𝕫","Zopf":"ℤ","Zscr":"𝒵","zscr":"𝓏","zwj":"‍","zwnj":"‌"}')},function(e){e.exports=JSON.parse('{"Aacute":"Á","aacute":"á","Acirc":"Â","acirc":"â","acute":"´","AElig":"Æ","aelig":"æ","Agrave":"À","agrave":"à","amp":"&","AMP":"&","Aring":"Å","aring":"å","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","brvbar":"¦","Ccedil":"Ç","ccedil":"ç","cedil":"¸","cent":"¢","copy":"©","COPY":"©","curren":"¤","deg":"°","divide":"÷","Eacute":"É","eacute":"é","Ecirc":"Ê","ecirc":"ê","Egrave":"È","egrave":"è","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","frac12":"½","frac14":"¼","frac34":"¾","gt":">","GT":">","Iacute":"Í","iacute":"í","Icirc":"Î","icirc":"î","iexcl":"¡","Igrave":"Ì","igrave":"ì","iquest":"¿","Iuml":"Ï","iuml":"ï","laquo":"«","lt":"<","LT":"<","macr":"¯","micro":"µ","middot":"·","nbsp":" ","not":"¬","Ntilde":"Ñ","ntilde":"ñ","Oacute":"Ó","oacute":"ó","Ocirc":"Ô","ocirc":"ô","Ograve":"Ò","ograve":"ò","ordf":"ª","ordm":"º","Oslash":"Ø","oslash":"ø","Otilde":"Õ","otilde":"õ","Ouml":"Ö","ouml":"ö","para":"¶","plusmn":"±","pound":"£","quot":"\\"","QUOT":"\\"","raquo":"»","reg":"®","REG":"®","sect":"§","shy":"­","sup1":"¹","sup2":"²","sup3":"³","szlig":"ß","THORN":"Þ","thorn":"þ","times":"×","Uacute":"Ú","uacute":"ú","Ucirc":"Û","ucirc":"û","Ugrave":"Ù","ugrave":"ù","uml":"¨","Uuml":"Ü","uuml":"ü","Yacute":"Ý","yacute":"ý","yen":"¥","yuml":"ÿ"}')},function(e){e.exports=JSON.parse('{"amp":"&","apos":"\'","gt":">","lt":"<","quot":"\\""}')},function(e,t,r){"use strict";var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});var i=n(r(17));t.default=function(e){if(e>=55296&&e<=57343||e>1114111)return"�";e in i.default&&(e=i.default[e]);var t="";return e>65535&&(e-=65536,t+=String.fromCharCode(e>>>10&1023|55296),e=56320|1023&e),t+=String.fromCharCode(e)}},function(e){e.exports=JSON.parse('{"0":65533,"128":8364,"130":8218,"131":402,"132":8222,"133":8230,"134":8224,"135":8225,"136":710,"137":8240,"138":352,"139":8249,"140":338,"142":381,"145":8216,"146":8217,"147":8220,"148":8221,"149":8226,"150":8211,"151":8212,"152":732,"153":8482,"154":353,"155":8250,"156":339,"158":382,"159":376}')},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(1),i=function(){function e(e){this.current=e,this.root=e,this.entering=!0}return e.prototype.next=function(){var e=this.current,t=this.entering;if(null===e)return null;var r=n.isContainer(e);return t&&r?e.firstChild?(this.current=e.firstChild,this.entering=!0):this.entering=!1:e===this.root?this.current=null:null===e.next?(this.current=e.parent,this.entering=!1):(this.current=e.next,this.entering=!0),{entering:t,node:e}},e.prototype.resumeAt=function(e,t){this.current=e,this.entering=!0===t},e}();t.default=i},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.InlineParser=t.C_NEWLINE=void 0;var n=r(0),i=r(1),o=r(2),a=r(9),s=n.__importDefault(r(20)),l=r(8),u=r(21),c=r(3),p=r(5);t.C_NEWLINE=10;var f="\\\\"+o.ESCAPABLE,d=new RegExp(/[!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]/),h=new RegExp('^(?:"('+f+'|[^"\\x00])*"|\'('+f+"|[^'\\x00])*'|\\(("+f+"|[^()\\x00])*\\))"),g=/^(?:<(?:[^<>\n\\\x00]|\\.)*>)/,m=new RegExp("^"+o.ESCAPABLE),v=new RegExp("^"+o.ENTITY,"i"),b=/`+/,y=/^`+/,C=/\.\.\./g,x=/--+/g,k=/^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/,N=/^<[A-Za-z][A-Za-z0-9.+-]{1,31}:[^<>\x00-\x20]*>/i,w=/^ *(?:\n *)?/,D=/^[ \t\n\x0b\x0c\x0d]/,L=/^\s/,E=/ *$/,A=/^ */,T=/^ *(?:\n|$)/,_=/^\[(?:[^\\\[\]]|\\.){0,1000}\]/,q=/^[^\n`\[\]\\!<&*_'"~]+/m,O=function(){function e(e){this.subject="",this.delimiters=null,this.brackets=null,this.pos=0,this.lineStartNum=0,this.lineIdx=0,this.lineOffsets=[0],this.linePosOffset=0,this.refMap={},this.refLinkCandidateMap={},this.refDefCandidateMap={},this.options=e}return e.prototype.sourcepos=function(e,t){var r=this.linePosOffset+this.lineOffsets[this.lineIdx],n=this.lineStartNum+this.lineIdx,i=[n,e+r];return"number"==typeof t?[i,[n,t+r]]:i},e.prototype.nextLine=function(){this.lineIdx+=1,this.linePosOffset=-this.pos},e.prototype.match=function(e){var t=e.exec(this.subject.slice(this.pos));return null===t?null:(this.pos+=t.index+t[0].length,t[0])},e.prototype.peek=function(){return this.pos<this.subject.length?this.subject.charCodeAt(this.pos):-1},e.prototype.spnl=function(){return this.match(w),!0},e.prototype.parseBackticks=function(e){var t=this.pos+1,r=this.match(y);if(null===r)return!1;for(var n,o=this.pos;null!==(n=this.match(b));)if(n===r){var a=this.subject.slice(o,this.pos-r.length),s=this.sourcepos(t,this.pos),l=a.split("\n");if(l.length>1){var u=c.last(l);this.lineIdx+=l.length-1,this.linePosOffset=-(this.pos-u.length-r.length),s[1]=this.sourcepos(this.pos),a=l.join(" ")}var p=i.createNode("code",s);return a.length>0&&null!==a.match(/[^ ]/)&&" "==a[0]&&" "==a[a.length-1]?p.literal=a.slice(1,a.length-1):p.literal=a,p.tickCount=r.length,e.appendChild(p),!0}return this.pos=o,e.appendChild(i.text(r,this.sourcepos(t,this.pos-1))),!0},e.prototype.parseBackslash=function(e){var r,n=this.subject;this.pos+=1;var o=this.pos;return this.peek()===t.C_NEWLINE?(this.pos+=1,r=i.createNode("linebreak",this.sourcepos(this.pos-1,this.pos)),e.appendChild(r),this.nextLine()):m.test(n.charAt(this.pos))?(e.appendChild(i.text(n.charAt(this.pos),this.sourcepos(o,this.pos))),this.pos+=1):e.appendChild(i.text("\\",this.sourcepos(o,o))),!0},e.prototype.parseAutolink=function(e){var t,r,n,a=this.pos+1;return(t=this.match(k))?(r=t.slice(1,t.length-1),(n=i.createNode("link",this.sourcepos(a,this.pos))).destination=o.normalizeURI("mailto:"+r),n.title="",n.appendChild(i.text(r,this.sourcepos(a+1,this.pos-1))),e.appendChild(n),!0):!!(t=this.match(N))&&(r=t.slice(1,t.length-1),(n=i.createNode("link",this.sourcepos(a,this.pos))).destination=o.normalizeURI(r),n.title="",n.appendChild(i.text(r,this.sourcepos(a+1,this.pos-1))),e.appendChild(n),!0)},e.prototype.parseHtmlTag=function(e){var t=this.pos+1,r=this.match(a.reHtmlTag);if(null===r)return!1;var n=i.createNode("htmlInline",this.sourcepos(t,this.pos));return n.literal=r,e.appendChild(n),!0},e.prototype.scanDelims=function(e){var t=0,r=this.pos;if(39===e||34===e)t++,this.pos++;else for(;this.peek()===e;)t++,this.pos++;if(0===t||t<2&&126===e)return this.pos=r,null;var n,i=0===r?"\n":this.subject.charAt(r-1),o=this.peek();n=-1===o?"\n":s.default(o);var a,l,u=L.test(n),c=d.test(n),p=L.test(i),f=d.test(i),h=!u&&(!c||p||f),g=!p&&(!f||u||c);return 95===e?(a=h&&(!g||f),l=g&&(!h||c)):39===e||34===e?(a=h&&!g,l=g):(a=h,l=g),this.pos=r,{numdelims:t,canOpen:a,canClose:l}},e.prototype.handleDelim=function(e,t){var r=this.scanDelims(e);if(!r)return!1;var n,o=r.numdelims,a=this.pos+1;this.pos+=o,n=39===e?"’":34===e?"“":this.subject.slice(a-1,this.pos);var s=i.text(n,this.sourcepos(a,this.pos));return t.appendChild(s),(r.canOpen||r.canClose)&&(this.options.smart||39!==e&&34!==e)&&(this.delimiters={cc:e,numdelims:o,origdelims:o,node:s,previous:this.delimiters,next:null,canOpen:r.canOpen,canClose:r.canClose},this.delimiters.previous&&(this.delimiters.previous.next=this.delimiters)),!0},e.prototype.removeDelimiter=function(e){null!==e.previous&&(e.previous.next=e.next),null===e.next?this.delimiters=e.previous:e.next.previous=e.previous},e.prototype.removeDelimitersBetween=function(e,t){e.next!==t&&(e.next=t,t.previous=e)},e.prototype.processEmphasis=function(e){var t,r,n,o,a,s,l,u=!1,c=((t={})[95]=[e,e,e],t[42]=[e,e,e],t[39]=[e],t[34]=[e],t[126]=[e],t);for(n=this.delimiters;null!==n&&n.previous!==e;)n=n.previous;for(;null!==n;){var p=n.cc,f=95===p||42===p;if(n.canClose){for(r=n.previous,l=!1;null!==r&&r!==e&&r!==c[p][f?n.origdelims%3:0];){if(u=f&&(n.canOpen||r.canClose)&&n.origdelims%3!=0&&(r.origdelims+n.origdelims)%3==0,r.cc===n.cc&&r.canOpen&&!u){l=!0;break}r=r.previous}if(o=n,f||126===p)if(l){if(r){var d=n.numdelims>=2&&r.numdelims>=2?2:1,h=f?0:1;a=r.node,s=n.node;var g=i.createNode(f?1===d?"emph":"strong":"strike"),m=a.sourcepos[1],v=s.sourcepos[0];g.sourcepos=[[m[0],m[1]-d+1],[v[0],v[1]+d-1]],a.sourcepos[1][1]-=d,s.sourcepos[0][1]+=d,a.literal=a.literal.slice(d),s.literal=s.literal.slice(d),r.numdelims-=d,n.numdelims-=d;for(var b=a.next,y=void 0;b&&b!==s;)y=b.next,b.unlink(),g.appendChild(b),b=y;if(a.insertAfter(g),this.removeDelimitersBetween(r,n),r.numdelims<=h&&(0===r.numdelims&&a.unlink(),this.removeDelimiter(r)),n.numdelims<=h){0===n.numdelims&&s.unlink();var C=n.next;this.removeDelimiter(n),n=C}}}else n=n.next;else 39===p?(n.node.literal="’",l&&(r.node.literal="‘"),n=n.next):34===p&&(n.node.literal="”",l&&(r.node.literal="“"),n=n.next);l||(c[p][f?o.origdelims%3:0]=o.previous,o.canOpen||this.removeDelimiter(o))}else n=n.next}for(;null!==this.delimiters&&this.delimiters!==e;)this.removeDelimiter(this.delimiters)},e.prototype.parseLinkTitle=function(){var e=this.match(h);return null===e?null:o.unescapeString(e.substr(1,e.length-2))},e.prototype.parseLinkDestination=function(){var e=this.match(g);if(null===e){if(60===this.peek())return null;for(var t=this.pos,r=0,n=void 0;-1!==(n=this.peek());)if(92===n&&m.test(this.subject.charAt(this.pos+1)))this.pos+=1,-1!==this.peek()&&(this.pos+=1);else if(40===n)this.pos+=1,r+=1;else if(41===n){if(r<1)break;this.pos+=1,r-=1}else{if(null!==D.exec(s.default(n)))break;this.pos+=1}return this.pos===t&&41!==n||0!==r?null:(e=this.subject.substr(t,this.pos-t),o.normalizeURI(o.unescapeString(e)))}return o.normalizeURI(o.unescapeString(e.substr(1,e.length-2)))},e.prototype.parseLinkLabel=function(){var e=this.match(_);return null===e||e.length>1001?0:e.length},e.prototype.parseOpenBracket=function(e){var t=this.pos;this.pos+=1;var r=i.text("[",this.sourcepos(this.pos,this.pos));return e.appendChild(r),this.addBracket(r,t,!1),!0},e.prototype.parseBang=function(e){var t=this.pos;if(this.pos+=1,91===this.peek()){this.pos+=1;var r=i.text("![",this.sourcepos(this.pos-1,this.pos));e.appendChild(r),this.addBracket(r,t+1,!0)}else{r=i.text("!",this.sourcepos(this.pos,this.pos));e.appendChild(r)}return!0},e.prototype.parseCloseBracket=function(e){var t=null,r=null,n=!1;this.pos+=1;var o=this.pos,a=this.brackets;if(null===a)return e.appendChild(i.text("]",this.sourcepos(o,o))),!0;if(!a.active)return e.appendChild(i.text("]",this.sourcepos(o,o))),this.removeBracket(),!0;var s=a.image,l=this.pos;40===this.peek()&&(this.pos++,this.spnl()&&null!==(t=this.parseLinkDestination())&&this.spnl()&&(D.test(this.subject.charAt(this.pos-1))&&(r=this.parseLinkTitle()),1)&&this.spnl()&&41===this.peek()?(this.pos+=1,n=!0):this.pos=l);var u="";if(!n){var p=this.pos,f=this.parseLinkLabel();if(f>2?u=this.subject.slice(p,p+f):a.bracketAfter||(u=this.subject.slice(a.index,o)),0===f&&(this.pos=l),u){u=c.normalizeReference(u);var d=this.refMap[u];d&&(t=d.destination,r=d.title,n=!0)}}if(n){var h=i.createNode(s?"image":"link");h.destination=t,h.title=r||"",h.sourcepos=[a.startpos,this.sourcepos(this.pos)];for(var g=a.node.next,m=void 0;g;)m=g.next,g.unlink(),h.appendChild(g),g=m;if(e.appendChild(h),this.processEmphasis(a.previousDelimiter),this.removeBracket(),a.node.unlink(),!s)for(a=this.brackets;null!==a;)a.image||(a.active=!1),a=a.previous;return this.options.referenceDefinition&&(this.refLinkCandidateMap[e.id]={node:e,refLabel:u}),!0}return this.removeBracket(),this.pos=o,e.appendChild(i.text("]",this.sourcepos(o,o))),this.options.referenceDefinition&&(this.refLinkCandidateMap[e.id]={node:e,refLabel:u}),!0},e.prototype.addBracket=function(e,t,r){null!==this.brackets&&(this.brackets.bracketAfter=!0),this.brackets={node:e,startpos:this.sourcepos(t+(r?0:1)),previous:this.brackets,previousDelimiter:this.delimiters,index:t,image:r,active:!0}},e.prototype.removeBracket=function(){this.brackets&&(this.brackets=this.brackets.previous)},e.prototype.parseEntity=function(e){var t,r=this.pos+1;return!!(t=this.match(v))&&(e.appendChild(i.text(l.decodeHTML(t),this.sourcepos(r,this.pos))),!0)},e.prototype.parseString=function(e){var t,r=this.pos+1;if(t=this.match(q)){if(this.options.smart){var n=t.replace(C,"…").replace(x,(function(e){var t=0,r=0;return e.length%3==0?r=e.length/3:e.length%2==0?t=e.length/2:e.length%3==2?(t=1,r=(e.length-2)/3):(t=2,r=(e.length-4)/3),o.repeat("—",r)+o.repeat("–",t)}));e.appendChild(i.text(n,this.sourcepos(r,this.pos)))}else{var a=i.text(t,this.sourcepos(r,this.pos));e.appendChild(a)}return!0}return!1},e.prototype.parseNewline=function(e){this.pos+=1;var t=e.lastChild;if(t&&"text"===t.type&&" "===t.literal[t.literal.length-1]){var r=" "===t.literal[t.literal.length-2],n=t.literal.length;t.literal=t.literal.replace(E,"");var o=n-t.literal.length;t.sourcepos[1][1]-=o,e.appendChild(i.createNode(r?"linebreak":"softbreak",this.sourcepos(this.pos-o,this.pos)))}else e.appendChild(i.createNode("softbreak",this.sourcepos(this.pos,this.pos)));return this.nextLine(),this.match(A),!0},e.prototype.parseReference=function(e,t){if(!this.options.referenceDefinition)return 0;this.subject=e.stringContent,this.pos=0;var r=null,n=this.pos,o=this.parseLinkLabel();if(0===o)return 0;var a=this.subject.substr(0,o);if(58!==this.peek())return this.pos=n,0;this.pos++,this.spnl();var s=this.parseLinkDestination();if(null===s)return this.pos=n,0;var l=this.pos;this.spnl(),this.pos!==l&&(r=this.parseLinkTitle()),null===r&&(r="",this.pos=l);var u=!0;if(null===this.match(T)&&(""===r?u=!1:(r="",this.pos=l,u=null!==this.match(T))),!u)return this.pos=n,0;var f=c.normalizeReference(a);if(""===f)return this.pos=n,0;var d=this.getReferenceDefSourcepos(e);e.sourcepos[0][0]=d[1][0]+1;var h=i.createNode("refDef",d);return h.title=r,h.dest=s,h.label=f,e.insertBefore(h),t[f]?this.refDefCandidateMap[h.id]=h:t[f]=p.createRefDefState(h),this.pos-n},e.prototype.mergeTextNodes=function(e){for(var t,r=[];t=e.next();){var n=t.entering,i=t.node;if(n&&"text"===i.type)r.push(i);else if(1===r.length)r=[];else if(r.length>1){var o=r[0],a=r[r.length-1];o.sourcepos&&a.sourcepos&&(o.sourcepos[1]=a.sourcepos[1]),o.next=a.next,o.next&&(o.next.prev=o);for(var s=1;s<r.length;s+=1)o.literal+=r[s].literal,r[s].unlink();r=[]}}},e.prototype.getReferenceDefSourcepos=function(e){for(var t=e.stringContent.split(/\n|\r\n/),r=!1,n=0,i={line:0,ch:0},o=0;o<t.length;o+=1){var a=t[o];if(D.test(a))break;if(/\:/.test(a)&&0===n){if(r)break;var s=a.indexOf(":")===a.length-1?o+1:o;i={line:s,ch:t[s].length},r=!0}var l=a.match(/'|"/g);if(l&&(n+=l.length),2===n){i={line:o,ch:a.length};break}}return[[e.sourcepos[0][0],e.sourcepos[0][1]],[e.sourcepos[0][0]+i.line,i.ch]]},e.prototype.parseInline=function(e){var r,n=!1,o=this.peek();if(-1===o)return!1;switch(o){case t.C_NEWLINE:n=this.parseNewline(e);break;case 92:n=this.parseBackslash(e);break;case 96:n=this.parseBackticks(e);break;case 42:case 95:case 126:n=this.handleDelim(o,e);break;case 39:case 34:n=!!(null===(r=this.options)||void 0===r?void 0:r.smart)&&this.handleDelim(o,e);break;case 91:n=this.parseOpenBracket(e);break;case 33:n=this.parseBang(e);break;case 93:n=this.parseCloseBracket(e);break;case 60:n=this.parseAutolink(e)||this.parseHtmlTag(e);break;case 38:n=this.parseEntity(e);break;default:n=this.parseString(e)}return n||(this.pos+=1,e.appendChild(i.text(s.default(o),this.sourcepos(this.pos,this.pos+1)))),!0},e.prototype.parse=function(e){for(this.subject=e.stringContent.trim(),this.pos=0,this.delimiters=null,this.brackets=null,this.lineOffsets=e.lineOffsets||[0],this.lineIdx=0,this.linePosOffset=0,this.lineStartNum=e.sourcepos[0][0],i.isHeading(e)&&(this.lineOffsets[0]+=e.level+1);this.parseInline(e););e.stringContent=null,this.processEmphasis(null),this.mergeTextNodes(e.walker());var t=this.options,r=t.extendedAutolinks,n=t.customParser;if(r&&u.convertExtAutoLinks(e.walker(),r),n&&e.firstChild)for(var o,a=e.firstChild.walker();o=a.next();){var s=o.node,l=o.entering;n[s.type]&&n[s.type](s,{entering:l,options:this.options})}},e}();t.InlineParser=O},function(e,t,r){"use strict";
/*! http://mths.be/fromcodepoint v0.2.1 by @mathias */
var n;if(Object.defineProperty(t,"__esModule",{value:!0}),String.fromCodePoint)n=function(e){try{return String.fromCodePoint(e)}catch(e){if(e instanceof RangeError)return String.fromCharCode(65533);throw e}};else{var i=String.fromCharCode,o=Math.floor;n=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];var r,n,a=16384,s=[],l=-1,u=e.length;if(!u)return"";for(var c="";++l<u;){var p=Number(e[l]);if(!isFinite(p)||p<0||p>1114111||o(p)!==p)return String.fromCharCode(65533);p<=65535?s.push(p):(r=55296+((p-=65536)>>10),n=p%1024+56320,s.push(r,n)),(l+1===u||s.length>a)&&(c+=i.apply(void 0,s),s.length=0)}return c}}t.default=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.convertExtAutoLinks=t.parseUrlLink=t.parseEmailLink=void 0;var n=r(0),i=r(1);function o(e){var t=/\)+$/.exec(e);if(t){for(var r=0,n=0,i=e;n<i.length;n++){var o=i[n];"("===o?r<0?r=1:r+=1:")"===o&&(r-=1)}if(r<0){var a=Math.min(-r,t[0].length);return e.substring(0,e.length-a)}}return e}function a(e){return e.replace(/&[A-Za-z0-9]+;$/,"")}function s(e){for(var t,r=new RegExp("[\\w.+-]+@(?:[\\w-]+\\.)+[\\w-]+","g"),n=[];t=r.exec(e);){var i=t[0];/[_-]+$/.test(i)||n.push({text:i,range:[t.index,t.index+i.length-1],url:"mailto:"+i})}return n}function l(e){for(var t,r=new RegExp("(www|https?://).(?:[w-]+.)*[A-Za-z0-9-]+.[A-Za-z0-9-]+[^<\\s]*[^<?!.,:*_?~\\s]","g"),n=[];t=r.exec(e);){var i=a(o(t[0])),s="www"===t[1]?"http://":"";n.push({text:i,range:[t.index,t.index+i.length-1],url:""+s+i})}return n}function u(e){return n.__spreadArrays(l(e),s(e)).sort((function(e,t){return e.range[0]-t.range[0]}))}t.parseEmailLink=s,t.parseUrlLink=l,t.convertExtAutoLinks=function(e,t){var r;"boolean"==typeof t&&(t=u);for(var n=function(){var e=r.entering,n=r.node;if(e&&"text"===n.type&&"link"!==n.parent.type){var o=n.literal,a=t(o);if(!a||!a.length)return"continue";for(var s=0,l=n.sourcepos[0],u=l[0],c=l[1],p=function(e,t){return[[u,c+e],[u,c+t]]},f=[],d=0,h=a;d<h.length;d++){var g=h[d],m=g.range,v=g.url,b=g.text;m[0]>s&&f.push(i.text(o.substring(s,m[0]),p(s,m[0]-1)));var y=i.createNode("link",p.apply(void 0,m));y.appendChild(i.text(b,p.apply(void 0,m))),y.destination=v,y.extendedAutolink=!0,f.push(y),s=m[1]+1}s<o.length&&f.push(i.text(o.substring(s),p(s,o.length-1)));for(var C=0,x=f;C<x.length;C++){var k=x[C];n.insertBefore(k)}n.unlink()}};r=e.next();)n()}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.blockHandlers=void 0;var n=r(23),i=r(24),o=r(4),a=r(2),s={continue:function(){return 0},finalize:function(e,t){for(var r=t.firstChild;r;){if(o.endsWithBlankLine(r)&&r.next){t.listData.tight=!1;break}for(var n=r.firstChild;n;){if(o.endsWithBlankLine(n)&&(r.next||n.next)){t.listData.tight=!1;break}n=n.next}r=r.next}},canContain:function(e){return"item"===e},acceptsLines:!1},l={continue:function(e){var t=e.currentLine;return e.indented||o.peek(t,e.nextNonspace)!==o.C_GREATERTHAN?1:(e.advanceNextNonspace(),e.advanceOffset(1,!1),o.isSpaceOrTab(o.peek(t,e.offset))&&e.advanceOffset(1,!0),0)},finalize:function(){},canContain:function(e){return"item"!==e},acceptsLines:!1},u={continue:function(e,t){if(e.blank){if(null===t.firstChild)return 1;e.advanceNextNonspace()}else{if(!(e.indent>=t.listData.markerOffset+t.listData.padding))return 1;e.advanceOffset(t.listData.markerOffset+t.listData.padding,!0)}return 0},finalize:n.taskListItemFinalize,canContain:function(e){return"item"!==e},acceptsLines:!1},c={continue:function(e,t){var r=e.currentLine,n=e.indent;if(t.isFenced){var i=n<=3&&r.charAt(e.nextNonspace)===t.fenceChar&&r.slice(e.nextNonspace).match(o.reClosingCodeFence);if(i&&i[0].length>=t.fenceLength)return e.lastLineLength=e.offset+n+i[0].length,e.finalize(t,e.lineNumber),2;for(var a=t.fenceOffset;a>0&&o.isSpaceOrTab(o.peek(r,e.offset));)e.advanceOffset(1,!0),a--}else if(n>=o.CODE_INDENT)e.advanceOffset(o.CODE_INDENT,!0);else{if(!e.blank)return 1;e.advanceNextNonspace()}return 0},finalize:function(e,t){var r;if(null!==t.stringContent){if(t.isFenced){var n=t.stringContent,i=n.indexOf("\n"),o=n.slice(0,i),s=n.slice(i+1),l=o.match(/^(\s*)(.*)/);t.infoPadding=l[1].length,t.info=a.unescapeString(l[2].trim()),t.literal=s}else t.literal=null===(r=t.stringContent)||void 0===r?void 0:r.replace(/(\n *)+$/,"\n");t.stringContent=null}},canContain:function(){return!1},acceptsLines:!0},p={continue:function(e){return e.blank?1:0},finalize:function(e,t){if(null!==t.stringContent){for(var r,n=!1;o.peek(t.stringContent,0)===o.C_OPEN_BRACKET&&(r=e.inlineParser.parseReference(t,e.refMap));)t.stringContent=t.stringContent.slice(r),n=!0;n&&o.isBlank(t.stringContent)&&t.unlink()}},canContain:function(){return!1},acceptsLines:!0};t.blockHandlers={document:{continue:function(){return 0},finalize:function(){},canContain:function(e){return"item"!==e},acceptsLines:!1},list:s,blockQuote:l,item:u,heading:{continue:function(){return 1},finalize:function(){},canContain:function(){return!1},acceptsLines:!1},thematicBreak:{continue:function(){return 1},finalize:function(){},canContain:function(){return!1},acceptsLines:!1},codeBlock:c,htmlBlock:{continue:function(e,t){return!e.blank||6!==t.htmlBlockType&&7!==t.htmlBlockType?0:1},finalize:function(e,t){var r;t.literal=(null===(r=t.stringContent)||void 0===r?void 0:r.replace(/(\n *)+$/,""))||null,t.stringContent=null},canContain:function(){return!1},acceptsLines:!0},paragraph:p,table:i.table,tableBody:i.tableBody,tableHead:i.tableHead,tableRow:i.tableRow,tableCell:i.tableCell,tableDelimRow:i.tableDelimRow,tableDelimCell:i.tableDelimCell,refDef:{continue:function(){return 1},finalize:function(){},canContain:function(){return!1},acceptsLines:!0}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.taskListItemFinalize=void 0;var n=/^\[([ \txX])\][ \t]+/;t.taskListItemFinalize=function(e,t){if(t.firstChild&&"paragraph"===t.firstChild.type){var r=t.firstChild,i=r.stringContent.match(n);if(i){var o=i[0].length;r.stringContent=r.stringContent.substring(o-1),r.sourcepos[0][1]+=o,r.lineOffsets[0]+=o,t.listData.task=!0,t.listData.checked=/[xX]/.test(i[1])}}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.tableCell=t.tableRow=t.tableDelimCell=t.tableDelimRow=t.tableHead=t.tableBody=t.table=void 0,t.table={continue:function(){return 0},finalize:function(){},canContain:function(e){return"tableHead"===e||"tableBody"===e},acceptsLines:!1},t.tableBody={continue:function(){return 0},finalize:function(){},canContain:function(e){return"tableRow"===e},acceptsLines:!1},t.tableHead={continue:function(){return 1},finalize:function(){},canContain:function(e){return"tableRow"===e||"tableDelimRow"===e},acceptsLines:!1},t.tableDelimRow={continue:function(){return 1},finalize:function(){},canContain:function(e){return"tableDelimCell"===e},acceptsLines:!1},t.tableDelimCell={continue:function(){return 1},finalize:function(){},canContain:function(){return!1},acceptsLines:!1},t.tableRow={continue:function(){return 1},finalize:function(){},canContain:function(e){return"tableCell"===e},acceptsLines:!1},t.tableCell={continue:function(){return 1},finalize:function(){},canContain:function(){return!1},acceptsLines:!1}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.tableBody=t.tableHead=void 0;var n=r(2),i=r(1),o=r(3);function a(e){for(var t=0,r=0,i=[],o=0;o<e.length;o+=1)if("|"===e[o]&&"\\"!==e[o-1]){var a=e.substring(t,o);0===t&&n.isEmpty(a)?r=o+1:i.push(a),t=o+1}if(t<e.length){a=e.substring(t,e.length);n.isEmpty(a)||i.push(a)}return[r,i]}function s(e,t,r,n){for(var o=[],a=0,s=t;a<s.length;a++){var l=s[a],u=l.match(/^[ \t]+/),c=u?u[0].length:0,p=void 0,f=void 0;if(c===l.length)c=0,p=0,f="";else{var d=l.match(/[ \t]+$/);p=d?d[0].length:0,f=l.slice(c,l.length-p)}var h=n+c,g=i.createNode(e,[[r,n],[r,n+l.length-1]]);g.stringContent=f.replace(/\\\|/g,"|"),g.startIdx=o.length,g.endIdx=o.length,g.lineOffsets=[h-1],g.paddingLeft=c,g.paddingRight=p,o.push(g),n+=l.length+1}return o}function l(e){var t="left",r=e.stringContent,n=r[0];return":"===r[r.length-1]&&(t=":"===n?"center":"right"),{align:t}}t.tableHead=function(e,t){var r=t.stringContent;if("paragraph"===t.type&&!e.indented&&!e.blank){var n=r.length-1,u=r.lastIndexOf("\n",n-1)+1,c=r.slice(u,n),p=e.currentLine.slice(e.nextNonspace),f=a(c),d=f[0],h=f[1],g=a(p),m=g[0],v=g[1],b=/^[ \t]*:?-+:?[ \t]*$/;if(!h.length||!v.length||v.some((function(e){return!b.test(e)}))||1===v.length&&0!==p.indexOf("|"))return 0;var y=t.lineOffsets,C=e.lineNumber-1,x=o.last(y)+1,k=i.createNode("table",[[C,x],[e.lineNumber,e.offset]]);if(k.columns=v.map((function(){return{align:"left"}})),t.insertAfter(k),1===y.length)t.unlink();else{t.stringContent=r.slice(0,u);var N=u-(r.lastIndexOf("\n",u-2)+1)-1;e.lastLineLength=y[y.length-2]+N,e.finalize(t,C-1)}e.advanceOffset(e.currentLine.length-e.offset,!1);var w=i.createNode("tableHead",[[C,x],[e.lineNumber,e.offset]]);k.appendChild(w);var D=i.createNode("tableRow",[[C,x],[C,x+c.length-1]]),L=i.createNode("tableDelimRow",[[e.lineNumber,e.nextNonspace+1],[e.lineNumber,e.offset]]);w.appendChild(D),w.appendChild(L),s("tableCell",h,C,x+d).forEach((function(e){D.appendChild(e)}));var E=s("tableDelimCell",v,e.lineNumber,e.nextNonspace+1+m);return E.forEach((function(e){L.appendChild(e)})),k.columns=E.map(l),e.tip=k,2}return 0},t.tableBody=function(e,t){if("table"!==t.type&&"tableBody"!==t.type||!e.blank&&-1===e.currentLine.indexOf("|"))return 0;if(e.advanceOffset(e.currentLine.length-e.offset,!1),e.blank){var r=t;return"tableBody"===t.type&&(r=t.parent,e.finalize(t,e.lineNumber)),e.finalize(r,e.lineNumber),0}var n=t;"table"===t.type&&((n=e.addChild("tableBody",e.nextNonspace)).stringContent=null);var o=i.createNode("tableRow",[[e.lineNumber,e.nextNonspace+1],[e.lineNumber,e.currentLine.length]]);n.appendChild(o);var l=n.parent,u=a(e.currentLine.slice(e.nextNonspace)),c=u[0];return s("tableCell",u[1],e.lineNumber,e.nextNonspace+1+c).forEach((function(e,t){t>=l.columns.length&&(e.ignored=!0),o.appendChild(e)})),2}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.frontMatterParser=void 0;var n=r(1),i=r(5),o=r(6),a=new RegExp(o.frontMatterOpen),s=new RegExp(o.frontMatterClose),l=new RegExp(o.frontMatterClose+"$"),u=!1;t.frontMatterParser={paragraph:function(e,t){var r,c=t.entering,p=t.options,f=e.type,d=e.stringContent;if(p.frontMatter&&c&&"paragraph"===f){var h=(d||"").trim(),g=[a.test(h),s.test(h)],m=g[0],v=g[1];if((m||v)&&(u=!0),u&&(e.customType="frontMatter"),v&&(u=!1,!l.test(h))){var b=o.frontMatterClose.length,y=h.indexOf(o.frontMatterClose),C=h.substring(0,y+b),x=C.split(i.reLineEnding).length;e.sourcepos[1][0]=e.sourcepos[0][0]+x-1,e.sourcepos[1][1]=3,e.stringContent=C;var k=null===(r=e.lineOffsets)||void 0===r?void 0:r.splice(x),N=e.sourcepos[1][0],w=h.substring(y+b+1),D=w.split(i.reLineEnding),L=D.length,E=n.createNode("paragraph",[[N+1,1],[N+L,D[L-1].length]]);E.stringContent=w,E.open=!1,E.lineOffsets=k,e.insertAfter(E)}(m||v)&&(e.stringContent=e.stringContent.replace(new RegExp(o.frontMatterOpen+"|"+o.frontMatterClose,"g"),"---"))}}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getRangeForCustomType=t.isUnlinked=t.invokeNextUntil=t.findNodeById=t.toString=t.findNodeAtPosition=t.findFirstNodeAtLine=t.findChildNodeAtLine=t.updateNextLineNumbers=t.prependChildNodes=t.insertNodesBefore=t.getChildNodes=t.removeNextUntil=t.getAllParents=void 0;var n=r(1);function i(e,t){return e[0]<t[0]?1:e[0]>t[0]?-1:e[1]<t[1]?1:e[1]>t[1]?-1:0}function o(e,t){var r=e[0];return 1===i(e[1],t)?1:-1===i(r,t)?-1:0}function a(e,t){var r=e[0];return e[1][0]<t?1:r[0]>t?-1:0}function s(e){return n.getNodeById(e)||null}t.getAllParents=function(e){for(var t=[];e.parent;)t.push(e.parent),e=e.parent;return t.reverse()},t.removeNextUntil=function(e,t){if(e.parent===t.parent&&e!==t){for(var r=e.next;r&&r!==t;){for(var i=r.next,o=0,a=["parent","prev","next"];o<a.length;o++){var s=a[o];r[s]&&(n.removeNodeById(r[s].id),r[s]=null)}r=i}e.next=t.next,t.next?t.next.prev=e:e.parent.lastChild=e}},t.getChildNodes=function(e){for(var t=[],r=e.firstChild;r;)t.push(r),r=r.next;return t},t.insertNodesBefore=function(e,t){for(var r=0,n=t;r<n.length;r++){var i=n[r];e.insertBefore(i)}},t.prependChildNodes=function(e,t){for(var r=t.length-1;r>=0;r-=1)e.prependChild(t[r])},t.updateNextLineNumbers=function(e,t){if(e&&e.parent&&0!==t){var r,n=e.parent.walker();for(n.resumeAt(e,!0);r=n.next();){var i=r.node;r.entering&&(i.sourcepos[0][0]+=t,i.sourcepos[1][0]+=t)}}},t.findChildNodeAtLine=function(e,t){for(var r=e.firstChild;r;){var n=a(r.sourcepos,t);if(0===n)return r;if(-1===n)return r.prev||r;r=r.next}return e.lastChild},t.findFirstNodeAtLine=function(e,t){for(var r=e.firstChild,n=null;r;){var i=a(r.sourcepos,t);if(0===i){if(r.sourcepos[0][0]===t||!r.firstChild)return r;n=r,r=r.firstChild}else{if(-1===i)break;n=r,r=r.next}}return n?function(e){for(;e.parent&&"document"!==e.parent.type&&e.parent.sourcepos[0][0]===e.sourcepos[0][0];)e=e.parent;return e}(function(e){for(;e.lastChild;)e=e.lastChild;return e}(n)):null},t.findNodeAtPosition=function(e,t){for(var r=e,n=null;r;){var i=o(r.sourcepos,t);if(0===i){if(!r.firstChild)return r;n=r,r=r.firstChild}else{if(-1===i)return n;if(!r.next)return n;r=r.next}}return r},t.toString=function(e){return e?"type: "+e.type+", sourcepos: "+e.sourcepos+", firstChild: "+(e.firstChild&&e.firstChild.type)+", lastChild: "+(e.lastChild&&e.lastChild.type)+", prev: "+(e.prev&&e.prev.type)+", next: "+(e.next&&e.next.type):"null"},t.findNodeById=s,t.invokeNextUntil=function(e,t,r){if(void 0===r&&(r=null),t)for(var n=t.walker();t&&t!==r;){e(t);var i=n.next();if(!i)break;t=i.node}},t.isUnlinked=function(e){var t=s(e);if(!t)return!0;for(;t&&"document"!==t.type;){if(!t.parent&&!t.prev&&!t.next)return!0;t=t.parent}return!1},t.getRangeForCustomType=function(e,t){var r=[e,t];return[{node:e,type:"prev"},{node:t,type:"next"}].forEach((function(e,t){for(var n=e.node,i=e.type;n&&n.customType&&n[i];){var o=n[i],s=o.sourcepos,l=o.customType,u="prev"===i?1===a(s,n.sourcepos[0][0]):-1===a(s,n.sourcepos[1][0]);if(!l||!u)break;n=o,r[t]=n}})),r}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createRenderHTML=void 0;var n=r(0),i=r(1),o=r(2),a=r(3),s=r(29),l=r(31),u={softbreak:"\n",gfm:!1,tagFilter:!1,nodeId:!1,customProp:{}};function c(e){e.length&&"\n"!==a.last(a.last(e))&&e.push("\n")}function p(e,t){e.outerNewLine&&c(t)}function f(e,t){e.innerNewLine&&c(t)}function d(e){for(var t=[],r=e.walker(),n=null;n=r.next();){var i=n.node;"text"===i.type&&t.push(i.literal)}return t.join("")}t.createRenderHTML=function(e){var t=n.__assign(n.__assign({},u),e),r=n.__assign({},s.baseConvertors);if(t.gfm&&(r=n.__assign(n.__assign({},r),l.gfmConvertors)),t.convertors){var a=t.convertors;Object.keys(a).forEach((function(e){var t=r[e],n=a[e];r[e]=t?function(e,r){return r.origin=function(){return t(e,r)},n(e,r)}:n})),delete t.convertors}return function(e){return function(e,t,r){var n=[],a=e.walker(),s=null,l=function(){var e=s.node,l=s.entering,u=t[e.type];if(!u)return"continue";var c=!1,h={entering:l,leaf:!i.isContainer(e),options:r,getChildrenText:d,skipChildren:function(){c=!0}},g=u(e,h);g&&((Array.isArray(g)?g:[g]).forEach((function(t,i){"openTag"===t.type&&r.nodeId&&0===i&&(t.attributes||(t.attributes={}),t.attributes["data-nodeid"]=String(e.id)),function(e,t){switch(e.type){case"openTag":case"closeTag":!function(e,t){"openTag"===e.type?(p(e,t),t.push(function(e){var t=[],r=e.tagName,n=e.classNames,i=e.attributes;t.push("<"+r),n&&n.length>0&&t.push(' class="'+n.join(" ")+'"');i&&Object.keys(i).forEach((function(e){var r=i[e];t.push(" "+e+'="'+r+'"')}));e.selfClose&&t.push(" /");t.push(">"),e.finalize&&t.push("</"+r+">");return t.join("")}(e)),e.selfClose?p(e,t):f(e,t)):(f(e,t),t.push("</"+e.tagName+">"),p(e,t))}(e,t);break;case"text":!function(e,t){t.push(o.escapeXml(e.content))}(e,t);break;case"html":!function(e,t){p(e,t),t.push(e.content),p(e,t)}(e,t)}}(t,n)})),c&&(a.resumeAt(e,!1),a.next()))};for(;s=a.next();)l();return c(n),n.join("")}(e,r,t)}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.baseConvertors=void 0;var n=r(0),i=r(2),o=r(30);t.baseConvertors={heading:function(e,t){return{type:t.entering?"openTag":"closeTag",tagName:"h"+e.level,outerNewLine:!0}},text:function(e){return{type:"text",content:e.literal}},softbreak:function(e,t){return{type:"html",content:t.options.softbreak}},linebreak:function(){return{type:"html",content:"<br />\n"}},emph:function(e,t){return{type:t.entering?"openTag":"closeTag",tagName:"em"}},strong:function(e,t){return{type:t.entering?"openTag":"closeTag",tagName:"strong"}},paragraph:function(e,t){var r,n=t.entering,i=t.skipChildren,o=null===(r=e.parent)||void 0===r?void 0:r.parent,a=!1;return o&&"list"===o.type&&o.listData.tight?null:(e.customType&&(a=!0,i()),{type:n?"openTag":"closeTag",tagName:"p",outerNewLine:!0,finalize:a})},thematicBreak:function(){return{type:"openTag",tagName:"hr",outerNewLine:!0,selfClose:!0}},blockQuote:function(e,t){return{type:t.entering?"openTag":"closeTag",tagName:"blockquote",outerNewLine:!0,innerNewLine:!0}},list:function(e,t){var r=t.entering,n=e.listData,i=n.type,o=n.start,a="bullet"===i?"ul":"ol",s={};return"ol"===a&&null!==o&&1!==o&&(s.start=o.toString()),{type:r?"openTag":"closeTag",tagName:a,attributes:s,outerNewLine:!0}},item:function(e,t){return{type:t.entering?"openTag":"closeTag",tagName:"li",outerNewLine:!0}},htmlInline:function(e,t){return{type:"html",content:t.options.tagFilter?o.filterDisallowedTags(e.literal):e.literal}},htmlBlock:function(e,t){var r=t.options,n=r.tagFilter?o.filterDisallowedTags(e.literal):e.literal;return r.nodeId?[{type:"openTag",tagName:"div",outerNewLine:!0},{type:"html",content:n},{type:"closeTag",tagName:"div",outerNewLine:!0}]:{type:"html",content:n,outerNewLine:!0}},code:function(e){return[{type:"openTag",tagName:"code"},{type:"text",content:e.literal},{type:"closeTag",tagName:"code"}]},codeBlock:function(e){var t=e.info,r=t?t.split(/\s+/):[],n=[];return r.length>0&&r[0].length>0&&n.push("language-"+i.escapeXml(r[0])),[{type:"openTag",tagName:"pre",outerNewLine:!0},{type:"openTag",tagName:"code",classNames:n},{type:"text",content:e.literal},{type:"closeTag",tagName:"code"},{type:"closeTag",tagName:"pre",outerNewLine:!0}]},link:function(e,t){if(t.entering){var r=e,o=r.title,a=r.destination;return{type:"openTag",tagName:"a",attributes:n.__assign({href:i.escapeXml(a)},o&&{title:i.escapeXml(o)})}}return{type:"closeTag",tagName:"a"}},image:function(e,t){var r=t.getChildrenText,o=t.skipChildren,a=e,s=a.title,l=a.destination;return o(),{type:"openTag",tagName:"img",selfClose:!0,attributes:n.__assign({src:i.escapeXml(l),alt:r(e)},s&&{title:i.escapeXml(s)})}}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.filterDisallowedTags=void 0;var n=new RegExp("<(/?(?:"+["title","textarea","style","xmp","iframe","noembed","noframes","script","plaintext"].join("|")+")[^>]*>)","ig");t.filterDisallowedTags=function(e){return n.test(e)?e.replace(n,(function(e,t){return"&lt;"+t})):e}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.gfmConvertors=void 0;var n=r(0);t.gfmConvertors={strike:function(e,t){return{type:t.entering?"openTag":"closeTag",tagName:"del"}},item:function(e,t){var r=t.entering,i=e.listData,o=i.checked,a=i.task;if(r){var s={type:"openTag",tagName:"li",outerNewLine:!0};return a?[s,{type:"openTag",tagName:"input",selfClose:!0,attributes:n.__assign(n.__assign({},o&&{checked:""}),{disabled:"",type:"checkbox"})},{type:"text",content:" "}]:s}return{type:"closeTag",tagName:"li",outerNewLine:!0}},table:function(e,t){return{type:t.entering?"openTag":"closeTag",tagName:"table",outerNewLine:!0}},tableHead:function(e,t){return{type:t.entering?"openTag":"closeTag",tagName:"thead",outerNewLine:!0}},tableBody:function(e,t){return{type:t.entering?"openTag":"closeTag",tagName:"tbody",outerNewLine:!0}},tableRow:function(e,t){if(t.entering)return{type:"openTag",tagName:"tr",outerNewLine:!0};var r=[];if(e.lastChild)for(var n=e.parent.parent.columns.length,i=e.lastChild.endIdx+1;i<n;i+=1)r.push({type:"openTag",tagName:"td",outerNewLine:!0},{type:"closeTag",tagName:"td",outerNewLine:!0});return r.push({type:"closeTag",tagName:"tr",outerNewLine:!0}),r},tableCell:function(e,t){var r=t.entering;if(e.ignored)return{type:"text",content:""};var i=e.parent.parent,o="tableHead"===i.type?"th":"td",a=i.parent.columns[e.startIdx],s=a&&"left"!==a.align?a.align:null,l=s?{align:s}:null;return r?n.__assign({type:"openTag",tagName:o,outerNewLine:!0},l&&{attributes:l}):{type:"closeTag",tagName:o,outerNewLine:!0}}}}]));

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tui_code_snippet_type_isString__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var tui_code_snippet_type_isString__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_type_isString__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(0);
/**
 * @fileoverview Implements htmlSanitizer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var HTML_ATTR_LIST_RX = new RegExp('^(abbr|align|alt|axis|bgcolor|border|cellpadding|cellspacing|class|clear|' + 'color|cols|compact|coords|dir|face|headers|height|hreflang|hspace|' + 'ismap|lang|language|nohref|nowrap|rel|rev|rows|rules|' + 'scope|scrolling|shape|size|span|start|summary|tabindex|target|title|type|' + 'valign|value|vspace|width|checked|mathvariant|encoding|id|name|' + 'background|cite|href|longdesc|src|usemap|xlink:href|data-+|checked|style)', 'g');
var SVG_ATTR_LIST_RX = new RegExp('^(accent-height|accumulate|additive|alphabetic|arabic-form|ascent|' + 'baseProfile|bbox|begin|by|calcMode|cap-height|class|color|color-rendering|content|' + 'cx|cy|d|dx|dy|descent|display|dur|end|fill|fill-rule|font-family|font-size|font-stretch|' + 'font-style|font-variant|font-weight|from|fx|fy|g1|g2|glyph-name|gradientUnits|hanging|' + 'height|horiz-adv-x|horiz-origin-x|ideographic|k|keyPoints|keySplines|keyTimes|lang|' + 'marker-end|marker-mid|marker-start|markerHeight|markerUnits|markerWidth|mathematical|' + 'max|min|offset|opacity|orient|origin|overline-position|overline-thickness|panose-1|' + 'path|pathLength|points|preserveAspectRatio|r|refX|refY|repeatCount|repeatDur|' + 'requiredExtensions|requiredFeatures|restart|rotate|rx|ry|slope|stemh|stemv|stop-color|' + 'stop-opacity|strikethrough-position|strikethrough-thickness|stroke|stroke-dasharray|' + 'stroke-dashoffset|stroke-linecap|stroke-linejoin|stroke-miterlimit|stroke-opacity|' + 'stroke-width|systemLanguage|target|text-anchor|to|transform|type|u1|u2|underline-position|' + 'underline-thickness|unicode|unicode-range|units-per-em|values|version|viewBox|visibility|' + 'width|widths|x|x-height|x1|x2|xlink:actuate|xlink:arcrole|xlink:role|xlink:show|xlink:title|' + 'xlink:type|xml:base|xml:lang|xml:space|xmlns|xmlns:xlink|y|y1|y2|zoomAndPan)', 'g');
var XSS_ATTR_RX = /href|src|background/gi;
var XSS_VALUE_RX = /((java|vb|live)script|x):/gi;
var ON_EVENT_RX = /^on\S+/;
/**
 * htmlSanitizer
 * @param {string|Node} html - html or Node
 * @param {boolean} [needHtmlText] - pass true if need html text
 * @returns {string|DocumentFragment} - result
 * @ignore
 */

function htmlSanitizer(html, needHtmlText) {
  var root = document.createElement('div');

  if (tui_code_snippet_type_isString__WEBPACK_IMPORTED_MODULE_1___default()(html)) {
    html = html.replace(/<!--[\s\S]*?-->/g, '');
    root.innerHTML = html;
  } else {
    root.appendChild(html);
  }

  removeUnnecessaryTags(root);
  leaveOnlyWhitelistAttribute(root);
  return _utils_dom__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"].finalizeHtml(root, needHtmlText);
}
/**
 * Removes unnecessary tags.
 * @param {HTMLElement} html - root element
 * @private
 */


function removeUnnecessaryTags(html) {
  var removedTags = _utils_dom__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"].findAll(html, 'script, iframe, textarea, form, button, select, input, meta, style, link, title, embed, object, details, summary');
  removedTags.forEach(function (node) {
    _utils_dom__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"].remove(node);
  });
}
/**
 * Checks whether the attribute and value that causing XSS or not.
 * @param {string} attrName - name of attribute
 * @param {string} attrValue - value of attirbute
 * @param {boolean} state
 * @private
 */


function isXSSAttribute(attrName, attrValue) {
  return attrName.match(XSS_ATTR_RX) && attrValue.match(XSS_VALUE_RX);
}
/**
 * Removes attributes of blacklist from node.
 * @param {HTMLElement} node - node to remove attributes
 * @param {NamedNodeMap} blacklistAttrs - attributes of blacklist
 * @private
 */


function removeBlacklistAttributes(node, blacklistAttrs) {
  tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0___default()(blacklistAttrs).forEach(function (_ref) {
    var name = _ref.name;

    if (ON_EVENT_RX.test(name)) {
      node[name] = null;
    }

    if (node.getAttribute(name)) {
      node.removeAttribute(name);
    }
  });
}
/**
 * Leaves only white list attributes.
 * @param {HTMLElement} html - root element
 * @private
 */


function leaveOnlyWhitelistAttribute(html) {
  _utils_dom__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"].findAll(html, '*').forEach(function (node) {
    var attributes = node.attributes;
    var blacklist = tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0___default()(attributes).filter(function (attr) {
      var name = attr.name,
          value = attr.value;
      var htmlAttr = name.match(HTML_ATTR_LIST_RX);
      var svgAttr = name.match(SVG_ATTR_LIST_RX);
      var xssAttr = htmlAttr && isXSSAttribute(name, value);
      return !htmlAttr && !svgAttr || xssAttr;
    });
    removeBlacklistAttributes(node, blacklist);
  });
}

/* harmony default export */ __webpack_exports__["a"] = (htmlSanitizer);

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var tui_code_snippet_array_inArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var tui_code_snippet_array_inArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_array_inArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tui_code_snippet_collection_forEachArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(21);
/* harmony import */ var tui_code_snippet_collection_forEachArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_collection_forEachArray__WEBPACK_IMPORTED_MODULE_1__);


/**
 * @class
 * @ignore
 * @classdesc ES6 Map
 */

var Map = /*#__PURE__*/function () {
  function Map() {
    this._keys = [];
    this._values = [];
  }

  var _proto = Map.prototype;

  _proto._getKeyIndex = function _getKeyIndex(key) {
    return tui_code_snippet_array_inArray__WEBPACK_IMPORTED_MODULE_0___default()(key, this._keys);
  };

  _proto.get = function get(key) {
    return this._values[this._getKeyIndex(key)];
  };

  _proto.set = function set(key, value) {
    var keyIndex = this._getKeyIndex(key);

    if (keyIndex > -1) {
      this._values[keyIndex] = value;
    } else {
      this._keys.push(key);

      this._values.push(value);
    }
  };

  _proto.has = function has(key) {
    return this._getKeyIndex(key) > -1;
  };

  _proto.delete = function _delete(key) {
    var keyIndex = this._getKeyIndex(key);

    if (keyIndex > -1) {
      this._keys.splice(keyIndex, 1);

      this._values.splice(keyIndex, 1);
    }
  };

  _proto.forEach = function forEach(callback, thisArg) {
    var _this = this;

    if (thisArg === void 0) {
      thisArg = this;
    }

    tui_code_snippet_collection_forEachArray__WEBPACK_IMPORTED_MODULE_1___default()(this._values, function (value, index) {
      if (value && _this._keys[index]) {
        callback.call(thisArg, value, _this._keys[index], _this);
      }
    });
  };

  return Map;
}();

/* harmony default export */ __webpack_exports__["a"] = (Map);

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return setOffsetHeight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return setOffsetTop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getOffsetHeight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getOffsetTop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return removeOffsetInfoByNode; });
/* harmony import */ var tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0__);

var offsetInfoMap = {};
function setOffsetHeight(id, height) {
  offsetInfoMap[id] = offsetInfoMap[id] || {};
  offsetInfoMap[id].height = height;
}
function setOffsetTop(id, offsetTop) {
  offsetInfoMap[id] = offsetInfoMap[id] || {};
  offsetInfoMap[id].offsetTop = offsetTop;
}
function getOffsetHeight(id) {
  return offsetInfoMap[id] && offsetInfoMap[id].height;
}
function getOffsetTop(id) {
  return offsetInfoMap[id] && offsetInfoMap[id].offsetTop;
}
function removeOffsetInfoByNode(node) {
  if (node) {
    delete offsetInfoMap[node.getAttribute('data-nodeid')];
    tui_code_snippet_collection_toArray__WEBPACK_IMPORTED_MODULE_0___default()(node.children).forEach(function (child) {
      removeOffsetInfoByNode(child);
    });
  }
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Execute the provided callback once for each property of object(or element of array) which actually exist.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isArray = __webpack_require__(17);
var forEachArray = __webpack_require__(21);
var forEachOwnProperties = __webpack_require__(10);

/**
 * @module collection
 */

/**
 * Execute the provided callback once for each property of object(or element of array) which actually exist.
 * If the object is Array-like object(ex-arguments object), It needs to transform to Array.(see 'ex2' of example).
 * If the callback function returns false, the loop will be stopped.
 * Callback function(iteratee) is invoked with three arguments:
 *  1) The value of the property(or The value of the element)
 *  2) The name of the property(or The index of the element)
 *  3) The object being traversed
 * @param {Object} obj The object that will be traversed
 * @param {function} iteratee Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof module:collection
 * @example
 * var forEach = require('tui-code-snippet/collection/forEach'); // node, commonjs
 *
 * var sum = 0;
 *
 * forEach([1,2,3], function(value){
 *     sum += value;
 * });
 * alert(sum); // 6
 *
 * // In case of Array-like object
 * var array = Array.prototype.slice.call(arrayLike); // change to array
 * forEach(array, function(value){
 *     sum += value;
 * });
 */
function forEach(obj, iteratee, context) {
  if (isArray(obj)) {
    forEachArray(obj, iteratee, context);
  } else {
    forEachOwnProperties(obj, iteratee, context);
  }
}

module.exports = forEach;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is a function or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is a function or not.
 * If the given variable is a function, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is function?
 * @memberof module:type
 */
function isFunction(obj) {
  return obj instanceof Function;
}

module.exports = isFunction;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is existing or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isUndefined = __webpack_require__(8);
var isNull = __webpack_require__(48);

/**
 * Check whether the given variable is existing or not.
 * If the given variable is not null and not undefined, returns true.
 * @param {*} param - Target for checking
 * @returns {boolean} Is existy?
 * @memberof module:type
 * @example
 * var isExisty = require('tui-code-snippet/type/isExisty'); // node, commonjs
 *
 * isExisty(''); //true
 * isExisty(0); //true
 * isExisty([]); //true
 * isExisty({}); //true
 * isExisty(null); //false
 * isExisty(undefined); //false
*/
function isExisty(param) {
  return !isUndefined(param) && !isNull(param);
}

module.exports = isExisty;


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getHTMLRenderConvertors; });
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var baseConvertors = {
  paragraph: function paragraph(node, _ref) {
    var entering = _ref.entering,
        origin = _ref.origin,
        options = _ref.options;
    var nodeId = options.nodeId,
        _options$customProp = options.customProp,
        customProp = _options$customProp === void 0 ? {} : _options$customProp;
    var showFrontMatter = customProp.showFrontMatter && node.customType; // prevent paragraph from being removed when it's child of tight list item
    // to show highlight style in live-preview mode

    if (nodeId && !node.customType || showFrontMatter) {
      return {
        type: entering ? 'openTag' : 'closeTag',
        outerNewLine: true,
        tagName: 'p'
      };
    }

    return origin();
  },
  softbreak: function softbreak(node) {
    var isPrevNodeHTML = node.prev && node.prev.type === 'htmlInline';
    var isPrevBR = isPrevNodeHTML && /<br ?\/?>/.test(node.prev.literal);
    var content = isPrevBR ? '\n' : '<br>\n';
    return {
      type: 'html',
      content: content
    };
  },
  item: function item(node, _ref2) {
    var entering = _ref2.entering;

    if (entering) {
      var attributes = {};
      var classNames = [];

      if (node.listData.task) {
        attributes['data-te-task'] = '';
        classNames.push('task-list-item');

        if (node.listData.checked) {
          classNames.push('checked');
        }
      }

      return {
        type: 'openTag',
        tagName: 'li',
        classNames: classNames,
        attributes: attributes,
        outerNewLine: true
      };
    }

    return {
      type: 'closeTag',
      tagName: 'li',
      outerNewLine: true
    };
  },
  code: function code(node) {
    var attributes = {
      'data-backticks': node.tickCount
    };
    return [{
      type: 'openTag',
      tagName: 'code',
      attributes: attributes
    }, {
      type: 'text',
      content: node.literal
    }, {
      type: 'closeTag',
      tagName: 'code'
    }];
  },
  codeBlock: function codeBlock(node) {
    var infoWords = node.info ? node.info.split(/\s+/) : [];
    var preClasses = [];
    var codeAttrs = {};

    if (node.fenceLength > 3) {
      codeAttrs['data-backticks'] = node.fenceLength;
    }

    if (infoWords.length > 0 && infoWords[0].length > 0) {
      var lang = infoWords[0];
      preClasses.push("lang-" + lang);
      codeAttrs['data-language'] = lang;
    }

    return [{
      type: 'openTag',
      tagName: 'pre',
      classNames: preClasses
    }, {
      type: 'openTag',
      tagName: 'code',
      attributes: codeAttrs
    }, {
      type: 'text',
      content: node.literal
    }, {
      type: 'closeTag',
      tagName: 'code'
    }, {
      type: 'closeTag',
      tagName: 'pre'
    }];
  }
};
function getHTMLRenderConvertors(linkAttribute, customConvertors) {
  var convertors = _extends({}, baseConvertors);

  if (linkAttribute) {
    convertors.link = function (_, _ref3) {
      var entering = _ref3.entering,
          origin = _ref3.origin;
      var result = origin();

      if (entering) {
        result.attributes = _extends({}, result.attributes, linkAttribute);
      }

      return result;
    };
  }

  if (customConvertors) {
    Object.keys(customConvertors).forEach(function (nodeType) {
      var orgConvertor = convertors[nodeType];
      var customConvertor = customConvertors[nodeType];

      if (orgConvertor) {
        convertors[nodeType] = function (node, context) {
          var newContext = _extends({}, context);

          newContext.origin = function () {
            return orgConvertor(node, context);
          };

          return customConvertor(node, newContext);
        };
      } else {
        convertors[nodeType] = customConvertor;
      }
    });
  }

  return convertors;
}

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export CodeBlockManager */
/**
 * @fileoverview Implements CodeBlockManager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Class Code Block Manager
 */
var CodeBlockManager = /*#__PURE__*/function () {
  function CodeBlockManager() {
    this._replacers = {};
  }
  /**
   * Set replacer for code block
   * @param {string} language - code block language
   * @param {function} replacer - replacer function to code block element
   */


  var _proto = CodeBlockManager.prototype;

  _proto.setReplacer = function setReplacer(language, replacer) {
    language = language.toLowerCase();
    this._replacers[language] = replacer;
  }
  /**
   * get replacer for code block
   * @param {string} language - code block type
   * @returns {function} - replacer function
   */
  ;

  _proto.getReplacer = function getReplacer(language) {
    return this._replacers[language];
  }
  /**
   * Create code block html.
   * @param {string} language - code block language
   * @param {string} codeText - code text
   * @returns {string}
   */
  ;

  _proto.createCodeBlockHtml = function createCodeBlockHtml(language, codeText) {
    language = language.toLowerCase();
    var replacer = this.getReplacer(language);

    if (replacer) {
      return replacer(codeText, language);
    }

    return escape(codeText, false);
  };

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


/* harmony default export */ __webpack_exports__["a"] = (new CodeBlockManager());

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return invokePlugins; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getPluginInfo; });
/* harmony import */ var tui_code_snippet_type_isArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var tui_code_snippet_type_isArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_type_isArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tui_code_snippet_type_isFunction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(27);
/* harmony import */ var tui_code_snippet_type_isFunction__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_type_isFunction__WEBPACK_IMPORTED_MODULE_1__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



/**
 * Invoke plugins
 * @param {Array.<Function|Array>} plugins - list of plugin function only or
 *                                  plugin function with options
 * @param {Editor|Viewer} editor - editor or viewer instance
 */

function invokePlugins(plugins, editor) {
  plugins.forEach(function (plugin) {
    if (tui_code_snippet_type_isFunction__WEBPACK_IMPORTED_MODULE_1___default()(plugin)) {
      plugin(editor);
    } else if (tui_code_snippet_type_isArray__WEBPACK_IMPORTED_MODULE_0___default()(plugin)) {
      var pluginFn = plugin[0],
          _plugin$ = plugin[1],
          options = _plugin$ === void 0 ? {} : _plugin$;
      pluginFn(editor, options);
    }
  });
}
/**
 * Get plugin info
 * @param {Array.<Function|Array>} plugins - list of plugin function only or
 *                                  plugin function with options
 * @returns {Object} - plugin info
 */

function getPluginInfo(plugins) {
  if (!plugins) {
    return {};
  }

  return plugins.reduce(function (acc, plugin) {
    var pluginInfo = tui_code_snippet_type_isArray__WEBPACK_IMPORTED_MODULE_0___default()(plugin) ? plugin[0] : plugin;

    if (!tui_code_snippet_type_isFunction__WEBPACK_IMPORTED_MODULE_1___default()(pluginInfo)) {
      var renderer = pluginInfo.renderer,
          parser = pluginInfo.parser,
          pluginFn = pluginInfo.pluginFn;
      plugin = tui_code_snippet_type_isArray__WEBPACK_IMPORTED_MODULE_0___default()(plugin) ? [pluginFn, plugin[1]] : pluginFn;

      if (renderer) {
        acc.renderer = _extends({}, acc.renderer, renderer);
      }

      if (parser) {
        acc.parser = _extends({}, acc.parser, parser);
      }
    }

    acc.plugins.push(plugin);
    return acc;
  }, {
    plugins: [],
    renderer: {},
    parser: {}
  });
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * to-mark
 * @version 1.0.1 | Tue Apr 13 2021
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(window, function() {
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/domRunner.js
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @fileoverview Implements DomRunner
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
var NODE = {
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3
};
/**
 * DomRunner
 * @param {HTMLElement} node A root node that it has nodes to iterate(not iterate itself and its any siblings)
 * @class
 */

var DomRunner = /*#__PURE__*/function () {
  function DomRunner(node) {
    this._normalizeTextChildren(node);

    this._root = node;
    this._current = node;
  }
  /**
   * Iterate next node
   * @returns {HTMLElement} next node
   */


  var _proto = DomRunner.prototype;

  _proto.next = function next() {
    var current = this._current;
    var node;

    if (this._current) {
      node = this._getNextNode(current);

      while (this._isNeedNextSearch(node, current)) {
        current = current.parentNode;
        node = current.nextSibling;
      }

      this._current = node;
    }

    return this._current;
  }
  /**
   * Return current node
   * @returns {HTMLElement} current node
   */
  ;

  _proto.getNode = function getNode() {
    this._normalizeTextChildren(this._current);

    return this._current;
  };

  _proto._normalizeTextChildren = function _normalizeTextChildren(node) {
    if (!node || node.childNodes.length < 2) {
      return;
    }

    var childNode = node.firstChild;
    var nextNode;

    while (childNode.nextSibling) {
      nextNode = childNode.nextSibling;

      if (childNode.nodeType === NODE.TEXT_NODE && nextNode.nodeType === NODE.TEXT_NODE) {
        childNode.nodeValue += nextNode.nodeValue;
        node.removeChild(nextNode);
      } else {
        childNode = nextNode;
      }
    }
  }
  /**
   * Get current node's text content
   * @returns {string} text
   */
  ;

  _proto.getNodeText = function getNodeText() {
    var node = this.getNode();
    var text;

    if (node.nodeType === NODE.TEXT_NODE) {
      text = node.nodeValue;
    } else {
      text = node.textContent || node.innerText;
    }

    return text;
  }
  /**
   * Check if there is next node to iterate
   * @private
   * @param {HTMLElement} node next node
   * @param {HTMLElement} current next node
   * @returns {boolean} result
   */
  ;

  _proto._isNeedNextSearch = function _isNeedNextSearch(node, current) {
    return !node && current !== this._root && current.parentNode !== this._root;
  }
  /**
   * Return available next node
   * @private
   * @param {HTMLElement} current current node
   * @returns {node} next node
   */
  ;

  _proto._getNextNode = function _getNextNode(current) {
    return current.firstChild || current.nextSibling;
  };

  return DomRunner;
}();

_defineProperty(DomRunner, "NODE_TYPE", NODE);


// CONCATENATED MODULE: ./src/toDom.js
/**
 * @fileoverview Implements toDom
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
var FIND_FIRST_LAST_SPACE_OR_RETURN_OR_TAB_RX = /^[\s\r\n\t]+|[\s\r\n\t]+$/g;
var FIND_RETURN_OR_TAB_BETWEEN_TAGS_RX = />[\r\n\t]+</g;
var FIND_WHOLE_SPACE_MORE_THAN_ONE_BETWEEN_TAGS_RX = />[ ]+</g;
/**
 * toDom
 * @exports toDom
 * @param {HTMLElement|string} html DOM Node root or HTML string
 * @returns {HTMLElement[]} dom element
 */

function toDom(html) {
  var wrapper;

  if (Object.prototype.toString.call(html) === '[object String]') {
    wrapper = document.createElement('div');
    wrapper.innerHTML = preProcess(html);
  } else {
    wrapper = html;
  }

  wrapper.__htmlRootByToMark = true;
  return wrapper;
}
/**
 * Pre process for html string
 * @param {string} html Source HTML string
 * @returns {string}
 */

function preProcess(html) {
  // trim text
  html = html.replace(FIND_FIRST_LAST_SPACE_OR_RETURN_OR_TAB_RX, ''); // trim between tags

  html = html.replace(FIND_RETURN_OR_TAB_BETWEEN_TAGS_RX, '><'); // remove spaces more than 1(if need more space, must use &nbsp)

  html = html.replace(FIND_WHOLE_SPACE_MORE_THAN_ONE_BETWEEN_TAGS_RX, '> <');
  return html;
}

toDom.preProcess = preProcess;
// CONCATENATED MODULE: ./src/renderer.js
function renderer_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @fileoverview Implements Renderer
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
var FIND_LEAD_SPACE_RX = /^\u0020/;
var FIND_TRAIL_SPACE_RX = /.+\u0020$/;
var FIND_SPACE_RETURN_TAB_RX = /[\n\s\t]+/g;
var FIND_CHAR_TO_TRIM_RX = /^[\u0020\r\n\t]+|[\u0020\r\n\t]+$/g; // find first and last characters for trim

var FIND_SPACE_MORE_THAN_ONE_RX = /[\u0020]+/g; // find space more than one

var FIND_CHAR_TO_ESCAPE_RX = /[>(){}[\]+-.!#|]/g; // find characters that need escape

var FIND_CHAR_TO_ESCAPE_IN_LINK_RX = /[[\]]/g; // find characters to be escaped in links or images

var FIND_MARKDOWN_IMAGE_SYNTAX_RX = /!\[.*\]\(.*\)/g; // find markdown image syntax

var TEXT_NODE = 3;
/**
 * Iterate properties of object
 * from https://github.com/nhnent/fe.code-snippet/blob/master/src/collection.js
 * @param {object} obj object to iterate
 * @param {function} iteratee callback function
 * @param {*} [context] context of callback
 */

function forEachOwnProperties(obj, iteratee, context) {
  var key;
  context = context || null;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (iteratee.call(context, obj[key], key, obj) === false) {
        break;
      }
    }
  }
}
/**
 * Whether if inline node or not
 * @param {Node} node Element
 * @returns {boolean}
 */
// eslint-disable-next-line complexity


function isInlineNode(node) {
  var tag = node.tagName;
  return tag === 'S' || tag === 'B' || tag === 'I' || tag === 'EM' || tag === 'STRONG' || tag === 'A' || tag === 'IMG' || tag === 'CODE';
}
/**
 * Returns HTML string of an element using given subContent
 * @param {Node} node Element
 * @param {string} subContent string content of node
 * @returns {string}
 */


function getRawHtmlString(node, subContent) {
  var tempNode = node.cloneNode(false);
  tempNode.innerHTML = subContent;
  return tempNode.outerHTML;
}
/**
 * Clone rules
 * @param {object} destination object for apply rules
 * @param {object} source source object for clone rules
 */


function cloneRules(destination, source) {
  forEachOwnProperties(source, function (value, key) {
    if (key !== 'converter') {
      if (!destination[key]) {
        destination[key] = {};
      }

      cloneRules(destination[key], value);
    } else {
      destination[key] = value;
    }
  });
}
/**
 * Renderer
 * @param {object} [rules] rules to add
 * @class
 */


var Renderer = /*#__PURE__*/function () {
  function Renderer(rules) {
    this.rules = {};
    /**
     * Line feed replacement text
     * @type string
     */

    this.lineFeedReplacement = "\u200B\u200B";

    if (rules) {
      this.addRules(rules);
    }
  }
  /**
   * Add rule
   * @param {string} selectorString rule selector
   * @param {function} converter converter function
   */


  var _proto = Renderer.prototype;

  _proto.addRule = function addRule(selectorString, converter) {
    var selectors = selectorString.split(', ');
    var selector = selectors.pop();
    converter.fname = selectorString;

    while (selector) {
      this._setConverterWithSelector(selector, converter);

      selector = selectors.pop();
    }
  }
  /**
   * Add rules using object
   * @param {object} rules key(rule selector), value(converter function)
   */
  ;

  _proto.addRules = function addRules(rules) {
    forEachOwnProperties(rules, function (converter, selectorString) {
      this.addRule(selectorString, converter);
    }, this);
  }
  /**
   * Remove flanked space of dom node
   * @param {string} content text content
   * @param {HTMLElement} node current node
   * @returns {string} result
   */
  // eslint-disable-next-line complexity
  ;

  _proto.getSpaceControlled = function getSpaceControlled(content, node) {
    var lead = '';
    var trail = '';
    var text;

    if (node.previousSibling && (node.previousSibling.nodeType === TEXT_NODE || isInlineNode(node.previousSibling))) {
      text = node.previousSibling.innerHTML || node.previousSibling.nodeValue;

      if (FIND_TRAIL_SPACE_RX.test(text) || FIND_LEAD_SPACE_RX.test(node.innerHTML || node.nodeValue)) {
        lead = ' ';
      }
    }

    if (node.nextSibling && (node.nextSibling.nodeType === TEXT_NODE || isInlineNode(node.nextSibling))) {
      text = node.nextSibling.innerHTML || node.nextSibling.nodeValue;

      if (FIND_LEAD_SPACE_RX.test(text) || FIND_TRAIL_SPACE_RX.test(node.innerHTML || node.nodeValue)) {
        trail = ' ';
      }
    }

    return lead + content + trail;
  }
  /**
   * Convert dom node to markdown using dom node and subContent
   * @param {HTMLElement} node node to convert
   * @param {string} subContent child nodes converted text
   * @returns {string} converted text
   */
  // eslint-disable-next-line complexity
  ;

  _proto.convert = function convert(node, subContent) {
    var result;

    var converter = this._getConverter(node);

    if (node && node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('data-tomark-pass')) {
      node.removeAttribute('data-tomark-pass');
      result = getRawHtmlString(node, subContent);
    } else if (converter) {
      result = converter.call(this, node, subContent);
    } else if (node) {
      result = this.getSpaceControlled(this._getInlineHtml(node, subContent), node);
    }

    return result || '';
  };

  _proto._getInlineHtml = function _getInlineHtml(node, subContent) {
    var html = node.outerHTML;
    var tagName = node.tagName;
    var escapedSubContent = subContent.replace(/\$/g, '$$$$'); // escape $: replace all $ char to $$ before we throw this string to replace

    return html.replace(new RegExp("(<" + tagName + " ?.*?>).*(</" + tagName + ">)", 'i'), "$1" + escapedSubContent + "$2");
  }
  /**
   * Get converter function for node
   * @private
   * @param {HTMLElement} node node
   * @returns {function} converter function
   */
  ;

  _proto._getConverter = function _getConverter(node) {
    var rulePointer = this.rules;
    var converter;

    while (node && rulePointer) {
      rulePointer = this._getNextRule(rulePointer, this._getRuleNameFromNode(node));
      node = this._getPrevNode(node);

      if (rulePointer && rulePointer.converter) {
        converter = rulePointer.converter;
      }
    }

    return converter;
  }
  /**
   * Get next rule object
   * @private
   * @param {object} ruleObj rule object
   * @param {string} ruleName rule tag name to find
   * @returns {object} rule Object
   */
  ;

  _proto._getNextRule = function _getNextRule(ruleObj, ruleName) {
    return ruleObj[ruleName];
  }
  /**
   * Get proper rule tag name from node
   * @private
   * @param {HTMLElement} node node
   * @returns {string} rule tag name
   */
  ;

  _proto._getRuleNameFromNode = function _getRuleNameFromNode(node) {
    return node.tagName || 'TEXT_NODE';
  }
  /**
   * Get node's available parent node
   * @private
   * @param {HTMLElement} node node
   * @returns {HTMLElement | undefined} result
   */
  ;

  _proto._getPrevNode = function _getPrevNode(node) {
    var parentNode = node.parentNode;
    var previousNode;

    if (parentNode && !parentNode.__htmlRootByToMark) {
      previousNode = parentNode;
    }

    return previousNode;
  }
  /**
   * Set converter for selector
   * @private
   * @param {string} selectors rule selector
   * @param {function} converter converter function
   */
  ;

  _proto._setConverterWithSelector = function _setConverterWithSelector(selectors, converter) {
    var rulePointer = this.rules;

    this._eachSelector(selectors, function (ruleElem) {
      if (!rulePointer[ruleElem]) {
        rulePointer[ruleElem] = {};
      }

      rulePointer = rulePointer[ruleElem];
    });

    rulePointer.converter = converter;
  }
  /**
   * Iterate each selectors
   * @private
   * @param {string} selectors rule selectors
   * @param {function} iteratee callback
   */
  ;

  _proto._eachSelector = function _eachSelector(selectors, iteratee) {
    var selectorArray = selectors.split(' ');
    var selectorIndex = selectorArray.length - 1;

    while (selectorIndex >= 0) {
      iteratee(selectorArray[selectorIndex]);
      selectorIndex -= 1;
    }
  }
  /**
   * Trim text
   * @param {string} text text be trimed
   * @returns {string} trimed text
   */
  ;

  _proto.trim = function trim(text) {
    return text.replace(FIND_CHAR_TO_TRIM_RX, '');
  }
  /**
   * Returns whether text empty or not
   * @param {string} text text be checked
   * @returns {boolean} result
   */
  ;

  _proto.isEmptyText = function isEmptyText(text) {
    return text.replace(FIND_SPACE_RETURN_TAB_RX, '') === '';
  }
  /**
   * Collape space more than 2
   * @param {string} text text be collapsed
   * @returns {string} result
   */
  ;

  _proto.getSpaceCollapsedText = function getSpaceCollapsedText(text) {
    return text.replace(FIND_SPACE_MORE_THAN_ONE_RX, ' ');
  }
  /**
   * Apply backslash escape to text
   * @param {string} text text be processed
   * @returns {string} processed text
   */
  ;

  _proto.escapeText = function escapeText(text) {
    return text.replace(FIND_CHAR_TO_ESCAPE_RX, function (matched) {
      return "\\" + matched;
    });
  }
  /**
   * Escape given text for link
   * @param {string} text - text be processed
   * @returns {string} - processed text
   */
  ;

  _proto.escapeTextForLink = function escapeTextForLink(text) {
    var imageSyntaxRanges = [];
    var result = FIND_MARKDOWN_IMAGE_SYNTAX_RX.exec(text);

    while (result) {
      imageSyntaxRanges.push([result.index, result.index + result[0].length]);
      result = FIND_MARKDOWN_IMAGE_SYNTAX_RX.exec(text);
    }

    return text.replace(FIND_CHAR_TO_ESCAPE_IN_LINK_RX, function (matched, offset) {
      var isDelimiter = imageSyntaxRanges.some(function (range) {
        return offset > range[0] && offset < range[1];
      });
      return isDelimiter ? matched : "\\" + matched;
    });
  }
  /**
   * Backslash escape to text for html
   * Apply backslash escape to text
   * @param {string} text text be processed
   * @returns {string} processed text
   */
  ;

  _proto.escapeTextHtml = function escapeTextHtml(text) {
    return text.replace(new RegExp(Renderer.markdownTextToEscapeHtmlRx.source, 'g'), function (matched) {
      return "\\" + matched;
    });
  }
  /**
   * Backslash is using for escape ASCII punctuation character.
   * https://spec.commonmark.org/0.29/#backslash-escapes
   * If user input backslash as text, backslash is kept by inserting backslash.
   * For example, if input text is "\$", this text is changed "\\$"
   * @param {string} text text be processed
   * @returns {string} processed text
   */
  ;

  _proto.escapeTextBackSlash = function escapeTextBackSlash(text) {
    return text.replace(new RegExp(Renderer.markdownTextToEscapeBackSlashRx.source, 'g'), function (matched) {
      return "\\" + matched;
    });
  }
  /**
   * Escapes in markdown paired characters
   * @param {string} text Text to escape
   * @returns {string} escaped text
   */
  ;

  _proto.escapePairedCharacters = function escapePairedCharacters(text) {
    return text.replace(new RegExp(Renderer.markdownTextToEscapePairedCharsRx.source, 'g'), function (matched) {
      return "\\" + matched;
    });
  };

  _proto._isNeedEscape = function _isNeedEscape(text) {
    var res = false;
    var markdownTextToEscapeRx = Renderer.markdownTextToEscapeRx;
    var type;

    for (type in markdownTextToEscapeRx) {
      if (markdownTextToEscapeRx.hasOwnProperty(type) && markdownTextToEscapeRx[type].test(text)) {
        res = true;
        break;
      }
    }

    return res;
  };

  _proto._isNeedEscapeHtml = function _isNeedEscapeHtml(text) {
    return Renderer.markdownTextToEscapeHtmlRx.test(text);
  };

  _proto._isNeedEscapeBackSlash = function _isNeedEscapeBackSlash(text) {
    return Renderer.markdownTextToEscapeBackSlashRx.test(text);
  };

  _proto.mix = function mix(renderer) {
    cloneRules(this.rules, renderer.rules);
  }
  /**
   * Renderer factory
   * Return new renderer
   * @param {Renderer} srcRenderer renderer to extend
   * @param {object} rules rule object, key(rule selector), value(converter function)
   * @returns {Renderer} renderer
   */
  ;

  Renderer.factory = function factory(srcRenderer, rules) {
    var renderer = new Renderer();

    if (!rules) {
      rules = srcRenderer;
    } else {
      renderer.mix(srcRenderer);
    }

    renderer.addRules(rules);
    return renderer;
  };

  return Renderer;
}();

renderer_defineProperty(Renderer, "markdownTextToEscapeRx", {
  codeblock: /(^ {4}[^\n]+\n*)+/,
  hr: /^ *((\* *){3,}|(- *){3,} *|(_ *){3,}) */,
  heading: /^(#{1,6}) +[\s\S]+/,
  lheading: /^([^\n]+)\n *(=|-){2,} */,
  blockquote: /^( *>[^\n]+.*)+/,
  list: /^ *(\*+|-+|\d+\.) [\s\S]+/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? */,
  link: /!?\[.*\]\(.*\)/,
  reflink: /!?\[.*\]\s*\[([^\]]*)\]/,
  verticalBar: /\u007C/,
  codeblockGfm: /^(`{3,})/,
  codeblockTildes: /^(~{3,})/
});

renderer_defineProperty(Renderer, "markdownTextToEscapeHtmlRx", /<([a-zA-Z_][a-zA-Z0-9\-._]*)(\s|[^\\/>])*\/?>|<(\/)([a-zA-Z_][a-zA-Z0-9\-._]*)\s*\/?>|<!--[^-]+-->|<([a-zA-Z_][a-zA-Z0-9\-.:/]*)>/);

renderer_defineProperty(Renderer, "markdownTextToEscapeBackSlashRx", /\\[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\\]/);

renderer_defineProperty(Renderer, "markdownTextToEscapePairedCharsRx", /[*_~`]/);


// CONCATENATED MODULE: ./src/renderer.basic.js
/**
 * @fileoverview Implements basicRenderer
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

var FIND_LAST_RETURN_RX = /\n$/g;
var FIND_BR_AND_RETURN_RX = /[ \xA0]+\n\n/g;
var FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX = /([ \xA0]+\n){2,}/g;
var FIND_LINK_HREF = /href="(.*?)"/;
var START_OF_LINES_RX = /^/gm;
/**
 * Basic Markdown Renderer
 * @exports basicRenderer
 * @augments Renderer
 */

/* harmony default export */ var renderer_basic = (Renderer.factory({
  // inlines
  TEXT_NODE: function TEXT_NODE(node) {
    var managedText = this.trim(this.getSpaceCollapsedText(node.nodeValue));

    if (this._isNeedEscapeBackSlash(managedText)) {
      managedText = this.escapeTextBackSlash(managedText);
    }

    managedText = this.escapePairedCharacters(managedText);

    if (this._isNeedEscapeHtml(managedText)) {
      managedText = this.escapeTextHtml(managedText);
    }

    if (this._isNeedEscape(managedText)) {
      managedText = this.escapeText(managedText);
    }

    return this.getSpaceControlled(managedText, node);
  },
  'CODE TEXT_NODE': function CODETEXT_NODE(node) {
    return node.nodeValue;
  },
  'EM, I': function EMI(node, subContent) {
    var res = '';

    if (!this.isEmptyText(subContent)) {
      res = "*" + subContent + "*";
    }

    return res;
  },
  'STRONG, B': function STRONGB(node, subContent) {
    var res = '';

    if (!this.isEmptyText(subContent)) {
      res = "**" + subContent + "**";
    }

    return res;
  },
  A: function A(node, subContent) {
    var res = subContent;
    var title = '';
    var url; // "href" attribute is difficult to predict depending on the situation
    // so use as it is applied to html

    var foundedHref = FIND_LINK_HREF.exec(node.outerHTML);

    if (foundedHref) {
      url = foundedHref[1].replace(/&amp;/g, '&');
    }

    if (node.title) {
      title = " \"" + node.title + "\"";
    }

    if (!this.isEmptyText(subContent) && url) {
      res = "[" + this.escapeTextForLink(subContent) + "](" + url + title + ")";
    }

    return res;
  },
  IMG: function IMG(node) {
    var src = node.getAttribute('src');
    var alt = node.alt;

    if (src) {
      return "![" + this.escapeTextForLink(alt) + "](" + src + ")";
    }

    return '';
  },
  BR: function BR() {
    return '  \n';
  },
  CODE: function CODE(node, subContent) {
    var backticks, numBackticks;
    var res = '';

    if (!this.isEmptyText(subContent)) {
      numBackticks = parseInt(node.getAttribute('data-backticks'), 10);
      backticks = isNaN(numBackticks) ? '`' : Array(numBackticks + 1).join('`');
      res = backticks + subContent + backticks;
    }

    return res;
  },
  // Paragraphs
  P: function P(node, subContent) {
    var res = ''; // convert multiple brs to one br

    subContent = subContent.replace(FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX, '  \n');

    if (!this.isEmptyText(subContent)) {
      res = "\n\n" + subContent + "\n\n";
    }

    return res;
  },
  'BLOCKQUOTE P': function BLOCKQUOTEP(node, subContent) {
    return subContent;
  },
  'LI P': function LIP(node, subContent) {
    var res = '';

    if (!this.isEmptyText(subContent)) {
      res = subContent;
    }

    return res;
  },
  // Headings
  'H1, H2, H3, H4, H5, H6': function H1H2H3H4H5H6(node, subContent) {
    var res = '';
    var headingNumber = parseInt(node.tagName.charAt(1), 10);

    while (headingNumber) {
      res += '#';
      headingNumber -= 1;
    }

    res += ' ';
    res += subContent;
    return "\n\n" + res + "\n\n";
  },
  'LI H1, LI H2, LI H3, LI H4, LI H5, LI H6': function LIH1LIH2LIH3LIH4LIH5LIH6(node, subContent) {
    var headingNumber = parseInt(node.tagName.charAt(1), 10);
    return Array(headingNumber + 1).join('#') + " " + subContent;
  },
  // List
  'UL, OL': function ULOL(node, subContent) {
    return "\n\n" + subContent + "\n\n";
  },
  'LI OL, LI UL': function LIOLLIUL(node, subContent) {
    var processedSubContent; // remove last br of li

    processedSubContent = subContent.replace(FIND_BR_AND_RETURN_RX, '\n'); // parent LI converter add \n too, so we remove last return

    processedSubContent = processedSubContent.replace(FIND_LAST_RETURN_RX, '');
    var res = processedSubContent.replace(START_OF_LINES_RX, '    ');
    return "\n" + res;
  },
  'UL LI': function ULLI(node, subContent) {
    var res = ''; // convert multiple brs to one br

    subContent = subContent.replace(FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX, '  \n');

    if (node.firstChild && node.firstChild.tagName === 'P') {
      res += '\n';
    }

    res += "* " + subContent + "\n";
    return res;
  },
  // eslint-disable-next-line complexity
  'OL LI': function OLLI(node, subContent) {
    var res = '';
    var liCounter = parseInt(node.parentNode.getAttribute('start') || 1, 10);

    while (node.previousSibling) {
      node = node.previousSibling;

      if (node.nodeType === 1 && node.tagName === 'LI') {
        liCounter += 1;
      }
    } // convert multiple brs to one br


    subContent = subContent.replace(FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX, '  \n');

    if (node.firstChild && node.firstChild.tagName === 'P') {
      res += '\n';
    }

    res += liCounter + ". " + subContent + "\n";
    return res;
  },
  // HR
  HR: function HR() {
    return '\n\n- - -\n\n';
  },
  // Blockquote
  BLOCKQUOTE: function BLOCKQUOTE(node, subContent) {
    // convert multiple brs to one emptyline
    subContent = subContent.replace(FIND_MULTIPLE_EMPTYLINE_BETWEEN_TEXT_RX, '\n\n');
    var trimmedText = this.trim(subContent);
    var res = trimmedText.replace(START_OF_LINES_RX, '> ');
    return "\n\n" + res + "\n\n";
  },
  // Code Block
  'PRE CODE': function PRECODE(node, subContent) {
    var lastNremoved = subContent.replace(FIND_LAST_RETURN_RX, '');
    var res = lastNremoved.replace(START_OF_LINES_RX, '    ');
    return "\n\n" + res + "\n\n";
  }
}));
// CONCATENATED MODULE: ./src/renderer.gfm.js
/**
 * @fileoverview Implements Github flavored markdown renderer
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */


/**
 * gfmRenderer
 * github flavored Markdown Renderer
 *
 * we didnt render gfm br here because we need distingush returns that made by block with br
 * so we render gfm br later in toMark.js finalize function
 * @exports gfmRenderer
 * @augments Renderer
 */

/* harmony default export */ var renderer_gfm = (Renderer.factory(renderer_basic, {
  'DEL, S': function DELS(node, subContent) {
    return "~~" + subContent + "~~";
  },
  'PRE CODE': function PRECODE(node, subContent) {
    var language = '';
    var numberOfBackticks = node.getAttribute('data-backticks');

    if (node.getAttribute('data-language')) {
      language = " " + node.getAttribute('data-language');
    }

    numberOfBackticks = parseInt(numberOfBackticks, 10);
    var backticks = isNaN(numberOfBackticks) ? '```' : Array(numberOfBackticks + 1).join('`');
    subContent = subContent.replace(/(\r\n)|(\r)|(\n)/g, this.lineFeedReplacement);
    return "\n\n" + backticks + language + "\n" + subContent + "\n" + backticks + "\n\n";
  },
  PRE: function PRE(node, subContent) {
    return subContent;
  },
  'UL LI': function ULLI(node, subContent) {
    return renderer_basic.convert(node, makeTaskIfNeed(node, subContent));
  },
  'OL LI': function OLLI(node, subContent) {
    return renderer_basic.convert(node, makeTaskIfNeed(node, subContent));
  },
  // Table
  TABLE: function TABLE(node, subContent) {
    return "\n\n" + subContent + "\n\n";
  },
  'TBODY, TFOOT': function TBODYTFOOT(node, subContent) {
    return subContent;
  },
  'TR TD, TR TH': function TRTDTRTH(node, subContent) {
    subContent = subContent.replace(/(\r\n)|(\r)|(\n)/g, '');
    return " " + subContent + " |";
  },
  'TD BR, TH BR': function TDBRTHBR() {
    return '<br>';
  },
  TR: function TR(node, subContent) {
    return "|" + subContent + "\n";
  },
  THEAD: function THEAD(node, subContent) {
    var result = '';
    var ths = findChildTag(findChildTag(node, 'TR')[0], 'TH');

    for (var i = 0, thsLength = ths.length; i < thsLength; i += 1) {
      result += " " + makeTableHeadAlignText(ths[i]) + " |";
    }

    return subContent ? subContent + "|" + result + "\n" : '';
  }
}));
/**
 * Make task Markdown string if need
 * @param {HTMLElement} node Passed HTML Element
 * @param {string} subContent node's content
 * @returns {string}
 */

function makeTaskIfNeed(node, subContent) {
  var condition;

  if (node.className.indexOf('task-list-item') !== -1) {
    condition = node.className.indexOf('checked') !== -1 ? 'x' : ' ';
    subContent = "[" + condition + "] " + subContent;
  }

  return subContent;
}
/**
 * Make table head align text
 * @param {HTMLElement} th Table head cell element
 * @returns {string}
 */


function makeTableHeadAlignText(th) {
  var leftAlignValue, rightAlignValue, textLength;
  var align = th.align;
  textLength = th.textContent ? th.textContent.length : th.innerText.length;
  leftAlignValue = '';
  rightAlignValue = '';

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

  return leftAlignValue + repeatString('-', textLength) + rightAlignValue;
}
/**
 * Find child element of given tag name
 * @param {HTMLElement} node starting element
 * @param {string} tagName Tag name for search
 * @returns {Array.<HTMLElement>}
 */


function findChildTag(node, tagName) {
  var childNodes = node.childNodes;
  var result = [];

  for (var i = 0, childLength = childNodes.length; i < childLength; i += 1) {
    if (childNodes[i].tagName && childNodes[i].tagName === tagName) {
      result.push(childNodes[i]);
    }
  }

  return result;
}
/**
 * Repeat given string
 * @param {string} pattern String for repeat
 * @param {number} count Amount of repeat
 * @returns {string}
 */


function repeatString(pattern, count) {
  var result = pattern;
  count = Math.max(count, 3);

  while (count > 1) {
    result += pattern;
    count -= 1;
  }

  return result;
}
// CONCATENATED MODULE: ./src/toMark.js
/**
 * @fileoverview Implements toMark
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */




var FIND_UNUSED_BRS_RX = /[ \xA0]+(\n\n)/g;
var FIND_FIRST_LAST_WITH_SPACE_RETURNS_RX = /^[\n]+|[\s\n]+$/g;
var FIND_MULTIPLE_BRS_RX = /([ \xA0]+\n){2,}/g;
var FIND_RETURNS_RX = /([ \xA0]){2,}\n/g;
var FIND_RETURNS_AND_SPACE_RX = /[ \xA0\n]+/g;
/**
 * @exports toMark
 * @param {string} htmlStr html string to convert
 * @param {object} options option
 * @param {boolean} options.gfm if this property is false turn off it cant parse gfm
 * @param {Renderer} options.renderer pass renderer to use
 * @returns {string} converted markdown text
 * @example
 * toMark('<h1>hello world</h1>'); // "# hello world"
 * toMark('<del>strike</del>'); // "~~strike~~"
 * toMark('<del>strike</del>', {gfm: false}); // "strike"
 */

function toMark(htmlStr, options) {
  var isGfm = true;
  var renderer;

  if (!htmlStr) {
    return '';
  }

  renderer = renderer_gfm;

  if (options) {
    isGfm = options.gfm;

    if (isGfm === false) {
      renderer = renderer_basic;
    }

    renderer = options.renderer || renderer;
  }

  var runner = new DomRunner(toDom(htmlStr));
  return finalize(parse(runner, renderer), isGfm, renderer.lineFeedReplacement);
}
/**
 * Parse dom to markdown
 * @param {DomRunner} runner runner
 * @param {Renderer} renderer renderer
 * @returns {string} markdown text
 */

function parse(runner, renderer) {
  var markdownContent = '';

  while (runner.next()) {
    markdownContent += tracker(runner, renderer);
  }

  return markdownContent;
}
/**
 * Remove first and last return character
 * @param {string} text text to finalize
 * @param {boolean} isGfm isGfm flag
 * @param {string} lineFeedReplacement Line feed replacement text
 * @returns {string} result
 */


function finalize(text, isGfm, lineFeedReplacement) {
  // collapse return and <br>
  text = text.replace(FIND_UNUSED_BRS_RX, '\n'); // collapse multiple br

  text = text.replace(FIND_MULTIPLE_BRS_RX, '\n\n');
  text = text.replace(FIND_RETURNS_AND_SPACE_RX, function (matched) {
    var returnCount = (matched.match(/\n/g) || []).length;

    if (returnCount >= 3) {
      return '\n\n';
    }

    if (matched >= 1) {
      return '\n';
    }

    return matched;
  }); // remove first and last \n

  text = text.replace(FIND_FIRST_LAST_WITH_SPACE_RETURNS_RX, '');
  text = text.replace(new RegExp(lineFeedReplacement, 'g'), '\n'); // in gfm replace '  \n' make by <br> to '\n'

  if (isGfm) {
    text = text.replace(FIND_RETURNS_RX, '\n');
  }

  return text;
}
/**
 * Iterate childNodes and process conversion using recursive call
 * @param {DomRunner} runner dom runner
 * @param {Renderer} renderer renderer to use
 * @returns {string} processed text
 */


function tracker(runner, renderer) {
  var subContent = '';
  var node = runner.getNode();

  for (var i = 0, t = node.childNodes.length; i < t; i += 1) {
    runner.next();
    subContent += tracker(runner, renderer);
  }

  return renderer.convert(node, subContent);
}
// CONCATENATED MODULE: ./src/index.js
/**
 * @fileoverview Implements entry point
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */




toMark.Renderer = Renderer;
toMark.basicRenderer = renderer_basic;
toMark.gfmRenderer = renderer_gfm;
/* harmony default export */ var src = __webpack_exports__["default"] = (toMark);

/***/ })
/******/ ])["default"];
});

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Get HTML element's design classes.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isUndefined = __webpack_require__(8);

/**
 * Get HTML element's design classes.
 * @param {(HTMLElement|SVGElement)} element target element
 * @returns {string} element css class name
 * @memberof module:domUtil
 */
function getClass(element) {
  if (!element || !element.className) {
    return '';
  }

  if (isUndefined(element.className.baseVal)) {
    return element.className;
  }

  return element.className.baseVal;
}

module.exports = getClass;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is a number or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is a number or not.
 * If the given variable is a number, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is number?
 * @memberof module:type
 */
function isNumber(obj) {
  return typeof obj === 'number' || obj instanceof Number;
}

module.exports = isNumber;


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export CLASS_HIGHLIGHT */
/* harmony import */ var tui_code_snippet_domEvent_on__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);
/* harmony import */ var tui_code_snippet_domEvent_on__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_domEvent_on__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tui_code_snippet_domEvent_off__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(20);
/* harmony import */ var tui_code_snippet_domEvent_off__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_domEvent_off__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tui_code_snippet_domUtil_addClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony import */ var tui_code_snippet_domUtil_addClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_domUtil_addClass__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var tui_code_snippet_domUtil_removeClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6);
/* harmony import */ var tui_code_snippet_domUtil_removeClass__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_domUtil_removeClass__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _toast_ui_toastmark__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(22);
/* harmony import */ var _toast_ui_toastmark__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_toast_ui_toastmark__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _preview__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(38);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(0);
/* harmony import */ var _htmlRenderConvertors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(29);
/* harmony import */ var _scroll_helper__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(18);
/* harmony import */ var _scroll_cache_offsetInfo__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(25);
/* harmony import */ var _utils_markdown__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(2);
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileoverview Implements markdown preview
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */











var CLASS_HIGHLIGHT = 'te-preview-highlight';

function findTableCell(tableRow, _ref) {
  var ch = _ref.ch;
  var cell = tableRow.firstChild;

  while (cell && cell.next) {
    if (Object(_utils_markdown__WEBPACK_IMPORTED_MODULE_10__[/* getMdStartCh */ "e"])(cell.next) > ch + 1) {
      break;
    }

    cell = cell.next;
  }

  return cell;
}
/**
 * Class Markdown Preview
 * @param {HTMLElement} el - base element
 * @param {EventManager} eventManager - event manager
 * @param {Convertor} convertor - convertor
 * @param {object} options
 * @param {boolean} options.isViewer - true for view-only mode
 * @param {boolean} options.highlight - true for using live-highlight feature
 * @param {object} opitons.linkAttribute - attributes for link element
 * @param {object} opitons.customHTMLRenderer - map of custom HTML render functions

 * @ignore
 */


var MarkdownPreview = /*#__PURE__*/function (_Preview) {
  _inheritsLoose(MarkdownPreview, _Preview);

  function MarkdownPreview(el, eventManager, convertor, options) {
    var _this;

    _this = _Preview.call(this, el, eventManager, convertor, options.isViewer) || this;

    _this.lazyRunner.registerLazyRunFunction('invokeCodeBlock', _this.invokeCodeBlockPlugins, _this.delayCodeBlockTime, _assertThisInitialized(_this));

    var linkAttribute = options.linkAttribute,
        customHTMLRenderer = options.customHTMLRenderer,
        _options$highlight = options.highlight,
        highlight = _options$highlight === void 0 ? false : _options$highlight;
    _this.renderHTML = Object(_toast_ui_toastmark__WEBPACK_IMPORTED_MODULE_4__["createRenderHTML"])({
      gfm: true,
      nodeId: true,
      convertors: Object(_htmlRenderConvertors__WEBPACK_IMPORTED_MODULE_7__[/* getHTMLRenderConvertors */ "a"])(linkAttribute, customHTMLRenderer)
    });
    _this.cursorNodeId = null;

    _this._initEvent(highlight);

    return _this;
  }
  /**
   * Initialize event
   * @private
   */


  var _proto = MarkdownPreview.prototype;

  _proto._initEvent = function _initEvent(highlight) {
    var _this2 = this;

    this.eventManager.listen('contentChangedFromMarkdown', this.update.bind(this)); // need to implement a listener function for 'previewNeedsRefresh' event
    // to support third-party plugins which requires re-executing script for every re-render

    if (highlight) {
      this.eventManager.listen('cursorActivity', function (_ref2) {
        var markdownNode = _ref2.markdownNode,
            cursor = _ref2.cursor;

        _this2._updateCursorNode(markdownNode, cursor);
      });
      this.eventManager.listen('blur', function () {
        _this2._removeHighlight();
      });
    }

    tui_code_snippet_domEvent_on__WEBPACK_IMPORTED_MODULE_0___default()(this.el, 'scroll', function (event) {
      _this2.eventManager.emit('scroll', {
        source: 'preview',
        data: Object(_scroll_helper__WEBPACK_IMPORTED_MODULE_8__[/* findAdjacentElementToScrollTop */ "a"])(event.target.scrollTop, _this2._previewContent)
      });
    });
  };

  _proto._removeHighlight = function _removeHighlight() {
    if (this.cursorNodeId) {
      var currentEl = this._getElementByNodeId(this.cursorNodeId);

      if (currentEl) {
        tui_code_snippet_domUtil_removeClass__WEBPACK_IMPORTED_MODULE_3___default()(currentEl, CLASS_HIGHLIGHT);
      }
    }
  };

  _proto._updateCursorNode = function _updateCursorNode(cursorNode, cursorPos) {
    if (cursorNode) {
      cursorNode = Object(_utils_markdown__WEBPACK_IMPORTED_MODULE_10__[/* findClosestNode */ "b"])(cursorNode, function (mdNode) {
        return !Object(_utils_markdown__WEBPACK_IMPORTED_MODULE_10__[/* isInlineNode */ "h"])(mdNode);
      });

      if (cursorNode.type === 'tableRow') {
        cursorNode = findTableCell(cursorNode, cursorPos);
      } else if (cursorNode.type === 'tableBody') {
        // empty line next to table
        cursorNode = null;
      }
    }

    var cursorNodeId = cursorNode ? cursorNode.id : null;

    if (this.cursorNodeId === cursorNodeId) {
      return;
    }

    var inFrontMatter = cursorNode && cursorNode.customType === 'frontMatter';

    var oldEL = this._getElementByNodeId(this.cursorNodeId);

    var newEL = this._getElementByNodeId(cursorNodeId);

    if (oldEL) {
      tui_code_snippet_domUtil_removeClass__WEBPACK_IMPORTED_MODULE_3___default()(oldEL, CLASS_HIGHLIGHT);
    }

    if (newEL && !inFrontMatter) {
      tui_code_snippet_domUtil_addClass__WEBPACK_IMPORTED_MODULE_2___default()(newEL, CLASS_HIGHLIGHT);
    }

    this.cursorNodeId = cursorNodeId;
  };

  _proto._getElementByNodeId = function _getElementByNodeId(nodeId) {
    if (!nodeId) {
      return null;
    }

    return this._previewContent.querySelector("[data-nodeid=\"" + nodeId + "\"]");
  };

  _proto.update = function update(changed) {
    var _this3 = this;

    changed.forEach(function (editResult) {
      return _this3.replaceRangeNodes(editResult);
    });
    this.eventManager.emit('previewRenderAfter', this);
  };

  _proto.replaceRangeNodes = function replaceRangeNodes(editResult) {
    var _this4 = this;

    var nodes = editResult.nodes,
        removedNodeRange = editResult.removedNodeRange;
    var contentEl = this._previewContent;
    var newHtml = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', nodes.map(function (node) {
      return _this4.renderHTML(node);
    }).join(''));

    if (!removedNodeRange) {
      contentEl.insertAdjacentHTML('afterbegin', newHtml);
    } else {
      var _removedNodeRange$id = removedNodeRange.id,
          startNodeId = _removedNodeRange$id[0],
          endNodeId = _removedNodeRange$id[1];

      var startEl = this._getElementByNodeId(startNodeId);

      var endEl = this._getElementByNodeId(endNodeId);

      if (startEl) {
        var _el;

        startEl.insertAdjacentHTML('beforebegin', newHtml);
        var el = startEl;

        while (el && el !== endEl) {
          var nextEl = el.nextElementSibling;
          el.parentNode.removeChild(el);
          Object(_scroll_cache_offsetInfo__WEBPACK_IMPORTED_MODULE_9__[/* removeOffsetInfoByNode */ "c"])(el);
          el = nextEl;
        }

        if ((_el = el) == null ? void 0 : _el.parentNode) {
          _utils_dom__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"].remove(el);
          Object(_scroll_cache_offsetInfo__WEBPACK_IMPORTED_MODULE_9__[/* removeOffsetInfoByNode */ "c"])(el);
        }
      }
    }

    var codeBlockEls = this.getCodeBlockElements(nodes.map(function (node) {
      return node.id;
    }));

    if (codeBlockEls.length) {
      this.lazyRunner.run('invokeCodeBlock', codeBlockEls);
    }
  }
  /**
   * render
   * @param {string} html - html string to render
   * @override
   */
  ;

  _proto.render = function render(html) {
    _Preview.prototype.render.call(this, html);

    this.eventManager.emit('previewRenderAfter', this);
  };

  _proto.remove = function remove() {
    tui_code_snippet_domEvent_off__WEBPACK_IMPORTED_MODULE_1___default()(this.el, 'scroll');
    this.el = null;
  };

  return MarkdownPreview;
}(_preview__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"]);

/* harmony default export */ __webpack_exports__["a"] = (MarkdownPreview);

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var tui_code_snippet_collection_forEachOwnProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var tui_code_snippet_collection_forEachOwnProperties__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_collection_forEachOwnProperties__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tui_code_snippet_type_isUndefined__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var tui_code_snippet_type_isUndefined__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_type_isUndefined__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tui_code_snippet_type_isFalsy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(44);
/* harmony import */ var tui_code_snippet_type_isFalsy__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_type_isFalsy__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var tui_code_snippet_enum_enum__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(45);
/* harmony import */ var tui_code_snippet_enum_enum__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_enum_enum__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils_map__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(24);
/**
 * @fileoverview Implements EventManager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */





var eventList = ['previewBeforeHook', 'previewRenderAfter', 'previewNeedsRefresh', 'addImageBlobHook', 'setMarkdownAfter', 'contentChangedFromWysiwyg', 'changeFromWysiwyg', 'contentChangedFromMarkdown', 'changeFromMarkdown', 'change', 'changeModeToWysiwyg', 'changeModeToMarkdown', 'changeModeBefore', 'changeMode', 'changePreviewStyle', 'changePreviewTabPreview', 'changePreviewTabWrite', 'openPopupAddLink', 'openPopupAddImage', 'openPopupAddTable', 'openPopupTableUtils', 'openHeadingSelect', 'openPopupCodeBlockLanguages', 'openPopupCodeBlockEditor', 'openDropdownToolbar', 'closePopupCodeBlockLanguages', 'closePopupCodeBlockEditor', 'closeAllPopup', 'command', 'addCommandBefore', 'htmlUpdate', 'markdownUpdate', 'renderedHtmlUpdated', 'removeEditor', 'convertorAfterMarkdownToHtmlConverted', 'convertorBeforeHtmlToMarkdownConverted', 'convertorAfterHtmlToMarkdownConverted', 'stateChange', 'wysiwygSetValueAfter', 'wysiwygSetValueBefore', 'wysiwygGetValueBefore', 'wysiwygProcessHTMLText', 'wysiwygRangeChangeAfter', 'wysiwygKeyEvent', 'scroll', 'click', 'mousedown', 'mouseover', 'mouseout', 'mouseup', 'contextmenu', 'keydown', 'keyup', 'keyMap', 'load', 'focus', 'blur', 'paste', 'pasteBefore', 'willPaste', 'copy', 'copyBefore', 'copyAfter', 'cut', 'cutAfter', 'drop', 'show', 'hide', 'changeLanguage', 'cursorActivity', 'requireScrollSync', 'requireScrollIntoView', 'setCodeBlockLanguages'];
/**
 * Class EventManager
 * @ignore
 */

var EventManager = /*#__PURE__*/function () {
  function EventManager() {
    this.events = new _utils_map__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"]();
    this.TYPE = new tui_code_snippet_enum_enum__WEBPACK_IMPORTED_MODULE_3___default.a(eventList);
  }
  /**
   * Listen event and bind event handler
   * @param {string} typeStr Event type string
   * @param {function} handler Event handler
   */


  var _proto = EventManager.prototype;

  _proto.listen = function listen(typeStr, handler) {
    var typeInfo = this._getTypeInfo(typeStr);

    var eventHandlers = this.events.get(typeInfo.type) || [];

    if (!this._hasEventType(typeInfo.type)) {
      throw new Error("There is no event type " + typeInfo.type);
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
  ;

  _proto.emit = function emit() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var typeStr = args.shift();

    var typeInfo = this._getTypeInfo(typeStr);

    var eventHandlers = this.events.get(typeInfo.type);
    var results;

    if (eventHandlers) {
      tui_code_snippet_collection_forEachOwnProperties__WEBPACK_IMPORTED_MODULE_0___default()(eventHandlers, function (handler) {
        var result = handler.apply(void 0, args);

        if (!tui_code_snippet_type_isUndefined__WEBPACK_IMPORTED_MODULE_1___default()(result)) {
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
  ;

  _proto.emitReduce = function emitReduce() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var type = args.shift();
    var eventHandlers = this.events.get(type);

    if (eventHandlers) {
      tui_code_snippet_collection_forEachOwnProperties__WEBPACK_IMPORTED_MODULE_0___default()(eventHandlers, function (handler) {
        var result = handler.apply(void 0, args);

        if (!tui_code_snippet_type_isFalsy__WEBPACK_IMPORTED_MODULE_2___default()(result)) {
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
  ;

  _proto._getTypeInfo = function _getTypeInfo(typeStr) {
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
  ;

  _proto._hasEventType = function _hasEventType(type) {
    return !tui_code_snippet_type_isUndefined__WEBPACK_IMPORTED_MODULE_1___default()(this.TYPE[this._getTypeInfo(type).type]);
  }
  /**
   * Add event type when given event not exists
   * @param {string} type Event type name
   */
  ;

  _proto.addEventType = function addEventType(type) {
    if (this._hasEventType(type)) {
      throw new Error("There is already have event type " + type);
    }

    this.TYPE.set(type);
  }
  /**
   * Remove event handler from given event type
   * @param {string} typeStr Event type name
   * @param {function} [handler] - registered event handler
   */
  ;

  _proto.removeEventHandler = function removeEventHandler(typeStr, handler) {
    var _this = this;

    var _this$_getTypeInfo = this._getTypeInfo(typeStr),
        type = _this$_getTypeInfo.type,
        namespace = _this$_getTypeInfo.namespace;

    if (type && handler) {
      this._removeEventHandlerWithHandler(type, handler);
    } else if (type && !namespace) {
      // dont use dot notation cuz eslint
      this.events.delete(type);
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
  ;

  _proto._removeEventHandlerWithHandler = function _removeEventHandlerWithHandler(type, handler) {
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
  ;

  _proto._removeEventHandlerWithTypeInfo = function _removeEventHandlerWithTypeInfo(type, namespace) {
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
  };

  return EventManager;
}();

/* harmony default export */ __webpack_exports__["a"] = (EventManager);

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _toast_ui_to_mark__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32);
/* harmony import */ var _toast_ui_to_mark__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_toast_ui_to_mark__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _toast_ui_toastmark__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(22);
/* harmony import */ var _toast_ui_toastmark__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_toast_ui_toastmark__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _htmlRenderConvertors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(29);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(0);
/**
 * @fileoverview Convertor have responsible to convert markdown and html
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



 // This regular expression refere markdownIt.
// https://github.com/markdown-it/markdown-it/blob/master/lib/common/html_re.js

var attrName = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
var unquoted = '[^"\'=<>`\\x00-\\x20]+';
var singleQuoted = "'[^']*'";
var doubleQuoted = '"[^"]*"';
var attrValue = "(?:" + unquoted + "|" + singleQuoted + "|" + doubleQuoted + ")";
var attribute = "(?:\\s+" + attrName + "(?:\\s*=\\s*" + attrValue + ")?)*\\s*";
var openingTag = "(\\\\<|<)([A-Za-z][A-Za-z0-9\\-]*" + attribute + ")(\\/?>)";
var HTML_TAG_RX = new RegExp(openingTag, 'g');
var FRONT_MATTER_RX = /^\s?\\-\\-\\-([\s\S]+?)\\-\\-\\-/;
var NBSP_RX = /&nbsp;/g;
/**
 * Class Convertor
 * @param {EventManager} em - EventManager instance
 * @ignore
 */

var Convertor = /*#__PURE__*/function () {
  function Convertor(em, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
        linkAttribute = _options.linkAttribute,
        customHTMLRenderer = _options.customHTMLRenderer,
        extendedAutolinks = _options.extendedAutolinks,
        referenceDefinition = _options.referenceDefinition,
        customParser = _options.customParser,
        frontMatter = _options.frontMatter,
        customProp = _options.customProp;
    this.options = options;
    this.mdReader = new _toast_ui_toastmark__WEBPACK_IMPORTED_MODULE_1__["Parser"]({
      extendedAutolinks: extendedAutolinks,
      disallowedHtmlBlockTags: ['br'],
      referenceDefinition: referenceDefinition,
      disallowDeepHeading: true,
      customParser: customParser,
      frontMatter: frontMatter
    });
    this.renderHTML = Object(_toast_ui_toastmark__WEBPACK_IMPORTED_MODULE_1__["createRenderHTML"])({
      gfm: true,
      convertors: Object(_htmlRenderConvertors__WEBPACK_IMPORTED_MODULE_2__[/* getHTMLRenderConvertors */ "a"])(linkAttribute, customHTMLRenderer),
      customProp: customProp
    });
    this.eventManager = em;
  }
  /**
   * _markdownToHtmlWithCodeHighlight
   * Convert markdown to html with Codehighlight
   * @param {string} markdown markdown text
   * @returns {string} html text
   * @private
   */


  var _proto = Convertor.prototype;

  _proto._markdownToHtmlWithCodeHighlight = function _markdownToHtmlWithCodeHighlight(markdown) {
    return this.renderHTML(this.mdReader.parse(markdown));
  }
  /**
   * _markdownToHtml
   * Convert markdown to html
   * @param {string} markdown markdown text
   * @param {object} env environment sandbox for markdownit
   * @returns {string} html text
   * @private
   */
  ;

  _proto._markdownToHtml = function _markdownToHtml(markdown) {
    markdown = markdown.replace(HTML_TAG_RX, function (match, $1, $2, $3) {
      return match[0] !== '\\' ? "" + $1 + $2 + " data-tomark-pass " + $3 : match;
    });
    return this.renderHTML(this.mdReader.parse(markdown));
  }
  /**
   * Remove BR's data-tomark-pass attribute text when br in code element
   * @param {string} renderedHTML Rendered HTML string from markdown editor
   * @returns {string}
   * @private
   */
  ;

  _proto._removeBrToMarkPassAttributeInCode = function _removeBrToMarkPassAttributeInCode(renderedHTML) {
    var wrapper = _utils_dom__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].createElementWith("<div>" + renderedHTML + "</div>");
    _utils_dom__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"].findAll(wrapper, 'code, pre').forEach(function (codeOrPre) {
      var codeEelement = codeOrPre;
      codeEelement.innerHTML = codeEelement.innerHTML.replace(/\sdata-tomark-pass\s(\/?)&gt;/g, '$1&gt;');
    });
    renderedHTML = wrapper.innerHTML;
    return renderedHTML;
  }
  /**
   * toHTMLWithCodeHighlight
   * Convert markdown to html with Codehighlight
   * emit convertorAfterMarkdownToHtmlConverted
   * @param {string} markdown markdown text
   * @returns {string} html text
   */
  ;

  _proto.toHTMLWithCodeHighlight = function toHTMLWithCodeHighlight(markdown) {
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
  ;

  _proto.toHTML = function toHTML(markdown) {
    var html = this._markdownToHtml(markdown);

    html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);
    html = this._removeBrToMarkPassAttributeInCode(html);
    return html;
  };

  _proto.initHtmlSanitizer = function initHtmlSanitizer(sanitizer) {
    this.eventManager.listen('convertorAfterMarkdownToHtmlConverted', function (html) {
      return sanitizer(html, true);
    });
  }
  /**
   * toMarkdown
   * Convert html to markdown
   * emit convertorAfterHtmlToMarkdownConverted
   * @param {string} html html text
   * @param {object | null} toMarkOptions - toMark library options
   * @returns {string} markdown text
   */
  ;

  _proto.toMarkdown = function toMarkdown(html, toMarkOptions) {
    var result = [];
    html = this.eventManager.emitReduce('convertorBeforeHtmlToMarkdownConverted', html);
    html = this._appendAttributeForLinkIfNeed(html);
    html = this._appendAttributeForBrIfNeed(html);
    var markdown = _toast_ui_to_mark__WEBPACK_IMPORTED_MODULE_0___default()(html, toMarkOptions);

    if (this.options.frontMatter) {
      markdown = markdown.replace(FRONT_MATTER_RX, '---$1---');
    }

    markdown = this.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', markdown);
    markdown = this._removeNewlinesBeforeAfterAndBlockElement(markdown);
    markdown.split('\n').forEach(function (line, index) {
      var FIND_TABLE_RX = /^(<br>)+\||\|[^|]*\|/gi;
      var FIND_CODE_RX = /`[^`]*<br>[^`]*`/gi;
      var FIND_BRS_BEFORE_TABLE = /^(<br>)+\|/gi;

      if (FIND_TABLE_RX.test(line)) {
        line = line.replace(FIND_BRS_BEFORE_TABLE, function (match) {
          return match.replace(/<br>/gi, '<br>\n');
        });
      } else if (!FIND_CODE_RX.test(line)) {
        line = line.replace(/<br>/gi, '<br>\n');
      }

      result[index] = line;
    });
    return result.join('\n').replace(NBSP_RX, ' ');
  };

  _proto._removeNewlinesBeforeAfterAndBlockElement = function _removeNewlinesBeforeAfterAndBlockElement(markdown) {
    // Newlines('\n\n') are created on to-mark.
    var NEWLINES_BEFORE_BLOCK_RX = /<br>\n\n(#{1,6} .*|```|\||(\*+|-+|\d+\.) .*| *>[^\n]+.*)/g;
    var NEWLINES_AFTER_BLOCK_RX = /(#{1,6} .*|```|\|)\n\n<br>/g;
    markdown = markdown.replace(NEWLINES_BEFORE_BLOCK_RX, '<br>$1');
    markdown = markdown.replace(NEWLINES_AFTER_BLOCK_RX, '$1\n<br>');
    return markdown;
  };

  _proto._appendAttributeForLinkIfNeed = function _appendAttributeForLinkIfNeed(html) {
    var LINK_RX = /!?\[.*\]\(<\s*a[^>]*>(.*?)<\s*\/\s*a>\)/gi;
    return html.replace(LINK_RX, function (match) {
      return match.replace(/<a /gi, '<a data-tomark-pass="" ');
    });
  };

  _proto._appendAttributeForBrIfNeed = function _appendAttributeForBrIfNeed(html) {
    var FIND_BR_RX = /<br>/gi;
    var FIND_DOUBLE_BR_RX = /<br \/><br \/>/gi;
    var FIND_PASSING_AND_NORMAL_BR_RX = /<br data-tomark-pass \/><br \/>(.)/gi;
    var FIRST_TWO_BRS_BEFORE_RX = /([^>]|<\/a>|<\/code>|<\/span>|<\/b>|<\/i>|<\/s>|<img [^>]*>)/;
    var TWO_BRS_RX = /<br data-tomark-pass \/><br data-tomark-pass \/>/;
    var FIND_FIRST_TWO_BRS_RX = new RegExp(FIRST_TWO_BRS_BEFORE_RX.source + TWO_BRS_RX.source, 'g');
    var FIND_ATTRI_WITH_EMTPY_STR_RX = /<br data-tomark-pass="">/gi;
    html = html.replace(FIND_BR_RX, '<br />');
    html = html.replace(FIND_DOUBLE_BR_RX, '<br data-tomark-pass /><br data-tomark-pass />');
    html = html.replace(FIND_ATTRI_WITH_EMTPY_STR_RX, '<br data-tomark-pass />');
    html = html.replace(FIND_PASSING_AND_NORMAL_BR_RX, '<br data-tomark-pass /><br data-tomark-pass />$1');
    html = html.replace(FIND_FIRST_TWO_BRS_RX, '$1<br /><br />'); // Preserve <br> when there is only one empty line before or after a block element.

    html = html.replace(/(.)<br \/><br \/>(<h[1-6]>|<pre>|<table>|<ul>|<ol>|<blockquote>)/g, '$1<br /><br data-tomark-pass />$2');
    html = html.replace(/(<\/h[1-6]>|<\/pre>|<\/table>|<\/ul>|<\/ol>|<\/blockquote>)<br \/>(.)/g, '$1<br data-tomark-pass />$2');
    return html;
  };

  return Convertor;
}();

/* harmony default export */ __webpack_exports__["a"] = (Convertor);

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/domUtil/css.js
var css = __webpack_require__(4);
var css_default = /*#__PURE__*/__webpack_require__.n(css);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/type/isString.js
var isString = __webpack_require__(9);
var isString_default = /*#__PURE__*/__webpack_require__.n(isString);

// CONCATENATED MODULE: ./src/js/lazyRunner.js
/**
 * @fileoverview Implements LazyRunner
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Class LazyRunner
 * @ignore
 */

var lazyRunner_LazyRunner = /*#__PURE__*/function () {
  function LazyRunner() {
    this.globalTOID = null;
    this.lazyRunFunctions = {};
  }

  var _proto = LazyRunner.prototype;

  _proto.run = function run(fn, params, context, delay) {
    var TOID;

    if (isString_default()(fn)) {
      TOID = this._runRegisteredRun(fn, params, context, delay);
    } else {
      TOID = this._runSingleRun(fn, params, context, delay, this.globalTOID);
      this.globalTOID = TOID;
    }

    return TOID;
  };

  _proto.registerLazyRunFunction = function registerLazyRunFunction(name, fn, delay, context) {
    context = context || this;
    this.lazyRunFunctions[name] = {
      fn: fn,
      delay: delay,
      context: context,
      TOID: null
    };
  };

  _proto._runSingleRun = function _runSingleRun(fn, params, context, delay, TOID) {
    this._clearTOIDIfNeed(TOID);

    TOID = setTimeout(function () {
      fn.call(context, params);
    }, delay);
    return TOID;
  };

  _proto._runRegisteredRun = function _runRegisteredRun(lazyRunName, params, context, delay) {
    var lazyRunFunction = this.lazyRunFunctions[lazyRunName];
    var fn = lazyRunFunction.fn;
    var TOID = lazyRunFunction.TOID;
    delay = delay || lazyRunFunction.delay;
    context = context || lazyRunFunction.context;
    TOID = this._runSingleRun(fn, params, context, delay, TOID);
    lazyRunFunction.TOID = TOID;
    return TOID;
  };

  _proto._clearTOIDIfNeed = function _clearTOIDIfNeed(TOID) {
    if (TOID) {
      clearTimeout(TOID);
    }
  };

  return LazyRunner;
}();

/* harmony default export */ var lazyRunner = (lazyRunner_LazyRunner);
// EXTERNAL MODULE: ./src/js/utils/dom.js
var dom = __webpack_require__(0);

// EXTERNAL MODULE: ./src/js/codeBlockManager.js
var codeBlockManager = __webpack_require__(30);

// CONCATENATED MODULE: ./src/js/preview.js
/**
 * @fileoverview Implements preview
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */




/**
 * Class Preview
 * @param {HTMLElement} el - Container element for preview
 * @param {EventManager} eventManager -  Event manager instance
 * @param {Convertor} convertor - Convertor instance
 * @param {boolean} isViewer - whether viewer mode or not
 * @ignore
 */

var preview_Preview = /*#__PURE__*/function () {
  function Preview(el, eventManager, convertor, isViewer) {
    this.eventManager = eventManager;
    this.convertor = convertor;
    this.el = el;
    this.isViewer = !!isViewer;
    this.delayCodeBlockTime = 500;

    this._initContentSection();

    this.lazyRunner = new lazyRunner();
  }
  /**
   * Initialize content selection
   * @private
   */


  var _proto = Preview.prototype;

  _proto._initContentSection = function _initContentSection() {
    this._previewContent = dom["a" /* default */].createElementWith("<div class=\"tui-editor-contents\"></div>");
    this.el.appendChild(this._previewContent);
  };

  _proto.getCodeBlockElements = function getCodeBlockElements(nodeIds) {
    var contentEl = this._previewContent;
    var codeEls = [];
    var targetEls;

    if (nodeIds) {
      targetEls = nodeIds.map(function (id) {
        return contentEl.querySelector("[data-nodeid=\"" + id + "\"]");
      }).filter(Boolean);
    } else {
      targetEls = [contentEl];
    }

    targetEls.forEach(function (targetEl) {
      codeEls.push.apply(codeEls, dom["a" /* default */].findAll(targetEl, 'code[data-language]'));
    });
    return codeEls;
  };

  _proto.invokeCodeBlockPlugins = function invokeCodeBlockPlugins(codeBlocks) {
    codeBlocks.forEach(function (codeBlock) {
      var lang = codeBlock.getAttribute('data-language');
      var html = codeBlockManager["a" /* default */].createCodeBlockHtml(lang, codeBlock.textContent);
      codeBlock.innerHTML = html;
    });
  }
  /**
   * Refresh rendering
   * @param {string} markdown Markdown text
   */
  ;

  _proto.refresh = function refresh(markdown) {
    if (markdown === void 0) {
      markdown = '';
    }

    this.render(this.convertor.toHTMLWithCodeHighlight(markdown));
    this.invokeCodeBlockPlugins(this.getCodeBlockElements());
  }
  /**
   * get html string
   * @returns {string} - html preview string
   */
  ;

  _proto.getHTML = function getHTML() {
    return this._previewContent.innerHTML;
  }
  /**
   * set html string
   * @param {string} html - html preview string
   */
  ;

  _proto.setHTML = function setHTML(html) {
    this._previewContent.innerHTML = html;
  }
  /**
   * Render HTML on preview
   * @param {string} html HTML string
   */
  ;

  _proto.render = function render(html) {
    var _previewContent = this._previewContent;
    html = this.eventManager.emit('previewBeforeHook', html) || html;
    dom["a" /* default */].empty(_previewContent);
    _previewContent.innerHTML = html;
  }
  /**
   * Set preview height
   * @param {number} height - Height for preview container
   */
  ;

  _proto.setHeight = function setHeight(height) {
    css_default()(this.el, {
      height: height + "px"
    });
  }
  /**
   * set min height
   * @param {number} minHeight - min height
   */
  ;

  _proto.setMinHeight = function setMinHeight(minHeight) {
    css_default()(this.el, {
      minHeight: minHeight + "px"
    });
  }
  /**
   * Is Preview visible
   * @returns {boolean} result
   */
  ;

  _proto.isVisible = function isVisible() {
    return this.el.style.display !== 'none';
  };

  return Preview;
}();

/* harmony default export */ var preview = __webpack_exports__["a"] = (preview_Preview);

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Set className value
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isArray = __webpack_require__(17);
var isUndefined = __webpack_require__(8);

/**
 * Set className value
 * @param {(HTMLElement|SVGElement)} element - target element
 * @param {(string|string[])} cssClass - class names
 * @private
 */
function setClassName(element, cssClass) {
  cssClass = isArray(cssClass) ? cssClass.join(' ') : cssClass;

  cssClass = cssClass.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

  if (isUndefined(element.className.baseVal)) {
    element.className = cssClass;

    return;
  }

  element.className.baseVal = cssClass;
}

module.exports = setClassName;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Get event collection for specific HTML element
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var EVENT_KEY = '_feEventKey';

/**
 * Get event collection for specific HTML element
 * @param {HTMLElement} element - HTML element
 * @param {string} type - event type
 * @returns {array}
 * @private
 */
function safeEvent(element, type) {
  var events = element[EVENT_KEY];
  var handlers;

  if (!events) {
    events = element[EVENT_KEY] = {};
  }

  handlers = events[type];
  if (!handlers) {
    handlers = events[type] = [];
  }

  return handlers;
}

module.exports = safeEvent;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is truthy or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isExisty = __webpack_require__(28);

/**
 * Check whether the given variable is truthy or not.
 * If the given variable is not null or not undefined or not false, returns true.
 * (It regards 0 as true)
 * @param {*} obj - Target for checking
 * @returns {boolean} Is truthy?
 * @memberof module:type
 */
function isTruthy(obj) {
  return isExisty(obj) && obj !== false;
}

module.exports = isTruthy;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Send hostname on DOMContentLoaded.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isUndefined = __webpack_require__(8);
var imagePing = __webpack_require__(49);

var ms7days = 7 * 24 * 60 * 60 * 1000;

/**
 * Check if the date has passed 7 days
 * @param {number} date - milliseconds
 * @returns {boolean}
 * @private
 */
function isExpired(date) {
  var now = new Date().getTime();

  return now - date > ms7days;
}

/**
 * Send hostname on DOMContentLoaded.
 * To prevent hostname set tui.usageStatistics to false.
 * @param {string} appName - application name
 * @param {string} trackingId - GA tracking ID
 * @ignore
 */
function sendHostname(appName, trackingId) {
  var url = 'https://www.google-analytics.com/collect';
  var hostname = location.hostname;
  var hitType = 'event';
  var eventCategory = 'use';
  var applicationKeyForStorage = 'TOAST UI ' + appName + ' for ' + hostname + ': Statistics';
  var date = window.localStorage.getItem(applicationKeyForStorage);

  // skip if the flag is defined and is set to false explicitly
  if (!isUndefined(window.tui) && window.tui.usageStatistics === false) {
    return;
  }

  // skip if not pass seven days old
  if (date && !isExpired(date)) {
    return;
  }

  window.localStorage.setItem(applicationKeyForStorage, new Date().getTime());

  setTimeout(function() {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      imagePing(url, {
        v: 1,
        t: hitType,
        tid: trackingId,
        cid: hostname,
        dp: hostname,
        dh: appName,
        el: appName,
        ec: eventCategory
      });
    }
  }, 1000);
}

module.exports = sendHostname;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is falsy or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isTruthy = __webpack_require__(42);

/**
 * Check whether the given variable is falsy or not.
 * If the given variable is null or undefined or false, returns true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is falsy?
 * @memberof module:type
 */
function isFalsy(obj) {
  return !isTruthy(obj);
}

module.exports = isFalsy;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview This module provides a Enum Constructor.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 * @example
 * // node, commonjs
 * var Enum = require('tui-code-snippet/enum/enum');
 */



var isNumber = __webpack_require__(34);
var isArray = __webpack_require__(17);
var toArray = __webpack_require__(3);
var forEach = __webpack_require__(26);

/**
 * Check whether the defineProperty() method is supported.
 * @type {boolean}
 * @ignore
 */
var isSupportDefinedProperty = (function() {
  try {
    Object.defineProperty({}, 'x', {});

    return true;
  } catch (e) {
    return false;
  }
})();

/**
 * A unique value of a constant.
 * @type {number}
 * @ignore
 */
var enumValue = 0;

/**
 * Make a constant-list that has unique values.
 * In modern browsers (except IE8 and lower),
 *  a value defined once can not be changed.
 *
 * @param {...string|string[]} itemList Constant-list (An array of string is available)
 * @class
 *
 * @example
 * var Enum = require('tui-code-snippet/enum/enum'); // node, commonjs
 *
 * var MYENUM = new Enum('TYPE1', 'TYPE2');
 * var MYENUM2 = new Enum(['TYPE1', 'TYPE2']);
 *
 * //usage
 * if (value === MYENUM.TYPE1) {
 *      ....
 * }
 *
 * //add (If a duplicate name is inputted, will be disregarded.)
 * MYENUM.set('TYPE3', 'TYPE4');
 *
 * //get name of a constant by a value
 * MYENUM.getName(MYENUM.TYPE1); // 'TYPE1'
 *
 * // In modern browsers (except IE8 and lower), a value can not be changed in constants.
 * var originalValue = MYENUM.TYPE1;
 * MYENUM.TYPE1 = 1234; // maybe TypeError
 * MYENUM.TYPE1 === originalValue; // true
 **/
function Enum(itemList) {
  if (itemList) {
    this.set.apply(this, arguments);
  }
}

/**
 * Define a constants-list
 * @param {...string|string[]} itemList Constant-list (An array of string is available)
 */
Enum.prototype.set = function(itemList) {
  var self = this;

  if (!isArray(itemList)) {
    itemList = toArray(arguments);
  }

  forEach(itemList, function itemListIteratee(item) {
    self._addItem(item);
  });
};

/**
 * Return a key of the constant.
 * @param {number} value A value of the constant.
 * @returns {string|undefined} Key of the constant.
 */
Enum.prototype.getName = function(value) {
  var self = this;
  var foundedKey;

  forEach(this, function(itemValue, key) { // eslint-disable-line consistent-return
    if (self._isEnumItem(key) && value === itemValue) {
      foundedKey = key;

      return false;
    }
  });

  return foundedKey;
};

/**
 * Create a constant.
 * @private
 * @param {string} name Constant name. (It will be a key of a constant)
 */
Enum.prototype._addItem = function(name) {
  var value;

  if (!this.hasOwnProperty(name)) {
    value = this._makeEnumValue();

    if (isSupportDefinedProperty) {
      Object.defineProperty(this, name, {
        enumerable: true,
        configurable: false,
        writable: false,
        value: value
      });
    } else {
      this[name] = value;
    }
  }
};

/**
 * Return a unique value for assigning to a constant.
 * @private
 * @returns {number} A unique value
 */
Enum.prototype._makeEnumValue = function() {
  var value;

  value = enumValue;
  enumValue += 1;

  return value;
};

/**
 * Return whether a constant from the given key is in instance or not.
 * @param {string} key - A constant key
 * @returns {boolean} Result
 * @private
 */
Enum.prototype._isEnumItem = function(key) {
  return isNumber(this[key]);
};

module.exports = Enum;


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var tui_code_snippet_collection_forEachOwnProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var tui_code_snippet_collection_forEachOwnProperties__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_collection_forEachOwnProperties__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var tui_code_snippet_object_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var tui_code_snippet_object_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_object_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var tui_code_snippet_domEvent_on__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(19);
/* harmony import */ var tui_code_snippet_domEvent_on__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_domEvent_on__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var tui_code_snippet_domEvent_off__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(20);
/* harmony import */ var tui_code_snippet_domEvent_off__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(tui_code_snippet_domEvent_off__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _mdPreview__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(35);
/* harmony import */ var _eventManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(36);
/* harmony import */ var _commandManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1);
/* harmony import */ var _convertor__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(37);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(0);
/* harmony import */ var _codeBlockManager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(30);
/* harmony import */ var _pluginHelper__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(31);
/* harmony import */ var _utils_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(12);
/* harmony import */ var _htmlSanitizer__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(23);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * @fileoverview Implements editor preivew
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */













var TASK_ATTR_NAME = 'data-te-task';
var DISABLED_TASK_ATTR_NAME = 'data-te-task-disabled';
var TASK_CHECKED_CLASS_NAME = 'checked';
/**
 * Class ToastUIEditorViewer
 * @param {object} options Option object
 *     @param {HTMLElement} options.el - container element
 *     @param {string} [options.initialValue] Editor's initial value
 *     @param {Object} [options.events] - Events
 *         @param {function} [options.events.load] - It would be emitted when editor fully load
 *         @param {function} [options.events.change] - It would be emitted when content changed
 *         @param {function} [options.events.stateChange] - It would be emitted when format change by cursor position
 *         @param {function} [options.events.focus] - It would be emitted when editor get focus
 *         @param {function} [options.events.blur] - It would be emitted when editor loose focus
 *     @param {Object} [options.hooks] - Hooks
 *         @param {function} [options.hooks.previewBeforeHook] - Submit preview to hook URL before preview be shown
 *     @param {Array.<function|Array>} [options.plugins] - Array of plugins. A plugin can be either a function or an array in the form of [function, options].
 *     @param {boolean} [options.useDefaultHTMLSanitizer=true] - use default htmlSanitizer
 *     @param {Object} [options.extendedAutolinks] - Using extended Autolinks specified in GFM spec
 *     @param {Object} [options.customConvertor] - convertor extention
 *     @param {Object} [options.linkAttribute] - Attributes of anchor element that should be rel, target, contenteditable, hreflang, type
 *     @param {Object} [options.customHTMLRenderer] - Object containing custom renderer functions correspond to markdown node
 *     @param {boolean} [options.referenceDefinition=false] - whether use the specification of link reference definition
 *     @param {function} [options.customHTMLSanitizer=null] - custom HTML sanitizer
 *     @param {boolean} [options.frontMatter=false] - whether use the front matter
 */

var ToastUIEditorViewer = /*#__PURE__*/function () {
  function ToastUIEditorViewer(options) {
    var _this = this;

    this.options = tui_code_snippet_object_extend__WEBPACK_IMPORTED_MODULE_1___default()({
      useDefaultHTMLSanitizer: true,
      linkAttribute: null,
      extendedAutolinks: false,
      customConvertor: null,
      customHTMLRenderer: null,
      referenceDefinition: false,
      customHTMLSanitizer: null,
      frontMatter: false
    }, options);
    this.codeBlockLanguages = [];
    this.eventManager = new _eventManager__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"]();
    this.commandManager = new _commandManager__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"](this);
    var linkAttribute = Object(_utils_common__WEBPACK_IMPORTED_MODULE_11__[/* sanitizeLinkAttribute */ "c"])(this.options.linkAttribute);

    var _getPluginInfo = Object(_pluginHelper__WEBPACK_IMPORTED_MODULE_10__[/* getPluginInfo */ "a"])(this.options.plugins),
        renderer = _getPluginInfo.renderer,
        parser = _getPluginInfo.parser,
        plugins = _getPluginInfo.plugins;

    var _this$options = this.options,
        customHTMLRenderer = _this$options.customHTMLRenderer,
        customHTMLSanitizer = _this$options.customHTMLSanitizer,
        extendedAutolinks = _this$options.extendedAutolinks,
        referenceDefinition = _this$options.referenceDefinition,
        frontMatter = _this$options.frontMatter;
    var rendererOptions = {
      linkAttribute: linkAttribute,
      customHTMLRenderer: _extends({}, renderer, customHTMLRenderer),
      extendedAutolinks: extendedAutolinks,
      referenceDefinition: referenceDefinition,
      customParser: parser,
      frontMatter: frontMatter
    };

    if (this.options.customConvertor) {
      // eslint-disable-next-line new-cap
      this.convertor = new this.options.customConvertor(this.eventManager, rendererOptions);
    } else {
      this.convertor = new _convertor__WEBPACK_IMPORTED_MODULE_7__[/* default */ "a"](this.eventManager, rendererOptions);
    }

    var sanitizer = customHTMLSanitizer || (this.options.useDefaultHTMLSanitizer ? _htmlSanitizer__WEBPACK_IMPORTED_MODULE_12__[/* default */ "a"] : null);

    if (sanitizer) {
      this.convertor.initHtmlSanitizer(sanitizer);
    }

    if (this.options.hooks) {
      tui_code_snippet_collection_forEachOwnProperties__WEBPACK_IMPORTED_MODULE_0___default()(this.options.hooks, function (fn, key) {
        _this.addHook(key, fn);
      });
    }

    if (this.options.events) {
      tui_code_snippet_collection_forEachOwnProperties__WEBPACK_IMPORTED_MODULE_0___default()(this.options.events, function (fn, key) {
        _this.on(key, fn);
      });
    }

    var _this$options2 = this.options,
        el = _this$options2.el,
        initialValue = _this$options2.initialValue;
    var existingHTML = el.innerHTML;
    el.innerHTML = '';
    this.preview = new _mdPreview__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"](el, this.eventManager, this.convertor, _extends({}, rendererOptions, {
      isViewer: true
    }));
    tui_code_snippet_domEvent_on__WEBPACK_IMPORTED_MODULE_2___default()(this.preview.el, 'mousedown', this._toggleTask.bind(this));

    if (plugins) {
      Object(_pluginHelper__WEBPACK_IMPORTED_MODULE_10__[/* invokePlugins */ "b"])(plugins, this);
    }

    if (initialValue) {
      this.setMarkdown(initialValue);
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


  var _proto = ToastUIEditorViewer.prototype;

  _proto._toggleTask = function _toggleTask(ev) {
    var style = getComputedStyle(ev.target, ':before');

    if (!ev.target.hasAttribute(DISABLED_TASK_ATTR_NAME) && ev.target.hasAttribute(TASK_ATTR_NAME) && _utils_dom__WEBPACK_IMPORTED_MODULE_8__[/* default */ "a"].isInsideButtonBox(style, ev.offsetX, ev.offsetY)) {
      _utils_dom__WEBPACK_IMPORTED_MODULE_8__[/* default */ "a"].toggleClass(ev.target, TASK_CHECKED_CLASS_NAME);
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
  ;

  _proto.setMarkdown = function setMarkdown(markdown) {
    this.markdownValue = markdown = markdown || '';
    this.preview.refresh(this.markdownValue);
    this.eventManager.emit('setMarkdownAfter', this.markdownValue);
  }
  /**
   * Bind eventHandler to event type
   * @param {string} type Event type
   * @param {function} handler Event handler
   */
  ;

  _proto.on = function on(type, handler) {
    this.eventManager.listen(type, handler);
  }
  /**
   * Unbind eventHandler from event type
   * @param {string} type Event type
   */
  ;

  _proto.off = function off(type) {
    this.eventManager.removeEventHandler(type);
  }
  /**
   * Remove Viewer preview from document
   */
  ;

  _proto.remove = function remove() {
    this.eventManager.emit('removeEditor');
    tui_code_snippet_domEvent_off__WEBPACK_IMPORTED_MODULE_3___default()(this.preview.el, 'mousedown', this._toggleTask.bind(this));
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
  ;

  _proto.addHook = function addHook(type, handler) {
    this.eventManager.removeEventHandler(type);
    this.eventManager.listen(type, handler);
  }
  /**
   * Return true
   * @returns {boolean}
   */
  ;

  _proto.isViewer = function isViewer() {
    return true;
  }
  /**
   * Return false
   * @returns {boolean}
   */
  ;

  _proto.isMarkdownMode = function isMarkdownMode() {
    return false;
  }
  /**
   * Return false
   * @returns {boolean}
   */
  ;

  _proto.isWysiwygMode = function isWysiwygMode() {
    return false;
  }
  /**
   * Set code block languages
   * @param {Array} languages - code lauguage list
   */
  ;

  _proto.setCodeBlockLanguages = function setCodeBlockLanguages(languages) {
    var _this2 = this;

    if (languages === void 0) {
      languages = [];
    }

    languages.forEach(function (lang) {
      if (_this2.codeBlockLanguages.indexOf(lang) < 0) {
        _this2.codeBlockLanguages.push(lang);
      }
    });
  };

  return ToastUIEditorViewer;
}();
/**
 * Check whether is viewer (using in plugins)
 * @type {boolean}
 * @ignore
 */


ToastUIEditorViewer.isViewer = true;
/**
 * domUtil instance
 * @type {DomUtil}
 * @ignore
 */

ToastUIEditorViewer.domUtils = _utils_dom__WEBPACK_IMPORTED_MODULE_8__[/* default */ "a"];
/**
 * CodeBlockManager instance using in plugins
 * @type {CodeBlockManager}
 * @ignore
 */

ToastUIEditorViewer.codeBlockManager = _codeBlockManager__WEBPACK_IMPORTED_MODULE_9__[/* default */ "a"];
/**
 * WwCodeBlockManager class using in plugins
 * @type {Class.<WwCodeBlockManager>}
 * @ignore
 */

ToastUIEditorViewer.WwCodeBlockManager = null;
/**
 * WwTableManager class using in plugins
 * @type {Class.<WwTableManager>}
 * @ignore
 */

ToastUIEditorViewer.WwTableManager = null;
/**
 * WwTableManager class using in plugins
 * @type {Class.<WwTableSelectionManager>}
 * @ignore
 */

ToastUIEditorViewer.WwTableSelectionManager = null;
/* harmony default export */ __webpack_exports__["a"] = (ToastUIEditorViewer);

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Creates a debounced function that delays invoking fn until after delay milliseconds has elapsed since the last time the debouced function was invoked.
 * @author NHN FE Development Lab <dl_javascript.nhn.com>
 */



/**
 * @module tricks
 */

/**
 * Creates a debounced function that delays invoking fn until after delay milliseconds has elapsed
 * since the last time the debouced function was invoked.
 * @param {function} fn The function to debounce.
 * @param {number} [delay=0] The number of milliseconds to delay
 * @returns {function} debounced function.
 * @memberof module:tricks
 * @example
 * var debounce = require('tui-code-snippet/tricks/debounce'); // node, commonjs
 *
 * function someMethodToInvokeDebounced() {}
 *
 * var debounced = debounce(someMethodToInvokeDebounced, 300);
 *
 * // invoke repeatedly
 * debounced();
 * debounced();
 * debounced();
 * debounced();
 * debounced();
 * debounced();    // last invoke of debounced()
 *
 * // invoke someMethodToInvokeDebounced() after 300 milliseconds.
 */
function debounce(fn, delay) {
  var timer, args;

  /* istanbul ignore next */
  delay = delay || 0;

  function debounced() { // eslint-disable-line require-jsdoc
    args = Array.prototype.slice.call(arguments);

    window.clearTimeout(timer);
    timer = window.setTimeout(function() {
      fn.apply(null, args);
    }, delay);
  }

  return debounced;
}

module.exports = debounce;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is null or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is null or not.
 * If the given variable(arguments[0]) is null, returns true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is null?
 * @memberof module:type
 */
function isNull(obj) {
  return obj === null;
}

module.exports = isNull;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Request image ping.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var forEachOwnProperties = __webpack_require__(10);

/**
 * @module request
 */

/**
 * Request image ping.
 * @param {String} url url for ping request
 * @param {Object} trackingInfo infos for make query string
 * @returns {HTMLElement}
 * @memberof module:request
 * @example
 * var imagePing = require('tui-code-snippet/request/imagePing'); // node, commonjs
 *
 * imagePing('https://www.google-analytics.com/collect', {
 *     v: 1,
 *     t: 'event',
 *     tid: 'trackingid',
 *     cid: 'cid',
 *     dp: 'dp',
 *     dh: 'dh'
 * });
 */
function imagePing(url, trackingInfo) {
  var trackingElement = document.createElement('img');
  var queryString = '';
  forEachOwnProperties(trackingInfo, function(value, key) {
    queryString += '&' + key + '=' + value;
  });
  queryString = queryString.substring(1);

  trackingElement.src = url + '?' + queryString;

  trackingElement.style.display = 'none';
  document.body.appendChild(trackingElement);
  document.body.removeChild(trackingElement);

  return trackingElement;
}

module.exports = imagePing;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 53 */,
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is an object or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is an object or not.
 * If the given variable is an object, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is object?
 * @memberof module:type
 */
function isObject(obj) {
  return obj === Object(obj);
}

module.exports = isObject;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){"use strict";function n(e,t,n){this.root=this.currentNode=e,this.nodeType=t,this.filter=n||ue}function o(e,t){for(var n=e.length;n--;)if(!t(e[n]))return!1;return!0}function i(e){return e.nodeType===M&&!!pe[e.nodeName]}function r(e){switch(e.nodeType){case H:return me;case M:case z:if(de&&Ne.has(e))return Ne.get(e);break;default:return ge}var t;return t=o(e.childNodes,a)?fe.test(e.nodeName)?me:ve:Ce,de&&Ne.set(e,t),t}function a(e){return r(e)===me}function s(e){return r(e)===ve}function d(e){return r(e)===Ce}function l(e,t){var o=new n(t,q,s);return o.currentNode=e,o}function c(e,t){return e=l(e,t).previousNode(),e!==t?e:null}function h(e,t){return e=l(e,t).nextNode(),e!==t?e:null}function u(e){return!e.textContent&&!e.querySelector("IMG")}function f(e,t){return!i(e)&&e.nodeType===t.nodeType&&e.nodeName===t.nodeName&&"A"!==e.nodeName&&e.className===t.className&&(!e.style&&!t.style||e.style.cssText===t.style.cssText)}function p(e,t,n){if(e.nodeName!==t)return!1;for(var o in n)if(e.getAttribute(o)!==n[o])return!1;return!0}function g(e,t,n,o){for(;e&&e!==t;){if(p(e,n,o))return e;e=e.parentNode}return null}function m(e,t,n){for(;e&&e!==t;){if(n.test(e.nodeName))return e;e=e.parentNode}return null}function v(e,t){for(;t;){if(t===e)return!0;t=t.parentNode}return!1}function C(e,t,n){var o,i,r,a,s,d="";return e&&e!==t&&(d=C(e.parentNode,t,n),e.nodeType===M&&(d+=(d?">":"")+e.nodeName,(o=e.id)&&(d+="#"+o),(i=e.className.trim())&&(r=i.split(/\s\s*/),r.sort(),d+=".",d+=r.join(".")),(a=e.dir)&&(d+="[dir="+a+"]"),r&&(s=n.classNames,ce.call(r,s.highlight)>-1&&(d+="[backgroundColor="+e.style.backgroundColor.replace(/ /g,"")+"]"),ce.call(r,s.colour)>-1&&(d+="[color="+e.style.color.replace(/ /g,"")+"]"),ce.call(r,s.fontFamily)>-1&&(d+="[fontFamily="+e.style.fontFamily.replace(/ /g,"")+"]"),ce.call(r,s.fontSize)>-1&&(d+="[fontSize="+e.style.fontSize+"]")))),d}function N(e){var t=e.nodeType;return t===M||t===z?e.childNodes.length:e.length||0}function _(e){var t=e.parentNode;return t&&t.removeChild(e),e}function S(e,t){var n=e.parentNode;n&&n.replaceChild(t,e)}function y(e){for(var t=e.ownerDocument.createDocumentFragment(),n=e.childNodes,o=n?n.length:0;o--;)t.appendChild(e.firstChild);return t}function T(e,n,o,i){var r,a,s,d=e.createElement(n);if(o instanceof Array&&(i=o,o=null),o)for(r in o)o[r]!==t&&d.setAttribute(r,o[r]);if(i)for(a=0,s=i.length;a<s;a+=1)d.appendChild(i[a]);return d}function E(e,t){var n,o,r=t.__squire__,s=e.ownerDocument,d=e;if(e===t&&((o=e.firstChild)&&"BR"!==o.nodeName||(n=r.createDefaultBlock(),o?e.replaceChild(n,o):e.appendChild(n),e=n,n=null)),e.nodeType===H)return d;if(a(e)){for(o=e.firstChild;re&&o&&o.nodeType===H&&!o.data;)e.removeChild(o),o=e.firstChild;o||(re?(n=s.createTextNode(K),r._didAddZWS()):n=s.createTextNode(""))}else if(ie){for(;e.nodeType!==H&&!i(e);){if(!(o=e.firstChild)){n=s.createTextNode("");break}e=o}e.nodeType===H?/^ +$/.test(e.data)&&(e.data=""):i(e)&&e.parentNode.insertBefore(s.createTextNode(""),e)}else if("HR"!==e.nodeName&&!e.querySelector("BR"))for(n=T(s,"BR");(o=e.lastElementChild)&&!a(o);)e=o;if(n)try{e.appendChild(n)}catch(t){r.didError({name:"Squire: fixCursor – "+t,message:"Parent: "+e.nodeName+"/"+e.innerHTML+" appendChild: "+n.nodeName})}return d}function b(e,t){var n,o,i,r,s=e.childNodes,l=e.ownerDocument,c=null,h=t.__squire__._config;for(n=0,o=s.length;n<o;n+=1)i=s[n],r="BR"===i.nodeName,!r&&a(i)?(c||(c=T(l,h.blockTag,h.blockAttributes)),c.appendChild(i),n-=1,o-=1):(r||c)&&(c||(c=T(l,h.blockTag,h.blockAttributes)),E(c,t),r?e.replaceChild(c,i):(e.insertBefore(c,i),n+=1,o+=1),c=null),d(i)&&b(i,t);return c&&e.appendChild(E(c,t)),e}function k(e,t,n,o){var i,r,a,s=e.nodeType;if(s===H&&e!==n)return k(e.parentNode,e.splitText(t),n,o);if(s===M){if("number"==typeof t&&(t=t<e.childNodes.length?e.childNodes[t]:null),e===n)return t;for(i=e.parentNode,r=e.cloneNode(!1);t;)a=t.nextSibling,r.appendChild(t),t=a;return"OL"===e.nodeName&&g(e,o,"BLOCKQUOTE")&&(r.start=(+e.start||1)+e.childNodes.length-1),E(e,o),E(r,o),(a=e.nextSibling)?i.insertBefore(r,a):i.appendChild(r),k(i,r,n,o)}return t}function x(e,t){for(var n,o,i,r=e.childNodes,s=r.length,d=[];s--;)if(n=r[s],o=s&&r[s-1],s&&a(n)&&f(n,o)&&!pe[n.nodeName])t.startContainer===n&&(t.startContainer=o,t.startOffset+=N(o)),t.endContainer===n&&(t.endContainer=o,t.endOffset+=N(o)),t.startContainer===e&&(t.startOffset>s?t.startOffset-=1:t.startOffset===s&&(t.startContainer=o,t.startOffset=N(o))),t.endContainer===e&&(t.endOffset>s?t.endOffset-=1:t.endOffset===s&&(t.endContainer=o,t.endOffset=N(o))),_(n),n.nodeType===H?o.appendData(n.data):d.push(y(n));else if(n.nodeType===M){for(i=d.length;i--;)n.appendChild(d.pop());x(n,t)}}function A(e,t){if(e.nodeType===H&&(e=e.parentNode),e.nodeType===M){var n={startContainer:t.startContainer,startOffset:t.startOffset,endContainer:t.endContainer,endOffset:t.endOffset};x(e,n),t.setStart(n.startContainer,n.startOffset),t.setEnd(n.endContainer,n.endOffset)}}function L(e){var t=e.nodeName;return"TD"===t||"TH"===t||"TR"===t||"TBODY"===t||"THEAD"===t}function B(e,t,n,o){var i,r,a,s=t;if(!L(e)||!L(t)){for(;(i=s.parentNode)&&i!==o&&i.nodeType===M&&1===i.childNodes.length;)s=i;_(s),a=e.childNodes.length,r=e.lastChild,r&&"BR"===r.nodeName&&(e.removeChild(r),a-=1),e.appendChild(y(t)),n.setStart(e,a),n.collapse(!0),A(e,n),J&&(r=e.lastChild)&&"BR"===r.nodeName&&e.removeChild(r)}}function O(e,t){var n,o,i=e.previousSibling,r=e.firstChild,a=e.ownerDocument,s="LI"===e.nodeName;if((!s||r&&/^[OU]L$/.test(r.nodeName))&&!L(e))if(i&&f(i,e)&&i.isContentEditable&&e.isContentEditable){if(!d(i)){if(!s)return;o=T(a,"DIV"),o.appendChild(y(i)),i.appendChild(o)}_(e),n=!d(e),i.appendChild(y(e)),n&&b(i,t),r&&O(r,t)}else s&&(i=T(a,"DIV"),e.insertBefore(i,r),E(i,t))}function R(e){this.isShiftDown=e.shiftKey}function D(e,t,n){var o,i;if(e||(e={}),t)for(o in t)!n&&o in e||(i=t[o],e[o]=i&&i.constructor===Object?D(e[o],i,n):i);return e}function P(e,t){e.nodeType===W&&(e=e.body);var n,o=e.ownerDocument,i=o.defaultView;this._win=i,this._doc=o,this._root=e,this._events={},this._isFocused=!1,this._lastSelection=null,ae&&this.addEventListener("beforedeactivate",this.getSelection),this._hasZWS=!1,this._lastAnchorNode=null,this._lastFocusNode=null,this._path="",this._willUpdatePath=!1,"onselectionchange"in o?this.addEventListener("selectionchange",this._updatePathOnEvent):(this.addEventListener("keyup",this._updatePathOnEvent),this.addEventListener("mouseup",this._updatePathOnEvent)),this._undoIndex=-1,this._undoStack=[],this._undoStackLength=0,this._isInUndoState=!1,this._ignoreChange=!1,this._ignoreAllChanges=!1,se?(n=new MutationObserver(this._docWasChanged.bind(this)),n.observe(e,{childList:!0,attributes:!0,characterData:!0,subtree:!0}),this._mutation=n):this.addEventListener("keyup",this._keyUpDetectChange),this._restoreSelection=!1,this.addEventListener("blur",U),this.addEventListener("mousedown",I),this.addEventListener("touchstart",I),this.addEventListener("focus",w),this._awaitingPaste=!1,this.addEventListener(X?"beforecut":"cut",nt),this.addEventListener("copy",ot),this.addEventListener("keydown",R),this.addEventListener("keyup",R),this.addEventListener(X?"beforepaste":"paste",it),this.addEventListener("drop",rt),this.addEventListener(J?"keypress":"keydown",Ie),this._keyHandlers=Object.create(He),this.setConfig(t),X&&(i.Text.prototype.splitText=function(e){var t=this.ownerDocument.createTextNode(this.data.slice(e)),n=this.nextSibling,o=this.parentNode,i=this.length-e;return n?o.insertBefore(t,n):o.appendChild(t),i&&this.deleteData(e,i),t}),e.setAttribute("contenteditable","true");try{o.execCommand("enableObjectResizing",!1,"false"),o.execCommand("enableInlineTableEditing",!1,"false")}catch(e){}e.__squire__=this,this.setHTML("")}function U(){this._restoreSelection=!0}function I(){this._restoreSelection=!1}function w(){this._restoreSelection&&this.setSelection(this._lastSelection)}function F(e,t,n){var o,i;for(o=t.firstChild;o;o=i){if(i=o.nextSibling,a(o)){if(o.nodeType===H||"BR"===o.nodeName||"IMG"===o.nodeName){n.appendChild(o);continue}}else if(s(o)){n.appendChild(e.createDefaultBlock([F(e,o,e._doc.createDocumentFragment())]));continue}F(e,o,n)}return n}var M=1,H=3,W=9,z=11,q=1,K="​",G=e.defaultView,Z=navigator.userAgent,j=/Android/.test(Z),Q=/iP(?:ad|hone|od)/.test(Z),$=/Mac OS X/.test(Z),V=/Windows NT/.test(Z),Y=/Gecko\//.test(Z),X=/Trident\/[456]\./.test(Z),J=!!G.opera,ee=/Edge\//.test(Z),te=!ee&&/WebKit\//.test(Z),ne=/Trident\/[4567]\./.test(Z),oe=$?"meta-":"ctrl-",ie=X||J,re=X||te,ae=X,se="undefined"!=typeof MutationObserver,de="undefined"!=typeof WeakMap,le=/[^ \t\r\n]/,ce=Array.prototype.indexOf;Object.create||(Object.create=function(e){var t=function(){};return t.prototype=e,new t});var he={1:1,2:2,3:4,8:128,9:256,11:1024},ue=function(){return!0};n.prototype.nextNode=function(){for(var e,t=this.currentNode,n=this.root,o=this.nodeType,i=this.filter;;){for(e=t.firstChild;!e&&t&&t!==n;)(e=t.nextSibling)||(t=t.parentNode);if(!e)return null;if(he[e.nodeType]&o&&i(e))return this.currentNode=e,e;t=e}},n.prototype.previousNode=function(){for(var e,t=this.currentNode,n=this.root,o=this.nodeType,i=this.filter;;){if(t===n)return null;if(e=t.previousSibling)for(;t=e.lastChild;)e=t;else e=t.parentNode;if(!e)return null;if(he[e.nodeType]&o&&i(e))return this.currentNode=e,e;t=e}},n.prototype.previousPONode=function(){for(var e,t=this.currentNode,n=this.root,o=this.nodeType,i=this.filter;;){for(e=t.lastChild;!e&&t&&t!==n;)(e=t.previousSibling)||(t=t.parentNode);if(!e)return null;if(he[e.nodeType]&o&&i(e))return this.currentNode=e,e;t=e}};var fe=/^(?:#text|A(?:BBR|CRONYM)?|B(?:R|D[IO])?|C(?:ITE|ODE)|D(?:ATA|EL|FN)|EM|FONT|I(?:FRAME|MG|NPUT|NS)?|KBD|Q|R(?:P|T|UBY)|S(?:AMP|MALL|PAN|TR(?:IKE|ONG)|U[BP])?|TIME|U|VAR|WBR)$/,pe={BR:1,HR:1,IFRAME:1,IMG:1,INPUT:1},ge=0,me=1,ve=2,Ce=3,Ne=de?new WeakMap:null,_e=function(e,t){for(var n=e.childNodes;t&&e.nodeType===M;)e=n[t-1],n=e.childNodes,t=n.length;return e},Se=function(e,t){if(e.nodeType===M){var n=e.childNodes;if(t<n.length)e=n[t];else{for(;e&&!e.nextSibling;)e=e.parentNode;e&&(e=e.nextSibling)}}return e},ye=function(e,t){var n,o,i,r,a=e.startContainer,s=e.startOffset,d=e.endContainer,l=e.endOffset;a.nodeType===H?(n=a.parentNode,o=n.childNodes,s===a.length?(s=ce.call(o,a)+1,e.collapsed&&(d=n,l=s)):(s&&(r=a.splitText(s),d===a?(l-=s,d=r):d===n&&(l+=1),a=r),s=ce.call(o,a)),a=n):o=a.childNodes,i=o.length,s===i?a.appendChild(t):a.insertBefore(t,o[s]),a===d&&(l+=o.length-i),e.setStart(a,s),e.setEnd(d,l)},Te=function(e,t,n){var o=e.startContainer,i=e.startOffset,r=e.endContainer,a=e.endOffset;t||(t=e.commonAncestorContainer),t.nodeType===H&&(t=t.parentNode);for(var s,d,l,c,h,u=k(r,a,t,n),f=k(o,i,t,n),p=t.ownerDocument.createDocumentFragment();f!==u;)s=f.nextSibling,p.appendChild(f),f=s;return o=t,i=u?ce.call(t.childNodes,u):t.childNodes.length,l=t.childNodes[i],d=l&&l.previousSibling,d&&d.nodeType===H&&l.nodeType===H&&(o=d,i=d.length,c=d.data,h=l.data," "===c.charAt(c.length-1)&&" "===h.charAt(0)&&(h=" "+h.slice(1)),d.appendData(h),_(l)),e.setStart(o,i),e.collapse(!0),E(t,n),p},Ee=function(e,t){var n,o,i=Le(e,t),r=Be(e,t),a=i!==r;return xe(e),Ae(e,i,r,t),n=Te(e,null,t),xe(e),a&&(r=Be(e,t),i&&r&&i!==r&&B(i,r,e,t)),i&&E(i,t),o=t.firstChild,o&&"BR"!==o.nodeName?e.collapse(!0):(E(t,t),e.selectNodeContents(t.firstChild)),n},be=function(e,t,n){var o,i,r,s,l,u,f,p,v,C;for(b(t,n),o=t;o=h(o,n);)E(o,n);if(e.collapsed||Ee(e,n),xe(e),e.collapse(!1),s=g(e.endContainer,n,"BLOCKQUOTE")||n,i=Le(e,n),f=h(t,t),i&&f&&!m(f,t,/PRE|TABLE|H[1-6]|OL|UL|BLOCKQUOTE/)){if(Ae(e,i,i,n),e.collapse(!0),l=e.endContainer,u=e.endOffset,et(i,n,!1),a(l)&&(p=k(l,u,c(l,n),n),l=p.parentNode,u=ce.call(l.childNodes,p)),u!==N(l))for(r=n.ownerDocument.createDocumentFragment();o=l.childNodes[u];)r.appendChild(o);B(l,f,e,n),u=ce.call(l.parentNode.childNodes,l)+1,l=l.parentNode,e.setEnd(l,u)}N(t)&&(Ae(e,s,s,n),p=k(e.endContainer,e.endOffset,s,n),v=p?p.previousSibling:s.lastChild,s.insertBefore(t,p),p?e.setEndBefore(p):e.setEnd(s,N(s)),i=Be(e,n),xe(e),l=e.endContainer,u=e.endOffset,p&&d(p)&&O(p,n),p=v&&v.nextSibling,p&&d(p)&&O(p,n),e.setEnd(l,u)),r&&(C=e.cloneRange(),B(i,r,C,n),e.setEnd(C.endContainer,C.endOffset)),xe(e)},ke=function(e,t,n){var o=t.ownerDocument.createRange();if(o.selectNode(t),n){var i=e.compareBoundaryPoints(3,o)>-1,r=e.compareBoundaryPoints(1,o)<1;return!i&&!r}var a=e.compareBoundaryPoints(0,o)<1,s=e.compareBoundaryPoints(2,o)>-1;return a&&s},xe=function(e){for(var t,n=e.startContainer,o=e.startOffset,r=e.endContainer,a=e.endOffset,s=!0;n.nodeType!==H&&(t=n.childNodes[o])&&!i(t);)n=t,o=0;if(a)for(;r.nodeType!==H;){if(!(t=r.childNodes[a-1])||i(t)){if(s&&t&&"BR"===t.nodeName){a-=1,s=!1;continue}break}r=t,a=N(r)}else for(;r.nodeType!==H&&(t=r.firstChild)&&!i(t);)r=t;e.collapsed?(e.setStart(r,a),e.setEnd(n,o)):(e.setStart(n,o),e.setEnd(r,a))},Ae=function(e,t,n,o){var i,r=e.startContainer,a=e.startOffset,s=e.endContainer,d=e.endOffset,l=!0;for(t||(t=e.commonAncestorContainer),n||(n=t);!a&&r!==t&&r!==o;)i=r.parentNode,a=ce.call(i.childNodes,r),r=i;for(;;){if(l&&s.nodeType!==H&&s.childNodes[d]&&"BR"===s.childNodes[d].nodeName&&(d+=1,l=!1),s===n||s===o||d!==N(s))break;i=s.parentNode,d=ce.call(i.childNodes,s)+1,s=i}e.setStart(r,a),e.setEnd(s,d)},Le=function(e,t){var n,o=e.startContainer;return a(o)?n=c(o,t):o!==t&&s(o)?n=o:(n=_e(o,e.startOffset),n=h(n,t)),n&&ke(e,n,!0)?n:null},Be=function(e,t){var n,o,i=e.endContainer;if(a(i))n=c(i,t);else if(i!==t&&s(i))n=i;else{if(!(n=Se(i,e.endOffset))||!v(t,n))for(n=t;o=n.lastChild;)n=o;n=c(n,t)}return n&&ke(e,n,!0)?n:null},Oe=new n(null,4|q,function(e){return e.nodeType===H?le.test(e.data):"IMG"===e.nodeName}),Re=function(e,t){var n,o=e.startContainer,i=e.startOffset;if(Oe.root=null,o.nodeType===H){if(i)return!1;n=o}else if(n=Se(o,i),n&&!v(t,n)&&(n=null),!n&&(n=_e(o,i),n.nodeType===H&&n.length))return!1;return Oe.currentNode=n,Oe.root=Le(e,t),!Oe.previousNode()},De=function(e,t){var n,o=e.endContainer,i=e.endOffset;if(Oe.root=null,o.nodeType===H){if((n=o.data.length)&&i<n)return!1;Oe.currentNode=o}else Oe.currentNode=_e(o,i);return Oe.root=Be(e,t),!Oe.nextNode()},Pe=function(e,t){var n,o=Le(e,t),i=Be(e,t);o&&i&&(n=o.parentNode,e.setStart(n,ce.call(n.childNodes,o)),n=i.parentNode,e.setEnd(n,ce.call(n.childNodes,i)+1))},Ue={8:"backspace",9:"tab",13:"enter",32:"space",33:"pageup",34:"pagedown",37:"left",39:"right",46:"delete",219:"[",221:"]"},Ie=function(e){var t=e.keyCode,n=Ue[t],o="",i=this.getSelection();e.defaultPrevented||(n||(n=String.fromCharCode(t).toLowerCase(),/^[A-Za-z0-9]$/.test(n)||(n="")),J&&46===e.which&&(n="."),111<t&&t<124&&(n="f"+(t-111)),"backspace"!==n&&"delete"!==n&&(e.altKey&&(o+="alt-"),e.ctrlKey&&(o+="ctrl-"),e.metaKey&&(o+="meta-")),e.shiftKey&&(o+="shift-"),n=o+n,this._keyHandlers[n]?this._keyHandlers[n](this,e,i):i.collapsed||e.isComposing||e.ctrlKey||e.metaKey||1!==(ne?n:e.key||n).length||(this.saveUndoState(i),Ee(i,this._root),this._ensureBottomLine(),this.setSelection(i),this._updatePath(i,!0)))},we=function(e){return function(t,n){n.preventDefault(),t[e]()}},Fe=function(e,t){return t=t||null,function(n,o){o.preventDefault();var i=n.getSelection();n.hasFormat(e,null,i)?n.changeFormat(null,{tag:e},i):n.changeFormat({tag:e},t,i)}},Me=function(e,t){try{t||(t=e.getSelection());var n,o=t.startContainer;for(o.nodeType===H&&(o=o.parentNode),n=o;a(n)&&(!n.textContent||n.textContent===K);)o=n,n=o.parentNode;o!==n&&(t.setStart(n,ce.call(n.childNodes,o)),t.collapse(!0),n.removeChild(o),s(n)||(n=c(n,e._root)),E(n,e._root),xe(t)),o===e._root&&(o=o.firstChild)&&"BR"===o.nodeName&&_(o),e._ensureBottomLine(),e.setSelection(t),e._updatePath(t,!0)}catch(t){e.didError(t)}},He={enter:function(e,t,n){var o,i,r,a,s,d=e._root;if(t.preventDefault(),e._recordUndoState(n),g(n.startContainer,d,"PRE",{"data-te-codeblock":""})||yt(n.startContainer,d,e),e._removeZWS(),e._getRangeAndRemoveBookmark(n),n.collapsed||Ee(n,d),(o=Le(n,d))&&(i=g(o,d,"PRE")))return xe(n),r=n.startContainer,a=n.startOffset,r.nodeType!==H&&(r=e._doc.createTextNode(""),i.insertBefore(r,i.firstChild)),t.shiftKey||"\n"!==r.data.charAt(a-1)&&!Re(n,d)||"\n"!==r.data.charAt(a)&&!De(n,d)?(r.insertData(a,"\n"),E(i,d),r.length===a+1?n.setStartAfter(r):n.setStart(r,a+1)):(r.deleteData(a&&a-1,a?2:1),s=k(r,a&&a-1,d,d),r=s.previousSibling,r.textContent||_(r),r=e.createDefaultBlock(),s.parentNode.insertBefore(r,s),s.textContent||_(s),n.setStart(r,0)),n.collapse(!0),e.setSelection(n),e._updatePath(n,!0),void e._docWasChanged();if(!o||t.shiftKey||/^T[HD]$/.test(o.nodeName))return i=g(n.endContainer,d,"A"),i&&(i=i.parentNode,Ae(n,i,i,d),n.collapse(!1)),ye(n,e.createElement("BR")),n.collapse(!1),e.setSelection(n),void e._updatePath(n,!0);if((i=g(o,d,"LI"))&&(o=i),u(o)){if(g(o,d,"UL")||g(o,d,"OL"))return e.decreaseListLevel(n);if(g(o,d,"BLOCKQUOTE"))return e.modifyBlocks(mt,n)}for(s=ft(e,o,n.startContainer,n.startOffset),ct(o),Ye(o),E(o,d);s.nodeType===M;){var l,c=s.firstChild;if("A"===s.nodeName&&(!s.textContent||s.textContent===K)){c=e._doc.createTextNode(""),S(s,c),s=c;break}for(;c&&c.nodeType===H&&!c.data&&(l=c.nextSibling)&&"BR"!==l.nodeName;)_(c),c=l;if(!c||"BR"===c.nodeName||c.nodeType===H&&!J)break;s=c}n=e.createRange(s,0),e.setSelection(n),e._updatePath(n,!0)},"shift-enter":function(e,t,n){return e._keyHandlers.enter(e,t,n)},backspace:function(e,t,n){var o=e._root;if(e._removeZWS(),e.saveUndoState(n),n.collapsed)if(Re(n,o)){t.preventDefault();var i,r=Le(n,o);if(!r)return;if(b(r.parentNode,o),i=c(r,o)){if(!i.isContentEditable){for(;!i.parentNode.isContentEditable;)i=i.parentNode;return void _(i)}for(B(i,r,n,o),r=i.parentNode;r!==o&&!r.nextSibling;)r=r.parentNode;r!==o&&(r=r.nextSibling)&&O(r,o),e.setSelection(n)}else if(r){if(g(r,o,"UL")||g(r,o,"OL"))return e.decreaseListLevel(n);if(g(r,o,"BLOCKQUOTE"))return e.modifyBlocks(gt,n);e.setSelection(n),e._updatePath(n,!0)}}else e.setSelection(n),setTimeout(function(){Me(e)},0);else t.preventDefault(),Ee(n,o),Me(e,n)},delete:function(e,t,n){var o,i,r,a,s,d,l=e._root;if(e._removeZWS(),e.saveUndoState(n),n.collapsed)if(De(n,l)){if(t.preventDefault(),!(o=Le(n,l)))return;if(b(o.parentNode,l),i=h(o,l)){if(!i.isContentEditable){for(;!i.parentNode.isContentEditable;)i=i.parentNode;return void _(i)}for(B(o,i,n,l),i=o.parentNode;i!==l&&!i.nextSibling;)i=i.parentNode;i!==l&&(i=i.nextSibling)&&O(i,l),e.setSelection(n),e._updatePath(n,!0)}}else{if(r=n.cloneRange(),Ae(n,l,l,l),a=n.endContainer,s=n.endOffset,a.nodeType===M&&(d=a.childNodes[s])&&"IMG"===d.nodeName)return t.preventDefault(),_(d),xe(n),void Me(e,n);e.setSelection(r),setTimeout(function(){Me(e)},0)}else t.preventDefault(),Ee(n,l),Me(e,n)},tab:function(e,t,n){var o,i,r=e._root;if(e._removeZWS(),n.collapsed&&Re(n,r))for(o=Le(n,r);i=o.parentNode;){if("UL"===i.nodeName||"OL"===i.nodeName){t.preventDefault(),e.increaseListLevel(n);break}o=i}},"shift-tab":function(e,t,n){var o,i=e._root;e._removeZWS(),n.collapsed&&Re(n,i)&&(o=n.startContainer,(g(o,i,"UL")||g(o,i,"OL"))&&(t.preventDefault(),e.decreaseListLevel(n)))},space:function(e,t,n){var o,i=e._root;if(e._recordUndoState(n),yt(n.startContainer,i,e),e._getRangeAndRemoveBookmark(n),o=n.endContainer,n.collapsed&&n.endOffset===N(o))do{if("A"===o.nodeName){n.setStartAfter(o);break}}while(!o.nextSibling&&(o=o.parentNode)&&o!==i);n.collapsed||(Ee(n,i),e._ensureBottomLine(),e.setSelection(n),e._updatePath(n,!0)),e.setSelection(n)},left:function(e){e._removeZWS()},right:function(e){e._removeZWS()}};$&&Y&&(He["meta-left"]=function(e,t){t.preventDefault();var n=lt(e);n&&n.modify&&n.modify("move","backward","lineboundary")},He["meta-right"]=function(e,t){t.preventDefault();var n=lt(e);n&&n.modify&&n.modify("move","forward","lineboundary")}),$||(He.pageup=function(e){e.moveCursorToStart()},He.pagedown=function(e){e.moveCursorToEnd()}),He[oe+"b"]=Fe("B"),He[oe+"i"]=Fe("I"),He[oe+"u"]=Fe("U"),He[oe+"shift-7"]=Fe("S"),He[oe+"shift-5"]=Fe("SUB",{tag:"SUP"}),He[oe+"shift-6"]=Fe("SUP",{tag:"SUB"}),He[oe+"shift-8"]=we("makeUnorderedList"),He[oe+"shift-9"]=we("makeOrderedList"),He[oe+"["]=we("decreaseQuoteLevel"),He[oe+"]"]=we("increaseQuoteLevel"),He[oe+"d"]=we("toggleCode"),He[oe+"y"]=we("redo"),He[oe+"z"]=we("undo"),He[oe+"shift-z"]=we("redo");var We={1:10,2:13,3:16,4:18,5:24,6:32,7:48},ze={backgroundColor:{regexp:le,replace:function(e,t,n){return T(e,"SPAN",{class:t.highlight,style:"background-color:"+n})}},color:{regexp:le,replace:function(e,t,n){return T(e,"SPAN",{class:t.colour,style:"color:"+n})}},fontWeight:{regexp:/^bold|^700/i,replace:function(e){return T(e,"B")}},fontStyle:{regexp:/^italic/i,replace:function(e){return T(e,"I")}},fontFamily:{regexp:le,replace:function(e,t,n){return T(e,"SPAN",{class:t.fontFamily,style:"font-family:"+n})}},fontSize:{regexp:le,replace:function(e,t,n){return T(e,"SPAN",{class:t.fontSize,style:"font-size:"+n})}},textDecoration:{regexp:/^underline/i,replace:function(e){return T(e,"U")}}},qe=function(e){return function(t,n){var o=T(t.ownerDocument,e);return n.replaceChild(o,t),o.appendChild(y(t)),o}},Ke=function(e,t,n){var o,i,r,a,s,d,l=e.style,c=e.ownerDocument;for(o in ze)i=ze[o],(r=l[o])&&i.regexp.test(r)&&(d=i.replace(c,n.classNames,r),s||(s=d),a&&a.appendChild(d),a=d,e.style[o]="");return s&&(a.appendChild(y(e)),"SPAN"===e.nodeName?t.replaceChild(s,e):e.appendChild(s)),a||e},Ge={P:Ke,SPAN:Ke,STRONG:qe("B"),EM:qe("I"),INS:qe("U"),STRIKE:qe("S"),FONT:function(e,t,n){var o,i,r,a,s,d=e.face,l=e.size,c=e.color,h=e.ownerDocument,u=n.classNames;return d&&(o=T(h,"SPAN",{class:u.fontFamily,style:"font-family:"+d}),s=o,a=o),l&&(i=T(h,"SPAN",{class:u.fontSize,style:"font-size:"+We[l]+"px"}),s||(s=i),a&&a.appendChild(i),a=i),c&&/^#?([\dA-F]{3}){1,2}$/i.test(c)&&("#"!==c.charAt(0)&&(c="#"+c),r=T(h,"SPAN",{class:u.colour,style:"color:"+c}),s||(s=r),a&&a.appendChild(r),a=r),s||(s=a=T(h,"SPAN")),t.replaceChild(s,e),a.appendChild(y(e)),a},TT:function(e,t,n){var o=T(e.ownerDocument,"SPAN",{class:n.classNames.fontFamily,style:'font-family:menlo,consolas,"courier new",monospace'});return t.replaceChild(o,e),o.appendChild(y(e)),o}},Ze=/^(?:A(?:DDRESS|RTICLE|SIDE|UDIO)|BLOCKQUOTE|CAPTION|D(?:[DLT]|IV)|F(?:IGURE|IGCAPTION|OOTER)|H[1-6]|HEADER|HR|L(?:ABEL|EGEND|I)|O(?:L|UTPUT)|P(?:RE)?|SECTION|T(?:ABLE|BODY|D|FOOT|H|HEAD|R)|COL(?:GROUP)?|UL)$/,je=/^(?:HEAD|META|STYLE)/,Qe=new n(null,4|q),$e=function(e,t){var n,o=t.allowedBlocks,i=!1,r=o.length;if(r){for(n=0;n<r;n+=1)o[n]=o[n].toUpperCase();i=new RegExp(o.join("|")).test(e)}return Ze.test(e)||i},Ve=function e(t,n,o){var i,r,s,d,l,c,h,u,f,p,g,m,v=t.childNodes;for(i=t;a(i);)i=i.parentNode;for(Qe.root=i,r=0,s=v.length;r<s;r+=1)if(d=v[r],l=d.nodeName,c=d.nodeType,h=Ge[l],c===M){if(u=d.childNodes.length,h)d=h(d,t,n);else{if(je.test(l)){t.removeChild(d),r-=1,s-=1;continue}if(!$e(l,n)&&!a(d)){r-=1,s+=u-1,t.replaceChild(y(d),d);continue}}u&&e(d,n,o||"PRE"===l)}else{if(c===H){if(g=d.data,f=!le.test(g.charAt(0)),p=!le.test(g.charAt(g.length-1)),o||!f&&!p)continue;if(f){for(Qe.currentNode=d;(m=Qe.previousPONode())&&!("IMG"===(l=m.nodeName)||"#text"===l&&le.test(m.data));)if(!a(m)){m=null;break}g=g.replace(/^[ \t\r\n]+/g,m?" ":"")}if(p){for(Qe.currentNode=d;(m=Qe.nextNode())&&!("IMG"===l||"#text"===l&&le.test(m.data));)if(!a(m)){m=null;break}g=g.replace(/[ \t\r\n]+$/g,m?" ":"")}if(g){d.data=g;continue}}t.removeChild(d),r-=1,s-=1}return t},Ye=function e(t){for(var n,o=t.childNodes,r=o.length;r--;)if(n=o[r],n.nodeType!==M||i(n))n.nodeType!==H||n.data||t.removeChild(n);else{e(n);var s="FIGURE"===n.tagName;!a(n)&&!s||n.firstChild||t.removeChild(n)}},Xe=function(e){return e.nodeType===M?"BR"===e.nodeName||"IMG"===e.nodeName:le.test(e.data)},Je=function(e,t){for(var o,i=e.parentNode;a(i);)i=i.parentNode;return o=new n(i,4|q,Xe),o.currentNode=e,!!o.nextNode()||t&&!o.previousNode()},et=function(e,t,n){var o,i,r,s=e.querySelectorAll("BR"),d=[],l=s.length;for(o=0;o<l;o+=1)d[o]=Je(s[o],n);for(;l--;)i=s[l],(r=i.parentNode)&&(d[l]?a(r)||b(r,t):_(i))},tt=function(e,t,n,o){var i,r,a=t.ownerDocument.body,s=o.willCutCopy;et(t,n,!0),t.setAttribute("style","position:fixed;overflow:hidden;bottom:100%;right:100%;"),a.appendChild(t),i=t.innerHTML,r=t.innerText||t.textContent,s&&(i=s(i)),V&&(r=r.replace(/\r?\n/g,"\r\n")),e.setData("text/html",i),e.setData("text/plain",r),a.removeChild(t)},nt=function(e){var t,n,o,i,r,a,s,d=e.clipboardData,l=this.getSelection(),c=this._root,h=this;if(l.collapsed)return void e.preventDefault();if(this.saveUndoState(l),ee||Q||!d)setTimeout(function(){try{h._ensureBottomLine()}catch(e){h.didError(e)}},0);else{for(t=Le(l,c),n=Be(l,c),o=t===n&&t||c,i=Ee(l,c),r=l.commonAncestorContainer,r.nodeType===H&&(r=r.parentNode);r&&r!==o;)a=r.cloneNode(!1),a.appendChild(i),i=a,r=r.parentNode;s=this.createElement("div"),s.appendChild(i),tt(d,s,c,this._config),e.preventDefault()}this.setSelection(l)},ot=function(e){var t,n,o,i,r,a,s,d=e.clipboardData,l=this.getSelection(),c=this._root;if(!ee&&!Q&&d){for(t=Le(l,c),n=Be(l,c),o=t===n&&t||c,l=l.cloneRange(),xe(l),Ae(l,o,o,c),i=l.cloneContents(),r=l.commonAncestorContainer,r.nodeType===H&&(r=r.parentNode);r&&r!==o;)a=r.cloneNode(!1),a.appendChild(i),i=a,r=r.parentNode;s=this.createElement("div"),s.appendChild(i),tt(d,s,c,this._config),e.preventDefault()}},it=function(e){var t,n,o,i,r,a=e.clipboardData,s=a&&a.items,d=this.isShiftDown,l=!1,c=!1,h=null,u=this;if(s){for(e.preventDefault(),t=s.length;t--;){if(n=s[t],o=n.type,!d&&"text/html"===o)return void n.getAsString(function(e){u.insertHTML(e,!0)});"text/plain"===o&&(h=n),!d&&/^image\/.*/.test(o)&&(c=!0)}return void(c?(this.fireEvent("dragover",{dataTransfer:a,preventDefault:function(){l=!0}}),l&&this.fireEvent("drop",{dataTransfer:a})):h&&h.getAsString(function(e){u.insertPlainText(e,!0)}))}if(i=a&&a.types,!ee&&i&&(ce.call(i,"text/html")>-1||!Y&&ce.call(i,"text/plain")>-1&&ce.call(i,"text/rtf")<0))return e.preventDefault(),void(!d&&(r=a.getData("text/html"))?this.insertHTML(r,!0):((r=a.getData("text/plain"))||(r=a.getData("text/uri-list")))&&this.insertPlainText(r,!0));this._awaitingPaste=!0;var f=this._doc.body,p=this.getSelection(),g=p.startContainer,m=p.startOffset,v=p.endContainer,C=p.endOffset,N=this.createElement("DIV",{contenteditable:"true",style:"position:fixed; overflow:hidden; top:0; right:100%; width:1px; height:1px;"});f.appendChild(N),p.selectNodeContents(N),this.setSelection(p),setTimeout(function(){try{u._awaitingPaste=!1;for(var e,t,n="",o=N;N=o;)o=N.nextSibling,_(N),e=N.firstChild,e&&e===N.lastChild&&"DIV"===e.nodeName&&(N=e),n+=N.innerHTML;t=u.createRange(g,m,v,C),u.setSelection(t),n&&u.insertHTML(n,!0)}catch(e){u.didError(e)}},0)},rt=function(e){for(var t=e.dataTransfer.types,n=t.length,o=!1,i=!1;n--;)switch(t[n]){case"text/plain":o=!0;break;case"text/html":i=!0;break;default:return}(i||o)&&this.saveUndoState()},at=P.prototype,st=function(e,t,n){var o=n._doc,i=e?DOMPurify.sanitize(e,{ALLOW_UNKNOWN_PROTOCOLS:!0,WHOLE_DOCUMENT:!1,RETURN_DOM:!0,RETURN_DOM_FRAGMENT:!0}):null;return i?o.importNode(i,!0):o.createDocumentFragment()};at.setConfig=function(e){return e=D({blockTag:"DIV",blockAttributes:null,tagAttributes:{blockquote:null,ul:null,ol:null,li:null,a:null},classNames:{colour:"colour",fontFamily:"font",fontSize:"size",highlight:"highlight"},leafNodeNames:pe,undo:{documentSizeThreshold:-1,undoLimit:-1},isInsertedHTMLSanitized:!0,isSetHTMLSanitized:!0,sanitizeToDOMFragment:"undefined"!=typeof DOMPurify&&DOMPurify.isSupported?st:null,willCutCopy:null,allowedBlocks:[]},e,!0),e.blockTag=e.blockTag.toUpperCase(),this._config=e,this},at.createElement=function(e,t,n){return T(this._doc,e,t,n)},at.createDefaultBlock=function(e){var t=this._config;return E(this.createElement(t.blockTag,t.blockAttributes,e),this._root)},at.didError=function(e){console.log(e)},at.getDocument=function(){return this._doc},at.getRoot=function(){return this._root},at.modifyDocument=function(e){var t=this._mutation;t&&(t.takeRecords().length&&this._docWasChanged(),t.disconnect()),this._ignoreAllChanges=!0,e(),this._ignoreAllChanges=!1,t&&(t.observe(this._root,{childList:!0,attributes:!0,characterData:!0,subtree:!0}),this._ignoreChange=!1)};var dt={pathChange:1,select:1,input:1,undoStateChange:1};at.fireEvent=function(e,t){var n,o,i,r=this._events[e];if(/^(?:focus|blur)/.test(e))if(n=this._root===this._doc.activeElement,"focus"===e){if(!n||this._isFocused)return this;this._isFocused=!0}else{if(n||!this._isFocused)return this;this._isFocused=!1}if(r)for(t||(t={}),t.type!==e&&(t.type=e),r=r.slice(),o=r.length;o--;){i=r[o];try{i.handleEvent?i.handleEvent(t):i.call(this,t)}catch(t){t.details="Squire: fireEvent error. Event type: "+e,this.didError(t)}}return this},at.destroy=function(){var e,t=this._events;for(e in t)this.removeEventListener(e);this._mutation&&this._mutation.disconnect(),delete this._root.__squire__,this._undoIndex=-1,this._undoStack=[],this._undoStackLength=0},at.handleEvent=function(e){this.fireEvent(e.type,e)},at.addEventListener=function(e,t){var n=this._events[e],o=this._root;return t?(n||(n=this._events[e]=[],dt[e]||("selectionchange"===e&&(o=this._doc),o.addEventListener(e,this,!0))),n.push(t),this):(this.didError({name:"Squire: addEventListener with null or undefined fn",message:"Event type: "+e}),this)},at.removeEventListener=function(e,t){var n,o=this._events[e],i=this._root;if(o){if(t)for(n=o.length;n--;)o[n]===t&&o.splice(n,1);else o.length=0;o.length||(delete this._events[e],dt[e]||("selectionchange"===e&&(i=this._doc),i.removeEventListener(e,this,!0)))}return this},at.createRange=function(e,t,n,o){if(e instanceof this._win.Range)return e.cloneRange();var i=this._doc.createRange();return i.setStart(e,t),n?i.setEnd(n,o):i.setEnd(e,t),i},at.getCursorPosition=function(e){if(!e&&!(e=this.getSelection())||!e.getBoundingClientRect)return null;var t,n,o=e.getBoundingClientRect();return o&&!o.top&&(this._ignoreChange=!0,t=this._doc.createElement("SPAN"),t.textContent=K,ye(e,t),o=t.getBoundingClientRect(),n=t.parentNode,n.removeChild(t),A(n,e),this._ignoreChange=!1),o},at._moveCursorTo=function(e){var t=this._root,n=this.createRange(t,e?0:t.childNodes.length);return xe(n),this.setSelection(n),this},at.moveCursorToStart=function(){return this._moveCursorTo(!0)},at.moveCursorToEnd=function(){return this._moveCursorTo(!1)};var lt=function(e){return e._win.getSelection()||null};at.setSelection=function(e){if(e)if(this._lastSelection=e,this._isFocused)if(j&&!this._restoreSelection)U.call(this),this.blur(),this.focus();else{Q&&this._win.focus();var t=lt(this);t&&(t.removeAllRanges(),t.addRange(e))}else U.call(this);return this},at.getSelection=function(){var e,t,n,o,r=lt(this),a=this._root;return this._isFocused&&r&&r.rangeCount&&(e=r.getRangeAt(0).cloneRange(),t=e.startContainer,n=e.endContainer,t&&i(t)&&e.setStartBefore(t),n&&i(n)&&e.setEndBefore(n)),e&&v(a,e.commonAncestorContainer)?this._lastSelection=e:(e=this._lastSelection,o=e.commonAncestorContainer,v(o.ownerDocument,o)||(e=null)),e||(e=this.createRange(a.firstChild,0)),e},at.getSelectedText=function(){var e=this.getSelection();if(!e||e.collapsed)return"";var t,o=new n(e.commonAncestorContainer,4|q,function(t){return ke(e,t,!0)}),i=e.startContainer,r=e.endContainer,s=o.currentNode=i,d="",l=!1;for(o.filter(s)||(s=o.nextNode());s;)s.nodeType===H?(t=s.data)&&/\S/.test(t)&&(s===r&&(t=t.slice(0,e.endOffset)),s===i&&(t=t.slice(e.startOffset)),d+=t,l=!0):("BR"===s.nodeName||l&&!a(s))&&(d+="\n",l=!1),s=o.nextNode();return d},at.getPath=function(){return this._path};var ct=function(e,t){for(var o,i,r,s=new n(e,4);i=s.nextNode();)for(;(r=i.data.indexOf(K))>-1&&(!t||i.parentNode!==t);){if(1===i.length){do{o=i.parentNode,o.removeChild(i),i=o,s.currentNode=o}while(a(i)&&!N(i));break}i.deleteData(r,1)}};at._didAddZWS=function(){this._hasZWS=!0},at._removeZWS=function(){this._hasZWS&&(ct(this._root),this._hasZWS=!1)},at._updatePath=function(e,t){if(e){var n,o=e.startContainer,i=e.endContainer;(t||o!==this._lastAnchorNode||i!==this._lastFocusNode)&&(this._lastAnchorNode=o,this._lastFocusNode=i,
n=o&&i?o===i?C(i,this._root,this._config):"(selection)":"",this._path!==n&&(this._path=n,this.fireEvent("pathChange",{path:n}))),this.fireEvent(e.collapsed?"cursor":"select",{range:e})}},at._updatePathOnEvent=function(e){var t=this;t._isFocused&&!t._willUpdatePath&&(t._willUpdatePath=!0,setTimeout(function(){t._willUpdatePath=!1,t._updatePath(t.getSelection())},0))},at.focus=function(){if(ne){try{this._root.setActive()}catch(e){}this.fireEvent("focus")}else this._root.focus();return this},at.blur=function(){return this._root.blur(),ne&&this.fireEvent("blur"),this};var ht="squire-selection-end";at._saveRangeToBookmark=function(e){var t,n=this.createElement("INPUT",{id:"squire-selection-start",type:"hidden"}),o=this.createElement("INPUT",{id:ht,type:"hidden"});ye(e,n),e.collapse(!1),ye(e,o),2&n.compareDocumentPosition(o)&&(n.id=ht,o.id="squire-selection-start",t=n,n=o,o=t),e.setStartAfter(n),e.setEndBefore(o)},at._getRangeAndRemoveBookmark=function(e){var t=this._root,n=t.querySelector("#squire-selection-start"),o=t.querySelector("#"+ht);if(n&&o){var i=n.parentNode,r=o.parentNode,a=ce.call(i.childNodes,n),s=ce.call(r.childNodes,o);i===r&&(s-=1),_(n),_(o),e||(e=this._doc.createRange()),e.setStart(i,a),e.setEnd(r,s),A(i,e),i!==r&&A(r,e),e.collapsed&&(i=e.startContainer,i.nodeType===H&&(r=i.childNodes[e.startOffset],r&&r.nodeType===H||(r=i.childNodes[e.startOffset-1]),r&&r.nodeType===H&&(e.setStart(r,0),e.collapse(!0))))}return e||null},at._keyUpDetectChange=function(e){var t=e.keyCode;e.ctrlKey||e.metaKey||e.altKey||!(t<16||t>20)||!(t<33||t>45)||this._docWasChanged()},at._docWasChanged=function(){if(de&&(Ne=new WeakMap),!this._ignoreAllChanges){if(se&&this._ignoreChange)return void(this._ignoreChange=!1);this._isInUndoState&&(this._isInUndoState=!1,this.fireEvent("undoStateChange",{canUndo:!0,canRedo:!1})),this.fireEvent("input")}},at._recordUndoState=function(e,t){if(!this._isInUndoState||t){var n,o=this._undoIndex,i=this._undoStack,r=this._config.undo,a=r.documentSizeThreshold,s=r.undoLimit;t||(o+=1),o<this._undoStackLength&&(i.length=this._undoStackLength=o),e&&this._saveRangeToBookmark(e),n=this._getHTML(),a>-1&&2*n.length>a&&s>-1&&o>s&&(i.splice(0,o-s),o=s,this._undoStackLength=s),i[o]=n,this._undoIndex=o,this._undoStackLength+=1,this._isInUndoState=!0}},at.saveUndoState=function(e){return e===t&&(e=this.getSelection()),this._recordUndoState(e,this._isInUndoState),this._getRangeAndRemoveBookmark(e),this},at.undo=function(){if(0!==this._undoIndex||!this._isInUndoState){this._recordUndoState(this.getSelection(),!1),this._undoIndex-=1,this._setHTML(this._undoStack[this._undoIndex]);var e=this._getRangeAndRemoveBookmark();e&&this.setSelection(e),this._isInUndoState=!0,this.fireEvent("undoStateChange",{canUndo:0!==this._undoIndex,canRedo:!0}),this.fireEvent("input")}return this},at.redo=function(){var e=this._undoIndex,t=this._undoStackLength;if(e+1<t&&this._isInUndoState){this._undoIndex+=1,this._setHTML(this._undoStack[this._undoIndex]);var n=this._getRangeAndRemoveBookmark();n&&this.setSelection(n),this.fireEvent("undoStateChange",{canUndo:!0,canRedo:e+2<t}),this.fireEvent("input")}return this},at.hasFormat=function(e,t,o){if(e=e.toUpperCase(),t||(t={}),!o&&!(o=this.getSelection()))return!1;!o.collapsed&&o.startContainer.nodeType===H&&o.startOffset===o.startContainer.length&&o.startContainer.nextSibling&&o.setStartBefore(o.startContainer.nextSibling),!o.collapsed&&o.endContainer.nodeType===H&&0===o.endOffset&&o.endContainer.previousSibling&&o.setEndAfter(o.endContainer.previousSibling);var i,r,a=this._root,s=o.commonAncestorContainer;if(g(s,a,e,t))return!0;if(s.nodeType===H)return!1;i=new n(s,4,function(e){return ke(o,e,!0)});for(var d=!1;r=i.nextNode();){if(!g(r,a,e,t))return!1;d=!0}return d},at.getFontInfo=function(e){var n,o,i,r={color:t,backgroundColor:t,family:t,size:t},a=0;if(!e&&!(e=this.getSelection()))return r;if(n=e.commonAncestorContainer,e.collapsed||n.nodeType===H)for(n.nodeType===H&&(n=n.parentNode);a<4&&n;)(o=n.style)&&(!r.color&&(i=o.color)&&(r.color=i,a+=1),!r.backgroundColor&&(i=o.backgroundColor)&&(r.backgroundColor=i,a+=1),!r.family&&(i=o.fontFamily)&&(r.family=i,a+=1),!r.size&&(i=o.fontSize)&&(r.size=i,a+=1)),n=n.parentNode;return r},at._addFormat=function(e,t,o){var i,r,s,d,l,c,h,u,f=this._root;if(o.collapsed){for(i=E(this.createElement(e,t),f),ye(o,i),o.setStart(i.firstChild,i.firstChild.length),o.collapse(!0),u=i;a(u);)u=u.parentNode;ct(u,i)}else{if(r=new n(o.commonAncestorContainer,4|q,function(e){return(e.nodeType===H||"BR"===e.nodeName||"IMG"===e.nodeName)&&ke(o,e,!0)}),s=o.startContainer,l=o.startOffset,d=o.endContainer,c=o.endOffset,r.currentNode=s,r.filter(s)||(s=r.nextNode(),l=0),!s)return o;do{h=r.currentNode,!g(h,f,e,t)&&(h===d&&h.length>c&&h.splitText(c),h===s&&l&&(h=h.splitText(l),d===s&&(d=h,c-=l),s=h,l=0),i=this.createElement(e,t),S(h,i),i.appendChild(h))}while(r.nextNode());d.nodeType!==H&&(h.nodeType===H?(d=h,c=h.length):(d=h.parentNode,c=1)),o=this.createRange(s,l,d,c)}return o},at._removeFormat=function(e,t,n,o){this._saveRangeToBookmark(n);var i,r=this._doc;n.collapsed&&(re?(i=r.createTextNode(K),this._didAddZWS()):i=r.createTextNode(""),ye(n,i));for(var s=n.commonAncestorContainer;a(s);)s=s.parentNode;var d=n.startContainer,l=n.startOffset,c=n.endContainer,h=n.endOffset,u=[],f=function(e,t){if(!ke(n,e,!1)){var o,i,r=e.nodeType===H;if(!ke(n,e,!0))return void("INPUT"===e.nodeName||r&&!e.data||u.push([t,e]));if(r)e===c&&h!==e.length&&u.push([t,e.splitText(h)]),e===d&&l&&(e.splitText(l),u.push([t,e]));else for(o=e.firstChild;o;o=i)i=o.nextSibling,f(o,t)}},g=Array.prototype.filter.call(s.getElementsByTagName(e),function(o){return ke(n,o,!0)&&p(o,e,t)});return o||g.forEach(function(e){f(e,e)}),u.forEach(function(e){var t=e[0].cloneNode(!1),n=e[1];S(n,t),t.appendChild(n)}),g.forEach(function(e){S(e,y(e))}),this._getRangeAndRemoveBookmark(n),i&&n.collapse(!1),A(s,n),n},at.changeFormat=function(e,t,n,o){return n||(n=this.getSelection())?(this.saveUndoState(n),t&&(n=this._removeFormat(t.tag.toUpperCase(),t.attributes||{},n,o)),e&&(n=this._addFormat(e.tag.toUpperCase(),e.attributes||{},n)),this.setSelection(n),this._updatePath(n,!0),se||this._docWasChanged(),this):this};var ut={DT:"DD",DD:"DT",LI:"LI",PRE:"PRE"},ft=function(e,t,n,o){var i=ut[t.nodeName],r=null,a=k(n,o,t.parentNode,e._root),s=e._config;return i||(i=s.blockTag,r=s.blockAttributes),p(a,i,r)||(t=T(a.ownerDocument,i,r),a.dir&&(t.dir=a.dir),S(a,t),t.appendChild(y(a)),a=t),a};at.forEachBlock=function(e,t,n){if(!n&&!(n=this.getSelection()))return this;t&&this.saveUndoState(n);var o=this._root,i=Le(n,o),r=Be(n,o);if(i&&r)do{if(e(i)||i===r)break}while(i=h(i,o));return t&&(this.setSelection(n),this._updatePath(n,!0),se||this._docWasChanged()),this},at.modifyBlocks=function(e,t){if(!t&&!(t=this.getSelection()))return this;this._recordUndoState(t,this._isInUndoState);var n,o=this._root;return Pe(t,o),Ae(t,o,o,o),n=Te(t,o,o),ye(t,e.call(this,n)),t.endOffset<t.endContainer.childNodes.length&&O(t.endContainer.childNodes[t.endOffset],o),O(t.startContainer.childNodes[t.startOffset],o),this._getRangeAndRemoveBookmark(t),this.setSelection(t),this._updatePath(t,!0),se||this._docWasChanged(),this};var pt=function(e){return this.createElement("BLOCKQUOTE",this._config.tagAttributes.blockquote,[e])},gt=function(e){var t=this._root,n=e.querySelectorAll("blockquote");return Array.prototype.filter.call(n,function(e){return!g(e.parentNode,t,"BLOCKQUOTE")}).forEach(function(e){S(e,y(e))}),e},mt=function(){return this.createDefaultBlock([this.createElement("INPUT",{id:"squire-selection-start",type:"hidden"}),this.createElement("INPUT",{id:ht,type:"hidden"})])},vt=function(e,t,n){for(var o,i,r,a,s=l(t,e._root),d=e._config.tagAttributes,c=d[n.toLowerCase()],h=d.li;o=s.nextNode();)"LI"===o.parentNode.nodeName&&(o=o.parentNode,s.currentNode=o.lastChild),"LI"!==o.nodeName?(a=e.createElement("LI",h),o.dir&&(a.dir=o.dir),(r=o.previousSibling)&&r.nodeName===n?(r.appendChild(a),_(o)):S(o,e.createElement(n,c,[a])),a.appendChild(y(o)),s.currentNode=a):(o=o.parentNode,(i=o.nodeName)!==n&&/^[OU]L$/.test(i)&&S(o,e.createElement(n,c,[y(o)])))},Ct=function(e){return vt(this,e,"UL"),e},Nt=function(e){return vt(this,e,"OL"),e},_t=function(e){var t,n,o,i,r,a=e.querySelectorAll("UL, OL"),d=e.querySelectorAll("LI"),l=this._root;for(t=0,n=a.length;t<n;t+=1)o=a[t],i=y(o),b(i,l),S(o,i);for(t=0,n=d.length;t<n;t+=1)r=d[t],s(r)?S(r,this.createDefaultBlock([y(r)])):(b(r,l),S(r,y(r)));return e},St=function(e,t){for(var n=e.commonAncestorContainer,o=e.startContainer,i=e.endContainer;n&&n!==t&&!/^[OU]L$/.test(n.nodeName);)n=n.parentNode;if(!n||n===t)return null;for(o===n&&(o=o.childNodes[e.startOffset]),i===n&&(i=i.childNodes[e.endOffset]);o&&o.parentNode!==n;)o=o.parentNode;for(;i&&i.parentNode!==n;)i=i.parentNode;return[n,o,i]};at.increaseListLevel=function(e){if(!e&&!(e=this.getSelection()))return this.focus();var t=this._root,n=St(e,t);if(!n)return this.focus();var o=n[0],i=n[1],r=n[2];if(!i||i===o.firstChild)return this.focus();this._recordUndoState(e,this._isInUndoState);var a,s,d=o.nodeName,l=i.previousSibling;l.nodeName!==d&&(a=this._config.tagAttributes[d.toLowerCase()],l=this.createElement(d,a),o.insertBefore(l,i));do{s=i===r?null:i.nextSibling,l.appendChild(i)}while(i=s);return s=l.nextSibling,s&&O(s,t),this._getRangeAndRemoveBookmark(e),this.setSelection(e),this._updatePath(e,!0),se||this._docWasChanged(),this.focus()},at.decreaseListLevel=function(e){if(!e&&!(e=this.getSelection()))return this.focus();var t=this._root,n=St(e,t);if(!n)return this.focus();var o=n[0],i=n[1],r=n[2];i||(i=o.firstChild),r||(r=o.lastChild),this._recordUndoState(e,this._isInUndoState);var a,s=o.parentNode,d=r.nextSibling?k(o,r.nextSibling,s,t):o.nextSibling;if(s!==t&&"LI"===s.nodeName){for(s=s.parentNode;d;)a=d.nextSibling,r.appendChild(d),d=a;d=o.parentNode.nextSibling}var l=!/^[OU]L$/.test(s.nodeName);do{a=i===r?null:i.nextSibling,o.removeChild(i),l&&"LI"===i.nodeName&&(i=this.createDefaultBlock([y(i)])),s.insertBefore(i,d)}while(i=a);return o.firstChild||_(o),d&&O(d,t),this._getRangeAndRemoveBookmark(e),this.setSelection(e),this._updatePath(e,!0),se||this._docWasChanged(),this.focus()},at._ensureBottomLine=function(){var e=this._root,t=e.lastElementChild;t&&t.nodeName===this._config.blockTag&&s(t)||e.appendChild(this.createDefaultBlock())},at.setKeyHandler=function(e,t){return this._keyHandlers[e]=t,this},at._getHTML=function(){return this._root.innerHTML},at._setHTML=function(e){var t=this._root,n=t;n.innerHTML=e;do{E(n,t)}while(n=h(n,t));this._ignoreChange=!0},at.getHTML=function(e){var t,n,o,i,r,a,s=[];if(e&&(a=this.getSelection())&&this._saveRangeToBookmark(a),ie)for(t=this._root,n=t;n=h(n,t);)n.textContent||n.querySelector("BR")||(o=this.createElement("BR"),n.appendChild(o),s.push(o));if(i=this._getHTML().replace(/\u200B/g,""),ie)for(r=s.length;r--;)_(s[r]);return a&&this._getRangeAndRemoveBookmark(a),i},at.setHTML=function(e){var t,n,o,i=this._config,r=i.isSetHTMLSanitized?i.sanitizeToDOMFragment:null,a=this._root;"function"==typeof r?n=r(e,!1,this):(t=this.createElement("DIV"),t.innerHTML=e,n=this._doc.createDocumentFragment(),n.appendChild(y(t))),Ve(n,i),et(n,a,!1),b(n,a);for(var s=n;s=h(s,a);)E(s,a);for(this._ignoreChange=!0;o=a.lastChild;)a.removeChild(o);a.appendChild(n),E(a,a),this._undoIndex=-1,this._undoStack.length=0,this._undoStackLength=0,this._isInUndoState=!1;var d=this._getRangeAndRemoveBookmark()||this.createRange(a.firstChild,0);return this.saveUndoState(d),this._lastSelection=d,U.call(this),this._updatePath(d,!0),this},at.insertElement=function(e,t){if(t||(t=this.getSelection()),t.collapse(!0),a(e))ye(t,e),t.setStartAfter(e);else{for(var n,o,i=this._root,r=Le(t,i)||i;r!==i&&!r.nextSibling;)r=r.parentNode;r!==i&&(n=r.parentNode,o=k(n,r.nextSibling,i,i)),o?i.insertBefore(e,o):(i.appendChild(e),o=this.createDefaultBlock(),i.appendChild(o)),t.setStart(o,0),t.setEnd(o,0),xe(t)}return this.focus(),this.setSelection(t),this._updatePath(t),se||this._docWasChanged(),this},at.insertImage=function(e,t){var n=this.createElement("IMG",D({src:e},t,!0));return this.insertElement(n),n},at.linkRegExp=/\b((?:(?:ht|f)tps?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,}\/)(?:[^\s()<>]+|\([^\s()<>]+\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))|([\w\-.%+]+@(?:[\w\-]+\.)+[A-Z]{2,}\b)(?:\?[^&?\s]+=[^&?\s]+(?:&[^&?\s]+=[^&?\s]+)*)?/i;var yt=function(e,t,o){var i,r,a,s,d,l,c,h=e.ownerDocument,u=new n(e,4,function(e){return!g(e,t,"A")}),f=o.linkRegExp,p=o._config.tagAttributes.a;if(f)for(;i=u.nextNode();)for(r=i.data,a=i.parentNode;s=f.exec(r);)d=s.index,l=d+s[0].length,d&&(c=h.createTextNode(r.slice(0,d)),a.insertBefore(c,i)),c=o.createElement("A",D({href:s[1]?/^(?:ht|f)tps?:/i.test(s[1])?s[1]:"http://"+s[1]:"mailto:"+s[0]},p,!1)),c.textContent=r.slice(d,l),a.insertBefore(c,i),i.data=r=r.slice(l)};at.insertHTML=function(e,t){var n,o,i,r,a,s,d,l=this._config,c=l.isInsertedHTMLSanitized?l.sanitizeToDOMFragment:null,u=this.getSelection(),f=this._doc;"function"==typeof c?r=c(e,t,this):(t&&(n=e.indexOf("\x3c!--StartFragment--\x3e"),o=e.lastIndexOf("\x3c!--EndFragment--\x3e"),n>-1&&o>-1&&(e=e.slice(n+20,o))),/<\/td>((?!<\/tr>)[\s\S])*$/i.test(e)&&(e="<TR>"+e+"</TR>"),/<\/tr>((?!<\/table>)[\s\S])*$/i.test(e)&&(e="<TABLE>"+e+"</TABLE>"),i=this.createElement("DIV"),i.innerHTML=e,r=f.createDocumentFragment(),r.appendChild(y(i))),this.saveUndoState(u);try{for(a=this._root,s=r,d={fragment:r,preventDefault:function(){this.defaultPrevented=!0},defaultPrevented:!1},yt(r,r,this),Ve(r,l),et(r,a,!1),Ye(r),r.normalize();s=h(s,r);)E(s,a);t&&this.fireEvent("willPaste",d),d.defaultPrevented||(be(u,d.fragment,a),se||this._docWasChanged(),u.collapse(!1),this._ensureBottomLine()),this.setSelection(u),this._updatePath(u,!0),t&&this.focus()}catch(e){this.didError(e)}return this};var Tt=function(e){return e.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split('"').join("&quot;")};at.insertPlainText=function(e,t){var n=this.getSelection();if(n.collapsed&&g(n.startContainer,this._root,"PRE")){var o,i,r=n.startContainer,a=n.startOffset;return r&&r.nodeType===H||(o=this._doc.createTextNode(""),r.insertBefore(o,r.childNodes[a]),r=o,a=0),i={text:e,preventDefault:function(){this.defaultPrevented=!0},defaultPrevented:!1},t&&this.fireEvent("willPaste",i),i.defaultPrevented||(e=i.text,r.insertData(a,e),n.setStart(r,a+e.length),n.collapse(!0)),this.setSelection(n),this}var s,d,l,c,h=e.split("\n"),u=this._config,f=u.blockTag,p=u.blockAttributes,m="</"+f+">",v="<"+f;for(s in p)v+=" "+s+'="'+Tt(p[s])+'"';for(v+=">",d=0,l=h.length;d<l;d+=1)c=h[d],c=Tt(c).replace(/ (?= )/g,"&nbsp;"),h[d]=v+(c||"<BR>")+m;return this.insertHTML(h.join(""),t)};var Et=function(e,t,n){return function(){return this[e](t,n),this.focus()}};at.addStyles=function(e){if(e){var t=this._doc.documentElement.firstChild,n=this.createElement("STYLE",{type:"text/css"});n.appendChild(this._doc.createTextNode(e)),t.appendChild(n)}return this},at.bold=Et("changeFormat",{tag:"B"}),at.italic=Et("changeFormat",{tag:"I"}),at.underline=Et("changeFormat",{tag:"U"}),at.strikethrough=Et("changeFormat",{tag:"S"}),at.subscript=Et("changeFormat",{tag:"SUB"},{tag:"SUP"}),at.superscript=Et("changeFormat",{tag:"SUP"},{tag:"SUB"}),at.removeBold=Et("changeFormat",null,{tag:"B"}),at.removeItalic=Et("changeFormat",null,{tag:"I"}),at.removeUnderline=Et("changeFormat",null,{tag:"U"}),at.removeStrikethrough=Et("changeFormat",null,{tag:"S"}),at.removeSubscript=Et("changeFormat",null,{tag:"SUB"}),at.removeSuperscript=Et("changeFormat",null,{tag:"SUP"}),at.makeLink=function(e,t){var n=this.getSelection();if(n.collapsed){var o=e.indexOf(":")+1;if(o)for(;"/"===e[o];)o+=1;ye(n,this._doc.createTextNode(e.slice(o)))}return t=D(D({href:e},t,!0),this._config.tagAttributes.a,!1),this.changeFormat({tag:"A",attributes:t},{tag:"A"},n),this.focus()},at.removeLink=function(){return this.changeFormat(null,{tag:"A"},this.getSelection(),!0),this.focus()},at.setFontFace=function(e){var t=this._config.classNames.fontFamily;return this.changeFormat(e?{tag:"SPAN",attributes:{class:t,style:"font-family: "+e+", sans-serif;"}}:null,{tag:"SPAN",attributes:{class:t}}),this.focus()},at.setFontSize=function(e){var t=this._config.classNames.fontSize;return this.changeFormat(e?{tag:"SPAN",attributes:{class:t,style:"font-size: "+("number"==typeof e?e+"px":e)}}:null,{tag:"SPAN",attributes:{class:t}}),this.focus()},at.setTextColour=function(e){var t=this._config.classNames.colour;return this.changeFormat(e?{tag:"SPAN",attributes:{class:t,style:"color:"+e}}:null,{tag:"SPAN",attributes:{class:t}}),this.focus()},at.setHighlightColour=function(e){var t=this._config.classNames.highlight;return this.changeFormat(e?{tag:"SPAN",attributes:{class:t,style:"background-color:"+e}}:e,{tag:"SPAN",attributes:{class:t}}),this.focus()},at.setTextAlignment=function(e){return this.forEachBlock(function(t){var n=t.className.split(/\s+/).filter(function(e){return!!e&&!/^align/.test(e)}).join(" ");e?(t.className=n+" align-"+e,t.style.textAlign=e):(t.className=n,t.style.textAlign="")},!0),this.focus()},at.setTextDirection=function(e){return this.forEachBlock(function(t){e?t.dir=e:t.removeAttribute("dir")},!0),this.focus()};var bt=function(e){for(var t,o=this._root,i=this._doc,r=i.createDocumentFragment(),a=l(e,o);t=a.nextNode();){var s,d,c=t.querySelectorAll("BR"),h=[],u=c.length;for(s=0;s<u;s+=1)h[s]=Je(c[s],!1);for(;u--;)d=c[u],h[u]?S(d,i.createTextNode("\n")):_(d);for(c=t.querySelectorAll("CODE"),u=c.length;u--;)_(c[u]);r.childNodes.length&&r.appendChild(i.createTextNode("\n")),r.appendChild(y(t))}for(a=new n(r,4);t=a.nextNode();)t.data=t.data.replace(/ /g," ");return r.normalize(),E(this.createElement("PRE",this._config.tagAttributes.pre,[r]),o)},kt=function(e){for(var t,o,i,r,a,s,d=this._doc,l=this._root,c=e.querySelectorAll("PRE"),h=c.length;h--;){for(t=c[h],o=new n(t,4);i=o.nextNode();){for(r=i.data,r=r.replace(/ (?= )/g," "),a=d.createDocumentFragment();(s=r.indexOf("\n"))>-1;)a.appendChild(d.createTextNode(r.slice(0,s))),a.appendChild(d.createElement("BR")),r=r.slice(s+1);i.parentNode.insertBefore(a,i),i.data=r}b(t,l),S(t,y(t))}return e};at.code=function(){var e=this.getSelection();return e.collapsed||d(e.commonAncestorContainer)?this.modifyBlocks(bt,e):this.changeFormat({tag:"CODE",attributes:this._config.tagAttributes.code},null,e),this.focus()},at.removeCode=function(){var e=this.getSelection();return g(e.commonAncestorContainer,this._root,"PRE")?this.modifyBlocks(kt,e):this.changeFormat(null,{tag:"CODE"},e),this.focus()},at.toggleCode=function(){return this.hasFormat("PRE")||this.hasFormat("CODE")?this.removeCode():this.code(),this},at.removeAllFormatting=function(e){if(!e&&!(e=this.getSelection())||e.collapsed)return this;for(var t=this._root,n=e.commonAncestorContainer;n&&!s(n);)n=n.parentNode;if(n||(Pe(e,t),n=t),n.nodeType===H)return this;this.saveUndoState(e),Ae(e,n,n,t);for(var o,i,r=n.ownerDocument,a=e.startContainer,d=e.startOffset,l=e.endContainer,c=e.endOffset,h=r.createDocumentFragment(),u=r.createDocumentFragment(),f=k(l,c,n,t),p=k(a,d,n,t);p!==f;)o=p.nextSibling,h.appendChild(p),p=o;return F(this,h,u),u.normalize(),p=u.firstChild,o=u.lastChild,i=n.childNodes,p?(n.insertBefore(u,f),d=ce.call(i,p),c=ce.call(i,o)+1):(d=ce.call(i,f),c=d),e.setStart(n,d),e.setEnd(n,c),A(n,e),xe(e),this.setSelection(e),this._updatePath(e,!0),this.focus()},at.increaseQuoteLevel=Et("modifyBlocks",pt),at.decreaseQuoteLevel=Et("modifyBlocks",gt),at.makeUnorderedList=Et("modifyBlocks",Ct),at.makeOrderedList=Et("modifyBlocks",Nt),at.removeList=Et("modifyBlocks",_t),P.isInline=a,P.isBlock=s,P.isContainer=d,P.getBlockWalker=l,P.getPreviousBlock=c,P.getNextBlock=h,P.areAlike=f,P.hasTagAttributes=p,P.getNearest=g,P.isOrContains=v,P.detach=_,P.replaceWith=S,P.empty=y,P.getNodeBefore=_e,P.getNodeAfter=Se,P.insertNodeInRange=ye,P.extractContentsOfRange=Te,P.deleteContentsOfRange=Ee,P.insertTreeFragmentIntoRange=be,P.isNodeContainedInRange=ke,P.moveRangeBoundariesDownTree=xe,P.moveRangeBoundariesUpTree=Ae,P.getStartBlockOfRange=Le,P.getEndBlockOfRange=Be,P.contentWalker=Oe,P.rangeDoesStartAtBlockBoundary=Re,P.rangeDoesEndAtBlockBoundary=De,P.expandRangeToBlockBoundaries=Pe,P.onPaste=it,P.addLinks=yt,P.splitBlock=ft,P.startSelectionId="squire-selection-start",P.endSelectionId=ht, true?module.exports=P:undefined}(document);

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is a string or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is a boolean or not.
 *  If the given variable is a boolean, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is boolean?
 * @memberof module:type
 */
function isBoolean(obj) {
  return typeof obj === 'boolean' || obj instanceof Boolean;
}

module.exports = isBoolean;


/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/**
 * A collection of shims that provide minimal functionality of the ES6 collections.
 *
 * These implementations are not meant to be used outside of the ResizeObserver
 * modules as they cover only a limited range of use cases.
 */
/* eslint-disable require-jsdoc, valid-jsdoc */
var MapShim = (function () {
    if (typeof Map !== 'undefined') {
        return Map;
    }
    /**
     * Returns index in provided array that matches the specified key.
     *
     * @param {Array<Array>} arr
     * @param {*} key
     * @returns {number}
     */
    function getIndex(arr, key) {
        var result = -1;
        arr.some(function (entry, index) {
            if (entry[0] === key) {
                result = index;
                return true;
            }
            return false;
        });
        return result;
    }
    return /** @class */ (function () {
        function class_1() {
            this.__entries__ = [];
        }
        Object.defineProperty(class_1.prototype, "size", {
            /**
             * @returns {boolean}
             */
            get: function () {
                return this.__entries__.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {*} key
         * @returns {*}
         */
        class_1.prototype.get = function (key) {
            var index = getIndex(this.__entries__, key);
            var entry = this.__entries__[index];
            return entry && entry[1];
        };
        /**
         * @param {*} key
         * @param {*} value
         * @returns {void}
         */
        class_1.prototype.set = function (key, value) {
            var index = getIndex(this.__entries__, key);
            if (~index) {
                this.__entries__[index][1] = value;
            }
            else {
                this.__entries__.push([key, value]);
            }
        };
        /**
         * @param {*} key
         * @returns {void}
         */
        class_1.prototype.delete = function (key) {
            var entries = this.__entries__;
            var index = getIndex(entries, key);
            if (~index) {
                entries.splice(index, 1);
            }
        };
        /**
         * @param {*} key
         * @returns {void}
         */
        class_1.prototype.has = function (key) {
            return !!~getIndex(this.__entries__, key);
        };
        /**
         * @returns {void}
         */
        class_1.prototype.clear = function () {
            this.__entries__.splice(0);
        };
        /**
         * @param {Function} callback
         * @param {*} [ctx=null]
         * @returns {void}
         */
        class_1.prototype.forEach = function (callback, ctx) {
            if (ctx === void 0) { ctx = null; }
            for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
                var entry = _a[_i];
                callback.call(ctx, entry[1], entry[0]);
            }
        };
        return class_1;
    }());
})();

/**
 * Detects whether window and document objects are available in current environment.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

// Returns global object of a current environment.
var global$1 = (function () {
    if (typeof global !== 'undefined' && global.Math === Math) {
        return global;
    }
    if (typeof self !== 'undefined' && self.Math === Math) {
        return self;
    }
    if (typeof window !== 'undefined' && window.Math === Math) {
        return window;
    }
    // eslint-disable-next-line no-new-func
    return Function('return this')();
})();

/**
 * A shim for the requestAnimationFrame which falls back to the setTimeout if
 * first one is not supported.
 *
 * @returns {number} Requests' identifier.
 */
var requestAnimationFrame$1 = (function () {
    if (typeof requestAnimationFrame === 'function') {
        // It's required to use a bounded function because IE sometimes throws
        // an "Invalid calling object" error if rAF is invoked without the global
        // object on the left hand side.
        return requestAnimationFrame.bind(global$1);
    }
    return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
})();

// Defines minimum timeout before adding a trailing call.
var trailingTimeout = 2;
/**
 * Creates a wrapper function which ensures that provided callback will be
 * invoked only once during the specified delay period.
 *
 * @param {Function} callback - Function to be invoked after the delay period.
 * @param {number} delay - Delay after which to invoke callback.
 * @returns {Function}
 */
function throttle (callback, delay) {
    var leadingCall = false, trailingCall = false, lastCallTime = 0;
    /**
     * Invokes the original callback function and schedules new invocation if
     * the "proxy" was called during current request.
     *
     * @returns {void}
     */
    function resolvePending() {
        if (leadingCall) {
            leadingCall = false;
            callback();
        }
        if (trailingCall) {
            proxy();
        }
    }
    /**
     * Callback invoked after the specified delay. It will further postpone
     * invocation of the original function delegating it to the
     * requestAnimationFrame.
     *
     * @returns {void}
     */
    function timeoutCallback() {
        requestAnimationFrame$1(resolvePending);
    }
    /**
     * Schedules invocation of the original function.
     *
     * @returns {void}
     */
    function proxy() {
        var timeStamp = Date.now();
        if (leadingCall) {
            // Reject immediately following calls.
            if (timeStamp - lastCallTime < trailingTimeout) {
                return;
            }
            // Schedule new call to be in invoked when the pending one is resolved.
            // This is important for "transitions" which never actually start
            // immediately so there is a chance that we might miss one if change
            // happens amids the pending invocation.
            trailingCall = true;
        }
        else {
            leadingCall = true;
            trailingCall = false;
            setTimeout(timeoutCallback, delay);
        }
        lastCallTime = timeStamp;
    }
    return proxy;
}

// Minimum delay before invoking the update of observers.
var REFRESH_DELAY = 20;
// A list of substrings of CSS properties used to find transition events that
// might affect dimensions of observed elements.
var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];
// Check if MutationObserver is available.
var mutationObserverSupported = typeof MutationObserver !== 'undefined';
/**
 * Singleton controller class which handles updates of ResizeObserver instances.
 */
var ResizeObserverController = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserverController.
     *
     * @private
     */
    function ResizeObserverController() {
        /**
         * Indicates whether DOM listeners have been added.
         *
         * @private {boolean}
         */
        this.connected_ = false;
        /**
         * Tells that controller has subscribed for Mutation Events.
         *
         * @private {boolean}
         */
        this.mutationEventsAdded_ = false;
        /**
         * Keeps reference to the instance of MutationObserver.
         *
         * @private {MutationObserver}
         */
        this.mutationsObserver_ = null;
        /**
         * A list of connected observers.
         *
         * @private {Array<ResizeObserverSPI>}
         */
        this.observers_ = [];
        this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
        this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
    }
    /**
     * Adds observer to observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be added.
     * @returns {void}
     */
    ResizeObserverController.prototype.addObserver = function (observer) {
        if (!~this.observers_.indexOf(observer)) {
            this.observers_.push(observer);
        }
        // Add listeners if they haven't been added yet.
        if (!this.connected_) {
            this.connect_();
        }
    };
    /**
     * Removes observer from observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be removed.
     * @returns {void}
     */
    ResizeObserverController.prototype.removeObserver = function (observer) {
        var observers = this.observers_;
        var index = observers.indexOf(observer);
        // Remove observer if it's present in registry.
        if (~index) {
            observers.splice(index, 1);
        }
        // Remove listeners if controller has no connected observers.
        if (!observers.length && this.connected_) {
            this.disconnect_();
        }
    };
    /**
     * Invokes the update of observers. It will continue running updates insofar
     * it detects changes.
     *
     * @returns {void}
     */
    ResizeObserverController.prototype.refresh = function () {
        var changesDetected = this.updateObservers_();
        // Continue running updates if changes have been detected as there might
        // be future ones caused by CSS transitions.
        if (changesDetected) {
            this.refresh();
        }
    };
    /**
     * Updates every observer from observers list and notifies them of queued
     * entries.
     *
     * @private
     * @returns {boolean} Returns "true" if any observer has detected changes in
     *      dimensions of it's elements.
     */
    ResizeObserverController.prototype.updateObservers_ = function () {
        // Collect observers that have active observations.
        var activeObservers = this.observers_.filter(function (observer) {
            return observer.gatherActive(), observer.hasActive();
        });
        // Deliver notifications in a separate cycle in order to avoid any
        // collisions between observers, e.g. when multiple instances of
        // ResizeObserver are tracking the same element and the callback of one
        // of them changes content dimensions of the observed target. Sometimes
        // this may result in notifications being blocked for the rest of observers.
        activeObservers.forEach(function (observer) { return observer.broadcastActive(); });
        return activeObservers.length > 0;
    };
    /**
     * Initializes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    ResizeObserverController.prototype.connect_ = function () {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already added.
        if (!isBrowser || this.connected_) {
            return;
        }
        // Subscription to the "Transitionend" event is used as a workaround for
        // delayed transitions. This way it's possible to capture at least the
        // final state of an element.
        document.addEventListener('transitionend', this.onTransitionEnd_);
        window.addEventListener('resize', this.refresh);
        if (mutationObserverSupported) {
            this.mutationsObserver_ = new MutationObserver(this.refresh);
            this.mutationsObserver_.observe(document, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            });
        }
        else {
            document.addEventListener('DOMSubtreeModified', this.refresh);
            this.mutationEventsAdded_ = true;
        }
        this.connected_ = true;
    };
    /**
     * Removes DOM listeners.
     *
     * @private
     * @returns {void}
     */
    ResizeObserverController.prototype.disconnect_ = function () {
        // Do nothing if running in a non-browser environment or if listeners
        // have been already removed.
        if (!isBrowser || !this.connected_) {
            return;
        }
        document.removeEventListener('transitionend', this.onTransitionEnd_);
        window.removeEventListener('resize', this.refresh);
        if (this.mutationsObserver_) {
            this.mutationsObserver_.disconnect();
        }
        if (this.mutationEventsAdded_) {
            document.removeEventListener('DOMSubtreeModified', this.refresh);
        }
        this.mutationsObserver_ = null;
        this.mutationEventsAdded_ = false;
        this.connected_ = false;
    };
    /**
     * "Transitionend" event handler.
     *
     * @private
     * @param {TransitionEvent} event
     * @returns {void}
     */
    ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
        var _b = _a.propertyName, propertyName = _b === void 0 ? '' : _b;
        // Detect whether transition may affect dimensions of an element.
        var isReflowProperty = transitionKeys.some(function (key) {
            return !!~propertyName.indexOf(key);
        });
        if (isReflowProperty) {
            this.refresh();
        }
    };
    /**
     * Returns instance of the ResizeObserverController.
     *
     * @returns {ResizeObserverController}
     */
    ResizeObserverController.getInstance = function () {
        if (!this.instance_) {
            this.instance_ = new ResizeObserverController();
        }
        return this.instance_;
    };
    /**
     * Holds reference to the controller's instance.
     *
     * @private {ResizeObserverController}
     */
    ResizeObserverController.instance_ = null;
    return ResizeObserverController;
}());

/**
 * Defines non-writable/enumerable properties of the provided target object.
 *
 * @param {Object} target - Object for which to define properties.
 * @param {Object} props - Properties to be defined.
 * @returns {Object} Target object.
 */
var defineConfigurable = (function (target, props) {
    for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
        var key = _a[_i];
        Object.defineProperty(target, key, {
            value: props[key],
            enumerable: false,
            writable: false,
            configurable: true
        });
    }
    return target;
});

/**
 * Returns the global object associated with provided element.
 *
 * @param {Object} target
 * @returns {Object}
 */
var getWindowOf = (function (target) {
    // Assume that the element is an instance of Node, which means that it
    // has the "ownerDocument" property from which we can retrieve a
    // corresponding global object.
    var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
    // Return the local global object if it's not possible extract one from
    // provided element.
    return ownerGlobal || global$1;
});

// Placeholder of an empty content rectangle.
var emptyRect = createRectInit(0, 0, 0, 0);
/**
 * Converts provided string to a number.
 *
 * @param {number|string} value
 * @returns {number}
 */
function toFloat(value) {
    return parseFloat(value) || 0;
}
/**
 * Extracts borders size from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @param {...string} positions - Borders positions (top, right, ...)
 * @returns {number}
 */
function getBordersSize(styles) {
    var positions = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        positions[_i - 1] = arguments[_i];
    }
    return positions.reduce(function (size, position) {
        var value = styles['border-' + position + '-width'];
        return size + toFloat(value);
    }, 0);
}
/**
 * Extracts paddings sizes from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @returns {Object} Paddings box.
 */
function getPaddings(styles) {
    var positions = ['top', 'right', 'bottom', 'left'];
    var paddings = {};
    for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
        var position = positions_1[_i];
        var value = styles['padding-' + position];
        paddings[position] = toFloat(value);
    }
    return paddings;
}
/**
 * Calculates content rectangle of provided SVG element.
 *
 * @param {SVGGraphicsElement} target - Element content rectangle of which needs
 *      to be calculated.
 * @returns {DOMRectInit}
 */
function getSVGContentRect(target) {
    var bbox = target.getBBox();
    return createRectInit(0, 0, bbox.width, bbox.height);
}
/**
 * Calculates content rectangle of provided HTMLElement.
 *
 * @param {HTMLElement} target - Element for which to calculate the content rectangle.
 * @returns {DOMRectInit}
 */
function getHTMLElementContentRect(target) {
    // Client width & height properties can't be
    // used exclusively as they provide rounded values.
    var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
    // By this condition we can catch all non-replaced inline, hidden and
    // detached elements. Though elements with width & height properties less
    // than 0.5 will be discarded as well.
    //
    // Without it we would need to implement separate methods for each of
    // those cases and it's not possible to perform a precise and performance
    // effective test for hidden elements. E.g. even jQuery's ':visible' filter
    // gives wrong results for elements with width & height less than 0.5.
    if (!clientWidth && !clientHeight) {
        return emptyRect;
    }
    var styles = getWindowOf(target).getComputedStyle(target);
    var paddings = getPaddings(styles);
    var horizPad = paddings.left + paddings.right;
    var vertPad = paddings.top + paddings.bottom;
    // Computed styles of width & height are being used because they are the
    // only dimensions available to JS that contain non-rounded values. It could
    // be possible to utilize the getBoundingClientRect if only it's data wasn't
    // affected by CSS transformations let alone paddings, borders and scroll bars.
    var width = toFloat(styles.width), height = toFloat(styles.height);
    // Width & height include paddings and borders when the 'border-box' box
    // model is applied (except for IE).
    if (styles.boxSizing === 'border-box') {
        // Following conditions are required to handle Internet Explorer which
        // doesn't include paddings and borders to computed CSS dimensions.
        //
        // We can say that if CSS dimensions + paddings are equal to the "client"
        // properties then it's either IE, and thus we don't need to subtract
        // anything, or an element merely doesn't have paddings/borders styles.
        if (Math.round(width + horizPad) !== clientWidth) {
            width -= getBordersSize(styles, 'left', 'right') + horizPad;
        }
        if (Math.round(height + vertPad) !== clientHeight) {
            height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
        }
    }
    // Following steps can't be applied to the document's root element as its
    // client[Width/Height] properties represent viewport area of the window.
    // Besides, it's as well not necessary as the <html> itself neither has
    // rendered scroll bars nor it can be clipped.
    if (!isDocumentElement(target)) {
        // In some browsers (only in Firefox, actually) CSS width & height
        // include scroll bars size which can be removed at this step as scroll
        // bars are the only difference between rounded dimensions + paddings
        // and "client" properties, though that is not always true in Chrome.
        var vertScrollbar = Math.round(width + horizPad) - clientWidth;
        var horizScrollbar = Math.round(height + vertPad) - clientHeight;
        // Chrome has a rather weird rounding of "client" properties.
        // E.g. for an element with content width of 314.2px it sometimes gives
        // the client width of 315px and for the width of 314.7px it may give
        // 314px. And it doesn't happen all the time. So just ignore this delta
        // as a non-relevant.
        if (Math.abs(vertScrollbar) !== 1) {
            width -= vertScrollbar;
        }
        if (Math.abs(horizScrollbar) !== 1) {
            height -= horizScrollbar;
        }
    }
    return createRectInit(paddings.left, paddings.top, width, height);
}
/**
 * Checks whether provided element is an instance of the SVGGraphicsElement.
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
var isSVGGraphicsElement = (function () {
    // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
    // interface.
    if (typeof SVGGraphicsElement !== 'undefined') {
        return function (target) { return target instanceof getWindowOf(target).SVGGraphicsElement; };
    }
    // If it's so, then check that element is at least an instance of the
    // SVGElement and that it has the "getBBox" method.
    // eslint-disable-next-line no-extra-parens
    return function (target) { return (target instanceof getWindowOf(target).SVGElement &&
        typeof target.getBBox === 'function'); };
})();
/**
 * Checks whether provided element is a document element (<html>).
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
function isDocumentElement(target) {
    return target === getWindowOf(target).document.documentElement;
}
/**
 * Calculates an appropriate content rectangle for provided html or svg element.
 *
 * @param {Element} target - Element content rectangle of which needs to be calculated.
 * @returns {DOMRectInit}
 */
function getContentRect(target) {
    if (!isBrowser) {
        return emptyRect;
    }
    if (isSVGGraphicsElement(target)) {
        return getSVGContentRect(target);
    }
    return getHTMLElementContentRect(target);
}
/**
 * Creates rectangle with an interface of the DOMRectReadOnly.
 * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
 *
 * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
 * @returns {DOMRectReadOnly}
 */
function createReadOnlyRect(_a) {
    var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
    // If DOMRectReadOnly is available use it as a prototype for the rectangle.
    var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
    var rect = Object.create(Constr.prototype);
    // Rectangle's properties are not writable and non-enumerable.
    defineConfigurable(rect, {
        x: x, y: y, width: width, height: height,
        top: y,
        right: x + width,
        bottom: height + y,
        left: x
    });
    return rect;
}
/**
 * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
 * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
 *
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} width - Rectangle's width.
 * @param {number} height - Rectangle's height.
 * @returns {DOMRectInit}
 */
function createRectInit(x, y, width, height) {
    return { x: x, y: y, width: width, height: height };
}

/**
 * Class that is responsible for computations of the content rectangle of
 * provided DOM element and for keeping track of it's changes.
 */
var ResizeObservation = /** @class */ (function () {
    /**
     * Creates an instance of ResizeObservation.
     *
     * @param {Element} target - Element to be observed.
     */
    function ResizeObservation(target) {
        /**
         * Broadcasted width of content rectangle.
         *
         * @type {number}
         */
        this.broadcastWidth = 0;
        /**
         * Broadcasted height of content rectangle.
         *
         * @type {number}
         */
        this.broadcastHeight = 0;
        /**
         * Reference to the last observed content rectangle.
         *
         * @private {DOMRectInit}
         */
        this.contentRect_ = createRectInit(0, 0, 0, 0);
        this.target = target;
    }
    /**
     * Updates content rectangle and tells whether it's width or height properties
     * have changed since the last broadcast.
     *
     * @returns {boolean}
     */
    ResizeObservation.prototype.isActive = function () {
        var rect = getContentRect(this.target);
        this.contentRect_ = rect;
        return (rect.width !== this.broadcastWidth ||
            rect.height !== this.broadcastHeight);
    };
    /**
     * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
     * from the corresponding properties of the last observed content rectangle.
     *
     * @returns {DOMRectInit} Last observed content rectangle.
     */
    ResizeObservation.prototype.broadcastRect = function () {
        var rect = this.contentRect_;
        this.broadcastWidth = rect.width;
        this.broadcastHeight = rect.height;
        return rect;
    };
    return ResizeObservation;
}());

var ResizeObserverEntry = /** @class */ (function () {
    /**
     * Creates an instance of ResizeObserverEntry.
     *
     * @param {Element} target - Element that is being observed.
     * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
     */
    function ResizeObserverEntry(target, rectInit) {
        var contentRect = createReadOnlyRect(rectInit);
        // According to the specification following properties are not writable
        // and are also not enumerable in the native implementation.
        //
        // Property accessors are not being used as they'd require to define a
        // private WeakMap storage which may cause memory leaks in browsers that
        // don't support this type of collections.
        defineConfigurable(this, { target: target, contentRect: contentRect });
    }
    return ResizeObserverEntry;
}());

var ResizeObserverSPI = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {ResizeObserverCallback} callback - Callback function that is invoked
     *      when one of the observed elements changes it's content dimensions.
     * @param {ResizeObserverController} controller - Controller instance which
     *      is responsible for the updates of observer.
     * @param {ResizeObserver} callbackCtx - Reference to the public
     *      ResizeObserver instance which will be passed to callback function.
     */
    function ResizeObserverSPI(callback, controller, callbackCtx) {
        /**
         * Collection of resize observations that have detected changes in dimensions
         * of elements.
         *
         * @private {Array<ResizeObservation>}
         */
        this.activeObservations_ = [];
        /**
         * Registry of the ResizeObservation instances.
         *
         * @private {Map<Element, ResizeObservation>}
         */
        this.observations_ = new MapShim();
        if (typeof callback !== 'function') {
            throw new TypeError('The callback provided as parameter 1 is not a function.');
        }
        this.callback_ = callback;
        this.controller_ = controller;
        this.callbackCtx_ = callbackCtx;
    }
    /**
     * Starts observing provided element.
     *
     * @param {Element} target - Element to be observed.
     * @returns {void}
     */
    ResizeObserverSPI.prototype.observe = function (target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        // Do nothing if current environment doesn't have the Element interface.
        if (typeof Element === 'undefined' || !(Element instanceof Object)) {
            return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        // Do nothing if element is already being observed.
        if (observations.has(target)) {
            return;
        }
        observations.set(target, new ResizeObservation(target));
        this.controller_.addObserver(this);
        // Force the update of observations.
        this.controller_.refresh();
    };
    /**
     * Stops observing provided element.
     *
     * @param {Element} target - Element to stop observing.
     * @returns {void}
     */
    ResizeObserverSPI.prototype.unobserve = function (target) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        // Do nothing if current environment doesn't have the Element interface.
        if (typeof Element === 'undefined' || !(Element instanceof Object)) {
            return;
        }
        if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
        }
        var observations = this.observations_;
        // Do nothing if element is not being observed.
        if (!observations.has(target)) {
            return;
        }
        observations.delete(target);
        if (!observations.size) {
            this.controller_.removeObserver(this);
        }
    };
    /**
     * Stops observing all elements.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.disconnect = function () {
        this.clearActive();
        this.observations_.clear();
        this.controller_.removeObserver(this);
    };
    /**
     * Collects observation instances the associated element of which has changed
     * it's content rectangle.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.gatherActive = function () {
        var _this = this;
        this.clearActive();
        this.observations_.forEach(function (observation) {
            if (observation.isActive()) {
                _this.activeObservations_.push(observation);
            }
        });
    };
    /**
     * Invokes initial callback function with a list of ResizeObserverEntry
     * instances collected from active resize observations.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.broadcastActive = function () {
        // Do nothing if observer doesn't have active observations.
        if (!this.hasActive()) {
            return;
        }
        var ctx = this.callbackCtx_;
        // Create ResizeObserverEntry instance for every active observation.
        var entries = this.activeObservations_.map(function (observation) {
            return new ResizeObserverEntry(observation.target, observation.broadcastRect());
        });
        this.callback_.call(ctx, entries, ctx);
        this.clearActive();
    };
    /**
     * Clears the collection of active observations.
     *
     * @returns {void}
     */
    ResizeObserverSPI.prototype.clearActive = function () {
        this.activeObservations_.splice(0);
    };
    /**
     * Tells whether observer has active observations.
     *
     * @returns {boolean}
     */
    ResizeObserverSPI.prototype.hasActive = function () {
        return this.activeObservations_.length > 0;
    };
    return ResizeObserverSPI;
}());

// Registry of internal observers. If WeakMap is not available use current shim
// for the Map collection as it has all required methods and because WeakMap
// can't be fully polyfilled anyway.
var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();
/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * exposing only those methods and properties that are defined in the spec.
 */
var ResizeObserver = /** @class */ (function () {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {ResizeObserverCallback} callback - Callback that is invoked when
     *      dimensions of the observed elements change.
     */
    function ResizeObserver(callback) {
        if (!(this instanceof ResizeObserver)) {
            throw new TypeError('Cannot call a class as a function.');
        }
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }
        var controller = ResizeObserverController.getInstance();
        var observer = new ResizeObserverSPI(callback, controller, this);
        observers.set(this, observer);
    }
    return ResizeObserver;
}());
// Expose public methods of ResizeObserver.
[
    'observe',
    'unobserve',
    'disconnect'
].forEach(function (method) {
    ResizeObserver.prototype[method] = function () {
        var _a;
        return (_a = observers.get(this))[method].apply(_a, arguments);
    };
});

var index = (function () {
    // Export existing implementation if available.
    if (typeof global$1.ResizeObserver !== 'undefined') {
        return global$1.ResizeObserver;
    }
    return ResizeObserver;
})();

/* harmony default export */ __webpack_exports__["a"] = (index);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(59)))

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview This module provides some functions for custom events. And it is implemented in the observer design pattern.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var extend = __webpack_require__(7);
var isExisty = __webpack_require__(28);
var isString = __webpack_require__(9);
var isObject = __webpack_require__(54);
var isArray = __webpack_require__(17);
var isFunction = __webpack_require__(27);
var forEach = __webpack_require__(26);

var R_EVENTNAME_SPLIT = /\s+/g;

/**
 * @class
 * @example
 * // node, commonjs
 * var CustomEvents = require('tui-code-snippet/customEvents/customEvents');
 */
function CustomEvents() {
  /**
     * @type {HandlerItem[]}
     */
  this.events = null;

  /**
     * only for checking specific context event was binded
     * @type {object[]}
     */
  this.contexts = null;
}

/**
 * Mixin custom events feature to specific constructor
 * @param {function} func - constructor
 * @example
 * var CustomEvents = require('tui-code-snippet/customEvents/customEvents'); // node, commonjs
 *
 * var model;
 * function Model() {
 *     this.name = '';
 * }
 * CustomEvents.mixin(Model);
 *
 * model = new Model();
 * model.on('change', function() { this.name = 'model'; }, this);
 * model.fire('change');
 * alert(model.name); // 'model';
 */
CustomEvents.mixin = function(func) {
  extend(func.prototype, CustomEvents.prototype);
};

/**
 * Get HandlerItem object
 * @param {function} handler - handler function
 * @param {object} [context] - context for handler
 * @returns {HandlerItem} HandlerItem object
 * @private
 */
CustomEvents.prototype._getHandlerItem = function(handler, context) {
  var item = {handler: handler};

  if (context) {
    item.context = context;
  }

  return item;
};

/**
 * Get event object safely
 * @param {string} [eventName] - create sub event map if not exist.
 * @returns {(object|array)} event object. if you supplied `eventName`
 *  parameter then make new array and return it
 * @private
 */
CustomEvents.prototype._safeEvent = function(eventName) {
  var events = this.events;
  var byName;

  if (!events) {
    events = this.events = {};
  }

  if (eventName) {
    byName = events[eventName];

    if (!byName) {
      byName = [];
      events[eventName] = byName;
    }

    events = byName;
  }

  return events;
};

/**
 * Get context array safely
 * @returns {array} context array
 * @private
 */
CustomEvents.prototype._safeContext = function() {
  var context = this.contexts;

  if (!context) {
    context = this.contexts = [];
  }

  return context;
};

/**
 * Get index of context
 * @param {object} ctx - context that used for bind custom event
 * @returns {number} index of context
 * @private
 */
CustomEvents.prototype._indexOfContext = function(ctx) {
  var context = this._safeContext();
  var index = 0;

  while (context[index]) {
    if (ctx === context[index][0]) {
      return index;
    }

    index += 1;
  }

  return -1;
};

/**
 * Memorize supplied context for recognize supplied object is context or
 *  name: handler pair object when off()
 * @param {object} ctx - context object to memorize
 * @private
 */
CustomEvents.prototype._memorizeContext = function(ctx) {
  var context, index;

  if (!isExisty(ctx)) {
    return;
  }

  context = this._safeContext();
  index = this._indexOfContext(ctx);

  if (index > -1) {
    context[index][1] += 1;
  } else {
    context.push([ctx, 1]);
  }
};

/**
 * Forget supplied context object
 * @param {object} ctx - context object to forget
 * @private
 */
CustomEvents.prototype._forgetContext = function(ctx) {
  var context, contextIndex;

  if (!isExisty(ctx)) {
    return;
  }

  context = this._safeContext();
  contextIndex = this._indexOfContext(ctx);

  if (contextIndex > -1) {
    context[contextIndex][1] -= 1;

    if (context[contextIndex][1] <= 0) {
      context.splice(contextIndex, 1);
    }
  }
};

/**
 * Bind event handler
 * @param {(string|{name:string, handler:function})} eventName - custom
 *  event name or an object {eventName: handler}
 * @param {(function|object)} [handler] - handler function or context
 * @param {object} [context] - context for binding
 * @private
 */
CustomEvents.prototype._bindEvent = function(eventName, handler, context) {
  var events = this._safeEvent(eventName);
  this._memorizeContext(context);
  events.push(this._getHandlerItem(handler, context));
};

/**
 * Bind event handlers
 * @param {(string|{name:string, handler:function})} eventName - custom
 *  event name or an object {eventName: handler}
 * @param {(function|object)} [handler] - handler function or context
 * @param {object} [context] - context for binding
 * //-- #1. Get Module --//
 * var CustomEvents = require('tui-code-snippet/customEvents/customEvents'); // node, commonjs
 *
 * //-- #2. Use method --//
 * // # 2.1 Basic Usage
 * CustomEvents.on('onload', handler);
 *
 * // # 2.2 With context
 * CustomEvents.on('onload', handler, myObj);
 *
 * // # 2.3 Bind by object that name, handler pairs
 * CustomEvents.on({
 *     'play': handler,
 *     'pause': handler2
 * });
 *
 * // # 2.4 Bind by object that name, handler pairs with context object
 * CustomEvents.on({
 *     'play': handler
 * }, myObj);
 */
CustomEvents.prototype.on = function(eventName, handler, context) {
  var self = this;

  if (isString(eventName)) {
    // [syntax 1, 2]
    eventName = eventName.split(R_EVENTNAME_SPLIT);
    forEach(eventName, function(name) {
      self._bindEvent(name, handler, context);
    });
  } else if (isObject(eventName)) {
    // [syntax 3, 4]
    context = handler;
    forEach(eventName, function(func, name) {
      self.on(name, func, context);
    });
  }
};

/**
 * Bind one-shot event handlers
 * @param {(string|{name:string,handler:function})} eventName - custom
 *  event name or an object {eventName: handler}
 * @param {function|object} [handler] - handler function or context
 * @param {object} [context] - context for binding
 */
CustomEvents.prototype.once = function(eventName, handler, context) {
  var self = this;

  if (isObject(eventName)) {
    context = handler;
    forEach(eventName, function(func, name) {
      self.once(name, func, context);
    });

    return;
  }

  function onceHandler() { // eslint-disable-line require-jsdoc
    handler.apply(context, arguments);
    self.off(eventName, onceHandler, context);
  }

  this.on(eventName, onceHandler, context);
};

/**
 * Splice supplied array by callback result
 * @param {array} arr - array to splice
 * @param {function} predicate - function return boolean
 * @private
 */
CustomEvents.prototype._spliceMatches = function(arr, predicate) {
  var i = 0;
  var len;

  if (!isArray(arr)) {
    return;
  }

  for (len = arr.length; i < len; i += 1) {
    if (predicate(arr[i]) === true) {
      arr.splice(i, 1);
      len -= 1;
      i -= 1;
    }
  }
};

/**
 * Get matcher for unbind specific handler events
 * @param {function} handler - handler function
 * @returns {function} handler matcher
 * @private
 */
CustomEvents.prototype._matchHandler = function(handler) {
  var self = this;

  return function(item) {
    var needRemove = handler === item.handler;

    if (needRemove) {
      self._forgetContext(item.context);
    }

    return needRemove;
  };
};

/**
 * Get matcher for unbind specific context events
 * @param {object} context - context
 * @returns {function} object matcher
 * @private
 */
CustomEvents.prototype._matchContext = function(context) {
  var self = this;

  return function(item) {
    var needRemove = context === item.context;

    if (needRemove) {
      self._forgetContext(item.context);
    }

    return needRemove;
  };
};

/**
 * Get matcher for unbind specific hander, context pair events
 * @param {function} handler - handler function
 * @param {object} context - context
 * @returns {function} handler, context matcher
 * @private
 */
CustomEvents.prototype._matchHandlerAndContext = function(handler, context) {
  var self = this;

  return function(item) {
    var matchHandler = (handler === item.handler);
    var matchContext = (context === item.context);
    var needRemove = (matchHandler && matchContext);

    if (needRemove) {
      self._forgetContext(item.context);
    }

    return needRemove;
  };
};

/**
 * Unbind event by event name
 * @param {string} eventName - custom event name to unbind
 * @param {function} [handler] - handler function
 * @private
 */
CustomEvents.prototype._offByEventName = function(eventName, handler) {
  var self = this;
  var andByHandler = isFunction(handler);
  var matchHandler = self._matchHandler(handler);

  eventName = eventName.split(R_EVENTNAME_SPLIT);

  forEach(eventName, function(name) {
    var handlerItems = self._safeEvent(name);

    if (andByHandler) {
      self._spliceMatches(handlerItems, matchHandler);
    } else {
      forEach(handlerItems, function(item) {
        self._forgetContext(item.context);
      });

      self.events[name] = [];
    }
  });
};

/**
 * Unbind event by handler function
 * @param {function} handler - handler function
 * @private
 */
CustomEvents.prototype._offByHandler = function(handler) {
  var self = this;
  var matchHandler = this._matchHandler(handler);

  forEach(this._safeEvent(), function(handlerItems) {
    self._spliceMatches(handlerItems, matchHandler);
  });
};

/**
 * Unbind event by object(name: handler pair object or context object)
 * @param {object} obj - context or {name: handler} pair object
 * @param {function} handler - handler function
 * @private
 */
CustomEvents.prototype._offByObject = function(obj, handler) {
  var self = this;
  var matchFunc;

  if (this._indexOfContext(obj) < 0) {
    forEach(obj, function(func, name) {
      self.off(name, func);
    });
  } else if (isString(handler)) {
    matchFunc = this._matchContext(obj);

    self._spliceMatches(this._safeEvent(handler), matchFunc);
  } else if (isFunction(handler)) {
    matchFunc = this._matchHandlerAndContext(handler, obj);

    forEach(this._safeEvent(), function(handlerItems) {
      self._spliceMatches(handlerItems, matchFunc);
    });
  } else {
    matchFunc = this._matchContext(obj);

    forEach(this._safeEvent(), function(handlerItems) {
      self._spliceMatches(handlerItems, matchFunc);
    });
  }
};

/**
 * Unbind custom events
 * @param {(string|object|function)} eventName - event name or context or
 *  {name: handler} pair object or handler function
 * @param {(function)} handler - handler function
 * @example
 * //-- #1. Get Module --//
 * var CustomEvents = require('tui-code-snippet/customEvents/customEvents'); // node, commonjs
 *
 * //-- #2. Use method --//
 * // # 2.1 off by event name
 * CustomEvents.off('onload');
 *
 * // # 2.2 off by event name and handler
 * CustomEvents.off('play', handler);
 *
 * // # 2.3 off by handler
 * CustomEvents.off(handler);
 *
 * // # 2.4 off by context
 * CustomEvents.off(myObj);
 *
 * // # 2.5 off by context and handler
 * CustomEvents.off(myObj, handler);
 *
 * // # 2.6 off by context and event name
 * CustomEvents.off(myObj, 'onload');
 *
 * // # 2.7 off by an Object.<string, function> that is {eventName: handler}
 * CustomEvents.off({
 *   'play': handler,
 *   'pause': handler2
 * });
 *
 * // # 2.8 off the all events
 * CustomEvents.off();
 */
CustomEvents.prototype.off = function(eventName, handler) {
  if (isString(eventName)) {
    // [syntax 1, 2]
    this._offByEventName(eventName, handler);
  } else if (!arguments.length) {
    // [syntax 8]
    this.events = {};
    this.contexts = [];
  } else if (isFunction(eventName)) {
    // [syntax 3]
    this._offByHandler(eventName);
  } else if (isObject(eventName)) {
    // [syntax 4, 5, 6]
    this._offByObject(eventName, handler);
  }
};

/**
 * Fire custom event
 * @param {string} eventName - name of custom event
 */
CustomEvents.prototype.fire = function(eventName) {  // eslint-disable-line
  this.invoke.apply(this, arguments);
};

/**
 * Fire a event and returns the result of operation 'boolean AND' with all
 *  listener's results.
 *
 * So, It is different from {@link CustomEvents#fire}.
 *
 * In service code, use this as a before event in component level usually
 *  for notifying that the event is cancelable.
 * @param {string} eventName - Custom event name
 * @param {...*} data - Data for event
 * @returns {boolean} The result of operation 'boolean AND'
 * @example
 * var map = new Map();
 * map.on({
 *     'beforeZoom': function() {
 *         // It should cancel the 'zoom' event by some conditions.
 *         if (that.disabled && this.getState()) {
 *             return false;
 *         }
 *         return true;
 *     }
 * });
 *
 * if (this.invoke('beforeZoom')) {    // check the result of 'beforeZoom'
 *     // if true,
 *     // doSomething
 * }
 */
CustomEvents.prototype.invoke = function(eventName) {
  var events, args, index, item;

  if (!this.hasListener(eventName)) {
    return true;
  }

  events = this._safeEvent(eventName);
  args = Array.prototype.slice.call(arguments, 1);
  index = 0;

  while (events[index]) {
    item = events[index];

    if (item.handler.apply(item.context, args) === false) {
      return false;
    }

    index += 1;
  }

  return true;
};

/**
 * Return whether at least one of the handlers is registered in the given
 *  event name.
 * @param {string} eventName - Custom event name
 * @returns {boolean} Is there at least one handler in event name?
 */
CustomEvents.prototype.hasListener = function(eventName) {
  return this.getListenerLength(eventName) > 0;
};

/**
 * Return a count of events registered.
 * @param {string} eventName - Custom event name
 * @returns {number} number of event
 */
CustomEvents.prototype.getListenerLength = function(eventName) {
  var events = this._safeEvent(eventName);

  return events.length;
};

module.exports = CustomEvents;


/***/ }),
/* 59 */
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
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/collection/forEachOwnProperties.js
var forEachOwnProperties = __webpack_require__(10);
var forEachOwnProperties_default = /*#__PURE__*/__webpack_require__.n(forEachOwnProperties);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/type/isExisty.js
var isExisty = __webpack_require__(28);
var isExisty_default = /*#__PURE__*/__webpack_require__.n(isExisty);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/type/isNumber.js
var isNumber = __webpack_require__(34);
var isNumber_default = /*#__PURE__*/__webpack_require__.n(isNumber);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/object/extend.js
var extend = __webpack_require__(7);
var extend_default = /*#__PURE__*/__webpack_require__.n(extend);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/domUtil/css.js
var css = __webpack_require__(4);
var css_default = /*#__PURE__*/__webpack_require__.n(css);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/domUtil/addClass.js
var addClass = __webpack_require__(5);
var addClass_default = /*#__PURE__*/__webpack_require__.n(addClass);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/domUtil/removeClass.js
var removeClass = __webpack_require__(6);
var removeClass_default = /*#__PURE__*/__webpack_require__.n(removeClass);

// EXTERNAL MODULE: /Users/nhnent/Documents/tui.editor_legacy/libs/toastmark/dist/toastmark.js
var toastmark = __webpack_require__(22);

// EXTERNAL MODULE: ./src/js/htmlRenderConvertors.js
var htmlRenderConvertors = __webpack_require__(29);

// CONCATENATED MODULE: ./src/js/markdownToHTML.js


function createMarkdownToHTML(options) {
  var extendedAutolinks = options.extendedAutolinks,
      customHTMLRenderer = options.customHTMLRenderer,
      referenceDefinition = options.referenceDefinition,
      customParser = options.customParser,
      frontMatter = options.frontMatter;
  var parser = new toastmark["Parser"]({
    disallowedHtmlBlockTags: ['br'],
    extendedAutolinks: extendedAutolinks,
    referenceDefinition: referenceDefinition,
    disallowDeepHeading: true,
    customParser: customParser,
    frontMatter: frontMatter
  });
  var renderHTML = Object(toastmark["createRenderHTML"])({
    gfm: true,
    convertors: Object(htmlRenderConvertors["a" /* getHTMLRenderConvertors */])(null, customHTMLRenderer)
  });
  return function markdownToHTML(markdown) {
    return renderHTML(parser.parse(markdown));
  };
}
// EXTERNAL MODULE: ./src/js/utils/common.js
var utils_common = __webpack_require__(12);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/type/isBoolean.js
var isBoolean = __webpack_require__(56);
var isBoolean_default = /*#__PURE__*/__webpack_require__.n(isBoolean);

// EXTERNAL MODULE: external {"commonjs":"codemirror","commonjs2":"codemirror","amd":"codemirror","root":["CodeMirror"]}
var external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_ = __webpack_require__(15);
var external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_);

// CONCATENATED MODULE: ./src/js/codemirror/fixOrderedListNumber.js
/**
 * @fileoverview codemirror extension for fix ordered list number
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

var listRE = /^(\s*)((\d+)([.)]\s(?:\[(?:x|\s)\]\s)?))(.*)/;
/**
 * simple wrapper for indentLess command
 * to run fixOrderedListNumber on Shift-Tab
 * @param {CodeMirror} cm - CodeMirror instance
 * @returns {CodeMirror.Pass|null} - next command
 * @ignore
 */

external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.commands.indentLessOrderedList = function (cm) {
  if (cm.getOption('disableInput')) {
    return external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.Pass;
  }

  cm.execCommand('indentLess');
  cm.execCommand('fixOrderedListNumber');
  return null;
};
/**
 * fix ordered list number
 * @param {CodeMirror} cm - CodeMirror instance
 * @returns {CodeMirror.Pass|null} - next command
 * @ignore
 */


external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.commands.fixOrderedListNumber = function (cm) {
  if (cm.getOption('disableInput') || !!cm.state.isCursorInCodeBlock) {
    return external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.Pass;
  }

  var ranges = cm.listSelections();

  for (var i = 0; i < ranges.length; i += 1) {
    var pos = ranges[i].head;
    var lineNumber = findFirstListItem(pos.line, cm);

    if (lineNumber >= 0) {
      var lineText = cm.getLine(lineNumber);

      var _listRE$exec = listRE.exec(lineText),
          indent = _listRE$exec[1],
          index = _listRE$exec[3];

      fixNumber(lineNumber, indent.length, parseInt(index, 10), cm);
    }
  }

  return null;
};
/**
 * fix list numbers
 * @param {number} lineNumber - line number of list item to be normalized
 * @param {number} prevIndentLength - previous indent length
 * @param {number} startIndex - start index
 * @param {CodeMirror} cm - CodeMirror instance
 * @returns {number} - next line number
 * @ignore
 */


function fixNumber(lineNumber, prevIndentLength, startIndex, cm) {
  var indent, delimiter, text, indentLength;
  var index = startIndex;
  var lineText = cm.getLine(lineNumber);

  do {
    var _listRE$exec2 = listRE.exec(lineText);

    indent = _listRE$exec2[1];
    delimiter = _listRE$exec2[4];
    text = _listRE$exec2[5];
    indentLength = indent.length;

    if (indentLength === prevIndentLength) {
      // fix number
      cm.replaceRange("" + indent + index + delimiter + text, {
        line: lineNumber,
        ch: 0
      }, {
        line: lineNumber,
        ch: lineText.length
      });
      index += 1;
      lineNumber += 1;
    } else if (indentLength > prevIndentLength) {
      // nested list start
      lineNumber = fixNumber(lineNumber, indentLength, 1, cm);
    } else {
      // nested list end
      return lineNumber;
    }

    lineText = cm.getLine(lineNumber);
  } while (listRE.test(lineText));

  return lineNumber;
}
/**
 * find line number of list item which contains given lineNumber
 * @param {number} lineNumber - line number of list item
 * @param {CodeMirror} cm - CodeMirror instance
 * @returns {number} - line number of first list item
 * @ignore
 */


function findFirstListItem(lineNumber, cm) {
  var nextLineNumber = lineNumber;
  var lineText = cm.getLine(lineNumber);

  while (listRE.test(lineText)) {
    nextLineNumber -= 1;
    lineText = cm.getLine(nextLineNumber);
  }

  if (lineNumber === nextLineNumber) {
    nextLineNumber = -1;
  } else {
    nextLineNumber += 1;
  }

  return nextLineNumber;
}
// CONCATENATED MODULE: ./src/js/codemirror/overlay.js
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
// Utility function that allows modes to be combined. The mode given
// as the base argument takes care of most of the normal mode
// functionality, but a second (typically simple) mode is used, which
// can override the style of text. Both modes get to parse all of the
// text, but when both assign a non-null style to a piece of code, the
// overlay wins, unless the combine argument was true and not overridden,
// or state.overlay.combineTokens was true, in which case the styles are
// combined.

/**
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */

/*eslint-disable */

external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.overlayMode = function (base, overlay, combine) {
  return {
    startState: function startState() {
      return {
        base: external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.startState(base),
        overlay: external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.startState(overlay),
        basePos: 0,
        baseCur: null,
        overlayPos: 0,
        overlayCur: null,
        streamSeen: null
      };
    },
    copyState: function copyState(state) {
      return {
        base: external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.copyState(base, state.base),
        overlay: external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.copyState(overlay, state.overlay),
        basePos: state.basePos,
        baseCur: null,
        overlayPos: state.overlayPos,
        overlayCur: null
      };
    },
    token: function token(stream, state) {
      if (stream != state.streamSeen || Math.min(state.basePos, state.overlayPos) < stream.start) {
        state.streamSeen = stream;
        state.basePos = state.overlayPos = stream.start;
      }

      if (stream.start == state.basePos) {
        state.baseCur = base.token(stream, state.base);
        state.basePos = stream.pos;
      }

      if (stream.start == state.overlayPos) {
        stream.pos = stream.start;
        state.overlayCur = overlay.token(stream, state.overlay);
        state.overlayPos = stream.pos;
      }

      stream.pos = Math.min(state.basePos, state.overlayPos); // state.overlay.combineTokens always takes precedence over combine,
      // unless set to null

      if (state.overlayCur == null) return state.baseCur;else if (state.baseCur != null && state.overlay.combineTokens || combine && state.overlay.combineTokens == null) return state.baseCur + ' ' + state.overlayCur;else return state.overlayCur;
    },
    indent: base.indent && function (state, textAfter) {
      return base.indent(state.base, textAfter);
    },
    electricChars: base.electricChars,
    innerMode: function innerMode(state) {
      return {
        state: state.base,
        mode: base
      };
    },
    blankLine: function blankLine(state) {
      if (base.blankLine) base.blankLine(state.base);
      if (overlay.blankLine) overlay.blankLine(state.overlay);
    }
  };
};
// CONCATENATED MODULE: ./src/js/codemirror/continuelist.js
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

/**
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */

/*eslint-disable */

var continuelist_listRE = /^(\s*)(>[> ]*|[*+-] \[[x ]\]\s|[*+-]\s|(\d+)([.)]\s))(\s*)/,
    emptyListRE = /^(\s*)(>[> ]*|[*+-] \[[x ]\]|[*+-]|(\d+)[.)])(\s*)$/,
    unorderedListRE = /[*+-]\s/;

external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.commands.indentOrderedList = function (cm) {
  if (cm.getOption('disableInput')) return external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.Pass;
  var ranges = cm.listSelections();

  for (var i = 0; i < ranges.length; i++) {
    var pos = ranges[i].head;
    var line = cm.getLine(pos.line);
    var cursorBeforeTextInline = line.substr(0, pos.ch);

    if (continuelist_listRE.test(cursorBeforeTextInline) || cm.somethingSelected()) {
      cm.indentSelection('add');
    } else {
      cm.execCommand('insertSoftTab');
    }
  }

  cm.execCommand('fixOrderedListNumber');
};

external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.commands.newlineAndIndentContinueMarkdownList = function (cm) {
  if (cm.getOption('disableInput') || !!cm.state.isCursorInCodeBlock) {
    cm.execCommand('newlineAndIndent');
    return;
  }

  var ranges = cm.listSelections(),
      replacements = [];

  for (var i = 0; i < ranges.length; i++) {
    var pos = ranges[i].head;
    var line = cm.getLine(pos.line),
        match = continuelist_listRE.exec(line);
    var cursorBeforeBullet = /^\s*$/.test(line.slice(0, pos.ch));

    if (!ranges[i].empty() || !match || cursorBeforeBullet) {
      cm.execCommand('newlineAndIndent');
      return;
    }

    if (emptyListRE.test(line)) {
      if (!/>\s*$/.test(line)) cm.replaceRange('', {
        line: pos.line,
        ch: 0
      }, {
        line: pos.line,
        ch: pos.ch + 1
      });
      replacements[i] = '\n';
    } else {
      var indent = match[1],
          after = match[5];
      var numbered = !(unorderedListRE.test(match[2]) || match[2].indexOf('>') >= 0);
      var bullet = numbered ? parseInt(match[3], 10) + 1 + match[4] : match[2].replace('x', ' ');
      replacements[i] = '\n' + indent + bullet + after;
      if (numbered) incrementRemainingMarkdownListNumbers(cm, pos);
    }
  }

  cm.replaceSelections(replacements);
}; // Auto-updating Markdown list numbers when a new item is added to the
// middle of a list


function incrementRemainingMarkdownListNumbers(cm, pos) {
  var startLine = pos.line,
      lookAhead = 0,
      skipCount = 0;
  var startItem = continuelist_listRE.exec(cm.getLine(startLine)),
      startIndent = startItem[1];

  do {
    lookAhead += 1;
    var nextLineNumber = startLine + lookAhead;
    var nextLine = cm.getLine(nextLineNumber),
        nextItem = continuelist_listRE.exec(nextLine);

    if (nextItem) {
      var nextIndent = nextItem[1];
      var newNumber = parseInt(startItem[3], 10) + lookAhead - skipCount;
      var nextNumber = parseInt(nextItem[3], 10),
          itemNumber = nextNumber;

      if (startIndent === nextIndent && !isNaN(nextNumber)) {
        if (newNumber === nextNumber) itemNumber = nextNumber + 1;
        if (newNumber > nextNumber) itemNumber = newNumber + 1;
        cm.replaceRange(nextLine.replace(continuelist_listRE, nextIndent + itemNumber + nextItem[4] + nextItem[5]), {
          line: nextLineNumber,
          ch: 0
        }, {
          line: nextLineNumber,
          ch: nextLine.length
        });
      } else {
        if (startIndent.length > nextIndent.length) return; // This doesn't run if the next line immediatley indents, as it is
        // not clear of the users intention (new indented item or same level)

        if (startIndent.length < nextIndent.length && lookAhead === 1) return;
        skipCount += 1;
      }
    }
  } while (nextItem);
}
// CONCATENATED MODULE: ./src/js/codemirror/arrowKeyFunction.js
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

/**
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */

/*eslint-disable */

external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.commands.replaceLineTextToUpper = function (cm) {
  if (cm.getOption('disableInput')) {
    return external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.Pass;
  }

  var ranges = cm.listSelections();
  var lineAdjustment = -1;

  for (var i = 0; i < ranges.length; i++) {
    var range = ranges[i];
    var from = range.anchor;
    var to = range.head;

    if (isSameLineSelection(range) && to.line > 0) {
      replaceSingleLine(cm, from, to, lineAdjustment);
    } else if (!isRangeCollapsed(range)) {
      var topLine = from.line < to.line ? from.line : to.line;

      if (topLine > 0) {
        var upper = from.line === topLine ? from : to;
        var bottom = from.line === topLine ? to : from;
        replaceMultiLine(cm, upper, bottom, lineAdjustment);
      }
    }
  }
};

external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.commands.replaceLineTextToLower = function (cm) {
  if (cm.getOption('disableInput')) {
    return external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.Pass;
  }

  var ranges = cm.listSelections();
  var lineAdjustment = 1;

  for (var i = 0; i < ranges.length; i++) {
    var range = ranges[i];
    var from = range.anchor;
    var to = range.head;
    var isLastLine = to.line === cm.lastLine();

    if (isSameLineSelection(range) && !isLastLine) {
      replaceSingleLine(cm, from, to, lineAdjustment);
    } else if (!isRangeCollapsed(range)) {
      var topLine = from.line < to.line ? from.line : to.line;
      var upper = from.line === topLine ? from : to;
      var bottom = from.line === topLine ? to : from;

      if (bottom.line < cm.lastLine()) {
        replaceMultiLine(cm, upper, bottom, lineAdjustment);
      }
    }
  }
};

function isRangeCollapsed(range) {
  return isSameLineSelection(range) && range.anchor.ch === range.head.ch;
}

function isSameLineSelection(range) {
  return range.anchor.line === range.head.line;
}

function replaceSingleLine(cm, from, to, lineAdjustment) {
  var currentLine = cm.getLine(to.line);
  var replacement = cm.getLine(to.line + lineAdjustment);
  var range = {
    anchor: from,
    head: to
  };
  cm.replaceRange(replacement, {
    line: to.line,
    ch: 0
  }, {
    line: to.line,
    ch: currentLine.length
  }, '+input');
  cm.replaceRange(currentLine, {
    line: to.line + lineAdjustment,
    ch: 0
  }, {
    line: to.line + lineAdjustment,
    ch: replacement.length
  }, '+input');

  if (isRangeCollapsed(range)) {
    cm.setCursor({
      line: to.line + lineAdjustment,
      ch: to.ch
    });
  } else {
    cm.setSelection({
      line: from.line + lineAdjustment,
      ch: from.ch
    }, {
      line: to.line + lineAdjustment,
      ch: to.ch
    });
  }
}

function replaceMultiLine(cm, upper, bottom, lineAdjustment) {
  var rangeContent = cm.getRange({
    line: upper.line,
    ch: 0
  }, {
    line: bottom.line,
    ch: cm.getLine(bottom.line).length
  });
  var edgeLineOfConcern = lineAdjustment > 0 ? bottom : upper;
  var replacement = cm.getLine(edgeLineOfConcern.line + lineAdjustment);
  var targetLine;

  if (lineAdjustment > 0) {
    targetLine = upper;
  } else {
    targetLine = bottom;
  }

  cm.replaceRange(replacement, {
    line: targetLine.line,
    ch: 0
  }, {
    line: targetLine.line,
    ch: cm.getLine(targetLine.line).length
  }, '+input');
  cm.replaceRange(rangeContent, {
    line: upper.line + lineAdjustment,
    ch: 0
  }, {
    line: bottom.line + lineAdjustment,
    ch: cm.getLine(bottom.line + lineAdjustment).length
  }, '+input');
  cm.setSelection({
    line: upper.line + lineAdjustment,
    ch: upper.ch
  }, {
    line: bottom.line + lineAdjustment,
    ch: bottom.ch
  });
}
// CONCATENATED MODULE: ./src/js/codemirror/placeholder.js
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

/**
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */

/* eslint-disable */

external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.defineOption('placeholder', '', function (cm, val, old) {
  var prev = old && old != external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.Init;

  if (val && !prev) {
    cm.on('blur', onBlur);
    cm.on('change', onChange);
    cm.on('swapDoc', onChange);
    onChange(cm);
  } else if (!val && prev) {
    cm.off('blur', onBlur);
    cm.off('change', onChange);
    cm.off('swapDoc', onChange);
    clearPlaceholder(cm);
    var wrapper = cm.getWrapperElement();
    wrapper.className = wrapper.className.replace(' CodeMirror-empty', '');
  }

  if (val && !cm.hasFocus()) onBlur(cm);
});

function clearPlaceholder(cm) {
  if (cm.state.placeholder) {
    cm.state.placeholder.parentNode.removeChild(cm.state.placeholder);
    cm.state.placeholder = null;
  }
}

function setPlaceholder(cm) {
  clearPlaceholder(cm);
  var elt = cm.state.placeholder = document.createElement('pre');
  elt.style.cssText = 'height: 0; overflow: visible';
  elt.className = 'CodeMirror-placeholder';
  var placeHolder = cm.getOption('placeholder');
  if (typeof placeHolder == 'string') placeHolder = document.createTextNode(placeHolder);
  elt.appendChild(placeHolder);
  cm.display.lineSpace.insertBefore(elt, cm.display.lineSpace.firstChild);
}

function onBlur(cm) {
  if (isEmpty(cm)) setPlaceholder(cm);
}

function onChange(cm) {
  var wrapper = cm.getWrapperElement(),
      empty = isEmpty(cm);
  wrapper.className = wrapper.className.replace(' CodeMirror-empty', '') + (empty ? ' CodeMirror-empty' : '');
  if (empty) setPlaceholder(cm);else clearPlaceholder(cm);
}

function isEmpty(cm) {
  return cm.lineCount() === 1 && cm.getLine(0) === '';
}
// CONCATENATED MODULE: ./src/js/codeMirrorExt.js
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * @fileoverview Implements CodeBlockExt
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */







/**
 * Class CodeMirrorExt
 * @param {HTMLElement} el - container jquery element
 * @param {Object} [options={}] - codeMirror options
 */

var codeMirrorExt_CodeMirrorExt = /*#__PURE__*/function () {
  function CodeMirrorExt(el, options) {
    if (options === void 0) {
      options = {};
    }

    this.editorContainerEl = el;
    /**
     * CodeMirror instance
     * @type {CodeMirror.EditorFromTextArea}
     * @private
     */

    this.cm = null;

    this._init(options);
  }
  /**
   * init
   * @param {Object} options - codeMirror option
   * @private
   */


  var _proto = CodeMirrorExt.prototype;

  _proto._init = function _init(options) {
    var cmTextarea = document.createElement('textarea');
    this.editorContainerEl.appendChild(cmTextarea);
    options = _extends({}, options, {
      lineWrapping: true,
      theme: 'default',
      extraKeys: _extends({
        'Shift-Tab': 'indentLess',
        'Alt-Up': 'replaceLineTextToUpper',
        'Alt-Down': 'replaceLineTextToLower'
      }, options.extraKeys),
      indentUnit: 4,
      cursorScrollMargin: 12,
      specialCharPlaceholder: function specialCharPlaceholder() {
        return document.createElement('span');
      }
    });
    this.cm = external_commonjs_codemirror_commonjs2_codemirror_amd_codemirror_root_CodeMirror_default.a.fromTextArea(cmTextarea, options);
  }
  /**
   * getCurrentRange
   * @returns {Object} - selection range
   */
  ;

  _proto.getCurrentRange = function getCurrentRange() {
    var from = this.cm.getCursor('from');
    var to = this.cm.getCursor('to');
    return {
      from: from,
      to: to,
      collapsed: from.line === to.line && from.ch === to.ch
    };
  }
  /**
   * Set focus to current Editor
   */
  ;

  _proto.focus = function focus() {
    this.cm.focus();
  }
  /**
   * blur focus to current Editor
   */
  ;

  _proto.blur = function blur() {
    this.cm.getInputField().blur();
  }
  /**
   * Remove Editor from document
   */
  ;

  _proto.remove = function remove() {
    this.cm.toTextArea();
  }
  /**
   * Set Editor value
   * @param {string} markdown - Markdown syntax text
   * @param {boolean} [cursorToEnd=true] - move cursor to contents end
   */
  ;

  _proto.setValue = function setValue(markdown, cursorToEnd) {
    if (cursorToEnd === void 0) {
      cursorToEnd = true;
    }

    this.cm.setValue(markdown);

    if (cursorToEnd) {
      this.moveCursorToEnd();
    }

    this.cm.doc.clearHistory();
    this.cm.refresh();
  }
  /**
   * Get editor value
   * @returns {string} - codeMirror text value
   */
  ;

  _proto.getValue = function getValue() {
    return this.cm.getValue('\n');
  }
  /**
   * Get CodeMirror instance
   * @returns {CodeMirror}
   */
  ;

  _proto.getEditor = function getEditor() {
    return this.cm;
  }
  /**
   * Reset Editor
   */
  ;

  _proto.reset = function reset() {
    this.setValue('');
  }
  /**
   * Get current caret position
   * @returns {{from: {line: number, ch: number}, to: {line: number, ch: number}}}
   */
  ;

  _proto.getCaretPosition = function getCaretPosition() {
    return this.cm.cursorCoords();
  }
  /**
   * Add widget
   * @param {object} selection - Selection object
   * @param {HTMLElement} node - Widget node
   * @param {string} style - Adding style "over" or "bottom"
   * @param {number} offset - Adding offset
   */
  ;

  _proto.addWidget = function addWidget(selection, node, style, offset) {
    if (offset) {
      selection.ch += offset;
    }

    this.cm.addWidget(selection.end, node, true, style);
  }
  /**
   * Replace selection with given replacement content
   * @param {string} content - Replacement content text
   * @param {object} selection - Selection object
   */
  ;

  _proto.replaceSelection = function replaceSelection(content, selection) {
    if (selection) {
      this.cm.setSelection(selection.from, selection.to);
    }

    this.cm.replaceSelection(content);
    this.focus();
  }
  /**
   * Replace selection with replacement content and offset
   * @param {string} content - Replacement content text
   * @param {number} offset - Offset
   * @param {number} overwriteLength - Length to overwrite
   */
  ;

  _proto.replaceRelativeOffset = function replaceRelativeOffset(content, offset, overwriteLength) {
    var cursor = this.cm.getCursor();
    var selection = {
      from: {
        line: cursor.line,
        ch: cursor.ch + offset
      },
      to: {
        line: cursor.line,
        ch: cursor.ch + offset + overwriteLength
      }
    };
    this.replaceSelection(content, selection);
  }
  /**
   * Set Editor height
   * @param {number} height - Editor height
   */
  ;

  _proto.setHeight = function setHeight(height) {
    var contentWrapper = this.getWrapperElement();
    css_default()(contentWrapper, {
      height: height + "px"
    });
  }
  /**
   * set min height
   * @param {number} minHeight - min height
   */
  ;

  _proto.setMinHeight = function setMinHeight(minHeight) {
    var contentWrapper = this.getWrapperElement();
    css_default()(contentWrapper, {
      minHeight: minHeight + "px"
    });
  }
  /**
   * Set the placeholder to CodeMirror
   * @param {string} placeholder - placeholder to set
   */
  ;

  _proto.setPlaceholder = function setPlaceholder(placeholder) {
    if (placeholder) {
      this.cm.setOption('placeholder', placeholder);
    }
  }
  /**
   * get code mirror wrapper element
   * @returns {HTMLElement} - code mirror wrapper element
   */
  ;

  _proto.getWrapperElement = function getWrapperElement() {
    return this.cm.getWrapperElement();
  }
  /**
   * get code mirror cursor
   * @param {string} [start='head'] - which end of the selection. 'from'|'to'|'head'|'anchor'
   * @returns {Cursor} - code mirror cursor
   */
  ;

  _proto.getCursor = function getCursor(start) {
    return this.cm.getCursor(start);
  }
  /**
   * Set cursor position to end
   */
  ;

  _proto.moveCursorToEnd = function moveCursorToEnd() {
    var doc = this.getEditor().getDoc();
    var lastLine = doc.lastLine();
    doc.setCursor(lastLine, doc.getLine(lastLine).length);
  }
  /**
   * Set cursor position to start
   */
  ;

  _proto.moveCursorToStart = function moveCursorToStart() {
    var doc = this.getEditor().getDoc();
    var firstLine = doc.firstLine();
    doc.setCursor(firstLine, 0);
  }
  /**
   * Scroll Editor content to Top
   * @param {number} value - Scroll amount
   * @returns {number} - changed scroll top
   */
  ;

  _proto.scrollTop = function scrollTop(value) {
    if (value) {
      this.cm.scrollTo(0, value);
    }

    return this.cm.getScrollInfo().top;
  }
  /**
   * Get start, end position of current selection
   * @returns {{start: {line: *, ch: *}, end: {line: *, ch: *}}}
   */
  ;

  _proto.getRange = function getRange() {
    var start = this.cm.getCursor('from');
    var end = this.cm.getCursor('to');
    return {
      start: {
        line: start.line,
        ch: start.ch
      },
      end: {
        line: end.line,
        ch: end.ch
      }
    };
  }
  /**
   * add codemirror event handler
   * @param {string} type - event type
   * @param {function} func - handler function
   */
  ;

  _proto.on = function on(type, func) {
    this.cm.on(type, func);
  }
  /**
   * remove codemirror event handler
   * @param {string} type - event type
   * @param {function} func - handler function
   */
  ;

  _proto.off = function off(type, func) {
    this.cm.off(type, func);
  };

  return CodeMirrorExt;
}();

/* harmony default export */ var codeMirrorExt = (codeMirrorExt_CodeMirrorExt);
// CONCATENATED MODULE: ./src/js/keyMapper.js
/**
 * @fileoverview Implements KeyMapper
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Constant of key mapping
 * @type {string[]}
 * @ignore
 */
var KEYBOARD_MAP = ['', // [0]
'', // [1]
'', // [2]
'CANCEL', // [3]
'', // [4]
'', // [5]
'HELP', // [6]
'', // [7]
'BACK_SPACE', // [8]
'TAB', // [9]
'', // [10]
'', // [11]
'CLEAR', // [12]
'ENTER', // [13]
'ENTER_SPECIAL', // [14]
'', // [15]
'', // [16] SHIFT
'', // [17] CONTROL
'', // [18] ALT
'PAUSE', // [19]
'CAPS_LOCK', // [20]
'KANA', // [21]
'EISU', // [22]
'JUNJA', // [23]
'FINAL', // [24]
'HANJA', // [25]
'', // [26]
'ESCAPE', // [27]
'CONVERT', // [28]
'NONCONVERT', // [29]
'ACCEPT', // [30]
'MODECHANGE', // [31]
'SPACE', // [32]
'PAGE_UP', // [33]
'PAGE_DOWN', // [34]
'END', // [35]
'HOME', // [36]
'LEFT', // [37]
'UP', // [38]
'RIGHT', // [39]
'DOWN', // [40]
'SELECT', // [41]
'PRINT', // [42]
'EXECUTE', // [43]
'PRINTSCREEN', // [44]
'INSERT', // [45]
'DELETE', // [46]
'', // [47]
'0', // [48]
'1', // [49]
'2', // [50]
'3', // [51]
'4', // [52]
'5', // [53]
'6', // [54]
'7', // [55]
'8', // [56]
'9', // [57]
':', // [58]
';', // [59]
'<', // [60]
'=', // [61]
'>', // [62]
'?', // [63]
'AT', // [64]
'A', // [65]
'B', // [66]
'C', // [67]
'D', // [68]
'E', // [69]
'F', // [70]
'G', // [71]
'H', // [72]
'I', // [73]
'J', // [74]
'K', // [75]
'L', // [76]
'M', // [77]
'N', // [78]
'O', // [79]
'P', // [80]
'Q', // [81]
'R', // [82]
'S', // [83]
'T', // [84]
'U', // [85]
'V', // [86]
'W', // [87]
'X', // [88]
'Y', // [89]
'Z', // [90]
'', // [91] META
'', // [92]
'CONTEXT_MENU', // [93]
'', // [94]
'SLEEP', // [95]
'NUMPAD0', // [96]
'NUMPAD1', // [97]
'NUMPAD2', // [98]
'NUMPAD3', // [99]
'NUMPAD4', // [100]
'NUMPAD5', // [101]
'NUMPAD6', // [102]
'NUMPAD7', // [103]
'NUMPAD8', // [104]
'NUMPAD9', // [105]
'MULTIPLY', // [106]
'ADD', // [107]
'SEPARATOR', // [108]
'SUBTRACT', // [109]
'DECIMAL', // [110]
'DIVIDE', // [111]
'F1', // [112]
'F2', // [113]
'F3', // [114]
'F4', // [115]
'F5', // [116]
'F6', // [117]
'F7', // [118]
'F8', // [119]
'F9', // [120]
'F10', // [121]
'F11', // [122]
'F12', // [123]
'F13', // [124]
'F14', // [125]
'F15', // [126]
'F16', // [127]
'F17', // [128]
'F18', // [129]
'F19', // [130]
'F20', // [131]
'F21', // [132]
'F22', // [133]
'F23', // [134]
'F24', // [135]
'', // [136]
'', // [137]
'', // [138]
'', // [139]
'', // [140]
'', // [141]
'', // [142]
'', // [143]
'NUM_LOCK', // [144]
'SCROLL_LOCK', // [145]
'WIN_OEM_FJ_JISHO', // [146]
'WIN_OEM_FJ_MASSHOU', // [147]
'WIN_OEM_FJ_TOUROKU', // [148]
'WIN_OEM_FJ_LOYA', // [149]
'WIN_OEM_FJ_ROYA', // [150]
'', // [151]
'', // [152]
'', // [153]
'', // [154]
'', // [155]
'', // [156]
'', // [157]
'', // [158]
'', // [159]
'@', // [160]
'!', // [161]
'"', // [162]
'#', // [163]
'$', // [164]
'%', // [165]
'&', // [166]
'_', // [167]
'(', // [168]
')', // [169]
'*', // [170]
'+', // [171]
'|', // [172]
'-', // [173]
'{', // [174]
'}', // [175]
'~', // [176]
'', // [177]
'', // [178]
'', // [179]
'', // [180]
'VOLUME_MUTE', // [181]
'VOLUME_DOWN', // [182]
'VOLUME_UP', // [183]
'', // [184]
'', // [185]
';', // [186]
'=', // [187]
',', // [188]
'-', // [189]
'.', // [190]
'/', // [191]
'`', // [192]
'', // [193]
'', // [194]
'', // [195]
'', // [196]
'', // [197]
'', // [198]
'', // [199]
'', // [200]
'', // [201]
'', // [202]
'', // [203]
'', // [204]
'', // [205]
'', // [206]
'', // [207]
'', // [208]
'', // [209]
'', // [210]
'', // [211]
'', // [212]
'', // [213]
'', // [214]
'', // [215]
'', // [216]
'', // [217]
'', // [218]
'[', // [219]
'\\', // [220]
']', // [221]
"'", // [222]
'', // [223]
'META', // [224]
'ALTGR', // [225]
'', // [226]
'WIN_ICO_HELP', // [227]
'WIN_ICO_00', // [228]
'', // [229]
'WIN_ICO_CLEAR', // [230]
'', // [231]
'', // [232]
'WIN_OEM_RESET', // [233]
'WIN_OEM_JUMP', // [234]
'WIN_OEM_PA1', // [235]
'WIN_OEM_PA2', // [236]
'WIN_OEM_PA3', // [237]
'WIN_OEM_WSCTRL', // [238]
'WIN_OEM_CUSEL', // [239]
'WIN_OEM_ATTN', // [240]
'WIN_OEM_FINISH', // [241]
'WIN_OEM_COPY', // [242]
'WIN_OEM_AUTO', // [243]
'WIN_OEM_ENLW', // [244]
'WIN_OEM_BACKTAB', // [245]
'ATTN', // [246]
'CRSEL', // [247]
'EXSEL', // [248]
'EREOF', // [249]
'PLAY', // [250]
'ZOOM', // [251]
'', // [252]
'PA1', // [253]
'WIN_OEM_CLEAR', // [254]
'' // [255]
];
var sharedInstance;
/**
 * Class KeyMapper
 * @param {object} [options] options
 * @param {string} options.splitter splitter string default is +
 * @ignore
 */

var KeyMapper = /*#__PURE__*/function () {
  function KeyMapper(options) {
    this._setSplitter(options);
  }
  /**
   * Set key splitter
   * @param {object} options Option object
   * @private
   */


  var _proto = KeyMapper.prototype;

  _proto._setSplitter = function _setSplitter(options) {
    var splitter = options ? options.splitter : '+';
    this._splitter = splitter;
  }
  /**
   * Convert event to keyMap
   * @param {event} event Event object
   * @returns {string}
   */
  ;

  _proto.convert = function convert(event) {
    var keyMap = [];

    if (event.shiftKey) {
      keyMap.push('SHIFT');
    }

    if (event.ctrlKey) {
      keyMap.push('CTRL');
    }

    if (event.metaKey) {
      keyMap.push('META');
    }

    if (event.altKey) {
      keyMap.push('ALT');
    }

    var keyChar = this._getKeyCodeChar(event.keyCode);

    if (keyChar) {
      keyMap.push(keyChar);
    }

    return keyMap.join(this._splitter);
  }
  /**
   * Get character from key code
   * @param {number} keyCode Key code
   * @returns {string}
   * @private
   */
  ;

  _proto._getKeyCodeChar = function _getKeyCodeChar(keyCode) {
    var keyCodeCharacter = KEYBOARD_MAP[keyCode];
    return keyCodeCharacter;
  }
  /**
   * Get sharedInstance
   * @returns {KeyMapper}
   */
  ;

  KeyMapper.getSharedInstance = function getSharedInstance() {
    if (!sharedInstance) {
      sharedInstance = new KeyMapper();
    }

    return sharedInstance;
  }
  /**
   * get key code for a character
   * @param {string} char - a character to be converted
   * @returns {number} key code for the char
   * @static
   */
  ;

  KeyMapper.keyCode = function keyCode(char) {
    return KEYBOARD_MAP.indexOf(char);
  };

  return KeyMapper;
}();

/* harmony default export */ var keyMapper = (KeyMapper);
// CONCATENATED MODULE: ./src/js/mdListManager.js
/**
 * @fileoverview Implements markdown list manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
var FIND_LIST_RX = /^[ \t]*([-*]|[\d]+\.)( \[[ xX]])? /;
var FIND_TASK_LIST_RX = /^[ \t]*([*-] |[\d]+\. )(\[[ xX]] )/;
var FIND_UL_RX = /^[ \t]*[-*] .*/;
var FIND_OL_TASK_RX = /^[ \t]*[\d]+\. \[[ xX]] .*/;
var LIST_SYNTAX_RX = /([*-] |[\d]+\. )/;
var TASK_SYNTAX_RX = /([-*] |[\d]+\. )(\[[ xX]] )/;
var LIST_OR_TASK_SYNTAX_RX = /([-*]|[\d]+\.)( \[[ xX]])? /;
var UL_TASK_SYNTAX_RX = /([-*])( \[[ xX]]) /;
var OL_SYNTAX_RX = /([\d])+\.( \[[ xX]])? /;
var FIND_TABLE_RX = /^\|([-\s\w\d\t<>?!@#$%^&*()_=+\\/'";: \r[\]]*\|+)+/i;
var FIND_HEADING_RX = /^#+\s/;
var FIND_BLOCK_RX = /^ {0,3}(```|\||>)/;
/**
 * Class MdListManager
 * @param {MarkdownEditor} mde - MarkdownEditor instance
 * @ignore
 */

var MdListManager = /*#__PURE__*/function () {
  function MdListManager(mde) {
    this.cm = mde.getEditor();
    this.doc = this.cm.getDoc();
    this.toastMark = mde.getToastMark();
    /**
     * Name property
     * @type {string}
     */

    this.name = 'list';
  }
  /**
   * Sort line number of selection descending
   * @param {{from, to}} range start, end CodeMirror range information
   * @returns {{start: {number}, end: {number}}}
   * @private
   */


  var _proto = MdListManager.prototype;

  _proto._createSortedLineRange = function _createSortedLineRange(range) {
    var isReversed = range.from.line > range.to.line;
    var rangeStart = {
      line: isReversed ? range.to.line : range.from.line,
      ch: 0
    };
    var rangeEnd = {
      line: isReversed ? range.from.line : range.to.line,
      ch: 0
    };
    return {
      start: rangeStart.line,
      end: rangeEnd.line
    };
  }
  /**
   * For odering the ol list, search preivous lines and
   * calculate ordinal number when find ol list
   * @param {number} lineNumber lineNumber
   * @returns {number}
   * @private
   */
  ;

  _proto._calculateOrdinalNumber = function _calculateOrdinalNumber(lineNumber) {
    var ordinalNumber = 1;

    for (var i = lineNumber - 1; i >= 0; i -= 1) {
      var depth = this._getListDepth(i);

      if (depth === 1 && OL_SYNTAX_RX.exec(this.doc.getLine(i))) {
        ordinalNumber = parseInt(RegExp.$1, 10) + 1;
        break;
      } else if (depth === 0) {
        break;
      }
    }

    return ordinalNumber;
  };

  _proto._isListLine = function _isListLine(lineNumber) {
    return !!FIND_LIST_RX.exec(this.doc.getLine(lineNumber));
  }
  /**
   * If text already have sytax for heading, table and code block,
   * can not change to list.
   * @param {number} lineNumber lineNumber
   * @returns {boolean}
   * @private
   */
  ;

  _proto._isCanBeList = function _isCanBeList(lineNumber) {
    var line = this.doc.getLine(lineNumber);
    return !FIND_BLOCK_RX.test(line) && !FIND_TABLE_RX.test(line) && !FIND_HEADING_RX.test(line);
  }
  /**
   * Return a function for change according to type
   * @param {string} type ol, ul, task
   * @returns {Function}
   * @private
   */
  ;

  _proto._getChangeFn = function _getChangeFn(type) {
    var _this = this;

    var fn;

    switch (type) {
      case 'ol':
      case 'ul':
        fn = function fn(lineNumber) {
          return _this._changeToList(lineNumber, type);
        };

        break;

      case 'task':
        fn = function fn(lineNumber) {
          return _this._changeToTask(lineNumber);
        };

        break;

      default:
        break;
    }

    return fn;
  }
  /**
   * Change syntax by traversing each line selected.
   * @param {{from, to}} range start, end CodeMirror range information
   * @param {string} type ol, ul, task
   */
  ;

  _proto.changeSyntax = function changeSyntax(range, type) {
    var newListLine = [];

    var lineRange = this._createSortedLineRange(range);

    var startLineNumber = lineRange.start,
        endLineNumber = lineRange.end;

    var changeFn = this._getChangeFn(type);

    for (var lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber += 1) {
      if (!this._isCanBeList(lineNumber)) {
        break;
      } // If text of lineNumber is not list, cache for inserting blank line


      if (!this._isListLine(lineNumber)) {
        newListLine.push(lineNumber);
      }

      changeFn(lineNumber);
    } // Should insert blank line before and after new list


    this._insertBlankLineForNewList(newListLine);

    this.cm.focus();
  };

  _proto._replaceLineText = function _replaceLineText(text, lineNumber) {
    this.doc.replaceRange(text, {
      line: lineNumber,
      ch: 0
    });
  }
  /**
   * change to list according to the type.
   * @param {number} lineNumber line number
   * @param {string} type ol, ul
   * @private
   */
  ;

  _proto._changeToList = function _changeToList(lineNumber, type) {
    var _this2 = this;

    if (this._isListLine(lineNumber)) {
      // If type is ol, need ordinal number.
      this._changeSameDepthList(lineNumber, type === 'ol' ? function (lineNum, ordinalNumber) {
        _this2._replaceListTypeToOL(lineNum, ordinalNumber);
      } : function (lineNum) {
        _this2._replaceListTypeToUL(lineNum);
      });
    } else {
      this._replaceLineText(type === 'ol' ? this._calculateOrdinalNumber(lineNumber) + ". " : '* ', lineNumber);
    }
  }
  /**
   * change to task list according
   * @param {number} lineNumber line number
   * @private
   */
  ;

  _proto._changeToTask = function _changeToTask(lineNumber) {
    if (FIND_TASK_LIST_RX.exec(this.doc.getLine(lineNumber))) {
      this._replaceLineTextByRegexp(lineNumber, TASK_SYNTAX_RX, '$1');
    } else if (this._isListLine(lineNumber)) {
      this._replaceLineTextByRegexp(lineNumber, LIST_SYNTAX_RX, '$1[ ] ');
    } else {
      this._replaceLineText('* [ ] ', lineNumber);
    }
  };

  _proto._getListDepth = function _getListDepth(lineNumber) {
    var depth = 0;
    var text = this.doc.getLine(lineNumber);

    if (text) {
      var mdNode = this.toastMark.findFirstNodeAtLine(lineNumber + 1);

      while (mdNode && mdNode.type !== 'document') {
        if (mdNode.type === 'list') {
          depth += 1;
        }

        mdNode = mdNode.parent;
      }
    }

    return depth;
  };

  _proto._findSameDepthList = function _findSameDepthList(listNumber, depth, isIncrease) {
    var lineCount = this.doc.lineCount();
    var result = [];
    var i = listNumber;
    var currentLineDepth;

    while (isIncrease ? i < lineCount - 1 : i > 0) {
      i = isIncrease ? i + 1 : i - 1;
      currentLineDepth = this._getListDepth(i);

      if (currentLineDepth === depth) {
        result.push(i);
      } else if (currentLineDepth < depth) {
        break;
      }
    }

    return result;
  }
  /**
   * Find Sampe depth list before and after the line number,
   * and then same depth lines change using replacer function
   * @param {number} lineNumber line number
   * @param {Function} replacer The function should be called with line numbers and ordinal number as arguments.
   * @private
   */
  ;

  _proto._changeSameDepthList = function _changeSameDepthList(lineNumber, replacer) {
    var depth = this._getListDepth(lineNumber);

    var backwardList = this._findSameDepthList(lineNumber, depth, false).reverse();

    var forwardList = this._findSameDepthList(lineNumber, depth, true);

    var sameDepthList = backwardList.concat([lineNumber]).concat(forwardList);
    sameDepthList.forEach(function (lineNum, i) {
      replacer(lineNum, i + 1);
    });
  }
  /**
   * Replace text using regular expression
   * @param {number} lineNumber Line number
   * @param {RegExp} regexp Regexp for find list syntax
   * @param {string} replacePattern Replacement string
   * @private
   */
  ;

  _proto._replaceLineTextByRegexp = function _replaceLineTextByRegexp(lineNumber, regexp, replacePattern) {
    var line = this.doc.getLine(lineNumber);
    var currentLineStart = {
      line: lineNumber,
      ch: 0
    };
    var currentLineEnd = {
      line: lineNumber,
      ch: line.length
    };
    line = line.replace(regexp, replacePattern);
    this.doc.replaceRange(line, currentLineStart, currentLineEnd);
  };

  _proto._replaceListTypeToUL = function _replaceListTypeToUL(lineNumber) {
    var lineText = this.doc.getLine(lineNumber);

    if (UL_TASK_SYNTAX_RX.exec(lineText)) {
      this._replaceLineTextByRegexp(lineNumber, UL_TASK_SYNTAX_RX, '$1 ');
    } else if (OL_SYNTAX_RX.exec(lineText)) {
      this._replaceLineTextByRegexp(lineNumber, OL_SYNTAX_RX, '* ');
    }
  };

  _proto._replaceListTypeToOL = function _replaceListTypeToOL(lineNumber, ordinalNumber) {
    var lineText = this.doc.getLine(lineNumber);

    if (FIND_UL_RX.exec(lineText) || FIND_OL_TASK_RX.exec(lineText)) {
      this._replaceLineTextByRegexp(lineNumber, LIST_OR_TASK_SYNTAX_RX, ordinalNumber + ". ");
    } else if (OL_SYNTAX_RX.exec(lineText)) {
      if (parseInt(RegExp.$1, 10) !== ordinalNumber) {
        this._replaceLineTextByRegexp(lineNumber, OL_SYNTAX_RX, ordinalNumber + ". ");
      }
    }
  }
  /**
   * The new list must have a blank line before and after.
   * @param {Array} newListLines lines that changed to list
   * @private
   */
  ;

  _proto._insertBlankLineForNewList = function _insertBlankLineForNewList(newListLines) {
    var length = newListLines.length;

    if (length) {
      var startLineNumber = newListLines[0];
      var endLineNumber = newListLines[length - 1];

      if (this._isNotBlankNotListLine(endLineNumber + 1)) {
        this.doc.replaceRange('\n', {
          line: endLineNumber,
          ch: this.doc.getLine(endLineNumber).length
        });
      }

      if (startLineNumber > 0 && this._isNotBlankNotListLine(startLineNumber - 1)) {
        this.doc.replaceRange('\n', {
          line: startLineNumber,
          ch: 0
        });
      }
    }
  };

  _proto._isNotBlankNotListLine = function _isNotBlankNotListLine(lineNumber) {
    return !!this.doc.getLine(lineNumber) && !this._isListLine(lineNumber);
  };

  return MdListManager;
}();

/* harmony default export */ var mdListManager = (MdListManager);
// CONCATENATED MODULE: ./src/js/componentManager.js
/**
 * @fileoverview Implements ComponentManager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Class ComponentManager
 * @param {MarkdownEditor|WysiwygEditor} editor - Editor instance
 * @ignore
 */
var ComponentManager = /*#__PURE__*/function () {
  function ComponentManager(editor) {
    /**
     * private
     * @type {object}
     * @private
     */
    this._managers = {};
    this._editor = editor;
  }
  /**
   * addManager
   * Add manager
   * @param {string|function} nameOrConstructor Manager name or constructor
   * @param {function} [ManagerConstructor] Constructor
   */


  var _proto = ComponentManager.prototype;

  _proto.addManager = function addManager(nameOrConstructor, ManagerConstructor) {
    if (!ManagerConstructor) {
      ManagerConstructor = nameOrConstructor;
      nameOrConstructor = null;
    }

    var instance = new ManagerConstructor(this._editor);
    this._managers[nameOrConstructor || instance.name] = instance;
  }
  /**
   * getManager
   * Get manager by manager name
   * @param {string} name Manager name
   * @returns {object} manager
   */
  ;

  _proto.getManager = function getManager(name) {
    return this._managers[name];
  }
  /**
   * Remove Manager.
   * @param {string} name - manager name
   */
  ;

  _proto.removeManager = function removeManager(name) {
    var manager = this.getManager(name);

    if (!manager) {
      return;
    }

    if (manager.destroy) {
      manager.destroy();
    }

    delete this._managers[name];
  };

  return ComponentManager;
}();

/* harmony default export */ var componentManager = (ComponentManager);
// CONCATENATED MODULE: ./src/js/mdTextObject.js
/**
 * @fileoverview Implements markdown textObject
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Class Markdown textObject
 * @param {MarkdownEditor} mde - MarkdownEditor instance
 * @param {object} range - range
 */
var MdTextObject = /*#__PURE__*/function () {
  function MdTextObject(mde, range) {
    this._mde = mde;
    this.setRange(range || mde.getRange());
  }
  /**
   * Set start
   * @param {object} rangeStart Start of range
   * @private
   */


  var _proto = MdTextObject.prototype;

  _proto._setStart = function _setStart(rangeStart) {
    this._start = rangeStart;
  }
  /**
   * Set end
   * @param {object} rangeEnd End of range
   * @private
   */
  ;

  _proto._setEnd = function _setEnd(rangeEnd) {
    this._end = rangeEnd;
  }
  /**
   * Set range to given range
   * @param {object} range Range object
   */
  ;

  _proto.setRange = function setRange(range) {
    this._setStart(range.start);

    this._setEnd(range.end);
  }
  /**
   * Set start to end
   * @param {object} range Range object
   */
  ;

  _proto.setEndBeforeRange = function setEndBeforeRange(range) {
    this._setEnd(range.start);
  }
  /**
   * Expand startOffset by 1
   */
  ;

  _proto.expandStartOffset = function expandStartOffset() {
    var start = this._start;

    if (start.ch !== 0) {
      start.ch -= 1;
    }
  }
  /**
   * Expand endOffset by 1
   */
  ;

  _proto.expandEndOffset = function expandEndOffset() {
    var end = this._end;

    if (end.ch < this._mde.getEditor().getDoc().getLine(end.line).length) {
      end.ch += 1;
    }
  }
  /**
   * Get current selection's text content
   * @returns {{start: {line: number, ch: number}, end: {line: number, ch: number}}}
   */
  ;

  _proto.getTextContent = function getTextContent() {
    return this._mde.getEditor().getRange(this._start, this._end);
  }
  /**
   * Replace current selection's content with given text content
   * @param {string} content Replacement content
   */
  ;

  _proto.replaceContent = function replaceContent(content) {
    this._mde.getEditor().replaceRange(content, this._start, this._end, '+input');
  }
  /**
   * Delete current selection's content
   */
  ;

  _proto.deleteContent = function deleteContent() {
    this._mde.getEditor().replaceRange('', this._start, this._end, '+delete');
  }
  /**
   * peek StartBeforeOffset
   * @param {number} offset Offset
   * @returns {{start: {line: number, ch: number}, end: {line: number, ch: number}}}
   */
  ;

  _proto.peekStartBeforeOffset = function peekStartBeforeOffset(offset) {
    var peekStart = {
      line: this._start.line,
      ch: Math.max(this._start.ch - offset, 0)
    };
    return this._mde.getEditor().getRange(peekStart, this._start);
  };

  return MdTextObject;
}();

/* harmony default export */ var mdTextObject = (MdTextObject);
// EXTERNAL MODULE: ./src/js/utils/markdown.js
var markdown = __webpack_require__(2);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/type/isFunction.js
var isFunction = __webpack_require__(27);
var isFunction_default = /*#__PURE__*/__webpack_require__.n(isFunction);

// CONCATENATED MODULE: ./src/js/markTextHelper.js
function markTextHelper_extends() { markTextHelper_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return markTextHelper_extends.apply(this, arguments); }




var CLS_PREFIX = 'tui-md-';
var classNameMap = applyClsToValue({
  DELIM: 'delimiter',
  META: 'meta',
  TEXT: 'marked-text',
  THEMATIC_BREAK: 'thematic-break',
  CODE_BLOCK: 'code-block',
  TABLE: 'table',
  HTML: 'html'
});
var delimSize = {
  strong: 2,
  emph: 1,
  strike: 2
};

function cls() {
  for (var _len = arguments.length, names = new Array(_len), _key = 0; _key < _len; _key++) {
    names[_key] = arguments[_key];
  }

  return names.map(function (className) {
    return "" + CLS_PREFIX + className;
  }).join(' ');
}

function applyClsToValue(obj) {
  forEachOwnProperties_default()(obj, function (value, key) {
    obj[key] = cls(value);
  });
  return obj;
}

function markTextHelper_markInfo(start, end, className) {
  return {
    start: start,
    end: end,
    className: className
  };
}

function heading(_ref, start, end) {
  var level = _ref.level,
      headingType = _ref.headingType;
  var marks = [markTextHelper_markInfo(start, end, cls('heading', "heading" + level))];

  if (headingType === 'atx') {
    marks.push(markTextHelper_markInfo(start, Object(markdown["a" /* addChPos */])(start, level), classNameMap.DELIM));
  } else {
    marks.push(markTextHelper_markInfo(Object(markdown["m" /* setChPos */])(end, 0), end, classNameMap.DELIM + " setext"));
  }

  return {
    marks: marks
  };
}

function emphasisAndStrikethrough(_ref2, start, end) {
  var type = _ref2.type;
  return {
    marks: [markTextHelper_markInfo(start, end, cls("" + type)), markTextHelper_markInfo(start, Object(markdown["a" /* addChPos */])(start, delimSize[type]), classNameMap.DELIM), markTextHelper_markInfo(Object(markdown["a" /* addChPos */])(end, -delimSize[type]), end, classNameMap.DELIM)]
  };
}

function markLink(start, end, linkTextStart, lastChildCh) {
  return [markTextHelper_markInfo(start, end, cls('link')), markTextHelper_markInfo(linkTextStart, Object(markdown["m" /* setChPos */])(end, lastChildCh), cls('link-desc')), markTextHelper_markInfo(Object(markdown["m" /* setChPos */])(start, linkTextStart.ch + 1), Object(markdown["m" /* setChPos */])(end, lastChildCh - 1), classNameMap.TEXT), markTextHelper_markInfo(Object(markdown["m" /* setChPos */])(end, lastChildCh), end, cls('link-url')), markTextHelper_markInfo(Object(markdown["m" /* setChPos */])(end, lastChildCh + 1), Object(markdown["a" /* addChPos */])(end, -1), classNameMap.TEXT)];
}

function markTextHelper_image(_ref3, start, end) {
  var lastChild = _ref3.lastChild;
  var lastChildCh = lastChild ? Object(markdown["c" /* getMdEndCh */])(lastChild) + 1 : 3; // 3: length of '![]'

  var linkTextEnd = Object(markdown["a" /* addChPos */])(start, 1);
  return {
    marks: [markTextHelper_markInfo(start, linkTextEnd, classNameMap.META)].concat(markLink(start, end, linkTextEnd, lastChildCh))
  };
}

function markTextHelper_link(_ref4, start, end) {
  var lastChild = _ref4.lastChild,
      extendedAutolink = _ref4.extendedAutolink;
  var lastChildCh = lastChild ? Object(markdown["c" /* getMdEndCh */])(lastChild) + 1 : 2; // 2: length of '[]'

  var marks = extendedAutolink ? [markTextHelper_markInfo(start, end, cls('link', 'link-desc') + " " + classNameMap.TEXT)] : markLink(start, end, start, lastChildCh);
  return {
    marks: marks
  };
}

function markTextHelper_code(_ref5, start, end) {
  var tickCount = _ref5.tickCount;
  var openDelimEnd = Object(markdown["a" /* addChPos */])(start, tickCount);
  var closeDelimStart = Object(markdown["a" /* addChPos */])(end, -tickCount);
  return {
    marks: [markTextHelper_markInfo(start, end, cls('code')), markTextHelper_markInfo(start, openDelimEnd, classNameMap.DELIM + " start"), markTextHelper_markInfo(openDelimEnd, closeDelimStart, classNameMap.TEXT), markTextHelper_markInfo(closeDelimStart, end, classNameMap.DELIM + " end")]
  };
}

function markTextHelper_codeBlock(node, start, end, endLine) {
  var fenceOffset = node.fenceOffset,
      fenceLength = node.fenceLength,
      fenceChar = node.fenceChar,
      info = node.info,
      infoPadding = node.infoPadding,
      parent = node.parent;
  var fenceEnd = fenceOffset + fenceLength;
  var marks = [markTextHelper_markInfo(Object(markdown["m" /* setChPos */])(start, 0), end, classNameMap.CODE_BLOCK)];

  if (fenceChar) {
    marks.push(markTextHelper_markInfo(start, Object(markdown["a" /* addChPos */])(start, fenceEnd), classNameMap.DELIM));
  }

  if (info) {
    marks.push(markTextHelper_markInfo(Object(markdown["m" /* setChPos */])(start, fenceEnd), Object(markdown["m" /* setChPos */])(start, fenceEnd + infoPadding + info.length), classNameMap.META));
  }

  var codeBlockEnd = "^(\\s{0,3})(" + fenceChar + "{" + fenceLength + ",})";
  var CLOSED_RX = new RegExp(codeBlockEnd);

  if (CLOSED_RX.test(endLine)) {
    marks.push(markTextHelper_markInfo(Object(markdown["m" /* setChPos */])(end, 0), end, classNameMap.DELIM));
  }

  var lineBackground = parent.type !== 'item' && parent.type !== 'blockQuote' ? {
    start: start.line,
    end: end.line,
    className: classNameMap.CODE_BLOCK
  } : null;
  return {
    marks: marks,
    lineBackground: markTextHelper_extends({}, lineBackground)
  };
}

function markListItemChildren(node, className) {
  var marks = [];

  while (node) {
    var _node = node,
        type = _node.type;

    if (type === 'paragraph' || type === 'codeBlock') {
      marks.push(markTextHelper_markInfo({
        line: Object(markdown["f" /* getMdStartLine */])(node) - 1,
        ch: Object(markdown["e" /* getMdStartCh */])(node) - 1
      }, {
        line: Object(markdown["d" /* getMdEndLine */])(node) - 1,
        ch: Object(markdown["c" /* getMdEndCh */])(node)
      }, className));
    }

    node = node.next;
  }

  return marks;
}

function markParagraphInBlockQuote(node) {
  var marks = [];

  while (node) {
    marks.push(markTextHelper_markInfo({
      line: Object(markdown["f" /* getMdStartLine */])(node) - 1,
      ch: Object(markdown["e" /* getMdStartCh */])(node) - 1
    }, {
      line: Object(markdown["d" /* getMdEndLine */])(node) - 1,
      ch: Object(markdown["c" /* getMdEndCh */])(node)
    }, classNameMap.TEXT));
    node = node.next;
  }

  return marks;
}

function blockQuote(node, start, end) {
  var marks = node.parent && node.parent.type !== 'blockQuote' ? [markTextHelper_markInfo(start, end, cls('block-quote'))] : [];

  if (node.firstChild) {
    var childMarks = [];

    if (node.firstChild.type === 'paragraph') {
      childMarks = markParagraphInBlockQuote(node.firstChild.firstChild, classNameMap.TEXT);
    } else if (node.firstChild.type === 'list') {
      childMarks = markListItemChildren(node.firstChild, classNameMap.TEXT);
    }

    marks = [].concat(marks, childMarks);
  }

  return {
    marks: marks
  };
}

function getClassNameOfListItem(node) {
  var depth = 0;

  while (node.parent.parent && node.parent.parent.type === 'item') {
    node = node.parent.parent;
    depth += 1;
  }

  var newClassName = ['list-item-odd', 'list-item-even'][depth % 2]; // @TODO remove it in the next major version
  // these class names are for the legacy style 'old.css'

  var oldClassName = ['fisrt', 'second', 'third'][depth % 3];
  return cls('list-item', "" + newClassName) + " " + oldClassName;
}

function markTextHelper_item(node, start) {
  var itemClassName = getClassNameOfListItem(node);
  var _node$listData = node.listData,
      padding = _node$listData.padding,
      task = _node$listData.task;
  return {
    marks: [markTextHelper_markInfo(start, Object(markdown["a" /* addChPos */])(start, padding), itemClassName + " " + cls('list-item-bullet'))].concat(task ? [markTextHelper_markInfo(Object(markdown["a" /* addChPos */])(start, padding), Object(markdown["a" /* addChPos */])(start, padding + 3), itemClassName + " " + classNameMap.DELIM), markTextHelper_markInfo(Object(markdown["a" /* addChPos */])(start, padding + 1), Object(markdown["a" /* addChPos */])(start, padding + 2), classNameMap.META)] : [], markListItemChildren(node.firstChild, itemClassName + " " + classNameMap.TEXT))
  };
}

var markNodeFuncMap = {
  heading: heading,
  strong: emphasisAndStrikethrough,
  emph: emphasisAndStrikethrough,
  strike: emphasisAndStrikethrough,
  link: markTextHelper_link,
  image: markTextHelper_image,
  code: markTextHelper_code,
  codeBlock: markTextHelper_codeBlock,
  blockQuote: blockQuote,
  item: markTextHelper_item
};
var simpleMarkClassNameMap = {
  thematicBreak: classNameMap.THEMATIC_BREAK,
  table: classNameMap.TABLE,
  tableCell: classNameMap.TEXT,
  htmlInline: classNameMap.HTML
};
/**
 * Gets mark information to the markdown node.
 * @param {Object} node - node returned from ToastMark
 * @param {Object} start - start node's data
 * @param {Object} end - end node's data
 * @param {Object} endLine - end line's data
 * @returns {?Object} mark information
 * @ignore
 */

function getMarkInfo(node, start, end, endLine) {
  var type = node.type;

  if (isFunction_default()(markNodeFuncMap[type])) {
    return markNodeFuncMap[type](node, start, end, endLine);
  }

  if (simpleMarkClassNameMap[type]) {
    return {
      marks: [markTextHelper_markInfo(start, end, simpleMarkClassNameMap[type])]
    };
  }

  return null;
}
// CONCATENATED MODULE: ./src/js/markdownEditor.js
function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } it = o[Symbol.iterator](); return it.next.bind(it); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function markdownEditor_extends() { markdownEditor_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return markdownEditor_extends.apply(this, arguments); }

/**
 * @fileoverview Implements markdown editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */








var markdownEditor_keyMapper = keyMapper.getSharedInstance();
var defaultToolbarState = {
  strong: false,
  emph: false,
  strike: false,
  thematicBreak: false,
  blockQuote: false,
  code: false,
  codeBlock: false,
  list: false,
  taskList: false,
  orderedList: false,
  heading: false,
  table: false
};

function getToolbarStateType(_ref) {
  var type = _ref.type,
      listData = _ref.listData;

  if (type === 'list' || type === 'item') {
    if (listData.task) {
      return 'taskList';
    }

    return listData.type === 'ordered' ? 'orderedList' : 'list';
  }

  if (type.indexOf('table') !== -1) {
    return 'table';
  }

  return type;
}

function getToolbarState(targetNode, ch, mdLine, mdCh) {
  var state = markdownEditor_extends({}, defaultToolbarState);

  var listEnabled = false;
  Object(markdown["n" /* traverseParentNodes */])(targetNode, function (mdNode) {
    var type = getToolbarStateType(mdNode);

    if (!isBoolean_default()(state[type])) {
      return;
    }

    if (type === 'list' || type === 'orderedList') {
      if (!listEnabled) {
        state[type] = true;
        listEnabled = true;
      }
    } else {
      state[type] = true;
    }
  }); // if position is matched to start, end position of inline node, highlighting is ignored

  if (Object(markdown["k" /* isStyledTextNode */])(targetNode) && (mdCh === ch && Object(markdown["d" /* getMdEndLine */])(targetNode) === mdLine || mdCh === Object(markdown["c" /* getMdEndCh */])(targetNode) + 1 && mdLine === Object(markdown["d" /* getMdEndLine */])(targetNode) || mdCh === Object(markdown["e" /* getMdStartCh */])(targetNode) && mdLine === Object(markdown["f" /* getMdStartLine */])(targetNode))) {
    state[targetNode.type] = false;
  }

  return state;
}
/**
 * Return whether state changed or not
 * @param {object} previousState - Previous state
 * @param {object} currentState - Current state
 * @returns {boolean} - changed state
 * @private
 */


function isToolbarStateChanged(previousState, currentState) {
  if (!previousState && !currentState) {
    return false;
  }

  if (!previousState && currentState || previousState && !currentState) {
    return true;
  }

  return Object.keys(currentState).some(function (type) {
    return previousState[type] !== currentState[type];
  });
}

var ATTR_NAME_MARK = 'data-tui-mark';
var TASK_MARKER_KEY_RX = /x|backspace/i;
/**
 * Class MarkdownEditor
 * @param {HTMLElement} el - container element
 * @param {EventManager} eventManager - event manager
 * @param {Object} options - options of editor
 */

var markdownEditor_MarkdownEditor = /*#__PURE__*/function (_CodeMirrorExt) {
  _inheritsLoose(MarkdownEditor, _CodeMirrorExt);

  function MarkdownEditor(el, eventManager, toastMark, options) {
    var _this;

    _this = _CodeMirrorExt.call(this, el, {
      dragDrop: true,
      allowDropFileTypes: ['image'],
      extraKeys: {
        Enter: function Enter() {
          return _this.eventManager.emit('command', 'AddLine');
        },
        Tab: function Tab() {
          return _this.eventManager.emit('command', 'MoveNextCursorOrIndent');
        },
        'Shift-Tab': function ShiftTab() {
          return _this.eventManager.emit('command', 'MovePrevCursorOrOutdent');
        },
        'Shift-Ctrl-X': function ShiftCtrlX() {
          return _this.eventManager.emit('command', 'ToggleTaskMarker');
        }
      },
      viewportMargin: options && options.height === 'auto' ? Infinity : 10
    }) || this;
    _this.eventManager = eventManager;
    _this.componentManager = new componentManager(_assertThisInitialized(_this));
    _this.toastMark = toastMark;

    _this.componentManager.addManager(mdListManager);
    /**
     * latest state info
     * @type {object}
     * @private
     */


    _this._latestState = null;
    /**
     * map of marked lines
     * @type {Object.<number, boolean}
     * @private
     */

    _this._markedLines = {};

    _this._initEvent();

    return _this;
  }
  /**
   * _initEvent
   * Initialize EventManager event handler
   * @private
   */


  var _proto = MarkdownEditor.prototype;

  _proto._initEvent = function _initEvent() {
    var _this2 = this;

    this.cm.getWrapperElement().addEventListener('click', function () {
      _this2.eventManager.emit('click', {
        source: 'markdown'
      });
    });
    this.cm.on('beforeChange', function (cm, ev) {
      if (ev.origin === 'paste') {
        _this2.eventManager.emit('pasteBefore', {
          source: 'markdown',
          data: ev
        });
      }
    });
    this.cm.on('change', function (cm, cmEvent) {
      _this2._refreshCodeMirrorMarks(cmEvent);

      _this2._emitMarkdownEditorChangeEvent(cmEvent);
    });
    this.cm.on('focus', function () {
      _this2.eventManager.emit('focus', {
        source: 'markdown'
      });
    });
    this.cm.on('blur', function () {
      _this2.eventManager.emit('blur', {
        source: 'markdown'
      });
    });
    this.cm.on('scroll', function (cm, eventData) {
      _this2.eventManager.emit('scroll', {
        source: 'markdown',
        data: eventData
      });
    });
    this.cm.on('keydown', function (cm, keyboardEvent) {
      _this2.eventManager.emit('keydown', {
        source: 'markdown',
        data: keyboardEvent
      });

      _this2.eventManager.emit('keyMap', {
        source: 'markdown',
        keyMap: markdownEditor_keyMapper.convert(keyboardEvent),
        data: keyboardEvent
      });
    });
    this.cm.on('keyup', function (cm, keyboardEvent) {
      _this2.eventManager.emit('keyup', {
        source: 'markdown',
        data: keyboardEvent
      });

      var key = keyboardEvent.key;

      if (TASK_MARKER_KEY_RX.test(key)) {
        _this2.eventManager.emit('command', 'ChangeTaskMarker');
      }
    });
    this.cm.on('copy', function (cm, ev) {
      _this2.eventManager.emit('copy', {
        source: 'markdown',
        data: ev
      });
    });
    this.cm.on('cut', function (cm, ev) {
      _this2.eventManager.emit('cut', {
        source: 'markdown',
        data: ev
      });
    });
    this.cm.on('paste', function (cm, clipboardEvent) {
      _this2.eventManager.emit('paste', {
        source: 'markdown',
        data: clipboardEvent
      });
    });
    this.cm.on('drop', function (cm, eventData) {
      eventData.preventDefault();

      _this2.eventManager.emit('drop', {
        source: 'markdown',
        data: eventData
      });
    });
    this.cm.on('cursorActivity', function () {
      return _this2._onChangeCursorActivity();
    });
  }
  /**
   * Set Editor value
   * @param {string} markdown - Markdown syntax text
   * @param {boolean} [cursorToEnd=true] - move cursor to contents end
   * @override
   */
  ;

  _proto.setValue = function setValue(markdown, cursorToEnd) {
    _CodeMirrorExt.prototype.setValue.call(this, markdown, cursorToEnd);
  }
  /**
   * Get text object of current range
   * @param {{start, end}} range Range object of each editor
   * @returns {MdTextObject}
   */
  ;

  _proto.getTextObject = function getTextObject(range) {
    return new mdTextObject(this, range);
  }
  /**
   * Emit contentChangedFromMarkdown event
   * @param {event} e - Event object
   * @private
   */
  ;

  _proto._emitMarkdownEditorContentChangedEvent = function _emitMarkdownEditorContentChangedEvent(eventObj) {
    this.eventManager.emit('contentChangedFromMarkdown', eventObj);
  }
  /**
   * Emit changeEvent
   * @param {event} e - Event object
   * @private
   */
  ;

  _proto._emitMarkdownEditorChangeEvent = function _emitMarkdownEditorChangeEvent(e) {
    if (e.origin !== 'setValue') {
      var eventObj = {
        source: 'markdown'
      };
      this.eventManager.emit('changeFromMarkdown', eventObj);
      this.eventManager.emit('change', eventObj);
    }
  };

  _proto._refreshCodeMirrorMarks = function _refreshCodeMirrorMarks(e) {
    var _this3 = this;

    var from = e.from,
        to = e.to,
        text = e.text;
    var changed = this.toastMark.editMarkdown([from.line + 1, from.ch + 1], [to.line + 1, to.ch + 1], text.join('\n'));

    this._emitMarkdownEditorContentChangedEvent(changed);

    if (!changed.length) {
      return;
    }

    changed.forEach(function (editResult) {
      return _this3._markNodes(editResult);
    });
  };

  _proto._markNodes = function _markNodes(editResult) {
    var nodes = editResult.nodes,
        removedNodeRange = editResult.removedNodeRange;

    if (removedNodeRange) {
      this._removeBackgroundOfLines(removedNodeRange);
    }

    if (nodes.length) {
      var _nodes$0$sourcepos = nodes[0].sourcepos,
          editFromPos = _nodes$0$sourcepos[0];
      var _nodes$sourcepos = nodes[nodes.length - 1].sourcepos,
          editToPos = _nodes$sourcepos[1];
      var editFrom = {
        line: editFromPos[0] - 1,
        ch: editFromPos[1] - 1
      };
      var editTo = {
        line: editToPos[0] - 1,
        ch: editToPos[1]
      };
      var marks = this.cm.findMarks(editFrom, editTo);

      for (var _iterator = _createForOfIteratorHelperLoose(marks), _step; !(_step = _iterator()).done;) {
        var mark = _step.value;

        if (mark.attributes && ATTR_NAME_MARK in mark.attributes) {
          mark.clear();
        }
      }

      for (var _iterator2 = _createForOfIteratorHelperLoose(nodes), _step2; !(_step2 = _iterator2()).done;) {
        var parent = _step2.value;
        var walker = parent.walker();
        var event = walker.next();

        while (event) {
          var _event = event,
              node = _event.node,
              entering = _event.entering; // eslint-disable-next-line max-depth

          if (entering) {
            this._markNode(node);
          }

          event = walker.next();
        }
      }
    }
  };

  _proto._removeBackgroundOfLines = function _removeBackgroundOfLines(removedNodeRange) {
    var _removedNodeRange$lin = removedNodeRange.line,
        startLine = _removedNodeRange$lin[0],
        endLine = _removedNodeRange$lin[1];

    for (var index = startLine; index <= endLine; index += 1) {
      if (this._markedLines[index]) {
        this.cm.removeLineClass(index, 'background');
        this._markedLines[index] = false;
      }
    }
  };

  _proto._markCodeBlockBackground = function _markCodeBlockBackground(lineBackground) {
    var start = lineBackground.start,
        end = lineBackground.end,
        className = lineBackground.className;

    for (var index = start; index <= end; index += 1) {
      var lineClassName = className;

      if (index === start) {
        lineClassName += ' start';
      } else if (index === end) {
        lineClassName += ' end';
      }

      this.cm.addLineClass(index, 'background', lineClassName);
      this._markedLines[index] = true;
    }
  };

  _proto._markNode = function _markNode(node) {
    var _this4 = this;

    var from = {
      line: Object(markdown["f" /* getMdStartLine */])(node) - 1,
      ch: Object(markdown["e" /* getMdStartCh */])(node) - 1
    };
    var to = {
      line: Object(markdown["d" /* getMdEndLine */])(node) - 1,
      ch: Object(markdown["c" /* getMdEndCh */])(node)
    };
    var markInfo = getMarkInfo(node, from, to, this.cm.getLine(to.line));

    if (markInfo) {
      var _markInfo$marks = markInfo.marks,
          marks = _markInfo$marks === void 0 ? [] : _markInfo$marks,
          _markInfo$lineBackgro = markInfo.lineBackground,
          lineBackground = _markInfo$lineBackgro === void 0 ? {} : _markInfo$lineBackgro;
      marks.forEach(function (_ref2) {
        var _attributes;

        var start = _ref2.start,
            end = _ref2.end,
            className = _ref2.className;
        var attributes = (_attributes = {}, _attributes[ATTR_NAME_MARK] = '', _attributes);

        _this4.cm.markText(start, end, {
          className: className,
          attributes: attributes
        });
      });

      this._markCodeBlockBackground(lineBackground);
    }
  };

  _proto._setToolbarState = function _setToolbarState(state) {
    if (isToolbarStateChanged(this._latestState, state)) {
      var eventObj = markdownEditor_extends({
        source: 'markdown'
      }, state ? state : defaultToolbarState);

      this.eventManager.emit('stateChange', eventObj);
    }

    this._latestState = state;
  };

  _proto._onChangeCursorActivity = function _onChangeCursorActivity() {
    var _this$cm$getCursor = this.cm.getCursor(),
        line = _this$cm$getCursor.line,
        ch = _this$cm$getCursor.ch;

    var mdLine = line + 1;
    var mdCh = this.cm.getLine(line).length === ch ? ch : ch + 1;
    var mdNode = this.toastMark.findNodeAtPosition([mdLine, mdCh]);
    var state = null; // To prevent to execute codemirror command in codeblock

    this.cm.state.isCursorInCodeBlock = mdNode && mdNode.type === 'codeBlock';
    this.eventManager.emit('cursorActivity', {
      source: 'markdown',
      cursor: {
        line: line,
        ch: ch
      },
      markdownNode: mdNode
    });

    if (mdNode) {
      mdNode = mdNode.type === 'text' ? mdNode.parent : mdNode;
      state = getToolbarState(mdNode, ch, mdLine, mdCh);
    }

    this._setToolbarState(state);
  }
  /**
   * latestState reset
   */
  ;

  _proto.resetState = function resetState() {
    this._latestState = null;
  };

  _proto.getToastMark = function getToastMark() {
    return this.toastMark;
  }
  /**
   * MarkdownEditor factory method
   * @param {HTMLElement} el - Container element for editor
   * @param {EventManager} eventManager - EventManager instance
   * @param {Object} options - options of editor
   * @returns {MarkdownEditor} - MarkdownEditor
   * @ignore
   */
  ;

  MarkdownEditor.factory = function factory(el, eventManager, toastMark, options) {
    return new MarkdownEditor(el, eventManager, toastMark, options);
  };

  return MarkdownEditor;
}(codeMirrorExt);

/* harmony default export */ var markdownEditor = (markdownEditor_MarkdownEditor);
// EXTERNAL MODULE: ./src/js/mdPreview.js
var mdPreview = __webpack_require__(35);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/collection/toArray.js
var toArray = __webpack_require__(3);
var toArray_default = /*#__PURE__*/__webpack_require__.n(toArray);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/collection/forEachArray.js
var forEachArray = __webpack_require__(21);
var forEachArray_default = /*#__PURE__*/__webpack_require__.n(forEachArray);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/type/isUndefined.js
var isUndefined = __webpack_require__(8);
var isUndefined_default = /*#__PURE__*/__webpack_require__.n(isUndefined);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/type/isArray.js
var isArray = __webpack_require__(17);
var isArray_default = /*#__PURE__*/__webpack_require__.n(isArray);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/browser/browser.js
var browser = __webpack_require__(11);
var browser_default = /*#__PURE__*/__webpack_require__.n(browser);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/tricks/debounce.js
var debounce = __webpack_require__(47);
var debounce_default = /*#__PURE__*/__webpack_require__.n(debounce);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/domEvent/on.js
var domEvent_on = __webpack_require__(19);
var on_default = /*#__PURE__*/__webpack_require__.n(domEvent_on);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/domEvent/off.js
var domEvent_off = __webpack_require__(20);
var off_default = /*#__PURE__*/__webpack_require__.n(domEvent_off);

// EXTERNAL MODULE: ./src/js/utils/dom.js
var dom = __webpack_require__(0);

// CONCATENATED MODULE: ./src/js/utils/wwPasteMsoList.js

var MSO_CLASS_NAME_LIST_PARA = 'p.MsoListParagraph';
var MSO_CLASS_NAME_LIST_RX = /MsoListParagraph/;
var MSO_STYLE_PREFIX_RX = /style=(.|\n)*mso-/;
var MSO_STYLE_LIST_RX = /mso-list:(.*)/;
var MSO_TAG_NAME_RX = /O:P/;
var UNORDERED_LIST_BULLET_RX = /^(n|u|l)/;
/**
 * Whether html string is copied from ms office or not
 * ms office use specific css attributes with 'mso-' prefix
 * @param {string} html - html string
 * @returns {boolean}
 */

function isFromMso(html) {
  return MSO_STYLE_PREFIX_RX.test(html);
}

function getListItemContents(para) {
  var removedNodes = [];
  var walker = document.createTreeWalker(para, 1, null, false);

  while (walker.nextNode()) {
    var node = walker.currentNode;

    if (dom["a" /* default */].isElemNode(node)) {
      var outerHTML = node.outerHTML,
          textContent = node.textContent;
      var msoSpan = MSO_STYLE_PREFIX_RX.test(outerHTML);
      var bulletSpan = MSO_STYLE_LIST_RX.test(outerHTML);

      if (msoSpan && !bulletSpan && textContent) {
        removedNodes.push([node, true]);
      } else if (MSO_TAG_NAME_RX.test(node.nodeName) || msoSpan && !textContent || bulletSpan) {
        removedNodes.push([node, false]);
      }
    }
  }

  removedNodes.forEach(function (_ref) {
    var node = _ref[0],
        isUnwrap = _ref[1];

    if (isUnwrap) {
      dom["a" /* default */].unwrap(node);
    } else {
      dom["a" /* default */].remove(node);
    }
  });
  return para.innerHTML.trim();
}

function createListItemDataFromParagraph(para, index) {
  var styleAttr = para.getAttribute('style');

  var _styleAttr$match = styleAttr.match(MSO_STYLE_LIST_RX),
      listItemInfo = _styleAttr$match[1];

  var _listItemInfo$trim$sp = listItemInfo.trim().split(' '),
      levelStr = _listItemInfo$trim$sp[1];

  var level = parseInt(levelStr.replace('level', ''), 10);
  var unorderedListItem = UNORDERED_LIST_BULLET_RX.test(para.textContent);
  return {
    id: index,
    level: level,
    prev: null,
    parent: null,
    children: [],
    unorderedListItem: unorderedListItem,
    contents: getListItemContents(para)
  };
}

function addListItemDetailData(data, prevData) {
  if (prevData.level < data.level) {
    prevData.children.push(data);
    data.parent = prevData;
  } else {
    while (prevData) {
      if (prevData.level === data.level) {
        break;
      }

      prevData = prevData.parent;
    }

    if (prevData) {
      data.prev = prevData;
      data.parent = prevData.parent;

      if (data.parent) {
        data.parent.children.push(data);
      }
    }
  }
}

function createListData(paras) {
  var listData = [];
  paras.forEach(function (para, index) {
    var prevListItemData = listData[index - 1];
    var listItemData = createListItemDataFromParagraph(para, index);

    if (prevListItemData) {
      addListItemDetailData(listItemData, prevListItemData);
    }

    listData.push(listItemData);
  });
  return listData;
}

function makeList(listData) {
  var listTagName = listData[0].unorderedListItem ? 'ul' : 'ol';
  var list = document.createElement(listTagName);
  listData.forEach(function (data) {
    var children = data.children,
        contents = data.contents;
    var listItem = document.createElement('li');
    listItem.innerHTML = contents;
    list.appendChild(listItem);

    if (children.length) {
      list.appendChild(makeList(children));
    }
  });
  return list;
}

function makeListFromParagraphs(paras) {
  var listData = createListData(paras);
  var rootChildren = listData.filter(function (_ref2) {
    var parent = _ref2.parent;
    return !parent;
  });
  return makeList(rootChildren);
}

function isMsoListParagraphEnd(node) {
  while (node) {
    if (dom["a" /* default */].isElemNode(node)) {
      break;
    }

    node = node.nextSibling;
  }

  return node ? !MSO_CLASS_NAME_LIST_RX.test(node.className) : true;
}
/**
 * Convert pargraphs of ms office to standard list element
 * @param {HTMLElement} container - container element to convert to list
 */


function convertMsoParagraphsToList(container) {
  var paras = [];
  dom["a" /* default */].findAll(container, MSO_CLASS_NAME_LIST_PARA).forEach(function (para) {
    var msoListParaEnd = isMsoListParagraphEnd(para.nextSibling);
    paras.push(para);

    if (msoListParaEnd) {
      var list = makeListFromParagraphs(paras);
      var nextSibling = para.nextSibling;

      if (nextSibling) {
        dom["a" /* default */].insertBefore(list, nextSibling);
      } else {
        dom["a" /* default */].append(container, list);
      }

      paras = [];
    }

    dom["a" /* default */].remove(para);
  });
  return container;
}
// EXTERNAL MODULE: ./node_modules/tui-code-snippet/domUtil/matches.js
var matches = __webpack_require__(13);
var matches_default = /*#__PURE__*/__webpack_require__.n(matches);

// EXTERNAL MODULE: ./src/js/htmlSanitizer.js
var htmlSanitizer = __webpack_require__(23);

// CONCATENATED MODULE: ./src/js/wwPasteContentHelper.js
/**
 * @fileoverview Implements WwPasteContentHelper
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */







var DEFAULT_COLOR = 'rgb(34, 34, 34)';
/**
 * Class WwPasteContentHelper
 * @param {WysiwygEditor} wwe - wysiwygEditor instance
 * @ignore
 */

var wwPasteContentHelper_WwPasteContentHelper = /*#__PURE__*/function () {
  function WwPasteContentHelper(wwe) {
    this.wwe = wwe;
  }
  /**
   * Process paste data before paste
   * @param {HTMLElement} container - clipboard container
   */


  var _proto = WwPasteContentHelper.prototype;

  _proto.preparePaste = function preparePaste(container) {
    var range = this.wwe.getEditor().getSelection().cloneRange();
    var wwCodeblockManager = this.wwe.componentManager.getManager('codeblock');
    var firstBlockIsTaken = false;
    var tempContainer = document.createElement('div');
    var nodeName, node, isPastingList;

    this._pasteFirstAid(container);

    var childNodes = toArray_default()(container.childNodes);

    while (childNodes.length) {
      node = childNodes[0];
      nodeName = dom["a" /* default */].getNodeName(node);
      isPastingList = nodeName === 'LI' || nodeName === 'UL' || nodeName === 'OL';

      if (wwCodeblockManager.isInCodeBlock(range)) {
        dom["a" /* default */].append(tempContainer, wwCodeblockManager.prepareToPasteOnCodeblock(childNodes));
      } else if (isPastingList) {
        dom["a" /* default */].append(tempContainer, this._prepareToPasteList(childNodes, range, firstBlockIsTaken));
        firstBlockIsTaken = true;
      } else {
        dom["a" /* default */].append(tempContainer, childNodes.shift());
      }
    }

    container.innerHTML = tempContainer.innerHTML;
  }
  /**
   * Wrap orphan node(inline, text) with div element
   * @param {HTMLElement} container - clipboard container
   * @returns {DocumentFragment}
   * @private
   */
  ;

  _proto._wrapOrphanNodeWithDiv = function _wrapOrphanNodeWithDiv(container) {
    var tempContainer = document.createElement('div');
    var currentDiv;
    toArray_default()(container.childNodes).forEach(function (node) {
      var isTextNode = node.nodeType === 3;
      /* eslint-disable max-len */

      var isInlineNode = /^(SPAN|A|CODE|EM|I|STRONG|B|S|U|ABBR|ACRONYM|CITE|DFN|KBD|SAMP|VAR|BDO|Q|SUB|SUP)$/gi.test(node.tagName);
      var isBR = node.nodeName === 'BR';
      /* eslint-enable max-len */

      if (isTextNode || isInlineNode || isBR) {
        if (!currentDiv) {
          currentDiv = document.createElement('div');
          tempContainer.appendChild(currentDiv);
        }

        currentDiv.appendChild(node);

        if (isBR) {
          currentDiv = null;
        }
      } else {
        if (currentDiv && currentDiv.lastChild.tagName !== 'BR') {
          currentDiv.appendChild(document.createElement('br'));
        }

        currentDiv = null;
        tempContainer.appendChild(node);
      }
    });
    return tempContainer.innerHTML;
  }
  /**
   * Sanitize content of element
   * @param {HTMLElement} container - root element of content to sanitize
   * @private
   */
  ;

  _proto._sanitizeHtml = function _sanitizeHtml(container) {
    var sanitizer = this.wwe.getSanitizer();
    var html = Object(htmlSanitizer["a" /* default */])(container.innerHTML, true);

    if (sanitizer && sanitizer !== htmlSanitizer["a" /* default */]) {
      html = sanitizer(html);
    }

    container.innerHTML = html;
  }
  /**
   * Processing paste data after paste
   * @param {HTMLElement} container - clipboard container
   * @private
   */
  ;

  _proto._pasteFirstAid = function _pasteFirstAid(container) {
    var _this = this;

    this._sanitizeHtml(container);

    dom["a" /* default */].findAll(container, '*').forEach(function (node) {
      _this._removeStyles(node);
    });
    var blockTags = 'div, section, article, aside, nav, menus, p';

    this._unwrapIfNonBlockElementHasBr(container);

    this._unwrapNestedBlocks(container, blockTags);

    this._removeUnnecessaryBlocks(container, blockTags);

    container.innerHTML = this._wrapOrphanNodeWithDiv(container);

    this._preprocessPreElement(container);

    this._preprocessListElement(container);

    this._preprocessTableElement(container);

    toArray_default()(container.children).forEach(function (childNode) {
      if (dom["a" /* default */].getNodeName(childNode) === 'BR') {
        dom["a" /* default */].remove(childNode);
      }
    });
  };

  _proto._preprocessListElement = function _preprocessListElement(container) {
    var wwListManager = this.wwe.componentManager.getManager('list');
    container.innerHTML = wwListManager.convertToArbitraryNestingList(container.innerHTML);
  }
  /**
   * PRE tag formatting
   * @param {HTMLElement} container - clipboard container
   * @private
   */
  ;

  _proto._preprocessPreElement = function _preprocessPreElement(container) {
    var wwCodeblockManager = this.wwe.componentManager.getManager('codeblock');
    wwCodeblockManager.modifyCodeBlockForWysiwyg(container);
  }
  /**
   * Unwrap span children of document fragment with div element
   * @param {HTMLElement} container - clipboard container
   * @private
   */
  ;

  _proto._unwrapIfNonBlockElementHasBr = function _unwrapIfNonBlockElementHasBr(container) {
    var nonBlockElements = dom["a" /* default */].findAll(container, 'span, a, b, em, i, s');
    nonBlockElements.forEach(function (node) {
      var brChildren = dom["a" /* default */].children(node, 'br');

      if (brChildren.length && node.nodeName !== 'LI' && node.nodeName !== 'UL') {
        dom["a" /* default */].unwrap(node);
      }
    });
  }
  /**
   * Unwrap nested block elements
   * @param {HTMLElement} container - clipboard container
   * @param {string} blockTags - Tag names of block tag
   * @private
   */
  ;

  _proto._unwrapNestedBlocks = function _unwrapNestedBlocks(container, blockTags) {
    var leafElements = dom["a" /* default */].findAll(container, '*').filter(function (node) {
      return !matches_default()(node, 'b,s,i,em,code,span,hr') && !node.firstChild;
    });
    leafElements.forEach(function (node) {
      var leafElement = node.nodeName === 'BR' ? node.parentNode : node;

      while (dom["a" /* default */].parents(leafElement, blockTags).length) {
        var parent = dom["a" /* default */].parent(leafElement, blockTags);

        if (parent && parent !== container) {
          dom["a" /* default */].unwrap(parent);
        } else {
          leafElement = leafElement.parentElement;
        }
      }
    });
  }
  /**
   * Remove unnecessary block element in pasting data
   * @param {HTMLElement} container - clipboard container
   * @param {string} blockTags - Tag names of block tag
   * @private
   */
  ;

  _proto._removeUnnecessaryBlocks = function _removeUnnecessaryBlocks(container, blockTags) {
    dom["a" /* default */].findAll(container, blockTags).forEach(function (blockElement) {
      var tagName = blockElement.tagName;
      var isDivElement = tagName === 'DIV';
      var isInListItem = !!dom["a" /* default */].parent(blockElement, 'li');
      var isInBlockquote = !!dom["a" /* default */].parent(blockElement, 'blockquote');
      var hasBlockChildElement = !!dom["a" /* default */].children(blockElement, blockTags).length;

      if (isDivElement && (isInListItem || isInBlockquote || !hasBlockChildElement)) {
        return;
      }

      if (blockElement.lastChild && blockElement.lastChild.nodeName !== 'BR') {
        blockElement.appendChild(document.createElement('br'));
      }

      dom["a" /* default */].replaceWith(blockElement, blockElement.innerHTML);
    });
  }
  /**
   * Remove inline style
   * @param {Node} node Node for remove style attribute
   * @private
   */
  ;

  _proto._removeStyles = function _removeStyles(node) {
    var colorValue;

    if (dom["a" /* default */].getNodeName(node) !== 'SPAN') {
      node.removeAttribute('style');
    } else {
      // Most browser return computed color value even if without style attribute
      if (node.getAttribute('style')) {
        colorValue = node.style.color;
      }

      node.removeAttribute('style');

      if (colorValue && colorValue !== DEFAULT_COLOR) {
        css_default()(node, {
          color: colorValue
        });
      } else {
        dom["a" /* default */].unwrap(node);
      }
    }
  }
  /**
   * Processing before paste list
   * @param {Array.<HTMLElement>} nodes Pasting data
   * @param {object} rangeInfo Range information
   * @param {boolean} firstBlockIsTaken Whether first block element taken or not
   * @returns {DocumentFragment}
   * @private
   */
  ;

  _proto._prepareToPasteList = function _prepareToPasteList(nodes, rangeInfo, firstBlockIsTaken) {
    var nodeName = dom["a" /* default */].getNodeName(nodes[0]);
    var node = nodes.shift();
    var newFragment = this.wwe.getEditor().getDocument().createDocumentFragment(); // IE somethimes returns ul without li

    if (nodeName !== 'LI' && nodes.length && nodes[0].tagName === 'LI') {
      nodeName = 'LI';
      node = this._makeNodeAndAppend({
        tagName: nodeName
      }, node);
    } // pasting list into list, we should care indentation


    if (nodeName === 'OL' || nodeName === 'UL') {
      // ignore cursor if pasting data has block
      if (!firstBlockIsTaken && this.wwe.getEditor().hasFormat('LI')) {
        dom["a" /* default */].append(newFragment, this._wrapCurrentFormat(node));
      } else {
        newFragment.appendChild(node);
      }
    } else if (nodeName === 'LI') {
      // handle list group
      var listGroup = this.wwe.getEditor().getDocument().createDocumentFragment();
      listGroup.appendChild(node);

      while (nodes.length && nodes[0].tagName === 'LI') {
        listGroup.appendChild(nodes.shift());
      } // pasting list into list, we should care indentation
      // ignore cursor if pasting data has block


      if (!firstBlockIsTaken && this.wwe.getEditor().hasFormat('LI')) {
        dom["a" /* default */].append(newFragment, this._wrapCurrentFormat(listGroup));
      } else if (rangeInfo && (rangeInfo.commonAncestorName === 'UL' || rangeInfo.commonAncestorName === 'OL')) {
        dom["a" /* default */].append(newFragment, this._makeNodeAndAppend({
          tagName: rangeInfo.commonAncestorName
        }, listGroup)); // list from outside
      } else {
        dom["a" /* default */].append(newFragment, this._makeNodeAndAppend({
          tagName: 'UL'
        }, listGroup));
      }
    }

    return this._getResolvePastedListDepthToCurrentDepth(rangeInfo.startContainer, node, newFragment);
  }
  /**
   * Unwrap fragment first child for pasting node inline
   * @param {Node} node Pasting DocumentFragment
   * @returns {NodeList}
   * @private
   */
  ;

  _proto._unwrapFragmentFirstChildForPasteAsInline = function _unwrapFragmentFirstChildForPasteAsInline(node) {
    dom["a" /* default */].findAll(node, 'br').forEach(function (br) {
      return dom["a" /* default */].remove(br);
    });
    return node.childNodes;
  }
  /**
   * Wrap nodes with current format
   * @param {DocumentFragment} nodes P
   * @returns {HTMLElement}
   * @private
   */
  ;

  _proto._wrapCurrentFormat = function _wrapCurrentFormat(nodes) {
    var _this2 = this;

    var currentTagName; // expand to pasting area

    this._eachCurrentPath(function (path) {
      if (path.tagName !== 'DIV') {
        if (dom["a" /* default */].isElemNode(nodes)) {
          currentTagName = nodes.tagName;
        } else {
          currentTagName = nodes.firstChild.tagName;
        }

        if (path.tagName !== currentTagName) {
          nodes = _this2._makeNodeAndAppend(path, nodes);
        }
      }
    });

    return nodes;
  };

  _proto._eachCurrentPath = function _eachCurrentPath(iteratee) {
    var paths = dom["a" /* default */].getPath(this.wwe.getEditor().getSelection().startContainer, this.wwe.getBody());

    for (var i = paths.length - 1; i > -1; i -= 1) {
      iteratee(paths[i]);
    }
  }
  /** _makeNodeAndAppend
   * make node and append their own children
   * @param {HTMLElement} pathInfo HTMLElement to make
   * @param {HTMLElement} content Nodes to append
   * @returns {HTMLElement} node
   * @private
   */
  ;

  _proto._makeNodeAndAppend = function _makeNodeAndAppend(pathInfo, content) {
    var node = document.createElement("" + pathInfo.tagName);
    node.appendChild(content);

    if (pathInfo.id) {
      node.setAttribute('id', pathInfo.id);
    }

    if (pathInfo.className) {
      addClass_default()(node, pathInfo.className);
    }

    return node;
  }
  /**
   * Pasting table element pre-process
   * @param {HTMLElement} container - clipboard container
   * @private
   */
  ;

  _proto._preprocessTableElement = function _preprocessTableElement(container) {
    this._removeColgroup(container);

    this._completeTableIfNeed(container);

    this._updateTableIDClassName(container);
  }
  /**
   * Remove colgroup tag
   * @param {HTMLElement} container - clipboard container
   * @private
   **/
  ;

  _proto._removeColgroup = function _removeColgroup(container) {
    var colgroup = container.querySelector('colgroup');

    if (colgroup) {
      dom["a" /* default */].remove(colgroup);
    }
  }
  /**
   * Complete and append table to fragment
   * @param {HTMLElement} container - clipboard container
   * @private
   */
  ;

  _proto._completeTableIfNeed = function _completeTableIfNeed(container) {
    var tableManager = this.wwe.componentManager.getManager('table');
    var wrapperTr = tableManager.wrapDanglingTableCellsIntoTrIfNeed(container);

    if (wrapperTr) {
      dom["a" /* default */].append(container, wrapperTr);
    }

    var wrapperTbody = tableManager.wrapTrsIntoTbodyIfNeed(container);

    if (wrapperTbody) {
      dom["a" /* default */].append(container, wrapperTbody);
    }

    var wrapperTable = tableManager.wrapTheadAndTbodyIntoTableIfNeed(container);

    if (wrapperTable) {
      dom["a" /* default */].append(container, wrapperTable);
    }
  }
  /**
   * Update table ID class name in fragment
   * @param {HTMLElement} container - clipboard container
   * @private
   */
  ;

  _proto._updateTableIDClassName = function _updateTableIDClassName(container) {
    var tableManager = this.wwe.componentManager.getManager('table');
    var tables = dom["a" /* default */].findAll(container, 'table');
    tables.forEach(function (table) {
      var foundClassName = table.className.match(/.*\s*(te-content-table-\d+)\s*.*/);

      if (foundClassName) {
        removeClass_default()(table, foundClassName[0]);
      }
    });
    tables.forEach(function (table) {
      addClass_default()(table, tableManager.getTableIDClassName());
    });
  }
  /**
   * get the list resolved the depth to current list depth
   * @param {HTMLElement} currentEl - current list element
   * @param {HTMLElement} orgPastedNode - original pasted data
   * @param {DocumentFragment} fragment - preprocessed data
   * @returns {HTMLElement} resolved element
   * @private
   */
  ;

  _proto._getResolvePastedListDepthToCurrentDepth = function _getResolvePastedListDepthToCurrentDepth(currentEl, orgPastedNode, fragment) {
    var currentListDepth = this._getListDepth(currentEl);

    var continuousDepth = this._getContinuousDepth(orgPastedNode);

    fragment = this._getRemovedUnnecessaryListWrapper(fragment, orgPastedNode); // If the depth of the pasted data is greater than current depth, get child element for resolving the depth.
    // For example, If 2-depth list is pasted to 1-depth list element, 2-depth list should be changed to 1-depth.

    while (currentListDepth < continuousDepth) {
      if (fragment.firstChild.tagName !== 'UL' && fragment.firstChild.tagName !== 'OL') {
        break;
      }

      var childNodes = toArray_default()(fragment.childNodes);
      fragment = fragment.firstChild;
      /* eslint-disable no-loop-func */

      childNodes.filter(function (node) {
        return node !== fragment;
      }).forEach(function (node) {
        fragment.insertAdjacentElement('beforeend', node);
      });
      /* eslint-enable no-loop-func */

      continuousDepth -= 1;
    } // If the depth of the pasted data is less than current depth, wrap the list element for resolving the depth.
    // For example, If 1-depth list is pasted to 2-depth list element, 1-depth list should be changed to 2-depth.


    while (currentListDepth && currentListDepth > continuousDepth) {
      var rootList = fragment.firstChild.parentElement;
      var list = document.createElement(rootList.tagName);
      list.appendChild(rootList);
      fragment = list;
      continuousDepth += 1;
    }

    if (currentListDepth && !currentEl.textContent) {
      dom["a" /* default */].remove(currentEl);
    }

    return fragment;
  }
  /**
   * get the depth of the list item element
   * @param {HTMLElement} el - target element
   * @returns {number} depth
   * @private
   */
  ;

  _proto._getListDepth = function _getListDepth(el) {
    var depth = 0; // Since the list outside the editor can be found,
    // so make sure to traverse only the editor's container.

    var root = this.wwe.getBody();

    while (el && el !== root) {
      if (el.tagName === 'UL' || el.tagName === 'OL') {
        depth += 1;
      }

      el = el.parentNode;
    }

    return depth;
  }
  /**
   * get the continuous depth of the list.
   * the continuous depth of below example is 2
   *  <ul>
   *    <li>
   *      <ul>
   *        <li>...</li>
   *        <ul>...</ul>
   *      </ul>
   *    </li>
   *  </ul>
   *
   * @param {HTMLElement} el - target element
   * @returns {number} depth
   * @private
   */
  ;

  _proto._getContinuousDepth = function _getContinuousDepth(el) {
    var depth = 0;

    while (el && (el.tagName === 'UL' || el.tagName === 'OL')) {
      depth += 1;

      if (el.childNodes.length > 1) {
        break;
      }

      el = el.firstChild;
    }

    return depth;
  }
  /**
   * get the element which is removed unnecessay list wrapper element
   * @param {HTMLElement} el - target element
   * @param {HTMLElement} orgEl - target element
   * @returns {HTMLElement} el
   * @private
   */
  ;

  _proto._getRemovedUnnecessaryListWrapper = function _getRemovedUnnecessaryListWrapper(el, orgEl) {
    while (el.querySelectorAll('ul,ol').length > orgEl.querySelectorAll('ul,ol').length) {
      el = el.firstChild;
    }

    return el;
  };

  return WwPasteContentHelper;
}();

/* harmony default export */ var wwPasteContentHelper = (wwPasteContentHelper_WwPasteContentHelper);
// CONCATENATED MODULE: ./src/js/wwTablePasteHelper.js
/**
 * @fileoverview Paste helper when past to table
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */




/**
 * Class WwTablePasteHelper
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */

var wwTablePasteHelper_WwTablePasteHelper = /*#__PURE__*/function () {
  function WwTablePasteHelper(wwe) {
    this.wwe = wwe;
  }
  /**
   * Prossse paste clipboardEvent
   * @param {ClipboardEvent} ev - ClipboardEvent
   */


  var _proto = WwTablePasteHelper.prototype;

  _proto.pasteClipboard = function pasteClipboard(ev) {
    var cbData = ev.clipboardData || window.clipboardData;
    var items = cbData && cbData.items;

    if (items) {
      this._pasteClipboardItem(items);

      ev.preventDefault();
    } else {
      this._pasteClipboardUsingPasteArea();

      ev.squirePrevented = true;
    }
  }
  /**
   * ClipboardEvent is not supported in IE.
   * To get clipboard, create temporay element and then paste into that element.
   * After end of paste, can get clipboard from that temporary element.
   * @param {ClipboardEvent} ev - ClipboardEvent
   * @private
   */
  ;

  _proto._pasteClipboardUsingPasteArea = function _pasteClipboardUsingPasteArea() {
    var _this = this;

    var sq = this.wwe.getEditor();
    var range = sq.getSelection();
    var startContainer = range.startContainer,
        startOffset = range.startOffset,
        endContainer = range.endContainer,
        endOffset = range.endOffset;
    var pasteArea = document.createElement('div');
    var _document = document,
        body = _document.body;
    pasteArea.setAttribute('contenteditable', true);
    pasteArea.setAttribute('style', 'position:fixed; overflow:hidden; top:0; right:100%; width:1px; height:1px;');
    body.appendChild(pasteArea);
    range.selectNodeContents(pasteArea);
    sq.setSelection(range);
    setTimeout(function () {
      var clipboard = body.removeChild(pasteArea);
      range.setStart(startContainer, startOffset);
      range.setEnd(endContainer, endOffset);
      sq.focus();
      sq.setSelection(range);

      _this._pasteClipboardHtml(clipboard.innerHTML);
    });
  }
  /**
   * Paste items of clipboard data
   * @param {DataTransfer.items} items - items of clipboarddata
   * @private
   */
  ;

  _proto._pasteClipboardItem = function _pasteClipboardItem(items) {
    var _this2 = this;

    var textItem = null;
    var htmlItem = null;
    toArray_default()(items).forEach(function (item) {
      if (item.type === 'text/html') {
        htmlItem = item;
      } else if (item.type === 'text/plain') {
        textItem = item;
      }
    });

    if (htmlItem) {
      htmlItem.getAsString(function (html) {
        _this2._pasteClipboardHtml(html);
      });
    } else if (textItem) {
      textItem.getAsString(function (text) {
        var fragment = dom["a" /* default */].getFragmentReplacedByNewlineToBr(text);

        _this2._pasteClipboardContainer(fragment);
      });
    }
  }
  /**
   * Get sanitized html as dom fragment
   * @param {string} html - html string to sanitize
   * @returns {DocumentFragment} sanitized html
   * @private
   */
  ;

  _proto._getSanitizedHtml = function _getSanitizedHtml(html) {
    var sanitizer = this.wwe.getSanitizer();
    html = Object(htmlSanitizer["a" /* default */])(html, true);

    if (sanitizer && sanitizer !== htmlSanitizer["a" /* default */]) {
      html = sanitizer(html);
    }

    var container = document.createElement('div');
    container.innerHTML = html;
    return dom["a" /* default */].finalizeHtml(container);
  };

  _proto._convertToMsoList = function _convertToMsoList(html) {
    var container = document.createElement('div');
    container.innerHTML = html;
    convertMsoParagraphsToList(container);
    return container.innerHTML;
  }
  /**
   * Paste html of clipboard
   * @param {string} html - html
   * @private
   */
  ;

  _proto._pasteClipboardHtml = function _pasteClipboardHtml(html) {
    var container = document.createDocumentFragment();
    var startFramgmentStr = '<!--StartFragment-->';
    var endFragmentStr = '<!--EndFragment-->';
    var startFragmentIndex = html.indexOf(startFramgmentStr);
    var endFragmentIndex = html.lastIndexOf(endFragmentStr);

    if (startFragmentIndex > -1 && endFragmentIndex > -1) {
      html = html.slice(startFragmentIndex + startFramgmentStr.length, endFragmentIndex);
    } // Wrap with <tr> if html contains dangling <td> tags
    // Dangling <td> tag is that tag does not have <tr> as parent node.


    if (/<\/td>((?!<\/tr>)[\s\S])*$/i.test(html)) {
      html = "<TR>" + html + "</TR>";
    } // Wrap with <table> if html contains dangling <tr> tags
    // Dangling <tr> tag is that tag does not have <table> as parent node.


    if (/<\/tr>((?!<\/table>)[\s\S])*$/i.test(html)) {
      html = "<TABLE>" + html + "</TABLE>";
    }

    if (isFromMso(html)) {
      html = this._convertToMsoList(html);
    }

    container.appendChild(this._getSanitizedHtml(html));

    this._pasteClipboardContainer(container);
  }
  /**
   * Paste container of clipboard
   * @param {DocumentFragment} clipboardContainer - clipboard
   * @private
   */
  ;

  _proto._pasteClipboardContainer = function _pasteClipboardContainer(clipboardContainer) {
    var sq = this.wwe.getEditor();
    var childNodes = clipboardContainer.childNodes;
    var containsOneTableOnly = childNodes.length === 1 && childNodes[0].nodeName === 'TABLE';

    if (containsOneTableOnly) {
      var tableManager = this.wwe.componentManager.getManager('table');
      tableManager.pasteTableData(clipboardContainer);
    } else {
      var range = sq.getSelection().cloneRange();

      var fragment = this._preparePasteDocumentFragment(clipboardContainer);

      sq.saveUndoState(range);

      if (!range.collapsed) {
        this._deleteContentsRange(range);
      }

      if (dom["a" /* default */].isTextNode(range.startContainer)) {
        this._pasteIntoTextNode(range, fragment);
      } else {
        this._pasteIntoElements(range, fragment);
      }

      sq.setSelection(range);
    }
  }
  /**
   * Prepare clipboard for paste to table
   * @param {DocumentFragment} clipboardContainer - clipboard
   * @returns {DocumentFragment} processed result
   * @private
   */
  ;

  _proto._preparePasteDocumentFragment = function _preparePasteDocumentFragment(clipboardContainer) {
    var childNodes = clipboardContainer.childNodes;
    var fragment = document.createDocumentFragment();

    if (childNodes.length) {
      fragment.appendChild(this._unwrapBlock(clipboardContainer));
    } else if (this._isPossibleInsertToTable(clipboardContainer)) {
      fragment.appendChild(clipboardContainer);
    }

    return fragment;
  }
  /**
   * unwrap block node
   * @param {Node} node - target node
   * @returns {DocumentFragment} processed result
   * @private
   */
  ;

  _proto._unwrapBlock = function _unwrapBlock(node) {
    var fragment = document.createDocumentFragment();
    var childNodes = toArray_default()(node.childNodes);

    while (childNodes.length) {
      var child = childNodes.shift();

      if (this._isPossibleInsertToTable(child)) {
        fragment.appendChild(child);
      } else {
        fragment.appendChild(this._unwrapBlock(child)); // If current child is last or fragment already has last br,
        // appending br would create unintended line break.

        var lastChild = fragment.lastChild;

        if (childNodes.length && lastChild && lastChild.nodeName !== 'BR') {
          fragment.appendChild(document.createElement('br'));
        }
      }
    }

    return fragment;
  };

  _proto._isPossibleInsertToTable = function _isPossibleInsertToTable(node) {
    var nodeName = node.nodeName;
    var isChildlessCode = nodeName === 'CODE' && node.childNodes.length > 1;
    var isList = nodeName === 'UL' || nodeName === 'OL';
    return !isChildlessCode && (isList || dom["a" /* default */].isMDSupportInlineNode(node) || dom["a" /* default */].isTextNode(node));
  }
  /**
   * paste fragment to offset of range.startContainer
   * @param {Range} range - selection range
   * @param {DocumentFragment} fragment - paste data
   * @private
   */
  ;

  _proto._pasteIntoElements = function _pasteIntoElements(range, fragment) {
    var container = range.startContainer,
        offset = range.startOffset;
    var node = dom["a" /* default */].getChildNodeByOffset(container, offset);

    if (!node) {
      // For example when container is br, br don't have child, so node is null
      if (container.nodeName === 'TD') {
        container.appendChild(fragment);
        range.setStart(container, container.childNodes.length);
      } else {
        var parentNode = container.parentNode,
            nextSibling = container.nextSibling;
        parentNode.insertBefore(fragment, nextSibling);

        if (nextSibling) {
          range.setStart(nextSibling, 0);
        } else {
          range.setStartAfter(parentNode.lastChild);
        }
      }
    } else {
      container.insertBefore(fragment, node);
      range.setStart(node, 0);
    }

    range.collapse(true);
  }
  /**
   * paste fragment to offset of text node
   * @param {Range} range - selection range
   * @param {DocumentFragment} fragment - paste data
   * @private
   */
  ;

  _proto._pasteIntoTextNode = function _pasteIntoTextNode(range, fragment) {
    var container = range.startContainer,
        offset = range.startOffset;
    var parentNode = container.parentNode,
        textContent = container.textContent;
    var prevText = textContent.slice(0, offset);
    var postText = textContent.slice(offset, textContent.length);
    var fragmentChildNodes = fragment.childNodes;
    var firstChild = fragmentChildNodes[0];
    var isFragmenthasOneTextNode = fragmentChildNodes.length === 1 && dom["a" /* default */].isTextNode(firstChild);

    if (!prevText) {
      parentNode.insertBefore(fragment, container);
      range.setStart(container, 0);
    } else if (!postText) {
      var nextSibling = container.nextSibling;
      parentNode.insertBefore(fragment, nextSibling);
      range.setStartAfter(nextSibling);
    } else if (isFragmenthasOneTextNode) {
      var firstChildText = firstChild.textContent;
      container.textContent = "" + prevText + firstChildText + postText;
      range.setStart(container, prevText.length + firstChildText.length);
    } else {
      var resultFragment = document.createDocumentFragment();
      resultFragment.appendChild(document.createTextNode(prevText));
      resultFragment.appendChild(fragment);
      resultFragment.appendChild(document.createTextNode(postText));
      parentNode.replaceChild(resultFragment, container);
      var childNodesArray = toArray_default()(parentNode.childNodes);
      var index = 0;
      childNodesArray.forEach(function (child, i) {
        if (child.textContent === postText) {
          index = i;
        }
      });
      range.setStart(parentNode.childNodes[index], 0);
    }

    range.collapse(true);
  }
  /**
   * delete contents of range that is not collapse
   * @param {Range} range - range is not collapse
   * @private
   */
  ;

  _proto._deleteContentsRange = function _deleteContentsRange(range) {
    var startContainer = range.startContainer,
        startOffset = range.startOffset,
        endContainer = range.endContainer,
        endOffset = range.endOffset;

    if (startContainer === endContainer) {
      this._deleteContentsByOffset(startContainer, startOffset, endOffset);

      range.setStart(startContainer, startOffset);
      range.collapse(true);
    } else {
      this._deleteNotCollapsedRangeContents(range);
    }
  };

  _proto._deleteNotCollapsedRangeContents = function _deleteNotCollapsedRangeContents(range) {
    var startContainer = range.startContainer,
        startOffset = range.startOffset,
        endContainer = range.endContainer,
        endOffset = range.endOffset;
    var common = range.commonAncestorContainer;

    var startBlock = this._getBlock(startContainer, common, startOffset);

    var endBlock = this._getBlock(endContainer, common, endOffset - 1);

    if (startBlock === endBlock) {
      this._removeInSameBlock(startBlock, startContainer, endContainer, startOffset, endOffset); // When endContainer is not same endBlock, endBlock is removed.
      // For example, aaa| <- this is cursor.
      // When cursor is last, endContainer would be 'TD' and endBlock is text node
      // In this case, remove all 'aaa' so endBlock should be null.


      endBlock = endContainer !== endBlock ? null : endBlock;
    } else {
      var nextOfstartBlock = startBlock.nextSibling;

      if (startContainer.nodeName === 'TD') {
        nextOfstartBlock = this._removeOneLine(startBlock);
      } else {
        // Remove child nodes from node of startOffset in startContainer.
        this._deleteContentsByOffset(startContainer, startOffset, dom["a" /* default */].getOffsetLength(startContainer)); // Remove nodes from startContainer in startBlock


        dom["a" /* default */].removeNodesByDirection(startBlock, startContainer, false);
      }

      if (endContainer.nodeName === 'TD') {
        endBlock = this._removeOneLine(endBlock);
      } else {
        // Remove child nodes until node of endOffset in endContainer.
        this._deleteContentsByOffset(endContainer, 0, endOffset); // Remove nodes until endContainer in endBlock


        dom["a" /* default */].removeNodesByDirection(endBlock, endContainer, true);
      } // Remove nodes between startBlock and endBlock


      dom["a" /* default */].removeChildFromStartToEndNode(common, nextOfstartBlock, endBlock);
    }

    if (endBlock) {
      range.setStart(endBlock, 0);
    } else {
      range.setStartAfter(startBlock);
    }

    range.collapse(true);
  };

  _proto._removeInSameBlock = function _removeInSameBlock(block, startContainer, endContainer, startOffset, endOffset) {
    var start = startContainer === block ? startOffset : 0;
    var end = endContainer === block ? endOffset : dom["a" /* default */].getOffsetLength(block);

    this._deleteContentsByOffset(block, start, end);
  };

  _proto._removeOneLine = function _removeOneLine(node) {
    var nextSibling = node.nextSibling,
        parentNode = node.parentNode;
    var next = nextSibling;
    parentNode.removeChild(node);

    if (nextSibling && nextSibling.nodeName === 'BR') {
      next = nextSibling.nextSibling;
      parentNode.removeChild(nextSibling);
    }

    return next;
  }
  /**
   * Find parent block node of startContainer and endContainer
   * If startContainer or endContainer is same commonAncestor,
   * find node at offset of startContainer and endContainer.
   * @param {Node} node - startContainer or endContainer
   * @param {Node} parent - commonAncestor
   * @param {Number} offset - startOffset or endOffset-1
   * @returns {Node} block node
   * @private
   */
  ;

  _proto._getBlock = function _getBlock(node, parent, offset) {
    return dom["a" /* default */].getParentUntil(node, parent) || dom["a" /* default */].getChildNodeByOffset(node, offset);
  }
  /**
   * delete contents from start offset to end offset
   * @param {Node} container - container
   * @param {Number} startOffset - start offset
   * @param {Number} endOffset - end offset
   * @private
   */
  ;

  _proto._deleteContentsByOffset = function _deleteContentsByOffset(container, startOffset, endOffset) {
    if (dom["a" /* default */].isTextNode(container)) {
      var textContent = container.textContent;
      var prevText = textContent.slice(0, startOffset);
      var postText = textContent.slice(endOffset, textContent.length);
      container.textContent = "" + prevText + postText;
    } else {
      var startNode = dom["a" /* default */].getChildNodeByOffset(container, startOffset);
      var endNode = dom["a" /* default */].getChildNodeByOffset(container, endOffset);

      if (startNode) {
        dom["a" /* default */].removeChildFromStartToEndNode(container, startNode, endNode || null);
      }
    }
  };

  return WwTablePasteHelper;
}();

/* harmony default export */ var wwTablePasteHelper = (wwTablePasteHelper_WwTablePasteHelper);
// CONCATENATED MODULE: ./src/js/wwClipboardManager.js
/**
 * @fileoverview Implements wysiwyg editor clipboard manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */









var PASTE_TABLE_BOOKMARK = 'tui-paste-table-bookmark';
var PASTE_TABLE_CELL_BOOKMARK = 'tui-paste-table-cell-bookmark';
/**
 * Class WwClipboardManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */

var wwClipboardManager_WwClipboardManager = /*#__PURE__*/function () {
  function WwClipboardManager(wwe) {
    this.wwe = wwe;
    this._pch = new wwPasteContentHelper(this.wwe);
    this._tablePasteHelper = new wwTablePasteHelper(this.wwe);
    this._selectedSellCount = 0;
    this._clipboardArea = null;
  }
  /**
   * initialize
   */


  var _proto = WwClipboardManager.prototype;

  _proto.init = function init() {
    var _this = this;

    this.wwe.eventManager.listen('willPaste', function (ev) {
      return _this._executeHandler(_this._onWillPaste.bind(_this), ev);
    });
    this.wwe.eventManager.listen('copy', function (ev) {
      return _this._executeHandler(_this._onCopyCut.bind(_this), ev);
    });
    this.wwe.eventManager.listen('copyAfter', function (ev) {
      return _this._executeHandler(_this._onCopyAfter.bind(_this), ev);
    });
    this.wwe.eventManager.listen('cut', function (ev) {
      return _this._executeHandler(_this._onCopyCut.bind(_this), ev);
    });
    this.wwe.eventManager.listen('cutAfter', function (ev) {
      return _this._executeHandler(_this._onCutAfter.bind(_this), ev);
    });
    this.wwe.eventManager.listen('paste', function (ev) {
      return _this._executeHandler(_this._onPasteIntoTable.bind(_this), ev);
    });
  };

  _proto._executeHandler = function _executeHandler(handler, event) {
    if (event.source === 'wysiwyg') {
      handler(event);
    }
  };

  _proto._onCopyCut = function _onCopyCut(event) {
    var tableManager = this.wwe.componentManager.getManager('tableSelection');
    var selectedCellCount = tableManager.getSelectedCells().length;

    if (!selectedCellCount) {
      // preserve selection range in a cell, let squire do the job
      return;
    }

    if (!tableManager.mergedTableSelectionManager) {
      // set selection range to all contents in selected cells, then squire
      tableManager.createRangeBySelectedCells();
      return;
    }

    var editor = this.wwe.getEditor();
    var clipboardEvent = event.data;
    var range = editor.getSelection().cloneRange();
    var clipboardContainer = document.createElement('div');

    this._extendRange(range);

    clipboardContainer.innerHTML = range.cloneContents();

    this._updateCopyDataForListTypeIfNeed(range, clipboardContainer);

    this.wwe.eventManager.emit('copyBefore', {
      source: 'wysiwyg',
      clipboardContainer: clipboardContainer
    });

    this._setClipboardData(clipboardEvent, clipboardContainer.innerHTML, clipboardContainer.textContent);
  };

  _proto._clearClipboardArea = function _clearClipboardArea() {
    if (this._clipboardArea) {
      dom["a" /* default */].remove(this._clipboardArea);
      this._clipboardArea = null;
    }
  };

  _proto._onCopyAfter = function _onCopyAfter() {
    this.wwe.getEditor().getBody().focus();

    this._clearClipboardArea();
  };

  _proto._onCutAfter = function _onCutAfter() {
    var range = this.wwe.getEditor().getSelection();
    range.deleteContents();
    this.wwe.getEditor().focus();

    this._clearClipboardArea();
  }
  /**
   * Process paste event when occured in table
   * @param {{source: string, data: event}} event - event
   * @private
   */
  ;

  _proto._onPasteIntoTable = function _onPasteIntoTable(event) {
    var ev = event.data;
    var range = this.wwe.getEditor().getSelection();

    if (this.wwe.isInTable(range) && this._isSingleCellSelected(range)) {
      this._tablePasteHelper.pasteClipboard(ev);
    }
  };

  _proto._isSingleCellSelected = function _isSingleCellSelected(range) {
    var startContainer = range.startContainer,
        endContainer = range.endContainer;
    return this._getCell(startContainer) === this._getCell(endContainer);
  };

  _proto._getCell = function _getCell(node) {
    return node.nodeName === 'TD' ? node : dom["a" /* default */].getParentUntil(node, 'TR');
  };

  _proto._replaceNewLineToBr = function _replaceNewLineToBr(node) {
    var textNodes = dom["a" /* default */].getAllTextNode(node);
    textNodes.forEach(function (textNode) {
      if (/\n/.test(textNode.nodeValue)) {
        textNode.parentNode.innerHTML = textNode.nodeValue.replace(/\n/g, '<br>');
      }
    });
  };

  _proto._onWillPaste = function _onWillPaste(event) {
    var _this2 = this;

    var pasteData = event.data;
    var clipboardContainer = document.createElement('div');
    clipboardContainer.appendChild(pasteData.fragment.cloneNode(true));

    this._preparePaste(clipboardContainer);

    this._setTableBookmark(clipboardContainer);

    pasteData.fragment = document.createDocumentFragment();
    toArray_default()(clipboardContainer.childNodes).forEach(function (element) {
      if (dom["a" /* default */].getNodeName(element) === 'DIV') {
        _this2._replaceNewLineToBr(element);
      }

      pasteData.fragment.appendChild(element);
    }); // once right after the squire insertHTML DOM.

    var handler = function handler() {
      _this2.wwe.getEditor().removeEventListener('input', handler);

      _this2.wwe.eventManager.emit('wysiwygRangeChangeAfter', _this2);

      _this2._focusTableBookmark();
    };

    this.wwe.getEditor().addEventListener('input', handler);
  };

  _proto._setClipboardData = function _setClipboardData(clipboardEvent, htmlContent, textContent) {
    if (browser_default.a.msie) {
      clipboardEvent.squirePrevented = true;
      this._clipboardArea = this._createClipboardArea();
      this._clipboardArea.innerHTML = htmlContent;

      this._clipboardArea.focus();

      window.getSelection().selectAllChildren(this._clipboardArea);
    } else {
      clipboardEvent.preventDefault();
      clipboardEvent.stopPropagation();
      clipboardEvent.clipboardData.setData('text/html', htmlContent);
      clipboardEvent.clipboardData.setData('text/plain', textContent);
    }
  };

  _proto._createClipboardArea = function _createClipboardArea() {
    var element = document.createElement('div');
    element.setAttribute('contenteditable', true);
    css_default()(element, {
      position: 'fixed',
      overflow: 'hidden',
      top: 0,
      right: '100%',
      width: '1px',
      height: '1px'
    });
    document.body.appendChild(element);
    return element;
  }
  /**
   * Update copy data, when commonAncestorContainer nodeName is list type like UL or OL.
   * @param {object} range - text range
   * @param {HTMLElement} clipboardContainer - clibpard container element
   * @private
   */
  ;

  _proto._updateCopyDataForListTypeIfNeed = function _updateCopyDataForListTypeIfNeed(range, clipboardContainer) {
    var commonAncestorNodeName = range.commonAncestorContainer.nodeName;

    if (commonAncestorNodeName !== 'UL' && commonAncestorNodeName !== 'OL') {
      return;
    }

    var newParent = document.createElement(commonAncestorNodeName);
    newParent.appendChild(clipboardContainer);
    clipboardContainer.innerHTML = '';
    clipboardContainer.appendChild(newParent);
  }
  /**
   * Remove empty font elements.
   * @param {HTMLElement} clipboardContainer - cliboard container
   * @private
   */
  ;

  _proto._removeEmptyFontElement = function _removeEmptyFontElement(clipboardContainer) {
    // clipboard data from ms word tend to have unneccesary font tags
    var children = dom["a" /* default */].children(clipboardContainer, 'font');
    children.forEach(function (element) {
      if (!element.textContent.trim()) {
        dom["a" /* default */].remove(element);
      }
    });
  }
  /**
   * P tags append 'BR' to make blank line.
   * Our viewer renders new line as P tag with margin.
   * When pasting text from viewer, insert BR between P tags.
   * @param {Node} node - node
   * @private
   */
  ;

  _proto._preProcessPtag = function _preProcessPtag(node) {
    dom["a" /* default */].findAll(node, 'p').forEach(function (pTag) {
      if (pTag.lastChild && pTag.lastChild.nodeName !== 'BR') {
        pTag.appendChild(document.createElement('br'));
      }

      pTag.appendChild(document.createElement('br'));
    });
  }
  /**
   * Prepare paste.
   * @param {HTMLElement} clipboardContainer - temporary container for clipboard contents
   * @private
   */
  ;

  _proto._preparePaste = function _preparePaste(clipboardContainer) {
    if (isFromMso(clipboardContainer.innerHTML)) {
      convertMsoParagraphsToList(clipboardContainer);
    } else {
      // When pasting text, the empty line processing differ our viewer and MS Office.
      // In our viewer case, <p>aaa</p><p>bbb</p> have empty line becuase P tags have margin.
      // In MS Office case, <p>aaa</p><p>bbb</p> do not have empty line becuase P tags means just one line.
      this._preProcessPtag(clipboardContainer);
    }

    this._removeEmptyFontElement(clipboardContainer);

    this._pch.preparePaste(clipboardContainer);

    this.wwe.eventManager.emit('pasteBefore', {
      source: 'wysiwyg',
      clipboardContainer: clipboardContainer
    });
  }
  /**
   * set table bookmark which will gain focus after document modification ends.
   * @param {HTMLElement} clipboardContainer - clipboard container
   * @private
   */
  ;

  _proto._setTableBookmark = function _setTableBookmark(clipboardContainer) {
    var lastNode = clipboardContainer.lastChild;
    var isLastNodeTable = lastNode && lastNode.nodeName === 'TABLE';

    if (isLastNodeTable) {
      addClass_default()(lastNode, PASTE_TABLE_BOOKMARK);
    }
  }
  /**
   * Focus to table after document modification.
   * @param {object} sq - squire editor instance
   * @private
   */
  ;

  _proto._focusTableBookmark = function _focusTableBookmark() {
    var sq = this.wwe.getEditor();
    var range = sq.getSelection().cloneRange();
    var bookmarkedTable = sq.getBody().querySelector("." + PASTE_TABLE_BOOKMARK);
    var bookmarkedCell = sq.getBody().querySelector("." + PASTE_TABLE_CELL_BOOKMARK);

    if (bookmarkedTable) {
      removeClass_default()(bookmarkedTable, PASTE_TABLE_BOOKMARK);
      range.setEndAfter(bookmarkedTable);
      range.collapse(false);
      sq.setSelection(range);
    }

    if (bookmarkedCell) {
      removeClass_default()(bookmarkedCell, PASTE_TABLE_CELL_BOOKMARK);
      range.selectNodeContents(bookmarkedCell);
      range.collapse(false);
      sq.setSelection(range);
    }
  }
  /**
   * extend range if need
   * @param {Range} range to extend
   * @private
   */
  ;

  _proto._extendRange = function _extendRange(range) {
    // non-text node && not selected whole area, then expand the range
    if (dom["a" /* default */].isTextNode(range.commonAncestorContainer) && (range.startOffset !== 0 || range.commonAncestorContainer.textContent.length !== range.endOffset) && range.commonAncestorContainer.nodeName !== 'TD') {
      return;
    }

    if (range.startOffset === 0) {
      range = this._extendStartRange(range);
    }

    if (range.endOffset === dom["a" /* default */].getOffsetLength(range.endContainer)) {
      range = this._extendEndRange(range);
    } // commonAncestor if all of it's children has been selected


    if (this._isWholeCommonAncestorContainerSelected(range)) {
      range.selectNode(range.commonAncestorContainer);
    }

    this.wwe.getEditor().setSelection(range);
  }
  /**
   * Extends current range's startContainer
   * @param {Range} range Range object
   * @returns {Range}
   * @private
   */
  ;

  _proto._extendStartRange = function _extendStartRange(range) {
    var newBound = range.startContainer; // expand range

    while (newBound.parentNode !== range.commonAncestorContainer && newBound.parentNode !== this.wwe.getBody() && !newBound.previousSibling) {
      newBound = newBound.parentNode;
    } // expand range


    range.setStart(newBound.parentNode, dom["a" /* default */].getNodeOffsetOfParent(newBound));
    return range;
  }
  /**
   * Extends current range's endContainer
   * @param {Range} range Range object
   * @returns {Range}
   * @private
   */
  ;

  _proto._extendEndRange = function _extendEndRange(range) {
    var newBound = range.endContainer;
    var boundNext = newBound.nextSibling; // expand range

    while (newBound.parentNode !== range.commonAncestorContainer && newBound.parentNode !== this.wwe.getBody() && (!boundNext || dom["a" /* default */].getNodeName(boundNext) === 'BR' && newBound.parentNode.lastChild === boundNext)) {
      newBound = newBound.parentNode;
      boundNext = newBound.nextSibling;
    } // expand range level


    range.setEnd(newBound.parentNode, dom["a" /* default */].getNodeOffsetOfParent(newBound) + 1);
    return range;
  }
  /**
   * Check whether whole commonAncestorContainter textContent selected or not
   * @param {Range} range Range object
   * @returns {boolean} result
   * @private
   */
  ;

  _proto._isWholeCommonAncestorContainerSelected = function _isWholeCommonAncestorContainerSelected(range) {
    return range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE && range.commonAncestorContainer !== this.wwe.getBody() && range.startOffset === 0 && range.endOffset === range.commonAncestorContainer.childNodes.length && range.commonAncestorContainer === range.startContainer && range.commonAncestorContainer === range.endContainer;
  };

  return WwClipboardManager;
}();

/* harmony default export */ var wwClipboardManager = (wwClipboardManager_WwClipboardManager);
// EXTERNAL MODULE: ./node_modules/tui-code-snippet/domUtil/hasClass.js
var hasClass = __webpack_require__(16);
var hasClass_default = /*#__PURE__*/__webpack_require__.n(hasClass);

// CONCATENATED MODULE: ./src/js/wwLinkManager.js
/**
 * @fileoverview Implements wysiwyg link manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var CLASS_NAME_IMAGE_LINK = 'image-link';
/**
 * Class WwLinkManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */

var wwLinkManager_WwLinkManager = /*#__PURE__*/function () {
  function WwLinkManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;
    /**
     * Name property
     * @type {string}
     */

    this.name = 'link';

    this._init();
  }

  var _proto = WwLinkManager.prototype;

  _proto._init = function _init() {
    var _this = this;

    this.eventManager.listen('wysiwygSetValueAfter', function () {
      _this._addClassNameToAllImageLinks();
    });
    this.wwe.getEditor().addEventListener('click', function (ev) {
      var target = ev.target,
          offsetX = ev.offsetX,
          offsetY = ev.offsetY;
      var popupButton = getComputedStyle(target, ':before');

      if (hasClass_default()(target, CLASS_NAME_IMAGE_LINK) && dom["a" /* default */].isInsideButtonBox(popupButton, offsetX, offsetY)) {
        _this._selectImageLink(target.parentNode);

        _this.eventManager.emit('openPopupAddLink', {
          url: target.getAttribute('href')
        });
      }
    });
  };

  _proto._selectImageLink = function _selectImageLink(imageLink) {
    var range = this.wwe.getEditor().getSelection().cloneRange();
    range.selectNode(imageLink);
    this.wwe.getEditor().setSelection(range);
  };

  _proto._addClassNameToImageLinks = function _addClassNameToImageLinks(links) {
    links.forEach(function (link) {
      if (link.firstChild && link.firstChild.nodeName === 'IMG') {
        addClass_default()(link, CLASS_NAME_IMAGE_LINK);
      }
    });
  };

  _proto._addClassNameToAllImageLinks = function _addClassNameToAllImageLinks() {
    var links = dom["a" /* default */].findAll(this.wwe.getBody(), 'a');

    this._addClassNameToImageLinks(links);
  }
  /**
   * Add class name on all link including image in selection
   */
  ;

  _proto.addClassNameToImageLinksInSelection = function addClassNameToImageLinksInSelection() {
    var sq = this.wwe.getEditor();

    var _sq$getSelection = sq.getSelection(),
        container = _sq$getSelection.commonAncestorContainer;

    if (dom["a" /* default */].isElemNode(container)) {
      var links;

      if (container.nodeName === 'A') {
        links = [container];
      } else {
        links = dom["a" /* default */].findAll(container, 'a');
      }

      this._addClassNameToImageLinks(links);
    }
  };

  return WwLinkManager;
}();


// CONCATENATED MODULE: ./src/js/wwListManager.js
/**
 * @fileoverview Implements wysiwyg list manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var FIND_LI_ELEMENT = /<li/i;
var DIV_OR_LI = 'DIV,LI';
var UL_OR_OL = 'OL,UL';
var FIND_CELL_TAG_RX = /(<(?:th|td)[^>]*>)(.*?)(<\/(?:th|td)>)/g;
var FIND_LIST_OR_LIST_ITEM_TAG_RX = /<(ul|ol|li)([^>]*)>/g;
/**
 * Class WwListManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */

var wwListManager_WwListManager = /*#__PURE__*/function () {
  function WwListManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;
    /**
     * Name property
     * @type {string}
     */

    this.name = 'list';

    this._init();
  }
  /**
   * Initialize
   * @private
   */


  var _proto = WwListManager.prototype;

  _proto._init = function _init() {
    this._initEvent();

    this._initKeyHandler();
  }
  /**
   * Initialize event
   * @private
   */
  ;

  _proto._initEvent = function _initEvent() {
    var _this = this;

    this.eventManager.listen('wysiwygSetValueBefore', function (html) {
      return _this.convertToArbitraryNestingList(html);
    });
    this.eventManager.listen('wysiwygRangeChangeAfter', function () {
      _this._findAndRemoveEmptyList();

      _this._removeBranchListAll();
    });
    this.eventManager.listen('wysiwygSetValueAfter', function () {
      _this._removeBranchListAll();
    });
    this.eventManager.listen('wysiwygProcessHTMLText', function (html) {
      html = _this._convertFromArbitraryNestingList(html);
      return html;
    });
    this.eventManager.listen('convertorBeforeHtmlToMarkdownConverted', function (html) {
      return _this._insertDataToMarkPassForListInTable(html);
    });
  };

  _proto._initKeyHandler = function _initKeyHandler() {
    var _this2 = this;

    this.wwe.addKeyEventHandler(['TAB', 'CTRL+]', 'META+]'], function (ev) {
      var isNeedNext;

      if (_this2.wwe.getEditor().hasFormat('LI')) {
        ev.preventDefault();

        _this2.eventManager.emit('command', 'Indent');

        isNeedNext = false;
      }

      return isNeedNext;
    });
    this.wwe.addKeyEventHandler(['SHIFT+TAB', 'CTRL+[', 'META+['], function (ev, range) {
      var isNeedNext;

      if (_this2.wwe.getEditor().hasFormat('LI')) {
        ev.preventDefault();
        var ul = dom["a" /* default */].children(dom["a" /* default */].closest(range.startContainer, 'li'), UL_OR_OL);

        _this2.eventManager.emit('command', 'Outdent');

        if (ul.length && !ul.previousSibling) {
          _this2._removeBranchList(ul);
        }

        isNeedNext = false;
      }

      return isNeedNext;
    });
    this.wwe.addKeyEventHandler('ENTER', function (ev, range) {
      if (range.collapsed) {
        if (_this2.wwe.getEditor().hasFormat('LI')) {
          _this2.wwe.defer(function () {
            var afterRange = _this2.wwe.getRange();

            var _domUtils$parents = dom["a" /* default */].parents(afterRange.startContainer, 'li'),
                li = _domUtils$parents[0];

            _this2._removeBranchListAll(li);
          });
        }
      }
    });
    this.wwe.addKeyEventHandler('BACK_SPACE', function (ev, range) {
      if (range.collapsed) {
        if (_this2.wwe.getEditor().hasFormat('LI')) {
          _this2.wwe.defer(function () {
            _this2._removeBranchListAll();
          });
        }
      }
    });
  }
  /**
   * Find empty list for whole container and remove it.
   * @private
   */
  ;

  _proto._findAndRemoveEmptyList = function _findAndRemoveEmptyList() {
    dom["a" /* default */].findAll(this.wwe.getBody(), UL_OR_OL).forEach(function (node) {
      if (!FIND_LI_ELEMENT.test(node.innerHTML)) {
        dom["a" /* default */].remove(node);
      }
    });
  }
  /**
   * Remove branch lists all from body
   * @param {HTMLElement} root root to remove branch list
   * @private
   */
  ;

  _proto._removeBranchListAll = function _removeBranchListAll(root) {
    var _this3 = this;

    root = !root ? this.wwe.getBody() : root;
    dom["a" /* default */].findAll(root, 'li > ul, li > ol').forEach(function (node) {
      if (!node || node.previousSibling) {
        return;
      }

      _this3._removeBranchList(node);
    });
  }
  /**
   * Remove branch list of passed list(ul, ol)
   * @param {HTMLElement} list list
   * @private
   */
  ;

  _proto._removeBranchList = function _removeBranchList(list) {
    var branchRoot = list;

    while (!branchRoot.previousSibling && branchRoot.parentElement.tagName.match(/UL|OL|LI/g)) {
      branchRoot = branchRoot.parentElement;
    }

    var _domUtils$children = dom["a" /* default */].children(branchRoot, 'li'),
        firstLi = _domUtils$children[0];

    var unwrappedLIs = dom["a" /* default */].unwrap(list);
    dom["a" /* default */].prepend(branchRoot, unwrappedLIs);
    dom["a" /* default */].remove(firstLi);
  }
  /**
   * make arbitrary nesting list out of standard list
   * `<ul><li>text<ul><li>text2</li></ul></li></ul>` to
   * `<ul><li>text</li><ul><li>text2</li></ul></ul>`
   * @param {string} html string to convert
   * @returns {string} converted HTML text
   */
  ;

  _proto.convertToArbitraryNestingList = function convertToArbitraryNestingList(html) {
    var NESTED_LIST_QUERY = 'li > ul, li > ol';
    var wrapper = dom["a" /* default */].createElementWith("<div>" + html + "</div>");
    var nestedList = wrapper.querySelector(NESTED_LIST_QUERY);

    while (nestedList !== null) {
      var parentLI = nestedList.parentNode;
      var parentList = parentLI.parentNode;
      parentList.insertBefore(nestedList, parentLI.nextElementSibling);
      nestedList = wrapper.querySelector(NESTED_LIST_QUERY);
    }

    return wrapper.innerHTML;
  }
  /**
   * make standard list out of arbitrary nesting list
   * `<ul><li>text<ul><li>text2</li></ul></li></ul>` from
   * `<ul><li>text</li><ul><li>text2</li></ul></ul>`
   * @param {string} html string to convert
   * @returns {string} converted HTML text
   * @private
   */
  ;

  _proto._convertFromArbitraryNestingList = function _convertFromArbitraryNestingList(html) {
    var NESTED_LIST_QUERY = 'ol > ol, ol > ul, ul > ol, ul > ul';
    var wrapperDiv = dom["a" /* default */].createElementWith("<div>" + html + "</div>");
    var nestedList = wrapperDiv.querySelector(NESTED_LIST_QUERY);

    while (nestedList !== null) {
      var prevLI = nestedList.previousElementSibling;

      while (prevLI && prevLI.tagName !== 'LI') {
        prevLI = prevLI.previousElementSibling;
      }

      if (prevLI) {
        prevLI.appendChild(nestedList);
      } else {
        this._unwrap(nestedList);
      }

      nestedList = wrapperDiv.querySelector(NESTED_LIST_QUERY);
    }

    return wrapperDiv.innerHTML;
  }
  /**
   * unwrap nesting list
   * @param {Node} nestedList - nested list to unwrap
   * @private
   */
  ;

  _proto._unwrap = function _unwrap(nestedList) {
    var fragment = document.createDocumentFragment();

    while (nestedList.firstChild) {
      fragment.appendChild(nestedList.firstChild);
    }

    nestedList.parentNode.replaceChild(fragment, nestedList);
  };

  _proto._insertDataToMarkPassForListInTable = function _insertDataToMarkPassForListInTable(html) {
    var replacedHtml = html.replace(FIND_CELL_TAG_RX, function (match, tdStart, tdContent, tdEnd) {
      var content = tdContent.replace(FIND_LIST_OR_LIST_ITEM_TAG_RX, '<$1 data-tomark-pass $2>');
      return "" + tdStart + content + tdEnd;
    });
    return replacedHtml;
  }
  /**
   * Return lines in selection
   * @param {Node} start Start element
   * @param {Node} end End element
   * @param {HTMLElement} body Editor body element
   * @returns {Array.<HTMLElement>}
   * @private
   */
  ;

  _proto.getLinesOfSelection = function getLinesOfSelection(start, end) {
    var lines = [];
    var isLastLine = false;
    var needNext = true;
    var nextLine;

    if (dom["a" /* default */].isTextNode(start)) {
      var _domUtils$parents2 = dom["a" /* default */].parents(start, DIV_OR_LI);

      start = _domUtils$parents2[0];
    }

    if (dom["a" /* default */].isTextNode(end)) {
      var _domUtils$parents3 = dom["a" /* default */].parents(end, DIV_OR_LI);

      end = _domUtils$parents3[0];
    }

    for (var line = start; needNext; line = nextLine) {
      if (matches_default()(line, DIV_OR_LI)) {
        lines.push(line);

        if (line === end) {
          isLastLine = true;
        } else {
          nextLine = this._getNextLine(line, end);
        }
      } else {
        break;
      }

      needNext = nextLine && !isLastLine;
    }

    return lines;
  }
  /**
   * get next line
   * @param {Node} currentLine - current line node
   * @param {Node} end - last node in selection
   * @returns {Node} - next line node
   * @private
   */
  ;

  _proto._getNextLine = function _getNextLine(currentLine, end) {
    var nextLine = currentLine.nextElementSibling;

    if (!nextLine) {
      // current line was the last line in ul/ol
      // while we have lines those has not been processed yet.
      nextLine = currentLine.parentNode.nextElementSibling;
    } else if (matches_default()(nextLine, UL_OR_OL)) {
      // we don't sure firstChild is LI. arbtrary list can have another ol/ul
      nextLine = nextLine.querySelector('li');
    }

    if (matches_default()(nextLine, DIV_OR_LI) || nextLine === end) {
      return nextLine;
    }

    return this._getNextLine(nextLine);
  }
  /**
   * merge to previous list
   * consider remove this function when https://github.com/neilj/Squire/issues/294 resolved
   * @param {HTMLLIElement} currentLine - current li element
   */
  ;

  _proto.mergeList = function mergeList(currentLine) {
    var currentList = currentLine.parentNode;
    var prevList = currentList.previousElementSibling;
    var nextList = currentList.nextElementSibling;

    if (currentList.firstElementChild === currentLine) {
      if (prevList && matches_default()(prevList, UL_OR_OL)) {
        this._mergeList(currentList, prevList);

        currentList = prevList;
      }
    }

    if (currentList.lastElementChild === currentLine) {
      if (nextList && matches_default()(nextList, UL_OR_OL)) {
        this._mergeList(nextList, currentList);
      }
    }
  }
  /**
   * merge list to targetList
   * @param {HTMLOListElement|HTMLUListElement} list - list to merge
   * @param {HTMLOListElement|HTMLUListElement} targetList - target list
   * @private
   */
  ;

  _proto._mergeList = function _mergeList(list, targetList) {
    var listItem = list.firstElementChild;

    if (targetList && matches_default()(targetList, UL_OR_OL)) {
      while (listItem) {
        var temp = listItem.nextElementSibling;
        targetList.appendChild(listItem);
        listItem = temp;
      }

      list.parentNode.removeChild(list);
    }
  }
  /**
   * Check whether is available to make List in table.
   * @returns {boolean} - li element
   */
  ;

  _proto.isAvailableMakeListInTable = function isAvailableMakeListInTable() {
    var selectionManager = this.wwe.componentManager.getManager('tableSelection');
    var selectedCells = selectionManager.getSelectedCells();
    var sq = this.wwe.getEditor();
    return selectedCells && sq.hasFormat('table') && !sq.hasFormat('OL') && !sq.hasFormat('UL');
  }
  /**
   * Find parent node before TD
   * @param {Node} node - startContainer or endContainer of range
   * @param {Number} offset - offset
   * @returns {Node} - parent node before TD
   * @private
   */
  ;

  _proto._getParentNodeBeforeTD = function _getParentNodeBeforeTD(node, offset) {
    var parentNode = dom["a" /* default */].getParentUntil(node, 'TD');

    if (!parentNode) {
      var childNodes = node.childNodes;
      var length = childNodes ? childNodes.length : 0;
      var newOffset = offset > 0 && offset === length ? offset - 1 : offset;
      parentNode = dom["a" /* default */].getChildNodeByOffset(node, newOffset);
    }

    return parentNode;
  }
  /**
   * Find LI node inside cell (TH, TD)
   * If target node is not li and parents of taget node is not li, return null.
   * @param {Node} targetNode - startContainer or endContainer of range
   * @param {Number} offset - offset
   * @returns {Node} - LI node or null
   * @private
   */
  ;

  _proto._findLINodeInsideCell = function _findLINodeInsideCell(targetNode, offset) {
    var liNode = null;

    if (targetNode && dom["a" /* default */].isCellNode(targetNode)) {
      targetNode = targetNode.firstChild;
    }

    var liParent = dom["a" /* default */].getParentUntilBy(targetNode, function (parentNode) {
      return parentNode && dom["a" /* default */].isListNode(parentNode);
    }, function (parentNode) {
      return parentNode && dom["a" /* default */].isCellNode(parentNode);
    });

    if (liParent) {
      liNode = liParent;
    } else if (targetNode.nodeName === 'LI') {
      liNode = targetNode;
    } else if (dom["a" /* default */].isListNode(targetNode)) {
      var childLength = targetNode.childNodes.length;
      liNode = targetNode.childNodes[offset >= childLength ? childLength - 1 : offset];
    }

    return liNode;
  }
  /**
   * Get first node on the line where range start.
   * @param {Node} targetNode - startContainer
   * @param {Number} offset - startOffset
   * @returns {Node} - first node where range start
   * @private
   */
  ;

  _proto._getFirstNodeInLineOfTable = function _getFirstNodeInLineOfTable(targetNode, offset) {
    var startNode = this._findLINodeInsideCell(targetNode, offset);

    if (!startNode) {
      startNode = this._getParentNodeBeforeTD(targetNode, offset);
      var _startNode = startNode,
          previousSibling = _startNode.previousSibling;

      while (previousSibling && previousSibling.nodeName !== 'BR' && !dom["a" /* default */].isListNode(previousSibling)) {
        startNode = previousSibling;
        previousSibling = startNode.previousSibling;
      }
    }

    return startNode;
  }
  /**
   * Get last node on the line where range end.
   * @param {Node} targetNode - endContainer
   * @param {Number} offset - endOffset
   * @returns {Node} - last node where range end
   * @private
   */
  ;

  _proto._getLastNodeInLineOfTable = function _getLastNodeInLineOfTable(targetNode, offset) {
    var endNode = this._findLINodeInsideCell(targetNode, offset);

    if (!endNode) {
      endNode = this._getParentNodeBeforeTD(targetNode, offset);

      while (endNode.nextSibling) {
        if (endNode.nodeName === 'BR' || dom["a" /* default */].isListNode(endNode)) {
          break;
        }

        endNode = endNode.nextSibling;
      }
    }

    return endNode;
  }
  /**
   * Check whether node is last node in the line of table
   * If the node is li or br, the node is last node in the line of table.
   * @param {node} node - node
   * @returns {boolean} - whether node is last node in line of table
   * @private
   */
  ;

  _proto._isLastNodeInLineOfTable = function _isLastNodeInLineOfTable(node) {
    var nodeName = node.nodeName;
    return nodeName === 'LI' || nodeName === 'BR';
  }
  /**
   * Get next node in the line of table
   * If current node is li node and nextSibling is not existing, next node is parent's nextSibling.
   * If nextSibiling of node is a list node (UL or OL), next node is first child of the list node.
   * @param {node} node - node
   * @returns {node} - next node
   * @private
   */
  ;

  _proto._getNextNodeInLineOfTable = function _getNextNodeInLineOfTable(node) {
    var nextSibling = node.nextSibling;

    if (node.nodeName === 'LI' && !nextSibling) {
      var parentNode = node.parentNode;

      while (!dom["a" /* default */].isCellNode(parentNode)) {
        if (parentNode.nextSibling) {
          nextSibling = parentNode.nextSibling;
          break;
        }

        parentNode = parentNode.parentNode;
      }
    } else if (dom["a" /* default */].isListNode(nextSibling)) {
      nextSibling = nextSibling.firstChild;
    }

    return nextSibling;
  }
  /**
   * get nodes in each lines of table
   * @param {range} range - range
   * @returns {array} - each nodes in line
   * @private
   */
  ;

  _proto._getLinesOfSelectionInTable = function _getLinesOfSelectionInTable(range) {
    var startContainer = range.startContainer,
        endContainer = range.endContainer,
        startOffset = range.startOffset,
        endOffset = range.endOffset;

    var firstNode = this._getFirstNodeInLineOfTable(startContainer, startOffset);

    var lastNode = this._getLastNodeInLineOfTable(endContainer, endOffset);

    var lines = [];
    var oneLine = [];

    while (firstNode) {
      oneLine.push(firstNode);

      if (this._isLastNodeInLineOfTable(firstNode)) {
        lines.push(oneLine);
        oneLine = [];
      }

      if (firstNode === lastNode) {
        if (oneLine.length) {
          lines.push(oneLine);
        }

        break;
      }

      firstNode = this._getNextNodeInLineOfTable(firstNode);
    }

    return lines;
  }
  /**
   * create OL or UL element
   * @param {string} listType - OL, UL or TASK
   * @returns {Node} - OL or UL element
   * @private
   */
  ;

  _proto._createListElement = function _createListElement(listType) {
    return document.createElement(listType === 'TASK' ? 'UL' : listType);
  }
  /**
   * create li element
   * @param {array} oneLineNodes - node array
   * @param {string} listType - OL, UL or TASK
   * @returns {Node} - li element
   * @private
   */
  ;

  _proto._createListItemElement = function _createListItemElement(oneLineNodes, listType) {
    var liNode = document.createElement('li');
    oneLineNodes.forEach(function (node) {
      liNode.appendChild(node);
    });

    if (listType === 'TASK') {
      var taskManager = this.wwe.componentManager.getManager('task');
      taskManager.formatTask(liNode);
    }

    return liNode;
  };

  _proto._mergeListWithPreviousSibiling = function _mergeListWithPreviousSibiling(node) {
    var previousSibling = node.previousSibling;
    var result = node;

    if (previousSibling && node.nodeName === previousSibling.nodeName) {
      this._mergeList(node, previousSibling);

      result = previousSibling;
    }

    return result;
  };

  _proto._mergeListWithNextSibiling = function _mergeListWithNextSibiling(node) {
    var nextSibling = node.nextSibling;

    if (nextSibling && node.nodeName === nextSibling.nodeName) {
      this._mergeList(nextSibling, node);
    }

    return node;
  }
  /**
   * make listNode (OL or UL)
   * @param {range} range - range
   * @param {staring} listType - UL, OL, TASK
   * @returns {array} childNodes of list node (OL/UL)
   */
  ;

  _proto.createListInTable = function createListInTable(range, listType) {
    var _this4 = this;

    var lines = this._getLinesOfSelectionInTable(range);

    var lastLine = lines[lines.length - 1];
    var lastNode = lastLine[lastLine.length - 1];
    var nextNode = lastNode.nextSibling;
    var parentNode = lastNode.parentNode;

    var listNode = this._createListElement(listType);

    var _listNode = listNode,
        listNodeName = _listNode.nodeName;
    var newLIs = [];
    lines.forEach(function (oneLineNodes) {
      var oneLineFirstNode = oneLineNodes[0];
      var liElement; // oneLineFirstNode was already a list item in the table

      if (oneLineFirstNode.nodeName === 'LI') {
        var existingListNode = oneLineFirstNode.parentNode;
        liElement = oneLineFirstNode; // If the existing list that is already in table is not same the list to be created,
        // change the existing list to the list to be created

        if (existingListNode.nodeName !== listNodeName) {
          var childNodes = existingListNode.childNodes;
          toArray_default()(childNodes).forEach(function () {
            listNode.appendChild(existingListNode.firstChild);
          });
          existingListNode.parentNode.replaceChild(listNode, existingListNode);
        }

        listNode = liElement.parentNode;
      } else {
        liElement = _this4._createListItemElement(oneLineNodes, listType);
        listNode.appendChild(liElement);
      }

      newLIs.push(liElement);
    });

    if (!listNode.parentNode) {
      parentNode.insertBefore(listNode, nextNode);
    }

    listNode = this._mergeListWithPreviousSibiling(listNode);

    this._mergeListWithNextSibiling(listNode);

    return newLIs;
  }
  /**
   * adjust range for list node (OL/UL)
   * according to origin startContainer and endContainer
   * @param {node} startContainer - startContainer
   * @param {node} endContainer - endContainer
   * @param {number} startOffset - startOffset
   * @param {number} endOffset - endOffset
   * @param {array} listNode - node array
   */
  ;

  _proto.adjustRange = function adjustRange(startContainer, endContainer, startOffset, endOffset, listNode) {
    var newStartContainer = dom["a" /* default */].containsNode(listNode[0], startContainer) ? startContainer : listNode[0];
    var newEndContainer = dom["a" /* default */].containsNode(listNode[listNode.length - 1], endContainer) ? endContainer : listNode[listNode.length - 1];
    var newStartOffset = startContainer.nodeName === 'TD' ? 0 : startOffset;
    var newEndOffset = endContainer.nodeName === 'TD' ? 0 : endOffset;
    this.wwe.setSelectionByContainerAndOffset(newStartContainer, newStartOffset, newEndContainer, newEndOffset);
  };

  return WwListManager;
}();

/* harmony default export */ var wwListManager = (wwListManager_WwListManager);
// CONCATENATED MODULE: ./src/js/wwTaskManager.js
/**
 * @fileoverview Implements wysiwyg task manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */




var TASK_CLASS_NAME = 'task-list-item';
var TASK_ATTR_NAME = 'data-te-task';
var TASK_CHECKED_CLASS_NAME = 'checked';
/**
 * Class WwTaskManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */

var wwTaskManager_WwTaskManager = /*#__PURE__*/function () {
  function WwTaskManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;
    /**
     * Name property
     * @type {string}
     */

    this.name = 'task';

    this._init();
  }
  /**
   * Init
   * @private
   */


  var _proto = WwTaskManager.prototype;

  _proto._init = function _init() {
    this._initKeyHandler();

    this._initEvent();

    this.wwe.getEditor().addEventListener('mousedown', function (ev) {
      var style = getComputedStyle(ev.target, ':before');

      if (ev.target.hasAttribute(TASK_ATTR_NAME) && dom["a" /* default */].isInsideButtonBox(style, ev.offsetX, ev.offsetY)) {
        // Prevent cursor focusing
        ev.preventDefault();
        dom["a" /* default */].toggleClass(ev.target, TASK_CHECKED_CLASS_NAME);
      }
    });
  }
  /**
   * Initialize event
   * @private
   */
  ;

  _proto._initEvent = function _initEvent() {
    var _this = this;

    this.eventManager.listen('wysiwygSetValueAfter', function () {
      _this._removeTaskListClass();
    });
  }
  /**
   * Initialize key event handler
   * @private
   */
  ;

  _proto._initKeyHandler = function _initKeyHandler() {
    var _this2 = this;

    this.wwe.addKeyEventHandler('ENTER', function (ev, range) {
      if (_this2.isInTaskList(range)) {
        _this2.wwe.defer(function () {
          var newRange = _this2.wwe.getRange();

          var li = dom["a" /* default */].closest(newRange.startContainer, 'li');

          if (li) {
            removeClass_default()(li, TASK_CHECKED_CLASS_NAME);
          }
        });
      }
    });
  }
  /**
   * Check whether passed range is in task list or not
   * @param {Range} range range
   * @returns {boolean} result
   */
  ;

  _proto.isInTaskList = function isInTaskList(range) {
    var li;

    if (!range) {
      range = this.wwe.getEditor().getSelection().cloneRange();
    }

    if (range.startContainer.nodeType === Node.ELEMENT_NODE && range.startContainer.tagName === 'LI') {
      li = range.startContainer;
    } else {
      var _domUtils$parents = dom["a" /* default */].parents(range.startContainer, 'li');

      li = _domUtils$parents[0];
    }

    return !!li && hasClass_default()(li, TASK_CLASS_NAME);
  }
  /**
   * Unforamt task
   * @param {Node} node target
   */
  ;

  _proto.unformatTask = function unformatTask(node) {
    var li = dom["a" /* default */].closest(node, 'li');
    removeClass_default()(li, TASK_CLASS_NAME);
    removeClass_default()(li, TASK_CHECKED_CLASS_NAME);
    li.removeAttribute(TASK_ATTR_NAME);

    if (!li.getAttribute('class')) {
      li.removeAttribute('class');
    }
  }
  /**
   * Format task
   * @param {Node} node target
   */
  ;

  _proto.formatTask = function formatTask(node) {
    var li = dom["a" /* default */].closest(node, 'li');
    addClass_default()(li, TASK_CLASS_NAME);
    li.setAttribute(TASK_ATTR_NAME, '');
  }
  /**
   * Format task if current range has task class name
   * @private
   */
  ;

  _proto._formatTaskIfNeed = function _formatTaskIfNeed() {
    var range = this.wwe.getEditor().getSelection().cloneRange();

    if (this.isInTaskList(range)) {
      this.formatTask(range.startContainer);
    }
  }
  /**
   * Remove tasklist class
   * @private
   */
  ;

  _proto._removeTaskListClass = function _removeTaskListClass() {
    // because task-list class is block merge normal list and task list
    dom["a" /* default */].findAll(this.wwe.getBody(), '.task-list').forEach(function (node) {
      removeClass_default()(node, 'task-list');
    });
  };

  return WwTaskManager;
}();

/* harmony default export */ var wwTaskManager = (wwTaskManager_WwTaskManager);
// CONCATENATED MODULE: ./src/js/wwTableManager.js
/**
 * @fileoverview Implements wysiwyg table manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */






var isIE10 = browser_default.a.msie && browser_default.a.version === 10;
var TABLE_CLASS_PREFIX = 'te-content-table-';
var isIE10And11 = browser_default.a.msie && (browser_default.a.version === 10 || browser_default.a.version === 11);
var BASIC_CELL_CONTENT = browser_default.a.msie ? '' : '<br>';
var TABLE_CELL_SELECTED_CLASS_NAME = 'te-cell-selected';
/**
 * Class WwTableManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */

var wwTableManager_WwTableManager = /*#__PURE__*/function () {
  function WwTableManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;
    /**
     * Name property
     * @type {string}
     */

    this.name = 'table';
    this._lastCellNode = null;

    this._init();
  }
  /**
   * Initialize
   * @private
   */


  var _proto = WwTableManager.prototype;

  _proto._init = function _init() {
    this._initKeyHandler();

    this._initEvent();

    this.tableID = 0;
  }
  /**
   * Initialize event
   * @private
   */
  ;

  _proto._initEvent = function _initEvent() {
    var _this = this;

    this.eventManager.listen('wysiwygRangeChangeAfter.table', function () {
      var range = _this.wwe.getEditor().getSelection();

      var isRangeInTable = _this.wwe.isInTable(range);

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
    }); // remove last br in td or th

    this.eventManager.listen('wysiwygProcessHTMLText.table', function (html) {
      return html.replace(/<br \/>(<\/td>|<\/th>)/g, '$1');
    });
    this.eventManager.listen('cut.table', function () {
      var selectionManager = _this.wwe.componentManager.getManager('tableSelection');

      var selectedCells = selectionManager.getSelectedCells();

      if (selectedCells.length) {
        selectedCells.forEach(function (cell) {
          cell.innerHTML = BASIC_CELL_CONTENT;
        });
      }

      selectionManager.removeClassAttrbuteFromAllCellsIfNeed();
    });
    this.eventManager.listen('copyBefore.table', function (_ref) {
      var clipboardContainer = _ref.clipboardContainer;
      return _this.updateTableHtmlOfClipboardIfNeed(clipboardContainer);
    });
  }
  /**
   * Update table html of clipboard data, if has selected cells.
   * @param {HTMLElement} clipboardContainer - clipboard element
   */
  ;

  _proto.updateTableHtmlOfClipboardIfNeed = function updateTableHtmlOfClipboardIfNeed(clipboardContainer) {
    var _this2 = this;

    var selectionManager = this.wwe.componentManager.getManager('tableSelection');
    var selectedCells = selectionManager.getSelectedCells();

    if (selectedCells.length) {
      selectionManager.createRangeBySelectedCells();
      var fragment = this.wwe.getEditor().getSelection().cloneContents();
      toArray_default()(fragment.children).forEach(function (node) {
        if (!_this2.isTableOrSubTableElement(node.nodeName)) {
          return;
        }

        if (node.nodeName === 'TABLE' && node.querySelector('thead') && node.querySelector('tbody')) {
          dom["a" /* default */].remove(node);
        } else if (node.previousSibling && node.previousSibling.nodeName === 'TABLE') {
          node.previousSibling.appendChild(node);
        } else {
          _this2._completeIncompleteTable(node);

          if (node.nodeName !== 'TABLE' && node.nodeName !== 'THEAD') {
            var thead = dom["a" /* default */].closest(node, 'table').querySelector('thead');
            dom["a" /* default */].remove(thead);
          }
        }
      });
      clipboardContainer.appendChild(fragment);
      dom["a" /* default */].findAll(clipboardContainer, "." + TABLE_CELL_SELECTED_CLASS_NAME).forEach(function (cell) {
        removeClass_default()(cell, TABLE_CELL_SELECTED_CLASS_NAME);
      });
    }
  }
  /**
   * Paste clibpard data that contains only table.
   * @param {Node} clipboardTable - table element of clipboard
   */
  ;

  _proto.pasteTableData = function pasteTableData(clipboardTable) {
    this._expandTableIfNeed(clipboardTable);

    this._pasteDataIntoTable(clipboardTable);
  }
  /**
   * Initialize key event handler
   * @private
   */
  ;

  _proto._initKeyHandler = function _initKeyHandler() {
    var _this3 = this;

    this.keyEventHandlers = {
      DEFAULT: function DEFAULT(ev, range, keymap) {
        var isRangeInTable = _this3.wwe.isInTable(range);

        if (isRangeInTable && !_this3._isModifierKey(keymap)) {
          _this3._recordUndoStateIfNeed(range);

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
      ENTER: function ENTER(ev, range) {
        var isNeedNext;

        if (_this3._isAfterTable(range)) {
          ev.preventDefault();
          range.setStart(range.startContainer, range.startOffset - 1);

          _this3.wwe.breakToNewDefaultBlock(range);

          isNeedNext = false;
        } else if (_this3._isBeforeTable(range)) {
          ev.preventDefault();

          _this3.wwe.breakToNewDefaultBlock(range, 'before');

          isNeedNext = false;
        } else if (_this3.wwe.isInTable(range)) {
          if (!_this3._isInList(range.startContainer) && _this3._isInStyledText(range)) {
            _this3.wwe.defer(function () {
              _this3._removeBRinStyleText();
            });
          } else if (_this3._isEmptyFirstLevelLI(range)) {
            _this3.wwe.defer(function () {
              // Squire make div when LI level is decreased in first level so should replace div to br
              var afterRange = _this3.wwe.getRange().cloneRange();

              var div = afterRange.startContainer;
              var br = document.createElement('br');
              div.parentNode.replaceChild(br, div);
              afterRange.setStartBefore(br);
              afterRange.collapse(true);

              _this3.wwe.getEditor().setSelection(afterRange);
            });
          }

          _this3._appendBrIfTdOrThNotHaveAsLastChild(range);

          isNeedNext = false;
        }

        return isNeedNext;
      },
      BACK_SPACE: function BACK_SPACE(ev, range, keymap) {
        return _this3._handleBackspaceAndDeleteKeyEvent(ev, range, keymap);
      },
      DELETE: function DELETE(ev, range, keymap) {
        return _this3._handleBackspaceAndDeleteKeyEvent(ev, range, keymap);
      },
      TAB: function TAB() {
        return _this3._moveCursorTo('next', 'cell');
      },
      'SHIFT+TAB': function SHIFTTAB(ev) {
        return _this3._moveCursorTo('previous', 'cell', ev);
      },
      UP: function UP(ev) {
        return _this3._moveCursorTo('previous', 'row', ev);
      },
      DOWN: function DOWN(ev) {
        return _this3._moveCursorTo('next', 'row', ev);
      }
    };
    forEachOwnProperties_default()(this.keyEventHandlers, function (handler, key) {
      return _this3.wwe.addKeyEventHandler(key, handler);
    });
  }
  /**
   * Check whether node is li and empty
   * @param {node} node node
   * @returns {boolean} whether node is li and empty
   * @private
   */
  ;

  _proto._isEmptyListItem = function _isEmptyListItem(node) {
    var childNodes = node.childNodes,
        nodeName = node.nodeName;
    return nodeName === 'LI' && childNodes.length === 1 && childNodes[0].nodeName === 'BR';
  }
  /**
   * Check whether range is in empty LI that is first level
   * @param {range} range range
   * @returns {boolean} whether range is in empty LI that is first level
   * @private
   */
  ;

  _proto._isEmptyFirstLevelLI = function _isEmptyFirstLevelLI(range) {
    var collapsed = range.collapsed,
        startContainer = range.startContainer,
        startOffset = range.startOffset;
    return collapsed && startOffset === 0 && this._isEmptyListItem(startContainer) && dom["a" /* default */].isFirstLevelListItem(startContainer);
  }
  /**
   * Check whether range is in style tag that is like 'B', 'I', 'S', 'SPAN', 'CODE'
   * Those tag is supported in Wysiwyg.
   * @param {Range} range range
   * @returns {Boolean} range is in the style tag
   * @private
   */
  ;

  _proto._isInStyledText = function _isInStyledText(range) {
    var startContainer = range.startContainer;
    var node;

    if (dom["a" /* default */].isTextNode(startContainer)) {
      node = startContainer.parentNode;
    } else {
      node = startContainer;
    }

    return range.collapsed && dom["a" /* default */].isStyledNode(node);
  }
  /**
   * When enter key occur in the styled text, 'br' tag insert in the style tag like 'b', 'i' etc.
   * So in thoes case, 'br' tag would be pulled out in this logic.
   * @private
   */
  ;

  _proto._removeBRinStyleText = function _removeBRinStyleText() {
    var afterRange = this.wwe.getRange();
    var startContainer = afterRange.startContainer,
        startOffset = afterRange.startOffset;
    var styleNode;

    if (startContainer.nodeName === 'TD') {
      // This case is <i>TEST<br></i>|<br>
      styleNode = dom["a" /* default */].getChildNodeByOffset(startContainer, startOffset - 1);
    } else {
      styleNode = dom["a" /* default */].getParentUntil(startContainer, 'TD');
    }

    var brNode = styleNode.querySelector('br');

    if (!brNode) {
      return;
    }

    var _styleNode = styleNode,
        tdNode = _styleNode.parentNode,
        nodeName = _styleNode.nodeName;

    if (nodeName === 'CODE' && !brNode.previousSibling) {
      // cursor is located in the start of text
      // Before Enter : <code>|TEST</code>
      // After Enter  : <code><br>|TEST</code>
      // TO BE        : <br><code>|TEST</code>
      tdNode.insertBefore(brNode, styleNode);
      afterRange.setStart(styleNode, 0);
    } else if (nodeName === 'CODE' && !brNode.nextSibling) {
      // cursor is located in the end of text
      // Before Enter : <code>TEST|</code>
      // After Enter  : <code>TEST<br>|</code>
      // TO BE        : <code>TEST</code><br>|
      tdNode.insertBefore(brNode, styleNode.nextSibling);
      afterRange.setStart(tdNode, dom["a" /* default */].getNodeOffsetOfParent(brNode) + 1);
    } else {
      // [Case 1] cursor is located in the middle of text
      // Before Enter : <i>TE|ST</i>
      // After Enter  : <i>TE<br>|ST</i>
      // TO BE        : <i>TE</i><br><i>|ST</i>
      // [Case 2] cursor is located in the start of text
      // Before Enter : <i>|TEST</i>
      // After Enter  : <i><br>|TEST</i>
      // TO BE        : <i>|</i><br><i>TEST</i>
      // [Case 3] cursor is located in the end of text
      // Before Enter : <i>TEST|</i>
      // After Enter  : <i>TEST<br>|</i>
      // TO BE        : <i>TEST</i><br><i>|</i>
      var newNode = this._splitByBR(styleNode, brNode);

      afterRange.setStart(newNode, 0);
    }

    afterRange.collapse(true);
    this.wwe.getEditor().setSelection(afterRange);
  }
  /**
   * When container node have br node, split container base on br node and pull out BR.
   * After Enter  : <i>TE<br>ST</i>
   * TO BE        : <i>TE</i><br><i>ST</i>
   * @param {Node} container container
   * @param {Node} brNode container
   * @returns {Node} node for positioning of cursor
   * @private
   */
  ;

  _proto._splitByBR = function _splitByBR(container, brNode) {
    var cloneStyleNode = container.cloneNode(true);
    var newBR = document.createElement('br');
    var parentNode = container.parentNode; // Origin style node should be removed the back nodes of br node.

    dom["a" /* default */].removeNodesByDirection(container, brNode, false);
    brNode.parentNode.removeChild(brNode); // Cloned style node should be removed the front nodes of br node

    var clonedBR = cloneStyleNode.querySelector('br');
    dom["a" /* default */].removeNodesByDirection(cloneStyleNode, clonedBR, true);
    clonedBR.parentNode.removeChild(clonedBR);
    parentNode.insertBefore(cloneStyleNode, container.nextSibling);
    parentNode.insertBefore(newBR, cloneStyleNode);
    var leafNode = dom["a" /* default */].getLeafNode(cloneStyleNode);

    if (!dom["a" /* default */].getTextLength(leafNode)) {
      leafNode.textContent = "\u200B";
    }

    return leafNode;
  }
  /**
   * Check whether passed range is right before table or not
   * @param {Range} range range
   * @returns {boolean} result
   * @private
   */
  ;

  _proto._isBeforeTable = function _isBeforeTable(range) {
    return dom["a" /* default */].getNodeName(dom["a" /* default */].getChildNodeByOffset(range.startContainer, range.startOffset)) === 'TABLE';
  }
  /**
   * Check whether passed range is right after table or not
   * @param {Range} range range
   * @returns {boolean} result
   * @private
   */
  ;

  _proto._isAfterTable = function _isAfterTable(range) {
    var prevElem = dom["a" /* default */].getPrevOffsetNodeUntil(range.startContainer, range.startOffset);
    return dom["a" /* default */].getNodeName(prevElem) === 'TABLE' && range.commonAncestorContainer === this.wwe.getBody();
  }
  /**
   * Handle backspace and delete key event
   * @param {object} ev - Event object
   * @param {Range} range - Range Object
   * @param {string} keymap - keymap
   * @returns {boolean} - need next
   * @private
   */
  ;

  _proto._handleBackspaceAndDeleteKeyEvent = function _handleBackspaceAndDeleteKeyEvent(ev, range, keymap) {
    var isBackspace = keymap === 'BACK_SPACE';
    var selectionManager = this.wwe.componentManager.getManager('tableSelection');
    var selectedCells = selectionManager.getSelectedCells();
    var isNeedNext = true;

    if (range.collapsed) {
      if (this.wwe.isInTable(range)) {
        if (isBackspace) {
          this._tableHandlerOnBackspace(range, ev);
        } else {
          this._tableHandlerOnDelete(range, ev);
        }

        this._removeContentsAndChangeSelectionIfNeed(range, keymap, ev);

        isNeedNext = false;
      } else if (!isBackspace && this._isBeforeTable(range) || isBackspace && this._isAfterTable(range)) {
        ev.preventDefault();
        var startOffset = isBackspace ? range.startOffset - 1 : range.startOffset;

        this._removeTable(range, dom["a" /* default */].getChildNodeByOffset(range.startContainer, startOffset));

        isNeedNext = false;
      }
    } else if (this.wwe.isInTable(range)) {
      if (selectedCells.length > 0) {
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
   * Move Li node to previous node that is previous node of list node.
   * @param {node} liNode li node
   * @param {range} range range
   * @private
   */
  ;

  _proto._moveListItemToPreviousOfList = function _moveListItemToPreviousOfList(liNode, range) {
    var listNode = liNode.parentNode,
        firstChild = liNode.firstChild;
    var fragment = document.createDocumentFragment();
    dom["a" /* default */].mergeNode(liNode, fragment);
    listNode.parentNode.insertBefore(fragment, listNode);
    range.setStart(firstChild, 0);
    range.collapse(true);
    this.wwe.getEditor().setSelection(range);

    if (!listNode.hasChildNodes()) {
      listNode.parentNode.removeChild(listNode);
    }
  };

  _proto._isInList = function _isInList(targetNode) {
    return dom["a" /* default */].getParentUntilBy(targetNode, function (node) {
      return node && (dom["a" /* default */].isListNode(node) || node.nodeName === 'LI');
    }, function (node) {
      return node && (node.nodeName === 'TD' || node.nodeName === 'TH');
    });
  }
  /**
   * Find LI node while search parentNode inside TD
   * @param {node} startContainer startContainer
   * @returns {node} liNode or null
   * @private
   */
  ;

  _proto._findListItem = function _findListItem(startContainer) {
    return dom["a" /* default */].getParentUntilBy(startContainer, function (node) {
      return node && dom["a" /* default */].isListNode(node);
    }, function (node) {
      return node && (node.nodeName === 'TD' || node.nodeName === 'TH');
    });
  }
  /**
   * Backspace handler in table
   * @param {Range} range range
   * @param {Event} event event
   * @private
   */
  ;

  _proto._tableHandlerOnBackspace = function _tableHandlerOnBackspace(range, event) {
    var startContainer = range.startContainer,
        startOffset = range.startOffset;

    var liNode = this._findListItem(startContainer);

    if (liNode && startOffset === 0 && dom["a" /* default */].isFirstListItem(liNode) && dom["a" /* default */].isFirstLevelListItem(liNode)) {
      this.wwe.getEditor().saveUndoState(range);

      this._moveListItemToPreviousOfList(liNode, range);

      event.preventDefault();
    } else {
      var prevNode = dom["a" /* default */].getPrevOffsetNodeUntil(startContainer, startOffset, 'TR');
      var prevNodeName = dom["a" /* default */].getNodeName(prevNode);

      if (prevNodeName === 'BR' && prevNode.parentNode.childNodes.length !== 1) {
        event.preventDefault();
        dom["a" /* default */].remove(prevNode);
      }
    }
  }
  /**
   * Return whether delete br in the br
   * @param {Range} range Range object
   * @returns {boolean}
   * @private
   */
  ;

  _proto._isDeletingBR = function _isDeletingBR(range) {
    var currentNode = this._getCurrentNodeInCell(range);

    var nextSibling = currentNode && currentNode.nextSibling;
    return dom["a" /* default */].getNodeName(currentNode) === 'BR' && !!nextSibling && dom["a" /* default */].getNodeName(nextSibling) === 'BR';
  };

  _proto._getCurrentNodeInCell = function _getCurrentNodeInCell(range) {
    var startContainer = range.startContainer,
        startOffset = range.startOffset;
    var currentNode;

    if (dom["a" /* default */].getNodeName(startContainer) === 'TD') {
      currentNode = dom["a" /* default */].getChildNodeByOffset(startContainer, startOffset);
    } else if (dom["a" /* default */].getParentUntil(startContainer, 'TD')) {
      currentNode = startContainer;
    }

    return currentNode;
  }
  /**
   * Check whether range is located in end of the list
   * @param {Node} liNode liNode
   * @param {Range} range range
   * @returns {Boolean} whether range is located in end of the list
   * @private
   */
  ;

  _proto._isEndOfList = function _isEndOfList(liNode, range) {
    var startContainer = range.startContainer,
        startOffset = range.startOffset;
    var result = false;

    if (!liNode.nextSibling) {
      if (liNode === startContainer) {
        var liNodeOffset = dom["a" /* default */].getOffsetLength(liNode);

        if (liNode.lastChild.nodeName === 'BR') {
          liNodeOffset -= 1;
        }

        result = liNodeOffset === startOffset;
      } else {
        var parentNode = dom["a" /* default */].getParentUntil(startContainer, 'li') || startContainer;
        var startContainerOffset = dom["a" /* default */].getOffsetLength(startContainer);
        var lastChild = liNode.lastChild;

        if (lastChild.nodeName === 'BR') {
          lastChild = lastChild.previousSibling;
        }

        result = lastChild === parentNode && startContainerOffset === startOffset;
      }
    }

    return result;
  }
  /**
   * Get next line nodes from target node
   * @param {Node} node target node
   * @returns {DocumentFragment} next line nodes
   * @private
   */
  ;

  _proto._getNextLineNode = function _getNextLineNode(node) {
    var fragment = document.createDocumentFragment();
    var parentNode = dom["a" /* default */].getParentUntil(node, 'TD');
    var nextSibling = parentNode.nextSibling;

    while (nextSibling) {
      var _nextSibling = nextSibling,
          next = _nextSibling.nextSibling;
      fragment.appendChild(nextSibling);

      if (nextSibling.nodeName === 'BR') {
        break;
      }

      nextSibling = next;
    }

    return fragment;
  }
  /**
   * Delete handler in table
   * @param {Range} range range
   * @param {Event} event event
   * @private
   */
  ;

  _proto._tableHandlerOnDelete = function _tableHandlerOnDelete(range, event) {
    var liNode = this._findListItem(range.startContainer);

    if (liNode && this._isEndOfList(liNode, range)) {
      this.wwe.getEditor().saveUndoState(range);

      if (liNode.lastChild.nodeName === 'BR') {
        liNode.removeChild(liNode.lastChild);
      }

      dom["a" /* default */].mergeNode(this._getNextLineNode(liNode), liNode);
      event.preventDefault();
    } else if (this._isDeletingBR(range)) {
      var currentNode = this._getCurrentNodeInCell(range);

      currentNode.parentNode.removeChild(currentNode.nextSibling);
      event.preventDefault();
    }
  }
  /**
   * Append br if td or th doesn't have br as last child
   * @param {Range} range range
   * @private
   */
  ;

  _proto._appendBrIfTdOrThNotHaveAsLastChild = function _appendBrIfTdOrThNotHaveAsLastChild(range) {
    var startContainerNodeName = dom["a" /* default */].getNodeName(range.startContainer);
    var tdOrTh;

    if (startContainerNodeName === 'TD' || startContainerNodeName === 'TH') {
      tdOrTh = range.startContainer;
    } else {
      var paths = dom["a" /* default */].parentsUntil(range.startContainer, 'tr');
      tdOrTh = paths[paths.length - 1];
    }

    var nodeName = dom["a" /* default */].getNodeName(tdOrTh.lastChild);

    if (nodeName !== 'BR' && nodeName !== 'DIV' && nodeName !== 'UL' && nodeName !== 'OL' && !isIE10And11) {
      dom["a" /* default */].append(tdOrTh, '<br />');
    }
  }
  /**
   * Unwrap default block tag in table
   * For Squire default action making abnormal behavior, remove default blocks in Table after setValue() called
   * @private
   */
  ;

  _proto._unwrapBlockInTable = function _unwrapBlockInTable() {
    var blocks = dom["a" /* default */].findAll(this.wwe.getBody(), 'td div,th div,tr>br,td>br,th>br');
    blocks.forEach(function (node) {
      if (dom["a" /* default */].getNodeName(node) === 'BR') {
        var parentNodeName = dom["a" /* default */].getNodeName(node.parentNode);
        var isInTableCell = /TD|TH/.test(parentNodeName);
        var isEmptyTableCell = node.parentNode.textContent.length === 0;
        var isLastBR = node.parentNode.lastChild === node;

        if (parentNodeName === 'TR' || isInTableCell && !isEmptyTableCell && isLastBR) {
          dom["a" /* default */].remove(node);
        }
      } else {
        dom["a" /* default */].unwrap(node);
      }
    });
  }
  /**
   * Insert default block between table element
   * @private
   */
  ;

  _proto._insertDefaultBlockBetweenTable = function _insertDefaultBlockBetweenTable() {
    var tables = dom["a" /* default */].findAll(this.wwe.getBody(), 'table');
    tables.forEach(function (node) {
      if (node.nextElementSibling && node.nextElementSibling.nodeName === 'TABLE') {
        var insertedElement = document.createElement('div');
        insertedElement.appendChild(document.createElement('br'));
        dom["a" /* default */].insertAfter(insertedElement, node);
      }
    });
  }
  /**
   * Remove table
   * @param {Range} range range
   * @param {Node} table table
   * @private
   */
  ;

  _proto._removeTable = function _removeTable(range, table) {
    if (table.tagName === 'TABLE') {
      this.wwe.getEditor().saveUndoState(range);
      this.wwe.saveSelection(range);
      dom["a" /* default */].remove(table);
      this.wwe.restoreSavedSelection();
    }
  }
  /**
   * record undo state if need
   * @param {Range} range range
   * @private
   */
  ;

  _proto._recordUndoStateIfNeed = function _recordUndoStateIfNeed(range) {
    var currentCellNode = dom["a" /* default */].getParentUntil(range.startContainer, 'TR');

    if (range.collapsed && currentCellNode && this._lastCellNode !== currentCellNode) {
      this.wwe.getEditor().saveUndoState(range);
      this._lastCellNode = currentCellNode;
    }
  }
  /**
   * record undo state and reset last cell node
   * @param {Range} range range
   * @private
   */
  ;

  _proto._recordUndoStateAndResetCellNode = function _recordUndoStateAndResetCellNode(range) {
    this.wwe.getEditor().saveUndoState(range);
    this.resetLastCellNode();
  }
  /**
   * Paste table data into table element
   * @param {DocumentFragment} fragment Fragment of table element within
   * @private
   */
  ;

  _proto._pasteDataIntoTable = function _pasteDataIntoTable(fragment) {
    var _this$wwe$getEditor$g = this.wwe.getEditor().getSelection(),
        startContainer = _this$wwe$getEditor$g.startContainer;

    var tableData = this._getTableDataFromTable(fragment);

    var isTableCell = startContainer.nodeName === 'TD' || startContainer.nodeName === 'TH';
    var brString = isIE10 ? '' : '<br />';
    var anchorElement, td, tr, tdContent;

    if (isTableCell) {
      anchorElement = startContainer;
    } else {
      anchorElement = dom["a" /* default */].getParentUntilBy(startContainer, function (node) {
        return node && (node.nodeName === 'TD' || node.nodeName === 'TH');
      }, function (node) {
        return !!dom["a" /* default */].closest(node, 'table');
      });
      anchorElement = anchorElement ? anchorElement.parentNode : null;
    }

    anchorElement = anchorElement ? anchorElement : startContainer.querySelector('th,td');
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

        td = dom["a" /* default */].getTableCellByDirection(td, 'next');
      }

      td = dom["a" /* default */].getSiblingRowCellByDirection(anchorElement, 'next', false);
      anchorElement = td;
    }
  }
  /**
   * Get array data from table element
   * @param {DocumentFragment} fragment table element
   * @returns {Array}
   * @private
   */
  ;

  _proto._getTableDataFromTable = function _getTableDataFromTable(fragment) {
    var tableData = [];
    dom["a" /* default */].findAll(fragment, 'tr').forEach(function (tr) {
      var trData = [];
      toArray_default()(tr.children).forEach(function (cell) {
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
   * @param {HTMLElement} selectedCells Selected cells
   * @private
   */
  ;

  _proto._removeTableContents = function _removeTableContents(selectedCells) {
    this.wwe.getEditor().saveUndoState();
    toArray_default()(selectedCells).forEach(function (cell) {
      var brHTMLString = isIE10 ? '' : '<br />';
      cell.innerHTML = brHTMLString;
    });
  }
  /**
   * Wrap dangling table cells with new TR
   * @param {HTMLElement} container - clipboard container
   * @returns {HTMLElement|null}
   */
  ;

  _proto.wrapDanglingTableCellsIntoTrIfNeed = function wrapDanglingTableCellsIntoTrIfNeed(container) {
    var danglingTableCells = dom["a" /* default */].children(container, 'td,th');
    var tr;

    if (danglingTableCells.length) {
      var wrapperTr = document.createElement('tr');
      toArray_default()(danglingTableCells).forEach(function (cell) {
        dom["a" /* default */].append(wrapperTr, cell);
      });
      tr = wrapperTr;
    }

    return tr;
  }
  /**
   * Wrap TRs with new TBODY
   * @param {HTMLElement} container - clipboard container
   * @returns {HTMLElement|null}
   */
  ;

  _proto.wrapTrsIntoTbodyIfNeed = function wrapTrsIntoTbodyIfNeed(container) {
    var danglingTrs = dom["a" /* default */].children(container, 'tr');
    var ths = [];
    toArray_default()(danglingTrs).forEach(function (tr) {
      ths = ths.concat(tr.querySelectorAll('th'));
    });
    var tbody;

    if (ths.length) {
      toArray_default()(ths).forEach(function (node) {
        var td = document.createElement('td');
        td.innerHTML = node.innerHTML;
        dom["a" /* default */].insertBefore(node, td);
        dom["a" /* default */].remove(node);
      });
    }

    if (danglingTrs.length) {
      var wrapperTableBody = document.createElement('tbody');
      toArray_default()(danglingTrs).forEach(function (tr) {
        dom["a" /* default */].append(wrapperTableBody, tr);
      });
      tbody = wrapperTableBody;
    }

    return tbody;
  }
  /**
   * Wrap THEAD followed by TBODY both into Table
   * @param {HTMLElement} container - clipboard container
   * @returns {HTMLElement|null}
   */
  ;

  _proto.wrapTheadAndTbodyIntoTableIfNeed = function wrapTheadAndTbodyIntoTableIfNeed(container) {
    var danglingThead = dom["a" /* default */].children(container, 'thead');
    var danglingTbody = dom["a" /* default */].children(container, 'tbody');
    var wrapperTable = document.createElement('table');
    var table;

    if (!danglingTbody.length && danglingThead.length) {
      dom["a" /* default */].append(wrapperTable, danglingThead[0]);
      dom["a" /* default */].append(wrapperTable, this._createTheadOrTboday('tbody'));
      table = wrapperTable;
    } else if (danglingTbody.length && !danglingThead.length) {
      dom["a" /* default */].append(wrapperTable, this._createTheadOrTboday('thead'));
      dom["a" /* default */].append(wrapperTable, danglingTbody[0]);
      table = wrapperTable;
    } else if (danglingTbody.length && danglingThead.length) {
      dom["a" /* default */].append(wrapperTable, danglingThead[0]);
      dom["a" /* default */].append(wrapperTable, danglingTbody[0]);
      table = wrapperTable;
    }

    return table;
  }
  /**
   * Whether pasting element is table element
   * @param {string} pastingNodeName Pasting node name
   * @returns {boolean}
   */
  ;

  _proto.isTableOrSubTableElement = function isTableOrSubTableElement(pastingNodeName) {
    return pastingNodeName === 'TABLE' || pastingNodeName === 'TBODY' || pastingNodeName === 'THEAD' || pastingNodeName === 'TR' || pastingNodeName === 'TD';
  };

  _proto._createTheadOrTboday = function _createTheadOrTboday(type) {
    var theadOrTbody = document.createElement(type);
    var tr = document.createElement('tr');
    theadOrTbody.appendChild(tr);
    return theadOrTbody;
  }
  /**
   * Stuff table cells into incomplete rows
   * @param {HTMLElement} trs HTMLElement wrapped TRs
   * @param {number} maximumCellLength maximum cell length of table
   * @private
   */
  ;

  _proto._stuffTableCellsIntoIncompleteRow = function _stuffTableCellsIntoIncompleteRow(trs, maximumCellLength) {
    toArray_default()(trs).forEach(function (row) {
      var tableCells = row.querySelectorAll('th,td');
      var parentNodeName = dom["a" /* default */].getNodeName(row.parentNode);
      var cellTagName = parentNodeName === 'THEAD' ? 'th' : 'td';

      for (var cellLength = tableCells.length; cellLength < maximumCellLength; cellLength += 1) {
        dom["a" /* default */].append(row, tableCellGenerator(1, cellTagName));
      }
    });
  }
  /**
   * Prepare to table cell stuffing
   * @param {HTMLElement} trs wrapped TRs
   * @returns {{maximumCellLength: *, needTableCellStuffingAid: boolean}}
   */
  ;

  _proto.prepareToTableCellStuffing = function prepareToTableCellStuffing(trs) {
    var maximumCellLength = trs[0].querySelectorAll('th,td').length;
    var needTableCellStuffingAid = false;
    toArray_default()(trs).forEach(function (row) {
      var cellCount = row.querySelectorAll('th,td').length;

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
   * @param {HTMLElement} table - Table HTMLElement element
   * @private
   */
  ;

  _proto._addTbodyOrTheadIfNeed = function _addTbodyOrTheadIfNeed(table) {
    var isTheadNotExists = !table.querySelector('thead');
    var isTbodyNotExists = !table.querySelector('tbody');

    if (isTheadNotExists) {
      dom["a" /* default */].prepend(table, '<thead><tr></tr></thead>');
    } else if (isTbodyNotExists) {
      dom["a" /* default */].append(table, '<tbody><tr></tr></tbody>');
    }
  }
  /**
   * Append table cells
   * @param {HTMLElement} table Table element
   */
  ;

  _proto.tableCellAppendAidForTableElement = function tableCellAppendAidForTableElement(table) {
    this._addTbodyOrTheadIfNeed(table);

    this._addTrIntoContainerIfNeed(table);

    var trs = table.querySelectorAll('tr');
    var tableAidInformation = this.prepareToTableCellStuffing(trs);
    var maximumCellLength = tableAidInformation.maximumCellLength,
        needTableCellStuffingAid = tableAidInformation.needTableCellStuffingAid;

    if (needTableCellStuffingAid) {
      this._stuffTableCellsIntoIncompleteRow(trs, maximumCellLength);
    }
  }
  /**
   * Generate THEAD and append TDs with same amount of given TBODY
   * @param {HTMLElement} node TR element
   * @returns {{thead: HTMLElement, tbody: HTMLElement}}
   * @private
   */
  ;

  _proto._generateTheadAndTbodyFromTbody = function _generateTheadAndTbodyFromTbody(node) {
    var tr = document.createElement('tr');
    var thead = document.createElement('thead');
    dom["a" /* default */].append(tr, tableCellGenerator(node.querySelector('tr > td').length, 'th'));
    dom["a" /* default */].append(thead, tr);
    return {
      thead: thead,
      tbody: node
    };
  }
  /**
   * Generate TBODY and append TDs with same amount of given THEAD
   * @param {HTMLElement} node TR element
   * @returns {{thead: HTMLElement, tbody: HTMLElement}}
   * @private
   */
  ;

  _proto._generateTheadAndTbodyFromThead = function _generateTheadAndTbodyFromThead(node) {
    var tr = document.createElement('tr');
    var tbody = document.createElement('tbody');
    dom["a" /* default */].append(tr, tableCellGenerator(node.querySelectorAll('th').length, 'td'));
    dom["a" /* default */].append(tbody, tr);
    return {
      thead: node,
      tbody: tbody
    };
  }
  /**
   * Generate THEAD and TBODY and append given TR within
   * @param {HTMLElement} node TR element
   * @returns {{thead: HTMLElement, tbody: HTMLElement}}
   * @private
   */
  ;

  _proto._generateTheadAndTbodyFromTr = function _generateTheadAndTbodyFromTr(node) {
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');
    var theadRow, tbodyRow;

    if (node.children[0].tagName === 'TH') {
      theadRow = node;
      tbodyRow = dom["a" /* default */].createElementWith("<tr>" + tableCellGenerator(node.querySelectorAll('th').length, 'td') + "</tr>");
    } else {
      theadRow = dom["a" /* default */].createElementWith("<tr>" + tableCellGenerator(node.querySelectorAll('td').length, 'th') + "</tr>");
      tbodyRow = node;
    }

    dom["a" /* default */].append(thead, theadRow);
    dom["a" /* default */].append(tbody, tbodyRow);
    return {
      thead: thead,
      tbody: tbody
    };
  }
  /**
   * Complete passed table
   * @param {HTMLElement} node - Table inner element
   * @private
   */
  ;

  _proto._completeIncompleteTable = function _completeIncompleteTable(node) {
    var nodeName = node.tagName;
    var table, completedTableContents;

    if (nodeName === 'TABLE') {
      table = node;
    } else {
      table = document.createElement('table');
      node.parentNode.insertBefore(table, node.nextSibling);

      if (nodeName === 'TBODY') {
        completedTableContents = this._generateTheadAndTbodyFromTbody(node);
      } else if (nodeName === 'THEAD') {
        completedTableContents = this._generateTheadAndTbodyFromThead(node);
      } else if (nodeName === 'TR') {
        completedTableContents = this._generateTheadAndTbodyFromTr(node);
      }

      table.appendChild(completedTableContents.thead);
      table.appendChild(completedTableContents.tbody);
    }

    this._removeEmptyRows(table);

    this.tableCellAppendAidForTableElement(table);
  };

  _proto._removeEmptyRows = function _removeEmptyRows(table) {
    dom["a" /* default */].findAll(table, 'tr').forEach(function (tr) {
      if (!tr.cells.length) {
        tr.parentNode.removeChild(tr);
      }
    });
  }
  /**
   * Whole editor body searching incomplete table completion
   * @private
   */
  ;

  _proto._completeTableIfNeed = function _completeTableIfNeed() {
    var _this4 = this;

    var body = this.wwe.getEditor().getBody();
    toArray_default()(body.children).forEach(function (node) {
      if (!_this4.isTableOrSubTableElement(node.nodeName)) {
        return;
      }

      if (node.nodeName === 'TABLE' && !node.querySelector('tbody')) {
        dom["a" /* default */].remove(node);
      } else {
        _this4._completeIncompleteTable(node);
      }
    });
  }
  /**
   * Reset _lastCellNode to null
   */
  ;

  _proto.resetLastCellNode = function resetLastCellNode() {
    this._lastCellNode = null;
  }
  /**
   * Set _lastCellNode to given node
   * @param {HTMLElement} node Table cell
   */
  ;

  _proto.setLastCellNode = function setLastCellNode(node) {
    this._lastCellNode = node;
  }
  /**
   * Return whether only modifier key pressed or not
   * @param {string} keymap Pressed keymap string
   * @returns {boolean}
   * @private
   */
  ;

  _proto._isModifierKey = function _isModifierKey(keymap) {
    return /((META|SHIFT|ALT|CONTROL)\+?)/g.test(keymap);
  }
  /**
   * Return whether modifier keys pressed or not
   * @param {object} ev keyboard event object
   * @returns {boolean}
   * @private
   */
  ;

  _proto._isModifierKeyPushed = function _isModifierKeyPushed(ev) {
    return ev.metaKey || ev.ctrlKey || ev.altKey || ev.shiftKey;
  }
  /**
   * Add one row into empty TBODY
   * @param {HTMLElement} table Currently processing table
   * @private
   */
  ;

  _proto._addTrIntoContainerIfNeed = function _addTrIntoContainerIfNeed(table) {
    toArray_default()(table.children).forEach(function (container) {
      var hasNoRows = container.querySelectorAll('tr').length === 0;

      if (hasNoRows) {
        dom["a" /* default */].append(container, '<tr></tr>');
      }
    });
  };

  _proto._expandTableIfNeed = function _expandTableIfNeed(fragment) {
    var range = this.wwe.getEditor().getSelection().cloneRange();

    var _domUtils$parents = dom["a" /* default */].parents(range.startContainer, 'table'),
        table = _domUtils$parents[0];

    var difference = this._getColumnAndRowDifference(fragment, range);

    if (difference.column < 0) {
      this._appendCellForAllRow(table, difference.column);
    }

    if (difference.row < 0) {
      this._appendRow(table, difference.row);
    }
  };

  _proto._getColumnAndRowDifference = function _getColumnAndRowDifference(fragment, range) {
    var tableData = this._getTableDataFromTable(fragment);

    var rowLength = tableData.length;
    var columnLength = tableData[0].length;
    var currentCell = dom["a" /* default */].closest(range.startContainer, 'th,td');
    var currentRow = currentCell.parentNode;
    var currentColumnIndex = dom["a" /* default */].getNodeOffsetOfParent(currentCell);
    var currentRowIndex = dom["a" /* default */].getNodeOffsetOfParent(currentCell.parentNode);

    var _domUtils$parents2 = dom["a" /* default */].parents(currentRow, 'table'),
        table = _domUtils$parents2[0];

    var tableColumnLength = table.querySelector('tr').children.length;
    var tableRowLength = table.querySelectorAll('tr').length;
    var isInTbody = !!dom["a" /* default */].parents(currentRow, 'tbody').length;

    if (isInTbody) {
      currentRowIndex += 1;
    }

    return {
      row: tableRowLength - (currentRowIndex + rowLength),
      column: tableColumnLength - (currentColumnIndex + columnLength)
    };
  };

  _proto._appendCellForAllRow = function _appendCellForAllRow(table, columnDifference) {
    var brString = isIE10 ? '' : '<br />';
    dom["a" /* default */].findAll(table, 'tr').forEach(function (row, i) {
      var tagName;

      for (var index = columnDifference; index < 0; index += 1) {
        if (i === 0) {
          tagName = 'th';
        } else {
          tagName = 'td';
        }

        dom["a" /* default */].append(row, "<" + tagName + ">" + brString + "</" + tagName + ">");
      }
    });
  };

  _proto._appendRow = function _appendRow(table, rowDifference) {
    var trs = table.querySelectorAll('tr');
    var newRow = trs[trs.length - 1].cloneNode(true);
    var brHTMLSting = isIE10 ? '' : '<br />';
    dom["a" /* default */].findAll(newRow, 'td').forEach(function (td) {
      td.innerHTML = brHTMLSting;
    });

    for (; rowDifference < 0; rowDifference += 1) {
      dom["a" /* default */].append(table.querySelector('tbody'), newRow.cloneNode(true));
    }
  }
  /**
   * Change selection to sibling cell
   * @param {HTMLElement} currentCell current TD or TH
   * @param {Range} range Range object
   * @param {string} direction 'next' or 'previous'
   * @param {string} scale 'row' or 'cell'
   * @private
   */
  ;

  _proto._changeSelectionToTargetCell = function _changeSelectionToTargetCell(currentCell, range, direction, scale) {
    var isNext = direction === 'next';
    var isRow = scale === 'row';
    var target;

    if (isRow) {
      target = dom["a" /* default */].getSiblingRowCellByDirection(currentCell, direction, false);
    } else {
      target = dom["a" /* default */].getTableCellByDirection(currentCell, direction);

      if (!target) {
        target = dom["a" /* default */].getSiblingRowCellByDirection(currentCell, direction, true);
      }
    }

    if (target) {
      if (isRow && !isNext) {
        this._moveToCursorEndOfCell(target, range);
      } else {
        range.setStart(target, 0);
      }

      range.collapse(true);
    } else {
      var _domUtils$parents3 = dom["a" /* default */].parents(currentCell, 'table');

      target = _domUtils$parents3[0];

      if (isNext) {
        range.setStart(target.nextElementSibling, 0);
      } else if (target.previousElementSibling && target.previousElementSibling.nodeName !== 'TABLE') {
        range.setStart(target.previousElementSibling, 1);
      } else {
        range.setStartBefore(target);
      }

      range.collapse(true);
    }
  };

  _proto._moveToCursorEndOfCell = function _moveToCursorEndOfCell(cell, range) {
    var lastListItem;

    if (dom["a" /* default */].isListNode(cell.lastChild)) {
      lastListItem = dom["a" /* default */].getLastNodeBy(cell.lastChild, function (lastNode) {
        return lastNode.nodeName !== 'LI' || lastNode.nextSibling !== null;
      });
    }

    var lastText = dom["a" /* default */].getLastNodeBy(lastListItem || cell, function (node) {
      return !dom["a" /* default */].isTextNode(node);
    });
    var lastNode = lastText || lastListItem || cell;
    var offset = lastText ? lastText.length : lastNode.childNodes.length - 1;
    range.setStart(lastNode, offset);
  }
  /**
   * Move cursor to given direction by interval formatter
   * @param {string} direction 'next' or 'previous'
   * @param {string} interval 'row' or 'cell'
   * @param {object} [ev] Event object
   * @returns {boolean | null}
   * @private
   */
  ;

  _proto._moveCursorTo = function _moveCursorTo(direction, interval, ev) {
    var sq = this.wwe.getEditor();
    var range = sq.getSelection().cloneRange();
    var currentCell = dom["a" /* default */].closest(range.startContainer, 'td,th');
    var isNeedNext;

    if (range.collapsed && this.wwe.isInTable(range) && currentCell) {
      if (interval === 'row' && !this._isMovedCursorToRow(range, direction)) {
        return isNeedNext;
      }

      if ((direction === 'previous' || interval === 'row') && !isUndefined_default()(ev)) {
        ev.preventDefault();
      }

      this._changeSelectionToTargetCell(currentCell, range, direction, interval);

      sq.setSelection(range);
      isNeedNext = false;
    }

    return isNeedNext;
  };

  _proto._isMovedCursorToRow = function _isMovedCursorToRow(range, direction) {
    var startContainer = range.startContainer;

    if (this._isInList(startContainer)) {
      return this._isMovedCursorFromListToRow(startContainer, direction);
    }

    return this._isMovedCursorFromTextToRow(range, direction);
  };

  _proto._isMovedCursorFromListToRow = function _isMovedCursorFromListToRow(startContainer, direction) {
    var directionKey = direction + "Sibling";

    var listItem = this._findListItem(startContainer);

    var parentOfListItem = dom["a" /* default */].getParentNodeBy(listItem, function (parentNode, currentNode) {
      var firstOrLastItem = currentNode[directionKey] === null && parentNode[directionKey] === null;
      return !dom["a" /* default */].isCellNode(parentNode) && firstOrLastItem;
    });
    var firstOrLastList = dom["a" /* default */].isListNode(parentOfListItem) && parentOfListItem[directionKey] === null;
    return dom["a" /* default */].isCellNode(parentOfListItem.parentNode) && firstOrLastList;
  };

  _proto._isMovedCursorFromTextToRow = function _isMovedCursorFromTextToRow(range, direction) {
    var startContainer = range.startContainer,
        startOffset = range.startOffset;
    var text = dom["a" /* default */].isCellNode(startContainer) ? startContainer.childNodes[startOffset] : startContainer;
    var parentOfStyledText = dom["a" /* default */].getParentNodeBy(text, function (parentNode) {
      return !dom["a" /* default */].isCellNode(parentNode) && !dom["a" /* default */].isTextNode(parentNode);
    });
    var foundSiblingNode = dom["a" /* default */].getSiblingNodeBy(parentOfStyledText, direction, function (siblingNode) {
      return siblingNode !== null && siblingNode.nodeName !== 'BR';
    });
    return foundSiblingNode && foundSiblingNode[direction + "Sibling"] === null;
  }
  /**
   * Remove contents and change selection if need
   * @param {Range} range - Range object
   * @param {string} keymap - keymap
   * @param {object} ev - Event object
   * @returns {boolean} - true if contents has been removed
   * @private
   */
  ;

  _proto._removeContentsAndChangeSelectionIfNeed = function _removeContentsAndChangeSelectionIfNeed(range, keymap, ev) {
    var isTextInput = keymap.length <= 1;
    var isDeleteOperation = keymap === 'BACK_SPACE' || keymap === 'DELETE';
    var selectedCells = this.wwe.componentManager.getManager('tableSelection').getSelectedCells();
    var firstSelectedCell = selectedCells[0];
    var processed = false;

    if ((isTextInput || isDeleteOperation) && !this._isModifierKeyPushed(ev) && selectedCells.length) {
      if (isDeleteOperation) {
        this._recordUndoStateIfNeed(range);
      }

      this._removeTableContents(selectedCells);

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
   */
  ;

  _proto.getTableIDClassName = function getTableIDClassName() {
    var tableClassName = TABLE_CLASS_PREFIX + this.tableID;
    this.tableID += 1;
    return tableClassName;
  }
  /**
   * Destroy.
   */
  ;

  _proto.destroy = function destroy() {
    var _this5 = this;

    this.eventManager.removeEventHandler('wysiwygRangeChangeAfter.table');
    this.eventManager.removeEventHandler('wysiwygSetValueAfter.table');
    this.eventManager.removeEventHandler('wysiwygProcessHTMLText.table');
    this.eventManager.removeEventHandler('cut.table');
    this.eventManager.removeEventHandler('copyBefore.table');
    forEachOwnProperties_default()(this.keyEventHandlers, function (handler, key) {
      return _this5.wwe.removeKeyEventHandler(key, handler);
    });
  };

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
  var cellString = "<" + tagName + ">" + brHTMLString + "</" + tagName + ">";
  var tdString = '';

  for (var i = 0; i < amount; i += 1) {
    tdString = tdString + cellString;
  }

  return tdString;
}

/* harmony default export */ var wwTableManager = (wwTableManager_WwTableManager);
// CONCATENATED MODULE: ./src/js/wwTableSelectionManager.js
/**
 * @fileoverview Implements wysiwyg table selection manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */





var wwTableSelectionManager_TABLE_CELL_SELECTED_CLASS_NAME = 'te-cell-selected';
/**
 * Class WwTableSelectionManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */

var wwTableSelectionManager_WwTableSelectionManager = /*#__PURE__*/function () {
  function WwTableSelectionManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;
    /**
     * Name property
     * @type {string}
     */

    this.name = 'tableSelection';

    this._init();
  }
  /**
   * Initialize
   * @private
   */


  var _proto = WwTableSelectionManager.prototype;

  _proto._init = function _init() {
    this._initEvent(); // For disable firefox's table tool UI and table resize handler


    if (browser_default.a.firefox) {
      document.execCommand('enableObjectResizing', false, 'false');
      document.execCommand('enableInlineTableEditing', false, 'false');
    }
  }
  /**
   * Initialize event
   * @private
   */
  ;

  _proto._initEvent = function _initEvent() {
    var _this = this;

    var selectionStart, selectionEnd, validSelectionEnd;
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
      selectionEnd = dom["a" /* default */].closest(ev.data.target, '[contenteditable=true] td,th');

      var range = _this.wwe.getEditor().getSelection();

      var isEndsInTable = dom["a" /* default */].parents(selectionEnd, '[contenteditable=true] table');
      var isSameCell = selectionStart === selectionEnd;
      var isTextSelect = _this._isTextSelect(range, isSameCell) && !hasClass_default()(selectionStart, wwTableSelectionManager_TABLE_CELL_SELECTED_CLASS_NAME);

      if (_this._isSelectionStarted && isEndsInTable && !isTextSelect) {
        window.getSelection().removeAllRanges(); // For disable firefox's native table cell selection

        if (browser_default.a.firefox && !_this._removeSelectionTimer) {
          _this._removeSelectionTimer = setInterval(function () {
            window.getSelection().removeAllRanges();
          }, 10);
        }

        if (selectionStart && selectionEnd) {
          _this.highlightTableCellsBy(selectionStart, selectionEnd);

          validSelectionEnd = selectionEnd;
        }
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
      selectionEnd = dom["a" /* default */].closest(ev.data.target, '[contenteditable=true] td,th');

      var range = _this.wwe.getEditor().getSelection();

      var isSameCell = selectionStart === selectionEnd;
      var isTextSelect = _this._isTextSelect(range, isSameCell) && !hasClass_default()(selectionStart, wwTableSelectionManager_TABLE_CELL_SELECTED_CLASS_NAME);

      _this._clearTableSelectionTimerIfNeed();

      if (_this._isSelectionStarted) {
        if (isTextSelect || _this._isListSelect(range)) {
          _this.removeClassAttrbuteFromAllCellsIfNeed();
        } else {
          _this.wwe.componentManager.getManager('table').resetLastCellNode();

          selectionEnd = selectionEnd || validSelectionEnd;
          range = _this.wwe.getEditor().getSelection();
          range.setStart(selectionEnd, 0); // IE wont fire copy/cut event if there is no selected range.
          // trick IE to fire the event

          if (browser_default.a.msie) {
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
      selectionStart = dom["a" /* default */].closest(ev.data.target, '[contenteditable=true] td,th');
      var isSelectedCell = !!selectionStart && hasClass_default()(selectionStart, wwTableSelectionManager_TABLE_CELL_SELECTED_CLASS_NAME);
      selectionEnd = null;

      if (!isSelectedCell || isSelectedCell && ev.data.button !== MOUSE_RIGHT_BUTTON) {
        _this.removeClassAttrbuteFromAllCellsIfNeed();

        if (selectionStart) {
          _this.setTableSelectionTimerIfNeed(selectionStart);

          _this.eventManager.listen('mouseover.tableSelection', onMouseover);

          _this.eventManager.listen('mouseup.tableSelection', onMouseup);

          if (_this.onDragStart) {
            _this.onDragStart(selectionStart);
          }
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
  ;

  _proto._isTextSelect = function _isTextSelect(range, isSameCell) {
    return /TD|TH|TEXT/i.test(range.commonAncestorContainer.nodeName) && isSameCell;
  }
  /**
   * Return whether list selection or not
   * @param {Range} range Range object
   * @returns {boolean}
   * @private
   */
  ;

  _proto._isListSelect = function _isListSelect(range) {
    return /UL|OL|LI/i.test(range.commonAncestorContainer.nodeName);
  }
  /**
   * Set setTimeout and setInterval timer execution if table selecting situation
   * @param {HTMLElement} selectionStart Start element
   */
  ;

  _proto.setTableSelectionTimerIfNeed = function setTableSelectionTimerIfNeed(selectionStart) {
    var isTableSelecting = dom["a" /* default */].parents(selectionStart, '[contenteditable=true] table').length;

    if (isTableSelecting) {
      this._isSelectionStarted = true;
    }
  }
  /**
   * Clear setTimeout and setInterval timer execution
   * @private
   */
  ;

  _proto._clearTableSelectionTimerIfNeed = function _clearTableSelectionTimerIfNeed() {
    clearTimeout(this._tableSelectionTimer); // For disable firefox's native table selection

    if (browser_default.a.firefox && this._removeSelectionTimer) {
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
  ;

  _proto._reArrangeSelectionIfneed = function _reArrangeSelectionIfneed(selectionStart, selectionEnd) {
    var isRangeStartInTable = dom["a" /* default */].parents(selectionStart, '[contenteditable=true] table').length;
    var isRangeEndInTable = dom["a" /* default */].parents(selectionEnd, '[contenteditable=true] table').length;
    var isStartRangeOut = isRangeEndInTable && !isRangeStartInTable;
    var isEndRangeOut = !isRangeEndInTable && isRangeStartInTable;
    var table;

    if (isStartRangeOut) {
      var _domUtils$parents = dom["a" /* default */].parents(selectionEnd, '[contenteditable=true] table');

      table = _domUtils$parents[0];

      var _table$querySelectorA = table.querySelectorAll('th');

      selectionStart = _table$querySelectorA[0];
    } else if (isEndRangeOut) {
      var _domUtils$parents2 = dom["a" /* default */].parents(selectionStart, '[contenteditable=true] table');

      table = _domUtils$parents2[0];
      var tds = table.querySelectorAll('td');
      selectionEnd = tds[tds.length - 1];
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
  ;

  _proto._applySelectionDirection = function _applySelectionDirection(selectionInformation, range) {
    var nodeOffsetOfParent = dom["a" /* default */].getNodeOffsetOfParent;
    var selectionStart = selectionInformation.startContainer;
    var selectionEnd = selectionInformation.endContainer;
    var rowDirection = nodeOffsetOfParent(dom["a" /* default */].closest(selectionStart, '[contenteditable=true] tr')) - nodeOffsetOfParent(dom["a" /* default */].closest(selectionEnd, '[contenteditable=true] tr'));
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
   */
  ;

  _proto.getSelectionRangeFromTable = function getSelectionRangeFromTable(selectionStart, selectionEnd) {
    var nodeOffsetOfParent = dom["a" /* default */].getNodeOffsetOfParent;
    var startRowOffset = nodeOffsetOfParent(selectionStart.parentNode);
    var endRowOffset = nodeOffsetOfParent(selectionEnd.parentNode);
    var startCellOffset = nodeOffsetOfParent(selectionStart);
    var endCellOffset = nodeOffsetOfParent(selectionEnd);
    var startCellContainer = dom["a" /* default */].getParentUntil(selectionStart, 'TABLE');
    var endCellContainer = dom["a" /* default */].getParentUntil(selectionEnd, 'TABLE');
    var isReversedTheadAndTbodySelect = dom["a" /* default */].getNodeName(startCellContainer) === 'TBODY' && dom["a" /* default */].getNodeName(endCellContainer) === 'THEAD';
    var isTheadAndTbodySelect = startCellContainer !== endCellContainer;
    var isBothInTbody = !!dom["a" /* default */].parents(selectionStart, 'tbody').length && !!dom["a" /* default */].parents(selectionEnd, 'tbody').length;
    var start = {
      row: startRowOffset,
      cell: startCellOffset
    };
    var end = {
      row: endRowOffset,
      cell: endCellOffset
    };
    var from, to;

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
  ;

  _proto.highlightTableCellsBy = function highlightTableCellsBy(selectionStart, selectionEnd) {
    var trs = dom["a" /* default */].findAll(dom["a" /* default */].parents(selectionStart, '[contenteditable=true] table')[0], 'tr');
    var selection = this.getSelectionRangeFromTable(selectionStart, selectionEnd);
    var rowFrom = selection.from.row;
    var cellFrom = selection.from.cell;
    var rowTo = selection.to.row;
    var cellTo = selection.to.cell;
    trs.forEach(function (row, rowIndex) {
      dom["a" /* default */].findAll(row, 'td,th').forEach(function (cell, cellIndex) {
        var isFromRow = rowIndex === rowFrom;
        var isToRow = rowIndex === rowTo;

        if (isFromRow && cellIndex < cellFrom || isToRow && cellIndex > cellTo || rowIndex < rowFrom || rowIndex > rowTo) {
          removeClass_default()(cell, wwTableSelectionManager_TABLE_CELL_SELECTED_CLASS_NAME);
        } else {
          addClass_default()(cell, wwTableSelectionManager_TABLE_CELL_SELECTED_CLASS_NAME);
        }
      });
    });
  }
  /**
   * Remove '.te-cell-selected' class from all of table Cell
   */
  ;

  _proto.removeClassAttrbuteFromAllCellsIfNeed = function removeClassAttrbuteFromAllCellsIfNeed() {
    var cells = dom["a" /* default */].findAll(this.wwe.getBody(), "td." + wwTableSelectionManager_TABLE_CELL_SELECTED_CLASS_NAME + ",th." + wwTableSelectionManager_TABLE_CELL_SELECTED_CLASS_NAME);
    cells.forEach(function (node) {
      removeClass_default()(node, wwTableSelectionManager_TABLE_CELL_SELECTED_CLASS_NAME);

      if (!node.getAttribute('class')) {
        node.removeAttribute('class');
      }
    });
  }
  /**
   * gets selected cells
   * @returns {HTMLElement} selected cells
   */
  ;

  _proto.getSelectedCells = function getSelectedCells() {
    return this.wwe.getBody().querySelectorAll("." + wwTableSelectionManager_TABLE_CELL_SELECTED_CLASS_NAME);
  }
  /**
   * Create selection by selected cells and collapse that selection to end
   */
  ;

  _proto.createRangeBySelectedCells = function createRangeBySelectedCells() {
    var sq = this.wwe.getEditor();
    var range = sq.getSelection().cloneRange();
    var selectedCells = this.getSelectedCells();
    var firstSelectedCell = selectedCells[0];
    var lastSelectedCell = selectedCells[selectedCells.length - 1];

    if (selectedCells.length && this.wwe.isInTable(range)) {
      range.setStart(firstSelectedCell, 0);
      range.setEnd(lastSelectedCell, lastSelectedCell.childNodes.length);
      sq.setSelection(range);
    }
  }
  /**
   * Style to selected cells.
   * @param {function} onStyle - function for styling
   * @param {Object} [options] - options to be passed into onStyle
   */
  ;

  _proto.styleToSelectedCells = function styleToSelectedCells(onStyle, options) {
    this.createRangeBySelectedCells();
    onStyle(this.wwe.getEditor(), options);
  }
  /**
   * Destroy.
   */
  ;

  _proto.destroy = function destroy() {
    this.eventManager.removeEventHandler('mousedown.tableSelection');
    this.eventManager.removeEventHandler('mouseover.tableSelection');
    this.eventManager.removeEventHandler('mouseup.tableSelection');
    this.eventManager.removeEventHandler('copyBefore.tableSelection');
    this.eventManager.removeEventHandler('pasteBefore.tableSelection');
  };

  return WwTableSelectionManager;
}();

/* harmony default export */ var wwTableSelectionManager = (wwTableSelectionManager_WwTableSelectionManager);
// CONCATENATED MODULE: ./src/js/wwHrManager.js
/**
 * @fileoverview Implements wysiwyg hr manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Class WwHrManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */

var wwHrManager_WwHrManager = /*#__PURE__*/function () {
  function WwHrManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;
    /**
     * Name property
     * @type {string}
     */

    this.name = 'hr';

    this._init();
  }
  /**
   * Initialize
   * @private
   */


  var _proto = WwHrManager.prototype;

  _proto._init = function _init() {
    this._initEvent();
  }
  /**
   * Initialize eventmanager event
   * @private
   */
  ;

  _proto._initEvent = function _initEvent() {
    var _this = this;

    this.eventManager.listen('wysiwygSetValueAfter', function () {
      _this._insertEmptyLineIfNeed();

      _this._changeHRForWysiwyg();
    });
  }
  /**
   * If <hr> is frist or last child of root, insert empty line before or after HR
   * @private
   */
  ;

  _proto._insertEmptyLineIfNeed = function _insertEmptyLineIfNeed() {
    var editorContentBody = this.wwe.getBody();
    var firstChild = editorContentBody.firstChild,
        lastChild = editorContentBody.lastChild;

    if (firstChild && firstChild.nodeName === 'HR') {
      editorContentBody.insertBefore(dom["a" /* default */].createEmptyLine(), firstChild);
    } else if (lastChild && lastChild.nodeName === 'HR') {
      editorContentBody.appendChild(dom["a" /* default */].createEmptyLine());
    }
  }
  /**
   * <hr> is set contenteditable to false with wrapping div like below.
   * <div contenteditable="false"><hr contenteditable="false"><div>
   * @private
   */
  ;

  _proto._changeHRForWysiwyg = function _changeHRForWysiwyg() {
    var editorContentBody = this.wwe.getBody();
    dom["a" /* default */].findAll(editorContentBody, 'hr').forEach(function (hrNode) {
      var parentNode = hrNode.parentNode;
      parentNode.replaceChild(dom["a" /* default */].createHorizontalRule(), hrNode);
    });
  };

  return WwHrManager;
}();

/* harmony default export */ var wwHrManager = (wwHrManager_WwHrManager);
// CONCATENATED MODULE: ./src/js/wwPManager.js
/**
 * @fileoverview Implements wysiwyg p tag manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


/**
 * Class WwPManager
 * @param {WysiwygEditor} wwe - wysiwygEditor instance
 * @ignore
 */

var wwPManager_WwPManager = /*#__PURE__*/function () {
  function WwPManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;
    /**
     * Name property
     * @type {string}
     */

    this.name = 'p';

    this._initEvent();
  }
  /**
   * Initialize event
   * @private
   */


  var _proto = WwPManager.prototype;

  _proto._initEvent = function _initEvent() {
    var _this = this;

    this.eventManager.listen('wysiwygSetValueBefore', function (html) {
      return _this._splitPtagContentLines(html);
    });
    this.eventManager.listen('wysiwygSetValueAfter', function () {
      _this._ensurePtagContentWrappedWithDiv();

      _this._unwrapPtags();
    });
  }
  /**
   * Split multiple line content of p tags
   * @param {string} html html text
   * @returns {string} result
   * @private
   */
  ;

  _proto._splitPtagContentLines = function _splitPtagContentLines(html) {
    if (html) {
      var wrapper = dom["a" /* default */].createElementWith("<div>" + html + "</div>");
      dom["a" /* default */].findAll(wrapper, 'p').forEach(function (para) {
        var attributes = para.attributes,
            nextElementSibling = para.nextElementSibling;
        var content = para.innerHTML;
        var lines = content.split(/<br>/gi);
        var lastIndex = lines.length - 1;
        var splitedContent = '';
        splitedContent = lines.map(function (line, index) {
          if (index > 0 && index < lastIndex) {
            line = line ? line : '<br>';
          }

          if (line) {
            var block = document.createElement('div');
            Object.keys(attributes).forEach(function (key) {
              var _attributes$key = attributes[key],
                  name = _attributes$key.name,
                  value = _attributes$key.value;
              block.setAttribute(name, value);
            });
            block.innerHTML = line;
            return block.outerHTML;
          }

          return '';
        }); // For paragraph, we add empty line

        if (nextElementSibling && nextElementSibling.nodeName === 'P' || para.getAttribute('contenteditable') === 'false') {
          splitedContent.push('<div><br></div>');
        }

        dom["a" /* default */].replaceWith(para, splitedContent.join(''));
      });
      html = wrapper.innerHTML;
    }

    return html;
  }
  /**
   * Wrap new line inside P tag to DIV, and additional empty line added within too
   * @private
   */
  ;

  _proto._ensurePtagContentWrappedWithDiv = function _ensurePtagContentWrappedWithDiv() {
    var _this2 = this;

    dom["a" /* default */].findAll(this.wwe.getBody(), 'p').forEach(function (node) {
      if (!node.querySelectorAll('div').length) {
        dom["a" /* default */].wrapInner(node, 'div');
      }

      if (_this2._findNextParagraph(node, 'p')) {
        dom["a" /* default */].append(node, '<div><br></div>');
      }
    });
  }
  /**
   * Unwrap P tag
   * @private
   */
  ;

  _proto._unwrapPtags = function _unwrapPtags() {
    dom["a" /* default */].findAll(this.wwe.getBody(), 'div').forEach(function (node) {
      var parent = node.parentNode;

      if (parent.tagName === 'P') {
        dom["a" /* default */].unwrap(parent);
      }
    });
  };

  _proto._findNextParagraph = function _findNextParagraph(node, selector) {
    var nextElementSibling = node.nextElementSibling;

    if (selector) {
      return nextElementSibling && matches_default()(nextElementSibling, selector) ? nextElementSibling : null;
    }

    return nextElementSibling;
  };

  return WwPManager;
}();

/* harmony default export */ var wwPManager = (wwPManager_WwPManager);
// CONCATENATED MODULE: ./src/js/wwHeadingManager.js
/**
 * @fileoverview Implements wysiwyg heading manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


var wwHeadingManager_FIND_HEADING_RX = /h[\d]/i;
var wwHeadingManager_isIE10 = browser_default.a.msie && browser_default.a.version === 10;
/**
 * Class WwHeadingManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */

var wwHeadingManager_WwHeadingManager = /*#__PURE__*/function () {
  function WwHeadingManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;
    /**
     * Name property
     * @type {string}
     */

    this.name = 'heading';

    this._init();
  }
  /**
   * Initialize
   * @private
   */


  var _proto = WwHeadingManager.prototype;

  _proto._init = function _init() {
    this._initEvent();

    this._initKeyHandler();
  };

  _proto._initEvent = function _initEvent() {
    var _this = this;

    this.eventManager.listen('wysiwygSetValueAfter', function () {
      _this._wrapDefaultBlockToHeadingInner();
    });
  }
  /**
   * Initialize key event handler
   * @private
   */
  ;

  _proto._initKeyHandler = function _initKeyHandler() {
    var _this2 = this;

    this.wwe.addKeyEventHandler('ENTER', function (ev, range) {
      if (_this2.wwe.hasFormatWithRx(wwHeadingManager_FIND_HEADING_RX)) {
        _this2._onEnter(ev, range);

        return false;
      }

      return true;
    });
    this.wwe.addKeyEventHandler('BACK_SPACE', function (ev, range) {
      if (_this2.wwe.hasFormatWithRx(wwHeadingManager_FIND_HEADING_RX)) {
        _this2._addBrToEmptyBlock(range);

        _this2._removePrevTopNodeIfNeed(ev, range);

        return false;
      }

      return true;
    });
  }
  /**
   * Wrap default block to heading inner contents
   * @private
   */
  ;

  _proto._wrapDefaultBlockToHeadingInner = function _wrapDefaultBlockToHeadingInner() {
    var headingTags = dom["a" /* default */].findAll(this.wwe.getBody(), 'h1, h2, h3, h4, h5, h6');
    headingTags.forEach(function (headingTag) {
      var exceptedForWrapping = !dom["a" /* default */].children(headingTag, 'div, p').length;

      if (exceptedForWrapping) {
        dom["a" /* default */].wrapInner(headingTag, 'div');
      }
    });
  }
  /**
   * Unwrap heading
   * @private
   */
  ;

  _proto._unwrapHeading = function _unwrapHeading() {
    this.wwe.unwrapBlockTag(function (node) {
      return wwHeadingManager_FIND_HEADING_RX.test(node);
    });
  }
  /**
   * Enter key handler
   * @param {Event} event event object
   * @param {Range} range range
   * @private
   */
  ;

  _proto._onEnter = function _onEnter(event, range) {
    var _this3 = this;

    if (range.startOffset > 0) {
      // I hate this but there's no way
      this.wwe.defer(function (wwe) {
        _this3._unwrapHeading();

        wwe.getEditor().removeLastUndoStack();
      });
    } else {
      event.preventDefault();

      this._insertEmptyBlockToPrevious(range);
    }
  }
  /**
   * Insert empty block to previous of passed range
   * @param {Range} range range
   * @private
   */
  ;

  _proto._insertEmptyBlockToPrevious = function _insertEmptyBlockToPrevious(range) {
    this.wwe.getEditor().saveUndoState(range);
    var element = dom["a" /* default */].createElementWith('<div><br></div>');
    dom["a" /* default */].insertBefore(element, dom["a" /* default */].getParentUntil(range.startContainer, this.wwe.getBody()));
  }
  /**
   * Remove previous top node if need
   * @param {Event} event event object
   * @param {Range} range range
   * @returns {Boolean} whether needed or not
   * @private
   */
  ;

  _proto._removePrevTopNodeIfNeed = function _removePrevTopNodeIfNeed(event, range) {
    var isHandled = false;

    if (range.collapsed && range.startOffset === 0) {
      var startContainer = range.startContainer;
      var prevTopNode = dom["a" /* default */].getTopPrevNodeUnder(startContainer, this.wwe.getBody());
      var isPrevTopNodeEmpty = prevTopNode && prevTopNode.textContent.length === 0;
      var sq = this.wwe.getEditor();

      if (startContainer.textContent.length === 0) {
        isHandled = this._removeHedingAndChangeSelection(event, range, prevTopNode);
      } else if (isPrevTopNodeEmpty) {
        event.preventDefault();
        sq.saveUndoState(range);
        dom["a" /* default */].remove(prevTopNode);
        isHandled = true;
      }
    }

    return isHandled;
  };

  _proto._getHeadingElement = function _getHeadingElement(element) {
    var isHeading = wwHeadingManager_FIND_HEADING_RX.test(dom["a" /* default */].getNodeName(element));
    return isHeading ? element : dom["a" /* default */].parents(element, 'h1,h2,h3,h4,h5,h6')[0];
  };

  _proto._addBrToEmptyBlock = function _addBrToEmptyBlock(range) {
    var collapsed = range.collapsed,
        startOffset = range.startOffset,
        startContainer = range.startContainer;

    if (collapsed && startOffset === 1) {
      var headingElement = this._getHeadingElement(startContainer);

      var brs = dom["a" /* default */].children(headingElement.firstChild, 'br');

      if (!wwHeadingManager_isIE10 && !brs.length) {
        var br = document.createElement('br');
        startContainer.parentNode.appendChild(br);
      }
    }
  }
  /**
   * Remove heading and change selection
   * @param {object} event Event object
   * @param {Range} range Range object
   * @param {HTMLElement} prevTopNode Previous top node
   * @returns {boolean}
   * @private
   */
  ;

  _proto._removeHedingAndChangeSelection = function _removeHedingAndChangeSelection(event, range, prevTopNode) {
    var startContainer = range.startContainer;
    var sq = this.wwe.getEditor();
    var body = this.wwe.getBody();

    var headingElement = this._getHeadingElement(startContainer);

    var targetNode = prevTopNode;
    var offset = 1;

    if (!event.defaultPrevented) {
      event.preventDefault();
      sq.saveUndoState(range);
    }

    dom["a" /* default */].remove(headingElement);

    if (!prevTopNode) {
      var _domUtils$children = dom["a" /* default */].children(body, 'div');

      targetNode = _domUtils$children[0];
      offset = 0;
    }

    range.setStart(targetNode, offset);
    range.collapse(true);
    sq.setSelection(range);
    return true;
  };

  return WwHeadingManager;
}();

/* harmony default export */ var wwHeadingManager = (wwHeadingManager_WwHeadingManager);
// EXTERNAL MODULE: ./node_modules/tui-code-snippet/type/isTruthy.js
var isTruthy = __webpack_require__(42);
var isTruthy_default = /*#__PURE__*/__webpack_require__.n(isTruthy);

// CONCATENATED MODULE: ./src/js/wwCodeBlockManager.js
/**
 * @fileoverview Implements wysiwyg code block manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */






var wwCodeBlockManager_isIE10 = browser_default.a.msie && browser_default.a.version === 10;
var wwCodeBlockManager_brString = wwCodeBlockManager_isIE10 ? '' : '<br>';
var tagEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};
var FIND_ZWS_RX = /\u200B/g;
var CODEBLOCK_ATTR_NAME = 'data-te-codeblock';
/**
 * Class WwCodeBlockManager
 * @param {WysiwygEditor} wwe - wysiwygEditor instance
 * @ignore
 */

var wwCodeBlockManager_WwCodeBlockManager = /*#__PURE__*/function () {
  function WwCodeBlockManager(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;
    /**
     * Name property
     * @type {string}
     */

    this.name = 'codeblock';

    this._init();
  }
  /**
   * Initialize
   * @private
   */


  var _proto = WwCodeBlockManager.prototype;

  _proto._init = function _init() {
    this._initKeyHandler();

    this._initEvent();
  }
  /**
   * Initialize key event handler
   * @private
   */
  ;

  _proto._initKeyHandler = function _initKeyHandler() {
    var _this = this;

    this._keyEventHandlers = {
      BACK_SPACE: this._onBackspaceKeyEventHandler.bind(this),
      ENTER: function ENTER(ev, range) {
        if (!_this.wwe.isInTable(range) && _this.wwe.getEditor().hasFormat('CODE')) {
          _this.wwe.defer(function () {
            var _this$wwe$getRange = _this.wwe.getRange(),
                startContainer = _this$wwe$getRange.startContainer;

            var codeNode = _this._getCodeNode(startContainer);

            if (codeNode && !dom["a" /* default */].getTextLength(codeNode)) {
              codeNode.parentNode.removeChild(codeNode);
            }
          });
        }
      }
    };
    forEachOwnProperties_default()(this._keyEventHandlers, function (handler, key) {
      return _this.wwe.addKeyEventHandler(key, handler);
    });
  };

  _proto._getCodeNode = function _getCodeNode(node) {
    var result;

    if (node.nodeName === 'CODE') {
      result = node;
    } else if (node.parentNode.nodeName === 'CODE') {
      result = node.parentNode;
    }

    return result;
  }
  /**
   * Initialize eventmanager event
   * @private
   */
  ;

  _proto._initEvent = function _initEvent() {
    var _this2 = this;

    this.eventManager.listen('wysiwygSetValueAfter.codeblock', function () {
      _this2.modifyCodeBlockForWysiwyg();
    });
    this.eventManager.listen('wysiwygProcessHTMLText.codeblock', function (html) {
      return _this2._changePreToPreCode(html);
    });
  }
  /**
   * Prepare nodes for pasting to code block
   * @param {Array.<Node>} nodes Node array
   * @returns {DocumentFragment}
   */
  ;

  _proto.prepareToPasteOnCodeblock = function prepareToPasteOnCodeblock(nodes) {
    var frag = this.wwe.getEditor().getDocument().createDocumentFragment();
    var text = this.convertNodesToText(nodes);
    text = text.replace(/\n$/, '');
    frag.appendChild(document.createTextNode(text));
    return frag;
  }
  /**
   * Convert nodes to text for pasting to code block
   * @param {Array.<Node>} nodes Node array
   * @returns {string} coverted string
   */
  ;

  _proto.convertNodesToText = function convertNodesToText(nodes) {
    var str = '';
    var node = nodes.shift();

    while (isTruthy_default()(node)) {
      var _node = node,
          childNodes = _node.childNodes;

      if (childNodes && dom["a" /* default */].isBlockNode(node)) {
        str += this.convertNodesToText(toArray_default()(node.childNodes));
      } else if (node.nodeName === 'BR') {
        str += '\n';
      } else {
        str += node.textContent;
      }

      node = nodes.shift();
    }

    return str;
  }
  /**
   * Copy content with code block style from code block selection
   * @param {HTMLElement} element Copied element
   * @param {Range} range Range object
   * @returns {HTMLElement}
   * @private
   */
  ;

  _proto._copyCodeblockTypeFromRangeCodeblock = function _copyCodeblockTypeFromRangeCodeblock(element, range) {
    var blockNode = dom["a" /* default */].getParentUntil(range.commonAncestorContainer, this.wwe.getBody());

    if (dom["a" /* default */].getNodeName(blockNode) === 'PRE') {
      var attrs = blockNode.attributes;
      forEachOwnProperties_default()(attrs, function (attr) {
        element.setAttribute(attr.name, attr.value);
      });
    }

    return element;
  }
  /**
   * Change pre tag to pre and code
   * @param {string} html HTML string
   * @returns {string}
   * @private
   */
  ;

  _proto._changePreToPreCode = function _changePreToPreCode(html) {
    return html.replace(/<pre( .*?)?>((.|\n)*?)<\/pre>/g, function (match, codeAttr, code) {
      return "<pre><code" + (codeAttr || '') + ">" + code + "</code></pre>";
    });
  }
  /**
   * Modify Code Block for Wysiwyg
   * @param {HTMLElement} node root node to find pre
   */
  ;

  _proto.modifyCodeBlockForWysiwyg = function modifyCodeBlockForWysiwyg(node) {
    if (!node) {
      node = this.wwe.getBody();
    }

    dom["a" /* default */].findAll(node, 'pre').forEach(function (pre) {
      var codeTag = pre.querySelector('code');
      var lang, numberOfBackticks;

      if (codeTag) {
        lang = codeTag.getAttribute('data-language');
        numberOfBackticks = codeTag.getAttribute('data-backticks');
      } // if this pre can have lines


      if (pre.children.length > 1) {
        toArray_default()(pre.children).forEach(function (childNode) {
          if ((childNode.nodeName === 'DIV' || childNode.nodeName === 'P') && !childNode.querySelectorAll('br').length) {
            childNode.innerHTML += childNode.innerHTML + "\n";
          }
        });
      }

      var brs = pre.querySelectorAll('br');

      if (brs.length) {
        dom["a" /* default */].replaceWith(brs, '\n');
      }

      var resultText = pre.textContent.replace(/\s+$/, '');
      dom["a" /* default */].empty(pre);
      pre.innerHTML = resultText ? sanitizeHtmlCode(resultText) : wwCodeBlockManager_brString;

      if (lang) {
        pre.setAttribute('data-language', lang);
        addClass_default()(pre, "lang-" + lang);
      }

      if (numberOfBackticks) {
        pre.setAttribute('data-backticks', numberOfBackticks);
      }

      pre.setAttribute(CODEBLOCK_ATTR_NAME, '');
    });
  }
  /**
   * Remove codeblock of first line when press backspace in first line
   * @param {Event} ev Event object
   * @param {Range} range Range object
   * @returns {boolean}
   * @private
   */
  ;

  _proto._onBackspaceKeyEventHandler = function _onBackspaceKeyEventHandler(ev, range) {
    var isNeedNext = true;
    var sq = this.wwe.getEditor();
    var container = range.commonAncestorContainer;

    if (this._isCodeBlockFirstLine(range) && !this._isFrontCodeblock(range)) {
      this._removeCodeblockFirstLine(container);

      range.collapse(true);
      isNeedNext = false;
    } else if (range.collapsed && this._isEmptyLine(container) && this._isBetweenSameCodeblocks(container)) {
      var previousSibling = container.previousSibling,
          nextSibling = container.nextSibling;
      var prevTextLength = previousSibling.textContent.length;
      sq.saveUndoState(range);
      container.parentNode.removeChild(container);

      this._mergeCodeblocks(previousSibling, nextSibling);

      range.setStart(previousSibling.childNodes[0], prevTextLength);
      range.collapse(true);
      isNeedNext = false;
    }

    if (!isNeedNext) {
      sq.setSelection(range);
      ev.preventDefault();
    }

    return isNeedNext;
  }
  /**
   * Check node is empty line
   * @param {Node} node node
   * @returns {boolean}
   * @private
   */
  ;

  _proto._isEmptyLine = function _isEmptyLine(node) {
    var nodeName = node.nodeName,
        childNodes = node.childNodes;
    var isEmpty = wwCodeBlockManager_isIE10 ? node.textContent === '' : childNodes.length === 1 && childNodes[0].nodeName === 'BR';
    return nodeName === 'DIV' && isEmpty;
  }
  /**
   * Check whether node is between same codeblocks
   * @param {Node} node Node
   * @returns {boolean}
   * @private
   */
  ;

  _proto._isBetweenSameCodeblocks = function _isBetweenSameCodeblocks(node) {
    var previousSibling = node.previousSibling,
        nextSibling = node.nextSibling;
    return dom["a" /* default */].getNodeName(previousSibling) === 'PRE' && dom["a" /* default */].getNodeName(nextSibling) === 'PRE' && previousSibling.getAttribute('data-language') === nextSibling.getAttribute('data-language');
  };

  _proto._mergeCodeblocks = function _mergeCodeblocks(frontCodeblock, backCodeblock) {
    var postText = backCodeblock.textContent;
    frontCodeblock.childNodes[0].textContent += "\n" + postText;
    backCodeblock.parentNode.removeChild(backCodeblock);
  }
  /**
   * Check whether range is first line of code block
   * @param {Range} range Range object
   * @returns {boolean}
   * @private
   */
  ;

  _proto._isCodeBlockFirstLine = function _isCodeBlockFirstLine(range) {
    return this.isInCodeBlock(range) && range.collapsed && range.startOffset === 0;
  }
  /**
   * Check whether front block of range is code block
   * @param {Range} range Range object
   * @returns {boolean}
   * @private
   */
  ;

  _proto._isFrontCodeblock = function _isFrontCodeblock(range) {
    var block = dom["a" /* default */].getParentUntil(range.startContainer, this.wwe.getEditor().getRoot());
    var previousSibling = block.previousSibling;
    return previousSibling && previousSibling.nodeName === 'PRE';
  }
  /**
   * Remove codeblock first line of codeblock
   * @param {Node} node Pre Node
   * @private
   */
  ;

  _proto._removeCodeblockFirstLine = function _removeCodeblockFirstLine(node) {
    var sq = this.wwe.getEditor();
    var preNode = node.nodeName === 'PRE' ? node : node.parentNode;
    var codeContent = preNode.textContent.replace(FIND_ZWS_RX, '');
    sq.modifyBlocks(function () {
      var newFrag = sq.getDocument().createDocumentFragment();
      var strArray = codeContent.split('\n');
      var firstDiv = document.createElement('div');
      var firstLine = strArray.shift();
      firstDiv.innerHTML = "" + sanitizeHtmlCode(firstLine) + wwCodeBlockManager_brString;
      newFrag.appendChild(firstDiv);

      if (strArray.length) {
        var newPreNode = preNode.cloneNode();
        newPreNode.textContent = strArray.join('\n');
        newFrag.appendChild(newPreNode);
      }

      return newFrag;
    });
  }
  /**
   * Return boolean value of whether current range is in the code block
   * @param {Range} range Range object
   * @returns {boolean}
   */
  ;

  _proto.isInCodeBlock = function isInCodeBlock(range) {
    var target;

    if (range.collapsed) {
      target = range.startContainer;
    } else {
      target = range.commonAncestorContainer;
    }

    return !!dom["a" /* default */].closest(target, 'pre');
  }
  /**
   * Destroy
   */
  ;

  _proto.destroy = function destroy() {
    var _this3 = this;

    this.eventManager.removeEventHandler('wysiwygSetValueAfter.codeblock');
    this.eventManager.removeEventHandler('wysiwygProcessHTMLText.codeblock');
    forEachOwnProperties_default()(this._keyEventHandlers, function (handler, key) {
      return _this3.wwe.removeKeyEventHandler(key, handler);
    });
  };

  return WwCodeBlockManager;
}();
/**
 * Sanitize HTML code
 * @param {string} code code string
 * @returns {string}
 * @ignore
 */


function sanitizeHtmlCode(code) {
  return code ? code.replace(/[<>&]/g, function (tag) {
    return tagEntities[tag] || tag;
  }) : '';
}

/* harmony default export */ var wwCodeBlockManager = (wwCodeBlockManager_WwCodeBlockManager);
// EXTERNAL MODULE: /Users/nhnent/Documents/tui.editor_legacy/libs/squire/build/squire.js
var build_squire = __webpack_require__(55);
var squire_default = /*#__PURE__*/__webpack_require__.n(build_squire);

// CONCATENATED MODULE: ./src/js/squireExt.js
function squireExt_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileoverview Implements squire extension
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */






var FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD)\b/;
var isIElt11 = /Trident\/[456]\./.test(navigator.userAgent);
/**
 * Class SquireExt
 * @params {Squire} ...args
 */

var squireExt_SquireExt = /*#__PURE__*/function (_Squire) {
  squireExt_inheritsLoose(SquireExt, _Squire);

  function SquireExt() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _Squire.call.apply(_Squire, [this].concat(args)) || this;

    _this._decorateHandlerToCancelable('copy');

    _this._decorateHandlerToCancelable(isIElt11 ? 'beforecut' : 'cut');

    _this._decorateHandlerToCancelable(isIElt11 ? 'beforepaste' : 'paste');

    _this.getBody = function () {
      _this.body = _this.body || _this.getRoot();
      return _this.body;
    };

    return _this;
  }
  /**
   * Decorate squire handler to cancelable cuz sometimes, we dont need squire handler process
   * event.preventDefault() will cancel squire and browser default behavior
   * event.squirePrevented = true will cancel squire but allow browser default behavior
   * @param {string} eventName event name
   * @private
   */


  var _proto = SquireExt.prototype;

  _proto._decorateHandlerToCancelable = function _decorateHandlerToCancelable(eventName) {
    var handlers = this._events[eventName];

    if (handlers.length > 1) {
      throw new Error("too many" + eventName + "handlers in squire");
    }

    var handler = handlers[0].bind(this);

    handlers[0] = function (event) {
      if (!event.defaultPrevented && !event.squirePrevented) {
        handler(event);
      }
    };
  };

  _proto.changeBlockFormat = function changeBlockFormat(srcCondition, targetTagName) {
    var _this2 = this;

    this.modifyBlocks(function (frag) {
      var current, newFrag, newBlock, nextBlock, tagName, lastNodeOfNextBlock, appendChidToNextBlock; // HR is non-block element, so frag don't have it
      // make a default block

      if (frag.childNodes.length) {
        current = frag.childNodes.item(0);
      } else {
        current = _this2.createDefaultBlock();
        frag.appendChild(current);
      }

      if (srcCondition) {
        // find last depth
        while (current.firstChild) {
          current = current.firstChild;
        }

        appendChidToNextBlock = function appendChidToNextBlock(node) {
          nextBlock.appendChild(node);
        }; // find tag


        while (current !== frag) {
          var _current = current;
          tagName = _current.tagName;

          if (isFunction_default()(srcCondition) ? srcCondition(tagName) : tagName === srcCondition) {
            nextBlock = current.childNodes.item(0); // there is no next blocktag
            // eslint-disable-next-line max-depth

            if (!dom["a" /* default */].isElemNode(nextBlock) || current.childNodes.length > 1) {
              nextBlock = _this2.createDefaultBlock();
              toArray_default()(current.childNodes).forEach(appendChidToNextBlock);
              lastNodeOfNextBlock = nextBlock.lastChild; // remove unneccesary br
              // eslint-disable-next-line max-depth

              if (lastNodeOfNextBlock && dom["a" /* default */].getNodeName(lastNodeOfNextBlock) === 'BR') {
                nextBlock.removeChild(lastNodeOfNextBlock);
              }
            } // eslint-disable-next-line max-depth


            if (targetTagName) {
              newBlock = _this2.createElement(targetTagName, [nextBlock]);
            } else {
              newBlock = nextBlock;
            }

            newFrag = _this2.getDocument().createDocumentFragment();
            newFrag.appendChild(newBlock);
            frag = newFrag;
            break;
          }

          current = current.parentNode;
        }
      } // if source condition node is not founded, we wrap current div node with node named targetTagName


      if ((!newFrag || !srcCondition) && targetTagName && dom["a" /* default */].getNodeName(frag.childNodes[0]) === 'DIV') {
        frag = _this2.createElement(targetTagName, [frag.childNodes[0]]);
      }

      return frag;
    });
  };

  _proto.changeBlockFormatTo = function changeBlockFormatTo(targetTagName) {
    this.changeBlockFormat(function (tagName) {
      return FIND_BLOCK_TAGNAME_RX.test(tagName);
    }, targetTagName);
  };

  _proto.getCaretPosition = function getCaretPosition() {
    return this.getCursorPosition();
  };

  _proto.replaceSelection = function replaceSelection(content, selection) {
    if (selection) {
      this.setSelection(selection);
    }

    this._ignoreChange = true;
    this.insertHTML(content);
  };

  _proto.replaceRelativeOffset = function replaceRelativeOffset(content, offset, overwriteLength) {
    var selection = this.getSelection().cloneRange();

    this._replaceRelativeOffsetOfSelection(content, offset, overwriteLength, selection);
  };

  _proto._replaceRelativeOffsetOfSelection = function _replaceRelativeOffsetOfSelection(content, offset, overwriteLength, selection) {
    var startSelectionInfo, endSelectionInfo, finalOffset;
    var endOffsetNode = selection.endContainer;
    var endTextOffset = selection.endOffset;

    if (dom["a" /* default */].getNodeName(endOffsetNode) !== 'TEXT') {
      endOffsetNode = this._getClosestTextNode(endOffsetNode, endTextOffset);

      if (endOffsetNode) {
        if (dom["a" /* default */].isTextNode(endOffsetNode)) {
          endTextOffset = endOffsetNode.nodeValue.length;
        } else {
          endTextOffset = endOffsetNode.textContent.length;
        }
      }
    }

    if (endOffsetNode) {
      startSelectionInfo = this.getSelectionInfoByOffset(endOffsetNode, endTextOffset + offset);
      selection.setStart(startSelectionInfo.element, startSelectionInfo.offset);
      finalOffset = endTextOffset + (offset + overwriteLength);
      endSelectionInfo = this.getSelectionInfoByOffset(endOffsetNode, finalOffset);
      selection.setEnd(endSelectionInfo.element, endSelectionInfo.offset);
      this.replaceSelection(content, selection);
    } else {
      this.replaceSelection(content);
    }
  };

  _proto._getClosestTextNode = function _getClosestTextNode(node, offset) {
    var foundNode = dom["a" /* default */].getChildNodeByOffset(node, offset - 1);

    if (dom["a" /* default */].getNodeName(foundNode) !== 'TEXT') {
      foundNode = foundNode.previousSibling;
    }

    return foundNode;
  };

  _proto.getSelectionInfoByOffset = function getSelectionInfoByOffset(anchorElement, offset) {
    var traceElement, traceElementLength, traceOffset, stepLength;
    var direction = offset >= 0 ? 'next' : 'previous';
    var offsetAbs = Math.abs(offset);
    var latestAvailableElement = traceElement;

    if (direction === 'next') {
      traceElement = anchorElement;
    } else {
      traceElement = anchorElement.previousSibling;
    }

    traceOffset = offsetAbs;
    stepLength = 0;

    while (traceElement) {
      if (dom["a" /* default */].isTextNode(traceElement)) {
        traceElementLength = traceElement.nodeValue.length;
      } else {
        traceElementLength = traceElement.textContent.length;
      }

      stepLength += traceElementLength;

      if (offsetAbs <= stepLength) {
        break;
      }

      traceOffset -= traceElementLength;

      if (dom["a" /* default */].getTextLength(traceElement) > 0) {
        latestAvailableElement = traceElement;
      }

      traceElement = traceElement[direction + "Sibling"];
    }

    if (!traceElement) {
      traceElement = latestAvailableElement;
      traceOffset = dom["a" /* default */].getTextLength(traceElement);
    }

    if (direction === 'previous') {
      traceOffset = dom["a" /* default */].getTextLength(traceElement) - traceOffset;
    }

    return {
      element: traceElement,
      offset: traceOffset
    };
  };

  _proto.getSelectionPosition = function getSelectionPosition(selection, style, offset) {
    var marker = this.createElement('INPUT');
    var range = selection.cloneRange();
    var endSelectionInfo = this.getSelectionInfoByOffset(selection.endContainer, selection.endOffset + (offset || 0));
    range.setStart(range.startContainer, range.startOffset);
    range.setEnd(endSelectionInfo.element, endSelectionInfo.offset); // to prevent squire input event fire

    this._ignoreChange = true;
    this.insertElement(marker, range);
    var pos = dom["a" /* default */].getOffset(marker);

    if (style !== 'over') {
      pos.top += marker.offsetHeight;
    }

    marker.parentNode.removeChild(marker);
    selection.setStart(selection.endContainer, selection.endOffset);
    selection.collapse(true);
    this.setSelection(selection);
    return pos;
  };

  _proto.removeLastUndoStack = function removeLastUndoStack() {
    if (this._undoStack.length) {
      this._undoStackLength -= 1;
      this._undoIndex -= 1;

      this._undoStack.pop();

      this._isInUndoState = false;
    }
  };

  _proto.replaceParent = function replaceParent(node, from, to) {
    var target = dom["a" /* default */].closest(node, from, this.getBody());

    if (target) {
      dom["a" /* default */].wrapInner(target, to);
      dom["a" /* default */].unwrap(target);
    }
  };

  _proto.preserveLastLine = function preserveLastLine() {
    var blocks = this.getBody().children;
    var lastBlock = blocks[blocks.length - 1];

    if (lastBlock && dom["a" /* default */].getNodeName(lastBlock) !== 'DIV') {
      this._ignoreChange = true;
      dom["a" /* default */].insertAfter(this.createDefaultBlock(), lastBlock);
    }
  };

  _proto.scrollTop = function scrollTop(top) {
    if (!isUndefined_default()(top)) {
      this.getBody().scrollTop = top;
    }

    return this.getBody().scrollTop;
  };

  _proto.isIgnoreChange = function isIgnoreChange() {
    return this._ignoreChange;
  };

  _proto.focus = function focus() {
    squire_default.a.prototype.focus.call(this);
  };

  _proto.blockCommandShortcuts = function blockCommandShortcuts() {
    var _this3 = this;

    var meta = utils_common["b" /* isMac */] ? 'meta' : 'ctrl';
    var keys = ['b', 'i', 'u', 'shift-7', 'shift-5', 'shift-6', 'shift-8', 'shift-9', '[', ']', 'd'];
    keys.forEach(function (key) {
      _this3.setKeyHandler(meta + "-" + key, function (editor, keyboardEvent) {
        keyboardEvent.preventDefault();
      });
    });
  };

  return SquireExt;
}(squire_default.a);

/* harmony default export */ var squireExt = (squireExt_SquireExt);
// CONCATENATED MODULE: ./src/js/wwTextObject.js
/**
 * @fileoverview Implements WwTextObject
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


var isIE11 = browser_default.a.msie && browser_default.a.version === 11;
var isWindowChrome = navigator.appVersion.indexOf('Win') !== -1 && browser_default.a.chrome;
var isWindows10 = /Windows (NT )?10/g.test(navigator.appVersion);
var isNeedOffsetFix = isIE11 || isWindowChrome && !isWindows10;
/**
 * Class WwTextObject
 * @param {WysiwygEditor} wwe - wysiwygEditor
 * @param {Range} range - Range object
 */

var wwTextObject_WwTextObject = /*#__PURE__*/function () {
  function WwTextObject(wwe, range) {
    this._wwe = wwe; // msie11 and window chrome can't make start offset of range api correctly when compositing korean.
    // so we need fix this when compositing korean.(and maybe other languages that needs composition.)

    if (isNeedOffsetFix) {
      this.isComposition = false;

      this._initCompositionEvent();
    }

    this.setRange(range || this._wwe.getRange());
  }
  /**
   * Initialize composition event
   * @private
   */


  var _proto = WwTextObject.prototype;

  _proto._initCompositionEvent = function _initCompositionEvent() {
    var _this = this;

    this._wwe.getEditor().addEventListener('compositionstart', function () {
      _this.isComposition = true;
    });

    this._wwe.getEditor().addEventListener('compositionend', function () {
      _this.isComposition = false;
    });
  }
  /**
   * Set _range object to given range object
   * @param {Range} range Range object
   */
  ;

  _proto.setRange = function setRange(range) {
    if (this._range) {
      this._range.detach();
    }

    this._range = range;
  }
  /**
   * Expand start offset by one
   */
  ;

  _proto.expandStartOffset = function expandStartOffset() {
    var range = this._range;

    if (dom["a" /* default */].isTextNode(range.startContainer) && range.startOffset > 0) {
      range.setStart(range.startContainer, range.startOffset - 1);
    }
  }
  /**
   * Expand end offset by one
   */
  ;

  _proto.expandEndOffset = function expandEndOffset() {
    var range = this._range;

    if (dom["a" /* default */].isTextNode(range.endContainer) && range.endOffset < range.endContainer.nodeValue.length) {
      range.setEnd(range.endContainer, range.endOffset + 1);
    }
  }
  /**
   * setEnd range on start
   * @param {Range} range Range object
   */
  ;

  _proto.setEndBeforeRange = function setEndBeforeRange(range) {
    var offset = range.startOffset;

    if (this.isComposition) {
      offset += 1;
    }

    this._range.setEnd(range.startContainer, offset);
  }
  /**
   * Get text content
   * @returns {string}
   */
  ;

  _proto.getTextContent = function getTextContent() {
    return this._range.cloneContents().textContent;
  }
  /**
   * Replace current selection content to given text
   * @param {string} content Text content
   */
  ;

  _proto.replaceContent = function replaceContent(content) {
    this._wwe.getEditor().setSelection(this._range);

    this._wwe.getEditor().insertHTML(content); // When range is in table, 'insertHTML' makes div in table.
    // So after 'insertHTML', div in table should be unwrap.
    // 'wysiwygRangeChangeAfter' event let wwTableManager call '_unwrapBlockInTable'


    if (this._wwe.isInTable(this._range)) {
      this._wwe.eventManager.emit('wysiwygRangeChangeAfter', this._wwe);
    }

    this._range = this._wwe.getRange();
  }
  /**
   * Delete current selection content
   */
  ;

  _proto.deleteContent = function deleteContent() {
    this._wwe.getEditor().setSelection(this._range);

    this._wwe.getEditor().insertHTML('');

    this._range = this._wwe.getRange();
  }
  /**
   * Peek previous element's content
   * @param {number} offset Offset to peek
   * @returns {string}
   */
  ;

  _proto.peekStartBeforeOffset = function peekStartBeforeOffset(offset) {
    var range = this._range.cloneRange();

    range.setStart(range.startContainer, Math.max(range.startOffset - offset, 0));
    range.setEnd(this._range.startContainer, this._range.startOffset);
    return range.cloneContents().textContent;
  };

  return WwTextObject;
}();

/* harmony default export */ var wwTextObject = (wwTextObject_WwTextObject);
// CONCATENATED MODULE: ./src/js/ui/blockOverlay.js
/**
 * @fileoverview Implements UI block overlay
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


/**
 * Class BlockOverlay
 * @param {Object} options - options
 *     @param {EventManager} options.eventManager - event manager instance
 *     @param {HTMLElement} options.container - container element
 *     @param {string} options.attachedSelector - selector string to find attached element
 * @ignore
 */

var blockOverlay_BlockOverlay = /*#__PURE__*/function () {
  function BlockOverlay(_ref) {
    var eventManager = _ref.eventManager,
        container = _ref.container,
        attachedSelector = _ref.attachedSelector;
    this._eventManager = eventManager;
    this._attachedSelector = "[contenteditable=true] " + attachedSelector;
    this._container = container;
    this._attachedElement = null;
    /**
     * is activated.
     * if this blockOverlay is active, It always be visible unconditionally.
     * @type {boolean}
     * @private
     */

    this.active = false;

    this._createElement();

    this._initEvent();
  }

  var _proto = BlockOverlay.prototype;

  _proto._createElement = function _createElement() {
    this.el = dom["a" /* default */].createElementWith('<div class="te-ww-block-overlay"></div>');
    css_default()(this.el, {
      position: 'absolute',
      display: 'none',
      zIndex: 1
    });
    dom["a" /* default */].append(this._container, this.el);
  };

  _proto._initEvent = function _initEvent() {
    var _this = this;

    this._eventManager.listen('change', this._onChange.bind(this));

    this._eventManager.listen('mouseover', this._onMouseOver.bind(this));

    this._eventManager.listen('focus', function () {
      _this.setVisibility(false);
    });

    this._eventManager.listen('mousedown', function () {
      _this.setVisibility(false);
    });
  };

  _proto._onChange = function _onChange() {
    if (this._attachedElement && dom["a" /* default */].isContain(document.body, this._attachedElement)) {
      this.syncLayout();
    } else {
      this.setVisibility(false);
    }
  };

  _proto._onMouseOver = function _onMouseOver(ev) {
    var originalEvent = ev.data;
    var eventTarget = originalEvent.target;
    var attachedElement = dom["a" /* default */].closest(eventTarget, this._attachedSelector);

    if (attachedElement) {
      this._attachedElement = attachedElement;
      this.setVisibility(true);
    } else if (dom["a" /* default */].closest(eventTarget, this.el)) {
      this.setVisibility(true);
    } else if (!this.active) {
      this.setVisibility(false);
    }
  }
  /**
   * update blockOverlay position & size update to attached element
   * you may want to override this to adjust position & size
   * @protected
   */
  ;

  _proto.syncLayout = function syncLayout() {
    var offset = dom["a" /* default */].getOffset(this._attachedElement);
    var outerWidth = dom["a" /* default */].getOuterWidth(this._attachedElement);
    var outerHeight = dom["a" /* default */].getOuterHeight(this._attachedElement);
    dom["a" /* default */].setOffset(this.el, offset);
    css_default()(this.el, {
      width: outerWidth + "px"
    });
    css_default()(this.el, {
      height: outerHeight + "px"
    });
  }
  /**
   * attached element
   * @protected
   * @returns {HTMLElement} - attached element
   */
  ;

  _proto.getAttachedElement = function getAttachedElement() {
    return this._attachedElement || null;
  }
  /**
   * visibility
   * @protected
   * @returns {boolean} visibility
   */
  ;

  _proto.getVisibility = function getVisibility() {
    return this.el.style.display === 'block';
  }
  /**
   * visibility
   * @param {boolean} visibility - is visible
   * @protected
   */
  ;

  _proto.setVisibility = function setVisibility(visibility) {
    if (visibility && this._attachedElement) {
      if (!this.getVisibility()) {
        css_default()(this.el, {
          display: 'block'
        });
        this.syncLayout();
        this.onShow();
      }
    } else if (!visibility) {
      if (this.getVisibility()) {
        css_default()(this.el, {
          display: 'none'
        });
        this.onHide();
      }
    }
  }
  /**
   * called on show. you may want to override to get the event
   * @protected
   * @abstract
   */
  ;

  _proto.onShow = function onShow() {}
  /**
   * called on hide. you may want to override to get the event
   * @protected
   */
  ;

  _proto.onHide = function onHide() {
    this.active = false;
    this._attachedElement = null;
  };

  return BlockOverlay;
}();

/* harmony default export */ var blockOverlay = (blockOverlay_BlockOverlay);
// CONCATENATED MODULE: ./src/js/ui/codeBlockGadget.js
function codeBlockGadget_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileoverview Implements UI code block gadget
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */






var GADGET_RIGHT = 26;
var GADGET_WIDTH = 250;
var GADGET_HEIGHT = 30;
/**
 * Class CodeBlockGadget
 * @param {Object} options - options
 *     @param {EventManager} options.eventManager - event manager instance
 *     @param {HTMLElement} options.container - container element
 *     @param {WysiwygEditor} options.wysiwygEditor - wysiwyg editor instance
 * @ignore
 */

var codeBlockGadget_CodeBlockGadget = /*#__PURE__*/function (_BlockOverlay) {
  codeBlockGadget_inheritsLoose(CodeBlockGadget, _BlockOverlay);

  function CodeBlockGadget(_ref) {
    var _this;

    var eventManager = _ref.eventManager,
        container = _ref.container,
        wysiwygEditor = _ref.wysiwygEditor;
    _this = _BlockOverlay.call(this, {
      eventManager: eventManager,
      container: container,
      attachedSelector: 'pre'
    }) || this;
    _this._wysiwygEditor = wysiwygEditor;
    _this._popupCodeBlockLanguages = null;

    _this._initDOM();

    _this._initDOMEvent();

    return _this;
  }

  var _proto = CodeBlockGadget.prototype;

  _proto._initDOM = function _initDOM() {
    var _this2 = this;

    addClass_default()(this.el, 'code-block-header');
    this._languageLabel = dom["a" /* default */].createElementWith('<span>text</span>');
    dom["a" /* default */].append(this.el, this._languageLabel);
    this._buttonOpenModalEditor = dom["a" /* default */].createElementWith("<button type=\"button\">Editor</button>");
    dom["a" /* default */].append(this.el, this._buttonOpenModalEditor);

    this._eventManager.emit('removeEditor', function () {
      off_default()(_this2._buttonOpenModalEditor, 'click');
      _this2._buttonOpenModalEditor = null;
    });
  };

  _proto._initDOMEvent = function _initDOMEvent() {
    var _this3 = this;

    on_default()(this._buttonOpenModalEditor, 'click', function () {
      return _this3._openPopupCodeBlockEditor();
    });
  };

  _proto._openPopupCodeBlockEditor = function _openPopupCodeBlockEditor() {
    this._eventManager.emit('openPopupCodeBlockEditor', this.getAttachedElement());
  };

  _proto._updateLanguage = function _updateLanguage() {
    var attachedElement = this.getAttachedElement();
    var language = attachedElement ? attachedElement.getAttribute('data-language') : null;
    this._languageLabel.textContent = language || 'text';
  }
  /**
   * update gadget position
   * @protected
   * @override
   */
  ;

  _proto.syncLayout = function syncLayout() {
    var attachedElement = this.getAttachedElement();

    var _domUtils$getOffset = dom["a" /* default */].getOffset(attachedElement, '.te-editor'),
        top = _domUtils$getOffset.top;

    css_default()(this.el, {
      top: top + "px",
      right: GADGET_RIGHT + "px",
      width: GADGET_WIDTH + "px",
      height: GADGET_HEIGHT + "px"
    });
  }
  /**
   * on show
   * @protected
   * @override
   */
  ;

  _proto.onShow = function onShow() {
    var _this4 = this;

    _BlockOverlay.prototype.onShow.call(this);

    this._onAttachedElementChange = function () {
      return _this4._updateLanguage();
    };

    this._eventManager.listen('changeLanguage', this._onAttachedElementChange);

    this._updateLanguage();
  }
  /**
   * on hide
   * @protected
   * @override
   */
  ;

  _proto.onHide = function onHide() {
    this._eventManager.removeEventHandler('changeLanguage', this._onAttachedElementChange);

    _BlockOverlay.prototype.onHide.call(this);
  };

  return CodeBlockGadget;
}(blockOverlay);

/* harmony default export */ var codeBlockGadget = (codeBlockGadget_CodeBlockGadget);
// CONCATENATED MODULE: ./src/js/wysiwygEditor.js
/**
 * @fileoverview Implments wysiwygEditor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */




























var wysiwygEditor_keyMapper = keyMapper.getSharedInstance();
var FIND_EMPTY_LINE = /<([a-z]+|h\d)>(<br>|<br \/>)<\/\1>/gi;
var FIND_UNNECESSARY_BR = /(?:<br>|<br \/>)<\/(.+?)>/gi;
var wysiwygEditor_FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD|PRE)\b/;
var FIND_OPENING_SPAN_WITH_SPACE = /<span([^>]*)>[\u0020]/g;
var FIND_CLOSING_SPAN_WITH_SPACE = /[\u0020]<\/span>/g;
var FIND_TABLE_AND_HEADING_RX = /^(TABLE|H[1-6])$/;
var EDITOR_CONTENT_CSS_CLASSNAME = 'tui-editor-contents';
var PLACEHOLDER_CSS_CLASSNAME = 'tui-editor-contents-placeholder';
var canObserveMutations = typeof MutationObserver !== 'undefined';
/**
 * Class WysiwygEditor
 * @param {HTMLElement} el - element to insert editor
 * @param {EventManager} eventManager - EventManager instance
 */

var wysiwygEditor_WysiwygEditor = /*#__PURE__*/function () {
  function WysiwygEditor(el, eventManager, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    this.componentManager = new componentManager(this);
    this.eventManager = eventManager;
    this.editorContainerEl = el;
    this._height = 0;
    this._silentChange = false;
    this._keyEventHandlers = {};
    this._managers = {};
    this._linkAttribute = options.linkAttribute || {};
    this._sanitizer = options.sanitizer;

    this._initEvent();

    this._initDefaultKeyEventHandler();

    this.debouncedPostProcessForChange = debounce_default()(function () {
      return _this.postProcessForChange();
    }, 0);
  }
  /**
   * init
   */


  var _proto = WysiwygEditor.prototype;

  _proto.init = function init() {
    var editorBody = document.createElement('div');
    this.editorContainerEl.appendChild(editorBody);
    this.editor = new squireExt(editorBody, {
      blockTag: 'DIV',
      leafNodeNames: {
        HR: false
      },
      allowedBlocks: this._sanitizer && this._sanitizer === htmlSanitizer["a" /* default */] ? [] : ['details', 'summary']
    });
    this.editor.blockCommandShortcuts();
    this._clipboardManager = new wwClipboardManager(this);

    this._initSquireEvent();

    this._clipboardManager.init();

    addClass_default()(this.getBody(), EDITOR_CONTENT_CSS_CLASSNAME);
    css_default()(this.editorContainerEl, 'position', 'relative');

    this._togglePlaceholder();

    this.codeBlockGadget = new codeBlockGadget({
      eventManager: this.eventManager,
      container: this.editorContainerEl,
      wysiwygEditor: this
    });
  }
  /**
   * Initialize EventManager event handler
   * @private
   */
  ;

  _proto._initEvent = function _initEvent() {
    var _this2 = this;

    this.eventManager.listen('wysiwygKeyEvent', function (ev) {
      return _this2._runKeyEventHandlers(ev.data, ev.keyMap);
    });
    this.eventManager.listen('wysiwygRangeChangeAfter', function () {
      return _this2.scrollIntoCursor();
    });
    this.eventManager.listen('contentChangedFromWysiwyg', function () {
      _this2._togglePlaceholder();
    });
  }
  /**
   * Add key event handler
   * @param {string|Array.<string>} keyMap - keyMap string or array of string
   * @param {function} handler handler
   */
  ;

  _proto.addKeyEventHandler = function addKeyEventHandler(keyMap, handler) {
    var _this3 = this;

    if (!handler) {
      handler = keyMap;
      keyMap = 'DEFAULT';
    }

    if (!isArray_default()(keyMap)) {
      keyMap = [keyMap];
    }

    keyMap.forEach(function (key) {
      if (!_this3._keyEventHandlers[key]) {
        _this3._keyEventHandlers[key] = [];
      }

      _this3._keyEventHandlers[key].push(handler);
    });
  }
  /**
   * Remove key event handler.
   * @param {string} keyMap keyMap string
   * @param {function} handler handler
   */
  ;

  _proto.removeKeyEventHandler = function removeKeyEventHandler(keyMap, handler) {
    if (!handler) {
      handler = keyMap;
      keyMap = 'DEFAULT';
    }

    var handlers = this._keyEventHandlers[keyMap];

    if (handlers) {
      this._keyEventHandlers[keyMap] = handlers.filter(function (_handler) {
        return _handler !== handler;
      });
    }
  }
  /**
   * Run key event handler
   * @param {Event} event event object
   * @param {string} keyMap keyMapString
   * @private
   */
  ;

  _proto._runKeyEventHandlers = function _runKeyEventHandlers(event, keyMap) {
    var range = this.getRange();
    var handlers, isNeedNext;
    handlers = this._keyEventHandlers.DEFAULT;

    if (handlers) {
      forEachArray_default()(handlers, function (handler) {
        isNeedNext = handler(event, range, keyMap);
        return isNeedNext;
      });
    }

    handlers = this._keyEventHandlers[keyMap];

    if (handlers && isNeedNext !== false) {
      forEachArray_default()(handlers, function (handler) {
        return handler(event, range, keyMap);
      });
    }
  }
  /**
   * Initialize squire event
   * @private
   */
  ;

  _proto._initSquireEvent = function _initSquireEvent() {
    var _this4 = this;

    var squire = this.getEditor();
    var isNeedFirePostProcessForRangeChange = false;
    squire.addEventListener('copy', function (clipboardEvent) {
      _this4.eventManager.emit('copy', {
        source: 'wysiwyg',
        data: clipboardEvent
      });

      debounce_default()(function () {
        if (!_this4.isEditorValid()) {
          return;
        }

        _this4.eventManager.emit('copyAfter', {
          source: 'wysiwyg',
          data: clipboardEvent
        });
      })();
    });
    squire.addEventListener(browser_default.a.msie ? 'beforecut' : 'cut', function (clipboardEvent) {
      _this4.eventManager.emit('cut', {
        source: 'wysiwyg',
        data: clipboardEvent
      });

      debounce_default()(function () {
        if (!_this4.isEditorValid()) {
          return;
        }

        _this4.eventManager.emit('cutAfter', {
          source: 'wysiwyg',
          data: clipboardEvent
        });
      })();
    });
    squire.addEventListener(browser_default.a.msie ? 'beforepaste' : 'paste', function (clipboardEvent) {
      _this4.eventManager.emit('paste', {
        source: 'wysiwyg',
        data: clipboardEvent
      });
    });
    squire.addEventListener('dragover', function (ev) {
      ev.preventDefault();
      return false;
    });
    squire.addEventListener('drop', function (ev) {
      ev.preventDefault();

      _this4.eventManager.emit('drop', {
        source: 'wysiwyg',
        data: ev
      });

      return false;
    }); // change event will fired after range has been updated

    squire.addEventListener('input', debounce_default()(function () {
      if (!_this4.isEditorValid()) {
        return;
      }

      if (!_this4._silentChange) {
        var eventObj = {
          source: 'wysiwyg'
        };

        _this4.eventManager.emit('changeFromWysiwyg', eventObj);

        _this4.eventManager.emit('change', eventObj);

        _this4.eventManager.emit('contentChangedFromWysiwyg', _this4);
      } else {
        _this4._silentChange = false;
      }

      _this4.getEditor().preserveLastLine();
    }, 0));
    squire.addEventListener('keydown', function (keyboardEvent) {
      var range = _this4.getEditor().getSelection();

      if (!range.collapsed) {
        isNeedFirePostProcessForRangeChange = true;
      }

      _this4.eventManager.emit('keydown', {
        source: 'wysiwyg',
        data: keyboardEvent
      });

      _this4._onKeyDown(keyboardEvent);
    });

    if (browser_default.a.firefox) {
      squire.addEventListener('keypress', function (keyboardEvent) {
        var keyCode = keyboardEvent.keyCode;

        if (keyCode === 13 || keyCode === 9) {
          var range = _this4.getEditor().getSelection();

          if (!range.collapsed) {
            isNeedFirePostProcessForRangeChange = true;
          }

          _this4.eventManager.emit('keydown', {
            source: 'wysiwyg',
            data: keyboardEvent
          });

          _this4._onKeyDown(keyboardEvent);
        }
      }); // firefox produces shattered text nodes

      squire.addEventListener('keyup', function () {
        var range = _this4.getRange();

        if (dom["a" /* default */].isTextNode(range.commonAncestorContainer) && dom["a" /* default */].isTextNode(range.commonAncestorContainer.previousSibling)) {
          var prevLen = range.commonAncestorContainer.previousSibling.length;
          var curEl = range.commonAncestorContainer;
          range.commonAncestorContainer.previousSibling.appendData(range.commonAncestorContainer.data);
          range.setStart(range.commonAncestorContainer.previousSibling, prevLen + range.startOffset);
          range.collapse(true);
          dom["a" /* default */].remove(curEl);

          _this4.setRange(range);

          range.detach();
        }
      });
    }

    squire.addEventListener('keyup', function (keyboardEvent) {
      if (isNeedFirePostProcessForRangeChange) {
        _this4.debouncedPostProcessForChange();

        isNeedFirePostProcessForRangeChange = false;
      }

      _this4.eventManager.emit('keyup', {
        source: 'wysiwyg',
        data: keyboardEvent
      });
    });
    on_default()(this.editorContainerEl, 'scroll', function (ev) {
      _this4.eventManager.emit('scroll', {
        source: 'wysiwyg',
        data: ev
      });
    });
    squire.addEventListener('click', function (ev) {
      _this4.eventManager.emit('click', {
        source: 'wysiwyg',
        data: ev
      });
    });
    squire.addEventListener('mousedown', function (ev) {
      _this4.eventManager.emit('mousedown', {
        source: 'wysiwyg',
        data: ev
      });
    });
    squire.addEventListener('mouseover', function (ev) {
      _this4.eventManager.emit('mouseover', {
        source: 'wysiwyg',
        data: ev
      });
    });
    squire.addEventListener('mouseout', function (ev) {
      _this4.eventManager.emit('mouseout', {
        source: 'wysiwyg',
        data: ev
      });
    });
    squire.addEventListener('mouseup', function (ev) {
      _this4.eventManager.emit('mouseup', {
        source: 'wysiwyg',
        data: ev
      });
    });
    squire.addEventListener('contextmenu', function (ev) {
      _this4.eventManager.emit('contextmenu', {
        source: 'wysiwyg',
        data: ev
      });
    });
    squire.addEventListener('focus', function () {
      _this4.eventManager.emit('focus', {
        source: 'wysiwyg'
      });
    });
    squire.addEventListener('blur', function () {
      _this4.fixIMERange();

      _this4.eventManager.emit('blur', {
        source: 'wysiwyg'
      });
    }); // Toolbar status active/inactive

    squire.addEventListener('pathChange', function (data) {
      var state = {
        strong: /(^B>|>B$|>B>|^B$|STRONG)/.test(data.path),
        emph: /(>I|>EM|^I$|^EM$)/.test(data.path),
        strike: /(^S>|>S$|>S>|^S$|DEL)/.test(data.path),
        code: /CODE/.test(data.path),
        codeBlock: /PRE/.test(data.path),
        blockQuote: /BLOCKQUOTE/.test(data.path),
        table: /TABLE/.test(data.path),
        heading: /H[1-6]/.test(data.path),
        list: /UL>LI(?!.task-list-item)/.test(data.path),
        orderedList: /OL>LI(?!.task-list-item)/.test(data.path),
        taskList: /[UL|OL]>LI.task-list-item/.test(data.path),
        source: 'wysiwyg'
      };

      _this4.eventManager.emit('stateChange', state);
    });
    squire.addEventListener('willPaste', function (ev) {
      // ev has 'fragment' when event occurs from 'insertHTML' of squire
      // ev has 'text' when event occurs from 'insertPlainText' of squire
      if (ev.fragment) {
        _this4.eventManager.emit('willPaste', {
          source: 'wysiwyg',
          data: ev
        });
      }
    });
  };

  _proto._togglePlaceholder = function _togglePlaceholder() {
    var squire = this.getEditor();
    squire.modifyDocument(function () {
      var root = squire.getRoot();

      if (root.textContent || root.childNodes.length > 1) {
        root.classList.remove(PLACEHOLDER_CSS_CLASSNAME);
      } else {
        root.classList.add(PLACEHOLDER_CSS_CLASSNAME);
      }
    });
  }
  /**
   * Handler of keydown event
   * @param {object} keyboardEvent Event object
   * @private
   */
  ;

  _proto._onKeyDown = function _onKeyDown(keyboardEvent) {
    var keyMap = wysiwygEditor_keyMapper.convert(keyboardEvent); // to avoid duplicate event firing in firefox

    if (keyboardEvent.keyCode) {
      this.eventManager.emit('keyMap', {
        source: 'wysiwyg',
        keyMap: keyMap,
        data: keyboardEvent
      });

      if (!keyboardEvent.defaultPrevented) {
        this.eventManager.emit('wysiwygKeyEvent', {
          keyMap: keyMap,
          data: keyboardEvent
        });
      }
    }
  }
  /**
   * Initialize default event handler
   * @private
   */
  ;

  _proto._initDefaultKeyEventHandler = function _initDefaultKeyEventHandler() {
    var _this5 = this;

    this.addKeyEventHandler('ENTER', function (ev, range) {
      if (_this5._isInOrphanText(range)) {
        // We need this cuz input text right after table make orphan text in webkit
        _this5.defer(function () {
          _this5._wrapDefaultBlockToOrphanTexts();

          _this5.breakToNewDefaultBlock(range, 'before');
        });
      }

      _this5.defer(function () {
        return _this5.scrollIntoCursor();
      });
    });
    this.addKeyEventHandler('TAB', function (ev) {
      var sq = _this5.getEditor();

      var range = sq.getSelection();

      var isAbleToInput4Spaces = range.collapsed && _this5._isCursorNotInRestrictedAreaOfTabAction(sq);

      var isTextSelection = !range.collapsed && dom["a" /* default */].isTextNode(range.commonAncestorContainer);
      ev.preventDefault();

      if (isAbleToInput4Spaces || isTextSelection) {
        sq.insertPlainText("\xA0\xA0\xA0\xA0");
        return false;
      }

      return true;
    });
    this.addKeyEventHandler('BACK_SPACE', function (ev, range, keymap) {
      return _this5._handleRemoveKeyEvent(ev, range, keymap);
    });
    this.addKeyEventHandler('DELETE', function (ev, range, keymap) {
      return _this5._handleRemoveKeyEvent(ev, range, keymap);
    });
  };

  _proto._handleRemoveKeyEvent = function _handleRemoveKeyEvent(ev, range, keyMap) {
    var sq = this.getEditor();

    if (this._isStartHeadingOrTableAndContainsThem(range)) {
      var keyStr = keyMap === 'BACK_SPACE' ? 'backspace' : 'delete';
      sq.removeAllFormatting();

      sq._keyHandlers[keyStr](sq, ev, sq.getSelection());

      sq.removeLastUndoStack();
      return false;
    }

    return true;
  };

  _proto._isStartHeadingOrTableAndContainsThem = function _isStartHeadingOrTableAndContainsThem(range) {
    var startContainer = range.startContainer,
        startOffset = range.startOffset,
        commonAncestorContainer = range.commonAncestorContainer,
        collapsed = range.collapsed;
    var root = this.getEditor().getRoot();
    var result = false;

    if (!collapsed && commonAncestorContainer === root) {
      if (startContainer === root) {
        result = FIND_TABLE_AND_HEADING_RX.test(dom["a" /* default */].getChildNodeByOffset(startContainer, startOffset).nodeName);
      } else if (startOffset === 0) {
        result = FIND_TABLE_AND_HEADING_RX.test(dom["a" /* default */].getParentUntil(startContainer, root).nodeName);
      }
    }

    return result;
  };

  _proto._wrapDefaultBlockToOrphanTexts = function _wrapDefaultBlockToOrphanTexts() {
    var textNodes = toArray_default()(this.getBody().childNodes).filter(function (node) {
      return dom["a" /* default */].isTextNode(node);
    });
    dom["a" /* default */].getAllTextNode(this.getBody());
    textNodes.forEach(function (node) {
      if (node.nextSibling && node.nextSibling.tagName === 'BR') {
        dom["a" /* default */].remove(node.nextSibling);
      }

      dom["a" /* default */].wrap(node, document.createElement('div'));
    });
  }
  /**
   * check if range is orphan text
   * @param {Range} range range
   * @returns {boolean} result
   * @private
   */
  ;

  _proto._isInOrphanText = function _isInOrphanText(range) {
    return range.startContainer.nodeType === Node.TEXT_NODE && range.startContainer.parentNode === this.getBody();
  }
  /**
   * Wrap default block to passed range
   * @param {Range} range range
   * @private
   */
  ;

  _proto._wrapDefaultBlockTo = function _wrapDefaultBlockTo(range) {
    this.saveSelection(range);

    this._joinSplitedTextNodes();

    this.restoreSavedSelection();
    range = this.getRange();
    var textElem = range.startContainer;
    var cursorOffset = range.startOffset; // after code below, range range is arranged by body

    var block = this.getEditor().createDefaultBlock([range.startContainer]); // range for insert block

    var insertTargetNode = dom["a" /* default */].getChildNodeByOffset(range.startContainer, range.startOffset);

    if (insertTargetNode) {
      range.setStartBefore(insertTargetNode);
    } else {
      // only child in container
      range.selectNodeContents(range.startContainer);
    }

    range.collapse(true);
    range.insertNode(block); // revert range to original node

    range.setStart(textElem, cursorOffset);
    range.collapse(true);
    this.setRange(range);
  }
  /**
   * Join spliated text nodes
   * @private
   */
  ;

  _proto._joinSplitedTextNodes = function _joinSplitedTextNodes() {
    var prevNode, lastGroup;
    var nodesToRemove = [];
    var textNodes = toArray_default()(this.getBody().childNodes).filter(function (node) {
      return dom["a" /* default */].isTextNode(node);
    });
    textNodes.forEach(function (node) {
      if (prevNode === node.previousSibling) {
        lastGroup.nodeValue += node.nodeValue;
        nodesToRemove.push(node);
      } else {
        lastGroup = node;
      }

      prevNode = node;
    });
    dom["a" /* default */].remove(nodesToRemove);
  }
  /**
   * Save current selection before modification
   * @param {Range} range Range object
   */
  ;

  _proto.saveSelection = function saveSelection(range) {
    if (!range) {
      range = this.getRange();
    }

    this.getEditor()._saveRangeToBookmark(range);
  }
  /**
   * set selection by start/end container/offset
   * @param {HTMLNode} startContainer - start container
   * @param {Number} startOffset - start offset
   * @param {HTMLNode} endContainer - end container
   * @param {Number} endOffset - end offset
   * @returns {Range} - range instance
   */
  ;

  _proto.setSelectionByContainerAndOffset = function setSelectionByContainerAndOffset(startContainer, startOffset, endContainer, endOffset) {
    var sq = this.getEditor();
    var range = sq.getSelection();
    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
    sq.setSelection(range);
    return range;
  }
  /**
   * Restore saved selection
   */
  ;

  _proto.restoreSavedSelection = function restoreSavedSelection() {
    this.setRange(this.getEditor()._getRangeAndRemoveBookmark());
  }
  /**
   * Reset wysiwyg editor
   */
  ;

  _proto.reset = function reset() {
    this.setValue('');
  }
  /**
   * Change current range block format to passed tag
   * @param {string} targetTagName Target element tag name
   */
  ;

  _proto.changeBlockFormatTo = function changeBlockFormatTo(targetTagName) {
    this.getEditor().changeBlockFormatTo(targetTagName);
    this.eventManager.emit('wysiwygRangeChangeAfter', this);
  }
  /**
   * Make empty block to current selection
   */
  ;

  _proto.makeEmptyBlockCurrentSelection = function makeEmptyBlockCurrentSelection() {
    var _this6 = this;

    this.getEditor().modifyBlocks(function (frag) {
      if (!frag.textContent) {
        frag = _this6.getEditor().createDefaultBlock();
      }

      return frag;
    });
  }
  /**
   * Focus to editor
   */
  ;

  _proto.focus = function focus() {
    var scrollTop = this.scrollTop();
    this.editor.focus(); // In webkit, if contenteditable element focus method have been invoked when another input element has focus,
    // contenteditable scroll to top automatically so we need scroll it back

    if (scrollTop !== this.scrollTop()) {
      this.scrollTop(scrollTop);
    }
  }
  /**
   * Remove focus of editor
   */
  ;

  _proto.blur = function blur() {
    this.editor.blur();
  }
  /**
   * Remove wysiwyg editor
   */
  ;

  _proto.remove = function remove() {
    off_default()(this.editorContainerEl, 'scroll');
    this.getEditor().destroy();
    this.editor = null;
    this.body = null;
    this.eventManager = null;
  }
  /**
   * Set editor height
   * @param {number|string} height pixel of height or "auto"
   */
  ;

  _proto.setHeight = function setHeight(height) {
    this._height = height;
    css_default()(this.editorContainerEl, {
      overflow: 'auto',
      height: '100%'
    });
    css_default()(this.editorContainerEl.parentNode, {
      height: isNumber_default()(height) ? height + "px" : height
    });
    var containerStyles = this.editorContainerEl.style;
    var bodyStyles = this.getBody().style;
    var paddingHeight = parseInt(containerStyles.paddingTop, 10) - parseInt(containerStyles.paddingBottom, 10);
    var marginHeight = parseInt(bodyStyles.marginTop, 10) - parseInt(bodyStyles.marginBottom, 10);
    css_default()(this.getBody(), {
      minHeight: height - marginHeight - paddingHeight + "px"
    });
  }
  /**
   * Set min height
   * @param {number} minHeight - min height in px
   */
  ;

  _proto.setMinHeight = function setMinHeight(minHeight) {
    var editorBody = this.getBody();
    css_default()(editorBody, 'minHeight', minHeight + "px");
  }
  /**
   * Set the placeholder to wysiwyg editor
   * @param {string} placeholder - placeholder to set
   */
  ;

  _proto.setPlaceholder = function setPlaceholder(placeholder) {
    if (placeholder) {
      this.getEditor().getRoot().setAttribute('data-placeholder', placeholder);
    }
  }
  /**
   * Get attribute of link for wysiwyg
   * @returns {object} attribute - attribute of anchor tag
   */
  ;

  _proto.getLinkAttribute = function getLinkAttribute() {
    return this._linkAttribute;
  }
  /**
   * Set value to wysiwyg editor
   * @param {string} html - HTML text
   * @param {boolean} [cursorToEnd=true] - move cursor to contents end
   */
  ;

  _proto.setValue = function setValue(html, cursorToEnd) {
    if (cursorToEnd === void 0) {
      cursorToEnd = true;
    }

    html = this.eventManager.emitReduce('wysiwygSetValueBefore', html);
    this.editor.setHTML(html);
    this.eventManager.emit('wysiwygSetValueAfter', this);
    this.eventManager.emit('contentChangedFromWysiwyg', this);

    if (cursorToEnd) {
      this.moveCursorToEnd();
    }

    this.getEditor().preserveLastLine();
    this.getEditor().removeLastUndoStack();
    this.getEditor().saveUndoState();
  }
  /**
   * Insert given text to cursor position or selected area
   * @param {string} text - text string to insert
   */
  ;

  _proto.insertText = function insertText(text) {
    this.editor.insertPlainText(text);
  }
  /**
   * Get value of wysiwyg editor
   * @returns {string} html
   */
  ;

  _proto.getValue = function getValue() {
    this._prepareGetHTML();

    var html = this.editor.getHTML(); // empty line replace to br

    html = html.replace(FIND_EMPTY_LINE, function (match, tag) {
      var result; // we maintain empty list

      if (tag === 'li') {
        result = match; // we maintain empty table
      } else if (tag === 'td' || tag === 'th') {
        result = "<" + tag + "></" + tag + ">";
      } else {
        result = '<br />';
      }

      return result;
    }); // replace a space of the first and end in span tag to &nbsp;.

    html = html.replace(FIND_OPENING_SPAN_WITH_SPACE, '<span$1>&nbsp;');
    html = html.replace(FIND_CLOSING_SPAN_WITH_SPACE, '&nbsp;</span>'); // remove unnecessary brs

    html = html.replace(FIND_UNNECESSARY_BR, '</$1>'); // remove contenteditable block, in this case div

    html = html.replace(/<div[^>]*>/g, '');
    html = html.replace(/<\/div>/g, '<br />');
    html = this.eventManager.emitReduce('wysiwygProcessHTMLText', html);
    return html;
  }
  /**
   * Prepare before get html
   * @private
   */
  ;

  _proto._prepareGetHTML = function _prepareGetHTML() {
    var _this7 = this;

    this.getEditor().modifyDocument(function () {
      _this7._joinSplitedTextNodes();

      _this7.eventManager.emit('wysiwygGetValueBefore', _this7);
    });
  }
  /**
   * postProcessForChange
   */
  ;

  _proto.postProcessForChange = function postProcessForChange() {
    var _this8 = this;

    if (!this.isEditorValid()) {
      return;
    }

    this.getEditor().modifyDocument(function () {
      _this8.eventManager.emit('wysiwygRangeChangeAfter', _this8);
    });
  }
  /**
   * Ready to silent change
   */
  ;

  _proto.readySilentChange = function readySilentChange() {
    if (canObserveMutations && !this.getEditor().isIgnoreChange()) {
      this._silentChange = true;
    }
  }
  /**
   * Get squire
   * @returns {SquireExt} squire
   */
  ;

  _proto.getEditor = function getEditor() {
    return this.editor;
  }
  /**
   * Replace text of passed range
   * @param {string} content Content for change current selection
   * @param {Range} range range
   */
  ;

  _proto.replaceSelection = function replaceSelection(content, range) {
    this.getEditor().replaceSelection(content, range);
  }
  /**
   * Replace content by relative offset
   * @param {string} content Content for change current selection
   * @param {number} offset Offset of current range
   * @param {number} overwriteLength Length to overwrite content
   */
  ;

  _proto.replaceRelativeOffset = function replaceRelativeOffset(content, offset, overwriteLength) {
    this.getEditor().replaceRelativeOffset(content, offset, overwriteLength);
  }
  /**
   * Add widget to selection
   * @param {Range} range Range object
   * @param {Node} node Widget node
   * @param {string} style Adding style "over" or "bottom"
   * @param {number} [offset] Offset to adjust position
   */
  ;

  _proto.addWidget = function addWidget(range, node, style, offset) {
    var pos = this.getEditor().getSelectionPosition(range, style, offset);
    var editorContainerPos = dom["a" /* default */].getOffset(this.editorContainerEl);
    this.editorContainerEl.appendChild(node);
    css_default()(node, {
      position: 'absolute',
      top: pos.top - editorContainerPos.top + "px",
      left: pos.left - editorContainerPos.left + "px"
    });
  }
  /**
   * Get body container of Squire
   * @returns {HTMLElement} body element
   */
  ;

  _proto.getBody = function getBody() {
    return this.getEditor().getBody();
  }
  /**
   * Check with given regexp whether current path has some format or not
   * @param {RegExp} rx Regexp
   * @returns {boolean} Match result
   */
  ;

  _proto.hasFormatWithRx = function hasFormatWithRx(rx) {
    return this.getEditor().getPath().match(rx);
  }
  /**
   * Break line to new default block from passed range
   * @param {Range} range Range object
   * @param {string} [where] "before" or not
   */
  ;

  _proto.breakToNewDefaultBlock = function breakToNewDefaultBlock(range, where) {
    var div = this.editor.createDefaultBlock();
    var currentNode = dom["a" /* default */].getChildNodeByOffset(range.startContainer, range.startOffset) || dom["a" /* default */].getChildNodeByOffset(range.startContainer, range.startOffset - 1);
    var appendBefore = dom["a" /* default */].getParentUntil(currentNode, this.getBody());

    if (where === 'before') {
      dom["a" /* default */].insertBefore(div, appendBefore);
    } else {
      dom["a" /* default */].insertAfter(div, appendBefore);
    }

    range.setStart(div, 0);
    range.collapse(true);
    this.setRange(range);
  }
  /**
   * Replace textContet of node
   * @param {Node} container Container node
   * @param {string} from Target text to change
   * @param {string} to Replacement text
   */
  ;

  _proto.replaceContentText = function replaceContentText(container, from, to) {
    var beforeText = container.innerHTML;
    container.innerHTML = beforeText.replace(from, to);
  }
  /**
   * Unwrap Block tag of current range
   * @param {function} [condition] iterate with tagName
   */
  ;

  _proto.unwrapBlockTag = function unwrapBlockTag(condition) {
    if (!condition) {
      condition = function condition(tagName) {
        return wysiwygEditor_FIND_BLOCK_TAGNAME_RX.test(tagName);
      };
    }

    this.getEditor().changeBlockFormat(condition);
    this.eventManager.emit('wysiwygRangeChangeAfter', this);
  }
  /**
   * move scroll to cursor
   * scrollIntoView browser function may cause scrolling on document.
   * this function aims to replace scrollIntoView function to prevent that.
   * it will move the scroll of squire only.
   */
  ;

  _proto.scrollIntoCursor = function scrollIntoCursor() {
    var scrollTop = this.scrollTop();

    var _this$getEditor$getCu = this.getEditor().getCursorPosition(),
        cursorTop = _this$getEditor$getCu.top,
        cursorHeight = _this$getEditor$getCu.height;

    var _this$editorContainer = this.editorContainerEl.getBoundingClientRect(),
        editorTop = _this$editorContainer.top,
        editorHeight = _this$editorContainer.height;

    var cursorAboveEditor = cursorTop - editorTop;
    var cursorBelowEditor = cursorTop + cursorHeight - (editorTop + editorHeight);

    if (cursorAboveEditor < 0) {
      this.scrollTop(scrollTop + cursorAboveEditor);
    } else if (cursorBelowEditor > 0) {
      this.scrollTop(Math.ceil(scrollTop + cursorBelowEditor));
    }
  }
  /**
   * Set cursor position to end
   */
  ;

  _proto.moveCursorToEnd = function moveCursorToEnd() {
    this.getEditor().moveCursorToEnd();
    this.scrollIntoCursor();

    this._correctRangeAfterMoveCursor('end');
  }
  /**
   * Set cursor position to start
   */
  ;

  _proto.moveCursorToStart = function moveCursorToStart() {
    this.getEditor().moveCursorToStart();
    this.scrollTop(0);
  }
  /**
   * Set cursor position to start
   * @param {number} value Scroll amount
   * @returns {number} value of scrollTop
   */
  ;

  _proto.scrollTop = function scrollTop(value) {
    if (!isUndefined_default()(value)) {
      this.editorContainerEl.scrollTop = value;
    }

    return this.editorContainerEl.scrollTop;
  }
  /**
   * For arrange Range after moveCursorToEnd api invocation. Squire has bug in Firefox, IE.
   * @param {string} direction Direction of cursor move
   * @private
   */
  ;

  _proto._correctRangeAfterMoveCursor = function _correctRangeAfterMoveCursor(direction) {
    var range = this.getRange();
    var cursorContainer = this.getBody();

    if (direction === 'start') {
      while (cursorContainer.firstChild) {
        cursorContainer = cursorContainer.firstChild;
      }
    } else {
      while (cursorContainer.lastChild) {
        cursorContainer = cursorContainer.lastChild;
      }
    } // IE have problem with cursor after br


    if (cursorContainer.tagName === 'BR') {
      range.setStartBefore(cursorContainer);
    } else {
      range.setStartAfter(cursorContainer);
    }

    range.collapse(true);
    this.setRange(range);
  }
  /**
   * Get current Range object
   * @returns {Range}
   */
  ;

  _proto.getRange = function getRange() {
    return this.getEditor().getSelection().cloneRange();
  }
  /**
   * get IME range
   * cjk composition causes wrong caret position.
   * it returns fixed IME composition range
   * @returns {Range}
   */
  ;

  _proto.getIMERange = function getIMERange() {
    var range;
    var selection = getSelection();

    if (selection && selection.rangeCount) {
      range = selection.getRangeAt(0).cloneRange();
    }

    return range;
  }
  /**
   * get IME range
   * cjk composition causes wrong caret position.
   * it sets fixed IME composition range
   */
  ;

  _proto.fixIMERange = function fixIMERange() {
    var range = this.getIMERange(); // range exists and it's an WYSIWYG editor content

    if (range) {
      var contentElement = dom["a" /* default */].getParentUntil(range.commonAncestorContainer, this.editorContainerEl);
      var foundEditorElement = !!(contentElement && contentElement.parentNode);

      if (foundEditorElement) {
        this.setRange(range);
      }
    }
  }
  /**
   * set range
   * @param {Range} range - range to set
   */
  ;

  _proto.setRange = function setRange(range) {
    this.getEditor().setSelection(range);
  }
  /**
   * Check whether passed range is in table or not
   * @param {Range} range range
   * @returns {boolean} result
   */
  ;

  _proto.isInTable = function isInTable(range) {
    var target = range.collapsed ? range.startContainer : range.commonAncestorContainer;
    return !!dom["a" /* default */].closest(target, '[contenteditable=true] table');
  }
  /**
   * Get text object of current range
   * @param {Range} range Range object
   * @returns {WwTextObject}
   */
  ;

  _proto.getTextObject = function getTextObject(range) {
    return new wwTextObject(this, range);
  };

  _proto.defer = function defer(callback, delayOffset) {
    var _this9 = this;

    var delay = delayOffset ? delayOffset : 0;
    setTimeout(function () {
      if (_this9.isEditorValid()) {
        callback(_this9);
      }
    }, delay);
  };

  _proto.isEditorValid = function isEditorValid() {
    return this.getEditor() && dom["a" /* default */].isContain(document.body, this.editorContainerEl);
  };

  _proto._isCursorNotInRestrictedAreaOfTabAction = function _isCursorNotInRestrictedAreaOfTabAction(editor) {
    return !editor.hasFormat('li') && !editor.hasFormat('blockquote') && !editor.hasFormat('table');
  };

  _proto.getSanitizer = function getSanitizer() {
    return this._sanitizer;
  }
  /**
   * WysiwygEditor factory method
   * @param {HTMLElement} el Container element for editor
   * @param {EventManager} eventManager EventManager instance
   * @param {object} [options={}] - option object
   * @returns {WysiwygEditor} wysiwygEditor
   * @ignore
   */
  ;

  WysiwygEditor.factory = function factory(el, eventManager, options) {
    var wwe = new WysiwygEditor(el, eventManager, options);
    wwe.init();
    wwe.componentManager.addManager(wwLinkManager_WwLinkManager);
    wwe.componentManager.addManager(wwListManager);
    wwe.componentManager.addManager(wwTaskManager);
    wwe.componentManager.addManager(wwTableSelectionManager);
    wwe.componentManager.addManager(wwTableManager);
    wwe.componentManager.addManager(wwHrManager);
    wwe.componentManager.addManager(wwPManager);
    wwe.componentManager.addManager(wwHeadingManager);
    wwe.componentManager.addManager(wwCodeBlockManager);
    return wwe;
  };

  return WysiwygEditor;
}();

/* harmony default export */ var wysiwygEditor = (wysiwygEditor_WysiwygEditor);
// CONCATENATED MODULE: ./src/js/layout.js
/**
 * @fileoverview editor layout
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */




/**
 * Editor container template
 * @type {string}
 * @ignore
 */

var containerTmpl = ['<div class="tui-editor">', '<div class="te-md-container">', '<div class="te-editor"></div>', '<div class="te-md-splitter"></div>', '<div class="te-preview"></div>', '</div>', '<div class="te-ww-container">', '<div class="te-editor"></div>', '</div>', '</div>'].join('');
/**
 * Class Layout
 * @param {object} options - Option object
 * @param {EventManager} eventManager - Event manager instance
 * @ignore
 */

var layout_Layout = /*#__PURE__*/function () {
  function Layout(options, eventManager) {
    this.el = options.el;
    this.height = options.height;
    this.type = options.initialEditType;
    this.eventManager = eventManager;
    this.init();

    this._initEvent();
  }
  /**
   * Initializer
   * @protected
   */


  var _proto = Layout.prototype;

  _proto.init = function init() {
    this._renderLayout();

    this._initMarkdownAndPreviewSection();

    this._initWysiwygSection();
  }
  /**
   * Initialize show and hide event
   * @private
   */
  ;

  _proto._initEvent = function _initEvent() {
    this.eventManager.listen('hide', this.hide.bind(this));
    this.eventManager.listen('show', this.show.bind(this));
  }
  /**
   * Create editor container with template
   * @private
   */
  ;

  _proto._renderLayout = function _renderLayout() {
    css_default()(this.el, {
      boxSizing: 'border-box'
    });
    this.containerEl = dom["a" /* default */].createElementWith(containerTmpl, this.el);
  }
  /**
   * Switch editor mode to WYSIWYG
   */
  ;

  _proto.switchToWYSIWYG = function switchToWYSIWYG() {
    removeClass_default()(this.containerEl, 'te-md-mode');
    addClass_default()(this.containerEl, 'te-ww-mode');
  }
  /**
   * Switch editor mode to Markdown
   */
  ;

  _proto.switchToMarkdown = function switchToMarkdown() {
    removeClass_default()(this.containerEl, 'te-ww-mode');
    addClass_default()(this.containerEl, 'te-md-mode');
  }
  /**
   * Initialize editor to Markdown and set preview section
   * @private
   */
  ;

  _proto._initMarkdownAndPreviewSection = function _initMarkdownAndPreviewSection() {
    this.mdEditorContainerEl = this.containerEl.querySelector('.te-md-container .te-editor');
    this.previewEl = this.containerEl.querySelector('.te-md-container .te-preview');
  }
  /**
   * Initialize editor to WYSIWYG
   * @private
   */
  ;

  _proto._initWysiwygSection = function _initWysiwygSection() {
    this.wwEditorContainerEl = this.containerEl.querySelector('.te-ww-container .te-editor');
  }
  /**
   * Set preview to vertical split style
   * @private
   */
  ;

  _proto._verticalSplitStyle = function _verticalSplitStyle() {
    var mdContainer = this.containerEl.querySelector('.te-md-container');
    removeClass_default()(mdContainer, 'te-preview-style-tab');
    addClass_default()(mdContainer, 'te-preview-style-vertical');
  }
  /**
   * Set tab style preview mode
   * @private
   */
  ;

  _proto._tabStyle = function _tabStyle() {
    var mdContainer = this.containerEl.querySelector('.te-md-container');
    removeClass_default()(mdContainer, 'te-preview-style-vertical');
    addClass_default()(mdContainer, 'te-preview-style-tab');
  }
  /**
   * Toggle preview style between tab and vertical split
   * @param {string} style Preview style ('tab' or 'vertical')
   */
  ;

  _proto.changePreviewStyle = function changePreviewStyle(style) {
    if (style === 'tab') {
      this._tabStyle();
    } else if (style === 'vertical') {
      this._verticalSplitStyle();
    }
  }
  /**
   * Hide Editor
   */
  ;

  _proto.hide = function hide() {
    addClass_default()(this.el.querySelector('.tui-editor'), 'te-hide');
  }
  /**
   * Show Editor
   */
  ;

  _proto.show = function show() {
    removeClass_default()(this.el.querySelector('.tui-editor'), 'te-hide');
  }
  /**
   * Remove Editor
   */
  ;

  _proto.remove = function remove() {
    dom["a" /* default */].remove(this.el.querySelector('.tui-editor'));
  }
  /**
   * Get wrapped editor container element
   * @returns {HTMLElement}
   */
  ;

  _proto.getEditorEl = function getEditorEl() {
    return this.containerEl;
  }
  /**
   * Get wrapped preview element
   * @returns {HTMLElement}
   */
  ;

  _proto.getPreviewEl = function getPreviewEl() {
    return this.previewEl;
  }
  /**
   * Get wrapped Markdown editor element
   * @returns {HTMLElement}
   */
  ;

  _proto.getMdEditorContainerEl = function getMdEditorContainerEl() {
    return this.mdEditorContainerEl;
  }
  /**
   * Get wrapped WYSIWYG editor element
   * @returns {HTMLElement}
   */
  ;

  _proto.getWwEditorContainerEl = function getWwEditorContainerEl() {
    return this.wwEditorContainerEl;
  };

  return Layout;
}();

/* harmony default export */ var js_layout = (layout_Layout);
// EXTERNAL MODULE: ./src/js/eventManager.js
var js_eventManager = __webpack_require__(36);

// EXTERNAL MODULE: ./src/js/commandManager.js + 1 modules
var commandManager = __webpack_require__(1);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/array/inArray.js
var inArray = __webpack_require__(14);
var inArray_default = /*#__PURE__*/__webpack_require__.n(inArray);

// CONCATENATED MODULE: ./src/js/importManager.js
/**
 * @fileoverview Implement Module for managing import external data such as image
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


var URLRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/([^\s]*))?$/g;
/**
 * Class ImportManager
 * @param {EventManager} eventManager - eventManager
 * @ignore
 */

var importManager_ImportManager = /*#__PURE__*/function () {
  function ImportManager(eventManager) {
    this.eventManager = eventManager;

    this._initEvent();

    this._initDefaultImageImporter();
  }
  /**
   * graceful decode uri component
   * @param {string} originalURI - string to be decoded
   * @returns {string} decoded string
   * @static
   */


  ImportManager.decodeURIGraceful = function decodeURIGraceful(originalURI) {
    var uris = originalURI.split(' ');
    var decodedURIs = [];
    var decodedURI;
    forEachArray_default()(uris, function (uri) {
      try {
        decodedURI = decodeURIComponent(uri);
        decodedURI = decodedURI.replace(/ /g, '%20');
      } catch (e) {
        decodedURI = uri;
      }

      return decodedURIs.push(decodedURI);
    });
    return decodedURIs.join(' ');
  }
  /**
   * encode markdown critical characters
   * @param {string} text - string to encode
   * @returns {string} - markdown character encoded string
   * @static
   */
  ;

  ImportManager.encodeMarkdownCharacters = function encodeMarkdownCharacters(text) {
    return text.replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\[/g, '%5B').replace(/\]/g, '%5D').replace(/</g, '%3C').replace(/>/g, '%3E');
  }
  /**
   * escape markdown critical characters
   * @param {string} text - string to escape
   * @returns {string} - markdown character escaped string
   * @static
   */
  ;

  ImportManager.escapeMarkdownCharacters = function escapeMarkdownCharacters(text) {
    return text.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/</g, '\\<').replace(/>/g, '\\>');
  }
  /**
   * Initialize event handler
   * @private
   */
  ;

  var _proto = ImportManager.prototype;

  _proto._initEvent = function _initEvent() {
    var _this = this;

    this.eventManager.listen('drop', function (ev) {
      var items = ev.data.dataTransfer && ev.data.dataTransfer.files;

      _this._processBlobItems(items, ev.data);
    });
    this.eventManager.listen('willPaste', function (ev) {
      // IE has no interface to handle clipboard image. #976
      var fragment = ev.data.fragment;
      var descendant = fragment.querySelectorAll('*'); // only if paste event data has one img element and the element has base64 encoded image

      if (descendant.length !== 1 || descendant[0].tagName !== 'IMG' || !/^data:image/.test(descendant[0].src)) {
        return;
      }

      ev.data.preventDefault();
      var blob = dataURItoBlob(descendant[0].src);

      _this._emitAddImageBlobHook(blob, 'paste');
    });
    this.eventManager.listen('paste', function (ev) {
      _this._processClipboard(ev.data);
    });
    this.eventManager.listen('pasteBefore', function (ev) {
      _this._decodeURL(ev);
    });
  }
  /**
   * Initialize default image importer
   * @private
   */
  ;

  _proto._initDefaultImageImporter = function _initDefaultImageImporter() {
    this.eventManager.listen('addImageBlobHook', function (blob, callback) {
      var reader = new FileReader();

      reader.onload = function (event) {
        callback(event.target.result);
      };

      reader.readAsDataURL(blob);
    });
  }
  /**
   * Emit add image blob hook
   * @param {object} blob - blob or file
   * @param {string} type - type of an event the item belongs to. paste or drop
   * @private
   */
  ;

  _proto._emitAddImageBlobHook = function _emitAddImageBlobHook(blob, type) {
    var _this2 = this;

    this.eventManager.emit('addImageBlobHook', blob, function (imageUrl, altText) {
      _this2.eventManager.emit('command', 'AddImage', {
        imageUrl: imageUrl,
        altText: altText || blob.name || 'image'
      });
    }, type);
  }
  /**
   * Decode url when paste link
   * @param {object} ev - event object
   * @private
   */
  ;

  _proto._decodeURL = function _decodeURL(ev) {
    var decodeURIGraceful = ImportManager.decodeURIGraceful,
        encodeMarkdownCharacters = ImportManager.encodeMarkdownCharacters;

    if (ev.source === 'markdown' && ev.data.text) {
      var texts = ev.data.text;
      var text = texts[0];

      if (texts.length === 1 && text.match(URLRegex)) {
        text = decodeURIGraceful(text);
        text = encodeMarkdownCharacters(text);
        ev.data.update(null, null, [text]);
      }
    } else if (ev.source === 'wysiwyg') {
      var container = ev.clipboardContainer;
      var _container$childNodes = container.childNodes,
          firstChild = _container$childNodes[0];
      var _text = firstChild.innerText;

      if (container.childNodes.length === 1 && firstChild.tagName === 'A' && _text.match(URLRegex)) {
        firstChild.innerText = decodeURIGraceful(_text);
        firstChild.href = encodeMarkdownCharacters(firstChild.href);
      }
    }
  }
  /**
   * Get blob or excel data from clipboard
   * @param {object} evData Clipboard data
   * @private
   */
  ;

  _proto._processClipboard = function _processClipboard(evData) {
    var cbData = evData.clipboardData || window.clipboardData;
    var blobItems = cbData && cbData.items;
    var types = cbData.types;

    if (blobItems && types && types.length === 1 && inArray_default()('Files', [].slice.call(types)) !== -1) {
      this._processBlobItems(blobItems, evData);
    }
  }
  /**
   * Process for blob item
   * @param {Array.<string>} items Item array
   * @param {object} evData Event data
   * @private
   */
  ;

  _proto._processBlobItems = function _processBlobItems(items, evData) {
    var _this3 = this;

    if (items) {
      forEachArray_default()(items, function (item) {
        if (item.type.indexOf('image') !== -1) {
          evData.preventDefault();
          evData.stopPropagation();
          evData.codemirrorIgnore = true;
          var blob = item.name ? item : item.getAsFile(); // Blob or File

          _this3._emitAddImageBlobHook(blob, evData.type);

          return false;
        }

        return true;
      });
    }
  };

  return ImportManager;
}();
/**
 * data URI to Blob
 * @param {string} dataURI - data URI string
 * @returns {Blob} - blob data
 * @ignore
 */


function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);

  for (var i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }

  var _dataURI$split = dataURI.split(','),
      mimeString = _dataURI$split[0];

  var blob = new Blob([ab], {
    type: mimeString.split(':')[1].split(';')[0]
  });
  return blob;
}

/* harmony default export */ var importManager = (importManager_ImportManager);
// EXTERNAL MODULE: ./src/js/convertor.js
var convertor = __webpack_require__(37);

// EXTERNAL MODULE: ./src/js/viewer.js
var viewer = __webpack_require__(46);

// EXTERNAL MODULE: ./src/js/utils/map.js
var map = __webpack_require__(24);

// CONCATENATED MODULE: ./src/js/i18n.js
/**
 * @fileoverview Implements i18n
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


var DEFAULT_CODE = 'en-US';
/**
 * Class I18n
 * @ignore
 */

var i18n_I18n = /*#__PURE__*/function () {
  function I18n() {
    this._code = DEFAULT_CODE;
    this._langs = new map["a" /* default */]();
  }
  /**
   * Set locale code
   * @param {string} code locale code
   */


  var _proto = I18n.prototype;

  _proto.setCode = function setCode(code) {
    this._code = code;
  }
  /**
   * Set language set
   * @param {string|string[]} codes locale code
   * @param {object} data language set
   */
  ;

  _proto.setLanguage = function setLanguage(codes, data) {
    var _this = this;

    codes = [].concat(codes);
    codes.forEach(function (code) {
      if (!_this._langs.has(code)) {
        _this._langs.set(code, data);
      } else {
        var langData = _this._langs.get(code);

        _this._langs.set(code, extend_default()(langData, data));
      }
    });
  }
  /**
   * Get text of key
   * @param {string} key key of text
   * @param {string} code locale code
   * @returns {string}
   */
  ;

  _proto.get = function get(key, code) {
    if (!code) {
      code = this._code;
    }

    var langSet = this._langs.get(code);

    if (!langSet) {
      langSet = this._langs.get(DEFAULT_CODE);
    }

    var text = langSet[key];

    if (!text) {
      throw new Error("There is no text key \"" + key + "\" in " + code);
    }

    return text;
  };

  return I18n;
}();


/* harmony default export */ var i18n = (new i18n_I18n());
// EXTERNAL MODULE: ./node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js
var ResizeObserver_es = __webpack_require__(57);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/type/isString.js
var isString = __webpack_require__(9);
var isString_default = /*#__PURE__*/__webpack_require__.n(isString);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/type/isObject.js
var isObject = __webpack_require__(54);
var isObject_default = /*#__PURE__*/__webpack_require__.n(isObject);

// EXTERNAL MODULE: ./node_modules/tui-code-snippet/customEvents/customEvents.js
var customEvents = __webpack_require__(58);
var customEvents_default = /*#__PURE__*/__webpack_require__.n(customEvents);

// CONCATENATED MODULE: ./src/js/ui/uicontroller.js
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @fileoverview Implements ui controller
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */








var DOM_EVENTS = ['click', 'mousedown', 'mousemove', 'mouseup', 'mouseover', 'mouseout', 'scroll'];

var _uiInstanceId = -1;
/**
 * get ui instance id
 * @returns {number} - new instance id
 * @ignore
 */


function makeUIInstanceId() {
  _uiInstanceId += 1;
  return _uiInstanceId;
}
/**
 * Class UIController
 * @param {Object} [options] - options
 *     @param {HTMLElement} [options.rootElement] - root element
 *     @param {string} [options.tagName] - tag name
 *     @param {string} [options.className] - class name
 */


var uicontroller_UIController = /*#__PURE__*/function () {
  /**
   * tag name
   * @type {string}
   */

  /**
   * ui controller class name
   * @type {string}
   */

  /**
   * UI element
   * @type {Object}
   */

  /**
   * UI Id
   * @type {number}
   * @private
   */
  function UIController(options) {
    if (options === void 0) {
      options = {};
    }

    _defineProperty(this, "tagName", void 0);

    _defineProperty(this, "className", void 0);

    _defineProperty(this, "el", void 0);

    _defineProperty(this, "_id", void 0);

    options = extend_default()({
      tagName: 'div'
    }, options);
    this.tagName = options.tagName;
    this.className = options.className;
    this._id = makeUIInstanceId();
    this.customEventManager = new customEvents_default.a();

    this._setRootElement(options.rootElement);
  }
  /**
   * @param {string|object} aType - event name and selector string
   * @param {function} aFn - event handler
   */


  var _proto = UIController.prototype;

  _proto.on = function on(aType, aFn) {
    var _this = this;

    if (isObject_default()(aType)) {
      forEachOwnProperties_default()(aType, function (fn, type) {
        _this._addEvent(type, fn);
      });
    } else {
      this._addEvent(aType, aFn);
    }
  };

  _proto._bindDomEvent = function _bindDomEvent(event, selector, fn) {
    if (selector) {
      dom["a" /* default */].findAll(this.el, selector).forEach(function (el) {
        on_default()(el, event, fn);
      });
    } else {
      on_default()(this.el, event, fn);
    }
  }
  /**
   * bind event
   * @param {string} type - event name and selector
   * @param {function} fn - handler function
   * @private
   */
  ;

  _proto._addEvent = function _addEvent(type, fn) {
    var _this$_parseEventType = this._parseEventType(type),
        event = _this$_parseEventType.event,
        selector = _this$_parseEventType.selector;

    if (inArray_default()(event, DOM_EVENTS) > -1) {
      this._bindDomEvent(event, selector, fn);
    } else {
      this.customEventManager.on(event, fn);
    }
  };

  _proto._unbindDomEvent = function _unbindDomEvent(event, selector, fn) {
    if (selector) {
      dom["a" /* default */].findAll(this.el, selector).forEach(function (el) {
        off_default()(el, event, fn);
      });
    } else {
      off_default()(this.el, event, fn);
    }
  }
  /**
   * unbind event handler
   * @param {string} type - event name and selector
   * @param {function} fn - handler function
   */
  ;

  _proto.off = function off(type, fn) {
    var _this$_parseEventType2 = this._parseEventType(type),
        event = _this$_parseEventType2.event,
        selector = _this$_parseEventType2.selector;

    if (inArray_default()(event, DOM_EVENTS) > -1) {
      this._unbindDomEvent(event, selector, fn);
    } else {
      this.customEventManager.off(event, fn);
    }
  }
  /**
   * parse string into event name & selector
   * 'click td' => ['click', 'td']
   * @param {string} type - string to be parsed
   * @returns {Object} event, selector
   * @private
   */
  ;

  _proto._parseEventType = function _parseEventType(type) {
    var splitType = type.split(' ');
    var event = splitType.shift();
    var selector = splitType.join(' ');
    return {
      event: event,
      selector: selector
    };
  }
  /**
   * set root element
   * @param {HTMLElement} el - root element
   * @private
   */
  ;

  _proto._setRootElement = function _setRootElement(el) {
    if (!el) {
      var tagName = this.tagName;
      el = document.createElement(tagName);
      el.className = this.className || "uic" + this._id;
    }

    this.el = el;
  }
  /**
   * trigger event
   * @param {string} eventName - event name
   * @param {*} eventData - event data
   */
  ;

  _proto.trigger = function trigger(eventName, eventData) {
    this.customEventManager.fire(eventName, eventData);
  }
  /**
   * remove
   */
  ;

  _proto.remove = function remove() {
    if (this.el) {
      dom["a" /* default */].remove(this.el);
    }
  }
  /**
   * destroy
   */
  ;

  _proto.destroy = function destroy() {
    var _this2 = this;

    this.remove();
    forEachOwnProperties_default()(this, function (value, key) {
      _this2[key] = null;
    });
  };

  return UIController;
}();

/* harmony default export */ var uicontroller = (uicontroller_UIController);
// CONCATENATED MODULE: ./src/js/ui/toolbarItem.js
function toolbarItem_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function toolbarItem_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @fileoverview Implements Toolbar Item
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


/**
 * Class ToolbarItem
 * @param {Object} [options={name: 'toolbar-item'}] [description]
 */

var toolbarItem_ToolbarItem = /*#__PURE__*/function (_UIController) {
  toolbarItem_inheritsLoose(ToolbarItem, _UIController);

  /**
   * item name
   * @type {String}
   * @static
   * @private
   */

  /**
   * toolbar item class name
   * @type {String}
   * @static
   * @private
   */
  function ToolbarItem(options) {
    var _this;

    if (options === void 0) {
      options = {
        name: ToolbarItem.name
      };
    }

    _this = _UIController.call(this, extend_default()({
      className: ToolbarItem.className
    }, options)) || this;
    _this._name = options.name;
    return _this;
  }
  /**
   * get the name of the toolbar item
   * @returns {string} - the name of the toolbar item
   */


  var _proto = ToolbarItem.prototype;

  _proto.getName = function getName() {
    return this._name;
  };

  return ToolbarItem;
}(uicontroller);

toolbarItem_defineProperty(toolbarItem_ToolbarItem, "name", 'item');

toolbarItem_defineProperty(toolbarItem_ToolbarItem, "className", 'tui-toolbar-item');

/* harmony default export */ var ui_toolbarItem = (toolbarItem_ToolbarItem);
// CONCATENATED MODULE: ./src/js/ui/tooltip.js
/**
 * @fileoverview Implements tooltip
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


var TOOLTIP_CONTENT = '<div class="arrow"></div><span class="text"></span></span>';
var TOOLTIP_TOP_INDENT = 7;
/**
 * Class Tooltip
 * @ignore
 */

var tooltip_Tooltip = /*#__PURE__*/function () {
  function Tooltip() {
    this.el = dom["a" /* default */].createElementWith("<div class=\"tui-tooltip\">" + TOOLTIP_CONTENT + "</div>");
    document.body.appendChild(this.el);
    this.hide();
  }
  /**
   * show tooltop
   * @param {HTMLElement} target - target element to bind
   * @param {String} text - text to show
   */


  var _proto = Tooltip.prototype;

  _proto.show = function show(target, text) {
    var targetRect = target.getBoundingClientRect();
    var left = targetRect.left + window.pageXOffset;
    var top = targetRect.top + window.pageYOffset;
    css_default()(this.el, {
      top: top + target.clientHeight + TOOLTIP_TOP_INDENT + "px",
      left: left + 3 + "px"
    });
    this.el.querySelector('.text').innerHTML = text;
    css_default()(this.el, {
      display: 'block'
    });
  };

  _proto.hide = function hide() {
    css_default()(this.el, {
      display: 'none'
    });
  };

  _proto.remove = function remove() {
    dom["a" /* default */].remove(this.el);
  };

  return Tooltip;
}();

/* harmony default export */ var tooltip = (new tooltip_Tooltip());
// CONCATENATED MODULE: ./src/js/ui/toolbarButton.js
function toolbarButton_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function toolbarButton_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function toolbarButton_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @fileoverview Implements UI ToolbarButton
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


/**
 * @typedef {object} toolbarItemsValue
 * @property {string} type - type of toolbar item (default value is 'button')
 * @property {toolbarButtonOptions} options - options of toolbar item
 */

/**
 * @typedef {object} toolbarButtonOptions
 * @property {HTMLElement} el - target element
 * @property {string} className - button's class name
 * @property {string} command - command name to execute on click
 * @property {string} event - event name to trigger on click
 * @property {string} text - text on button
 * @property {string} tooltip - text on tooltip
 * @property {string} style - button's style
 * @property {string} state - button's state
 */

/**
 * Class ToolbarButton UI
 * @param {toolbarButtonOptions} options - button options
 * @ignore
 */

var toolbarButton_ToolbarButton = /*#__PURE__*/function (_ToolbarItem) {
  toolbarButton_inheritsLoose(ToolbarButton, _ToolbarItem);

  /**
   * item name
   * @type {String}
   * @static
   */

  /**
   * ToolbarItem className
   * @type {String}
   * @static
   */
  function ToolbarButton(options) {
    var _this;

    if (options === void 0) {
      options = {
        tagName: 'button',
        name: ToolbarButton.name
      };
    }

    _this = _ToolbarItem.call(this, {
      name: options.name,
      tagName: 'button',
      className: options.className + " " + ToolbarButton.className,
      rootElement: options.el
    }) || this;

    _this._setOptions(options);

    _this._render();

    _this.on('click', _this._onClick.bind(toolbarButton_assertThisInitialized(_this)));

    if (options.tooltip) {
      _this.on('mouseover', _this._onOver.bind(toolbarButton_assertThisInitialized(_this)));

      _this.on('mouseout', _this._onOut.bind(toolbarButton_assertThisInitialized(_this)));
    }

    return _this;
  }
  /**
   * set tooltip text
   * @param {string} text - tooltip text to show
   */


  var _proto = ToolbarButton.prototype;

  _proto.setTooltip = function setTooltip(text) {
    this._tooltip = text;
  };

  _proto._setOptions = function _setOptions(options) {
    this._command = options.command;
    this._event = options.event;
    this._text = options.text;
    this._tooltip = options.tooltip;
    this._style = options.style;
    this._state = options.state;
  };

  _proto._render = function _render() {
    var text = document.createTextNode(this._text || '');
    this.el.appendChild(text);
    this.el.setAttribute('type', 'button');

    if (this._style) {
      this.el.setAttribute('style', this._style);
    }
  };

  _proto._onClick = function _onClick() {
    if (!this.isEnabled()) {
      return;
    }

    if (this._command) {
      this.trigger('command', this._command);
    } else if (this._event) {
      this.trigger('event', this._event);
    }

    this.trigger('clicked');
  };

  _proto._onOver = function _onOver() {
    if (!this.isEnabled()) {
      return;
    }

    tooltip.show(this.el, this._tooltip);
  };

  _proto._onOut = function _onOut() {
    tooltip.hide();
  }
  /**
   * enable button
   */
  ;

  _proto.enable = function enable() {
    this.el.disabled = false;
  }
  /**
   * disable button
   */
  ;

  _proto.disable = function disable() {
    this.el.disabled = true;
  }
  /**
   * check whether this button is enabled
   * @returns {Boolean} - true for enabled
   */
  ;

  _proto.isEnabled = function isEnabled() {
    return !this.el.disabled;
  };

  return ToolbarButton;
}(ui_toolbarItem);

toolbarButton_defineProperty(toolbarButton_ToolbarButton, "name", 'button');

toolbarButton_defineProperty(toolbarButton_ToolbarButton, "className", 'tui-toolbar-icons');

/* harmony default export */ var toolbarButton = (toolbarButton_ToolbarButton);
// CONCATENATED MODULE: ./src/js/ui/toolbarDivider.js
function toolbarDivider_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function toolbarDivider_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @fileoverview Implements Toolbar Divider
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Class ToolbarDivider
 * @ignore
 */

var ToolbarDivider = /*#__PURE__*/function (_ToolbarItem) {
  toolbarDivider_inheritsLoose(ToolbarDivider, _ToolbarItem);

  /**
   * item name
   * @type {String}
   * @static
   */

  /**
   * item class name
   * @type {String}
   * @static
   */
  function ToolbarDivider() {
    return _ToolbarItem.call(this, {
      name: ToolbarDivider.name,
      tagName: 'div',
      className: ToolbarDivider.className
    }) || this;
  }

  return ToolbarDivider;
}(ui_toolbarItem);

toolbarDivider_defineProperty(ToolbarDivider, "name", 'divider');

toolbarDivider_defineProperty(ToolbarDivider, "className", 'tui-toolbar-divider');

/* harmony default export */ var toolbarDivider = (ToolbarDivider);
// CONCATENATED MODULE: ./src/js/ui/toolbarItemFactory.js
/**
 * @fileoverview Implements Toolbar Item Factory
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */




/**
 * Toolbar Item Factory
 * @ignore
 */

var toolbarItemFactory_ToolbarItemFactory = /*#__PURE__*/function () {
  function ToolbarItemFactory() {}

  /**
   * create toolbar item instance
   * @param {string} name - toolbar item name
   * @param {object} [options] - options to the constructor
   * @return {ToolbarItem} - created toolbar item instance
   * @static
   */

  /* eslint-disable complexity */
  ToolbarItemFactory.create = function create(name, options) {
    var toolbarItem;

    switch (name) {
      case 'heading':
        toolbarItem = new toolbarButton({
          name: 'heading',
          className: 'tui-heading',
          event: 'openHeadingSelect',
          tooltip: i18n.get('Headings'),
          state: 'heading'
        });
        break;

      case 'bold':
        toolbarItem = new toolbarButton({
          name: 'bold',
          className: 'tui-bold',
          command: 'Bold',
          tooltip: i18n.get('Bold'),
          state: 'strong'
        });
        break;

      case 'italic':
        toolbarItem = new toolbarButton({
          name: 'italic',
          className: 'tui-italic',
          command: 'Italic',
          tooltip: i18n.get('Italic'),
          state: 'emph'
        });
        break;

      case 'strike':
        toolbarItem = new toolbarButton({
          name: 'strike',
          className: 'tui-strike',
          command: 'Strike',
          tooltip: i18n.get('Strike'),
          state: 'strike'
        });
        break;

      case 'hr':
        toolbarItem = new toolbarButton({
          name: 'hr',
          className: 'tui-hrline',
          command: 'HR',
          tooltip: i18n.get('Line'),
          state: 'thematicBreak'
        });
        break;

      case 'quote':
        toolbarItem = new toolbarButton({
          name: 'quote',
          className: 'tui-quote',
          command: 'Blockquote',
          tooltip: i18n.get('Blockquote'),
          state: 'blockQuote'
        });
        break;

      case 'ul':
        toolbarItem = new toolbarButton({
          name: 'ul',
          className: 'tui-ul',
          command: 'UL',
          tooltip: i18n.get('Unordered list'),
          state: 'list'
        });
        break;

      case 'ol':
        toolbarItem = new toolbarButton({
          name: 'ol',
          className: 'tui-ol',
          command: 'OL',
          tooltip: i18n.get('Ordered list'),
          state: 'orderedList'
        });
        break;

      case 'task':
        toolbarItem = new toolbarButton({
          name: 'task',
          className: 'tui-task',
          command: 'Task',
          tooltip: i18n.get('Task'),
          state: 'taskList'
        });
        break;

      case 'table':
        toolbarItem = new toolbarButton({
          name: 'table',
          className: 'tui-table',
          event: 'openPopupAddTable',
          tooltip: i18n.get('Insert table'),
          state: 'table'
        });
        break;

      case 'image':
        toolbarItem = new toolbarButton({
          name: 'image',
          className: 'tui-image',
          event: 'openPopupAddImage',
          tooltip: i18n.get('Insert image'),
          state: ''
        });
        break;

      case 'link':
        toolbarItem = new toolbarButton({
          name: 'link',
          className: 'tui-link',
          event: 'openPopupAddLink',
          tooltip: i18n.get('Insert link')
        });
        break;

      case 'code':
        toolbarItem = new toolbarButton({
          name: 'code',
          className: 'tui-code',
          command: 'Code',
          tooltip: i18n.get('Code'),
          state: 'code'
        });
        break;

      case 'codeblock':
        toolbarItem = new toolbarButton({
          name: 'codeblock',
          className: 'tui-codeblock',
          command: 'CodeBlock',
          tooltip: i18n.get('Insert CodeBlock'),
          state: 'codeBlock'
        });
        break;

      case 'indent':
        toolbarItem = new toolbarButton({
          name: 'indent',
          className: 'tui-indent',
          command: 'Indent',
          tooltip: i18n.get('Indent')
        });
        break;

      case 'outdent':
        toolbarItem = new toolbarButton({
          name: 'outdent',
          className: 'tui-outdent',
          command: 'Outdent',
          tooltip: i18n.get('Outdent')
        });
        break;

      case 'divider':
        toolbarItem = new toolbarDivider();
        break;

      case 'button':
        toolbarItem = new toolbarButton(options);
        break;

      case 'item':
      default:
        toolbarItem = new ui_toolbarItem(options);
    }

    return toolbarItem;
  }
  /* eslint-enable complexity */
  ;

  return ToolbarItemFactory;
}();

/* harmony default export */ var toolbarItemFactory = (toolbarItemFactory_ToolbarItemFactory);
// CONCATENATED MODULE: ./src/js/ui/toolbar.js
function toolbar_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function toolbar_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function toolbar_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @fileoverview Implements toolbar
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */






/**
 * Class Toolbar
 * @param {EventManager} eventManager - event manager
 * @param {ToolbarItem[]} [items=[]] - toolbar items
 */

var toolbar_Toolbar = /*#__PURE__*/function (_UIController) {
  toolbar_inheritsLoose(Toolbar, _UIController);

  /**
   * items
   * @type {Array}
   * @private
   */

  /**
   * event manager
   * @type {EventManager}
   * @private
   */
  function Toolbar(eventManager, items) {
    var _this;

    if (items === void 0) {
      items = [];
    }

    _this = _UIController.call(this, {
      tagName: 'div',
      className: 'tui-editor-defaultUI-toolbar'
    }) || this;

    toolbar_defineProperty(toolbar_assertThisInitialized(_this), "_items", []);

    toolbar_defineProperty(toolbar_assertThisInitialized(_this), "_eventManager", void 0);

    _this._eventManager = eventManager;

    _this.setItems(items);

    _this._initEvent(eventManager);

    return _this;
  }
  /**
   * init event
   * @param  {EventManager} eventManager - event manager
   * @private
   * @override
   */


  var _proto = Toolbar.prototype;

  _proto._initEvent = function _initEvent(eventManager) {
    var _this2 = this;

    eventManager.listen('stateChange', function (ev) {
      _this2._items.forEach(function (item) {
        if (item._state) {
          dom["a" /* default */].toggleClass(item.el, 'active', !!ev[item._state]);
        }
      });
    });
    eventManager.listen('changePreviewTabPreview', function () {
      return _this2.disableAllButton();
    });
    eventManager.listen('changePreviewTabWrite', function () {
      return _this2.enableAllButton();
    });
    eventManager.listen('changeMode', function () {
      return _this2.enableAllButton();
    });
  }
  /**
   * disable all toolbar button
   */
  ;

  _proto.disableAllButton = function disableAllButton() {
    this._items.forEach(function (item) {
      if (item instanceof toolbarButton) {
        item.disable();
      }
    });
  }
  /**
   * enable all toolbar button
   */
  ;

  _proto.enableAllButton = function enableAllButton() {
    this._items.forEach(function (item) {
      if (item instanceof toolbarButton) {
        item.enable();
      }
    });
  }
  /**
   * get toolbar items
   * @returns {ToolbarItem[]} - toolbar items
   */
  ;

  _proto.getItems = function getItems() {
    return this._items.slice(0);
  }
  /**
   * get toolbar item at given index
   * @param  {number} index - item index
   * @returns {ToolbarItem} - toolbar item at the index
   */
  ;

  _proto.getItem = function getItem(index) {
    return this._items[index];
  }
  /**
   * set toolbar items
   * @param {ToolbarItem[]} items - toolbar items
   */
  ;

  _proto.setItems = function setItems(items) {
    this.removeAllItems();
    items.forEach(this.addItem.bind(this));
  }
  /**
   * add toolbar item
   * @param {ToolbarItem|string|object} item - toolbar item
   */
  ;

  _proto.addItem = function addItem(item) {
    this.insertItem(this._items.length, item);
  }
  /**
   * insert toolbar item
   * @param  {number} index - index at given item inserted
   * @param  {ToolbarItem|string|object} item - toolbar item
   */
  ;

  _proto.insertItem = function insertItem(index, item) {
    var _this3 = this;

    if (isString_default()(item)) {
      item = toolbarItemFactory.create(item);
    } else if (isString_default()(item.type)) {
      item = toolbarItemFactory.create(item.type, item.options);
    }

    var children = this.el.children;

    if (index >= 0 && index < children.length) {
      dom["a" /* default */].insertBefore(item.el, children[index]);

      this._items.splice(index, 0, item);
    } else {
      this.el.appendChild(item.el);

      this._items.push(item);
    }

    item.onCommandHandler = function (commandName) {
      return _this3._eventManager.emit('command', commandName);
    };

    item.onEventHandler = function (eventName) {
      return _this3._eventManager.emit(eventName);
    };

    item.on('command', item.onCommandHandler);
    item.on('event', item.onEventHandler);
  }
  /**
   * get index of given item
   * @param  {ToolbarItem} item - toolbar item
   * @returns {number} - index of given toolbar item
   */
  ;

  _proto.indexOfItem = function indexOfItem(item) {
    var index;

    if (item instanceof ui_toolbarItem) {
      index = this._items.indexOf(item);
    } else if (isString_default()(item)) {
      var itemName = item;
      index = this._items.map(function (itemToTest) {
        return itemToTest.getName();
      }).indexOf(itemName);
    }

    return index;
  }
  /**
   * remove an item
   * @param  {ToolbarItem|number} item - an toolbar item or index of the item to remove
   * @param  {boolean} destroy - destroy item or not
   * @returns {ToolbarItem|undefined} - removed item
   */
  ;

  _proto.removeItem = function removeItem(item, destroy) {
    if (destroy === void 0) {
      destroy = true;
    }

    var index;
    var removedItem;

    if (item instanceof ui_toolbarItem) {
      index = this.indexOfItem(item);
    } else {
      index = item;
    }

    if (index >= 0) {
      removedItem = this._items.splice(index, 1)[0];
    }

    if (removedItem) {
      if (destroy) {
        removedItem.destroy();
      } else {
        removedItem.off('command', removedItem.onCommandHandler);
        removedItem.off('event', removedItem.onEventHandler);
        dom["a" /* default */].remove(removedItem.el);
      }
    }

    return removedItem;
  }
  /**
   * remove all toolbar items
   */
  ;

  _proto.removeAllItems = function removeAllItems() {
    while (this._items && this._items.length > 0) {
      this.removeItem(0);
    }
  }
  /**
   * destroy instance
   * @override
   */
  ;

  _proto.destroy = function destroy() {
    this.removeAllItems();

    _UIController.prototype.destroy.call(this);
  };

  return Toolbar;
}(uicontroller);

/* harmony default export */ var ui_toolbar = (toolbar_Toolbar);
// CONCATENATED MODULE: ./src/js/ui/layerpopup.js
function layerpopup_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function layerpopup_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileoverview Implements LayerPopup
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */










var CLASS_PREFIX = 'tui-popup-';
var CLASS_FIT_WINDOW = 'fit-window';
var LAYOUT_TEMPLATE_MODELESS = "<div class=\"" + CLASS_PREFIX + "header\">\n        <span class=\"" + CLASS_PREFIX + "title\"></span>\n        <div class=\"" + CLASS_PREFIX + "header-buttons\">\n            <button type=\"button\" class=\"" + CLASS_PREFIX + "close-button\"></button>\n        </div>\n    </div>\n    <div class=\"" + CLASS_PREFIX + "body\"></div>";
var LAYOUT_TEMPLATE_MODAL = "<div class=\"" + CLASS_PREFIX + "wrapper\">\n        <div class=\"" + CLASS_PREFIX + "header\">\n            <span class=\"" + CLASS_PREFIX + "title\"></span>\n            <div class=\"" + CLASS_PREFIX + "header-buttons\">\n                <button type=\"button\" class=\"" + CLASS_PREFIX + "close-button\"></button>\n            </div>\n        </div>\n        <div class=\"" + CLASS_PREFIX + "body\"></div>\n    </div>";
/**
 * A number, or a string containing a number.
 * @typedef {object} LayerPopupOption
 * @property {string[]} [openerCssQuery] - Css Query list to bind clickevent that open popup
 * @property {string[]} [closerCssQuery] - Css Query list to bind clickevent that close popup
 * @property {HTMLElement} el - popup root element
 * @property {HTMLElement|string} [content] - popup content that html string or element
 * @property {string} [textContent] - popup text content
 * @property {string} title - popup title
 * @property {boolean} [header] - whether to draw header
 * @property {HTMLElement} [target] - element to append popup
 * @property {boolean} modal - true: modal, false: modeless
 * @property {string} [headerButtons] - replace header(close) button
 */

/**
 * Class LayerPopup
 * @param {LayerPopupOption} options - popup option
 */

var layerpopup_LayerPopup = /*#__PURE__*/function (_UIController) {
  layerpopup_inheritsLoose(LayerPopup, _UIController);

  function LayerPopup(options) {
    var _this;

    options = extend_default()({
      header: true,
      target: document.body,
      textContent: ''
    }, options);
    _this = _UIController.call(this, {
      tagName: 'div',
      className: options.modal ? CLASS_PREFIX + "modal-background" : CLASS_PREFIX + "wrapper",
      rootElement: options.el
    }) || this;
    _this._clickEventMap = {};
    _this._onClickCloseButton = _this.hide.bind(layerpopup_assertThisInitialized(_this));

    _this._initInstance(options);

    _this._initDOM(options);

    _this._initDOMEvent(options);

    _this._initEditorEvent(options);

    return _this;
  }
  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   */


  var _proto = LayerPopup.prototype;

  _proto._initInstance = function _initInstance(options) {
    this._target = options.target;

    if (options.el) {
      this.el = options.el;
      this._isExternalHtmlUse = true;
    }

    if (options.content) {
      this.content = options.content;
    } else {
      this.content = options.textContent;
    }

    this.options = options;
  }
  /**
   * initialize DOM, render popup
   * @private
   */
  ;

  _proto._initDOM = function _initDOM() {
    this._initLayout();

    if (!this._isExternalHtmlUse) {
      if (isExisty_default()(this.options.title)) {
        this.setTitle(this.options.title);
      }

      this.setContent(this.content);
    }

    var buttons = this.options.headerButtons;

    if (buttons) {
      var closeButtons = dom["a" /* default */].findAll(this.el, "." + CLASS_PREFIX + "close-button");
      closeButtons.forEach(function (button) {
        dom["a" /* default */].remove(button);
      });
      var buttonWrapper = this.el.querySelector("." + CLASS_PREFIX + "header-buttons");
      dom["a" /* default */].empty(buttonWrapper);
      buttonWrapper.innerHTML = buttons;
    }

    if (this.options.css) {
      css_default()(this.el, this.options.css);
    }
  }
  /**
   * bind DOM events
   * @private
   */
  ;

  _proto._initDOMEvent = function _initDOMEvent() {
    var _this2 = this;

    var _this$options = this.options,
        openerCssQuery = _this$options.openerCssQuery,
        closerCssQuery = _this$options.closerCssQuery;
    var _document = document,
        body = _document.body;

    if (openerCssQuery) {
      dom["a" /* default */].findAll(body, openerCssQuery).forEach(function (el) {
        var eventKey = "click." + _this2._id;
        _this2._clickEventMap[eventKey] = _this2.show.bind(_this2);
        on_default()(el, 'click', _this2._clickEventMap[eventKey]);
      });
    }

    if (closerCssQuery) {
      dom["a" /* default */].findAll(body, closerCssQuery).forEach(function (el) {
        var eventKey = "click." + _this2._id;
        _this2._clickEventMap[eventKey] = _this2.hide.bind(_this2);
        on_default()(el, 'click', _this2._clickEventMap[eventKey]);
      });
    }

    this.on("click ." + CLASS_PREFIX + "close-button", this._onClickCloseButton);
  }
  /**
   * bind editor events
   * @private
   * @abstract
   */
  ;

  _proto._initEditorEvent = function _initEditorEvent() {};

  _proto._initLayout = function _initLayout() {
    var options = this.options;

    if (!this._isExternalHtmlUse) {
      var layout = options.modal ? LAYOUT_TEMPLATE_MODAL : LAYOUT_TEMPLATE_MODELESS;
      this.el.innerHTML = layout;

      if (options.className) {
        addClass_default.a.apply(void 0, [this.el].concat(options.className.split(/\s+/g)));
      }

      this.hide();

      this._target.appendChild(this.el);

      this.body = this.el.querySelector("." + CLASS_PREFIX + "body");

      if (!options.header) {
        dom["a" /* default */].remove(this.el.querySelector("." + CLASS_PREFIX + "header"));
      }
    } else {
      this.hide();

      this._target.appendChild(this.el);
    }
  }
  /**
   * set popup content
   * @param {HTMLElement|string} content - content
   */
  ;

  _proto.setContent = function setContent(content) {
    dom["a" /* default */].empty(this.body);

    if (isString_default()(content)) {
      this.body.innerHTML = content;
    } else {
      this.body.appendChild(content);
    }
  }
  /**
   * set title
   * @param {string} title - title text
   */
  ;

  _proto.setTitle = function setTitle(title) {
    var titleWrapper = this.el.querySelector("." + CLASS_PREFIX + "title");
    dom["a" /* default */].empty(titleWrapper);
    titleWrapper.innerHTML = title;
  }
  /**
   * get title element
   * @returns {HTMLElement} - title html element
   */
  ;

  _proto.getTitleElement = function getTitleElement() {
    return this.el.querySelector("." + CLASS_PREFIX + "title");
  }
  /**
   * hide popup
   */
  ;

  _proto.hide = function hide() {
    css_default()(this.el, {
      display: 'none'
    });
    this._isShow = false;
    this.trigger('hidden', this);
  }
  /**
   * show popup
   */
  ;

  _proto.show = function show() {
    css_default()(this.el, {
      display: 'block'
    });
    this._isShow = true;
    this.trigger('shown', this);
  }
  /**
   * whether this popup is visible
   * @returns {boolean} - true: shown, false: hidden
   */
  ;

  _proto.isShow = function isShow() {
    return this._isShow;
  }
  /**
   * remove popup content
   */
  ;

  _proto.remove = function remove() {
    var _this3 = this;

    var _this$options2 = this.options,
        openerCssQuery = _this$options2.openerCssQuery,
        closerCssQuery = _this$options2.closerCssQuery;
    var _document2 = document,
        body = _document2.body;
    this.trigger('remove', this);
    this.off("click ." + CLASS_PREFIX + "close-button", this._onClickCloseButton);

    if (openerCssQuery) {
      dom["a" /* default */].findAll(body, openerCssQuery).forEach(function (opener) {
        off_default()(opener, 'click', _this3._clickEventMap["click." + _this3._id]);
        delete _this3._clickEventMap["click." + _this3._id];
      });
    }

    if (closerCssQuery) {
      dom["a" /* default */].findAll(body, closerCssQuery).forEach(function (closer) {
        off_default()(closer, 'click', _this3._clickEventMap["click." + _this3._id]);
        delete _this3._clickEventMap["click." + _this3._id];
      });
    }

    dom["a" /* default */].remove(this.el);
    this.el = null;
  }
  /**
   * make popup size fit to window
   * @param {boolean} fit - true to make popup fit to window
   * @protected
   * @ignore
   */
  ;

  _proto.setFitToWindow = function setFitToWindow(fit) {
    dom["a" /* default */].toggleClass(this.el, CLASS_FIT_WINDOW, fit);
  }
  /**
   * make popup size fit to window
   * @returns {boolean} - true for fit to window
   * @protected
   * @ignore
   */
  ;

  _proto.isFitToWindow = function isFitToWindow() {
    return hasClass_default()(this.el, CLASS_FIT_WINDOW);
  }
  /**
   * toggle size fit to window
   * @returns {boolean} - true for fit to window
   * @protected
   * @ignore
   */
  ;

  _proto.toggleFitToWindow = function toggleFitToWindow() {
    var fitToWindow = !this.isFitToWindow();
    this.setFitToWindow(fitToWindow);
    return fitToWindow;
  };

  return LayerPopup;
}(uicontroller);

/* harmony default export */ var layerpopup = (layerpopup_LayerPopup);
// CONCATENATED MODULE: ./src/js/ui/popupDropdownToolbar.js
function popupDropdownToolbar_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function popupDropdownToolbar_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @fileoverview implements DefaultToolbar
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */





/**
 * Class PopupDropdownToolbar
 * @param {LayerPopupOption} options - layer popup option
 * @ignore
 */

var popupDropdownToolbar_PopupDropdownToolbar = /*#__PURE__*/function (_LayerPopup) {
  popupDropdownToolbar_inheritsLoose(PopupDropdownToolbar, _LayerPopup);

  /**
   * open event string
   * @type {string}
   */
  function PopupDropdownToolbar(options) {
    options = extend_default()({
      header: false,
      className: 'te-dropdown-toolbar'
    }, options);
    return _LayerPopup.call(this, options) || this;
  }
  /**
   * get toolbar instance it contains
   * @returns {Toolbar} - toolbar instance
   */


  var _proto = PopupDropdownToolbar.prototype;

  _proto.getToolbar = function getToolbar() {
    return this._toolbar;
  }
  /**
   * get toolbar items
   * @returns {ToolbarItem[]} - toolbar items
   */
  ;

  _proto.getItems = function getItems() {
    return this.getToolbar().getItems();
  }
  /**
   * get toolbar item at given index
   * @param  {number} index - item index
   * @returns {ToolbarItem} - toolbar item at the index
   */
  ;

  _proto.getItem = function getItem(index) {
    return this.getToolbar().getItem(index);
  }
  /**
   * set toolbar items
   * @param {ToolbarItem[]} items - toolbar items
   */
  ;

  _proto.setItems = function setItems(items) {
    this.getToolbar().setItems(items);
  }
  /**
   * add toolbar item
   * @param {ToolbarItem|string|object} item - toolbar item
   */
  ;

  _proto.addItem = function addItem(item) {
    this.getToolbar().addItem(item);
  }
  /**
   * insert toolbar item
   * @param  {number} index - index at given item inserted
   * @param  {ToolbarItem|string|object} item - toolbar item
   */
  ;

  _proto.insertItem = function insertItem(index, item) {
    this.getToolbar().insertItem(index, item);
  }
  /**
   * get index of given item
   * @param  {ToolbarItem} item - toolbar item
   * @returns {number} - index of given toolbar item
   */
  ;

  _proto.indexOfItem = function indexOfItem(item) {
    return this.getToolbar().indexOfItem(item);
  }
  /**
   * remove an item
   * @param  {number} index - item index to remove
   * @param  {boolean} destroy - destroy item or not
   * @returns {ToolbarItem} - removed item
   */
  ;

  _proto.removeItem = function removeItem(index, destroy) {
    return this.getToolbar().removeItem(index, destroy);
  }
  /**
   * remove all toolbar items
   */
  ;

  _proto.removeAllItems = function removeAllItems() {
    this.getToolbar().removeAllItems();
  }
  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   * @override
   */
  ;

  _proto._initInstance = function _initInstance(options) {
    _LayerPopup.prototype._initInstance.call(this, options);

    var button = options.button,
        eventManager = options.eventManager;
    this._button = button;
    this._eventManager = eventManager;
    this._toolbar = new ui_toolbar(eventManager);
  }
  /**
   * initialize DOM, render popup
   * @private
   * @override
   */
  ;

  _proto._initDOM = function _initDOM() {
    _LayerPopup.prototype._initDOM.call(this);

    this.setContent(this._toolbar.el);
  }
  /**
   * bind editor events
   * @private
   * @override
   */
  ;

  _proto._initEditorEvent = function _initEditorEvent() {
    var _this = this;

    _LayerPopup.prototype._initEditorEvent.call(this);

    this._eventManager.listen('focus', function () {
      return _this.hide();
    });

    this._eventManager.listen('closeAllPopup', function () {
      return _this.hide();
    });

    this._eventManager.listen(PopupDropdownToolbar.OPEN_EVENT, function () {
      var isShown = _this.isShow();

      _this._eventManager.emit('closeAllPopup');

      if (!isShown) {
        _this.show();
      } // to give toolbar element enough width before the calculation


      css_default()(_this.el, {
        left: '-1000px'
      });
      var button = _this._button;
      var buttonOuterHeightWithMargin = dom["a" /* default */].getOuterHeight(button, true);
      var buttonMarginBottom = (buttonOuterHeightWithMargin - dom["a" /* default */].getOuterHeight(button)) / 2;
      var top = button.offsetTop + buttonOuterHeightWithMargin - buttonMarginBottom;
      var left = button.offsetLeft + dom["a" /* default */].getOuterWidth(button, true) - dom["a" /* default */].getOuterWidth(_this.el, true);
      css_default()(_this.el, {
        top: top + "px",
        left: left + "px"
      });
    });
  };

  return PopupDropdownToolbar;
}(layerpopup);

popupDropdownToolbar_defineProperty(popupDropdownToolbar_PopupDropdownToolbar, "OPEN_EVENT", 'openDropdownToolbar');

/* harmony default export */ var popupDropdownToolbar = (popupDropdownToolbar_PopupDropdownToolbar);
// CONCATENATED MODULE: ./src/js/ui/defaultToolbar.js
function defaultToolbar_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function defaultToolbar_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function defaultToolbar_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @fileoverview implements DefaultToolbar
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */





var MORE_BUTTON_NAME = 'more';
/**
 * Class DefaultToolbar
 */

var defaultToolbar_DefaultToolbar = /*#__PURE__*/function (_Toolbar) {
  defaultToolbar_inheritsLoose(DefaultToolbar, _Toolbar);

  /**
   * more button
   * @type {ToolbarButton}
   * @private
   */

  /**
   * popup dropdown toolbar
   * @type {PopupDropdownToolbar}
   * @private
   */

  /**
   * resize observer
   * @type {ResizeObserver}
   * @private
   */
  function DefaultToolbar(eventManager, options) {
    var _this;

    _this = _Toolbar.call(this, eventManager, options) || this;

    defaultToolbar_defineProperty(defaultToolbar_assertThisInitialized(_this), "_moreButton", void 0);

    defaultToolbar_defineProperty(defaultToolbar_assertThisInitialized(_this), "_popupDropdownToolbar", void 0);

    defaultToolbar_defineProperty(defaultToolbar_assertThisInitialized(_this), "_observer", void 0);

    _this._init(eventManager);

    _this._bindWidthChangedEvent();

    return _this;
  }
  /**
   * insert toolbar item
   * @param  {number} index - index at given item inserted
   * @param  {ToolbarItem|string|object} item - toolbar item
   * @override
   */


  var _proto = DefaultToolbar.prototype;

  _proto.insertItem = function insertItem(index, item) {
    _Toolbar.prototype.insertItem.call(this, index, item);

    this._arrangeMoreButton();
  };

  _proto._init = function _init(eventManager) {
    var moreButton = toolbarItemFactory.create('button', {
      name: MORE_BUTTON_NAME,
      className: 'tui-more',
      tooltip: i18n.get('More'),
      event: popupDropdownToolbar.OPEN_EVENT
    });
    this._moreButton = moreButton;
    this._popupDropdownToolbar = new popupDropdownToolbar({
      eventManager: eventManager,
      target: this.el,
      button: moreButton.el
    });
    this.addItem(moreButton);
  };

  _proto._bindWidthChangedEvent = function _bindWidthChangedEvent() {
    var _this2 = this;

    this._observer = new ResizeObserver_es["a" /* default */](function () {
      _this2._popupDropdownToolbar.hide();

      _this2._balanceButtons();
    });

    this._observer.observe(this.el);
  };

  _proto._balanceButtons = function _balanceButtons() {
    var _this3 = this;

    var dropDownToolbarItems = this._popupDropdownToolbar.getItems();

    dropDownToolbarItems.forEach(function (item) {
      _this3._popupDropdownToolbar.removeItem(item, false);

      var itemLength = _this3.getItems().length;

      _Toolbar.prototype.insertItem.call(_this3, itemLength, item);
    });
    this.removeItem(this._moreButton, false);

    _Toolbar.prototype.insertItem.call(this, 0, this._moreButton);

    var defaultToolbarItems = this.getItems();
    var overflowItems = defaultToolbarItems.filter(function (item) {
      return item.el.offsetTop > _this3.el.clientHeight;
    });
    overflowItems.forEach(function (item) {
      _this3.removeItem(item, false);

      _this3._popupDropdownToolbar.addItem(item);
    });

    this._arrangeMoreButton();
  };

  _proto._arrangeMoreButton = function _arrangeMoreButton() {
    if (!this._popupDropdownToolbar) {
      return;
    }

    this.removeItem(this._moreButton, false);
    var hasOverflow = this._popupDropdownToolbar.getItems().length > 0;
    var itemLength = this.getItems().length;

    if (hasOverflow) {
      _Toolbar.prototype.insertItem.call(this, itemLength, this._moreButton);
    }
  }
  /**
   * destroy
   * @override
   */
  ;

  _proto.destroy = function destroy() {
    if (this._observer) {
      this._observer.disconnect();

      this._observer = null;
    }
  };

  return DefaultToolbar;
}(ui_toolbar);

/* harmony default export */ var defaultToolbar = (defaultToolbar_DefaultToolbar);
// CONCATENATED MODULE: ./src/js/ui/tab.js
function tab_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileoverview Implements tab button ui
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */




var CLASS_TAB_ACTIVE = 'te-tab-active';
/**
 * Class Tab
 * @param {object} options - options
 *     @param {string} [options.initName] - name of the default activated button
 *     @param {string[]} options.items - button names to be created
 *     @param {DOMElement[]} options.sections - dom elements for tab
 *     @param {function} [options.onItemClick] - when button is clicked pass button name to function
 * @ignore
 */

var tab_Tab = /*#__PURE__*/function (_UIController) {
  tab_inheritsLoose(Tab, _UIController);

  function Tab(options) {
    var _this;

    if (options === void 0) {
      options = {};
    }

    _this = _UIController.call(this, {
      tagName: 'div',
      className: 'te-tab'
    }) || this;
    _this.sections = options.sections;
    _this._activeButton = null;

    _this._render(options);

    _this._initEvent(options);

    return _this;
  }

  var _proto = Tab.prototype;

  _proto._initEvent = function _initEvent(options) {
    var onItemClick = options.onItemClick;

    if (onItemClick) {
      this.on('itemClick', onItemClick);
    }

    this.on('click button', this._onTabButton.bind(this));
  };

  _proto._render = function _render(options) {
    var items = options.items,
        initName = options.initName;
    var tabButtons = [];

    for (var i = 0, len = items.length; i < len; i += 1) {
      tabButtons.push("<button type=\"button\" data-index=\"" + i + "\">" + items[i] + "</button>");
    }

    this.el.innerHTML = tabButtons.join('');
    this.activate(initName);
  };

  _proto._findButtonContained = function _findButtonContained(element, selector, text) {
    return dom["a" /* default */].findAll(element, selector).filter(function (node) {
      return new RegExp(text).test(node.textContent);
    });
  }
  /**
   * Activate section & button
   * @param {string} name button name to activate
   */
  ;

  _proto.activate = function activate(name) {
    var _this$_findButtonCont = this._findButtonContained(this.el, 'button', name),
        button = _this$_findButtonCont[0];

    this._activateTabByButton(button);
  };

  _proto._onTabButton = function _onTabButton(ev) {
    var button = ev.target;

    this._activateTabByButton(button);

    this.trigger('itemClick', button.textContent);
  };

  _proto._activateTabByButton = function _activateTabByButton(button) {
    if (this._isActivatedButton(button)) {
      return;
    }

    this._updateClassByButton(button);
  };

  _proto._updateClassByButton = function _updateClassByButton(activeButton) {
    // deactivate previously activated button
    if (this._activeButton) {
      var sectionIndex = this._activeButton.getAttribute('data-index');

      removeClass_default()(this._activeButton, CLASS_TAB_ACTIVE);

      if (this.sections) {
        removeClass_default()(this.sections[sectionIndex], CLASS_TAB_ACTIVE);
      }
    } // activate new button


    addClass_default()(activeButton, CLASS_TAB_ACTIVE);
    this._activeButton = activeButton;
    var index = activeButton.getAttribute('data-index');

    if (this.sections) {
      addClass_default()(this.sections[index], CLASS_TAB_ACTIVE);
    }
  };

  _proto._isActivatedButton = function _isActivatedButton(button) {
    return this._activeButton && this._activeButton.textContent === button.textContent;
  };

  return Tab;
}(uicontroller);

/* harmony default export */ var tab = (tab_Tab);
// CONCATENATED MODULE: ./src/js/ui/modeSwitch.js
function modeSwitch_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function modeSwitch_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function modeSwitch_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @fileoverview Implements ui mode switch
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */







var MARKDOWN = 'markdown';
var WYSIWYG = 'wysiwyg';
/**
 * Class ModeSwitch
 * UI Control for switch between Markdown and WYSIWYG
 * @param {HTMLElement} rootElement - root element
 * @param {string} initialType - initial type of editor
 */

var modeSwitch_ModeSwitch = /*#__PURE__*/function (_UIController) {
  modeSwitch_inheritsLoose(ModeSwitch, _UIController);

  /**
   * mode switch type
   * @property {string} MARKDOWN - Markdown
   * @property {string} WYSIWYG - WYSIWYG
   * @static
   * @ignore
   */

  /**
   * mode switch buttons
   * @type {Object}
   * @private
   */

  /**
   * current mode
   * @type {String}
   * @private
   */

  /**
   * root element
   * @type {HTMLElement}
   * @private
   */
  function ModeSwitch(rootElement, initialType, eventManager) {
    var _this;

    _this = _UIController.call(this, {
      tagName: 'div',
      className: 'te-mode-switch'
    }) || this;

    modeSwitch_defineProperty(modeSwitch_assertThisInitialized(_this), "_buttons", {});

    modeSwitch_defineProperty(modeSwitch_assertThisInitialized(_this), "_type", void 0);

    modeSwitch_defineProperty(modeSwitch_assertThisInitialized(_this), "_rootElement", void 0);

    _this._eventManager = eventManager;

    _this._render(rootElement);

    _this._switchType(isExisty_default()(initialType) ? initialType : MARKDOWN);

    _this._initEvent();

    return _this;
  }
  /**
   * is the switch tab bar shown
   * @returns {Boolean} - showing status
   */


  var _proto = ModeSwitch.prototype;

  _proto.isShown = function isShown() {
    return this._rootElement.style.display === 'block';
  }
  /**
   * show switch tab bar
   */
  ;

  _proto.show = function show() {
    css_default()(this._rootElement, {
      display: 'block'
    });
  }
  /**
   * hide switch tab bar
   */
  ;

  _proto.hide = function hide() {
    css_default()(this._rootElement, {
      display: 'none'
    });
  };

  _proto._render = function _render(rootElement) {
    this._buttons.markdown = dom["a" /* default */].createElementWith("<button class=\"te-switch-button markdown\" type=\"button\">" + i18n.get('Markdown') + "</button>");
    this._buttons.wysiwyg = dom["a" /* default */].createElementWith("<button class=\"te-switch-button wysiwyg\" type=\"button\">" + i18n.get('WYSIWYG') + "</button>");
    this.el.appendChild(this._buttons.markdown);
    this.el.appendChild(this._buttons.wysiwyg);

    if (rootElement) {
      rootElement.appendChild(this.el);
      this._rootElement = rootElement;
    }

    this.on('click .markdown', this._changeMarkdown.bind(this));
    this.on('click .wysiwyg', this._changeWysiwyg.bind(this));
    this.show();
  };

  _proto._changeMarkdown = function _changeMarkdown() {
    this._switchType(MARKDOWN);
  };

  _proto._changeWysiwyg = function _changeWysiwyg() {
    this._switchType(WYSIWYG);
  };

  _proto._setActiveButton = function _setActiveButton(type) {
    removeClass_default()(this._buttons.markdown, 'active');
    removeClass_default()(this._buttons.wysiwyg, 'active');
    addClass_default()(this._buttons["" + type], 'active');
  };

  _proto._switchType = function _switchType(type) {
    if (this._type === type) {
      return;
    }

    this._type = type;

    this._setActiveButton(type);

    this.trigger('modeSwitched', this._type);
  };

  _proto._initEvent = function _initEvent() {
    var _this2 = this;

    this._eventManager.listen('changeMode', function (type) {
      if (_this2._type !== type) {
        _this2._type = type;

        _this2._setActiveButton(type);
      }
    });
  };

  return ModeSwitch;
}(uicontroller);

modeSwitch_defineProperty(modeSwitch_ModeSwitch, "TYPE", {
  MARKDOWN: MARKDOWN,
  WYSIWYG: WYSIWYG
});

/* harmony default export */ var ui_modeSwitch = (modeSwitch_ModeSwitch);
// CONCATENATED MODULE: ./src/js/ui/popupAddLink.js
function popupAddLink_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileoverview Implements PopupAddLink
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */





var URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/([^\s]*))?$/;
/**
 * Class PopupAddLink
 * It implements a link Add Popup
 * @param {LayerPopupOption} options - layer popup options
 * @ignore
 */

var popupAddLink_PopupAddLink = /*#__PURE__*/function (_LayerPopup) {
  popupAddLink_inheritsLoose(PopupAddLink, _LayerPopup);

  function PopupAddLink(options) {
    var _this;

    var POPUP_CONTENT = "\n            <label for=\"url\">" + i18n.get('URL') + "</label>\n            <input type=\"text\" class=\"te-url-input\" />\n            <label for=\"linkText\">" + i18n.get('Link text') + "</label>\n            <input type=\"text\" class=\"te-link-text-input\" />\n            <div class=\"te-button-section\">\n                <button type=\"button\" class=\"te-ok-button\">" + i18n.get('OK') + "</button>\n                <button type=\"button\" class=\"te-close-button\">" + i18n.get('Cancel') + "</button>\n            </div>\n        ";
    options = extend_default()({
      header: true,
      title: i18n.get('Insert link'),
      className: 'te-popup-add-link tui-editor-popup',
      content: POPUP_CONTENT
    }, options);
    _this = _LayerPopup.call(this, options) || this;
    _this._disabledLinkText = false;
    return _this;
  }
  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   * @override
   */


  var _proto = PopupAddLink.prototype;

  _proto._initInstance = function _initInstance(options) {
    _LayerPopup.prototype._initInstance.call(this, options);

    this._editor = options.editor;
    this._eventManager = options.editor.eventManager;
  }
  /**
   * initialize DOM, render popup
   * @private
   * @override
   */
  ;

  _proto._initDOM = function _initDOM() {
    _LayerPopup.prototype._initDOM.call(this);

    var el = this.el;
    this._inputText = el.querySelector('.te-link-text-input');
    this._inputURL = el.querySelector('.te-url-input');
  }
  /**
   * bind DOM events
   * @private
   * @override
   */
  ;

  _proto._initDOMEvent = function _initDOMEvent() {
    var _this2 = this;

    _LayerPopup.prototype._initDOMEvent.call(this);

    this.on('click .te-close-button', function () {
      return _this2.hide();
    });
    this.on('click .te-ok-button', function () {
      return _this2._addLink();
    });
    this.on('shown', function () {
      _this2._disabledLinkText = _this2._editor.isWysiwygMode() && !_this2._editor.getRange().collapsed;

      _this2._disableLinkTextInput();

      var inputText = _this2._inputText;
      var inputURL = _this2._inputURL;

      var selectedText = _this2._editor.getSelectedText().trim();

      inputText.value = selectedText;

      if (URL_REGEX.exec(selectedText)) {
        inputURL.value = selectedText;
      }

      inputURL.focus();
    });
    this.on('hidden', function () {
      _this2._resetInputs();
    });
  }
  /**
   * bind editor events
   * @private
   * @override
   */
  ;

  _proto._initEditorEvent = function _initEditorEvent() {
    var _this3 = this;

    _LayerPopup.prototype._initEditorEvent.call(this);

    var eventManager = this._eventManager;
    eventManager.listen('focus', function () {
      return _this3.hide();
    });
    eventManager.listen('closeAllPopup', function () {
      return _this3.hide();
    });
    eventManager.listen('openPopupAddLink', function (linkData) {
      eventManager.emit('closeAllPopup');

      if (linkData) {
        _this3._inputURL.value = linkData.url;
      }

      _this3.show();
    });
  };

  _proto._disableLinkTextInput = function _disableLinkTextInput() {
    var input = this._inputText;

    if (this._disabledLinkText) {
      input.setAttribute('disabled', 'disabled');
      addClass_default()(input, 'disabled');
    } else {
      input.removeAttribute('disabled');
      removeClass_default()(input, 'disabled');
    }
  };

  _proto._addLink = function _addLink() {
    var _this$_getValue = this._getValue(),
        url = _this$_getValue.url,
        linkText = _this$_getValue.linkText;

    this._clearValidationStyle();

    if (!this._disabledLinkText && linkText.length < 1) {
      addClass_default()(this._inputText, 'wrong');
      return;
    }

    if (url.length < 1) {
      addClass_default()(this._inputURL, 'wrong');
      return;
    }

    this._eventManager.emit('command', 'AddLink', {
      linkText: linkText,
      url: url
    });

    this.hide();
  };

  _proto._getValue = function _getValue() {
    var url = this._inputURL.value;
    var linkText = this._inputText.value;
    return {
      url: url,
      linkText: linkText
    };
  };

  _proto._clearValidationStyle = function _clearValidationStyle() {
    removeClass_default()(this._inputURL, 'wrong', 'disabled');
    removeClass_default()(this._inputText, 'wrong');
  };

  _proto._resetInputs = function _resetInputs() {
    this._inputText.removeAttribute('disabled');

    this._inputText.value = '';
    this._inputURL.value = '';

    this._clearValidationStyle();
  };

  return PopupAddLink;
}(layerpopup);

/* harmony default export */ var popupAddLink = (popupAddLink_PopupAddLink);
// CONCATENATED MODULE: ./src/js/ui/popupAddImage.js
function popupAddImage_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileoverview Implements PopupAddImage
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */





var CLASS_IMAGE_URL_INPUT = 'te-image-url-input';
var CLASS_IMAGE_FILE_INPUT = 'te-image-file-input';
var CLASS_ALT_TEXT_INPUT = 'te-alt-text-input';
var CLASS_OK_BUTTON = 'te-ok-button';
var CLASS_CLOSE_BUTTON = 'te-close-button';
var CLASS_FILE_TYPE = 'te-file-type';
var CLASS_URL_TYPE = 'te-url-type';
var CLASS_TAB_SECTION = 'te-tab-section';
var TYPE_UI = 'ui';
/**
 * Class PopupAddImage
 * It implements a Image Add Popup
 * @param {LayerPopupOption} options - layer popup option
 * @ignore
 */

var popupAddImage_PopupAddImage = /*#__PURE__*/function (_LayerPopup) {
  popupAddImage_inheritsLoose(PopupAddImage, _LayerPopup);

  function PopupAddImage(options) {
    var POPUP_CONTENT = "\n            <div class=\"" + CLASS_TAB_SECTION + "\"></div>\n            <div class=\"" + CLASS_URL_TYPE + "\">\n                <label for=\"\">" + i18n.get('Image URL') + "</label>\n                <input type=\"text\" class=\"" + CLASS_IMAGE_URL_INPUT + "\" />\n            </div>\n            <div class=\"" + CLASS_FILE_TYPE + "\">\n                <label for=\"\">" + i18n.get('Select image file') + "</label>\n                <input type=\"file\" class=\"" + CLASS_IMAGE_FILE_INPUT + "\" accept=\"image/*\" />\n            </div>\n            <label for=\"url\">" + i18n.get('Description') + "</label>\n            <input type=\"text\" class=\"" + CLASS_ALT_TEXT_INPUT + "\" />\n            <div class=\"te-button-section\">\n                <button type=\"button\" class=\"" + CLASS_OK_BUTTON + "\">" + i18n.get('OK') + "</button>\n                <button type=\"button\" class=\"" + CLASS_CLOSE_BUTTON + "\">" + i18n.get('Cancel') + "</button>\n            </div>\n        ";
    options = extend_default()({
      header: true,
      title: i18n.get('Insert image'),
      className: 'te-popup-add-image tui-editor-popup',
      content: POPUP_CONTENT
    }, options);
    return _LayerPopup.call(this, options) || this;
  }
  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   * @override
   */


  var _proto = PopupAddImage.prototype;

  _proto._initInstance = function _initInstance(options) {
    _LayerPopup.prototype._initInstance.call(this, options);

    this.eventManager = options.eventManager;
  }
  /**
   * initialize DOM, render popup
   * @private
   * @override
   */
  ;

  _proto._initDOM = function _initDOM() {
    _LayerPopup.prototype._initDOM.call(this);

    var popup = this.el;
    this._imageUrlInput = popup.querySelector("." + CLASS_IMAGE_URL_INPUT);
    this._imageFileInput = popup.querySelector("." + CLASS_IMAGE_FILE_INPUT);
    this._altTextInput = popup.querySelector("." + CLASS_ALT_TEXT_INPUT);
    var fileTypeSection = popup.querySelector("." + CLASS_FILE_TYPE);
    var urlTypeSection = popup.querySelector("." + CLASS_URL_TYPE);
    var tabSection = this.body.querySelector("." + CLASS_TAB_SECTION);
    this.tab = new tab({
      initName: i18n.get('File'),
      items: [i18n.get('File'), i18n.get('URL')],
      sections: [fileTypeSection, urlTypeSection]
    });
    tabSection.appendChild(this.tab.el);
  }
  /**
   * bind DOM events
   * @private
   * @override
   */
  ;

  _proto._initDOMEvent = function _initDOMEvent() {
    var _this = this;

    _LayerPopup.prototype._initDOMEvent.call(this);

    this.on('shown', function () {
      return _this._imageUrlInput.focus();
    });
    this.on('hidden', function () {
      return _this._resetInputs();
    });
    this.on("change ." + CLASS_IMAGE_FILE_INPUT, function () {
      var filename = _this._imageFileInput.value.split('\\').pop();

      _this._altTextInput.value = filename;
    });
    this.on("click ." + CLASS_CLOSE_BUTTON, function () {
      return _this.hide();
    });
    this.on("click ." + CLASS_OK_BUTTON, function () {
      var imageUrl = _this._imageUrlInput.value;
      var altText = _this._altTextInput.value;

      if (imageUrl) {
        _this._applyImage(imageUrl, altText);
      } else {
        var files = _this._imageFileInput.files;

        if (files.length) {
          var imageFile = files.item(0);

          var hookCallback = function hookCallback(url, text) {
            return _this._applyImage(url, text || altText);
          };

          _this.eventManager.emit('addImageBlobHook', imageFile, hookCallback, TYPE_UI);
        }
      }

      _this.hide();
    });
    this.tab.on('itemClick', function () {
      return _this._resetInputs();
    });
  }
  /**
   * bind editor events
   * @private
   * @override
   */
  ;

  _proto._initEditorEvent = function _initEditorEvent() {
    var _this2 = this;

    _LayerPopup.prototype._initEditorEvent.call(this);

    this.eventManager.listen('focus', function () {
      return _this2.hide();
    });
    this.eventManager.listen('closeAllPopup', function () {
      return _this2.hide();
    });
    this.eventManager.listen('openPopupAddImage', function () {
      _this2.eventManager.emit('closeAllPopup');

      _this2.show();
    });
  };

  _proto._applyImage = function _applyImage(imageUrl, altText) {
    this.eventManager.emit('command', 'AddImage', {
      imageUrl: imageUrl,
      altText: altText || 'image'
    });
    this.hide();
  };

  _proto._resetInputs = function _resetInputs() {
    dom["a" /* default */].findAll(this.el, 'input').forEach(function (input) {
      input.value = '';
    });
  }
  /**
   * Remove popup
   * @override
   */
  ;

  _proto.remove = function remove() {
    this.tab.remove();

    _LayerPopup.prototype.remove.call(this);
  };

  return PopupAddImage;
}(layerpopup);

/* harmony default export */ var popupAddImage = (popupAddImage_PopupAddImage);
// CONCATENATED MODULE: ./src/js/ui/popupTableUtils.js
function popupTableUtils_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileoverview Implements PopupTableUtils
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */






var REMOVE_ROW_MENU_CLASS_NAME = 'te-table-remove-row';
var DISABLED_MENU_CLASS_NAME = 'te-context-menu-disabled';
/**
 * PopupTableUtils
 * It implements table utils popup
 * @param {LayerPopupOption} options - layer popup options
 */

var popupTableUtils_PopupTableUtils = /*#__PURE__*/function (_LayerPopup) {
  popupTableUtils_inheritsLoose(PopupTableUtils, _LayerPopup);

  function PopupTableUtils(options) {
    var POPUP_CONTENT = "\n      <button type=\"button\" class=\"te-table-add-row\">" + i18n.get('Add row') + "</button>\n      <button type=\"button\" class=\"te-table-add-col\">" + i18n.get('Add col') + "</button>\n      <button type=\"button\" class=\"te-table-remove-row\">" + i18n.get('Remove row') + "</button>\n      <button type=\"button\" class=\"te-table-remove-col\">" + i18n.get('Remove col') + "</button>\n      <hr/>\n      <button type=\"button\" class=\"te-table-col-align-left\">" + i18n.get('Align left') + "</button>\n      <button type=\"button\" class=\"te-table-col-align-center\">" + i18n.get('Align center') + "</button>\n      <button type=\"button\" class=\"te-table-col-align-right\">" + i18n.get('Align right') + "</button>\n      <hr/>\n      <button type=\"button\" class=\"te-table-remove\">" + i18n.get('Remove table') + "</button>\n    ";
    options = extend_default()({
      header: false,
      className: 'te-popup-table-utils',
      content: POPUP_CONTENT
    }, options);
    return _LayerPopup.call(this, options) || this;
  }
  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   * @override
   */


  var _proto = PopupTableUtils.prototype;

  _proto._initInstance = function _initInstance(options) {
    _LayerPopup.prototype._initInstance.call(this, options);

    this.eventManager = options.eventManager;
  }
  /**
   * bind DOM events
   * @private
   * @override
   */
  ;

  _proto._initDOMEvent = function _initDOMEvent() {
    var _this = this;

    _LayerPopup.prototype._initDOMEvent.call(this);

    this.on('click .te-table-add-row', function () {
      return _this.eventManager.emit('command', 'AddRow');
    });
    this.on('click .te-table-add-col', function () {
      return _this.eventManager.emit('command', 'AddCol');
    });
    this.on('click .te-table-col-align-left', function () {
      return _this.eventManager.emit('command', 'AlignCol', 'left');
    });
    this.on('click .te-table-col-align-center', function () {
      return _this.eventManager.emit('command', 'AlignCol', 'center');
    });
    this.on('click .te-table-col-align-right', function () {
      return _this.eventManager.emit('command', 'AlignCol', 'right');
    });
    this.on('click .te-table-remove-col', function () {
      return _this.eventManager.emit('command', 'RemoveCol');
    });
    this.on('click .te-table-remove', function () {
      return _this.eventManager.emit('command', 'RemoveTable');
    });

    this._bindClickEventOnRemoveRowMenu();
  }
  /**
   * bind editor events
   * @private
   * @override
   */
  ;

  _proto._initEditorEvent = function _initEditorEvent() {
    var _this2 = this;

    _LayerPopup.prototype._initEditorEvent.call(this);

    this.eventManager.listen('focus', function () {
      return _this2.hide();
    });
    this.eventManager.listen('mousedown', function () {
      return _this2.hide();
    });
    this.eventManager.listen('closeAllPopup', function () {
      return _this2.hide();
    });
    this.eventManager.listen('openPopupTableUtils', function (ev) {
      var _this2$el$parentNode$ = _this2.el.parentNode.getBoundingClientRect(),
          left = _this2$el$parentNode$.left,
          top = _this2$el$parentNode$.top;

      _this2._disableRemoveRowMenu(ev.target);

      css_default()(_this2.el, {
        position: 'absolute',
        top: ev.clientY - top + 5 + "px",
        // beside mouse pointer
        left: ev.clientX - left + 10 + "px"
      });

      _this2.eventManager.emit('closeAllPopup');

      _this2.show();
    });
  };

  _proto._bindClickEventOnRemoveRowMenu = function _bindClickEventOnRemoveRowMenu() {
    var _this3 = this;

    this.on("click ." + REMOVE_ROW_MENU_CLASS_NAME, function (ev) {
      var target = ev.target;

      if (hasClass_default()(target, DISABLED_MENU_CLASS_NAME)) {
        ev.preventDefault();
      } else {
        _this3.eventManager.emit('command', 'RemoveRow');
      }
    });
  };

  _proto._disableRemoveRowMenu = function _disableRemoveRowMenu(target) {
    var menu = this.el.querySelector("." + REMOVE_ROW_MENU_CLASS_NAME);
    dom["a" /* default */].toggleClass(menu, DISABLED_MENU_CLASS_NAME, target.nodeName === 'TH');
  };

  return PopupTableUtils;
}(layerpopup);

/* harmony default export */ var popupTableUtils = (popupTableUtils_PopupTableUtils);
// CONCATENATED MODULE: ./src/js/ui/popupAddTable.js
function popupAddTable_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileoverview Implements PopupAddTable
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */




var CLASS_TABLE_SELECTION = 'te-table-selection';
var CLASS_TABLE_HEADER = 'te-table-header';
var CLASS_TABLE_BODY = 'te-table-body';
var CLASS_SELECTION_AREA = 'te-selection-area';
var CLASS_DESCRIPTION = 'te-description';
var popupAddTable_POPUP_CONTENT = "\n    <div class=\"" + CLASS_TABLE_SELECTION + "\">\n        <div class=\"" + CLASS_TABLE_HEADER + "\"></div>\n        <div class=\"" + CLASS_TABLE_BODY + "\"></div>\n        <div class=\"" + CLASS_SELECTION_AREA + "\"></div>\n    </div>\n    <p class=\"" + CLASS_DESCRIPTION + "\"></p>\n";
var CELL_WIDTH = 25;
var CELL_HEIGHT = 17;
var MIN_ROW_INDEX = 7;
var MAX_ROW_INDEX = 14;
var MIN_COL_INDEX = 5;
var MAX_COL_INDEX = 9;
var MIN_ROW_SELECTION_INDEX = 1;
var MIN_COL_SELECTION_INDEX = 1;
var HEADER_ROW_COUNT = 1;
var LAST_BORDER = 1;
/**
 * Class PopupAddTable
 * It implements Popup to add a table
 * @param {LayerPopupOption} options - layer popup option
 * @ignore
 */

var popupAddTable_PopupAddTable = /*#__PURE__*/function (_LayerPopup) {
  popupAddTable_inheritsLoose(PopupAddTable, _LayerPopup);

  function PopupAddTable(options) {
    options = extend_default()({
      header: false,
      className: 'te-popup-add-table',
      content: popupAddTable_POPUP_CONTENT
    }, options);
    return _LayerPopup.call(this, options) || this;
  }
  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   * @override
   */


  var _proto = PopupAddTable.prototype;

  _proto._initInstance = function _initInstance(options) {
    _LayerPopup.prototype._initInstance.call(this, options);

    this._selectedBound = {};
    this._tableBound = {};
    this._eventManager = options.eventManager;
    this._button = options.button;
    this._eventHandlers = {
      onMousedown: this._selectTableRange.bind(this),
      onClick: this._fireCommandEvent.bind(this)
    };
  }
  /**
   * initialize DOM, render popup
   * @private
   * @override
   */
  ;

  _proto._initDOM = function _initDOM() {
    _LayerPopup.prototype._initDOM.call(this);

    this._cacheElements();

    this._setTableSizeByBound(MIN_COL_INDEX, MIN_ROW_INDEX);
  }
  /**
   * bind DOM events
   * @private
   * @override
   */
  ;

  _proto._initDOMEvent = function _initDOMEvent(options) {
    _LayerPopup.prototype._initDOMEvent.call(this, options);

    this.on("mousemove ." + CLASS_TABLE_SELECTION, this._eventHandlers.onMousedown);
    this.on("click ." + CLASS_TABLE_SELECTION, this._eventHandlers.onClick);
  };

  _proto._selectTableRange = function _selectTableRange(ev) {
    var x = ev.pageX - this._selectionOffset.left;
    var y = ev.pageY - this._selectionOffset.top;

    var bound = this._getSelectionBoundByOffset(x, y);

    this._resizeTableBySelectionIfNeed(bound.col, bound.row);

    this._setSelectionAreaByBound(bound.col, bound.row);

    this._setDisplayText(bound.col, bound.row);

    this._setSelectedBound(bound.col, bound.row);
  };

  _proto._fireCommandEvent = function _fireCommandEvent() {
    var tableSize = this._getSelectedTableSize();

    this._eventManager.emit('command', 'Table', tableSize.col, tableSize.row);
  }
  /**
   * bind editor events
   * @private
   * @override
   */
  ;

  _proto._initEditorEvent = function _initEditorEvent() {
    var _this = this;

    _LayerPopup.prototype._initEditorEvent.call(this);

    this._eventManager.listen('focus', function () {
      return _this.hide();
    });

    this._eventManager.listen('closeAllPopup', function () {
      return _this.hide();
    });

    this._eventManager.listen('openPopupAddTable', function () {
      var button = _this._button;
      var offsetTop = button.offsetTop,
          offsetLeft = button.offsetLeft;
      css_default()(_this.el, {
        top: offsetTop + dom["a" /* default */].getOuterHeight(button) + "px",
        left: offsetLeft + "px"
      });

      _this._eventManager.emit('closeAllPopup');

      _this.show();

      var _this$el$querySelecto = _this.el.querySelector("." + CLASS_TABLE_SELECTION).getBoundingClientRect(),
          left = _this$el$querySelecto.left,
          top = _this$el$querySelecto.top;

      _this._selectionOffset = {
        left: left + window.pageXOffset,
        top: top + window.pageYOffset
      };
    });
  }
  /**
   * Cache elements for use
   * @private
   */
  ;

  _proto._cacheElements = function _cacheElements() {
    this.header = this.el.querySelector("." + CLASS_TABLE_HEADER);
    this.body = this.el.querySelector("." + CLASS_TABLE_BODY);
    this.selection = this.el.querySelector("." + CLASS_SELECTION_AREA);
    this.desc = this.el.querySelector("." + CLASS_DESCRIPTION);
  }
  /**
   * Resize table if need
   * @param {number} col column index
   * @param {number} row row index
   * @private
   */
  ;

  _proto._resizeTableBySelectionIfNeed = function _resizeTableBySelectionIfNeed(col, row) {
    var resizedBound = this._getResizedTableBound(col, row);

    if (resizedBound) {
      this._setTableSizeByBound(resizedBound.col, resizedBound.row);
    }
  }
  /**
   * Get resized table bound if Need
   * @param {number} col column index
   * @param {number} row row index
   * @returns {object} bound
   * @private
   */
  ;

  _proto._getResizedTableBound = function _getResizedTableBound(col, row) {
    var resizedCol, resizedRow, resizedBound;

    if (col >= MIN_COL_INDEX && col < MAX_COL_INDEX) {
      resizedCol = col + 1;
    } else if (col < MIN_COL_INDEX) {
      resizedCol = MIN_COL_INDEX;
    }

    if (row >= MIN_ROW_INDEX && row < MAX_ROW_INDEX) {
      resizedRow = row + 1;
    } else if (row < MIN_ROW_INDEX) {
      resizedRow = MIN_ROW_INDEX;
    }

    if (this._isNeedResizeTable(resizedCol, resizedRow)) {
      resizedBound = {
        row: resizedRow || this._tableBound.row,
        col: resizedCol || this._tableBound.col
      };
    }

    return resizedBound;
  }
  /**
   * check if need resize table
   * @param {number} col column index
   * @param {number} row row index
   * @returns {boolean} result
   * @private
   */
  ;

  _proto._isNeedResizeTable = function _isNeedResizeTable(col, row) {
    return col && col !== this._tableBound.col || row && row !== this._tableBound.row;
  }
  /**
   * Get bound by offset
   * @param {number} x offset
   * @param {number} y offset
   * @returns {object} bound
   * @private
   */
  ;

  _proto._getBoundByOffset = function _getBoundByOffset(x, y) {
    var row = parseInt(y / CELL_HEIGHT, 10);
    var col = parseInt(x / CELL_WIDTH, 10);
    return {
      row: row,
      col: col
    };
  }
  /**
   * Get offset by bound
   * @param {number} col column index
   * @param {number} row row index
   * @returns {object} offset
   * @private
   */
  ;

  _proto._getOffsetByBound = function _getOffsetByBound(col, row) {
    var x = col * CELL_WIDTH + CELL_WIDTH,
        y = row * CELL_HEIGHT + CELL_HEIGHT;
    return {
      x: x,
      y: y
    };
  }
  /**
   * Set table size with bound
   * @param {number} col column index
   * @param {number} row row index
   * @private
   */
  ;

  _proto._setTableSizeByBound = function _setTableSizeByBound(col, row) {
    var boundOffset = this._getOffsetByBound(col, row - HEADER_ROW_COUNT);

    this._setTableSize(boundOffset.x, boundOffset.y);

    this._tableBound.row = row;
    this._tableBound.col = col;
  }
  /**
   * Get selection bound that process with range by offset
   * @param {number} x offset
   * @param {number} y offset
   * @returns {object} bound
   * @private
   */
  ;

  _proto._getSelectionBoundByOffset = function _getSelectionBoundByOffset(x, y) {
    var bound = this._getBoundByOffset(x, y);

    if (bound.row < MIN_ROW_SELECTION_INDEX) {
      bound.row = MIN_ROW_SELECTION_INDEX;
    } else if (bound.row > this._tableBound.row) {
      bound.row = this._tableBound.row;
    }

    if (bound.col < MIN_COL_SELECTION_INDEX) {
      bound.col = MIN_COL_SELECTION_INDEX;
    } else if (bound.col > this._tableBound.col) {
      bound.col = this._tableBound.col;
    }

    return bound;
  }
  /**
   * Set selection area with bound
   * @param {number} col column index
   * @param {number} row row index
   * @private
   */
  ;

  _proto._setSelectionAreaByBound = function _setSelectionAreaByBound(col, row) {
    var boundOffset = this._getOffsetByBound(col, row);

    this._setSelectionArea(boundOffset.x, boundOffset.y);
  }
  /**
   * Set selected bound
   * @param {number} col column index
   * @param {number} row row index
   * @private
   */
  ;

  _proto._setSelectedBound = function _setSelectedBound(col, row) {
    this._selectedBound.col = col;
    this._selectedBound.row = row;
  }
  /**
   * Get selected table size
   * @returns {object} bound
   * @private
   */
  ;

  _proto._getSelectedTableSize = function _getSelectedTableSize() {
    return {
      row: this._selectedBound.row + 1,
      col: this._selectedBound.col + 1
    };
  }
  /**
   * Set selected table size text for display
   * @param {number} col column index
   * @param {number} row row index
   * @private
   */
  ;

  _proto._setDisplayText = function _setDisplayText(col, row) {
    this.desc.innerHTML = col + 1 + " x " + (row + 1);
  }
  /**
   * Set table element size
   * @param {number} x offset
   * @param {number} y offset
   * @private
   */
  ;

  _proto._setTableSize = function _setTableSize(x, y) {
    x += LAST_BORDER;
    y += LAST_BORDER;
    css_default()(this.header, {
      height: CELL_HEIGHT + "px",
      width: x + "px"
    });
    css_default()(this.body, {
      height: y + "px",
      width: x + "px"
    });
    css_default()(this.el, {
      width: x + 30 + "px"
    });
  }
  /**
   * Set selection element size
   * @param {number} x offset
   * @param {number} y offset
   * @private
   */
  ;

  _proto._setSelectionArea = function _setSelectionArea(x, y) {
    x += LAST_BORDER;
    y += LAST_BORDER;
    css_default()(this.selection, {
      height: y + "px",
      width: x + "px"
    });
  };

  _proto.remove = function remove() {
    this.off("mousemove ." + CLASS_TABLE_SELECTION, this._eventHandlers.onMousedown);
    this.off("click ." + CLASS_TABLE_SELECTION, this._eventHandlers.onClick);

    _LayerPopup.prototype.remove.call(this);
  };

  return PopupAddTable;
}(layerpopup);

popupAddTable_PopupAddTable.CELL_WIDTH = CELL_WIDTH;
popupAddTable_PopupAddTable.CELL_HEIGHT = CELL_HEIGHT;
popupAddTable_PopupAddTable.MIN_ROW_SELECTION_INDEX = MIN_ROW_SELECTION_INDEX;
popupAddTable_PopupAddTable.MIN_COL_SELECTION_INDEX = MIN_COL_SELECTION_INDEX;
/* harmony default export */ var popupAddTable = (popupAddTable_PopupAddTable);
// CONCATENATED MODULE: ./src/js/ui/popupAddHeading.js
function popupAddHeading_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileoverview Implements PopupAddHeading
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */





/**
 * Class PopupAddHeading
 * It implements Popup to add headings
 * @param {LayerPopupOption} options - layer popup option
 * @ignore
 */

var popupAddHeading_PopupAddHeading = /*#__PURE__*/function (_LayerPopup) {
  popupAddHeading_inheritsLoose(PopupAddHeading, _LayerPopup);

  function PopupAddHeading(options) {
    var POPUP_CONTENT = "\n      <ul>\n        <li data-value=\"1\" data-type=\"Heading\"><h1>" + i18n.get('Heading') + " 1</h1></li>\n        <li data-value=\"2\" data-type=\"Heading\"><h2>" + i18n.get('Heading') + " 2</h2></li>\n        <li data-value=\"3\" data-type=\"Heading\"><h3>" + i18n.get('Heading') + " 3</h3></li>\n        <li data-value=\"4\" data-type=\"Heading\"><h4>" + i18n.get('Heading') + " 4</h4></li>\n        <li data-value=\"5\" data-type=\"Heading\"><h5>" + i18n.get('Heading') + " 5</h5></li>\n        <li data-value=\"6\" data-type=\"Heading\"><h6>" + i18n.get('Heading') + " 6</h6></li>\n        <li data-type=\"Paragraph\"><div>" + i18n.get('Paragraph') + "</div></li>\n      </ul>\n    ";
    options = extend_default()({
      header: false,
      className: 'te-heading-add',
      content: POPUP_CONTENT
    }, options);
    return _LayerPopup.call(this, options) || this;
  }
  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   * @override
   */


  var _proto = PopupAddHeading.prototype;

  _proto._initInstance = function _initInstance(options) {
    _LayerPopup.prototype._initInstance.call(this, options);

    this._eventManager = options.eventManager;
    this._button = options.button;
  }
  /**
   * bind DOM events
   * @private
   * @override
   */
  ;

  _proto._initDOMEvent = function _initDOMEvent() {
    var _this = this;

    _LayerPopup.prototype._initDOMEvent.call(this);

    this.on('click li', function (ev) {
      var li = dom["a" /* default */].closest(ev.target, 'li');

      _this._eventManager.emit('command', li.getAttribute('data-type'), li.getAttribute('data-value'));
    });
  }
  /**
   * bind editor events
   * @private
   * @override
   */
  ;

  _proto._initEditorEvent = function _initEditorEvent() {
    var _this2 = this;

    _LayerPopup.prototype._initEditorEvent.call(this);

    this._eventManager.listen('focus', this.hide.bind(this));

    this._eventManager.listen('closeAllPopup', this.hide.bind(this));

    this._eventManager.listen('openHeadingSelect', function () {
      var button = _this2._button;
      var offsetTop = button.offsetTop,
          offsetLeft = button.offsetLeft;
      css_default()(_this2.el, {
        top: offsetTop + dom["a" /* default */].getOuterHeight(button) + "px",
        left: offsetLeft + "px"
      });

      _this2._eventManager.emit('closeAllPopup');

      _this2.show();
    });
  };

  return PopupAddHeading;
}(layerpopup);

/* harmony default export */ var popupAddHeading = (popupAddHeading_PopupAddHeading);
// CONCATENATED MODULE: ./src/js/ui/popupCodeBlockLanguages.js
function popupCodeBlockLanguages_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileoverview Implements popup code block languages
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */








var BUTTON_CLASS_PREFIX = 'te-popup-code-block-lang-';

function getButtonsHTML(languages) {
  return languages.map(function (lang) {
    return "<button type=\"button\" class=\"" + BUTTON_CLASS_PREFIX + lang + "\" data-lang=\"" + lang + "\">" + lang + "</button>";
  }).join('');
}
/**
 * Class Popup code block languages select list
 * @param {LayerPopupOption} options - layer popup option
 * @ignore
 */


var popupCodeBlockLanguages_PopupCodeBlockLanguages = /*#__PURE__*/function (_LayerPopup) {
  popupCodeBlockLanguages_inheritsLoose(PopupCodeBlockLanguages, _LayerPopup);

  function PopupCodeBlockLanguages(options) {
    var _options = options,
        languages = _options.languages;
    options = extend_default()({
      header: false,
      className: 'te-popup-code-block-languages',
      content: getButtonsHTML(languages)
    }, options);
    return _LayerPopup.call(this, options) || this;
  }
  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   * @override
   */


  var _proto = PopupCodeBlockLanguages.prototype;

  _proto._initInstance = function _initInstance(options) {
    var _this = this;

    _LayerPopup.prototype._initInstance.call(this, options);

    this.eventManager = options.eventManager;
    this._onSelectedLanguage = null;
    this._onDismissed = null;
    this._currentButton = null;
    this._buttons = null;
    this._languages = options.languages;

    this._btnMousedownHandler = function (event) {
      var language = event.target.getAttribute('data-lang');

      if (_this._onSelectedLanguage) {
        _this._onSelectedLanguage(language);
      }

      _this.hide();
    };
  }
  /**
   * initialize DOM, render popup
   * @private
   * @override
   */
  ;

  _proto._initDOM = function _initDOM(options) {
    _LayerPopup.prototype._initDOM.call(this, options);

    css_default()(this.el, 'zIndex', 10000);
    this._buttons = dom["a" /* default */].findAll(this.el, 'button');

    this._activateButtonByIndex(0);
  }
  /**
   * bind DOM events
   * @private
   * @override
   */
  ;

  _proto._initDOMEvent = function _initDOMEvent() {
    _LayerPopup.prototype._initDOMEvent.call(this);

    this._addBtnMouseDownHandler();
  }
  /**
   * bind editor events
   * @private
   * @override
   */
  ;

  _proto._initEditorEvent = function _initEditorEvent() {
    var _this2 = this;

    _LayerPopup.prototype._initEditorEvent.call(this);

    this.eventManager.listen('openPopupCodeBlockLanguages', function (data) {
      _this2.show(data.callback);

      css_default()(_this2.el, {
        top: data.offset.top + "px"
      });
      css_default()(_this2.el, {
        left: data.offset.left + "px"
      });

      _this2.setCurrentLanguage(data.language);

      return _this2;
    });
    this.eventManager.listen('focus', function () {
      return _this2.hide();
    });
    this.eventManager.listen('mousedown', function () {
      return _this2.hide();
    });
    this.eventManager.listen('closeAllPopup', function () {
      return _this2.hide();
    });
    this.eventManager.listen('closePopupCodeBlockLanguages', function () {
      return _this2.hide();
    });
    this.eventManager.listen('scroll', function () {
      return _this2.hide();
    });
    this.eventManager.listen('setCodeBlockLanguages', function (languages) {
      return _this2._changeLanguageButtons(languages);
    });
  }
  /**
   * activate an item by index
   * @param {number} index - item index
   * @private
   */
  ;

  _proto._activateButtonByIndex = function _activateButtonByIndex(index) {
    if (this._currentButton) {
      removeClass_default()(this._currentButton, 'active');
    }

    if (this._buttons.length) {
      this._currentButton = this._buttons[index];
      addClass_default()(this._currentButton, 'active');

      this._currentButton.scrollIntoView();
    }
  }
  /**
   * move to prev language
   */
  ;

  _proto.prev = function prev() {
    var index = inArray_default()(this._currentButton, this._buttons) - 1;

    if (index < 0) {
      index = this._buttons.length - 1;
    }

    this._activateButtonByIndex(index);
  }
  /**
   * move to next language
   */
  ;

  _proto.next = function next() {
    var index = inArray_default()(this._currentButton, this._buttons) + 1;

    if (index >= this._buttons.length) {
      index = 0;
    }

    this._activateButtonByIndex(index);
  }
  /**
   * current language
   * @returns {string} language
   */
  ;

  _proto.getCurrentLanguage = function getCurrentLanguage() {
    var language = this._currentButton.getAttribute('data-lang');

    return language;
  }
  /**
   * set current language
   * @param {string} language - current language
   */
  ;

  _proto.setCurrentLanguage = function setCurrentLanguage(language) {
    var item = this._buttons.filter(function (button) {
      return matches_default()(button, "." + BUTTON_CLASS_PREFIX + language);
    });

    if (item.length > 0) {
      var index = inArray_default()(item[0], this._buttons);

      this._activateButtonByIndex(index);
    }
  }
  /**
   * show popup
   * @param {object} callback - to be called on language selected & dismissed
   * @override
   */
  ;

  _proto.show = function show(callback) {
    this._onSelectedLanguage = callback.selected;
    this._onDismissed = callback.dismissed;

    _LayerPopup.prototype.show.call(this);
  }
  /**
   * hide popup
   * @override
   */
  ;

  _proto.hide = function hide() {
    if (this._onDismissed) {
      this._onDismissed();
    }

    this._onSelectedLanguage = null;
    this._onDismissed = null;

    _LayerPopup.prototype.hide.call(this);
  };

  _proto._addBtnMouseDownHandler = function _addBtnMouseDownHandler() {
    var _this3 = this;

    this._languages.forEach(function (lang) {
      _this3.off("mousedown ." + BUTTON_CLASS_PREFIX + lang, _this3._btnMousedownHandler);

      _this3.on("mousedown ." + BUTTON_CLASS_PREFIX + lang, _this3._btnMousedownHandler);
    });
  };

  _proto._changeLanguageButtons = function _changeLanguageButtons(languages) {
    this._languages = languages;

    if (languages && languages.length) {
      this.content = getButtonsHTML(languages);
      this.setContent(this.content);

      this._addBtnMouseDownHandler();

      this._buttons = dom["a" /* default */].findAll(this.el, 'button');

      this._activateButtonByIndex(0);
    }
  };

  return PopupCodeBlockLanguages;
}(layerpopup);

/* harmony default export */ var popupCodeBlockLanguages = (popupCodeBlockLanguages_PopupCodeBlockLanguages);
// CONCATENATED MODULE: ./src/js/ui/scrollSyncSplit.js
/**
 * @fileoverview Implements scroll sync split
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */






var CLASS_SPLIT_SCROLL = 'tui-split-scroll';
var CLASS_SINGLE_CONTENT = 'single-content';
var CLASS_SCROLL_SYNC = 'scroll-sync';
var CLASS_SCROLL_WRAPPER = 'tui-split-scroll-wrapper';
var CLASS_SCROLL_CONTENT = 'tui-split-scroll-content';
var CLASS_SPLITTER = 'tui-splitter';
var EVENT_REQUIRE_SCROLL_INTO_VIEW = 'requireScrollIntoView';
var CLASS_CONTENT_LEFT = 'tui-split-content-left';
var CLASS_CONTENT_RIGHT = 'tui-split-content-right';
var CLASS_CONTENT = {
  left: CLASS_CONTENT_LEFT,
  right: CLASS_CONTENT_RIGHT
};
/**
 * Class ScrollSyncSplit
 * @param {Element} baseElement - an element which attach a splitSyncSplit
 * @param {Element} leftElement - an element to be on left side split view
 * @param {Element} rightElement - an element to be on right side split view
 * @param {object} options - options
 *     @param {boolean} [options.showScrollSyncButton=false] - show scroll sync button on top right corner
 *     @param {boolean} [options.scrollSync=true] - true for enable scroll sync
 *     @param {boolean} [options.splitView=true] - true for split, false for single view
 * @ignore
 */

var scrollSyncSplit_ScrollSyncSplit = /*#__PURE__*/function () {
  function ScrollSyncSplit(baseElement, leftElement, rightElement, options) {
    if (options === void 0) {
      options = {};
    }

    options = extend_default()({
      showScrollSyncButton: false,
      scrollSync: true,
      splitView: true
    }, options);
    this._baseElement = baseElement;
    this._eventManager = options.eventManager;
    /**
     * left, right side content elements
     * @type {HTMLElement[]}
     * @private
     */

    this._contentElements = [];

    this._initDom(leftElement, rightElement, options);

    this._initDomEvent();
  }

  var _proto = ScrollSyncSplit.prototype;

  _proto._initDom = function _initDom(leftElement, rightElement, options) {
    var el = document.createElement('div');
    el.className = CLASS_SPLIT_SCROLL;
    this._el = el;
    var scrollWrapper = document.createElement('div');
    scrollWrapper.className = CLASS_SCROLL_WRAPPER;
    this._scrollWrapper = scrollWrapper;

    this._setScrollSync(options.scrollSync);

    this.setSplitView(options.splitView);
    var contentWrapper = document.createElement('div');
    contentWrapper.className = CLASS_SCROLL_CONTENT;
    this._contentWrapper = contentWrapper;
    var splitter = document.createElement('div');
    splitter.className = CLASS_SPLITTER;

    this._baseElement.appendChild(el);

    el.appendChild(scrollWrapper);
    scrollWrapper.appendChild(contentWrapper);
    scrollWrapper.appendChild(splitter);

    this._setLeft(leftElement);

    this._setRight(rightElement);
  };

  _proto._initDomEvent = function _initDomEvent() {
    this._contentWrapper.addEventListener('scroll', this.sync.bind(this));
  };

  _proto._requireScrollIntoView = function _requireScrollIntoView(element) {
    var _element$getBoundingC = element.getBoundingClientRect(),
        targetTop = _element$getBoundingC.top,
        targetBottom = _element$getBoundingC.bottom;

    var wrapperElement;

    if (this.isScrollSynced()) {
      wrapperElement = this._contentWrapper;
    } else if (dom["a" /* default */].parents(element, this._contentElements.left).length) {
      wrapperElement = this._contentElements.left;
    } else if (dom["a" /* default */].parents(element, this._contentElements.right).length) {
      wrapperElement = this._contentElements.right;
    } else {
      return;
    }

    var _wrapperElement$getBo = wrapperElement.getBoundingClientRect(),
        wrapperTop = _wrapperElement$getBo.top,
        wrapperBottom = _wrapperElement$getBo.bottom;

    if (targetTop < wrapperTop) {
      wrapperElement.scrollTop = wrapperElement.scrollTop + targetTop - wrapperTop;
    } else if (targetBottom > wrapperBottom) {
      wrapperElement.scrollTop = wrapperElement.scrollTop + targetBottom - wrapperBottom;
    }

    this.sync();
  }
  /**
   * set content element for given side
   * @param {Element} element - content element
   * @param {string} side - 'left' | 'right'
   * @private
   */
  ;

  _proto._setContentElement = function _setContentElement(element, side) {
    var _this = this;

    var contentElement = this._contentElements[side];

    if (contentElement) {
      this._eventManager.removeEventHandler(EVENT_REQUIRE_SCROLL_INTO_VIEW);

      this._contentWrapper.removeChild(contentElement);
    }

    addClass_default()(element, CLASS_CONTENT[side]);

    this._contentWrapper.appendChild(element);

    this._eventManager.listen(EVENT_REQUIRE_SCROLL_INTO_VIEW, function (ev) {
      return _this._requireScrollIntoView(ev);
    });

    this._eventManager.listen('requireScrollSync', function () {
      return _this.sync();
    });

    this._contentElements[side] = element;
    this.sync();
  }
  /**
   * set left side element
   * @param {Element} element - an element to be on left side split view
   * @private
   */
  ;

  _proto._setLeft = function _setLeft(element) {
    this._setContentElement(element, 'left');
  }
  /**
   * set right side element
   * @param {Element} element - an element to be on right side split view
   * @private
   */
  ;

  _proto._setRight = function _setRight(element) {
    this._setContentElement(element, 'right');
  };

  _proto._setScrollSync = function _setScrollSync(activate) {
    dom["a" /* default */].toggleClass(this._el, CLASS_SCROLL_SYNC, activate);
  }
  /**
   * toggle multi scroll
   */
  ;

  _proto.toggleScrollSync = function toggleScrollSync() {
    dom["a" /* default */].toggleClass(this._el, CLASS_SCROLL_SYNC);
  };

  _proto.setSplitView = function setSplitView(activate) {
    if (!activate) {
      addClass_default()(this._el, CLASS_SINGLE_CONTENT);
    } else {
      removeClass_default()(this._el, CLASS_SINGLE_CONTENT);
    }
  }
  /**
   * toggle split
   */
  ;

  _proto.toggleSplitView = function toggleSplitView() {
    dom["a" /* default */].toggleClass(this._el, CLASS_SINGLE_CONTENT);
  }
  /**
   * is scroll synced
   * @returns {boolean} - true for synced, false for each scroll
   */
  ;

  _proto.isScrollSynced = function isScrollSynced() {
    return hasClass_default()(this._el, CLASS_SCROLL_SYNC);
  }
  /**
   * is split view
   * @returns {boolean} - true for split view, false for single view
   */
  ;

  _proto.isSplitView = function isSplitView() {
    return !hasClass_default()(this._el, CLASS_SINGLE_CONTENT);
  }
  /**
   * sync scroll
   */
  ;

  _proto.sync = function sync() {
    if (!this._contentElements.left || !this._contentElements.right) {
      return;
    }

    var wrapperHeight = this._contentWrapper.clientHeight;
    var scrollTop = this._contentWrapper.scrollTop;
    var leftElement = this._contentElements.left;
    var rightElement = this._contentElements.right;
    var scrollingElement = leftElement.offsetHeight - wrapperHeight > 0 ? leftElement : rightElement;
    var followingElement = scrollingElement === leftElement ? rightElement : leftElement;
    var scrollingElementHeight = scrollingElement.offsetHeight;
    var scrollingElementScrollMax = Math.max(scrollingElementHeight - wrapperHeight, 0);
    var followingElementHeight = Math.max(followingElement.offsetHeight, wrapperHeight);
    var followingElementTopMax = scrollingElementHeight - followingElementHeight;
    css_default()(scrollingElement, {
      top: 0
    });
    css_default()(followingElement, {
      top: scrollTop / scrollingElementScrollMax * followingElementTopMax + "px"
    });
  }
  /**
   * scroll top
   * @param {number} top - scroll top in pixel
   */
  ;

  _proto.scrollTop = function scrollTop(top) {
    this._contentWrapper.scrollTop = top;
  };

  return ScrollSyncSplit;
}();

/* harmony default export */ var scrollSyncSplit = (scrollSyncSplit_ScrollSyncSplit);
// CONCATENATED MODULE: ./src/js/codeBlockEditor.js
function codeBlockEditor_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileoverview Implements code block editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Class Code Block Editor
 * @param {HTMLElement} el - code block editor container element
 * @param {EventManager} eventManager - event manager
 * @ignore
 */

var CodeBlockEditor = /*#__PURE__*/function (_CodeMirrorExt) {
  codeBlockEditor_inheritsLoose(CodeBlockEditor, _CodeMirrorExt);

  function CodeBlockEditor(el, eventManager) {
    var _this;

    _this = _CodeMirrorExt.call(this, el, {
      singleCursorHeightPerLine: false,
      theme: 'none'
    }) || this;
    _this._language = '';
    _this._eventManager = eventManager;

    _this._initEvent();

    return _this;
  }

  var _proto = CodeBlockEditor.prototype;

  _proto._initEvent = function _initEvent() {
    var _this2 = this;

    this.on('cursorActivity', this._onRequireScrollIntoView.bind(this));
    this.on('beforeChange', function (cm, ev) {
      if (ev.origin === 'paste') {
        _this2._eventManager.emit('pasteBefore', {
          source: 'codeblock',
          data: ev
        });
      }
    });
  };

  _proto._onRequireScrollIntoView = function _onRequireScrollIntoView() {
    var _this3 = this;

    var cursor = this.getCursor();
    var wrapper = this.getWrapperElement(); // CodeMirror cursorActivity event fires before actually attach a new line element to DOM
    // we should proceed at next tick

    setTimeout(function () {
      var lineElement = wrapper.querySelector("pre:nth-child(" + (cursor.line + 1) + ")");

      if (lineElement) {
        _this3._eventManager.emit('requireScrollIntoView', lineElement);
      }
    }, 0);
  }
  /**
   * load code from code block element
   * @param {HTMLElement} codeBlockElement - code block element
   */
  ;

  _proto.load = function load(codeBlockElement) {
    var el = codeBlockElement.cloneNode(true);
    this.setLanguage(el.getAttribute('data-language') || '');
    this.setEditorCodeText(el.textContent);
  }
  /**
   * save code to code block element
   * @param {HTMLElement} codeBlockElement - code block element
   */
  ;

  _proto.save = function save(codeBlockElement) {
    codeBlockElement.innerHTML = '';
    codeBlockElement.textContent = this.getEditorCodeText();
    codeBlockElement.setAttribute('data-language', this._language);

    this._eventManager.emit('changeLanguage');
  }
  /**
   * clear code and language
   */
  ;

  _proto.clear = function clear() {
    this.setLanguage('');
    this.setEditorCodeText('');
  }
  /**
   * get code language
   * @returns {string} - code language
   */
  ;

  _proto.getLanguage = function getLanguage() {
    return this._language;
  }
  /**
   * set code language
   * @param {string} [language=''] - code language
   */
  ;

  _proto.setLanguage = function setLanguage(language) {
    if (language === void 0) {
      language = '';
    }

    this._language = language;
  }
  /**
   * get code text
   * @returns {string} - code text
   */
  ;

  _proto.getEditorCodeText = function getEditorCodeText() {
    return this.getValue();
  }
  /**
   * set code text
   * @param {string} [code=''] - code text
   */
  ;

  _proto.setEditorCodeText = function setEditorCodeText(code) {
    if (code === void 0) {
      code = '';
    }

    this.setValue(code);
  }
  /**
   * refresh. call if codemirror resized
   */
  ;

  _proto.refresh = function refresh() {
    this.cm.refresh();
  };

  return CodeBlockEditor;
}(codeMirrorExt);

/* harmony default export */ var codeBlockEditor = (CodeBlockEditor);
// EXTERNAL MODULE: ./src/js/preview.js + 1 modules
var js_preview = __webpack_require__(38);

// CONCATENATED MODULE: ./src/js/codeBlockPreview.js
function codeBlockPreview_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function codeBlockPreview_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileoverview Implements CodeBlockPreview
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Class Code block preview
 * @param {HTMLElement} el - base element
 * @param {EventManager} eventManager - event manager
 * @param {Convertor} convertor - convertor
 * @param {CodeBlockEditor} codeBlockEditor - code block editor
 * @ignore
 */

var CodeBlockPreview = /*#__PURE__*/function (_Preview) {
  codeBlockPreview_inheritsLoose(CodeBlockPreview, _Preview);

  function CodeBlockPreview(el, eventManager, convertor, codeBlockEditor) {
    var _this;

    _this = _Preview.call(this, el, eventManager, convertor, true) || this;
    _this._codeBlockEditor = codeBlockEditor;

    _this._initEvent();

    _this.lazyRunner.registerLazyRunFunction('refresh', _this.refresh, _this.delayCodeBlockTime, codeBlockPreview_assertThisInitialized(_this));

    return _this;
  }

  var _proto = CodeBlockPreview.prototype;

  _proto._initEvent = function _initEvent() {
    var _this2 = this;

    this._codeBlockEditor.on('update', function () {
      return _this2.lazyRunner.run('refresh');
    });
  }
  /**
   * refresh preview
   * @override
   */
  ;

  _proto.refresh = function refresh() {
    var language = this._codeBlockEditor.getLanguage();

    var codeText = this._codeBlockEditor.getEditorCodeText();

    _Preview.prototype.refresh.call(this, "```" + language + "\n" + codeText + "\n```");

    this.eventManager.emit('requireScrollSync');
  }
  /**
   * clear preview
   */
  ;

  _proto.clear = function clear() {
    _Preview.prototype.render.call(this, '');
  };

  return CodeBlockPreview;
}(js_preview["a" /* default */]);

/* harmony default export */ var codeBlockPreview = (CodeBlockPreview);
// CONCATENATED MODULE: ./src/js/ui/codeBlockLanguagesCombo.js
/**
 * @fileoverview Implements UI code block languages combo
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */







/**
 * Class CodeBlockLanguagesCombo
 * @param {EventManager} eventManager - event manager instance
 * @ignore
 */

var codeBlockLanguagesCombo_CodeBlockLanguagesCombo = /*#__PURE__*/function () {
  function CodeBlockLanguagesCombo(eventManager, languages) {
    this._eventManager = eventManager;
    this._languages = languages;

    this._initDOM();

    this._initDOMEvent();

    this._initEvent();
  }

  var _proto = CodeBlockLanguagesCombo.prototype;

  _proto._initDOM = function _initDOM() {
    this._inputLanguage = dom["a" /* default */].createElementWith("<input type=\"text\" maxlength=\"20\" placeholder=\"" + i18n.get('Choose language') + "\" />");
    this._wrapper = dom["a" /* default */].createElementWith("<span class=\"te-input-language\"></span>");

    this._wrapper.appendChild(this._inputLanguage);

    this._hide();
  };

  _proto._initDOMEvent = function _initDOMEvent() {
    var _this = this;

    this._inputLanguage.addEventListener('keydown', function (event) {
      return _this._onKeyEvent(event);
    });

    this._inputLanguage.addEventListener('focus', function () {
      return _this._showPopupCodeBlockLanguages();
    });

    this._inputLanguage.addEventListener('focusout', function () {
      return _this._onFocusOut();
    });

    this._wrapper.addEventListener('mousedown', function (ev) {
      if (ev.target !== _this._wrapper) {
        return;
      }

      ev.preventDefault();

      _this._toggleFocus();
    });
  };

  _proto._initEvent = function _initEvent() {
    var _this2 = this;

    this._eventManager.listen('setCodeBlockLanguages', function (languages) {
      _this2._languages = languages;

      if (languages && languages.length) {
        _this2._show();
      } else {
        _this2._hide();
      }
    });
  }
  /**
   * show popup
   * @private
   */
  ;

  _proto._showPopupCodeBlockLanguages = function _showPopupCodeBlockLanguages() {
    var _this3 = this;

    var clientRect = this._inputLanguage.getBoundingClientRect();

    addClass_default()(this._wrapper, 'active');
    this.active = true;
    this._popupCodeBlockLanguages = this._eventManager.emitReduce('openPopupCodeBlockLanguages', {
      language: this._prevStoredLanguage,
      offset: {
        left: clientRect.left,
        top: clientRect.bottom
      },
      callback: {
        selected: function selected(selectedLanguage) {
          return _this3._onLanguageSelectedFromList(selectedLanguage);
        },
        dismissed: function dismissed() {
          _this3._popupCodeBlockLanguages = null;
        }
      }
    });
  };

  _proto._toggleFocus = function _toggleFocus() {
    var inputLanguage = this._inputLanguage;

    if (hasClass_default()(this._wrapper, 'active')) {
      inputLanguage.blur();
    } else {
      inputLanguage.focus();
    }
  };

  _proto._onFocusOut = function _onFocusOut() {
    removeClass_default()(this._wrapper, 'active');
    this._inputLanguage.value = this._prevStoredLanguage;

    this._hidePopupCodeBlockLanguages();
  };

  _proto._onKeyEvent = function _onKeyEvent(event) {
    if (this._popupCodeBlockLanguages) {
      switch (event.which) {
        case keyMapper.keyCode('UP'):
          this._popupCodeBlockLanguages.prev();

          event.preventDefault();
          break;

        case keyMapper.keyCode('DOWN'):
          this._popupCodeBlockLanguages.next();

          event.preventDefault();
          break;

        case keyMapper.keyCode('ENTER'):
        case keyMapper.keyCode('TAB'):
          {
            var language = this._popupCodeBlockLanguages.getCurrentLanguage();

            this._inputLanguage.value = language;

            this._storeInputLanguage();

            event.preventDefault();
            break;
          }

        default:
          this._popupCodeBlockLanguages.hide();

      }
    } else if (event.which === keyMapper.keyCode('ENTER') || event.which === keyMapper.keyCode('TAB')) {
      this._storeInputLanguage();

      event.preventDefault();
    }
  };

  _proto._onLanguageSelectedFromList = function _onLanguageSelectedFromList(selectedLanguage) {
    this._inputLanguage.value = selectedLanguage;

    this._storeInputLanguage();
  }
  /**
   * set a callback to be called on language selected
   * @param {function} callback - callback function
   * @protected
   */
  ;

  _proto.setOnLanguageSelected = function setOnLanguageSelected(callback) {
    this._onLanguageSelected = callback;
  }
  /**
   * hide popup
   * @private
   */
  ;

  _proto._hidePopupCodeBlockLanguages = function _hidePopupCodeBlockLanguages() {
    this._eventManager.emit('closePopupCodeBlockLanguages');
  }
  /**
   * set language
   * @param {string} language - code block language
   * @protected
   */
  ;

  _proto.setLanguage = function setLanguage(language) {
    this._prevStoredLanguage = language;
    this._inputLanguage.value = language;
  }
  /**
   * store selection(typed) language & hide popup
   * @private
   */
  ;

  _proto._storeInputLanguage = function _storeInputLanguage() {
    var selectedLanguage = this._inputLanguage.value;
    this.setLanguage(selectedLanguage);

    if (this._onLanguageSelected) {
      this._onLanguageSelected(selectedLanguage);
    }

    this._hidePopupCodeBlockLanguages();
  }
  /**
   * get element body
   * @returns {HTMLElement} - CodeBlockLanguagesCombo body element
   * @protected
   */
  ;

  _proto.getElement = function getElement() {
    return this._wrapper;
  };

  _proto._show = function _show() {
    css_default()(this._wrapper, {
      display: 'inline-block'
    });
  };

  _proto._hide = function _hide() {
    css_default()(this._wrapper, {
      display: 'none'
    });
  };

  return CodeBlockLanguagesCombo;
}();

/* harmony default export */ var ui_codeBlockLanguagesCombo = (codeBlockLanguagesCombo_CodeBlockLanguagesCombo);
// CONCATENATED MODULE: ./src/js/ui/popupCodeBlockEditor.js
function popupCodeBlockEditor_inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * @fileoverview Implements popup code block editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */









var popupCodeBlockEditor_CLASS_PREFIX = 'popup-editor-';
var popupCodeBlockEditor_CLASS_OK_BUTTON = 'te-ok-button';
var popupCodeBlockEditor_CLASS_CLOSE_BUTTON = 'te-close-button';
var CLASS_POPUP_CLOSE_BUTTON = 'tui-popup-close-button';
var TEMPLATE_HEADER_BUTTONS = "\n    <button type=\"button\" class=\"" + popupCodeBlockEditor_CLASS_PREFIX + "toggle-scroll\"></button>\n    <button type=\"button\" class=\"" + popupCodeBlockEditor_CLASS_PREFIX + "toggle-preview\"></button>\n    <button type=\"button\" class=\"" + popupCodeBlockEditor_CLASS_PREFIX + "toggle-fit\"></button>\n    <button type=\"button\" class=\"" + CLASS_POPUP_CLOSE_BUTTON + "\"></button>\n";
/**
 * Class popup code block editor
 * @param {LayerPopupOption} options - layer popup option
 * @ignore
 */

var popupCodeBlockEditor_PopupCodeBlockEditor = /*#__PURE__*/function (_LayerPopup) {
  popupCodeBlockEditor_inheritsLoose(PopupCodeBlockEditor, _LayerPopup);

  function PopupCodeBlockEditor(options) {
    var TEMPLATE_CONTENT = "\n            <div class=\"" + popupCodeBlockEditor_CLASS_PREFIX + "body\"></div>\n            <div class=\"te-button-section\">\n                <button type=\"button\" class=\"" + popupCodeBlockEditor_CLASS_OK_BUTTON + "\">" + i18n.get('OK') + "</button>\n                <button type=\"button\" class=\"" + popupCodeBlockEditor_CLASS_CLOSE_BUTTON + "\">" + i18n.get('Cancel') + "</button>\n            </div>\n        ";
    options = extend_default()({
      header: true,
      title: 'CodeBlock Editor',
      content: TEMPLATE_CONTENT,
      className: 'tui-popup-code-block-editor',
      headerButtons: TEMPLATE_HEADER_BUTTONS,
      modal: true
    }, options);
    return _LayerPopup.call(this, options) || this;
  }
  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   * @override
   */


  var _proto = PopupCodeBlockEditor.prototype;

  _proto._initInstance = function _initInstance(options) {
    _LayerPopup.prototype._initInstance.call(this, options);

    this.eventManager = options.eventManager;
    this.convertor = options.convertor;
    this.languages = options.languages;
  }
  /**
   * initialize DOM, render popup
   * @private
   * @override
   */
  ;

  _proto._initDOM = function _initDOM(options) {
    _LayerPopup.prototype._initDOM.call(this, options);

    var el = this.el,
        eventManager = this.eventManager;
    this._body = el.querySelector("." + popupCodeBlockEditor_CLASS_PREFIX + "body");
    this._toggleFitButton = el.querySelector("." + popupCodeBlockEditor_CLASS_PREFIX + "toggle-fit");
    this._togglePreviewButton = el.querySelector("." + popupCodeBlockEditor_CLASS_PREFIX + "toggle-preview");
    this._toggleScrollButton = el.querySelector("." + popupCodeBlockEditor_CLASS_PREFIX + "toggle-scroll");
    this._okButton = el.querySelector("." + popupCodeBlockEditor_CLASS_OK_BUTTON);
    this._closeButton = el.querySelector("." + popupCodeBlockEditor_CLASS_CLOSE_BUTTON);
    this._codeMirrorWrapper = this._createCodeBlockEditor();
    this._previewWrapper = this._createPreview();
    this._scrollSyncSplit = new scrollSyncSplit(this._body, this._codeMirrorWrapper, this._previewWrapper, {
      eventManager: eventManager
    });

    this._updateFitWindowButton();

    this._updatePreviewButton();

    this._updateScrollButton();

    this._codeBlockLanguagesCombo = this._createCodeBlockLanguagesCombo();
  }
  /**
   * bind DOM events
   * @private
   * @override
   */
  ;

  _proto._initDOMEvent = function _initDOMEvent() {
    var _this = this;

    _LayerPopup.prototype._initDOMEvent.call(this);

    this.on('scroll', function (ev) {
      return ev.preventDefault();
    });
    this.on("click ." + popupCodeBlockEditor_CLASS_PREFIX + "toggle-fit", function () {
      return _this._toggleFitToWindow();
    });
    this.on("click ." + popupCodeBlockEditor_CLASS_PREFIX + "toggle-preview", function () {
      return _this._togglePreview();
    });
    this.on("click ." + popupCodeBlockEditor_CLASS_PREFIX + "toggle-scroll", function () {
      return _this._toggleScroll();
    });
    this.on("click ." + popupCodeBlockEditor_CLASS_OK_BUTTON, function () {
      return _this._save();
    });
    this.on("click ." + popupCodeBlockEditor_CLASS_CLOSE_BUTTON, function () {
      return _this.hide();
    });
    this.on("click ." + popupCodeBlockEditor_CLASS_PREFIX + "close", function () {
      return _this.hide();
    });
    this.on("click ." + popupCodeBlockEditor_CLASS_PREFIX + "editor-wrapper", function (ev) {
      if (ev.target === _this._codeMirrorWrapper) {
        _this._focusEditor(true);
      }
    });
  }
  /**
   * bind editor events
   * @private
   * @override
   */
  ;

  _proto._initEditorEvent = function _initEditorEvent() {
    var _this2 = this;

    _LayerPopup.prototype._initEditorEvent.call(this);

    this.eventManager.listen('openPopupCodeBlockEditor', function (codeBlockElement) {
      _this2.eventManager.emit('closeAllPopup');

      _this2.show(codeBlockElement);

      return _this2;
    });
    this.eventManager.listen('closeAllPopup', this.hide.bind(this));
    this.eventManager.listen('closePopupCodeBlockEditor', this.hide.bind(this));
  };

  _proto._createCodeBlockEditor = function _createCodeBlockEditor() {
    var codeMirrorWrapper = document.createElement('div');
    codeMirrorWrapper.className = popupCodeBlockEditor_CLASS_PREFIX + "editor-wrapper";
    this._codeBlockEditor = new codeBlockEditor(codeMirrorWrapper, this.eventManager);
    return codeMirrorWrapper;
  };

  _proto._createPreview = function _createPreview() {
    var previewWrapper = document.createElement('div');
    this._codeBlockPreview = new codeBlockPreview(previewWrapper, this.eventManager, this.convertor, this._codeBlockEditor);
    return previewWrapper;
  };

  _proto._createCodeBlockLanguagesCombo = function _createCodeBlockLanguagesCombo() {
    var _this3 = this;

    var titleElement = this.getTitleElement();
    var codeBlockLanguagesCombo = new ui_codeBlockLanguagesCombo(this.eventManager, this.languages);
    codeBlockLanguagesCombo.setOnLanguageSelected(function (selectedLanguage) {
      _this3._codeBlockEditor.setLanguage(selectedLanguage);

      _this3._codeBlockEditor.refresh();

      _this3._focusEditor();
    });
    titleElement.innerHTML = 'CodeBlock Editor';
    titleElement.appendChild(codeBlockLanguagesCombo.getElement());
    return codeBlockLanguagesCombo;
  };

  _proto._updateFitWindowButton = function _updateFitWindowButton() {
    dom["a" /* default */].toggleClass(this._toggleFitButton, 'active', this.isFitToWindow());
  };

  _proto._updatePreviewButton = function _updatePreviewButton() {
    dom["a" /* default */].toggleClass(this._togglePreviewButton, 'active', this._scrollSyncSplit.isSplitView());
  };

  _proto._updateScrollButton = function _updateScrollButton() {
    if (this._scrollSyncSplit.isSplitView()) {
      css_default()(this._toggleScrollButton, {
        display: 'inline-block'
      });
    } else {
      css_default()(this._toggleScrollButton, {
        display: 'none'
      });
    }

    dom["a" /* default */].toggleClass(this._toggleScrollButton, 'active', this._scrollSyncSplit.isScrollSynced());
  };

  _proto._focusEditor = function _focusEditor(cursorToEnd) {
    this._codeBlockEditor.focus();

    if (cursorToEnd) {
      this._codeBlockEditor.moveCursorToEnd();
    } else {
      this._codeBlockEditor.moveCursorToStart();
    }
  };

  _proto._togglePreview = function _togglePreview() {
    this._scrollSyncSplit.toggleSplitView();

    this._updatePreviewButton();

    this._updateScrollButton();

    this._codeBlockEditor.refresh();
  };

  _proto._toggleFitToWindow = function _toggleFitToWindow() {
    this.toggleFitToWindow();

    this._updateFitWindowButton();

    this._codeBlockEditor.refresh();
  };

  _proto._toggleScroll = function _toggleScroll() {
    this._scrollSyncSplit.toggleScrollSync();

    this._updateScrollButton();
  }
  /**
   * store code mirror text to wysiwyg code block
   * @private
   */
  ;

  _proto._save = function _save() {
    this._codeBlockEditor.save(this._codeBlockElement);

    this.hide();
  }
  /**
   * load code mirror text from wysiwyg code block
   * @param {HTMLElement} codeBlockElement - code block element instance to load code from
   * @private
   */
  ;

  _proto._load = function _load(codeBlockElement) {
    this._codeBlockElement = codeBlockElement;

    this._codeBlockEditor.load(codeBlockElement);

    this._codeBlockLanguagesCombo.setLanguage(this._codeBlockEditor.getLanguage());

    this._focusEditor();

    this._codeBlockPreview.refresh();
  }
  /**
   * show popup
   * @param {HTMLElement} codeBlockElement - code block element
   * @override
   */
  ;

  _proto.show = function show(codeBlockElement) {
    _LayerPopup.prototype.show.call(this);

    if (!codeBlockElement) {
      throw new Error('should be called with codeBlockElement');
    }

    this._load(codeBlockElement);
  }
  /**
   * hide popup
   * @override
   */
  ;

  _proto.hide = function hide() {
    this.setFitToWindow(false);

    if (this._codeBlockEditor) {
      this._codeBlockEditor.clear();
    }

    if (this._codeBlockPreview) {
      this._codeBlockPreview.clear();
    }

    this._codeBlockElement = null;

    _LayerPopup.prototype.hide.call(this);
  };

  return PopupCodeBlockEditor;
}(layerpopup);

/* harmony default export */ var popupCodeBlockEditor = (popupCodeBlockEditor_PopupCodeBlockEditor);
// CONCATENATED MODULE: ./src/js/ui/defaultUI.js
function defaultUI_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @fileoverview default UI
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

















var CLASS_TOOLBAR = 'te-toolbar-section';
var CLASS_MARKDOWN_TAB = 'te-markdown-tab-section';
var CLASS_EDITOR = 'te-editor-section';
var CLASS_MODE_SWITCH = 'te-mode-switch-section';
var CONTAINER_TEMPLATE = ['<div class="tui-editor-defaultUI">', "<div class=\"" + CLASS_TOOLBAR + "\"><div class=\"" + CLASS_MARKDOWN_TAB + "\"></div></div>", "<div class=\"" + CLASS_EDITOR + "\"></div>", "<div class=\"" + CLASS_MODE_SWITCH + "\"></div>", '</div>'].join('');
/**
 * Class DefaultUI
 * @param {ToastUIEditor} editor - editor instance
 */

var defaultUI_DefaultUI = /*#__PURE__*/function () {
  /**
   * UI name
   * @type {string}
   */

  /**
   * DefaultToolbar wrapper element
   * @type {HTMLElement}
   */

  /**
   * DefaultToolbar instance
   * @type {DefaultToolbar}
   * @private
   */

  /**
   * @type {HTMLElement}
   * @private
   */

  /**
   * editor section element
   * @private
   * @type {HTMLElement}
   */

  /**
   * editor type ww/md
   * @private
   * @type {string}
   */

  /**
   * editor instance
   * @private
   * @type {ToastUIEditor}
   */

  /**
   * markdown tab section element
   * @private
   * @type {HTMLElement}
   */

  /**
   * markdown tab
   * @private
   * @type {Tab}
   */

  /**
   * mode switch instance
   * @private
   * @type {ModeSwitch}
   */

  /**
   * popup instances
   * @private
   * @type {Array}
   */
  function DefaultUI(editor) {
    defaultUI_defineProperty(this, "name", 'default');

    defaultUI_defineProperty(this, "el", void 0);

    defaultUI_defineProperty(this, "_toolbar", void 0);

    defaultUI_defineProperty(this, "_container", void 0);

    defaultUI_defineProperty(this, "_editorSection", void 0);

    defaultUI_defineProperty(this, "_initialEditType", void 0);

    defaultUI_defineProperty(this, "_editor", void 0);

    defaultUI_defineProperty(this, "_markdownTabSection", void 0);

    defaultUI_defineProperty(this, "_markdownTab", void 0);

    defaultUI_defineProperty(this, "_modeSwitch", void 0);

    defaultUI_defineProperty(this, "_popups", []);

    this._editor = editor;
    this._initialEditType = editor.options.initialEditType;

    this._init(editor.options);

    this._initEvent();
  }

  var _proto = DefaultUI.prototype;

  _proto._init = function _init(_ref) {
    var container = _ref.el,
        toolbarItems = _ref.toolbarItems,
        hideModeSwitch = _ref.hideModeSwitch;
    this.el = dom["a" /* default */].createElementWith(CONTAINER_TEMPLATE, container);
    this._container = container;
    this._editorSection = this.el.querySelector("." + CLASS_EDITOR);

    this._editorSection.appendChild(this._editor.layout.getEditorEl());

    this._initToolbar(this._editor.eventManager, toolbarItems);

    this._initModeSwitch(this._editor.eventManager, hideModeSwitch);

    this._initPopupAddLink();

    this._initPopupAddImage();

    this._initPopupAddTable();

    this._initPopupAddHeading();

    this._initPopupTableUtils();

    this._initPopupCodeBlockLanguages();

    this._initPopupCodeBlockEditor();

    this._initMarkdownTab();
  };

  _proto._initEvent = function _initEvent() {
    this._editor.eventManager.listen('hide', this.hide.bind(this));

    this._editor.eventManager.listen('show', this.show.bind(this));

    this._editor.eventManager.listen('changeMode', this._markdownTabControl.bind(this));

    this._editor.eventManager.listen('changePreviewStyle', this._markdownTabControl.bind(this));
  };

  _proto._initToolbar = function _initToolbar(eventManager, toolbarItems) {
    var toolbar = new defaultToolbar(eventManager, toolbarItems);
    this._toolbar = toolbar;
    this.el.querySelector("." + CLASS_TOOLBAR).appendChild(toolbar.el);
  };

  _proto._initModeSwitch = function _initModeSwitch(eventManager, hideModeSwitch) {
    var _this = this;

    var modeSwitchTabBar = this.el.querySelector("." + CLASS_MODE_SWITCH);
    var editType = this._initialEditType === 'markdown' ? ui_modeSwitch.TYPE.MARKDOWN : ui_modeSwitch.TYPE.WYSIWYG;
    var modeSwitch = new ui_modeSwitch(modeSwitchTabBar, editType, eventManager);
    this._modeSwitch = modeSwitch;

    if (hideModeSwitch) {
      modeSwitch.hide();
    }

    modeSwitch.on('modeSwitched', function (type) {
      return _this._editor.changeMode(type);
    });
  };

  _proto._initMarkdownTab = function _initMarkdownTab() {
    var editor = this._editor;
    this._markdownTab = new tab({
      initName: i18n.get('Write'),
      items: [i18n.get('Write'), i18n.get('Preview')],
      sections: [editor.layout.getMdEditorContainerEl(), editor.layout.getPreviewEl()]
    });
    this._markdownTabSection = this.el.querySelector("." + CLASS_MARKDOWN_TAB);

    this._markdownTabSection.appendChild(this._markdownTab.el);

    this._markdownTab.on('itemClick', function (itemText) {
      if (itemText === i18n.get('Preview')) {
        editor.eventManager.emit('previewNeedsRefresh');
        editor.eventManager.emit('changePreviewTabPreview');
        editor.eventManager.emit('closeAllPopup');
      } else {
        editor.getCodeMirror().focus();
        editor.eventManager.emit('changePreviewTabWrite');
      }
    });
  };

  _proto._markdownTabControl = function _markdownTabControl() {
    if (this._editor.isMarkdownMode() && this._editor.getCurrentPreviewStyle() === 'tab') {
      css_default()(this._markdownTabSection, {
        display: 'block'
      });

      this._markdownTab.activate(i18n.get('Write'));
    } else {
      css_default()(this._markdownTabSection, {
        display: 'none'
      });
    }
  };

  _proto._initPopupAddLink = function _initPopupAddLink() {
    this._popups.push(new popupAddLink({
      target: this.el,
      editor: this._editor
    }));
  };

  _proto._initPopupAddImage = function _initPopupAddImage() {
    this._popups.push(new popupAddImage({
      target: this.el,
      eventManager: this._editor.eventManager
    }));
  };

  _proto._initPopupAddTable = function _initPopupAddTable() {
    this._popups.push(new popupAddTable({
      target: this._toolbar.el,
      eventManager: this._editor.eventManager,
      button: this.el.querySelector('button.tui-table'),
      css: {
        position: 'absolute'
      }
    }));
  };

  _proto._initPopupAddHeading = function _initPopupAddHeading() {
    this._popups.push(new popupAddHeading({
      target: this._toolbar.el,
      eventManager: this._editor.eventManager,
      button: this.el.querySelector('button.tui-heading'),
      css: {
        position: 'absolute'
      }
    }));
  };

  _proto._initPopupTableUtils = function _initPopupTableUtils() {
    var _this2 = this;

    this._editor.eventManager.listen('contextmenu', function (ev) {
      if (dom["a" /* default */].parents(ev.data.target, '[contenteditable=true] table').length > 0) {
        ev.data.preventDefault();

        _this2._editor.eventManager.emit('openPopupTableUtils', ev.data);
      }
    });

    this._popups.push(new popupTableUtils({
      target: this.el,
      eventManager: this._editor.eventManager
    }));
  };

  _proto._initPopupCodeBlockLanguages = function _initPopupCodeBlockLanguages() {
    var editor = this._editor;

    this._popups.push(new popupCodeBlockLanguages({
      target: this.el,
      eventManager: editor.eventManager,
      languages: editor.codeBlockLanguages
    }));
  };

  _proto._initPopupCodeBlockEditor = function _initPopupCodeBlockEditor() {
    this._popups.push(new popupCodeBlockEditor({
      target: this.el,
      eventManager: this._editor.eventManager,
      convertor: this._editor.convertor,
      languages: this._editor.codeBlockLanguages
    }));
  }
  /**
   * get toolbar instance
   * @returns {Toolbar} - toolbar instance
   */
  ;

  _proto.getToolbar = function getToolbar() {
    return this._toolbar;
  }
  /**
   * set toolbar instance
   * @param {Toolbar} toolbar - toolbar
   */
  ;

  _proto.setToolbar = function setToolbar(toolbar) {
    this._toolbar.destroy();

    this._toolbar = toolbar;
  }
  /**
   * get mode switch instance
   * @returns {ModeSwitch} - mode switch instance
   */
  ;

  _proto.getModeSwitch = function getModeSwitch() {
    return this._modeSwitch;
  }
  /**
   * get editor section height
   * @returns {Number} - height of editor section
   */
  ;

  _proto.getEditorSectionHeight = function getEditorSectionHeight() {
    var clientRect = this._editorSection.getBoundingClientRect();

    return clientRect.bottom - clientRect.top;
  }
  /**
   * get editor height
   * @returns {Number} - height of editor
   */
  ;

  _proto.getEditorHeight = function getEditorHeight() {
    var clientRect = this._container.getBoundingClientRect();

    return clientRect.bottom - clientRect.top;
  }
  /**
   * get Table Popup
   * @returns {PopupTableUtils} - PopupTableUtils
   */
  ;

  _proto.getPopupTableUtils = function getPopupTableUtils() {
    var tablePopup;

    this._popups.forEach(function (popup) {
      if (popup instanceof popupTableUtils) {
        tablePopup = popup;
      }
    });

    return tablePopup;
  }
  /**
   * hide
   */
  ;

  _proto.hide = function hide() {
    addClass_default()(this.el, 'te-hide');
  }
  /**
   * show
   */
  ;

  _proto.show = function show() {
    removeClass_default()(this.el, 'te-hide');
  }
  /**
   * remove
   */
  ;

  _proto.remove = function remove() {
    dom["a" /* default */].remove(this.el);

    this._markdownTab.remove();

    this._modeSwitch.remove();

    this._toolbar.destroy();

    this._popups.forEach(function (popup) {
      return popup.remove();
    });

    this._popups = [];
    tooltip.hide();
  }
  /**
   * creates popup
   * @param {LayerPopupOption} options - layerPopup options
   * @returns {LayerPopup} - crated layerPopup
   */
  ;

  _proto.createPopup = function createPopup(options) {
    return new layerpopup(options);
  };

  return DefaultUI;
}();

/* harmony default export */ var defaultUI = (defaultUI_DefaultUI);
// EXTERNAL MODULE: ./src/js/codeBlockManager.js
var codeBlockManager = __webpack_require__(30);

// EXTERNAL MODULE: /Users/nhnent/Documents/tui.editor_legacy/libs/to-mark/dist/to-mark.js
var to_mark = __webpack_require__(32);
var to_mark_default = /*#__PURE__*/__webpack_require__.n(to_mark);

// CONCATENATED MODULE: ./src/js/toMarkRenderer.js


/**
 * Check if given node is valid delimiter run.
 * According to common-mark spec, following examples are not valid delimiter runs.
 * 1. opening (*|**) preceded by an alphanumeric and followed by a punctuation.
 *    (ex: a**~~c~~b**)
 * 2. closing (*|**) preceded by a punctuation and followed by an alphanumeric.
 *    (ex: **b~~c~~**a)
 * @see {@link https://spec.commonmark.org/0.29/#delimiter-run}
 * @see {@link https://github.com/commonmark/commonmark-spec/issues/611#issuecomment-533578503}
 */

function isValidDelimiterRun(node) {
  var isElemNode = dom["a" /* default */].isElemNode,
      isTextNode = dom["a" /* default */].isTextNode;
  var isInvalidOpener = isTextNode(node.previousSibling) && isElemNode(node.firstChild);
  var isInvalidCloser = isTextNode(node.nextSibling) && isElemNode(node.lastChild);
  return !isInvalidOpener && !isInvalidCloser;
}

function convertEmphasis(node, subContent, delimiter) {
  var FIND_BEFORE_AND_AFTER_SPACES_RX = /^(\s*)((?:.|\n)*\S)(\s*)$/m;

  var _subContent$match = subContent.match(FIND_BEFORE_AND_AFTER_SPACES_RX),
      beforeSpaces = _subContent$match[1],
      trimmedContent = _subContent$match[2],
      afterSpaces = _subContent$match[3];

  var convertedContent;

  if (isValidDelimiterRun(node)) {
    convertedContent = "" + delimiter + trimmedContent + delimiter;
  } else {
    var tagName = node.nodeName.toLowerCase();
    convertedContent = "<" + tagName + ">" + trimmedContent + "</" + tagName + ">";
  }

  return "" + beforeSpaces + convertedContent + afterSpaces;
}

/* harmony default export */ var toMarkRenderer = (to_mark_default.a.Renderer.factory(to_mark_default.a.gfmRenderer, {
  'EM, I': function EMI(node, subContent) {
    if (this.isEmptyText(subContent)) {
      return '';
    }

    return convertEmphasis(node, subContent, '*');
  },
  'STRONG, B': function STRONGB(node, subContent) {
    if (this.isEmptyText(subContent)) {
      return '';
    }

    return convertEmphasis(node, subContent, '**');
  },
  'DEL, S': function DELS(node, subContent) {
    if (this.isEmptyText(subContent)) {
      return '';
    }

    return convertEmphasis(node, subContent, '~~');
  }
}));
// EXTERNAL MODULE: ./src/js/pluginHelper.js
var pluginHelper = __webpack_require__(31);

// CONCATENATED MODULE: ./src/js/markdownCommands/emphasisCommon.js
/**
 * @fileoverview This file is common logic for italic, bold, strike makrdown commands.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * range expand according to expendSize
 * If can not expand, return null
 * @param {range} range - range
 * @param {number} expendSize - expendSize
 * @returns {object} expanded range or null
 * @ignore
 */
var getExpandedRange = function getExpandedRange(range, expendSize) {
  var start = range.start,
      end = range.end;
  var expendRange;

  if (start.ch >= expendSize) {
    var from = {
      line: start.line,
      ch: start.ch - expendSize
    };
    var to = {
      line: end.line,
      ch: end.ch + expendSize
    };
    expendRange = {
      from: from,
      to: to
    };
  }

  return expendRange;
};
/**
 * remove symbol in the front and back of text
 * @param {string} text - text
 * @param {string} symbol - text
 * @returns {string}
 * @ignore
 */


var removeSyntax = function removeSyntax(text, symbol) {
  var symbolLength = symbol.length;
  return text.substr(symbolLength, text.length - symbolLength * 2);
};
/**
 * append symbol in the front and back of text
 * @param {string} text - text
 * @param {string} symbol - text
 * @returns {string}
 * @ignore
 */

var appendSyntax = function appendSyntax(text, symbol) {
  return "" + symbol + text + symbol;
};
/**
 * check expanded text and replace text using replacer
 * @param {CodeMirror.doc} doc - doc of codemirror
 * @param {range} range - origin range
 * @param {number} expandSize - expandSize
 * @param {function} checker - sytax check function
 * @param {function} replacer - text replace function
 * @returns {boolean} - if replace text, return true.
 * @ignore
 */

var expandReplace = function expandReplace(doc, range, expandSize, checker, replacer) {
  var expendRange = getExpandedRange(range, expandSize);
  var result = false;

  if (expendRange) {
    var from = expendRange.from,
        to = expendRange.to;
    var expendRangeText = doc.getRange(from, to);

    if (checker(expendRangeText)) {
      doc.setSelection(from, to);
      doc.replaceSelection(replacer(expendRangeText), 'around');
      result = true;
    }
  }

  return result;
};
/**
 * check text and replace text using replacer
 * @param {CodeMirror.doc} doc - doc of codemirror
 * @param {string} text - text
 * @param {function} checker - sytax check function
 * @param {function} replacer - text replace function
 * @returns {boolean} - if replace text, return true.
 * @ignore
 */

var replace = function replace(doc, text, checker, replacer) {
  var result = false;

  if (checker(text)) {
    doc.replaceSelection(replacer(text), 'around');
    result = true;
  }

  return result;
};
var changeSyntax = function changeSyntax(doc, range, symbol, syntaxRegex, contentRegex) {
  var _doc$getCursor = doc.getCursor(),
      line = _doc$getCursor.line,
      ch = _doc$getCursor.ch;

  var selectionStr = doc.getSelection();
  var symbolLength = symbol.length;

  var isSyntax = function isSyntax(t) {
    return syntaxRegex.test(t);
  }; // 1. expand text and check syntax => remove syntax
  // 2. check text is syntax => remove syntax
  // 3. If text does not match syntax, remove syntax inside text and then append syntax


  if (!(expandReplace(doc, range, symbolLength, isSyntax, function (t) {
    return removeSyntax(t, symbol);
  }) || replace(doc, selectionStr, isSyntax, function (t) {
    return removeSyntax(t, symbol);
  }))) {
    var removeSyntaxInsideText = selectionStr.replace(contentRegex, '$1');
    doc.replaceSelection(appendSyntax(removeSyntaxInsideText, symbol), 'around');
  }

  var afterSelectStr = doc.getSelection();
  var size = ch;

  if (!selectionStr) {
    // If text was not selected, after replace text, move cursor
    // For example **|** => | (move cusor -symbolLenth)
    if (isSyntax(afterSelectStr)) {
      size += symbolLength;
    } else {
      size -= symbolLength;
    }

    doc.setCursor(line, size);
  }
};
// CONCATENATED MODULE: ./src/js/markdownCommands/bold.js
/**
 * @fileoverview Implements Bold markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


var boldRangeRegex = /^(\*{2}|_{2}).*\1$/;
var boldContentRegex = /[*_]{2,}([^*_]*)[*_]{2,}/g;
var boldSymbol = '**';
/**
 * Bold
 * Add bold markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Bold
 * @ignore
 */

var Bold = commandManager["a" /* default */].command('markdown',
/** @lends Bold */
{
  name: 'Bold',
  keyMap: ['CTRL+B', 'META+B'],

  /**
   * Command Handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var originRange = mde.getRange();
    changeSyntax(doc, originRange, boldSymbol, boldRangeRegex, boldContentRegex);
    cm.focus();
  }
});
/* harmony default export */ var bold = (Bold);
// CONCATENATED MODULE: ./src/js/markdownCommands/italic.js
/**
 * @fileoverview Implements Italic markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


var boldItalicRangeRegex = /^(\*{3}|_{3}).*\1$/;
var italic_boldRangeRegex = /^(\*{2}|_{2}).*\1$/;
var italicRangeRegex = /^(\*|_).*\1$/;
var italicContentRegex = /([^*_])[*_]([^*_]+)[*_]([^*_])/g;

var isBoldItalic = function isBoldItalic(t) {
  return boldItalicRangeRegex.test(t);
};

var isBold = function isBold(t) {
  return italic_boldRangeRegex.test(t);
};

var isItalic = function isItalic(t) {
  return italicRangeRegex.test(t);
};

var italicSymbol = '*';
var italic_boldSymbol = '**';
var boldItalicSymbol = '***';
var italicLength = italicSymbol.length;
var boldLength = italic_boldSymbol.length;
var boldItalicLength = boldItalicSymbol.length;
/**
 * remove italic syntax in the middle of given text
 * @param {string} text - text selected
 * @returns {string} - text eliminated all italic in the middle of it's content
 * @ignore
 */

var removeItalicInsideText = function removeItalicInsideText(text) {
  return text ? text.replace(italicContentRegex, '$1$2$3') : '';
};

var italic_replaceText = function replaceText(doc, text, range) {
  // Check 3 cases when both text and expand text
  // case 1 : bold & italic (when expand 3 both front and end) => remove italic
  // case 2 : bold (when expand 2 both front and end) => append
  // case 3 : italic (expand 1 both front and end) => remove
  var expandReplaceBind = expandReplace.bind(this, doc, range);
  return expandReplaceBind(boldItalicLength, isBoldItalic, function (t) {
    return removeSyntax(t, italicSymbol);
  }) || expandReplaceBind(boldLength, isBold, function (t) {
    return appendSyntax(removeItalicInsideText(t), italicSymbol);
  }) || expandReplaceBind(italicLength, isItalic, function (t) {
    return removeSyntax(t, italicSymbol);
  }) || replace(doc, text, isBoldItalic, function (t) {
    return removeSyntax(t, italicSymbol);
  }) || replace(doc, text, isBold, function (t) {
    return appendSyntax(removeItalicInsideText(t), italicSymbol);
  }) || replace(doc, text, isItalic, function (t) {
    return removeSyntax(t, italicSymbol);
  });
};

var italic_replaceEmptyText = function replaceEmptyText(doc, range) {
  // Check 3 cases when expand text
  // case 1 : bold & italic => remove italic
  // case 2 : bold => append
  // case 3 : italic => remove
  // if there is no match, make italic
  return expandReplace(doc, range, boldItalicLength, isBoldItalic, function (t) {
    return removeSyntax(t, italicSymbol);
  }) || expandReplace(doc, range, boldLength, isBold, function (t) {
    return appendSyntax(t, italicSymbol);
  }) || expandReplace(doc, range, italicLength, isItalic, function () {
    return '';
  }) || doc.replaceSelection("" + italicSymbol + italicSymbol, 'around');
};
/**
 * Italic
 * Add italic markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Italic
 * @ignore
 */


var Italic = commandManager["a" /* default */].command('markdown',
/** @lends Italic */
{
  name: 'Italic',
  keyMap: ['CTRL+I', 'META+I'],

  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();

    var _doc$getCursor = doc.getCursor(),
        line = _doc$getCursor.line,
        ch = _doc$getCursor.ch;

    var range = mde.getRange();
    var selectionStr = doc.getSelection();

    if (selectionStr) {
      // check selectionStr match bold & italic, bold, italic and then
      // if there is no match, append italic
      if (!italic_replaceText(doc, selectionStr, range)) {
        // Before append italic, remove italic inside text and then append italic
        // Example: One*Two*Three => *OneTwoThree*
        doc.replaceSelection(appendSyntax(removeItalicInsideText(selectionStr), italicSymbol), 'around');
      }
    } else {
      italic_replaceEmptyText(doc, range);
      var afterSelectStr = doc.getSelection();
      var size = ch; // If text was not selected, after replace text, move cursor

      if (isBoldItalic(afterSelectStr) || isItalic(afterSelectStr) && !isBold(afterSelectStr)) {
        // For example **|** => ***|*** (move cusor +symbolLenth)
        size += italicLength;
      } else {
        // For example *|* => | (move cusor -symbolLenth)
        size -= italicLength;
      }

      doc.setCursor(line, size);
    }

    cm.focus();
  }
});
/* harmony default export */ var italic = (Italic);
// CONCATENATED MODULE: ./src/js/markdownCommands/strike.js
/**
 * @fileoverview Implements StrikeThrough markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


var strikeRangeRegex = /^~~.*~~$/;
var strikeContentRegex = /~~([^~]*)~~/g;
var strikeSymbol = '~~';
/**
 * Strike
 * Add strike markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Strike
 * @ignore
 */

var Strike = commandManager["a" /* default */].command('markdown',
/** @lends Strike */
{
  name: 'Strike',
  keyMap: ['CTRL+S', 'META+S'],

  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var originRange = mde.getRange();
    changeSyntax(doc, originRange, strikeSymbol, strikeRangeRegex, strikeContentRegex);
    cm.focus();
  }
});
/* harmony default export */ var strike = (Strike);
// CONCATENATED MODULE: ./src/js/markdownCommands/blockquote.js
/**
 * @fileoverview Implements Blockquote markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

var BlockquoteRegex = /^> ?/;
/**
 * Blockquote
 * Add blockquote markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Blockquote
 * @ignore
 */

var Blockquote = commandManager["a" /* default */].command('markdown',
/** @lends Blockquote */
{
  name: 'Blockquote',
  keyMap: ['ALT+Q', 'ALT+Q'],

  /**
   * command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var range = mde.getCurrentRange();
    var from = {
      line: range.from.line,
      ch: 0
    };
    var to = {
      line: range.to.line,
      ch: doc.getLineHandle(range.to.line).text.length
    };
    var textToModify = doc.getRange(from, to);
    var textLinesToModify = textToModify.split('\n');

    var isNeedToRemove = this._haveBlockquote(textLinesToModify);

    var resultText;

    if (isNeedToRemove) {
      resultText = this._removeBlockquote(textLinesToModify);
    } else {
      resultText = this._addBlockquote(textLinesToModify);
    }

    doc.replaceRange(resultText.join('\n'), from, to);

    if (isNeedToRemove) {
      var length = textLinesToModify.length;

      if (this._isBlockquoteWithSpace(textLinesToModify[length - 1])) {
        range.to.ch -= 2;
      } else {
        range.to.ch -= 1;
      }
    } else {
      range.to.ch += 2;
    }

    doc.setCursor(range.to);
    cm.focus();
  },

  /**
   * check all text in textArr starts with '>'
   * @param {Array} textArr - text array
   * @returns {boolean} - true if all text in textArr starts with '>'
   * @private
   */
  _haveBlockquote: function _haveBlockquote(textArr) {
    for (var i = 0; i < textArr.length; i += 1) {
      if (!BlockquoteRegex.test(textArr[i])) {
        return false;
      }
    }

    return true;
  },

  /**
   * add '> ' to all text in textArr
   * @param {Array} textArr - text array
   * @returns {Array} - new text array added '> '
   * @private
   */
  _addBlockquote: function _addBlockquote(textArr) {
    return textArr.map(function (text) {
      return "> " + text;
    });
  },

  /**
   * remove '> ' or '>' to all text in textArr
   * @param {Array} textArr - text array
   * @returns {Array} - new text array removed '> ' or  '>'
   * @private
   */
  _removeBlockquote: function _removeBlockquote(textArr) {
    return textArr.map(function (text) {
      return text.replace(BlockquoteRegex, '');
    });
  },

  /**
   * check text start '> '
   * @param {string} text - text
   * @returns {boolean} - if text start '> ', true
   * @private
   */
  _isBlockquoteWithSpace: function _isBlockquoteWithSpace(text) {
    return /^> /.test(text);
  }
});
/* harmony default export */ var blockquote = (Blockquote);
// CONCATENATED MODULE: ./src/js/markdownCommands/heading.js
/**
 * @fileoverview Implements Heading markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


var heading_FIND_HEADING_RX = /^#+\s/g;
/**
 * Heading
 * Add heading markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Heading
 * @ignore
 */

var Heading = commandManager["a" /* default */].command('markdown',
/** @lends Heading */
{
  name: 'Heading',

  /**
   * Command Handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   * @param {number} size heading size
   */
  exec: function exec(mde, size) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var range = mde.getCurrentRange();
    var from = {
      line: range.from.line,
      ch: 0
    };
    var to = {
      line: range.to.line,
      ch: doc.getLineHandle(range.to.line).text.length
    };
    var lengthOfCurrentLineBefore = doc.getLine(to.line).length;
    var textToModify = doc.getRange(from, to);
    var textLinesToModify = textToModify.split('\n');
    toArray_default()(textLinesToModify).forEach(function (line, index) {
      textLinesToModify[index] = getHeadingMarkdown(line, size);
    });
    doc.replaceRange(textLinesToModify.join('\n'), from, to);
    range.to.ch += doc.getLine(to.line).length - lengthOfCurrentLineBefore;
    doc.setSelection(from, range.to);
    cm.focus();
  }
});
/**
 * Get heading markdown
 * @param {string} text Source test
 * @param {number} size size
 * @returns {string}
 */

function getHeadingMarkdown(text, size) {
  var foundedHeading = text.match(heading_FIND_HEADING_RX);
  var heading = '';

  do {
    heading += '#';
    size -= 1;
  } while (size > 0);

  if (foundedHeading) {
    var _text$split = text.split(foundedHeading[0]);

    text = _text$split[1];
  }

  return heading + " " + text;
}

/* harmony default export */ var markdownCommands_heading = (Heading);
// CONCATENATED MODULE: ./src/js/markdownCommands/paragraph.js
/**
 * @fileoverview Implements Paragraph markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


/**
 * Paragraph
 * Convert selected lines to paragraph
 * @extends Command
 * @module markdownCommands/Paragraph
 * @ignore
 */

var Paragraph = commandManager["a" /* default */].command('markdown',
/** @lends Paragraph */
{
  name: 'Paragraph',

  /**
   * Command Handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var range = mde.getCurrentRange();
    var from = {
      line: range.from.line,
      ch: 0
    };
    var to = {
      line: range.to.line,
      ch: doc.getLineHandle(range.to.line).text.length
    };
    var lengthOfCurrentLineBefore = doc.getLine(to.line).length;
    var textToModify = doc.getRange(from, to);
    var textLines = textToModify.split('\n');
    toArray_default()(textLines).forEach(function (line, index) {
      textLines[index] = getParagraphMarkdown(line);
    });
    doc.replaceRange(textLines.join('\n'), from, to);
    range.to.ch += doc.getLine(to.line).length - lengthOfCurrentLineBefore;
    doc.setSelection(from, to);
    cm.focus();
  }
});
/**
 * Get paragraph markdown lineText
 * @param {string} lineText line lineText
 * @returns {string}
 */

function getParagraphMarkdown(lineText) {
  var headingRx = /^(#{1,6}| *((?:\*|-|\d\.)(?: \[[ xX]])?)) /;
  return lineText.replace(headingRx, '');
}

/* harmony default export */ var paragraph = (Paragraph);
// CONCATENATED MODULE: ./src/js/markdownCommands/hr.js
/**
 * @fileoverview Implements HR markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * HR
 * Add HR markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/HR
 * @ignore
 */

var HR = commandManager["a" /* default */].command('markdown',
/** @lends HR */
{
  name: 'HR',
  keyMap: ['CTRL+L', 'META+L'],

  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var replaceText = '';
    var range = mde.getCurrentRange();
    var from = {
      line: range.from.line,
      ch: range.from.ch
    };
    var to = {
      line: range.to.line,
      ch: range.to.ch
    };

    if (range.collapsed) {
      replaceText = doc.getLine(from.line);
      from.ch = 0;
      to.ch = doc.getLineHandle(range.to.line).text.length;
    }

    if (doc.getLine(from.line).length) {
      replaceText += '\n\n* * *\n\n';
    } else {
      replaceText += '\n* * *\n';
    }

    doc.replaceRange(replaceText, from, to);
    cm.focus();
  }
});
/* harmony default export */ var markdownCommands_hr = (HR);
// CONCATENATED MODULE: ./src/js/markdownCommands/addLink.js
/**
 * @fileoverview Implements Addlink markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


var addLink_decodeURIGraceful = importManager.decodeURIGraceful,
    encodeMarkdownCharacters = importManager.encodeMarkdownCharacters;
var FIND_MARKDOWN_IMAGE_SYNTAX_RX = /!\[.*\]\(.*\)/g;
var FIND_ESCAPED_CHARS_RX = /\(|\)|\[|\]|<|>/g;

function escapeLinkTextExceptImageSyntax(linkText) {
  var imageSyntaxRanges = [];
  var result = FIND_MARKDOWN_IMAGE_SYNTAX_RX.exec(linkText);

  while (result) {
    var _result = result,
        index = _result.index;
    imageSyntaxRanges.push([index, index + result[0].length]);
    result = FIND_MARKDOWN_IMAGE_SYNTAX_RX.exec(linkText);
  }

  return linkText.replace(FIND_ESCAPED_CHARS_RX, function (matched, offset) {
    var isDelimiter = imageSyntaxRanges.some(function (range) {
      return offset > range[0] && offset < range[1];
    });
    return isDelimiter ? matched : "\\" + matched;
  });
}
/**
 * AddLink
 * Add link markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/AddLink
 * @ignore
 */


var AddLink = commandManager["a" /* default */].command('markdown',
/** @lends AddLink */
{
  name: 'AddLink',

  /**
   * command handler for AddLink
   * @param {MarkdownEditor} mde - MarkdownEditor instance
   * @param {object} data - data for image
   */
  exec: function exec(mde, data) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var range = mde.getCurrentRange();
    var from = {
      line: range.from.line,
      ch: range.from.ch
    };
    var to = {
      line: range.to.line,
      ch: range.to.ch
    };
    var linkText = data.linkText,
        url = data.url;
    linkText = addLink_decodeURIGraceful(linkText);
    linkText = escapeLinkTextExceptImageSyntax(linkText);
    url = encodeMarkdownCharacters(url);
    var replaceText = "[" + linkText + "](" + url + ")";
    doc.replaceRange(replaceText, from, to);
    cm.focus();
  }
});
/* harmony default export */ var addLink = (AddLink);
// CONCATENATED MODULE: ./src/js/markdownCommands/addImage.js
/**
 * @fileoverview Implments AddImage markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


var addImage_decodeURIGraceful = importManager.decodeURIGraceful,
    addImage_encodeMarkdownCharacters = importManager.encodeMarkdownCharacters,
    escapeMarkdownCharacters = importManager.escapeMarkdownCharacters;
/**
 * AddImage
 * Add Image markdown syntax to markdown Editor
 * @extends Command
 * @module markdownCommands/AddImage
 * @ignore
 */

var AddImage = commandManager["a" /* default */].command('markdown',
/** @lends AddImage */
{
  name: 'AddImage',

  /**
   * Command Handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   * @param {object} data data for image
   */
  exec: function exec(mde, data) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var range = mde.getCurrentRange();
    var from = {
      line: range.from.line,
      ch: range.from.ch
    };
    var to = {
      line: range.to.line,
      ch: range.to.ch
    };
    var altText = data.altText,
        imageUrl = data.imageUrl;
    altText = addImage_decodeURIGraceful(altText);
    altText = escapeMarkdownCharacters(altText);
    imageUrl = addImage_encodeMarkdownCharacters(imageUrl);
    var replaceText = "![" + altText + "](" + imageUrl + ")";
    doc.replaceRange(replaceText, from, to, '+addImage');
    cm.focus();
  }
});
/* harmony default export */ var addImage = (AddImage);
// CONCATENATED MODULE: ./src/js/markdownCommands/ul.js
/**
 * @fileoverview Implements UL markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * UL
 * Add unordered list markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/UL
 * @ignore
 */

var UL = commandManager["a" /* default */].command('markdown',
/** @lends UL */
{
  name: 'UL',
  keyMap: ['CTRL+U', 'META+U'],

  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var range = mde.getCurrentRange();
    var listManager = mde.componentManager.getManager('list');
    listManager.changeSyntax(range, 'ul');
  }
});
/* harmony default export */ var markdownCommands_ul = (UL);
// CONCATENATED MODULE: ./src/js/markdownCommands/ol.js
/**
 * @fileoverview Implements OL markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * OL
 * Add ordered list markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/OL
 * @ignore
 */

var OL = commandManager["a" /* default */].command('markdown',
/** @lends OL */
{
  name: 'OL',
  keyMap: ['CTRL+O', 'META+O'],

  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var range = mde.getCurrentRange();
    var listManager = mde.componentManager.getManager('list');
    listManager.changeSyntax(range, 'ol');
  }
});
/* harmony default export */ var ol = (OL);
// CONCATENATED MODULE: ./src/js/markdownCommands/indent.js
/**
 * @fileoverview Implements Indent markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Indent
 * Add Indent markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/inent
 * @ignore
 */

var Indent = commandManager["a" /* default */].command('markdown',
/** @lends Indent */
{
  name: 'Indent',

  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    cm.execCommand('indentOrderedList');
  }
});
/* harmony default export */ var markdownCommands_indent = (Indent);
// CONCATENATED MODULE: ./src/js/markdownCommands/outdent.js
/**
 * @fileoverview Implements Outdent markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Outdent
 * Add Outdent markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/outdent
 * @ignore
 */

var Outdent = commandManager["a" /* default */].command('markdown',
/** @lends Outdent */
{
  name: 'Outdent',

  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    cm.execCommand('indentLessOrderedList');
  }
});
/* harmony default export */ var outdent = (Outdent);
// CONCATENATED MODULE: ./src/js/markdownCommands/table.js
/**
 * @fileoverview Implements Table markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Table
 * Add table markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Table
 * @ignore
 */

var Table = commandManager["a" /* default */].command('markdown',
/** @lends Table */
{
  name: 'Table',

  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   * @param {number} col column count
   * @param {number} row row count
   * @param {Array} data initial table data
   */
  exec: function exec(mde, col, row, data) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var table = '\n';

    if (cm.getCursor().ch > 0) {
      table += '\n';
    }

    table += makeHeader(col, data);
    table += makeBody(col, row - 1, data);
    doc.replaceSelection(table);

    if (!data) {
      cm.setCursor(cm.getCursor().line - row, 2);
    }

    mde.focus();
  }
});
/**
 * makeHeader
 * make table header markdown string
 * @param {number} col Column count
 * @param {array} data Cell's text content
 * @returns {string} markdown string
 */

function makeHeader(col, data) {
  var header = '|';
  var border = '|';
  var index = 0;

  while (col) {
    if (data) {
      header += " " + data[index] + " |";
      index += 1;
    } else {
      header += '  |';
    }

    border += ' --- |';
    col -= 1;
  }

  return header + "\n" + border + "\n";
}
/**
 * makeBody
 * make table body markdown string
 * @param {number} col column count
 * @param {number} row row count
 * @param {Array} data initial table data
 * @returns {string} html string
 */


function makeBody(col, row, data) {
  var body = '';
  var index = col;

  for (var irow = 0; irow < row; irow += 1) {
    body += '|';

    for (var icol = 0; icol < col; icol += 1) {
      if (data) {
        body += " " + data[index] + " |";
        index += 1;
      } else {
        body += '  |';
      }
    }

    body += '\n';
  }

  body = body.replace(/\n$/g, '');
  return body;
}

/* harmony default export */ var markdownCommands_table = (Table);
// CONCATENATED MODULE: ./src/js/markdownCommands/task.js
/**
 * @fileoverview Implements Task markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Task
 * @extends Command
 * @module markdownCommands/Task
 * @ignore
 */

var Task = commandManager["a" /* default */].command('markdown',
/** @lends Task */
{
  name: 'Task',
  keyMap: ['ALT+T', 'ALT+T'],

  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var range = mde.getCurrentRange();
    var listManager = mde.componentManager.getManager('list');
    listManager.changeSyntax(range, 'task');
  }
});
/* harmony default export */ var markdownCommands_task = (Task);
// CONCATENATED MODULE: ./src/js/markdownCommands/code.js
/**
 * @fileoverview Implements Code markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

var codeRangeRegex = /^`([^`]+)`$/;
var codeContentRegex = /`([^`]+)`/g;
/**
 * Code
 * Add code markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Code
 * @ignore
 */

var Code = commandManager["a" /* default */].command('markdown',
/** @lends Code */
{
  name: 'Code',
  keyMap: ['SHIFT+CTRL+C', 'SHIFT+META+C'],

  /**
   * Command Handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var selection = doc.getSelection();
    var cursor = cm.getCursor();
    var hasSyntax = this.hasStrikeSyntax(selection);
    var result;

    if (hasSyntax) {
      result = this.remove(selection);
      result = this._removeCodeSyntax(result);
    } else {
      result = this._removeCodeSyntax(selection);
      result = this.append(result);
    }

    doc.replaceSelection(result, 'around');

    if (!selection && !hasSyntax) {
      this.setCursorToCenter(doc, cursor, hasSyntax);
    }

    cm.focus();
  },

  /**
   * set cursor to center
   * @param {CodeMirror.doc} doc - codemirror document
   * @param {object} cursor - codemirror cursor
   * @param {boolean} isRemoved - whether it involes deletion
   */
  setCursorToCenter: function setCursorToCenter(doc, cursor, isRemoved) {
    var pos = isRemoved ? -1 : 1;
    doc.setCursor(cursor.line, cursor.ch + pos);
  },

  /**
   * has code syntax
   * @param {string} text Source text
   * @returns {boolean} true if the given text has a code syntax
   */
  hasStrikeSyntax: function hasStrikeSyntax(text) {
    return codeRangeRegex.test(text);
  },

  /**
   * apply Code
   * @param {string} text - selected text
   * @returns {string} - text after code syntax applied
   */
  append: function append(text) {
    return "`" + text + "`";
  },

  /**
   * remove Code
   * @param {string} text - selected text
   * @returns {string} - text after code syntax removed
   */
  remove: function remove(text) {
    return text.substr(1, text.length - 2);
  },

  /**
   * remove bold syntax in the middle of given text
   * @param {string} text - text selected
   * @returns {string} - text eliminated all code in the middle of it's content
   * @private
   */
  _removeCodeSyntax: function _removeCodeSyntax(text) {
    return text ? text.replace(codeContentRegex, '$1') : '';
  }
});
/* harmony default export */ var markdownCommands_code = (Code);
// CONCATENATED MODULE: ./src/js/markdownCommands/codeBlock.js
/**
 * @fileoverview Implements CodeBlock markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * CodeBlock
 * Add CodeBlock markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/CodeBlock
 * @ignore
 */

var CodeBlock = commandManager["a" /* default */].command('markdown',
/** @lends CodeBlock */
{
  name: 'CodeBlock',
  keyMap: ['SHIFT+CTRL+P', 'SHIFT+META+P'],

  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec: function exec(mde) {
    var cm = mde.getEditor();
    var doc = cm.getDoc();
    var range = mde.getCurrentRange();
    var replaceText = ['```', doc.getSelection(), '```'];
    var cursorOffset = 1; // insert a line break to the front if the selection starts in the middle of a text

    if (range.from.ch !== 0) {
      replaceText.unshift('');
      cursorOffset += 1;
    } // insert a line break to the end if the selection has trailing text


    if (range.to.ch !== doc.getLine(range.to.line).length) {
      replaceText.push('');
    }

    doc.replaceSelection(replaceText.join('\n'));
    cm.setCursor(range.from.line + cursorOffset, 0);
    cm.focus();
  }
});
/* harmony default export */ var markdownCommands_codeBlock = (CodeBlock);
// CONCATENATED MODULE: ./src/js/markdownCommands/changeTaskMarker.js
/**
 * @fileoverview Implements ChangeTaskMarker markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


var TASK_MARKER_RX = /^\[(\s*)(x?)(\s*)\](?:\s+)/i;
/**
 * Add ChangeTaskMarker command
 * @extends Command
 * @module markdownCommands/ToggleTaskMarker
 * @ignore
 */

var ChangeTaskMarker = commandManager["a" /* default */].command('markdown',
/** @lends ChangeTaskMarker */
{
  name: 'ChangeTaskMarker',
  exec: function exec(mde) {
    var cm = mde.getEditor();

    var _cm$getCursor = cm.getCursor(),
        line = _cm$getCursor.line,
        ch = _cm$getCursor.ch;

    var mdCh = cm.getLine(line).length === ch ? ch : ch + 1;
    var mdNode = mde.getToastMark().findNodeAtPosition([line + 1, mdCh]);
    var paraNode = Object(markdown["b" /* findClosestNode */])(mdNode, function (node) {
      return node.type === 'paragraph' && node.parent && node.parent.type === 'item';
    });

    if (paraNode && paraNode.firstChild) {
      var _paraNode$firstChild = paraNode.firstChild,
          literal = _paraNode$firstChild.literal,
          sourcepos = _paraNode$firstChild.sourcepos;
      var _sourcepos$ = sourcepos[0],
          startLine = _sourcepos$[0],
          startCh = _sourcepos$[1];
      var matched = literal.match(TASK_MARKER_RX);

      if (matched) {
        var startSpaces = matched[1],
            stateChar = matched[2],
            lastSpaces = matched[3];
        var spaces = startSpaces.length + lastSpaces.length;
        var startPos = {
          line: startLine - 1,
          ch: startCh
        };

        if (stateChar) {
          cm.replaceRange(stateChar, startPos, Object(markdown["a" /* addChPos */])(startPos, spaces ? spaces + 1 : 0));
        } else if (!spaces) {
          cm.replaceRange(' ', startPos, startPos);
        }
      }
    }
  }
});
/* harmony default export */ var changeTaskMarker = (ChangeTaskMarker);
// CONCATENATED MODULE: ./src/js/markdownCommands/toggleTaskMarker.js
/**
 * @fileoverview Implements ToggleTaskMarker markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


/**
 * Add ToggleTaskMarker command
 * @extends Command
 * @module markdownCommands/ToggleTaskMarker
 * @ignore
 */

var ToggleTaskMarker = commandManager["a" /* default */].command('markdown',
/** @lends ToggleTaskMarker */
{
  name: 'ToggleTaskMarker',
  exec: function exec(mde) {
    var _this = this;

    var cm = mde.getEditor();
    var ranges = cm.listSelections();
    ranges.forEach(function (range) {
      var anchor = range.anchor,
          head = range.head;
      var startLine = Math.min(anchor.line, head.line);
      var endLine = Math.max(anchor.line, head.line);
      var mdNode;

      for (var index = startLine, len = endLine; index <= len; index += 1) {
        mdNode = mde.getToastMark().findFirstNodeAtLine(index + 1);

        if (mdNode.type === 'list' || mdNode.type === 'item') {
          _this._changeTaskState(mdNode, index, cm);
        }
      }
    });
  },
  _changeTaskState: function _changeTaskState(list, line, cm) {
    var listData = list.listData,
        sourcepos = list.sourcepos;
    var task = listData.task,
        checked = listData.checked,
        padding = listData.padding;

    if (task) {
      var stateChar = checked ? ' ' : 'x';
      var _sourcepos$ = sourcepos[0],
          startCh = _sourcepos$[1];
      var startPos = {
        line: line,
        ch: startCh + padding
      };
      cm.replaceRange(stateChar, startPos, Object(markdown["a" /* addChPos */])(startPos, 1));
    }
  }
});
/* harmony default export */ var toggleTaskMarker = (ToggleTaskMarker);
// CONCATENATED MODULE: ./src/js/markdownCommands/moveNextCursorOrIndent.js
/**
 * @fileoverview Implements MoveNextCursorOrIndent markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


/**
 * Add MoveNextCursorOrIndent command
 * @extends Command
 * @module markdownCommands/MoveNextCursorOrIndent
 * @ignore
 */

var MoveNextCursorOrIndent = commandManager["a" /* default */].command('markdown',
/** @lends MoveNextCursorOrIndent */
{
  name: 'MoveNextCursorOrIndent',
  exec: function exec(mde) {
    var cm = mde.getEditor();

    var _cm$getCursor = cm.getCursor(),
        line = _cm$getCursor.line,
        ch = _cm$getCursor.ch;

    var mdCh = cm.getLine(line).length === ch ? ch : ch + 1;
    var mdNode = mde.getToastMark().findNodeAtPosition([line + 1, mdCh]);
    var cellNode = Object(markdown["b" /* findClosestNode */])(mdNode, function (node) {
      return Object(markdown["l" /* isTableCellNode */])(node);
    });

    if (cellNode) {
      this._moveCursorNextCell(cellNode, cm);
    } else {
      cm.execCommand('indentOrderedList');
    }
  },
  _moveCursorNextCell: function _moveCursorNextCell(cell, cm) {
    var next = cell.next,
        parent = cell.parent;
    var line = Object(markdown["f" /* getMdStartLine */])(cell);
    var ch = Object(markdown["c" /* getMdEndCh */])(cell) + 2;

    if (next) {
      ch = Object(markdown["c" /* getMdEndCh */])(next);
    } else {
      var nextRow = !parent.next && parent.parent.type === 'tableHead' ? parent.parent.next.firstChild : parent.next;

      if (nextRow) {
        line = line + 1;
        ch = Object(markdown["c" /* getMdEndCh */])(nextRow.firstChild);
      }
    }

    cm.setCursor({
      line: line - 1,
      ch: ch - 1
    });
  }
});
/* harmony default export */ var moveNextCursorOrIndent = (MoveNextCursorOrIndent);
// CONCATENATED MODULE: ./src/js/markdownCommands/movePrevCursorOrOutdent.js
/**
 * @fileoverview Implements MoveCursorOrOutdent markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


/**
 * Add MovePrevCursorOrOutdent command
 * @extends Command
 * @module markdownCommands/MovePrevCursorOrOutdent
 * @ignore
 */

var MovePrevCursorOrOutdent = commandManager["a" /* default */].command('markdown',
/** @lends MovePrevCursorOrOutdent */
{
  name: 'MovePrevCursorOrOutdent',
  exec: function exec(mde) {
    var cm = mde.getEditor();

    var _cm$getCursor = cm.getCursor(),
        line = _cm$getCursor.line,
        ch = _cm$getCursor.ch;

    var mdCh = cm.getLine(line).length === ch ? ch : ch + 1;
    var mdNode = mde.getToastMark().findNodeAtPosition([line + 1, mdCh]);
    var cellNode = Object(markdown["b" /* findClosestNode */])(mdNode, function (node) {
      return Object(markdown["l" /* isTableCellNode */])(node);
    });

    if (cellNode) {
      this._moveCursorPrevCell(cellNode, cm);
    } else {
      cm.execCommand('indentLessOrderedList');
    }
  },
  _moveCursorPrevCell: function _moveCursorPrevCell(cell, cm) {
    var prev = cell.prev,
        parent = cell.parent;
    var line = Object(markdown["f" /* getMdStartLine */])(cell);
    var ch = 1;

    if (prev) {
      ch = Object(markdown["c" /* getMdEndCh */])(prev);
    } else {
      var prevRow = !parent.prev && parent.parent.type === 'tableBody' ? parent.parent.prev.lastChild : parent.prev;

      if (prevRow) {
        line = line - 1;
        ch = Object(markdown["c" /* getMdEndCh */])(prevRow.lastChild);
      }
    }

    cm.setCursor({
      line: line - 1,
      ch: ch - 1
    });
  }
});
/* harmony default export */ var movePrevCursorOrOutdent = (MovePrevCursorOrOutdent);
// CONCATENATED MODULE: ./src/js/markdownCommands/addLine.js
/**
 * @fileoverview Implements AddLine markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



function createTableRow(row) {
  var columnLen = row.parent.parent.columns.length;
  var result = '|';

  for (var i = 0; i < columnLen; i += 1) {
    result += '  |';
  }

  return result;
}
/**
 * Add AddLine command
 * @extends Command
 * @module markdownCommands/AddLine
 * @ignore
 */


var AddLine = commandManager["a" /* default */].command('markdown',
/** @lends AddLine */
{
  name: 'AddLine',
  exec: function exec(mde) {
    var cm = mde.getEditor();

    var _cm$getCursor = cm.getCursor(),
        line = _cm$getCursor.line,
        ch = _cm$getCursor.ch;

    var mdCh = cm.getLine(line).length === ch ? ch : ch + 1;
    var mdNode = mde.getToastMark().findNodeAtPosition([line + 1, mdCh]);
    var cellNode = Object(markdown["b" /* findClosestNode */])(mdNode, function (node) {
      return Object(markdown["l" /* isTableCellNode */])(node) && (node.parent.type === 'tableDelimRow' || node.parent.parent.type === 'tableBody');
    });

    if (cellNode) {
      this._addTableRowByCell(cellNode, cm);
    } else {
      cm.execCommand('newlineAndIndentContinueMarkdownList');
    }
  },
  _addTableRowByCell: function _addTableRowByCell(cell, cm) {
    var line = Object(markdown["f" /* getMdStartLine */])(cell);
    var parent = cell.parent;
    var nextRow = parent.next;
    var currentLineText = cm.getLine(line - 1);
    var rowStr = createTableRow(parent);

    if (nextRow && nextRow.type === 'tableRow' || currentLineText !== rowStr) {
      cm.setCursor(line - 1, Object(markdown["c" /* getMdEndCh */])(parent));
      cm.replaceSelection("\n" + rowStr);
      cm.setCursor(line, 2);
    } else {
      cm.execCommand('deleteLine');
    }
  }
});
/* harmony default export */ var addLine = (AddLine);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/bold.js
/**
 * @fileoverview Implements bold WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


/**
 * Bold
 * Add bold to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Bold
 * @ignore
 */

var bold_Bold = commandManager["a" /* default */].command('wysiwyg',
/** @lends Bold */
{
  name: 'Bold',
  keyMap: ['CTRL+B', 'META+B'],

  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var tableSelectionManager = wwe.componentManager.getManager('tableSelection');
    wwe.focus();

    if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
      tableSelectionManager.styleToSelectedCells(styleBold);
      var range = sq.getSelection();
      range.collapse(true);
      sq.setSelection(range);
    } else {
      styleBold(sq);
      dom["a" /* default */].optimizeRange(sq.getSelection(), 'B');
    }
  }
});
/**
 * Style bold.
 * @param {object} sq - squire editor instance
 */

function styleBold(sq) {
  if (sq.hasFormat('b') || sq.hasFormat('strong')) {
    sq.changeFormat(null, {
      tag: 'b'
    });
  } else if (!sq.hasFormat('PRE')) {
    if (sq.hasFormat('code')) {
      sq.changeFormat(null, {
        tag: 'code'
      });
    }

    sq.bold();
  }
}

/* harmony default export */ var wysiwygCommands_bold = (bold_Bold);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/italic.js
/**
 * @fileoverview Implements italic WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


/**
 * Italic
 * Add Italic to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Italic
 * @ignore
 */

var italic_Italic = commandManager["a" /* default */].command('wysiwyg',
/** @lends Italic */
{
  name: 'Italic',
  keyMap: ['CTRL+I', 'META+I'],

  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var tableSelectionManager = wwe.componentManager.getManager('tableSelection');
    wwe.focus();

    if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
      tableSelectionManager.styleToSelectedCells(styleItalic);
      var range = sq.getSelection();
      range.collapse(true);
      sq.setSelection(range);
    } else {
      styleItalic(sq);
      dom["a" /* default */].optimizeRange(sq.getSelection(), 'I');
    }
  }
});
/**
 * Style italic.
 * @param {object} sq - squire editor instance
 */

function styleItalic(sq) {
  if (sq.hasFormat('i') || sq.hasFormat('em')) {
    sq.changeFormat(null, {
      tag: 'i'
    });
  } else if (!sq.hasFormat('PRE')) {
    if (sq.hasFormat('code')) {
      sq.changeFormat(null, {
        tag: 'code'
      });
    }

    sq.italic();
  }
}

/* harmony default export */ var wysiwygCommands_italic = (italic_Italic);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/strike.js
/**
 * @fileoverview Implements strike WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


/**
 * Strike
 * Add strike to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Strike
 * @ignore
 */

var strike_Strike = commandManager["a" /* default */].command('wysiwyg',
/** @lends Strike */
{
  name: 'Strike',
  keyMap: ['CTRL+S', 'META+S'],

  /**
   * command handler
   * @param {WysiwygEditor} wwe WysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var tableSelectionManager = wwe.componentManager.getManager('tableSelection');
    wwe.focus();

    if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
      tableSelectionManager.styleToSelectedCells(styleStrike);
      var range = sq.getSelection();
      range.collapse(true);
      sq.setSelection(range);
    } else {
      styleStrike(sq);
      dom["a" /* default */].optimizeRange(sq.getSelection(), 'S');
    }
  }
});
/**
 * Style strike.
 * @param {object} sq - squire editor instance
 */

function styleStrike(sq) {
  if (sq.hasFormat('S')) {
    sq.changeFormat(null, {
      tag: 'S'
    });
  } else if (!sq.hasFormat('PRE')) {
    if (sq.hasFormat('code')) {
      sq.changeFormat(null, {
        tag: 'code'
      });
    }

    sq.strikethrough();
  }
}

/* harmony default export */ var wysiwygCommands_strike = (strike_Strike);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/blockquote.js
/**
 * @fileoverview Implements block quote WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Blockquote
 * Add Blockquote to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Blockquote
 * @ignore
 */

var blockquote_Blockquote = commandManager["a" /* default */].command('wysiwyg',
/** @lends Blockquote */
{
  name: 'Blockquote',
  keyMap: ['ALT+Q', 'ALT+Q'],

  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    wwe.focus();

    if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
      if (sq.hasFormat('BLOCKQUOTE')) {
        sq.decreaseQuoteLevel();
      } else {
        sq.increaseQuoteLevel();
      }
    }
  }
});
/* harmony default export */ var wysiwygCommands_blockquote = (blockquote_Blockquote);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/addImage.js
/**
 * @fileoverview Implements AddImage wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


var wysiwygCommands_addImage_decodeURIGraceful = importManager.decodeURIGraceful,
    wysiwygCommands_addImage_encodeMarkdownCharacters = importManager.encodeMarkdownCharacters;
/**
 * AddImage
 * Add Image markdown syntax to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/AddImage
 * @ignore
 */

var addImage_AddImage = commandManager["a" /* default */].command('wysiwyg',
/** @lends AddImage */
{
  name: 'AddImage',

  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   * @param {object} data data for image
   */
  exec: function exec(wwe, data) {
    var sq = wwe.getEditor();
    var altText = data.altText,
        imageUrl = data.imageUrl;
    altText = wysiwygCommands_addImage_decodeURIGraceful(altText);
    imageUrl = wysiwygCommands_addImage_encodeMarkdownCharacters(imageUrl);
    wwe.focus();

    if (!sq.hasFormat('PRE')) {
      sq.insertImage(imageUrl, {
        alt: altText
      });
    }
  }
});
/* harmony default export */ var wysiwygCommands_addImage = (addImage_AddImage);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/addLink.js
/**
 * @fileoverview Implements AddLink wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */




var wysiwygCommands_addLink_decodeURIGraceful = importManager.decodeURIGraceful,
    addLink_encodeMarkdownCharacters = importManager.encodeMarkdownCharacters;
/**
 * Add link markdown syntax to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/AddLink
 * @ignore
 */

var addLink_AddLink = commandManager["a" /* default */].command('wysiwyg',
/** @lends AddLink */
{
  name: 'AddLink',

  /**
   * command handler
   * @param {WysiwygEditor} wwe - wysiwygEditor instance
   * @param {object} data - data for link
   */
  exec: function exec(wwe, data) {
    var sq = wwe.getEditor();
    var linkAttribute = wwe.getLinkAttribute();
    var url = data.url,
        linkText = data.linkText;
    var linkManager = wwe.componentManager.getManager('link');
    linkText = wysiwygCommands_addLink_decodeURIGraceful(linkText);
    url = addLink_encodeMarkdownCharacters(url);
    wwe.focus();

    if (!sq.hasFormat('PRE')) {
      sq.removeAllFormatting();
      var selectedText = sq.getSelectedText();

      var selectedImageOnly = this._isSelectedImageOnly(sq.getSelection());

      if (selectedText || selectedImageOnly) {
        sq.makeLink(url, linkAttribute);
      } else {
        var link = sq.createElement('A', extend_default()({
          href: url
        }, linkAttribute));
        link.textContent = linkText;
        sq.insertElement(link);
      }

      linkManager.addClassNameToImageLinksInSelection();
    }
  },
  _isSelectedImageOnly: function _isSelectedImageOnly(range) {
    if (!range.collapsed) {
      var startContainer = range.startContainer,
          endContainer = range.endContainer;

      if (startContainer && startContainer === endContainer) {
        return dom["a" /* default */].isElemNode(startContainer) && startContainer.firstChild.nodeName === 'IMG';
      }
    }

    return false;
  }
});
/* harmony default export */ var wysiwygCommands_addLink = (addLink_AddLink);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/hr.js
/**
 * @fileoverview Implements HR wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


/**
 * HR
 * Add horizontal line markdown syntax to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/HR
 * @ignore
 */

var hr_HR = commandManager["a" /* default */].command('wysiwyg',
/** @lends HR */
{
  name: 'HR',
  keyMap: ['CTRL+L', 'META+L'],

  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection();

    if (range.collapsed && !sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
      var hr = document.createElement('hr');
      var currentNode = dom["a" /* default */].getChildNodeByOffset(range.startContainer, range.startOffset);
      var nextBlockNode = dom["a" /* default */].getTopNextNodeUnder(currentNode, wwe.getBody()); // If nextBlockNode is div that has hr and has contenteditable as false,
      // nextBlockNode should be set as nextSibling that is normal block.

      if (nextBlockNode && !dom["a" /* default */].isTextNode(nextBlockNode)) {
        while (nextBlockNode && nextBlockNode.getAttribute('contenteditable') === 'false') {
          nextBlockNode = nextBlockNode.nextSibling;
        }
      }

      if (!nextBlockNode) {
        nextBlockNode = dom["a" /* default */].createEmptyLine();
        dom["a" /* default */].append(wwe.getBody(), nextBlockNode);
      }

      sq.modifyBlocks(function (frag) {
        frag.appendChild(hr);
        return frag;
      });
      var previousSibling = hr.previousSibling;

      if (previousSibling && dom["a" /* default */].isTextNode(previousSibling) && dom["a" /* default */].getTextLength(previousSibling) === 0) {
        hr.parentNode.removeChild(previousSibling);
      }

      hr.parentNode.replaceChild(dom["a" /* default */].createHorizontalRule(), hr);
      range.selectNodeContents(nextBlockNode);
      range.collapse(true);
      sq.setSelection(range);
      sq.saveUndoState(range);
    }

    wwe.focus();
  }
});
/* harmony default export */ var wysiwygCommands_hr = (hr_HR);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/heading.js
/**
 * @fileoverview Implements Heading wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Heading
 * Convert selected root level contents to heading with size wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/Heading
 * @ignore
 */

var heading_Heading = commandManager["a" /* default */].command('wysiwyg',
/** @lends Heading */
{
  name: 'Heading',

  /**
   * Command handler
   * @param {WysiwygEditor} wwe WYSIWYGEditor instance
   * @param {Number} size size
   */
  exec: function exec(wwe, size) {
    var sq = wwe.getEditor();
    var blockTagName = 'h1, h2, h3, h4, h5, h6, div';
    wwe.focus();

    if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
      sq.modifyBlocks(function (fragment) {
        var blocks = dom["a" /* default */].children(fragment, blockTagName);
        toArray_default()(blocks).forEach(function (block) {
          var headingHTML = "h" + size;

          if (dom["a" /* default */].getNodeName(block) === 'DIV') {
            dom["a" /* default */].wrap(block, headingHTML);
          } else {
            var wrapperHeading = document.createElement(headingHTML);
            dom["a" /* default */].insertBefore(wrapperHeading, block);
            wrapperHeading.innerHTML = block.innerHTML;
            dom["a" /* default */].remove(block);
          }
        });
        return fragment;
      });
    }
  }
});
/* harmony default export */ var wysiwygCommands_heading = (heading_Heading);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/paragraph.js
/**
 * @fileoverview Implements Paragraph wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Paragraph
 * Convert selected contents to paragraph only heading and list
 * @extends Command
 * @module wysiwygCommands/Paragraph
 * @ignore
 */

var paragraph_Paragraph = commandManager["a" /* default */].command('wysiwyg',
/** @lends Paragraph */
{
  name: 'Paragraph',

  /**
   * Command handler
   * @param {WysiwygEditor} wwe WYSIWYGEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    wwe.focus();

    if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
      sq.modifyBlocks(function (fragment) {
        var newFragment = document.createDocumentFragment();
        toArray_default()(fragment.childNodes).forEach(function (block) {
          if (block.nodeName.match(/h\d/i)) {
            appendChildrenTo(newFragment, block.children);
          } else if (block.nodeName.match(/ul|ol/i)) {
            dom["a" /* default */].findAll(block, 'li').forEach(function (listItem) {
              appendChildrenTo(newFragment, listItem.children);
            });
          } else {
            newFragment.appendChild(block);
          }
        });
        return newFragment;
      });
    }
  }
});
/**
 * Append children
 * @param {HTMLElement} parent - target to append
 * @param {Array.<HTMLElement>} children - appending children
 */

function appendChildrenTo(parent, children) {
  toArray_default()(children).forEach(function (child) {
    parent.appendChild(child.cloneNode(true));
  });
}

/* harmony default export */ var wysiwygCommands_paragraph = (paragraph_Paragraph);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/ul.js
/**
 * @fileoverview Implements ul WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * UL
 * Add UL to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/UL
 * @ignore
 */

var ul_UL = commandManager["a" /* default */].command('wysiwyg',
/** @lends UL */
{
  name: 'UL',
  keyMap: ['CTRL+U', 'META+U'],

  /**
   * Command Handler
   * @param {WysiwygEditor} wwe WYSIWYGEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection();
    var listManager = wwe.componentManager.getManager('list');
    var startContainer = range.startContainer,
        endContainer = range.endContainer,
        startOffset = range.startOffset,
        endOffset = range.endOffset;
    var newLIs = [];
    wwe.focus();
    sq.saveUndoState(range);

    if (listManager.isAvailableMakeListInTable()) {
      newLIs = listManager.createListInTable(range, 'UL');
    } else {
      var lines = listManager.getLinesOfSelection(startContainer, endContainer);

      for (var i = 0; i < lines.length; i += 1) {
        var newLI = this._changeFormatToUnorderedListIfNeed(wwe, lines[i]);

        if (newLI) {
          newLIs.push(newLI);
        }
      }
    }

    if (newLIs.length) {
      listManager.adjustRange(startContainer, endContainer, startOffset, endOffset, newLIs);
    }
  },

  /**
   * Change format to unordered list if need
   * @param {WysiwygEditor} wwe Wysiwyg editor instance
   * @param {HTMLElement} target Element target for change
   * @returns {HTMLElement} newly created list
   * @private
   */
  _changeFormatToUnorderedListIfNeed: function _changeFormatToUnorderedListIfNeed(wwe, target) {
    var sq = wwe.getEditor();
    var range = sq.getSelection();
    var taskManager = wwe.componentManager.getManager('task');
    var newLI;

    if (!sq.hasFormat('PRE')) {
      range.setStart(target, 0);
      range.collapse(true);
      sq.setSelection(range);

      if (sq.hasFormat('LI')) {
        wwe.saveSelection(range);
        taskManager.unformatTask(range.startContainer);
        sq.replaceParent(range.startContainer, 'ol', 'ul');
        wwe.restoreSavedSelection();
      } else {
        wwe.unwrapBlockTag();
        sq.makeUnorderedList();
      }

      newLI = sq.getSelection().startContainer;
    }

    return newLI;
  }
});
/* harmony default export */ var wysiwygCommands_ul = (ul_UL);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/ol.js
/**
 * @fileoverview Implements ol WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * OL
 * Add OL to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/OL
 * @ignore
 */

var ol_OL = commandManager["a" /* default */].command('wysiwyg',
/** @lends OL */
{
  name: 'OL',
  keyMap: ['CTRL+O', 'META+O'],

  /**
   * Command Handler
   * @param {WysiwygEditor} wwe WYSIWYGEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection();
    var listManager = wwe.componentManager.getManager('list');
    var startContainer = range.startContainer,
        startOffset = range.startOffset,
        endContainer = range.endContainer,
        endOffset = range.endOffset;
    var newLIs = [];
    wwe.focus();
    sq.saveUndoState(range);

    if (listManager.isAvailableMakeListInTable()) {
      newLIs = listManager.createListInTable(range, 'OL');
    } else {
      var lines = listManager.getLinesOfSelection(startContainer, endContainer);

      for (var i = 0; i < lines.length; i += 1) {
        var newLI = this._changeFormatToOrderedListIfNeed(wwe, lines[i]);

        if (newLI) {
          newLIs.push(newLI);
        }
      }
    }

    if (newLIs.length) {
      listManager.adjustRange(startContainer, endContainer, startOffset, endOffset, newLIs);
    }
  },

  /**
   * Change format to unordered list if need
   * @param {WysiwygEditor} wwe Wysiwyg editor instance
   * @param {HTMLElement} target Element target for change
   * @returns {HTMLElement} newly created list item
   * @private
   */
  _changeFormatToOrderedListIfNeed: function _changeFormatToOrderedListIfNeed(wwe, target) {
    var sq = wwe.getEditor();
    var range = sq.getSelection();
    var taskManager = wwe.componentManager.getManager('task');
    var newLI;

    if (!sq.hasFormat('PRE')) {
      range.setStart(target, 0);
      range.collapse(true);
      sq.setSelection(range);

      if (sq.hasFormat('LI')) {
        wwe.saveSelection(range);
        taskManager.unformatTask(range.startContainer);
        sq.replaceParent(range.startContainer, 'ul', 'ol');
        wwe.restoreSavedSelection();
      } else {
        wwe.unwrapBlockTag();
        sq.makeOrderedList();
      }

      newLI = sq.getSelection().startContainer;
    }

    return newLI;
  }
});
/* harmony default export */ var wysiwygCommands_ol = (ol_OL);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/table.js
/**
 * @fileoverview Implements table WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Table
 * Add table to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Table
 * @ignore
 */

var table_Table = commandManager["a" /* default */].command('wysiwyg',
/** @lends Table */
{
  name: 'Table',

  /**
   * Command Handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   * @param {number} col column count
   * @param {number} row row count
   * @param {Array} data initial table data
   */
  exec: function exec(wwe, col, row, data) {
    var sq = wwe.getEditor();
    var tableIDClassName = wwe.componentManager.getManager('table').getTableIDClassName();
    var tableHTMLString;

    if (!sq.getSelection().collapsed || sq.hasFormat('TABLE') || sq.hasFormat('PRE')) {
      wwe.focus();
      return;
    }

    tableHTMLString = "<table class=\"" + tableIDClassName + "\">";
    tableHTMLString += table_makeHeader(col, data);
    tableHTMLString += table_makeBody(col, row - 1, data);
    tableHTMLString += '</table>';
    sq.insertHTML(tableHTMLString);
    wwe.focus();

    if (!data) {
      focusToFirstTh(sq, wwe.getBody().querySelector("." + tableIDClassName));
    }
  }
});
/**
 * Focus to first th
 * @param {Squire} sq Squire instance
 * @param {HTMLElement} table wrapped table element
 */

function focusToFirstTh(sq, table) {
  var range = sq.getSelection();
  range.selectNodeContents(table.querySelector('th'));
  range.collapse(true);
  sq.setSelection(range);
}
/**
 * makeHeader
 * make table header html string
 * @param {number} col column count
 * @param {string} data cell data
 * @returns {string} html string
 */


function table_makeHeader(col, data) {
  var header = '<thead><tr>';
  var index = 0;

  while (col) {
    header += '<th>';

    if (data) {
      header += data[index];
      index += 1;
    }

    header += '</th>';
    col -= 1;
  }

  header += '</tr></thead>';
  return header;
}
/**
 * makeBody
 * make table body html string
 * @param {number} col column count
 * @param {number} row row count
 * @param {string} data cell data
 * @returns {string} html string
 */


function table_makeBody(col, row, data) {
  var body = '<tbody>';
  var index = col;

  for (var irow = 0; irow < row; irow += 1) {
    body += '<tr>';

    for (var icol = 0; icol < col; icol += 1) {
      body += '<td>';

      if (data) {
        body += data[index];
        index += 1;
      }

      body += '</td>';
    }

    body += '</tr>';
  }

  body += '</tbody>';
  return body;
}

/* harmony default export */ var wysiwygCommands_table = (table_Table);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/tableAddRow.js
/**
 * @fileoverview Implements table add row WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */




/**
 * AddRow
 * Add Row to selected table
 * @extends Command
 * @module wysiwygCommands/TableAddRow
 * @ignore
 */

var TableAddRow = commandManager["a" /* default */].command('wysiwyg',
/** @lends AddRow */
{
  name: 'AddRow',

  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection().cloneRange();
    var selectedRowLength = getSelectedRowsLength(wwe);
    var tr, newRow;
    wwe.focus();

    if (sq.hasFormat('TD')) {
      sq.saveUndoState(range);
      tr = dom["a" /* default */].closest(range.startContainer, 'tr');

      for (var i = 0; i < selectedRowLength; i += 1) {
        newRow = getNewRow(tr);
        dom["a" /* default */].insertAfter(newRow, tr);
      }

      focusToFirstTd(sq, newRow);
    } else if (sq.hasFormat('TH')) {
      sq.saveUndoState(range);
      tr = dom["a" /* default */].closest(range.startContainer, 'tr');

      var _domUtils$parents = dom["a" /* default */].parents(tr, 'thead'),
          thead = _domUtils$parents[0];

      var tbody = thead.nextSibling;

      if (matches_default()(tbody, 'tbody')) {
        var _domUtils$children = dom["a" /* default */].children(tbody, 'tr');

        tr = _domUtils$children[0];
      }

      for (var _i = 0; _i < selectedRowLength; _i += 1) {
        newRow = getNewRow(tr);
        dom["a" /* default */].insertBefore(newRow, tr);
      }

      focusToFirstTd(sq, newRow);
    }
  }
});
/**
 * get number of selected rows
 * @param {WysiwygEditor} wwe - wysiwygEditor instance
 * @returns {number} - number of selected rows
 * @ignore
 */

function getSelectedRowsLength(wwe) {
  var selectionMgr = wwe.componentManager.getManager('tableSelection');
  var selectedCells = selectionMgr.getSelectedCells();
  var length = 1;

  if (selectedCells.length > 1) {
    var first = selectedCells[0];
    var last = selectedCells[selectedCells.length - 1];
    var range = selectionMgr.getSelectionRangeFromTable(first, last);
    length = range.to.row - range.from.row + 1;
  }

  return length;
}
/**
 * Get new row of given row
 * @param {HTMLElement} tr - wrapped table row
 * @returns {HTMLElement} - new cloned element
 * @ignore
 */


function getNewRow(tr) {
  var cloned = tr.cloneNode(true);
  var htmlString = browser_default.a.msie ? '' : '<br />';
  dom["a" /* default */].findAll(cloned, 'td').forEach(function (td) {
    td.innerHTML = htmlString;
  });
  return cloned;
}
/**
 * Focus to first table cell
 * @param {Squire} sq - Squire instance
 * @param {HTMLElement} tr - wrapped table row
 * @ignore
 */


function focusToFirstTd(sq, tr) {
  var range = sq.getSelection();
  range.selectNodeContents(tr.querySelector('td'));
  range.collapse(true);
  sq.setSelection(range);
}

/* harmony default export */ var tableAddRow = (TableAddRow);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/tableAddCol.js
/**
 * @fileoverview Implements table add column WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */





/**
 * AddCol
 * Add col to selected table
 * @extends Command
 * @module wysiwygCommands/TableAddCol
 * @ignore
 */

var TableAddCol = commandManager["a" /* default */].command('wysiwyg',
/** @lends AddCol */
{
  name: 'AddCol',

  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection().cloneRange();
    var numberOfCols = getNumberOfCols(wwe);
    var cell;
    wwe.focus();

    if (sq.hasFormat('TR')) {
      sq.saveUndoState(range);
      cell = getCellByRange(range);
      addColToCellAfter(cell, numberOfCols);
      focusToNextCell(sq, cell);
    }
  }
});
/**
 * get number of selected cols
 * @param {WysiwygEditor} wwe - wysiwyg editor instance
 * @returns {number} - number of selected cols
 * @ignore
 */

function getNumberOfCols(wwe) {
  var selectionMgr = wwe.componentManager.getManager('tableSelection');
  var selectedCells = selectionMgr.getSelectedCells();
  var length = 1;

  if (selectedCells.length > 0) {
    var maxLength = selectedCells[0].parentNode.querySelectorAll('td, th').length;
    length = Math.min(maxLength, selectedCells.length);
  }

  return length;
}
/**
 * Get cell by range object
 * @param {Range} range - range
 * @returns {HTMLElement} - html element
 * @ignore
 */


function getCellByRange(range) {
  var cell = range.startContainer;

  if (dom["a" /* default */].getNodeName(cell) !== 'TD' && dom["a" /* default */].getNodeName(cell) !== 'TH') {
    cell = dom["a" /* default */].closest(cell, 'td, th');
  }

  return cell;
}
/**
 * Add column to after the current cell
 * @param {HTMLElement} cell - wrapped table cell
 * @param {number} [numberOfCols=1] - number of cols
 * @ignore
 */


function addColToCellAfter(cell, numberOfCols) {
  if (numberOfCols === void 0) {
    numberOfCols = 1;
  }

  var _domUtils$parents = dom["a" /* default */].parents(cell, 'table'),
      table = _domUtils$parents[0];

  if (table) {
    var index = inArray_default()(cell, toArray_default()(cell.parentNode.childNodes));
    var cellToAdd;
    dom["a" /* default */].findAll(table, 'tr').forEach(function (tr) {
      var isTBody = dom["a" /* default */].getNodeName(tr.parentNode) === 'TBODY';
      var isMSIE = browser_default.a.msie;
      var currentCell = tr.children[index];

      for (var i = 0; i < numberOfCols; i += 1) {
        if (isTBody) {
          cellToAdd = document.createElement('td');
        } else {
          cellToAdd = document.createElement('th');
        }

        if (!isMSIE) {
          cellToAdd.appendChild(document.createElement('br'));
        }

        dom["a" /* default */].insertAfter(cellToAdd, currentCell);
      }
    });
  }
}
/**
 * Focus to next cell
 * @param {Squire} sq - Squire instance
 * @param {HTMLElement} cell - wrapped table cell
 * @ignore
 */


function focusToNextCell(sq, cell) {
  var range = sq.getSelection();
  range.selectNodeContents(cell.nextSibling);
  range.collapse(true);
  sq.setSelection(range);
}

/* harmony default export */ var tableAddCol = (TableAddCol);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/tableRemoveRow.js
/**
 * @fileoverview Implements table remove row WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


/**
 * RemoveRow
 * remove Row to selected table
 * @extends Command
 * @module wysiwygCommands/TableRemoveRow
 * @ignore
 */

var TableRemoveRow = commandManager["a" /* default */].command('wysiwyg',
/** @lends RemoveRow */
{
  name: 'RemoveRow',

  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection().cloneRange();

    var _domUtils$parents = dom["a" /* default */].parents(range.startContainer, 'table'),
        table = _domUtils$parents[0];

    var selectionMgr = wwe.componentManager.getManager('tableSelection');
    var tableMgr = wwe.componentManager.getManager('table');
    var trs = getTrs(range, selectionMgr, table);
    var tbodyRowLength = table.querySelectorAll('tbody tr').length;
    wwe.focus();

    if ((sq.hasFormat('TD') || sq.hasFormat('TABLE')) && tbodyRowLength > 1) {
      sq.saveUndoState(range);
      var firstTr = trs[0];
      var lastTr = trs[trs.length - 1];
      var nextFocus = lastTr && lastTr.nextSibling ? lastTr.nextSibling : firstTr && firstTr.previousSibling;

      if (nextFocus) {
        tableRemoveRow_focusToFirstTd(sq, range, nextFocus, tableMgr);
      }

      trs.forEach(function (tr) {
        return dom["a" /* default */].remove(tr);
      });
    }

    selectionMgr.removeClassAttrbuteFromAllCellsIfNeed();
  }
});
/**
 * Focus to first TD in given TR
 * @param {SquireExt} sq Squire instance
 * @param {Range} range Range object
 * @param {HTMLElement} tr HTMLElement wrapped TR
 * @param {object} tableMgr Table manager
 */

function tableRemoveRow_focusToFirstTd(sq, range, tr, tableMgr) {
  var nextFocusCell = tr.querySelector('td');
  range.setStart(nextFocusCell, 0);
  range.collapse(true);
  tableMgr.setLastCellNode(nextFocusCell);
  sq.setSelection(range);
}
/**
 * Get start, end row index from current range
 * @param {HTMLElement} firstSelectedCell Range object
 * @param {object} rangeInformation Range information object
 * @param {HTMLElement} table HTMLElement wrapped TABLE
 * @returns {HTMLElement}
 */


function getSelectedRows(firstSelectedCell, rangeInformation, table) {
  var tbodyRowLength = table.querySelectorAll('tbody tr').length;
  var isStartContainerInThead = dom["a" /* default */].parents(firstSelectedCell, 'thead').length;
  var startRowIndex = rangeInformation.from.row;
  var endRowIndex = rangeInformation.to.row;

  if (isStartContainerInThead) {
    startRowIndex += 1;
  }

  var isWholeTbodySelected = (startRowIndex === 1 || isStartContainerInThead) && endRowIndex === tbodyRowLength;

  if (isWholeTbodySelected) {
    endRowIndex -= 1;
  }

  return dom["a" /* default */].findAll(table, 'tr').slice(startRowIndex, endRowIndex + 1);
}
/**
 * Get TRs
 * @param {Range} range Range object
 * @param {object} selectionMgr Table selection manager
 * @param {HTMLElement} table current table
 * @returns {Array.<HTMLElement>}
 */


function getTrs(range, selectionMgr, table) {
  var selectedCells = selectionMgr.getSelectedCells();
  var rangeInformation, trs;

  if (selectedCells.length) {
    rangeInformation = selectionMgr.getSelectionRangeFromTable(selectedCells[0], selectedCells[selectedCells.length - 1]);
    trs = getSelectedRows(selectedCells[0], rangeInformation, table);
  } else {
    var cell = dom["a" /* default */].closest(range.startContainer, 'td,th');
    rangeInformation = selectionMgr.getSelectionRangeFromTable(cell, cell);
    trs = getSelectedRows(cell, rangeInformation, table);
  }

  return trs;
}

/* harmony default export */ var tableRemoveRow = (TableRemoveRow);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/tableRemoveCol.js
/**
 * @fileoverview Implements table remove column WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */




/**
 * RemoveCol
 * remove Row to selected table
 * @extends Command
 * @module wysiwygCommands/TableRemoveCol
 * @ignore
 */

var TableRemoveCol = commandManager["a" /* default */].command('wysiwyg',
/** @lends RemoveCol */
{
  name: 'RemoveCol',

  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection().cloneRange();

    var _domUtils$parents = dom["a" /* default */].parents(range.startContainer, 'table'),
        table = _domUtils$parents[0];

    var tableMgr = wwe.componentManager.getManager('table');
    var selectionMgr = wwe.componentManager.getManager('tableSelection');
    var hasMultipleCols = dom["a" /* default */].closest(range.startContainer, 'table').querySelectorAll('thead tr th').length > 1;
    wwe.focus(); // IE 800a025e error on removing part of selection range. collapse

    range.collapse(true);
    sq.setSelection(range);

    if (sq.hasFormat('TR', null, range) && hasMultipleCols) {
      var trs = table.querySelectorAll('tbody tr');
      var tbodyColLength = trs.length ? trs[0].querySelectorAll('td').length : 0;
      var selectedCells = selectionMgr.getSelectedCells();

      if (selectedCells.length < tbodyColLength) {
        sq.saveUndoState(range);
        var nextFocus;

        if (selectedCells.length > 1) {
          var tailCell = selectedCells[selectedCells.length - 1];
          var headCell = selectedCells[0];
          nextFocus = tailCell.nextSibling ? tailCell.nextSibling : headCell.previousSibling;
          removeMultipleColsByCells(selectedCells);
        } else {
          var cell = tableRemoveCol_getCellByRange(range);
          nextFocus = cell.nextSibling ? cell.nextSibling : cell.previousSibling;
          removeColByCell(cell);
        }

        focusToCell(sq, nextFocus, tableMgr);
      }
    }
  }
});
/**
 * Get cell by range object
 * @param {Range} range range
 * @returns {HTMLElement|Node}
 */

function tableRemoveCol_getCellByRange(range) {
  var cell = range.startContainer;

  if (dom["a" /* default */].getNodeName(cell) !== 'TD' && !dom["a" /* default */].getNodeName(cell) === 'TH') {
    cell = dom["a" /* default */].parentsUntil(cell, 'tr');
  }

  return cell;
}
/**
 * Remove columns by given cells
 * @param {HTMLElement} cells - table cells
 */


function removeMultipleColsByCells(cells) {
  var numberOfCells = cells.length;

  for (var i = 0; i < numberOfCells; i += 1) {
    var cellToDelete = cells[i];

    if (cellToDelete) {
      removeColByCell(cells[i]);
    }
  }
}
/**
 * Remove column by given cell
 * @param {HTMLElement} cell - wrapped table cell
 */


function removeColByCell(cell) {
  var _domUtils$parents2 = dom["a" /* default */].parents(cell, 'table'),
      table = _domUtils$parents2[0];

  if (table) {
    var index = inArray_default()(cell, toArray_default()(cell.parentNode.childNodes));
    dom["a" /* default */].findAll(table, 'tr').forEach(function (tr) {
      var td = tr.children[index];
      dom["a" /* default */].remove(td);
    });
  }
}
/**
 * Focus to given cell
 * @param {Squire} sq - Squire instance
 * @param {HTMLElement} cell - wrapped table cell
 * @param {object} tableMgr - Table manager instance
 */


function focusToCell(sq, cell, tableMgr) {
  var nextFocusCell = cell;

  if (cell && dom["a" /* default */].isContain(document.body, cell)) {
    var range = sq.getSelection();
    range.selectNodeContents(cell);
    range.collapse(true);
    sq.setSelection(range);
    tableMgr.setLastCellNode(nextFocusCell);
  }
}

/* harmony default export */ var tableRemoveCol = (TableRemoveCol);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/tableAlignCol.js
/**
 * @fileoverview Implements table align column WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * AlignCol
 * Align selected column's text content to given direction
 * @extends Command
 * @module wysiwygCommands/TableAlignCol
 * @ignore
 */

var TableAlignCol = commandManager["a" /* default */].command('wysiwyg',
/** @lends AlignCol */
{
  name: 'AlignCol',

  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   * @param {string} alignDirection Align direction
   */
  exec: function exec(wwe, alignDirection) {
    var sq = wwe.getEditor();
    var range = sq.getSelection().cloneRange();
    var selectionMgr = wwe.componentManager.getManager('tableSelection');
    var rangeInformation = getRangeInformation(range, selectionMgr);
    wwe.focus();

    if (sq.hasFormat('TR')) {
      sq.saveUndoState(range);

      var _domUtils$parents = dom["a" /* default */].parents(range.startContainer, 'table'),
          table = _domUtils$parents[0];

      var selectionInformation = getSelectionInformation(table, rangeInformation);
      setAlignAttributeToTableCells(table, alignDirection, selectionInformation);
    }

    selectionMgr.removeClassAttrbuteFromAllCellsIfNeed();
  }
});
/**
 * Set Column align
 * @param {HTMLElement} table wrapped TABLE
 * @param {string} alignDirection 'left' or 'center' or 'right'
 * @param {{
 *     startColumnIndex: number,
 *     endColumnIndex: number,
 *     isDivided: boolean
 *     }} selectionInformation start, end column index and boolean value for whether range divided or not
 */

function setAlignAttributeToTableCells(table, alignDirection, selectionInformation) {
  var isDivided = selectionInformation.isDivided || false;
  var start = selectionInformation.startColumnIndex;
  var end = selectionInformation.endColumnIndex;
  var trs = dom["a" /* default */].findAll(table, 'tr');
  var columnLength = trs.length ? trs[0].querySelectorAll('td,th').length : 0;
  trs.forEach(function (tr) {
    var cells = toArray_default()(dom["a" /* default */].children(tr, 'td,th'));
    cells.forEach(function (cell, index) {
      if (isDivided && (start <= index && index <= columnLength || index <= end)) {
        cell.setAttribute('align', alignDirection);
      } else if (start <= index && index <= end) {
        cell.setAttribute('align', alignDirection);
      }
    });
  });
}
/**
 * Return start, end column index and boolean value for whether range divided or not
 * @param {HTMLElement} table wrapped TABLE
 * @param {{startColumnIndex: number, endColumnIndex: number}} rangeInformation Range information
 * @returns {{startColumnIndex: number, endColumnIndex: number, isDivided: boolean}}
 */


function getSelectionInformation(table, rangeInformation) {
  var trs = table.querySelectorAll('tr');
  var columnLength = trs.length ? trs[0].querySelectorAll('td,th').length : 0;
  var from = rangeInformation.from,
      to = rangeInformation.to;
  var startColumnIndex, endColumnIndex, isDivided;

  if (from.row === to.row) {
    startColumnIndex = from.cell;
    endColumnIndex = to.cell;
  } else if (from.row < to.row) {
    if (from.cell <= to.cell) {
      startColumnIndex = 0;
      endColumnIndex = columnLength - 1;
    } else {
      startColumnIndex = from.cell;
      endColumnIndex = to.cell;
      isDivided = true;
    }
  }

  return {
    startColumnIndex: startColumnIndex,
    endColumnIndex: endColumnIndex,
    isDivided: isDivided
  };
}
/**
 * Get range information
 * @param {Range} range Range object
 * @param {object} selectionMgr Table selection manager
 * @returns {object}
 */


function getRangeInformation(range, selectionMgr) {
  var selectedCells = selectionMgr.getSelectedCells();
  var rangeInformation, startCell;

  if (selectedCells.length) {
    rangeInformation = selectionMgr.getSelectionRangeFromTable(selectedCells[0], selectedCells[selectedCells.length - 1]);
  } else {
    var startContainer = range.startContainer;
    startCell = dom["a" /* default */].isTextNode(startContainer) ? dom["a" /* default */].parent(startContainer, 'td,th') : startContainer;
    rangeInformation = selectionMgr.getSelectionRangeFromTable(startCell, startCell);
  }

  return rangeInformation;
}

/* harmony default export */ var tableAlignCol = (TableAlignCol);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/tableRemove.js
/**
 * @fileoverview Implements table remove WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


/**
 * RemoveTable
 * Remove selected table
 * @extends Command
 * @module wysiwygCommands/TableRemove
 * @ignore
 */

var TableRemove = commandManager["a" /* default */].command('wysiwyg',
/** @lends RemoveTable */
{
  name: 'RemoveTable',

  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection().cloneRange();

    if (sq.hasFormat('TABLE')) {
      sq.saveUndoState(range);
      dom["a" /* default */].remove(dom["a" /* default */].closest(range.startContainer, 'table'));
    }

    wwe.focus();
  }
});
/* harmony default export */ var tableRemove = (TableRemove);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/indent.js
/**
 * @fileoverview Implements Indent wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */




/**
 * Indent
 * Indent list or task to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/indent
 * @ignore
 */

var indent_Indent = commandManager["a" /* default */].command('wysiwyg',
/** @lends Indent */
{
  name: 'Indent',

  /**
   * Command Handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var listManager = wwe.componentManager.getManager('list');
    var range = wwe.getEditor().getSelection();
    var node = dom["a" /* default */].closest(range.startContainer, 'li');
    var prevClasses, nodeClasses, nextClasses;
    var prev = node && node.previousSibling;

    if (prev) {
      var next = node.querySelector('li');
      wwe.getEditor().saveUndoState();
      nodeClasses = node.className;
      prevClasses = prev.className;
      node.className = '';
      prev.className = '';

      if (next) {
        nextClasses = next.className;
        var divElements = toArray_default()(next.children).filter(function (child) {
          return matches_default()(child, 'div');
        });

        if (!divElements.length) {
          next.className = '';
        }
      }

      wwe.getEditor().increaseListLevel();
      listManager.mergeList(node);
      node.className = nodeClasses;
      prev.className = prevClasses;

      if (next) {
        next.className = nextClasses;
      }
    }
  }
});
/* harmony default export */ var wysiwygCommands_indent = (indent_Indent);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/outdent.js
/**
 * @fileoverview Implements Outdent wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


/**
 * Outdent
 * Outdent list or task to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/Outdent
 * @ignore
 */

var outdent_Outdent = commandManager["a" /* default */].command('wysiwyg',
/** @lends Outdent */
{
  name: 'Outdent',

  /**
   * Command Handler
   * @param {WysiwygEditor} wwe WysiwygEditor instance
   */
  exec: function exec(wwe) {
    var node = getCurrentLi(wwe);

    if (node && isExecutable(node)) {
      wwe.getEditor().saveUndoState();
      var nodeClasses = node.className;
      wwe.getEditor().decreaseListLevel();
      node = getCurrentLi(wwe);

      if (node && nodeClasses) {
        node.className = nodeClasses;
      }
    }
  }
});
/**
 * test if outdent the given list item
 * arbitrary list allows list item to be in any position
 * while markdown spec does not
 * @param {HTMLElement} currentLiNode - list item element
 * @returns {boolean} - true to executable
 * @ignore
 */

function isExecutable(currentLiNode) {
  var nodeName = dom["a" /* default */].getNodeName(currentLiNode.nextSibling);
  return nodeName !== 'OL' && nodeName !== 'UL';
}
/**
 * Get list item element of current selection
 * @param {object} wwe Wysiwyg editor instance
 * @returns {HTMLElement}
 * @ignore
 */


function getCurrentLi(wwe) {
  var range = wwe.getEditor().getSelection();
  return dom["a" /* default */].closest(range.startContainer, 'li');
}

/* harmony default export */ var wysiwygCommands_outdent = (outdent_Outdent);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/task.js
/**
 * @fileoverview Implements Task WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


/**
 * Task
 * Add Task to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Task
 * @ignore
 */

var task_Task = commandManager["a" /* default */].command('wysiwyg',
/** @lends Task */
{
  name: 'Task',
  keyMap: ['ALT+T', 'ALT+T'],

  /**
   * Command Handler
   * @param {WysiwygEditor} wwe WYSIWYGEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var range = sq.getSelection();
    var listManager = wwe.componentManager.getManager('list');
    var startContainer = range.startContainer,
        endContainer = range.endContainer,
        startOffset = range.startOffset,
        endOffset = range.endOffset;
    var newLIs = [];
    wwe.focus();
    sq.saveUndoState(range);

    if (listManager.isAvailableMakeListInTable()) {
      newLIs = listManager.createListInTable(range, 'TASK');
    } else {
      var lines = listManager.getLinesOfSelection(startContainer, endContainer);

      for (var i = 0; i < lines.length; i += 1) {
        var newLI = this._changeFormatToTaskIfNeed(wwe, lines[i]);

        if (newLI) {
          newLIs.push(newLI);
        }
      }
    }

    if (newLIs.length) {
      listManager.adjustRange(startContainer, endContainer, startOffset, endOffset, newLIs);
    }
  },

  /**
   * Change format to unordered list and return current li element if need
   * @param {WysiwygEditor} wwe Wysiwyg editor instance
   * @param {HTMLElement} target Element target for change
   * @returns {HTMLElement} newly created list
   * @private
   */
  _changeFormatToTaskIfNeed: function _changeFormatToTaskIfNeed(wwe, target) {
    var sq = wwe.getEditor();
    var range = sq.getSelection();
    var taskManager = wwe.componentManager.getManager('task');
    var newLI;

    if (!sq.hasFormat('PRE')) {
      range.setStart(target, 0);
      range.collapse(true);
      sq.setSelection(range);

      if (!sq.hasFormat('li')) {
        sq.makeUnorderedList();
        target = sq.getSelection().startContainer;
      }

      if (hasClass_default()(target, 'task-list-item')) {
        taskManager.unformatTask(target);
      } else {
        taskManager.formatTask(target);
      }

      newLI = sq.getSelection().startContainer;
    }

    return newLI;
  }
});
/* harmony default export */ var wysiwygCommands_task = (task_Task);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/code.js
/**
 * @fileoverview Implements code WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


/**
 * Code
 * Add bold to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Code
 * @ignore
 */

var code_Code = commandManager["a" /* default */].command('wysiwyg',
/** @lends Code */
{
  name: 'Code',
  keyMap: ['SHIFT+CTRL+C', 'SHIFT+META+C'],

  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec: function exec(wwe) {
    var sq = wwe.getEditor();
    var tableSelectionManager = wwe.componentManager.getManager('tableSelection');

    var _styleCode = styleCode.bind(null, wwe.getEditor());

    wwe.focus();

    if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
      tableSelectionManager.styleToSelectedCells(_styleCode);
      var range = sq.getSelection();
      range.collapse(true);
      sq.setSelection(range);
    } else {
      _styleCode(sq);
    }
  }
});
/**
 * removeUnnecessaryCodeInNextToRange
 * Remove unnecessary code tag next to range, code tag made by squire
 * @param {Range} range range object
 */

function removeUnnecessaryCodeInNextToRange(range) {
  if (dom["a" /* default */].getNodeName(range.startContainer.nextSibling) === 'CODE' && dom["a" /* default */].getTextLength(range.startContainer.nextSibling) === 0) {
    dom["a" /* default */].remove(range.startContainer.nextSibling);
  }
}
/**
 * Style code.
 * @param {object} editor - editor instance
 * @param {object} sq - squire editor instance
 */


function styleCode(editor, sq) {
  if (!sq.hasFormat('PRE') && sq.hasFormat('code')) {
    sq.changeFormat(null, {
      tag: 'code'
    });
    removeUnnecessaryCodeInNextToRange(editor.getSelection().cloneRange());
  } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
    if (sq.hasFormat('b')) {
      sq.removeBold();
    } else if (sq.hasFormat('i')) {
      sq.removeItalic();
    }

    sq.changeFormat({
      tag: 'code'
    });
    var range = sq.getSelection().cloneRange();
    range.setStart(range.endContainer, range.endOffset);
    range.collapse(true);
    sq.setSelection(range);
  }
}

/* harmony default export */ var wysiwygCommands_code = (code_Code);
// CONCATENATED MODULE: ./src/js/wysiwygCommands/codeBlock.js
/**
 * @fileoverview Implements code block WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var CODEBLOCK_CLASS_TEMP = 'te-content-codeblock-temp';
var codeBlock_CODEBLOCK_ATTR_NAME = 'data-te-codeblock';
/**
 * CodeBlock
 * Add CodeBlock to wysiwygEditor
 * @extends Command
 * @module wysiwygCommands/Codeblock
 * @ignore
 */

var codeBlock_CodeBlock = commandManager["a" /* default */].command('wysiwyg',
/** @lends CodeBlock */
{
  name: 'CodeBlock',
  keyMap: ['SHIFT+CTRL+P', 'SHIFT+META+P'],

  /**
   * Command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   * @param {string} type of language
   */
  exec: function exec(wwe, type) {
    var sq = wwe.getEditor();
    var range = sq.getSelection().cloneRange();

    if (!sq.hasFormat('PRE') && !sq.hasFormat('TABLE')) {
      var attr = codeBlock_CODEBLOCK_ATTR_NAME + " class = \"" + CODEBLOCK_CLASS_TEMP + "\"";

      if (type) {
        attr += " data-language=\"" + type + "\"";
      }

      var codeBlockBody = getCodeBlockBody(range, wwe);
      sq.insertHTML("<pre " + attr + ">" + codeBlockBody + "</pre>");
      focusToFirstCode(wwe.getBody().querySelector("." + CODEBLOCK_CLASS_TEMP), wwe);
    }

    wwe.focus();
  }
});
/**
 * focusToFirstCode
 * Focus to first code tag content of pre tag
 * @param {HTMLElement} pre pre tag
 * @param {WysiwygEditor} wwe wysiwygEditor
 */

function focusToFirstCode(pre, wwe) {
  var range = wwe.getEditor().getSelection().cloneRange();
  removeClass_default()(pre, CODEBLOCK_CLASS_TEMP);
  range.setStartBefore(pre.firstChild);
  range.collapse(true);
  wwe.getEditor().setSelection(range);
}
/**
 * getCodeBlockBody
 * get text wrapped by code
 * @param {object} range range object
 * @param {object} wwe wysiwyg editor
 * @returns {string}
 */


function getCodeBlockBody(range, wwe) {
  var mgr = wwe.componentManager.getManager('codeblock');
  var codeBlock;

  if (range.collapsed) {
    codeBlock = '<br>';
  } else {
    var contents = range.extractContents();
    var nodes = toArray_default()(contents.childNodes);
    var tempDiv = document.createElement('div');
    tempDiv.appendChild(mgr.prepareToPasteOnCodeblock(nodes));
    codeBlock = tempDiv.innerHTML;
  }

  return codeBlock;
}

/* harmony default export */ var wysiwygCommands_codeBlock = (codeBlock_CodeBlock);
// CONCATENATED MODULE: ./src/js/scroll/animation.js
var ANIMATION_TIME = 200;
var SCROLL_BOCKING_RESET_DELAY = 15;
var currentTimeoutId = null;
var releaseTimer = null;

function run(deltaScrollTop, _ref) {
  var syncScrollTop = _ref.syncScrollTop,
      releaseEventBlock = _ref.releaseEventBlock;
  clearTimeout(releaseTimer);
  syncScrollTop(deltaScrollTop);
  releaseTimer = setTimeout(function () {
    releaseEventBlock();
  }, SCROLL_BOCKING_RESET_DELAY);
}

function animate(sourceScrollTop, targetScrollTop, callbackObjForSync) {
  var diff = targetScrollTop - sourceScrollTop;
  var startTime = Date.now();
  /**
   * Each animation step
   */

  var step = function step() {
    var stepTime = Date.now();
    var progress = (stepTime - startTime) / ANIMATION_TIME;
    var deltaValue; // if already doing animation

    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId);
    }

    if (progress < 1) {
      deltaValue = sourceScrollTop + diff * Math.cos((1 - progress) * Math.PI / 2);
      run(Math.ceil(deltaValue), callbackObjForSync);
      currentTimeoutId = setTimeout(step, 1);
    } else {
      run(targetScrollTop, callbackObjForSync);
      currentTimeoutId = null;
    }
  };

  step();
}
// EXTERNAL MODULE: ./src/js/scroll/helper.js
var helper = __webpack_require__(18);

// EXTERNAL MODULE: ./src/js/scroll/cache/offsetInfo.js
var offsetInfo = __webpack_require__(25);

// CONCATENATED MODULE: ./src/js/scroll/editorScroll.js




var EDITING_POSITION_RATIO = 0.5;
var blockedPreviewScrollEvent = false;
var latestScrollTop = null;
/* eslint-disable no-return-assign */

function getAndSaveOffsetHeight(node, mdNodeId) {
  var cachedHeight = Object(offsetInfo["a" /* getOffsetHeight */])(mdNodeId);
  var offsetHeight = cachedHeight || node.offsetHeight;

  if (!cachedHeight) {
    Object(offsetInfo["d" /* setOffsetHeight */])(mdNodeId, offsetHeight);
  }

  return offsetHeight;
}

function getTopInfo(cm, startLine, mdNode, node, previewEl) {
  var mdNodeStartLine = Object(markdown["f" /* getMdStartLine */])(mdNode);
  var height = cm.lineInfo(startLine).handle.height;
  var previewElHeight = getAndSaveOffsetHeight(previewEl, 0);
  var top = node.getBoundingClientRect().top - previewEl.getBoundingClientRect().top; // position editing node on middle of preview as default

  var additionalScrollTop = -previewElHeight * EDITING_POSITION_RATIO;

  if (Object(markdown["j" /* isMultiLineNode */])(mdNode)) {
    var additionalTopPos = (startLine - mdNodeStartLine + 1) * height;
    additionalScrollTop = additionalTopPos;
    top += additionalTopPos;
  }

  return {
    top: top,
    additionalScrollTop: additionalScrollTop
  };
}

function syncPreviewScrollTopToMarkdown(editor, preview, scrollEvent) {
  var root = preview._previewContent,
      previewEl = preview.el;
  var cm = editor.cm,
      toastMark = editor.toastMark;

  var _cm$getScrollInfo = cm.getScrollInfo(),
      left = _cm$getScrollInfo.left,
      scrollTop = _cm$getScrollInfo.top,
      height = _cm$getScrollInfo.height,
      clientHeight = _cm$getScrollInfo.clientHeight;

  var isBottomPos = height - scrollTop <= clientHeight;
  var sourceScrollTop = previewEl.scrollTop;
  var targetScrollTop = isBottomPos ? previewEl.scrollHeight : 0;

  if (scrollTop && !isBottomPos) {
    var _ref = scrollEvent ? cm.coordsChar({
      left: left,
      top: scrollTop
    }, 'local') : cm.getCursor('from'),
        startLine = _ref.line;

    var firstMdNode = toastMark.findFirstNodeAtLine(startLine + 1);

    if (!firstMdNode || Object(markdown["g" /* isHtmlNode */])(firstMdNode)) {
      return;
    } // if DOM element does not exist, should get its parent node using markdown node
    // in case of text node, rendererd DOM element is not matched to markdown node


    var nodeObj = Object(helper["f" /* getParentNodeObj */])(firstMdNode);
    var node = nodeObj.node,
        mdNode = nodeObj.mdNode;
    var mdNodeStartLine = Object(markdown["f" /* getMdStartLine */])(mdNode);
    var previewElHeight = getAndSaveOffsetHeight(previewEl, 0);
    targetScrollTop = Object(helper["g" /* getTotalOffsetTop */])(node, root) || node.offsetTop;

    if (!scrollEvent) {
      var _getTopInfo = getTopInfo(cm, startLine, mdNode, node, previewEl),
          top = _getTopInfo.top,
          additionalScrollTop = _getTopInfo.additionalScrollTop;

      if (top > 0 && top < previewElHeight) {
        return;
      }

      targetScrollTop += additionalScrollTop; // assign the null to sync scrollTop position when scrolling

      latestScrollTop = null;
    } else if (Object(helper["h" /* isNodeToBeCalculated */])(mdNode)) {
      var offsetHeight = getAndSaveOffsetHeight(node, mdNode.id);
      var offsetTop = cm.heightAtLine(mdNodeStartLine - 1, 'local');
      var cmNodeHeight = Object(helper["c" /* getCmRangeHeight */])(mdNode, cm);
      targetScrollTop += Object(helper["b" /* getAdditionalTopPos */])(scrollTop, offsetTop, cmNodeHeight, offsetHeight);
      var scrollTopInfo = {
        latestScrollTop: latestScrollTop,
        scrollTop: scrollTop,
        targetScrollTop: targetScrollTop,
        sourceScrollTop: sourceScrollTop
      };
      targetScrollTop = Object(helper["d" /* getFallbackScrollTop */])(scrollTopInfo);
      latestScrollTop = scrollTop;

      if (targetScrollTop === sourceScrollTop) {
        return;
      }
    }
  }

  blockedPreviewScrollEvent = true;
  var callbackObjForSync = {
    syncScrollTop: function syncScrollTop(deltaScrollTop) {
      return previewEl.scrollTop = deltaScrollTop;
    },
    releaseEventBlock: function releaseEventBlock() {
      return blockedPreviewScrollEvent = false;
    }
  };
  animate(sourceScrollTop, targetScrollTop, callbackObjForSync);
}
function isBlockedPreviewScrollEvent() {
  return blockedPreviewScrollEvent;
}
// CONCATENATED MODULE: ./src/js/scroll/previewScroll.js




var blockedMarkdownScrollEvent = false;
var previewScroll_latestScrollTop = null;
/* eslint-disable no-return-assign */

function getAndSaveOffsetInfo(node, mdNodeId, root) {
  var cachedHeight = Object(offsetInfo["a" /* getOffsetHeight */])(mdNodeId);
  var cachedTop = Object(offsetInfo["b" /* getOffsetTop */])(mdNodeId);
  var offsetHeight = cachedHeight || node.offsetHeight;
  var offsetTop = cachedTop || Object(helper["g" /* getTotalOffsetTop */])(node, root) || node.offsetTop;

  if (!cachedHeight) {
    Object(offsetInfo["d" /* setOffsetHeight */])(mdNodeId, offsetHeight);
  }

  if (!cachedTop) {
    Object(offsetInfo["e" /* setOffsetTop */])(mdNodeId, offsetTop);
  }

  return {
    offsetHeight: offsetHeight,
    offsetTop: offsetTop
  };
}

function getAncestorHavingId(node, root) {
  while (!node.getAttribute('data-nodeid') && node.parentElement !== root) {
    node = node.parentElement;
  }

  return node;
}

function syncMarkdownScrollTopToPreview(editor, preview, targetNode) {
  var toastMark = editor.toastMark,
      cm = editor.cm;
  var _preview$el = preview.el,
      scrollTop = _preview$el.scrollTop,
      clientHeight = _preview$el.clientHeight,
      scrollHeight = _preview$el.scrollHeight;
  var root = preview._previewContent;
  var isBottomPos = scrollHeight - scrollTop <= clientHeight;

  var _cm$getScrollInfo = cm.getScrollInfo(),
      left = _cm$getScrollInfo.left,
      sourceScrollTop = _cm$getScrollInfo.top,
      height = _cm$getScrollInfo.height;

  var targetScrollTop = isBottomPos ? height : 0;

  if (scrollTop && targetNode && !isBottomPos) {
    targetNode = getAncestorHavingId(targetNode, root);

    if (!targetNode.getAttribute('data-nodeid')) {
      return;
    }

    var _cm$coordsChar = cm.coordsChar({
      left: left,
      top: sourceScrollTop
    }, 'local'),
        startLine = _cm$coordsChar.line;

    var mdNodeId = Number(targetNode.getAttribute('data-nodeid'));

    var _getParentNodeObj = Object(helper["f" /* getParentNodeObj */])(toastMark.findNodeById(mdNodeId)),
        mdNode = _getParentNodeObj.mdNode,
        node = _getParentNodeObj.node;

    var mdNodeStartLine = Object(markdown["f" /* getMdStartLine */])(mdNode);
    targetScrollTop = cm.heightAtLine(mdNodeStartLine - 1, 'local');

    if (Object(markdown["i" /* isListItemNode */])(mdNode)) {
      targetScrollTop += Object(helper["e" /* getNextEmptyLineHeight */])(cm, mdNodeStartLine, startLine);
    }

    if (Object(helper["h" /* isNodeToBeCalculated */])(mdNode)) {
      var cmNodeHeight = Object(helper["c" /* getCmRangeHeight */])(mdNode, cm);

      var _getAndSaveOffsetInfo = getAndSaveOffsetInfo(node, mdNodeId, root),
          offsetHeight = _getAndSaveOffsetInfo.offsetHeight,
          offsetTop = _getAndSaveOffsetInfo.offsetTop;

      targetScrollTop += Object(helper["b" /* getAdditionalTopPos */])(scrollTop, offsetTop, offsetHeight, cmNodeHeight);
      var scrollTopInfo = {
        latestScrollTop: previewScroll_latestScrollTop,
        scrollTop: scrollTop,
        targetScrollTop: targetScrollTop,
        sourceScrollTop: sourceScrollTop
      };
      targetScrollTop = Object(helper["d" /* getFallbackScrollTop */])(scrollTopInfo);
      previewScroll_latestScrollTop = scrollTop;

      if (targetScrollTop === sourceScrollTop) {
        return;
      }
    }
  }

  blockedMarkdownScrollEvent = true;
  var callbackObjForSync = {
    syncScrollTop: function syncScrollTop(deltaScrollTop) {
      return cm.scrollTo(0, deltaScrollTop);
    },
    releaseEventBlock: function releaseEventBlock() {
      return blockedMarkdownScrollEvent = false;
    }
  };
  animate(sourceScrollTop, targetScrollTop, callbackObjForSync);
}
function isBlockedMarkdownScrollEvent() {
  return blockedMarkdownScrollEvent;
}
// CONCATENATED MODULE: ./src/js/scroll/ui/button.js

var button_className = 'tui-scrollsync';
var activeClassName = 'tui-scrollsync active';
var active = true;
function isActive() {
  return active;
}
function createButton(editor) {
  if (editor.isViewer() || editor.getUI().name !== 'default') {
    return;
  }

  var i18n = editor.i18n;
  var tooltip = {
    ACTIVE: i18n.get('Auto scroll enabled'),
    INACTIVE: i18n.get('Auto scroll disabled')
  };
  var toolbar = editor.getUI().getToolbar();
  var buttonEl = document.createElement('button');
  buttonEl.className = activeClassName;
  toolbar.addItem('divider');
  toolbar.addItem({
    type: 'button',
    options: {
      command: 'scrollSyncToggle',
      tooltip: tooltip.ACTIVE,
      el: buttonEl
    }
  });
  var items = toolbar.getItems();
  var divider = items[items.length - 2].el;
  var button = items[items.length - 1];
  changeButtonVisiblityStateIfNeed(editor, button, divider);
  addEventListener(editor, button, divider);
  addEditorCommand(editor, button, tooltip);
}

function addEventListener(editor, button, divider) {
  // hide scroll follow button in wysiwyg
  editor.on('changeMode', function () {
    return changeButtonVisiblityStateIfNeed(editor, button, divider);
  });
  editor.on('changePreviewStyle', function () {
    return changeButtonVisiblityStateIfNeed(editor, button, divider);
  });
}

function addEditorCommand(editor, button, tooltip) {
  // Commands
  editor.addCommand('markdown', {
    name: 'scrollSyncToggle',
    exec: function exec() {
      active = !active;

      button._onOut();

      if (active) {
        button.el.className = activeClassName;
        button.setTooltip(tooltip.ACTIVE);
      } else {
        button.el.className = button_className;
        button.setTooltip(tooltip.INACTIVE);
      }

      button._onOver();
    }
  });
}

function changeButtonVisiblityStateIfNeed(editor, button, divider) {
  if (editor.mdPreviewStyle === 'vertical' && editor.currentMode === 'markdown') {
    css_default()(button.el, {
      display: 'inline-block'
    });
    css_default()(divider, {
      display: 'inline-block'
    });
  } else {
    css_default()(button.el, {
      display: 'none'
    });
    css_default()(divider, {
      display: 'none'
    });
  }
}
// CONCATENATED MODULE: ./src/js/scroll/sync.js



var isScrollable = true;
/* eslint-disable no-return-assign */

function register(editor) {
  var mdEditor = editor.mdEditor,
      preview = editor.preview;
  createButton(editor);
  addScrollEvent(mdEditor, preview);
  addPreviewRenderedEvent(mdEditor, preview);
  mdEditor.cm.on('change', function () {
    return isScrollable = false;
  });
}

function addPreviewRenderedEvent(editor, preview) {
  editor.eventManager.listen('previewRenderAfter', function () {
    // Immediately after the 'previewRenderAfter' event has occurred,
    // browser rendering is not yet complete.
    // So the size of elements can not be accurately measured.
    setTimeout(function () {
      if (isActive()) {
        syncPreviewScrollTopToMarkdown(editor, preview);
      }

      isScrollable = true;
    }, 200);
  });
}

function addScrollEvent(editor, preview) {
  var eventManager = editor.eventManager;
  eventManager.listen('scroll', function (_ref) {
    var source = _ref.source,
        data = _ref.data;

    if (!isActive()) {
      return;
    }

    if (isScrollable && preview.isVisible()) {
      if (source === 'markdown' && !isBlockedMarkdownScrollEvent()) {
        syncPreviewScrollTopToMarkdown(editor, preview, true);
      } else if (source === 'preview' && !isBlockedPreviewScrollEvent()) {
        syncMarkdownScrollTopToPreview(editor, preview, data);
      }
    }
  });
}
// CONCATENATED MODULE: ./src/js/editor.js
function editor_extends() { editor_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return editor_extends.apply(this, arguments); }

/**
 * @fileoverview Implements Editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


























 // markdown commands






















 // wysiwyg Commands


























var __nedInstance = [];
/**
 * @callback addImageBlobHook
 * @param {File|Blob} fileOrBlob - image blob
 * @param {callback} callback - callback function to be called after
 * @param {string} source - source of an event the item belongs to. 'paste', 'drop', 'ui'
 */

/**
 * ToastUI Editor
 * @param {Object} options Option object
 *     @param {HTMLElement} options.el - container element
 *     @param {string} [options.height='300px'] - Editor's height style value. Height is applied as border-box ex) '300px', '100%', 'auto'
 *     @param {string} [options.minHeight='200px'] - Editor's min-height style value in pixel ex) '300px'
 *     @param {string} [options.initialValue] - Editor's initial value
 *     @param {string} [options.previewStyle] - Markdown editor's preview style (tab, vertical)
 *     @param {boolean} [options.previewHighlight = true] - Highlight a preview element corresponds to the cursor position in the markdwon editor
 *     @param {string} [options.initialEditType] - Initial editor type (markdown, wysiwyg)
 *     @param {Object} [options.events] - Events
 *         @param {function} [options.events.load] - It would be emitted when editor fully load
 *         @param {function} [options.events.change] - It would be emitted when content changed
 *         @param {function} [options.events.stateChange] - It would be emitted when format change by cursor position
 *         @param {function} [options.events.focus] - It would be emitted when editor get focus
 *         @param {function} [options.events.blur] - It would be emitted when editor loose focus
 *     @param {Object} [options.hooks] - Hooks
 *         @param {function} [options.hooks.previewBeforeHook] - Submit preview to hook URL before preview be shown
 *         @param {addImageBlobHook} [options.hooks.addImageBlobHook] - hook for image upload
 *     @param {string} [options.language='en-US'] - language
 *     @param {boolean} [options.useCommandShortcut=true] - whether use keyboard shortcuts to perform commands
 *     @param {boolean} [options.useDefaultHTMLSanitizer=true] - use default htmlSanitizer
 *     @param {boolean} [options.usageStatistics=true] - send hostname to google analytics
 *     @param {Array.<string|toolbarItemsValue>} [options.toolbarItems] - toolbar items.
 *     @param {boolean} [options.hideModeSwitch=false] - hide mode switch tab bar
 *     @param {Array.<function|Array>} [options.plugins] - Array of plugins. A plugin can be either a function or an array in the form of [function, options].
 *     @param {Object} [options.extendedAutolinks] - Using extended Autolinks specified in GFM spec
 *     @param {Object} [options.customConvertor] - convertor extention
 *     @param {string} [options.placeholder] - The placeholder text of the editable element.
 *     @param {Object} [options.linkAttribute] - Attributes of anchor element that should be rel, target, contenteditable, hreflang, type
 *     @param {Object} [options.customHTMLRenderer] - Object containing custom renderer functions correspond to markdown node
 *     @param {boolean} [options.referenceDefinition=false] - whether use the specification of link reference definition
 *     @param {function} [options.customHTMLSanitizer=null] - custom HTML sanitizer
 *     @param {boolean} [options.frontMatter=false] - whether use the front matter
 */

var editor_ToastUIEditor = /*#__PURE__*/function () {
  function ToastUIEditor(options) {
    var _this = this;

    this.initialHtml = options.el.innerHTML;
    options.el.innerHTML = '';
    this.options = extend_default()({
      previewStyle: 'tab',
      previewHighlight: true,
      initialEditType: 'markdown',
      height: '300px',
      minHeight: '200px',
      language: 'en-US',
      useDefaultHTMLSanitizer: true,
      useCommandShortcut: true,
      usageStatistics: true,
      toolbarItems: ['heading', 'bold', 'italic', 'strike', 'divider', 'hr', 'quote', 'divider', 'ul', 'ol', 'task', 'indent', 'outdent', 'divider', 'table', 'image', 'link', 'divider', 'code', 'codeblock'],
      hideModeSwitch: false,
      linkAttribute: null,
      extendedAutolinks: false,
      customConvertor: null,
      customHTMLRenderer: null,
      referenceDefinition: false,
      customHTMLSanitizer: null,
      frontMatter: false
    }, options);
    this.codeBlockLanguages = [];
    this.eventManager = new js_eventManager["a" /* default */]();
    this.importManager = new importManager(this.eventManager);
    this.commandManager = new commandManager["a" /* default */](this, {
      useCommandShortcut: this.options.useCommandShortcut
    });
    var linkAttribute = Object(utils_common["c" /* sanitizeLinkAttribute */])(this.options.linkAttribute);

    var _getPluginInfo = Object(pluginHelper["a" /* getPluginInfo */])(this.options.plugins),
        renderer = _getPluginInfo.renderer,
        parser = _getPluginInfo.parser,
        plugins = _getPluginInfo.plugins;

    var _this$options = this.options,
        customHTMLRenderer = _this$options.customHTMLRenderer,
        customHTMLSanitizer = _this$options.customHTMLSanitizer,
        extendedAutolinks = _this$options.extendedAutolinks,
        referenceDefinition = _this$options.referenceDefinition,
        useDefaultHTMLSanitizer = _this$options.useDefaultHTMLSanitizer,
        frontMatter = _this$options.frontMatter;
    var rendererOptions = {
      linkAttribute: linkAttribute,
      customHTMLRenderer: editor_extends({}, renderer, customHTMLRenderer),
      extendedAutolinks: extendedAutolinks,
      referenceDefinition: referenceDefinition,
      customParser: parser,
      frontMatter: frontMatter,
      customProp: {
        showFrontMatter: frontMatter
      }
    };

    if (this.options.customConvertor) {
      // eslint-disable-next-line new-cap
      this.convertor = new this.options.customConvertor(this.eventManager, rendererOptions);
    } else {
      this.convertor = new convertor["a" /* default */](this.eventManager, rendererOptions);
    }

    var sanitizer = customHTMLSanitizer || (useDefaultHTMLSanitizer ? htmlSanitizer["a" /* default */] : null);

    if (sanitizer) {
      this.convertor.initHtmlSanitizer(sanitizer);
    }

    if (this.options.hooks) {
      forEachOwnProperties_default()(this.options.hooks, function (fn, key) {
        return _this.addHook(key, fn);
      });
    }

    if (this.options.events) {
      forEachOwnProperties_default()(this.options.events, function (fn, key) {
        return _this.on(key, fn);
      });
    }

    this.layout = new js_layout(options, this.eventManager);
    this.i18n = i18n;
    this.i18n.setCode(this.options.language);
    this.setUI(this.options.UI || new defaultUI(this));
    this.toastMark = new toastmark["ToastMark"]('', {
      disallowedHtmlBlockTags: ['br'],
      extendedAutolinks: extendedAutolinks,
      referenceDefinition: referenceDefinition,
      disallowDeepHeading: true,
      customParser: parser,
      frontMatter: frontMatter
    });
    this.mdEditor = markdownEditor.factory(this.layout.getMdEditorContainerEl(), this.eventManager, this.toastMark, this.options);
    this.preview = new mdPreview["a" /* default */](this.layout.getPreviewEl(), this.eventManager, this.convertor, editor_extends({}, rendererOptions, {
      isViewer: false,
      highlight: this.options.previewHighlight
    }));
    this.wwEditor = wysiwygEditor.factory(this.layout.getWwEditorContainerEl(), this.eventManager, {
      sanitizer: sanitizer,
      linkAttribute: linkAttribute
    });
    this.toMarkOptions = {
      gfm: true,
      renderer: toMarkRenderer
    };

    if (plugins) {
      Object(pluginHelper["b" /* invokePlugins */])(plugins, this);
    }

    this.changePreviewStyle(this.options.previewStyle);
    this.changeMode(this.options.initialEditType, true);
    this.minHeight(this.options.minHeight);
    this.height(this.options.height);
    this.setMarkdown(this.options.initialValue, false);

    if (this.options.placeholder) {
      this.setPlaceholder(this.options.placeholder);
    }

    if (!this.options.initialValue) {
      this.setHtml(this.initialHtml, false);
    }

    this.eventManager.emit('load', this);

    __nedInstance.push(this);

    this._addDefaultCommands();

    if (this.options.usageStatistics) {
      Object(utils_common["d" /* sendHostName */])();
    }

    register(this);
  }
  /**
   * change preview style
   * @param {string} style - 'tab'|'vertical'
   */


  var _proto = ToastUIEditor.prototype;

  _proto.changePreviewStyle = function changePreviewStyle(style) {
    this.layout.changePreviewStyle(style);
    this.mdPreviewStyle = style;
    this.eventManager.emit('changePreviewStyle', style);
    this.eventManager.emit('previewNeedsRefresh', this.getMarkdown());
  }
  /**
   * call commandManager's exec method
   * @param {*} ...args Command argument
   */
  ;

  _proto.exec = function exec() {
    var _this$commandManager;

    (_this$commandManager = this.commandManager).exec.apply(_this$commandManager, arguments);
  }
  /**
   * add default commands
   * @private
   */
  ;

  _proto._addDefaultCommands = function _addDefaultCommands() {
    this.addCommand(bold);
    this.addCommand(italic);
    this.addCommand(blockquote);
    this.addCommand(markdownCommands_heading);
    this.addCommand(paragraph);
    this.addCommand(markdownCommands_hr);
    this.addCommand(addLink);
    this.addCommand(addImage);
    this.addCommand(markdownCommands_ul);
    this.addCommand(ol);
    this.addCommand(markdownCommands_indent);
    this.addCommand(outdent);
    this.addCommand(markdownCommands_table);
    this.addCommand(markdownCommands_task);
    this.addCommand(markdownCommands_code);
    this.addCommand(markdownCommands_codeBlock);
    this.addCommand(strike);
    this.addCommand(changeTaskMarker);
    this.addCommand(toggleTaskMarker);
    this.addCommand(moveNextCursorOrIndent);
    this.addCommand(movePrevCursorOrOutdent);
    this.addCommand(addLine);
    this.addCommand(wysiwygCommands_bold);
    this.addCommand(wysiwygCommands_italic);
    this.addCommand(wysiwygCommands_blockquote);
    this.addCommand(wysiwygCommands_ul);
    this.addCommand(wysiwygCommands_ol);
    this.addCommand(wysiwygCommands_addImage);
    this.addCommand(wysiwygCommands_addLink);
    this.addCommand(wysiwygCommands_hr);
    this.addCommand(wysiwygCommands_heading);
    this.addCommand(wysiwygCommands_paragraph);
    this.addCommand(wysiwygCommands_indent);
    this.addCommand(wysiwygCommands_outdent);
    this.addCommand(wysiwygCommands_task);
    this.addCommand(wysiwygCommands_table);
    this.addCommand(tableAddRow);
    this.addCommand(tableAddCol);
    this.addCommand(tableRemoveRow);
    this.addCommand(tableRemoveCol);
    this.addCommand(tableAlignCol);
    this.addCommand(tableRemove);
    this.addCommand(wysiwygCommands_code);
    this.addCommand(wysiwygCommands_codeBlock);
    this.addCommand(wysiwygCommands_strike);
  };

  _proto.addCommand = function addCommand(type, props) {
    if (!props) {
      this.commandManager.addCommand(type);
    } else {
      this.commandManager.addCommand(commandManager["a" /* default */].command(type, props));
    }
  }
  /**
   * After added command.
   */
  ;

  _proto.afterAddedCommand = function afterAddedCommand() {
    this.eventManager.emit('afterAddedCommand', this);
  }
  /**
   * Bind eventHandler to event type
   * @param {string} type Event type
   * @param {function} handler Event handler
   */
  ;

  _proto.on = function on(type, handler) {
    this.eventManager.listen(type, handler);
  }
  /**
   * Unbind eventHandler from event type
   * @param {string} type Event type
   */
  ;

  _proto.off = function off(type) {
    this.eventManager.removeEventHandler(type);
  }
  /**
   * Add hook to TUIEditor event
   * @param {string} type Event type
   * @param {function} handler Event handler
   */
  ;

  _proto.addHook = function addHook(type, handler) {
    this.eventManager.removeEventHandler(type);
    this.eventManager.listen(type, handler);
  }
  /**
   * Remove hook from TUIEditor event
   * @param {string} type Event type
   */
  ;

  _proto.removeHook = function removeHook(type) {
    this.eventManager.removeEventHandler(type);
  }
  /**
   * Get CodeMirror instance
   * @returns {CodeMirror}
   */
  ;

  _proto.getCodeMirror = function getCodeMirror() {
    return this.mdEditor.getEditor();
  }
  /**
   * Get SquireExt instance
   * @returns {SquireExt}
   */
  ;

  _proto.getSquire = function getSquire() {
    return this.wwEditor.getEditor();
  }
  /**
   * Set focus to current Editor
   */
  ;

  _proto.focus = function focus() {
    this.getCurrentModeEditor().focus();
  }
  /**
   * Remove focus of current Editor
   */
  ;

  _proto.blur = function blur() {
    this.getCurrentModeEditor().blur();
  }
  /**
   * Set cursor position to end
   */
  ;

  _proto.moveCursorToEnd = function moveCursorToEnd() {
    this.getCurrentModeEditor().moveCursorToEnd();
  }
  /**
   * Set cursor position to start
   */
  ;

  _proto.moveCursorToStart = function moveCursorToStart() {
    this.getCurrentModeEditor().moveCursorToStart();
  }
  /**
   * Set markdown syntax text.
   * @param {string} markdown - markdown syntax text.
   * @param {boolean} [cursorToEnd=true] - move cursor to contents end
   */
  ;

  _proto.setMarkdown = function setMarkdown(markdown, cursorToEnd) {
    if (cursorToEnd === void 0) {
      cursorToEnd = true;
    }

    markdown = markdown || '';

    if (this.isMarkdownMode()) {
      this.mdEditor.setValue(markdown, cursorToEnd);
    } else {
      this.wwEditor.setValue(this.convertor.toHTML(markdown), cursorToEnd);
    }

    this.eventManager.emit('setMarkdownAfter', markdown);
  }
  /**
   * Set html value.
   * @param {string} html - html syntax text
   * @param {boolean} [cursorToEnd=true] - move cursor to contents end
   */
  ;

  _proto.setHtml = function setHtml(html, cursorToEnd) {
    if (cursorToEnd === void 0) {
      cursorToEnd = true;
    }

    html = html || '';
    this.wwEditor.setValue(html, cursorToEnd);

    if (this.isMarkdownMode()) {
      var markdown = this.convertor.toMarkdown(this.wwEditor.getValue(), this.toMarkOptions);
      this.mdEditor.setValue(markdown, cursorToEnd);
      this.eventManager.emit('setMarkdownAfter', markdown);
    }
  }
  /**
   * Get markdown syntax text.
   * @returns {string}
   */
  ;

  _proto.getMarkdown = function getMarkdown() {
    var markdown;

    if (this.isMarkdownMode()) {
      markdown = this.mdEditor.getValue();
    } else {
      markdown = this.convertor.toMarkdown(this.wwEditor.getValue(), this.toMarkOptions);
    }

    return markdown;
  }
  /**
   * Get html syntax text.
   * @returns {string}
   */
  ;

  _proto.getHtml = function getHtml() {
    if (this.isWysiwygMode()) {
      this.mdEditor.setValue(this.convertor.toMarkdown(this.wwEditor.getValue(), this.toMarkOptions));
    }

    return this.convertor.toHTML(this.mdEditor.getValue());
  }
  /**
   * Insert text
   * @param {string} text - text string to insert
   */
  ;

  _proto.insertText = function insertText(text) {
    if (this.isMarkdownMode()) {
      this.mdEditor.replaceSelection(text);
    } else {
      this.wwEditor.insertText(text);
    }
  }
  /**
   * Add widget to selection
   * @param {Range} selection Current selection
   * @param {Node} node widget node
   * @param {string} style Adding style "over" or "bottom"
   * @param {number} [offset] Offset for adjust position
   */
  ;

  _proto.addWidget = function addWidget(selection, node, style, offset) {
    this.getCurrentModeEditor().addWidget(selection, node, style, offset);
  }
  /**
   * Set and return edithr height
   * @param {string} height - editor height
   * @returns {string} editor height
   */
  ;

  _proto.height = function height(_height) {
    if (isExisty_default()(_height)) {
      var el = this.options.el;

      if (_height === 'auto') {
        addClass_default()(el, 'auto-height');
        this.minHeight(this.minHeight());
      } else {
        removeClass_default()(el, 'auto-height');
        this.minHeight(_height);
      }

      if (isNumber_default()(_height)) {
        _height = _height + "px";
      }

      css_default()(this.options.el, {
        height: _height
      });
      this._height = _height;
    }

    return this._height;
  }
  /**
   * Set / Get min content height
   * @param {string} minHeight - min content height in pixel
   * @returns {string} - min height in pixel
   */
  ;

  _proto.minHeight = function minHeight(_minHeight) {
    if (isExisty_default()(_minHeight)) {
      var editorHeight = this._ui.getEditorHeight();

      var editorSectionHeight = this._ui.getEditorSectionHeight();

      var diffHeight = editorHeight - editorSectionHeight;
      this._minHeight = _minHeight;
      _minHeight = parseInt(_minHeight, 10);
      _minHeight = Math.max(_minHeight - diffHeight, 0);
      this.wwEditor.setMinHeight(_minHeight);
      this.mdEditor.setMinHeight(_minHeight);
      this.preview.setMinHeight(_minHeight);
    }

    return this._minHeight;
  }
  /**
   * Get current editor mode name
   * @returns {Object} MarkdownEditor or WysiwygEditor
   */
  ;

  _proto.getCurrentModeEditor = function getCurrentModeEditor() {
    var editor;

    if (this.isMarkdownMode()) {
      editor = this.mdEditor;
    } else {
      editor = this.wwEditor;
    }

    return editor;
  }
  /**
   * Return true if current editor mode is Markdown
   * @returns {boolean}
   */
  ;

  _proto.isMarkdownMode = function isMarkdownMode() {
    return this.currentMode === 'markdown';
  }
  /**
   * Return true if current editor mode is WYSIWYG
   * @returns {boolean}
   */
  ;

  _proto.isWysiwygMode = function isWysiwygMode() {
    return this.currentMode === 'wysiwyg';
  }
  /**
   * Return false
   * @returns {boolean}
   */
  ;

  _proto.isViewer = function isViewer() {
    return false;
  }
  /**
   * Get current Markdown editor's preview style
   * @returns {string}
   */
  ;

  _proto.getCurrentPreviewStyle = function getCurrentPreviewStyle() {
    return this.mdPreviewStyle;
  }
  /**
   * Change editor's mode to given mode string
   * @param {string} mode - Editor mode name of want to change
   * @param {boolean} [isWithoutFocus] - Change mode without focus
   */
  ;

  _proto.changeMode = function changeMode(mode, isWithoutFocus) {
    if (this.currentMode === mode) {
      return;
    }

    this.eventManager.emit('changeModeBefore', this.currentMode);
    this.currentMode = mode;

    if (this.isWysiwygMode()) {
      this.layout.switchToWYSIWYG();
      this.wwEditor.setValue(this.convertor.toHTML(this.mdEditor.getValue()), !isWithoutFocus);
      this.eventManager.emit('changeModeToWysiwyg');
    } else {
      this.layout.switchToMarkdown();
      this.mdEditor.resetState();
      this.mdEditor.setValue(this.convertor.toMarkdown(this.wwEditor.getValue(), this.toMarkOptions), !isWithoutFocus);
      this.getCodeMirror().refresh();
      this.eventManager.emit('changeModeToMarkdown');
    }

    this.eventManager.emit('changeMode', mode);

    if (!isWithoutFocus) {
      this.focus();
    }
  }
  /**
   * Remove TUIEditor from document
   */
  ;

  _proto.remove = function remove() {
    var self = this;
    var i = __nedInstance.length - 1;
    this.wwEditor.remove();
    this.mdEditor.remove();
    this.layout.remove();
    this.preview.remove();

    if (this.getUI()) {
      this.getUI().remove();
    }

    this.eventManager.emit('removeEditor');
    this.eventManager.events.forEach(function (value, key) {
      self.off(key);
    });
    this.eventManager = null;

    for (; i >= 0; i -= 1) {
      if (__nedInstance[i] === this) {
        __nedInstance.splice(i, 1);
      }
    }
  }
  /**
   * Hide TUIEditor
   */
  ;

  _proto.hide = function hide() {
    this.eventManager.emit('hide', this);
  }
  /**
   * Show TUIEditor
   */
  ;

  _proto.show = function show() {
    this.eventManager.emit('show', this);
    this.getCodeMirror().refresh();
  }
  /**
   * Scroll Editor content to Top
   * @param {number} value Scroll amount
   * @returns {number}
   */
  ;

  _proto.scrollTop = function scrollTop(value) {
    return this.getCurrentModeEditor().scrollTop(value);
  }
  /**
   * Set UI to private UI property
   * @param {UI} UI UI instance
   */
  ;

  _proto.setUI = function setUI(UI) {
    this._ui = UI;
  }
  /**
   * Get _ui property
   * @returns {DefaultUI|UI}
   */
  ;

  _proto.getUI = function getUI() {
    return this._ui;
  }
  /**
   * Reset TUIEditor
   */
  ;

  _proto.reset = function reset() {
    this.wwEditor.reset();
    this.mdEditor.reset();
  }
  /**
   * Get current range
   * @returns {{start, end}|Range}
   */
  ;

  _proto.getRange = function getRange() {
    return this.getCurrentModeEditor().getRange();
  }
  /**
   * Get text object of current range
   * @param {{start, end}|Range} range Range object of each editor
   * @returns {MdTextObject|WwTextObject} TextObject class
   */
  ;

  _proto.getTextObject = function getTextObject(range) {
    return this.getCurrentModeEditor().getTextObject(range);
  }
  /**
   * get selected text
   * @returns {string} - selected text
   */
  ;

  _proto.getSelectedText = function getSelectedText() {
    var range = this.getRange();
    var textObject = this.getTextObject(range);
    return textObject.getTextContent() || '';
  }
  /**
   * Set the placeholder on all editors
   * @param {string} placeholder - placeholder to set
   */
  ;

  _proto.setPlaceholder = function setPlaceholder(placeholder) {
    this.mdEditor.setPlaceholder(placeholder);
    this.wwEditor.setPlaceholder(placeholder);
  }
  /**
   * Set code block languages
   * @param {Array} languages - code language list
   */
  ;

  _proto.setCodeBlockLanguages = function setCodeBlockLanguages(languages) {
    var _this2 = this;

    if (languages === void 0) {
      languages = [];
    }

    languages.forEach(function (lang) {
      if (_this2.codeBlockLanguages.indexOf(lang) < 0) {
        _this2.codeBlockLanguages.push(lang);
      }
    });
    this.eventManager.emit('setCodeBlockLanguages', this.codeBlockLanguages);
  }
  /**
   * Get instance of TUIEditor
   * @returns {Array}
   */
  ;

  ToastUIEditor.getInstances = function getInstances() {
    return __nedInstance;
  }
  /**
   * Factory method for Editor
   * @param {object} options Option for initialize TUIEditor
   * @returns {object} ToastUIEditor or ToastUIEditorViewer
   */
  ;

  ToastUIEditor.factory = function factory(options) {
    var tuiEditor;

    if (options.viewer) {
      tuiEditor = new viewer["a" /* default */](options);
    } else {
      tuiEditor = new ToastUIEditor(options);
    }

    return tuiEditor;
  }
  /**
   * Set language
   * @param {string} code - code for I18N language
   * @param {object} data - language set
   */
  ;

  ToastUIEditor.setLanguage = function setLanguage(code, data) {
    i18n.setLanguage(code, data);
  };

  return ToastUIEditor;
}(); // (Not an official API)
// Create a function converting markdown to HTML using the internal parser and renderer.


editor_ToastUIEditor._createMarkdownToHTML = createMarkdownToHTML;
/**
 * Check whether is viewer (using in plugins)
 * @type {boolean}
 */

editor_ToastUIEditor.isViewer = false;
/**
 * CodeBlockManager instance using in plugins
 * @type {CodeBlockManager}
 * @ignore
 */

editor_ToastUIEditor.codeBlockManager = codeBlockManager["a" /* default */];
/**
 * WwCodeBlockManager class using in plugins
 * @type {Class.<WwCodeBlockManager>}
 * @ignore
 */

editor_ToastUIEditor.WwCodeBlockManager = wwCodeBlockManager;
/**
 * WwTableManager class using in plugins
 * @type {Class.<WwTableManager>}
 * @ignore
 */

editor_ToastUIEditor.WwTableManager = wwTableManager;
/**
 * WwTableManager class using in plugins
 * @type {Class.<WwTableSelectionManager>}
 * @ignore
 */

editor_ToastUIEditor.WwTableSelectionManager = wwTableSelectionManager;
/**
 * CommandManager class using in plugins
 * @type {Class.<CommandManager>}
 * @ignore
 */

editor_ToastUIEditor.CommandManager = commandManager["a" /* default */];
/* harmony default export */ var js_editor = (editor_ToastUIEditor);
// EXTERNAL MODULE: ./src/css/editor.css
var css_editor = __webpack_require__(50);

// EXTERNAL MODULE: ./src/css/contents.css
var css_contents = __webpack_require__(51);

// EXTERNAL MODULE: ./src/css/preview-highlighting.css
var preview_highlighting = __webpack_require__(41);

// EXTERNAL MODULE: ./src/css/md-syntax-highlighting.css
var md_syntax_highlighting = __webpack_require__(52);

// CONCATENATED MODULE: ./src/js/i18n/en-us.js
/**
 * @fileoverview I18N for English
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

js_editor.setLanguage(['en', 'en-US'], {
  Markdown: 'Markdown',
  WYSIWYG: 'WYSIWYG',
  Write: 'Write',
  Preview: 'Preview',
  Headings: 'Headings',
  Paragraph: 'Paragraph',
  Bold: 'Bold',
  Italic: 'Italic',
  Strike: 'Strike',
  Code: 'Inline code',
  Line: 'Line',
  Blockquote: 'Blockquote',
  'Unordered list': 'Unordered list',
  'Ordered list': 'Ordered list',
  Task: 'Task',
  Indent: 'Indent',
  Outdent: 'Outdent',
  'Insert link': 'Insert link',
  'Insert CodeBlock': 'Insert codeBlock',
  'Insert table': 'Insert table',
  'Insert image': 'Insert image',
  Heading: 'Heading',
  'Image URL': 'Image URL',
  'Select image file': 'Select image file',
  Description: 'Description',
  OK: 'OK',
  More: 'More',
  Cancel: 'Cancel',
  File: 'File',
  URL: 'URL',
  'Link text': 'Link text',
  'Add row': 'Add row',
  'Add col': 'Add col',
  'Remove row': 'Remove row',
  'Remove col': 'Remove col',
  'Align left': 'Align left',
  'Align center': 'Align center',
  'Align right': 'Align right',
  'Remove table': 'Remove table',
  'Would you like to paste as table?': 'Would you like to paste as table?',
  'Text color': 'Text color',
  'Auto scroll enabled': 'Auto scroll enabled',
  'Auto scroll disabled': 'Auto scroll disabled',
  'Choose language': 'Choose language'
});
// CONCATENATED MODULE: ./src/js/index.js
/**
 * @fileoverview entry point for editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */






/* harmony default export */ var js = __webpack_exports__["default"] = (js_editor);

/***/ })
/******/ ])["default"];
});