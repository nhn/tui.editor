/**
 * @fileoverview Convertor have responsible to convert markdown and html
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


var htmlSanitizer = require('./htmlSanitizer');

var markedCustomRenderer = require('./markedCustomRenderer');

var marked = window.marked,
    toMark = window.toMark,
    hljs = window.hljs;

/**
 * Convertor
 * @exports Convertor
 * @constructor
 * @class Convertor
 * @param {EventManager} em EventManager instance
 */
function Convertor(em) {
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
Convertor.prototype._markdownToHtmlWithCodeHighlight = function(markdown) {
    markdown = markdown.replace(/\\\|/g, ':ESCAPE_VERTICAL_BAR:');

    return marked(markdown, {
        renderer: markedCustomRenderer,
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        highlight: function(code, type) {
            return hljs.getLanguage(type) ? hljs.highlight(type, code).value : code;
        }
    }).replace(/:ESCAPE_VERTICAL_BAR:/g, '|');
};

/**
 * _markdownToHtml
 * Convert markdown to html
 * @private
 * @memberOf Convertor
 * @param {string} markdown markdown text
 * @returns {string} html text
 */
Convertor.prototype._markdownToHtml = function(markdown) {
    markdown = markdown.replace(/\\\|/g, ':ESCAPE_VERTICAL_BAR:');

    return marked(markdown, {
        renderer: markedCustomRenderer,
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false
    }).replace(/:ESCAPE_VERTICAL_BAR:/g, '|');
};

/**
 * toHTMLWithCodeHightlight
 * Convert markdown to html with Codehighlight
 * emit convertorAfterMarkdownToHtmlConverted
 * @api
 * @memberOf Convertor
 * @param {string} markdown markdown text
 * @returns {string} html text
 */
Convertor.prototype.toHTMLWithCodeHightlight = function(markdown) {
    var html = this._markdownToHtmlWithCodeHighlight(markdown);
    html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);

    return htmlSanitizer(html, true);
};

/**
 * toHTML
 * Convert markdown to html
 * emit convertorAfterMarkdownToHtmlConverted
 * @api
 * @memberOf Convertor
 * @param {string} markdown markdown text
 * @returns {string} html text
 */
Convertor.prototype.toHTML = function(markdown) {
    var html = this._markdownToHtml(markdown);
    html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);

    return htmlSanitizer(html, true);
};

/**
 * toMarkdown
 * Convert html to markdown
 * emit convertorAfterHtmlToMarkdownConverted
 * @api
 * @memberOf Convertor
 * @param {string} html html text
 * @returns {string} markdown text
 */
Convertor.prototype.toMarkdown = function(html) {
    var markdown = toMark(html);
    markdown = this.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', markdown);

    return markdown;
};

/**
 * factory
 * Convertor factory
 * @api
 * @memberOf Convertor
 * @param {EventManager} eventManager eventmanager
 * @returns {Convertor}
 */
Convertor.factory = function(eventManager) {
    return new Convertor(eventManager);
};

module.exports = Convertor;
