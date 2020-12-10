import { DOMOutputSpecArray } from 'prosemirror-model';

import Node from '@/spec/node';

export class TableHead extends Node {
  get name() {
    return 'tableHead';
  }

  get defaultSchema() {
    return {
      content: 'tableRow{1}',
      parseDOM: [{ tag: 'thead' }],
      toDOM(): DOMOutputSpecArray {
        return ['thead', 0];
      }
    };
  }
}
