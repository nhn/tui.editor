import { DOMOutputSpecArray } from 'prosemirror-model';
import { wrapInList } from 'prosemirror-schema-list';

import NodeSchema from '@/spec/node';
import { getWwCommands } from '@/commands/wwCommands';

import { EditorCommand } from '@t/spec';

export class BulletList extends NodeSchema {
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
          tag: 'ul',
          getAttrs(dom: Node | string) {
            const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');

            return {
              ...(rawHTML && { rawHTML })
            };
          }
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
    const { indent, outdent } = getWwCommands();

    return {
      'Mod-u': bulletListCommand,
      'Mod-U': bulletListCommand,
      Tab: indent(),
      'Shift-Tab': outdent()
    };
  }
}
