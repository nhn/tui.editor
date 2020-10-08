import { DOMOutputSpecArray } from 'prosemirror-model';
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

  private italic({ schema }: Context): EditorCommand {
    return () => toggleMark(schema.marks.emph);
  }

  commands(context: Context) {
    return { italic: this.italic(context) };
  }

  keymaps(context: Context) {
    const italicCommand = this.italic(context)();

    return {
      'Mod-i': italicCommand,
      'Mod-I': italicCommand
    };
  }
}
