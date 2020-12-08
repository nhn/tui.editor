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
        columns: { default: 1 }
      },
      parseDOM: [
        {
          tag: 'tbody',
          getAttrs(dom: Node | string) {
            const rows = (dom as HTMLElement).querySelectorAll('tr');
            const columns = rows[0].children.length;

            if (!columns) {
              return false;
            }

            return {
              rows: rows.length,
              columns
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
