import { includes } from '../utils/common';
import {
  getMdEndLine,
  getMdStartLine,
  isStyledTextNode,
  getParentListMdNode
} from '../utils/markdown';

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

  while (
    (!node && mdNode) ||
    includes(tableElementTagNames, mdNode.type) ||
    isStyledTextNode(mdNode)
  ) {
    mdNode = mdNode.parent;
    node = document.querySelector(`[data-nodeid="${mdNode.id}"]`);
  }
  mdNode = getParentListMdNode(mdNode);
  node = document.querySelector(`[data-nodeid="${mdNode.id}"]`);

  return getNonNestableNodeObj(mdNode, node);
}

function getNonNestableNodeObj(mdNode, node) {
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

  return height <= 0 ? cmNodeHeight : height + getNextEmptyLineHeight(mdNode, cm);
}

export function getNextEmptyLineHeight(mdNode, cm) {
  let height = 0;
  let end = getMdEndLine(mdNode);

  while (end >= 0) {
    const lineInfo = cm.lineInfo(end).handle;

    if (!lineInfo.text.trim()) {
      height += lineInfo.height;
      end += 1;
    } else {
      break;
    }
  }
  return height;
}

export function getTotalOffsetTop(el, root) {
  let offsetTop = 0;

  while (el && el !== root) {
    if (!includes(nestableTagNames, el.tagName)) {
      offsetTop += el.offsetTop;
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

  if (latestScrollTop < scrollTop) {
    return Math.max(targetScrollTop, sourceScrollTop);
  }
  return Math.min(targetScrollTop, sourceScrollTop);
}
