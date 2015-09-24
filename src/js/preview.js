/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var LazyRunner = require('./lazyRunner');

/**
 * Preview
 * @exports Preview
 * @extends {}
 * @constructor
 * @class
 * @param {jQuery} $el 프리뷰가 들어갈 엘리먼트
 * @param {EventManager} eventManager 이벤트 매니저
 * @param {Converter} converter 컨버터
 **/
function Preview($el, eventManager, converter) {
    this.eventManager = eventManager;
    this.converter = converter;
    this.$el = $el;

    this._initContentSection();

    this.lazyRunner = new LazyRunner();

    this.lazyRunner.registerLazyRunFunction(
        'refresh',
        this.refresh,
        800,
        this
    );

    this._initEvent();
}

Preview.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('contentChanged.markdownEditor', function(markdownEditor) {
        self.lazyRunner.run('refresh', markdownEditor.getValue());
    });
};

Preview.prototype._initContentSection = function() {
    this.$previewContent = $('<div class="previewContent neonEditor-content" />');
    this.$el.append(this.$previewContent);
};

Preview.prototype.refresh = function(markdown) {
    this.render(this.converter.toHTMLWithCodeHightlight(markdown));
};

Preview.prototype.render = function(html) {
    var processedDataByHook,
        finalHtml = html;

    processedDataByHook = this.eventManager.emit('previewBeforeHook', html);

    if (processedDataByHook) {
        finalHtml = processedDataByHook[0];
    }

    this.$previewContent.empty();
    this.$previewContent.html(finalHtml);

    this.eventManager.emit('previewRenderAfter', this);
};

Preview.prototype.setHeight = function(height) {
    this.$el.height(height);
};

module.exports = Preview;
