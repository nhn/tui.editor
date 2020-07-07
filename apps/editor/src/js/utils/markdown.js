import { includes } from './common';

export function hasImageOrCodeBlockNode(mdNode) {
  while (mdNode) {
    if (includes(['image', 'codeBlock'], mdNode.type)) {
      return true;
    }
    mdNode = mdNode.firstChild;
  }
  return false;
}

export function hasSameLineParent(mdNode) {
  return (
    mdNode.parent &&
    mdNode.parent.type !== 'document' &&
    mdNode.parent.sourcepos[0][0] === mdNode.sourcepos[0][0]
  );
}

export function hasSpecificTypeAncestor(mdNode, ...types) {
  while (mdNode.parent && mdNode.parent.type !== 'document') {
    if (includes(types, mdNode.parent.type)) {
      return true;
    }
    mdNode = mdNode.parent;
  }
  return false;
}

export function isEmptyLineNode(text, mdNode) {
  return !text.trim() && !hasImageOrCodeBlockNode(mdNode);
}

export function getMdStartLine(mdNode) {
  return mdNode.sourcepos[0][0];
}

export function getMdEndLine(mdNode) {
  return mdNode.sourcepos[1][0];
}

export function getMdStartCh(mdNode) {
  return mdNode.sourcepos[0][1];
}

export function getMdEndCh(mdNode) {
  return mdNode.sourcepos[1][1];
}

export function isMultiLineNode(mdNode) {
  const { type } = mdNode;

  return type === 'codeBlock' || type === 'paragraph';
}

export function isHtmlNode(mdNode) {
  const { type } = mdNode;

  return type === 'htmlBlock' || type === 'htmlInline';
}

export function isStyledTextNode(mdNode) {
  const { type } = mdNode;

  return type === 'strike' || type === 'strong' || type === 'emph';
}

export function isListItemNode(mdNode) {
  return mdNode.type === 'item';
}

export function isInlineNode(mdNode) {
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

export function getLastLeafNode(mdNode) {
  while (mdNode.lastChild) {
    mdNode = mdNode.lastChild;
  }
  return mdNode;
}

export function findClosestNode(mdNode, condition, includeSelf = true) {
  mdNode = includeSelf ? mdNode : mdNode.parent;

  while (mdNode && mdNode.type !== 'document') {
    if (condition(mdNode)) {
      return mdNode;
    }
    mdNode = mdNode.parent;
  }
  return null;
}

export function traverseParentNodes(mdNode, iteratee, includeSelf = true) {
  mdNode = includeSelf ? mdNode : mdNode.parent;

  while (mdNode && mdNode.type !== 'document') {
    iteratee(mdNode);
    mdNode = mdNode.parent;
  }
}

export function addChPos(originPos, addedCh) {
  return {
    line: originPos.line,
    ch: originPos.ch + addedCh
  };
}

export function setChPos(originPos, newCh) {
  return {
    line: originPos.line,
    ch: newCh
  };
}
