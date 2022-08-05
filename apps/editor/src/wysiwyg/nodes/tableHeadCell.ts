import { DOMOutputSpec, ProsemirrorNode } from 'prosemirror-model';

import NodeSchema from '@/spec/node';
import {
  createCellAttrs,
  createParsedCellDOM,
  getCustomAttrs,
  getDefaultCustomAttrs,
} from '@/wysiwyg/helper/node';

export class TableHeadCell extends NodeSchema {
  get name() {
    return 'tableHeadCell';
  }

  get schema() {
    return {
      content: 'paragraph+',
      attrs: {
        align: { default: null },
        className: { default: null },
        rawHTML: { default: null },
        colspan: { default: null },
        extended: { default: null },
        ...getDefaultCustomAttrs(),
      },
      isolating: true,
      parseDOM: [createParsedCellDOM('th')],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpec {
        const cellAttrs = createCellAttrs(attrs);

        return ['th', { ...cellAttrs, ...getCustomAttrs(attrs) }, 0];
      },
    };
  }
}
