/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Toolbar = require('./toolbar'),
    Tab = require('./tab'),
    ModeSwitch = require('./modeSwitch'),
    PopupAddLink = require('./popupAddLink'),
    PopupAddImage = require('./popupAddImage');

var containerTmpl = [
    '<div class="neonEditor">',
        '<div class="toolbarSection" />',
        '<div class="modeSwitchSection" />',
        '<div class="mdContainer">',
            '<div class="tabSection" />',
            '<div class="editor" />',
            '<div class="preview neonEditor-content" />',
        '</div>',
        '<div class="wysiwygContainer">',
            '<div class="editor" />',
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

    this._initToolbar();
    this._initModeSwitch();

    this._initPopupAddLink();
    this._initPopupAddImage();

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

Layout.prototype._initToolbar = function() {
    this.toolbar = new Toolbar(this.eventManager);
    this.$containerEl.find('.toolbarSection').append(this.toolbar.$el);
};

Layout.prototype._initModeSwitch = function() {
    var self = this;

    this.modeSwitch = new ModeSwitch(this.type === 'markdown' ? ModeSwitch.TYPE.MARKDOWN : ModeSwitch.TYPE.WYSIWYG);
    this.$containerEl.find('.modeSwitchSection').append(this.modeSwitch.$el);
};

Layout.prototype.switchToWYSIWYG = function() {
    this.$containerEl.removeClass('markdownMode');
    this.$containerEl.addClass('wysiwygMode');
};

Layout.prototype.switchToMarkdown = function() {
    this.$containerEl.removeClass('wysiwygMode');
    this.$containerEl.addClass('markdownMode');
    this.markdownTab.activate('Editor');
};

Layout.prototype._initMarkdownAndPreviewSection = function() {
    this.$mdEditorContainerEl = this.$containerEl.find('.mdContainer .editor');
    this.$previewEl = this.$containerEl.find('.mdContainer .preview');

    this.markdownTab = new Tab({
        items: ['Editor', 'Preview'],
        sections: [this.$mdEditorContainerEl, this.$previewEl]
    });

    this.$containerEl.find('.mdContainer .tabSection').append(this.markdownTab.$el);
};

Layout.prototype._initWysiwygSection = function() {
    this.$wwEditorContainerEl = this.$containerEl.find('.wysiwygContainer .editor');
};

Layout.prototype._initPopupAddLink = function() {
    this.popupAddLink = new PopupAddLink({
        $target: this.$el.find('.neonEditor'),
        eventManager: this.eventManager
    });
};

Layout.prototype._initPopupAddImage = function() {
    this.popupAddImage = new PopupAddImage({
        $target: this.$el.find('.neonEditor'),
        eventManager: this.eventManager
    });
};

Layout.prototype._verticalSplitStyle = function() {
    this.$containerEl.find('.mdContainer').removeClass('preview-style-tab');
    this.$containerEl.find('.mdContainer').addClass('preview-style-vertical');
};

Layout.prototype._tabStyle = function() {
    this.$containerEl.find('.mdContainer').removeClass('preview-style-vertical');
    this.$containerEl.find('.mdContainer').addClass('preview-style-tab');
};

Layout.prototype.changePreviewStyle = function(style) {
    if (style === 'tab') {
        this._tabStyle();
    } else if (style === 'vertical') {
        this._verticalSplitStyle();
    }
};

Layout.prototype.hide = function() {
    this.$el.find('.neonEditor').addClass('hide');
};

Layout.prototype.show = function() {
    this.$el.find('.neonEditor').removeClass('hide');
};

Layout.prototype.remove = function() {
    this.$el.find('.neonEditor').remove();
};

Layout.prototype.getEditorEl = function() {
    return this.$containerEl;
};

Layout.prototype.getPreviewEl = function() {
    return this.$previewEl;
};

Layout.prototype.getStatusbarLeftAreaEl = function() {
    return this.$statusbarLeftAreaEl;
};

Layout.prototype.getStatusbarRightAreaEl = function() {
    return this.$statusbarRightAreaEl;
};

Layout.prototype.getMdEditorContainerEl = function() {
    return this.$mdEditorContainerEl;
};

Layout.prototype.getWwEditorContainerEl = function() {
    return this.$wwEditorContainerEl;
};

module.exports = Layout;
