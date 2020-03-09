/**
 * @fileoverview Implements UI block overlay
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import css from 'tui-code-snippet/domUtil/css';
import domUtils from '../utils/dom';

/**
 * Class BlockOverlay
 * @param {Object} options - options
 *     @param {EventManager} options.eventManager - event manager instance
 *     @param {HTMLElement} options.container - container element
 *     @param {string} options.attachedSelector - selector string to find attached element
 * @ignore
 */
class BlockOverlay {
  constructor({ eventManager, container, attachedSelector }) {
    this._eventManager = eventManager;
    this._attachedSelector = `[contenteditable=true] ${attachedSelector}`;
    this._container = container;
    this._attachedElement = null;

    /**
     * is activated.
     * if this blockOverlay is active, It always be visible unconditionally.
     * @type {boolean}
     * @private
     */
    this.active = false;

    this._createElement();
    this._initEvent();
  }

  _createElement() {
    this.el = domUtils.createElementWith('<div class="te-ww-block-overlay"></div>');
    css(this.el, {
      position: 'absolute',
      display: 'none',
      zIndex: 1
    });

    domUtils.append(this._container, this.el);
  }

  _initEvent() {
    this._eventManager.listen('change', this._onChange.bind(this));
    this._eventManager.listen('mouseover', this._onMouseOver.bind(this));
    this._eventManager.listen('focus', () => {
      this.setVisibility(false);
    });
    this._eventManager.listen('mousedown', () => {
      this.setVisibility(false);
    });
  }

  _onChange() {
    if (this._attachedElement && domUtils.isContain(document.body, this._attachedElement)) {
      this.syncLayout();
    } else {
      this.setVisibility(false);
    }
  }

  _onMouseOver(ev) {
    const originalEvent = ev.data;
    const eventTarget = originalEvent.target;
    const attachedElement = domUtils.closest(eventTarget, this._attachedSelector);

    if (attachedElement) {
      this._attachedElement = attachedElement;
      this.setVisibility(true);
    } else if (domUtils.closest(eventTarget, this.el)) {
      this.setVisibility(true);
    } else if (!this.active) {
      this.setVisibility(false);
    }
  }

  /**
   * update blockOverlay position & size update to attached element
   * you may want to override this to adjust position & size
   * @protected
   */
  syncLayout() {
    const offset = domUtils.getOffset(this._attachedElement);
    const outerWidth = domUtils.getOuterWidth(this._attachedElement);
    const outerHeight = domUtils.getOuterHeight(this._attachedElement);

    domUtils.setOffset(this.el, offset);
    css(this.el, { width: `${outerWidth}px` });
    css(this.el, { height: `${outerHeight}px` });
  }

  /**
   * attached element
   * @protected
   * @returns {HTMLElement} - attached element
   */
  getAttachedElement() {
    return this._attachedElement || null;
  }

  /**
   * visibility
   * @protected
   * @returns {boolean} visibility
   */
  getVisibility() {
    return this.el.style.display === 'block';
  }

  /**
   * visibility
   * @param {boolean} visibility - is visible
   * @protected
   */
  setVisibility(visibility) {
    if (visibility && this._attachedElement) {
      if (!this.getVisibility()) {
        css(this.el, { display: 'block' });
        this.syncLayout();
        this.onShow();
      }
    } else if (!visibility) {
      if (this.getVisibility()) {
        css(this.el, { display: 'none' });
        this.onHide();
      }
    }
  }

  /**
   * called on show. you may want to override to get the event
   * @protected
   * @abstract
   */
  onShow() {}

  /**
   * called on hide. you may want to override to get the event
   * @protected
   */
  onHide() {
    this.active = false;
    this._attachedElement = null;
  }
}

export default BlockOverlay;
