/**
 * @fileoverview Implements preview
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import LazyRunner from './lazyRunner';

/**
 * Class Preview
 * @param {jQuery} $el Container element for preview
 * @param {EventManager} eventManager Event manager instance
 * @param {Convertor} convertor Convertor instance
 * @param {boolean} isViewer - whether viewer mode or not
 * @param {Number} delayTime - lazyRunner delay time
 * @ignore
 */
class Preview {
  constructor($el, eventManager, convertor, isViewer, delayTime = 800) {
    this.eventManager = eventManager;
    this.convertor = convertor;
    this.$el = $el;
    this.isViewer = !!isViewer;

    this._initContentSection();

    this.lazyRunner = new LazyRunner();

    this.lazyRunner.registerLazyRunFunction(
      'refresh',
      this.refresh,
      delayTime,
      this
    );
  }

  /**
   * Initialize content selection
   * @private
   */
  _initContentSection() {
    this._$previewContent = $('<div class="tui-editor-contents" />');
    this.$el.append(this._$previewContent);
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
    return this._$previewContent.html();
  }

  /**
   * set html string
   * @param {string} html - html preview string
   */
  setHTML(html) {
    this._$previewContent.html(html);
  }

  /**
   * Render HTML on preview
   * @param {string} html HTML string
   */
  render(html) {
    const {_$previewContent} = this;
    html = this.eventManager.emit('previewBeforeHook', html) || html;

    _$previewContent.empty();
    _$previewContent.html(html);
  }

  /**
   * Set preview height
   * @param {number} height - Height for preview container
   */
  setHeight(height) {
    this.$el.get(0).style.height = `${height}px`;
  }

  /**
   * set min height
   * @param {number} minHeight - min height
   */
  setMinHeight(minHeight) {
    this.$el.get(0).style.minHeight = `${minHeight}px`;
  }

  /**
   * Is Preview visible
   * @returns {boolean} result
   */
  isVisible() {
    return this.$el.css('display') !== 'none';
  }
}

export default Preview;
