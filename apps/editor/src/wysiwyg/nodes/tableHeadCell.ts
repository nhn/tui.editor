import { DOMOutputSpecArray } from 'prosemirror-model';

import Node from '@/spec/node';

export class TableHeadCell extends Node {
  get name() {
    return 'tableHeadCell';
  }

  get schema() {
    return {
      content: 'text*',
      parseDOM: [{ tag: 'th' }],
      toDOM(): DOMOutputSpecArray {
        return ['th', 0];
      }
    };
  }
}
