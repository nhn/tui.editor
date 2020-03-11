import { includes } from '../utils/common';
import { getMdEndLine, getMdStartLine, isStyledTextNode } from '../utils/markdown';

const nestableTypes = ['list', 'blockQuote'];
const nestableTagNames = ['UL', 'OL', 'BLOCKQUOTE'];
const tableElementTagNames = ['TR', 'TH', 'TBODY', 'TD'];

export function isNodeToBeCalculated(mdNode) {
  return !includes(nestableTypes, mdNode.type);
}

export function getAdditionalTopPos(scrollTop, offsetTop, currentNodeHeight, targetNodeHeight) {
  const diff = (scrollTop - offsetTop) / currentNodeHeight;

  return diff < 1 ? diff * targetNodeHeight : targetNodeHeight;
}

export function getParentNodeObj(mdNode) {
  let node = document.querySelector(`[data-nodeid="${mdNode.id}"]`);

  while (!node || includes(tableElementTagNames, mdNode.type) || isStyledTextNode(mdNode)) {
    mdNode = mdNode.parent;
    node = document.querySelector(`[data-nodeid="${mdNode.id}"]`);
  }

  return getNonNestableNodeObj(getParentListItemObj(mdNode));
}

function getParentListItemObj(orgMdNode) {
  let mdNode = orgMdNode;

  while (orgMdNode && orgMdNode !== 'document') {
    if (orgMdNode.type === 'item') {
      mdNode = orgMdNode;
      break;
    }
    orgMdNode = orgMdNode.parent;
  }

  return { mdNode, node: document.querySelector(`[data-nodeid="${mdNode.id}"]`) };
}

function getNonNestableNodeObj({ mdNode, node }) {
  while (includes(nestableTypes, mdNode.type) && mdNode.firstChild) {
    mdNode = mdNode.firstChild;
    node = node.firstElementChild;
  }
  return { mdNode, node };
}

export function getCmRangeHeight(mdNode, cm) {
  const start = getMdStartLine(mdNode);
  const end = getMdEndLine(mdNode);
  const cmNodeHeight = cm.lineInfo(start - 1).handle.height;
  const height = cm.heightAtLine(end, 'local') - cm.heightAtLine(start - 1, 'local');

  return height <= 0 ? cmNodeHeight : height + getNextEmptyLineHeight(cm, getMdEndLine(mdNode));
}

export function getNextEmptyLineHeight(cm, start, end = Number.MAX_VALUE) {
  const lineInfo = cm.lineInfo(start);

  if (!lineInfo) {
    return 0;
  }

  let detailLineInfo = lineInfo.handle;
  let height = 0;

  while (start <= end && !detailLineInfo.text.trim()) {
    height += detailLineInfo.height;
    start += 1;
    detailLineInfo = cm.lineInfo(start).handle;
  }
  return height;
}

export function getTotalOffsetTop(el, root) {
  let offsetTop = 0;

  while (el && el !== root) {
    if (!includes(nestableTagNames, el.tagName)) {
      offsetTop += el.offsetTop;
    }
    if (el.offsetParent === root.offsetParent) {
      break;
    }
    el = el.parentElement;
  }
  return offsetTop;
}

export function findAdjacentElementToScrollTop(scrollTop, root) {
  let el = root;
  let prev = null;

  while (el) {
    const { firstElementChild } = el;

    if (!firstElementChild) {
      break;
    }
    const lastSibling = findLastSiblingElementToScrollTop(
      firstElementChild,
      scrollTop,
      getTotalOffsetTop(el, root)
    );

    prev = el;
    el = lastSibling;
  }

  const adjacentEl = el || prev;

  return adjacentEl === root ? null : adjacentEl;
}

function findLastSiblingElementToScrollTop(el, scrollTop, offsetTop) {
  if (el && scrollTop > offsetTop + el.offsetTop) {
    return findLastSiblingElementToScrollTop(el.nextElementSibling, scrollTop, offsetTop) || el;
  }

  return null;
}

export function getFallbackScrollTop(scrollInfo) {
  const { latestScrollTop, scrollTop, targetScrollTop, sourceScrollTop } = scrollInfo;

  if (latestScrollTop === null) {
    return targetScrollTop;
  }

  return latestScrollTop < scrollTop
    ? Math.max(targetScrollTop, sourceScrollTop)
    : Math.min(targetScrollTop, sourceScrollTop);
}
