import { Node, Schema, ResolvedPos } from 'prosemirror-model';

export function findNodeBy(
  pos: ResolvedPos,
  condition: (node: Node, depth: number) => boolean
): { node: Node; depth: number } | null {
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

export function isInListNode({ nodes }: Schema, pos: ResolvedPos): boolean {
  return !!findNodeBy(pos, ({ type }: Node) => {
    const { listItem, bulletList, orderedList } = nodes;

    return type === listItem || type === bulletList || type === orderedList;
  });
}

export function isInTableNode({ nodes }: Schema, pos: ResolvedPos): boolean {
  return !!findNodeBy(pos, ({ type }: Node) => {
    const { tableHeadCell, tableBodyCell } = nodes;

    return type === tableHeadCell || type === tableBodyCell;
  });
}
