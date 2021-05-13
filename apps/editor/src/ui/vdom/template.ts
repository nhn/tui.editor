import html from './htm';
import isBoolean from 'tui-code-snippet/type/isBoolean';
import isString from 'tui-code-snippet/type/isString';
import isNumber from 'tui-code-snippet/type/isNumber';
import { ComponentClass } from '@t/ui';
import { VNode } from './vnode';

function createTextNode(text: string) {
  return new VNode('TEXT_NODE', { nodeValue: text }, []);
}

function excludeUnnecessaryChild(child: VNode, flatted: VNode[]) {
  let vnode: VNode | null = child;

  // eslint-disable-next-line no-eq-null,eqeqeq
  if (isBoolean(child) || child == null) {
    vnode = null;
  } else if (isString(child) || isNumber(child)) {
    vnode = createTextNode(String(child));
  }
  if (vnode) {
    flatted.push(vnode);
  }
}

function h(type: string | ComponentClass, props: Record<string, any>, ...children: VNode[]) {
  const flatted: VNode[] = [];

  children.forEach((child) => {
    if (Array.isArray(child)) {
      child.forEach((vnode) => {
        excludeUnnecessaryChild(vnode, flatted);
      });
    } else {
      excludeUnnecessaryChild(child, flatted);
    }
  });

  return new VNode(type, props || {}, flatted);
}

// @ts-ignore
export default html.bind(h) as (strings: TemplateStringsArray, ...values: any[]) => VNode;
