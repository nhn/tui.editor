/**
 * @fileoverview Implements ui controller
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import forEachOwnProperties from 'tui-code-snippet/collection/forEachOwnProperties';
import extend from 'tui-code-snippet/object/extend';
import isObject from 'tui-code-snippet/type/isObject';
import domUtils from '../domUtils';

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
 *     @param {HTMLElement} [options.rootElement] - root element
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
   * UI element
   * @type {Object}
   */
  el;

  /**
   * UI Id
   * @type {number}
   * @private
   */
  _id;

  constructor(options = {}) {
    options = extend(
      {
        tagName: 'div'
      },
      options
    );

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
    if (isObject(aType)) {
      forEachOwnProperties(aType, (fn, type) => {
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
    const { event, selector } = this._parseEventType(type);

    if (selector) {
      $(this.el).on(event, selector, fn);
    } else {
      $(this.el).on(event, fn);
    }
  }

  /**
   * unbind event handler
   * @param {string} type - event name and selector
   * @param {function} fn - handler function
   */
  off(type, fn) {
    if (type) {
      const { event, selector } = this._parseEventType(type);

      if (selector) {
        $(this.el).off(event, selector, fn);
      } else {
        $(this.el).off(event, fn);
      }
    } else {
      $(this.el).off();
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
   * @param {HTMLElement} el - root element
   * @private
   */
  _setRootElement(el) {
    if (!el) {
      const { tagName } = this;

      el = document.createElement(tagName);
      el.className = this.className || `uic${this._id}`;
    }
    this.el = el;
  }

  /**
   * trigger event
   * @param {...object} args - event name & extra params
   */
  trigger(...args) {
    $(this.el).trigger(...args);
  }

  /**
   * remove
   */
  remove() {
    if (this.el) {
      domUtils.remove(this.el);
    }
  }

  /**
   * destroy
   */
  destroy() {
    this.remove();

    forEachOwnProperties(this, (value, key) => {
      this[key] = null;
    });
  }
}

export default UIController;
