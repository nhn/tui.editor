/**
 * @fileoverview Convertor have responsible to convert markdown and html
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


var htmlSanitizer = require('./htmlSanitizer');
var taskList = require('./markdownItPlugins/markdownitTaskPlugin');
var codeBlock = require('./markdownItPlugins/markdownitCodeBlockPlugin');
var tableRenderer = require('./markdownItPlugins/markdownitTableRenderer');

var markdownIt = window.markdownit,
    toMark = window.toMark,
    hljs = window.hljs;

var markdownitHighlight = markdownIt({
    html: true,
    breaks: true,
    quotes: '“”‘’',
    langPrefix: 'lang-',
    highlight: function(code, type) {
        return hljs.getLanguage(type) ? hljs.highlight(type, code).value : code;
    }
});
var markdownit = markdownIt({
    html: true,
    breaks: true,
    quotes: '“”‘’',
    langPrefix: 'lang-'
});

markdownitHighlight.block.ruler.at('table', tableRenderer, ['paragraph', 'reference']);
markdownitHighlight.use(taskList);
markdownitHighlight.use(codeBlock);

markdownit.block.ruler.at('table', tableRenderer, ['paragraph', 'reference']);
markdownit.use(taskList);
markdownit.use(codeBlock);

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
    return markdownitHighlight.render(markdown);
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
    return markdownit.render(markdown);
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

/**
 * Return markdown-it highlight renderer
 * @returns {markdownIt}
 */
Convertor.getMarkdownHighlightRenderer = function() {
    return markdownitHighlight;
};
module.exports = Convertor;
