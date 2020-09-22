/**
 * @fileoverview Implements tooltip
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import css from 'tui-code-snippet/domUtil/css';
import domUtils from '../utils/dom';

const TOOLTIP_CONTENT = '<div class="arrow"></div><span class="text"></span></span>';
const TOOLTIP_TOP_INDENT = 7;

/**
 * Class Tooltip
 * @ignore
 */
class Tooltip {
  constructor() {
    this.el = domUtils.createElementWith(`<div class="tui-tooltip">${TOOLTIP_CONTENT}</div>`);

    document.body.appendChild(this.el);

    this.hide();
  }

  /**
   * show tooltop
   * @param {HTMLElement} target - target element to bind
   * @param {String} text - text to show
   */
  show(target, text) {
    const targetRect = target.getBoundingClientRect();
    const left = targetRect.left + window.pageXOffset;
    const top = targetRect.top + window.pageYOffset;

    css(this.el, {
      top: `${top + target.clientHeight + TOOLTIP_TOP_INDENT}px`,
      left: `${left + 3}px`
    });

    this.el.querySelector('.text').innerHTML = text;

    css(this.el, { display: 'block' });
  }

  hide() {
    css(this.el, { display: 'none' });
  }

  remove() {
    domUtils.remove(this.el);
  }
}

export default new Tooltip();
