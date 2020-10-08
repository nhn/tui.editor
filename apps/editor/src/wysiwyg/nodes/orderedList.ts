import { DOMOutputSpec, Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';

import { toList } from '@/commands/listCommands';

import { Context, EditorCommand } from '@t/spec';
import Node from '@/spec/node';

export class OrderedList extends Node {
  get name() {
    return 'orderedList';
  }

  get schema() {
    return {
      content: 'listItem+',
      group: 'block',
      attrs: { order: { default: 1 } },
      parseDOM: [
        {
          tag: 'ol',
          getAttrs(dom: DOMOutputSpec) {
            const start = (dom as HTMLElement).getAttribute('start');

            return {
              order: (dom as HTMLElement).hasAttribute('start') ? Number(start) : 1
            };
          }
        }
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        return [
          'ol',
          {
            start: attrs.order === 1 ? null : attrs.order
          },
          0
        ];
      }
    };
  }

  commands({ schema }: Context): EditorCommand {
    const listType = schema.nodes.orderedList;

    return () => toList(listType) as any;
  }
}
