/**
* @fileoverview Implements markdown marker helper for additional information
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import util from 'tui-code-snippet';

const FIND_CRLF_RX = /(\n)|(\r\n)|(\r)/g;

/**
 * Class MarkdownMarkerHelper
 */
class MarkdownMarkerHelper {
  /**
   * Creates an instance of MarkdownMarkerHelper.
   * @param {CodeMirror} cm codemirror instance
   * @memberof MarkdownMarkerHelper
   */
  constructor(cm) {
    this.cm = cm;
  }

  /**
   * getTextContent
   * Get CRLF removed text content of CodeMirror
   * @returns {string} text content
   */
  getTextContent() {
    return this.cm.getValue().replace(FIND_CRLF_RX, '');
  }

  /**
   * updateMarkerWithExtraInfo
   * Update marker with extra info of CodeMirror
   * @param {object} marker marker
   * @returns {object} marker
   */
  updateMarkerWithExtraInfo(marker) {
    const foundCursor = this._findOffsetCursor([marker.start, marker.end]);

    const startLine = foundCursor[0].line;
    const startCh = foundCursor[0].ch;
    const endLine = foundCursor[1].line;
    const endCh = foundCursor[1].ch;

    const info = this._getExtraInfoOfRange(startLine, startCh, endLine, endCh);

    marker.text = info.text.replace(FIND_CRLF_RX, ' ');
    marker.top = info.top;
    marker.left = info.left;
    marker.height = info.height;

    return marker;
  }

  /**
   * _getExtraInfoOfRange
   *  Get additional info of range
   * @param {number} startLine start line
   * @param {number} startCh start offset
   * @param {number} endLine end line
   * @param {number} endCh end offset
   * @returns {object} information
   * @private
   */
  _getExtraInfoOfRange(startLine, startCh, endLine, endCh) {
    let text, rect, top, left, height;
    const doc = this.cm.getDoc();

    if (!doc.getValue().length) {
      top = left = height = 0;
      text = '';
    } else {
      text = doc.getRange({
        line: startLine,
        ch: startCh
      }, {
        line: endLine,
        ch: endCh
      });

      rect = this.cm.charCoords({
        line: endLine,
        ch: endCh
      }, 'local');

      ({top, left} = rect);
      height = rect.bottom - rect.top;
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
    const doc = this.cm.getDoc();

    const selection = this._getSelection();

    const start = doc.getRange({
      line: 0,
      ch: 0
    }, selection.anchor).replace(FIND_CRLF_RX, '').length;

    const end = start + doc.getSelection().replace(FIND_CRLF_RX, '').length;

    const foundCursor = this._findOffsetCursor([start, end]);

    const info = this._getExtraInfoOfRange(foundCursor[0].line,
      foundCursor[0].ch,
      foundCursor[1].line,
      foundCursor[1].ch);

    return {
      start,
      end,
      text: info.text.replace(FIND_CRLF_RX, ' '),
      top: info.top,
      left: info.left,
      height: info.height
    };
  }

  /**
   * _getSelection
   * Get selection of CodeMirror, if selection is reversed then correct it
   * @returns {object} selection
   * @private
   */
  _getSelection() {
    let [{anchor, head}] = this.cm.getDoc().listSelections();

    const isReversedSelection = (anchor.line > head.line) || (anchor.line === head.line && anchor.ch > head.ch);

    if (isReversedSelection) {
      const temp = head;
      head = anchor;
      anchor = temp;
    }

    return {
      anchor,
      head
    };
  }

  /**
   * _findOffsetCursor
   * Find offset cursor by given offset list
   * @param {Array.<number>} offsetlist offset list
   * @returns {Array.<object>} offset cursors
   * @private
   */
  _findOffsetCursor(offsetlist) {
    const doc = this.cm.getDoc();
    let beforeLength = 0;
    const result = [];
    const lineLength = doc.lineCount();
    let offsetIndex = 0;
    let currentLength = 0;
    let lineIndex;

    for (lineIndex = 0; lineIndex < lineLength; lineIndex += 1) {
      currentLength += doc.getLine(lineIndex).length;

      while (currentLength >= offsetlist[offsetIndex]) {
        result.push({
          line: lineIndex,
          ch: offsetlist[offsetIndex] - beforeLength
        });

        offsetIndex += 1;

        if (util.isUndefined(offsetlist[offsetIndex])) {
          return result;
        }
      }

      beforeLength = currentLength;
    }

    while (!util.isUndefined(offsetlist[offsetIndex])) {
      result.push({
        line: lineIndex,
        ch: currentLength - beforeLength
      });

      offsetIndex += 1;
    }

    return result;
  }

  /**
   * selectOffsetRange
   * Make selection with given offset range
   * @param {number} start start offset
   * @param {number} end end offset
   */
  selectOffsetRange(start, end) {
    const foundCursor = this._findOffsetCursor([start, end]);

    this.cm.setSelection({
      line: foundCursor[0].line,
      ch: foundCursor[0].ch
    }, {
      line: foundCursor[1].line,
      ch: foundCursor[1].ch
    });
  }

  /**
   * clearSelect
   * Clear selection of CodeMirror
   */
  clearSelect() {
    const [selection] = this.cm.getDoc().listSelections();

    if (selection) {
      this.cm.setCursor(selection.to());
    }
  }
}
export default MarkdownMarkerHelper;
