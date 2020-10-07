import { DOMOutputSpecArray } from 'prosemirror-model';

import Mark from '@/spec/mark';

export class Emph extends Mark {
  get name() {
    return 'emph';
  }

  get schema() {
    return {
      parseDOM: [{ tag: 'i' }, { tag: 'em' }],
      toDOM(): DOMOutputSpecArray {
        return ['em'];
      }
    };
  }
}
