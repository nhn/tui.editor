import toArray from 'tui-code-snippet/collection/toArray';
import { includes } from '../util';

const RATIO_MIN_HEIGHT = 50;
const OffsetInfoMap = {};

export function setOffsetHeight(id, height) {
  OffsetInfoMap[id] = OffsetInfoMap[id] || {};
  OffsetInfoMap[id].height = height;
}

export function setOffsetTop(id, offsetTop) {
  OffsetInfoMap[id] = OffsetInfoMap[id] || {};
  OffsetInfoMap[id].offsetTop = offsetTop;
}

export function getOffsetHeight(id) {
  return OffsetInfoMap[id] && OffsetInfoMap[id].height;
}

export function getOffsetTop(id) {
  return OffsetInfoMap[id] && OffsetInfoMap[id].offsetTop;
}

export function removeOffsetInfoByNode(node) {
  if (node) {
    delete OffsetInfoMap[node.getAttribute('data-nodeid')];
    toArray(node.children).forEach(child => {
      removeOffsetInfoByNode(child);
      removeOffsetInfoByNode(child.nextElementSibling);
    });
  }
}

export function hasNodeToBeCalculated(mdNode, nodeHeight) {
  const nestedTypes = ['list', 'blockQuote'];

  if (includes(nestedTypes, mdNode.type)) {
    return false;
  }
  if (nodeHeight >= RATIO_MIN_HEIGHT) {
    return true;
  }

  while (mdNode) {
    if (mdNode.type === 'image' || mdNode.type === 'codeBlock') {
      return true;
    }
    mdNode = mdNode.firstChild;
  }

  return false;
}

export function getAdditionalScrollTop(scrollTop, offsetTop, currentNodeHeight, targetNodeHeight) {
  const diff = (scrollTop - offsetTop) / currentNodeHeight;

  return diff < 1 ? diff * targetNodeHeight : targetNodeHeight;
}

export function getCmCodeBlockHeight(textContent, currentLine, cm) {
  const textNodeHeight = cm.lineInfo(currentLine).handle.height;

  return textContent.split(/\n/).length * textNodeHeight;
}
