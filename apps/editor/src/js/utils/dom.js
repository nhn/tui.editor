/**
 * @fileoverview DOM Utils
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';
import isUndefined from 'tui-code-snippet/type/isUndefined';
import isString from 'tui-code-snippet/type/isString';
import css from 'tui-code-snippet/domUtil/css';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';
import hasClass from 'tui-code-snippet/domUtil/hasClass';
import matches from 'tui-code-snippet/domUtil/matches';

const FIND_ZWB = /\u200B/g;
const { getComputedStyle } = window;

/**
 * Check if node is text node
 * @param {Node} node node to check
 * @returns {boolean} result
 * @ignore
 */
const isTextNode = function(node) {
  return node && node.nodeType === Node.TEXT_NODE;
};

/**
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
  return /^(ADDRESS|ARTICLE|ASIDE|BLOCKQUOTE|DETAILS|DIALOG|DD|DIV|DL|DT|FIELDSET|FIGCAPTION|FIGURE|FOOTER|FORM|H[\d]|HEADER|HGROUP|HR|LI|MAIN|NAV|OL|P|PRE|SECTION|UL)$/gi.test(
    this.getNodeName(node)
  );
};

/**
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
 * get parent node until paseed node name
 * @param {Node} node node
 * @param {string|HTMLNode} untilNode node name or node to limit
 * @returns {Node} founded node
 * @ignore
 */
