/**
 * @fileoverview Implements PopupAddLink
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import extend from 'tui-code-snippet/object/extend';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';

import LayerPopup from './layerpopup';
import i18n from '../i18n';

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/([^\s]*))?$/;

/**
 * Class PopupAddLink
 * It implements a link Add Popup
 * @param {LayerPopupOption} options - layer popup options
 * @ignore
 */
class PopupAddLink extends LayerPopup {
  constructor(options) {
    const POPUP_CONTENT = `
            <label for="url">${i18n.get('URL')}</label>
            <input type="text" class="te-url-input" />
            <label for="linkText">${i18n.get('Link text')}</label>
            <input type="text" class="te-link-text-input" />
            <div class="te-button-section">
                <button type="button" class="te-ok-button">${i18n.get('OK')}</button>
                <button type="button" class="te-close-button">${i18n.get('Cancel')}</button>
            </div>
        `;

    options = extend(
      {
        header: true,
        title: i18n.get('Insert link'),
        className: 'te-popup-add-link tui-editor-popup',
        content: POPUP_CONTENT
      },
      options
    );
    super(options);
  }

  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @private
   * @override
   */
  _initInstance(options) {
    super._initInstance(options);

    this._editor = options.editor;
    this._eventManager = options.editor.eventManager;
  }

  /**
   * initialize DOM, render popup
   * @private
   * @override
   */
  _initDOM() {
    super._initDOM();

    const { el } = this;

    this._inputText = el.querySelector('.te-link-text-input');
    this._inputURL = el.querySelector('.te-url-input');
  }

  /**
   * bind DOM events
   * @private
   * @override
   */
  _initDOMEvent() {
    super._initDOMEvent();

    this.on('click .te-close-button', () => this.hide());
    this.on('click .te-ok-button', () => this._addLink());

    this.on('shown', () => {
      const inputText = this._inputText;
      const inputURL = this._inputURL;

      const selectedText = this._editor.getSelectedText().trim();

      inputText.value = selectedText;
      if (URL_REGEX.exec(selectedText)) {
        inputURL.value = selectedText;
      }

      inputURL.focus();
    });

    this.on('hidden', () => {
      this._resetInputs();
    });
  }

  /**
   * bind editor events
   * @private
   * @override
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

  _addLink() {
    const { url, linkText } = this._getValue();

    this._clearValidationStyle();

    if (linkText.length < 1) {
      addClass(this._inputText, 'wrong');

      return;
    }
    if (url.length < 1) {
      addClass(this._inputURL, 'wrong');

      return;
    }

    this._eventManager.emit('command', 'AddLink', {
      linkText,
      url
    });
    this.hide();
  }

  _getValue() {
    const url = this._inputURL.value;
    const linkText = this._inputText.value;

    return {
      url,
      linkText
    };
  }

  _clearValidationStyle() {
    removeClass(this._inputURL, 'wrong');
    removeClass(this._inputText, 'wrong');
  }

  _resetInputs() {
    this._inputText.value = '';
    this._inputURL.value = '';
    this._clearValidationStyle();
  }
}

export default PopupAddLink;
