/**
 * @fileoverview Implements markdown preview
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
// import on from 'tui-code-snippet/domEvent/on';
import off from 'tui-code-snippet/domEvent/off';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';
import on from 'tui-code-snippet/domEvent/on';
import { EditResult, HTMLConvertorMap, MdNode, MdPos, Renderer } from '@toast-ui/toastmark';

import { Emitter } from '@t/event';
import { LinkAttributes } from '@t/editor';
import Preview from '@/preview';
import { cls, removeNode, toggleClass } from '@/utils/dom';
import { getHTMLRenderConvertors } from '@/markdown/htmlRenderConvertors';
import { isInlineNode, findClosestNode, getMdStartCh } from '@/utils/markdown';
import { findAdjacentElementToScrollTop } from './scroll/dom';
import { removeOffsetInfoByNode } from './scroll/offset';

export const CLASS_HIGHLIGHT = cls('md-preview-highlight');

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

type Sanitizer = (html: string) => string;

interface Options {
  linkAttributes: LinkAttributes | null;
  customHTMLRenderer: HTMLConvertorMap;
  isViewer: boolean;
  highlight?: boolean;
  sanitizer: Sanitizer;
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

  private customHTMLRenderer: HTMLConvertorMap;

  private sanitizer: Sanitizer;

  constructor(eventEmitter: Emitter, options: Options) {
    const el = document.createElement('div');

    super(el, eventEmitter, options.isViewer);
    this.el = el;
    this.el.className = cls('md-preview');
    this.lazyRunner.registerLazyRunFunction(
      'invokeCodeBlock',
      this.invokeCodeBlockPlugins,
      this.delayCodeBlockTime,
      this
    );

    const { linkAttributes, customHTMLRenderer, sanitizer, highlight = false } = options;

    this.renderer = new Renderer({
      gfm: true,
      nodeId: true,
      convertors: getHTMLRenderConvertors(linkAttributes, customHTMLRenderer),
    });

    this.cursorNodeId = null;
    this.sanitizer = sanitizer;
    this.customHTMLRenderer = customHTMLRenderer;

    this.initEvent(highlight);
  }

  private toggleActive(active: boolean) {
    toggleClass(this.el!, 'active', active);
  }

  private initEvent(highlight: boolean) {
    this.eventEmitter.listen('updatePreview', this.update.bind(this));

    if (highlight) {
      this.eventEmitter.listen('changeToolbarState', ({ mdNode, cursorPos }) => {
        this.updateCursorNode(mdNode, cursorPos);
      });

      this.eventEmitter.listen('blur', () => {
        this.removeHighlight();
      });
    }

    on(this.el!, 'scroll', (event) => {
      this.eventEmitter.emit(
        'scroll',
        'preview',
        findAdjacentElementToScrollTop(event.target.scrollTop, this.previewContent)
      );
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

  update(changed: EditResult[]) {
    changed.forEach((editResult) => this.replaceRangeNodes(editResult));
    this.eventEmitter.emit('afterPreviewRender', this);
  }

  replaceRangeNodes(editResult: EditResult) {
    const { nodes, removedNodeRange } = editResult;
    const contentEl = this.previewContent;
    const newHtml = this.eventEmitter.emitReduce(
      'beforePreviewRender',
      this.sanitizer(nodes.map((node) => this.renderer.render(node)).join(''))
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

          removeNode(el);
          removeOffsetInfoByNode(el);
          el = nextEl;
        }
        if (el.parentNode) {
          removeNode(el);
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

  destroy() {
    off(this.el!, 'scroll');
    this.el = null;
  }

  getElement() {
    return this.el;
  }
}

export default MarkdownPreview;
