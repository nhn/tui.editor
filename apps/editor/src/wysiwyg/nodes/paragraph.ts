import { DOMOutputSpecArray } from 'prosemirror-model';

import NodeSchema from '@/spec/node';

export class Paragraph extends NodeSchema {
  get name() {
    return 'paragraph';
  }

  get defaultSchema() {
    return {
      content: 'inline*',
      group: 'block listGroup',
      parseDOM: [
        {
          tag: 'p',
          getAttrs(dom: Node | string) {
            console.log(dom);

            return {};
          },
        },
      ],
      toDOM(): DOMOutputSpecArray {
        return ['p', 0];
      },
    };
  }
}
