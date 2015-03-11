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
function MarkdownEditor(eventManager, el) {
    this.eventManager = eventManager;
    this.$editorContainerEl = el;

    this.init();
}

MarkdownEditor.prototype.init = function() {
    var cmTextarea = $('<textarea />');

    this.$editorContainerEl.append(cmTextarea);

    this.cm = CodeMirror.fromTextArea(cmTextarea[0], {
        lineWrapping: true,
        mode: "markdown"
    });

    this._initEvent();
};

MarkdownEditor.prototype._initEvent = function() {
    var self = this;

    this.cm.on('update', function(cm) {
        console.log('event: update', cm);
        self.eventManager.emit('markdownUpdated', cm.doc.getValue('\n'));
    });

    this.cm.on('change', function() {
        console.log('event: change', arguments);
    });

    this.cm.on('scroll', function() {
        console.log('event: scroll', arguments);
    });
};

MarkdownEditor.prototype.focus = function() {
    this.cm.focus();
};

module.exports = MarkdownEditor;
