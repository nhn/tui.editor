import { Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';

import Node from '@/spec/node';

export class SoftBreak extends Node {
  get name() {
    return 'softBreak';
  }

  get defaultSchema() {
    return {
      attrs: {
        htmlString: { default: null }
      },
      inline: true,
      group: 'inline',
      selectable: false,
      parseDOM: [{ tag: 'br' }],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        const { htmlString } = attrs;

        return [
          'br',
          {
            ...(htmlString && { 'data-pass': 'true' })
          }
        ];
      }
    };
  }
}
