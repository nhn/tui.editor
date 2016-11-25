/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


import Preview from './preview';
import EventManager from './eventManager';
import CommandManager from './commandManager';
import extManager from './extManager';
import Convertor from './convertor';
import codeBlockManager from './codeBlockManager';

const util = tui.util;

const TASK_ATTR_NAME = 'data-te-task';
const TASK_CHECKED_CLASS_NAME = 'checked';

/**
 * ViewOnly
 * @exports ToastUIEditorViewOnly
 * @constructor
 * @class ToastUIEditorViewOnly
 * @param {object} options Option object
    * @param {string} options.initialValue Editor's initial value
    * @param {object} options.events eventlist Event list
         * @param {function} options.events.load It would be emitted when editor fully load
         * @param {function} options.events.change It would be emitted when content changed
         * @param {function} options.events.stateChange It would be emitted when format change by cursor position
         * @param {function} options.events.focus It would be emitted when editor get focus
         * @param {function} options.events.blur It would be emitted when editor loose focus
     * @param {object} options.hooks Hook list
         * @param {function} options.hooks.previewBeforeHook Submit preview to hook URL before preview be shown
 */
class ToastUIEditorViewOnly {
    constructor(options) {
        this.options = options;

        this.eventManager = new EventManager();
        this.commandManager = new CommandManager(this);
        this.convertor = new Convertor(this.eventManager);
        this.codeBlockManager = codeBlockManager;

        if (this.options.hooks) {
            util.forEach(this.options.hooks, (fn, key) => {
                this.addHook(key, fn);
            });
        }

        if (this.options.events) {
            util.forEach(this.options.events, (fn, key) => {
                this.on(key, fn);
            });
        }

        this.preview = new Preview($(this.options.el), this.eventManager, this.convertor, true);

        this.preview.$el.on('mousedown', $.proxy(this._toggleTask, this));

        extManager.applyExtension(this, this.options.exts);

        this.setValue(this.options.initialValue);

        this.eventManager.emit('load', this);
    }

    /**
     * Toggle task by detecting mousedown event.
     * @param ev
     * @private
     */
    _toggleTask(ev) {
        const isBeneathTaskBox = ev.offsetX < 18 && ev.offsetY > 18;

        if (ev.target.hasAttribute(TASK_ATTR_NAME) && !isBeneathTaskBox) {
            $(ev.target).toggleClass(TASK_CHECKED_CLASS_NAME);
            this.eventManager.emit('change', {
                source: 'viewOnly',
                data: ev
            });
        }
    }

    /**
     * Set content for preview
     * @api
     * @memberOf ToastUIEditorViewOnly
     * @param {string} markdown Markdown text
     */
    setValue(markdown) {
        this.markdownValue = markdown = markdown || '';

        this.preview.refresh(this.markdownValue);
        this.eventManager.emit('setValueAfter', this.markdownValue);
    }

    /**
     * Bind eventHandler to event type
     * @api
     * @memberOf ToastUIEditorViewOnly
     * @param {string} type Event type
     * @param {function} handler Event handler
     */
    on(type, handler) {
        this.eventManager.listen(type, handler);
    }

    /**
     * Unbind eventHandler from event type
     * @api
     * @memberOf ToastUIEditorViewOnly
     * @param {string} type Event type
     */
    off(type) {
        this.eventManager.removeEventHandler(type);
    }

    /**
     * Remove ViewOnly preview from document
     * @api
     * @memberOf ToastUIEditorViewOnly
     */
    remove() {
        this.eventManager.emit('removeEditor');
        this.preview.$el.off('mousedown', $.proxy(this._toggleTask, this));
        this.options = null;
        this.eventManager = null;
        this.commandManager = null;
        this.convertor = null;
        this.preview = null;
    }

    /**
     * Add hook to ViewOnly preview's event
     * @api
     * @memberOf ToastUIEditorViewOnly
     * @param {string} type Event type
     * @param {function} handler Event handler
     */
    addHook(type, handler) {
        this.eventManager.removeEventHandler(type);
        this.eventManager.listen(type, handler);
    }

    /**
     * Return true
     * @api
     * @memberOf ToastUIEditorViewOnly
     * @returns {boolean}
     */
    isViewOnly() {
        return true;
    }

    /**
     * Return false
     * @api
     * @memberOf ToastUIEditorViewOnly
     * @returns {boolean}
     */
    isMarkdownMode() {
        return false;
    }

    /**
     * Return false
     * @api
     * @memberOf ToastUIEditorViewOnly
     * @returns {boolean}
     */
    isWysiwygMode() {
        return false;
    }
}
module.exports = ToastUIEditorViewOnly;
