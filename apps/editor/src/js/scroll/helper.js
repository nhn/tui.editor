import { includes } from '../utils/common';
import {
  hasSameLineParent,
  getMdEndLine,
  getLastLeafNode,
  isStyledTextNode,
  hasSpecificTypeAncestor
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
    hasSameLineParent(mdNode) ||
    (isStyledTextNode(mdNode) && !hasSpecificTypeAncestor(mdNode, 'item'))
  ) {
    mdNode = mdNode.parent;
    node = document.querySelector(`[data-nodeid="${mdNode.id}"]`);
  }

  return getNonNestableNodeObj(mdNode, node);
}

function getNonNestableNodeObj(mdNode, node) {
  while (includes(nestableTypes, mdNode.type) && mdNode.firstChild) {
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
