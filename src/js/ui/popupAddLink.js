/**
 * @fileoverview Implements PopupAddLink
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import LayerPopup from './layerpopup';
import i18n from '../i18n';

const util = tui.util;

/**
 * PopupAddLink
 * It implements a link Add Popup
 * @exports PopupAddLink
 * @augments LayerPopup
 * @constructor
 * @class
 * @param {object} options options
 * @ignore
 */
function PopupAddLink(options) {
    /* eslint-disable indent */
    const POPUP_CONTENT = [
        `<label for="linkText">${i18n.get('Link text')}</label>`,
        '<input type="text" class="te-link-text-input" />',
        `<label for="url">${i18n.get('URL')}</label>`,
        '<input type="text" class="te-url-input" />',
        '<div class="te-button-section">',
        `<button type="button" class="te-ok-button">${i18n.get('OK')}</button>`,
        `<button type="button" class="te-close-button">${i18n.get('Cancel')}</button>`,
        '</div>'
    ].join('');
    /* eslint-enable indent */

    options = util.extend({
        title: i18n.get('Insert link'),
        className: 'te-popup-add-link tui-editor-popup',
        content: POPUP_CONTENT
    }, options);

    LayerPopup.call(this, options);

    this.render();
    this._bindContentEvent();
    this._linkWithEventManager(options.eventManager);
}

PopupAddLink.prototype = util.extend(
    {},
    LayerPopup.prototype
);

PopupAddLink.prototype._bindContentEvent = function() {
    const self = this;

    this.on('click .te-ok-button', () => {
        self.trigger('okButtonClicked', self);
        self.hide();
    });

    this.on('click .te-close-button', () => {
        self.trigger('closeButtonClicked', self);
        self.hide();
    });

    this.on('shown', () => {
        self.$el.find('.te-link-text-input').focus();
    });

    this.on('hidden', () => {
        self.resetInputs();
    });
};

PopupAddLink.prototype._linkWithEventManager = function(eventManager) {
    const self = this;

    eventManager.listen('focus', () => {
        self.hide();
    });

    eventManager.listen('openPopupAddLink', () => {
        eventManager.emit('closeAllPopup');
        self.show();
    });

    eventManager.listen('closeAllPopup', () => {
        self.hide();
    });

    this.on('okButtonClicked', () => {
        eventManager.emit('command', 'AddLink', self.getValue());
    });
};

PopupAddLink.prototype.getValue = function() {
    return {
        linkText: this.$el.find('.te-link-text-input').val(),
        url: this.$el.find('.te-url-input').val().replace(/\(/g, '%28').replace(/\)/g, '%29')
    };
};

PopupAddLink.prototype.resetInputs = function() {
    this.$el.find('input').val('');
};

module.exports = PopupAddLink;
