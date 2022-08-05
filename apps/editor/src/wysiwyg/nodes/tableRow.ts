import { DOMOutputSpec, ProsemirrorNode } from 'prosemirror-model';

import NodeSchema from '@/spec/node';
import { getDefaultCustomAttrs, getCustomAttrs } from '@/wysiwyg/helper/node';

export class TableRow extends NodeSchema {
  get name() {
    return 'tableRow';
  }

  get schema() {
    return {
      content: '(tableHeadCell | tableBodyCell)*',
      attrs: {
        rawHTML: { default: null },
        ...getDefaultCustomAttrs(),
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
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpec {
        return ['tr', getCustomAttrs(attrs), 0];
      },
    };
  }
}
