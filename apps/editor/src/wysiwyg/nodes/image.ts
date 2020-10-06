import { DOMOutputSpec, Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';

import Node from '@/spec/node';

export class Image extends Node {
  get name() {
    return 'image';
  }

  get schema() {
    return {
      inline: true,
      attrs: {
        src: {},
        title: { default: null },
        alt: { default: null }
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs(dom: DOMOutputSpec) {
            return {
              title: (dom as HTMLElement).getAttribute('title'),
              alt: (dom as HTMLElement).getAttribute('alt')
            };
          }
        }
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        return ['img', attrs];
      }
    };
  }
}
