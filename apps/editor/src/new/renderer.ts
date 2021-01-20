import { Component } from '@t/ui';
import { commit } from './vdom/commit';
import { buildVNode } from './vdom/render';
import { VNode } from './vdom/vnode';

function destroy(vnode: VNode) {
  vnode.effect = 'D';
  VNode.removalNodes = [vnode];
  commit();
  VNode.removalNodes = [];
}

export function rerender(comp: Component) {
  const root = comp.vnode;

  root.effect = 'U';
  root.old = root;

  // skip for unnecessary reconciliation
  if (root.next) {
    root.next.skip = true;
  }
  VNode.removalNodes = [];

  buildVNode(root);
  commit(root);

  if (root.next) {
    root.next.skip = false;
  }
}

export function render(container: HTMLElement, vnode: VNode) {
  const root = new VNode(container.tagName.toLowerCase(), {}, [vnode]);

  root.node = container;
  VNode.removalNodes = [];

  buildVNode(root);
  commit(root);

  return () => destroy(root.firstChild!);
}
