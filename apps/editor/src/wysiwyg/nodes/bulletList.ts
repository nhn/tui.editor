import { DOMOutputSpecArray } from 'prosemirror-model';
import { wrapInList } from 'prosemirror-schema-list';

import { Context, EditorCommand } from '@t/spec';
import Node from '@/spec/node';

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

  commands({ schema }: Context): EditorCommand {
    return payload => wrapInList(schema.nodes.bulletList, payload);
  }

  keymaps(context: Context) {
    const bulletListCommand = this.commands(context)();

    return {
      'Mod-u': bulletListCommand,
      'Mod-U': bulletListCommand
    };
  }
}
