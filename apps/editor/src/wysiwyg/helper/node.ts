import { Node as ProsemirrorNode, ResolvedPos } from 'prosemirror-model';

export function findNodeBy(
  pos: ResolvedPos,
  condition: (node: ProsemirrorNode, depth: number) => boolean
) {
  let { depth } = pos;

  while (depth) {
    const node = pos.node(depth);

    if (condition(node, depth)) {
      return {
        node,
        depth,
        offset: depth > 0 ? pos.before(depth) : 0,
      };
    }

    depth -= 1;
  }

  return null;
}

export function isListNode({ type }: ProsemirrorNode) {
  return type.name === 'bulletList' || type.name === 'orderedList';
}

export function isInListNode(pos: ResolvedPos) {
  return !!findNodeBy(
    pos,
    ({ type }: ProsemirrorNode) =>
      type.name === 'listItem' || type.name === 'bulletList' || type.name === 'orderedList'
  );
}

export function isInTableNode(pos: ResolvedPos) {
  return !!findNodeBy(
    pos,
    ({ type }: ProsemirrorNode) => type.name === 'tableHeadCell' || type.name === 'tableBodyCell'
  );
}

export function findListItem(pos: ResolvedPos) {
  return findNodeBy(pos, ({ type }: ProsemirrorNode) => type.name === 'listItem');
}

export function createDOMInfoParsedRawHTML(tag: string) {
  return {
    tag,
    getAttrs(dom: Node | string) {
      const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');

      return {
        ...(rawHTML && { rawHTML }),
      };
    },
  };
}
