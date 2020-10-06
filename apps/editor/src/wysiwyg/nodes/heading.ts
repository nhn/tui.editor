import { Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';

import Node from '@/spec/node';

export class Heading extends Node {
  get name() {
    return 'heading';
  }

  get levels() {
    return [1, 2, 3, 4, 5, 6];
  }

  get schema() {
    const parseDOM = this.levels.map(level => {
      return { tag: `h${level}`, attrs: { level } };
    });

    return {
      attrs: { level: { default: 1 } },
      content: 'inline*',
      group: 'block',
      defining: true,
      parseDOM,
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        return [`h${attrs.level}`, 0];
      }
    };
  }
}
