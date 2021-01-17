import { DOMOutputSpecArray, Node as ProsemirrorNode } from 'prosemirror-model';

import NodeSchema from '@/spec/node';

export class TableHeadCell extends NodeSchema {
  get name() {
    return 'tableHeadCell';
  }

  get defaultSchema() {
    return {
      content: 'paragraph+',
      attrs: {
        align: { default: null },
        className: { default: null },
        rawHTML: { default: null }
      },
      parseDOM: [
        {
          tag: 'th',
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
