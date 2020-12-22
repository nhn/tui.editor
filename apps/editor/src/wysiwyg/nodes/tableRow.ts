import { DOMOutputSpecArray } from 'prosemirror-model';

import NodeSchema from '@/spec/node';

export class TableRow extends NodeSchema {
  get name() {
    return 'tableRow';
  }

  get defaultSchema() {
    return {
      content: '(tableHeadCell | tableBodyCell)+',
      attrs: {
        dummyRowForPasting: { default: false }
      },
      parseDOM: [
        {
          tag: 'tr'
        }
      ],
      toDOM(): DOMOutputSpecArray {
        return ['tr', 0];
      }
    };
  }
}
