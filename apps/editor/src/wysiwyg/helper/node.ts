import { Node, ResolvedPos, Slice } from 'prosemirror-model';
import { Transform } from 'prosemirror-transform';

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

export function findListItem(pos: ResolvedPos) {
  return findNodeBy(pos, ({ type }: Node) => type.name === 'listItem');
}

export function fitSlice(nodeType: any, slice: Slice) {
  const node = nodeType.createAndFill();
  const tr = new Transform(node).replace(0, node.content.size, slice);

  return tr.doc;
}
