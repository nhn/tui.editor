import { DOMOutputSpecArray } from 'prosemirror-model';
import { wrapIn } from 'prosemirror-commands';

import { EditorCommand } from '@t/spec';
import Node from '@/spec/node';

export class BlockQuote extends Node {
  get name() {
    return 'blockQuote';
  }

  get schema() {
    return {
      content: 'block+',
      group: 'block',
      parseDOM: [{ tag: 'blockquote' }],
      toDOM(): DOMOutputSpecArray {
        return ['blockquote', 0];
      }
    };
  }

  commands(): EditorCommand {
    return () => (state, dispatch) => wrapIn(state.schema.nodes.blockQuote)(state, dispatch);
  }

  keymaps() {
    const blockQutoeCommand = this.commands()();

    return {
      'Alt-q': blockQutoeCommand,
      'Alt-Q': blockQutoeCommand
    };
  }
}
