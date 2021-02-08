import Node from '@/spec/Node';
import { DOMOutputSpecArray, ProsemirrorNode } from 'prosemirror-model';

export class Widget extends Node {
  get name() {
    return 'widget';
  }

  get defaultSchema() {
    return {
      attrs: {
        id: {},
        node: {},
      },
      group: 'inline',
      inline: true,
      content: 'text*',
      selectable: false,
      atom: true,
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        return ['span', { class: 'tui-widget' }, attrs.node];
      },
      parseDOM: [{ tag: 'span.tui-widget' }],
    };
  }
}
