/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Preview = require('./preview'),
    EventManager = require('./eventManager'),
    CommandManager = require('./commandManager'),
    extManager = require('./extManager'),
    Convertor = require('./convertor');

var util = tui.util;

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
function ToastUIEditorViewOnly(options) {
    var self = this;

    this.options = options;

    this.eventManager = new EventManager();

    this.commandManager = new CommandManager(this);
    this.convertor = new Convertor(this.eventManager);

    if (this.options.hooks) {
        util.forEach(this.options.hooks, function(fn, key) {
            self.addHook(key, fn);
        });
    }

    if (this.options.events) {
        util.forEach(this.options.events, function(fn, key) {
            self.on(key, fn);
        });
    }

    this.preview = new Preview($(self.options.el), this.eventManager, this.convertor);

    extManager.applyExtension(self, self.options.exts);

    self.setValue(self.options.initialValue);

    self.eventManager.emit('load', self);
}

/**
 * Set content for preview
 * @api
 * @memberOf ToastUIEditorViewOnly
 * @param {string} markdown Markdown text
 */
ToastUIEditorViewOnly.prototype.setValue = function(markdown) {
    this.markdownValue = markdown = markdown || '';

    this.preview.refresh(this.markdownValue);
    this.eventManager.emit('setValueAfter', this.markdownValue);
};

/**
 * Get content of preview
 * @api
 * @memberOf ToastUIEditorViewOnly
 * @returns {string}
 */
ToastUIEditorViewOnly.prototype.getValue = function() {
    return this.markdownValue;
};

/**
 * Bind eventHandler to event type
 * @api
 * @memberOf ToastUIEditorViewOnly
 * @param {string} type Event type
 * @param {function} handler Event handler
 */
ToastUIEditorViewOnly.prototype.on = function(type, handler) {
    this.eventManager.listen(type, handler);
};

/**
 * Unbind eventHandler from event type
 * @api
 * @memberOf ToastUIEditorViewOnly
 * @param {string} type Event type
 */
ToastUIEditorViewOnly.prototype.off = function(type) {
    this.eventManager.removeEventHandler(type);
};

/**
 * Remove ViewOnly preview from document
 * @api
 * @memberOf ToastUIEditorViewOnly
 */
ToastUIEditorViewOnly.prototype.remove = function() {
    this.eventManager.emit('removeEditor');
    this.options = null;
    this.eventManager = null;
    this.commandManager = null;
    this.convertor = null;
    this.preview = null;
};

/**
 * Add hook to ViewOnly preview's event
 * @api
 * @memberOf ToastUIEditorViewOnly
 * @param {string} type Event type
 * @param {function} handler Event handler
 */
ToastUIEditorViewOnly.prototype.addHook = function(type, handler) {
    this.eventManager.removeEventHandler(type);
    this.eventManager.listen(type, handler);
};

/**
 * Return true
 * @api
 * @memberOf ToastUIEditorViewOnly
 * @returns {boolean}
 */
ToastUIEditorViewOnly.prototype.isViewOnly = function() {
    return true;
};

/**
 * Return false
 * @api
 * @memberOf ToastUIEditorViewOnly
 * @returns {boolean}
 */
ToastUIEditorViewOnly.prototype.isMarkdownMode = function() {
    return false;
};

/**
 * Return false
 * @api
 * @memberOf ToastUIEditorViewOnly
 * @returns {boolean}
 */
ToastUIEditorViewOnly.prototype.isWysiwygMode = function() {
    return false;
};

module.exports = ToastUIEditorViewOnly;
