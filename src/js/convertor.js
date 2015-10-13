/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var markedCustomRenderer = require('./markedCustomRenderer');

var marked = window.marked,
    toMark = window.toMark,
    hljs = window.hljs;

/**
 * Convertor
 * @exports Convertor
 * @extends {}
 * @constructor
 * @class
 */

function Convertor(em) {
    this.eventManager = em;
}

Convertor.prototype._markdownToHtmlWithCodeHighlight = function(markdown) {
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
    });
};

Convertor.prototype._markdownToHtml = function(markdown) {
    return marked(markdown, {
        renderer: markedCustomRenderer,
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false
    });
};

Convertor.prototype.toHTMLWithCodeHightlight = function(markdown) {
    var html = this._markdownToHtmlWithCodeHighlight(markdown);
    html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);
    return html;
};

Convertor.prototype.toHTML = function(markdown) {
    var html =  this._markdownToHtml(markdown);
    html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);
    return html;
};

Convertor.prototype.toMarkdown = function(html) {
    var markdown = toMark(html);
    markdown = this.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', markdown);
    return markdown;
};

Convertor.factory = function(eventManager) {
    return new Convertor(eventManager);
};

module.exports = Convertor;
