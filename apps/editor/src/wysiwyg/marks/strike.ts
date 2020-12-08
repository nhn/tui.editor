import { DOMOutputSpecArray } from 'prosemirror-model';
import { toggleMark } from 'prosemirror-commands';

import Mark from '@/spec/mark';

import { EditorCommand } from '@t/spec';

export class Strike extends Mark {
  get name() {
    return 'strike';
  }

  get defaultSchema() {
    return {
      parseDOM: [{ tag: 's' }, { tag: 'del' }],
      toDOM(): DOMOutputSpecArray {
        return ['del'];
      }
    };
  }

  commands(): EditorCommand {
    return () => (state, dispatch) => toggleMark(state.schema.marks.strike)(state, dispatch);
  }

  keymaps() {
    const strikeCommand = this.commands()();

    return {
      'Mod-s': strikeCommand,
      'Mod-S': strikeCommand
    };
  }
}
