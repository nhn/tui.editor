import { Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';
import { wrapInList } from 'prosemirror-schema-list';

import NodeSchema from '@/spec/node';
import { getWwCommands } from '@/commands/wwCommands';

import { EditorCommand } from '@t/spec';

export class OrderedList extends NodeSchema {
  get name() {
    return 'orderedList';
  }

  get defaultSchema() {
    return {
      content: 'listItem+',
      group: 'block',
      attrs: {
        order: { default: 1 },
        rawHTML: { default: null }
      },
      parseDOM: [
        {
          tag: 'ol',
          getAttrs(dom: Node | string) {
            const start = (dom as HTMLElement).getAttribute('start');
            const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');

            return {
              order: (dom as HTMLElement).hasAttribute('start') ? Number(start) : 1,
              ...(rawHTML && { rawHTML })
            };
          }
        }
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        return [
          attrs.rawHTML || 'ol',
          {
            start: attrs.order === 1 ? null : attrs.order
          },
          0
        ];
      }
    };
  }

  commands(): EditorCommand {
    return payload => (state, dispatch) =>
      wrapInList(state.schema.nodes.orderedList, payload)(state, dispatch);
  }

  keymaps() {
    const orderedListCommand = this.commands()();
    const { indent, outdent } = getWwCommands();

    return {
      'Mod-o': orderedListCommand,
      'Mod-O': orderedListCommand,
      Tab: indent(),
      'Shift-Tab': outdent()
    };
  }
}
