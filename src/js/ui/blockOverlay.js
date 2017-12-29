/**
 * @fileoverview Implements UI block overlay
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

/**
 * Class BlockOverlay
 */
class BlockOverlay {
  /**
   * Creates an instance of BlockOverlay.
   * @param {Object} options - options
   *  @param {EventManager} options.eventManager - event manager instance
   *  @param {HTMLElement} options.container - container element
   *  @param {string} options.attachedSelector - selector string to find attached element
   * @memberof BlockOverlay
   */
  constructor({eventManager, container, attachedSelector}) {
    this._eventManager = eventManager;
    this._attachedSelector = `[contenteditable=true] ${attachedSelector}`;
    this._$container = $(container);
    this._$attachedElement = null;

    /**
     * is activated.
     * if this blockOverlay is active, It always be visible unconditionally.
     * @type {boolean}
     */
    this.active = false;

    this._createElement();
    this._initEvent();
  }

  _createElement() {
    this.$el = $('<div class="te-ww-block-overlay">');
    this.$el.css({
      position: 'absolute',
      display: 'none',
      'z-index': 1
    });
    this._$container.append(this.$el);
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
    if (this._$attachedElement && $.contains(document, this._$attachedElement[0])) {
      this.syncLayout();
    } else {
      this.setVisibility(false);
    }
  }

  _onMouseOver(ev) {
    const originalEvent = ev.data;
    const $eventTarget = $(originalEvent.target);
    const $attachedElement = $eventTarget.closest(this._attachedSelector);

    if ($attachedElement.length) {
      this._$attachedElement = $attachedElement;
      this.setVisibility(true);
    } else if ($eventTarget.closest(this.$el).length) {
      this.setVisibility(true);
    } else if (!this.active) {
      this.setVisibility(false);
    }
  }

  /**
   * update blockOverlay position & size update to attached element
   * you may want to override this to adjust position & size
   * @memberof BlockOverlay
   * @protected
   */
  syncLayout() {
    this.$el.offset(this._$attachedElement.offset());
    this.$el.width(this._$attachedElement.outerWidth());
    this.$el.height(this._$attachedElement.outerHeight());
  }

  /**
   * attached element
   * @protected
   * @returns {HTMLElement} - attached element
   * @memberof BlockOverlay
   */
  getAttachedElement() {
    return this._$attachedElement ? this._$attachedElement.get(0) : null;
  }

  /**
   * visibility
   * @protected
   * @returns {boolean} visibility
   * @memberof BlockOverlay
   */
  getVisibility() {
    return this.$el.css('display') === 'block';
  }

  /**
   * visibility
   * @param {boolean} visibility - is visible
   * @protected
   * @memberof BlockOverlay
   */
  setVisibility(visibility) {
    if (visibility && this._$attachedElement) {
      if (!this.getVisibility()) {
        this.$el.css('display', 'block');
        this.syncLayout();
        this.onShow();
      }
    } else if (!visibility) {
      if (this.getVisibility()) {
        this.$el.css('display', 'none');
        this.onHide();
      }
    }
  }

  /**
   * called on show. you may want to override to get the event
   * @memberof BlockOverlay
   * @protected
   * @abstract
   */
  onShow() {}

  /**
   * called on hide. you may want to override to get the event
   * @memberof BlockOverlay
   * @protected
   */
  onHide() {
    this.active = false;
    this._$attachedElement = null;
  }
}

export default BlockOverlay;
