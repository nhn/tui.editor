import { DOMOutputSpecArray } from 'prosemirror-model';

import Node from '@/spec/node';

export class HardBreak extends Node {
  get name() {
    return 'hardBreak';
  }

  get schema() {
    return {
      inline: true,
      group: 'inline',
      selectable: false,
      parseDOM: [{ tag: 'br' }],
      toDOM(): DOMOutputSpecArray {
        return ['br'];
      }
    };
  }
}
