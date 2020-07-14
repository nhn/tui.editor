/**
 * @fileoverview Implements markdown preview
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import on from 'tui-code-snippet/domEvent/on';
import off from 'tui-code-snippet/domEvent/off';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';
import { createRenderHTML } from '@toast-ui/toastmark';

import Preview from './preview';
import domUtils from './utils/dom';
import { getHTMLRenderConvertors } from './htmlRenderConvertors';
import { findAdjacentElementToScrollTop } from './scroll/helper';
import { removeOffsetInfoByNode } from './scroll/cache/offsetInfo';
import { isInlineNode, findClosestNode, getMdStartCh } from './utils/markdown';

export const CLASS_HIGHLIGHT = 'te-preview-highlight';

function findTableCell(tableRow, { ch }) {
  let cell = tableRow.firstChild;

  while (cell && cell.next) {
    if (getMdStartCh(cell.next) > ch + 1) {
      break;
    }
    cell = cell.next;
  }

  return cell;
}

/**
 * Class Markdown Preview
 * @param {HTMLElement} el - base element
 * @param {EventManager} eventManager - event manager
 * @param {Convertor} convertor - convertor
 * @param {object} options
 * @param {boolean} options.isViewer - true for view-only mode
 * @param {boolean} options.highlight - true for using live-highlight feature
 * @param {object} opitons.linkAttribute - attributes for link element
 * @param {object} opitons.customHTMLRenderer - map of custom HTML render functions

 * @ignore
 */
class MarkdownPreview extends Preview {
  constructor(el, eventManager, convertor, options) {
    super(el, eventManager, convertor, options.isViewer);
    this.lazyRunner.registerLazyRunFunction(
      'invokeCodeBlock',
      this.invokeCodeBlockPlugins,
      this.delayCodeBlockTime,
      this
    );

    const { linkAttribute, customHTMLRenderer, highlight = false } = options;

    this.renderHTML = createRenderHTML({
      gfm: true,
      nodeId: true,
      convertors: getHTMLRenderConvertors(linkAttribute, customHTMLRenderer)
    });

    this.cursorNodeId = null;

    this._initEvent(highlight);
  }

  /**
   * Initialize event
   * @private
   */
  _initEvent(highlight) {
    this.eventManager.listen('contentChangedFromMarkdown', this.update.bind(this));
    // need to implement a listener function for 'previewNeedsRefresh' event
    // to support third-party plugins which requires re-executing script for every re-render

    if (highlight) {
      this.eventManager.listen('cursorActivity', ({ markdownNode, cursor }) => {
        this._updateCursorNode(markdownNode, cursor);
      });

      this.eventManager.listen('blur', () => {
        this._removeHighlight();
      });
    }

    on(this.el, 'scroll', event => {
      this.eventManager.emit('scroll', {
        source: 'preview',
        data: findAdjacentElementToScrollTop(event.target.scrollTop, this._previewContent)
      });
    });
  }

  _removeHighlight() {
    if (this.cursorNodeId) {
      const currentEl = this._getElementByNodeId(this.cursorNodeId);

      if (currentEl) {
        removeClass(currentEl, CLASS_HIGHLIGHT);
      }
    }
  }

  _updateCursorNode(cursorNode, cursorPos) {
    if (cursorNode) {
      cursorNode = findClosestNode(cursorNode, mdNode => !isInlineNode(mdNode));

      if (cursorNode.type === 'tableRow') {
        cursorNode = findTableCell(cursorNode, cursorPos);
      } else if (cursorNode.type === 'tableBody') {
        // empty line next to table
        cursorNode = null;
      }
    }

    const cursorNodeId = cursorNode ? cursorNode.id : null;

    if (this.cursorNodeId === cursorNodeId) {
      return;
    }

    const oldEL = this._getElementByNodeId(this.cursorNodeId);
    const newEL = this._getElementByNodeId(cursorNodeId);

    if (oldEL) {
      removeClass(oldEL, CLASS_HIGHLIGHT);
    }
    if (newEL) {
      addClass(newEL, CLASS_HIGHLIGHT);
    }

    this.cursorNodeId = cursorNodeId;
  }

  _getElementByNodeId(nodeId) {
    if (!nodeId) {
      return null;
    }
    return this._previewContent.querySelector(`[data-nodeid="${nodeId}"]`);
  }

  update(changed) {
    changed.forEach(editResult => this.replaceRangeNodes(editResult));
    this.eventManager.emit('previewRenderAfter', this);
  }

  replaceRangeNodes(editResult) {
    const { nodes, removedNodeRange } = editResult;
    const contentEl = this._previewContent;
    const newHtml = this.eventManager.emitReduce(
      'convertorAfterMarkdownToHtmlConverted',
      nodes.map(node => this.renderHTML(node)).join('')
    );

    if (!removedNodeRange) {
      contentEl.insertAdjacentHTML('afterbegin', newHtml);
    } else {
      const [startNodeId, endNodeId] = removedNodeRange.id;
      const startEl = this._getElementByNodeId(startNodeId);
      const endEl = this._getElementByNodeId(endNodeId);

      if (startEl) {
        startEl.insertAdjacentHTML('beforebegin', newHtml);
        let el = startEl;

        while (el !== endEl) {
          const nextEl = el.nextElementSibling;

          el.parentNode.removeChild(el);
          removeOffsetInfoByNode(el);
          el = nextEl;
        }
        if (el.parentNode) {
          domUtils.remove(el);
          removeOffsetInfoByNode(el);
        }
      }
    }

    const codeBlockEls = this.getCodeBlockElements(nodes.map(node => node.id));

    if (codeBlockEls.length) {
      this.lazyRunner.run('invokeCodeBlock', codeBlockEls);
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
