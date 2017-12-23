/**
* @fileoverview Implements markdown marker helper for additional information
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import $ from 'jquery';
import Editor from '../editorProxy';

const {domUtils} = Editor;
const FIND_ZWB_RX = /\u200B/g;

/**
 * Class WysiwygMarkerHelper
 */
class WysiwygMarkerHelper {
  /**
   * Creates an instance of WysiwygMarkerHelper.
   * @param {SquireExt} sqe - squire instance
   * @memberof WysiwygMarkerHelper
   */
  constructor(sqe) {
    this.sqe = sqe;
  }

  /**
   * getTextContent
   * Get text content of wysiwyg
   * @returns {string}
   */
  getTextContent() {
    return this.sqe.get$Body()[0].textContent.replace(FIND_ZWB_RX, '');
  }

  /**
   * updateMarkerWithExtraInfo
   * Update marker with extra info of CodeMirror
   * @param {object} marker marker
   * @returns {object} marker
   */
  updateMarkerWithExtraInfo(marker) {
    const foundNode = this._findOffsetNode([marker.start, marker.end]);

    const markerRange = this.sqe.getSelection().cloneRange();
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
    let top, left, rect, height, node, parentNode, containerOffset;
    const {endContainer, endOffset} = range;

    const text = range.cloneContents().textContent.replace(FIND_ZWB_RX, '');

    if (domUtils.getChildNodeByOffset(endContainer, endOffset)) {
      range.setStart(endContainer, endOffset);
      range.collapse(true);

      rect = range.getBoundingClientRect();
    }

    if (rect && !rect.top) {
      this.sqe.modifyDocument(() => {
        node = document.createElement('SPAN');
        node.textContent = '\u200B';
        range.endContainer.parentNode.insertBefore(node, range.endContainer);
        rect = node.getBoundingClientRect();
        ({parentNode} = node);
        parentNode.removeChild(node);
      });
    }

    if (rect) {
      containerOffset = this.sqe.get$Body().parent().offset();
      top = this.sqe.scrollTop() + rect.top - containerOffset.top + $('body').scrollTop();
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

    const range = this.sqe.getSelection().cloneRange();

    if (this._extendRangeToTextNodeIfHasNone(range)) {
      beforeRange = range.cloneRange();
      beforeRange.setStart(this.sqe.get$Body()[0], 0);
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

    if (!domUtils.isTextNode(range.endContainer) || !endNode.nodeValue.replace(FIND_ZWB_RX, '').length) {
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
    return domUtils.findOffsetNode(this.sqe.get$Body()[0], offsetlist, text => text.replace(FIND_ZWB_RX, ''));
  }

  /**
   * selectOffsetRange
   * Make selection with given offset range
   * @param {number} start start offset
   * @param {number} end end offset
   */
  selectOffsetRange(start, end) {
    const foundNode = this._findOffsetNode([start, end]),
      range = this.sqe.getSelection().cloneRange();

    range.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
    range.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

    this.sqe.setSelection(range);
  }

  /**
   * clearSelect
   * Clear selection of squire
   */
  clearSelect() {
    const range = this.sqe.getSelection().cloneRange();
    range.collapse(true);
    this.sqe.setSelection(range);
  }
}
export default WysiwygMarkerHelper;
