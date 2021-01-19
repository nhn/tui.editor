import { DOMOutputSpecArray, ProsemirrorNode } from 'prosemirror-model';
import NodeSchema from '@/spec/node';

export class CustomBlock extends NodeSchema {
  get name() {
    return 'customBlock';
  }

  get defaultSchema() {
    return {
      content: 'text*',
      group: 'block',
      attrs: {
        info: { default: null }
      },
      atom: true,
      code: true,
      defining: true,
      parseDOM: [
        {
          tag: 'div[data-custom-info]',
          getAttrs(dom: Node | string) {
            const info = (dom as HTMLElement).getAttribute('data-custom-info');

            return { info };
          }
        }
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        return ['div', { 'data-custom-info': attrs.info || null }, 0];
      }
    };
  }
}
