/**
* @fileoverview Implements markdown marker helper for additional information
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import $ from 'jquery';
import Editor from '../editorProxy';

const {domUtils} = Editor;
const FIND_CRLF_RX = /(\n)|(\r\n)|(\r)/g;

/**
 * Class ViewerMarkerHelper
 */
class ViewerMarkerHelper {
  /**
   * Creates an instance of ViewerMarkerHelper.
   * @param {Preview} preview - preview instance
   * @memberof ViewerMarkerHelper
   */
  constructor(preview) {
    this.preview = preview;
  }

  /**
   * getTextContent
   * Get text content of wysiwyg
   * @returns {string}
   */
  getTextContent() {
    return this.preview.$el[0].textContent.replace(FIND_CRLF_RX, '');
  }

  /**
   * updateMarkerWithExtraInfo
   * Update marker with extra info of preview
   * @param {object} marker marker
   * @returns {object} marker
   */
  updateMarkerWithExtraInfo(marker) {
    const foundNode = this._findOffsetNode([marker.start, marker.end]);

    const markerRange = document.createRange();

    markerRange.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
    markerRange.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

    const info = this._getExtraInfoOfRange(markerRange);

    marker.text = info.text;
    marker.top = info.top;
    marker.left = info.left;
    marker.height = info.height;

    return marker;
  }

  /**
   * _getExtraInfoOfRange
   * Get extra info of range
   * @param {Range} range range
   * @returns {object} extra info
   * @private
   */
  _getExtraInfoOfRange(range) {
    let top, left, rect, containerOffset, height, node, parentNode;

    const text = range.cloneContents().textContent.replace(FIND_CRLF_RX, '');

    range.setStart(range.endContainer, range.endOffset);
    range.collapse(true);

    rect = range.getBoundingClientRect();

    if (rect && !rect.top) {
      node = document.createElement('SPAN');
      node.textContent = '\u200B';
      range.endContainer.parentNode.insertBefore(node, range.endContainer);
      rect = node.getBoundingClientRect();
      ({parentNode} = node);
      parentNode.removeChild(node);
    }

    if (rect) {
      containerOffset = this.preview.$el.offset();
      top = rect.top + this.preview.$el.scrollTop() - containerOffset.top + $('body').scrollTop();
      left = rect.left - containerOffset.left;
      ({height} = rect);
    } else {
      height = top = left = 0;
    }

    return {
      text,
      top,
      left,
      height
    };
  }

  /**
   * getMarkerInfoOfCurrentSelection
   * Get marker info of current selection
   * @returns {object} marker
   */
  getMarkerInfoOfCurrentSelection() {
    let beforeRange, start, end, info;

    const range = getRange();

    const isRangeInContent = $.contains(this.preview.$el[0], range.commonAncestorContainer);

    if (isRangeInContent && this._extendRangeToTextNodeIfHasNone(range)) {
      beforeRange = range.cloneRange();
      beforeRange.setStart(this.preview.$el[0], 0);
      beforeRange.setEnd(range.startContainer, range.startOffset);

      info = this._getExtraInfoOfRange(range);

      start = beforeRange.cloneContents().textContent.length;
      end = start + info.text.length;

      return {
        start,
        end,
        text: info.text,
        top: info.top,
        left: info.left,
        height: info.height
      };
    }

    return null;
  }

  /**
   * _extendRangeToTextNodeIfHasNone
   * Extend range to text node if start or end container have none
   * Containers of range should be text node
   * @param {Range} range range
   * @returns {boolean} success or fail
   * @private
   */
  _extendRangeToTextNodeIfHasNone(range) {
    const endNode = domUtils.getChildNodeByOffset(range.endContainer, range.endOffset);
    let textNode;

    if (!domUtils.isTextNode(range.endContainer)) {
      if (domUtils.isTextNode(endNode)) {
        range.setEnd(endNode, 0);
      } else {
        textNode = domUtils.getPrevTextNode(endNode);
        if (textNode) {
          range.setEnd(textNode, textNode.length);
        } else {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * _findOffsetNode
   * Find offset nodes by given offset list
   * @param {Array.<number>} offsetlist offset list
   * @returns {Array.<object>} offset node informations
   * @private
   */
  _findOffsetNode(offsetlist) {
    return domUtils.findOffsetNode(this.preview.$el[0], offsetlist, text => text.replace(FIND_CRLF_RX, ''));
  }

  /**
   * selectOffsetRange
   * Make selection with given offset range
   * @param {number} start start offset
   * @param {number} end end offset
   */
  selectOffsetRange(start, end) {
    const foundNode = this._findOffsetNode([start, end]),
      range = document.createRange(),
      sel = window.getSelection();

    range.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
    range.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * clearSelect
   * Clear selection
   */
  clearSelect() {
    window.getSelection().removeAllRanges();
  }
}

/**
 * getRange
 * get current range
 * @returns {Range}
 * @ignore
 */
function getRange() {
  const selection = window.getSelection();
  let range;

  if (selection && selection.rangeCount) {
    range = selection.getRangeAt(0).cloneRange();
  } else {
    range = document.createRange();
    range.selectNodeContents(this.preview.$el[0]);
    range.collapse(true);
  }

  return range;
}

export default ViewerMarkerHelper;
