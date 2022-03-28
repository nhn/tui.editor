/**
 * @fileoverview Implements i18n
 * @author NHN Cloud FE Development Lab <dl_javascript@nhn.com>
 */
import extend from 'tui-code-snippet/object/extend';
import Map from '../utils/map';

const DEFAULT_CODE = 'en-US';

/**
 * Class I18n
 * @ignore
 */
class I18n {
  private code: string;

  private langs: Map<string, Record<string, string>>;

  constructor() {
    this.code = DEFAULT_CODE;
    this.langs = new Map();
  }

  setCode(code?: string) {
    this.code = code || DEFAULT_CODE;
  }

  /**
   * Set language set
   * @param {string|string[]} codes locale code
   * @param {object} data language set
   */
  setLanguage(codes: string | string[], data: Record<string, string>) {
    codes = ([] as string[]).concat(codes);

    codes.forEach((code) => {
      if (!this.langs.has(code)) {
        this.langs.set(code, data);
      } else {
        const langData = this.langs.get(code)!;

        this.langs.set(code, extend(langData, data));
      }
    });
  }

  get(key: string, code?: string) {
    if (!code) {
      code = this.code;
    }

    let langSet = this.langs.get(code);

    if (!langSet) {
      langSet = this.langs.get(DEFAULT_CODE)!;
    }

    const text = langSet[key];

    if (!text) {
      throw new Error(`There is no text key "${key}" in ${code}`);
    }

    return text;
  }
}

export { I18n };
export default new I18n();
