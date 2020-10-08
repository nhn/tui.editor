import { DOMOutputSpecArray } from 'prosemirror-model';

import { toList } from '@/commands/listCommands';

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
    const listType = schema.nodes.bulletList;

    return payload => toList(listType, payload) as any;
  }
}
