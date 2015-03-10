/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

/**
 * Layout
 * @exports Layout
 * @extends {}
 * @constructor
 * @class
 */
function Layout(base, options) {
    this.$el = $(options.el);
}


Layout.prototype.init = function() {
    console.log('Layout Init');

    this.$containerEl = this._initContainerEl();
    this.$toolbarEl = this._initToolbarEl();
    this.$editorContainerEl = this._initEditorEl();
    this.$previewEl = this._initPreviewEl();
    this.$statusbarEl = this._initStatusBarEl();
    this.$statusbarLeftAreaEl = this._initStatusBarLeftAreaEl();
    this.$statusbarRightAreaEl = this._initStatusBarRightAreaEl();
};

Layout.prototype._initContainerEl = function() {
    return $('<div>')
        .addClass('editor-container')
        .appendTo(this.$el);
};

Layout.prototype._initToolbarEl = function() {
    return $('<div>')
        .addClass('toolbar')
        .appendTo(this.$containerEl)
        //TODO extension 정의 후 제거(addButton() 사용)
        .append('<button style="font-weight:bold">B</button>')
        .append('<button style="font-style:italic">I</button>')
        .append('<button style="text-decoration:underline">U</button>');
};

Layout.prototype._initEditorEl = function() {
    return $('<div>')
        .addClass('editor')
        //.attr('contenteditable', 'true')
        .appendTo(this.$containerEl);
};

Layout.prototype._initPreviewEl = function() {
    return $('<div>')
        .addClass('preview')
        .appendTo(this.$containerEl);
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

module.exports = Layout;