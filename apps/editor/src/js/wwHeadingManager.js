/**
 * @fileoverview Implements wysiwyg heading manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import domUtils from './utils/dom';
import browser from 'tui-code-snippet/browser/browser';

const FIND_HEADING_RX = /h[\d]/i;
const isIE10 = browser.msie && browser.version === 10;

/**
 * Class WwHeadingManager
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @ignore
 */
class WwHeadingManager {
  constructor(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @type {string}
     */
    this.name = 'heading';

    this._init();
  }

  /**
   * Initialize
   * @private
   */
  _init() {
    this._initEvent();
    this._initKeyHandler();
  }

  _initEvent() {
    this.eventManager.listen('wysiwygSetValueAfter', () => {
      this._wrapDefaultBlockToHeadingInner();
    });
  }

  /**
   * Initialize key event handler
   * @private
   */
  _initKeyHandler() {
    this.wwe.addKeyEventHandler('ENTER', (ev, range) => {
      if (this.wwe.hasFormatWithRx(FIND_HEADING_RX)) {
        this._onEnter(ev, range);

        return false;
      }

      return true;
    });

    this.wwe.addKeyEventHandler('BACK_SPACE', (ev, range) => {
      if (this.wwe.hasFormatWithRx(FIND_HEADING_RX)) {
        this._addBrToEmptyBlock(range);
        this._removePrevTopNodeIfNeed(ev, range);

        return false;
      }

      return true;
    });
  }

  /**
   * Wrap default block to heading inner contents
   * @private
   */
  _wrapDefaultBlockToHeadingInner() {
    const headingTags = domUtils.findAll(this.wwe.getBody(), 'h1, h2, h3, h4, h5, h6');

    headingTags.forEach(headingTag => {
      const exceptedForWrapping = !domUtils.children(headingTag, 'div, p').length;

      if (exceptedForWrapping) {
        domUtils.wrapInner(headingTag, 'div');
      }
    });
  }

  /**
   * Unwrap heading
   * @private
   */
  _unwrapHeading() {
    this.wwe.unwrapBlockTag(node => FIND_HEADING_RX.test(node));
  }

  /**
   * Enter key handler
   * @param {Event} event event object
   * @param {Range} range range
   * @private
   */
  _onEnter(event, range) {
    if (range.startOffset > 0) {
      // I hate this but there's no way
      this.wwe.defer(wwe => {
        this._unwrapHeading();
        wwe.getEditor().removeLastUndoStack();
      });
    } else {
      event.preventDefault();
      this._insertEmptyBlockToPrevious(range);
    }
  }

  /**
   * Insert empty block to previous of passed range
   * @param {Range} range range
   * @private
   */
  _insertEmptyBlockToPrevious(range) {
    this.wwe.getEditor().saveUndoState(range);

    const element = domUtils.createElementWith('<div><br></div>');

    domUtils.insertBefore(
      element,
      domUtils.getParentUntil(range.startContainer, this.wwe.getBody())
    );
  }

  /**
   * Remove previous top node if need
   * @param {Event} event event object
   * @param {Range} range range
   * @returns {Boolean} whether needed or not
   * @private
   */
  _removePrevTopNodeIfNeed(event, range) {
    let isHandled = false;

    if (range.collapsed && range.startOffset === 0) {
      const { startContainer } = range;
      const prevTopNode = domUtils.getTopPrevNodeUnder(startContainer, this.wwe.getBody());
      const isPrevTopNodeEmpty = prevTopNode && prevTopNode.textContent.length === 0;
      const sq = this.wwe.getEditor();

      if (startContainer.textContent.length === 0) {
        isHandled = this._removeHedingAndChangeSelection(event, range, prevTopNode);
      } else if (isPrevTopNodeEmpty) {
        event.preventDefault();
        sq.saveUndoState(range);

        domUtils.remove(prevTopNode);
        isHandled = true;
      }
    }

    return isHandled;
  }

  _getHeadingElement(element) {
    const isHeading = FIND_HEADING_RX.test(domUtils.getNodeName(element));

    return isHeading ? element : domUtils.parents(element, 'h1,h2,h3,h4,h5,h6')[0];
  }

  _addBrToEmptyBlock(range) {
    const { collapsed, startOffset, startContainer } = range;

    if (collapsed && startOffset === 1) {
      const headingElement = this._getHeadingElement(startContainer);
      const brs = domUtils.children(headingElement.firstChild, 'br');

      if (!isIE10 && !brs.length) {
        const br = document.createElement('br');

        startContainer.parentNode.appendChild(br);
      }
    }
  }

  /**
   * Remove heading and change selection
   * @param {object} event Event object
   * @param {Range} range Range object
   * @param {HTMLElement} prevTopNode Previous top node
   * @returns {boolean}
   * @private
   */
  _removeHedingAndChangeSelection(event, range, prevTopNode) {
    const { startContainer } = range;
    const sq = this.wwe.getEditor();
    const body = this.wwe.getBody();
    const headingElement = this._getHeadingElement(startContainer);
    let targetNode = prevTopNode;
    let offset = 1;

    if (!event.defaultPrevented) {
      event.preventDefault();
      sq.saveUndoState(range);
    }

    domUtils.remove(headingElement);

    if (!prevTopNode) {
      [targetNode] = domUtils.children(body, 'div');
      offset = 0;
    }

    range.setStart(targetNode, offset);
    range.collapse(true);
    sq.setSelection(range);

    return true;
  }
}

export default WwHeadingManager;
