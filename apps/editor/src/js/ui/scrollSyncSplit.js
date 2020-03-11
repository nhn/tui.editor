/**
 * @fileoverview Implements scroll sync split
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import css from 'tui-code-snippet/domUtil/css';
import hasClass from 'tui-code-snippet/domUtil/hasClass';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';

import extend from 'tui-code-snippet/object/extend';
import domUtils from '../utils/dom';

const CLASS_SPLIT_SCROLL = 'tui-split-scroll';
const CLASS_SINGLE_CONTENT = 'single-content';
const CLASS_SCROLL_SYNC = 'scroll-sync';
const CLASS_SCROLL_WRAPPER = 'tui-split-scroll-wrapper';
const CLASS_SCROLL_CONTENT = 'tui-split-scroll-content';
const CLASS_SPLITTER = 'tui-splitter';
const EVENT_REQUIRE_SCROLL_INTO_VIEW = 'requireScrollIntoView';
const CLASS_CONTENT_LEFT = 'tui-split-content-left';
const CLASS_CONTENT_RIGHT = 'tui-split-content-right';
const CLASS_CONTENT = {
  left: CLASS_CONTENT_LEFT,
  right: CLASS_CONTENT_RIGHT
};

/**
 * Class ScrollSyncSplit
 * @param {Element} baseElement - an element which attach a splitSyncSplit
 * @param {Element} leftElement - an element to be on left side split view
 * @param {Element} rightElement - an element to be on right side split view
 * @param {object} options - options
 *     @param {boolean} [options.showScrollSyncButton=false] - show scroll sync button on top right corner
 *     @param {boolean} [options.scrollSync=true] - true for enable scroll sync
 *     @param {boolean} [options.splitView=true] - true for split, false for single view
 * @ignore
 */
class ScrollSyncSplit {
  constructor(baseElement, leftElement, rightElement, options = {}) {
    options = extend(
      {
        showScrollSyncButton: false,
        scrollSync: true,
        splitView: true
      },
      options
    );
    this._baseElement = baseElement;
    this._eventManager = options.eventManager;

    /**
     * left, right side content elements
     * @type {HTMLElement[]}
     * @private
     */
    this._contentElements = [];

    this._initDom(leftElement, rightElement, options);
    this._initDomEvent();
  }

  _initDom(leftElement, rightElement, options) {
    const el = document.createElement('div');

    el.className = CLASS_SPLIT_SCROLL;
    this._el = el;

    const scrollWrapper = document.createElement('div');

    scrollWrapper.className = CLASS_SCROLL_WRAPPER;
    this._scrollWrapper = scrollWrapper;
    this._setScrollSync(options.scrollSync);
    this.setSplitView(options.splitView);

    const contentWrapper = document.createElement('div');

    contentWrapper.className = CLASS_SCROLL_CONTENT;
    this._contentWrapper = contentWrapper;

    const splitter = document.createElement('div');

    splitter.className = CLASS_SPLITTER;

    this._baseElement.appendChild(el);
    el.appendChild(scrollWrapper);
    scrollWrapper.appendChild(contentWrapper);
    scrollWrapper.appendChild(splitter);
    this._setLeft(leftElement);
    this._setRight(rightElement);
  }

  _initDomEvent() {
    this._contentWrapper.addEventListener('scroll', this.sync.bind(this));
  }

  _requireScrollIntoView(element) {
    const { top: targetTop, bottom: targetBottom } = element.getBoundingClientRect();
    let wrapperElement;

    if (this.isScrollSynced()) {
      wrapperElement = this._contentWrapper;
    } else if (domUtils.parents(element, this._contentElements.left).length) {
      wrapperElement = this._contentElements.left;
    } else if (domUtils.parents(element, this._contentElements.right).length) {
      wrapperElement = this._contentElements.right;
    } else {
      return;
    }

    const { top: wrapperTop, bottom: wrapperBottom } = wrapperElement.getBoundingClientRect();

    if (targetTop < wrapperTop) {
      wrapperElement.scrollTop = wrapperElement.scrollTop + targetTop - wrapperTop;
    } else if (targetBottom > wrapperBottom) {
      wrapperElement.scrollTop = wrapperElement.scrollTop + targetBottom - wrapperBottom;
    }

    this.sync();
  }

  /**
   * set content element for given side
   * @param {Element} element - content element
   * @param {string} side - 'left' | 'right'
   * @private
   */
  _setContentElement(element, side) {
    const contentElement = this._contentElements[side];

    if (contentElement) {
      this._eventManager.removeEventHandler(EVENT_REQUIRE_SCROLL_INTO_VIEW);
      this._contentWrapper.removeChild(contentElement);
    }
    addClass(element, CLASS_CONTENT[side]);
    this._contentWrapper.appendChild(element);
    this._eventManager.listen(EVENT_REQUIRE_SCROLL_INTO_VIEW, ev =>
      this._requireScrollIntoView(ev)
    );
    this._eventManager.listen('requireScrollSync', () => this.sync());
    this._contentElements[side] = element;

    this.sync();
  }

  /**
   * set left side element
   * @param {Element} element - an element to be on left side split view
   * @private
   */
  _setLeft(element) {
    this._setContentElement(element, 'left');
  }

  /**
   * set right side element
   * @param {Element} element - an element to be on right side split view
   * @private
   */
  _setRight(element) {
    this._setContentElement(element, 'right');
  }

  _setScrollSync(activate) {
    domUtils.toggleClass(this._el, CLASS_SCROLL_SYNC, activate);
  }

  /**
   * toggle multi scroll
   */
  toggleScrollSync() {
    domUtils.toggleClass(this._el, CLASS_SCROLL_SYNC);
  }

  setSplitView(activate) {
    if (!activate) {
      addClass(this._el, CLASS_SINGLE_CONTENT);
    } else {
      removeClass(this._el, CLASS_SINGLE_CONTENT);
    }
  }

  /**
   * toggle split
   */
  toggleSplitView() {
    domUtils.toggleClass(this._el, CLASS_SINGLE_CONTENT);
  }

  /**
   * is scroll synced
   * @returns {boolean} - true for synced, false for each scroll
   */
  isScrollSynced() {
    return hasClass(this._el, CLASS_SCROLL_SYNC);
  }

  /**
   * is split view
   * @returns {boolean} - true for split view, false for single view
   */
  isSplitView() {
    return !hasClass(this._el, CLASS_SINGLE_CONTENT);
  }

  /**
   * sync scroll
   */
  sync() {
    if (!this._contentElements.left || !this._contentElements.right) {
      return;
    }

    const wrapperHeight = this._contentWrapper.clientHeight;
    const { scrollTop } = this._contentWrapper;
    const leftElement = this._contentElements.left;
    const rightElement = this._contentElements.right;

    const scrollingElement =
      leftElement.offsetHeight - wrapperHeight > 0 ? leftElement : rightElement;
    const followingElement = scrollingElement === leftElement ? rightElement : leftElement;

    const scrollingElementHeight = scrollingElement.offsetHeight;
    const scrollingElementScrollMax = Math.max(scrollingElementHeight - wrapperHeight, 0);
    const followingElementHeight = Math.max(followingElement.offsetHeight, wrapperHeight);
    const followingElementTopMax = scrollingElementHeight - followingElementHeight;

    css(scrollingElement, { top: 0 });
    css(followingElement, {
      top: `${(scrollTop / scrollingElementScrollMax) * followingElementTopMax}px`
    });
  }

  /**
   * scroll top
   * @param {number} top - scroll top in pixel
   */
  scrollTop(top) {
    this._contentWrapper.scrollTop = top;
  }
}

export default ScrollSyncSplit;
