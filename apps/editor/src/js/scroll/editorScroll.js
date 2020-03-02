import domUtils from '../domUtils';
import { animate } from './animation';
import {
  hasNodeToBeCalculated,
  getCmCodeBlockHeight,
  getAdditionalScrollTop,
  getOffsetHeight,
  setOffsetHeight
} from './helper';

let blockedPreviewScrollEvent = false;

/* eslint-disable no-return-assign */
function getParentNodeObj(node, mdNode) {
  while (!node) {
    mdNode = mdNode.parent;
    node = document.querySelector(`[data-nodeid="${mdNode.id}"]`);
  }

  return { mdNode, node };
}

function getAndSaveOffsetHeight(node, mdNodeId, isScrollEvent) {
  const offsetHeight = isScrollEvent
    ? getOffsetHeight(mdNodeId) || node.offsetHeight
    : node.offsetHeight;

  setOffsetHeight(mdNodeId, offsetHeight);

  return offsetHeight;
}

export function syncPreviewScrollTopToMarkdown(editor, preview, isScrollEvent) {
  const { _previewContent: root, el: previewEl } = preview;
  const { cm, mdDocument } = editor;
  const { left, top: scrollTop } = cm.getScrollInfo();

  const sourceScrollTop = previewEl.scrollTop;
  let targetScrollTop = 0;

  if (scrollTop !== 0) {
    const cmTopLine = isScrollEvent
      ? cm.coordsChar({ left, top: scrollTop }, 'local').line
      : cm.getCursor('from').line;
    let mdNode = mdDocument.findFirstNodeAtLine(cmTopLine + 1);
    let { id: mdNodeId, type: mdNodeType } = mdNode;

    // if DOM element does not exist, should get its parent node using markdown node
    // in case of text node, rendererd DOM element is not matched to markdown node
    const nodeObj = getParentNodeObj(document.querySelector(`[data-nodeid="${mdNodeId}"]`), mdNode);
    const { node } = nodeObj;

    mdNode = nodeObj.mdNode;
    mdNodeId = mdNode.id;
    mdNodeType = mdNode.type;

    const mdNodeStartLine = mdDocument.findLineById(mdNodeId);
    let cmNodeHeight = cm.lineInfo(mdNodeStartLine - 1).handle.height;

    targetScrollTop = domUtils.getTotalOffsetTop(node, root) || node.offsetTop;

    if (hasNodeToBeCalculated(mdNode, cmNodeHeight)) {
      const offsetTop = cm.heightAtLine(mdNodeStartLine - 1, 'local');
      const offsetHeight = getAndSaveOffsetHeight(node, mdNodeId, isScrollEvent);

      if (mdNodeType === 'codeBlock') {
        cmNodeHeight = getCmCodeBlockHeight(node.textContent, cmTopLine, cm);
      }

      targetScrollTop += getAdditionalScrollTop(scrollTop, offsetTop, cmNodeHeight, offsetHeight);
    } else if (!cm.lineInfo(cmTopLine).text.trim()) {
      // const offsetHeight = getAndSaveOffsetHeight(node, mdNodeId, isScrollEvent);
      // targetScrollTop += offsetHeight;
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
