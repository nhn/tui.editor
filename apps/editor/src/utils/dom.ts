import toArray from 'tui-code-snippet/collection/toArray';
import isArray from 'tui-code-snippet/type/isArray';
import isString from 'tui-code-snippet/type/isString';
import isUndefined from 'tui-code-snippet/type/isUndefined';
import hasClass from 'tui-code-snippet/domUtil/hasClass';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';
import matches from 'tui-code-snippet/domUtil/matches';
import { ALTERNATIVE_TAG_FOR_BR, HTML_TAG, OPEN_TAG, reBR } from './constants';
import { isNil } from './common';

export function isPositionInBox(style: CSSStyleDeclaration, offsetX: number, offsetY: number) {
  const left = parseInt(style.left, 10);
  const top = parseInt(style.top, 10);
  const width =
    parseInt(style.width, 10) + parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);
  const height =
    parseInt(style.height, 10) + parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10);

  return offsetX >= left && offsetX <= left + width && offsetY >= top && offsetY <= top + height;
}

const CLS_PREFIX = 'toastui-editor-';

export function cls(...names: (string | [boolean, string])[]) {
  const result = [];

  for (const name of names) {
    let className: string | null;

    if (Array.isArray(name)) {
      className = name[0] ? name[1] : null;
    } else {
      className = name;
    }

    if (className) {
      result.push(`${CLS_PREFIX}${className}`);
    }
  }

  return result.join(' ');
}

export function clsWithMdPrefix(...names: string[]) {
  return names.map((className) => `${CLS_PREFIX}md-${className}`).join(' ');
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

export function createElementWith(contents: string | HTMLElement, target?: HTMLElement) {
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

export function finalizeHtml(html: Element, needHtmlText: boolean) {
  let result;

  if (needHtmlText) {
    result = html.innerHTML;
  } else {
    const frag = document.createDocumentFragment();
    const childNodes = toArray(html.childNodes);
    const { length } = childNodes;

    for (let i = 0; i < length; i += 1) {
      frag.appendChild(childNodes[i]);
    }
    result = frag;
  }

  return result;
}

export function empty(node: Node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export function appendNode(node: Element, appended: string | ArrayLike<Element> | Element) {
  if (isString(appended)) {
    node.insertAdjacentHTML('beforeend', appended);
  } else {
    const nodes: Element[] = (appended as ArrayLike<Element>).length
      ? toArray(appended as ArrayLike<Element>)
      : [appended as Element];

    for (let i = 0, len = nodes.length; i < len; i += 1) {
      node.appendChild(nodes[i]);
    }
  }
}

export function prependNode(node: Element, appended: string | ArrayLike<Element> | Element) {
  if (isString(appended)) {
    node.insertAdjacentHTML('afterbegin', appended);
  } else {
    const nodes: Element[] = (appended as ArrayLike<Element>).length
      ? toArray(appended as ArrayLike<Element>)
      : [appended as Element];

    for (let i = nodes.length - 1, len = 0; i >= len; i -= 1) {
      node.insertBefore(nodes[i], node.firstChild);
    }
  }
}

export function setAttributes(attributes: Record<string, any>, element: HTMLElement) {
  Object.keys(attributes).forEach((attrName) => {
    if (isNil(attributes[attrName])) {
      element.removeAttribute(attrName);
    } else {
      element.setAttribute(attrName, attributes[attrName]);
    }
  });
}

export function replaceBRWithEmptyBlock(html: string) {
  // remove br in paragraph to compatible with markdown
  let replacedHTML = html.replace(/<p><br\s*\/*><\/p>/gi, '<p></p>');
  const reHTMLTag = new RegExp(HTML_TAG, 'ig');
  const htmlTagMatched = replacedHTML.match(reHTMLTag);

  htmlTagMatched?.forEach((htmlTag, index) => {
    if (reBR.test(htmlTag)) {
      let alternativeTag = ALTERNATIVE_TAG_FOR_BR;

      if (index) {
        const prevTag = htmlTagMatched[index - 1];
        const openTagMatched = prevTag.match(OPEN_TAG);

        if (openTagMatched && !/br/i.test(openTagMatched[1])) {
          const [, tagName] = openTagMatched;

          alternativeTag = `</${tagName}><${tagName}>`;
        }
      }
      replacedHTML = replacedHTML.replace(reBR, alternativeTag);
    }
  });

  return replacedHTML;
}

export function removeProseMirrorHackNodes(html: string) {
  const reProseMirrorImage = /<img class="ProseMirror-separator" alt="">/g;
  const reProseMirrorTrailingBreak = / class="ProseMirror-trailingBreak"/g;

  let resultHTML = html;

  resultHTML = resultHTML.replace(reProseMirrorImage, '');
  resultHTML = resultHTML.replace(reProseMirrorTrailingBreak, '');

  return resultHTML;
}
