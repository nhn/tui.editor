import { animate } from './animation';
import {
  isNodeToBeCalculated,
  getAdditionalTopPos,
  getParentNodeObj,
  getCmRangeHeight,
  getTotalOffsetTop,
  getFallbackScrollTop
} from './helper';
import { isHtmlNode, getMdStartLine, isMultiLineNode } from '../utils/markdown';
import { getOffsetHeight, setOffsetHeight } from './cache/offsetInfo';

const EDITING_POSITION_RATIO = 0.5;
let blockedPreviewScrollEvent = false;
let latestScrollTop = null;

/* eslint-disable no-return-assign */
function getAndSaveOffsetHeight(node, mdNodeId) {
  const cachedHeight = getOffsetHeight(mdNodeId);
  const offsetHeight = cachedHeight || node.offsetHeight;

  if (!cachedHeight) {
    setOffsetHeight(mdNodeId, offsetHeight);
  }

  return offsetHeight;
}

function getTopInfo(cm, startLine, mdNode, node, previewEl) {
  const mdNodeStartLine = getMdStartLine(mdNode);
  const { height } = cm.lineInfo(startLine).handle;
  const previewElHeight = getAndSaveOffsetHeight(previewEl, 0);
  let top = node.getBoundingClientRect().top - previewEl.getBoundingClientRect().top;
  // position editing node on middle of preview as default
  let additionalScrollTop = -previewElHeight * EDITING_POSITION_RATIO;

  if (isMultiLineNode(mdNode)) {
    const additionalTopPos = (startLine - mdNodeStartLine + 1) * height;

    additionalScrollTop = additionalTopPos;
    top += additionalTopPos;
  }

  return { top, additionalScrollTop };
}

export function syncPreviewScrollTopToMarkdown(editor, preview, scrollEvent) {
  const { _previewContent: root, el: previewEl } = preview;
  const { cm, toastMark } = editor;
  const { left, top: scrollTop, height, clientHeight } = cm.getScrollInfo();
  const isBottomPos = height - scrollTop <= clientHeight;

  const sourceScrollTop = previewEl.scrollTop;
  let targetScrollTop = isBottomPos ? previewEl.scrollHeight : 0;

  if (scrollTop && !isBottomPos) {
    const { line: startLine } = scrollEvent
      ? cm.coordsChar({ left, top: scrollTop }, 'local')
      : cm.getCursor('from');
    const firstMdNode = toastMark.findFirstNodeAtLine(startLine + 1);

    if (!firstMdNode || isHtmlNode(firstMdNode)) {
      return;
    }

    // if DOM element does not exist, should get its parent node using markdown node
    // in case of text node, rendererd DOM element is not matched to markdown node
    const nodeObj = getParentNodeObj(firstMdNode);
    const { node, mdNode } = nodeObj;
    const mdNodeStartLine = getMdStartLine(mdNode);
    const previewElHeight = getAndSaveOffsetHeight(previewEl, 0);

    targetScrollTop = getTotalOffsetTop(node, root) || node.offsetTop;

    if (!scrollEvent) {
      const { top, additionalScrollTop } = getTopInfo(cm, startLine, mdNode, node, previewEl);

      if (top > 0 && top < previewElHeight) {
        return;
      }

      targetScrollTop += additionalScrollTop;
      // assign the null to sync scrollTop position when scrolling
      latestScrollTop = null;
    } else if (isNodeToBeCalculated(mdNode)) {
      const offsetHeight = getAndSaveOffsetHeight(node, mdNode.id);
      const offsetTop = cm.heightAtLine(mdNodeStartLine - 1, 'local');
      const cmNodeHeight = getCmRangeHeight(mdNode, cm);

      targetScrollTop += getAdditionalTopPos(scrollTop, offsetTop, cmNodeHeight, offsetHeight);

      const scrollTopInfo = { latestScrollTop, scrollTop, targetScrollTop, sourceScrollTop };

      targetScrollTop = getFallbackScrollTop(scrollTopInfo);
      latestScrollTop = scrollTop;

      if (targetScrollTop === sourceScrollTop) {
        return;
      }
    }
  }

  blockedPreviewScrollEvent = true;

  const callbackObjForSync = {
    syncScrollTop: deltaScrollTop => (previewEl.scrollTop = deltaScrollTop),
    releaseEventBlock: () => (blockedPreviewScrollEvent = false)
  };

  animate(sourceScrollTop, targetScrollTop, callbackObjForSync);
}

export function isBlockedPreviewScrollEvent() {
  return blockedPreviewScrollEvent;
}
