/**
 * @fileoverview Implements ui controller
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import inArray from 'tui-code-snippet/array/inArray';
import forEachOwnProperties from 'tui-code-snippet/collection/forEachOwnProperties';
import extend from 'tui-code-snippet/object/extend';
import isObject from 'tui-code-snippet/type/isObject';
import on from 'tui-code-snippet/domEvent/on';
import off from 'tui-code-snippet/domEvent/off';
import CustomEvents from 'tui-code-snippet/customEvents/customEvents';

import domUtils from '../utils/dom';

const DOM_EVENTS = [
  'click',
  'mousedown',
  'mousemove',
  'mouseup',
  'mouseover',
  'mouseout',
  'scroll'
];
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

    this.customEventManager = new CustomEvents();

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

  _bindDomEvent(event, selector, fn) {
    if (selector) {
      domUtils.findAll(this.el, selector).forEach(el => {
        on(el, event, fn);
      });
    } else {
      on(this.el, event, fn);
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

    if (inArray(event, DOM_EVENTS) > -1) {
      this._bindDomEvent(event, selector, fn);
    } else {
      this.customEventManager.on(event, fn);
    }
  }

  _unbindDomEvent(event, selector, fn) {
    if (selector) {
      domUtils.findAll(this.el, selector).forEach(el => {
        off(el, event, fn);
      });
    } else {
      off(this.el, event, fn);
    }
  }

  /**
   * unbind event handler
   * @param {string} type - event name and selector
   * @param {function} fn - handler function
   */
  off(type, fn) {
    const { event, selector } = this._parseEventType(type);

    if (inArray(event, DOM_EVENTS) > -1) {
      this._unbindDomEvent(event, selector, fn);
    } else {
      this.customEventManager.off(event, fn);
    }
  }

  /**
   * parse string into event name & selector
   * 'click td' => ['click', 'td']
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
   * @param {string} eventName - event name
   * @param {*} eventData - event data
   */
  trigger(eventName, eventData) {
    this.customEventManager.fire(eventName, eventData);
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
