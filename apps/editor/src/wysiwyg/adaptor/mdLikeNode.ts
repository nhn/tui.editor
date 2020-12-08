import { Mark, Node as ProsemirrorNode } from 'prosemirror-model';
import { MdLikeNode, MdNodeType } from '@t/markdown';

export function isNode(node: ProsemirrorNode | Mark): node is ProsemirrorNode {
  return node instanceof ProsemirrorNode;
}

export function isContainer(type: string) {
  switch (type) {
    case 'document':
    case 'blockQuote':
    case 'list':
    case 'item':
    case 'paragraph':
    case 'heading':
    case 'emph':
    case 'strong':
    case 'strike':
    case 'link':
    case 'image':
    case 'table':
    case 'tableHead':
    case 'tableBody':
    case 'tableRow':
    case 'tableCell':
    case 'tableDelimRow':
      return true;
    default:
      return false;
  }
}

export function createMdLikeNode(node: ProsemirrorNode | Mark): MdLikeNode {
  const { attrs, type } = node;
  const nodeType = type.name;
  const mdLikeNode: MdLikeNode = {
    type: nodeType as MdNodeType,
    isWysiwyg: true,
    literal: !isContainer(nodeType) && isNode(node) ? node.textContent : null
  };

  switch (nodeType) {
    case 'heading':
      return { ...mdLikeNode, level: attrs.level };
    case 'link':
      return { ...mdLikeNode, destination: attrs.linkUrl, title: attrs.linkText };
    case 'image':
      return { ...mdLikeNode, destination: attrs.linkUrl };
    case 'codeBlock':
      return { ...mdLikeNode, info: attrs.language };
    case 'bulletList':
      return { ...mdLikeNode, type: 'list', listData: { type: 'bullet' } };
    case 'orderedList':
      return { ...mdLikeNode, type: 'list', listData: { type: 'ordered', start: attrs.order } };
    case 'listItem':
      return {
        ...mdLikeNode,
        type: 'item',
        listData: { task: attrs.task, checked: attrs.checked }
      };
    case 'customBlock':
      return { ...mdLikeNode, info: attrs.info };
    case 'tableHeadCell':
      return { ...mdLikeNode, type: 'tableCell', cellType: 'head', align: attrs.align };
    case 'tableBodyCell':
      return { ...mdLikeNode, type: 'tableCell', cellType: 'body', align: attrs.align };
    default:
  }
  return mdLikeNode;
}
