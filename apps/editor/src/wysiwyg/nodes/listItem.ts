import type { Command } from 'prosemirror-commands';
import type { ProsemirrorNode, DOMOutputSpec } from 'prosemirror-model';

import NodeSchema from '@/spec/node';
import { splitListItem } from '@/wysiwyg/command/list';

export class ListItem extends NodeSchema {
  get name() {
    return 'listItem';
  }

  get schema() {
    return {
      content: 'paragraph block*',
      selectable: false,
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
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpec {
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

  private liftToPrevListItem(): Command {
    return (state, dispatch) => {
      const { selection, tr, schema } = state;
      const { $from, empty } = selection;
      const { listItem } = schema.nodes;
      const { parent } = $from;
      const listItemParent = $from.node(-1);

      if (empty && !parent.childCount && listItemParent.type === listItem) {
        // move to previous sibling list item when the current list item is not top list item
        if ($from.index(-2) >= 1) {
          // should subtract '1' for considering tag length(<li>)
          tr.delete($from.start(-1) - 1, $from.end(-1));
          dispatch!(tr);
          return true;
        }

        const grandParentListItem = $from.node(-3);

        // move to parent list item when the current list item is top list item
        if (grandParentListItem.type === listItem) {
          // should subtract '1' for considering tag length(<ul>)
          tr.delete($from.start(-2) - 1, $from.end(-1));
          dispatch!(tr);
          return true;
        }
      }
      return false;
    };
  }

  keymaps() {
    const split: Command = (state, dispatch) =>
      splitListItem(state.schema.nodes.listItem)(state, dispatch);

    return {
      Backspace: this.liftToPrevListItem(),
      Enter: split,
    };
  }
}
