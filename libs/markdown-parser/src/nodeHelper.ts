import { Node, NodeType } from './commonmark/node';
import { Position } from './document';

export const enum Compare {
  LT = -1,
  EQ = 0,
  GT = 1
}

export function getAllParents(node: Node) {
  const parents = [];
  while (node.parent) {
    parents.push(node.parent);
    node = node.parent;
  }
  return parents.reverse();
}

export function findClosestCommonParent(node1: Node, node2: Node) {
  const parents1 = getAllParents(node1);
  const parents2 = getAllParents(node2);
  const minLen = Math.min(parents1.length, parents2.length);

  let parent: Node | null = null;
  for (let i = 0; i < minLen; i += 1) {
    if (parents1[i] === parents2[i]) {
      parent = parents1[i];
    } else {
      break;
    }
  }

  return parent;
}

export function removeNextUntil(node: Node, last: Node) {
  let next = node.next;
  while (next && next !== last) {
    const temp = next.next;
    next.parent = next.prev = next.next = null;
    next = temp;
  }
  node.next = last.next;
  if (last.next) {
    last.next.prev = node;
  } else {
    node.parent!.lastChild = node;
  }
}

export function replaceNodeWithDocument(target: Node, doc: Node) {
  const nodes: Node[] = [];
  const first = doc.firstChild!;
  let next = first.next;
  if (target) {
    target.replaceWith(first);
    nodes.push(first);
  }
  while (next) {
    const temp = next.next;
    first.insertAfter(next);
    nodes.push(next);
    next = temp;
  }

  return nodes;
}

function isContainerBlock(type: NodeType) {
  switch (type) {
    case 'document':
    case 'blockQuote':
    case 'list':
    case 'item':
      return true;
    default:
      return false;
  }
}

function compareLine([startPos, endPos]: [Position, Position], line: number) {
  if (endPos[0] < line) {
    return Compare.LT;
  }
  if (startPos[0] > line) {
    return Compare.GT;
  }
  return Compare.EQ;
}

export function lastLeafBlock(parent: Node | null) {
  if (!parent) {
    return null;
  }
  let node = parent;
  while (isContainerBlock(node.type) && node.lastChild) {
    node = node.lastChild;
  }
  return node;
}

export function findBlockByLine(parent: Node, line: number) {
  let node: Node | null = parent;
  let prevNode = null;
  while (node) {
    const comp = compareLine(node.sourcepos!, line);
    if (comp === Compare.EQ) {
      if (isContainerBlock(node.type)) {
        prevNode = null;
        node = node.firstChild;
      } else {
        return node;
      }
    } else if (comp === Compare.GT) {
      return lastLeafBlock(prevNode);
    } else {
      prevNode = node;
      node = node.next;
    }
  }
  return lastLeafBlock(prevNode);
}

export function findChildNodeByLine(parent: Node, line: number) {
  let node = parent.firstChild;
  while (node) {
    const comp = compareLine(node.sourcepos!, line);
    if (comp === Compare.EQ) {
      return node;
    }
    if (comp === Compare.GT) {
      return node.prev;
    }
    node = node.next;
  }
  return node;
}
