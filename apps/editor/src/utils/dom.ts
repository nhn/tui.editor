import toArray from 'tui-code-snippet/collection/toArray';
import isArray from 'tui-code-snippet/type/isArray';
import isString from 'tui-code-snippet/type/isString';
import isUndefined from 'tui-code-snippet/type/isUndefined';
import hasClass from 'tui-code-snippet/domUtil/hasClass';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';
import matches from 'tui-code-snippet/domUtil/matches';

export function isPositionInBox(style: CSSStyleDeclaration, offsetX: number, offsetY: number) {
  const left = parseInt(style.left, 10);
  const top = parseInt(style.top, 10);
  const width =
    parseInt(style.width, 10) + parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);
  const height =
    parseInt(style.height, 10) + parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10);

  return offsetX >= left && offsetX <= left + width && offsetY >= top && offsetY <= top + height;
}

const CLS_PREFIX = 'tui-md-';

export function cls(...names: string[]) {
  return names.map((className) => `${CLS_PREFIX}${className}`).join(' ');
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

  nodesToAppend.forEach((nodeToAppend) => {
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

export function toggleClass(element: Element, className: string, state?: boolean) {
  if (isUndefined(state)) {
    state = !hasClass(element, className);
  }
  const toggleFn = state ? addClass : removeClass;

  toggleFn(element, className);
}

export function createElementWith(contents: string | HTMLElement, target: HTMLElement) {
  const container = document.createElement('div');

  if (isString(contents)) {
    container.innerHTML = contents;
  } else {
    container.appendChild(contents);
  }

  const { firstChild } = container;

  if (target) {
    target.appendChild(firstChild!);
  }

  return firstChild;
}

export function getOuterWidth(el: HTMLElement) {
  const computed = window.getComputedStyle(el);

  return (
    ['margin-left', 'margin-right'].reduce(
      (acc, type) => acc + parseInt(computed.getPropertyValue(type), 10),
      0
    ) + el.offsetWidth
  );
}

export function closest(node: Node, found: string | Node) {
  let condition;

  if (isString(found)) {
    condition = (target: Node) => matches(target as Element, found);
  } else {
    condition = (target: Node) => target === found;
  }

  while (node && node !== document) {
    if (isElemNode(node) && condition(node)) {
      return node;
    }

    node = node.parentNode!;
  }

  return null;
}

export function getTotalOffset(el: HTMLElement, root: HTMLElement) {
  let offsetTop = 0;
  let offsetLeft = 0;

  while (el && el !== root) {
    const { offsetTop: top, offsetLeft: left, offsetParent } = el;

    offsetTop += top;
    offsetLeft += left;
    if (offsetParent === root.offsetParent) {
      break;
    }
    el = el.offsetParent as HTMLElement;
  }
  return { offsetTop, offsetLeft };
}
