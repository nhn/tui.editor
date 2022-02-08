import { ProsemirrorNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { ToastMark } from '@toast-ui/toastmark';
import { Emitter } from '@t/event';
import { isHTMLNode, getMdStartLine } from '@/utils/markdown';
import MarkdownPreview from '../mdPreview';
import MdEditor from '../mdEditor';
import { animate } from './animation';
import { getAndSaveOffsetInfo } from './offset';
import {
  getAdditionalPos,
  findAncestorHavingId,
  getEditorRangeHeightInfo,
  getParentNodeObj,
  getTotalOffsetTop,
} from './dom';

const EDITOR_BOTTOM_PADDING = 18;

export interface SyncCallbacks {
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

  private toastMark: ToastMark;

  private eventEmitter: Emitter;

  private latestEditorScrollTop: number | null = null;

  private latestPreviewScrollTop: number | null = null;

  private blockedScroll: ScrollFrom | null = null;

  private active = true;

  private mdEditor: MdEditor;

  private timer: NodeJS.Timeout | null = null;

  constructor(mdEditor: MdEditor, preview: MarkdownPreview, eventEmitter: Emitter) {
    const { previewContent: previewRoot, el: previewEl } = preview;

    this.previewRoot = previewRoot;
    this.previewEl = previewEl!;
    this.mdEditor = mdEditor;
    this.editorView = mdEditor.view;
    this.toastMark = mdEditor.getToastMark();
    this.eventEmitter = eventEmitter;
    this.addScrollSyncEvent();
  }

  private addScrollSyncEvent() {
    this.eventEmitter.listen('afterPreviewRender', () => {
      this.clearTimer();
      // Immediately after the 'afterPreviewRender' event has occurred,
      // browser rendering is not yet complete.
      // So the size of elements can not be accurately measured.
      this.timer = setTimeout(() => {
        this.syncPreviewScrollTop(true);
      }, 200);
    });
    this.eventEmitter.listen('scroll', (type, data) => {
      if (this.active) {
        if (type === 'editor' && this.blockedScroll !== 'editor') {
          this.syncPreviewScrollTop();
        } else if (type === 'preview' && this.blockedScroll !== 'preview') {
          this.syncEditorScrollTop(data);
        }
      }
    });
    this.eventEmitter.listen('toggleScrollSync', (active: boolean) => {
      this.active = active;
    });
  }

  private getMdNodeAtPos(doc: ProsemirrorNode, posInfo: PosInfo) {
    const indexInfo = doc.content.findIndex(posInfo.pos);
    const line = indexInfo.index;

    return this.toastMark.findFirstNodeAtLine(line + 1);
  }

  private getScrollTopByCaretPos() {
    const pos = this.mdEditor.getSelection();
    const firstMdNode = this.toastMark.findFirstNodeAtLine(pos[0][0])!;
    const previewHeight = this.previewEl.clientHeight;
    const { el } = getParentNodeObj(this.previewRoot, firstMdNode);
    const totalOffsetTop = getTotalOffsetTop(el, this.previewRoot) || el.offsetTop;
    const nodeHeight = el.clientHeight;
    // multiply 0.5 for calculating the position in the middle of preview area
    const targetScrollTop = totalOffsetTop + nodeHeight - previewHeight * 0.5;

    this.latestEditorScrollTop = null;

    const diff = el.getBoundingClientRect().top - this.previewEl.getBoundingClientRect().top;

    return diff < previewHeight ? null : targetScrollTop;
  }

  private syncPreviewScrollTop(editing = false) {
    const { editorView, previewEl, previewRoot } = this;
    const { left, top } = editorView.dom.getBoundingClientRect();
    const posInfo = editorView.posAtCoords({ left, top })!;
    const { doc } = editorView.state;
    const firstMdNode = this.getMdNodeAtPos(doc, posInfo);

    if (!firstMdNode || isHTMLNode(firstMdNode)) {
      return;
    }

    const curScrollTop = previewEl.scrollTop;
    const { scrollTop, scrollHeight, clientHeight, children } = editorView.dom;
    const isBottomPos = scrollHeight - scrollTop <= clientHeight + EDITOR_BOTTOM_PADDING;

    let targetScrollTop = isBottomPos ? previewEl.scrollHeight : 0;

    if (scrollTop && !isBottomPos) {
      if (editing) {
        const scrollTopByEditing = this.getScrollTopByCaretPos();

        if (!scrollTopByEditing) {
          return;
        }
        targetScrollTop = scrollTopByEditing;
      } else {
        const { el, mdNode } = getParentNodeObj(this.previewRoot, firstMdNode);
        const { height, rect } = getEditorRangeHeightInfo(doc, mdNode, children);
        const totalOffsetTop = getTotalOffsetTop(el, previewRoot) || el.offsetTop;
        const nodeHeight = el.clientHeight;
        const ratio = top > rect.top ? Math.min((top - rect.top) / height, 1) : 0;

        targetScrollTop = totalOffsetTop + nodeHeight * ratio;
      }
      targetScrollTop = this.getResolvedScrollTop(
        'editor',
        scrollTop,
        targetScrollTop,
        curScrollTop
      );
      this.latestEditorScrollTop = scrollTop;
    }

    if (targetScrollTop !== curScrollTop) {
      this.run('editor', targetScrollTop, curScrollTop);
    }
  }

  syncEditorScrollTop(targetNode: HTMLElement) {
    const { toastMark, editorView, previewRoot, previewEl } = this;
    const { dom, state } = editorView;
    const { scrollTop, clientHeight, scrollHeight } = previewEl;
    const isBottomPos = scrollHeight - scrollTop <= clientHeight;

    const curScrollTop = dom.scrollTop;
    let targetScrollTop = isBottomPos ? dom.scrollHeight : 0;

    if (scrollTop && targetNode && !isBottomPos) {
      targetNode = findAncestorHavingId(targetNode, previewRoot);

      if (!targetNode.getAttribute('data-nodeid')) {
        return;
      }

      const { children } = dom;
      const mdNodeId = Number(targetNode.getAttribute('data-nodeid'));
      const { mdNode, el } = getParentNodeObj(this.previewRoot, toastMark.findNodeById(mdNodeId)!);
      const mdNodeStartLine = getMdStartLine(mdNode);

      targetScrollTop = (children[mdNodeStartLine - 1] as HTMLElement).offsetTop;

      const { height } = getEditorRangeHeightInfo(state.doc, mdNode, children);
      const { nodeHeight, offsetTop } = getAndSaveOffsetInfo(el, previewRoot, mdNodeId);

      targetScrollTop += getAdditionalPos(scrollTop, offsetTop, nodeHeight, height);
      targetScrollTop = this.getResolvedScrollTop(
        'preview',
        scrollTop,
        targetScrollTop,
        curScrollTop
      );
      this.latestPreviewScrollTop = scrollTop;
    }

    if (targetScrollTop !== curScrollTop) {
      this.run('preview', targetScrollTop, curScrollTop);
    }
  }

  private getResolvedScrollTop(
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

    const syncCallbacks: SyncCallbacks = {
      syncScrollTop: (scrollTop) => (scrollTarget.scrollTop = scrollTop),
      releaseEventBlock: () => (this.blockedScroll = null),
    };

    animate(curScrollTop, targetScrollTop, syncCallbacks);
  }

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  destroy() {
    this.clearTimer();
    this.eventEmitter.removeEventHandler('scroll');
    this.eventEmitter.removeEventHandler('afterPreviewRender');
  }
}
