import { DOMOutputSpecArray } from 'prosemirror-model';
import { wrapIn } from 'prosemirror-commands';

import { Context, EditorCommand } from '@t/spec';
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

  commands({ schema }: Context): EditorCommand {
    return () => wrapIn(schema.nodes.blockQuote);
  }

  keymaps(context: Context) {
    const blockQutoeCommand = this.commands(context)();

    return {
      'Alt-q': blockQutoeCommand,
      'Alt-Q': blockQutoeCommand
    };
  }
}
