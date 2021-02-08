/**
 * @fileoverview Implements markdown preview
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
// import on from 'tui-code-snippet/domEvent/on';
import off from 'tui-code-snippet/domEvent/off';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';
import on from 'tui-code-snippet/domEvent/on';
// @ts-ignore
import { Renderer } from '@toast-ui/toastmark';

import { Emitter } from '@t/event';
import { CustomHTMLRendererMap, EditResult, MdNode, MdPos } from '@t/markdown';
import Preview from '@/preview';
import { toggleClass } from '@/utils/dom';
import domUtils from '@/utils/dom-legacy';
import { getHTMLRenderConvertors } from '@/markdown/htmlRenderConvertors';
import { sanitizeHTML } from '@/sanitizer/htmlSanitizer';
import { isInlineNode, findClosestNode, getMdStartCh } from '@/utils/markdown';
import { findAdjacentElementToScrollTop } from './scroll/dom';
import { removeOffsetInfoByNode } from './scroll/offset';
import { LinkAttributes } from '@t/editor';

export const CLASS_HIGHLIGHT = 'te-preview-highlight';

function findTableCell(tableRow: MdNode, chOffset: number) {
  let cell = tableRow.firstChild;

  while (cell && cell.next) {
    if (getMdStartCh(cell.next) > chOffset + 1) {
      break;
    }
    cell = cell.next;
  }

  return cell;
}

interface Options {
  linkAttributes: LinkAttributes | null;
  customHTMLRenderer: CustomHTMLRendererMap;
  isViewer: boolean;
  highlight?: boolean;
}

/**
 * Class Markdown Preview
 * @param {HTMLElement} el - base element
 * @param {eventEmitter} eventEmitter - event manager
 * @param {object} options
 * @param {boolean} options.isViewer - true for view-only mode
 * @param {boolean} options.highlight - true for using live-highlight feature
 * @param {object} opitons.linkAttributes - attributes for link element
 * @param {object} opitons.customHTMLRenderer - map of custom HTML render functions
 *
 * @ignore
 */
class MarkdownPreview extends Preview {
  private cursorNodeId!: number | null;

  private renderer: Renderer;

  constructor(eventEmitter: Emitter, options: Options) {
    const el = document.createElement('div');

    super(el, eventEmitter, options.isViewer);
    this.el = el;
    this.el.className = 'te-preview';
    this.lazyRunner.registerLazyRunFunction(
      'invokeCodeBlock',
      this.invokeCodeBlockPlugins,
      this.delayCodeBlockTime,
      this
    );

    const { linkAttributes, customHTMLRenderer, highlight = false } = options;

    this.renderer = new Renderer({
      gfm: true,
      nodeId: true,
      convertors: getHTMLRenderConvertors(linkAttributes, customHTMLRenderer),
    });

    this.cursorNodeId = null;

    this.initEvent(highlight);
  }

  private toggleActive(active: boolean) {
    toggleClass(this.el!, 'te-tab-active', active);
  }

  private initEvent(highlight: boolean) {
    this.eventEmitter.listen('contentChangedFromMarkdown', this.update.bind(this));
    // need to implement a listener function for 'previewNeedsRefresh' event
    // to support third-party plugins which requires re-executing script for every re-render

    if (highlight) {
      this.eventEmitter.listen('cursorActivity', ({ mdNode, cursorPos }) => {
        this.updateCursorNode(mdNode, cursorPos);
      });

      this.eventEmitter.listen('blur', () => {
        this.removeHighlight();
      });
    }

    on(this.el!, 'scroll', (event) => {
      this.eventEmitter.emit('scroll', {
        source: 'preview',
        data: findAdjacentElementToScrollTop(event.target.scrollTop, this.previewContent),
      });
    });
    this.eventEmitter.listen('changePreviewTabPreview', () => this.toggleActive(true));
    this.eventEmitter.listen('changePreviewTabWrite', () => this.toggleActive(false));
  }

  private removeHighlight() {
    if (this.cursorNodeId) {
      const currentEl = this.getElementByNodeId(this.cursorNodeId);

      if (currentEl) {
        removeClass(currentEl, CLASS_HIGHLIGHT);
      }
    }
  }

  private updateCursorNode(cursorNode: MdNode | null, cursorPos: MdPos) {
    if (cursorNode) {
      cursorNode = findClosestNode(cursorNode, (mdNode) => !isInlineNode(mdNode))!;

      if (cursorNode.type === 'tableRow') {
        cursorNode = findTableCell(cursorNode, cursorPos[1])!;
      } else if (cursorNode.type === 'tableBody') {
        // empty line next to table
        cursorNode = null;
      }
    }

    const cursorNodeId = cursorNode ? cursorNode.id : null;

    if (this.cursorNodeId === cursorNodeId) {
      return;
    }

    const oldEL = this.getElementByNodeId(this.cursorNodeId);
    const newEL = this.getElementByNodeId(cursorNodeId);

    if (oldEL) {
      removeClass(oldEL, CLASS_HIGHLIGHT);
    }
    if (newEL) {
      addClass(newEL, CLASS_HIGHLIGHT);
    }

    this.cursorNodeId = cursorNodeId;
  }

  private getElementByNodeId(nodeId: number | null) {
    return nodeId
      ? this.previewContent.querySelector<HTMLElement>(`[data-nodeid="${nodeId}"]`)
      : null;
  }

  update(changed: EditResult[], widgetMap: Record<string, HTMLElement>) {
    changed.forEach((editResult) => this.replaceRangeNodes(editResult, widgetMap));
    this.eventEmitter.emit('previewRenderAfter', this);
  }

  replaceRangeNodes(editResult: EditResult, widgetMap: Record<string, HTMLElement>) {
    const { nodes, removedNodeRange } = editResult;
    const contentEl = this.previewContent;
    let newHtml = this.eventEmitter.emitReduce(
      'convertorAfterMarkdownToHtmlConverted',
      nodes.map((node) => this.renderer.render(node)).join('')
    );

    Object.keys(widgetMap).forEach((id) => {
      newHtml = newHtml.replace(new RegExp(id, 'g'), widgetMap[id].outerHTML);
    });

    newHtml = sanitizeHTML(newHtml, true);

    if (!removedNodeRange) {
      contentEl.insertAdjacentHTML('afterbegin', newHtml);
    } else {
      const [startNodeId, endNodeId] = removedNodeRange.id;
      const startEl = this.getElementByNodeId(startNodeId);
      const endEl = this.getElementByNodeId(endNodeId);

      if (startEl) {
        startEl.insertAdjacentHTML('beforebegin', newHtml);
        let el = startEl;

        while (el !== endEl) {
          const nextEl = el.nextElementSibling as HTMLElement;

          el.parentNode!.removeChild(el);
          removeOffsetInfoByNode(el);
          el = nextEl;
        }
        if (el.parentNode) {
          domUtils.remove(el);
          removeOffsetInfoByNode(el);
        }
      }
    }

    const codeBlockEls = this.getCodeBlockElements(nodes.map((node) => node.id));

    if (codeBlockEls.length) {
      // @ts-ignore
      this.lazyRunner.run('invokeCodeBlock', codeBlockEls);
    }
  }

  getRenderer() {
    return this.renderer;
  }

  /**
   * render
   * @param {string} html - html string to render
   * @override
   */
  render(html: string) {
    super.render(html);

    this.eventEmitter.emit('previewRenderAfter', this);
  }

  destroy() {
    off(this.el!, 'scroll');
    this.el = null;
  }

  getElement() {
    return this.el;
  }
}

export default MarkdownPreview;
