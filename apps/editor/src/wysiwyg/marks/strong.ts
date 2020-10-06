import { DOMOutputSpecArray } from 'prosemirror-model';

import Mark from '@/spec/mark';

export class Strong extends Mark {
  get name() {
    return 'strong';
  }

  get schema() {
    return {
      parseDOM: [{ tag: 'b' }, { tag: 'strong' }],
      toDOM(): DOMOutputSpecArray {
        return ['strong'];
      }
    };
  }
}
