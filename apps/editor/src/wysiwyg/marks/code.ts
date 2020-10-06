import { DOMOutputSpecArray } from 'prosemirror-model';

import Mark from '@/spec/mark';

export class Code extends Mark {
  get name() {
    return 'code';
  }

  get schema() {
    return {
      parseDOM: [{ tag: 'code' }],
      toDOM(): DOMOutputSpecArray {
        return ['code'];
      }
    };
  }
}
