/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var Toolbar = require('./toolbar.js');

/**
 * Layout
 * @exports Layout
 * @extends {}
 * @constructor
 * @class
 */
function Layout(options, eventManager, commandManager) {
    this.$el = $(options.el);
    this.previewStyle = options.previewStyle === 'tab' ? 'tab' : 'column';
    this.height = options.height;
    this.eventManager = eventManager;
    this.commandManager = commandManager;
}


Layout.prototype.init = function() {
    console.log('Layout Init');

    this.toolbar = new Toolbar(this.$el, this.eventManager, this.commandManager);
    this.$el.append(this.toolbar.$el);

    this.$containerEl = this._initContainerEl();
    //this.$toolbarEl = this._initToolbarEl();

    if (this.previewStyle === 'tab') {
        this._initTabEl();
    }

    this.$editorContainerEl = this._initEditorEl();
    this.$previewEl = this._initPreviewEl();

    //this.$statusbarEl = this._initStatusBarEl();
    //this.$statusbarLeftAreaEl = this._initStatusBarLeftAreaEl();
    //this.$statusbarRightAreaEl = this._initStatusBarRightAreaEl();
};

Layout.prototype._initContainerEl = function() {
    return $('<div>')
        .addClass('editor-container')
        .addClass('preview-style-' + this.previewStyle)
        .appendTo(this.$el);
};

Layout.prototype._initToolbarEl = function() {
    return $('<div>')
        .addClass('toolbar')
        .appendTo(this.$containerEl)
        //TODO extension 정의 후 제거(addButton() 사용)
        .append('<button type="button" style="font-weight:bold">B</button>')
        .append('<button type="button" style="font-style:italic">I</button>')
        .append('<button type="button" style="text-decoration:underline">U</button>');
};

Layout.prototype._initTabEl = function() {
    var self = this;
    var $editorButton = $('<button type="button" class="active">Editor</button>');
    var $previewButton = $('<button type="button">Preview</button>');

    $editorButton.on('click', function() {
        self.$editorContainerEl.addClass('active');
        self.$previewEl.removeClass('active');
        $editorButton.addClass('active');
        $previewButton.removeClass('active');
    });

    $previewButton.on('click', function () {
        self.$editorContainerEl.removeClass('active');
        self.$previewEl.addClass('active');
        $editorButton.removeClass('active');
        $previewButton.addClass('active');
    });

    return $('<div>')
        .addClass('tab')
        .append($editorButton)
        .append($previewButton)
        .appendTo(this.$containerEl);
};

Layout.prototype._initEditorEl = function() {
    return $('<div>')
        .addClass('editor')
        .addClass('active')
        .height(this.height)
        //.attr('contenteditable', 'true')
        .appendTo(this.$containerEl);
};

Layout.prototype._initPreviewEl = function() {
    return $('<div>')
        .addClass('preview')
        .height(this.height)
        .appendTo(this.$containerEl)
};

Layout.prototype._initStatusBarEl = function() {
    return $('<div>')
        .addClass('statusbar')
        .appendTo(this.$containerEl);
};

Layout.prototype._initStatusBarLeftAreaEl = function() {
    return $('<span>')
        .addClass('left')
        .appendTo(this.$statusbarEl)
        //TODO 샘플 텍스트 제거
        .text('p > img');
};

Layout.prototype._initStatusBarRightAreaEl = function() {
    return $('<span>')
        .addClass('right')
        .appendTo(this.$statusbarEl)
        //TODO 샘플 텍스트 제거
        .text('10:00 임시 저장 됨');
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

Layout.prototype.getEditorContainerEl = function() {
    return this.$editorContainerEl;
};

module.exports = Layout;
