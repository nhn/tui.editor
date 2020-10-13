import { DOMOutputSpecArray } from 'prosemirror-model';
import { wrapInList } from 'prosemirror-schema-list';

import Node from '@/spec/node';

import { EditorCommand } from '@t/spec';

export class BulletList extends Node {
  get name() {
    return 'bulletList';
  }

  get schema() {
    return {
      content: 'listItem+',
      group: 'block',
      parseDOM: [
        {
          tag: 'ul'
        }
      ],
      toDOM(): DOMOutputSpecArray {
        return ['ul', 0];
      }
    };
  }

  commands(): EditorCommand {
    return payload => (state, dispatch) =>
      wrapInList(state.schema.nodes.bulletList, payload)(state, dispatch);
  }

  keymaps() {
    const bulletListCommand = this.commands()();

    return {
      'Mod-u': bulletListCommand,
      'Mod-U': bulletListCommand
    };
  }
}
