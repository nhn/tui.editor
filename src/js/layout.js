/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var Toolbar = require('./toolbar'),
    Tab = require('./tab'),
    PopupAddLink = require('./popupAddLink'),
    PopupAddImage = require('./popupAddImage');

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
    this.$containerEl = this._initContainerEl();

    this.toolbar = new Toolbar(this.eventManager);
    this.$containerEl.find('.toolbarSection').append(this.toolbar.$el);


    this._initPopupAddLink();
    this._initPopupAddImage();

    this.$mdEditorContainerEl = this._initMdEditorContainerEl();
    this.$previewEl = this._initPreviewEl();
    this.$wwEditorContainerEl = this._initWwEditorContainerEl();

    //markdown
    this.tab = new Tab({
        items: ['Editor', 'Preview'],
        sections: [this.$mdEditorContainerEl, this.$previewEl]
    });

    this.$containerEl.find('.tabSection').append(this.tab.$el);

    this.tab.activate('Editor');
};

Layout.prototype._initContainerEl = function() {
    var containerTmpl = [
        '<div class="neditor">',
           '<div class="toolbarSection" />',
            '<div class="mdContainer">',
               '<div class="tabSection" />',
            '</div>',
            '<div class="wysiwygContainer" />',
        '</div>'
    ];

    return $(containerTmpl.join('')).appendTo(this.$el);
};

Layout.prototype._initMdEditorContainerEl = function() {
    return $('<div>')
        .addClass('editor')
        .height(this.height)
        .appendTo(this.$containerEl.find('.mdContainer'));
};

Layout.prototype._initPreviewEl = function() {
    return $('<div>')
        .addClass('preview')
        .height(this.height)
        .appendTo(this.$containerEl.find('.mdContainer'));
};

Layout.prototype._initWwEditorContainerEl = function() {
    return $('<div>')
        .addClass('editor')
        .height(this.height)
        .appendTo(this.$containerEl.find('.wysiwygContainer'));
};

Layout.prototype._initPopupAddLink = function() {
    this.popupAddLink = new PopupAddLink({
        $target: this.$el,
        eventManager: this.eventManager
    });
};

Layout.prototype._initPopupAddImage = function() {
    this.popupAddImage = new PopupAddImage({
        $target: this.$el,
        eventManager: this.eventManager
    });
};

Layout.prototype.verticalSplitStyle = function() {
    this.$containerEl.find('.mdContainer').removeClass('preview-style-tab');
    this.$containerEl.find('.mdContainer').addClass('preview-style-vertical');
};

Layout.prototype.tabStyle = function() {
    this.$containerEl.find('.mdContainer').removeClass('preview-style-vertical');
    this.$containerEl.find('.mdContainer').addClass('preview-style-tab');
};

Layout.prototype.changePreviewStyle = function(style) {
    if (style === 'tab') {
        this.tabStyle();
    } else if (style === 'vertical') {
        this.verticalSplitStyle();
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
