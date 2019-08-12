/**
 * @fileoverview Convertor have responsible to convert markdown and html
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';
import MarkdownIt from 'markdown-it';
import toMark from 'to-mark';

import htmlSanitizer from './htmlSanitizer';
import taskList from './markdownItPlugins/markdownitTaskPlugin';
import codeBlock from './markdownItPlugins/markdownitCodeBlockPlugin';
import code from './markdownItPlugins/markdownitCodeRenderer';
import blockQuote from './markdownItPlugins/markdownitBlockQuoteRenderer';
import tableRenderer from './markdownItPlugins/markdownitTableRenderer';
import htmlBlock from './markdownItPlugins/markdownitHtmlBlockRenderer';
import codeBackticks from './markdownItPlugins/markdownitBackticksRenderer';
import {linkAttribute} from './markdownItPlugins/markdownitInlinePlugin';
import codeBlockManager from './codeBlockManager';

const markdownitHighlight = new MarkdownIt({
  html: true,
  breaks: true,
  quotes: '“”‘’',
  langPrefix: 'lang-',
  highlight(codeText, type) {
    return codeBlockManager.createCodeBlockHtml(type, codeText);
  }
});
const markdownit = new MarkdownIt({
  html: true,
  breaks: true,
  quotes: '“”‘’',
  langPrefix: 'lang-'
});

// markdownitHighlight
markdownitHighlight.block.ruler.at('code', code);
markdownitHighlight.block.ruler.at('table', tableRenderer, {
  alt: ['paragraph', 'reference']
});
markdownitHighlight.block.ruler.at('blockquote', blockQuote, {
  alt: ['paragraph', 'reference', 'blockquote', 'list']
});
markdownitHighlight.block.ruler.at('html_block', htmlBlock, {
  alt: ['paragraph', 'reference', 'blockquote']
});
markdownitHighlight.inline.ruler.at('backticks', codeBackticks);
markdownitHighlight.use(taskList);
markdownitHighlight.use(codeBlock);

markdownitHighlight.renderer.rules.softbreak = (tokens, idx, options) => {
  if (!options.breaks) {
    return '\n';
  }

  const prevToken = tokens[idx - 1];

  if (prevToken && prevToken.type === 'html_inline' &&
    prevToken.content === '<br>') {
    return '';
  }

  return options.xhtmlOut ? '<br />\n' : '<br>\n';
};

// markdownit
markdownit.block.ruler.at('code', code);
markdownit.block.ruler.at('table', tableRenderer, {
  alt: ['paragraph', 'reference']
});
markdownit.block.ruler.at('blockquote', blockQuote, {
  alt: ['paragraph', 'reference', 'blockquote', 'list']
});
markdownit.block.ruler.at('html_block', htmlBlock, {
  alt: ['paragraph', 'reference', 'blockquote']
});
markdownit.inline.ruler.at('backticks', codeBackticks);
markdownit.use(taskList);
markdownit.use(codeBlock);

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
 */
class Convertor {
  /**
   * Convertor constructor
   * @param {EventManager} em - EventManager instance
   */
  constructor(em) {
    this.eventManager = em;
  }

  /**
   * _markdownToHtmlWithCodeHighlight
   * Convert markdown to html with Codehighlight
   * @private
   * @memberof Convertor
   * @param {string} markdown markdown text
   * @param {object} env environment sandbox for markdownit
   * @returns {string} html text
   */
  _markdownToHtmlWithCodeHighlight(markdown, env) {
    markdown = this._replaceImgAttrToDataProp(markdown);

    return markdownitHighlight.render(markdown, env);
  }

  /**
   * _markdownToHtml
   * Convert markdown to html
   * @private
   * @memberof Convertor
   * @param {string} markdown markdown text
   * @param {object} env environment sandbox for markdownit
   * @returns {string} html text
   */
  _markdownToHtml(markdown, env) {
    markdown = markdown.replace(HTML_TAG_RX, (match, $1, $2, $3) => {
      return match[0] !== '\\' ? `${$1}${$2} data-tomark-pass ${$3}` : match;
    });

    markdown = this._replaceImgAttrToDataProp(markdown);

    return markdownit.render(markdown, env);
  }

