import { DOMOutputSpecArray } from 'prosemirror-model';

import NodeSchema from '@/spec/node';

export class TableRow extends NodeSchema {
  get name() {
    return 'tableRow';
  }

  get schema() {
    return {
      content: '(tableHeadCell | tableBodyCell)+',
      attrs: { columns: { default: 1 } },
      parseDOM: [
        {
          tag: 'tr',
          getAttrs: (dom: Node | string) => {
            const columns = (dom as HTMLElement).children.length;

            if (!columns) {
              return false;
            }

            return { columns };
          }
        }
      ],
      toDOM(): DOMOutputSpecArray {
        return ['tr', 0];
      }
    };
  }
}
