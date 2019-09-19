/**
 * @fileoverview editor layout
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

/**
 * Editor container template
 * @type {string}
 * @ignore
 */
const containerTmpl = [
  '<div class="tui-editor">',
  '<div class="te-md-container">',
  '<div class="te-editor" />',
  '<div class="te-md-splitter" />',
  '<div class="te-preview" />',
  '</div>',
  '<div class="te-ww-container">',
  '<div class="te-editor" />',
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
    this.$el = $(options.el);
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
    this.$el.css('box-sizing', 'border-box');
    this.$containerEl = $(containerTmpl).appendTo(this.$el);
  }

  /**
   * Switch editor mode to WYSIWYG
   */
  switchToWYSIWYG() {
    this.$containerEl.removeClass('te-md-mode');
    this.$containerEl.addClass('te-ww-mode');
  }

  /**
   * Switch editor mode to Markdown
   */
  switchToMarkdown() {
    this.$containerEl.removeClass('te-ww-mode');
    this.$containerEl.addClass('te-md-mode');
  }

  /**
   * Initialize editor to Markdown and set preview section
   * @private
   */
  _initMarkdownAndPreviewSection() {
    this.$mdEditorContainerEl = this.$containerEl.find('.te-md-container .te-editor');
    this.$previewEl = this.$containerEl.find('.te-md-container .te-preview');
  }

  /**
   * Initialize editor to WYSIWYG
   * @private
   */
  _initWysiwygSection() {
    this.$wwEditorContainerEl = this.$containerEl.find('.te-ww-container .te-editor');
  }

  /**
   * Set preview to vertical split style
   * @private
   */
  _verticalSplitStyle() {
    this.$containerEl.find('.te-md-container').removeClass('te-preview-style-tab');
    this.$containerEl.find('.te-md-container').addClass('te-preview-style-vertical');
  }

  /**
   * Set tab style preview mode
   * @private
   */
  _tabStyle() {
    this.$containerEl.find('.te-md-container').removeClass('te-preview-style-vertical');
    this.$containerEl.find('.te-md-container').addClass('te-preview-style-tab');
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
    this.$el.find('.tui-editor').addClass('te-hide');
  }

  /**
   * Show Editor
   */
  show() {
    this.$el.find('.tui-editor').removeClass('te-hide');
  }

  /**
   * Remove Editor
   */
  remove() {
    this.$el.find('.tui-editor').remove();
  }

  /**
   * Get jQuery wrapped editor container element
   * @returns {jQuery}
   */
  getEditorEl() {
    return this.$containerEl;
  }

  /**
   * Get jQuery wrapped preview element
   * @returns {jQuery}
   */
  getPreviewEl() {
    return this.$previewEl;
  }

  /**
   * Get jQuery wrapped Markdown editor element
   * @returns {jQuery}
   */
  getMdEditorContainerEl() {
    return this.$mdEditorContainerEl;
  }

  /**
   * Get jQuery wrapped WYSIWYG editor element
   * @returns {jQuery}
   */
  getWwEditorContainerEl() {
    return this.$wwEditorContainerEl;
  }
}

export default Layout;
