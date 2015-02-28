/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var Action = require('./action'),
    Session = require('./session'),
    Selection = require('./selection'),
    PartManager = require('./partManager');

var CONTENT_CHANGE_DELAY = 500;

/**
 * MarkdownEditor
 * @exports MarkdownEditor
 * @extends {}
 * @constructor
 * @class
 */
function MarkdownEditor(base, options) {
    var self = this;

    this.base = base;
    this.$editorEl = this.base.layout.$editorEl;

    this._contentDelayTOID = null;

    this.action = new Action({
        editor: this
    });

    this.session = new Session(this.base);
    this.partManager = new PartManager();
    this.selection = new Selection({
        $editorEl: this.$editorEl
    });
}

MarkdownEditor.prototype.init = function() {};

MarkdownEditor.prototype.newLine = function() {
    //셀렉션정보 만들어서 넘기기
    this.session.newLine();
};

MarkdownEditor.prototype.contentChanged = function() {
    var self = this;

    if (this._contentDelayTOID) {
        clearTimeout(this._contentDelayTOID);
    }

    this._contentDelayTOID = setTimeout(function() {
        self.action.stopObserveContent();

        var selectionInfo = self.selection.getCurrentSelection();
        self.applySyntaxHighlight();
        self.selection.select(selectionInfo);

        self.action.observeContent();
    }, CONTENT_CHANGE_DELAY);

};

MarkdownEditor.prototype.applySyntaxHighlight = function() {
    var $el = this.$editorEl;
    $el.html(Prism.highlight($el[0].innerText, Prism.languages.markdown));
};

module.exports = MarkdownEditor;
