/**
 * @fileoverview Implements UI Button
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import ToolbarItem from './toolbarItem';
import tooltip from './tooltip';

/**
 * Class Button UI
 * @extends {ToolbarItem}
 */
class Button extends ToolbarItem {
  /**
   * ToolbarItem className
   * @type {String}
   * @memberof Button
   * @static
   */
  static className = 'tui-toolbar-icons';

  /**
   * Creates an instance of Button.
   * @param {object} options - button options
   *  @param {string} options.className - button class name
   *  @param {string} options.command - command name to execute on click
   *  @param {string} options.event - event name to trigger on click
   *  @param {string} options.text - text on button
   *  @param {string} options.tooltip - text on tooltip
   *  @param {string} options.style - button style
   *  @param {string} options.state - button state
   * @memberof Button
   */
  constructor(options) {
    super({
      name: options.name,
      tagName: 'button',
      className: `${options.className} ${Button.className}`,
      rootElement: options.$el
    });

    this._setOptions(options);

    this._render();
    this.on('click', this._onClick.bind(this));
    if (options.tooltip) {
      this.on('mouseover', this._onOver.bind(this));
      this.on('mouseout', this._onOut.bind(this));
    }
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
    this.$el.text(this._text);
    this.$el.attr('type', 'button');

    if (this._style) {
      this.$el.attr('style', this._style);
    }
  }

  _onClick() {
    if (this._command) {
      this.trigger('command', this._command);
    } else if (this._event) {
      this.trigger('event', this._event);
    }

    this.trigger('clicked');
  }

  _onOver() {
    tooltip.show(this.$el, this._tooltip);
  }

  _onOut() {
    tooltip.hide();
  }
}

export default Button;
