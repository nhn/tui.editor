import { DOMOutputSpecArray } from 'prosemirror-model';

import Node from '@/spec/node';

export class ThematicBreak extends Node {
  get name() {
    return 'thematicBreak';
  }

  get schema() {
    return {
      group: 'block',
      parseDOM: [{ tag: 'hr' }],
      toDOM(): DOMOutputSpecArray {
        return ['div', ['hr']];
      }
    };
  }
}
