import { animate } from './animation';
import {
  isNodeToBeCalculated,
  getAdditionalTopPos,
  getParentNodeObj,
  getCmRangeHeight,
  getTotalOffsetTop,
  getFallbackScrollTop
} from './helper';
import { isHtmlNode, getMdStartLine, getMdEndLine, isMultiLineNode } from '../utils/markdown';
import { getOffsetHeight, setOffsetHeight } from './cache/offsetInfo';

const EDITING_POSITION_RATIO = 0.5;
let blockedPreviewScrollEvent = false;
let latestScrollTop = 0;

/* eslint-disable no-return-assign */
function getAndSaveOffsetHeight(node, mdNodeId) {
  const cachedHeight = getOffsetHeight(mdNodeId);
  const offsetHeight = cachedHeight || node.offsetHeight;

  if (!cachedHeight) {
    setOffsetHeight(mdNodeId, offsetHeight);
  }

  return offsetHeight;
}

export function syncPreviewScrollTopToMarkdown(editor, preview, scrollEvent) {
  const { _previewContent: root, el: previewEl } = preview;
  const { cm, mdDocument } = editor;
  const { left, top: scrollTop } = cm.getScrollInfo();

  const sourceScrollTop = previewEl.scrollTop;
  let targetScrollTop = 0;

  if (scrollTop) {
    const { line: startLine } = scrollEvent
      ? cm.coordsChar({ left, top: scrollTop }, 'local')
      : cm.getCursor('from');
    const firstMdNode = mdDocument.findFirstNodeAtLine(startLine + 1);

    if (!firstMdNode || isHtmlNode(firstMdNode)) {
      return;
    }

    // if DOM element does not exist, should get its parent node using markdown node
    // in case of text node, rendererd DOM element is not matched to markdown node
    const nodeObj = getParentNodeObj(firstMdNode);
    const previewElHeight = getAndSaveOffsetHeight(previewEl, 0);
    const { node, mdNode } = nodeObj;
    let { top } = node.getBoundingClientRect();
    let additionalTop = 0;

    if (isMultiLineNode(mdNode)) {
      additionalTop +=
        (startLine - getMdStartLine(mdNode) + 1) * cm.lineInfo(startLine).handle.height;
      top += additionalTop;
    }

    targetScrollTop = getTotalOffsetTop(node, root) || node.offsetTop;

    if (!scrollEvent && top > 0 && top < previewElHeight) {
      return;
    }

    if (isNodeToBeCalculated(mdNode)) {
      if (!scrollEvent) {
        targetScrollTop += isMultiLineNode(mdNode)
          ? additionalTop
          : -previewElHeight * EDITING_POSITION_RATIO;
      } else {
        const mdNodeStartLine = getMdStartLine(mdNode);
        const offsetHeight = getAndSaveOffsetHeight(node, mdNode.id);
        const offsetTop = cm.heightAtLine(mdNodeStartLine - 1, 'local');
        const cmNodeHeight = getCmRangeHeight(mdNode, cm);

        targetScrollTop += getAdditionalTopPos(scrollTop, offsetTop, cmNodeHeight, offsetHeight);

        const scrollTopInfo = { latestScrollTop, scrollTop, targetScrollTop, sourceScrollTop };

        targetScrollTop = getFallbackScrollTop(scrollTopInfo);
        latestScrollTop = scrollTop;
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
