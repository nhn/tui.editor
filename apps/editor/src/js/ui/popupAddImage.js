/**
 * @fileoverview Implements PopupAddImage
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import extend from 'tui-code-snippet/object/extend';

import LayerPopup from './layerpopup';
import Tab from './tab';
import i18n from '../i18n';
import domUtils from '../utils/dom';

const CLASS_IMAGE_URL_INPUT = 'te-image-url-input';
const CLASS_IMAGE_FILE_INPUT = 'te-image-file-input';
const CLASS_ALT_TEXT_INPUT = 'te-alt-text-input';
const CLASS_OK_BUTTON = 'te-ok-button';
const CLASS_CLOSE_BUTTON = 'te-close-button';
const CLASS_FILE_TYPE = 'te-file-type';
const CLASS_URL_TYPE = 'te-url-type';
const CLASS_TAB_SECTION = 'te-tab-section';
const TYPE_UI = 'ui';

/**
 * Class PopupAddImage
 * It implements a Image Add Popup
 * @param {LayerPopupOption} options - layer popup option
 * @ignore
 */
class PopupAddImage extends LayerPopup {
  constructor(options) {
    const POPUP_CONTENT = `
            <div class="${CLASS_TAB_SECTION}"></div>
            <div class="${CLASS_URL_TYPE}">
                <label for="">${i18n.get('Image URL')}</label>
                <input type="text" class="${CLASS_IMAGE_URL_INPUT}" />
            </div>
            <div class="${CLASS_FILE_TYPE}">
                <label for="">${i18n.get('Select image file')}</label>
                <input type="file" class="${CLASS_IMAGE_FILE_INPUT}" accept="image/*" />
            </div>
            <label for="url">${i18n.get('Description')}</label>
            <input type="text" class="${CLASS_ALT_TEXT_INPUT}" />
            <div class="te-button-section">
                <button type="button" class="${CLASS_OK_BUTTON}">${i18n.get('OK')}</button>
                <button type="button" class="${CLASS_CLOSE_BUTTON}">${i18n.get('Cancel')}</button>
            </div>
        `;

    options = extend(
      {
        header: true,
        title: i18n.get('Insert image'),
        className: 'te-popup-add-image tui-editor-popup',
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

    this.eventManager = options.eventManager;
  }

  /**
   * initialize DOM, render popup
   * @private
   * @override
   */
  _initDOM() {
    super._initDOM();

    const popup = this.el;

    this._imageUrlInput = popup.querySelector(`.${CLASS_IMAGE_URL_INPUT}`);
    this._imageFileInput = popup.querySelector(`.${CLASS_IMAGE_FILE_INPUT}`);
    this._altTextInput = popup.querySelector(`.${CLASS_ALT_TEXT_INPUT}`);

    const fileTypeSection = popup.querySelector(`.${CLASS_FILE_TYPE}`);
    const urlTypeSection = popup.querySelector(`.${CLASS_URL_TYPE}`);
    const tabSection = this.body.querySelector(`.${CLASS_TAB_SECTION}`);

    this.tab = new Tab({
      initName: i18n.get('File'),
      items: [i18n.get('File'), i18n.get('URL')],
      sections: [fileTypeSection, urlTypeSection]
    });
    tabSection.appendChild(this.tab.el);
  }

  /**
   * bind DOM events
   * @private
   * @override
   */
  _initDOMEvent() {
    super._initDOMEvent();

    this.on('shown', () => this._imageUrlInput.focus());
    this.on('hidden', () => this._resetInputs());

    this.on(`change .${CLASS_IMAGE_FILE_INPUT}`, () => {
      const filename = this._imageFileInput.value.split('\\').pop();

      this._altTextInput.value = filename;
    });

    this.on(`click .${CLASS_CLOSE_BUTTON}`, () => this.hide());
    this.on(`click .${CLASS_OK_BUTTON}`, () => {
      const imageUrl = this._imageUrlInput.value;
      const altText = this._altTextInput.value;

      if (imageUrl) {
        this._applyImage(imageUrl, altText);
      } else {
        const { files } = this._imageFileInput;

        if (files.length) {
          const imageFile = files.item(0);
          const hookCallback = (url, text) => this._applyImage(url, text || altText);

          this.eventManager.emit('addImageBlobHook', imageFile, hookCallback, TYPE_UI);
        }
      }

      this.hide();
    });

    this.tab.on('itemClick', () => this._resetInputs());
  }

  /**
   * bind editor events
   * @private
   * @override
   */
  _initEditorEvent() {
    super._initEditorEvent();

    this.eventManager.listen('focus', () => this.hide());
    this.eventManager.listen('closeAllPopup', () => this.hide());

    this.eventManager.listen('openPopupAddImage', () => {
      this.eventManager.emit('closeAllPopup');
      this.show();
    });
  }

  _applyImage(imageUrl, altText) {
    this.eventManager.emit('command', 'AddImage', {
      imageUrl,
      altText: altText || 'image'
    });
    this.hide();
  }

  _resetInputs() {
    domUtils.findAll(this.el, 'input').forEach(input => {
      input.value = '';
    });
  }

  /**
   * Remove popup
   * @override
   */
  remove() {
    this.tab.remove();
    super.remove();
  }
}

export default PopupAddImage;
