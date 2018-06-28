/**
 * @fileoverview Implements UI Button
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import Button from './button';
import StateToggle from './stateToggle';

/**
 * Toolbar Button UI
 * @extends {ToolbarItem}
 */
class ToolbarButton extends Button {
  /**
   * item name
   * @memberof ToolbarButton
   * @type {String}
   * @static
   */
  static name = 'toolbar-button';

  /**
   * eventManager instance
   * @type {EventManager}
   * @private
   */
  _eventManager;

  /**
   * Creates an instance of ToolbarButton.
   * @param {object} options - button options
   *  @param {string} options.className - button class name
   *  @param {string} options.command - command name to execute on click
   *  @param {string} options.event - event name to trigger on click
   *  @param {string} options.text - text on button
   *  @param {string} options.tooltip - text on tooltip
   *  @param {string} options.style - button style
   *  @param {string} options.state - button state
   *  @param {Array.<string>} options.enableOn - states which the button is enabled on
   *  @param {Array.<string>} options.disableOn - states which the button is disabled on
   * @param {EventManager} eventManager - event manager instance
   * @memberof ToolbarButton
   */
  constructor(options = {
    tagName: 'button',
    name: ToolbarButton.name
  }, eventManager) {
    super(options);

    this._eventManager = eventManager;

    this._initStateToggle(options);
  }

  _initStateToggle(options) {
    if (!options.enableOn && !options.disableOn) {
      return;
    }

    const {enableOn, disableOn} = options;
    this.stateToggle = new StateToggle(this._eventManager, this, {
      enableOn,
      disableOn
    });
  }

  /**
   * enable button
   * @memberof ToolbarButton
   */
  enable() {
    this.$el.attr('disabled', false);
  }

  /**
   * disable button
   * @memberof ToolbarButton
   */
  disable() {
    this.$el.attr('disabled', true);
  }

  /**
   * check whether this button is enabled
   * @returns {Boolean} - true for enabled
   * @memberof ToolbarButton
   */
  isEnabled() {
    return !(this.$el.attr('disabled'));
  }

  /**
   * destroy
   * @memberof ToolbarButton
   */
  destroy() {
    this._eventManager = null;
    this.stateToggle = null;

    super.destroy();
  }
}

export default ToolbarButton;
