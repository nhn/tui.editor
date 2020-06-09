/**
 * @fileoverview Implements wysiwyg code block manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import forEachOwnProperties from 'tui-code-snippet/collection/forEachOwnProperties';
import toArray from 'tui-code-snippet/collection/toArray';
import isTruthy from 'tui-code-snippet/type/isTruthy';
import browser from 'tui-code-snippet/browser/browser';
import addClass from 'tui-code-snippet/domUtil/addClass';

import domUtils from './utils/dom';

const isIE10 = browser.msie && browser.version === 10;
const brString = isIE10 ? '' : '<br>';

const tagEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

const FIND_ZWS_RX = /\u200B/g;
const CODEBLOCK_ATTR_NAME = 'data-te-codeblock';

/**
 * Class WwCodeBlockManager
 * @param {WysiwygEditor} wwe - wysiwygEditor instance
 * @ignore
 */
class WwCodeBlockManager {
  constructor(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @type {string}
     */
    this.name = 'codeblock';

    this._init();
  }

  /**
   * Initialize
   * @private
   */
  _init() {
    this._initKeyHandler();
    this._initEvent();
  }

  /**
   * Initialize key event handler
   * @private
   */
  _initKeyHandler() {
    this._keyEventHandlers = {
      BACK_SPACE: this._onBackspaceKeyEventHandler.bind(this),
      ENTER: (ev, range) => {
        if (!this.wwe.isInTable(range) && this.wwe.getEditor().hasFormat('CODE')) {
          this.wwe.defer(() => {
            const { startContainer } = this.wwe.getRange();
            const codeNode = this._getCodeNode(startContainer);

            if (codeNode && !domUtils.getTextLength(codeNode)) {
              codeNode.parentNode.removeChild(codeNode);
            }
          });
        }
      }
    };

    forEachOwnProperties(this._keyEventHandlers, (handler, key) =>
      this.wwe.addKeyEventHandler(key, handler)
    );
  }

  _getCodeNode(node) {
    let result;

    if (node.nodeName === 'CODE') {
      result = node;
    } else if (node.parentNode.nodeName === 'CODE') {
      result = node.parentNode;
    }

    return result;
  }

  /**
   * Initialize eventmanager event
   * @private
   */
  _initEvent() {
    this.eventManager.listen('wysiwygSetValueAfter.codeblock', () => {
      this.modifyCodeBlockForWysiwyg();
    });

    this.eventManager.listen('wysiwygProcessHTMLText.codeblock', html =>
      this._changePreToPreCode(html)
    );
  }

  /**
   * Prepare nodes for pasting to code block
   * @param {Array.<Node>} nodes Node array
   * @returns {DocumentFragment}
   */
  prepareToPasteOnCodeblock(nodes) {
    const frag = this.wwe
      .getEditor()
      .getDocument()
      .createDocumentFragment();
    let text = this.convertNodesToText(nodes);

    text = text.replace(/\n$/, '');
    frag.appendChild(document.createTextNode(text));

    return frag;
  }

  /**
   * Convert nodes to text for pasting to code block
   * @param {Array.<Node>} nodes Node array
   * @returns {string} coverted string
   */
  convertNodesToText(nodes) {
    let str = '';
    let node = nodes.shift();

    while (isTruthy(node)) {
      const { childNodes } = node;

      if (childNodes && domUtils.isBlockNode(node)) {
        str += this.convertNodesToText(toArray(node.childNodes));
      } else if (node.nodeName === 'BR') {
        str += '\n';
      } else {
        str += node.textContent;
      }
      node = nodes.shift();
    }

    return str;
  }

  /**
   * Copy content with code block style from code block selection
   * @param {HTMLElement} element Copied element
   * @param {Range} range Range object
   * @returns {HTMLElement}
   * @private
   */
  _copyCodeblockTypeFromRangeCodeblock(element, range) {
    const blockNode = domUtils.getParentUntil(range.commonAncestorContainer, this.wwe.getBody());

    if (domUtils.getNodeName(blockNode) === 'PRE') {
      const attrs = blockNode.attributes;

      forEachOwnProperties(attrs, attr => {
        element.setAttribute(attr.name, attr.value);
      });
    }

    return element;
  }

  /**
   * Change pre tag to pre and code
   * @param {string} html HTML string
   * @returns {string}
   * @private
   */
  _changePreToPreCode(html) {
    return html.replace(
      /<pre( .*?)?>((.|\n)*?)<\/pre>/g,
      (match, codeAttr, code) => `<pre><code${codeAttr || ''}>${code}</code></pre>`
    );
  }

  /**
   * Modify Code Block for Wysiwyg
   * @param {HTMLElement} node root node to find pre
   */
  modifyCodeBlockForWysiwyg(node) {
    if (!node) {
      node = this.wwe.getBody();
    }

    domUtils.findAll(node, 'pre').forEach(pre => {
      const codeTag = pre.querySelector('code');
      let lang, numberOfBackticks;

      if (codeTag) {
        lang = codeTag.getAttribute('data-language');
        numberOfBackticks = codeTag.getAttribute('data-backticks');
      }

      // if this pre can have lines
      if (pre.children.length > 1) {
        toArray(pre.children).forEach(childNode => {
          if (
            (childNode.nodeName === 'DIV' || childNode.nodeName === 'P') &&
            !childNode.querySelectorAll('br').length
          ) {
            childNode.innerHTML += `${childNode.innerHTML}\n`;
          }
        });
      }

      const brs = pre.querySelectorAll('br');

      if (brs.length) {
        domUtils.replaceWith(brs, '\n');
      }

      const resultText = pre.textContent.replace(/\s+$/, '');

      domUtils.empty(pre);
      pre.innerHTML = resultText ? sanitizeHtmlCode(resultText) : brString;

      if (lang) {
        pre.setAttribute('data-language', lang);
        addClass(pre, `lang-${lang}`);
      }
      if (numberOfBackticks) {
        pre.setAttribute('data-backticks', numberOfBackticks);
      }
      pre.setAttribute(CODEBLOCK_ATTR_NAME, '');
    });
  }

