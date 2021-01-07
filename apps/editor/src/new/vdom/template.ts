import html from 'htm/mini';
import isBoolean from 'tui-code-snippet/type/isBoolean';
import isString from 'tui-code-snippet/type/isString';
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
    } else {
      let vnode = child;

      // eslint-disable-next-line no-eq-null,eqeqeq
      if (isBoolean(child) || child == null) {
        vnode = createTextNode(String(''));
      } else if (isString(child)) {
        vnode = createTextNode(String(child));
      }
      flatted.push(vnode);
    }
  });

  return new VNode(type, props || {}, flatted);
}

export default html.bind(h);
