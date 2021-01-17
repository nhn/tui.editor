import { DOMOutputSpecArray } from 'prosemirror-model';

import NodeSchema from '@/spec/node';

export class TableHead extends NodeSchema {
  get name() {
    return 'tableHead';
  }

  get defaultSchema() {
    return {
      content: 'tableRow{1}',
      attrs: {
        rawHTML: { default: null }
      },
      parseDOM: [
        {
          tag: 'thead',
          getAttrs(dom: Node | string) {
            const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');

            return {
              ...(rawHTML && { rawHTML })
            };
          }
        }
      ],
      toDOM(): DOMOutputSpecArray {
        return ['thead', 0];
      }
    };
  }
}
