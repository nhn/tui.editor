/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

/**
 * Preview
 * @exports Preview
 * @extends {}
 * @constructor
 * @class
 * @param {jQuery} $el 프리뷰가 들어갈 엘리먼트
 * @param {EventManager} eventManager 이벤트 매니저
 */
function Preview($el, eventManager) {
    this.eventManager = eventManager;
    this.$el = $el;
}

Preview.prototype.render = function(html) {
    var processedDataByHook,
        finalHtml = html;

    processedDataByHook = this.eventManager.emit('previewBeforeHook', html);

    if (processedDataByHook) {
        finalHtml = processedDataByHook[0];
    }

    this.$el.empty();
    this.$el.html(finalHtml);
};

module.exports = Preview;
