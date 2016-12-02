/**
 * @fileoverview Implements EventManager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */
const util = tui.util;

const eventList = [
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
    'changeModeBefore',
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
    'replaceCodeBlockElementsBefore',
    'pasteBefore',
    'scroll',
    'click',
    'mousedown',
    'mouseover',
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
    'cut',
    'drop',
    'show',
    'hide'
];

/**
 * EventManager
 * @exports EventManager
 * @class EventManager
 */
class EventManager {
    constructor() {
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
     * @api
     * @memberOf EventManager
     * @param {string} eventName Event name to emit
     * @returns {Array}
     */
    emit(...args) {
        const typeStr = args.shift();
        const typeInfo = this._getTypeInfo(typeStr);
        const eventHandlers = this.events.get(typeInfo.type);
        let results;

        if (eventHandlers) {
            util.forEach(eventHandlers, handler => {
                const result = handler(...args);

                if (!util.isUndefined(result)) {
                    results = results || [];
                    results.push(result);
                }
            });
        }

        return results;
    }

    /**
     * Emit given event and return result
     * @api
     * @memberOf EventManager
     * @param {string} eventName Event name to emit
     * @param {string} sourceText Source text to change
     * @returns {string}
     */
    emitReduce(...args) {
        const type = args.shift();
        const eventHandlers = this.events.get(type);

        if (eventHandlers) {
            util.forEach(eventHandlers, handler => {
                const result = handler(...args);

                if (!util.isFalsy(result)) {
                    args[0] = result;
                }
            });
        }

        return args[0];
    }

    /**
     * Get event type and namespace
     * @memberOf EventManager
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
        return !util.isUndefined(this.TYPE[this._getTypeInfo(type).type]);
    }

    /**
     * Add event type when given event not exists
     * @api
     * @memberOf EventManager
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
     * @api
     * @memberOf EventManager
     * @param {string} typeStr Event type name
     */
    removeEventHandler(typeStr) {
        const {type, namespace} = this._getTypeInfo(typeStr);

        if (type && !namespace) {
            // dont use dot notation cuz eslint
            this.events['delete'](type);
        } else if (!type && namespace) {
            this.events.forEach((eventHandlers, eventType) => {
                this._removeEventHandlerWithTypeInfo(eventType, namespace);
            });
        } else if (type && namespace) {
            this._removeEventHandlerWithTypeInfo(type, namespace);
        }
    }

    /**
     * Remove event handler with event type information
     * @memberOf EventManager
     * @param {string} type Event type name
     * @param {string} namespace Event namespace
     * @private
     */
    _removeEventHandlerWithTypeInfo(type, namespace) {
        const handlersToSurvive = [];
        const eventHandlers = this.events.get(type);

        eventHandlers.map(handler => {
            if (handler.namespace !== namespace) {
                handlersToSurvive.push(handler);
            }
        });

        this.events.set(type, handlersToSurvive);
    }
}

module.exports = EventManager;
