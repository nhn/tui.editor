/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var FIND_ZWB = /\u200B/g;

var util = tui.util;

/**
 * isTextNode
 * Check if node is text node
 * @param {Node} node node to check
 * @returns {boolean} result
 */
var isTextNode = function(node) {
    return node && node.nodeType === Node.TEXT_NODE;
};

/**
 * isElemNode
 * Check if node is element node
 * @param {Node} node node to check
 * @returns {boolean} result
 */
var isElemNode = function(node) {
    return node && node.nodeType === Node.ELEMENT_NODE;
};

/**
 * getNodeName
 * Get node name of node
 * @param {Node} node node
 * @returns {string} node name
 */
var getNodeName = function(node) {
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
 */
var getTextLength = function(node) {
    var len;

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
 */
var getOffsetLength = function(node) {
    var len;

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
 */
var getNodeOffsetOfParent = function(node) {
    var i, t, found,
        childNodesOfParent = node.parentNode.childNodes;

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
 */
var getChildNodeByOffset = function(node, index) {
    var currentNode;

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
 */
var getNodeWithDirectionUntil = function(direction, node, untilNodeName) {
    var directionKey = direction + 'Sibling',
        nodeName, foundedNode;


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
 * 인덱스에 해당하는 차일드 노드의 이전 노드를 찾는다.
 * @param {Node} node node
 * @param {number} index offset index
 * @param {string} untilNodeName parent node name to limit
 * @returns {Node} founded node
 */
var getPrevOffsetNodeUntil = function(node, index, untilNodeName) {
    var prevNode;

    if (index > 0) {
        prevNode = getChildNodeByOffset(node, index - 1);
    } else {
        prevNode = getNodeWithDirectionUntil('previous', node, untilNodeName);
    }

    return prevNode;
};

var getParentUntilBy = function(node, condition) {
    var foundedNode;

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
 */
var getParentUntil = function(node, untilNode) {
    var foundedNode;

    if (util.isString(untilNode)) {
        foundedNode = getParentUntilBy(node, function(targetNode) {
            return untilNode === getNodeName(targetNode);
        });
    } else {
        foundedNode = getParentUntilBy(node, function(targetNode) {
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
 */
var getNodeWithDirectionUnderParent = function(direction, node, underNode) {
    var directionKey = direction + 'Sibling',
        foundedNode;

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
 */
var getTopPrevNodeUnder = function(node, underNode) {
    return getNodeWithDirectionUnderParent('previous', node, underNode);
};

/**
 * getNextTopBlockNode
 * get next top level block node
 * @param {Node} node node
 * @param {Node} underNode underNode
 * @returns {Node} founded node
 */
var getTopNextNodeUnder = function(node, underNode) {
    return getNodeWithDirectionUnderParent('next', node, underNode);
};

/**
 * Get parent element the body element
 * @param {Node} node Node for start searching
 * @returns {Node}
 */
var getTopBlockNode = function(node) {
    return getParentUntil(node, 'BODY');
};

/**
 * Get previous text node
 * @param {Node} node Node for start searching
 * @returns {Node}
 */
var getPrevTextNode = function(node) {
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
 */
var findOffsetNode = function(root, offsetList, textNodeFilter) {
    var result = [],
        text = '',
        walkerOffset = 0,
        offset, walker, newWalkerOffset;

    if (!offsetList.length) {
        return result;
    }

    offset = offsetList.shift();
    walker = document.createTreeWalker(root, 4, null, false);

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

    //오프셋에 해당하는 컨텐츠가 없는경우 컨텐츠 맨마지막으로 통일
    //중간에 return으로 빠져나가지 않고 여기까지 왔다는것은 남은 offset이 있는것임
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

var getNodeInfo = function(node) {
    var path = {};
    var className;

    path.tagName = node.nodeName;

    if (node.id) {
        path.id = node.id;
    }

    className = node.className.trim();

    if (className) {
        path.className = className;
    }

    return path;
};

var getPath = function(node, root) {
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
 * Find next TR's TD element by given TD and it's offset
 * @param {HTMLElement} node TD element
 * @param {boolean} [needFirstTd] Boolean value for find first TD in next line
 * @returns {HTMLElement|null}
 */
var nextLineTableCell = function(node, needFirstTd) {
    var index = 0;
    var nextLineTrElement, nextLineTdElement, theadElement;

    if (node) {
        if (!needFirstTd) {
            while (node.previousElementSibling) {
                node = node.previousElementSibling;
                index += 1;
            }
        }

        nextLineTrElement = node.parentNode.nextSibling;
        theadElement = $(node).parents('thead')[0];

        if (nextLineTrElement) {
            nextLineTdElement = nextLineTrElement.childNodes[index];
        } else if (theadElement && theadElement.nextElementSibling.tagName === 'TBODY') {
            nextLineTdElement = $(theadElement.nextElementSibling).find('td')[index];
        }

        if (nextLineTdElement && nextLineTdElement.tagName === 'TD') {
            return nextLineTdElement;
        }
    }

    return null;
};

/**
 * Find next TD or TH element by given TE element
 * @param {HTMLElement} node TD element
 * @returns {HTMLElement|null}
 */
var nextTableCell = function(node) {
    var nextElement;

    nextElement = node.nextElementSibling;

    if (nextElement && (nextElement.nodeName === 'TD' || nextElement.nodeName === 'TH')) {
        return nextElement;
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
    getNodInfo: getNodeInfo,
    nextLineTableCell: nextLineTableCell,
    nextTableCell: nextTableCell
};
