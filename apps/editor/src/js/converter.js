/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

/**
 * Convertor
 * @exports Convertor
 * @extends {}
 * @constructor
 * @class
 */
function Convertor(eventManager) {
    this.eventManager = eventManager;
    this._initEvent();
}

Convertor.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('markdownUpdated', function(markdown) {
        var renderedHtml = self._markdownToHtml(markdown);
        self.eventManager.emit('previewUpdate', renderedHtml);
    });
};

Convertor.prototype._markdownToHtml = function(markdown) {
    return marked(markdown, {
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
    });
};

module.exports = Convertor;