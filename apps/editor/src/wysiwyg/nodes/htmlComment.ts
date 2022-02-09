import { DOMOutputSpecArray } from 'prosemirror-model';

import NodeSchema from '@/spec/node';

export class HTMLComment extends NodeSchema {
  get name() {
    return 'htmlComment';
  }

  get schema() {
    return {
      content: 'text*',
      group: 'block',
      code: true,
      parseDOM: [{ tag: 'div[data-html-comment]' }],
      toDOM(): DOMOutputSpecArray {
        return ['div', { 'data-html-comment': 'true' }, 0];
      },
    };
  }
}
