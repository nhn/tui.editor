import domUtils from '../domUtils';
import { animate } from './animation';
import {
  hasNodeToBeCalculated,
  getCmCodeBlockHeight,
  getAdditionalScrollTop,
  getOffsetHeight,
  setOffsetHeight,
  getOffsetTop,
  setOffsetTop
} from './helper';

let blockedMarkdownScrollEvent = false;

function getAndSaveOffsetInfo(node, mdNodeId, root) {
  const offestHeight = getOffsetHeight(mdNodeId) || node.offsetHeight;
  const offsetTop =
    getOffsetTop(mdNodeId) || domUtils.getTotalOffsetTop(node, root) || node.offsetTop;

  setOffsetHeight(mdNodeId, offestHeight);
  setOffsetTop(mdNodeId, offsetTop);

  return { offestHeight, offsetTop };
}

/* eslint-disable no-return-assign */
export function syncMarkdownScrollTopToPreview(editor, preview, node) {
  const { mdDocument, cm } = editor;
  const { scrollTop } = preview.el;

  const sourceScrollTop = cm.getScrollInfo().top;
  let targetScrollTop = 0;

  if (node && scrollTop !== 0) {
    const mdNodeId = Number(node.getAttribute('data-nodeid'));
    const mdNode = mdDocument.findNodeById(mdNodeId);
    const mdNodeStartLine = mdDocument.findLineById(mdNodeId);

    const { offestHeight, offsetTop } = getAndSaveOffsetInfo(
      node,
      mdNodeId,
      preview._previewContent
    );

    targetScrollTop = cm.heightAtLine(mdNodeStartLine - 1, 'local');

    if (hasNodeToBeCalculated(mdNode, offestHeight)) {
      let cmNodeHeight = cm.lineInfo(mdNodeStartLine - 1).handle.height;

      if (mdNode.type === 'codeBlock') {
        cmNodeHeight = getCmCodeBlockHeight(node.textContent, mdNodeStartLine - 1, cm);
      }
      targetScrollTop += getAdditionalScrollTop(scrollTop, offsetTop, offestHeight, cmNodeHeight);
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
