/**
 * @fileoverview Implements i18n
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

const util = tui.util;

let sharedInstance;

const DEFAULT_CODE = 'en_US';

/**
 * I18n
 * @exports I18n
 * @class
 */
class I18n {
    constructor() {
        this._code = DEFAULT_CODE;
        this._langs = new util.Map();
    }

    /**
     * Set locale code
     * @param {string} code locale code
     */
    setCode(code) {
        this._code = code;
    }

    /**
     * Set language set
     * @param {string} code locale code
     * @param {object} data language set
     */
    setLang(code, data) {
        if (!this._langs.has(code)) {
            this._langs.set(code, data);
        } else {
            const langData = this._langs.get(code);
            this._langs.set(code, Object.assign(langData, data));
        }
    }

    /**
     * Get text of key
     * @param {string} key key of text
     * @param {string} code locale code
     * @returns {string}
     */
    get(key, code) {
        if (!code) {
            code = this._code;
        }

        let langSet = this._langs.get(code);

        if (!langSet) {
            langSet = this._langs.get(DEFAULT_CODE);
        }

        const text = langSet[key];

        if (!text) {
            throw new Error(`There is no text key "${key}" in ${code}`);
        }

        return text;
    }

    static getSharedInstance() {
        if (!sharedInstance) {
            sharedInstance = new I18n();
        }

        return sharedInstance;
    }
}

export {I18n};
export default I18n.getSharedInstance();
