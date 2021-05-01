import { DOMOutputSpecArray } from 'prosemirror-model';

import NodeSchema from '@/spec/node';

export class TableRow extends NodeSchema {
  get name() {
    return 'tableRow';
  }

  get defaultSchema() {
    return {
      content: '(tableHeadCell | tableBodyCell)*',
      attrs: {
        rawHTML: { default: null },
      },
      parseDOM: [
        {
          tag: 'tr',
          getAttrs: (dom: Node | string) => {
            const columns = (dom as HTMLElement).children.length;
            const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');

            if (!columns) {
              return false;
            }

            return { ...(rawHTML && { rawHTML }) };
          },
        },
      ],
      toDOM(): DOMOutputSpecArray {
        return ['tr', 0];
      },
    };
  }
}
