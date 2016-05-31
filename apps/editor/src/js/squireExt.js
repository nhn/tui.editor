/**
 * @fileoverview Implements %filltext:name=Name%
 * @author
 */

'use strict';

var domUtils = require('./domUtils');

var Squire = window.Squire,
    util = tui.util;

var FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD)\b/;

var isIElt11 = /Trident\/[456]\./.test(navigator.userAgent);

/**
 * SquireExt
 * @exports SquireExt
 * @augments Squire
 * @constructor
 * @class
 */
function SquireExt() {
    Squire.apply(this, arguments);

    this._decorateHandlerToCancelable('copy');
    this._decorateHandlerToCancelable(isIElt11 ? 'beforepaste' : 'paste');
}

SquireExt.prototype = util.extend(
    {},
    Squire.prototype
);

SquireExt.prototype.get$Body = function() {
    this.$body = this.$body || $(this.getRoot());

    return this.$body;
};

/**
 * _decorateHandlerToCancelable
 * Decorate squire handler to cancelable cuz sometimes, we dont need squire handler process
 * @param {string} eventName event name
 */
SquireExt.prototype._decorateHandlerToCancelable = function(eventName) {
    var handlers, handler;

    handlers = this._events[eventName];

    if (handlers.length > 1) {
        throw new Error('too many' + eventName + ' handlers in squire');
    }

    handler = handlers[0].bind(this);

    handlers[0] = function decoratedSquireHandler(event) {
        if (!event.defaultPrevented) {
            handler(event);
        }
    };
};

SquireExt.prototype.changeBlockFormat = function(srcCondition, targetTagName) {
    var self = this;

    this.modifyBlocks(function(frag) {
        var current, newFrag, newBlock, nextBlock, tagName, lastNodeOfNextBlock, appendChidToNextBlock;

        //HR은 Block으로 치지 않아서 frag에나타나지 않는다
        //디폴트 블럭을 만들어준다.
        if (frag.childNodes.length) {
            current = frag.childNodes[0];
        } else {
            current = self.createDefaultBlock();
            frag.appendChild(current);
        }

        if (srcCondition) {
            //find last depth
            while (current.firstChild) {
                current = current.firstChild;
            }

            appendChidToNextBlock = function(node) {
                nextBlock.appendChild(node);
            };

            //find tag
            while (current !== frag) {
                tagName = current.tagName;

                if (util.isFunction(srcCondition) ? srcCondition(tagName) : (tagName === srcCondition)) {
                    nextBlock = current.childNodes[0];

                    //there is no next blocktag
                    //eslint-disable-next-line max-depth
                    if (!domUtils.isElemNode(nextBlock) || current.childNodes.length > 1) {
                        nextBlock = self.createDefaultBlock();

                        util.forEachArray(util.toArray(current.childNodes), appendChidToNextBlock);

                        lastNodeOfNextBlock = nextBlock.lastChild;

                        //remove unneccesary br
                        //eslint-disable-next-line max-depth
                        if (lastNodeOfNextBlock && domUtils.getNodeName(lastNodeOfNextBlock) === 'BR') {
                            nextBlock.removeChild(lastNodeOfNextBlock);
                        }
                    }

                    //eslint-disable-next-line max-depth
                    if (targetTagName) {
                        newBlock = self.createElement(targetTagName, [nextBlock]);
                    } else {
                        newBlock = nextBlock;
                    }

                    newFrag = self.getDocument().createDocumentFragment();
                    newFrag.appendChild(newBlock);

                    frag = newFrag;

                    break;
                }

                current = current.parentNode;
            }
        }

        //if source condition node is not founded, we wrap current div node with node named targetTagName
        if (
            (!newFrag || !srcCondition)
            && targetTagName
            && domUtils.getNodeName(frag.childNodes[0]) === 'DIV'
        ) {
            frag = self.createElement(targetTagName, [frag.childNodes[0]]);
        }

        return frag;
    });
};

SquireExt.prototype.changeBlockFormatTo = function(targetTagName) {
    this.changeBlockFormat(function(tagName) {
        return FIND_BLOCK_TAGNAME_RX.test(tagName);
    }, targetTagName);
};

//from http://jsfiddle.net/9ThVr/24/
SquireExt.prototype.getCaretPosition = function() {
    var range, sel, rect, range2, rect2,
        offsetx = 0,
        offsety = 0;

    var $node = this.getDocument().body,
        nodeLeft = $node.offsetLeft,
        nodeTop = $node.offsetTop;

    var pos = {left: 0, top: 0};

    sel = this.getSelection();
    range = sel.cloneRange();

    range.setStart(range.startContainer, range.startOffset - 1);
    rect = range.getBoundingClientRect();

    if (range.endOffset === 0 || range.toString() === '') {
        // first char of line
        if (range.startContainer === $node) {
            // empty div
            if (range.endOffset === 0) {
                pos.top = '0';
                pos.left = '0';
            } else {
                // firefox need this
                range2 = range.cloneRange();
                range2.setStart(range2.startContainer, 0);
                rect2 = range2.getBoundingClientRect();
                pos.left = rect2.left + offsetx - nodeLeft;
                pos.top = rect2.top + rect2.height + offsety - nodeTop;
            }
        } else {
            pos.top = range.startContainer.offsetTop;
            pos.left = range.startContainer.offsetLeft;
        }
    } else {
        pos.left = rect.left + rect.width + offsetx - nodeLeft;
        pos.top = rect.top + offsety - nodeTop;
    }
    return pos;
};

