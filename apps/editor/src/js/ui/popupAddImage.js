/**
 * @fileoverview Implements PopupAddImage
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import util from 'tui-code-snippet';

import LayerPopup from './layerpopup';
import Tab from './tab';
import i18n from '../i18n';

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
 * @extends {LayerPopup}
 */
class PopupAddImage extends LayerPopup {
  /**
   * Creates an instance of PopupAddImage.
   * @param {LayerPopupOption} options - layer popup option
   * @memberof PopupAddImage
   */
  constructor(options) {
    const POPUP_CONTENT = `
            <div class="${CLASS_TAB_SECTION}"></div>
            <div class="${CLASS_URL_TYPE}">
                <label for="">${i18n.get('Image URL')}</label>
                <input type="text" class="${CLASS_IMAGE_URL_INPUT}" />
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
    options = util.extend({
      header: true,
      title: i18n.get('Insert image'),
      className: 'te-popup-add-image tui-editor-popup',
      content: POPUP_CONTENT
    }, options);
    super(options);
  }

  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @memberof PopupAddImage
   * @protected
   * @override
   */
  _initInstance(options) {
    super._initInstance(options);

    this.eventManager = options.eventManager;
  }

  /**
   * initialize DOM, render popup
   * @memberof PopupAddImage
   * @protected
   * @override
   */
  _initDOM() {
    super._initDOM();

    const $popup = this.$el;

    this._$imageUrlInput = $popup.find(`.${CLASS_IMAGE_URL_INPUT}`);
    this._$imageFileInput = $popup.find(`.${CLASS_IMAGE_FILE_INPUT}`);
    this._$altTextInput = $popup.find(`.${CLASS_ALT_TEXT_INPUT}`);

    const $fileTypeSection = $popup.find(`.${CLASS_FILE_TYPE}`);
    const $urlTypeSection = $popup.find(`.${CLASS_URL_TYPE}`);
    const $tabSection = this.$body.find(`.${CLASS_TAB_SECTION}`);
    this.tab = new Tab({
      initName: i18n.get('File'),
      items: [
        i18n.get('File'),
        i18n.get('URL')
      ],
      sections: [
        $fileTypeSection,
        $urlTypeSection
      ]
    });
    $tabSection.append(this.tab.$el);
  }

  /**
   * bind DOM events
   * @memberof PopupAddImage
   * @protected
   * @override
   */
  _initDOMEvent() {
    super._initDOMEvent();

    this.on('shown', () => this._$imageUrlInput.focus());
    this.on('hidden', () => this._resetInputs());

    this.on(`change .${CLASS_IMAGE_FILE_INPUT}`, () => {
      const filename = this._$imageFileInput.val().split('\\').pop();
      this._$altTextInput.val(filename);
    });

    this.on(`click .${CLASS_CLOSE_BUTTON}`, () => this.hide());
    this.on(`click .${CLASS_OK_BUTTON}`, () => {
      const imageUrl = this._$imageUrlInput.val();
      const altText = this._$altTextInput.val();

      if (imageUrl) {
        this._applyImage(imageUrl, altText);
      } else {
        const imageFile = this._$imageFileInput.get(0).files.item(0);
        const hookCallback = (url, text) => this._applyImage(url, altText || text);

        this.eventManager.emit('addImageBlobHook', imageFile, hookCallback, TYPE_UI);
      }

      this.hide();
    });

    this.tab.on('itemClick', () => this._resetInputs());
  }

  /**
   * bind editor events
   * @memberof PopupAddImage
   * @protected
   * @abstract
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
    this.$el.find('input').val('');
  }
}

export default PopupAddImage;
