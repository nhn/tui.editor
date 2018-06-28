/**
 * @fileoverview Implements LayerPopup
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

/**
 * Interface Toggle
 * @interface Toggle
 */

/**
 * Enable
 * @function
 * @name Toggle#enable
 */

/**
 * Disable
 * @function
 * @name Toggle#disable
 */

/**
 * Enable or disable based on listening to event and compatibility list
 */
class StateToggle {
  /**
   * toggle
   * @type {Toggle}
   * @private
   */
  _toggle;

  /**
   * event manager
   * @type {EventManager}
   * @private
   */
  _eventManager;

  /**
   * an array of states which the toggle object is enabled when
   * @type {Array.<string>}
   * @private
   */
  _enableOn;

  /**
   * an array of states which the toggle object is disabled when
   * @type {Array.<string>}
   * @private
   */
  _disableOn;

  /**
   * state change handler
   * @type {Function}
   * @private
   */
  _onStateChangeHandler;

  /**
   * Creates a StateToggle instance
   * @param {EventManager} eventManager - event manager
   * @param {Toggle} toggle - toggle
   * @param {Object} statesToConcern - statesToConcern object
   * @param {Array.<string>} stateToConcern.enableOn - an array of states which the toggle object is enabled when
   * @param {Array.<string>} stateToConcern.disableOn - an array of states which the toggle object is disabled when
   * @memberof StateToggle
   */
  constructor(eventManager, toggle, statesToConcern) {
    this._toggle = toggle;
    this._eventManager = eventManager;
    this._enableOn = statesToConcern.enableOn;
    this._disableOn = statesToConcern.disableOn;

    this._onStateChangeHandler = state => this._onStateChange(state);
    eventManager.listen('stateChange', this._onStateChangeHandler);
  }

  _onStateChange(states) {
    if (this._enableOn) {
      const stateFound = this._enableOn.reduce((found, stateToConcern) => {
        return found || states[stateToConcern];
      }, false);

      if (stateFound) {
        this._toggle.enable();
      } else {
        this._toggle.disable();
      }
    } else {
      const stateFound = this._disableOn.reduce((found, stateToConcern) => {
        return found || states[stateToConcern];
      }, false);

      if (stateFound) {
        this._toggle.disable();
      } else {
        this._toggle.enable();
      }
    }
  }

  destroy() {
    this._eventManager.removeEventHandler('stateChange', this._onStateChangeHandler);
    this._eventManager = null;
    this._toggle = null;
  }
}

export default StateToggle;
