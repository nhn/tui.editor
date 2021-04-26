import { DOMOutputSpecArray, Node as ProsemirrorNode } from 'prosemirror-model';

import NodeSchema from '@/spec/node';
import { createCellAttrs, createParsedCellDOM } from '@/wysiwyg/helper/node';

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
        rawHTML: { default: null },
        colspan: { default: null },
        extended: { default: null },
      },
      isolating: true,
      parseDOM: [createParsedCellDOM('th')],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        const cellAttrs = createCellAttrs(attrs);

        return ['th', cellAttrs, 0];
      },
    };
  }
}
