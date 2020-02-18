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
  if (node.parent !== last.parent || node === last) {
    return;
  }

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

export function getChildNodes(parent: Node) {
  const nodes = [];
  let curr: Node | null = parent.firstChild!;
  while (curr) {
    nodes.push(curr);
    curr = curr.next;
  }
  return nodes;
}

export function insertNodesBefore(target: Node, nodes: Node[]) {
  for (const node of nodes) {
    target.insertBefore(node);
  }
}

export function prependChildNodes(parent: Node, nodes: Node[]) {
  for (let i = nodes.length - 1; i >= 0; i -= 1) {
    parent.prependChild(nodes[i]);
  }
}

export function updateNextLineNumbers(base: Node | null, diff: number) {
  if (!base || !base.parent || diff === 0) {
    return;
  }

  const walker = base.parent.walker();
  walker.resumeAt(base, true);

  let event;
  while ((event = walker.next())) {
    const { node, entering } = event;
    if (entering) {
      node.sourcepos![0][0] += diff;
      node.sourcepos![1][0] += diff;
    }
  }
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
