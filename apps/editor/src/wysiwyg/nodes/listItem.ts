import { DOMOutputSpec, Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';

import Node from '@/spec/node';

export class ListItem extends Node {
  get name() {
    return 'listItem';
  }

  get schema() {
    return {
      content: '(paragraph | codeBlock | bulletList | orderedList)*',
      group: 'block',
      attrs: {
        class: { default: null },
        task: { default: false },
        checked: { default: false }
      },
      defining: true,
      parseDOM: [
        {
          tag: 'li',
          getAttrs(dom: DOMOutputSpec) {
            return {
              class: (dom as HTMLElement).getAttribute('class'),
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
}
