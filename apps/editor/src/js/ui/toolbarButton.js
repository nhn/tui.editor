/**
 * @fileoverview Implements UI ToolbarButton
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

import ToolbarItem from './toolbarItem';
import tooltip from './tooltip';

/**
 * @typedef {object} toolbarItemsValue
 * @property {string} type - type of toolbar item (default value is 'button')
 * @property {toolbarButtonOptions} options - options of toolbar item
 */

/**
 * @typedef {object} toolbarButtonOptions
 * @property {HTMLElement} el - target element
 * @property {string} className - button's class name
 * @property {string} command - command name to execute on click
 * @property {string} event - event name to trigger on click
 * @property {string} text - text on button
 * @property {string} tooltip - text on tooltip
 * @property {string} style - button's style
 * @property {string} state - button's state
 */

/**
 * Class ToolbarButton UI
 * @param {toolbarButtonOptions} options - button options
 * @ignore
 */
class ToolbarButton extends ToolbarItem {
  /**
   * item name
   * @type {String}
   * @static
   */
  static name = 'button';

  /**
   * ToolbarItem className
   * @type {String}
   * @static
   */
  static className = 'tui-toolbar-icons';

  constructor(
    options = {
      tagName: 'button',
      name: ToolbarButton.name
    }
  ) {
    super({
      name: options.name,
      tagName: 'button',
      className: `${options.className} ${ToolbarButton.className}`,
      rootElement: options.el
    });

    this._setOptions(options);

    this._render();
    this.on('click', this._onClick.bind(this));
    if (options.tooltip) {
      this.on('mouseover', this._onOver.bind(this));
      this.on('mouseout', this._onOut.bind(this));
    }
  }

  /**
   * set tooltip text
   * @param {string} text - tooltip text to show
   */
  setTooltip(text) {
    this._tooltip = text;
  }

  _setOptions(options) {
    this._command = options.command;
    this._event = options.event;
    this._text = options.text;
    this._tooltip = options.tooltip;
    this._style = options.style;
    this._state = options.state;
  }

  _render() {
    const text = document.createTextNode(this._text || '');

    this.el.appendChild(text);
    this.el.setAttribute('type', 'button');

    if (this._style) {
      this.el.setAttribute('style', this._style);
    }
  }

  _onClick() {
    if (!this.isEnabled()) {
      return;
    }

    if (this._command) {
      this.trigger('command', this._command);
    } else if (this._event) {
      this.trigger('event', this._event);
    }

    this.trigger('clicked');
  }

  _onOver() {
    if (!this.isEnabled()) {
      return;
    }

    tooltip.show(this.el, this._tooltip);
  }

  _onOut() {
    tooltip.hide();
  }

  /**
   * enable button
   */
  enable() {
    this.el.disabled = false;
  }

  /**
   * disable button
   */
  disable() {
    this.el.disabled = true;
  }

  /**
   * check whether this button is enabled
   * @returns {Boolean} - true for enabled
   */
  isEnabled() {
    return !this.el.disabled;
  }
}

export default ToolbarButton;
