/**
 * @fileoverview Implements CodeBlockManager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
/**
 * Class Code Block Manager
 */
class CodeBlockManager {
  constructor() {
    this._replacers = {};
  }

  /**
   * Set replacer for code block
   * @param {string} language - code block language
   * @param {function} replacer - replacer function to code block element
   */
  setReplacer(language, replacer) {
    language = language.toLowerCase();

    this._replacers[language] = replacer;
  }

  /**
   * get replacer for code block
   * @param {string} language - code block type
   * @returns {function} - replacer function
   */
  getReplacer(language) {
    return this._replacers[language];
  }

  /**
   * Create code block html.
   * @param {string} language - code block language
   * @param {string} codeText - code text
   * @returns {string}
   */
  createCodeBlockHtml(language, codeText) {
    language = language.toLowerCase();

    const replacer = this.getReplacer(language);

    if (replacer) {
      return replacer(codeText, language);
    }
    return escape(codeText, false);
  }
}

/**
 * escape code from markdown-it
 * @param {string} html HTML string
 * @param {string} encode Boolean value of whether encode or not
 * @returns {string}
 * @ignore
 */
function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export { CodeBlockManager };
export default new CodeBlockManager();
