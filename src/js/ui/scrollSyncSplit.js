/**
 * @fileoverview Implements scroll sync split
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

const CLASS_SPLIT_SCROLL = 'tui-split-scroll';
const CLASS_SINGLE_CONTENT = 'single-content';
const CLASS_SCROLL_SYNC = 'scroll-sync';
const CLASS_SCROLL_WRAPPER = 'tui-split-scroll-wrapper';
const CLASS_SCROLL_CONTENT = 'tui-split-scroll-content';
const CLASS_SPLITTER = 'tui-splitter';
const EVENT_REQUIRE_SCROLL_SYNC = 'requireScrollSync';
const EVENT_REQUIRE_SCROLL_INTO_VIEW = 'requireScrollIntoView';
const CLASS_CONTENT_LEFT = 'tui-split-content-left';
const CLASS_CONTENT_RIGHT = 'tui-split-content-right';
const CLASS_CONTENT = {
  'left': CLASS_CONTENT_LEFT,
  'right': CLASS_CONTENT_RIGHT
};

/**
 * Class ScrollSyncSplit
 */
class ScrollSyncSplit {
  /**
   * Creates an instance of ScrollSyncSplit.
   * @param {Element} baseElement - an element which attach a splitSyncSplit
   * @param {Element} leftElement - an element to be on left side split view
   * @param {Element} rightElement - an element to be on right side split view
   * @param {object} options - options
   *  @param {boolean} [options.showScrollSyncButton=false] - show scroll sync button on top right corner
   *  @param {boolean} [options.scrollSync=true] - true for enable scroll sync
   *  @param {boolean} [options.splitView=true] - true for split, false for single view
   * @memberof ScrollSyncSplit
   */
  constructor(baseElement, leftElement, rightElement, options = {}) {
    options = util.extend({
      showScrollSyncButton: false,
      scrollSync: true,
      splitView: true
    }, options);
    this._baseElement = baseElement;

    /**
       * left, right side content elements
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

  _requireScrollIntoView(event) {
    const element = event.target;
    const {top: targetTop, bottom: targetBottom} = element.getBoundingClientRect();
    let wrapperTop, wrapperBottom, wrapperElement;

    if (this.isScrollSynced()) {
      wrapperElement = this._contentWrapper;
    } else if ($(element).parents(this._contentElements.left).length) {
      wrapperElement = this._contentElements.left;
    } else if ($(element).parents(this._contentElements.right).length) {
      wrapperElement = this._contentElements.right;
    } else {
      return;
    }
    ({top: wrapperTop, bottom: wrapperBottom} = wrapperElement.getBoundingClientRect());

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
   * @memberof ScrollSyncSplit
   * @private
   */
  _setContentElement(element, side) {
    const contentElement = this._contentElements[side];

    if (contentElement) {
      $(contentElement).off(EVENT_REQUIRE_SCROLL_INTO_VIEW);
      this._contentWrapper.removeChild(contentElement);
    }
    element.classList.add(CLASS_CONTENT[side]);
    this._contentWrapper.appendChild(element);
    $(element).on(EVENT_REQUIRE_SCROLL_INTO_VIEW, ev => this._requireScrollIntoView(ev));
    $(element).on(EVENT_REQUIRE_SCROLL_SYNC, () => this.sync());

    this._contentElements[side] = element;

    this.sync();
  }

  /**
   * set left side element
   * @param {Element} element - an element to be on left side split view
   * @memberof ScrollSyncSplit
   * @private
   */
  _setLeft(element) {
    this._setContentElement(element, 'left');
  }

  /**
   * set right side element
   * @param {Element} element - an element to be on right side split view
   * @memberof ScrollSyncSplit
   * @private
   */
  _setRight(element) {
    this._setContentElement(element, 'right');
  }

  _setScrollSync(activate) {
    $(this._el).toggleClass(CLASS_SCROLL_SYNC, activate);
  }

  /**
   * toggle multi scroll
   * @memberof ScrollSyncSplit
   */
  toggleScrollSync() {
    this._el.classList.toggle(CLASS_SCROLL_SYNC);
  }

  setSplitView(activate) {
    $(this._el).toggleClass(CLASS_SINGLE_CONTENT, !activate);
  }

  /**
   * toggle split
   * @memberof ScrollSyncSplit
   */
  toggleSplitView() {
    this._el.classList.toggle(CLASS_SINGLE_CONTENT);
  }

  /**
   * is scroll synced
   * @returns {boolean} - true for synced, false for each scroll
   * @memberof ScrollSyncSplit
   */
  isScrollSynced() {
    return this._el.classList.contains(CLASS_SCROLL_SYNC);
  }

  /**
   * is split view
   * @returns {boolean} - true for split view, false for single view
   * @memberof ScrollSyncSplit
   */
  isSplitView() {
    return !this._el.classList.contains(CLASS_SINGLE_CONTENT);
  }

  /**
   * sync scroll
   * @memberof ScrollSyncSplit
   */
  sync() {
    if (!this._contentElements.left || !this._contentElements.right) {
      return;
    }

    const wrapperHeight = this._contentWrapper.clientHeight;
    const {scrollTop} = this._contentWrapper;
    const leftElement = this._contentElements.left;
    const rightElement = this._contentElements.right;

    const scrollingElement = leftElement.offsetHeight - wrapperHeight > 0 ? leftElement : rightElement;
    const followingElement = scrollingElement === leftElement ? rightElement : leftElement;

    const scrollingElementHeight = scrollingElement.offsetHeight;
    const scrollingElementScrollMax = Math.max(scrollingElementHeight - wrapperHeight, 0);
    const followingElementHeight = Math.max(followingElement.offsetHeight, wrapperHeight);
    const followingElementTopMax = scrollingElementHeight - followingElementHeight;

    scrollingElement.style.top = '0px';
    followingElement.style.top = `${(scrollTop / scrollingElementScrollMax) * followingElementTopMax}px`;
  }

  /**
   * scroll top
   * @param {number} top - scroll top in pixel
   * @memberof ScrollSyncSplit
   */
  scrollTop(top) {
    this._contentWrapper.scrollTop = top;
  }
}

export default ScrollSyncSplit;
