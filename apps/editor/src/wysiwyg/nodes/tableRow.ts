import { DOMOutputSpec, DOMOutputSpecArray } from 'prosemirror-model';

import Node from '@/spec/node';

export class TableRow extends Node {
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
          getAttrs: (dom: DOMOutputSpec) => {
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
