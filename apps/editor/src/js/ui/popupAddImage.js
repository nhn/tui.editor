/**
 * @fileoverview Implements PopupAddImage
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';
import addClass from 'tui-code-snippet/domUtil/addClass';
import extend from 'tui-code-snippet/object/extend';

import LayerPopup from './layerpopup';
import Tab from './tab';
import i18n from '../i18n';
import domUtils from '../utils/dom';

const CLASS_IMAGE_URL_ITEM = 'te-image-url-item';
const CLASS_IMAGE_URL_INPUT = 'te-image-url-input';
const CLASS_ADD_IMAGE_URL_ITEM = 'te-add-image-url-item';
const CLASS_REMOVE_IMAGE_URL_ITEM = 'te-remove-image-url-item';
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
            </div>
            <form enctype="multipart/form-data" class="${CLASS_FILE_TYPE}">
                <label for="">${i18n.get('Select image file')}</label>
                <input type="file" class="${CLASS_IMAGE_FILE_INPUT}" accept="image/*" />
            </form>
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

    this._urlTypeSection = popup.querySelector(`.${CLASS_URL_TYPE}`);
    this._imageFileInput = popup.querySelector(`.${CLASS_IMAGE_FILE_INPUT}`);
    this._altTextInput = popup.querySelector(`.${CLASS_ALT_TEXT_INPUT}`);

    const fileTypeSection = popup.querySelector(`.${CLASS_FILE_TYPE}`);
    const tabSection = this.body.querySelector(`.${CLASS_TAB_SECTION}`);

    this.tab = new Tab({
      initName: i18n.get('File'),
      items: [i18n.get('File'), i18n.get('URL')],
      sections: [fileTypeSection, this._urlTypeSection]
    });
    tabSection.appendChild(this.tab.el);

    this._addImageUrlItem(true);

    if (this.options.multipleImageUpload) {
      this._imageFileInput.setAttribute('multiple', true);

      domUtils.prepend(
        this._urlTypeSection,
        `<span class="${CLASS_ADD_IMAGE_URL_ITEM}" title="${i18n.get('More')}">+</span>`
      );
      this.on(`click .${CLASS_ADD_IMAGE_URL_ITEM}`, () => this._addImageUrlItem(false));
    }
  }

  /**
   * bind DOM events
   * @private
   * @override
   */
  _initDOMEvent() {
    super._initDOMEvent();

    this.on('shown', () => this._imageUrlInputs[0].focus());
    this.on('hidden', () => this._resetInputs());

    this.on(`change .${CLASS_IMAGE_FILE_INPUT}`, () => {
      const filename = toArray(this._imageFileInput.files)
        .map(file => file.name)
        .join(',');

      this._altTextInput.value = filename;
    });

    this.on(`click .${CLASS_CLOSE_BUTTON}`, () => this.hide());
    this.on(`click .${CLASS_OK_BUTTON}`, () => {
      const imageUrls = toArray(this._imageUrlInputs).reduce((urls, imageUrlInput) => {
        const { value } = imageUrlInput;

        if (value) {
          urls.push(value);
        }
        return urls;
      }, []);

      const altText = this._altTextInput.value;

      if (imageUrls.length) {
        imageUrls.forEach(imageUrl => this._applyImage(imageUrl, altText));
      } else {
        const { files } = this._imageFileInput;

        if (files.length) {
          toArray(files).forEach(imageFile => {
            const hookCallback = (url, text) =>
              this._applyImage(url, text || altText || imageFile.name);

            this.eventManager.emit('addImageBlobHook', imageFile, hookCallback, TYPE_UI);
          });
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

  _addImageUrlItem(isFirst) {
    const imageUrlItem = document.createElement('div');

    domUtils.append(imageUrlItem, `<input type="text" class="${CLASS_IMAGE_URL_INPUT}" />`);
    addClass(imageUrlItem, CLASS_IMAGE_URL_ITEM);
    domUtils.append(this._urlTypeSection, imageUrlItem);

    if (!isFirst) {
      const el = document.createElement('div');

      domUtils.append(
        el,
        `<span class="${CLASS_REMOVE_IMAGE_URL_ITEM}" title="${i18n.get('Cancel')}">-</span>`
      );

      const [removeImageUrlItem] = domUtils.children(el, `.${CLASS_REMOVE_IMAGE_URL_ITEM}`);

      removeImageUrlItem.addEventListener('click', () => {
        domUtils.remove(imageUrlItem);
        this._getImageUrlInputs();
      });
      imageUrlItem.appendChild(removeImageUrlItem);
    }

    this._getImageUrlInputs();
  }

  _getImageUrlInputs() {
    this._imageUrlInputs = this.el.querySelectorAll(`.${CLASS_IMAGE_URL_INPUT}`);
  }

  _applyImage(imageUrl, altText) {
    this.eventManager.emit('command', 'AddImage', {
      imageUrl,
      altText: altText || 'image'
    });
    this.hide();
  }

  _resetInputs() {
    const imageUrlList = domUtils.findAll(this.el, `.${CLASS_IMAGE_URL_ITEM}`);

    domUtils.removeChildFromEndToStartNode(
      this._urlTypeSection,
      imageUrlList[imageUrlList.length - 1],
      imageUrlList[0]
    );
    this._getImageUrlInputs();

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
