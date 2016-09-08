/**
 * @fileoverview Implements PopupTableUtils
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import LayerPopup from './layerpopup';
import i18n from '../i18n';

const util = tui.util;

/**
 * PopupTableUtils
 * It implements table utils popup
 * @exports PopupTableUtils
 * @augments LayerPopup
 * @constructor
 * @class
 * @param {object} options options
 */
function PopupTableUtils(options) {
    const POPUP_CONTENT = [
        `<button type="button" class="te-table-add-row">${i18n.get('Add row')}</button>`,
        `<button type="button" class="te-table-add-col">${i18n.get('Add col')}</button>`,
        `<button type="button" class="te-table-remove-row">${i18n.get('Remove row')}</button>`,
        `<button type="button" class="te-table-remove-col">${i18n.get('Remove col')}</button>`,
        `<button type="button" class="te-table-col-align-left">${i18n.get('Align left')}</button>`,
        `<button type="button" class="te-table-col-align-center">${i18n.get('Align center')}</button>`,
        `<button type="button" class="te-table-col-align-right">${i18n.get('Align right')}</button>`,
        `<button type="button" class="te-table-remove">${i18n.get('Remove table')}</button>`
    ].join('');

    options = util.extend({
        title: false,
        className: 'te-popup-table-utils',
        content: POPUP_CONTENT
    }, options);

    LayerPopup.call(this, options);

    this.eventManager = options.eventManager;

    this.render();
    this._bindContentEvent();
    this._linkWithEventManager();
}

PopupTableUtils.prototype = util.extend(
    {},
    LayerPopup.prototype
);

/**
 * _bindContentEvent
 * Bind element events
 */
PopupTableUtils.prototype._bindContentEvent = function() {
    const self = this;

    this.on('click .te-table-add-row', () => {
        self.eventManager.emit('command', 'AddRow');
    });

    this.on('click .te-table-add-col', () => {
        self.eventManager.emit('command', 'AddCol');
    });

    this.on('click .te-table-remove-row', () => {
        self.eventManager.emit('command', 'RemoveRow');
    });

    this.on('click .te-table-col-align-left', () => {
        self.eventManager.emit('command', 'AlignCol', 'left');
    });

    this.on('click .te-table-col-align-center', () => {
        self.eventManager.emit('command', 'AlignCol', 'center');
    });

    this.on('click .te-table-col-align-right', () => {
        self.eventManager.emit('command', 'AlignCol', 'right');
    });

    this.on('click .te-table-remove-col', () => {
        self.eventManager.emit('command', 'RemoveCol');
    });

    this.on('click .te-table-remove', () => {
        self.eventManager.emit('command', 'RemoveTable');
    });
};

/**
 * _linkWithEventManager
 * Bind event manager event
 */
PopupTableUtils.prototype._linkWithEventManager = function() {
    const self = this;

    this.eventManager.listen('focus', () => {
        self.hide();
    });

    this.eventManager.listen('mousedown', () => {
        self.hide();
    });

    this.eventManager.listen('openPopupTableUtils', event => {
        const offset = self.$el.parent().offset();
        const x = event.clientX - offset.left;
        const y = event.clientY - offset.top + $(window).scrollTop();

        self.eventManager.emit('closeAllPopup');

        self.$el.css({
            'position': 'absolute',
            'top': y + 5,
            'left': x + 10
        });

        self.show();
    });

    this.eventManager.listen('closeAllPopup', () => {
        self.hide();
    });
};

module.exports = PopupTableUtils;
