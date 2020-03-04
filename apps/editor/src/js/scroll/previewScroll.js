import { animate } from './animation';
import {
  isNodeToBeCalculated,
  getAdditionalTopPos,
  getCmRangeHeight,
  getMdStartLine,
  getMdEndLine,
  isMultiLineNode,
  getTotalOffsetTop,
  getParentNodeObj
} from './helper';
import { getOffsetHeight, setOffsetHeight, getOffsetTop, setOffsetTop } from './cache/offsetInfo';

let blockedMarkdownScrollEvent = false;

/* eslint-disable no-return-assign, prefer-destructuring */
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
  const { mdDocument, cm } = editor;
  const { scrollTop } = preview.el;
  const root = preview._previewContent;

  const sourceScrollTop = cm.getScrollInfo().top;
  let targetScrollTop = 0;

  if (scrollTop && targetNode) {
    targetNode = getAncestorHavingId(targetNode, root);
    if (!targetNode.getAttribute('data-nodeid')) {
      return;
    }

    const mdNodeId = Number(targetNode.getAttribute('data-nodeid'));
    const { mdNode, node } = getParentNodeObj(mdDocument.findNodeById(mdNodeId));
    const mdNodeStartLine = getMdStartLine(mdNode);

    targetScrollTop = cm.heightAtLine(mdNodeStartLine - 1, 'local');

    if (isNodeToBeCalculated(mdNode)) {
      const { offsetHeight, offsetTop } = getAndSaveOffsetInfo(node, mdNodeId, root);
      const height = cm.lineInfo(mdNodeStartLine - 1).handle.height;
      const cmNodeHeight = isMultiLineNode(mdNode)
        ? (getMdEndLine(mdNode) - mdNodeStartLine + 1) * height
        : getCmRangeHeight(mdNodeStartLine - 1, mdNode, cm);

      targetScrollTop += getAdditionalTopPos(scrollTop, offsetTop, offsetHeight, cmNodeHeight);
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
