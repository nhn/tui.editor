/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var EditorTypeSwitch = require('./editorTypeSwitch');

var marked = window.marked,
    hljs = window.hljs;

/**
 * Convertor
 * @exports Convertor
 * @extends {}
 * @constructor
 * @class
 * @param {EventManager} eventManager 이벤트 매니저
 */
function Convertor(eventManager) {
    this.eventManager = eventManager;
    this._initEvent();

    this.latestMarkdown = '';
}

Convertor.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('markdownEditorContentChanged', function(markdown) {
        var renderedHtml,
            processedDataByHook;

        renderedHtml = self._markdownToHtml(markdown);

        processedDataByHook = self.eventManager.emit('htmlRenderAfterHook', renderedHtml);

        if (processedDataByHook) {
            renderedHtml = processedDataByHook[0];
        }

        self.eventManager.emit('renderedHtmlUpdated', renderedHtml);

        self.latestMarkdown = markdown;
    });

    this.eventManager.listen('editorTypeSwitched', function(type) {
        if (type === EditorTypeSwitch.TYPE.MARKDOWN) {
            console.log('CONVERTER: TO MARKDOWN 뿅! 아직 작업 안되었음');
        } else {
            self.eventManager.emit('htmlUpdate', self._markdownToHtml(self.latestMarkdown));
        }
    });
};

Convertor.prototype._markdownToHtml = function(markdown) {
    return marked(markdown, {
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false,
        highlight: function(code) {
            return hljs.highlightAuto(code).value;
        }
    });
};

Convertor.factory = function(eventManager) {
    return new Convertor(eventManager);
};

module.exports = Convertor;
