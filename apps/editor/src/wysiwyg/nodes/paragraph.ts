import { DOMOutputSpecArray } from 'prosemirror-model';

import NodeSchema from '@/spec/node';

export class Paragraph extends NodeSchema {
  get name() {
    return 'paragraph';
  }

  get defaultSchema() {
    return {
      content: 'inline*',
      group: 'block listGroup',
      parseDOM: [{ tag: 'p' }],
      toDOM(): DOMOutputSpecArray {
        return ['p', 0];
      },
    };
  }
}
