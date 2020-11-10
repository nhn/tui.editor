import { Node, Schema, ResolvedPos } from 'prosemirror-model';

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

export function isInListNode({ nodes }: Schema, pos: ResolvedPos) {
  const { listItem, bulletList, orderedList } = nodes;

  return !!findNodeBy(
    pos,
    ({ type }: Node) => type === listItem || type === bulletList || type === orderedList
  );
}

export function isInTableNode({ nodes }: Schema, pos: ResolvedPos) {
  const { tableHeadCell, tableBodyCell } = nodes;

  return !!findNodeBy(pos, ({ type }: Node) => type === tableHeadCell || type === tableBodyCell);
}
