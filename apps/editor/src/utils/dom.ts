import { includes } from './common';
import toArray from 'tui-code-snippet/collection/toArray';
import isArray from 'tui-code-snippet/type/isArray';

export function isPositionInBox(style: CSSStyleDeclaration, offsetX: number, offsetY: number) {
  const rect = {
    left: parseInt(style.left, 10),
    top: parseInt(style.top, 10),
    width: parseInt(style.width, 10),
    height: parseInt(style.height, 10)
  };

  return (
    offsetX >= rect.left &&
    offsetX <= rect.left + rect.width &&
    offsetY >= rect.top &&
    offsetY <= rect.top + rect.height
  );
}

const CLS_PREFIX = 'tui-md-';

export function cls(...names: string[]) {
  return names.map(className => `${CLS_PREFIX}${className}`).join(' ');
}

export function isTextNode(node: Node) {
  return node?.nodeType === Node.TEXT_NODE;
}

export function isSpecificNode(node: Node, ...names: string[]) {
  return includes(names, node.nodeName);
}

export function isElemNode(node: Node) {
  return node && node.nodeType === Node.ELEMENT_NODE;
}

export function findNodes(element: Element, selector: string) {
  const nodeList = toArray(element.querySelectorAll(selector));

  if (nodeList.length) {
    return nodeList;
  }

  return [];
}

export function appendNodes(node: Node, nodesToAppend: Node | Node[]) {
  nodesToAppend = isArray(nodesToAppend) ? toArray(nodesToAppend) : [nodesToAppend];

  nodesToAppend.forEach(nodeToAppend => {
    node.appendChild(nodeToAppend);
  });
}

export function insertBeforeNode(insertedNode: Node, node: Node) {
  if (node.parentNode) {
    node.parentNode.insertBefore(insertedNode, node);
  }
}

export function removeNode(node: Node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

export function unwrapNode(node: Node) {
  const result = [];

  while (node.firstChild) {
    result.push(node.firstChild);

    if (node.parentNode) {
      node.parentNode.insertBefore(node.firstChild, node);
    }
  }

  removeNode(node);

  return result;
}
