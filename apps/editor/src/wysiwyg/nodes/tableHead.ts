import { DOMOutputSpecArray } from 'prosemirror-model';

import NodeSchema from '@/spec/node';
import { createDOMInfoParsedRawHTML } from '@/wysiwyg/helper/node';

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
      parseDOM: [createDOMInfoParsedRawHTML('thead')],
      toDOM(): DOMOutputSpecArray {
        return ['thead', 0];
      }
    };
  }
}
