import { Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';

import NodeSchema from '@/spec/node';

export class CustomInline extends NodeSchema {
  get name() {
    return 'customInline';
  }

  get schema() {
    return {
      content: 'text*',
      inline: true,
      attrs: {
        info: { default: null },
      },
      group: 'inline',
      selectable: false,
      defining: true,
      parseDOM: [
        {
          tag: 'span[data-custom-info]',
          getAttrs(dom: Node | string) {
            const info = (dom as HTMLElement).getAttribute('data-custom-info');

            return { info };
          },
        },
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        return ['span', { 'data-custom-info': attrs.info || null }, 0];
      },
    };
  }
}
