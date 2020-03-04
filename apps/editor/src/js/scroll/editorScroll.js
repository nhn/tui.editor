import { animate } from './animation';
import {
  isNodeToBeCalculated,
  getAdditionalTopPos,
  getParentNodeObj,
  getCmRangeHeight,
  isEmptyLineNode,
  getMdStartLine,
  getMdEndLine,
  isMultiLineNode,
  getTotalOffsetTop,
  isHtmlNode
} from './helper';
import { getOffsetHeight, setOffsetHeight } from './cache/offsetInfo';

let blockedPreviewScrollEvent = false;

/* eslint-disable no-return-assign, prefer-destructuring */
function getAndSaveOffsetHeight(node, mdNodeId) {
  const cachedHeight = getOffsetHeight(mdNodeId);
  const offsetHeight = cachedHeight || node.offsetHeight;

  if (!cachedHeight) {
    setOffsetHeight(mdNodeId, offsetHeight);
  }

  return offsetHeight;
}

function getAdditionalTopPosForEmptyLine(mdNode, node, offsetHeight) {
  return mdNode.type === 'item' && node.firstElementChild
    ? node.firstElementChild.offsetHeight
    : offsetHeight;
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

    if (isHtmlNode(firstMdNode)) {
      return;
    }

    // if DOM element does not exist, should get its parent node using markdown node
    // in case of text node, rendererd DOM element is not matched to markdown node
    const nodeObj = getParentNodeObj(firstMdNode);
    const { node, mdNode } = nodeObj;

    targetScrollTop = getTotalOffsetTop(node, root) || node.offsetTop;

    if (scrollEvent && isNodeToBeCalculated(mdNode)) {
      const mdNodeStartLine = getMdStartLine(mdNode);
      const { text, height } = cm.lineInfo(startLine).handle;
      const offsetHeight = getAndSaveOffsetHeight(node, mdNode.id);
      const offsetTop = cm.heightAtLine(mdNodeStartLine - 1, 'local');
      const cmNodeHeight = isMultiLineNode(mdNode)
        ? (getMdEndLine(mdNode) - mdNodeStartLine + 1) * height
        : getCmRangeHeight(startLine, mdNode, cm);

      // if the node is empty line in code mirror, add the height of most adjacent node
      targetScrollTop += isEmptyLineNode(text, mdNode)
        ? getAdditionalTopPosForEmptyLine(mdNode, node, offsetHeight)
        : getAdditionalTopPos(scrollTop, offsetTop, cmNodeHeight, offsetHeight);
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
