import { Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';
import { wrapInList } from 'prosemirror-schema-list';

import Node from '@/spec/node';
import { getWwCommands } from '@/commands/wwCommands';

import { EditorCommand } from '@t/spec';

export class BulletList extends Node {
  get name() {
    return 'bulletList';
  }

  get defaultSchema() {
    return {
      content: 'listItem+',
      group: 'block',
      attrs: {
        rawHTML: { default: null }
      },
      parseDOM: [
        {
          tag: 'ul'
        }
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        return [attrs.rawHTML || 'ul', 0];
      }
    };
  }

  commands(): EditorCommand {
    return payload => (state, dispatch) =>
      wrapInList(state.schema.nodes.bulletList, payload)(state, dispatch);
  }

  keymaps() {
    const bulletListCommand = this.commands()();
    const { indent, outdent } = getWwCommands();

    return {
      'Mod-u': bulletListCommand,
      'Mod-U': bulletListCommand,
      Tab: indent(),
      'Shift-Tab': outdent()
    };
  }
}
