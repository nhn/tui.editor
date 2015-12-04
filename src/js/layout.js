/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var containerTmpl = [
    '<div class="tui-editor">',
        '<div class="te-md-container">',
            '<div class="te-editor" />',
            '<div class="te-md-splitter" />',
            '<div class="te-preview tui-editor-contents" />',
        '</div>',
        '<div class="te-ww-container">',
            '<div class="te-editor" />',
        '</div>',
    '</div>'
].join('');

/**
 * Layout
 * @exports Layout
 * @extends {}
 * @constructor
 * @class
 * @param {object} options 옵션
 * @param {EventManager} eventManager 이벤트 매니저
 */
function Layout(options, eventManager) {
    this.$el = $(options.el);
    this.height = options.height;
    this.type = options.initialEditType;
    this.eventManager = eventManager;

    this.init();
    this._initEvent();
}

Layout.prototype.init = function() {
    this._renderLayout();

    this._initMarkdownAndPreviewSection();
    this._initWysiwygSection();
};

Layout.prototype._initEvent = function() {
    this.eventManager.listen('hide', this.hide.bind(this));
    this.eventManager.listen('show', this.show.bind(this));
};

Layout.prototype._renderLayout = function() {
    this.$containerEl = $(containerTmpl).appendTo(this.$el);
};

Layout.prototype.switchToWYSIWYG = function() {
    this.$containerEl.removeClass('te-md-mode');
    this.$containerEl.addClass('te-ww-mode');
};

Layout.prototype.switchToMarkdown = function() {
    this.$containerEl.removeClass('te-ww-mode');
    this.$containerEl.addClass('te-md-mode');
};

Layout.prototype._initMarkdownAndPreviewSection = function() {
    this.$mdEditorContainerEl = this.$containerEl.find('.te-md-container .te-editor');
    this.$previewEl = this.$containerEl.find('.te-md-container .te-preview');
};

Layout.prototype._initWysiwygSection = function() {
    this.$wwEditorContainerEl = this.$containerEl.find('.te-ww-container .te-editor');
};

Layout.prototype._verticalSplitStyle = function() {
    this.$containerEl.find('.te-md-container').removeClass('te-preview-style-tab');
    this.$containerEl.find('.te-md-container').addClass('te-preview-style-vertical');
};

Layout.prototype._tabStyle = function() {
    this.$containerEl.find('.te-md-container').removeClass('te-preview-style-vertical');
    this.$containerEl.find('.te-md-container').addClass('te-preview-style-tab');
};

Layout.prototype.changePreviewStyle = function(style) {
    if (style === 'tab') {
        this._tabStyle();
    } else if (style === 'vertical') {
        this._verticalSplitStyle();
    }
};

Layout.prototype.hide = function() {
    this.$el.find('.tui-editor').addClass('te-hide');
};

Layout.prototype.show = function() {
    this.$el.find('.tui-editor').removeClass('te-hide');
};

Layout.prototype.remove = function() {
    this.$el.find('.tui-editor').remove();
};

Layout.prototype.getEditorEl = function() {
    return this.$containerEl;
};

Layout.prototype.getPreviewEl = function() {
    return this.$previewEl;
};

Layout.prototype.getMdEditorContainerEl = function() {
    return this.$mdEditorContainerEl;
};

Layout.prototype.getWwEditorContainerEl = function() {
    return this.$wwEditorContainerEl;
};

module.exports = Layout;
