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
        language: { default: null },
        rawHTML: { default: null },
      },
      code: true,
      defining: true,
      marks: '',
      parseDOM: [
        {
          tag: 'pre',
          preserveWhitespace: 'full' as const,
          getAttrs(dom: Node | string) {
            const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');
            const child = (dom as HTMLElement).firstElementChild;

            return {
              language: child?.getAttribute('data-language') || null,
              ...(rawHTML && { rawHTML }),
            };
          },
        },
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        return [attrs.rawHTML || 'pre', ['code', { 'data-language': attrs.language }, 0]];
      },
    };
  }

  commands(): EditorCommand {
    return () => (state, dispatch) => setBlockType(state.schema.nodes.codeBlock)(state, dispatch);
  }

  keymaps() {
    const codeCommand = this.commands()();

    return {
      'Shift-Mod-p': codeCommand,
      'Shift-Mod-P': codeCommand,
    };
  }
}
