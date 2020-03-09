/**
 * @fileoverview Implements WwTextObject
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import browser from 'tui-code-snippet/browser/browser';

import domUtils from './utils/dom';
const isIE11 = browser.msie && browser.version === 11;
const isWindowChrome = navigator.appVersion.indexOf('Win') !== -1 && browser.chrome;
const isWindows10 = /Windows (NT )?10/g.test(navigator.appVersion);
const isNeedOffsetFix = isIE11 || (isWindowChrome && !isWindows10);

/**
 * Class WwTextObject
 * @param {WysiwygEditor} wwe - wysiwygEditor
 * @param {Range} range - Range object
 */
class WwTextObject {
  constructor(wwe, range) {
    this._wwe = wwe;

    // msie11 and window chrome can't make start offset of range api correctly when compositing korean.
    // so we need fix this when compositing korean.(and maybe other languages that needs composition.)
    if (isNeedOffsetFix) {
      this.isComposition = false;
      this._initCompositionEvent();
    }

    this.setRange(range || this._wwe.getRange());
  }

  /**
   * Initialize composition event
   * @private
   */
  _initCompositionEvent() {
    this._wwe.getEditor().addEventListener('compositionstart', () => {
      this.isComposition = true;
    });

    this._wwe.getEditor().addEventListener('compositionend', () => {
      this.isComposition = false;
    });
  }

  /**
   * Set _range object to given range object
   * @param {Range} range Range object
   */
  setRange(range) {
    if (this._range) {
      this._range.detach();
    }

    this._range = range;
  }

  /**
   * Expand start offset by one
   */
  expandStartOffset() {
    const range = this._range;

    if (domUtils.isTextNode(range.startContainer) && range.startOffset > 0) {
      range.setStart(range.startContainer, range.startOffset - 1);
    }
  }

  /**
   * Expand end offset by one
   */
  expandEndOffset() {
    const range = this._range;

    if (
      domUtils.isTextNode(range.endContainer) &&
      range.endOffset < range.endContainer.nodeValue.length
    ) {
      range.setEnd(range.endContainer, range.endOffset + 1);
    }
  }

  /**
   * setEnd range on start
   * @param {Range} range Range object
   */
  setEndBeforeRange(range) {
    let offset = range.startOffset;

    if (this.isComposition) {
      offset += 1;
    }

    this._range.setEnd(range.startContainer, offset);
  }

  /**
   * Get text content
   * @returns {string}
   */
  getTextContent() {
    return this._range.cloneContents().textContent;
  }

  /**
   * Replace current selection content to given text
   * @param {string} content Text content
   */
  replaceContent(content) {
    this._wwe.getEditor().setSelection(this._range);
    this._wwe.getEditor().insertHTML(content);

    // When range is in table, 'insertHTML' makes div in table.
    // So after 'insertHTML', div in table should be unwrap.
    // 'wysiwygRangeChangeAfter' event let wwTableManager call '_unwrapBlockInTable'
    if (this._wwe.isInTable(this._range)) {
      this._wwe.eventManager.emit('wysiwygRangeChangeAfter', this._wwe);
    }

    this._range = this._wwe.getRange();
  }

  /**
   * Delete current selection content
   */
  deleteContent() {
    this._wwe.getEditor().setSelection(this._range);
    this._wwe.getEditor().insertHTML('');
    this._range = this._wwe.getRange();
  }

  /**
   * Peek previous element's content
   * @param {number} offset Offset to peek
   * @returns {string}
   */
  peekStartBeforeOffset(offset) {
    const range = this._range.cloneRange();

    range.setStart(range.startContainer, Math.max(range.startOffset - offset, 0));
    range.setEnd(this._range.startContainer, this._range.startOffset);

    return range.cloneContents().textContent;
  }
}

export default WwTextObject;
