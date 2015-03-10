/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

/**
 * MarkdownEditor
 * @exports MarkdownEditor
 * @extends {}
 * @constructor
 * @class
 */
function MarkdownEditor(base, options) {
    this.base = base;
    this.$editorEl = this.base.layout.$editorEl;

    this.init();
}

MarkdownEditor.prototype.init = function() {

};

module.exports = MarkdownEditor;
