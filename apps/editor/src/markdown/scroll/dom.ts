import { ProsemirrorNode } from 'prosemirror-model';
import { includes } from '@/utils/common';
import { isStyledInlineNode, getMdEndLine, getMdStartLine } from '@/utils/markdown';
import { MdNode } from '@t/markdown';

type El = HTMLElement | null;

const nestableTypes = ['list', 'item', 'blockQuote'];
const nestableTagNames = ['UL', 'OL', 'BLOCKQUOTE'];

function isBlankLine(doc: ProsemirrorNode, index: number) {
  const pmNode = doc.child(index);

  return !pmNode.childCount || (pmNode.childCount === 1 && !pmNode.firstChild!.text?.trim());
}

export function getNextNonBlankElement(mdNode: MdNode) {
  let { next, parent } = mdNode;

  while (!next && parent) {
    next = parent.next;
    parent = parent.parent;
  }
  return next ? document.querySelector<HTMLElement>(`[data-nodeid="${next.id}"]`) : null;
}

export function getEditorRangeHeightInfo(
  doc: ProsemirrorNode,
  mdNode: MdNode,
  children: HTMLCollection
) {
  const start = getMdStartLine(mdNode) - 1;
  const end = getMdEndLine(mdNode) - 1;
  const rect = (children[start] as HTMLElement).getBoundingClientRect();

  const height =
    (children[end] as HTMLElement).offsetTop -
    (children[start] as HTMLElement).offsetTop +
    children[end].clientHeight;

  return {
    height:
      height <= 0
        ? children[start].clientHeight
        : height + getBlankLinesHeight(doc, children, Math.min(end + 1, doc.childCount - 1)),
    rect
  };
}

function getBlankLinesHeight(
  doc: ProsemirrorNode,
  children: HTMLCollection,
  start: number,
  end = doc.childCount - 1
) {
  let height = 0;

  while (start <= end && isBlankLine(doc, start)) {
    height += children[start].clientHeight;
    start += 1;
  }
  return height;
}

export function getAncestorHavingId(el: HTMLElement, root: HTMLElement) {
  while (!el.getAttribute('data-nodeid') && el.parentElement !== root) {
    el = el.parentElement!;
  }
  return el;
}

export function getTotalOffsetTop(el: El, root: HTMLElement) {
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

export function findAdjacentElementToScrollTop(scrollTop: number, root: HTMLElement) {
  let el: El = root;
  let prev = null;

  while (el) {
    const { firstElementChild } = el;

    if (!firstElementChild) {
      break;
    }
    const lastSibling = findLastSiblingElementToScrollTop(
      firstElementChild as El,
      scrollTop,
      getTotalOffsetTop(el, root)
    );

    prev = el;
    el = lastSibling;
  }

  const adjacentEl = el || prev;

  return adjacentEl === root ? null : adjacentEl;
}

function findLastSiblingElementToScrollTop(el: El, scrollTop: number, offsetTop: number): El {
  if (el && scrollTop > offsetTop + el.offsetTop) {
    return (
      findLastSiblingElementToScrollTop(el.nextElementSibling as El, scrollTop, offsetTop) || el
    );
  }

  return null;
}

export function getAdditionalPos(
  scrollTop: number,
  offsetTop: number,
  height: number,
  targetNodeHeight: number
) {
  const ratio = Math.min((scrollTop - offsetTop) / height, 1);

  return ratio * targetNodeHeight;
}

export function getParentNodeObj(mdNode: MdNode) {
  let el = document.querySelector<HTMLElement>(`[data-nodeid="${mdNode.id}"]`);

  while (!el || isStyledInlineNode(mdNode)) {
    mdNode = mdNode.parent!;
    el = document.querySelector<HTMLElement>(`[data-nodeid="${mdNode.id}"]`);
  }
  const nodeObj = { mdNode, el };

  return getNonNestableNodeObj(nodeObj);
}

function getNonNestableNodeObj({ mdNode, el }: { mdNode: MdNode; el: HTMLElement }) {
  while ((includes(nestableTypes, mdNode.type) || mdNode.type === 'table') && mdNode.firstChild) {
    mdNode = mdNode.firstChild;
    el = el.firstElementChild as HTMLElement;
  }
  return { mdNode, el };
}
