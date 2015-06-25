/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var marked = window.marked,
    toMark = window.toMark,
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
    this.latestHtml = '';
}

Convertor.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('contentChanged.markdownEditor', function(markdown) {
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

    this.eventManager.listen('changeEditorTypeToWysiwyg', function() {
        var html;
        html = self._markdownToHtml(self.latestMarkdown);
        console.log('\n\n~~toHtml~~\n', self.latestMarkdown, '\n-------\n', html);
        self.eventManager.emit('htmlUpdate', html);
    });

    this.eventManager.listen('changeEditorTypeToMarkdown', function() {
        var markdown;

        if (self.latestHtml) {
            //remove br created by Squire
            markdown = toMark(self.latestHtml.replace(/<br>/g, ''));
            console.log('\n\n~~toMD~~\n', self.latestHtml.replace(/<br>/g, ''), '\n------->\n', markdown);
            self.eventManager.emit('markdownUpdate', markdown);
        }
    });

    this.eventManager.listen('contentChanged.wysiwygEditor', function(html) {
        self.latestHtml = html;
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
