import { DOMOutputSpecArray } from 'prosemirror-model';

import Node from '@/spec/node';

export class TableBodyCell extends Node {
  get name() {
    return 'tableBodyCell';
  }

  get schema() {
    return {
      content: 'text*',
      parseDOM: [{ tag: 'td' }],
      toDOM(): DOMOutputSpecArray {
        return ['td', 0];
      }
    };
  }
}
