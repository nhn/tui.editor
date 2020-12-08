import { DOMOutputSpecArray } from 'prosemirror-model';

import Node from '@/spec/node';

export class Paragraph extends Node {
  get name() {
    return 'paragraph';
  }

  get defaultSchema() {
    return {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM(): DOMOutputSpecArray {
        return ['p', 0];
      }
    };
  }
}
