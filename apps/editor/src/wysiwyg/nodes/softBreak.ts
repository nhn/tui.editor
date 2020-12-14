import { DOMOutputSpecArray } from 'prosemirror-model';

import Node from '@/spec/node';

export class SoftBreak extends Node {
  get name() {
    return 'softBreak';
  }

  get defaultSchema() {
    return {
      attrs: {
        htmlToken: { default: null },
        inCell: { default: false }
      },
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
