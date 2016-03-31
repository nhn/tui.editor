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
 * @exports ViewOnly
 * @constructor
 * @class
 * @param {object} options 옵션
 * @param {string} options.initialValue 초기 입력 테스트
 * @param {object} options.events eventlist
 * @param {function} options.events.load it would be emitted when editor fully load
 * @param {function} options.events.change it would be emitted when content changed
 * @param {function} options.events.stateChange it would be emitted when format change by cursor position
 * @param {function} options.events.focus it would be emitted when editor get focus
 * @param {function} options.events.blur it would be emitted when editor loose focus
 * @param {object} options.hooks 외부 연결 훅 목록
 * @param {function} options.hooks.previewBeforeHook 프리뷰 되기 직전 실행되는 훅, 프리뷰에 그려질 DOM객체들이 인자로 전달된다.
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

ToastUIEditorViewOnly.prototype.setValue = function(markdown) {
    markdown = markdown || '';

    this.preview.refresh(markdown);
    this.eventManager.emit('setValueAfter', markdown);
};

ToastUIEditorViewOnly.prototype.on = function(type, handler) {
    this.eventManager.listen(type, handler);
};

ToastUIEditorViewOnly.prototype.off = function(type) {
    this.eventManager.removeEventHandler(type);
};

ToastUIEditorViewOnly.prototype.addHook = function(type, handler) {
    this.eventManager.removeEventHandler(type);
    this.eventManager.listen(type, handler);
};

ToastUIEditorViewOnly.prototype.isViewOnly = function() {
    return true;
};

module.exports = ToastUIEditorViewOnly;