  /**
   * Replace 'onerror' attribute of img tag to data property string
   * @param {string} markdown markdown text
   * @returns {string} replaced markdown text
   * @private
   */
  _replaceImgAttrToDataProp(markdown) {
    const onerrorStripeRegex = /(<img[^>]*)(onerror\s*=\s*[\\"']?[^\\"']*[\\"']?)(.*)/i;

    while (onerrorStripeRegex.exec(markdown)) {
      markdown = markdown.replace(onerrorStripeRegex, '$1$3');
    }

    return markdown;
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

    $wrapperDiv.find('code, pre').each((i, codeOrPre) => {
      const $code = $(codeOrPre);
      $code.html($code.html().replace(/ data-tomark-pass &gt;/g, '&gt;'));
    });

    renderedHTML = $wrapperDiv.html();

    return renderedHTML;
  }

  /**
   * toHTMLWithCodeHightlight
   * Convert markdown to html with Codehighlight
   * emit convertorAfterMarkdownToHtmlConverted
   * @memberof Convertor
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
   * @memberof Convertor
   * @param {string} markdown markdown text
   * @returns {string} html text
   */
  toHTML(markdown) {
    let html = this._markdownToHtml(markdown);

    html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);
    html = this._removeBrToMarkPassAttributeInCode(html);

    return html;
  }

  initHtmlSanitizer() {
    this.eventManager.listen('convertorAfterMarkdownToHtmlConverted', html => htmlSanitizer(html, true));
  }

  /**
   * set link attribute to markdownitHighlight, markdownit
   * using linkAttribute of markdownItInlinePlugin
   * @param {object} attr markdown text
   */
  setLinkAttribute(attr) {
    const keys = Object.keys(attr);
    const setAttributeToToken = (tokens, idx) => {
      keys.forEach(key => {
        tokens[idx].attrPush([key, attr[key]]);
      });
    };

    markdownitHighlight.use(linkAttribute, setAttributeToToken);
    markdownit.use(linkAttribute, setAttributeToToken);
  }

  /**
   * toMarkdown
   * Convert html to markdown
   * emit convertorAfterHtmlToMarkdownConverted
   * @memberof Convertor
   * @param {string} html html text
   * @param {object | null} toMarkOptions - toMark library options
   * @returns {string} markdown text
   */
  toMarkdown(html, toMarkOptions) {
    const resultArray = [];

    html = this.eventManager.emitReduce('convertorBeforeHtmlToMarkdownConverted', html);

    let markdown = toMark(this._appendAttributeForBrIfNeed(html), toMarkOptions);

    markdown = this.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', markdown);

    util.forEach(markdown.split('\n'), (line, index) => {
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
    const FIRST_TWO_BRS_BEFORE_RX = /([^>]|<\/a>|<\/code>|<\/span>|<\/b>|<\/i>|<\/s>|<img [^>]*>)/;
    const TWO_BRS_RX = /<br data-tomark-pass \/><br data-tomark-pass \/>/;
    const FIND_FIRST_TWO_BRS_RX = new RegExp(FIRST_TWO_BRS_BEFORE_RX.source + TWO_BRS_RX.source, 'g');
    const FIND_ATTRI_WITH_EMTPY_STR_RX = /<br data-tomark-pass="">/ig;

    html = html.replace(FIND_BR_RX, '<br />');
    html = html.replace(FIND_DOUBLE_BR_RX, '<br data-tomark-pass /><br data-tomark-pass />');
    html = html.replace(FIND_ATTRI_WITH_EMTPY_STR_RX, '<br data-tomark-pass />');

    html = html.replace(FIND_PASSING_AND_NORMAL_BR_RX, '<br data-tomark-pass /><br data-tomark-pass />$1');
    html = html.replace(FIND_FIRST_TWO_BRS_RX, '$1<br /><br />');

    return html;
  }

  /**
   * get markdownit with code highlight
   * @returns {markdownit} - markdownit instance
   * @memberof Convertor
   * @static
   */
  static getMarkdownitHighlightRenderer() {
    return markdownitHighlight;
  }

  /**
   * get markdownit
   * @returns {markdownit} - markdownit instance
   * @memberof Convertor
   * @static
   */
  static getMarkdownitRenderer() {
    return markdownit;
  }
}

export default Convertor;
