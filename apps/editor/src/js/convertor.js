/**
 * @fileoverview Convertor have responsible to convert markdown and html
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import MarkdownIt from 'markdown-it';
import toMark from '@toast-ui/to-mark';
import { Parser, GfmHtmlRenderer } from '@toast-ui/markdown-parser';

import htmlSanitizer from './htmlSanitizer';
import htmlBlock from './markdownItPlugins/markdownitHtmlBlockRenderer';
import { linkAttribute } from './markdownItPlugins/markdownitInlinePlugin';
import codeBlockManager from './codeBlockManager';
import domUtils from './domUtils';

// const markdownitHighlight = new MarkdownIt({
//   html: true,
//   breaks: true,
//   quotes: '“”‘’',
//   langPrefix: 'lang-',
//   highlight(codeText, type) {
//     return codeBlockManager.createCodeBlockHtml(type, codeText);
//   }
// });

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

class CustomRenderer extends GfmHtmlRenderer {
  softbreak(node) {
    const isPrevNodeHTML = node.prev && node.prev.type === 'htmlInline';

    if (isPrevNodeHTML && /<br ?\/?>/.test(node.prev.literal)) {
      this.lit('\n');
    } else {
      this.lit('<br>\n');
    }
  }

  item(node, entering) {
    const attrs = this.attrs(node);

    if (entering) {
      if (node.listData.task) {
        const classNames = ['task-list-item'];

        if (node.listData.checked) {
          classNames.push('checked');
        }
        attrs.push(['class', classNames.join(' ')], ['data-te-task', '']);
      }
      this.tag('li', attrs);
    } else {
      this.tag('/li');
      this.cr();
    }
  }

  code(node) {
    const attrs = this.attrs(node);

    attrs.push(['data-backticks', node.tickCount]);
    this.tag('code', attrs);
    this.out(node.literal);
    this.tag('/code');
  }

  codeBlock(node) {
    const infoWords = node.info ? node.info.split(/\s+/) : [];
    const codeAttrs = [];

    if (node.fenceLength > 3) {
      codeAttrs.push(['data-backticks', node.fenceLength]);
    }
    if (infoWords.length > 0 && infoWords[0].length > 0) {
      codeAttrs.push(['class', `language-${this.esc(infoWords[0])}`]);
    }
    this.cr();
    this.tag('pre', this.attrs(node));
    this.tag('code', codeAttrs);
    this.out(node.literal);
    this.tag('/code');
    this.tag('/pre');
    this.cr();
  }
}

const reader = new Parser();
const writer = new CustomRenderer();

/**
 * Class Convertor
 * @param {EventManager} em - EventManager instance
 * @ignore
 */
class Convertor {
  constructor(em) {
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
    markdown = this._replaceImgAttrToDataProp(markdown);

    return writer.render(reader.parse(markdown));
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
    markdown = this._replaceImgAttrToDataProp(markdown);

    return writer.render(reader.parse(markdown));
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
   * toHTMLWithCodeHightlight
   * Convert markdown to html with Codehighlight
   * emit convertorAfterMarkdownToHtmlConverted
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
    this.eventManager.listen('convertorAfterMarkdownToHtmlConverted', html =>
      htmlSanitizer(html, true)
    );
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

    // markdownitHighlight.use(linkAttribute, setAttributeToToken);
    // markdownit.use(linkAttribute, setAttributeToToken);
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

  /**
   * get markdownit with code highlight
   * @returns {markdownit} - markdownit instance
   * @static
   */
  static getMarkdownitHighlightRenderer() {
    // return markdownitHighlight;
  }

  /**
   * get markdownit
   * @returns {markdownit} - markdownit instance
   * @static
   */
  static getMarkdownitRenderer() {
    // return markdownit;
  }
}

export default Convertor;
