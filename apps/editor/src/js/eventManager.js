/**
 * @fileoverview Implements EventManager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = tui.util;

var eventList = [
    'previewBeforeHook',
    'previewRenderAfter',
    'previewNeedsRefresh',
    'addImageBlobHook',
    'setValueAfter',
    'contentChangedFromWysiwyg',
    'changeFromWysiwyg',
    'contentChangedFromMarkdown',
    'changeFromMarkdown',
    'change',
    'changeModeToWysiwyg',
    'changeModeToMarkdown',
    'changeMode',
    'changePreviewStyle',
    'openPopupAddLink',
    'openPopupAddImage',
    'openPopupAddTable',
    'openPopupTableUtils',
    'openHeadingSelect',
    'closeAllPopup',
    'command',
    'htmlUpdate',
    'markdownUpdate',
    'renderedHtmlUpdated',
    'removeEditor',
    'convertorAfterMarkdownToHtmlConverted',
    'convertorAfterHtmlToMarkdownConverted',
    'stateChange',
    'wysiwygSetValueAfter',
    'wysiwygSetValueBefore',
    'wysiwygGetValueBefore',
    'wysiwygProcessHTMLText',
    'wysiwygRangeChangeAfter',
    'wysiwygKeyEvent',
    'pasteBefore',
    'scroll',
    'click',
    'mousedown',
    'mouseup',
    'contextmenu',
    'keydown',
    'keyup',
    'keyMap',
    'load',
    'focus',
    'blur',
    'paste',
    'copy',
    'drop',
    'show',
    'hide'
];

/**
 * EventManager
 * @exports EventManager
 * @constructor
 * @class EventManager
 */
function EventManager() {
    this.events = new util.Map();
    this.TYPE = new util.Enum(eventList);
}

/**
 * Listen event and bind event handler
 * @api
 * @memberOf EventManager
 * @param {string} typeStr Event type string
 * @param {function} handler Event handler
 */
EventManager.prototype.listen = function(typeStr, handler) {
    var eventHandlers,
        typeInfo = this._getTypeInfo(typeStr);

    if (!this._hasEventType(typeInfo.type)) {
        throw new Error('There is no event type ' + typeInfo.type);
    }

    eventHandlers = this.events.get(typeInfo.type) || [];

    if (typeInfo.namespace) {
        handler.namespace = typeInfo.namespace;
    }

    eventHandlers.push(handler);

    this.events.set(typeInfo.type, eventHandlers);
};

/**
 * Emit event
 * @api
 * @memberOf EventManager
 * @param {string} eventName Event name to emit
 * @returns {Array}
 */
EventManager.prototype.emit = function() {
    var args = util.toArray(arguments),
        typeStr = args.shift(),
        typeInfo = this._getTypeInfo(typeStr),
        eventHandlers = this.events.get(typeInfo.type),
        result,
        results;

    if (eventHandlers) {
        util.forEach(eventHandlers, function(handler) {
            result = handler.apply(null, args);

            if (!util.isUndefined(result)) {
                results = results || [];
                results.push(result);
            }
        });
    }

    return results;
};

/**
 * Emit given event and return result
 * @api
 * @memberOf EventManager
 * @param {string} eventName Event name to emit
 * @param {string} sourceText Source text to change
 * @returns {string}
 */
EventManager.prototype.emitReduce = function() {
    var args = util.toArray(arguments),
        type = args.shift(),
        eventHandlers = this.events.get(type);

    if (eventHandlers) {
        util.forEach(eventHandlers, function(handler) {
            var result = handler.apply(null, args);

            if (!util.isFalsy(result)) {
                args[0] = result;
            }
        });
    }

    return args[0];
};

/**
 * Get event type and namespace
 * @memberOf EventManager
 * @param {string} typeStr Event type name
 * @returns {{type: string, namespace: string}}
 * @private
 */
EventManager.prototype._getTypeInfo = function(typeStr) {
    var splited = typeStr.split('.');

    return {
        type: splited[0],
        namespace: splited[1]
    };
};

/**
 * Check whether event type exists or not
 * @param {string} type Event type name
 * @returns {boolean}
 * @private
 */
EventManager.prototype._hasEventType = function(type) {
    return !util.isUndefined(this.TYPE[type.split('.')[0]]);
};

/**
 * Add event type when given event not exists
 * @api
 * @memberOf EventManager
 * @param {string} type Event type name
 */
EventManager.prototype.addEventType = function(type) {
    if (this._hasEventType(type)) {
        throw new Error('There is already have event type ' + type);
    }

    this.TYPE.set(type);
};

/**
 * Remove event handler from given event type
 * @api
 * @memberOf EventManager
 * @param {string} type Event type name
 */
EventManager.prototype.removeEventHandler = function(type) {
    var self = this,
        typeInfo = this._getTypeInfo(type),
        namespace = typeInfo.namespace;

    type = typeInfo.type;

    if (type && !namespace) {
        //dont use dot notation cuz eslint
        this.events['delete'](type);
    } else if (!type && namespace) {
        this.events.forEach(function(eventHandlers, eventType) {
            self._removeEventHandlerWithTypeInfo(eventType, namespace);
        });
    } else if (type && namespace) {
        self._removeEventHandlerWithTypeInfo(type, namespace);
    }
};

/**
 * Remove event handler with event type information
 * @memberOf EventManager
 * @param {string} type Event type name
 * @param {string} namespace Event namespace
 * @private
 */
EventManager.prototype._removeEventHandlerWithTypeInfo = function(type, namespace) {
    var handlersToSurvive = [],
        eventHandlers;

    eventHandlers = this.events.get(type);

    util.forEach(eventHandlers, function(handler) {
        if (handler.namespace !== namespace) {
            handlersToSurvive.push(handler);
        }
    });

    //
    this.events.set(type, handlersToSurvive);
};

module.exports = EventManager;
