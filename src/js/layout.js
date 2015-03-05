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

    this._initEditorEl();
};

Layout.prototype._initEditorEl = function() {
    //height를 여기서 조절하면 ff에서 첫입력시 개행의 LF가 앞에 오는 경우가 있다. editorel은 사이즈를 고정하지말고 이것을 감싸는것으로 고정하자
    this.$editorEl = $('<div contenteditable="true" class="language-markdown" style="white-space: pre;" />');
    this.$el.append(this.$editorEl);
};

module.exports = Layout;