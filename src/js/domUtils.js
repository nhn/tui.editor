/**
 * @fileoverview DOM Utils
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

const FIND_ZWB = /\u200B/g;

/**
 * isTextNode
 * Check if node is text node
 * @param {Node} node node to check
 * @returns {boolean} result
 * @ignore
 */
const isTextNode = function(node) {
  return node && node.nodeType === Node.TEXT_NODE;
};

/**
 * isElemNode
 * Check if node is element node
 * @param {Node} node node to check
 * @returns {boolean} result
 * @ignore
 */
const isElemNode = function(node) {
  return node && node.nodeType === Node.ELEMENT_NODE;
};

/**
 * getNodeName
 * Get node name of node
 * @param {Node} node node
 * @returns {string} node name
 * @ignore
 */
const getNodeName = function(node) {
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
const getTextLength = function(node) {
  let len;

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
const getOffsetLength = function(node) {
  let len;

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
const getNodeOffsetOfParent = function(node) {
  const childNodesOfParent = node.parentNode.childNodes;
  let i, t, found;

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
const getChildNodeByOffset = function(node, index) {
  let currentNode;

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
 * @param {strong} direction previous or next
 * @param {Node} node node
 * @param {string} untilNodeName parent node name to limit
 * @returns {Node} founded node
 * @ignore
 */
const getNodeWithDirectionUntil = function(direction, node, untilNodeName) {
  const directionKey = `${direction}Sibling`;
  let nodeName, foundedNode;

  while (node && !node[directionKey]) {
    nodeName = getNodeName(node.parentNode);

    if ((nodeName === untilNodeName)
            || nodeName === 'BODY'
    ) {
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
 * @param {Node} node node
 * @param {number} index offset index
 * @param {string} untilNodeName parent node name to limit
 * @returns {Node} founded node
 * @ignore
 */
const getPrevOffsetNodeUntil = function(node, index, untilNodeName) {
  let prevNode;

  if (index > 0) {
    prevNode = getChildNodeByOffset(node, index - 1);
  } else {
    prevNode = getNodeWithDirectionUntil('previous', node, untilNodeName);
  }

  return prevNode;
};

const getParentUntilBy = function(node, condition) {
  let foundedNode;

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
 * @param {Node} node node
 * @param {string|HTMLNode} untilNode node name or node to limit
 * @returns {Node} founded node
 * @ignore
 */
const getParentUntil = function(node, untilNode) {
  let foundedNode;

  if (util.isString(untilNode)) {
    foundedNode = getParentUntilBy(node, targetNode => untilNode === getNodeName(targetNode));
  } else {
    foundedNode = getParentUntilBy(node, targetNode => untilNode === targetNode);
  }

  return foundedNode;
};

/**
 * getNodeWithDirectionUnderParent
 * get node on the given direction under given parent
 * @param {strong} direction previous or next
 * @param {Node} node node
 * @param {string|Node} underNode parent node name to limit
 * @returns {Node} founded node
 * @ignore
 */
const getNodeWithDirectionUnderParent = function(direction, node, underNode) {
  const directionKey = `${direction}Sibling`;
  let foundedNode;

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
const getTopPrevNodeUnder = function(node, underNode) {
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
const getTopNextNodeUnder = function(node, underNode) {
  return getNodeWithDirectionUnderParent('next', node, underNode);
};

/**
 * Get parent element the body element
 * @param {Node} node Node for start searching
 * @returns {Node}
 * @ignore
 */
const getTopBlockNode = function(node) {
  return getParentUntil(node, 'BODY');
};

/**
 * Get previous text node
 * @param {Node} node Node for start searching
 * @returns {Node}
 * @ignore
 */
const getPrevTextNode = function(node) {
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
const findOffsetNode = function(root, offsetList, textNodeFilter) {
  const result = [];
  let text = '';
  let walkerOffset = 0;
  let newWalkerOffset;

  if (!offsetList.length) {
    return result;
  }

  let offset = offsetList.shift();
  const walker = document.createTreeWalker(root, 4, null, false);

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
        offset
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
      offset
    });
    offset = offsetList.shift();
  } while (!util.isUndefined(offset));

  return result;
};

const getNodeInfo = function(node) {
  const path = {};

  path.tagName = node.nodeName;

  if (node.id) {
    path.id = node.id;
  }

  const className = node.className.trim();

  if (className) {
    path.className = className;
  }

  return path;
};

const getPath = function(node, root) {
  const paths = [];

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
const getTableCellByDirection = function(node, direction) {
  let isForward = true;
  let targetElement = null;

  if (util.isUndefined(direction) || (direction !== 'next' && direction !== 'previous')) {
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
const getSiblingRowCellByDirection = function(node, direction, needEdgeCell) {
  let isForward = true;
  let tableCellElement = null;
  let $node, index, $targetRowElement, $currentContainer, $siblingContainer, isSiblingContainerExists;

  if (util.isUndefined(direction) || (direction !== 'next' && direction !== 'previous')) {
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

    if (util.isUndefined(needEdgeCell) || !needEdgeCell) {
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

export default {
  getNodeName,
  isTextNode,
  isElemNode,
  getTextLength,
  getOffsetLength,
  getPrevOffsetNodeUntil,
  getNodeOffsetOfParent,
  getChildNodeByOffset,
  getTopPrevNodeUnder,
  getTopNextNodeUnder,
  getParentUntil,
  getTopBlockNode,
  getPrevTextNode,
  findOffsetNode,
  getPath,
  getNodeInfo,
  getTableCellByDirection,
  getSiblingRowCellByDirection
};
