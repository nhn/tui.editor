/**
 * @fileoverview Implements PopupAddLink
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import LayerPopup from './layerpopup';
import i18n from '../i18n';
import ImportManager from '../importManager';

const util = tui.util;
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/([^\s]*))?$/;

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
    const POPUP_CONTENT =
        `<label for="linkText">${i18n.get('Link text')}</label>
        <input type="text" class="te-link-text-input" />
        <label for="url">${i18n.get('URL')}</label>
        <input type="text" class="te-url-input" />
        <div class="te-button-section">
            <button type="button" class="te-ok-button">${i18n.get('OK')}</button>
            <button type="button" class="te-close-button">${i18n.get('Cancel')}</button>
        </div>`;
    /* eslint-enable indent */

    options = util.extend({
        title: i18n.get('Insert link'),
        className: 'te-popup-add-link tui-editor-popup',
        content: POPUP_CONTENT
    }, options);

    LayerPopup.call(this, options);

    this._editor = options.editor;

    this.render();
    this._initDOM();
    this._bindContentEvent();
    this._linkWithEventManager(options.editor.eventManager);
}

PopupAddLink.prototype = util.extend(
    {},
    LayerPopup.prototype
);

PopupAddLink.prototype._initDOM = function() {
    const el = this.$el.get(0);
    this._inputText = el.querySelector('.te-link-text-input');
    this._inputURL = el.querySelector('.te-url-input');
};

PopupAddLink.prototype._bindContentEvent = function() {
    this.on('click .te-ok-button', () => {
        this.trigger('okButtonClicked', this);
        this.hide();
    });

    this.on('click .te-close-button', () => {
        this.trigger('closeButtonClicked', this);
        this.hide();
    });

    this.on('shown', () => {
        const inputText = this._inputText;
        const inputURL = this._inputURL;

        const selectedText = this._editor.getSelectedText().trim();

        inputText.value = selectedText;
        if (URL_REGEX.exec(selectedText)) {
            inputURL.value = selectedText;
        }

        if (selectedText.length > 0 && inputURL.value.length < 1) {
            inputURL.focus();
        } else {
            inputText.focus();
            inputText.setSelectionRange(0, selectedText.length);
        }
    });

    this.on('hidden', () => {
        this.resetInputs();
    });
};

PopupAddLink.prototype._linkWithEventManager = function(eventManager) {
    eventManager.listen('focus', () => {
        this.hide();
    });

    eventManager.listen('openPopupAddLink', () => {
        eventManager.emit('closeAllPopup');
        this.show();
    });

    eventManager.listen('closeAllPopup', () => {
        this.hide();
    });

    this.on('okButtonClicked', () => {
        eventManager.emit('command', 'AddLink', this.getValue());
    });
};

PopupAddLink.prototype.getValue = function() {
    const linkText = ImportManager.decodeURIGraceful(this._inputText.value, decodeURIComponent);
    const url = ImportManager.decodeURIGraceful(this._inputURL.value, decodeURI);

    return {
        linkText,
        url
    };
};

PopupAddLink.prototype.resetInputs = function() {
    this._inputText.value = '';
    this._inputURL.value = '';
};

module.exports = PopupAddLink;
