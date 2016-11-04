/**
 * @fileoverview Convertor have responsible to convert markdown and html
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import htmlSanitizer from './htmlSanitizer';
import taskList from './markdownItPlugins/markdownitTaskPlugin';
import codeBlock from './markdownItPlugins/markdownitCodeBlockPlugin';
import tableRenderer from './markdownItPlugins/markdownitTableRenderer';
import htmlBlock from './markdownItPlugins/markdownitHtmlBlockRenderer';

const markdownIt = window.markdownit,
    toMark = window.toMark,
    hljs = window.hljs;

const markdownitHighlight = markdownIt({
    html: true,
    breaks: true,
    quotes: '“”‘’',
    langPrefix: 'lang-',
    highlight(code, type) {
        return hljs.getLanguage(type) ? hljs.highlight(type, code).value : escape(code, false);
    }
});
const markdownit = markdownIt({
    html: true,
    breaks: true,
    quotes: '“”‘’',
    langPrefix: 'lang-'
});

markdownitHighlight.block.ruler.at('table', tableRenderer, ['paragraph', 'reference']);
markdownitHighlight.block.ruler.at('html_block', htmlBlock, ['paragraph', 'reference', 'blockquote']);
markdownitHighlight.use(taskList);
markdownitHighlight.use(codeBlock);

markdownit.block.ruler.at('table', tableRenderer, ['paragraph', 'reference']);
markdownit.block.ruler.at('html_block', htmlBlock, ['paragraph', 'reference', 'blockquote']);
markdownit.use(taskList);
markdownit.use(codeBlock);

/**
 * Convertor
 * @exports Convertor
 * @constructor
 * @class Convertor
 * @param {EventManager} em EventManager instance
 */
class Convertor {
    constructor(em) {
        this.eventManager = em;
    }

    /**
     * _markdownToHtmlWithCodeHighlight
     * Convert markdown to html with Codehighlight
     * @private
     * @memberOf Convertor
     * @param {string} markdown markdown text
     * @returns {string} html text
     */
    _markdownToHtmlWithCodeHighlight(markdown) {
        markdown = markdown.replace(/<br>/ig, '<br data-tomark-pass>');

        let renderedHTML = markdownitHighlight.render(markdown);
        renderedHTML = this._removeBrToMarkPassAttributeInCode(renderedHTML);

        return renderedHTML;
    }

    /**
     * _markdownToHtml
     * Convert markdown to html
     * @private
     * @memberOf Convertor
     * @param {string} markdown markdown text
     * @returns {string} html text
     */
    _markdownToHtml(markdown) {
        markdown = markdown.replace(/<br>/ig, '<br data-tomark-pass>');

        let renderedHTML = markdownitHighlight.render(markdown);
        renderedHTML = this._removeBrToMarkPassAttributeInCode(renderedHTML);

        return renderedHTML;
    }

    /**
     * Remove BR's data-tomark-pass attribute text when br in code element
     * @param {string} renderedHTML Rendered HTML string from markdown editor
     * @returns {string}
     * @private
     */
    _removeBrToMarkPassAttributeInCode(renderedHTML) {
        const $wrapperDiv = $('<div />');

        $wrapperDiv.html(renderedHTML);

        $wrapperDiv.find('code, pre').each((i, code) => {
            const $code = $(code);
            $code.html($code.html().replace(/&lt;br data-tomark-pass&gt;/, '&lt;br&gt;'));
        });

        renderedHTML = $wrapperDiv.html();

        return renderedHTML;
    }

    /**
     * toHTMLWithCodeHightlight
     * Convert markdown to html with Codehighlight
     * emit convertorAfterMarkdownToHtmlConverted
     * @api
     * @memberOf Convertor
     * @param {string} markdown markdown text
     * @returns {string} html text
     */
    toHTMLWithCodeHightlight(markdown) {
        let html = this._markdownToHtmlWithCodeHighlight(markdown);
        html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);

        return html;
    }

    /**
     * toHTML
     * Convert markdown to html
     * emit convertorAfterMarkdownToHtmlConverted
     * @api
     * @memberOf Convertor
     * @param {string} markdown markdown text
     * @returns {string} html text
     */
    toHTML(markdown) {
        let html = this._markdownToHtml(markdown);
        html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);

        return html;
    }

    initHtmlSanitizer() {
        this.eventManager.listen('convertorAfterMarkdownToHtmlConverted', html => htmlSanitizer(html, true));
    }

    /**
     * toMarkdown
     * Convert html to markdown
     * emit convertorAfterHtmlToMarkdownConverted
     * @api
     * @memberOf Convertor
     * @param {string} html html text
     * @returns {string} markdown text
     */
    toMarkdown(html) {
        const resultArray = [];
        let markdown = toMark(this._appendAttributeForBrIfNeed(html));
        markdown = this.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', markdown);

        tui.util.forEach(markdown.split('\n'), (line, index) => {
            const FIND_TABLE_RX = /^\|[^|]*\|/ig;
            const FIND_CODE_RX = /`[^`]*<br>[^`]*`/ig;

            if (!FIND_CODE_RX.test(line) && !FIND_TABLE_RX.test(line)) {
                line = line.replace(/<br>/ig, '<br>\n');
            }
            resultArray[index] = line;
        });

        return resultArray.join('\n');
    }

    _appendAttributeForBrIfNeed(html) {
        const FIND_BR_RX = /<br>/ig;
        const FIND_DOUBLE_BR_RX = /<br \/><br \/>/ig;
        const FIND_PASSING_AND_NORMAL_BR_RX = /<br data-tomark-pass \/><br \/>(.)/ig;
        const FIND_FIRST_TWO_BRS_RX = /([^>])<br data-tomark-pass \/><br data-tomark-pass \/>/g;

        html = html.replace(FIND_BR_RX, '<br />');

        html = html.replace(FIND_DOUBLE_BR_RX, '<br data-tomark-pass /><br data-tomark-pass />');

        const div = document.createElement('div');
        const $div = $(div);
        $div.html(html);
        $div.find('pre br,code br').each((index, node) => {
            if (node.hasAttribute('data-tomark-pass')) {
                node.removeAttribute('data-tomark-pass');
            }
        });

        html = $div.html().replace(/<br data-tomark-pass="">/ig, '<br data-tomark-pass />');
        html = html.replace(FIND_BR_RX, '<br />');

        html = html.replace(FIND_PASSING_AND_NORMAL_BR_RX, '<br data-tomark-pass /><br data-tomark-pass />$1');
        html = html.replace(FIND_FIRST_TWO_BRS_RX, '$1<br /><br />');

        return html;
    }

    /**
     * factory
     * Convertor factory
     * @api
     * @memberOf Convertor
     * @param {EventManager} eventManager eventmanager
     * @returns {Convertor}
     */
    static factory(eventManager) {
        return new Convertor(eventManager);
    }

    /**
     * Return markdown-it highlight renderer
     * @returns {markdownIt}
     */
    static getMarkdownHighlightRenderer() {
        return markdownitHighlight;
    }
}

/**
 * escape code from markdown-it
 * @param {string} html HTML string
 * @param {string} encode Boolean value of whether encode or not
 * @returns {string}
 */
function escape(html, encode) {
    return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
module.exports = Convertor;
