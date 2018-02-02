/**
 * @fileoverview Implements wysiwyg code block manager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import domUtils from './domUtils';

const tagEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

const FIND_ZWS_RX = /\u200B/g;
const CODEBLOCK_ATTR_NAME = 'data-te-codeblock';

/**
 * Class WwCodeBlockManager
 */
class WwCodeBlockManager {
  /**
   * Creates an instance of WwCodeBlockManager.
   * @param {WysiwygEditor} wwe - wysiwygEditor instance
   * @memberof WwCodeBlockManager
   */
  constructor(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @memberof WwCodeBlockManager#
     * @type {string}
     */
    this.name = 'codeblock';

    this._init();
  }
  /**
   * _init
   * Initialize
   * @memberof WwCodeBlockManager
   * @private
   */
  _init() {
    this._initKeyHandler();
    this._initEvent();
  }

  /**
   * _initKeyHandler
   * Initialize key event handler
   * @memberof WwCodeBlockManager
   * @private
   */
  _initKeyHandler() {
    this._onKeyEventHandler = this._removeCodeblockIfNeed.bind(this);
    this.wwe.addKeyEventHandler('BACK_SPACE', this._onKeyEventHandler);
  }

  /**
   * _initEvent
   * Initialize eventmanager event
   * @memberof WwCodeBlockManager
   * @private
   */
  _initEvent() {
    const self = this;

    this.eventManager.listen('wysiwygSetValueAfter.codeblock', () => {
      self.splitCodeblockToEachLine();
    });

    this.eventManager.listen('wysiwygProcessHTMLText.codeblock', html => self._mergeCodeblockEachlinesFromHTMLText(html));
  }

  /**
   * Convert copied nodes to code block if need
   * @memberof WwCodeBlockManager
   * @param {Array.<Node>} nodes Node array
   * @returns {DocumentFragment}
   */
  prepareToPasteOnCodeblock(nodes) {
    const range = this.wwe.getEditor().getSelection().cloneRange();
    const frag = this.wwe.getEditor().getDocument().createDocumentFragment();

    if (nodes.length === 1 && this._isCodeBlock(nodes[0])) {
      frag.appendChild(this._copyCodeblockTypeFromRangeCodeblock(nodes.shift(), range));
    } else {
      frag.appendChild(this._copyCodeblockTypeFromRangeCodeblock(this.convertToCodeblock(nodes), range));
    }

    return frag;
  }

  /**
   * Wrap nodes into code block
   * @memberof WwCodeBlockManager
   * @param {Array.<Node>} nodes Node array
   * @returns {HTMLElement} Code block element
   */
  convertToCodeblock(nodes) {
    const $codeblock = $('<pre />');
    const self = this;
    let node = nodes.shift();

    while (util.isTruthy(node)) {
      $codeblock.append(self._makeCodeBlockLineHtml(util.isString(node) ? node : node.textContent));
      node = nodes.shift();
    }

    $codeblock.attr(CODEBLOCK_ATTR_NAME, '');

    return $codeblock[0];
  }

  /**
   * Copy content with code block style from code block selection
   * @memberof WwCodeBlockManager
   * @param {HTMLElement} element Copied element
   * @param {Range} range Range object
   * @returns {HTMLElement}
   * @private
   */
  _copyCodeblockTypeFromRangeCodeblock(element, range) {
    const blockNode = domUtils.getParentUntil(range.commonAncestorContainer, this.wwe.get$Body()[0]);

    if (domUtils.getNodeName(blockNode) === 'PRE') {
      const attrs = $(blockNode).prop('attributes');

      util.forEach(attrs, attr => {
        $(element).attr(attr.name, attr.value);
      });
    }

    return element;
  }

  /**
   * Merge code block lines
   * @memberof WwCodeBlockManager
   * @param {string} html HTML string
   * @returns {string}
   * @private
   */
  _mergeCodeblockEachlinesFromHTMLText(html) {
    html = html.replace(/<pre( .*?)?>(.*?)<\/pre>/g, (match, codeAttr, code) => {
      code = code.replace(/<br \/>/g, '\n');
      code = code.replace(/<div ?(.*?)>/g, '');
      code = code.replace(/\n$/, '');

      return `<pre><code${(codeAttr || '')}>${code}</code></pre>`;
    });

    return html;
  }

