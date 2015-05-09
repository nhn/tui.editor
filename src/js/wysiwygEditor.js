/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var Bold = require('./squireCommand/bold');
var Squire = window.Squire;

/**
 * WysiwygEditor
 * @exports WysiwygEditor
 * @constructor
 * @class
 * @param {jQuery} $el 에디터가 들어갈 엘리먼트
 * @param {EventManager} eventManager 이벤트 매니저
 * @param {commandManager} commandManager 커맨드 매니저
 */
function WysiwygEditor($el, eventManager, commandManager) {
    this.eventManager = eventManager;
    this.$editorContainerEl = $el;

    commandManager.addCommand(Bold);
}

WysiwygEditor.prototype.init = function(height) {
    var self = this;

    this.$iframe = $('<iframe />');

    this.$iframe.ready(function() {
        var doc = self.$iframe[0].contentDocument;

        if (self.editor) {
            return;
        }

        self._makeSureStandardMode(doc);
        self._initStyleSheet(doc);
        self.editor = new Squire(doc);
        self.setHeight(height);

        self._initEvent();
    });

    this.$editorContainerEl.append(this.$iframe);
};

WysiwygEditor.prototype._makeSureStandardMode = function(doc) {
    if (doc.compatMode !== 'CSS1Compat') {
        doc.open();
        doc.write('<!DOCTYPE html><title></title>');
        doc.close();
    }
};

WysiwygEditor.prototype._initStyleSheet = function(doc) {
        var styleLink = doc.createElement('link');

        styleLink.rel = 'stylesheet';
        styleLink.href = '../src/css/contentStyle.css';

        doc.querySelector('head').appendChild(styleLink);
        doc.querySelector('body').className = '.neditor-content';
        doc.querySelector('html').className = '.neditor-content';
};

WysiwygEditor.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('htmlUpdate', function(html) {
        self.setValue(html);
    });
};

WysiwygEditor.prototype.setHeight = function(height) {
    this.$iframe.height(height);
};

WysiwygEditor.prototype.setValue = function(html) {
    this.editor.setHTML(html);
};

WysiwygEditor.prototype.getValue = function() {
    return this.editor.getHTML();
};

module.exports = WysiwygEditor;

