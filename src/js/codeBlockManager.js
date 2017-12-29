/**
 * @fileoverview Implements CodeBlockManager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import hljs from 'highlight.js';

/**
 * Class Code Block Manager
 */
class CodeBlockManager {
  /**
   * Creates an instance of CodeBlockManager.
   * @memberof CodeBlockManager
   */
  constructor() {
    this._replacers = {};
  }

  /**
   * Set replacer for code block
   * @param {string} language - code block language
   * @param {function} replacer - replacer function to code block element
   */
  setReplacer(language, replacer) {
    this._replacers[language] = replacer;
  }

  /**
   * get replacer for code block
   * @param {string} language - code block type
   * @returns {function} - replacer function
   * @memberof CodeBlockManager
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
    const replacer = this.getReplacer(language);
    let html;

    if (replacer) {
      html = replacer(codeText, language);
    } else {
      html = hljs.getLanguage(language) ? hljs.highlight(language, codeText).value : escape(codeText, false);
    }

    return html;
  }

  /**
   * get supported languages by highlight-js
   * @returns {Array<string>} - supported languages by highlight-js
   * @static
   */
  static getHighlightJSLanguages() {
    return hljs.listLanguages();
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
  return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export {
  CodeBlockManager
};
export default new CodeBlockManager();
