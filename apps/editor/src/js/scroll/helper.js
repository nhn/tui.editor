import toArray from 'tui-code-snippet/collection/toArray';
import { includes } from '../util';

const offsetInfoMap = {};
const nestableTypes = ['list', 'blockQuote'];

export function setOffsetHeight(id, height) {
  offsetInfoMap[id] = offsetInfoMap[id] || {};
  offsetInfoMap[id].height = height;
}

export function setOffsetTop(id, offsetTop) {
  offsetInfoMap[id] = offsetInfoMap[id] || {};
  offsetInfoMap[id].offsetTop = offsetTop;
}

export function getOffsetHeight(id) {
  return offsetInfoMap[id] && offsetInfoMap[id].height;
}

export function getOffsetTop(id) {
  return offsetInfoMap[id] && offsetInfoMap[id].offsetTop;
}

export function removeOffsetInfoByNode(node) {
  if (node) {
    delete offsetInfoMap[node.getAttribute('data-nodeid')];
    toArray(node.children).forEach(child => {
      removeOffsetInfoByNode(child);
      removeOffsetInfoByNode(child.nextElementSibling);
    });
  }
}

export function hasImageOrCodeBlockNode(mdNode) {
  while (mdNode) {
    if (includes(['image', 'codeBlock'], mdNode.type)) {
      return true;
    }
    mdNode = mdNode.firstChild;
  }
  return false;
}

export function hasNodeToBeCalculated(mdNode) {
  return !includes(nestableTypes, mdNode.type);
}

export function getAdditionalTopPos(scrollTop, offsetTop, currentNodeHeight, targetNodeHeight) {
  const diff = (scrollTop - offsetTop) / currentNodeHeight;

  return diff < 1 ? diff * targetNodeHeight : targetNodeHeight;
}

export function getParentNodeObj(mdNode) {
  let node = document.querySelector(`[data-nodeid="${mdNode.id}"]`);

  while (!node && mdNode) {
    mdNode = mdNode.parent;
    node = document.querySelector(`[data-nodeid="${mdNode.id}"]`);
  }

  while (includes(nestableTypes, mdNode.type)) {
    mdNode = mdNode.firstChild;
    node = node.firstElementChild;
  }

  return { mdNode, node };
}

export function getCmRangeHeight(start, mdNode, cm) {
  const cmNodeHeight = cm.lineInfo(start).handle.height;
  const end = getMdEndLine(getLastLeafNode(mdNode));
  const height =
    cm.heightAtLine(end, 'local') -
    cm.heightAtLine(start, 'local') -
    getEmptyLineHeight(start, end, cm);

  return height <= 0 ? cmNodeHeight : height;
}

export function isEmptyLineNode(text, mdNode) {
  return !text.trim() && !hasImageOrCodeBlockNode(mdNode);
}

export function getMdStartLine(mdNode) {
  return mdNode.sourcepos[0][0];
}

export function getMdEndLine(mdNode) {
  return mdNode.sourcepos[1][0];
}

export function isCodeBlockNode(mdNode) {
  return mdNode.type === 'codeBlock';
}

function getEmptyLineHeight(start, end, cm) {
  let emptyLineHeight = 0;

  for (let i = start; i < end; i += 1) {
    const { text, height } = cm.lineInfo(i).handle;

    if (!text.trim()) {
      emptyLineHeight += height;
    }
  }
  return emptyLineHeight;
}

function getLastLeafNode(mdNode) {
  while (mdNode.lastChild) {
    mdNode = mdNode.lastChild;
  }
  return mdNode;
}
