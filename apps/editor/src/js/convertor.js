/**
 * @fileoverview Convertor have responsible to convert markdown and html
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toMark from '@toast-ui/to-mark';
import { Parser, createRenderHTML } from '@toast-ui/toastmark';

import { getHTMLRenderConvertors } from './htmlRenderConvertors';
import domUtils from './utils/dom';

// This regular expression refere markdownIt.
// https://github.com/markdown-it/markdown-it/blob/master/lib/common/html_re.js
const attrName = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
const unquoted = '[^"\'=<>`\\x00-\\x20]+';
const singleQuoted = "'[^']*'";
const doubleQuoted = '"[^"]*"';
const attrValue = `(?:${unquoted}|${singleQuoted}|${doubleQuoted})`;
const attribute = `(?:\\s+${attrName}(?:\\s*=\\s*${attrValue})?)*\\s*`;
const openingTag = `(\\\\<|<)([A-Za-z][A-Za-z0-9\\-]*${attribute})(\\/?>)`;
const HTML_TAG_RX = new RegExp(openingTag, 'g');

/**
 * Class Convertor
 * @param {EventManager} em - EventManager instance
 * @ignore
 */
class Convertor {
  constructor(em, options = {}) {
    const {
      linkAttribute,
      customHTMLRenderer,
      extendedAutolinks,
      referenceDefinition,
      customParser
    } = options;

    this.mdReader = new Parser({
      extendedAutolinks,
      disallowedHtmlBlockTags: ['br'],
      referenceDefinition,
      disallowDeepHeading: true,
      customParser
    });

    this.renderHTML = createRenderHTML({
      gfm: true,
      convertors: getHTMLRenderConvertors(linkAttribute, customHTMLRenderer)
    });

    this.eventManager = em;
  }

  /**
   * _markdownToHtmlWithCodeHighlight
   * Convert markdown to html with Codehighlight
   * @param {string} markdown markdown text
   * @returns {string} html text
   * @private
   */
  _markdownToHtmlWithCodeHighlight(markdown) {
    return this.renderHTML(this.mdReader.parse(markdown));
  }

  /**
   * _markdownToHtml
   * Convert markdown to html
   * @param {string} markdown markdown text
   * @param {object} env environment sandbox for markdownit
   * @returns {string} html text
   * @private
   */
  _markdownToHtml(markdown) {
    markdown = markdown.replace(HTML_TAG_RX, (match, $1, $2, $3) =>
      match[0] !== '\\' ? `${$1}${$2} data-tomark-pass ${$3}` : match
    );

    return this.renderHTML(this.mdReader.parse(markdown));
  }

  /**
   * Remove BR's data-tomark-pass attribute text when br in code element
   * @param {string} renderedHTML Rendered HTML string from markdown editor
   * @returns {string}
   * @private
   */
  _removeBrToMarkPassAttributeInCode(renderedHTML) {
    const wrapper = domUtils.createElementWith(`<div>${renderedHTML}</div>`);

    domUtils.findAll(wrapper, 'code, pre').forEach(codeOrPre => {
      const codeEelement = codeOrPre;

      codeEelement.innerHTML = codeEelement.innerHTML.replace(
        /\sdata-tomark-pass\s(\/?)&gt;/g,
        '$1&gt;'
      );
    });

    renderedHTML = wrapper.innerHTML;

    return renderedHTML;
  }

  /**
   * toHTMLWithCodeHighlight
   * Convert markdown to html with Codehighlight
   * emit convertorAfterMarkdownToHtmlConverted
   * @param {string} markdown markdown text
   * @returns {string} html text
   */
  toHTMLWithCodeHighlight(markdown) {
    let html = this._markdownToHtmlWithCodeHighlight(markdown);

    html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);

