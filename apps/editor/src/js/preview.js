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
    var $el = this.$el;

    this.eventManager.listen('previewUpdate', function(html) {
        $el.html(html);
    });
};

module.exports = Preview;
