/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var marked = window.marked;

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
}

Convertor.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('markdownUpdated', function(markdown) {
        var renderedHtml,
            processedDataByHook;

        renderedHtml = self._markdownToHtml(markdown);

        processedDataByHook = self.eventManager.emit('htmlRenderAfterHook', renderedHtml);

        if (processedDataByHook) {
            renderedHtml = processedDataByHook[0];
        }

        self.eventManager.emit('previewUpdate', renderedHtml);
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
        smartypants: false
    });
};

module.exports = Convertor;
