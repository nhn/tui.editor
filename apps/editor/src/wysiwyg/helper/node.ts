import { Node, Schema, ResolvedPos } from 'prosemirror-model';

function findNodeBy(pos: ResolvedPos, condition: (node: Node) => boolean): Node | null {
  for (let index = pos.depth; index > 0; index -= 1) {
    const node = pos.node(index);

    if (condition(node)) {
      return node;
    }
  }

  return null;
}

export function isInListNode({ nodes }: Schema, pos: ResolvedPos): boolean {
  return !!findNodeBy(pos, ({ type }: Node) => {
    const { listItem, bulletList, orderedList } = nodes;

    return type === listItem || type === bulletList || type === orderedList;
  });
}
