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

    window.dd = this.selection;
    window.session = this.session;

    this.init();
}

MarkdownEditor.prototype.init = function() {
    //초반 파트 삽입
    this.$editorEl.html('<div><p class="line">\n</p></div>');
};

MarkdownEditor.prototype.newLine = function() {
    var sel = this.selection.getCurrentSelection();
    var range = this.session.newLine(sel);
    rangy.getSelection().removeAllRanges();
    rangy.getSelection().addRange(range);
};

MarkdownEditor.prototype.contentChanged = function() {
    var self = this;

    if (this._contentDelayTOID) {
        clearTimeout(this._contentDelayTOID);
    }
/*
    this._contentDelayTOID = setTimeout(function() {
        self.action.stopObserveContent();
        //self.checkChanged();

        self.selection.save();
        self.applySyntaxHighlight();

        $('#preivew').html(marked(self.$editorEl[0].innerText, {
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false
        }));
        self.selection.restore();
        self.action.observeContent();

    }, CONTENT_CHANGE_DELAY);*/
};

MarkdownEditor.prototype.applySyntaxHighlight = function() {
    var $el = this.$editorEl;
    var text = Prism.highlight($el[0].innerText, Prism.languages.markdown);
    //prism의 결과는 개행이 포함되지 않았으므로 삽입
    text = text.replace(/\n/g, '<span class="token lf">\n</span>');
    $el.html(text);
};

MarkdownEditor.prototype.checkChanged = function() {
    //console.log(this.$editorEl[0].innerText, this.$editorEl[0].innerText.split('\n'));

    var dests = this.$editorEl[0].innerText.split('\n');
    var srcIndex = 0;
    var changeStartIndex = 0;
    var changedLine = [];

    if (this.parts) {
        for (var index = 0; index < dests.length; index++) {
            if (dests[index] !== this.parts[index]) {
                changedLine.push(index);
            }
        }
    }

    console.log(changedLine);

    this.parts = dests;
};

module.exports = MarkdownEditor;
