/**
 * @fileoverview editor layout
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import css from 'tui-code-snippet/domUtil/css';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';

import domUtils from './utils/dom';

/**
 * Editor container template
 * @type {string}
 * @ignore
 */
const containerTmpl = [
  '<div class="tui-editor">',
  '<div class="te-md-container">',
  '<div class="te-editor"></div>',
  '<div class="te-md-splitter"></div>',
  '<div class="te-preview"></div>',
  '</div>',
  '<div class="te-ww-container">',
  '<div class="te-editor"></div>',
  '</div>',
  '</div>'
].join('');

/**
 * Class Layout
 * @param {object} options - Option object
 * @param {EventManager} eventManager - Event manager instance
 * @ignore
 */
class Layout {
  constructor(options, eventManager) {
    this.el = options.el;
    this.height = options.height;
    this.type = options.initialEditType;
    this.eventManager = eventManager;

    this.init();
    this._initEvent();
  }

  /**
   * Initializer
   * @protected
   */
  init() {
    this._renderLayout();

    this._initMarkdownAndPreviewSection();
    this._initWysiwygSection();
  }

  /**
   * Initialize show and hide event
   * @private
   */
  _initEvent() {
    this.eventManager.listen('hide', this.hide.bind(this));
    this.eventManager.listen('show', this.show.bind(this));
  }

  /**
   * Create editor container with template
   * @private
   */
  _renderLayout() {
    css(this.el, {
      boxSizing: 'border-box'
    });

    this.containerEl = domUtils.createElementWith(containerTmpl, this.el);
  }

  /**
   * Switch editor mode to WYSIWYG
   */
  switchToWYSIWYG() {
    removeClass(this.containerEl, 'te-md-mode');
    addClass(this.containerEl, 'te-ww-mode');
  }

  /**
   * Switch editor mode to Markdown
   */
  switchToMarkdown() {
    removeClass(this.containerEl, 'te-ww-mode');
    addClass(this.containerEl, 'te-md-mode');
  }

  /**
   * Initialize editor to Markdown and set preview section
   * @private
   */
  _initMarkdownAndPreviewSection() {
    this.mdEditorContainerEl = this.containerEl.querySelector('.te-md-container .te-editor');
    this.previewEl = this.containerEl.querySelector('.te-md-container .te-preview');
  }

  /**
   * Initialize editor to WYSIWYG
   * @private
   */
  _initWysiwygSection() {
    this.wwEditorContainerEl = this.containerEl.querySelector('.te-ww-container .te-editor');
  }

  /**
   * Set preview to vertical split style
   * @private
   */
  _verticalSplitStyle() {
    const mdContainer = this.containerEl.querySelector('.te-md-container');

    removeClass(mdContainer, 'te-preview-style-tab');
    addClass(mdContainer, 'te-preview-style-vertical');
  }

  /**
   * Set tab style preview mode
   * @private
   */
  _tabStyle() {
    const mdContainer = this.containerEl.querySelector('.te-md-container');

    removeClass(mdContainer, 'te-preview-style-vertical');
    addClass(mdContainer, 'te-preview-style-tab');
  }

  /**
   * Toggle preview style between tab and vertical split
   * @param {string} style Preview style ('tab' or 'vertical')
   */
  changePreviewStyle(style) {
    if (style === 'tab') {
      this._tabStyle();
    } else if (style === 'vertical') {
      this._verticalSplitStyle();
    }
  }

  /**
   * Hide Editor
   */
  hide() {
    addClass(this.el.querySelector('.tui-editor'), 'te-hide');
  }

  /**
   * Show Editor
   */
  show() {
    removeClass(this.el.querySelector('.tui-editor'), 'te-hide');
  }

  /**
   * Remove Editor
   */
  remove() {
    domUtils.remove(this.el.querySelector('.tui-editor'));
  }

  /**
   * Get wrapped editor container element
   * @returns {HTMLElement}
   */
  getEditorEl() {
    return this.containerEl;
  }

  /**
   * Get wrapped preview element
   * @returns {HTMLElement}
   */
  getPreviewEl() {
    return this.previewEl;
  }

  /**
   * Get wrapped Markdown editor element
   * @returns {HTMLElement}
   */
  getMdEditorContainerEl() {
    return this.mdEditorContainerEl;
  }

  /**
   * Get wrapped WYSIWYG editor element
   * @returns {HTMLElement}
   */
  getWwEditorContainerEl() {
    return this.wwEditorContainerEl;
  }
}

export default Layout;
