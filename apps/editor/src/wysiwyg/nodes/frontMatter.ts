import { DOMOutputSpecArray } from 'prosemirror-model';
import NodeSchema from '@/spec/node';

export class FrontMatter extends NodeSchema {
  get name() {
    return 'frontMatter';
  }

  get defaultSchema() {
    return {
      content: 'text*',
      group: 'block',
      code: true,
      parseDOM: [
        {
          tag: 'div[data-front-matter]',
        },
      ],
      toDOM(): DOMOutputSpecArray {
        return ['div', { 'data-front-matter': 'true' }, 0];
      },
    };
  }
}
