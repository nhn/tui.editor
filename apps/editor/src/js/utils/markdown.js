import { includes } from './common';

const nestableTagNames = ['UL', 'OL', 'BLOCKQUOTE'];

export function hasImageOrCodeBlockNode(mdNode) {
  while (mdNode) {
    if (includes(['image', 'codeBlock'], mdNode.type)) {
      return true;
    }
    mdNode = mdNode.firstChild;
  }
  return false;
}

export function hasSameLineParent(mdNode) {
  return (
    mdNode.parent &&
    mdNode.parent.type !== 'document' &&
    mdNode.parent.sourcepos[0][0] === mdNode.sourcepos[0][0]
  );
}

export function hasSpecificTypeAncestor(mdNode, ...types) {
  while (mdNode.parent && mdNode.parent.type !== 'document') {
    if (includes(types, mdNode.parent.type)) {
      return true;
    }
    mdNode = mdNode.parent;
  }
  return false;
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

export function getMdStartCh(mdNode) {
  return mdNode.sourcepos[0][1];
}

export function getMdEndCh(mdNode) {
  return mdNode.sourcepos[1][1];
}

export function isMultiLineNode(mdNode) {
  const { type } = mdNode;

  return type === 'codeBlock' || type === 'paragraph';
}

export function isHtmlNode(mdNode) {
  const { type } = mdNode;

  return type === 'htmlBlock' || type === 'htmlInline';
}

export function isStyledTextNode(mdNode) {
  const { type } = mdNode;

  return type === 'strike' || type === 'strong' || type === 'emph';
}

export function isListItemNode(mdNode) {
  return mdNode.type === 'item';
}

export function getLastLeafNode(mdNode) {
  while (mdNode.lastChild) {
    mdNode = mdNode.lastChild;
  }
  return mdNode;
}

export function traverseParentNodes(mdNode, iteratee) {
  while (mdNode.parent && mdNode.parent.type !== 'document') {
    mdNode = mdNode.parent;
    iteratee(mdNode);
  }
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
