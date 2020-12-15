import { includes } from '../../utils/common';
import { isStyledInlineNode } from '../../utils/markdown';

const nestableTypes = ['list', 'item', 'blockQuote'];
const nestableTagNames = ['UL', 'OL', 'BLOCKQUOTE'];

export function getAdditionalPos(scrollTop, offsetTop, height, targetNodeHeight) {
  const ratio = Math.min((scrollTop - offsetTop) / height, 1);

  return ratio * targetNodeHeight;
}

export function getParentNodeObj(mdNode) {
  let node = document.querySelector(`[data-nodeid="${mdNode.id}"]`);

  while (!node || isStyledInlineNode(mdNode)) {
    mdNode = mdNode.parent;
    node = document.querySelector(`[data-nodeid="${mdNode.id}"]`);
  }
  const nodeObj = { mdNode, node };

  return getNonNestableNodeObj(nodeObj);
}

export function getParentNodeObj2(mdNode) {
  let node = document.querySelector(`[data-nodeid="${mdNode.id}"]`);

  while (!node || isStyledInlineNode(mdNode)) {
    mdNode = mdNode.parent;
    node = document.querySelector(`[data-nodeid="${mdNode.id}"]`);
  }

  return getParentListItemObj(mdNode);
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
  while ((includes(nestableTypes, mdNode.type) || mdNode.type === 'table') && mdNode.firstChild) {
    mdNode = mdNode.firstChild;
    node = node.firstElementChild;
  }
  return { mdNode, node };
}

export function getAncestorHavingId(node, root) {
  while (!node.getAttribute('data-nodeid') && node.parentElement !== root) {
    node = node.parentElement;
  }
  return node;
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