const getParentUntil = function(node, untilNode) {
  let foundedNode;

  if (isString(untilNode)) {
    foundedNode = getParentUntilBy(node, targetNode => untilNode === getNodeName(targetNode));
  } else {
    foundedNode = getParentUntilBy(node, targetNode => untilNode === targetNode);
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
 * @param {HTMLNode|string} root - root node
 * @param {HTMLNode} found - node to test
 * @returns {Boolean} true if root contains node
 * @ignore
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
  } while (!isUndefined(offset));

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
  let targetElement = null;

  if (!isUndefined(direction) && (direction === 'next' || direction === 'previous')) {
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
const getSiblingRowCellByDirection = function(node, direction, needEdgeCell) {
  let tableCellElement = null;
  let index, targetRowElement, currentContainer, siblingContainer, isSiblingContainerExists;

  if (!isUndefined(direction) && (direction === 'next' || direction === 'previous')) {
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

      if (isUndefined(needEdgeCell) || !needEdgeCell) {
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
const isMDSupportInlineNode = function(node) {
  return /^(A|B|BR|CODE|DEL|EM|I|IMG|S|SPAN|STRONG)$/gi.test(node.nodeName);
};

/**
 * Check that node is styled node.
 * Styled node is a node that has text and decorates text.
 * @param {Node} node TD element
 * @returns {boolean}
 * @ignore
 */
const isStyledNode = function(node) {
  return /^(A|ABBR|ACRONYM|B|BDI|BDO|BIG|CITE|CODE|DEL|DFN|EM|I|INS|KBD|MARK|Q|S|SAMP|SMALL|SPAN|STRONG|SUB|SUP|U|VAR)$/gi.test(
    node.nodeName
  );
};

/**
 * remove node from 'start' node to 'end-1' node inside parent
 * if 'end' node is null, remove all child nodes after 'start' node.
 * @param {Node} parentNode - parent node
 * @param {Node} start - start node to remove
 * @param {Node} end - end node to remove
 * @ignore
 */
const removeChildFromStartToEndNode = function(parentNode, start, end) {
  let child = start;

  if (!child || parentNode !== child.parentNode) {
    return;
  }

  while (child !== end) {
    const nextNode = child.nextSibling;

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
const removeNodesByDirection = function(targetParent, node, isForward) {
  let parentNode = node;

  while (parentNode !== targetParent) {
    const nextParent = parentNode.parentNode;
    const { nextSibling, previousSibling } = parentNode;

    if (!isForward && nextSibling) {
      removeChildFromStartToEndNode(nextParent, nextSibling, null);
    } else if (isForward && previousSibling) {
      removeChildFromStartToEndNode(nextParent, nextParent.childNodes[0], parentNode);
    }

    parentNode = nextParent;
  }
};

const getLeafNode = function(node) {
  let result = node;

  while (result.childNodes && result.childNodes.length) {
    const { firstChild: nextLeaf } = result;

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

  return (
    offsetX >= rect.left &&
    offsetX <= rect.left + rect.width &&
    offsetY >= rect.top &&
    offsetY <= rect.top + rect.height
  );
};

/**
 * Check whether node is OL or UL
 * @param {node} node - node
 * @returns {boolean} - whether node is OL or UL
 * @ignore
 */
const isListNode = function(node) {
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
const isFirstListItem = function(node) {
  const { nodeName, parentNode } = node;

  return nodeName === 'LI' && node === parentNode.firstChild;
};

/**
 * Check whether node is first level list item
 * @param {node} node - node
 * @returns {boolean} whether node is first level list item
 * @ignore
 */
const isFirstLevelListItem = function(node) {
  const { nodeName, parentNode: listNode } = node;
  const { parentNode: listParentNode } = listNode;

  return nodeName === 'LI' && !isListNode(listParentNode);
};

/**
 * Merge node to target node and detach node
 * @param {node} node - node
 * @param {node} targetNode - target node
 * @ignore
 */
const mergeNode = function(node, targetNode) {
  if (node.hasChildNodes()) {
    toArray(node.childNodes).forEach(() => {
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
const createHorizontalRule = function() {
  const div = document.createElement('div');
  const hr = document.createElement('hr');

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
const createEmptyLine = function() {
  const div = document.createElement('div');

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
const changeTagOrder = function(node, tagName) {
  if (node.nodeName !== 'SPAN') {
    const { parentNode } = node;
    let tempNode = node;

    while (
      tempNode.childNodes &&
      tempNode.childNodes.length === 1 &&
      !isTextNode(tempNode.firstChild)
    ) {
      tempNode = tempNode.firstChild;

      if (tempNode.nodeName === 'SPAN') {
        break;
      }

      if (tempNode.nodeName === tagName) {
        const wrapper = document.createElement(tagName);

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
const mergeSameNodes = function(startNode, endNode, tagName) {
  const startBlockNode = changeTagOrder(startNode, tagName);

  if (startBlockNode.nodeName === tagName) {
    const endBlockNode = changeTagOrder(endNode, tagName);
    let mergeTargetNode = startBlockNode;
    let nextNode = startBlockNode.nextSibling;

    while (nextNode) {
      const tempNext = nextNode.nextSibling;

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
const optimizeRange = function(range, tagName) {
  const { collapsed, commonAncestorContainer, startContainer, endContainer } = range;

  if (!collapsed) {
    let optimizedNode = null;

    if (startContainer !== endContainer) {
      const startNode = getParentUntil(startContainer, commonAncestorContainer);
      const endNode = getParentUntil(endContainer, commonAncestorContainer);

      if (startNode && endNode) {
        mergeSameNodes(startNode, endNode, tagName);
      }

      optimizedNode = commonAncestorContainer;
    } else if (isTextNode(startContainer)) {
      optimizedNode = startContainer.parentNode;
    }

    if (optimizedNode && optimizedNode.nodeName === tagName) {
      const { previousSibling } = optimizedNode;
      let tempNode;

      if (previousSibling) {
        tempNode = changeTagOrder(previousSibling);

        if (tempNode.nodeName === tagName) {
          mergeNode(optimizedNode, tempNode);
        }
      }

      const { nextSibling } = optimizedNode;

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
const getAllTextNode = function(root) {
  const walker = document.createTreeWalker(root, 4, null, false);
  const result = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;

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
const isCellNode = function(node) {
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
const getLastNodeBy = function(node, condition) {
  let lastNode = node && node.lastChild;

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
const getParentNodeBy = function(node, condition) {
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
const getSiblingNodeBy = function(node, direction, condition) {
  const directionKey = `${direction}Sibling`;

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
  const container = document.createElement('div');

  if (isString(contents)) {
    container.innerHTML = contents;
  } else {
    container.appendChild(contents);
  }

  const { firstChild } = container;

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
  const nodeList = toArray(element.querySelectorAll(selector));

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
 * @returns {?Node} - found node
 * @ignore
 */
function closest(node, found) {
  let condition;

  if (isString(found)) {
    condition = target => matches(target, found);
  } else {
    condition = target => target === found;
  }

  while (node && node !== document) {
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
  const { parentNode } = node;

  if (selector) {
    return parentNode && matches(parentNode, selector) ? parentNode : null;
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
  const result = [];

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
  const result = [];

  while (node.parentNode && !matches(node.parentNode, selector)) {
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
  let foundChildren;

  if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    foundChildren = node.childNodes;
  } else {
    foundChildren = node.children;
  }

  return toArray(foundChildren).filter(child => matches(child, selector));
}

/**
 * Appends node(s) on target node
 * @param {Node} node - target node
 * @param {string|Node} appended - html string or node to append
 * @ignore
 */
function append(node, appended) {
  if (isString(appended)) {
    node.insertAdjacentHTML('beforeEnd', appended);
  } else {
    appended = appended.length ? toArray(appended) : [appended];

    for (let i = 0, len = appended.length; i < len; i += 1) {
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
  if (isString(appended)) {
    node.insertAdjacentHTML('afterBegin', appended);
  } else {
    appended = appended.length ? toArray(appended) : [appended];

    for (let i = appended.length - 1, len = 0; i >= len; i -= 1) {
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
  const { parentNode } = node;

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
  const { parentNode } = node;

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
  nodeList = nodeList.length ? toArray(nodeList) : [nodeList];

  nodeList.forEach(node => {
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
  nodeList = nodeList.length ? toArray(nodeList) : [nodeList];

  nodeList.forEach(node => {
    const wrapper = document.createElement(nodeName);

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
  nodeList = nodeList.length ? toArray(nodeList) : [nodeList];

  nodeList.forEach(node => {
    const wrapper = document.createElement(nodeName);

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
  const result = [];

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
  const { top, left } = element.parentNode.getBoundingClientRect();

  css(element, { top: `${offset.top - top - document.body.scrollTop}px` });
  css(element, { left: `${offset.left - left - document.body.scrollLeft}px` });
}

/**
 * Gets offset value of target element
 * @param {HTMLElement} element - target element
 * @param {string} [selector] - selector to stop finding node
 * @returns {Object.<string, number>} offset values
 * @ignore
 */
function getOffset(element, selector = 'document') {
  let top = 0;
  let left = 0;

  do {
    top += element.offsetTop || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while (element && !matches(element, selector));

  return { top, left };
}

/**
 * Gets outer width value of target element
 * @param {HTMLElement} element - target element
 * @param {boolean} includedMargin - whether to include margir or not
 * @returns {number} outer width value
 * @ignore
 */
function getOuterWidth(element, includedMargin) {
  let widthValue = element.offsetWidth;

  if (includedMargin) {
    const { marginLeft, marginRight } = getComputedStyle(element);

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
  let heightValue = element.offsetHeight;

  if (includedMargin) {
    const { marginTop, marginBottom } = getComputedStyle(element);

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
const toggleClass = (element, className, state) => {
  if (isUndefined(state)) {
    state = !hasClass(element, className);
  }
  const toggleFn = state ? addClass : removeClass;

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
  let result;

  if (needHtmlText) {
    result = html.innerHTML;
  } else {
    const frag = document.createDocumentFragment();
    const childNodes = toArray(html.childNodes);
    const { length } = childNodes;

    for (let i = 0; i < length; i += 1) {
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
  const fragment = document.createDocumentFragment();
  const texts = text.split('\n');

  texts.forEach((plainText, index) => {
    const textNode = document.createTextNode(plainText);

    fragment.appendChild(textNode);

    if (index < texts.length - 1) {
      fragment.appendChild(document.createElement('br'));
    }
  });

  return fragment;
}

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
  getNodeWithDirectionUntil,
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
  isInsideTaskBox,
  isListNode,
  isFirstListItem,
  isFirstLevelListItem,
  mergeNode,
  createHorizontalRule,
  createEmptyLine,
  changeTagOrder,
  mergeSameNodes,
  optimizeRange,
  getAllTextNode,
  isCellNode,
  getLastNodeBy,
  getParentNodeBy,
  getSiblingNodeBy,
  createElementWith,
  findAll,
  isContain,
  closest,
  parent,
  parents,
  parentsUntil,
  children,
  append,
  prepend,
  insertBefore,
  insertAfter,
  replaceWith,
  wrap,
  wrapInner,
  unwrap,
  remove,
  empty,
  setOffset,
  getOffset,
  getOuterWidth,
  getOuterHeight,
  toggleClass,
  finalizeHtml,
  getFragmentReplacedByNewlineToBr
};
