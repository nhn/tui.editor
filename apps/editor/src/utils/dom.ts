import toArray from 'tui-code-snippet/collection/toArray';
import isArray from 'tui-code-snippet/type/isArray';
import isString from 'tui-code-snippet/type/isString';
import matches from 'tui-code-snippet/domUtil/matches';
import isUndefined from 'tui-code-snippet/type/isUndefined';
import hasClass from 'tui-code-snippet/domUtil/hasClass';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';

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

export function closest<T extends Node>(node: Node, found: string | Node) {
  let condition;

  if (isString(found)) {
    condition = (target: Node) => matches(target as Element, found);
  } else {
    condition = (target: Node) => target === found;
  }

  while (node && node !== document) {
    if (isElemNode(node) && condition(node)) {
      return node as T;
    }

    node = node.parentNode!;
  }

  return null;
}

export function toggleClass(element: Element, className: string, state?: boolean) {
  if (isUndefined(state)) {
    state = !hasClass(element, className);
  }
  const toggleFn = state ? addClass : removeClass;

  toggleFn(element, className);
}