SquireExt.prototype.replaceSelection = function(content, selection) {
    if (selection) {
        this.setSelection(selection);
    }

    this._ignoreChange = true;
    this.insertHTML(content);
};

SquireExt.prototype.replaceRelativeOffset = function(content, offset, overwriteLength) {
    var selection;

    selection = this.getSelection().cloneRange();

    this._replaceRelativeOffsetOfSelection(content, offset, overwriteLength, selection);
};

SquireExt.prototype._replaceRelativeOffsetOfSelection = function(content, offset, overwriteLength, selection) {
    var startSelectionInfo, endSelectionInfo, finalOffset;
    var endOffsetNode = selection.endContainer;
    var endTextOffset = selection.endOffset;

    if (domUtils.getNodeName(endOffsetNode) !== 'TEXT') {
        endOffsetNode = this._getClosestTextNode(endOffsetNode, endTextOffset);

        if (endOffsetNode) {
            if (domUtils.isTextNode(endOffsetNode)) {
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

SquireExt.prototype._getClosestTextNode = function(node, offset) {
    var foundNode = domUtils.getChildNodeByOffset(node, offset - 1);

    if (domUtils.getNodeName(foundNode) !== 'TEXT') {
        foundNode = foundNode.previousSibling;
    }

    return foundNode;
};

SquireExt.prototype.getSelectionInfoByOffset = function(anchorElement, offset) {
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
        if (domUtils.isTextNode(traceElement)) {
            traceElementLength = traceElement.nodeValue.length;
        } else {
            traceElementLength = traceElement.textContent.length;
        }

        stepLength += traceElementLength;

        if (offsetAbs <= stepLength) {
            break;
        }

        traceOffset -= traceElementLength;

        if (domUtils.getTextLength(traceElement) > 0) {
            latestAvailableElement = traceElement;
        }

        traceElement = traceElement[direction + 'Sibling'];
    }

    if (!traceElement) {
        traceElement = latestAvailableElement;
        traceOffset = domUtils.getTextLength(traceElement);
    }

    if (direction === 'previous') {
        traceOffset = domUtils.getTextLength(traceElement) - traceOffset;
    }

    return {
        element: traceElement,
        offset: traceOffset
    };
};

SquireExt.prototype.getSelectionPosition = function(selection, style, offset) {
    var pos, range, endSelectionInfo,
        marker = this.createElement('INPUT');

    range = selection.cloneRange();

    range.setStart(range.startContainer, range.startOffset);
    endSelectionInfo = this.getSelectionInfoByOffset(selection.endContainer, selection.endOffset + (offset || 0));
    range.setEnd(endSelectionInfo.element, endSelectionInfo.offset);

    //to prevent squire input event fire
    this._ignoreChange = true;
    this.insertElement(marker, range);
    pos = $(marker).offset();

    if (style !== 'over') {
        pos.top += $(marker).outerHeight();
    }

    marker.parentNode.removeChild(marker);

    this.setSelection(selection);

    return pos;
};

SquireExt.prototype.recordUndoState = function(range) {
    if (!range) {
        range = this.getSelection();
    }
    this._recordUndoState(range);
    this._getRangeAndRemoveBookmark();
};

SquireExt.prototype.removeLastUndoStack = function() {
    if (this._undoStack.length) {
        this._undoStackLength -= 1;
        this._undoIndex -= 1;
        this._undoStack.pop();
        this._isInUndoState = false;
    }
};

SquireExt.prototype.replaceParent = function(node, from, to) {
    var target;
    target = $(node).closest(from);

    if (target.length) {
        target.wrapInner('<' + to + '/>');
        target.children().unwrap();
    }
};

SquireExt.prototype.preserveLastLine = function() {
    var lastBlock = this.get$Body().children().last();

    if (domUtils.getNodeName(lastBlock[0]) !== 'DIV') {
        this._ignoreChange = true;
        $(this.createDefaultBlock()).insertAfter(lastBlock);
    }
};

SquireExt.prototype.scrollTop = function(top) {
    if (util.isUndefined(top)) {
        return this.get$Body().scrollTop();
    }

    return this.get$Body().scrollTop(top);
};

SquireExt.prototype.isIgnoreChange = function() {
    return this._ignoreChange;
};

module.exports = SquireExt;
