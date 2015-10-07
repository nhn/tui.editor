/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

/**
 * domUtils
 * @exports domUtils
 */

var isTextNode = function(node) {
    return node && node.nodeType === Node.TEXT_NODE;
};

var isElemNode = function(node) {
    return node && node.nodeType === Node.ELEMENT_NODE;
};

var getChildNodeAt = function(elem, index) {
    if (elem.childNodes.length && index >= 0) {
        return elem.childNodes[index];
    }
};

var getNodeName = function(node) {
    if (isElemNode(node)) {
        return node.tagName;
    } else if (isTextNode(node)) {
        return 'TEXT';
    }
};

var getTextLength = function(node) {
    var len;

    if (isElemNode(node)) {
       len = node.textContent.length;
    } else if (isTextNode(node)) {
       len = node.nodeValue.length;
    }

    return len;
};

var getOffsetLength = function(node) {
    var len;

    if (isElemNode(node)) {
       len = node.childNodes.length;
    } else if (isTextNode(node)) {
       len = node.nodeValue.length;
    }

    return len;
};

module.exports = {
    getChildNodeAt: getChildNodeAt,
    getNodeName: getNodeName,
    isTextNode: isTextNode,
    isElemNode: isElemNode,
    getTextLength: getTextLength,
    getOffsetLength: getOffsetLength
};
