/*!
 * @toast-ui/editor
 * @version 2.5.1 | Tue Nov 24 2020
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Editor"] = factory();
	else
		root["toastui"] = root["toastui"] || {}, root["toastui"]["Editor"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = 60);
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
var map = __webpack_require__(23);

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
/* 11 */,
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
/* 15 */,
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
/* 24 */
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
/* 25 */
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
 * @version 1.0.1 | Tue Nov 24 2020
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
/* harmony import */ var _scroll_cache_offsetInfo__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(24);
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
        startEl.insertAdjacentHTML('beforebegin', newHtml);
        var el = startEl;

        while (el !== endEl) {
          var nextEl = el.nextElementSibling;
          el.parentNode.removeChild(el);
          Object(_scroll_cache_offsetInfo__WEBPACK_IMPORTED_MODULE_9__[/* removeOffsetInfoByNode */ "c"])(el);
          el = nextEl;
        }

        if (el.parentNode) {
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
/* harmony import */ var _utils_map__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(23);
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
    return result.join('\n');
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
/* 41 */,
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
/* harmony import */ var _htmlSanitizer__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(25);
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
/* 47 */,
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
/* 50 */,
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _viewer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);
/* harmony import */ var _css_contents_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(51);
/* harmony import */ var _css_contents_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_contents_css__WEBPACK_IMPORTED_MODULE_1__);
/**
 * @fileoverview entry point for viewer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */


/* harmony default export */ __webpack_exports__["default"] = (_viewer__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"]);

/***/ })
/******/ ])["default"];
});