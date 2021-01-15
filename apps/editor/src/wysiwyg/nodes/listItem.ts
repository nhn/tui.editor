import { Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';
import { Command } from 'prosemirror-commands';

import hasClass from 'tui-code-snippet/domUtil/hasClass';

import NodeSchema from '@/spec/node';

const TASK_CLASS_NAME = 'task-list-item';
const CHECKED_CLASS_NAME = 'checked';

export class ListItem extends NodeSchema {
  get name() {
    return 'listItem';
  }

  get defaultSchema() {
    return {
      content: '(paragraph | codeBlock | bulletList | orderedList)*',
      group: 'block',
      attrs: {
        task: { default: false },
        checked: { default: false },
        rawHTML: { default: null }
      },
      parseDOM: [
        {
          tag: 'li',
          getAttrs(dom: Node | string) {
            const task = hasClass(dom as HTMLElement, TASK_CLASS_NAME);
            const checked = task && hasClass(dom as HTMLElement, CHECKED_CLASS_NAME);

            return { task, checked };
          }
        }
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        const { task, checked } = attrs;

        if (!task) {
          return ['li', 0];
        }

        const classNames = [TASK_CLASS_NAME];

        if (checked) {
          classNames.push(CHECKED_CLASS_NAME);
        }

        return [
          attrs.rawHTML || 'li',
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
