import { Node as ProsemirrorNode, Schema } from 'prosemirror-model';

import { MdNode } from '@t/markdown';
import { ToWwConvertorMap, ToMdConvertorMap } from '@t/convertor';

import { toWwConvertors } from './toWwConvertors';
import ToWwConvertorState from './toWwConvertorState';

import { toMdConvertors } from './toMdConvertors';
import ToMdConvertorState from './toMdConvertorState';

import { createParagraph } from '@/helper/manipulation';

export default class Convertor {
  private readonly schema: Schema;

  private readonly toWwConvertors: ToWwConvertorMap;

  private readonly toMdConvertors: ToMdConvertorMap;

  constructor(schema: Schema) {
    this.schema = schema;

    // @TODO to be extended with public option
    this.toWwConvertors = toWwConvertors;

    // @TODO to be extended with public option
    this.toMdConvertors = toMdConvertors;
  }

  private addBlankLineBetweenParagraphs(prevNode: ProsemirrorNode, blockNodes: ProsemirrorNode[]) {
    if (prevNode && prevNode.type.name === 'paragraph') {
      const blankLine = createParagraph(this.schema);

      blockNodes.push(blankLine!);
    }
  }

  private convertSoftBreaksToParagraphs(node: ProsemirrorNode, blockNodes: ProsemirrorNode[]) {
    // except for soft breaks, inline nodes are temporarily stored
    let buffer = [];

    for (let i = 0; i < node.childCount; i += 1) {
      const inlineNode = node.child(i);

      if (inlineNode.type.name === 'lineBreak') {
        if (buffer.length) {
          const newPara = createParagraph(this.schema, buffer);

          blockNodes.push(newPara!);
        }

        const blankLine = createParagraph(this.schema);

        blockNodes.push(blankLine!);
        buffer = [];
      } else {
        buffer.push(inlineNode);
      }
    }

    if (buffer.length) {
      const newPara = createParagraph(this.schema, buffer);

      blockNodes.push(newPara!);
    }
  }

  private postProcessParagraphs(doc: ProsemirrorNode) {
    const blockNodes: ProsemirrorNode[] = [];
    let prevNode: ProsemirrorNode;

    doc.forEach(node => {
      if (node.type.name === 'paragraph') {
        this.addBlankLineBetweenParagraphs(prevNode, blockNodes);
        this.convertSoftBreaksToParagraphs(node, blockNodes);
      } else {
        blockNodes.push(node);
      }

      prevNode = node;
    });

    return this.schema.nodes.doc.create(null, blockNodes);
  }

  public toWysiwygModel(mdNode: MdNode) {
    const state = new ToWwConvertorState(this.schema, this.toWwConvertors);
    const doc = state.convertNode(mdNode);

    console.log(doc);

    if (doc) {
      return this.postProcessParagraphs(doc);
    }

    return null;
  }

  public toMarkdownText(wwNode: ProsemirrorNode) {
    const { nodes, marks } = this.toMdConvertors;
    const state = new ToMdConvertorState(nodes, marks);

    return state.convertNode(wwNode);
  }
}
