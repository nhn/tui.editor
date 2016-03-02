/**
 * @fileoverview
 * @author Minho Choi(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var TOOLTIP_CONTENT = '<div class="tui-tooltip"><div class="arrow"></div><span class="text"></span></span></div>';

/**
 * Tooltip
 * @exports Tooltip
 * @constructor
 */
function Tooltip() {
    this.$el = $(TOOLTIP_CONTENT);
    this.$el.appendTo('body');
    this.$el.hide();
}

/**
 * 툴팁을 보여줌
 * @param {jQuery} target 툴팁을 보여줄 대상
 * @param {String} text 툴팁내용
 */
Tooltip.prototype.show = function(target, text) {
    this.$el.css({
        'top': target.offset().top + target.height() + 13,
        'left': target.offset().left + 3
    }).find('.text').html(text).end().show();
};

Tooltip.prototype.hide = function() {
    this.$el.hide();
};

module.exports = Tooltip;
