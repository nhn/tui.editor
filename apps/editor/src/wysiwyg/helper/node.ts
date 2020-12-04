import { Node, ResolvedPos } from 'prosemirror-model';

export function findNodeBy(pos: ResolvedPos, condition: (node: Node, depth: number) => boolean) {
  let { depth } = pos;

  while (depth) {
    const node = pos.node(depth);

    if (condition(node, depth)) {
      return { node, depth };
    }

    depth -= 1;
  }

  return null;
}

export function isInListNode(pos: ResolvedPos) {
  return !!findNodeBy(
    pos,
    ({ type }: Node) =>
      type.name === 'listItem' || type.name === 'bulletList' || type.name === 'orderedList'
  );
}

export function isInTableNode(pos: ResolvedPos) {
  return !!findNodeBy(
    pos,
    ({ type }: Node) => type.name === 'tableHeadCell' || type.name === 'tableBodyCell'
  );
}
