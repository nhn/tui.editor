/**
 * @fileoverview Implements wysiwyg p tag manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import matches from 'tui-code-snippet/domUtil/matches';

import domUtils from './utils/dom';

/**
 * Class WwPManager
 * @param {WysiwygEditor} wwe - wysiwygEditor instance
 * @ignore
 */
class WwPManager {
  constructor(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @type {string}
     */
    this.name = 'p';

    this._initEvent();
  }

  /**
   * Initialize event
   * @private
   */
  _initEvent() {
    this.eventManager.listen('wysiwygSetValueBefore', html => this._splitPtagContentLines(html));

    this.eventManager.listen('wysiwygSetValueAfter', () => {
      this._ensurePtagContentWrappedWithDiv();
      this._unwrapPtags();
    });
  }

  /**
   * Split multiple line content of p tags
   * @param {string} html html text
   * @returns {string} result
   * @private
   */
  _splitPtagContentLines(html) {
    if (html) {
      const wrapper = domUtils.createElementWith(`<div>${html}</div>`);

      domUtils.findAll(wrapper, 'p').forEach(para => {
        const content = para.innerHTML;
        const lines = content.split(/<br>/gi);
        const lastIndex = lines.length - 1;
        // cross browsing: old browser not has nextElementSibling attribute
        const nextElement = para.nextElementSibling || para.nextSibling;
        let splitedContent = '';

        splitedContent = lines.map((line, index) => {
          let result = '';

          if (index > 0 && index < lastIndex) {
            line = line ? line : '<br>';
          }

          if (line) {
            result = `<div>${line}</div>`;
          }

          return result;
        });

        // For paragraph, we add empty line
        if (nextElement && nextElement.nodeName === 'P') {
          splitedContent.push('<div><br></div>');
        }
        domUtils.replaceWith(para, splitedContent.join(''));
      });
      html = wrapper.innerHTML;
    }

    return html;
  }

  /**
   * Wrap new line inside P tag to DIV, and additional empty line added within too
   * @private
   */
  _ensurePtagContentWrappedWithDiv() {
    domUtils.findAll(this.wwe.getBody(), 'p').forEach(node => {
      if (!node.querySelectorAll('div').length) {
        domUtils.wrapInner(node, 'div');
      }

      if (this._findNextParagraph(node, 'p')) {
        domUtils.append(node, '<div><br></div>');
      }
    });
  }

  /**
   * Unwrap P tag
   * @private
   */
  _unwrapPtags() {
    domUtils.findAll(this.wwe.getBody(), 'div').forEach(node => {
      const parent = node.parentNode;

      if (parent.tagName === 'P') {
        domUtils.unwrap(parent);
      }
    });
  }

  _findNextParagraph(node, selector) {
    const { nextElementSibling } = node;

    if (selector) {
      return nextElementSibling && matches(nextElementSibling, selector)
        ? nextElementSibling
        : null;
    }

    return nextElementSibling;
  }
}

export default WwPManager;
