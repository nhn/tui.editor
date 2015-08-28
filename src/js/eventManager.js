/**
 * @fileoverview Implements EventManager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = ne.util;

var eventList = [
    'htmlRenderAfterHook',
    'previewBeforeHook',
    'addImageFileHook',
    'markdownEditorContentChanged',
    'contentChanged.wysiwygEditor',
    'change.wysiwygEditor',
    'contentChanged.markdownEditor',
    'change.markdownEditor',
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

EventManager.prototype.listen = function(type, handler) {
    var eventHandlers;

    if (!this._hasEventType(type)) {
        throw new Error('There is no event type ' + type);
    }

    eventHandlers = this.events.get(type) || [];
    eventHandlers.push(handler);

    this.events.set(type, eventHandlers);
};

EventManager.prototype.emit = function() {
    var args = util.toArray(arguments),
        type = args.shift(),
        eventHandlers = this.events.get(type),
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

EventManager.prototype._hasEventType = function(type) {
    return !util.isUndefined(this.TYPE[type]);
};

EventManager.prototype.addEventType = function(type) {
    if (this._hasEventType(type)) {
        throw new Error('There is already have event type ' + type);
    }

    this.TYPE.set(type);
};

module.exports = EventManager;
