/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Bold = require('./wysiwygCommands/bold'),
    Italic = require('./wysiwygCommands/italic'),
    Blockquote = require('./wysiwygCommands/blockquote'),
    AddImage = require('./wysiwygCommands/addImage'),
    AddLink = require('./wysiwygCommands/addLink'),
    HR = require('./wysiwygCommands/hr'),
    Heading = require('./wysiwygCommands/heading'),
    UL = require('./wysiwygCommands/ul'),
    OL = require('./wysiwygCommands/ol');

var Squire = window.Squire,
    util = ne.util;

/**
 * WysiwygEditor
 * @exports WysiwygEditor
 * @constructor
 * @class
 * @param {jQuery} $el 에디터가 들어갈 엘리먼트
 * @param {string[]} contentStyles List of CSS style file path for HTML content
 * @param {EventManager} eventManager 이벤트 매니저
 * @param {commandManager} commandManager 커맨드 매니저
 */
function WysiwygEditor($el, contentStyles, eventManager, commandManager) {
    this.eventManager = eventManager;
    this.$editorContainerEl = $el;
    this.contentStyles = contentStyles;

    commandManager.addCommand(Bold);
    commandManager.addCommand(Italic);
    commandManager.addCommand(Blockquote);
    commandManager.addCommand(UL);
    commandManager.addCommand(OL);
    commandManager.addCommand(AddImage);
    commandManager.addCommand(AddLink);
    commandManager.addCommand(HR);
    commandManager.addCommand(Heading);
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

        self.editor = new Squire(doc, {
            blockTag: 'P'
        });

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
    var styleLink;

    util.forEach(this.contentStyles, function(stylePath) {
        styleLink = doc.createElement('link');
        styleLink.rel = 'stylesheet';
        styleLink.href = stylePath;

        doc.querySelector('head').appendChild(styleLink);
    });

    doc.querySelector('body').className = '.neditor-content';
    doc.querySelector('html').className = '.neditor-content';
};

WysiwygEditor.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('htmlUpdate', function(html) {
        self.setValue(html);
    });

    this.editor.addEventListener('input', function() {
        self.eventManager.emit('contentChanged.wysiwygEditor', self.getValue());
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