  /**
   * Remove codeblock of first line when press backspace in first line
   * @param {Event} ev Event object
   * @param {Range} range Range object
   * @returns {boolean}
   * @private
   */
  _onBackspaceKeyEventHandler(ev, range) {
    let isNeedNext = true;
    const sq = this.wwe.getEditor();
    const { commonAncestorContainer: container } = range;

    if (this._isCodeBlockFirstLine(range) && !this._isFrontCodeblock(range)) {
      this._removeCodeblockFirstLine(container);
      range.collapse(true);
      isNeedNext = false;
    } else if (
      range.collapsed &&
      this._isEmptyLine(container) &&
      this._isBetweenSameCodeblocks(container)
    ) {
      const { previousSibling, nextSibling } = container;
      const prevTextLength = previousSibling.textContent.length;

      sq.saveUndoState(range);

      container.parentNode.removeChild(container);
      this._mergeCodeblocks(previousSibling, nextSibling);

      range.setStart(previousSibling.childNodes[0], prevTextLength);
      range.collapse(true);
      isNeedNext = false;
    }

    if (!isNeedNext) {
      sq.setSelection(range);
      ev.preventDefault();
    }

    return isNeedNext;
  }

  /**
   * Check node is empty line
   * @param {Node} node node
   * @returns {boolean}
   * @private
   */
  _isEmptyLine(node) {
    const { nodeName, childNodes } = node;
    const isEmpty = isIE10
      ? node.textContent === ''
      : childNodes.length === 1 && childNodes[0].nodeName === 'BR';

    return nodeName === 'DIV' && isEmpty;
  }

  /**
   * Check whether node is between same codeblocks
   * @param {Node} node Node
   * @returns {boolean}
   * @private
   */
  _isBetweenSameCodeblocks(node) {
    const { previousSibling, nextSibling } = node;

    return (
      domUtils.getNodeName(previousSibling) === 'PRE' &&
      domUtils.getNodeName(nextSibling) === 'PRE' &&
      previousSibling.getAttribute('data-language') === nextSibling.getAttribute('data-language')
    );
  }

  _mergeCodeblocks(frontCodeblock, backCodeblock) {
    const postText = backCodeblock.textContent;

    frontCodeblock.childNodes[0].textContent += `\n${postText}`;
    backCodeblock.parentNode.removeChild(backCodeblock);
  }

  /**
   * Check whether range is first line of code block
   * @param {Range} range Range object
   * @returns {boolean}
   * @private
   */
  _isCodeBlockFirstLine(range) {
    return this.isInCodeBlock(range) && range.collapsed && range.startOffset === 0;
  }

  /**
   * Check whether front block of range is code block
   * @param {Range} range Range object
   * @returns {boolean}
   * @private
   */
  _isFrontCodeblock(range) {
    const block = domUtils.getParentUntil(range.startContainer, this.wwe.getEditor().getRoot());
    const { previousSibling } = block;

    return previousSibling && previousSibling.nodeName === 'PRE';
  }

  /**
   * Remove codeblock first line of codeblock
   * @param {Node} node Pre Node
   * @private
   */
  _removeCodeblockFirstLine(node) {
    const sq = this.wwe.getEditor();
    const preNode = node.nodeName === 'PRE' ? node : node.parentNode;
    const codeContent = preNode.textContent.replace(FIND_ZWS_RX, '');

    sq.modifyBlocks(() => {
      const newFrag = sq.getDocument().createDocumentFragment();
      const strArray = codeContent.split('\n');

      const firstDiv = document.createElement('div');
      const firstLine = strArray.shift();

      firstDiv.innerHTML = `${sanitizeHtmlCode(firstLine)}${brString}`;
      newFrag.appendChild(firstDiv);

      if (strArray.length) {
        const newPreNode = preNode.cloneNode();

        newPreNode.textContent = strArray.join('\n');
        newFrag.appendChild(newPreNode);
      }

      return newFrag;
    });
  }

  /**
   * Return boolean value of whether current range is in the code block
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

    return !!domUtils.closest(target, 'pre');
  }

  /**
   * Destroy
   */
  destroy() {
    this.eventManager.removeEventHandler('wysiwygSetValueAfter.codeblock');
    this.eventManager.removeEventHandler('wysiwygProcessHTMLText.codeblock');

    forEachOwnProperties(this._keyEventHandlers, (handler, key) =>
      this.wwe.removeKeyEventHandler(key, handler)
    );
  }
}

/**
 * Sanitize HTML code
 * @param {string} code code string
 * @returns {string}
 * @ignore
 */
function sanitizeHtmlCode(code) {
  return code ? code.replace(/[<>&]/g, tag => tagEntities[tag] || tag) : '';
}

export default WwCodeBlockManager;
