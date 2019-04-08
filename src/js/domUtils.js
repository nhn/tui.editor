/**
 * @fileoverview DOM Utils
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
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
 * Check that the node is block node
 * @param {Node} node node
 * @returns {boolean}
 * @ignore
 */
const isBlockNode = function(node) {
  return /^(ADDRESS|ARTICLE|ASIDE|BLOCKQUOTE|DETAILS|DIALOG|DD|DIV|DL|DT|FIELDSET|FIGCAPTION|FIGURE|FOOTER|FORM|H[\d]|HEADER|HGROUP|HR|LI|MAIN|NAV|OL|P|PRE|SECTION|UL)$/ig.test(this.getNodeName(node));
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

const getParentUntilBy = function(node, matchCondition, stopCondition) {
  let foundedNode;

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
 * test whether root contains the given node
 * @param {HTMLNode} root - root node
 * @param {HTMLNode} node - node to test
 * @returns {Boolean} true if root contains node
 */
const containsNode = function(root, node) {
  const walker = document.createTreeWalker(root, 4, null, false);
  let found = root === node;

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
 * @param {string} direction 'next' or 'previous'
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

/**
 * Check that the inline node is supported by markdown
 * @param {Node} node TD element
 * @returns {boolean}
 * @ignore
 */
const isMDSupportInlineNode = function(node) {
  return /^(A|B|BR|CODE|DEL|EM|I|IMG|S|SPAN|STRONG)$/ig.test(node.nodeName);
};

/**
 * Check that node is styled node.
 * Styled node is a node that has text and decorates text.
 * @param {Node} node TD element
 * @returns {boolean}
 * @ignore
 */
const isStyledNode = function(node) {
  return /^(A|ABBR|ACRONYM|B|BDI|BDO|BIG|CITE|CODE|DEL|DFN|EM|I|INS|KBD|MARK|Q|S|SAMP|SMALL|SPAN|STRONG|SUB|SUP|U|VAR)$/ig.test(node.nodeName);
};

/**
 * remove node from 'start' node to 'end-1' node inside parent
 * if 'end' node is null, remove all child nodes after 'start' node.
 * @param {Node} parent - parent node
 * @param {Node} start - start node to remove
 * @param {Node} end - end node to remove
 * @ignore
 */
const removeChildFromStartToEndNode = function(parent, start, end) {
  let child = start;

  if (!child || parent !== child.parentNode) {
    return;
  }

  while (child !== end) {
    const next = child.nextSibling;
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
const removeNodesByDirection = function(targetParent, node, isForward) {
  let parent = node;

  while (parent !== targetParent) {
    const nextParent = parent.parentNode;
    const {nextSibling, previousSibling} = parent;

    if (!isForward && nextSibling) {
      removeChildFromStartToEndNode(nextParent, nextSibling, null);
    } else if (isForward && previousSibling) {
      removeChildFromStartToEndNode(nextParent, nextParent.childNodes[0], parent);
    }

    parent = nextParent;
  }
};

const getLeafNode = function(node) {
  let result = node;
  while (result.childNodes && result.childNodes.length) {
    const {firstChild: nextLeaf} = result;

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
const isInsideTaskBox = function(style, offsetX, offsetY) {
  const rect = {
    left: parseInt(style.left, 10),
    top: parseInt(style.top, 10),
    width: parseInt(style.width, 10),
    height: parseInt(style.height, 10)
  };

  return offsetX >= rect.left
    && offsetX <= (rect.left + rect.width)
    && offsetY >= rect.top
    && offsetY <= (rect.top + rect.height);
};

export default {
  getNodeName,
  isTextNode,
  isElemNode,
  isBlockNode,
  getTextLength,
  getOffsetLength,
  getPrevOffsetNodeUntil,
  getNodeOffsetOfParent,
  getChildNodeByOffset,
  containsNode,
  getTopPrevNodeUnder,
  getTopNextNodeUnder,
  getParentUntilBy,
  getParentUntil,
  getTopBlockNode,
  getPrevTextNode,
  findOffsetNode,
  getPath,
  getNodeInfo,
  getTableCellByDirection,
  getSiblingRowCellByDirection,
  isMDSupportInlineNode,
  isStyledNode,
  removeChildFromStartToEndNode,
  removeNodesByDirection,
  getLeafNode,
  isInsideTaskBox
};
