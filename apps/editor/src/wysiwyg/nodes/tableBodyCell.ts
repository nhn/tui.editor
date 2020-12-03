import { DOMOutputSpecArray, Node as ProsemirrorNode } from 'prosemirror-model';

import Node from '@/spec/node';

export class TableBodyCell extends Node {
  get name() {
    return 'tableBodyCell';
  }

  get schema() {
    return {
      content: 'text*',
      attrs: {
        align: { default: null }
      },
      parseDOM: [{ tag: 'td' }],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        const { align } = attrs;

        return [
          'td',
          {
            ...(align && { align })
          },
          0
        ];
      }
    };
  }
}
