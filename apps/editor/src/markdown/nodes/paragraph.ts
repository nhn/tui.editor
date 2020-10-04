import { DOMOutputSpecArray, ProsemirrorNode } from 'prosemirror-model';
import { cls } from '@/utils/dom';
import Node from '@/spec/node';

export class Paragraph extends Node {
  get name() {
    return 'paragraph';
  }

  get schema() {
    return {
      content: 'inline*',
      attrs: {
        className: { default: null }
      },
      group: 'block',
      parseDOM: [{ tag: 'div' }],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        if (attrs.className) {
          return ['div', { class: cls(attrs.className) }, 0];
        }
        return ['div', 0];
      }
    };
  }
}
