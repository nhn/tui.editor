import isFunction from 'tui-code-snippet/type/isFunction';
import { innerDiff, removeNode } from './dom';
import { VNode } from './vnode';

export function commit(vnode?: VNode) {
  VNode.removalNodes.forEach((removalNode) => diff(removalNode));

  if (vnode) {
    let next;
    const walker = vnode.walker();

    while ((next = walker.walk())) {
      vnode = next.vnode!;
      if (next.entering) {
        diff(vnode);
      } else if (isFunction(vnode.type)) {
        const comp = vnode.component!;

        // lifecycle method
        if (!vnode.old && comp.mounted) {
          comp.mounted();
        }
        if (vnode.old && comp.updated) {
          const prevProps = comp.prevProps || {};

          comp.updated(prevProps);
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
          const comp = vnode.component!;

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
  if (vnode.ref) {
    if (vnode.component) {
      vnode.ref(vnode.component);
    } else if (vnode.node) {
      vnode.ref(vnode.node);
    }
  }
}
