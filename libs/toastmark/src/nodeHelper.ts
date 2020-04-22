import { Node, getNodeById, removeNodeById } from './commonmark/node';
import { Position } from './toastmark';

export const enum Compare {
  LT = 1,
  EQ = 0,
  GT = -1
}

function comparePos(p1: Position, p2: Position) {
  if (p1[0] < p2[0]) {
    return Compare.LT;
  }
  if (p1[0] > p2[0]) {
    return Compare.GT;
  }
  if (p1[1] < p2[1]) {
    return Compare.LT;
  }
  if (p1[1] > p2[1]) {
    return Compare.GT;
  }
  return Compare.EQ;
}

function compareRangeAndPos([startPos, endPos]: [Position, Position], pos: Position) {
  if (comparePos(endPos, pos) === Compare.LT) {
    return Compare.LT;
  }
  if (comparePos(startPos, pos) === Compare.GT) {
    return Compare.GT;
  }
  return Compare.EQ;
}

export function getAllParents(node: Node) {
  const parents = [];
  while (node.parent) {
    parents.push(node.parent);
    node = node.parent;
  }
  return parents.reverse();
}

export function removeNextUntil(node: Node, last: Node) {
  if (node.parent !== last.parent || node === last) {
    return;
  }

  let next = node.next;
  while (next && next !== last) {
    const temp = next.next;
    for (const type of ['parent', 'prev', 'next'] as const) {
      if (next[type]) {
        removeNodeById(next[type]!.id);
        next[type] = null;
      }
    }
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

function compareRangeAndLine([startPos, endPos]: [Position, Position], line: number) {
  if (endPos[0] < line) {
    return Compare.LT;
  }
  if (startPos[0] > line) {
    return Compare.GT;
  }
  return Compare.EQ;
}

export function findChildNodeAtLine(parent: Node, line: number) {
  let node = parent.firstChild;
  while (node) {
    const comp = compareRangeAndLine(node.sourcepos!, line);
    if (comp === Compare.EQ) {
      return node;
    }
    if (comp === Compare.GT) {
      // To consider that top line is blank line
      return node.prev || node;
    }
    node = node.next;
  }
  return parent.lastChild;
}

function lastLeafNode(node: Node) {
  while (node.lastChild) {
    node = node.lastChild;
  }
  return node;
}

function sameLineTopAncestor(node: Node) {
  while (
    node.parent &&
    node.parent.type !== 'document' &&
    node.parent.sourcepos![0][0] === node.sourcepos![0][0]
  ) {
    node = node.parent;
  }
  return node;
}

export function findFirstNodeAtLine(parent: Node, line: number) {
  let node = parent.firstChild;
  let prev: Node | null = null;
  while (node) {
    const comp = compareRangeAndLine(node.sourcepos!, line);
    if (comp === Compare.EQ) {
      if (node.sourcepos![0][0] === line || !node.firstChild) {
        return node;
      }
      prev = node;
      node = node.firstChild;
    } else if (comp === Compare.GT) {
      break;
    } else {
      prev = node;
      node = node.next;
    }
  }

  if (prev) {
    return sameLineTopAncestor(lastLeafNode(prev));
  }
  return null;
}

export function findNodeAtPosition(parent: Node, pos: Position) {
  let node: Node | null = parent;
  let prev: Node | null = null;

  while (node) {
    const comp = compareRangeAndPos(node.sourcepos!, pos);
    if (comp === Compare.EQ) {
      if (node.firstChild) {
        prev = node;
        node = node.firstChild;
      } else {
        return node;
      }
    } else if (comp === Compare.GT) {
      return prev;
    } else if (node.next) {
      node = node.next;
    } else {
      return prev;
    }
  }
  return node;
}

export function toString(node: Node | null) {
  if (!node) {
    return 'null';
  }
  return `type: ${node.type}, sourcepos: ${node.sourcepos}, firstChild: ${node.firstChild &&
    node.firstChild.type}, lastChild: ${node.lastChild && node.lastChild.type}, prev: ${node.prev &&
    node.prev.type}, next: ${node.next && node.next.type}`;
}

export function findNodeById(id: number) {
  return getNodeById(id) || null;
}

export function invokeNextUntil(callback: Function, start: Node | null, end: Node | null = null) {
  if (start) {
    const walker = start.walker();
    while (start && start !== end) {
      callback(start);
      const next = walker.next();
      if (next) {
        start = next.node;
      } else {
        break;
      }
    }
  }
}

export function isUnlinked(id: number) {
  let node = findNodeById(id);

  if (!node) {
    return true;
  }

  while (node && node.type !== 'document') {
    // eslint-disable-next-line no-loop-func
    if (!node.parent && !node.prev && !node.next) {
      return true;
    }
    node = node.parent!;
  }
  return false;
}
