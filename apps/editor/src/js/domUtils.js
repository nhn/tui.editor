/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

/**
 * isTextNode
 * Check if node is text node
 * @param {Node} node node to check
 * @return {boolean} result
 */
var isTextNode = function(node) {
    return node && node.nodeType === Node.TEXT_NODE;
};

/**
 * isElemNode
 * Check if node is element node
 * @param {Node} node node to check
 * @return {boolean} result
 */
var isElemNode = function(node) {
    return node && node.nodeType === Node.ELEMENT_NODE;
};

/**
 * getChildNodeAt
 * Get child node in given parent and index
 * @param {HTMLElement} elem parent element
 * @param {number} index node index
 * @return {Node} child
 */
var getChildNodeAt = function(elem, index) {
    if (elem.childNodes.length && index >= 0) {
        return elem.childNodes[index];
    }
};

/**
 * getNodeName
 * Get node name of node
 * @param {Node} node node
 * @return {string} node name
 */
var getNodeName = function(node) {
    if (isElemNode(node)) {
        return node.tagName;
    } else if (isTextNode(node)) {
        return 'TEXT';
    }
};

/**
 * getTextLength
 * Get node offset length of node(for Range API)
 * @param {Node} node node
 * @return {number} length
 */
var getTextLength = function(node) {
    var len;

    if (isElemNode(node)) {
       len = node.textContent.length;
    } else if (isTextNode(node)) {
       len = node.nodeValue.length;
    }

    return len;
};

/**
 * getOffsetLength
 * Get node offset length of node(for Range API)
 * @param {Node} node node
 * @return {number} length
 */
var getOffsetLength = function(node) {
    var len;

    if (isElemNode(node)) {
       len = node.childNodes.length;
    } else if (isTextNode(node)) {
       len = node.nodeValue.length;
    }

    return len;
};

var getNodeOffsetOfParent = function(node) {
    var i, t,
        childNodesOfParent = node.parentNode.childNodes;

    for (i = 0, t = childNodesOfParent.length; i < t; i+=1) {
        if (childNodesOfParent[i] === node) {
            return i;
        }
    }
};


var _getNodeWithDirectionUntil = function(direction, node, untilNodeName) {
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

var getPrevOffsetNodeUntil = function(node, index, untilNodeName) {
    var prevNode;

    if (index > 0) {
        if (isTextNode(node)) {
            prevNode = node;
        } else {
            prevNode = node.childNodes[index - 1];
        }
    } else {
        prevNode = _getNodeWithDirectionUntil('previous', node, untilNodeName);
    }

    return prevNode;
};

var getNodeByOffset = function(node, index) {
    var currentNode;

    if (isTextNode(node)) {
        currentNode = node;
    } else {
        currentNode = node.childNodes[index];
    }

    return currentNode;
};

module.exports = {
    getChildNodeAt: getChildNodeAt,
    getNodeName: getNodeName,
    isTextNode: isTextNode,
    isElemNode: isElemNode,
    getTextLength: getTextLength,
    getOffsetLength: getOffsetLength,
    getPrevOffsetNodeUntil: getPrevOffsetNodeUntil,
    getNodeOffsetOfParent: getNodeOffsetOfParent,
    getNodeByOffset: getNodeByOffset
};
