/**
 * @fileoverview Implements popup code block languages
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import LayerPopup from './layerpopup';

const BUTTON_CLASS_PREFIX = 'te-popup-code-block-lang-';

/**
 * Class Popup code block languages select list
 * @extends {LayerPopup}
 */
class PopupCodeBlockLanguages extends LayerPopup {
  /**
   * Creates an instance of PopupCodeBlockLanguages.
   * @param {LayerPopupOption} options - layer popup option
   * @memberof PopupCodeBlockLanguages
   */
  constructor(options) {
    const popupButtonsHTML = [];
    const {languages} = options;
    languages.forEach(lang =>
      popupButtonsHTML.push(`<button type="button" class="${BUTTON_CLASS_PREFIX}${lang}" data-lang="${lang}">${lang}</button>`));

    options = util.extend({
      header: false,
      className: 'te-popup-code-block-languages',
      content: popupButtonsHTML.join('')
    }, options);
    super(options);
  }

  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @memberof PopupCodeBlockLanguages
   * @protected
   * @override
   */
  _initInstance(options) {
    super._initInstance(options);

    this._onSelectedLanguage = null;
    this._onDismissed = null;
    this._currentButton = null;
    this._$buttons = null;
    this._languages = options.languages;

    this.eventManager = options.eventManager;
  }

  /**
   * initialize DOM, render popup
   * @memberof PopupCodeBlockLanguages
   * @protected
   * @override
   */
  _initDOM(options) {
    super._initDOM(options);

    this.$el.css('z-index', 10000);

    this._$buttons = this.$el.find('button');
    this._activateButtonByIndex(0);
  }

  /**
   * bind DOM events
   * @memberof PopupCodeBlockLanguages
   * @protected
   * @override
   */
  _initDOMEvent() {
    super._initDOMEvent();

    const handler = event => {
      const language = $(event.target).data('lang');
      if (this._onSelectedLanguage) {
        this._onSelectedLanguage(language);
      }
      this.hide();
    };
    this._languages.forEach(lang => this.on(`mousedown .${BUTTON_CLASS_PREFIX}${lang}`, handler));
  }

  /**
   * bind editor events
   * @memberof PopupCodeBlockLanguages
   * @protected
   * @abstract
   */
  _initEditorEvent() {
    super._initEditorEvent();

    this.eventManager.listen('openPopupCodeBlockLanguages', data => {
      this.show(data.callback);
      const elementStyle = this.$el.get(0).style;
      elementStyle.top = `${data.offset.top}px`;
      elementStyle.left = `${data.offset.left}px`;
      this.setCurrentLanguage(data.language);

      return this;
    });
    this.eventManager.listen('focus', () => this.hide());
    this.eventManager.listen('mousedown', () => this.hide());
    this.eventManager.listen('closeAllPopup', () => this.hide());
    this.eventManager.listen('closePopupCodeBlockLanguages', () => this.hide());
    this.eventManager.listen('scroll', () => this.hide());
  }

  /**
   * activate an item by index
   * @param {number} index - item index
   * @private
   * @memberof PopupCodeBlockLanguages
   */
  _activateButtonByIndex(index) {
    if (this._currentButton) {
      $(this._currentButton).removeClass('active');
    }
    this._currentButton = this._$buttons.get(index);
    $(this._currentButton).addClass('active');
    this._currentButton.scrollIntoView();
  }

  /**
   * move to prev language
   * @memberof PopupCodeBlockLanguages
   */
  prev() {
    let index = this._$buttons.index(this._currentButton) - 1;
    if (index < 0) {
      index = this._$buttons.length - 1;
    }
    this._activateButtonByIndex(index);
  }

  /**
   * move to next language
   * @memberof PopupCodeBlockLanguages
   */
  next() {
    let index = this._$buttons.index(this._currentButton) + 1;
    if (index >= this._$buttons.length) {
      index = 0;
    }
    this._activateButtonByIndex(index);
  }

  /**
   * current language
   * @public
   * @memberof PopupCodeBlockLanguages
   * @returns {string} language
   */
  getCurrentLanguage() {
    const language = $(this._currentButton).data('lang');

    return language;
  }

  /**
   * set current language
   * @param {string} language - current language
   * @memberof PopupCodeBlockLanguages
   */
  setCurrentLanguage(language) {
    const item = this._$buttons.filter(`.${BUTTON_CLASS_PREFIX}${language}`);
    if (item.length > 0) {
      const index = this._$buttons.index(item);
      this._activateButtonByIndex(index);
    }
  }

  /**
   * show popup
   * @param {object} callback - to be called on language selected & dismissed
   * @protected
   * @memberof PopupCodeBlockLanguages
   */
  show(callback) {
    this._onSelectedLanguage = callback.selected;
    this._onDismissed = callback.dismissed;
    super.show();
  }

  /**
   * hide popup
   * @memberof PopupCodeBlockLanguages
   * @protected
   */
  hide() {
    if (this._onDismissed) {
      this._onDismissed();
    }
    this._onSelectedLanguage = null;
    this._onDismissed = null;
    super.hide();
  }
}

export default PopupCodeBlockLanguages;
