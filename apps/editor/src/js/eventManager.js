/**
 * @fileoverview Implements EventManager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import forEachOwnProperties from 'tui-code-snippet/collection/forEachOwnProperties';
import isUndefined from 'tui-code-snippet/type/isUndefined';
import isFalsy from 'tui-code-snippet/type/isFalsy';
import Enum from 'tui-code-snippet/enum/enum';

import Map from './utils/map';

const eventList = [
  'previewBeforeHook',
  'previewRenderAfter',
  'previewNeedsRefresh',
  'addImageBlobHook',
  'setMarkdownAfter',
  'contentChangedFromWysiwyg',
  'changeFromWysiwyg',
  'contentChangedFromMarkdown',
  'changeFromMarkdown',
  'change',
  'changeModeToWysiwyg',
  'changeModeToMarkdown',
  'changeModeBefore',
  'changeMode',
  'changePreviewStyle',
  'changePreviewTabPreview',
  'changePreviewTabWrite',
  'openPopupAddLink',
  'openPopupAddImage',
  'openPopupAddTable',
  'openPopupTableUtils',
  'openHeadingSelect',
  'openPopupCodeBlockLanguages',
  'openPopupCodeBlockEditor',
  'openDropdownToolbar',
  'closePopupCodeBlockLanguages',
  'closePopupCodeBlockEditor',
  'closeAllPopup',
  'command',
  'addCommandBefore',
  'htmlUpdate',
  'markdownUpdate',
  'renderedHtmlUpdated',
  'removeEditor',
  'convertorAfterMarkdownToHtmlConverted',
  'convertorBeforeHtmlToMarkdownConverted',
  'convertorAfterHtmlToMarkdownConverted',
  'stateChange',
  'wysiwygSetValueAfter',
  'wysiwygSetValueBefore',
  'wysiwygGetValueBefore',
  'wysiwygProcessHTMLText',
  'wysiwygRangeChangeAfter',
  'wysiwygKeyEvent',
  'scroll',
  'click',
  'mousedown',
  'mouseover',
  'mouseout',
  'mouseup',
  'contextmenu',
  'keydown',
  'keyup',
  'keyMap',
  'load',
  'focus',
  'blur',
  'paste',
  'pasteBefore',
  'willPaste',
  'copy',
  'copyBefore',
  'copyAfter',
  'cut',
  'cutAfter',
  'drop',
  'show',
  'hide',
  'changeLanguage',
  'cursorActivity',
  'requireScrollSync',
  'requireScrollIntoView',
  'setCodeBlockLanguages'
];

/**
 * Class EventManager
 * @ignore
 */
class EventManager {
  constructor() {
    this.events = new Map();
    this.TYPE = new Enum(eventList);
  }

  /**
   * Listen event and bind event handler
   * @param {string} typeStr Event type string
   * @param {function} handler Event handler
   */
  listen(typeStr, handler) {
    const typeInfo = this._getTypeInfo(typeStr);
    const eventHandlers = this.events.get(typeInfo.type) || [];

    if (!this._hasEventType(typeInfo.type)) {
      throw new Error(`There is no event type ${typeInfo.type}`);
    }

    if (typeInfo.namespace) {
      handler.namespace = typeInfo.namespace;
    }

    eventHandlers.push(handler);

    this.events.set(typeInfo.type, eventHandlers);
  }

  /**
   * Emit event
   * @param {string} eventName Event name to emit
   * @returns {Array}
   */
  emit(...args) {
    const typeStr = args.shift();
    const typeInfo = this._getTypeInfo(typeStr);
    const eventHandlers = this.events.get(typeInfo.type);
    let results;

    if (eventHandlers) {
      forEachOwnProperties(eventHandlers, handler => {
        const result = handler(...args);

        if (!isUndefined(result)) {
          results = results || [];
          results.push(result);
        }
      });
    }

    return results;
  }

  /**
   * Emit given event and return result
   * @param {string} eventName Event name to emit
   * @param {string} sourceText Source text to change
   * @returns {string}
   */
  emitReduce(...args) {
    const type = args.shift();
    const eventHandlers = this.events.get(type);

    if (eventHandlers) {
      forEachOwnProperties(eventHandlers, handler => {
        const result = handler(...args);

        if (!isFalsy(result)) {
          args[0] = result;
        }
      });
    }

    return args[0];
  }

  /**
   * Get event type and namespace
   * @param {string} typeStr Event type name
   * @returns {{type: string, namespace: string}}
   * @private
   */
  _getTypeInfo(typeStr) {
    const splited = typeStr.split('.');

    return {
      type: splited[0],
      namespace: splited[1]
    };
  }

  /**
   * Check whether event type exists or not
   * @param {string} type Event type name
   * @returns {boolean}
   * @private
   */
  _hasEventType(type) {
    return !isUndefined(this.TYPE[this._getTypeInfo(type).type]);
  }

  /**
   * Add event type when given event not exists
   * @param {string} type Event type name
   */
  addEventType(type) {
    if (this._hasEventType(type)) {
      throw new Error(`There is already have event type ${type}`);
    }

    this.TYPE.set(type);
  }

  /**
   * Remove event handler from given event type
   * @param {string} typeStr Event type name
   * @param {function} [handler] - registered event handler
   */
  removeEventHandler(typeStr, handler) {
    const { type, namespace } = this._getTypeInfo(typeStr);

    if (type && handler) {
      this._removeEventHandlerWithHandler(type, handler);
    } else if (type && !namespace) {
      // dont use dot notation cuz eslint
      this.events.delete(type);
    } else if (!type && namespace) {
      this.events.forEach((eventHandlers, eventType) => {
        this._removeEventHandlerWithTypeInfo(eventType, namespace);
      });
    } else if (type && namespace) {
      this._removeEventHandlerWithTypeInfo(type, namespace);
    }
  }

  /**
   * Remove event handler with event handler
   * @param {string} type - event type name
   * @param {function} handler - event handler
   * @private
   */
  _removeEventHandlerWithHandler(type, handler) {
    const eventHandlers = this.events.get(type) || [];
    const handlerIndex = eventHandlers.indexOf(handler);

    if (handlerIndex >= 0) {
      eventHandlers.splice(handlerIndex, 1);
    }
  }

  /**
   * Remove event handler with event type information
   * @param {string} type Event type name
   * @param {string} namespace Event namespace
   * @private
   */
  _removeEventHandlerWithTypeInfo(type, namespace) {
    const handlersToSurvive = [];
    const eventHandlers = this.events.get(type);

    if (!eventHandlers) {
      return;
    }

    eventHandlers.map(handler => {
      if (handler.namespace !== namespace) {
        handlersToSurvive.push(handler);
      }

      return null;
    });

    this.events.set(type, handlersToSurvive);
  }
}

export default EventManager;
