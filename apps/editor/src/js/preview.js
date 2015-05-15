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

    this.init();
}

Preview.prototype.init = function() {
    var $el = this.$el,
        eventManager = this.eventManager,
        domData;

    eventManager.listen('renderedHtmlUpdated', function(html) {
        domData = $(html);

        eventManager.emit('previewBeforeHook', domData);

        $el.empty();
        $el.append(domData);
    });
};

module.exports = Preview;
