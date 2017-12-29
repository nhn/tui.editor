/**
 * @fileoverview Implements wysiwyg p tag manager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

/**
 * Class WwPManager
 */
class WwPManager {
  /**
   * Creates an instance of WwPManager.
   * @param {WysiwygEditor} wwe - wysiwygEditor instance
   * @memberof WwPManager
   */
  constructor(wwe) {
    this.wwe = wwe;
    this.eventManager = wwe.eventManager;

    /**
     * Name property
     * @memberof WwPManager#
     * @type {string}
     */
    this.name = 'p';

    this._initEvent();
  }

  /**
   * _initEvent
   * Initialize event
   * @memberof WwPManager
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
      const $wrapper = $('<div />');

      $wrapper.html(html);
      $wrapper.find('p').each((pIndex, para) => {
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

        $(para).replaceWith($(splitedContent.join('')));
      });
      html = $wrapper.html();
    }

    return html;
  }

  /**
   * _ensurePtagContentWrappedWithDiv
   * Wrap new line inside P tag to DIV, and additional empty line added within too
   * @memberof WwPManager
   * @private
   */
  _ensurePtagContentWrappedWithDiv() {
    this.wwe.get$Body().find('p').each((index, node) => {
      if ($(node).find('div').length <= 0) {
        $(node).wrapInner('<div />');
      }

      if ($(node).next().is('p')) {
        $(node).append('<div><br></div>');
      }
    });
  }

  /**
   * _unwrapPtags
   * Unwrap P tag
   * @memberof WwPManager
   * @private
   */
  _unwrapPtags() {
    this.wwe.get$Body().find('div').each((index, node) => {
      if ($(node).parent().is('p')) {
        $(node).unwrap();
      }
    });
  }
}

export default WwPManager;
