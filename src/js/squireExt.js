/**
 * @fileoverview Implements squire extension
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';
import Squire from 'squire-rte';

import domUtils from './domUtils';

const FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD)\b/;
const isIElt11 = /Trident\/[456]\./.test(navigator.userAgent);

/**
 * Class SquireExt
 * @extends {Squire}
 */
class SquireExt extends Squire {
  /**
   * Creates an instance of SquireExt.
   * @augments Squire
   * @memberof SquireExt
   */
  constructor(...args) {
    super(...args);

    this._decorateHandlerToCancelable('copy');
    this._decorateHandlerToCancelable(isIElt11 ? 'beforecut' : 'cut');
    this._decorateHandlerToCancelable(isIElt11 ? 'beforepaste' : 'paste');

    this.get$Body = () => {
      this.$body = this.$body || $(this.getRoot());

      return this.$body;
    };
  }

  /**
   * _decorateHandlerToCancelable
   * Decorate squire handler to cancelable cuz sometimes, we dont need squire handler process
   * event.preventDefault() will cancel squire and browser default behavior
   * event.squirePrevented = true will cancel squire but allow browser default behavior
   * @param {string} eventName event name
   * @private
   */
  _decorateHandlerToCancelable(eventName) {
    const handlers = this._events[eventName];

    if (handlers.length > 1) {
      throw new Error(`too many${eventName}handlers in squire`);
    }

    const handler = handlers[0].bind(this);

    handlers[0] = event => {
      if (!event.defaultPrevented && !event.squirePrevented) {
        handler(event);
      }
    };
  }

  changeBlockFormat(srcCondition, targetTagName) {
    this.modifyBlocks(frag => {
      let current, newFrag, newBlock, nextBlock, tagName, lastNodeOfNextBlock, appendChidToNextBlock;

      // HR is non-block element, so frag don't have it
      // make a default block
      if (frag.childNodes.length) {
        current = frag.childNodes.item(0);
      } else {
        current = this.createDefaultBlock();
        frag.appendChild(current);
      }

      if (srcCondition) {
        // find last depth
        while (current.firstChild) {
          current = current.firstChild;
        }

        appendChidToNextBlock = node => {
          nextBlock.appendChild(node);
        };

        // find tag
        while (current !== frag) {
          ({tagName} = current);

          if (util.isFunction(srcCondition) ? srcCondition(tagName) : (tagName === srcCondition)) {
            nextBlock = current.childNodes.item(0);

            // there is no next blocktag
            // eslint-disable-next-line max-depth
            if (!domUtils.isElemNode(nextBlock) || current.childNodes.length > 1) {
              nextBlock = this.createDefaultBlock();

              util.forEachArray(util.toArray(current.childNodes), appendChidToNextBlock);

              lastNodeOfNextBlock = nextBlock.lastChild;

              // remove unneccesary br
              // eslint-disable-next-line max-depth
              if (lastNodeOfNextBlock && domUtils.getNodeName(lastNodeOfNextBlock) === 'BR') {
                nextBlock.removeChild(lastNodeOfNextBlock);
              }
            }

            // eslint-disable-next-line max-depth
            if (targetTagName) {
              newBlock = this.createElement(targetTagName, [nextBlock]);
            } else {
              newBlock = nextBlock;
            }

            newFrag = this.getDocument().createDocumentFragment();
            newFrag.appendChild(newBlock);

            frag = newFrag;

            break;
          }

          current = current.parentNode;
        }
      }

      // if source condition node is not founded, we wrap current div node with node named targetTagName
      if (
        (!newFrag || !srcCondition)
                && targetTagName
                && domUtils.getNodeName(frag.childNodes[0]) === 'DIV'
      ) {
        frag = this.createElement(targetTagName, [frag.childNodes[0]]);
      }

      return frag;
    });
  }

  changeBlockFormatTo(targetTagName) {
    this.changeBlockFormat(tagName => FIND_BLOCK_TAGNAME_RX.test(tagName), targetTagName);
  }

  getCaretPosition() {
    return this.getCursorPosition();
  }

  replaceSelection(content, selection) {
    if (selection) {
      this.setSelection(selection);
    }

    this._ignoreChange = true;
    this.insertHTML(content);
  }

  replaceRelativeOffset(content, offset, overwriteLength) {
    const selection = this.getSelection().cloneRange();

    this._replaceRelativeOffsetOfSelection(content, offset, overwriteLength, selection);
  }

  _replaceRelativeOffsetOfSelection(content, offset, overwriteLength, selection) {
    let startSelectionInfo, endSelectionInfo, finalOffset;
    let endOffsetNode = selection.endContainer;
    let endTextOffset = selection.endOffset;

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
  }

  _getClosestTextNode(node, offset) {
    let foundNode = domUtils.getChildNodeByOffset(node, offset - 1);

    if (domUtils.getNodeName(foundNode) !== 'TEXT') {
      foundNode = foundNode.previousSibling;
    }

    return foundNode;
  }

  getSelectionInfoByOffset(anchorElement, offset) {
    let traceElement, traceElementLength, traceOffset, stepLength;
    const direction = offset >= 0 ? 'next' : 'previous';
    const offsetAbs = Math.abs(offset);
    let latestAvailableElement = traceElement;

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

      traceElement = traceElement[`${direction}Sibling`];
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
  }

  getSelectionPosition(selection, style, offset) {
    const marker = this.createElement('INPUT');
    const range = selection.cloneRange();
    const endSelectionInfo = this.getSelectionInfoByOffset(selection.endContainer,
      selection.endOffset + (offset || 0));
    range.setStart(range.startContainer, range.startOffset);
    range.setEnd(endSelectionInfo.element, endSelectionInfo.offset);

    // to prevent squire input event fire
    this._ignoreChange = true;
    this.insertElement(marker, range);

    const pos = $(marker).offset();

    if (style !== 'over') {
      pos.top += $(marker).outerHeight();
    }

    marker.parentNode.removeChild(marker);

    selection.setStart(selection.endContainer, selection.endOffset);
    selection.collapse(true);

    this.setSelection(selection);

    return pos;
  }

  removeLastUndoStack() {
    if (this._undoStack.length) {
      this._undoStackLength -= 1;
      this._undoIndex -= 1;
      this._undoStack.pop();
      this._isInUndoState = false;
    }
  }

  replaceParent(node, from, to) {
    const target = $(node).closest(from);

    if (target.length) {
      target.wrapInner(`<${to}/>`);
      target.children().unwrap();
    }
  }

  preserveLastLine() {
    const lastBlock = this.get$Body().children().last();

    if (domUtils.getNodeName(lastBlock[0]) !== 'DIV') {
      this._ignoreChange = true;
      $(this.createDefaultBlock()).insertAfter(lastBlock);
    }
  }

  scrollTop(top) {
    if (util.isUndefined(top)) {
      return this.get$Body().scrollTop();
    }

    return this.get$Body().scrollTop(top);
  }

  isIgnoreChange() {
    return this._ignoreChange;
  }

  focus() {
    Squire.prototype.focus.call(this);
  }

  blockCommandShortcuts() {
    const isMac = /Mac/.test(navigator.platform);
    const meta = isMac ? 'meta' : 'ctrl';
    const keys = ['b', 'i', 'u', 'shift-7', 'shift-5', 'shift-6', 'shift-8', 'shift-9', '[', ']'];

    keys.forEach(key => {
      this.setKeyHandler(`${meta}-${key}`, (editor, keyboardEvent) => {
        keyboardEvent.preventDefault();
      });
    });
  }
}

export default SquireExt;

