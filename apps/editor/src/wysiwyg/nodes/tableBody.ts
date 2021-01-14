import { DOMOutputSpecArray } from 'prosemirror-model';

import NodeSchema from '@/spec/node';

export class TableBody extends NodeSchema {
  get name() {
    return 'tableBody';
  }

  get defaultSchema() {
    return {
      content: 'tableRow+',
      attrs: {
        rows: { default: 1 },
        columns: { default: 1 },
        rawHTML: { default: null }
      },
      parseDOM: [
        {
          tag: 'tbody',
          getAttrs(dom: Node | string) {
            const rows = (dom as HTMLElement).querySelectorAll('tr');
            const columns = rows[0].children.length;
            const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');

            if (!columns) {
              return false;
            }

            return {
              rows: rows.length,
              columns,
              ...(rawHTML && { rawHTML })
            };
          }
        }
      ],
      toDOM(): DOMOutputSpecArray {
        return ['tbody', 0];
      }
    };
  }
}
