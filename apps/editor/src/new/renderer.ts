import { commit } from './vdom/commit';
import { buildVNode } from './vdom/render';
import { VNode } from './vdom/vnode';

let lastVNode: VNode | null = null;

export function rerender() {
  const root = lastVNode!;

  root.old = lastVNode;
  VNode.removalNodes = [];

  buildVNode(root);
  commit(root);
  lastVNode = root;
}

export function render(container: HTMLElement, vnode: VNode) {
  const root = new VNode(container.tagName.toLowerCase(), {}, [vnode]);

  root.old = lastVNode;
  root.firstChild = vnode;
  root.node = container;
  VNode.removalNodes = [];

  buildVNode(root);
  commit(root);
  lastVNode = root;
}
