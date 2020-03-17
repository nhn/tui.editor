import { animate } from './animation';
import {
  isNodeToBeCalculated,
  getAdditionalTopPos,
  getCmRangeHeight,
  getTotalOffsetTop,
  getParentNodeObj,
  getFallbackScrollTop,
  getNextEmptyLineHeight
} from './helper';
import { getMdStartLine, isListItemNode } from '../utils/markdown';
import { getOffsetHeight, setOffsetHeight, getOffsetTop, setOffsetTop } from './cache/offsetInfo';

let blockedMarkdownScrollEvent = false;
let latestScrollTop = null;

/* eslint-disable no-return-assign */
function getAndSaveOffsetInfo(node, mdNodeId, root) {
  const cachedHeight = getOffsetHeight(mdNodeId);
  const cachedTop = getOffsetTop(mdNodeId);
  const offsetHeight = cachedHeight || node.offsetHeight;
  const offsetTop = cachedTop || getTotalOffsetTop(node, root) || node.offsetTop;

  if (!cachedHeight) {
    setOffsetHeight(mdNodeId, offsetHeight);
  }

  if (!cachedTop) {
    setOffsetTop(mdNodeId, offsetTop);
  }

  return { offsetHeight, offsetTop };
}

function getAncestorHavingId(node, root) {
  while (!node.getAttribute('data-nodeid') && node.parentElement !== root) {
    node = node.parentElement;
  }
  return node;
}

export function syncMarkdownScrollTopToPreview(editor, preview, targetNode) {
  const { toastMark, cm } = editor;
  const { scrollTop, clientHeight, scrollHeight } = preview.el;
  const root = preview._previewContent;
  const isBottomPos = scrollHeight - scrollTop <= clientHeight;

  const { left, top: sourceScrollTop, height } = cm.getScrollInfo();
  let targetScrollTop = isBottomPos ? height : 0;

  if (scrollTop && targetNode && !isBottomPos) {
    targetNode = getAncestorHavingId(targetNode, root);

    if (!targetNode.getAttribute('data-nodeid')) {
      return;
    }

    const { line: startLine } = cm.coordsChar({ left, top: sourceScrollTop }, 'local');
    const mdNodeId = Number(targetNode.getAttribute('data-nodeid'));
    const { mdNode, node } = getParentNodeObj(toastMark.findNodeById(mdNodeId));
    const mdNodeStartLine = getMdStartLine(mdNode);

    targetScrollTop = cm.heightAtLine(mdNodeStartLine - 1, 'local');
    if (isListItemNode(mdNode)) {
      targetScrollTop += getNextEmptyLineHeight(cm, mdNodeStartLine, startLine);
    }

    if (isNodeToBeCalculated(mdNode)) {
      const cmNodeHeight = getCmRangeHeight(mdNode, cm);
      const { offsetHeight, offsetTop } = getAndSaveOffsetInfo(node, mdNodeId, root);

      targetScrollTop += getAdditionalTopPos(scrollTop, offsetTop, offsetHeight, cmNodeHeight);
      const scrollTopInfo = { latestScrollTop, scrollTop, targetScrollTop, sourceScrollTop };

      targetScrollTop = getFallbackScrollTop(scrollTopInfo);
      latestScrollTop = scrollTop;

      if (targetScrollTop === sourceScrollTop) {
        return;
      }
    }
  }

  blockedMarkdownScrollEvent = true;

  const callbackObjForSync = {
    syncScrollTop: deltaScrollTop => cm.scrollTo(0, deltaScrollTop),
    releaseEventBlock: () => (blockedMarkdownScrollEvent = false)
  };

  animate(sourceScrollTop, targetScrollTop, callbackObjForSync);
}

export function isBlockedMarkdownScrollEvent() {
  return blockedMarkdownScrollEvent;
}
