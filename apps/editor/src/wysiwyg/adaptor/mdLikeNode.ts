import { MdLikeNode } from '@t/markdown';
import { ProsemirrorNode } from 'prosemirror-model';

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

export function createMdLikeNode(node: ProsemirrorNode) {
  const { attrs, type } = node;
  const nodeType = type.name;
  const mdLikeNode: MdLikeNode = {
    // @ts-ignore
    type,
    isWysiwyg: true,
    get firstChild() {
      return node.firstChild ? createMdLikeNode(node.firstChild) : null;
    },
    get lastChild() {
      return node.lastChild ? createMdLikeNode(node.lastChild) : null;
    },
    literal: !isContainer(nodeType) ? node.textContent : null
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
