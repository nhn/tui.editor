/**
 * @fileoverview Implements preview
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import css from 'tui-code-snippet/domUtil/css';
import domUtils from './domUtils';

/**
 * Class Preview
 * @param {HTMLElement} el - Container element for preview
 * @param {EventManager} eventManager -  Event manager instance
 * @param {Convertor} convertor - Convertor instance
 * @param {boolean} isViewer - whether viewer mode or not
 * @param {Number} delayTime - lazyRunner delay time
 * @ignore
 */
class Preview {
  constructor(el, eventManager, convertor, isViewer) {
    this.eventManager = eventManager;
    this.convertor = convertor;
    this.el = el;
    this.isViewer = !!isViewer;

    this._initContentSection();
  }

  /**
   * Initialize content selection
   * @private
   */
  _initContentSection() {
    this._previewContent = domUtils.createElementWith(`<div class="tui-editor-contents"></div>`);
    this.el.appendChild(this._previewContent);
  }

  /**
   * Refresh rendering
   * @param {string} markdown Markdown text
   */
  refresh(markdown) {
    this.render(this.convertor.toHTMLWithCodeHightlight(markdown));
  }

  /**
   * get html string
   * @returns {string} - html preview string
   */
  getHTML() {
    return this._previewContent.innerHTML;
  }

  /**
   * set html string
   * @param {string} html - html preview string
   */
  setHTML(html) {
    this._previewContent.innerHTML = html;
  }

  /**
   * Render HTML on preview
   * @param {string} html HTML string
   */
  render(html) {
    const { _previewContent } = this;

    html = this.eventManager.emit('previewBeforeHook', html) || html;

    domUtils.empty(_previewContent);
    _previewContent.innerHTML = html;
  }

  /**
   * Set preview height
   * @param {number} height - Height for preview container
   */
  setHeight(height) {
    css(this.el, { height: `${height}px` });
  }

  /**
   * set min height
   * @param {number} minHeight - min height
   */
  setMinHeight(minHeight) {
    css(this.el, { minHeight: `${minHeight}px` });
  }

  /**
   * Is Preview visible
   * @returns {boolean} result
   */
  isVisible() {
    return this.el.style.display !== 'none';
  }
}

export default Preview;
