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
    this.$editorContainerEl = this.base.layout.$editorEl;

    this.init();
}

MarkdownEditor.prototype.init = function() {
    var cmTextarea = $('<textarea />');

    this.$editorContainerEl.append(cmTextarea);

    this.cm = CodeMirror.fromTextArea(cmTextarea[0], {
        lineWrapping: true,
        mode: "markdown"
    });
};

module.exports = MarkdownEditor;
