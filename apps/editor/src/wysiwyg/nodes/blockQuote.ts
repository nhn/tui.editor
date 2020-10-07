import { DOMOutputSpecArray } from 'prosemirror-model';

import Node from '@/spec/node';

export class BlockQuote extends Node {
  get name() {
    return 'blockQuote';
  }

  get schema() {
    return {
      content: 'block+',
      group: 'block',
      parseDOM: [{ tag: 'blockquote' }],
      toDOM(): DOMOutputSpecArray {
        return ['blockquote', 0];
      }
    };
  }
}
