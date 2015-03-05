/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var NODE = {
    TEXT: 3,
    ELEMENT: 1
};

/**
 * ContentTracker
 * @exports ContentTracker
 * @constructor
 * @class
 * @param {jQuery} $el 탐색할 DOMElement
 */
function ContentTracker($el) {
    this.$el = $el;
    this.treeWalker = document.createTreeWalker(this.$el[0], NodeFilter.SHOW_TEXT, null, false);

    this._init();
}

/**
 * 배열로 offset을 넘거 해당 위치의 node정보를 가져온다.
 * 주의 할점은 offsetList의 숫자가 오름차순이어야 한다.
 * @param {number[]} offsetList offset숫자 배열
 * @returns {object[]}
 * 배열안의 객체 정보
 * node - 해당위치의 node
 * before - 해당위치 바로 이전의 node
 * offsetInNode - offset이 해당 node안에서 몇번째인지
 * offset - 전달받은 offset정보
 */
ContentTracker.prototype.getOffsetNodeInfo = function(offsetList) {
    var offsetToFind,
        trackInfo = [];

    offsetToFind = offsetList.shift();

    while (this.treeWalker.nextNode()) {
        this.beforeNode = this.currentNode;
        this.currentNode = this.treeWalker.currentNode;

        this._getCurrentNodeLen();

        while (this._isIndexHasOffset(offsetToFind)) {
            trackInfo.push(this._getOffsetInfo(offsetToFind));

            if (offsetList.length) {
                offsetToFind = offsetList.shift();
            } else {
                this._reset();
                return trackInfo;
            }
        }

        this.index += this.currentNodeLength;
    }

    //에디팅영역이 비어잇음
    //todo 메서드 분리
    do {
        trackInfo.push({
            offset: 0,
            node: this.$el[0],
            before: null,
            offsetInNode: 0
        });

        offsetToFind = offsetList.shift();
    } while (offsetToFind);

    this._reset();

    return trackInfo;
};

/**
 * 배열로 node들을 넘거 해당 node의 offset위치를 구한다.
 * nodeList의 node의 순서가 document상에서 위에서 아래방향 이어야한다.
 * @param {node} nodeList 노드들이 담긴 배열
 * @returns {number[]} offset목록이 담긴 배열
 */
ContentTracker.prototype.getNodeOffset = function(nodeList) {
    var nodeToFind,
        trackInfo = [];

    nodeToFind = nodeList.shift();

    while (this.treeWalker.nextNode()) {
        this.beforeNode = this.currentNode;
        this.currentNode = this.treeWalker.currentNode;

        while (this.currentNode === nodeToFind) {
            trackInfo.push(this._getOffsetInfo(this.index));

            if (nodeList.length) {
                nodeToFind = nodeList.shift();
            } else {
                this._reset();
                return trackInfo;
            }
        }

        this._getCurrentNodeLen();
        this.index += this.currentNodeLength;
    }

    //에디팅영역이 비어잇음
    //todo 메서드 분리
    do {
        trackInfo.push({
            offset: 0,
            node: this.$el[0],
            before: null,
            offsetInNode: 0
        });

        nodeToFind = nodeList.shift();
    } while (nodeToFind);

    this._reset();

    return trackInfo;
};


ContentTracker.prototype._init = function() {
    this.offsetToFind = 0;
    this.index = 0;
    this.currentNode = null;
    this.beforeNode = null;
    this.currentNodeLength = 0;
};

ContentTracker.prototype._reset = function() {
    this._init();
    this.treeWalker.currentNode = this.treeWalker.root;
};

ContentTracker.prototype._getOffsetInfo = function(offsetToFind) {
    var info = {},
        offsetAfterNodeLen = this.index + this.currentNodeLength - offsetToFind;

    info.offset = offsetToFind;
    info.node = this.currentNode;
    info.before = this.beforeNode;
    info.offsetInNode = this.currentNodeLength - offsetAfterNodeLen;

    return info;
};

ContentTracker.prototype._isIndexHasOffset = function(offset) {
    var result,
        bound = this.index + this.currentNodeLength;

    //해당 NODE가 LF를 가지고있으면 LF 캐릭터는 제외하고 계산한다
    //LF를 가지고 있지 않은 경우(마지막라인, 텍스트노드와 개행노드가 분리된경우)
    //LF가 없으므로 offset을 판단하는 조건이 바뀐다.
    if (this._isNodeHasLf(this.currentNode)) {
        result = bound > offset;
    } else {
        result = bound >= offset;
    }

    return result;
};

ContentTracker.prototype._isNodeHasLf = function(node) {
    return node && node.nodeValue[node.nodeValue.length - 1] === '\n';
};

ContentTracker.prototype._getCurrentNodeLen = function() {
    if (this.currentNode.nodeType === NODE.TEXT) {
        this.currentNodeLength = this._getTextNodeLen(this.currentNode);
    }
};

ContentTracker.prototype._getTextNodeLen = function(node) {
    return node.nodeValue.length;
};

/**
 * deprecated!
 * 배열로 node들을 넘거 해당 node의 offset위치를 구한다.
 * @param {node} nodeList 노드들이 담긴 배열
 * @returns {number[]} offset목록이 담긴 배열
 */
ContentTracker.prototype._getNodeOffset = function(nodeList) {
    var node,
        container,
        offset,
        contentEl = this.$el[0],
        offsetList = [];

    while (nodeList.length) {
        node = nodeList.shift();

        offset = 0;

        if ((contentEl.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) || contentEl === node) {
            container = node;

            while (node !== contentEl) {
                while (node.previousSibling) {
                    node = node.previousSibling;

                    if (node.textContent) {
                        offset += node.textContent.length;
                    }
                }

                node = container = container.parentNode;
            }

            offsetList.push(offset);
        }
    }

    return offsetList;
};

module.exports = ContentTracker;
