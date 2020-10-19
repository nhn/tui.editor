import { Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';
import { Command } from 'prosemirror-commands';

import NodeSchema from '@/spec/node';

export class ListItem extends NodeSchema {
  get name() {
    return 'listItem';
  }

  get schema() {
    return {
      content: '(paragraph | codeBlock | bulletList | orderedList)*',
      group: 'block',
      attrs: {
        task: { default: false },
        checked: { default: false }
      },
      parseDOM: [
        {
          tag: 'li',
          getAttrs(dom: Node | string) {
            return {
              task: (dom as HTMLElement).hasAttribute('data-task'),
              checked: !!(dom as HTMLElement).getAttribute('data-task-checked')
            };
          }
        }
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        const { task, checked } = attrs;

        if (!task) {
          return ['li', 0];
        }

        const classNames = ['task-list-item'];

        if (checked) {
          classNames.push('checked');
        }

        return [
          'li',
          {
            class: classNames.join(' '),
            'data-task': task,
            'data-task-checked': checked
          },
          0
        ];
      }
    };
  }

  private addListItem(): Command {
    return (state, dispatch) => {
      const { $from, $to } = state.selection;
      const range = $from.blockRange($to);

      if (!range) {
        return false;
      }

      const { depth } = range;
      const node = $from.node(depth);

      const { listItem } = state.schema.nodes;
      let { tr } = state;

      if (node.type.name === this.name) {
        tr = tr.split($from.pos, 2, [
          { type: listItem, attrs: { task: node.attrs.task, checked: false } }
        ]);

        dispatch!(tr.scrollIntoView());

        return true;
      }

      return false;
    };
  }

  keymaps() {
    return {
      Enter: this.addListItem()
    };
  }
}
