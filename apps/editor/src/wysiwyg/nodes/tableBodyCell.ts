import { DOMOutputSpecArray, Node as ProsemirrorNode } from 'prosemirror-model';

import Node from '@/spec/node';

export class TableBodyCell extends Node {
  get name() {
    return 'tableBodyCell';
  }

  get defaultSchema() {
    return {
      content: '(paragraph | bulletList | orderedList)+',
      attrs: {
        align: { default: null },
        className: { default: null }
      },
      parseDOM: [{ tag: 'td' }],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        const { align, className } = attrs;

        return [
          'td',
          {
            ...(align && { align }),
            ...(className && { class: className })
          },
          0
        ];
      }
    };
  }
}
