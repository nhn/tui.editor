import { ProsemirrorNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { Emitter } from '@t/event';
import { getMdStartLine, isCodeBlockNode, isCustomBlockNode, isHtmlNode } from '@/utils/markdown';
import MarkdownPreview from '../mdPreview';
import { animate } from './animation';
import {
  getParentNodeObj,
  getTotalOffsetTop,
  getAncestorHavingId,
  getParentNodeObj2,
  getAdditionalPos
} from './helper';
import { getAndSaveOffsetInfo } from './offset';
import MdEditor from '../mdEditor';
import { getEditorRangeHeightInfo, getNextNonBlankElement, isBlankLine } from './pos';

const EDITOR_BOTTOM_PADDING = 18;

export interface SyncCallbackObj {
  syncScrollTop: (scrollTop: number) => void;
  releaseEventBlock: () => void;
}

interface PosInfo {
  pos: number;
  inside: number;
}

type ScrollFrom = 'editor' | 'preview';

export class ScrollSync {
  private previewRoot: HTMLElement;

  private previewEl: HTMLElement;

  private editorView: EditorView;

  private toastMark: any;

  private eventEmitter: Emitter;

  private latestEditorScrollTop: number | null = null;

  private latestPreviewScrollTop: number | null = null;

  private blockedScroll: ScrollFrom | null = null;

  constructor(mdEditor: MdEditor, preview: MarkdownPreview, eventEmitter: Emitter) {
    const { previewContent: previewRoot, el: previewEl } = preview;

    this.previewRoot = previewRoot;
    this.previewEl = previewEl!;
    this.editorView = mdEditor.view;
    this.toastMark = mdEditor.getToastMark();
    this.eventEmitter = eventEmitter;
    this.addScrollSyncEvent();
  }

  private addScrollSyncEvent() {
    this.eventEmitter.listen('previewRenderAfter', () => {
      // Immediately after the 'previewRenderAfter' event has occurred,
      // browser rendering is not yet complete.
      // So the size of elements can not be accurately measured.
      setTimeout(() => {
        this.syncPreviewScrollTop();
      }, 200);
    });
    this.eventEmitter.listen('scroll', ({ source, data }) => {
      if (source === 'editor' && this.blockedScroll !== 'editor') {
        this.syncPreviewScrollTop();
      } else if (source === 'preview' && this.blockedScroll !== 'preview') {
        this.syncEditorScrollTop(data);
      }
    });
  }

  private getMdNodeInfo(doc: ProsemirrorNode, posInfo: PosInfo) {
    const indexInfo = doc.content.findIndex(posInfo.pos);
    const line = indexInfo.index;

    return { line, firstMdNode: this.toastMark.findFirstNodeAtLine(line + 1) };
  }

  private syncPreviewScrollTop() {
    const { editorView, previewEl, previewRoot } = this;
    const { left, top } = editorView.dom.getBoundingClientRect();
    const posInfo = editorView.posAtCoords({ left, top })!;
    const { doc } = editorView.state;
    const { line, firstMdNode } = this.getMdNodeInfo(doc, posInfo);

    if (!firstMdNode || isHtmlNode(firstMdNode)) {
      return;
    }

    const curScrollTop = previewEl.scrollTop;
    const { scrollTop, scrollHeight, clientHeight, children } = editorView.dom;
    const isBottomPos = scrollHeight - scrollTop <= clientHeight + EDITOR_BOTTOM_PADDING;

    let targetScrollTop = isBottomPos ? previewEl.scrollHeight : 0;

    if (scrollTop && !isBottomPos) {
      const { node, mdNode } = getParentNodeObj(firstMdNode);
      const { height, rect } = getEditorRangeHeightInfo(doc, mdNode, children);
      const totalOffsetTop = getTotalOffsetTop(node, previewRoot) || node.offset;
      const nodeHeight = node.clientHeight;
      const ratio = top > rect.top ? Math.min((top - rect.top) / height, 1) : 0;

      if (isBlankLine(doc, line) && !isCodeBlockNode(mdNode) && !isCustomBlockNode(mdNode)) {
        const totalOffsetHeight = totalOffsetTop + nodeHeight;
        const nextElement = getNextNonBlankElement(mdNode)!;

        targetScrollTop = totalOffsetHeight;

        if (nextElement) {
          const nextTotalOffsetTop =
            getTotalOffsetTop(nextElement, this.previewRoot) || nextElement.offsetTop;

          targetScrollTop += (nextTotalOffsetTop - totalOffsetHeight) * ratio;
        }
      } else {
        targetScrollTop = totalOffsetTop + nodeHeight * ratio;
      }

      targetScrollTop = this.getScrollTop('editor', scrollTop, targetScrollTop, curScrollTop);
      this.latestEditorScrollTop = scrollTop;
    }
    if (targetScrollTop === curScrollTop) {
      return;
    }

    this.run('editor', targetScrollTop, curScrollTop);
  }

  syncEditorScrollTop(targetNode: HTMLElement) {
    const { toastMark, editorView, previewRoot, previewEl } = this;
    const { dom, state } = editorView;
    const { scrollTop, clientHeight, scrollHeight } = previewEl;
    const isBottomPos = scrollHeight - scrollTop <= clientHeight;

    const curScrollTop = dom.scrollTop;
    let targetScrollTop = isBottomPos ? dom.scrollHeight : 0;

    if (scrollTop && targetNode && !isBottomPos) {
      targetNode = getAncestorHavingId(targetNode, previewRoot);

      if (!targetNode.getAttribute('data-nodeid')) {
        return;
      }

      const { children } = dom;
      const mdNodeId = Number(targetNode.getAttribute('data-nodeid'));
      const { mdNode, node } = getParentNodeObj2(toastMark.findNodeById(mdNodeId));
      const mdNodeStartLine = getMdStartLine(mdNode);

      targetScrollTop = (children[mdNodeStartLine - 1] as HTMLElement).offsetTop;

      const { height } = getEditorRangeHeightInfo(state.doc, mdNode, children);
      const { nodeHeight, offsetTop } = getAndSaveOffsetInfo(node, previewRoot, mdNodeId);

      targetScrollTop += getAdditionalPos(scrollTop, offsetTop, nodeHeight, height);
      targetScrollTop = this.getScrollTop('preview', scrollTop, targetScrollTop, curScrollTop);
      this.latestPreviewScrollTop = scrollTop;

      if (targetScrollTop === curScrollTop) {
        return;
      }
    }

    this.run('preview', targetScrollTop, curScrollTop);
  }

  private getScrollTop(
    from: ScrollFrom,
    scrollTop: number,
    targetScrollTop: number,
    curScrollTop: number
  ) {
    const latestScrollTop =
      from === 'editor' ? this.latestEditorScrollTop : this.latestPreviewScrollTop;

    if (latestScrollTop === null) {
      return targetScrollTop;
    }

    return latestScrollTop < scrollTop
      ? Math.max(targetScrollTop, curScrollTop)
      : Math.min(targetScrollTop, curScrollTop);
  }

  private run(from: ScrollFrom, targetScrollTop: number, curScrollTop: number) {
    let scrollTarget: Element;

    if (from === 'editor') {
      scrollTarget = this.previewEl;
      this.blockedScroll = 'preview';
    } else {
      scrollTarget = this.editorView.dom;
      this.blockedScroll = 'editor';
    }

    /* eslint-disable no-return-assign */
    const syncCallbackObj: SyncCallbackObj = {
      syncScrollTop: scrollTop => (scrollTarget.scrollTop = scrollTop),
      releaseEventBlock: () => (this.blockedScroll = null)
    };

    animate(curScrollTop, targetScrollTop, syncCallbackObj);
  }
}
