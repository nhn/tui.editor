/**
 * @fileoverview Implements CodeBlockManager
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

const {hljs} = window;

/**
 * Class Code Block Manager
 */
class CodeBlockManager {

    /**
     * Creates an instance of CodeBlockManager.
     * @memberof CodeBlockManager
     */
    constructor() {
        this._supportedLanguages = hljs.listLanguages();
        this._replacers = {};
    }

    /**
     * Set replacer for code block
     * @param {string} language - code block language
     * @param {function} replacer - replacer function to code block element
     */
    setReplacer(language, replacer) {
        this._replacers[language] = replacer;
        if (this._supportedLanguages.indexOf(language) < 0) {
            this._supportedLanguages.push(language);
        }
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
     * sets supported languages options
     * default value is what highlight js supports
     * @param {string[]} supportedLanguages - user set supported languages via options
     * @memberof CodeBlockManager
     */
    setSupportedLanguages(supportedLanguages) {
        this._supportedLanguages = supportedLanguages;
    }

    /**
     * gets supported languages
     * default value is what highlight js supports
     * supported languages by replacers will be added
     * @returns {string[]} - list of supportedLanguages
     * @memberof CodeBlockManager
     */
    getSupportedLanguages() {
        return this._supportedLanguages;
    }

    /**
     * get supported languages by highlight-js
     * @returns {Array<string>} - supported languages by highlight-js
     * @memberof CodeBlockManager
     */

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

export default CodeBlockManager;
