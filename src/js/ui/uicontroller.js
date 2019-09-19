/**
 * @fileoverview Implements ui controller
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

let _uiInstanceId = -1;

/**
 * get ui instance id
 * @returns {number} - new instance id
 * @ignore
 */
function makeUIInstanceId() {
  _uiInstanceId += 1;

  return _uiInstanceId;
}

/**
 * Class UIController
 * @param {Object} [options] - options
 *     @param {jQuery} [options.rootElement] - root element
 *     @param {string} [options.tagName] - tag name
 *     @param {string} [options.className] - class name
 */
class UIController {
  /**
   * tag name
   * @type {string}
   */
  tagName;

  /**
   * ui controller class name
   * @type {string}
   */
  className;

  /**
   * UI jQuery element
   * @type {Object}
   */
  $el;

  /**
   * UI Id
   * @type {number}
   * @private
   */
  _id;

  constructor(options = {}) {
    options = util.extend({
      tagName: 'div'
    }, options);

    this.tagName = options.tagName;

    this.className = options.className;

    this._id = makeUIInstanceId();

    this._setRootElement(options.rootElement);
  }

  /**
   * @param {string|object} aType - event name and selector string
   * @param {function} aFn - event handler
   */
  on(aType, aFn) {
    if (util.isObject(aType)) {
      util.forEach(aType, (fn, type) => {
        this._addEvent(type, fn);
      });
    } else {
      this._addEvent(aType, aFn);
    }
  }

  /**
   * bind event
   * @param {string} type - event name and selector
   * @param {function} fn - handler function
   * @private
   */
  _addEvent(type, fn) {
    const {event, selector} = this._parseEventType(type);

    if (selector) {
      this.$el.on(event, selector, fn);
    } else {
      this.$el.on(event, fn);
    }
  }

  /**
   * unbind event handler
   * @param {string} type - event name and selector
   * @param {function} fn - handler function
   */
  off(type, fn) {
    if (type) {
      const {event, selector} = this._parseEventType(type);

      if (selector) {
        this.$el.off(event, selector, fn);
      } else {
        this.$el.off(event, fn);
      }
    } else {
      this.$el.off();
    }
  }

  /**
   * parse string into event name & selector
   * 'click td' => ['click', 'td]
   * @param {string} type - string to be parsed
   * @returns {Object} event, selector
   * @private
   */
  _parseEventType(type) {
    const splitType = type.split(' ');
    const event = splitType.shift();
    const selector = splitType.join(' ');

    return {
      event,
      selector
    };
  }

  /**
   * set root element
   * @param {jQuery} $el - root jQuery element
   * @private
   */
  _setRootElement($el) {
    const {tagName} = this;
    let {className} = this;

    if (!$el) {
      className = className || (`uic${this._id}`);
      $el = $(`<${tagName} class="${className}"/>`);
    }
    this.$el = $el;
  }

  /**
   * trigger event
   * @param {...object} args - event name & extra params
   */
  trigger(...args) {
    this.$el.trigger(...args);
  }

  _getEventNameWithNamespace(event) {
    const eventSplited = event.split(' ');
    eventSplited[0] += (`.uicEvent${this._id}`);

    return eventSplited.join(' ');
  }

  /**
   * remove
   */
  remove() {
    if (this.$el) {
      this.$el.remove();
    }
  }

  /**
   * destroy
   */
  destroy() {
    this.remove();

    util.forEachOwnProperties(this, (value, key) => {
      this[key] = null;
    });
  }
}

export default UIController;
