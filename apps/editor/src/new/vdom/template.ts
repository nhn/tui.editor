import html from 'htm/mini';
import isObject from 'tui-code-snippet/type/isObject';
import isBoolean from 'tui-code-snippet/type/isBoolean';
import { ComponentClass } from '@t/ui';
import { VNode } from './vnode';

function createTextNode(text: string) {
  return new VNode('TEXT_NODE', { nodeValue: text }, []);
}

function h(type: string | ComponentClass, props: Record<string, any>, ...children: VNode[]) {
  const flatted: VNode[] = [];

  children.forEach(child => {
    if (Array.isArray(child)) {
      child.forEach(vnode => {
        flatted.push(vnode);
      });
    } else if (!isBoolean(child)) {
      flatted.push(isObject(child) ? child : createTextNode(String(child)));
    }
  });

  return new VNode(type, props || {}, flatted);
}

export default html.bind(h);
