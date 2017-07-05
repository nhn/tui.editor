
import i18n from '../i18n';
import KeyMapper from '../keyMapper';

class CodeBlockLanguagesCombo {
    constructor(eventManager) {
        this._eventManager = eventManager;

        this._initDOM();
        this._initDOMEvent();
    }

    _initDOM() {
        this._inputLanguage = $(`<input type="text" class="te-input-language" maxlength="20" placeholder="${i18n.get('Choose language')}">`).get(0);
    }

    _initDOMEvent() {
        this._inputLanguage.addEventListener('keydown', event => this._onKeyEvent(event));
        this._inputLanguage.addEventListener('focus', () => this._showPopupCodeBlockLanguages());
        this._inputLanguage.addEventListener('focusout', () => this._onFocusOut());
    }

    /**
     * show popup
     * @private
     * @memberof CodeBlockGadget
     */
    _showPopupCodeBlockLanguages() {
        const clientRect = this._inputLanguage.getBoundingClientRect();
        this.active = true;

        const offset = {
            left: clientRect.left,
            top: clientRect.bottom + document.body.scrollTop
        };
        this._popupCodeBlockLanguages = this._eventManager.emitReduce('openPopupCodeBlockLanguages', {
            language: this._prevStoredLanguage,
            offset: {
                left: offset.left,
                top: offset.top
            },
            callback: {
                selected: selectedLanguage => this._onLanguageSelectedFromList(selectedLanguage),
                dismissed: () => {
                    this._popupCodeBlockLanguages = null;
                }
            }
        });
    }

    _onFocusOut() {
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
        } else if (event.which === KeyMapper.keyCode('ENTER') || event.which === KeyMapper.keyCode('TAB')) {
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
     * @memberof CodeBlockLanguagesCombo
     */
    setOnLanguageSelected(callback) {
        this._onLanguageSelected = callback;
    }

    /**
     * hide popup
     * @private
     * @memberof CodeBlockGadget
     */
    _hidePopupCodeBlockLanguages() {
        this._eventManager.emit('closePopupCodeBlockLanguages');
    }

    /**
     * set language
     * @param {string} language - code block language
     * @memberof CodeBlockLanguagesCombo
     */
    setLanguage(language) {
        this._prevStoredLanguage = language;
        this._inputLanguage.value = language;
    }

    /**
     * store selection(typed) language & hide popup
     * @private
     * @memberof CodeBlockGadget
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
     * @memberof CodeBlockLanguagesCombo
     */
    getElement() {
        return this._inputLanguage;
    }
}

export default CodeBlockLanguagesCombo;
