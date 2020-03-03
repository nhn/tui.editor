import domUtils from '../domUtils';
import { animate } from './animation';
import {
  hasNodeToBeCalculated,
  getAdditionalTopPos,
  getOffsetHeight,
  setOffsetHeight,
  getOffsetTop,
  setOffsetTop,
  getCmRangeHeight,
  getMdStartLine,
  getMdEndLine,
  isCodeBlockNode
} from './helper';

let blockedMarkdownScrollEvent = false;

/* eslint-disable no-return-assign, prefer-destructuring */
function getAndSaveOffsetInfo(node, mdNodeId, root) {
  const offsetHeight = getOffsetHeight(mdNodeId) || node.offsetHeight;
  const offsetTop =
    getOffsetTop(mdNodeId) || domUtils.getTotalOffsetTop(node, root) || node.offsetTop;

  setOffsetHeight(mdNodeId, offsetHeight);
  setOffsetTop(mdNodeId, offsetTop);

  return { offsetHeight, offsetTop };
}

export function syncMarkdownScrollTopToPreview(editor, preview, node) {
  const { mdDocument, cm } = editor;
  const { scrollTop } = preview.el;
  const root = preview._previewContent;

  const sourceScrollTop = cm.getScrollInfo().top;
  let targetScrollTop = 0;

  if (scrollTop !== 0 && node) {
    while (!node.getAttribute('data-nodeid')) {
      node = node.parentElement;
    }
    const mdNodeId = Number(node.getAttribute('data-nodeid'));
    const mdNode = mdDocument.findNodeById(mdNodeId);
    const mdNodeStartLine = getMdStartLine(mdNode);

    targetScrollTop = cm.heightAtLine(mdNodeStartLine - 1, 'local');

    if (hasNodeToBeCalculated(mdNode)) {
      const { offsetHeight, offsetTop } = getAndSaveOffsetInfo(node, mdNodeId, root);
      const height = cm.lineInfo(mdNodeStartLine - 1).handle.height;
      const cmNodeHeight = isCodeBlockNode(mdNode)
        ? (getMdEndLine(mdNode) - mdNodeStartLine) * height
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
