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

export function createMdLikeNode(node: ProsemirrorNode | Mark) {
  const { attrs, type } = node;
  const nodeType = type.name;
  const mdLikeNode: MdLikeNode = {
    type: nodeType as MdNodeType,
    isWysiwyg: true,
    literal: !isContainer(nodeType) && isNode(node) ? node.textContent : null
  };

  switch (nodeType) {
    case 'heading':
      mdLikeNode.level = attrs.level;
      break;
    case 'link':
      mdLikeNode.destination = attrs.linkUrl;
      mdLikeNode.title = attrs.linkText;
      break;
    case 'image':
      mdLikeNode.destination = attrs.linkUrl;
      break;
    case 'codeBlock':
      mdLikeNode.info = attrs.language;
      break;
    case 'bulletList':
      mdLikeNode.type = 'list';
      mdLikeNode.listData = {
        type: 'bullet'
      };
      break;
    case 'orderedList':
      mdLikeNode.type = 'list';
      mdLikeNode.listData = {
        type: 'ordered',
        start: attrs.order
      };
      break;
    case 'listItem':
      mdLikeNode.type = 'item';
      mdLikeNode.listData = {
        task: attrs.task,
        checked: attrs.checked
      };
      break;
    case 'customBlock':
      mdLikeNode.info = attrs.info;
      break;
    // @TODO: table
    // case 'table':
    // case 'tableHead':
    // case 'tableBody':
    // case 'tableRow':
    // case 'tableCell':
    // case 'tableDelimRow':
    default:
  }
  return mdLikeNode;
}
