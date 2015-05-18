/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Toolbar = require('./toolbar'),
    Tab = require('./tab'),
    EditorTypeSwitch = require('./editorTypeSwitch'),
    PopupAddLink = require('./popupAddLink'),
    PopupAddImage = require('./popupAddImage');

var containerTmpl = [
        '<div class="neditor">',
           '<div class="toolbarSection" />',
           '<div class="editorTypeSwitchSection" />',
            '<div class="mdContainer">',
               '<div class="tabSection" />',
               '<div class="editor" />',
               '<div class="preview neditor-content" />',
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
    this.eventManager = eventManager;
}

Layout.prototype.init = function() {
    this._renderLayout();

    this._initToolbar();
    this._initEditorTypeSwitch();

    this._initPopupAddLink();
    this._initPopupAddImage();

    this._initMarkdownAndPreviewSection();
    this._initWysiwygSection();

    this._switchToMarkdown();
};

Layout.prototype._renderLayout = function() {
    this.$containerEl = $(containerTmpl).appendTo(this.$el);
};

Layout.prototype._initToolbar = function() {
    this.toolbar = new Toolbar(this.eventManager);
    this.$containerEl.find('.toolbarSection').append(this.toolbar.$el);
};

Layout.prototype._initEditorTypeSwitch = function() {
    var self = this;

    this.editorTypeSwitch = new EditorTypeSwitch(this.eventManager);
    this.$containerEl.find('.editorTypeSwitchSection').append(this.editorTypeSwitch.$el);

    this.eventManager.listen('editorTypeSwitched', function(type) {
        if (type === EditorTypeSwitch.TYPE.WYSIWYG) {
            self._switchToWYSIWYG();
        } else {
            self._switchToMarkdown();
        }
    });
};

Layout.prototype._switchToWYSIWYG = function() {
    this.$containerEl.find('.mdContainer').css('display', 'none');
    this.$containerEl.find('.wysiwygContainer').css('display', 'block');
};

Layout.prototype._switchToMarkdown = function() {
    this.$containerEl.find('.mdContainer').css('display', 'block');
    this.$containerEl.find('.wysiwygContainer').css('display', 'none');
};

Layout.prototype._initMarkdownAndPreviewSection = function() {
    this.$mdEditorContainerEl = this.$containerEl.find('.mdContainer .editor');
    this.$previewEl = this.$containerEl.find('.mdContainer .preview');

    this.$mdEditorContainerEl.height(this.height);
    this.$previewEl.height(this.height);

    this.tab = new Tab({
        items: ['Editor', 'Preview'],
        sections: [this.$mdEditorContainerEl, this.$previewEl]
    });

    this.$containerEl.find('.tabSection').append(this.tab.$el);

    this.tab.activate('Editor');
};

Layout.prototype._initWysiwygSection = function() {
    this.$wwEditorContainerEl = this.$containerEl.find('.wysiwygContainer .editor');
    this.$wwEditorContainerEl.height(this.height);
};

Layout.prototype._initPopupAddLink = function() {
    this.popupAddLink = new PopupAddLink({
        $target: this.$el.find('.neditor'),
        eventManager: this.eventManager
    });
};

Layout.prototype._initPopupAddImage = function() {
    this.popupAddImage = new PopupAddImage({
        $target: this.$el.find('.neditor'),
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
