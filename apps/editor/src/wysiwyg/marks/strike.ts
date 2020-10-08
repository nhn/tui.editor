import { DOMOutputSpecArray } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';

import { Context, EditorCommand } from '@t/spec';
import Mark from '@/spec/mark';

export class Strike extends Mark {
  get name() {
    return 'strike';
  }

  get schema() {
    return {
      parseDOM: [{ tag: 's' }, { tag: 'del' }],
      toDOM(): DOMOutputSpecArray {
        return ['del'];
      }
    };
  }

  commands({ schema }: Context): EditorCommand {
    return () => toggleMark(schema.marks.strike);
  }
}
