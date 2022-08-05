import { DOMOutputSpec, ProsemirrorNode } from 'prosemirror-model';

import NodeSchema from '@/spec/node';
import { getCustomAttrs, getDefaultCustomAttrs } from '@/wysiwyg/helper/node';

export class TableBody extends NodeSchema {
  get name() {
    return 'tableBody';
  }

  get schema() {
    return {
      content: 'tableRow+',
      attrs: {
        rawHTML: { default: null },
        ...getDefaultCustomAttrs(),
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

            return { ...(rawHTML && { rawHTML }) };
          },
        },
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpec {
        return ['tbody', getCustomAttrs(attrs), 0];
      },
    };
  }
}
