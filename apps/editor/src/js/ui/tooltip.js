/**
 * @fileoverview Implements tooltip
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

const TOOLTIP_CONTENT = '<div class="tui-tooltip"><div class="arrow"></div><span class="text"></span></span></div>';

/**
 * Class Tooltip
 */
class Tooltip {
  /**
   * Creates an instance of Tooltip.
   * @memberof Tooltip
   */
  constructor() {
    this.$el = $(TOOLTIP_CONTENT);
    this.$el.appendTo('body');
    this.hide();
  }

  /**
   * show tooltop
   * @param {jQuery} target - target jQuery element to bind
   * @param {String} text - text to show
   */
  show(target, text) {
    this.$el.css({
      'top': target.offset().top + target.height() + 13, // below the button
      'left': target.offset().left + 3
    }).find('.text').html(text).end().show();
  }

  hide() {
    this.$el.hide();
  }

  remove() {
    this.$el.remove();
  }
}

export default new Tooltip();
