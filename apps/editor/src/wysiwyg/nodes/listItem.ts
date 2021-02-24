import { Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';

import NodeSchema from '@/spec/node';
import { splitListItem } from '@/wysiwyg/command/list';

import { EditorCommand } from '@t/spec';

export class ListItem extends NodeSchema {
  get name() {
    return 'listItem';
  }

  get defaultSchema() {
    return {
      content: 'paragraph listGroup*',
      attrs: {
        task: { default: false },
        checked: { default: false },
        rawHTML: { default: null },
      },
      defining: true,
      parseDOM: [
        {
          tag: 'li',
          getAttrs(dom: Node | string) {
            const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');

            return {
              task: (dom as HTMLElement).hasAttribute('data-task'),
              checked: (dom as HTMLElement).hasAttribute('data-task-checked'),
              ...(rawHTML && { rawHTML }),
            };
          },
        },
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        const { task, checked } = attrs;

        if (!task) {
          return [attrs.rawHTML || 'li', 0];
        }

        const classNames = ['task-list-item'];

        if (checked) {
          classNames.push('checked');
        }

        return [
          attrs.rawHTML || 'li',
          {
            class: classNames.join(' '),
            'data-task': task,
            ...(checked && { 'data-task-checked': checked }),
          },
          0,
        ];
      },
    };
  }

  commands(): EditorCommand {
    return () => (state, dispatch) => splitListItem(state.schema.nodes.listItem)(state, dispatch);
  }

  keymaps() {
    return {
      Enter: this.commands()(),
    };
  }
}
