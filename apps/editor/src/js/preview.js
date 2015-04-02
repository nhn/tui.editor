/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

/**
 * Preview
 * @exports Preview
 * @extends {}
 * @constructor
 * @class
 */
function Preview($el, eventManager) {
    this.eventManager = eventManager;
    this.$el = $el;

    this.init();
}

Preview.prototype.init = function() {
    var $el = this.$el,
        eventManager = this.eventManager,
        domData,
        processedDataByHook;

    eventManager.listen('previewUpdate', function(html) {
        domData = $(html);

        processedDataByHook = eventManager.emit('previewBeforeHook', domData) || domData;

        if (processedDataByHook) {
            domData = processedDataByHook[0];
        }

        $el.empty();
        $el.append(domData);
    });
};

module.exports = Preview;
