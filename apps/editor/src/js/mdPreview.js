/**
 * @fileoverview Implements markdown preview
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import Preview from './preview';

/**
 * Class Markdown Preview
 * @param {jQuery} $el - base jQuery element
 * @param {EventManager} eventManager - event manager
 * @param {Convertor} convertor - convertor
 * @param {boolean} isViewer - true for view only mode
 * @param {Number} delayTime - lazyRunner delay time
 * @ignore
 */
class MarkdownPreview extends Preview {
  constructor($el, eventManager, convertor, isViewer, delayTime) {
    super($el, eventManager, convertor, isViewer, delayTime);

    this._initEvent();
  }

  /**
   * Initialize event
   * @private
   */
  _initEvent() {
    let latestMarkdownValue = '';

    this.eventManager.listen('contentChangedFromMarkdown', markdownEditor => {
      latestMarkdownValue = markdownEditor.getValue();

      if (this.isVisible()) {
        this.lazyRunner.run('refresh', latestMarkdownValue);
      }
    });

    this.eventManager.listen('previewNeedsRefresh', value => {
      this.refresh(value || latestMarkdownValue);
    });

    this.$el.on('scroll', event => {
      this.eventManager.emit('scroll', {
        source: 'preview',
        data: event
      });
    });
  }

  /**
   * render
   * @param {string} html - html string to render
   * @override
   */
  render(html) {
    super.render(html);

    this.eventManager.emit('previewRenderAfter', this);
  }

  remove() {
    this.$el.off('scroll');
    this.$el = null;
  }
}

export default MarkdownPreview;
