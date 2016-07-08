/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';
/**
 * Editor container template
 * @type {string}
 */
var containerTmpl = [
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
 * Layout
 * @exports Layout
 * @constructor
 * @class Layout
 * @param {object} options Option object
 * @param {EventManager} eventManager Event manager instance
 */
function Layout(options, eventManager) {
    this.$el = $(options.el);
    this.height = options.height;
    this.type = options.initialEditType;
    this.eventManager = eventManager;

    this.init();
    this._initEvent();
}

/**
 * Initializer
 * @api
 * @memberOf Layout
 */
Layout.prototype.init = function() {
    this._renderLayout();

    this._initMarkdownAndPreviewSection();
    this._initWysiwygSection();
};

/**
 * Initialize show and hide event
 * @memberOf Layout
 * @private
 */
Layout.prototype._initEvent = function() {
    this.eventManager.listen('hide', this.hide.bind(this));
    this.eventManager.listen('show', this.show.bind(this));
};

/**
 * Create editor container with template
 * @memberOf Layout
 * @private
 */
Layout.prototype._renderLayout = function() {
    this.$containerEl = $(containerTmpl).appendTo(this.$el);
};

/**
 * Switch editor mode to WYSIWYG
 * @api
 * @memberOf Layout
 */
Layout.prototype.switchToWYSIWYG = function() {
    this.$containerEl.removeClass('te-md-mode');
    this.$containerEl.addClass('te-ww-mode');
};

/**
 * Switch editor mode to Markdown
 * @api
 * @memberOf Layout
 */
Layout.prototype.switchToMarkdown = function() {
    this.$containerEl.removeClass('te-ww-mode');
    this.$containerEl.addClass('te-md-mode');
};

/**
 * Initialize editor to Markdown and set preview section
 * @memberOf Layout
 * @private
 */
Layout.prototype._initMarkdownAndPreviewSection = function() {
    this.$mdEditorContainerEl = this.$containerEl.find('.te-md-container .te-editor');
    this.$previewEl = this.$containerEl.find('.te-md-container .te-preview');
};

/**
 * Initialize editor to WYSIWYG
 * @memberOf Layout
 * @private
 */
Layout.prototype._initWysiwygSection = function() {
    this.$wwEditorContainerEl = this.$containerEl.find('.te-ww-container .te-editor');
};

/**
 * Set preview to vertical split style
 * @memberOf Layout
 * @private
 */
Layout.prototype._verticalSplitStyle = function() {
    this.$containerEl.find('.te-md-container').removeClass('te-preview-style-tab');
    this.$containerEl.find('.te-md-container').addClass('te-preview-style-vertical');
};

/**
 * Set tab style preview mode
 * @memberOf Layout
 * @private
 */
Layout.prototype._tabStyle = function() {
    this.$containerEl.find('.te-md-container').removeClass('te-preview-style-vertical');
    this.$containerEl.find('.te-md-container').addClass('te-preview-style-tab');
};

/**
 * Toggle preview style between tab and vertical split
 * @api
 * @memberOf Layout
 * @param {string} style Preview style ('tab' or 'vertical')
 */
Layout.prototype.changePreviewStyle = function(style) {
    if (style === 'tab') {
        this._tabStyle();
    } else if (style === 'vertical') {
        this._verticalSplitStyle();
    }
};

/**
 * Hide Editor
 * @api
 * @memberOf Layout
 */
Layout.prototype.hide = function() {
    this.$el.find('.tui-editor').addClass('te-hide');
};

/**
 * Show Editor
 * @api
 * @memberOf Layout
 */
Layout.prototype.show = function() {
    this.$el.find('.tui-editor').removeClass('te-hide');
};

/**
 * Remove Editor
 * @api
 * @memberOf Layout
 */
Layout.prototype.remove = function() {
    this.$el.find('.tui-editor').remove();
};

/**
 * Get jQuery wrapped editor container element
 * @api
 * @memberOf Layout
 * @returns {jQuery}
 */
Layout.prototype.getEditorEl = function() {
    return this.$containerEl;
};

/**
 * Get jQuery wrapped preview element
 * @api
 * @memberOf Layout
 * @returns {jQuery}
 */
Layout.prototype.getPreviewEl = function() {
    return this.$previewEl;
};

/**
 * Get jQuery wrapped Markdown editor element
 * @api
 * @memberOf Layout
 * @returns {jQuery}
 */
Layout.prototype.getMdEditorContainerEl = function() {
    return this.$mdEditorContainerEl;
};

/**
 * Get jQuery wrapped WYSIWYG editor element
 * @api
 * @memberOf Layout
 * @returns {jQuery}
 */
Layout.prototype.getWwEditorContainerEl = function() {
    return this.$wwEditorContainerEl;
};

module.exports = Layout;
