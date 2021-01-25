import { Component, ComponentClass } from '@t/ui';

class VNodeWalker {
  current: VNode | null;

  root: VNode | null;

  entering: boolean;

  constructor(current: VNode | null) {
    this.current = current;
    this.root = current;
    this.entering = true;
  }

  walk() {
    const { entering, current: cur } = this;

    if (!cur) {
      return null;
    }

    if (entering) {
      if (cur.firstChild) {
        this.current = cur.firstChild;
        this.entering = true;
      } else {
        this.entering = false;
      }
    } else if (cur === this.root) {
      this.current = null;
    } else if (cur.next) {
      this.current = cur.next;
      this.entering = true;
    } else {
      this.current = cur.parent;
      this.entering = false;
    }

    return { vnode: cur, entering };
  }
}

export class VNode {
  static removalNodes: VNode[] = [];

  type: string | ComponentClass;

  props: Record<string, any>;

  children: VNode[];

  parent: VNode | null = null;

  old: VNode | null = null;

  firstChild: VNode | null = null;

  next: VNode | null = null;

  ref?: (node: Node | Component) => void | Node | Component;

  node!: Node | null;

  // A: append, U: update, D: delete
  effect!: 'A' | 'U' | 'D';

  component?: Component;

  key?: string;

  skip = false;

  constructor(type: string | ComponentClass, props: Record<string, any>, children: VNode[]) {
    this.type = type;
    this.props = props;
    this.children = children;
    this.props.children = children;
    if (props.ref) {
      this.ref = props.ref;
      delete props.ref;
    }
    if (props.key) {
      this.key = props.key;
      delete props.key;
    }
  }

  walker() {
    return new VNodeWalker(this);
  }
}
