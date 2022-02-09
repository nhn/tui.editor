import isUndefined from 'tui-code-snippet/type/isUndefined';
import isFalsy from 'tui-code-snippet/type/isFalsy';
import { Emitter, EventTypes, Handler } from '@t/event';
import Map from '@/utils/map';

const eventTypeList: EventTypes[] = [
  'afterPreviewRender',
  'updatePreview',
  'changeMode',
  'needChangeMode',
  'command',
  'changePreviewStyle',
  'changePreviewTabPreview',
  'changePreviewTabWrite',
  'scroll',
  'contextmenu',
  'show',
  'hide',
  'changeLanguage',
  'changeToolbarState',
  'toggleScrollSync',
  'mixinTableOffsetMapPrototype',
  'setFocusedNode',
  'removePopupWidget',
  'query',
  // provide event for user
  'openPopup',
  'closePopup',
  'addImageBlobHook',
  'beforePreviewRender',
  'beforeConvertWysiwygToMarkdown',
  'load',
  'loadUI',
  'change',
  'caretChange',
  'destroy',
  'focus',
  'blur',
  'keydown',
  'keyup',
];

/**
 * Class EventEmitter
 * @ignore
 */
class EventEmitter implements Emitter {
  private events: Map<string, Handler[] | undefined>;

  private eventTypes: Record<string, string>;

  private hold: boolean;

  constructor() {
    this.events = new Map();
    this.eventTypes = eventTypeList.reduce((types, type) => {
      return { ...types, type };
    }, {});
    this.hold = false;

    eventTypeList.forEach((eventType) => {
      this.addEventType(eventType);
    });
  }

  /**
   * Listen event and bind event handler
   * @param {string} type Event type string
   * @param {function} handler Event handler
   */
  listen(type: string, handler: Handler) {
    const typeInfo = this.getTypeInfo(type);
    const eventHandlers = this.events.get(typeInfo.type) || [];

    if (!this.hasEventType(typeInfo.type)) {
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
  emit(type: string, ...args: any[]) {
    const typeInfo = this.getTypeInfo(type);
    const eventHandlers = this.events.get(typeInfo.type);
    const results: any[] = [];

    if (!this.hold && eventHandlers) {
      eventHandlers.forEach((handler) => {
        const result = handler(...args);

        if (!isUndefined(result)) {
          results.push(result);
        }
      });
    }

    return results;
  }

  /**
   * Emit given event and return result
   * @param {string} eventName Event name to emit
   * @param {any} source Source to change
   * @returns {string}
   */
  emitReduce(type: string, source: any, ...args: any[]) {
    const eventHandlers = this.events.get(type);

    if (!this.hold && eventHandlers) {
      eventHandlers.forEach((handler) => {
        const result = handler(source, ...args);

        if (!isFalsy(result)) {
          source = result;
        }
      });
    }

    return source;
  }

  /**
   * Get event type and namespace
   * @param {string} type Event type name
   * @returns {{type: string, namespace: string}}
   * @private
   */
  private getTypeInfo(type: string) {
    const splited = type.split('.');

    return {
      type: splited[0],
      namespace: splited[1],
    };
  }

  /**
   * Check whether event type exists or not
   * @param {string} type Event type name
   * @returns {boolean}
   * @private
   */
  private hasEventType(type: string) {
    return !isUndefined(this.eventTypes[this.getTypeInfo(type).type]);
  }

  /**
   * Add event type when given event not exists
   * @param {string} type Event type name
   */
  addEventType(type: string) {
    if (this.hasEventType(type)) {
      throw new Error(`There is already have event type ${type}`);
    }

    this.eventTypes[type] = type;
  }

  /**
   * Remove event handler from given event type
   * @param {string} eventType Event type name
   * @param {function} [handler] - registered event handler
   */
  removeEventHandler(eventType: string, handler?: Handler) {
    const { type, namespace } = this.getTypeInfo(eventType);

    if (type && handler) {
      this.removeEventHandlerWithHandler(type, handler);
    } else if (type && !namespace) {
      this.events.delete(type);
    } else if (!type && namespace) {
      this.events.forEach((_, evtType) => {
        this.removeEventHandlerWithTypeInfo(evtType, namespace);
      });
    } else if (type && namespace) {
      this.removeEventHandlerWithTypeInfo(type, namespace);
    }
  }

  /**
   * Remove event handler with event handler
   * @param {string} type - event type name
   * @param {function} handler - event handler
   * @private
   */
  private removeEventHandlerWithHandler(type: string, handler: Handler) {
    const eventHandlers = this.events.get(type);

    if (eventHandlers) {
      const handlerIndex = eventHandlers.indexOf(handler);

      if (eventHandlers.indexOf(handler) >= 0) {
        eventHandlers.splice(handlerIndex, 1);
      }
    }
  }

  /**
   * Remove event handler with event type information
   * @param {string} type Event type name
   * @param {string} namespace Event namespace
   * @private
   */
  private removeEventHandlerWithTypeInfo(type: string, namespace: string) {
    const handlersToSurvive: Handler[] = [];
    const eventHandlers = this.events.get(type);

    if (!eventHandlers) {
      return;
    }

    eventHandlers.map((handler: Handler) => {
      if (handler.namespace !== namespace) {
        handlersToSurvive.push(handler);
      }

      return null;
    });

    this.events.set(type, handlersToSurvive);
  }

  getEvents() {
    return this.events;
  }

  holdEventInvoke(fn: Function) {
    this.hold = true;
    fn();
    this.hold = false;
  }
}

export default EventEmitter;
