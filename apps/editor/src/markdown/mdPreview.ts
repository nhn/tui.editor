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
import domUtils from '@/utils/dom-legacy';
import { getHTMLRenderConvertors } from '@/markdown/htmlRenderConvertors';
import { isInlineNode, findClosestNode, getMdStartCh } from '@/utils/markdown';
import { findAdjacentElementToScrollTop } from './scroll/dom';
import { removeOffsetInfoByNode } from './scroll/offset';

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
  linkAttribute: Record<string, any> | null;
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
 * @param {object} opitons.linkAttribute - attributes for link element
 * @param {object} opitons.customHTMLRenderer - map of custom HTML render functions
 *
 * @ignore
 */
class MarkdownPreview extends Preview {
  private cursorNodeId!: number | null;

  private renderer: Renderer;

  constructor(el: HTMLElement, eventEmitter: Emitter, options: Options) {
    super(el, eventEmitter, options.isViewer);
    this.lazyRunner.registerLazyRunFunction(
      'invokeCodeBlock',
      this.invokeCodeBlockPlugins,
      this.delayCodeBlockTime,
      this
    );

    const { linkAttribute, customHTMLRenderer, highlight = false } = options;

    this.renderer = new Renderer({
      gfm: true,
      nodeId: true,
      convertors: getHTMLRenderConvertors(linkAttribute, customHTMLRenderer)
    });

    this.cursorNodeId = null;

    this.initEvent(highlight);
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

    on(this.el!, 'scroll', event => {
      this.eventEmitter.emit('scroll', {
        source: 'preview',
        data: findAdjacentElementToScrollTop(event.target.scrollTop, this.previewContent)
      });
    });
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
      cursorNode = findClosestNode(cursorNode, mdNode => !isInlineNode(mdNode))!;

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

  update(changed: EditResult[]) {
    changed.forEach(editResult => this.replaceRangeNodes(editResult));
    this.eventEmitter.emit('previewRenderAfter', this);
  }

  replaceRangeNodes(editResult: EditResult) {
    const { nodes, removedNodeRange } = editResult;
    const contentEl = this.previewContent;
    const newHtml = this.eventEmitter.emitReduce(
      'convertorAfterMarkdownToHtmlConverted',
      nodes.map(node => this.renderer.render(node)).join('')
    );

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

    const codeBlockEls = this.getCodeBlockElements(nodes.map(node => node.id));

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
}

export default MarkdownPreview;
