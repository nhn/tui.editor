/**
 * @fileoverview Implements markdown preview
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import Preview from './preview';

import on from 'tui-code-snippet/domEvent/on';
import off from 'tui-code-snippet/domEvent/off';

/**
 * Class Markdown Preview
 * @param {HTMLElement} el - base element
 * @param {EventManager} eventManager - event manager
 * @param {Convertor} convertor - convertor
 * @param {boolean} isViewer - true for view only mode
 * @param {Number} delayTime - lazyRunner delay time
 * @ignore
 */
class MarkdownPreview extends Preview {
  constructor(el, eventManager, convertor, isViewer, delayTime) {
    super(el, eventManager, convertor, isViewer, delayTime);

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

    on(this.el, 'scroll', event => {
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
    off(this.el, 'scroll');
    this.el = null;
  }
}

export default MarkdownPreview;
