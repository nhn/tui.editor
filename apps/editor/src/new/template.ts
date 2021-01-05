import html from 'htm/mini';
import isFunction from 'tui-code-snippet/type/isFunction';
import isString from 'tui-code-snippet/type/isString';
import { ComponentClass } from '@t/ui';
import { VNode } from './vdom/vnode';

function createTextNode(text: string) {
  return new VNode('TEXT_NODE', { nodeValue: text }, []);
}

function h(type: string | ComponentClass, props: Record<string, any> = {}, ...children: VNode[]) {
  const flatted: VNode[] = [];

  children.forEach(child => {
    if (Array.isArray(child)) {
      child.forEach(vnode => {
        flatted.push(vnode);
      });
    } else {
      flatted.push(isString(child) ? createTextNode(child) : child);
    }
  });

  const vnode = new VNode(type, props, flatted);

  if (!isFunction(type)) {
    vnode.ref = props.ref;
    delete props.ref;
  }
  return vnode;
}

export default html.bind(h);
