import isObject from 'tui-code-snippet/type/isObject';
import isNumber from 'tui-code-snippet/type/isNumber';
import { shallowEqual } from '@/utils/common';
import { isTextNode } from '@/utils/dom';
import { VNode } from './vnode';

type ConditionFn = (propName: string) => boolean;
type Props = Record<string, any>;

// @TODO: clearfy the type definition for CSSDeclaration

export function createNode(vnode: VNode) {
  let node: Node;

  if (vnode.type === 'TEXT_NODE') {
    node = document.createTextNode(vnode.props.nodeValue);
  } else {
    node = document.createElement(vnode.type as string);
    setProps(node, {}, vnode.props);
  }

  return node;
}

export function removeNode(vnode: VNode, parentNode: Node) {
  if (vnode.node) {
    parentNode.removeChild(vnode.node);
  } else {
    removeNode(vnode.firstChild!, parentNode);
  }
}

export function innerDiff(node: Node, prevProps: Props, nextProps: Props) {
  Object.keys(prevProps).forEach((propName) => {
    if (/^on/.test(propName)) {
      if (!nextProps[propName] || prevProps[propName] !== nextProps[propName]) {
        const eventName = propName.slice(2).toLowerCase();

        node.removeEventListener(eventName, prevProps[propName]);
      }
    } else if (propName !== 'children' && !nextProps[propName] && !isTextNode(node)) {
      (node as Element).removeAttribute(propName);
    }
  });

  setProps(
    node,
    prevProps,
    nextProps,
    (propName) => !shallowEqual(prevProps[propName], nextProps[propName])
  );
}

const reNonDimension = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

function setProps(node: Node, prevProps: Props, props: Props, condition?: ConditionFn) {
  Object.keys(props).forEach((propName) => {
    if (!condition || condition(propName)) {
      if (/^on/.test(propName)) {
        const eventName = propName.slice(2).toLowerCase();

        node.addEventListener(eventName, props[propName]);
      } else if (propName === 'nodeValue') {
        node[propName] = props[propName];
      } else if (propName === 'style' && isObject(props[propName])) {
        setStyleProps(node as HTMLElement, prevProps[propName], props[propName]);
      } else if (propName !== 'children') {
        if (props[propName] === false) {
          (node as HTMLElement).removeAttribute(propName);
        } else {
          (node as HTMLElement).setAttribute(propName, props[propName]);
        }
      }
    }
  });
}
function setStyleProps(node: HTMLElement, prevStyleProps: Props | null, styleProps: Props) {
  if (prevStyleProps) {
    Object.keys(prevStyleProps).forEach((styleProp) => {
      // @ts-ignore
      node.style[styleProp] = '';
    });
  }

  Object.keys(styleProps).forEach((styleProp) => {
    const value = styleProps[styleProp];

    // @ts-ignore
    node.style[styleProp] =
      isNumber(value) && !reNonDimension.test(styleProp) ? `${value}px` : value;
  });
}
