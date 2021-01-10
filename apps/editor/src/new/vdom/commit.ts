import isFunction from 'tui-code-snippet/type/isFunction';
import { innerDiff, removeNode } from './dom';
import { createComponent } from './render';
import { VNode } from './vnode';

export function commit(vnode?: VNode) {
  VNode.removalNodes.forEach(removalNode => diff(removalNode));

  if (vnode) {
    vnode = vnode!.firstChild!;

    let next;
    const walker = vnode.walker();

    while ((next = walker.walk())) {
      vnode = next.vnode!;
      if (next.entering) {
        diff(vnode);
      } else if (isFunction(vnode.type)) {
        const comp = createComponent(vnode.type, vnode);

        // lifecycle method
        if (!vnode.old && comp.mounted) {
          comp.mounted();
        }
        if (vnode.old && comp.updated) {
          comp.updated();
        }
      }
    }
  }
}

function getParentNode(vnode: VNode) {
  let { parent } = vnode;

  while (!parent!.node) {
    parent = parent!.parent!;
  }

  return parent!.node;
}

function diff(vnode: VNode | null) {
  if (!vnode || !vnode.parent) {
    return;
  }

  if (vnode.node) {
    const parentNode = getParentNode(vnode);

    if (vnode.effect === 'A') {
      parentNode.appendChild(vnode.node);
    } else if (vnode.effect === 'U') {
      innerDiff(vnode.node!, vnode.old!.props, vnode.props);
    }
  }

  if (vnode.effect === 'D') {
    let next;
    const walker = vnode.walker();

    while ((next = walker.walk())) {
      vnode = next.vnode!;
      if (!next.entering) {
        if (isFunction(vnode.type)) {
          const comp = createComponent(vnode.type, vnode);

          // lifecycle method
          if (comp.beforeDestroy) {
            comp.beforeDestroy();
          }
        } else {
          const parentNode = getParentNode(vnode);

          removeNode(vnode, parentNode);
        }
      }
    }
  }

  // apply ref
  if (vnode.ref && vnode.node) {
    vnode.ref(vnode.node);
  }
}
