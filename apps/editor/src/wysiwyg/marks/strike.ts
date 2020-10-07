import { DOMOutputSpecArray } from 'prosemirror-model';

import Mark from '@/spec/mark';

export class Strike extends Mark {
  get name() {
    return 'strike';
  }

  get schema() {
    return {
      parseDOM: [{ tag: 's' }, { tag: 'strike' }],
      toDOM(): DOMOutputSpecArray {
        return ['strike'];
      }
    };
  }
}
