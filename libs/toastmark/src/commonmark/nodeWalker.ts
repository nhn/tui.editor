import { Node, isContainer } from './node';

export default class NodeWalker {
  public current: Node | null;
  public root: Node;
  public entering: boolean;

  constructor(root: Node) {
    this.current = root;
    this.root = root;
    this.entering = true;
  }

  next() {
    const cur = this.current;
    const entering = this.entering;

    if (cur === null) {
      return null;
    }

    const container = isContainer(cur);

    if (entering && container) {
      if (cur.firstChild) {
        this.current = cur.firstChild;
        this.entering = true;
      } else {
        // stay on node but exit
        this.entering = false;
      }
    } else if (cur === this.root) {
      this.current = null;
    } else if (cur.next === null) {
      this.current = cur.parent;
      this.entering = false;
    } else {
      this.current = cur.next;
      this.entering = true;
    }

    return { entering, node: cur };
  }

  resumeAt(node: Node, entering: boolean) {
    this.current = node;
    this.entering = entering === true;
  }
}