  /**
   * Split code block to lines
   * @memberof WwCodeBlockManager
   * @param {HTMLElement} node root node to find pre
   * @private
   */
  splitCodeblockToEachLine(node) {
    const self = this;

    if (!node) {
      node = this.wwe.get$Body();
    }

    $(node).find('pre').each((index, pre) => {
      const $pre = $(pre);
      const lang = $pre.find('code').attr('data-language');
      let textLines;

      // if this pre can have lines
      if ($pre.children().length > 1) {
        textLines = [];

        $pre.children().each((idx, childNode) => {
          if ((childNode.nodeName === 'DIV' || childNode.nodeName === 'P')
                        && !$(childNode).find('br').length
          ) {
            $(childNode).append('<br>');
          }
        });
      }

      $pre.find('br').replaceWith('\n');
      textLines = $pre.text().replace(/\s+$/, '').split(/\n/g);

      if (lang) {
        $pre.attr('data-language', lang);
        $pre.addClass(`lang-${lang}`);
      }

      $pre.empty();

      util.forEach(textLines, line => {
        $pre.append(self._makeCodeBlockLineHtml(line));
      });

      $pre.attr(CODEBLOCK_ATTR_NAME, '');
    });
  }

  /**
   * Make code HTML text
   * @memberof WwCodeBlockManager
   * @param {string} lineContent Content text
   * @returns {string}
   * @private
   */
  _makeCodeBlockLineHtml(lineContent) {
    if (!lineContent) {
      lineContent = '<br>';
    } else {
      lineContent = sanitizeHtmlCode(lineContent);
    }

    return `<div>${lineContent}</div>`;
  }

  /**
   * Remove codeblock if need
   * @memberof WwCodeBlockManager
   * @param {Event} ev Event object
   * @param {Range} range Range object
   * @returns {boolean}
   * @private
   */
  _removeCodeblockIfNeed(ev, range) {
    const self = this;

    if (!this.isInCodeBlock(range)) {
      return true;
    }

    const pre = $(range.startContainer).closest('pre');
    const $div = $(pre).find('div').eq(0);
    const codeContent = $div.text().replace(FIND_ZWS_RX, '');

    // only one code
    if ((range.startOffset === 0 || codeContent.length === 0)
            && $(pre).find('div').length <= 1
    ) {
      this.wwe.getEditor().modifyBlocks(() => {
        const newFrag = self.wwe.getEditor().getDocument().createDocumentFragment();
        let content;

        if (codeContent.length === 0) {
          content = '<br>';
        } else {
          content = $div.html().replace(FIND_ZWS_RX, '');
        }

        $(newFrag).append($(`<div>${content}</div>`));

        return newFrag;
      });

      return false;
    }

    return true;
  }

  /**
   * Return boolean value of whether current range is in the code block
   * @memberof WwCodeBlockManager
   * @param {Range} range Range object
   * @returns {boolean}
   */
  isInCodeBlock(range) {
    let target;

    if (range.collapsed) {
      target = range.startContainer;
    } else {
      target = range.commonAncestorContainer;
    }

    return this._isCodeBlock(target);
  }

  /**
   * Verify given element is code block
   * @memberof WwCodeBlockManager
   * @param {HTMLElement} element Element
   * @returns {boolean}
   * @private
   */
  _isCodeBlock(element) {
    return !!$(element).closest('pre').length;
  }

  /**
   * Destroy.
   */
  destroy() {
    this.eventManager.removeEventHandler('wysiwygSetValueAfter.codeblock');
    this.eventManager.removeEventHandler('wysiwygProcessHTMLText.codeblock');
    this.wwe.removeKeyEventHandler('BACK_SPACE', this._onKeyEventHandler);
  }
}

/**
 * Sanitize HTML code
 * @param {string} code code string
 * @returns {string}
 * @ignore
 */
function sanitizeHtmlCode(code) {
  return code.replace(/[<>&]/g, tag => tagEntities[tag] || tag);
}

export default WwCodeBlockManager;
