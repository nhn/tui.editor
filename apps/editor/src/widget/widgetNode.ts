import Node from '@/spec/Node';
import { DOMOutputSpecArray } from 'prosemirror-model';

export class Widget extends Node {
  get name() {
    return 'widget';
  }

  get defaultSchema() {
    return {
      attrs: {
        node: {},
      },
      group: 'inline',
      inline: true,
      content: 'text*',
      selectable: false,
      atom: true,
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: 'tui-widget' }, 0];
      },
      parseDOM: [{ tag: 'span.tui-widget' }],
    };
  }
}
