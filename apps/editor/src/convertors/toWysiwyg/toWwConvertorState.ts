import { Schema, Node, NodeType, Mark, MarkType, DOMParser } from 'prosemirror-model';

import { ToWwConvertorMap, StackItem, Attrs } from '@t/convertor';
import { MdNode } from '@t/markdown';

export function mergeMarkText(a: Node, b: Node) {
  if (a.isText && b.isText && Mark.sameSet(a.marks, b.marks)) {
    // @ts-ignore
    // type is not defined for "withText" in prosemirror-model
    return a.withText(a.text! + b.text);
  }

  return false;
}

export default class ToWwConvertorState {
  public readonly schema: Schema;

  private readonly convertors: ToWwConvertorMap;

  private stack: StackItem[];

  private marks: Mark[];

  constructor(schema: Schema, convertors: ToWwConvertorMap, linkAttribute: Record<string, any>) {
    this.schema = schema;
    this.convertors = convertors;
    this.stack = [{ type: this.schema.topNodeType, attrs: null, content: [] }];
    this.marks = Mark.none;
  }

  top() {
    return this.stack[this.stack.length - 1];
  }

  push(node: Node) {
    if (this.stack.length) {
      this.top().content.push(node);
    }
  }

  addText(text: string) {
    if (text) {
      const nodes = this.top().content;
      const last = nodes[nodes.length - 1];
      const node = this.schema.text(text, this.marks);
      const merged = last && mergeMarkText(last, node);

      if (merged) {
        nodes[nodes.length - 1] = merged;
      } else {
        nodes.push(node);
      }
    }
  }

  openMark(mark: Mark) {
    this.marks = mark.addToSet(this.marks);
  }

  closeMark(mark: MarkType) {
    this.marks = mark.removeFromSet(this.marks);
  }

  addNode(type: NodeType, attrs: Attrs, content: Node[]) {
    const node = type.createAndFill(attrs, content, this.marks);

    if (node) {
      this.push(node);

      return node;
    }

    return null;
  }

  openNode(type: NodeType, attrs: Attrs) {
    this.stack.push({ type, attrs, content: [] });
  }

  closeNode() {
    if (this.marks.length) {
      this.marks = Mark.none;
    }

    const { type, attrs, content } = this.stack.pop() as StackItem;

    return this.addNode(type, attrs, content);
  }

  convertByDOMParser(root: HTMLElement) {
    const doc = DOMParser.fromSchema(this.schema).parse(root);

    doc.content.forEach(node => this.push(node));
  }

  private convert(mdNode: MdNode) {
    const walker = mdNode.walker();
    let event = walker.next();

    while (event) {
      const { node, entering } = event;
      const convertor = this.convertors[node.type];

      let skipped = false;

      if (convertor) {
        const context = {
          entering,
          skipChildren: () => {
            skipped = true;
          }
        };

        convertor(this, node, context);
      }

      if (skipped) {
        walker.resumeAt(node, false);
        walker.next();
      }

      event = walker.next();
    }
  }

  convertNode(mdNode: MdNode) {
    this.convert(mdNode);

    if (this.stack.length) {
      return this.closeNode();
    }

    return null;
  }
}
