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

        while (this._isIndexOverOffset(offsetToFind)) {
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

    //todo 비어있을 때의 처리 비어있다는건 마지막 라인일수 있다 마지막 라인은 개행문자가 없이 끝날수 있다.
    //마지막 라인 맨끝일 경우의 처리
};


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

        /*
        if (node.nodeType === NODE.ELEMENT) {
            if (node.innerHTML === '<br>') {
                offset = 1;
            }
        } else {
            offset = 0;
        }
        */

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

ContentTracker.prototype._isIndexOverOffset = function(offset) {
    return this.index + this.currentNodeLength > offset;
};

ContentTracker.prototype._getCurrentNodeLen = function() {
    if (this.currentNode.nodeType === NODE.TEXT) {
        this.currentNodeLength = this._getTextNodeLen(this.currentNode);
    }
};

ContentTracker.prototype._getTextNodeLen = function(node) {
    return node.nodeValue.length;
};

module.exports = ContentTracker;
