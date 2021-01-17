import { DOMOutputSpecArray, Node as ProsemirrorNode } from 'prosemirror-model';

import NodeSchema from '@/spec/node';

export class TableBodyCell extends NodeSchema {
  get name() {
    return 'tableBodyCell';
  }

  get defaultSchema() {
    return {
      content: '(paragraph | bulletList | orderedList)+',
      attrs: {
        align: { default: null },
        className: { default: null },
        rawHTML: { default: null }
      },
      parseDOM: [
        {
          tag: 'td',
          getAttrs(dom: Node | string) {
            const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');

            return {
              ...(rawHTML && { rawHTML })
            };
          }
        }
      ],
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
