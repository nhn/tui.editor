import { DOMOutputSpec, ProsemirrorNode } from 'prosemirror-model';

import NodeSchema from '@/spec/node';
import { createCellAttrs, createParsedCellDOM } from '@/wysiwyg/helper/node';

export class TableBodyCell extends NodeSchema {
  get name() {
    return 'tableBodyCell';
  }

  get schema() {
    return {
      content: '(paragraph | bulletList | orderedList)+',
      attrs: {
        align: { default: null },
        className: { default: null },
        rawHTML: { default: null },
        colspan: { default: null },
        rowspan: { default: null },
        extended: { default: null },
      },
      isolating: true,
      parseDOM: [createParsedCellDOM('td')],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpec {
        const cellAttrs = createCellAttrs(attrs);

        return ['td', cellAttrs, 0];
      },
    };
  }
}
