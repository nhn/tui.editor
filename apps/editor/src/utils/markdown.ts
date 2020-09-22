import { MdNode, MdNodeType, MdPos } from '@t/markdown';
import { includes } from './common';

export function hasImageOrCodeBlockNode(mdNode: MdNode) {
  while (mdNode) {
    if (includes(['image', 'codeBlock'], mdNode.type)) {
      return true;
    }
    mdNode = mdNode.firstChild!;
  }
  return false;
}

export function hasSameLineParent(mdNode: MdNode) {
  return (
    mdNode.parent &&
    mdNode.parent.type !== 'document' &&
    mdNode.parent.sourcepos![0][0] === mdNode.sourcepos![0][0]
  );
}

export function hasSpecificTypeAncestor(mdNode: MdNode, ...types: MdNodeType[]) {
  while (mdNode.parent && mdNode.parent.type !== 'document') {
    if (includes(types, mdNode.parent.type)) {
      return true;
    }
    mdNode = mdNode.parent;
  }
  return false;
}

export function isEmptyLineNode(text: string, mdNode: MdNode) {
  return !text.trim() && !hasImageOrCodeBlockNode(mdNode);
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

export function isStyledTextNode(mdNode: MdNode) {
  const { type } = mdNode;

  return type === 'strike' || type === 'strong' || type === 'emph';
}

export function isListItemNode(mdNode: MdNode) {
  return mdNode.type === 'item';
}

export function isTableCellNode(mdNode: MdNode) {
  const { type } = mdNode;

  return type === 'tableCell' || type === 'tableDelimCell';
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
      return true;
    default:
      return false;
  }
}

export function getLastLeafNode(mdNode: MdNode) {
  while (mdNode.lastChild) {
    mdNode = mdNode.lastChild;
  }
  return mdNode;
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

// @TODO: deprecated
// @ts-ignore
export function addChPos(originPos, addedCh) {
  return {
    line: originPos.line,
    ch: originPos.ch + addedCh
  };
}

// @TODO: deprecated
// @ts-ignore
export function setChPos(originPos, newCh) {
  return {
    line: originPos.line,
    ch: newCh
  };
}

export function addOffsetPos(originPos: MdPos, offset: number): MdPos {
  return [originPos[0], originPos[1] + offset];
}

export function setOffsetPos(originPos: MdPos, newOffset: number): MdPos {
  return [originPos[0], newOffset];
}
