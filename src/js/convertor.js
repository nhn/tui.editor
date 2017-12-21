/**
 * @fileoverview Convertor have responsible to convert markdown and html
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';
import MarkdownIt from 'markdown-it';
import toMark from 'toMark';

import htmlSanitizer from './htmlSanitizer';
import taskList from './markdownItPlugins/markdownitTaskPlugin';
import codeBlock from './markdownItPlugins/markdownitCodeBlockPlugin';
import code from './markdownItPlugins/markdownitCodeRenderer';
import blockQuote from './markdownItPlugins/markdownitBlockQuoteRenderer';
import tableRenderer from './markdownItPlugins/markdownitTableRenderer';
import htmlBlock from './markdownItPlugins/markdownitHtmlBlockRenderer';
import codeBackticks from './markdownItPlugins/markdownitBackticksRenderer';
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
   * @returns {string} html text
   */
  _markdownToHtmlWithCodeHighlight(markdown) {
    markdown = markdown.replace(/<br>/ig, '<br data-tomark-pass>');
    // eslint-disable-next-line
        const onerrorStripeRegex = /(<img[^>]*)(onerror\s*=\s*[\"']?[^\"']*[\"']?)(.*)/i;
    while (onerrorStripeRegex.exec(markdown)) {
      markdown = markdown.replace(onerrorStripeRegex, '$1$3');
    }

    let renderedHTML = markdownitHighlight.render(markdown);
    renderedHTML = this._removeBrToMarkPassAttributeInCode(renderedHTML);

    return renderedHTML;
  }

  /**
   * _markdownToHtml
   * Convert markdown to html
   * @private
   * @memberof Convertor
   * @param {string} markdown markdown text
   * @returns {string} html text
   */
  _markdownToHtml(markdown) {
    markdown = markdown.replace(/<br>/ig, '<br data-tomark-pass>');
    // eslint-disable-next-line
        const onerrorStripeRegex = /(<img[^>]*)(onerror\s*=\s*[\"']?[^\"']*[\"']?)(.*)/i;
    while (onerrorStripeRegex.exec(markdown)) {
      markdown = markdown.replace(onerrorStripeRegex, '$1$3');
    }

    let renderedHTML = markdownit.render(markdown);
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

    $wrapperDiv.find('code, pre').each((i, codeOrPre) => {
      const $code = $(codeOrPre);
      $code.html($code.html().replace(/&lt;br data-tomark-pass&gt;/, '&lt;br&gt;'));
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

    return html;
  }

  initHtmlSanitizer() {
    this.eventManager.listen('convertorAfterMarkdownToHtmlConverted', html => htmlSanitizer(html, true));
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
    const FIRST_TWO_BRS_BEFORE_RX = /([^>]|<\/b>|<\/i>|<\/s>|<img [^>]*>)/;
    const TWO_BRS_RX = /<br data-tomark-pass \/><br data-tomark-pass \/>/;
    const FIND_FIRST_TWO_BRS_RX = new RegExp(FIRST_TWO_BRS_BEFORE_RX.source + TWO_BRS_RX.source, 'g');

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
   * get markdownit with code highlight
   * @returns {markdownit} - markdownit instance
   * @memberof Convertor
   * @static
   */
  static getMarkdownitHighlightRenderer() {
    return markdownitHighlight;
  }
}

export default Convertor;
