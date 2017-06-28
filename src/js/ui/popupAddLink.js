/**
 * @fileoverview Implements PopupAddLink
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import LayerPopup from './layerpopup';
import i18n from '../i18n';
import ImportManager from '../importManager';

const {util} = tui;
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/([^\s]*))?$/;

/**
 * PopupAddLink
 * It implements a link Add Popup
 * @class PopupAddLink
 * @extends {LayerPopup}
 */
class PopupAddLink extends LayerPopup {

    /**
     * Creates an instance of PopupAddLink.
     * @param {LayerPopupOption} options - layer popup options
     * @memberof PopupAddLink
     */
    constructor(options) {
        const POPUP_CONTENT = `
            <label for="linkText">${i18n.get('Link text')}</label>
            <input type="text" class="te-link-text-input" />
            <label for="url">${i18n.get('URL')}</label>
            <input type="text" class="te-url-input" />
            <div class="te-button-section">
                <button type="button" class="te-ok-button">${i18n.get('OK')}</button>
                <button type="button" class="te-close-button">${i18n.get('Cancel')}</button>
            </div>
        `;
        options = util.extend({
            header: true,
            title: i18n.get('Insert link'),
            className: 'te-popup-add-link tui-editor-popup',
            content: POPUP_CONTENT
        }, options);
        super(options);
    }

    /**
     * init instance.
     * store properties & prepare before initialize DOM
     * @param {LayerPopupOption} options - layer popup options
     * @memberof PopupAddLink
     * @protected
     * @override
     */
    _initInstance(options) {
        super._initInstance(options);

        this._editor = options.editor;
        this._eventManager = options.editor.eventManager;
    }

    /**
     * initialize DOM, render popup
     * @memberof PopupAddLink
     * @protected
     * @override
     */
    _initDOM() {
        super._initDOM();

        const el = this.$el.get(0);
        this._inputText = el.querySelector('.te-link-text-input');
        this._inputURL = el.querySelector('.te-url-input');
    }

    /**
     * bind DOM events
     * @memberof PopupAddLink
     * @protected
     * @override
     */
    _initDOMEvent() {
        super._initDOMEvent();

        this.on('click .te-close-button', () => this.hide());
        this.on('click .te-ok-button', () => {
            this._eventManager.emit('command', 'AddLink', this._getValue());
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
            this._resetInputs();
        });
    }

    /**
     * bind editor events
     * @memberof PopupAddLink
     * @protected
     * @abstract
     */
    _initEditorEvent() {
        super._initEditorEvent();

        const eventManager = this._eventManager;
        eventManager.listen('focus', () => this.hide());
        eventManager.listen('closeAllPopup', () => this.hide());
        eventManager.listen('openPopupAddLink', () => {
            eventManager.emit('closeAllPopup');
            this.show();
        });
    }

    _getValue() {
        const linkText = ImportManager.decodeURIGraceful(this._inputText.value, decodeURIComponent);
        const url = ImportManager.decodeURIGraceful(this._inputURL.value, decodeURI);

        return {
            linkText,
            url
        };
    }

    _resetInputs() {
        this._inputText.value = '';
        this._inputURL.value = '';
    }
}

module.exports = PopupAddLink;
