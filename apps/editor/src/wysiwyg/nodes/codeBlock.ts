import { Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';
import { setBlockType } from 'prosemirror-commands';

import NodeSchema from '@/spec/node';

import { EditorCommand } from '@t/spec';

export class CodeBlock extends NodeSchema {
  get name() {
    return 'codeBlock';
  }

  get defaultSchema() {
    return {
      content: 'text*',
      group: 'block',
      attrs: {
        class: { default: null },
        language: { default: null },
        rawHTML: { default: null }
      },
      code: true,
      defining: true,
      marks: '',
      parseDOM: [
        {
          tag: 'pre',
          getAttrs(dom: Node | string) {
            const className = (dom as HTMLElement).getAttribute('class');
            const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');

            return {
              class: className,
              language: className?.split('lang-'),
              ...(rawHTML && { rawHTML })
            };
          }
        }
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        return [
          attrs.rawHTML || 'pre',
          { class: attrs.class || null },
          ['code', { 'data-language': attrs.language || null }, 0]
        ];
      }
    };
  }

  commands(): EditorCommand {
    return () => (state, dispatch) => setBlockType(state.schema.nodes.codeBlock)(state, dispatch);
  }

  keymaps() {
    const codeCommand = this.commands()();

    return {
      'Shift-Mod-p': codeCommand,
      'Shift-Mod-P': codeCommand
    };
  }
}
