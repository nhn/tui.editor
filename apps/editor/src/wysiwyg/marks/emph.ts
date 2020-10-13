import { DOMOutputSpecArray } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';

import Mark from '@/spec/mark';

import { EditorCommand } from '@t/spec';

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

  private italic(): EditorCommand {
    return () => (state, dispatch) => toggleMark(state.schema.marks.emph)(state, dispatch);
  }

  commands() {
    return { italic: this.italic() };
  }

  keymaps() {
    const italicCommand = this.italic()();

    return {
      'Mod-i': italicCommand,
      'Mod-I': italicCommand
    };
  }
}
