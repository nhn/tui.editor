import { DOMOutputSpecArray, Node as ProsemirrorNode } from 'prosemirror-model';

import Node from '@/spec/node';

export class TableHeadCell extends Node {
  get name() {
    return 'tableHeadCell';
  }

  get defaultSchema() {
    return {
      content: 'paragraph+',
      attrs: {
        align: { default: null },
        className: { default: null }
      },
      parseDOM: [{ tag: 'th' }],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        const { align, className } = attrs;

        return [
          'th',
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
