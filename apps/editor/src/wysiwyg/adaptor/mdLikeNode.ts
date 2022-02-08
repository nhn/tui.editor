import { MdNodeType } from '@toast-ui/toastmark';
import { Mark, Node as ProsemirrorNode } from 'prosemirror-model';
import { MdLikeNode } from '@t/markdown';
import { includes } from '@/utils/common';

export function isPmNode(node: ProsemirrorNode | Mark): node is ProsemirrorNode {
  return node instanceof ProsemirrorNode;
}

export function isContainer(type: string) {
  const containerTypes = [
    'document',
    'blockQuote',
    'bulletList',
    'orderedList',
    'listItem',
    'paragraph',
    'heading',
    'emph',
    'strong',
    'strike',
    'link',
    'image',
    'table',
    'tableHead',
    'tableBody',
    'tableRow',
    'tableHeadCell',
    'tableBodyCell',
  ];

  return includes(containerTypes, type);
}

export function createMdLikeNode(node: ProsemirrorNode | Mark): MdLikeNode {
  const { attrs, type } = node;
  const nodeType = type.name;
  const mdLikeNode: MdLikeNode = {
    type: nodeType as MdNodeType,
    wysiwygNode: true,
    literal: !isContainer(nodeType) && isPmNode(node) ? node.textContent : null,
  };

  const nodeTypeMap = {
    heading: { level: attrs.level },
    link: { destination: attrs.linkUrl, title: attrs.title },
    image: { destination: attrs.imageUrl },
    codeBlock: { info: attrs.language },
    bulletList: { type: 'list', listData: { type: 'bullet' } },
    orderedList: { type: 'list', listData: { type: 'ordered', start: attrs.order } },
    listItem: { type: 'item', listData: { task: attrs.task, checked: attrs.checked } },
    tableHeadCell: { type: 'tableCell', cellType: 'head', align: attrs.align },
    tableBodyCell: { type: 'tableCell', cellType: 'body', align: attrs.align },
    customBlock: { info: attrs.info },
  } as const;
  const nodeInfo = nodeTypeMap[nodeType as keyof typeof nodeTypeMap];
  const attributes = { ...mdLikeNode, ...nodeInfo };

  // html block, inline node
  const { htmlAttrs, childrenHTML } = node.attrs;

  if (htmlAttrs) {
    return {
      ...attributes,
      attrs: htmlAttrs,
      childrenHTML,
    };
  }

  return attributes;
}
