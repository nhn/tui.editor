import domUtils from '../domUtils';
import { animate } from './animation';
import {
  hasNodeToBeCalculated,
  getAdditionalTopPos,
  getOffsetHeight,
  setOffsetHeight,
  getParentNodeObj,
  getCmRangeHeight,
  isEmptyLineNode,
  getMdStartLine,
  getMdEndLine,
  isCodeBlockNode
} from './helper';

let blockedPreviewScrollEvent = false;

/* eslint-disable no-return-assign, prefer-destructuring */
function getAndSaveOffsetHeight(node, mdNodeId) {
  const offsetHeight = getOffsetHeight(mdNodeId) || node.offsetHeight;

  setOffsetHeight(mdNodeId, offsetHeight);

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

  if (scrollTop !== 0) {
    const { line: startLine } = scrollEvent
      ? cm.coordsChar({ left, top: scrollTop }, 'local')
      : cm.getCursor('from');
    const firstMdNode = mdDocument.findFirstNodeAtLine(startLine + 1);

    // if DOM element does not exist, should get its parent node using markdown node
    // in case of text node, rendererd DOM element is not matched to markdown node
    const nodeObj = getParentNodeObj(firstMdNode);
    const { node, mdNode } = nodeObj;

    targetScrollTop = domUtils.getTotalOffsetTop(node, root) || node.offsetTop;

    if (scrollEvent && hasNodeToBeCalculated(mdNode)) {
      const mdNodeStartLine = getMdStartLine(mdNode);
      const { text, height } = cm.lineInfo(startLine).handle;
      const offsetHeight = getAndSaveOffsetHeight(node, mdNode.id);
      const offsetTop = cm.heightAtLine(mdNodeStartLine - 1, 'local');
      const cmNodeHeight = isCodeBlockNode(mdNode)
        ? (getMdEndLine(mdNode) - mdNodeStartLine) * height
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
