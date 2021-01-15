import { DOMOutputSpecArray } from 'prosemirror-model';

import Node from '@/spec/node';

export class LineBreak extends Node {
  get name() {
    return 'lineBreak';
  }

  get defaultSchema() {
    return {
      attrs: {
        rawHTML: { default: null },
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
