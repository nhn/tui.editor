import isFunction from 'tui-code-snippet/type/isFunction';
import { innerDiff, removeNode } from './dom';
import { createComponent } from './render';
import { VNode } from './vnode';

export function commit(vnode: VNode) {
  VNode.removalNodes.forEach(removalNode => diff(removalNode, true));
  vnode = vnode!.firstChild!;

  let next;
  const walker = vnode.walker();

  while ((next = walker.walk())) {
    vnode = next.vnode!;
    if (next.entering) {
      diff(vnode);
    } else if (isFunction(vnode.type)) {
      const comp = createComponent(vnode.type, vnode.props);

      // lifecycle method
      if (!vnode.old && comp.mounted) {
        comp.mounted();
      }
    }
  }
}

function diff(vnode: VNode | null, removal = false) {
  if (!vnode || !vnode.parent) {
    return;
  }
  let { parent } = vnode;

  while (!parent.node) {
    parent = parent.parent!;
  }
  const parentNode = parent.node;

  if (vnode.node && vnode.node.parentNode !== parentNode) {
    parentNode.appendChild(vnode.node);
  } else if (vnode.node?.parentNode === parentNode) {
    if (removal) {
      removeNode(vnode, parentNode);
    } else {
      innerDiff(vnode.node, vnode.old!.props, vnode.props);
    }
  }

  // apply ref
  if (vnode.ref && vnode.node) {
    vnode.ref(vnode.node);
  }
}
