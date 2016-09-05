/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

/**
 * Editor container template
 * @type {string}
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
 * Layout
 * @exports Layout
 * @constructor
 * @class Layout
 * @param {object} options Option object
 * @param {EventManager} eventManager Event manager instance
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
     * @api
     * @memberOf Layout
     */
    init() {
        this._renderLayout();

        this._initMarkdownAndPreviewSection();
        this._initWysiwygSection();
    }

    /**
     * Initialize show and hide event
     * @memberOf Layout
     * @private
     */
    _initEvent() {
        this.eventManager.listen('hide', this.hide.bind(this));
        this.eventManager.listen('show', this.show.bind(this));
    }

    /**
     * Create editor container with template
     * @memberOf Layout
     * @private
     */
    _renderLayout() {
        this.$containerEl = $(containerTmpl).appendTo(this.$el);
    }

    /**
     * Switch editor mode to WYSIWYG
     * @api
     * @memberOf Layout
     */
    switchToWYSIWYG() {
        this.$containerEl.removeClass('te-md-mode');
        this.$containerEl.addClass('te-ww-mode');
    }

    /**
     * Switch editor mode to Markdown
     * @api
     * @memberOf Layout
     */
    switchToMarkdown() {
        this.$containerEl.removeClass('te-ww-mode');
        this.$containerEl.addClass('te-md-mode');
    }

    /**
     * Initialize editor to Markdown and set preview section
     * @memberOf Layout
     * @private
     */
    _initMarkdownAndPreviewSection() {
        this.$mdEditorContainerEl = this.$containerEl.find('.te-md-container .te-editor');
        this.$previewEl = this.$containerEl.find('.te-md-container .te-preview');
    }

    /**
     * Initialize editor to WYSIWYG
     * @memberOf Layout
     * @private
     */
    _initWysiwygSection() {
        this.$wwEditorContainerEl = this.$containerEl.find('.te-ww-container .te-editor');
    }

    /**
     * Set preview to vertical split style
     * @memberOf Layout
     * @private
     */
    _verticalSplitStyle() {
        this.$containerEl.find('.te-md-container').removeClass('te-preview-style-tab');
        this.$containerEl.find('.te-md-container').addClass('te-preview-style-vertical');
    }

    /**
     * Set tab style preview mode
     * @memberOf Layout
     * @private
     */
    _tabStyle() {
        this.$containerEl.find('.te-md-container').removeClass('te-preview-style-vertical');
        this.$containerEl.find('.te-md-container').addClass('te-preview-style-tab');
    }

    /**
     * Toggle preview style between tab and vertical split
     * @api
     * @memberOf Layout
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
     * @api
     * @memberOf Layout
     */
    hide() {
        this.$el.find('.tui-editor').addClass('te-hide');
    }

    /**
     * Show Editor
     * @api
     * @memberOf Layout
     */
    show() {
        this.$el.find('.tui-editor').removeClass('te-hide');
    }

    /**
     * Remove Editor
     * @api
     * @memberOf Layout
     */
    remove() {
        this.$el.find('.tui-editor').remove();
    }

    /**
     * Get jQuery wrapped editor container element
     * @api
     * @memberOf Layout
     * @returns {jQuery}
     */
    getEditorEl() {
        return this.$containerEl;
    }

    /**
     * Get jQuery wrapped preview element
     * @api
     * @memberOf Layout
     * @returns {jQuery}
     */
    getPreviewEl() {
        return this.$previewEl;
    }

    /**
     * Get jQuery wrapped Markdown editor element
     * @api
     * @memberOf Layout
     * @returns {jQuery}
     */
    getMdEditorContainerEl() {
        return this.$mdEditorContainerEl;
    }

    /**
     * Get jQuery wrapped WYSIWYG editor element
     * @api
     * @memberOf Layout
     * @returns {jQuery}
     */
    getWwEditorContainerEl() {
        return this.$wwEditorContainerEl;
    }
}

module.exports = Layout;
