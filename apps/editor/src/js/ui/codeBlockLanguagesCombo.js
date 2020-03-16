/**
 * @fileoverview Implements UI code block languages combo
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import css from 'tui-code-snippet/domUtil/css';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';
import hasClass from 'tui-code-snippet/domUtil/hasClass';

import i18n from '../i18n';
import KeyMapper from '../keyMapper';
import domUtils from '../utils/dom';

/**
 * Class CodeBlockLanguagesCombo
 * @param {EventManager} eventManager - event manager instance
 * @ignore
 */
class CodeBlockLanguagesCombo {
  constructor(eventManager, languages) {
    this._eventManager = eventManager;
    this._languages = languages;

    this._initDOM();
    this._initDOMEvent();
    this._initEvent();
  }

  _initDOM() {
    this._inputLanguage = domUtils.createElementWith(
      `<input type="text" maxlength="20" placeholder="${i18n.get('Choose language')}" />`
    );
    this._wrapper = domUtils.createElementWith(`<span class="te-input-language"></span>`);
    this._wrapper.appendChild(this._inputLanguage);
    this._hide();
  }

  _initDOMEvent() {
    this._inputLanguage.addEventListener('keydown', event => this._onKeyEvent(event));
    this._inputLanguage.addEventListener('focus', () => this._showPopupCodeBlockLanguages());
    this._inputLanguage.addEventListener('focusout', () => this._onFocusOut());
    this._wrapper.addEventListener('mousedown', ev => {
      if (ev.target !== this._wrapper) {
        return;
      }
      ev.preventDefault();
      this._toggleFocus();
    });
  }

  _initEvent() {
    this._eventManager.listen('setCodeBlockLanguages', languages => {
      this._languages = languages;
      if (languages && languages.length) {
        this._show();
      } else {
        this._hide();
      }
    });
  }

  /**
   * show popup
   * @private
   */
  _showPopupCodeBlockLanguages() {
    const clientRect = this._inputLanguage.getBoundingClientRect();

    addClass(this._wrapper, 'active');
    this.active = true;

    this._popupCodeBlockLanguages = this._eventManager.emitReduce('openPopupCodeBlockLanguages', {
      language: this._prevStoredLanguage,
      offset: {
        left: clientRect.left,
        top: clientRect.bottom
      },
      callback: {
        selected: selectedLanguage => this._onLanguageSelectedFromList(selectedLanguage),
        dismissed: () => {
          this._popupCodeBlockLanguages = null;
        }
      }
    });
  }

  _toggleFocus() {
    const inputLanguage = this._inputLanguage;

    if (hasClass(this._wrapper, 'active')) {
      inputLanguage.blur();
    } else {
      inputLanguage.focus();
    }
  }

  _onFocusOut() {
    removeClass(this._wrapper, 'active');
    this._inputLanguage.value = this._prevStoredLanguage;
    this._hidePopupCodeBlockLanguages();
  }

  _onKeyEvent(event) {
    if (this._popupCodeBlockLanguages) {
      switch (event.which) {
        case KeyMapper.keyCode('UP'):
          this._popupCodeBlockLanguages.prev();
          event.preventDefault();
          break;
        case KeyMapper.keyCode('DOWN'):
          this._popupCodeBlockLanguages.next();
          event.preventDefault();
          break;
        case KeyMapper.keyCode('ENTER'):
        case KeyMapper.keyCode('TAB'): {
          const language = this._popupCodeBlockLanguages.getCurrentLanguage();

          this._inputLanguage.value = language;
          this._storeInputLanguage();
          event.preventDefault();
          break;
        }
        default:
          this._popupCodeBlockLanguages.hide();
      }
    } else if (
      event.which === KeyMapper.keyCode('ENTER') ||
      event.which === KeyMapper.keyCode('TAB')
    ) {
      this._storeInputLanguage();
      event.preventDefault();
    }
  }

  _onLanguageSelectedFromList(selectedLanguage) {
    this._inputLanguage.value = selectedLanguage;
    this._storeInputLanguage();
  }

  /**
   * set a callback to be called on language selected
   * @param {function} callback - callback function
   * @protected
   */
  setOnLanguageSelected(callback) {
    this._onLanguageSelected = callback;
  }

  /**
   * hide popup
   * @private
   */
  _hidePopupCodeBlockLanguages() {
    this._eventManager.emit('closePopupCodeBlockLanguages');
  }

  /**
   * set language
   * @param {string} language - code block language
   * @protected
   */
  setLanguage(language) {
    this._prevStoredLanguage = language;
    this._inputLanguage.value = language;
  }

  /**
   * store selection(typed) language & hide popup
   * @private
   */
  _storeInputLanguage() {
    const selectedLanguage = this._inputLanguage.value;

    this.setLanguage(selectedLanguage);
    if (this._onLanguageSelected) {
      this._onLanguageSelected(selectedLanguage);
    }

    this._hidePopupCodeBlockLanguages();
  }

  /**
   * get element body
   * @returns {HTMLElement} - CodeBlockLanguagesCombo body element
   * @protected
   */
  getElement() {
    return this._wrapper;
  }

  _show() {
    css(this._wrapper, { display: 'inline-block' });
  }

  _hide() {
    css(this._wrapper, { display: 'none' });
  }
}

export default CodeBlockLanguagesCombo;
