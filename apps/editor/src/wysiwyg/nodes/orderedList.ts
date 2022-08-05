import { ProsemirrorNode, DOMOutputSpec } from 'prosemirror-model';

import NodeSchema from '@/spec/node';
import { getWwCommands } from '@/commands/wwCommands';
import { changeList } from '@/wysiwyg/command/list';

import { EditorCommand } from '@t/spec';
import { getDefaultCustomAttrs, getCustomAttrs } from '@/wysiwyg/helper/node';

export class OrderedList extends NodeSchema {
  get name() {
    return 'orderedList';
  }

  get schema() {
    return {
      content: 'listItem+',
      group: 'block',
      attrs: {
        order: { default: 1 },
        rawHTML: { default: null },
        ...getDefaultCustomAttrs(),
      },
      parseDOM: [
        {
          tag: 'ol',
          getAttrs(dom: Node | string) {
            const start = (dom as HTMLElement).getAttribute('start');
            const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');

            return {
              order: (dom as HTMLElement).hasAttribute('start') ? Number(start) : 1,
              ...(rawHTML && { rawHTML }),
            };
          },
        },
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpec {
        return [
          attrs.rawHTML || 'ol',
          { start: attrs.order === 1 ? null : attrs.order, ...getCustomAttrs(attrs) },
          0,
        ];
      },
    };
  }

  commands(): EditorCommand {
    return () => (state, dispatch) => changeList(state.schema.nodes.orderedList)(state, dispatch);
  }

  keymaps() {
    const orderedListCommand = this.commands()();
    const { indent, outdent } = getWwCommands();

    return {
      'Mod-o': orderedListCommand,
      'Mod-O': orderedListCommand,
      Tab: indent(),
      'Shift-Tab': outdent(),
    };
  }
}
