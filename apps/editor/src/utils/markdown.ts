import {
  CodeBlockMdNode,
  CustomBlockMdNode,
  ListItemMdNode,
  MdNode,
  MdNodeType,
  MdPos,
  TableCellMdNode,
} from '@t/markdown';
import { includes } from './common';

export function hasSpecificTypeAncestor(mdNode: MdNode, ...types: MdNodeType[]) {
  while (mdNode && mdNode.parent && mdNode.parent.type !== 'document') {
    if (includes(types, mdNode.parent.type)) {
      return true;
    }
    mdNode = mdNode.parent;
  }
  return false;
}

export function getMdStartLine(mdNode: MdNode) {
  return mdNode.sourcepos![0][0];
}

export function getMdEndLine(mdNode: MdNode) {
  return mdNode.sourcepos![1][0];
}

export function getMdStartCh(mdNode: MdNode) {
  return mdNode.sourcepos![0][1];
}

export function getMdEndCh(mdNode: MdNode) {
  return mdNode.sourcepos![1][1];
}

export function isMultiLineNode(mdNode: MdNode) {
  const { type } = mdNode;

  return type === 'codeBlock' || type === 'paragraph';
}

export function isHtmlNode(mdNode: MdNode) {
  const { type } = mdNode;

  return type === 'htmlBlock' || type === 'htmlInline';
}

export function isStyledInlineNode(mdNode: MdNode) {
  const { type } = mdNode;

  return (
    type === 'strike' ||
    type === 'strong' ||
    type === 'emph' ||
    type === 'code' ||
    type === 'link' ||
    type === 'image'
  );
}

export function isCodeBlockNode(mdNode: MdNode): mdNode is CodeBlockMdNode {
  return mdNode && mdNode.type === 'codeBlock';
}

export function isCustomBlockNode(mdNode: MdNode): mdNode is CustomBlockMdNode {
  return mdNode && mdNode.type === 'customBlock';
}

export function isListNode(mdNode: MdNode): mdNode is ListItemMdNode {
  return mdNode && (mdNode.type === 'item' || mdNode.type === 'list');
}

export function isOrderedListNode(mdNode: MdNode): mdNode is ListItemMdNode {
  return isListNode(mdNode) && mdNode.listData.type === 'ordered';
}

export function isTableCellNode(mdNode: MdNode): mdNode is TableCellMdNode {
  return mdNode && (mdNode.type === 'tableCell' || mdNode.type === 'tableDelimCell');
}

export function isInlineNode(mdNode: MdNode) {
  switch (mdNode.type) {
    case 'code':
    case 'text':
    case 'emph':
    case 'strong':
    case 'strike':
    case 'link':
    case 'image':
    case 'htmlInline':
    case 'linebreak':
    case 'softbreak':
    case 'customInline':
      return true;
    default:
      return false;
  }
}

export function findClosestNode(
  mdNode: MdNode,
  condition: (targetMdNode: MdNode) => boolean,
  includeSelf = true
) {
  mdNode = includeSelf ? mdNode : mdNode.parent!;

  while (mdNode && mdNode.type !== 'document') {
    if (condition(mdNode)) {
      return mdNode;
    }
    mdNode = mdNode.parent!;
  }
  return null;
}

export function traverseParentNodes(
  mdNode: MdNode,
  iteratee: (targetNode: MdNode) => void,
  includeSelf = true
) {
  mdNode = includeSelf ? mdNode! : mdNode.parent!;

  while (mdNode && mdNode.type !== 'document') {
    iteratee(mdNode);
    mdNode = mdNode.parent!;
  }
}

export function addOffsetPos(originPos: MdPos, offset: number): MdPos {
  return [originPos[0], originPos[1] + offset];
}

export function setOffsetPos(originPos: MdPos, newOffset: number): MdPos {
  return [originPos[0], newOffset];
}
