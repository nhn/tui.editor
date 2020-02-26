/**
 * @fileoverview Implements markdown preview
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import Preview from './preview';
import { GfmHtmlRenderer } from '@toast-ui/markdown-parser';

const htmlRenderer = new GfmHtmlRenderer({ nodeId: true });

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
    this.eventManager.listen('contentChangedFromMarkdown', this.update.bind(this));
    this.eventManager.listen('previewNeedsRefresh', value => {
      this.refresh(value || '');
    });

    on(this.el, 'scroll', event => {
      this.eventManager.emit('scroll', {
        source: 'preview',
        data: event
      });
    });
  }

  update(changed) {
    const { nodes, removedNodeRange } = changed;
    const [contentEl] = this._$previewContent;
    const newHtml = nodes.map(node => htmlRenderer.render(node)).join('');

    if (!removedNodeRange) {
      contentEl.insertAdjacentHTML('afterbegin', newHtml);
    } else {
      const [startNodeId, endNodeId] = removedNodeRange;
      const startEl = contentEl.querySelector(`[data-nodeid="${startNodeId}"]`);
      const endEl = contentEl.querySelector(`[data-nodeid="${endNodeId}"]`);

      if (startEl) {
        startEl.insertAdjacentHTML('beforebegin', newHtml);
        let el = startEl;

        while (el !== endEl) {
          const nextEl = el.nextElementSibling;

          el.parentNode.removeChild(el);
          el = nextEl;
        }
        el.remove();
      }
    }
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
