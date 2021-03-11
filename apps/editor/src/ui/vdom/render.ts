import isFunction from 'tui-code-snippet/type/isFunction';
import { ComponentClass } from '@t/ui';
import { VNode } from './vnode';
import { createNode } from './dom';
import { last } from '@/utils/common';

export function createComponent(Comp: ComponentClass, vnode: VNode) {
  const { props, component } = vnode;

  if (component) {
    component.prevProps = component.props;
    component.props = vnode.props;
    return component;
  }

  return new Comp(props);
}

export function buildVNode(vnode: VNode | null) {
  const root = vnode;

  while (vnode && !vnode.skip) {
    if (isFunction(vnode.type)) {
      const instance = createComponent(vnode.type, vnode);

      instance.vnode = vnode;
      vnode.component = instance;
      vnode.props.children = vnode.children = [instance.render()];
      buildChildrenVNode(vnode);
    } else {
      if (!vnode.node) {
        vnode.node = createNode(vnode);
      }
      buildChildrenVNode(vnode);
    }

    if (vnode.firstChild) {
      vnode = vnode.firstChild;
    } else {
      while (vnode && vnode.parent && !vnode.next) {
        vnode = vnode.parent!;
        if (vnode === root) {
          break;
        }
      }
      vnode = vnode.next;
    }
  }
}

function isSameType(old: VNode | null, vnode: VNode) {
  return old && vnode && vnode.type === old.type && (!vnode.key || vnode.key === old.key);
}

// @TODO: add key diff algorithm
function buildChildrenVNode(parent: VNode) {
  const { children } = parent;
  let old = parent.old ? parent.old.firstChild : null;
  let prev: VNode | null = null;

  children.forEach((vnode, index) => {
    const sameType = isSameType(old, vnode);

    if (sameType) {
      vnode.old = old!;
      vnode.parent = parent;
      vnode.node = old!.node;
      vnode.component = old!.component;
      vnode.effect = 'U';
    }

    if (vnode && !sameType) {
      vnode.old = null;
      vnode.parent = parent;
      vnode.node = null;
      vnode.effect = 'A';
    }

    if (old && !sameType) {
      VNode.removalNodes.push(old);
      old.effect = 'D';
    }

    if (old) {
      old = old.next;
    }

    if (index === 0) {
      parent.firstChild = vnode;
    } else if (vnode) {
      prev!.next = vnode;
    }

    prev = vnode;
  });

  const lastChild = last(children);

  if (!children.length) {
    while (old) {
      VNode.removalNodes.push(old);
      old.effect = 'D';
      old = old.next;
    }
  }

  while (old && lastChild) {
    if (old && lastChild.old !== old) {
      VNode.removalNodes.push(old);
      old.effect = 'D';
      old = old.next;
    }
  }
}
