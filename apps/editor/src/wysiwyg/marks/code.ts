import { DOMOutputSpecArray } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';

import { Context, EditorCommand } from '@t/spec';

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

  commands({ schema }: Context): EditorCommand {
    return () => toggleMark(schema.marks.code);
  }

  keymaps(context: Context) {
    const codeCommand = this.commands(context)();

    return {
      'Shift-Mod-c': codeCommand,
      'Shift-Mod-C': codeCommand
    };
  }
}
