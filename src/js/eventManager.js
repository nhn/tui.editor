/**
 * @fileoverview Implements EventManager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = ne.util;

var eventList = [
    'previewBeforeHook',
    'previewRenderAfter',
    'addImageFileHook',
    'addImageBlobHook',
    'contentChangedFromWysiwyg',
    'changeFromWysiwyg',
    'contentChangedFromMarkdown',
    'changeFromMarkdown',
    'change',
    'changeMode.wysiwyg',
    'changeMode.markdown',
    'changeMode',
    'openPopupAddLink',
    'openPopupAddImage',
    'closeAllPopup',
    'command',
    'htmlUpdate',
    'markdownUpdate',
    'renderedHtmlUpdated',
    'convertorAfterMarkdownToHtmlConverted',
    'convertorAfterHtmlToMarkdownConverted',
    'load',
    'focus',
    'blur',
    'paste',
    'drop',
    'show',
    'hide'
];

/**
 * EventManager
 * @exports EventManager
 * @extends {}
 * @constructor
 * @class
 */
function EventManager() {
    this.events = new util.Map();
    this.TYPE = new util.Enum(eventList);
}

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

EventManager.prototype.emit = function() {
    var args = util.toArray(arguments),
        typeStr = args.shift(),
        typeInfo = this._getTypeInfo(typeStr),
        eventHandlers = this.events.get(typeInfo.type),
        result,
        results;

    if (eventHandlers) {
        results = [];

        util.forEach(eventHandlers, function(handler) {
            result = handler.apply(null, args);

            if (!util.isUndefined(result)) {
                results.push(result);
            }
       });
    }

    if (results && results.length) {
        return results;
    }
};

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

EventManager.prototype._getTypeInfo = function(typeStr) {
    var splited = typeStr.split('.');

    return {
        type: splited[0],
        namespace: splited[1]
    };
};

EventManager.prototype._hasEventType = function(type) {
    return !util.isUndefined(this.TYPE[type.split('.')[0]]);
};

EventManager.prototype.addEventType = function(type) {
    if (this._hasEventType(type)) {
        throw new Error('There is already have event type ' + type);
    }

    this.TYPE.set(type);
};

EventManager.prototype.removeEventHandler = function(type) {
    var self = this,
        typeInfo = this._getTypeInfo(type),
        type = typeInfo.type,
        namespace = typeInfo.namespace;

    if (type && !namespace) {
        this.events.delete(type);
    } else if (!type && namespace) {
        this.events.forEach(function(eventHandlers, eventType) {
            self._removeEventHandlerWithTypeInfo(eventType, namespace);
        });
    } else if (type && namespace) {
        self._removeEventHandlerWithTypeInfo(type, namespace);
    }
};

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
