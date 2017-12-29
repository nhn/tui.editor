/**
 * @fileoverview Implements i18n
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import util from 'tui-code-snippet';

let sharedInstance;

const DEFAULT_CODE = 'en_US';

/**
 * Class I18n
 */
class I18n {
  /**
   * Creates an instance of I18n.
   * @memberof I18n
   */
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
   * @param {string|string[]} codes locale code
   * @param {object} data language set
   */
  setLanguage(codes, data) {
    codes = [].concat(codes);

    codes.forEach(code => {
      if (!this._langs.has(code)) {
        this._langs.set(code, data);
      } else {
        const langData = this._langs.get(code);
        this._langs.set(code, util.extend(langData, data));
      }
    });
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
export default new I18n();
