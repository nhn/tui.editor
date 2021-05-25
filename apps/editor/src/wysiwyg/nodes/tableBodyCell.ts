import { DOMOutputSpecArray, Node as ProsemirrorNode } from 'prosemirror-model';

import NodeSchema from '@/spec/node';
import {
  createCellAttrs,
  createParsedCellDOM,
  getCustomAttrs,
  getDefaultCustomAttrs,
} from '@/wysiwyg/helper/node';

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
        ...getDefaultCustomAttrs(),
      },
      isolating: true,
      parseDOM: [createParsedCellDOM('td')],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        const cellAttrs = createCellAttrs(attrs);

        return ['td', { ...cellAttrs, ...getCustomAttrs(attrs) }, 0];
      },
    };
  }
}
