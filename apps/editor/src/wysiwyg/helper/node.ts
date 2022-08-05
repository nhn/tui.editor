import { ProsemirrorNode, ResolvedPos } from 'prosemirror-model';
import { includes } from '@/utils/common';

type NodeAttrs = Record<string, any>;

interface CustomAttrs {
  htmlAttrs: { default: any };
  classNames: { default: null | string[] };
}

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

export function createCellAttrs(attrs: NodeAttrs) {
  return Object.keys(attrs).reduce<NodeAttrs>((acc, attrName) => {
    if (attrName !== 'rawHTML' && attrs[attrName]) {
      attrName = attrName === 'className' ? 'class' : attrName;
      acc[attrName] = attrs[attrName];
    }
    return acc;
  }, {});
}

export function createParsedCellDOM(tag: string) {
  return {
    tag,
    getAttrs(dom: Node | string) {
      return ['rawHTML', 'colspan', 'rowspan', 'extended'].reduce<NodeAttrs>((acc, attrName) => {
        const attrNameInDOM = attrName === 'rawHTML' ? 'data-raw-html' : attrName;
        const attrValue = (dom as HTMLElement).getAttribute(attrNameInDOM);

        if (attrValue) {
          acc[attrName] = includes(['rawHTML', 'extended'], attrName)
            ? attrValue
            : Number(attrValue);
        }
        return acc;
      }, {});
    },
  };
}

export function getDefaultCustomAttrs(): CustomAttrs {
  return {
    htmlAttrs: { default: null },
    classNames: { default: null },
  };
}

export function getCustomAttrs(attrs: Record<string, any>) {
  const { htmlAttrs, classNames } = attrs;

  return { ...htmlAttrs, class: classNames ? classNames.join(' ') : null };
}
