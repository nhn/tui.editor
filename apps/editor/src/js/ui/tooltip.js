/**
 * @fileoverview Implements tooltip
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import css from 'tui-code-snippet/domUtil/css';
import domUtils from '../domUtils';

const TOOLTIP_CONTENT = '<div class="arrow"></div><span class="text"></span></span>';

/**
 * Class Tooltip
 * @ignore
 */
class Tooltip {
  constructor() {
    this.$el = this.createTooltipElement();

    document.body.appendChild(this.$el);

    this.hide();
  }

  createTooltipElement() {
    const wrapper = document.createElement('div');

    wrapper.className = 'tui-tooltip';
    wrapper.innerHTML = TOOLTIP_CONTENT;

    return wrapper;
  }

  /**
   * show tooltop
   * @param {HTMLElement} target - target element to bind
   * @param {String} text - text to show
   */
  show(target, text) {
    css(this.$el, {
      top: target.offset().top + target.height() + 13, // below the button
      left: target.offset().left + 3
    });
    this.$el
      .find('.text')
      .html(text)
      .end()
      .show();
  }

  hide() {
    domUtils.hide(this.$el);
  }

  remove() {
    domUtils.removeNode(this.$el);
  }
}

export default new Tooltip();
