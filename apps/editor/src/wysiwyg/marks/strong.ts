import { DOMOutputSpecArray, MarkType } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';

import { Context, EditorCommand } from '@t/spec';
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

  private bold(type: MarkType): EditorCommand {
    return () => toggleMark(type);
  }

  commands({ schema }: Context) {
    return { bold: this.bold(schema.marks.strong) };
  }
}
