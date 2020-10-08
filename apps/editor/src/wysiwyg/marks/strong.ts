import { DOMOutputSpecArray } from 'prosemirror-model';
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

  private bold({ schema }: Context): EditorCommand {
    return () => toggleMark(schema.marks.strong);
  }

  commands(context: Context) {
    return { bold: this.bold(context) };
  }

  keymaps(context: Context) {
    const boldCommand = this.bold(context)();

    return {
      'Mod-b': boldCommand,
      'Mod-B': boldCommand
    };
  }
}
