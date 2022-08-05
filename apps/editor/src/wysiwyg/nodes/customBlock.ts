import { DOMOutputSpec, ProsemirrorNode } from 'prosemirror-model';
import { setBlockType } from 'prosemirror-commands';
import NodeSchema from '@/spec/node';
import { EditorCommand } from '@t/spec';

export class CustomBlock extends NodeSchema {
  get name() {
    return 'customBlock';
  }

  get schema() {
    return {
      content: 'text*',
      group: 'block',
      attrs: {
        info: { default: null },
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
          },
        },
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpec {
        return ['div', { 'data-custom-info': attrs.info || null }, 0];
      },
    };
  }

  commands(): EditorCommand {
    return (payload) => (state, dispatch) =>
      payload?.info
        ? setBlockType(state.schema.nodes.customBlock, payload)(state, dispatch)
        : false;
  }
}