    return html;
  }

  /**
   * toHTML
   * Convert markdown to html
   * emit convertorAfterMarkdownToHtmlConverted
   * @param {string} markdown markdown text
   * @returns {string} html text
   */
  toHTML(markdown) {
    let html = this._markdownToHtml(markdown);

    html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);
    html = this._removeBrToMarkPassAttributeInCode(html);

    return html;
  }

  initHtmlSanitizer(sanitizer) {
    this.eventManager.listen('convertorAfterMarkdownToHtmlConverted', html =>
      sanitizer(html, true)
    );
  }

  /**
   * toMarkdown
   * Convert html to markdown
   * emit convertorAfterHtmlToMarkdownConverted
   * @param {string} html html text
   * @param {object | null} toMarkOptions - toMark library options
   * @returns {string} markdown text
   */
  toMarkdown(html, toMarkOptions) {
    const resultArray = [];

    html = this.eventManager.emitReduce('convertorBeforeHtmlToMarkdownConverted', html);
    html = this._appendAttributeForLinkIfNeed(html);
    html = this._appendAttributeForBrIfNeed(html);

    let markdown = toMark(html, toMarkOptions);

    markdown = this.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', markdown);
    markdown = this._removeNewlinesBeforeAfterAndBlockElement(markdown);

    markdown.split('\n').forEach((line, index) => {
      const FIND_TABLE_RX = /^(<br>)+\||\|[^|]*\|/gi;
      const FIND_CODE_RX = /`[^`]*<br>[^`]*`/gi;
      const FIND_BRS_BEFORE_TABLE = /^(<br>)+\|/gi;

      if (FIND_TABLE_RX.test(line)) {
        line = line.replace(FIND_BRS_BEFORE_TABLE, match => match.replace(/<br>/gi, '<br>\n'));
      } else if (!FIND_CODE_RX.test(line)) {
        line = line.replace(/<br>/gi, '<br>\n');
      }
      resultArray[index] = line;
    });

    return resultArray.join('\n');
  }

  _removeNewlinesBeforeAfterAndBlockElement(markdown) {
    // Newlines('\n\n') are created on to-mark.
    const NEWLINES_BEFORE_BLOCK_RX = /<br>\n\n(#{1,6} .*|```|\||(\*+|-+|\d+\.) .*| *>[^\n]+.*)/g;
    const NEWLINES_AFTER_BLOCK_RX = /(#{1,6} .*|```|\|)\n\n<br>/g;

    markdown = markdown.replace(NEWLINES_BEFORE_BLOCK_RX, '<br>$1');
    markdown = markdown.replace(NEWLINES_AFTER_BLOCK_RX, '$1\n<br>');

    return markdown;
  }

  _appendAttributeForLinkIfNeed(html) {
    const LINK_RX = /!?\[.*\]\(<\s*a[^>]*>(.*?)<\s*\/\s*a>\)/gi;

    return html.replace(LINK_RX, match => match.replace(/<a /gi, '<a data-tomark-pass="" '));
  }

  _appendAttributeForBrIfNeed(html) {
    const FIND_BR_RX = /<br>/gi;
    const FIND_DOUBLE_BR_RX = /<br \/><br \/>/gi;
    const FIND_PASSING_AND_NORMAL_BR_RX = /<br data-tomark-pass \/><br \/>(.)/gi;
    const FIRST_TWO_BRS_BEFORE_RX = /([^>]|<\/a>|<\/code>|<\/span>|<\/b>|<\/i>|<\/s>|<img [^>]*>)/;
    const TWO_BRS_RX = /<br data-tomark-pass \/><br data-tomark-pass \/>/;
    const FIND_FIRST_TWO_BRS_RX = new RegExp(
      FIRST_TWO_BRS_BEFORE_RX.source + TWO_BRS_RX.source,
      'g'
    );
    const FIND_ATTRI_WITH_EMTPY_STR_RX = /<br data-tomark-pass="">/gi;

    html = html.replace(FIND_BR_RX, '<br />');

    html = html.replace(FIND_DOUBLE_BR_RX, '<br data-tomark-pass /><br data-tomark-pass />');
    html = html.replace(FIND_ATTRI_WITH_EMTPY_STR_RX, '<br data-tomark-pass />');

    html = html.replace(
      FIND_PASSING_AND_NORMAL_BR_RX,
      '<br data-tomark-pass /><br data-tomark-pass />$1'
    );
    html = html.replace(FIND_FIRST_TWO_BRS_RX, '$1<br /><br />');

    // Preserve <br> when there is only one empty line before or after a block element.
    html = html.replace(
      /(.)<br \/><br \/>(<h[1-6]>|<pre>|<table>|<ul>|<ol>|<blockquote>)/g,
      '$1<br /><br data-tomark-pass />$2'
    );
    html = html.replace(
      /(<\/h[1-6]>|<\/pre>|<\/table>|<\/ul>|<\/ol>|<\/blockquote>)<br \/>(.)/g,
      '$1<br data-tomark-pass />$2'
    );

    return html;
  }
}

export default Convertor;
