import { DOMOutputSpecArray } from 'prosemirror-model';

import Node from '@/spec/node';

export class BulletList extends Node {
  get name() {
    return 'bulletList';
  }

  get schema() {
    return {
      content: 'listItem+',
      group: 'block',
      parseDOM: [
        {
          tag: 'ul'
        }
      ],
      toDOM(): DOMOutputSpecArray {
        return ['ul', 0];
      }
    };
  }
}
