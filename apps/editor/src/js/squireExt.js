/**
 * @fileoverview Implements %filltext:name=Name%
 * @author
 */

'use strict';

var domUtils = require('./domUtils');

var Squire = window.Squire,
    util = tui.util;

var FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD)\b/;
/**
 * SquireExt
 * @exports SquireExt
 * @augments Squire
 * @constructor
 * @class
 */
function SquireExt() {
    Squire.apply(this, arguments);
}

SquireExt.prototype = util.extend(
    {},
    Squire.prototype
);

SquireExt.prototype.get$Body = function() {
    this.$body = this.$body || $(this.getDocument().body);
    return this.$body;
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
                    if (!domUtils.isElemNode(nextBlock) || current.childNodes.length > 1) {
                        nextBlock = self.createDefaultBlock();

                        util.forEachArray(util.toArray(current.childNodes), appendChidToNextBlock);

                        lastNodeOfNextBlock = nextBlock.lastChild;

                        //remove unneccesary br
                        if (lastNodeOfNextBlock && domUtils.getNodeName(lastNodeOfNextBlock) === 'BR') {
                            nextBlock.removeChild(lastNodeOfNextBlock);
                        }
                    }

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
    this.insertPlainText(content);
};

SquireExt.prototype.replaceRelativeOffset = function(content, offset, overwriteLength) {
    var selection;

    selection = this.getSelection().cloneRange();

    this._replaceRelativeOffsetOfSelection(content, offset, overwriteLength, selection);
};

SquireExt.prototype._replaceRelativeOffsetOfSelection = function(content, offset, overwriteLength, selection) {
    var endSelectionInfo, finalOffset;

    selection.setStart(selection.endContainer, selection.endOffset + offset);
    finalOffset = selection.endOffset + (offset + overwriteLength);
    endSelectionInfo = this.getSelectionInfoByOffset(selection.endContainer, finalOffset);
    selection.setEnd(endSelectionInfo.element, endSelectionInfo.offset);

    this.replaceSelection(content, selection);
};

SquireExt.prototype.getSelectionInfoByOffset = function(anchorElement, offset) {
    var traceElement, traceElementLength, traceOffset, stepLength, latestAvailableElement;

    traceElement = anchorElement;
    traceOffset = offset;
    stepLength = 0;

    while (traceElement) {
        traceElementLength = domUtils.getTextLength(traceElement);
        stepLength += traceElementLength;

        if (offset <= stepLength) {
            break;
        }

        traceOffset -= traceElementLength;

        if (domUtils.getTextLength(traceElement) > 0) {
            latestAvailableElement = traceElement;
        }

        traceElement = traceElement.nextSibling;
    }

    if (!traceElement) {
        traceElement = latestAvailableElement;
        traceOffset = domUtils.getTextLength(traceElement);
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

    pos.top -= this.get$Body().scrollTop();

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

module.exports = SquireExt;
