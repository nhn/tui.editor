import { DOMOutputSpecArray, MarkType } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';

import { Context, EditorCommand } from '@t/spec';
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

  private italic(type: MarkType): EditorCommand {
    return () => toggleMark(type);
  }

  commands({ schema }: Context) {
    return { italic: this.italic(schema.marks.emph) };
  }
}
